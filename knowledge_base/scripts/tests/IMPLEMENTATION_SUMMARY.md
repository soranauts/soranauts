# Implementation Summary: Incremental Ingestion + Embedding Cache

## File Modifications

### 1. Environment Variables (`apps/web/src/server/env.ts`)
**Lines 50-54**: Added new environment variables
```typescript
KB_INCREMENTAL: z.string().transform((val) => val !== 'false').pipe(z.boolean()).default('true'),
KB_EMBED_CACHE_DIR: z.string().default('./knowledge_base/index/.embedding_cache'),
KB_DETERMINISM_NOCACHE: z.string().transform((val) => val === 'true').pipe(z.boolean()).default('false'),
KB_SUBSET: z.string().default(''),
```

### 2. Type Definitions (`knowledge_base/scripts/types.ts`)
**Lines 60**: Added `chunker_version` to `ExtendedChunkMetadata`
**Lines 71, 78-80**: Added `chunker_version`, `subset`, `seed`, `cache_hit_rate` to `IndexManifest`
**Lines 168-179**: Added cache metrics to `Metrics` interface:
- `chunks_created`, `chunks_updated`, `chunks_skipped`
- `cache_hits`, `cache_misses`, `cache_hit_rate`

### 3. Core Ingestion Script (`knowledge_base/scripts/ingest.ts`)

#### Chunk ID Format Change (Lines 137-146)
- **Old**: `${snapshotId}::${slug}::${contentSha256}::chunk-${start}-${end}`
- **New**: `sha256(normalized_text)::startToken::len::chunker_version`
- **Location**: Lines 143-146
- Removed `snapshotId` from ID; kept in metadata only (line 151)

#### Chunker Version Constant (Line 18)
```typescript
const CHUNKER_VERSION = '1.0.0';
```

#### File Metadata Update (Lines 33-38)
Added `bytesSha256` field for change detection:
```typescript
interface FileMetadata {
  bytesSha256: string; // Hash of raw file bytes for change detection
}
```

#### ProcessedFile Interface Update (Lines 40-51)
Added `bytesSha256` and `cacheKey` to chunks:
```typescript
interface ProcessedFile {
  bytesSha256: string;
  chunks: Array<{
    cacheKey: string; // contentSha256::embedModel::tokenizer
  }>;
}
```

#### Cache Functions (Lines 215-253)
- `loadEmbeddingCache()`: Loads cache from disk
- `saveEmbeddingToCache()`: Saves embedding to cache with key-based filename

#### ProcessFile Function Updates (Lines 88-205)
- **Line 96-98**: Compute `bytesSha256` from raw file bytes
- **Line 93**: Added `tokenizer` parameter
- **Lines 143-146**: New chunk ID format
- **Lines 171**: Added `chunker_version` to extended metadata
- **Lines 182-183**: Cache key generation: `contentSha256::embedModel::tokenizer`

#### Main Function Updates
- **Lines 332-337**: CLI argument parsing with `--nocache` flag
- **Line 339**: Cache enablement logic
- **Lines 341-359**: Enhanced metrics initialization with cache fields
- **Lines 402-406**: Load embedding cache
- **Lines 424-453**: Incremental file processing (skip unchanged files using `bytesSha256`)
- **Lines 499-519**: Cache-aware chunk embedding (check cache, reuse or embed)
- **Lines 545-550**: Save new embeddings to cache
- **Lines 591-596**: Calculate cache hit rate and chunk status metrics
- **Lines 623-630**: Update file registry with `bytesSha256`
- **Lines 651-673**: Enhanced manifest with new fields
- **Lines 685-706**: Enhanced summary table and logging

#### Manifest Normalization Function (Lines 314-326)
```typescript
function normalizeManifest(manifest: IndexManifest): any {
  // Strip timestamps, durations, IDs; sort keys/arrays
}
```

### 4. Determinism Test (`knowledge_base/scripts/tests/determinism.sh`)
**Lines 5-6**: Updated description for cache-aware testing
**Lines 21-36**: Enhanced manifest normalization (strips `created_at` and `cache_hit_rate`)

### 5. Git Ignore (`knowledge_base/.gitignore`)
**Lines 12**: Added `index/.embedding_cache/` to ignore list
**Lines 4, 24**: Added `.state/` and `*.sarif` patterns

## New Manifest Schema

```typescript
interface IndexManifest {
  kb_schema_version: string;
  collection: string;
  embed_model: string;
  embed_dim: number;
  distance: 'cosine' | 'euclidean' | 'dot';
  tokenizer: string;
  chunker_version: string;           // NEW
  chunk_tokens: {
    target: number;
    overlap: number;
    min: number;
    max: number;
  };
  subset?: string;                    // NEW
  seed?: string;                      // NEW
  cache_hit_rate?: number;            // NEW
  created_at: string;
  provider: string;
  provider_version: string;
  licenses?: Record<string, string>;
}
```

