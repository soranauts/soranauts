#!/usr/bin/env tsx
import { ChromaClient } from 'chromadb';
import { Command } from 'commander';
import Table from 'cli-table3';
import { env } from './env';
import { loadIndex, type Bm25Document } from './bm25';
import type { ChunkMetadata } from './types';

const program = new Command();

program
  .name('retrieve')
  .description('Retrieve and rank chunks from the knowledge base')
  .argument('<query>', 'Search query')
  .option('--asof <date>', 'ISO date to cap results by snapshot_id (YYYY-MM-DD)')
  .option('--snapshot-id <id>', 'Exact snapshot id (YYYY-MM-DD)')
  .option('--lang <lang>', 'Filter by language (en, ja, zh)', 'en')
  .option('--source <sources>', 'Filter by sources (comma-separated)', 'wiki,iroha_docs')
  .option('--include <fields>', 'Include metadata fields (comma-separated)')
  .option('--min-score <score>', 'Minimum similarity score', '0.2')
  .option('--limit <n>', 'Number of results', '8')
  .option('--span', 'Print chunk span (start..end)')
  .option('--hybrid', 'Use hybrid retrieval (vector + BM25)')
  .option('--alpha <alpha>', 'Hybrid blend weight (0=BM25 only, 1=vector only)', '0.65')
  .option('--fusion <method>', 'Fusion method: alpha (default) or rrf', 'alpha')
  .option('--json', 'Output as JSON')
  .option('--table', 'Output as formatted table (default)', true)
  .parse();

const options = program.opts();
const query = program.args[0];

