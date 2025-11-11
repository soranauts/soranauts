# Acceptance Tests for Knowledge Base RAG

This document outlines the acceptance tests to verify the RAG system is working correctly.

## Prerequisites

```bash
# Set OpenAI API key
export OPENAI_API_KEY=your_key_here

# Sync Iroha docs (if not already done)
pnpm kb:sync:iroha
```

## Test A: Determinism

**Goal**: Verify that re-ingesting unchanged content produces identical results.

```bash
# First run
pnpm kb:ingest

# Backup index
cp -r knowledge_base/index knowledge_base/index.baseline

# Second run
pnpm kb:ingest

# Compare (should show no diffs)
diff -qr knowledge_base/index.baseline/manifest.json knowledge_base/index/manifest.json
diff -qr knowledge_base/index.baseline/.file_registry.json knowledge_base/index/.file_registry.json
```

**Expected**: No differences. Same chunk IDs, same manifest.

**Automated**: `pnpm kb:test:determinism`

## Test B: Delta Reindex

**Goal**: Verify that only changed files trigger re-embedding.

```bash
# Edit a single line in one iroha_docs MD file
# (Make whitespace-neutral changes only)
vi knowledge_base/iroha_docs/src/some_file.md

# Re-ingest
pnpm kb:ingest 2>&1 | tee /tmp/kb-delta.log

# Verify:
# 1. Metrics show only changed file processed
# 2. Only that file's chunks have new IDs (different content_sha256)
# 3. Other files' chunks remain unchanged
```

**Expected**: Only the modified file's chunks change. Other files' chunk IDs remain stable.

## Test C: Filters & Time-Scoping

**Goal**: Verify retrieval filters and time-scoped queries work correctly.

```bash
# Test source filter
pnpm kb:retrieve "BFT consensus" --source iroha_docs --lang en

# Test time-scoping (future date should return all)
pnpm kb:retrieve "BFT consensus" --source iroha_docs --lang en --asof 2099-01-01

# Test exact snapshot
CURRENT_DATE=$(date +%Y-%m-%d)
pnpm kb:retrieve "BFT consensus" --source iroha_docs --snapshot-id $CURRENT_DATE

# Run twice to verify stable ordering
pnpm kb:retrieve "BFT consensus" --source iroha_docs --json > /tmp/results1.json
pnpm kb:retrieve "BFT consensus" --source iroha_docs --json > /tmp/results2.json
diff /tmp/results1.json /tmp/results2.json
```

**Expected**: 
- Results include `source_url` and `snapshot_id` in metadata
- Stable ordering across runs (same query = same results)
- Filters work correctly

## Test D: Exact-Term vs Semantic Queries

**Goal**: Verify both exact-term and semantic queries return relevant results.

```bash
# Test exact terms (should appear in excerpts)
for query in "Kura" "Sumeragi" "parity check" "view change" "HotStuff" "PBFT"; do
  echo "Testing: $query"
  pnpm kb:retrieve "$query" --source iroha_docs --limit 3 --table
  echo ""
done
```

**Expected**: 
- Top-3 results should contain the exact term in excerpts
- Results are relevant to the query
- Scores are reasonable (>0.3 for good matches)

**Note**: BM25 will improve exact-term matching later.

## Test E: Failure Hygiene

**Goal**: Verify graceful error handling and retries.

```bash
# Temporarily revoke network access or use invalid API key
export OPENAI_API_KEY=invalid_key
pnpm kb:ingest
```

**Expected**: 
- Script exits cleanly with clear error message
- Retries are attempted (with backoff)
- No partial/corrupted index state

## Test F: Golden Retrieval Tests

**Goal**: Automated regression tests for retrieval quality.

```bash
pnpm kb:test:retrieval
```

**Expected**: All tests pass, verifying:
- Results are returned for known queries
- Results have required metadata (source_url, snapshot_id)
- Scores meet minimum thresholds

## Running All Tests

```bash
# Full acceptance suite
pnpm kb:test:determinism  # Test A
# Manual: Test B (delta reindex)
pnpm kb:retrieve "BFT consensus" --source iroha_docs --lang en --asof 2099-01-01  # Test C
# Manual: Test D (exact terms)
pnpm kb:test:retrieval  # Test F
```

## Success Criteria

All tests should pass before:
- Adding new sources (scrapers/importers)
- Modifying chunking logic
- Changing embedding models













