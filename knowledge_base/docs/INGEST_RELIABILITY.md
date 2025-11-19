# KB Ingestion Reliability Plan

## Root Cause Analysis

### Problem Statement
The GitHub Actions workflow `kb-index.yml` fails with `ChromaConnectionError: ECONNREFUSED 127.0.0.1:8000` when running `pnpm --filter @soranauts/web kb:ingest`.

### Root Cause
**Primary Issue**: The GitHub Actions runner has no ChromaDB service listening on `127.0.0.1:8000`. The ingestion script (`knowledge_base/scripts/ingest.ts`) attempts to connect to ChromaDB via HTTP using the default `CHROMA_URL=http://127.0.0.1:8000`, but no service is running.

**Evidence**:
- Error log: `Error: connect ECONNREFUSED 127.0.0.1:8000`
- The ChromaDB client (`chromadb` npm package) uses HTTP requests to connect
- The workflow does not provision any ChromaDB service container
- The error occurs at `AdminClient.getTenant()` → `ChromaClient.getCollection()` → connection attempt

**Secondary Observations**:
- The CORS hint in ChromaDB error messages is a red herring: the request never leaves the Node.js process because the TCP connection is refused at the OS level
- The error occurs before any HTTP request is made (connection refused at socket level)

### Why This Happens
1. **Local Development**: Developers run `docker-compose.chroma.yml` to start ChromaDB locally
2. **CI Environment**: GitHub Actions runners are ephemeral and have no pre-configured services
3. **Missing Service Provisioning**: The workflow assumes ChromaDB is available but doesn't start it

## Solution Architecture

### Chosen Solution: Docker Service Container (Solution A)

**Rationale**:
- Matches production architecture (HTTP ChromaDB)
- Provides consistent behavior across environments
- Allows health checks and proper startup sequencing
- Maintains compatibility with existing code paths

**Fallback Solution**: DuckDB Local Store (Solution B)
- Available via `LOCAL_EMBED_STORE=duckdb` environment variable
- Useful for forks without secrets, dry-run testing, and local development without Docker
- Stores embeddings in SQLite-compatible DuckDB file

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOCAL DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │  Developer    │         │  Docker      │                    │
│  │  Machine      │─────────▶│  Compose     │                    │
│  │               │  HTTP    │  (Chroma)    │                    │
│  └──────┬────────┘  :8000   └──────────────┘                    │
│         │                                                         │
│         │ pnpm kb:ingest:local                                   │
│         │ (LOCAL_EMBED_STORE=duckdb)                             │
│         ▼                                                         │
│  ┌──────────────┐                                               │
│  │  ingest.ts   │─────────▶ DuckDB (local file)                  │
│  │              │         knowledge_base/.kb_index/duckdb/       │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      GITHUB ACTIONS CI                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │  GA Runner   │         │  Service     │                    │
│  │  (Ubuntu)    │─────────▶│  Container   │                    │
│  │              │  HTTP    │  (Chroma)    │                    │
│  └──────┬───────┘  :8000   └──────────────┘                    │
│         │                                                         │
│         │ 1. Wait for health check                               │
│         │ 2. pnpm kb:ingest:ci                                    │
│         │    (CHROMA_STRICT=1)                                    │
│         ▼                                                         │
│  ┌──────────────┐                                               │
│  │  ingest.ts   │─────────▶ ChromaDB HTTP API                   │
│  │              │         (ghcr.io/chroma-core/chroma)          │
│  └──────────────┘                                               │
│                                                                   │
│  ┌──────────────┐                                               │
│  │  Cache       │                                               │
│  │  .kb_index/  │◀─────── Restore/Save via actions/cache@v4    │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │  Vercel/     │         │  ChromaDB    │                    │
│  │  Runtime     │─────────▶│  Service     │                    │
│  │              │  HTTP    │  (Managed)   │                    │
│  └──────────────┘  :8000   └──────────────┘                    │
│                                                                   │
│  Note: Production uses managed ChromaDB or external service      │
│        configured via CHROMA_URL environment variable            │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Ingestion Script** (`ingest.ts`):
   - Reads environment variables (`CHROMA_URL`, `LOCAL_EMBED_STORE`, `CHROMA_STRICT`)
   - Calls `createVectorStoreClient()` from `utils/chroma-client.ts`
   - Performs health check with retry/backoff
   - Falls back to DuckDB if ChromaDB unavailable and fallback allowed
   - Processes markdown files → chunks → embeddings → vector store

