#!/usr/bin/env tsx
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, dirname } from 'path';
import { createHash } from 'crypto';
import { glob as globAsync } from 'glob';
import matter from 'gray-matter';
import { ChromaClient } from 'chromadb';
import OpenAI from 'openai';
import pRetry from 'p-retry';
import { Command } from 'commander';
import { env } from './env';
import { normalizeForHash, hashContent, normalizeCJKWhitespace } from './utils/text-normalize';
import { chunkTokens, chunkTextByCharacters, type TokenChunk } from './utils/tokenizer';
import type { ChunkMetadata, ExtendedChunkMetadata, IndexManifest, Metrics } from './types';
import { KBFrontmatter } from './types';

const snapshotId = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const CHUNKER_VERSION = '1.0.0'; // Stable version identifier for chunking algorithm

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
  bytesSha256: string; // Hash of raw file bytes for change detection
  chunks: string[]; // chunk IDs
}

interface ProcessedFile {
  path: string;
  contentSha256: string;
  bytesSha256: string;
  chunks: Array<{
    id: string;
    text: string;
    metadata: ChunkMetadata;
    extendedMetadata: ExtendedChunkMetadata;
    cacheKey: string; // contentSha256::embedModel::tokenizer
  }>;
}

/**
 * Walk directory and find all .md/.mdx files
 */
