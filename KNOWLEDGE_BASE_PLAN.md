# Soranauts RAG Knowledge Base — Production Implementation Plan

## Overview
Build a TypeScript-based RAG pipeline that indexes SORA wiki, Medium ecosystem posts, Hyperledger Iroha 2 docs, and SORAMITSU site pages. The system includes image storage optimization, snapshot provenance tracking, robots.txt compliance, deterministic chunking, hybrid retrieval (vector + BM25), and claim-based backtesting with SARIF output for PR annotations.

## Repository Structure

```
/knowledge_base/
  /wiki/                      # Cloned from sora-xor/sora-docs
  /iroha_docs/                # Cloned from hyperledger/iroha-2-docs
  /soramitsu_site/            # Scraped HTML → MD + image references
    /images/                  # Git LFS or bucket references
  /ecosystem_updates/         # Medium posts as MD + image references
    /images/                  # Git LFS or bucket references
  /articles/                  # Optional: reference to apps/web/src/content/post
  /glossary/                  # Optional: glossary terms (no manual links)
  /snapshots/                 # Dated frozen copies (YYYY-MM-DD/)
    /YYYY-MM-DD/
      /manifest.json          # Provenance metadata per file
  /scripts/                   # TypeScript ingestion scripts
    - ingest.ts               # Build embeddings with ChromaDB
    - retrieve.ts             # Hybrid retrieval (vector + BM25)
    - backtest.ts             # Claim-based article validation
    - medium_import.ts        # RSS → MD converter
    - iroha_docs_sync.ts      # Git clone/pull handler
    - soramitsu_scrape.ts     # HTML scraper → MD
    - image_wide_hero.ts      # Normalize hero images (2:1 aspect)
    /.state/                  # State files (.gitignored)
      - .medium_state.json
      - .soramitsu_state.json
    /do-not-ingest.json       # URL patterns to skip
    /.meta/                   # Sidecar JSON for extended metadata
  /index/                     # ChromaDB vector store (.gitignored)
    /manifest.json            # Collection schema, embedding dims, distance metric
    /bm25/                    # BM25 index files
    /export.jsonl             # Disaster recovery export
  /assets/                    # Image storage (Git LFS if local)
  /docs/                      # Documentation
    - kb.md                   # KB system documentation
```

## Technology Stack

**Language**: TypeScript (tsx runner)
**Vector DB**: Chroma JS (`chromadb` npm) — default local; switchable to Qdrant/LanceDB via env
**Embeddings**: OpenAI `text-embedding-3-large` (default) or `text-embedding-3-small` (cost-sensitive)
**Tokenization**: `tiktoken` (cl100k_base) — token-true chunk boundaries with accurate offsets
**Hybrid Retrieval**: `minisearch` or `@orama/orama` for BM25 (vector + lexical fusion)
**HTTP Client**: `got` (with retry/backoff) + `p-queue` per-host token bucket + circuit breaker
**HTML Parsing**: `cheerio` (with sanitization whitelist, stable normalization)
**Markdown**: `turndown` or `node-html-markdown` (with deterministic attribute stripping)
**RSS**: `rss-parser`
**Robots/Sitemap**: `robots-txt-parse` (or `robots-parser`), `sitemapper`
**PDF**: `pdf-parse` (text) with allowlist gating + extraction_quality flag
**Deduplication**: `simhash` (near-duplicate detection pre-chunk)
**Language Detection**: `franc` or `fastText` (CJK-aware)
**Image Processing**: `sharp` (EXIF autorotate, resize with fit:cover to 2:1, letterbox fallback) + `blockhash-core` (perceptual hash)
**Git Operations**: `execa` or `simple-git`
**File Operations**: Native `fs` with `gray-matter` for front-matter
**Text Chunking**: Custom tokenizer-aware splitter using tiktoken with token_start/token_end offsets
**Validation**: Zod
**CLI Tables**: `cli-table3` for formatted output
**Retry Logic**: `p-retry` with jittered exponential backoff

## Environment Variables

Extend `apps/web/src/server/env.ts` or create `knowledge_base/scripts/env.ts`:

