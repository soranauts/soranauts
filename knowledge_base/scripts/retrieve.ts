import { ChromaClient } from 'chromadb';
import Table from 'cli-table3';
import { env } from './env';
import { loadIndex, type Bm25Document } from './bm25';
import type { ChunkMetadata } from './types';
import { getAuthorityMultiplier } from './utils/authority';

interface HybridResult {
  id: string;
  score: number;
  text: string;
  metadata: ChunkMetadata;
  vectorScore?: number;
  bm25Score?: number;
}

function normalizeScore(score: number, min: number, max: number): number {
  if (max === min) return 0;
  return (score - min) / (max - min);
}

function reciprocalRankFusion(
  results1: { id: string; score: number }[],
  results2: { id: string; score: number }[],
  k: number = 60
): { id: string; score: number }[] {
  const scores = new Map<string, number>();
  
  for (let i = 0; i < results1.length; i++) {
    const id = results1[i].id;
    scores.set(id, (scores.get(id) || 0) + 1 / (k + i + 1));
  }
  
  for (let i = 0; i < results2.length; i++) {
    const id = results2[i].id;
    scores.set(id, (scores.get(id) || 0) + 1 / (k + i + 1));
  }
  
  return Array.from(scores.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);
}

interface CliOptions {
  query: string;
  asof?: string;
  snapshotId?: string;
  lang: string;
  source: string;
  include?: string;
  minScore: number;
  limit: number;
  span: boolean;
  hybrid: boolean;
  alpha: number;
  fusion: 'alpha' | 'rrf';
  json: boolean;
  table: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    query: '',
    lang: 'en',
    source: 'wiki,iroha_docs',
    minScore: 0.2,
    limit: 8,
    span: false,
    hybrid: false,
    alpha: 0.65,
    fusion: 'alpha',
    json: false,
    table: true,
  };

  let i = 0;
  while (i < argv.length) {
    const token = argv[i];
    if (token === '--') {
      i += 1;
      continue;
    }

    if (token.startsWith('--')) {
      switch (token) {
        case '--asof':
          options.asof = argv[++i];
          break;
        case '--snapshot-id':
          options.snapshotId = argv[++i];
          break;
        case '--lang':
          options.lang = argv[++i];
          break;
        case '--source':
          options.source = argv[++i];
          break;
        case '--include':
          options.include = argv[++i];
          break;
        case '--min-score':
          options.minScore = parseFloat(argv[++i]);
          break;
        case '--limit':
          options.limit = parseInt(argv[++i], 10);
          break;
        case '--span':
          options.span = true;
          break;
        case '--hybrid':
          options.hybrid = true;
          break;
        case '--alpha':
          options.alpha = parseFloat(argv[++i]);
          break;
        case '--fusion':
          options.fusion = (argv[++i] as CliOptions['fusion']) || 'alpha';
          break;
        case '--json':
          options.json = true;
          options.table = false;
          break;
        case '--table':
          options.table = true;
          break;
        default:
          throw new Error(`Unknown option: ${token}`);
      }
    } else {
      if (options.query) {
        options.query += ' ' + token;
      } else {
        options.query = token;
      }
    }
    i += 1;
  }

  if (!options.query) {
    throw new Error('Query is required. Usage: kb:retrieve "<query>" [options]');
  }

  if (!Number.isFinite(options.limit) || options.limit <= 0) {
    options.limit = 8;
  }

  if (!Number.isFinite(options.minScore)) {
    options.minScore = 0.2;
  }

  if (!Number.isFinite(options.alpha) || options.alpha < 0 || options.alpha > 1) {
    options.alpha = 0.65;
  }

  if (options.fusion !== 'alpha' && options.fusion !== 'rrf') {
    options.fusion = 'alpha';
  }

  return options;
}

