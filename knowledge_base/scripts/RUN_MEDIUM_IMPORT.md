# How to Run Medium Import

## Quick Start

### From Repository Root (Recommended)

```bash
# Navigate to repo root
cd /Users/dustinmatlock/Documents/GitHub/soranauts

# Set API key (if needed)
export OPENAI_API_KEY="sk-proj-..."

# Run the import
pnpm --filter @soranauts/web kb:sync:medium --urls knowledge_base/scripts/config/medium_urls.txt
```

### From Any Directory

```bash
cd /Users/dustinmatlock/Documents/GitHub/soranauts && \
export OPENAI_API_KEY="sk-proj-..." && \
pnpm --filter @soranauts/web kb:sync:medium --urls knowledge_base/scripts/config/medium_urls.txt
```

## What It Does

1. Reads 143 URLs from `knowledge_base/scripts/config/medium_urls.txt`
2. Removes 6 duplicates → 137 unique URLs
3. Reverses order (processes newest first - ensures override)
4. Skips already imported posts (~32 will be skipped)
5. Imports ~105 new posts
6. Respects rate limits (1 request/2 seconds)
7. Retries on 429 errors (3 attempts)

## Expected Output

```
Importing Medium posts...
Reading URLs from: knowledge_base/scripts/config/medium_urls.txt
Found 143 URLs in file (6 duplicates removed, 137 unique)

Processing 137 posts (newest first)...
  Rate limit: 1 request every 2 seconds to respect Medium's limits
  
  https://medium.com/sora-xor/sora-ecosystem-updates-88-june-33-2025-01ffc03a468b
    ⊘ Already imported
  
  https://medium.com/sora-xor/sora-ecosystem-updates-87-may-33-2025-953d81e47581
    ⊘ Already imported
  
  https://medium.com/sora-xor/sora-ecosystem-updates-86-april-25-2025-41f45d241bfb
    ✓ Saved: SORA Ecosystem Updates #86, April 25, 2025
  
  ...

  Progress: 10/137 posts processed...
  Progress: 20/137 posts processed...
  ...

✓ Import complete:
  Processed: 105 (0 updated)
  Skipped: 32
  Errors: 0
  Rate limited: 2 (some may need retry)
  Duration: 287.45s

  ℹ Note: Newer posts automatically override older versions
```

## Time Estimate

- **~105 new posts** to import
- **2 seconds per post** = ~210 seconds minimum
- **Plus retry delays** if rate limited
- **Total: ~4-5 minutes**

## After Import

Once complete, you'll have:
- All historical Medium posts imported
- Newest versions prioritized
- Ready for knowledge base ingestion

Then run:
```bash
pnpm --filter @soranauts/web kb:ingest
```













