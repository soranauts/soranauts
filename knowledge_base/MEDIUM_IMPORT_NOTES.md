# Medium Post Import - Important Notes

## ⚠️ Newer Posts Override Older Ones

**Critical behavior**: When importing Medium posts, **newer posts automatically override older versions** to ensure the knowledge base always has the most recent and accurate information for Soranauts blog writing.

### How it works:
1. **Posts are sorted by date** (newest first) during import
2. **Update detection**: If a post URL has been imported before, but the new version has a later publish date, it will automatically re-import and override the older version
3. **State tracking**: The system tracks when each post was last fetched to detect updates

### Example:
- Post imported on Nov 1, 2024 with publish date: Oct 15, 2024
- Same post updated on Medium with new publish date: Nov 5, 2024
- Next import will detect the newer date and automatically re-import the updated version

## Import Methods

### 1. RSS Feed (Default - Recent Posts Only)
```bash
pnpm --filter @soranauts/web kb:sync:medium
```
- Gets latest ~10 posts from RSS feed
- Fast and reliable
- Used by CI for regular updates

### 2. Archive Scraping (Attempts All Posts)
```bash
pnpm --filter @soranauts/web kb:sync:medium:archive
```
- Tries multiple approaches:
  - Main publication page
  - Archive/latest pages
  - RSS feed
- **Limitation**: Medium's archive pages load content via JavaScript, so HTML scraping can only get what's in initial HTML (usually just RSS feed URLs)
- May need to use Option 3 for complete historical import

### 3. Manual URL List (Most Reliable for Historical)
```bash
pnpm --filter @soranauts/web kb:sync:medium --urls knowledge_base/scripts/config/medium_urls.txt
```

**How to get historical post URLs:**

**Option A: Manual Collection**
1. Visit `https://sora-xor.medium.com`
2. Browse through older posts (scroll down or use archive)
3. Copy post URLs into `knowledge_base/scripts/config/medium_urls.txt`

**Option B: Medium Data Export**
1. Go to Medium Settings → Account → "Download your information"
2. Request data export
3. Extract post URLs from the export
4. Add to `medium_urls.txt` (one URL per line)

**Option C: Browser Extension/Bookmarklet**
- Use a browser extension to extract all links from Medium publication pages
- Save as text file

## Current Status

**Posts imported**: 10 (from RSS feed)

**For complete historical import:**
- The archive scraper found 10 URLs (from RSS)
- Medium's archive pages require JavaScript rendering (not accessible via simple HTML scraping)
- **Recommended**: Use Option 3 (URL list) for reliable historical import

## State Management

The system tracks:
- `lastGuids`: Array of post URLs that have been imported
- `lastFetched`: Object mapping URLs to their last fetch date (for update detection)

This ensures:
- No duplicate imports
- Automatic updates when posts are revised on Medium
- Newest content always takes precedence










