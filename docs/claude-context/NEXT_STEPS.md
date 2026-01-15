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
| Uncommitted | `git status` | 2 (this context system) |
| TODO comments | `grep -r "TODO" apps/web/src/` | 61 |
| FIXME comments | `grep -r "FIXME" apps/web/src/` | 1 |

---

## Immediate (From git status)

| Task | Priority | Source |
|------|----------|--------|
| Commit claude-context files | P0 | `git status` |

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

## Planned (Open-Source Prep)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Branch cleanup (39 → ~5) | P1 | Pending |
| 2 | Tag cleanup (25 tags) | P2 | Pending |
| 3 | v1.0.0 release | P0 | Pending |
| 4 | README refresh | P1 | Pending |
| 5 | CONTRIBUTING.md review | P2 | Exists |
| 6 | Issue templates | P2 | Pending |

---

## Completed Recently

| Date | Task | Commit |
|------|------|--------|
| 2026-01-14 | Batch update all dependencies | `cd54f58` |
| 2026-01-14 | Fix verify-glossary-redirects.sh | `b5c7709` |
| 2026-01-14 | Make cache headers test environment-aware | `2a01ae1` |
| 2026-01-14 | Add Playwright browser installation step | `8890c30` |
| 2026-01-14 | Align e2e tests with simplified /explore page | `f6aef3e` |
| 2026-01-13 | Resolve security vulnerabilities (qs, preact) | `ac9d8c7` |
| 2026-01-13 | Update glossary term count to 370 | `5c17ad4` |

---

## Backlog Categories

### Content
- [ ] Backfill glossary summaries (many are "TODO")
- [ ] Add missing MDX pages (370 terms vs 179 MDX files)

### Technical Debt
- [ ] Resolve 61 TODO comments
- [ ] Resolve 1 FIXME comment
- [ ] Clean up backup branches

### Infrastructure
- [ ] Branch cleanup for open-source readiness
- [ ] Tag strategy and cleanup
