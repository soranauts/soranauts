import { z } from 'zod';

const envSchema = z.object({
  INDEXER_URL: z.string().url().default('http://localhost:8787/indexer'),
  DEX_API_URL: z.string().url().default('http://localhost:8787/dex'),
  SORA_WS_URL: z.string().url().default('wss://example.invalid'),
  KV_URL: z.string().url().default('http://localhost:8787/kv'),
  KV_TOKEN: z.string().default('dev'),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:4321'),
  TAG_HUB_V1: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default('false'),
  // Knowledge Base RAG configuration
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  EMBED_MODEL: z.enum(['text-embedding-3-large', 'text-embedding-3-small']).default('text-embedding-3-large'),
  TOKENIZER: z.enum(['tiktoken-cl100k']).default('tiktoken-cl100k'),
  KB_DIR: z.string().default('./knowledge_base'),
  INDEX_DIR: z.string().default('./knowledge_base/.kb_index'),
  USER_AGENT: z.string().default('SoranautsBot/1.0 (+https://soranauts.com)'),
  REQUEST_TIMEOUT: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('12000'),
  MEDIUM_FEED_URL: z.string().url().default('https://sora-xor.medium.com/feed'),
  POLKASWAP_FEED_URL: z.string().url().default('https://polkaswap.medium.com/feed'),
  FEARLESS_FEED_URL: z.string().url().default('https://fearlesswallet.medium.com/feed'),
  TONSWAP_FEED_URL: z.string().url().default('https://tonswap-org.medium.com/feed'),
  SORAMITSU_START_URLS: z.string().default('https://soramitsu.co.jp/,https://soramitsu.co.jp/iroha-cbdc-2025'),
  TONSWAP_START_URLS: z.string().default('https://tonswap.org/,https://tonswap.org/roadmap,https://tonswap.org/faq,https://tonswap.org/blog/introducing-tonswap,https://tonswap.org/blog/tonswap-dex-for-mass-adoption,https://tonswap.org/blog/ts-token,https://tonswap.org/blog/meowfi-by-tonswap,https://tonswap.org/blog/tonswap-defi-hub-mass-adoption'),
  CRAWL_DOMAINS: z.string().default('soramitsu.co.jp'),
  TONSWAP_CRAWL_DOMAINS: z.string().default('tonswap.org'),
  RESPECT_ROBOTS: z.string().transform((val) => val === 'true' || val === '').pipe(z.boolean()).default('true'),
  MAX_CONCURRENCY: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('4'),
  CRAWL_RPS_PER_HOST: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('2'),
  EMBED_BATCH_SIZE: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('64'),
  EMBED_BATCH_SIZE_CI: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('128'),
  EMBED_MAX_USD: z.string().transform((val) => parseFloat(val)).pipe(z.number()).default('5.0'),
  MIN_CHUNK_TOKENS: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('200'),
  MAX_CHUNK_TOKENS: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('2000'),
  PDF_ENABLED: z.string().transform((val) => val === 'true' || val === '').pipe(z.boolean()).default('true'),
  PDF_ALLOWLIST: z.string().default(''),
  IMAGE_STORE: z.enum(['git-lfs','s3','local']).default('git-lfs'),
  IMAGE_MAX_WIDTH: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('1920'),
  IMAGE_ASPECT: z.string().default('2:1'),
  RAG_STORE: z.enum(['chroma','qdrant','lancedb']).default('chroma'),
  CHROMA_COLLECTION: z.string().default('soranauts-kb'),
  CHROMA_URL: z.string().url().default('http://127.0.0.1:8000'),
  QDRANT_URL: z.string().url().optional(),
  QDRANT_API_KEY: z.string().optional(),
  BM25_ENABLED: z.string().transform((val) => val === 'true' || val === '').pipe(z.boolean()).default('true'),
  BM25_INDEX_DIR: z.string().default('./knowledge_base/.kb_index/bm25'),
  RETRIEVE_ASOF_DEFAULT: z.string().datetime().optional(),
  HTML_NORMALIZE: z.string().transform((val) => val === 'true' || val === '').pipe(z.boolean()).default('true'),
  DEDUPE_SIMHASH_THRESHOLD: z.string().transform((val) => parseInt(val, 10)).pipe(z.number()).default('8'),
  LOG_LEVEL: z.enum(['error','warn','info','debug']).default('info'),
  CI_WRITE_SARIF: z.string().transform((val) => val === 'true' || val === '').pipe(z.boolean()).default('true'),
  // Incremental ingestion & embedding cache
  KB_INCREMENTAL: z.string().transform((val) => val !== 'false').pipe(z.boolean()).default('true'),
  KB_EMBED_CACHE_DIR: z.string().default('./knowledge_base/.kb_index/.embedding_cache'),
  KB_DETERMINISM_NOCACHE: z.string().transform((val) => val === 'true').pipe(z.boolean()).default('false'),
  KB_SUBSET: z.string().default(''),
});

export const env = envSchema.parse(process.env);