```typescript
const envSchema = z.object({
  // ... existing fields ...
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_BASE_URL: z.string().url().optional(),
  EMBED_MODEL: z.enum(['text-embedding-3-large', 'text-embedding-3-small']).default('text-embedding-3-large'),
  TOKENIZER: z.enum(['tiktoken-cl100k']).default('tiktoken-cl100k'),
  KB_DIR: z.string().default('./knowledge_base'),
  INDEX_DIR: z.string().default('./knowledge_base/index'),
  USER_AGENT: z.string().default('SoranautsBot/1.0 (+https://soranauts.com)'),
  REQUEST_TIMEOUT: z.number().default(12000),
  MEDIUM_FEED_URL: z.string().url().default('https://sora-xor.medium.com/feed'),
  SORAMITSU_START_URLS: z.string().default('https://soramitsu.co.jp/,https://soramitsu.co.jp/iroha-cbdc-2025'),
  CRAWL_DOMAINS: z.string().default('soramitsu.co,soramitsu.co.jp'),
  RESPECT_ROBOTS: z.boolean().default(true),
  MAX_CONCURRENCY: z.number().default(4),
  CRAWL_RPS_PER_HOST: z.number().default(2),
  EMBED_BATCH_SIZE: z.number().default(256),
  EMBED_BATCH_SIZE_CI: z.number().default(128),
  EMBED_MAX_USD: z.number().default(5.0),
  MIN_CHUNK_TOKENS: z.number().default(200),
  MAX_CHUNK_TOKENS: z.number().default(2000),
  PDF_ENABLED: z.boolean().default(true),
  PDF_ALLOWLIST: z.string().default(''),
  IMAGE_STORE: z.enum(['git-lfs','s3','local']).default('git-lfs'),
  IMAGE_MAX_WIDTH: z.number().default(1920),
  IMAGE_ASPECT: z.string().default('2:1'),
  RAG_STORE: z.enum(['chroma','qdrant','lancedb']).default('chroma'),
  CHROMA_COLLECTION: z.string().default('soranauts-kb'),
  QDRANT_URL: z.string().url().optional(),
  QDRANT_API_KEY: z.string().optional(),
  BM25_ENABLED: z.boolean().default(true),
  BM25_INDEX_DIR: z.string().default('./knowledge_base/index/bm25'),
  RETRIEVE_ASOF_DEFAULT: z.string().datetime().optional(),
  HTML_NORMALIZE: z.boolean().default(true),
  DEDUPE_SIMHASH_THRESHOLD: z.number().default(8),
  LOG_LEVEL: z.enum(['error','warn','info','debug']).default('info'),
  CI_WRITE_SARIF: z.boolean().default(true),
});
```

## Front-Matter Schema

Enhanced schema with provenance tracking (dates as serialized strings):

```typescript
const kbSourceSchema = z.enum(['wiki', 'update', 'article', 'glossary', 'iroha_docs', 'soramitsu']);

const kbFrontmatterSchema = z.object({
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
```

## Core Scripts

### 1. `ingest.ts` — Build Embeddings

**Key Features**:
- Walk `KB_DIR` for `.md`/`.mdx` files
- **Deterministic text normalization** for hashing:
  - Strip front-matter
  - Normalize newlines to `\n` (CRLF→LF)
  - Collapse 2+ spaces to single space
  - Trim
  - Replace multi-blank lines with single blank line
  - Convert smart quotes → ASCII (`""` → `"`, `''` → `'`)
  - Normalize CJK whitespace
- **Near-duplicate suppression**: Compute SimHash/MinHash over normalized doc text; if Hamming distance < threshold vs existing canonical, skip or down-weight; store `dedupe_key` in metadata
- **Token-true chunking**: Use `tiktoken` with `encoding_for_model('text-embedding-3-large')` for accurate token counting
  - Aim for 350–550 tokens per chunk (target: 450)
  - ~15% overlap ratio
  - Enforce min/max (200–2000 tokens) after tokenization, not char counts
  - Store both `token_start`/`token_end` and `char_start`/`char_end` offsets
