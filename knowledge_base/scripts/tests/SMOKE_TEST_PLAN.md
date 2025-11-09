# Smoke Test Plan for Incremental Ingestion + Embedding Cache

## Prerequisites
- Small embedding model: `EMBED_MODEL=text-embedding-3-small`
- Subset filter: `KB_SUBSET` set to a small directory (e.g., one source directory)
- ChromaDB running
- `OPENAI_API_KEY` set

## Test 1: No-Change Re-Ingest → ≥95% Cache Hit, 0 New Chunks

### Steps
1. Run initial ingestion:
   ```bash
   EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest
   ```

2. Immediately re-run ingestion (no content changes):
   ```bash
   EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest
   ```

### Expected Results
- `files_processed`: 0 (all files skipped as unchanged)
- `files_skipped`: > 0 (all files unchanged)
- `chunks_created`: 0 (no new chunks)
- `chunks_skipped`: > 0 (all chunks from cache)
- `cache_hit_rate`: ≥ 95%
- `tokens_embedded`: 0 (no API calls)
- `api_cost_estimate_usd`: $0.00

### Success Criteria
- ✅ Cache hit rate ≥ 95%
- ✅ 0 new chunks created
- ✅ 0 tokens embedded
- ✅ No API costs

## Test 2: Touch One File → Only That File's Chunks Re-Embedded

### Steps
1. Run initial ingestion:
   ```bash
   EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest
   ```

2. Modify one file (add a space or comment):
   ```bash
   echo " " >> knowledge_base/wiki/<some-file>.md
   ```

3. Re-run ingestion:
   ```bash
   EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest
   ```

### Expected Results
- `files_processed`: 1 (only the modified file)
- `files_skipped`: N-1 (all other files unchanged)
- `chunks_created`: matches chunks in modified file only
- `cache_hits`: 0 (modified file has new chunks)
- `tokens_embedded`: tokens for modified file only
- Other files' chunks remain in ChromaDB (not re-embedded)

### Success Criteria
- ✅ Only modified file processed
- ✅ Only modified file's chunks re-embedded
- ✅ Unchanged files skipped
- ✅ Correct chunk counts

## Test 3: Determinism Passes With and Without Cache

### Steps

#### With Cache (Default)
1. Run determinism test:
   ```bash
   ./knowledge_base/scripts/tests/determinism.sh
   ```

#### Without Cache
1. First run:
   ```bash
   KB_DETERMINISM_NOCACHE=true pnpm --filter @soranauts/web kb:ingest --nocache
   ```
   Or:
   ```bash
   pnpm --filter @soranauts/web kb:ingest --nocache
   ```

2. Backup index:
   ```bash
   rm -rf knowledge_base/index.baseline
   cp -r knowledge_base/index knowledge_base/index.baseline
   ```

3. Second run (nocache):
   ```bash
   pnpm --filter @soranauts/web kb:ingest --nocache
   ```

4. Compare manifests (should be identical except timestamps):
   ```bash
   jq 'del(.created_at) | del(.cache_hit_rate)' knowledge_base/index.baseline/manifest.json > /tmp/manifest-baseline.json
   jq 'del(.created_at) | del(.cache_hit_rate)' knowledge_base/index/manifest.json > /tmp/manifest-current.json
   diff /tmp/manifest-baseline.json /tmp/manifest-current.json
   ```

### Expected Results
- With cache: manifests identical (cache hit rate may differ slightly)
- Without cache: manifests identical (deterministic chunk IDs)
- File registry identical
- Chunk IDs stable across runs

### Success Criteria
- ✅ Determinism test passes with cache enabled
- ✅ Determinism test passes with `--nocache`
- ✅ Chunk IDs stable
- ✅ File registry identical

## Test 4: Golden Retrieval Unchanged

### Steps
1. Run initial ingestion and note retrieval results:
   ```bash
   EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest
   pnpm --filter @soranauts/web kb:retrieve "test query" --limit 5 --json > /tmp/golden-baseline.json
   ```

2. Re-run ingestion (no changes):
   ```bash
   pnpm --filter @soranauts/web kb:ingest
   pnpm --filter @soranauts/web kb:retrieve "test query" --limit 5 --json > /tmp/golden-current.json
   ```

3. Compare results:
   ```bash
   diff <(jq -S '.chunks[].id' /tmp/golden-baseline.json | sort) <(jq -S '.chunks[].id' /tmp/golden-current.json | sort)
   ```

### Expected Results
- Retrieval results identical (same chunk IDs in same order)
- Scores may vary slightly (within 0.01)

### Success Criteria
- ✅ Same chunk IDs retrieved
- ✅ Same ordering (or very similar scores)

## Notes
- Use small embedding model (`text-embedding-3-small`) to reduce costs
- Use `KB_SUBSET` to limit scope for faster testing
- Monitor `cache_hit_rate` in metrics output
- Check `.file_registry.json` for `bytesSha256` tracking
- Verify cache files in `knowledge_base/index/.embedding_cache/`











