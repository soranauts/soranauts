# Post-Launch Maintenance Playbook — Nexus Glossary V2025

**Status:** STABLE  
**Lock:** Active  
**Version:** V2025.1.0  
**Next Scheduled Review:** Q1 2026

---

## Purpose

Provide a lightweight, durable operational framework for keeping the Nexus Glossary stable, fast, and accurate after the V2025 release. This playbook assumes the system is locked (Phase 13) and uses the monitoring & SLO infrastructure created in Phase 14.

**Use this playbook unless/until system is unlocked.**

---

## Daily Tasks (≤ 5 min)

### 1. Review Nightly SLO Report

Check the GitHub issue or artifact from `ops-budgets.yml`:

- **LCP** — Should be ≤ 2.0s (glossary), ≤ 2.2s (explorer)
- **INP** — Should be p75 ≤ 150ms
- **CLS** — Should be ≤ 0.02
- **Bundle budgets** — JS ≤ 150KB, CSS ≤ 50KB
- **Uptime** — Glossary/Explorer availability

### 2. Check Local Summary

```bash
pnpm monitor:report
```

Review the generated `monitoring-report.md` for any warnings or breaches.

### 3. Handle SLO Breach

If any SLO is breached:

1. Label the GitHub issue: `ops-breach`
2. Evaluate severity (see [OPERATIONS_SLOS.md](./OPERATIONS_SLOS.md))
3. Determine if rollback is required (see [RELEASE_LOCK_V2025.md](./RELEASE_LOCK_V2025.md))

---

## Weekly Tasks

### 1. Run Link Auditor

```bash
pnpm audit:features-links
```

Review `glossary-link-fixes.md` for any broken links. Apply fixes if needed:

```bash
pnpm audit:features-links --write
```

### 2. Run Content Gap Finder

```bash
pnpm content:gaps
```

Review `content-gaps-report.md` for new gaps from search misses or 404 patterns.

### 3. Commit Glossary Snapshot

Runs automatically via CI (`snapshot.yml`). Manual override if needed:

```bash
pnpm ops:snapshot
```

### 4. Review Dependabot Updates

- ✅ **Apply** minor/patch updates
- ⏸️ **Defer** major updates unless lock is waived
- 🔒 **Blocked** by lock: Astro, Tailwind, React, Playwright majors

---

## Monthly Tasks

### 1. Manual Deep QA

| Check | Count | Method |
|-------|-------|--------|
| Random terms | 30 | Visual inspection |
| Alias redirects | 10 | Browser navigation |
| Quick-View deep-link | 5 | `?term=<slug>` |
| Explorer journeys | 3 | End-to-end flow |
| Dark mode sweep | All pages | Toggle and inspect |

### 2. Review Content Lint Report

```bash
pnpm content:lint
```

Address any new warnings or errors.

### 3. Update Roadmap Progress

Edit [ROADMAP_Q1_2026.md](./ROADMAP_Q1_2026.md) with milestone updates.

### 4. Confirm OG Images

Ensure OG images are up-to-date for top 50 terms:

```bash
pnpm og:generate
```

---

## Adding New Glossary Terms

### Allowed (Locked Mode)

| Change | Allowed |
|--------|---------|
| New MDX terms following schema | ✅ Yes |
| Tagline additions | ✅ Yes |
| Summary improvements | ✅ Yes |
| Related-term updates | ✅ Yes |
| Tag additions | ✅ Yes |

### Not Allowed (Requires Unlock)

| Change | Allowed |
|--------|---------|
| Renaming slugs | ❌ No |
| Changing category lists | ❌ No |
| Modifying schema | ❌ No |
| Adding new routing | ❌ No |
| Adding new layouts | ❌ No |

---

## Author Workflow

### 1. Create MDX from Snippet

Use the term template in [AUTHORING_GUIDE.md](./AUTHORING_GUIDE.md).

### 2. Validate Content

```bash
pnpm content:fix
pnpm content:validate
pnpm glossary:build
```

### 3. Preview Term

```bash
pnpm author:preview <slug>
```

### 4. Create Pull Request

Requirements:
- Must pass `content-ci` workflow
- Must attach lint report artifact (auto-generated)
- Must not modify locked files

---

## Performance Guardrails