2. **Vector Store Client** (`utils/chroma-client.ts`):
   - **HTTP Mode**: Connects to ChromaDB via HTTP, performs `/api/v1/heartbeat` check
   - **DuckDB Mode**: Creates local SQLite-compatible database, implements same interface
   - Provides unified `VectorStoreClient` interface regardless of backend

3. **Workflow** (`.github/workflows/kb-index.yml`):
   - Starts ChromaDB service container
   - Waits for health check (up to 60s)
   - Runs ingestion with `CHROMA_STRICT=1` (fails fast if ChromaDB unavailable)
   - Caches `.kb_index/` directory for faster subsequent runs

## Implementation Details

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CHROMA_URL` | `http://127.0.0.1:8000` | ChromaDB HTTP endpoint |
| `CHROMA_HOST` | `127.0.0.1` | ChromaDB host (for URL construction) |
| `CHROMA_PORT` | `8000` | ChromaDB port |
| `CHROMA_STRICT` | `false` | If `true`, fail fast if ChromaDB unavailable (CI mode) |
| `LOCAL_EMBED_STORE` | `chroma-http` | Store mode: `chroma-http` or `duckdb` |
| `KB_DRY_RUN` | `false` | If `true`, skip embeddings and vector store writes |
| `CI` | - | Set automatically by GitHub Actions |

### Package Scripts

- `pnpm kb:ingest`: Standard ingestion (uses `CHROMA_URL` or falls back to DuckDB)
- `pnpm kb:ingest:ci`: CI mode (`CHROMA_STRICT=1`, fails if ChromaDB unavailable)
- `pnpm kb:ingest:local`: Local development with DuckDB (`LOCAL_EMBED_STORE=duckdb`)

### Health Check Implementation

The `waitForHeartbeat()` function in `utils/chroma-client.ts`:
- Retries up to 6 times with exponential backoff (750ms base, max 30s)
- Adds jitter (random 0-500ms) to prevent thundering herd
- Logs structured information for debugging
- Returns `HeartbeatResult` with success status and timing

## Runbook

### Starting ChromaDB Locally

```bash
# Start ChromaDB service
docker-compose -f docker-compose.chroma.yml up -d

# Verify it's running
curl http://127.0.0.1:8000/api/v1/heartbeat

# View logs
docker-compose -f docker-compose.chroma.yml logs -f chroma
```

### Running Ingestion Locally

```bash
# With ChromaDB (default)
export OPENAI_API_KEY=sk-...
pnpm kb:ingest

# With DuckDB (no Docker required)
export OPENAI_API_KEY=sk-...
pnpm kb:ingest:local

# Dry run (no embeddings, no writes)
KB_DRY_RUN=1 pnpm kb:ingest
```

### Testing CI Locally with `act`

```bash
# Install act (https://github.com/nektos/act)
brew install act  # macOS
# or: https://github.com/nektos/act#installation

# Run the workflow locally
act -j index --secret OPENAI_API_KEY=sk-... --eventpath .github/workflows/kb-index.yml

# With specific event
act push -j index --secret OPENAI_API_KEY=sk-...
```

### Troubleshooting CI Failures

1. **ChromaDB not starting**:
   - Check service container logs in GitHub Actions
   - Verify Docker image is accessible: `ghcr.io/chroma-core/chroma:latest`
   - Check health check step output

2. **Connection refused**:
   - Verify `CHROMA_URL=http://127.0.0.1:8000` is set
   - Check service container is healthy before ingestion step
   - Review wait-for-health-check step logs

3. **Heartbeat timeout**:
   - Increase retry count in `waitForHeartbeat()` if needed
   - Check ChromaDB container resource limits
   - Verify network connectivity between runner and service

### Rotating OpenAI API Key

1. Update GitHub secret: `Settings → Secrets and variables → Actions → OPENAI_API_KEY`
2. Re-run failed workflows or trigger manually
3. No code changes required

### Restarting ChromaDB Service

**Local**:
```bash
docker-compose -f docker-compose.chroma.yml restart chroma
```

**CI**: Service containers are ephemeral and restart automatically on each workflow run.

## Verification Checklist

