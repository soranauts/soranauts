# Roadmap — Q1 2026

**Version:** 1.0  
**Created:** December 2025  
**Review Cadence:** Bi-weekly (Thursdays)

---

## Overview

This roadmap covers January–March 2026, focusing on:
1. Content expansion
2. Performance optimization
3. Internationalization groundwork
4. Developer experience improvements

---

## Deliverables

### 1. Content Expansion

**Owner:** Content Team  
**Checkpoint:** Monthly

| Deliverable | Target | Success Metric |
|-------------|--------|----------------|
| P1 terms (10) | Jan 31 | All P1 terms published |
| P2 terms (15) | Feb 28 | All P2 terms published |
| P3 terms (25) | Mar 31 | 25+ P3 terms published |
| Tagline coverage | Mar 31 | 95% of terms have taglines |

**Dependencies:**
- Gap analysis complete (Phase 14)
- Authoring guide available

### 2. Performance Optimization

**Owner:** Engineering  
**Checkpoint:** Bi-weekly

| Deliverable | Target | Success Metric |
|-------------|--------|----------------|
| LCP ≤ 1.5s on /glossary | Feb 15 | Lighthouse score ≥ 95 |
| Bundle size ≤ 100KB JS | Feb 28 | Measured via CI |
| Prefetch hit rate ≥ 80% | Mar 15 | Analytics data |
| CDN cache hit rate ≥ 90% | Mar 31 | Vercel analytics |

**Dependencies:**
- SLO monitoring in place
- Performance budgets enforced

### 3. Internationalization (i18n)

**Owner:** i18n Team + Content  
**Checkpoint:** Monthly

| Deliverable | Target | Success Metric |
|-------------|--------|----------------|
| i18n framework setup | Jan 31 | Build passes with locale |
| zh-CN translations (5 terms) | Feb 28 | Published and QA'd |
| zh-CN translations (15 terms) | Mar 31 | Top 15 terms available |
| Language switcher UI | Mar 31 | Functional on all pages |

**Dependencies:**
- Translation workflow defined
- Native speaker review process

### 4. Developer Experience

**Owner:** Engineering  
**Checkpoint:** Bi-weekly

| Deliverable | Target | Success Metric |
|-------------|--------|----------------|
| Hot reload for MDX | Jan 15 | < 500ms refresh |
| Preview mode improvements | Jan 31 | Author feedback positive |
| VS Code extension | Feb 28 | Published to marketplace |
| CLI authoring tool | Mar 31 | `pnpm term:new <slug>` works |

**Dependencies:**
- Authoring guide complete
- Community feedback collected

---

## Milestones

### M1: January 31

- [ ] P1 content complete (10 terms)
- [ ] i18n framework merged
- [ ] Hot reload working
- [ ] LCP baseline established

### M2: February 28

- [ ] P2 content complete (15 terms)
- [ ] First zh-CN translations live
- [ ] Bundle size target met
- [ ] VS Code extension beta

### M3: March 31 (Q1 Complete)

- [ ] P3 content complete (25 terms)
- [ ] 15 zh-CN translations live
- [ ] Language switcher functional
- [ ] CLI authoring tool released
- [ ] Q2 planning complete

---

## Non-Goals

The following are explicitly **out of scope** for Q1 2026:

| Item | Reason |
|------|--------|
| Routing changes | Release lock in effect |
| Schema changes | Stability priority |
| New feature flags | Simplicity priority |
| Major dependency upgrades | Risk mitigation |
| Real-time collaboration | Scope creep |
| User accounts | Not needed for glossary |
| Comments/ratings | Complexity vs value |

---

## Success Metrics

### Content

| Metric | Current | Q1 Target |
|--------|---------|-----------|
| Total terms | 179 | 230+ |
| Tagline coverage | ~75% | 95% |
| Search miss rate | TBD | < 5% |
| 404 rate | TBD | < 1% |

### Performance

| Metric | Current | Q1 Target |
|--------|---------|-----------|
| LCP /glossary | ~1.8s | ≤ 1.5s |
| Bundle size | ~120KB | ≤ 100KB |
| Lighthouse perf | ~90 | ≥ 95 |
| Prefetch hit rate | TBD | ≥ 80% |

### Developer Experience

| Metric | Current | Q1 Target |
|--------|---------|-----------|
| New term time | ~5 min | < 2 min |
| Preview refresh | ~2s | < 500ms |
| Author satisfaction | TBD | ≥ 4/5 |

### Internationalization

| Metric | Current | Q1 Target |
|--------|---------|-----------|
| Languages | 1 (en) | 2 (en, zh-CN) |
| Translated terms | 0 | 15+ |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Content author availability | Medium | High | Buffer in schedule |
| Translation quality | Medium | Medium | Native speaker review |
| Performance regression | Low | High | CI budgets, monitoring |
| Scope creep | Medium | Medium | Non-goals document |
| Dependency vulnerabilities | Low | High | Dependabot enabled |

---

## Review Schedule

| Date | Focus | Attendees |
|------|-------|-----------|
| Jan 9 | Kickoff, M1 planning | All |
| Jan 23 | M1 progress check | Engineering + Content |
| Feb 6 | M1 review, M2 planning | All |
| Feb 20 | M2 progress check | Engineering + i18n |
| Mar 6 | M2 review, M3 planning | All |
| Mar 20 | M3 progress check | All |
| Mar 27 | Q1 review, Q2 planning | All stakeholders |

---

## Resources

### Documentation

- [Authoring Guide](./AUTHORING_GUIDE.md)
- [Operations SLOs](./OPERATIONS_SLOS.md)
- [Experiments Guide](./EXPERIMENTS.md)
- [Content Expansion Plan](./GLOSSARY_EXPANSION_PLAN.md)

### Tools

- `pnpm content:gaps` — Find content gaps
- `pnpm monitor:report` — Generate SLO report
- `pnpm author:preview <slug>` — Preview term

### Communication

- Weekly standup: [TBD]
- Slack channel: [TBD]
- Issue tracker: GitHub Issues

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| Dec 2025 | Initial roadmap | [Author] |

---

*Last updated: December 2025*