## Dry-Run Plan for Acceptance Checks

### Prerequisites
1. Set environment:
   ```bash
   export EMBED_MODEL=text-embedding-3-small  # Reduce costs
   export KB_SUBSET=wiki                      # Limit scope for testing
   export OPENAI_API_KEY=<your-key>
   ```

2. Ensure ChromaDB is running:
   ```bash
   # Check ChromaDB status
   curl http://127.0.0.1:8000/api/v1/heartbeat
   ```

### Test 1: No-Change Re-Ingest → ≥95% Cache Hit, 0 New Chunks

**Steps:**
```bash
# First run - initial ingestion
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest

# Second run - should use cache
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest
```

**Expected Output (2nd run):**
- `files_processed`: 0
- `files_skipped`: > 0
- `chunks_created`: 0
- `chunks_skipped`: > 0 (all from cache)
- `cache_hit_rate`: ≥ 95%
- `tokens_embedded`: 0
- `api_cost_estimate_usd`: $0.00

**Verification:**
```bash
# Check cache directory
ls -la knowledge_base/index/.embedding_cache/ | wc -l  # Should show cache files
```

### Test 2: Touch One File → Only That File's Chunks Re-Embedded

**Steps:**
```bash
# Initial ingestion
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest

# Modify one file
echo " " >> knowledge_base/wiki/<some-file>.md

# Re-run ingestion
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest
```

**Expected Output:**
- `files_processed`: 1 (only modified file)
- `files_skipped`: N-1 (all other files)
- `chunks_created`: matches chunks in modified file only
- `cache_hits`: 0 (modified file has new chunks)
- `tokens_embedded`: tokens for modified file only

**Verification:**
```bash
# Check file registry
cat knowledge_base/index/.file_registry.json | jq 'keys | length'  # Should show all files
```

### Test 3: Determinism Passes With and Without Cache

**With Cache (Default):**
```bash
./knowledge_base/scripts/tests/determinism.sh
```

**Without Cache:**
```bash
# First run
KB_DETERMINISM_NOCACHE=true pnpm --filter @soranauts/web kb:ingest --nocache

# Backup
rm -rf knowledge_base/index.baseline
cp -r knowledge_base/index knowledge_base/index.baseline

# Second run
pnpm --filter @soranauts/web kb:ingest --nocache

# Compare (manifests should be identical except timestamps)
jq 'del(.created_at) | del(.cache_hit_rate)' knowledge_base/index.baseline/manifest.json > /tmp/manifest-baseline.json
jq 'del(.created_at) | del(.cache_hit_rate)' knowledge_base/index/manifest.json > /tmp/manifest-current.json
diff /tmp/manifest-baseline.json /tmp/manifest-current.json  # Should be empty
```

### Test 4: Golden Retrieval Unchanged

**Steps:**
```bash
# Initial ingestion
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest

# Baseline retrieval
pnpm --filter @soranauts/web kb:retrieve "test query" --limit 5 --json > /tmp/golden-baseline.json

# Re-run ingestion (no changes)
pnpm --filter @soranauts/web kb:ingest

# Current retrieval
pnpm --filter @soranauts/web kb:retrieve "test query" --limit 5 --json > /tmp/golden-current.json

# Compare chunk IDs
diff <(jq -S '.chunks[].id' /tmp/golden-baseline.json | sort) <(jq -S '.chunks[].id' /tmp/golden-current.json | sort)
```

**Expected:** Same chunk IDs in same order (scores may vary slightly)

## Key Implementation Details

### Cache Key Format
```
contentSha256::embedModel::tokenizer
```
Where `contentSha256` hashes the exact text sent to the embedding API (`cleanText`).

### Chunk ID Format
```
sha256(normalized_text)::startToken::len::chunker_version
```
- No `snapshotId`, `model`, or `tokenizer` in ID
- Stable across snapshots
- Includes chunker version for future compatibility

### File Change Detection
- Uses `bytesSha256` (raw file bytes) for change detection
- `contentSha256` (normalized content) used for content-level tracking
- Files with unchanged `bytesSha256` are skipped entirely

### Cache Behavior
- Cache files stored in `knowledge_base/index/.embedding_cache/`
- Filename: `${hash(cacheKey).slice(0,16)}.json`
- Cache persists across runs (in `.gitignore`)
- Never overwrites identical hashes

## Next Steps (After Approval)

1. Run smoke tests per `SMOKE_TEST_PLAN.md`
2. Verify cache directory created and populated
3. Check file registry includes `bytesSha256`
4. Verify manifest includes new fields
5. Run full ingestion on approval





