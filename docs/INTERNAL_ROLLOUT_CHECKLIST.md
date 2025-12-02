# Internal Rollout Checklist — Nexus Glossary V2025

**Version:** V2025.1.0  
**Target Date:** December 2025  
**Status:** [ ] Not Started / [ ] In Progress / [ ] Complete

---

## Pre-Deploy Checklist

### Environment Verification

```bash
# Verify Node.js version (must be 20.x)
node --version

# Verify pnpm version (must be 9.x)
pnpm --version

# Install dependencies
pnpm install --frozen-lockfile
```

- [ ] Node.js 20.x confirmed
- [ ] pnpm 9.x confirmed
- [ ] Dependencies installed without errors

---

### Content Validation

```bash
# Run content linter
pnpm content:lint

# Run schema validator
pnpm content:validate

# Run auto-fixer (if needed)
pnpm content:fix
```

- [ ] `pnpm content:lint` — 0 errors (warnings OK)
- [ ] `pnpm content:validate` — 0 schema errors
- [ ] All content issues resolved or documented

---

### Build Verification

```bash
# Build glossary JSON
pnpm glossary:build

# Run typecheck
pnpm -w typecheck

# Build web app
pnpm --filter @soranauts/web build
```

- [ ] `pnpm glossary:build` — Stats show 179 canonical, 13+ aliases
- [ ] `pnpm -w typecheck` — 0 errors
- [ ] `pnpm build` — Successful, no warnings

---

### Feature Flags

Verify all flags are set to `true` in production environment:

| Flag | Expected | Verified |
|------|----------|----------|
| `FEATURE_GLOSSARY_V2025` | `true` | [ ] |
| `FEATURE_GLOSSARY_V3_UI` | `true` | [ ] |
| `FEATURE_GLOSSARY_QUICKVIEW` | `true` | [ ] |
| `FEATURE_EXPLORER_V3` | `true` | [ ] |
| `TAG_HUB_V1` | `true` | [ ] |
| `FEATURE_GLOSSARY_RELATED_ARTICLES` | `true` | [ ] |
| `FEATURE_EXPLORER_GLOSSARY_CONTEXT` | `true` | [ ] |

---

### OG Images

```bash
# Generate OG images for top 30 terms
pnpm og:glossary --top 30

# Verify output
ls -la apps/web/public/og/glossary/ | head -35
```

- [ ] OG images generated for top 30 terms
- [ ] SVG files present in `/public/og/glossary/`

---

### Lighthouse Checks (Local)

Run Lighthouse on local build:

```bash
# Start preview server
pnpm --filter @soranauts/web preview

# Run Lighthouse (in another terminal)
# Use Chrome DevTools or lighthouse CLI
```

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| /glossary | ≥90 | ≥97 | ≥90 | ≥90 |
| /explore | ≥90 | ≥97 | ≥90 | ≥90 |
| /glossary/xor | ≥90 | ≥97 | ≥90 | ≥90 |

- [ ] Lighthouse /glossary — Accessibility ≥97
- [ ] Lighthouse /explore — Accessibility ≥97
- [ ] Lighthouse /glossary/xor — Accessibility ≥97

---

### Documentation

- [ ] `docs/RELEASE_NOTES_V2025.md` — Complete and accurate
- [ ] `CHANGELOG.md` — Updated with V2025.1.0
- [ ] `docs/AUTHORING_GUIDE.md` — Reviewed and current
- [ ] `docs/glossary/FEATURE_FLAGS.md` — All flags documented

---

### Pre-Deploy Summary

```bash
# Run full pre-deploy check
pnpm predeploy:prod
```

- [ ] `pnpm predeploy:prod` — All checks pass

---

## Deploy

```bash
# Full release (pre-deploy + deploy + post-deploy)
pnpm release:prod

# Or step by step:
pnpm predeploy:prod
pnpm deploy:prod
pnpm postdeploy:prod
```

