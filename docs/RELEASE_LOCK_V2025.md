# Release Lock — Nexus Glossary V2025

**Version:** V2025.1.0  
**Lock Date:** December 2025  
**Status:** 🔒 LOCKED

---

## Release Commit

```
SHA: 921410d070402adebf29162ae046d4cd12d72f4c
Tag: v2025.1.0
Branch: main
```

---

## Phase Deliverables Summary

### Phase 1 — Quick-View Foundation ✅
- Quick-View panel component (`GlossaryQuickView.tsx`)
- URL state management with `?term=slug`
- Focus trap and accessibility
- Prefetching on hover/focus

### Phase 2 — Explorer Search + Nexus Stats ✅
- Explorer V3 with Nexus Architecture section
- Domain organization and subgroups
- Quick Journeys for learning paths
- Glossary context integration

### Phase 3 — Content Sweep + Taglines ✅
- Tagline field added to all terms
- "Why it matters" callout UI
- Content quality improvements

### Phase 4 — Unified Generator ✅
- Single TypeScript generator (`build-nexus-glossary-json.ts`)
- Per-term JSON output (`/data/terms/<slug>.json`)
- Minimal index (`glossary.v2025.json`)
- Alias mapping (`glossary.aliases.v2025.json`)
- Deterministic builds

### Phase 5 — E2E Verification ✅
- Playwright test suite
- Routing tests
- Stats verification
- Quick-View tests
- Live verification scripts

### Phase 6 — Global UI Consistency ✅
- Design token system
- CSS custom properties
- Component styling pass
- Dark mode improvements

### Phase 7 — Documentation & Handoff ✅
- `DESIGN_NOTES.md`
- `EXPLORER_MODEL.md`
- `GLOSSARY_PIPELINE.md`
- Feature flag documentation

### Phase 8 — Production Rollout ✅
- Deploy scripts (`prepare_release.ts`, `verify_live.ts`, `purge_cache.ts`)
- Feature flag convergence
- Rollback procedures

### Phase 10 — Insight Layer & Polish ✅
- Insights module (privacy-safe analytics)
- Chip tooltips with taglines
- Related terms with taglines in Quick-View
- Print styles
- Copy link button
- Content linter
- Fuzzy search for 404 suggestions
- Skip link accessibility

### Phase 11 — Editor Tooling & Authoring UX ✅
- JSON Schema for front-matter
- Validator script (`validate-frontmatter.ts`)
- Auto-fixer script (`fix-frontmatter.ts`)
- Preview tool (`preview-term.ts`)
- OG image generator (`generate-og.ts`)
- VS Code extensions, settings, snippets
- PR template
- Content CI workflow
- Authoring guide

### Phase 12 — Release Notes & Comms Kit ✅
- `RELEASE_NOTES_V2025.md`
- `CHANGELOG.md`
- Social media pack (X, LinkedIn, Telegram)
- Blog post template
- Screenshot kit
- Internal rollout checklist
- Press kit one-pager

### Phase 13 — Final QA & Freeze Tag ✅
- Automated QA matrix
- Release lock document (this file)
- Monitoring scripts
- STATUS.txt marker
- CONTRIBUTING.md update

---

## Allowed Changes After Lock

The following changes are permitted without unlocking:

### ✅ Content Edits
- MDX file content updates (summaries, definitions, examples)
- New glossary terms (following schema)
- Tagline additions or improvements
- Related term updates
- Typo fixes

### ✅ Non-Breaking UI Polish
- CSS tweaks that don't change layout
- Color adjustments within token system
- Animation timing adjustments
- Accessibility improvements

### ✅ Bug Fixes
- Runtime error fixes
- Build error fixes
- Test fixes
- Dependency security patches

### ✅ Documentation
- README updates
- Authoring guide improvements
- Comment additions

---

## Disallowed Changes (Require Unlock)

The following changes require maintainer approval and unlock procedure:

### ❌ Routing Changes
- New routes
- Route parameter changes
- Redirect logic changes
- URL structure changes

### ❌ Schema Changes
- Front-matter schema modifications
- JSON output structure changes
- New required fields
- Field type changes

