# Starlight Migration Progress

> **Started:** December 7, 2025  
> **Target Completion:** 5-6 weeks  
> **Current Phase:** Week 4 - Search + Automation

---

## Quick Status

| Week | Phase | Status | Notes |
|------|-------|--------|-------|
| 1 | Foundation | ✅ Complete | All items done |
| 2 | Level 1 Content | ✅ Complete | 9 pages |
| 3 | Level 2 + Archive | ✅ Complete | 14 pages (7 Technical + 7 Archive) |
| 4 | Search + Automation | 🔄 In Progress | Search complete, CI pending |
| 5 | Testing + Polish | ⬜ Not Started | |
| 6 | Launch | ⬜ Not Started | |

**Legend:** ✅ Complete | 🔄 In Progress | ⬜ Not Started | ❌ Blocked

---

## Week 1: Foundation

### Day 1-2: Starlight Installation
- [x] Install `@astrojs/starlight` (v0.37.0)
- [x] Configure `astro.config.mjs` with sidebar
- [x] Verify build succeeds (604 pages)
- [x] Test basic `/docs` route works

### Day 3-4: Design Token Integration
- [x] Create `starlight-custom.css`
- [x] Map Soranauts colors to Starlight variables
- [x] Verify dark mode works
- [x] Test badge colors

### Day 5: Route Configuration
- [x] Verify no conflicts with `/glossary/*`
- [x] Verify no conflicts with `/blog/*`
- [x] Create custom Header component
- [x] Create custom Search component (placeholder)

### Week 1 Blockers
- None currently

### Week 1 Decisions Made
- **Content Layer API**: Migrated from legacy collections to new Content Layer API to support Starlight's docsLoader
- **Docs path structure**: Content at `src/content/docs/docs/` maps to `/docs/` route (required for coexistence with existing site)
- **404 page**: Added `src/content/docs/404.mdx` to prevent Starlight 404 errors
- **Blog utility update**: Updated `src/utils/blog.ts` to use `render(post)` instead of `post.render()` for new API compatibility

---

## Week 2: Level 1 Content (Official)

### Fundamentals ✅ COMPLETE
- [x] `fundamentals/index.mdx` - SORA Overview (~1,700 words)
- [x] `fundamentals/tokenomics.mdx` - Token Bonding Curve, XOR, VAL, PSWAP (~2,300 words)
- [x] `fundamentals/governance.mdx` - SORA Parliament, voting, proposals (~1,800 words)
- [x] `fundamentals/sora-nexus.mdx` - SORA v3/Nexus, Iroha 3 (~1,400 words)

### Products ✅ COMPLETE
- [x] `products/polkaswap.mdx` - Polkaswap DEX (~1,500 words)
- [x] `products/fearless-wallet.mdx` - Fearless Wallet (~1,300 words)
- [x] `products/sora-card.mdx` - SORA Card (~1,100 words)
- [x] `products/tonswap/index.mdx` - TONSWAP Overview (~900 words)
- [x] `products/tonswap/features.mdx` - TONSWAP Features (~900 words)

### Week 2 Review
- [ ] All frontmatter validated
- [ ] All badges correct
- [ ] All callouts present
- [ ] Cross-links to glossary working
- [ ] Build succeeds

---

## Week 3: Level 2 + Archive

### Technical - Iroha ✅ COMPLETE
- [x] `technical/iroha/index.mdx` - Iroha overview (~2,000 words)
- [x] `technical/iroha/consensus.mdx` - Sumeragi BFT (~1,500 words)
- [x] `technical/iroha/smart-contracts.mdx` - WASM contracts (~1,500 words)

### Technical - Bridges ✅ COMPLETE
- [x] `technical/bridges/ethereum.mdx` - HASHI bridge (~1,100 words)
- [x] `technical/bridges/polkadot.mdx` - XCM/parachain (~1,100 words)
- [x] `technical/bridges/ton.mdx` - TON bridge (~1,100 words)

### Technical - Integration ✅ COMPLETE
- [x] `technical/integration/getting-started.mdx` - Dev quickstart (~1,500 words)

### Guides
- [ ] `guides/user-guides.mdx`

### Archive ✅ COMPLETE
- [x] `archive/index.mdx` - Timeline overview (~500 words)
- [x] `archive/2025/sora-nexus-launch.mdx` - Nexus announcement (~700 words)
- [x] `archive/2024/sora-card-launch.mdx` - SORA Card launch (~700 words)
- [x] `archive/2024/year-review.mdx` - 2024 summary (~800 words)
- [x] `archive/2023/polkaswap-v2.mdx` - Polkaswap 2.0 (~600 words)
- [x] `archive/2022/kusama-parachain.mdx` - Kusama slot win (~600 words)
- [x] `archive/2021/sora-v2-launch.mdx` - SORA v2 launch (~600 words)

---

## Week 4: Search + Automation

### Search Implementation ✅ COMPLETE
- [x] Starlight pagefind disabled (using unified search)
- [x] Custom pagefind-cli-runner integration configured
- [x] Created `ContentPanel.astro` with Pagefind metadata
- [x] Docs pages now indexed with `type:docs` filter
- [x] SearchModal.astro already had Docs filter + searchDocs()
- [x] 24 docs pages indexed with proper metadata
- [x] Verified build: 458 pages indexed, 3 filters

### Custom Components ✅ COMPLETE
- [x] `starlight/Header.astro` - With glossary/blog links
- [x] `starlight/Search.astro` - Cmd+K trigger placeholder
- [x] `starlight/ContentPanel.astro` - Pagefind metadata wrapper

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

### Week 1
- [2025-12-07] Installed @astrojs/starlight v0.37.0
- [2025-12-07] Configured astro.config.mjs with Starlight integration (pagefind: false)
- [2025-12-07] Created content.config.ts with docsLoader and postCollection
- [2025-12-07] Created test page at src/content/docs/docs/index.mdx
- [2025-12-07] Verified /docs route works with Starlight UI
- [2025-12-07] Verified /glossary route still works (no conflicts)

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2025-12-07 | Migrated to Content Layer API | Required for Starlight docsLoader to work |
| 2025-12-07 | Updated blog.ts render() call | New API uses `render(post)` instead of `post.render()` |
| 2025-12-07 | Created docs/docs/ subdirectory | Maps to /docs/ route (Starlight routes from content path) |
