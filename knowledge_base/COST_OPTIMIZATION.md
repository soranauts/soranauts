# Knowledge Base Cost Optimization Guide

## 💰 Cost-Saving Strategies

### 1. Schedule Frequency Adjustment ✅

**Changed**: Nightly sync → Every 3 days
- **Before**: `cron: "17 3 * * *"` (daily at 03:17 UTC)
- **After**: `cron: "0 3 */3 * *"` (every 3 days at 03:00 UTC)
- **Savings**: ~67% reduction in API calls for re-indexing

**Rationale**: Most content sources (Soramitsu site, Medium posts, Iroha docs) don't change daily. Three-day intervals capture updates while reducing costs.

### 2. Delta Re-indexing

The ingestion system already uses delta logic:
- Only processes files with changed `content_sha256`
- Skips unchanged files automatically
- **Cost impact**: Minimal embeddings for actual changes

### 3. Manual Trigger Option

For urgent updates, use `workflow_dispatch`:
```bash
# Trigger via GitHub Actions UI or API
gh workflow run kb-sync.yml
```

### 4. Embedding Model Choice

**Current default**: `text-embedding-3-large` (3072 dims, ~$0.00013/1K tokens)
**Alternative**: `text-embedding-3-small` (1536 dims, ~$0.00002/1K tokens)

**Cost difference**: ~6.5x cheaper per token

**To switch**:
```bash
export EMBED_MODEL="text-embedding-3-small"
pnpm --filter @soranauts/web kb:ingest
```

**Trade-off**: Slightly lower retrieval quality, but often acceptable for most use cases.

### 5. BM25-Only Mode (No Embeddings)

For development/testing, you can use BM25 only:
```bash
export BM25_ENABLED=true
# Skip ingest, use retrieve with --hybrid for BM25-only results
```

**Cost**: $0 (local index, no API calls)

### 6. Batch Size Optimization

**Current**: `EMBED_BATCH_SIZE=256` (default)
- Larger batches = fewer API calls
- Max recommended: 512-1024 (depends on token limits)

### 7. Content Filtering

Add filters to skip unnecessary content:
- **File size limits**: Skip very large files
- **Source filtering**: Only ingest specific sources
- **Date ranges**: Only process recent content

## 📊 Estimated Costs

### Typical Run (90 documents, text-embedding-3-large):
- **Tokens**: ~50K-100K tokens per full run
- **Cost**: ~$0.0065 - $0.013 per run
- **Monthly** (every 3 days): ~$0.065 - $0.13/month

### With text-embedding-3-small:
- **Cost**: ~$0.001 - $0.002 per run
- **Monthly** (every 3 days): ~$0.01 - $0.02/month

### One-time Initial Index:
- **Full corpus** (100-200 docs): $0.01 - $0.03 one-time

## 🔍 Monitoring Costs

Track your usage:
```bash
# Check OpenAI usage dashboard
open https://platform.openai.com/usage
```

The ingestion script logs cost estimates:
```
Cost estimate: $0.0065
```

## ⚙️ Environment Variables

Add to `.env` or CI secrets:
```bash
# Use cheaper model
EMBED_MODEL=text-embedding-3-small

# Optimize batch size
EMBED_BATCH_SIZE=512

# Reduce max tokens per chunk
MAX_CHUNK_TOKENS=800  # Default: 1200
```

## 🎯 Recommended Setup

For **production**:
- Schedule: Every 3 days (✅ implemented)
- Model: `text-embedding-3-large` (best quality)
- Estimated: ~$0.10/month

For **cost-conscious**:
- Schedule: Weekly (`0 3 * * 0`)
- Model: `text-embedding-3-small`
- Estimated: ~$0.01/month

## ⚠️ About Cursor and API Keys

**Cursor does NOT use your OpenAI API key** for editor completions:
- Cursor uses its own infrastructure and API keys
- Your key is only used when explicitly set in environment variables
- The knowledge base scripts use your key when `OPENAI_API_KEY` is set

**To verify**: Check Cursor settings → it should not show your API key unless you explicitly added it for a specific feature.

Your `OPENAI_API_KEY` is only used by:
1. `knowledge_base/scripts/ingest.ts` (when you run it)
2. CI workflows (when `OPENAI_API_KEY` secret is set in GitHub)














