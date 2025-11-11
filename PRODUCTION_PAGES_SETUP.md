# Production Pages Setup

## Current Production Configuration

### `/features`
- **File:** `apps/web/src/pages/features.astro`
- **Layout:** `PageLayout.astro` (full-featured design with Stats, ItemGrid, Timeline widgets)
- **Status:** ✅ Correct - standalone .astro file

### `/changelog`
- **File:** `apps/web/src/pages/changelog.astro`
- **Layout:** `PageLayout.astro` (full-featured design with Stats, ItemGrid, Timeline widgets)
- **Status:** ⚠️ Route collision - both `changelog.astro` and `changelog.md` exist
- **Action Needed:** Remove or archive `changelog.md` (the .astro file takes precedence in production)

### `/improvements`
- **File:** `apps/web/src/pages/improvements.md`
- **Layout:** `MarkdownLayout.astro` (simple markdown layout)
- **Redirect:** `/improvements` → `/changelog` (configured in `astro.config.mjs`)
- **Status:** ✅ Correct - redirects to changelog as intended

## Configuration Files

### `apps/web/astro.config.mjs`
```javascript
const siteRedirects = {
  '/improvements': '/changelog',
};

const redirects = {
  ...generatedRedirects,
  ...siteRedirects,
};
```

### Route Resolution Priority
1. `.astro` files take precedence over `.md` files
2. Astro redirects are processed before route matching
3. So `/improvements` redirects to `/changelog` before any file matching

## Summary

- ✅ `/features` - Uses `features.astro` (PageLayout)
- ✅ `/changelog` - Uses `changelog.astro` (PageLayout) - `.md` file should be archived/removed
- ✅ `/improvements` - Redirects to `/changelog` via Astro config