| Metric | Target | Hard Limit |
|--------|--------|------------|
| LCP /glossary | ≤ 2.0s | 2.5s |
| LCP /explore | ≤ 2.2s | 2.7s |
| INP p75 | ≤ 150ms | 200ms |
| CLS | ≤ 0.02 | 0.05 |
| JS bundle | Budget | +30% |
| CSS bundle | Budget | +25% |

If any hard limit is breached, rollback is required.

---

## Rollback Procedure (Quick)

### 1. Revert Last Commit

```bash
git revert -m 1 HEAD
```

### 2. Deploy to Production

```bash
pnpm release:prod
```

### 3. Verify Live Site

```bash
pnpm glossary:verify:live https://soranauts.com
```

### 4. Document

Add entry to [RELEASE_LOCK_V2025.md](./RELEASE_LOCK_V2025.md) changelog.

---

## Incident Response

### If SLO Breach Detected

1. **Review** the `ops-budgets` GitHub issue
2. **Confirm** regression via local testing
3. **Decide** action:
   - **Trivial fix** → Apply targeted patch
   - **Complex issue** → Rollback immediately
4. **Log** follow-up in [RELEASE_LOCK_V2025.md](./RELEASE_LOCK_V2025.md)

### Severity Levels

| Level | Response Time | Action |
|-------|---------------|--------|
| P1 (Down) | 15 min | Rollback |
| P2 (Degraded) | 1 hour | Investigate + fix |
| P3 (Minor) | 4 hours | Patch |
| P4 (Cosmetic) | Next sprint | Schedule |

---

## Release Cycle (Frozen)

| Change Type | Approval | Timeline |
|-------------|----------|----------|
| Minor content updates | None | Anytime |
| Medium UX changes | Unlock approval | Scheduled |
| Major structural work | Roadmap cycle | Q2+ |

---

## Unlocking the System (Rare)

### When Allowed

- New roadmap cycle begins
- Major glossary/i18n update planned
- Critical architectural fix required

### Unlock Steps

1. **Edit** [RELEASE_LOCK_V2025.md](./RELEASE_LOCK_V2025.md):
   ```
   Status: UNLOCKED
   Unlock Date: YYYY-MM-DD
   Reason: [description]
   ```

2. **Notify** all maintainers

3. **Lift** main-branch restrictions temporarily

4. **Begin** new Phase sequence

5. **Re-lock** when complete

---

## End-of-Life & Migration Notes

### Stable for 2025 Cycle

- Per-term JSON files: **Stable**
- Minimal index: May evolve, must remain backward compatible
- Alias map: **Stable**

### Q1 2026 Plans

- Explorer V3 journeys expansion
- i18n groundwork (zh-CN)
- Performance optimization (LCP ≤ 1.5s)

### Deprecation Policy

- 90-day notice for breaking changes
- Migration scripts provided
- Old endpoints maintained during transition

---

## Quick Reference

### Essential Commands

```bash
# Daily
pnpm monitor:report

# Weekly
pnpm audit:features-links
pnpm content:gaps
pnpm ops:snapshot

# Monthly
pnpm content:lint
pnpm og:generate

# Authoring
pnpm content:fix
pnpm content:validate
pnpm glossary:build
pnpm author:preview <slug>

# Emergency
git revert -m 1 HEAD
pnpm release:prod
pnpm glossary:verify:live <url>
```

### Key Documents

| Document | Purpose |
|----------|---------|
| [RELEASE_LOCK_V2025.md](./RELEASE_LOCK_V2025.md) | Lock status and rules |
| [OPERATIONS_SLOS.md](./OPERATIONS_SLOS.md) | SLOs and budgets |
| [ROADMAP_Q1_2026.md](./ROADMAP_Q1_2026.md) | Future plans |
| [AUTHORING_GUIDE.md](./AUTHORING_GUIDE.md) | Content creation |
| [EXPERIMENTS.md](./EXPERIMENTS.md) | UX testing |

### Contacts

| Role | Contact |
|------|---------|
| Primary On-Call | TBD |
| Secondary On-Call | TBD |
| Content Lead | TBD |
| Engineering Lead | TBD |

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| Dec 2025 | Initial playbook | Phase 14 |

---

*Nexus Glossary V2025: STABLE — Use this playbook unless/until system is unlocked.*

