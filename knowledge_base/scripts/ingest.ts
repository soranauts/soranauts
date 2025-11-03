#!/usr/bin/env tsx
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, dirname } from 'path';
import { createHash } from 'crypto';
import { glob as globAsync } from 'glob';
import matter from 'gray-matter';
import { ChromaClient } from 'chromadb';
import OpenAI from 'openai';
import pRetry from 'p-retry';
import { env } from './env';
import { normalizeForHash, hashContent, normalizeCJKWhitespace } from './utils/text-normalize';
import { chunkTokens, chunkTextByCharacters, type TokenChunk } from './utils/tokenizer';
import type { ChunkMetadata, ExtendedChunkMetadata, IndexManifest, Metrics } from './types';
import { KBFrontmatter } from './types';

const snapshotId = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

function sanitizeForEmbedding(text: unknown): string {
  if (typeof text !== 'string') {
    text = text == null ? '' : String(text);
  }
  if (!text) return '';
  return (text as string)
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
    .replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
    .trim();
}

interface FileMetadata {
  path: string;
  contentSha256: string;
  chunks: string[]; // chunk IDs
}

interface ProcessedFile {
  path: string;
  contentSha256: string;
  chunks: Array<{
    id: string;
    text: string;
    metadata: ChunkMetadata;
    extendedMetadata: ExtendedChunkMetadata;
  }>;
}

/**
 * Walk directory and find all .md/.mdx files
 */
async function findMarkdownFiles(rootDir: string): Promise<string[]> {
  const files: string[] = [];
  const patterns = ['**/*.md', '**/*.mdx'];
  
  for (const pattern of patterns) {
    const matches = await globAsync(pattern, {
      cwd: rootDir,
      absolute: true,
      ignore: ['**/node_modules/**', '**/.git/**', '**/index/**', '**/snapshots/**'],
    });
    files.push(...matches);
  }
  
  return [...new Set(files)]; // dedupe
}

/**
 * Extract front-matter and parse file
 */
function parseMarkdownFile(filepath: string, source: string): { frontmatter: Partial<KBFrontmatter>; content: string } {
  const content = readFileSync(filepath, 'utf-8');
  const parsed = matter(content);
  
  return {
    frontmatter: parsed.data as Partial<KBFrontmatter>,
    content: parsed.content,
  };
}

/**
 * Process a single file into chunks
 */
function processFile(
  filepath: string,
  source: string,
  embedModel: string,
  snapshotId: string
): ProcessedFile | null {
  try {
    const { frontmatter, content } = parseMarkdownFile(filepath, source);
    
    // Normalize content for hashing
    let normalized = normalizeForHash(content);
    normalized = normalizeCJKWhitespace(normalized);
    const contentSha256 = hashContent(normalized);
    
    // Get slug from frontmatter or generate from filename
    const slug = frontmatter.slug || 
      relative(env.KB_DIR, filepath)
        .replace(/\.(md|mdx)$/, '')
        .replace(/[^a-z0-9-]/gi, '-')
        .toLowerCase()
        .replace(/-+/g, '-');
    
    // Get source URL from frontmatter or construct from path
    const sourceUrl = frontmatter.source_url || `file://${filepath}`;
    
    // Chunk the content
    let tokenChunks: TokenChunk[];
    try {
      tokenChunks = chunkTokens(
        content,
        450, // target tokens
        0.15, // overlap
        env.MIN_CHUNK_TOKENS,
        env.MAX_CHUNK_TOKENS,
        embedModel
      );
    } catch (tokenError) {
      console.warn(`Tokenization failed for ${filepath}: ${tokenError instanceof Error ? tokenError.message : tokenError}`);
      tokenChunks = chunkTextByCharacters(
        content,
        450,
        0.15,
        env.MIN_CHUNK_TOKENS,
        env.MAX_CHUNK_TOKENS
      );
    }
    
    if (tokenChunks.length === 0) {
      return null; // Skip files with no valid chunks
    }
    
    // Create chunks with deterministic IDs
    const chunks = tokenChunks
      .map((tokenChunk) => {
        const cleanText = sanitizeForEmbedding(tokenChunk.text);
        const chunkId = `${snapshotId}::${slug}::${contentSha256}::chunk-${tokenChunk.start}-${tokenChunk.end}`;

        const metadata: ChunkMetadata = {
          source: source,
          source_url: sourceUrl,
          snapshot_id: snapshotId,
          slug: slug,
          chunk_start: tokenChunk.charStart,
          chunk_end: tokenChunk.charEnd,
          token_start: tokenChunk.start,
          token_end: tokenChunk.end,
          token_count: tokenChunk.end - tokenChunk.start,
          lang: frontmatter.lang,
          content_sha256: contentSha256,
          canonical_url: frontmatter.canonical_url,
          file_path: relative(env.KB_DIR, filepath),
        };

        const extendedMetadata: ExtendedChunkMetadata = {
          embed_model: embedModel,
          embed_dim: embedModel === 'text-embedding-3-large' ? 3072 : 1536,
          source_title: frontmatter.title || frontmatter.source_title,
          chunk_char_start: tokenChunk.charStart,
          chunk_char_end: tokenChunk.charEnd,
        };

        return {
          id: chunkId,
          text: cleanText,
          metadata,
          extendedMetadata,
        };
      })
      .filter(chunk => chunk.text.length > 0);
    
    return {
      path: filepath,
      contentSha256,
      chunks,
    };
  } catch (error) {
    console.error(`Error processing ${filepath}:`, error);
    return null;
  }
}

