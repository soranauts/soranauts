# Knowledge Base RAG System

This directory contains the RAG (Retrieval-Augmented Generation) knowledge base system for Soranauts. It indexes content from multiple authoritative sources to provide evidence-based article validation and retrieval.

## Structure

- `/wiki/` - Cloned SORA wiki (sora-xor/sora-docs)
- `/iroha_docs/` - Cloned Hyperledger Iroha 2 documentation
- `/soramitsu_site/` - Scraped SORAMITSU website pages (HTML → MD)
- `/ecosystem_updates/` - Medium posts imported from RSS feed
- `/articles/` - Reference to Soranauts articles (optional)
- `/snapshots/` - Dated frozen copies for reproducibility
- `/scripts/` - TypeScript ingestion and processing scripts
- `/index/` - Vector DB (ChromaDB) and BM25 indices
- `/assets/` - Image storage (Git LFS)

## Quick Start

```bash
# Install dependencies
pnpm install

# Sync Iroha docs
pnpm kb:sync:iroha

# Sync Medium posts
pnpm kb:sync:medium

# Scrape SORAMITSU site
pnpm kb:sync:soramitsu

# Build embeddings index
pnpm kb:ingest

# Search the knowledge base
pnpm kb:retrieve "SORA v3 governance changes"

# Back-test an article
pnpm kb:backtest apps/web/src/content/post/article.mdx
```

## Incremental Ingestion & Embedding Cache

The KB supports incremental ingestion and disk-based embedding caching to reduce costs and speed up re-indexing:

- **Deterministic chunk IDs**: `sha256(normalized_text)::startToken::len::chunker_version`
- **Cache directory**: `knowledge_base/index/.embedding_cache/` (gitignored)
- **File registry**: `knowledge_base/index/.file_registry.json` (tracks file changes via `bytesSha256`)
- **CLI flags**: `--nocache` (bypass cache for determinism testing)
- **Environment variables**:
  - `KB_INCREMENTAL=true` (default: enable incremental mode)
  - `KB_EMBED_CACHE_DIR=./knowledge_base/index/.embedding_cache`
  - `KB_DETERMINISM_NOCACHE=false` (bypass cache for testing)
  - `KB_SUBSET=""` (optional: limit ingestion to specific source)

### Usage

```bash
# First run (populates cache)
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm kb:ingest

# Second run (expect ≥95% cache hit, 0 new chunks)
pnpm kb:ingest  # Uses cache for unchanged files

# Determinism test (with cache)
./knowledge_base/scripts/tests/determinism.sh

# Determinism test (without cache)
KB_DETERMINISM_NOCACHE=true pnpm kb:ingest --nocache
```

## Environment Variables

See `apps/web/src/server/env.ts` for all configuration options. Key variables:

- `OPENAI_API_KEY` - Required for embeddings
- `EMBED_MODEL` - `text-embedding-3-large` (default) or `text-embedding-3-small`
- `KB_DIR` - Knowledge base root directory (default: `./knowledge_base`)
- `INDEX_DIR` - Vector DB storage location

## Documentation

Full documentation: `knowledge_base/docs/kb.md`

## CI/CD

The knowledge base syncs automatically via GitHub Actions:
- Nightly sync at 03:17 UTC (`.github/workflows/kb-sync.yml`)
- Reindex on changes (`.github/workflows/kb-index.yml`)

