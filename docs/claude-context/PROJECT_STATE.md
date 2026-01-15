# Soranauts Project State

> **Last Updated:** 2026-01-15
> **Data Source:** Extracted from codebase on 2026-01-15

---

## Quick Reference (Verified)

| Metric | Value | Verification Command |
|--------|-------|---------------------|
| Glossary terms | 370 canonical | `jq '.terms \| length' apps/web/public/data/glossary.v2025.json` |
| Aliases | 1 | `jq 'length' apps/web/public/glossary.aliases.v2025.json` |
| MDX glossary pages | 179 | `ls apps/web/src/content/glossary/*.mdx \| wc -l` |
| Categories | 18 | `jq '[.terms[].category] \| unique \| length'` |
| Blog posts | 45 | `ls apps/web/src/content/post/*.mdx \| wc -l` |
| Docs pages | 26 | `find apps/web/src/content/docs -name "*.mdx" \| wc -l` |
| Total commits | 634 | `git rev-list --count HEAD` |
| Branches | 39 | `git branch -a \| wc -l` |

---

## Current Status

**Phase:** Pre-Open-Source Launch / Active Development

### What Works

- [x] Production site: https://soranauts.com
- [x] Glossary system: 370 terms, 18 categories
- [x] Build: 667 pages in 16.80s
- [x] CI workflows: 15 active workflows
- [x] E2E tests: 15 test files

### In Progress

- [ ] Branch cleanup (39 branches, many are backups)
- [ ] Tag management (25 tags)

### Known Issues

- [ ] 61 TODO comments in `apps/web/src/`
- [ ] 1 FIXME comment in `apps/web/src/`
- [ ] MDX pages (179) vs canonical terms (370) mismatch — some terms may not have dedicated MDX pages

---

## Recent Activity

| Hash | Date | Description |
|------|------|-------------|
| cd54f58 | 2026-01-14 | chore(deps): batch update all dependencies (#47) |
| b5c7709 | 2026-01-14 | fix(ci): update verify-glossary-redirects.sh for expanded glossary |
| 2a01ae1 | 2026-01-14 | test(e2e): make cache headers test environment-aware |
| 8890c30 | 2026-01-14 | ci(e2e): add Playwright browser installation step |
| f6aef3e | 2026-01-14 | test: align e2e tests with simplified /explore page |
| ac9d8c7 | 2026-01-13 | fix(deps): resolve CVE-2025-15284 (qs) and CVE-2026-22028 (preact) |
| b35d8fe | 2026-01-13 | Update validate-links.ts |
| 5c17ad4 | 2026-01-13 | content: update glossary term count from 369 to 370 on homepage |
| c8fd19e | 2026-01-12 | feat(nav): add /features page to footer and About page |
| fb2dd2e | 2026-01-12 | content: update tag stats, improve website improvements summary |

---

## Key Files

| File | Purpose | Verified |
|------|---------|----------|
| `apps/web/public/data/glossary.v2025.json` | Canonical glossary terms (370) | Yes |
| `apps/web/public/glossary.aliases.v2025.json` | Alias redirects (1) | Yes |
| `apps/web/src/data/taxonomy.ts` | Taxonomy definitions | Yes |
| `apps/web/src/lib/taxonomy.ts` | Taxonomy utilities | Yes |
| `apps/web/vercel.json` | Redirects and headers | Yes |
| `.github/workflows/web-e2e.yml` | E2E test workflow | Yes |

---

## Verification Commands

To re-verify this data:
```bash
# Glossary
cat apps/web/public/data/glossary.v2025.json | jq '.terms | length'
cat apps/web/public/glossary.aliases.v2025.json | jq 'length'

# Content
ls apps/web/src/content/post/*.mdx | wc -l
find apps/web/src/content/docs -name "*.mdx" | wc -l

# Git
git log --oneline -5
git branch -a | wc -l
```