- **Deterministic chunk IDs**: `<snapshot_id>::<slug>::<content_sha256>::chunk-<tokStart>-<tokEnd>`
- **Tombstone & deletion handling**: 
  - Maintain file → [chunk_id] registry
  - On re-run, if file disappears or `content_sha256` changed, delete prior chunks by `file_path` and/or `content_sha256`
  - Build `current_chunks` from new hash; fetch `prior_chunk_ids` by file_path
  - `deleteMany(prior - current)`; `upsertMany(current - prior)`
- Batch embeddings (128 in CI, 256–512 locally) with `p-retry` + jittered exponential backoff on 429; guard max in-flight tokens; hard stop if expected token cost > `EMBED_MAX_USD`
- Upsert only when `content_sha256` changed
- **Flat Chroma metadata** (keep <16 keys): source, source_url, snapshot_id, slug, chunk_start, chunk_end, token_start, token_end, token_count, lang, content_sha256, canonical_url, file_path
- **Extended metadata in sidecar JSON**: `.meta/<chunk_id>.json` for dedupe_key, embed_model, embed_dim, source_title, etc.
- Generate `index/manifest.json`:
  ```json
  {
    "kb_schema_version": "1.0.0",
    "collection": "soranauts-kb",
    "embed_model": "text-embedding-3-large",
    "embed_dim": 3072,
    "distance": "cosine",
    "tokenizer": "tiktoken-cl100k",
    "chunk_tokens": {"target": 450, "overlap": 0.15, "min": 200, "max": 2000},
    "created_at": "ISO-8601",
    "provider": "openai",
    "provider_version": "openai-2025-09-01",
    "licenses": {
      "soramitsu.co": "site-terms",
      "soramitsu.co.jp": "site-terms",
      "medium.com": "Medium TOS"
    }
  }
  ```
- Export `index/export.jsonl` for disaster recovery and CI portability
- Build BM25 index with `minisearch` if `BM25_ENABLED=true`
- Emit metrics JSON to stdout: files processed, chunks written, 429 count, avg RPS, failure count, duration, budget_used_usd

### 2. `retrieve.ts` — Hybrid Context Search (Vector + BM25)

**CLI**: `tsx retrieve.ts "query" [options]`

**Options**:
- `--asof <YYYY-MM-DD>` — cap results by snapshot_id ≤ date (defaults to `RETRIEVE_ASOF_DEFAULT` if set)
- `--snapshot-id <YYYY-MM-DD>` — exact snapshot match
- `--lang en` — filter by language (default: `en`)
- `--source wiki,iroha_docs` — filter by source (default: `wiki,iroha_docs`)
- `--include url,title,source_commit,snapshot_id` — include metadata fields
- `--min_score 0.2` — minimum similarity threshold (default: 0.2)
- `--limit 8` — top-k results (default: 8)
- `--span` — print chunk_start..chunk_end in output
- `--bm25 off` — disable BM25 (vector-only)
- `--alpha 0.65` — fusion weight for vector score (default: 0.65, BM25: 0.35)
- `--json` — JSON output mode
- `--table` — pretty table output (default, uses `cli-table3` with truncation + colorized scores)

**Hybrid Retrieval**:
- **Vector search**: Chroma similarity search (cosine)
- **BM25 search**: Query `minisearch` inverted index
- **Score fusion**: `score = α * embed_score + (1-α) * bm25_score` (default α=0.65)
- Rerank: `topk = vector ∪ bm25` with L2-normalized blend

**Time-scoped filtering**: Filter results by `(snapshot_id === snapshotId)` or `(snapshot_id <= asof)` to prevent cross-snapshot leakage

**Output**: Top matches with metadata (including source_title for snippet relevance), excerpts, chunk locations (char + token offsets), hybrid scores

### 3. `backtest.ts` — Claim-Based Article Validation

**CLI**: `tsx backtest.ts <article-path> [--asof YYYY-MM-DD] [--sarif] [--pr-diff] [--regen-claims] [--claim-min-len 12] [--claim-max-len 280] [--strict-dates]`