async function findMarkdownFiles(rootDir: string): Promise<string[]> {
  const files: string[] = [];
  const patterns = ['**/*.md', '**/*.mdx'];
  
  for (const pattern of patterns) {
    const ignore = [
      '**/node_modules/**', 
      '**/.git/**', 
      '**/index/**', 
      '**/snapshots/**',
      '**/fearless_github/android/**',
      '**/fearless_github/ios/**',
    ];
    const matches = await globAsync(pattern, {
      cwd: rootDir,
      absolute: true,
      ignore,
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
  snapshotId: string,
  tokenizer: string
): ProcessedFile | null {
  try {
    // Compute bytesSha256 from raw file bytes for change detection
    const rawBytes = readFileSync(filepath);
    const bytesSha256 = createHash('sha256').update(rawBytes).digest('hex');
    
    const { frontmatter, content } = parseMarkdownFile(filepath, source);
    
    // Normalize content for hashing (for contentSha256)
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
    
    // Create chunks with deterministic IDs: sha256(normalized_text)::startToken::len::chunker_version
    const chunks = tokenChunks
      .map((tokenChunk) => {
        const cleanText = sanitizeForEmbedding(tokenChunk.text);
        // Normalize chunk text for stable hashing
        const normalizedChunkText = normalizeForHash(cleanText);
        const chunkTextHash = hashContent(normalizedChunkText);
        const tokenLen = tokenChunk.end - tokenChunk.start;
        // Include slug hash in ID to ensure uniqueness across files with same content
        // Format: sha256(normalized_text)::slugHash::startToken::len::chunker_version
        const slugHash = hashContent(slug).substring(0, 8);
        const chunkId = `${chunkTextHash}::${slugHash}::${tokenChunk.start}::${tokenLen}::${CHUNKER_VERSION}`;

        const metadata: ChunkMetadata = {
          source: source,
          source_url: sourceUrl,
          snapshot_id: snapshotId, // Keep snapshotId in metadata only
          slug: slug,
          chunk_start: tokenChunk.charStart,
          chunk_end: tokenChunk.charEnd,
          token_start: tokenChunk.start,
          token_end: tokenChunk.end,
          token_count: tokenLen,
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
          chunker_version: CHUNKER_VERSION,
        };

        // Cache key: contentSha256::embedModel::tokenizer
        // Hash the exact text sent to the embedding API (cleanText)
        const chunkContentSha256 = hashContent(cleanText);
        const cacheKey = `${chunkContentSha256}::${embedModel}::${tokenizer}`;

        return {
          id: chunkId,
          text: cleanText,
          metadata,
          extendedMetadata,
          cacheKey,
        };
      })
      .filter(chunk => chunk.text.length > 0);
    
    return {
      path: filepath,
      contentSha256,
      bytesSha256,
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
 * Load embedding cache
 */
function loadEmbeddingCache(cacheDir: string): Map<string, number[]> {
  const cache = new Map<string, number[]>();
  if (!existsSync(cacheDir)) {
    return cache;
  }
  
  try {
    const files = readdirSync(cacheDir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const cachePath = join(cacheDir, file);
      try {
        const data = JSON.parse(readFileSync(cachePath, 'utf-8'));
        if (data.key && data.embedding && Array.isArray(data.embedding)) {
          cache.set(data.key, data.embedding);
        }
      } catch {
        // Skip invalid cache files
      }
    }
  } catch {
    // Cache directory read failed, return empty cache
  }
  
  return cache;
}

/**
 * Save embedding to cache
 */
function saveEmbeddingToCache(cacheDir: string, key: string, embedding: number[]): void {
  mkdirSync(cacheDir, { recursive: true });
  const hash = createHash('sha256').update(key).digest('hex').slice(0, 16);
  const cachePath = join(cacheDir, `${hash}.json`);
  writeFileSync(cachePath, JSON.stringify({ key, embedding }, null, 2) + '\n');
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
 * Normalize manifest for comparison (strip timestamps, durations, IDs, sort keys/arrays)
 */
function normalizeManifest(manifest: IndexManifest): any {
  const normalized: any = { ...manifest };
  delete normalized.created_at;
  // Sort object keys
  const sorted: any = {};
  Object.keys(normalized).sort().forEach(key => {
    sorted[key] = normalized[key];
  });
  return sorted;
}

/**
 * Main ingestion function
 */
async function main() {
  // Parse CLI arguments
  const program = new Command();
  program
    .option('--nocache', 'Bypass embedding cache (for determinism testing)')
    .parse();
  const options = program.opts();
  
  const useCache = env.KB_INCREMENTAL && !env.KB_DETERMINISM_NOCACHE && !options.nocache;
  const startTime = Date.now();
  const metrics: Metrics = {
    files_processed: 0,
    files_skipped: 0,
    chunks_written: 0,
    chunks_created: 0,
    chunks_updated: 0,
    chunks_skipped: 0,
    chunks_deleted: 0,
    tokens_embedded: 0,
    api_cost_estimate_usd: 0,
    rate_limit_429_count: 0,
    avg_rps: 0,
    failure_count: 0,
    cache_hits: 0,
    cache_misses: 0,
    cache_hit_rate: 0,
    duration_ms: 0,
    timestamp: new Date().toISOString(),
  };
  
  console.log('Starting KB ingestion...');
  console.log(`Snapshot ID: ${snapshotId}`);
  console.log(`Embed model: ${env.EMBED_MODEL}`);
  console.log(`Incremental: ${env.KB_INCREMENTAL}, Cache: ${useCache ? 'enabled' : 'disabled'}`);
  
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
  
  // Load embedding cache if enabled
  const embeddingCache = useCache ? loadEmbeddingCache(env.KB_EMBED_CACHE_DIR) : new Map<string, number[]>();
  if (useCache) {
    console.log(`Loaded ${embeddingCache.size} cached embeddings`);
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
    { path: join(env.KB_DIR, 'fearless_github'), source: 'fearless_github', excludeDirs: ['android', 'ios'] },
    { path: join(env.KB_DIR, 'tonswap_site'), source: 'tonswap_site' },
    { path: join(env.KB_DIR, 'tonswap_updates'), source: 'tonswap_update' },
    { path: join(env.KB_DIR, 'pdfs_md'), source: 'pdf' },
    { path: join(env.KB_DIR, 'imported'), source: 'imported' },
  ];
  
  // Process files (incremental: only process changed/new files if KB_INCREMENTAL is true)
  const filesToProcess: string[] = [];
  for (const { path: sourceDir, source } of sourceDirs) {
    if (!existsSync(sourceDir)) {
      console.log(`Skipping ${source}: directory does not exist`);
      continue;
    }
    
    const files = await findMarkdownFiles(sourceDir);
    console.log(`Found ${files.length} files in ${source}`);
    
    for (const filepath of files) {
      const relPath = relative(env.KB_DIR, filepath);
      const prior = fileRegistry.get(relPath);
      
      if (env.KB_INCREMENTAL && prior) {
        // Check if file changed using bytesSha256
        const rawBytes = readFileSync(filepath);
        const bytesSha256 = createHash('sha256').update(rawBytes).digest('hex');
        if (prior.bytesSha256 === bytesSha256) {
          // File unchanged - skip processing
          metrics.files_skipped++;
          continue;
        }
      }
      
      // File is new or changed - process it
      filesToProcess.push(filepath);
    }
  }
  
  console.log(`\nProcessing ${filesToProcess.length} files (${metrics.files_skipped} skipped as unchanged)...`);
  
  // Process files that need updating
  for (const filepath of filesToProcess) {
    const relPath = relative(env.KB_DIR, filepath);
    const source = sourceDirs.find(sd => filepath.startsWith(sd.path))?.source || 'unknown';
    const processed = processFile(filepath, source, env.EMBED_MODEL, snapshotId, env.TOKENIZER);
    if (processed) {
      processedFiles.set(relPath, processed);
      metrics.files_processed++;
    } else {
      metrics.files_skipped++;
    }
  }
  
  console.log(`Processed ${processedFiles.size} files into chunks`);
  
  // Handle tombstone/deletion: find files that disappeared
  const currentFiles = new Set([...processedFiles.keys(), ...Array.from(fileRegistry.keys()).filter(f => {
    // Keep files that were skipped (unchanged) in registry
    return !filesToProcess.some(fp => relative(env.KB_DIR, fp) === f);
  })]);
  const priorFiles = new Set(fileRegistry.keys());
  const deletedFiles = [...priorFiles].filter(f => !currentFiles.has(f));
  
  // Delete chunks for deleted files only
  const chunksToDelete: string[] = [];
  for (const filePath of deletedFiles) {
    const prior = fileRegistry.get(filePath);
    if (prior) {
      chunksToDelete.push(...prior.chunks);
    }
  }
  
  if (chunksToDelete.length > 0) {
    console.log(`Deleting ${chunksToDelete.length} stale chunks from deleted files...`);
    try {
      await collection.delete({ ids: chunksToDelete });
      metrics.chunks_deleted = chunksToDelete.length;
    } catch (error) {
      console.warn('Error deleting stale chunks:', error);
    }
  }
  
  // Collect chunks from processed files and unchanged files (for upsert)
  const chunksToEmbed: ProcessedFile['chunks'] = [];
  const chunksWithCachedEmbeddings: Array<{ chunk: ProcessedFile['chunks'][0]; embedding: number[] }> = [];
  
  // New/modified files: check cache for each chunk
  for (const file of processedFiles.values()) {
    for (const chunk of file.chunks) {
      if (useCache && embeddingCache.has(chunk.cacheKey)) {
        // Use cached embedding
        const cachedEmbedding = embeddingCache.get(chunk.cacheKey)!;
        chunksWithCachedEmbeddings.push({ chunk, embedding: cachedEmbedding });
        metrics.cache_hits++;
      } else {
        // Need to generate embedding
        chunksToEmbed.push(chunk);
        if (useCache) {
          metrics.cache_misses++;
        }
      }
    }
  }
  
  // Also collect chunks from unchanged files (need to upsert with existing embeddings from ChromaDB)
  // For unchanged files, we'll need to query ChromaDB for existing embeddings or reconstruct from cache
  // For now, we'll only upsert new/changed chunks
  
  console.log(`\nEmbedding ${chunksToEmbed.length} chunks (${metrics.cache_hits} from cache, ${metrics.cache_misses} new)...`);
  
  // Generate embeddings for chunks not in cache
  const batchSize = process.env.CI ? env.EMBED_BATCH_SIZE_CI : env.EMBED_BATCH_SIZE;
  const embeddings: number[][] = [];
  let batchCount = 0;
  
  for (let i = 0; i < chunksToEmbed.length; i += batchSize) {
    const batch = chunksToEmbed.slice(i, i + batchSize);
    const batchTexts = batch.map(c => c.text);
    
    try {
      const batchEmbeddings = await createEmbeddings(
        openai,
        batchTexts,
        env.EMBED_MODEL
      );
      
      embeddings.push(...batchEmbeddings);
      
      // Save to cache
      if (useCache) {
        for (let j = 0; j < batch.length; j++) {
          saveEmbeddingToCache(env.KB_EMBED_CACHE_DIR, batch[j].cacheKey, batchEmbeddings[j]);
        }
      }
      
      // Calculate cost estimate (rough: $0.13 per 1M tokens for 3-large)
      const tokensInBatch = batch.reduce((sum, c) => sum + c.metadata.token_count, 0);
      metrics.tokens_embedded += tokensInBatch;
      const cost = (tokensInBatch / 1_000_000) * (env.EMBED_MODEL === 'text-embedding-3-large' ? 0.13 : 0.02);
      metrics.api_cost_estimate_usd += cost;
      
      batchCount++;
      if (batchCount % 10 === 0) {
        console.log(`  Processed ${Math.min(i + batchSize, chunksToEmbed.length)}/${chunksToEmbed.length} chunks...`);
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
  
  // Combine cached and new embeddings
  const allChunks: ProcessedFile['chunks'] = [];
  const allEmbeddings: number[][] = [];
  
  // Add chunks with cached embeddings
  for (const { chunk, embedding } of chunksWithCachedEmbeddings) {
    allChunks.push(chunk);
    allEmbeddings.push(embedding);
  }
  
  // Add newly embedded chunks
  for (let i = 0; i < chunksToEmbed.length; i++) {
    allChunks.push(chunksToEmbed[i]);
    allEmbeddings.push(embeddings[i]);
  }
  
  // Calculate cache hit rate
  const totalChunks = allChunks.length;
  metrics.cache_hit_rate = totalChunks > 0 ? (metrics.cache_hits / totalChunks) * 100 : 0;
  metrics.chunks_created = chunksToEmbed.length;
  metrics.chunks_skipped = metrics.cache_hits;
  metrics.chunks_updated = 0; // ChromaDB upsert handles updates
  
  console.log(`Total chunks to upsert: ${allChunks.length} (${metrics.cache_hits} from cache, ${metrics.chunks_created} new)`);
  
  // Upsert to ChromaDB
  console.log('\nUpserting chunks to ChromaDB...');
  
  const ids = allChunks.map(c => c.id);
  const texts = allChunks.map(c => c.text);
  const metadatas = allChunks.map(c => c.metadata);
  
  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    const batchEmbeddings = allEmbeddings.slice(i, i + batchSize);
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
  
  // Update file registry (include bytesSha256 for change detection)
  for (const [relPath, file] of processedFiles.entries()) {
    fileRegistry.set(relPath, {
      path: relPath,
      contentSha256: file.contentSha256,
      bytesSha256: file.bytesSha256,
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
    chunker_version: CHUNKER_VERSION,
    chunk_tokens: {
      target: 450,
      overlap: 0.15,
      min: env.MIN_CHUNK_TOKENS,
      max: env.MAX_CHUNK_TOKENS,
    },
    subset: env.KB_SUBSET || undefined,
    seed: undefined, // Can be set for deterministic testing
    cache_hit_rate: metrics.cache_hit_rate,
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
  
  // Emit metrics summary table
  const { currentSnapshotId } = require('./utils/provenance');
  console.log('\n=== Ingestion Summary ===');
  console.table({
    documents: { value: metrics.files_processed + metrics.files_skipped },
    files_processed: { value: metrics.files_processed },
    files_skipped: { value: metrics.files_skipped },
    chunks_created: { value: metrics.chunks_created },
    chunks_skipped: { value: metrics.chunks_skipped },
    chunks_deleted: { value: metrics.chunks_deleted },
    cache_hit_rate: { value: `${metrics.cache_hit_rate.toFixed(1)}%` },
    snapshot: { value: currentSnapshotId() },
  });
  
  // Emit metrics as JSON
  console.log('\n=== Metrics ===');
  console.log(JSON.stringify(metrics, null, 2));
  
  console.log(`\n✓ Ingestion complete!`);
  console.log(`  Files: ${metrics.files_processed} processed, ${metrics.files_skipped} skipped`);
  console.log(`  Chunks: ${metrics.chunks_written} written (${metrics.chunks_created} new, ${metrics.chunks_skipped} from cache), ${metrics.chunks_deleted} deleted`);
  console.log(`  Cache: ${metrics.cache_hits} hits, ${metrics.cache_misses} misses (${metrics.cache_hit_rate.toFixed(1)}% hit rate)`);
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

