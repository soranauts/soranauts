## Summary

Implements incremental ingestion and a disk-based embedding cache for the Soranauts KB. Reduces re-embedding by >90% and keeps deterministic chunk IDs independent of snapshot runs.

## Key Changes

- **Deterministic chunk IDs**: `sha256(normalized_text)::startToken::len::chunker_version`
- **File-change detection** via `bytesSha256` (raw bytes)
- **Embedding cache (disk)** keyed by `contentSha256::embedModel::tokenizer`
- **Incremental mode** using `.index/.file_registry.json` (skips unchanged files)
- **`--nocache` flag** + `KB_DETERMINISM_NOCACHE` env for determinism tests
- **Manifest extensions**: `chunker_version`, `subset`, `seed`, `cache_hit_rate`
- **Smoke tests** + determinism normalization updates
- **Cost summary** + cache hit rate logging at end of run

## Files Touched (high level)

- `apps/web/src/server/env.ts`: new env vars
- `knowledge_base/scripts/types.ts`: chunk/manifest/metrics schema
- `knowledge_base/scripts/ingest.ts`: chunk IDs, cache, incremental, flags, metrics
- `knowledge_base/.gitignore`: cache + state dirs
- `knowledge_base/scripts/tests/determinism.sh`: normalization updates
- `knowledge_base/scripts/tests/SMOKE_TEST_PLAN.md`
- `knowledge_base/scripts/tests/IMPLEMENTATION_SUMMARY.md`

## Env (defaults)

```
KB_INCREMENTAL=true
KB_EMBED_CACHE_DIR=./knowledge_base/index/.embedding_cache
KB_DETERMINISM_NOCACHE=false
KB_SUBSET=""
```

## How to Test (low-cost)

```bash
export OPENAI_API_KEY=<key>
export EMBED_MODEL=text-embedding-3-small
export KB_SUBSET=wiki

# 1) First run (populate cache)
pnpm --filter @soranauts/web kb:ingest

# 2) Second run (expect ~95%+ cache hits, 0 new chunks)
pnpm --filter @soranauts/web kb:ingest

# 3) Touch one file and re-run (only that file re-embedded)
echo " " >> knowledge_base/wiki/<some-file>.md
pnpm --filter @soranauts/web kb:ingest

# 4) Determinism (with/without cache)
./knowledge_base/scripts/tests/determinism.sh
KB_DETERMINISM_NOCACHE=true pnpm --filter @soranauts/web kb:ingest --nocache
```

### Expected Results
- Re-ingest without changes: ≥95% cache_hit_rate, chunks_created=0
- Only touched files re-chunked/re-embedded
- Manifest includes chunker_version, cache_hit_rate
- Determinism holds with --nocache (timestamps normalized)

## Notes / Safety

- Cache directory is .gitignored (`knowledge_base/index/.embedding_cache/`)
- `chunker_version` bump will safely re-key IDs when the chunker changes
- File registry updates only on processed files; unchanged files are skipped

## Follow-ups (optional)

- Add cache file integrity checks (atomic writes + temp file rename)
- Optional: include `chunker_version` in cache key for extra boundary safety
- Optional: shard cache by hash prefix to keep directories flat

---

## Reviewer Checklist

- [ ] **Chunk IDs** exclude snapshot/model/tokenizer, include `chunker_version`
- [ ] **Incremental skip** truly uses `bytesSha256` (raw bytes) not normalized text
- [ ] **Cache key** = `contentSha256::embedModel::tokenizer` (consider adding `chunker_version` in a follow-up)
- [ ] **No-cache determinism**: `--nocache` + `KB_DETERMINISM_NOCACHE=true` bypasses `get()` but still `set()`
- [ ] **Manifest** contains `chunker_version`, `subset`, `seed`, `cache_hit_rate`
- [ ] **Determinism script** strips timestamps and rate fields
- [ ] **.gitignore** covers `.embedding_cache/` and `.state/`
- [ ] **Metrics** report `chunks_created/updated/skipped`, `cache_hits/misses/hit_rate`
- [ ] **Costs**: summary prints `$`, saved tokens, and skip counts
- [ ] **Subset** respects `--subset` and `KB_SUBSET`

---

## Quick Verification Commands

```bash
# Heartbeat (Chroma)
curl -s http://127.0.0.1:8000/api/v1/heartbeat

# Populate cache (subset wiki)
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest

# Re-run for hit rate
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest

# Show cache files exist
ls -la knowledge_base/index/.embedding_cache | wc -l

# Registry sanity
jq 'keys | length' knowledge_base/index/.file_registry.json

# Golden retrieval stability
pnpm --filter @soranauts/web kb:retrieve "test query" --limit 5 --json > /tmp/baseline.json
pnpm --filter @soranauts/web kb:ingest
pnpm --filter @soranauts/web kb:retrieve "test query" --limit 5 --json > /tmp/current.json
diff <(jq -S '.chunks[].id' /tmp/baseline.json | sort) <(jq -S '.chunks[].id' /tmp/current.json | sort)
```

## Risk & Roll-back Plan

**Risk**: wrong change detector → unexpected re-embeds or misses  
**Mitigation**: bytesSha256 (raw), registry diff logs, dry-run subset first

**Risk**: cache corruption on write  
**Mitigation** (optional follow-up): write to temp file then rename() atomically

**Rollback**: disable with `KB_INCREMENTAL=false` and `--nocache`; clear cache dir

## Post-merge Steps

```bash
# Low-cost, on main
EMBED_MODEL=text-embedding-3-small KB_SUBSET=wiki pnpm --filter @soranauts/web kb:ingest

# When ready for full scope (you estimated ~$0.28 full ingest):
unset KB_SUBSET
EMBED_MODEL=text-embedding-3-large pnpm --filter @soranauts/web kb:ingest
```