**Pipeline**:
1. **Claim extraction**:
   - Use structured LLM outputs with JSON schema (Zod) for claims
   - Retry on parse fail
   - Persist `claims.json` next to article for deterministic re-runs (reuse unless `--regen-claims`)
   - Filter claims: `--claim-min-len 12`, `--claim-max-len 280`
   - Require each claim to include at least one verifiable noun phrase (simple heuristic)
   - With `--strict-dates`: flag vague time claims (e.g., "recently") and suggest absolute dates
2. For each claim, retrieve top-k evidence chunks (pass `--asof` through to retrieval)
3. **Two-pass labeling**:
   - Pass 1: retrieval-only evidence check
   - Pass 2: LLM verdict constrained to `supported` | `conflicts` | `insufficient` with rationale capped at 50 tokens
   - **Rubric**:
     - `supported`: any evidence chunk ≥0.78 cosine and contains all critical entities
     - `conflicts`: ≥0.72 but negated or contradicts numerics/dates
     - `insufficient`: otherwise
4. For `insufficient` claims, propose top 3 missing-evidence queries and store them
5. Compute `claim_entity_diff` (Levenshtein on key entities) to explain PR comments
6. Emit `backtest_report.json` with issues, suggestions, risk score, missing-evidence queries, entity diffs
7. Emit `backtest_report.sarif` for GitHub PR annotations (if `--sarif`):
   - Rule IDs: `RAG001` (conflict), `RAG002` (insufficient), `RAG003` (no evidence)
   - Put chunk URL in `helpUri`

**Output Schema**:
```typescript
{
  article_path: string;
  snapshot_id: string;
  claims: Array<{
    claim_id: string;
    text: string;
    label: 'supported' | 'conflicts' | 'insufficient';
    evidence: Array<{ chunk_id: string; score: number; excerpt: string; chunk_url: string }>;
    missing_queries?: string[]; // Top 3 if insufficient
    entity_diff?: string; // Levenshtein explanation
  }>;
  summary: { supported: number; conflicts: number; insufficient: number };
  risk_score: number; // 0-1
}
```

### 4. `medium_import.ts` — RSS → Markdown

**Features**:
- Parse RSS from `MEDIUM_FEED_URL`
- **Ethics compliance**: Ingest only content exposed in RSS/canonical; do not bypass metered paywalls
- Always fetch full HTML when available (RSS `content:encoded` is often truncated)
- Prefer fetching via link inside RSS item when present (more reliable than appending ?source=—-)
- Respect canonical URL; honor canonical-only policy
- **HTML sanitization**: Strip scripts/styles/iframes before MD conversion
- **Stable HTML normalization**: Strip attributes, sort attributes, collapse spaces before hashing
- Download images to `ecosystem_updates/images/` (hashed filenames: `original-name-<short-hash>.ext`)
- Compute `image_sha256` and keep global map to avoid re-downloading across sources
- Rewrite image URLs to local paths
- Store `image_rights_source_url` in metadata
- Convert HTML → MD with `turndown`
- Add front-matter: `source: update`, `source_url`, `image_rights: "Medium"`, `canonical_url`
- State file: `.medium_state.json` (last processed GUID/pubDate, URL → ETag/Last-Modified)
- Skip if GUID already processed
- **HTTP caching**: Send If-None-Match/If-Modified-Since for original article URLs
- **Logging**: Never log raw content; redact URLs with tokens

### 5. `iroha_docs_sync.ts` — Git Clone/Pull

**Features**:
- Shallow clone/pull `hyperledger/iroha-2-docs` to `iroha_docs/`
- Use sparse checkout for `/src/**/*.md` (or docs folder)
- Record HEAD SHA in snapshot manifest (`docs_at_commit`)
- Keep only `.md` files (ignore build artifacts, `node_modules/`)
- Idempotent: only updates if remote changed

### 6. `soramitsu_scrape.ts` — HTML Scraper

