# Starlight Migration Progress

> **Started:** [DATE]  
> **Target Completion:** 5-6 weeks  
> **Current Phase:** Week 1 - Foundation

---

## Quick Status

| Week | Phase | Status | Notes |
|------|-------|--------|-------|
| 1 | Foundation | 🔄 In Progress | |
| 2 | Level 1 Content | ⬜ Not Started | |
| 3 | Level 2 + Archive | ⬜ Not Started | |
| 4 | Search + Automation | ⬜ Not Started | |
| 5 | Testing + Polish | ⬜ Not Started | |
| 6 | Launch | ⬜ Not Started | |

**Legend:** ✅ Complete | 🔄 In Progress | ⬜ Not Started | ❌ Blocked

---

## Week 1: Foundation

### Day 1-2: Starlight Installation
- [ ] Install `@astrojs/starlight`
- [ ] Configure `astro.config.mjs` with sidebar
- [ ] Verify build succeeds
- [ ] Test basic `/docs` route works

### Day 3-4: Design Token Integration
- [ ] Create `starlight-custom.css`
- [ ] Map Soranauts colors to Starlight variables
- [ ] Verify dark mode works
- [ ] Test badge colors

### Day 5: Route Configuration
- [ ] Verify no conflicts with `/glossary/*`
- [ ] Verify no conflicts with `/blog/*`
- [ ] Create custom Header component
- [ ] Create custom Search component (placeholder)

### Week 1 Blockers
<!-- Log any issues blocking progress -->

### Week 1 Decisions Made
<!-- Log any decisions/changes from the plan -->

---

## Week 2: Level 1 Content (Official)

### Fundamentals
- [ ] `fundamentals/index.mdx` - SORA Overview
- [ ] `fundamentals/tokenomics.mdx` - Token Bonding Curve
- [ ] `fundamentals/governance.mdx` - SORA Parliament
- [ ] `fundamentals/sora-nexus.mdx` - SORA Nexus

### Products
- [ ] `products/polkaswap.mdx` - Polkaswap DEX
- [ ] `products/fearless-wallet.mdx` - Fearless Wallet
- [ ] `products/sora-card.mdx` - SORA Card
- [ ] `products/tonswap/index.mdx` - TONSWAP Overview
- [ ] `products/tonswap/features.mdx` - TONSWAP Features

### Week 2 Review
- [ ] All frontmatter validated
- [ ] All badges correct
- [ ] All callouts present
- [ ] Cross-links to glossary working
- [ ] Build succeeds

---

## Week 3: Level 2 + Archive

### Technical - Iroha
- [ ] `technical/iroha/index.mdx`
- [ ] `technical/iroha/consensus.mdx`
- [ ] `technical/iroha/smart-contracts.mdx`

### Technical - Bridges
- [ ] `technical/bridges/ethereum.mdx`
- [ ] `technical/bridges/polkadot.mdx`
- [ ] `technical/bridges/ton.mdx`

### Technical - Integration
- [ ] `technical/integration/getting-started.mdx`

### Guides
- [ ] `guides/user-guides.mdx`

### Archive
- [ ] `archive/index.mdx` - Timeline overview
- [ ] Curated 2025 highlights (select 1-2)
- [ ] Curated 2024 highlights (select 1-2)
- [ ] Curated 2023 highlights (select 1-2)
- [ ] Curated 2022 highlights (select 1-2)
- [ ] Curated 2021 highlights (select 1-2)

---

## Week 4: Search + Automation

### Search Implementation
- [ ] Remove old Pagefind configuration
- [ ] Configure unified Pagefind index
- [ ] Create `UnifiedSearchModal.tsx`
- [ ] Integrate GlossarySearchV2
- [ ] Test Cmd+K opens modal
- [ ] Test search results from all sources

### Custom Components
- [ ] `starlight/Header.astro` - With glossary link
- [ ] `starlight/Search.astro` - Modal trigger

### CI/CD
- [ ] Create `docs-validation.yml` workflow
- [ ] Create `docs-validate.ts` script
- [ ] Add link checking
- [ ] Test CI on PR

---

## Week 5: Testing + Polish

### Automated Testing
- [ ] `pnpm docs:validate` passes
- [ ] `pnpm docs:check-links` passes
- [ ] `pnpm build` succeeds
- [ ] E2E tests pass

### Manual Testing
- [ ] Navigation (sidebar, mobile)
- [ ] Search (all sources, mobile)
- [ ] Content rendering (badges, callouts, code)
- [ ] Performance (FCP, search speed)
- [ ] Accessibility (keyboard, screen reader)

### Bug Fixes
<!-- List bugs found and fixed -->

### Documentation
- [ ] Internal STARLIGHT_GUIDE.md created

---

## Week 6: Launch

### Pre-Launch
- [ ] Staging deployment
- [ ] Full QA on preview
- [ ] Stakeholder review (if needed)

### Launch
- [ ] Merge to main
- [ ] Production deployed
- [ ] Smoke test complete

### Post-Launch
- [ ] Monitor analytics
- [ ] Check for 404s
- [ ] Address urgent issues

---

## Completed Items Log

<!-- Move completed items here with dates -->

### Week 1
- [DATE] Item completed

---

## Change Log

<!-- Document any changes to the plan -->

| Date | Change | Reason |
|------|--------|--------|
| | | |