async function main() {
  if (!query) {
    console.error('Error: query is required');
    program.help();
    process.exit(1);
  }
  
  console.log(`Query: "${query}"`);
  
  // Initialize ChromaDB (HTTP client)
  const chromaClient = new ChromaClient({
    path: env.CHROMA_URL,
  });
  
  let collection;
  try {
    collection = await chromaClient.getCollection({
      name: env.CHROMA_COLLECTION,
    });
  } catch (error) {
    console.error(`Error: Collection "${env.CHROMA_COLLECTION}" not found. Run ingest first.`);
    process.exit(1);
  }
  
  // Query the collection
  const limit = parseInt(options.limit, 10);
  const minScore = parseFloat(options.minScore);
  const alpha = parseFloat(options.alpha);
  const fusionMethod = options.fusion || 'alpha';
  const useHybrid = options.hybrid && env.BM25_ENABLED;
  
  // Vector search
  const vectorResults = await collection.query({
    queryTexts: [query],
    nResults: useHybrid ? limit * 3 : limit * 2, // Get more for hybrid fusion
  });
  
  let results: HybridResult[] = [];
  
  if (vectorResults.ids && vectorResults.ids[0] && vectorResults.ids[0].length > 0) {
    // Process vector results
    const vectorChunks = vectorResults.ids[0].map((id, idx) => {
      const distances = vectorResults.distances?.[0]?.[idx] ?? [];
      const distance = Array.isArray(distances) ? distances[0] : distances;
      const score = 1 - (distance ?? 1); // Convert distance to similarity
      
      const metadata = vectorResults.metadatas?.[0]?.[idx] as ChunkMetadata | undefined;
      const document = vectorResults.documents?.[0]?.[idx];
      
      return {
        id,
        score,
        text: document ?? '',
        metadata: metadata ?? {} as ChunkMetadata,
        vectorScore: score,
      };
    });
    
    if (useHybrid) {
      // BM25 search
      try {
        const bm25Index = await loadIndex();
        const bm25Results = bm25Index.search(query, { boost: { title: 3, h1: 2, body: 1 } });
        
        // Create map of file path -> best BM25 score
        const bm25Scores = new Map<string, number>();
        for (const result of bm25Results.slice(0, limit * 3)) {
          const filepath = result.id;
          const currentScore = bm25Scores.get(filepath) || 0;
          bm25Scores.set(filepath, Math.max(currentScore, result.score));
        }
        
        if (fusionMethod === 'rrf') {
          // Reciprocal Rank Fusion
          const rrfResults = reciprocalRankFusion(
            bm25Results.slice(0, limit * 2).map(r => ({ id: r.id, score: r.score })),
            vectorChunks.map(c => ({ id: c.id, score: c.vectorScore! }))
          );
          
          // Map RRF results back to full chunk data
          const vectorMap = new Map(vectorChunks.map(c => [c.id, c]));
          const bm25Map = new Map(bm25Results.map(r => [r.id, r]));
          
          results = rrfResults
            .slice(0, limit * 2)
            .map(rrf => {
              const vectorChunk = vectorMap.get(rrf.id);
              if (vectorChunk) {
                return {
                  ...vectorChunk,
                  score: rrf.score,
                };
              }
              // BM25-only result
              const bm25Result = bm25Map.get(rrf.id);
              if (bm25Result) {
                return {
                  id: `bm25:${bm25Result.id}`,
                  score: rrf.score,
                  text: bm25Result.body?.substring(0, 500) || '',
                  metadata: {
                    source: bm25Result.source || 'unknown',
                    source_url: bm25Result.source_url || '',
                    snapshot_id: bm25Result.snapshot_id || '',
                    slug: '',
                    chunk_start: 0,
                    chunk_end: 0,
                    token_start: 0,
                    token_end: 0,
                    token_count: 0,
                    content_sha256: '',
                    file_path: bm25Result.id,
                  } as ChunkMetadata,
                } as HybridResult;
              }
              return null;
            })
            .filter((r): r is HybridResult => r !== null);
        } else {
          // Alpha blending (default)
          // Normalize BM25 scores (0-1 range)
          const bm25ScoresArray = Array.from(bm25Scores.values());
          const bm25Min = bm25ScoresArray.length > 0 ? Math.min(...bm25ScoresArray) : 0;
          const bm25Max = bm25ScoresArray.length > 0 ? Math.max(...bm25ScoresArray, 1) : 1;
          
          // Fuse scores - match chunks to their source files
          const fused = new Map<string, HybridResult>();
          
          // Add vector results with BM25 fusion
          for (const chunk of vectorChunks) {
            const filepath = chunk.metadata.file_path || '';
            // Try to match by file path
            let bm25Score = 0;
            for (const [bmPath, score] of bm25Scores.entries()) {
              if (filepath.includes(bmPath) || bmPath.includes(filepath)) {
                bm25Score = score;
                break;
              }
            }
            
            const normalizedBm25 = normalizeScore(bm25Score, bm25Min, bm25Max);
            const finalScore = alpha * chunk.vectorScore! + (1 - alpha) * normalizedBm25;
            
            fused.set(chunk.id, {
              ...chunk,
              score: finalScore,
              bm25Score: normalizedBm25,
            });
          }
          
          // Add top BM25-only results that weren't in vector results
          for (const result of bm25Results.slice(0, limit)) {
            const filepath = result.id;
            const hasVectorMatch = Array.from(fused.values()).some(r => {
              const rPath = r.metadata.file_path || '';
              return filepath.includes(rPath) || rPath.includes(filepath);
            });
            
            if (!hasVectorMatch) {
              const normalizedBm25 = normalizeScore(result.score, bm25Min, bm25Max);
              fused.set(`bm25:${filepath}`, {
                id: `bm25:${filepath}`,
                score: (1 - alpha) * normalizedBm25,
                text: result.body?.substring(0, 500) || '',
                metadata: {
                  source: result.source || 'unknown',
                  source_url: result.source_url || '',
                  snapshot_id: result.snapshot_id || '',
                  slug: '',
                  chunk_start: 0,
                  chunk_end: 0,
                  token_start: 0,
                  token_end: 0,
                  token_count: 0,
                  content_sha256: '',
                  file_path: filepath,
                } as ChunkMetadata,
                bm25Score: normalizedBm25,
              });
            }
          }
          
          results = Array.from(fused.values());
        }
      } catch (error: any) {
        console.warn(`  ⚠ BM25 search failed: ${error.message}, using vector-only`);
        results = vectorChunks.map(chunk => ({
          ...chunk,
          score: chunk.vectorScore!,
        }));
      }
    } else {
      results = vectorChunks.map(chunk => ({
        ...chunk,
        score: chunk.vectorScore!,
      }));
    }
  }
  
  if (results.length === 0) {
    console.log('No results found.');
    return;
  }
  
  // Apply filters
  let filtered = results.filter(chunk => chunk.score >= minScore);
  
  // Filter by snapshot
  if (options.snapshotId) {
    filtered = filtered.filter(chunk => chunk.metadata.snapshot_id === options.snapshotId);
  } else if (options.asof) {
    const asofDate = options.asof;
    filtered = filtered.filter(chunk => chunk.metadata.snapshot_id <= asofDate);
  }
  
  // Filter by language
  if (options.lang) {
    filtered = filtered.filter(chunk => 
      !chunk.metadata.lang || chunk.metadata.lang === options.lang
    );
  }
  
  // Filter by source
  if (options.source) {
    const sources = options.source.split(',').map(s => s.trim());
    filtered = filtered.filter(chunk => sources.includes(chunk.metadata.source));
  }
  
  // Sort by score and limit
  filtered = filtered
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  if (filtered.length === 0) {
    console.log('No results after filtering.');
    return;
  }
  
  // Output results
  if (options.json) {
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }
  
  // Table output
  const includeFields = options.include?.split(',').map(f => f.trim()) || ['url', 'title'];
  const hasUrl = includeFields.includes('url') || includeFields.includes('source_url');
  const hasTitle = includeFields.includes('title') || includeFields.includes('source_title');
  
  const table = new Table({
    head: [
      'Score',
      ...(useHybrid ? ['V/B'] : []),
      'Source',
      ...(hasTitle ? ['Title'] : []),
      ...(hasUrl ? ['URL'] : []),
      ...(options.span ? ['Span'] : []),
      'Excerpt',
    ].filter(Boolean),
    colWidths: [8, ...(useHybrid ? [6] : []), 12, ...(hasTitle ? [20] : []), ...(hasUrl ? [30] : []), ...(options.span ? [15] : []), 50].filter(Boolean),
    wordWrap: true,
  });
  
  for (const chunk of filtered) {
    const score = chunk.score.toFixed(3);
    const scoreBreakdown = useHybrid && chunk.vectorScore !== undefined && chunk.bm25Score !== undefined
      ? `${chunk.vectorScore.toFixed(2)}/${chunk.bm25Score.toFixed(2)}`
      : '';
    const source = chunk.metadata.source || 'unknown';
    const title = (hasTitle && chunk.metadata.source_title) 
      ? chunk.metadata.source_title.substring(0, 50)
      : '';
    const url = (hasUrl && chunk.metadata.source_url)
      ? chunk.metadata.source_url.substring(0, 80)
      : '';
    const span = options.span
      ? `${chunk.metadata.token_start}-${chunk.metadata.token_end}`
      : '';
    const excerpt = chunk.text.substring(0, 200).replace(/\n/g, ' ');
    
    table.push([
      score,
      ...(useHybrid ? [scoreBreakdown] : []),
      source,
      ...(hasTitle ? [title] : []),
      ...(hasUrl ? [url] : []),
      ...(options.span ? [span] : []),
      excerpt,
    ]);
  }
  
  console.log(table.toString());
  console.log(`\nFound ${filtered.length} result(s)`);
  if (useHybrid) {
    if (fusionMethod === 'rrf') {
      console.log(`Hybrid fusion: RRF (Reciprocal Rank Fusion)`);
    } else {
      console.log(`Hybrid fusion: ${(alpha * 100).toFixed(0)}% vector + ${((1 - alpha) * 100).toFixed(0)}% BM25`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { main };