**Features**:
- **Multi-domain**: Crawl both `soramitsu.co` and `soramitsu.co.jp` (from `CRAWL_DOMAINS`)
- Parse and cache `robots.txt`; obey `crawl-delay`; cache "disallowed" in `.state` to avoid retries
- Prefer `sitemap.xml` discovery; blend BFS crawl (depth 2–3) after sitemap seeds for gaps
- **Token-bucket rate limiting**: Use `p-queue` per-host honoring `CRAWL_RPS_PER_HOST` (default: 2 RPS)
- **Canonical allowlist enforcement**: Only ingest pages whose `<link rel="canonical">` host ∈ `CRAWL_DOMAINS`
- Respect `<link rel="canonical">`; dedupe by canonical URL
- Normalize URLs: strip fragments `#*`, lower-case host, keep path case, collapse trailing slashes
- Strip querystring variants (`?utm_*`)
- **HTML sanitization**: Strip scripts/styles/iframes; allow minimal HTML whitelist before MD conversion
- **Stable HTML normalization**: Remove nav/footer, normalize attributes before hashing
- Clean HTML: remove cookie banners, nav, footer (normalize for hash comparison)
- Respect `noindex,nofollow` meta tags and HTTP `X-Robots-Tag`; store skip records for disallowed paths
- Respect `<meta name="robots">` and HTTP X-Robots-Tag
- Capture `hreflang` and set `lang` in front-matter
- Language detection: use `<html lang>` + CLD3/franc fallback for JP pages with EN sections
- Skip URLs in `do-not-ingest.json` (supports glob + regex + per-domain rules with reasons)
- Download images (hashed filenames) to `soramitsu_site/images/`
- Compute `image_sha256` for global deduplication
- Convert HTML → MD with `turndown`
- Add front-matter: `source: soramitsu`, `source_url`, `lang`, `canonical_url`, `image_rights`, `license_hint`
- State file: `.soramitsu_state.json` (URL → ETag/Last-Modified/sha256, disallowed flags, robots_snapshot)
- **Persist robots_snapshot**: URL → sha256 + fetched_at for the robots.txt honored
- Hash normalized HTML (removed nav/footers) so cosmetic site changes don't churn snapshots

### 7. `image_wide_hero.ts` — Hero Image Normalization

**Features**:
- Read image, compute aspect ratio
- **EXIF autorotate** using `sharp.rotate()`
- **Aspect decision**:
  - If aspect within ±10% of 2:1 → no crop (native)
  - If hero contains text (heuristic: high edge density bands) → prefer letterbox
  - Otherwise → center-crop to 2:1
- **Processing**:
  - `resize({ fit: 'cover', width: IMAGE_MAX_WIDTH, aspectRatio: 2 })` for crop
  - Letterbox fallback preserves full content
- Compute **perceptual hash** (`blockhash-core`) to dedupe
- Save original + normalized variants
- Record `hero_sha256` separately so hero re-gen doesn't force re-embedding
- Emit `image_meta.json` with: width, height, phash, variant ('crop' | 'letterbox' | 'native'), rights, source_url
- Store `image_rights_source_url` for audits

## Snapshot Provenance

Each snapshot includes `manifest.json`:

```typescript
{
  snapshot_id: "2025-11-02",
  created_at: "2025-11-02T03:17:00Z",
  kb_schema_version: "1.0.0",
  embed_model: "text-embedding-3-large",
  embed_dim: 3072,
  distance_metric: "cosine",
  tokenizer: "tiktoken-cl100k",
  sources: {
    wiki: {
      files: number;
      words: number;
      chunks: number;
      source_commit?: string;
    };
    iroha_docs: {
      files: number;
      words: number;
      chunks: number;
      source_commit: string; // HEAD SHA
      docs_at_commit: string;
    };
    soramitsu_site: { /* ... */ };
    ecosystem_updates: { /* ... */ };
  },
  files: Array<{
    path: string;
    source_url: string;
    retrieved_at: string;
    source_commit?: string;
    content_sha256: string;
    canonical_url?: string;
    license_hint?: string;
  }>,
  robots_snapshot: {
    [domain: string]: {
      url: string;
      sha256: string;
      fetched_at: string;
    }
  },
  licenses: {
    [domain: string]: string; // "site-terms", "CC-BY-4.0", etc.
  }
}
```

## Image Storage Strategy