- [ ] Deployment initiated
- [ ] Deployment completed without errors
- [ ] Vercel dashboard shows successful deployment

---

## Post-Deploy Checklist

### Live Verification

```bash
# Run live verification script
pnpm glossary:verify:live https://soranauts.com
```

- [ ] `pnpm glossary:verify:live` — All checks pass

---

### Manual Smoke Tests

#### Glossary Homepage
- [ ] https://soranauts.com/glossary loads correctly
- [ ] Search input works
- [ ] Category filters work
- [ ] Term cards display correctly

#### Quick-View
- [ ] Click term chip → Panel opens
- [ ] "Why it matters" callout visible
- [ ] Related terms show taglines
- [ ] Copy link button works
- [ ] Escape key closes panel
- [ ] URL updates with `?term=slug`

#### Deep Link
- [ ] https://soranauts.com/glossary?term=xor → Panel opens with XOR

#### Explorer
- [ ] https://soranauts.com/explore loads correctly
- [ ] Nexus Architecture section visible
- [ ] Domain cards/sections work
- [ ] Quick Journeys accessible

#### Random Slug Tests

Test 10 random slugs on live site:

| # | Slug | Page Loads | Quick-View | Related |
|---|------|------------|------------|---------|
| 1 | xor | [ ] | [ ] | [ ] |
| 2 | polkaswap | [ ] | [ ] | [ ] |
| 3 | tokenbondingcurve | [ ] | [ ] | [ ] |
| 4 | val | [ ] | [ ] | [ ] |
| 5 | soraparliament | [ ] | [ ] | [ ] |
| 6 | pswap | [ ] | [ ] | [ ] |
| 7 | kusd | [ ] | [ ] | [ ] |
| 8 | hashi | [ ] | [ ] | [ ] |
| 9 | ceres | [ ] | [ ] | [ ] |
| 10 | tbcd | [ ] | [ ] | [ ] |

---

### Alias Redirects

Test alias redirects (should 308 to canonical):

| Alias | Expected Canonical | Redirects |
|-------|-------------------|-----------|
| /glossary/sora-token | /glossary/xor | [ ] |
| /glossary/tbc | /glossary/tokenbondingcurve | [ ] |

---

### 404 Monitoring

- [ ] Check Vercel analytics for 404 spikes
- [ ] No new 404s for canonical slugs
- [ ] Old aliases still redirect correctly

---

### Performance Verification

Run Lighthouse on production:

| Page | Performance | Accessibility |
|------|-------------|---------------|
| /glossary | [ ] ≥90 | [ ] ≥97 |
| /explore | [ ] ≥90 | [ ] ≥97 |

---

### CI Status

- [ ] All CI checks green on main branch
- [ ] No failing workflows
- [ ] Content CI workflow runs on PRs

---

## Rollback Plan

If critical issues are found:

### Immediate Rollback

```bash
# Revert last commit and redeploy
pnpm rollback:prod
```

### Feature Flag Rollback

Disable specific features via Vercel environment variables:

```
FEATURE_GLOSSARY_QUICKVIEW=false
FEATURE_EXPLORER_V3=false
```

### Full Rollback

```bash
# Revert to previous known-good commit
git revert HEAD
git push origin main

# Trigger redeploy
vercel --prod --confirm --cwd apps/web
```

---

## Post-Launch Monitoring

### First 24 Hours

- [ ] Monitor error tracking (if configured)
- [ ] Check Vercel analytics for anomalies
- [ ] Review any user feedback
- [ ] Confirm no performance degradation

### First Week

- [ ] Review 404 logs
- [ ] Check Core Web Vitals in Search Console
- [ ] Gather community feedback
- [ ] Document any issues found

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | [ ] |
| QA | | | [ ] |
| Product | | | [ ] |

---

## Notes

_Add any deployment notes, issues encountered, or follow-up items here._

---

*Checklist version: 1.0 — December 2025*