/**
 * Load existing file registry for tombstone handling
 */
function loadFileRegistry(indexDir: string): Map<string, FileMetadata> {
  const registryPath = join(indexDir, '.file_registry.json');
  if (!existsSync(registryPath)) {
    return new Map();
  }
  
  try {
    const data = JSON.parse(readFileSync(registryPath, 'utf-8'));
    return new Map(Object.entries(data));
  } catch {
    return new Map();
  }
}

/**
 * Save file registry
 */
function saveFileRegistry(indexDir: string, registry: Map<string, FileMetadata>): void {
  const registryPath = join(indexDir, '.file_registry.json');
  mkdirSync(dirname(registryPath), { recursive: true });
  
  const data = Object.fromEntries(registry);
  writeFileSync(registryPath, JSON.stringify(data, null, 2) + '\n');
}

/**
 * Create embeddings batch with retry
 */
async function createEmbeddings(
  openai: OpenAI,
  texts: string[],
  model: string,
  retries: number = 3
): Promise<number[][]> {
  return pRetry(
    async () => {
      const sanitizedInputs = texts.map(text => text ?? '').map(text => {
        if (typeof text !== 'string') {
          return String(text ?? '');
        }
        return text;
      });

      const response = await openai.embeddings.create({
        model: model,
        input: sanitizedInputs,
      });
      return response.data.map(item => item.embedding);
    },
    {
      retries,
      onFailedAttempt: (error) => {
        if (error.statusCode === 429) {
          // Rate limited - exponential backoff with jitter
          const delay = Math.min(1000 * Math.pow(2, error.attemptNumber) + Math.random() * 1000, 60000);
          console.warn(`Rate limited, retrying in ${Math.round(delay)}ms...`);
          return new Promise(resolve => setTimeout(resolve, delay));
        }
        throw error;
      },
    }
  );
}

/**
 * Main ingestion function
 */