async function main() {
  let options: CliOptions;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
    return;
  }

  const {
    query,
    asof,
    snapshotId,
    lang,
    source,
    include,
    minScore,
    limit,
    span,
    hybrid,
    alpha,
    fusion,
    json,
    table,
  } = options;

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
  
  // Query the collection - parse options with defaults
  const limitValue = limit;
  const minScoreValue = minScore;
  const alphaValue = alpha;
  const fusionMethod = fusion;
  const sourcesValue = source;
  const langValue = lang;
  const useHybrid = hybrid && env.BM25_ENABLED;
  
  // Vector search
  const vectorResults = await collection.query({
    queryTexts: [query],
    nResults: useHybrid ? limitValue * 3 : limitValue * 2, // Get more for hybrid fusion
  });
  
  let results: HybridResult[] = [];
  
  if (vectorResults.ids && vectorResults.ids[0] && vectorResults.ids[0].length > 0) {
    // Process vector results
    const vectorChunks = vectorResults.ids[0].map((id, idx) => {
      const distances = vectorResults.distances?.[0]?.[idx] ?? [];
      const distance = Array.isArray(distances) ? distances[0] : distances;
      const baseScore = 1 - (distance ?? 1); // Convert distance to similarity
      
      const metadata = vectorResults.metadatas?.[0]?.[idx] as ChunkMetadata | undefined;
      const document = vectorResults.documents?.[0]?.[idx];
      
      // Apply authority multiplier to vector score
      const authority = metadata?.authority;
      const authorityMultiplier = getAuthorityMultiplier(authority);
      const score = baseScore * authorityMultiplier;
      
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
        
        // Create map of file path -> best BM25 score (with authority multiplier applied)
        const bm25Scores = new Map<string, number>();
        for (const result of bm25Results.slice(0, limitValue * 3)) {
          const filepath = result.id;
          // Apply authority multiplier to BM25 score
          const authority = (result as any).authority;
          const authorityMultiplier = getAuthorityMultiplier(authority);
          const adjustedScore = result.score * authorityMultiplier;
          const currentScore = bm25Scores.get(filepath) || 0;
          bm25Scores.set(filepath, Math.max(currentScore, adjustedScore));
        }
        
        if (fusionMethod === 'rrf') {
          // Reciprocal Rank Fusion
          // Apply authority multipliers before RRF
          const bm25WithAuthority = bm25Results.slice(0, limitValue * 2).map(r => {
            const authority = (r as any).authority;
            const multiplier = getAuthorityMultiplier(authority);
            return { id: r.id, score: r.score * multiplier };
          });
          const vectorWithAuthority = vectorChunks.map(c => ({ id: c.id, score: c.vectorScore! }));
          
          const rrfResults = reciprocalRankFusion(bm25WithAuthority, vectorWithAuthority);
          
          // Map RRF results back to full chunk data
          const vectorMap = new Map(vectorChunks.map(c => [c.id, c]));
          const bm25Map = new Map(bm25Results.map(r => [r.id, r]));
          
          results = rrfResults
            .slice(0, limitValue * 2)
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
            // Authority multipliers already applied to vectorScore in vectorChunks mapping
            // Apply authority multiplier to normalized BM25 score as well
            const chunkAuthority = chunk.metadata?.authority;
            const authorityMultiplier = getAuthorityMultiplier(chunkAuthority);
            const adjustedBm25 = normalizedBm25 * authorityMultiplier;
            const finalScore = alphaValue * chunk.vectorScore! + (1 - alphaValue) * adjustedBm25;
            
            fused.set(chunk.id, {
              ...chunk,
              score: finalScore,
              bm25Score: adjustedBm25,
            });
          }
          
          // Add top BM25-only results that weren't in vector results
          for (const result of bm25Results.slice(0, limitValue)) {
            const filepath = result.id;
            const hasVectorMatch = Array.from(fused.values()).some(r => {
              const rPath = r.metadata.file_path || '';
              return filepath.includes(rPath) || rPath.includes(filepath);
            });
            
            if (!hasVectorMatch) {
              const normalizedBm25 = normalizeScore(result.score, bm25Min, bm25Max);
              // Apply authority multiplier to BM25-only results
              const authority = (result as any).authority;
              const authorityMultiplier = getAuthorityMultiplier(authority);
              const adjustedBm25 = normalizedBm25 * authorityMultiplier;
              fused.set(`bm25:${filepath}`, {
                id: `bm25:${filepath}`,
                score: (1 - alphaValue) * adjustedBm25,
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
                  authority: authority,
                } as ChunkMetadata,
                bm25Score: adjustedBm25,
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
  let filtered = results.filter(chunk => chunk.score >= minScoreValue);
  
  // Filter by snapshot
  if (snapshotId) {
    filtered = filtered.filter(chunk => chunk.metadata.snapshot_id === snapshotId);
  } else if (asof) {
    const asofDate = asof;
    filtered = filtered.filter(chunk => chunk.metadata.snapshot_id <= asofDate);
  }
  
  // Filter by language
  if (langValue) {
    filtered = filtered.filter(chunk => 
      !chunk.metadata.lang || chunk.metadata.lang === langValue
    );
  }
  
  // Filter by source
  if (sourcesValue) {
    const sourceList = sourcesValue.split(',').map(s => s.trim());
    filtered = filtered.filter(chunk => sourceList.includes(chunk.metadata.source));
  }
  
  // Sort by score and limit
  filtered = filtered
    .sort((a, b) => b.score - a.score)
    .slice(0, limitValue);
  
  if (filtered.length === 0) {
    console.log('No results after filtering.');
    return;
  }
  
  // Output results
  if (json) {
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }
  
  // Table output
  const includeFields = include?.split(',').map(f => f.trim()) || ['url', 'title'];
  const hasUrl = includeFields.includes('url') || includeFields.includes('source_url');
  const hasTitle = includeFields.includes('title') || includeFields.includes('source_title');
  
  if (!table) {
    return;
  }

  const tableOutput = new Table({
    head: [
      'Score',
      ...(useHybrid ? ['V/B'] : []),
      'Source',
      ...(hasTitle ? ['Title'] : []),
      ...(hasUrl ? ['URL'] : []),
      ...(span ? ['Span'] : []),
      'Excerpt',
    ].filter(Boolean),
    colWidths: [8, ...(useHybrid ? [6] : []), 12, ...(hasTitle ? [20] : []), ...(hasUrl ? [30] : []), ...(span ? [15] : []), 50].filter(Boolean),
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
    const spanValue = span
      ? `${chunk.metadata.token_start}-${chunk.metadata.token_end}`
      : '';
    const excerpt = chunk.text.substring(0, 200).replace(/\n/g, ' ');
    
    tableOutput.push([
      score,
      ...(useHybrid ? [scoreBreakdown] : []),
      source,
      ...(hasTitle ? [title] : []),
      ...(hasUrl ? [url] : []),
      ...(span ? [spanValue] : []),
      excerpt,
    ]);
  }
  
  console.log(tableOutput.toString());
  console.log(`\nFound ${filtered.length} result(s)`);
  if (useHybrid) {
    if (fusionMethod === 'rrf') {
      console.log(`Hybrid fusion: RRF (Reciprocal Rank Fusion)`);
    } else {
      console.log(`Hybrid fusion: ${(alphaValue * 100).toFixed(0)}% vector + ${((1 - alphaValue) * 100).toFixed(0)}% BM25`);
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