### Pre-Merge
- [ ] `docker-compose.chroma.yml` starts ChromaDB successfully
- [ ] Local ingestion works with ChromaDB: `pnpm kb:ingest`
- [ ] Local ingestion works with DuckDB: `pnpm kb:ingest:local`
- [ ] Dry-run mode works: `KB_DRY_RUN=1 pnpm kb:ingest`
- [ ] Health check retry logic works (simulate failure)
- [ ] `act` workflow test passes (if available)

### Post-Merge
- [ ] GitHub Actions workflow completes successfully
- [ ] ChromaDB service container starts and passes health check
- [ ] Ingestion step completes without `ECONNREFUSED` errors
- [ ] Index manifest is uploaded as artifact
- [ ] Cache is saved for subsequent runs

### Ongoing Monitoring
- [ ] Monitor workflow success rate (target: >95%)
- [ ] Track ingestion duration (should be <5min for incremental)
- [ ] Verify cache hit rate (should be >90% for unchanged files)
- [ ] Check OpenAI API costs (should be minimal with caching)

## Rollback Plan

### Immediate Rollback (if workflow breaks)

1. **Disable workflow** (temporary):
   - Edit `.github/workflows/kb-index.yml`
   - Add `if: false` to the job or disable the trigger

2. **Revert code changes**:
   ```bash
   git revert <commit-hash>
   # Or restore from backup branch
   ```

3. **Manual ingestion** (if needed):
   - Run ingestion locally
   - Upload artifacts manually if required

### Partial Rollback (keep improvements, disable service)

1. Remove service container from workflow
2. Set `LOCAL_EMBED_STORE=duckdb` in workflow env
3. This uses DuckDB fallback (no external service needed)

### Safety Notes

- **No runtime app changes**: All changes are in ingestion scripts and CI workflows
- **Backward compatible**: Existing local setups continue to work
- **Secrets remain secure**: No secrets committed to repository
- **Graceful degradation**: DuckDB fallback ensures ingestion can always run

## Risks & Mitigations

### Risk 1: OpenAI Rate Limits
**Impact**: Ingestion fails or slows significantly  
**Mitigation**:
- Exponential backoff with jitter in `createEmbeddings()`
- Batch size reduced in CI (`EMBED_BATCH_SIZE_CI=128`)
- Embedding cache reduces API calls (90%+ hit rate expected)
- `p-retry` library handles transient failures

### Risk 2: Network Flakiness
**Impact**: ChromaDB connection fails intermittently  
**Mitigation**:
- Health check with retry/backoff (6 attempts, exponential)
- Jitter prevents synchronized retries
- `CHROMA_STRICT=1` in CI fails fast (avoids hanging)
- DuckDB fallback available for local development

### Risk 3: Docker Hub/Image Registry Outage
**Impact**: Cannot pull ChromaDB image in CI  
**Mitigation**:
- Use GitHub Container Registry (`ghcr.io`) which is more reliable
- Image is cached by GitHub Actions
- DuckDB fallback available (`LOCAL_EMBED_STORE=duckdb`)
- Workflow can be temporarily switched to DuckDB mode

### Risk 4: ChromaDB Container Resource Limits
**Impact**: Container OOM or CPU throttling  
**Mitigation**:
- Health check ensures container is ready before use
- Timeout prevents infinite waiting
- Logs captured for debugging
- Can increase resource limits in workflow if needed

### Risk 5: Cache Corruption
**Impact**: Stale or invalid embeddings in cache  
**Mitigation**:
- Cache key includes content hash, model, and tokenizer
- File registry tracks file changes via `bytesSha256`
- `--nocache` flag available for determinism testing
- Cache can be cleared by deleting `.kb_index/.embedding_cache/`

## Post-Merge Checklist

1. **Monitor first workflow run**:
   - Verify ChromaDB service starts
   - Check health check passes
   - Confirm ingestion completes

2. **Verify artifacts**:
   - Index manifest uploaded
   - Cache saved for next run

3. **Update documentation** (if needed):
   - Add any environment-specific notes
   - Document any new troubleshooting steps

4. **Team communication**:
   - Notify team of new Docker requirement for local dev
   - Share `docker-compose.chroma.yml` usage
   - Update onboarding docs if needed

## References

- ChromaDB Documentation: https://docs.trychroma.com/
- GitHub Actions Service Containers: https://docs.github.com/en/actions/using-containerized-services
- DuckDB: https://duckdb.org/
- OpenAI Embeddings API: https://platform.openai.com/docs/guides/embeddings