async function main() {
  const startTime = Date.now();
  const metrics: Metrics = {
    files_processed: 0,
    files_skipped: 0,
    chunks_written: 0,
    chunks_deleted: 0,
    tokens_embedded: 0,
    api_cost_estimate_usd: 0,
    rate_limit_429_count: 0,
    avg_rps: 0,
    failure_count: 0,
    duration_ms: 0,
    timestamp: new Date().toISOString(),
  };
  
  console.log('Starting KB ingestion...');
  console.log(`Snapshot ID: ${snapshotId}`);
  console.log(`Embed model: ${env.EMBED_MODEL}`);
  
  // Initialize OpenAI
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
  }
  
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL,
  });
  
  // Ensure index directory exists (for local server volume mounts)
  mkdirSync(env.INDEX_DIR, { recursive: true });
  
  // Initialize ChromaDB (HTTP client)
  const chromaClient = new ChromaClient({
    path: env.CHROMA_URL,
  });
  
  // Get or create collection
  let collection;
  try {
    collection = await chromaClient.getCollection({
      name: env.CHROMA_COLLECTION,
    });
    console.log(`Using existing collection: ${env.CHROMA_COLLECTION}`);
  } catch {
    collection = await chromaClient.createCollection({
      name: env.CHROMA_COLLECTION,
      metadata: {
        embedding_model: env.EMBED_MODEL,
        tokenizer: env.TOKENIZER,
      },
    });
    console.log(`Created new collection: ${env.CHROMA_COLLECTION}`);
  }
  
  // Load file registry
  const fileRegistry = loadFileRegistry(env.INDEX_DIR);
  const processedFiles = new Map<string, ProcessedFile>();
  
  // Find all markdown files
  const sourceDirs = [
    { path: join(env.KB_DIR, 'iroha_docs'), source: 'iroha_docs' },
    { path: join(env.KB_DIR, 'wiki'), source: 'wiki' },
    { path: join(env.KB_DIR, 'soramitsu_site'), source: 'soramitsu' },
    { path: join(env.KB_DIR, 'ecosystem_updates'), source: 'update' },
    { path: join(env.KB_DIR, 'polkaswap_updates'), source: 'polkaswap_update' },
    { path: join(env.KB_DIR, 'fearless_updates'), source: 'fearless_update' },
    { path: join(env.KB_DIR, 'pdfs_md'), source: 'pdf' },
    { path: join(env.KB_DIR, 'imported'), source: 'imported' },
  ];
  
  for (const { path: sourceDir, source } of sourceDirs) {
    if (!existsSync(sourceDir)) {
      console.log(`Skipping ${source}: directory does not exist`);
      continue;
    }
    
    const files = await findMarkdownFiles(sourceDir);
    console.log(`Found ${files.length} files in ${source}`);
    
    for (const filepath of files) {
      const processed = processFile(filepath, source, env.EMBED_MODEL, snapshotId);
      if (processed) {
        const relPath = relative(env.KB_DIR, filepath);
        processedFiles.set(relPath, processed);
        metrics.files_processed++;
      } else {
        metrics.files_skipped++;
      }
    }
  }
  
  console.log(`\nProcessed ${processedFiles.size} files into chunks`);
  
  // Handle tombstone/deletion: find files that disappeared or changed
  const currentFiles = new Set(processedFiles.keys());
  const priorFiles = new Set(fileRegistry.keys());
  
  const deletedFiles = [...priorFiles].filter(f => !currentFiles.has(f));
  const changedFiles = [...currentFiles].filter(f => {
    const prior = fileRegistry.get(f);
    const current = processedFiles.get(f);
    return prior && prior.contentSha256 !== current!.contentSha256;
  });
  
  // Delete chunks for deleted/changed files
  const chunksToDelete: string[] = [];
  for (const filePath of [...deletedFiles, ...changedFiles]) {
    const prior = fileRegistry.get(filePath);
    if (prior) {
      chunksToDelete.push(...prior.chunks);
    }
  }
  
  if (chunksToDelete.length > 0) {
    console.log(`Deleting ${chunksToDelete.length} stale chunks...`);
    try {
      await collection.delete({ ids: chunksToDelete });
      metrics.chunks_deleted = chunksToDelete.length;
    } catch (error) {
      console.warn('Error deleting stale chunks:', error);
    }
  }
  
  // Prepare chunks for embedding
  const allChunks: ProcessedFile['chunks'] = [];
  for (const file of processedFiles.values()) {
    allChunks.push(...file.chunks);
  }
  
  console.log(`\nGenerating embeddings for ${allChunks.length} chunks...`);
  
  // Batch embeddings
  const batchSize = process.env.CI ? env.EMBED_BATCH_SIZE_CI : env.EMBED_BATCH_SIZE;
  const embeddings: number[][] = [];
  let batchCount = 0;
  
  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batch = allChunks.slice(i, i + batchSize);
    const batchTexts = batch.map(c => c.text);
    
    try {
      const batchEmbeddings = await createEmbeddings(
        openai,
        batchTexts,
        env.EMBED_MODEL
      );
      
      embeddings.push(...batchEmbeddings);
      
      // Calculate cost estimate (rough: $0.13 per 1M tokens for 3-large)
      const tokensInBatch = batch.reduce((sum, c) => sum + c.metadata.token_count, 0);
      metrics.tokens_embedded += tokensInBatch;
      const cost = (tokensInBatch / 1_000_000) * (env.EMBED_MODEL === 'text-embedding-3-large' ? 0.13 : 0.02);
      metrics.api_cost_estimate_usd += cost;
      
      batchCount++;
      if (batchCount % 10 === 0) {
        console.log(`  Processed ${Math.min(i + batchSize, allChunks.length)}/${allChunks.length} chunks...`);
      }
    } catch (error: any) {
      if (error.statusCode === 429) {
        metrics.rate_limit_429_count++;
      }
      metrics.failure_count++;
      console.error(`Error embedding batch ${i / batchSize + 1}:`, error.message);
      if (error.statusCode === 400) {
        console.error('First inputs in batch:', batchTexts.slice(0, 3).map(t => ({ length: t.length, preview: t.slice(0, 120) })));
      }
      throw error;
    }
  }
  
  console.log(`Generated ${embeddings.length} embeddings`);
  
  // Upsert to ChromaDB
  console.log('\nUpserting chunks to ChromaDB...');
  
  const ids = allChunks.map(c => c.id);
  const texts = allChunks.map(c => c.text);
  const metadatas = allChunks.map(c => c.metadata);
  
  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    const batchEmbeddings = embeddings.slice(i, i + batchSize);
    const batchTexts = texts.slice(i, i + batchSize);
    const batchMetas = metadatas.slice(i, i + batchSize) as any;

    await collection.upsert({
      ids: batchIds,
      embeddings: batchEmbeddings,
      documents: batchTexts,
      metadatas: batchMetas,
    });
  }
  
  metrics.chunks_written = allChunks.length;
  
  // Update file registry
  for (const [relPath, file] of processedFiles.entries()) {
    fileRegistry.set(relPath, {
      path: relPath,
      contentSha256: file.contentSha256,
      chunks: file.chunks.map(c => c.id),
    });
  }
  
  // Remove deleted files from registry
  for (const filePath of deletedFiles) {
    fileRegistry.delete(filePath);
  }
  
  saveFileRegistry(env.INDEX_DIR, fileRegistry);
  
  // Save extended metadata to sidecar files
  const metaDir = join(env.KB_DIR, 'scripts', '.meta');
  mkdirSync(metaDir, { recursive: true });
  for (const chunk of allChunks) {
    const safeBase = chunk.id.replace(/[^a-zA-Z0-9-]/g, '_').slice(0, 96);
    const hashSuffix = createHash('sha1').update(chunk.id).digest('hex').slice(0, 12);
    const fileName = `${safeBase}_${hashSuffix}.json`;
    const metaPath = join(metaDir, fileName);
    writeFileSync(metaPath, JSON.stringify(chunk.extendedMetadata, null, 2) + '\n');
  }
  
  // Generate index manifest
  const embedDim = env.EMBED_MODEL === 'text-embedding-3-large' ? 3072 : 1536;
  const manifest: IndexManifest = {
    kb_schema_version: '1.0.0',
    collection: env.CHROMA_COLLECTION,
    embed_model: env.EMBED_MODEL,
    embed_dim: embedDim,
    distance: 'cosine',
    tokenizer: env.TOKENIZER,
    chunk_tokens: {
      target: 450,
      overlap: 0.15,
      min: env.MIN_CHUNK_TOKENS,
      max: env.MAX_CHUNK_TOKENS,
    },
    created_at: new Date().toISOString(),
    provider: 'openai',
    provider_version: 'openai-2025-09-01',
  };
  
  mkdirSync(env.INDEX_DIR, { recursive: true });
  const manifestPath = join(env.INDEX_DIR, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  
  // Calculate final metrics
  metrics.duration_ms = Date.now() - startTime;
  metrics.avg_rps = metrics.tokens_embedded / (metrics.duration_ms / 1000);
  
  // Calculate counts
  const addedCount = metrics.chunks_written;
  const updatedCount = 0; // ChromaDB upsert handles this
  const unchangedCount = metrics.files_skipped;
  
  // Emit metrics summary table
  const { currentSnapshotId } = require('./utils/provenance');
  console.log('\n=== Ingestion Summary ===');
  console.table({
    documents: { value: metrics.files_processed + metrics.files_skipped },
    new: { value: addedCount },
    updated: { value: updatedCount },
    unchanged: { value: unchangedCount },
    snapshot: { value: currentSnapshotId() },
  });
  
  // Emit metrics as JSON
  console.log('\n=== Metrics ===');
  console.log(JSON.stringify(metrics, null, 2));
  
  console.log(`\n✓ Ingestion complete!`);
  console.log(`  Files: ${metrics.files_processed} processed, ${metrics.files_skipped} skipped`);
  console.log(`  Chunks: ${metrics.chunks_written} written, ${metrics.chunks_deleted} deleted`);
  console.log(`  Cost estimate: $${metrics.api_cost_estimate_usd.toFixed(4)}`);
  console.log(`  Duration: ${(metrics.duration_ms / 1000).toFixed(2)}s`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main };

