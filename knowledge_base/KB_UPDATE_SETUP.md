# Knowledge Base Update - Setup Guide

## Current Status

- **Last successful ingestion:** November 5, 2025
- **Files needing update:** 81 files modified since last ingestion
- **Existing Chroma SQLite:** 356MB file exists at `knowledge_base/.kb_index/chroma.sqlite3`

## Issue Summary

Both vector store options require additional setup:

1. **DuckDB v1.4.2:** The `connect()` callback is not firing (native binding issue)
2. **Chroma:** Requires HTTP server (Docker or Python server setup)

## Solution: Install Docker and Start Chroma

### Step 1: Install Docker Desktop

1. Download Docker Desktop for Mac: https://www.docker.com/products/docker-desktop/
2. Install the `.dmg` file
3. Start Docker Desktop application
4. Wait for Docker to fully start (whale icon in menu bar)

### Step 2: Start Chroma Server

```bash
# From the repository root
docker-compose -f docker-compose.chroma.yml up -d
```

### Step 3: Verify Chroma is Running

```bash
# Wait a few seconds, then check:
curl http://127.0.0.1:8000/api/v1/heartbeat

# Should return: {"nanosecond heartbeat": <timestamp>}
```

### Step 4: Run Knowledge Base Ingestion

```bash
# Make sure OPENAI_API_KEY is set in .env file
bash knowledge_base/scripts/update-kb.sh
```

## Alternative: Fix DuckDB (Advanced)

If you prefer to use DuckDB instead of Chroma:

1. **Downgrade DuckDB:**
   ```bash
   pnpm remove duckdb
   pnpm add duckdb@1.3.0
   ```

2. **Or investigate the native binding issue:**
   - The `connect()` callback may need different handling
   - Check DuckDB Node.js GitHub issues: https://github.com/duckdb/duckdb-nodejs

## Troubleshooting

### Docker Issues

- **"Docker not running":** Start Docker Desktop application
- **"Port 8000 in use":** Stop other services using port 8000 or change port in `docker-compose.chroma.yml`
- **"Permission denied":** Ensure Docker Desktop is running and you have permissions

### Chroma Connection Issues

- **"Heartbeat failed":** Wait longer for Chroma to start (can take 10-30 seconds)
- **"Connection refused":** Check Docker container: `docker ps` should show `soranauts-chroma` running

### Ingestion Issues

- **"OPENAI_API_KEY not set":** Add it to `.env` file in repo root
- **"Out of API credits":** Check OpenAI account usage
- **"Timeout errors":** Increase `REQUEST_TIMEOUT` in `.env` if needed

## Files That Will Be Updated

The ingestion will process 81 modified files, including:
- `knowledge_base/curated/research/bck21/*` (12 files)
- `knowledge_base/curated/research/bck22/*` (10 files)
- Plus 59 other modified files

## Next Steps After Ingestion

Once ingestion completes:
1. Vector embeddings will be updated in Chroma
2. BM25 search index will be updated
3. Embedding cache will be populated for faster future runs
4. Knowledge base will be ready for RAG queries

