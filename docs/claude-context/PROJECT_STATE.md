# Soranauts Project State

> **Last Updated:** 2026-01-15 (after open-source prep)
> **Data Source:** Extracted from codebase on 2026-01-15

---

## Quick Reference (Verified)

| Metric | Value | Verification Command |
|--------|-------|---------------------|
| Glossary terms | 384 canonical | `jq '.terms \| length' apps/web/public/data/glossary.v2025.json` |
| Aliases | 1 | `jq 'length' apps/web/public/glossary.aliases.v2025.json` |
| MDX glossary pages | 179 | `ls apps/web/src/content/glossary/*.mdx \| wc -l` |
| Categories | 18 | `jq '[.terms[].category] \| unique \| length'` |
| Blog posts | 45 | `ls apps/web/src/content/post/*.mdx \| wc -l` |
| Docs pages | 26 | `find apps/web/src/content/docs -name "*.mdx" \| wc -l` |
| Total commits | 642 | `git rev-list --count HEAD` |
| Local branches | 1 (main) | `git branch \| wc -l` |
| Remote branches | 3 | `git branch -r \| wc -l` |
| Tags | 5 | `git tag -l \| wc -l` |
| CI workflows | 15 | `ls .github/workflows/*.yml \| wc -l` |

---

## Current Status

**Phase:** Ready for Open-Source Launch 🚀

**Release:** v1.0.0 (tag created, pending GitHub release)

### What Works

- [x] Production site: https://soranauts.com
- [x] Glossary system: 384 terms, 18 categories
- [x] Build: 667 pages in 16.80s
- [x] CI workflows: 15 active workflows
- [x] E2E tests: 15 test files
- [x] Security: All CVEs resolved
- [x] Repository: Clean, ready for public

### Completed (Today)

- [x] Branch cleanup (39 → 1 local, 3 remote)
- [x] Tag cleanup (25 → 5)
- [x] Root directory cleanup (48 files moved, 7 deleted)
- [x] README refresh
- [x] Security audit passed
- [x] v1.0.0 tag created

### Known Issues

- [ ] 61 TODO comments in `apps/web/src/`
- [ ] 1 FIXME comment in `apps/web/src/`
- [ ] MDX pages (179) vs canonical terms (384) mismatch — some terms may not have dedicated MDX pages
- [ ] pnpm.overrides for h3/diff — remove after Astro update

---

## Tags

| Tag | Date | Purpose |
|-----|------|---------|
| v1.0.0 | 2026-01-15 | Official open-source launch |
| v2025.2.0 | 2025-12-02 | Previous release |
| v2025.1.1-homepage-redesign | 2025-12-02 | Homepage feature |
| glossary-v2025-release | 2025-11-27 | Glossary v2025 milestone |
| release/glossary-canonical-20251129-041236 | 2025-11-29 | Canonical URLs release |

---

## Recent Activity

| Hash | Date | Description |
|------|------|-------------|
| 01c2569 | 2026-01-15 | docs: add v1.0.0 release notes |
| f544970 | 2026-01-15 | chore: remove personal paths from documentation |
| 6bdfb5f | 2026-01-15 | chore: remove tracked .env.local, add to gitignore |
| 5abd9fe | 2026-01-15 | chore: clean up root directory for open-source launch |
| d22304a | 2026-01-15 | docs(readme): refresh for open-source launch |
| d58ba4b | 2026-01-15 | fix(deps): resolve h3 and diff security vulnerabilities |
| 133c859 | 2026-01-15 | fix(deps): resolve CVE-2026-22774 (devalue DoS vulnerability) |
| cd54f58 | 2026-01-14 | chore(deps): batch update all dependencies (#47) |
| ac9d8c7 | 2026-01-13 | fix(deps): resolve CVE-2025-15284 (qs) and CVE-2026-22028 (preact) |
| 5c17ad4 | 2026-01-13 | content: update glossary term count from 369 to 370 on homepage |

---

## Key Files

| File | Purpose | Verified |
|------|---------|----------|
| `apps/web/public/data/glossary.v2025.json` | Canonical glossary terms (384) | Yes |
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
