# Medium Import Status

## Current Status

**URL List File**: `knowledge_base/scripts/config/medium_urls.txt`
- **Total URLs**: 143
- **Duplicates Found**: 6 (removed)
- **Unique URLs**: 137

**Already Imported** (from RSS feed):
- SORA Ecosystem Updates #82-88
- SORA v3 Stage II
- The Fujiwara Testnet
- SORA 2024 Year in Review

## Important: Newer Posts Override Older Ones

**Critical Behavior**: The import process ensures that:
1. **File order**: URLs are in order oldest→newest (as you specified)
2. **Processing order**: Script reverses to process newest first
3. **Override logic**: When duplicates exist, newer posts (later in file) override older ones
4. **Update detection**: Posts with newer publish dates automatically re-import

This ensures the knowledge base always has the **most recent and accurate information** when writing or editing blog posts on Soranauts.

## Rate Limiting

Medium has rate limits that require:
- **1 request per 2 seconds** (minimum)
- Exponential backoff on 429 errors
- Reduced concurrency (1 at a time)

For 137 posts, expect approximately **4-5 minutes** of processing time.

## Running the Import

```bash
export OPENAI_API_KEY="sk-proj-..."
pnpm --filter @soranauts/web kb:sync:medium --urls knowledge_base/scripts/config/medium_urls.txt
```

The script will:
- ✅ Normalize URLs (handles both `medium.com/sora-xor` and `sora-xor.medium.com` formats)
- ✅ Remove duplicates (keeps newest occurrence)
- ✅ Process newest first (ensures override)
- ✅ Skip already imported posts
- ✅ Retry on rate limit errors
- ✅ Track state to prevent re-imports

## Progress

After the import completes, you'll have:
- All historical Medium posts from the URL list
- Most recent versions of each post
- Complete provenance metadata
- Ready for knowledge base ingestion













