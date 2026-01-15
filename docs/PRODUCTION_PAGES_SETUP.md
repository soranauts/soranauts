# Production Pages Setup

## Current Production Configuration

### `/features`
- **File:** `apps/web/src/pages/features.astro`
- **Layout:** `PageLayout.astro` (full-featured design with Stats, ItemGrid, Timeline widgets)
- **Status:** ✅ Correct - standalone .astro file

### `/changelog`
- **File:** `apps/web/src/pages/changelog.md`
- **Layout:** `MarkdownLayout.astro` (simple markdown layout)
- **Status:** ✅ Canonical changelog page (matches live site)

### `/improvements`
- **File:** _none_ (handled via redirect only)
- **Redirect:** `/improvements` → `/changelog` (configured in `astro.config.mjs`)
- **Status:** ✅ Correct - direct visits are forwarded to `/changelog`

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
1. Astro redirects are processed before route matching  
2. If no redirect applies, route files are resolved normally (`.astro` or `.md`)  
3. For `/improvements`, the redirect fires first, so the markdown changelog is always served

## Summary

- ✅ `/features` — Uses `features.astro` (PageLayout)  
- ✅ `/changelog` — Uses `changelog.md` (MarkdownLayout)  
- ✅ `/improvements` — Redirects to `/changelog` via Astro config; no standalone page file  






