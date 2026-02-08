# Soranauts Next Steps

> **Last Updated:** 2026-01-15
> **Sources:** git status, TODO comments, session log

---

## Priority Legend

- P0 — Blocking / Critical
- P1 — High priority
- P2 — Medium priority
- P3 — Low priority / Nice to have

---

## Sources

| Source | Command | Items Found |
|--------|---------|-------------|
| Uncommitted | `git status` | 0 |
| TODO comments | `grep -r "TODO" apps/web/src/` | 61 |
| FIXME comments | `grep -r "FIXME" apps/web/src/` | 1 |

---

## Immediate

| Task | Priority | Status |
|------|----------|--------|
| Create GitHub Release from v1.0.0 tag | P0 | 🔄 Manual step pending |
| Make repository public | P0 | 🔄 Manual step pending |

---

## From TODO Comments

| Task | Priority | Location |
|------|----------|----------|
| Remove temporary ApplyColorMode code | P2 | `apps/web/src/components/common/ApplyColorMode.astro:4` |
| Fix HTMLElementProps type | P3 | `apps/web/src/components/widgets/Hero.astro:13` |
| Fix HTMLElementProps type | P3 | `apps/web/src/components/widgets/Hero2.astro:12` |
| Add summaries to glossary terms | P2 | `apps/web/src/data/glossary.config.ts:103-108+` |

**Note:** Many TODO comments in `glossary.config.ts` are placeholder summaries that need content.

---

## Open-Source Prep — COMPLETED ✅

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Branch cleanup (39 → 1 local) | P1 | ✅ Done |
| 2 | Tag cleanup (25 → 5 tags) | P2 | ✅ Done |
| 3 | v1.0.0 release tag | P0 | ✅ Done |
| 4 | README refresh | P1 | ✅ Done |
| 5 | Root directory cleanup | P1 | ✅ Done |
| 6 | Security audit | P0 | ✅ Done |
| 7 | Remove personal info | P0 | ✅ Done |
| 8 | Fix CVEs (devalue, h3, diff) | P0 | ✅ Done |
| 9 | GitHub repo settings | P2 | ✅ Done |
| 10 | v1.0.0 release notes | P1 | ✅ Done |

---

## Completed Recently

| Date | Task | Commit |
|------|------|--------|
| 2026-01-15 | v1.0.0 release notes | `01c2569` |
| 2026-01-15 | Remove personal paths | `f544970` |
| 2026-01-15 | Remove tracked .env.local | `6bdfb5f` |
| 2026-01-15 | Root directory cleanup | `5abd9fe` |
| 2026-01-15 | README refresh | `d22304a` |
| 2026-01-15 | Fix h3 and diff CVEs | `d58ba4b` |
| 2026-01-15 | Fix devalue CVE | `133c859` |
| 2026-01-14 | Batch update all dependencies | `cd54f58` |
| 2026-01-13 | Resolve security vulnerabilities (qs, preact) | `ac9d8c7` |

---

## Backlog Categories

### Content
- [ ] Backfill glossary summaries (many are "TODO")
- [ ] Add missing MDX pages (384 terms vs 179 MDX files)

### Technical Debt
- [ ] Resolve 61 TODO comments
- [ ] Resolve 1 FIXME comment
- [ ] Remove pnpm.overrides for h3/diff after Astro update

### Post-Launch
- [ ] Issue templates (.github/ISSUE_TEMPLATE/)
- [ ] Discussion templates
- [ ] Community guidelines
