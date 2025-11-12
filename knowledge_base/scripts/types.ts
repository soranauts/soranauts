import { z } from 'zod';

// KB Source types
export const kbSourceSchema = z.enum(['wiki', 'update', 'article', 'glossary', 'iroha_docs', 'soramitsu', 'polkaswap_update', 'fearless_update', 'fearless_github', 'tonswap_site', 'tonswap_update', 'pdf', 'imported', 'meta', 'bck24']);

// Enhanced front-matter schema with provenance tracking
export const kbFrontmatterSchema = z.object({
  title: z.string(),
  publishDate: z.string().datetime(),
  updateDate: z.string().datetime().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/), // kebab-case unique, CJK-stable
  source: kbSourceSchema,
  source_url: z.string().url(),
  source_commit: z.string().optional(), // for git-sourced content
  canonical_url: z.string().url().optional(),
  lang: z.enum(['en','ja','zh']).optional(),
  detected_lang: z.string().optional(),
  lang_confidence: z.number().optional(),
  tags: z.array(z.string()).optional(),
  version: z.string().optional(),
  image_rights: z.enum(['Medium', 'SORA Official / Medium', 'Soramitsu', 'CC-BY-4.0', 'Proprietary']).optional(),
  content_sha256: z.string().length(64), // normalized MD text hash
  snapshot_id: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  retrieved_at: z.string().datetime().optional(),
  source_title: z.string().optional(), // For snippet relevance in retrieval
  embed_model: z.string().optional(),
  embed_dim: z.number().optional(),
  file_path: z.string().optional(),
  license_hint: z.string().optional(),
});

export type KBFrontmatter = z.infer<typeof kbFrontmatterSchema>;
export type KBSource = z.infer<typeof kbSourceSchema>;

// Chunk metadata (flat for Chroma, <16 keys)
export interface ChunkMetadata {
  source: string;
  source_url: string;
  snapshot_id: string;
  slug: string;
  chunk_start: number;
  chunk_end: number;
  token_start: number;
  token_end: number;
  token_count: number;
  lang?: string;
  content_sha256: string;
  canonical_url?: string;
  file_path?: string;
}

// Extended metadata in sidecar JSON
export interface ExtendedChunkMetadata {
  dedupe_key?: string;
  embed_model?: string;
  embed_dim?: number;
  source_title?: string;
  chunk_char_start?: number;
  chunk_char_end?: number;
  chunker_version?: string;
}

// Index manifest schema
export interface IndexManifest {
  kb_schema_version: string;
  collection: string;
  embed_model: string;
  embed_dim: number;
  distance: 'cosine' | 'euclidean' | 'dot';
  tokenizer: string;
  chunker_version: string;
  chunk_tokens: {
    target: number;
    overlap: number;
    min: number;
    max: number;
  };
  subset?: string;
  seed?: string;
  cache_hit_rate?: number;
  created_at: string;
  provider: string;
  provider_version: string;
  licenses?: Record<string, string>;
}

// Snapshot manifest schema
export interface SnapshotManifest {
  snapshot_id: string;
  created_at: string;
  kb_schema_version: string;
  embed_model: string;
  embed_dim: number;
  distance_metric: string;
  tokenizer: string;
  sources: {
    wiki?: {
      files: number;
      words: number;
      chunks: number;
      source_commit?: string;
    };
    iroha_docs?: {
      files: number;
      words: number;
      chunks: number;
      source_commit: string;
      docs_at_commit: string;
    };
    soramitsu_site?: {
      files: number;
      words: number;
      chunks: number;
    };
    ecosystem_updates?: {
      files: number;
      words: number;
      chunks: number;
    };
  };
  files: Array<{
    path: string;
    source_url: string;
    retrieved_at: string;
    source_commit?: string;
    content_sha256: string;
    canonical_url?: string;
    license_hint?: string;
  }>;
  robots_snapshot?: Record<string, {
    url: string;
    sha256: string;
    fetched_at: string;
  }>;
  licenses?: Record<string, string>;
}

// Backtest report schema
export interface BacktestReport {
  article_path: string;
  snapshot_id: string;
  claims: Array<{
    claim_id: string;
    text: string;
    label: 'supported' | 'conflicts' | 'insufficient';
    evidence: Array<{
      chunk_id: string;
      score: number;
      excerpt: string;
      chunk_url: string;
    }>;
    missing_queries?: string[];
    entity_diff?: string;
  }>;
  summary: {
    supported: number;
    conflicts: number;
    insufficient: number;
  };
  risk_score: number;
}

// Metrics schema
export interface Metrics {
  files_processed: number;
  files_skipped: number;
  chunks_written: number;
  chunks_created: number;
  chunks_updated: number;
  chunks_skipped: number;
  chunks_deleted: number;
  tokens_embedded: number;
  api_cost_estimate_usd: number;
  rate_limit_429_count: number;
  avg_rps: number;
  failure_count: number;
  cache_hits: number;
  cache_misses: number;
  cache_hit_rate: number;
  duration_ms: number;
  timestamp: string;
}