### ❌ Generator Changes
- Build pipeline modifications
- Output format changes
- Validation logic changes
- New output files

### ❌ Design Token Changes
- New tokens
- Token value changes
- Token naming changes
- Token removal

### ❌ Layout Changes
- Component structure changes
- Grid/flexbox layout changes
- Responsive breakpoint changes
- New layout components

### ❌ Feature Flag Changes
- New flags
- Flag default changes
- Flag removal
- Flag logic changes

---

## Unlock Procedure

To unlock the release for structural changes:

1. **Create Issue**
   - Title: `[UNLOCK REQUEST] <description>`
   - Label: `release-lock`
   - Include: Justification, scope, risk assessment

2. **Maintainer Review**
   - At least 1 maintainer must approve
   - Review risk and impact
   - Confirm rollback plan

3. **Update Lock Document**
   - Add unlock entry with date and reason
   - Update status to `🔓 UNLOCKED`

4. **Make Changes**
   - Follow normal PR process
   - Include comprehensive tests
   - Update documentation

5. **Re-Lock**
   - Update lock document
   - Create new freeze tag if needed
   - Update status to `🔒 LOCKED`

---

## Rollback Instructions

### Immediate Rollback

```bash
# Revert to last known good state
git revert HEAD
git push origin main

# Or rollback via pnpm
pnpm rollback:prod
```

### Feature Flag Rollback

Disable specific features via Vercel environment variables:

```
FEATURE_GLOSSARY_QUICKVIEW=false
FEATURE_EXPLORER_V3=false
FEATURE_GLOSSARY_V3_UI=false
```

### Full Version Rollback

```bash
# Checkout previous release tag
git checkout v2024.2.0

# Deploy from that state
pnpm deploy:prod
```

---

## Production Smoke Test Results

### Automated Tests

| Test | Status | Notes |
|------|--------|-------|
| `pnpm -w typecheck` | ✅ PASS | 0 errors, 131 hints |
| `pnpm glossary:build` | ✅ PASS | 179 canonical, 13 aliases |
| `pnpm content:lint` | ✅ PASS | 0 errors, 136 warnings |
| `pnpm content:validate` | ✅ PASS | 0 errors, 1018 warnings |

### Manual Verification

| Page | Desktop | Mobile | Quick-View | Notes |
|------|---------|--------|------------|-------|
| /glossary | ☐ | ☐ | ☐ | |
| /explore | ☐ | ☐ | N/A | |
| /glossary/xor | ☐ | ☐ | ☐ | |
| /glossary/polkaswap | ☐ | ☐ | ☐ | |
| /glossary/tokenbondingcurve | ☐ | ☐ | ☐ | |
| /glossary?term=xor | ☐ | ☐ | ☐ | Deep link |

### Alias Redirects

| Alias | Target | Redirects |
|-------|--------|-----------|
| /glossary/sora-token | /glossary/xor | ☐ |
| /glossary/tbc | /glossary/tokenbondingcurve | ☐ |

---

## Monitoring Endpoints

```bash
# Check random slugs
pnpm monitor:slugs

# Check Quick-View functionality
pnpm monitor:quickview
```

---

## Release Artifacts

| Artifact | Location |
|----------|----------|
| Release Notes | `docs/RELEASE_NOTES_V2025.md` |
| Changelog | `CHANGELOG.md` |
| Authoring Guide | `docs/AUTHORING_GUIDE.md` |
| Design Notes | `docs/DESIGN_NOTES.md` |
| Explorer Model | `docs/EXPLORER_MODEL.md` |
| Feature Flags | `docs/glossary/FEATURE_FLAGS.md` |
| Press Kit | `docs/PRESS_KIT_ONEPAGER.md` |
| Rollout Checklist | `docs/INTERNAL_ROLLOUT_CHECKLIST.md` |

---

## Unlock History

| Date | Reason | Approver | Status |
|------|--------|----------|--------|
| — | Initial release | — | 🔒 LOCKED |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Lead Developer | | | ☐ |
| QA Lead | | | ☐ |
| Product Owner | | | ☐ |

---

*Lock document version: 1.0 — December 2025*