**Option A (Recommended)**: Git LFS
- Store images in `knowledge_base/assets/` with LFS tracking
- Never duplicate (use hash-named files + reference)
- `.gitattributes`: 
  ```
  knowledge_base/assets/** filter=lfs diff=lfs merge=lfs -text
  knowledge_base/** linguist-documentation
  ```

**Option B**: S3/R2 Bucket
- Push images to bucket with stable paths
- Store checksums in repo (not images)
- Reference via bucket URL in markdown

**Option C**: Local (fallback)
- Use hashed filenames to avoid collisions
- Store in respective `/images/` subdirectories

## GitHub Actions Workflows

### 1. `.github/workflows/kb-sync.yml` — Nightly Sync

**Triggers**:
- Schedule: `cron: "17 3 * * *"` (03:17 UTC = 21:17 CDT/CST)
- Manual: `workflow_dispatch`

**Concurrency**: `group: kb-sync`, `cancel-in-progress: true`

**Steps**:
1. Checkout code
2. Setup Node.js 20 + pnpm (with cache)
3. Install dependencies (`pnpm install`)
4. Pull SORA wiki (shallow clone)
5. Pull Iroha 2 docs (shallow clone, record SHA)
6. Import new Medium posts
7. Scrape SORAMITSU site (both domains)
8. Create dated snapshot with manifest.json
9. **Delta reindex**: Only re-embed changed files (hash comparison)
10. Build BM25 index if enabled
11. Run backtests on changed articles (if any)
12. Upload artifacts:
    - `snapshots/<date>/manifest.json`
    - `backtest_report.json` (if run)
    - `backtest_report.sarif` (if run)
    - `kb-logs/*.ndjson` (per-stage logs)
13. Upload `backtest_report.sarif` via `github/codeql-action/upload-sarif` if `CI_WRITE_SARIF=true`
14. Post GitHub Check summary with counts (files/chunks, new/changed, backtest risk score)
15. Commit changes (if any)

**Secrets**: `OPENAI_API_KEY`

### 2. `.github/workflows/kb-index.yml` — Reindex on Changes

**Triggers**:
- Push to paths: `knowledge_base/**`, `apps/web/src/content/post/**`

**Steps**:
1. Checkout
2. Setup Node.js + pnpm (with cache)
3. Install dependencies
4. **Delta reindex**: Determine changed files via `git diff --name-only ${{ github.event.before }} ${{ github.sha }}` to handle merge commits robustly
5. **Skip if only images changed** → skip embeddings
6. Run `tsx ingest.ts` (only changed content)
7. Rebuild BM25 index if enabled
8. **Cache**: 
   - Key: `chroma-${{ runner.os }}-${{ hashFiles('knowledge_base/index/manifest.json') }}-${{ env.EMBED_MODEL }}-${{ env.TOKENIZER }}`
   - Paths: `~/.pnpm-store`, `node_modules`, `knowledge_base/index/` (if <1GB, otherwise upload as artifact)

**Secrets**: `OPENAI_API_KEY`

**Budget Guard** (optional step):
- Fail if `git diff --name-only × avg tokens per doc × $/1K` exceeds `EMBED_MAX_USD`

## Quality Guards

1. **Token filtering**: Drop chunks <200 tokens or >2000 tokens (enforced after tokenization)
2. **Language detection**: Add `lang`, `detected_lang`, `lang_confidence` to front-matter for retrieval filtering
3. **Claim extraction**: Atomic, numbered claims for precise backtesting
4. **Chunk stability**: Deterministic IDs across re-ingests
5. **Batch processing**: 128–512 embeddings/batch with retry logic, payload <2MB/request
6. **Near-duplicate suppression**: SimHash with configurable threshold
7. **PDF quality gates**: Allowlist + extraction_quality flag to weight low-quality PDFs lower

## Observability

- Log per-stage metrics to `kb-logs/*.ndjson` (newline-JSON format)
- Metrics include: ingested files, skipped, tokens embedded, API cost estimate, 429 count, avg RPS, duration
- Upload logs as CI artifacts
- Render GitHub Check summary with key metrics

## Local Development

Add to `apps/web/package.json`:

