# What Does Ingestion Do?

The `kb:ingest` script transforms your raw markdown files into a searchable knowledge base. Here's exactly what happens:

## 📋 Step-by-Step Process

### 1. **File Discovery**
- Scans `knowledge_base/` directory recursively
- Finds all `.md` and `.mdx` files
- Ignores: `node_modules/`, `.git/`, `index/`, `snapshots/`
- **Result**: List of files to process (e.g., 16 files from Soramitsu, Medium, Iroha)

### 2. **File Parsing & Normalization**
For each markdown file:
- Reads the file content
- Parses front-matter (metadata like `title`, `source_url`, `snapshot_id`)
- Normalizes text (consistent whitespace, line endings)
- Computes SHA256 hash of normalized content
- **Purpose**: Detect if file changed since last run (delta re-indexing)

### 3. **Token-Aware Chunking**
- Splits each document into smaller chunks using `tiktoken`
- **Chunk size**: ~450 tokens (target), 15% overlap between chunks
- **Range**: 200-1200 tokens per chunk (configurable)
- Each chunk gets:
  - Unique ID: `{slug}::{content_hash}::{model}::tok={tokenizer}::chunk-{start}-{end}`
  - Token boundaries (start/end)
  - Character boundaries (for reference)
  - Source metadata (URL, snapshot, etc.)

**Example**: A 2000-token document becomes ~4-5 chunks

### 4. **Embedding Generation**
- Sends chunks to OpenAI Embeddings API in batches (256 chunks at a time)
- **Model**: `text-embedding-3-large` (3072 dimensions) or `text-embedding-3-small` (1536 dims)
- **Result**: Vector embeddings (arrays of numbers) representing semantic meaning
- **Cost tracking**: Estimates API cost in real-time

### 5. **Delta Re-indexing (Smart Updates)**
- Compares file hashes with previous run
- **Unchanged files**: Skips entirely (no API calls!)
- **Changed files**: Deletes old chunks, creates new ones
- **Deleted files**: Removes their chunks from the index
- **Result**: Only processes what actually changed

### 6. **Vector Database Storage (ChromaDB)**
- Upserts (inserts or updates) chunks into ChromaDB:
  - Chunk ID
  - Embedding vector (for semantic search)
  - Text content
  - Metadata (source, URL, snapshot, tokens, etc.)
- **Location**: `knowledge_base/index/` (local ChromaDB instance)

### 7. **Metadata & Sidecar Files**
- Saves extended metadata to `.meta/` directory
- Updates file registry (tracks which files have which chunks)
- Generates `index/manifest.json` with:
  - Schema version
  - Embedding model used
  - Tokenizer version
  - Chunk configuration
  - Timestamp

### 8. **Metrics & Summary**
- Outputs console table:
  - Documents processed
  - New chunks written
  - Chunks deleted (stale)
  - Unchanged files skipped
  - API cost estimate
  - Duration
- Saves metrics as JSON for CI artifacts

## 🎯 End Result

After ingestion, you have:

1. **Searchable Vector Database** (ChromaDB)
   - All document chunks with semantic embeddings
   - Enables "find similar content" queries

2. **Metadata Tracking**
   - File registry (what changed when)
   - Snapshot metadata (provenance)
   - Chunk mappings (which chunks belong to which files)

3. **Deterministic Index**
   - Same content = same chunk IDs
   - Reproducible across runs
   - Audit-ready with full provenance

## 💡 Why This Matters

### Before Ingestion:
- Raw markdown files sitting in folders
- No way to search semantically
- No connection between related content

### After Ingestion:
- Query: "How does Iroha handle consensus?"
- System finds relevant chunks from multiple sources
- Returns ranked results with source URLs
- Hybrid retrieval (vector + BM25) for best results

## 🔄 Incremental Updates

**First run**:
- Processes all files
- Creates all embeddings
- Full cost (~$0.01-0.03 for 90 docs)

**Subsequent runs** (every 3 days):
- Only processes changed files
- Skips unchanged files (304 Not Modified)
- Minimal cost (often $0 if nothing changed)

**Example**: If only 1 Medium post changed, you only pay for embedding that one file!

## 📊 What You See During Ingestion

```
Building index...
Found 16 markdown files
Processing files...
  ✓ knowledge_base/soramitsu_site/page1.md
  ✓ knowledge_base/ecosystem_updates/post1.md
  ...

Processed 16 files into 180 chunks

Generating embeddings for 180 chunks...
  Processed 256/180 chunks...
Generated 180 embeddings

Upserting chunks to ChromaDB...
✓ Ingestion complete!

=== Ingestion Summary ===
┌─────────────┬───────┐
│ documents   │ 16    │
│ new         │ 180   │
│ updated     │ 0     │
│ unchanged   │ 0     │
│ snapshot    │ 2025-11-02 │
└─────────────┴───────┘

Cost estimate: $0.0234
Duration: 12.5s
```

## 🚀 Next Steps After Ingestion

Once ingestion completes, you can:

1. **Query the knowledge base**:
   ```bash
   pnpm kb:retrieve "Iroha consensus" --hybrid --limit 5
   ```

2. **Test retrieval quality**:
   ```bash
   pnpm kb:test:retrieval
   ```

3. **Backtest articles**:
   ```bash
   pnpm kb:backtest --articles "apps/web/src/content/post/**/*.md"
   ```

## 💰 Cost Breakdown

**Typical ingestion costs** (90 documents):
- Embedding model: `text-embedding-3-large`
- Tokens: ~50K-100K tokens
- Cost: ~$0.0065-0.013 per full run
- **Monthly** (every 3 days): ~$0.07-0.13

**With small model**: ~$0.001-0.002 per run (~$0.01-0.02/month)

The system is designed to be cost-efficient through delta re-indexing and smart caching!
