```json
{
  "kb:ingest": "tsx knowledge_base/scripts/ingest.ts",
  "kb:retrieve": "tsx knowledge_base/scripts/retrieve.ts",
  "kb:backtest": "tsx knowledge_base/scripts/backtest.ts",
  "kb:sync:medium": "tsx knowledge_base/scripts/medium_import.ts",
  "kb:sync:iroha": "tsx knowledge_base/scripts/iroha_docs_sync.ts",
  "kb:sync:soramitsu": "tsx knowledge_base/scripts/soramitsu_scrape.ts",
  "kb:verify": "tsx knowledge_base/scripts/retrieve.ts --selftest",
  "kb:lint": "biome check knowledge_base --write",
  "kb:backtest:pr": "tsx knowledge_base/scripts/backtest.ts --pr-diff --sarif",
  "kb:eval": "tsx knowledge_base/scripts/eval.ts" // Optional: RAG quality evaluation
}
```

## Documentation

Create `knowledge_base/docs/kb.md` covering:
- Determinism requirements (chunk IDs, hashing, tokenization)
- Image storage strategy
- Snapshot provenance
- Robots.txt compliance
- Backtesting workflow
- Hybrid retrieval configuration
- Metadata sidecar system

## Dependencies

```json
{
  "dependencies": {
    "chromadb": "^1.x",
    "tiktoken": "^1.x",
    "minisearch": "^7.x",
    "got": "^13.x",
    "p-queue": "^8.x",
    "p-retry": "^6.x",
    "cheerio": "^1.x",
    "turndown": "^7.x",
    "rss-parser": "^3.x",
    "robots-parser": "^5.x",
    "sitemapper": "^4.x",
    "pdf-parse": "^1.x",
    "simhash": "^2.x",
    "franc": "^6.x",
    "sharp": "^0.33.x",
    "blockhash-core": "^0.3.x",
    "gray-matter": "^4.x",
    "execa": "^8.x",
    "cli-table3": "^0.6.x",
    "zod": "^3.22.x"
  },
  "devDependencies": {
    "@types/minisearch": "^7.x",
    "tsx": "^4.20.x"
  }
}
```

## Implementation Order

1. Setup directory structure and dependencies
2. Create env schema and state management
3. Implement `iroha_docs_sync.ts` (simplest)
4. Implement `medium_import.ts` (RSS + image handling + HTTP caching)
5. Implement `soramitsu_scrape.ts` (robots/sitemap/crawling + canonical enforcement)
6. Implement `image_wide_hero.ts` (EXIF, crop/letterbox, pHash)
7. Implement `ingest.ts` (token-true chunking, embeddings, deterministic IDs, tombstone handling, BM25 index)
8. Implement `retrieve.ts` (hybrid search with fusion, time-scoped filtering)
9. Implement `backtest.ts` (claim extraction with persistence, SARIF output)
10. Add snapshot provenance tracking with full metadata
11. Create GitHub Actions workflows (with delta reindex, caching, artifacts)
12. Setup Git LFS for images (or bucket configuration)
13. Add observability (metrics.ndjson, CI summaries)
14. Add npm scripts and documentation
15. (Optional) Add `kb:eval` for RAG quality evaluation

## Acceptance Checklist

- [ ] Same query + same snapshot → stable top-k (±1 re-rank tolerance)
- [ ] Re-ingesting unchanged content writes zero new chunks (manifest diff empty)
- [ ] `backtest.ts` on two consecutive runs produces identical SARIF (unless sources changed)
- [ ] `soramitsu_scrape.ts` respects robots and canonical; no off-domain canonicals are ingested
- [ ] Wide hero normalization produces 2:1 outputs with pHash dedupe < 8 Hamming to skip dupes
- [ ] CI summary displays: files/chunks added, 429 count, duration, risk score
- [ ] Hybrid retrieval improves exact-term queries (acronyms, code, param names)
- [ ] Token-accurate offsets stored and retrievable
- [ ] HTTP caching reduces redundant fetches (ETag/Last-Modified honored)
- [ ] Image deduplication prevents re-downloading same assets across sources


