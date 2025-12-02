# Release Notes & Rollback Procedures

Internal reference for production deployment and rollback procedures.

---

## Table of Contents

1. [Deployment Commands](#deployment-commands)
2. [Pre-deploy Checklist](#pre-deploy-checklist)
3. [Rollback Procedure](#rollback-procedure)
4. [Feature Flags](#feature-flags)
5. [Incident Response](#incident-response)

---

## Deployment Commands

### One-Command Release

```bash
pnpm release:prod
```

This runs:
1. `predeploy:prod` — Version checks, glossary build, typecheck, smoke tests
2. `deploy:prod` — Full build and deploy
3. `postdeploy:prod` — Live verification and cache purge

### Individual Steps

```bash
# Pre-deploy checks only
pnpm predeploy:prod

# Build and deploy only
pnpm deploy:prod

# Post-deploy verification only
pnpm postdeploy:prod https://soranauts.com
```

### Manual Vercel Deploy

If the automated deploy fails, use Vercel CLI directly:

```bash
cd apps/web
vercel --prod --confirm
```

---

## Pre-deploy Checklist

Before running `pnpm release:prod`:

- [ ] All E2E tests passing locally
- [ ] Glossary build produces expected counts (179 canonical, 13+ aliases)
- [ ] Typecheck passes with 0 errors
- [ ] Dev server tested manually
- [ ] Feature flags set to production defaults

### Expected Counts

| Metric | Expected |
|--------|----------|
| Canonical terms | 179 |
| Aliases | ≥ 13 |
| Categories | 13 |
| Terms with tagline | 44 |

---

## Rollback Procedure

### Immediate Rollback

If post-deploy verification fails:

```bash
pnpm rollback:prod
```

This reverts the last commit and triggers a redeploy.

### Manual Rollback Steps

1. **Revert the commit:**
   ```bash
   git revert -m 1 HEAD
   git push origin main
   ```

2. **Redeploy via Vercel:**
   ```bash
   cd apps/web
   vercel --prod --confirm
   ```

3. **Disable feature flags (if needed):**
   Set in Vercel environment variables:
   ```
   FEATURE_GLOSSARY_V3_UI=false
   FEATURE_EXPLORER_V3=false
   FEATURE_GLOSSARY_QUICKVIEW=false
   ```

4. **Verify rollback:**
   ```bash
   pnpm postdeploy:prod https://soranauts.com
   ```

### Rollback to Specific Commit

```bash
git checkout <commit-hash>
cd apps/web
vercel --prod --confirm
```

---

## Feature Flags

### Production Defaults (as of Phase 8)

| Flag | Default | Description |
|------|---------|-------------|
| `FEATURE_GLOSSARY_V2025` | `true` | Use 2025 glossary dataset |
| `FEATURE_GLOSSARY_V3_UI` | `true` | React-based term pages |
| `FEATURE_GLOSSARY_QUICKVIEW` | `true` | Right-panel Quick-View |
| `FEATURE_EXPLORER_V3` | `true` | Unified Explorer |
| `FEATURE_EXPLORER_GLOSSARY_CONTEXT` | `true` | Related-term chips |
| `TAG_HUB_V1` | `true` | Explorer/Tag Hub |

### Emergency Flag Overrides

To disable a feature in production without code changes:

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add/update the flag with value `false`
3. Trigger a redeploy

### Flag Locations

- **Config:** `apps/web/src/config/feature-flags.ts`
- **Types:** `apps/web/src/env.d.ts`
- **Usage:** Search for flag name in codebase

---

## Incident Response

### If Post-Deploy Verification Fails

1. **Assess severity:**
   - 404 on /glossary or /explore → Critical
   - Alias redirects failing → High
   - Quick-View not opening → Medium
   - Stats mismatch → Low

2. **For Critical/High:**
   ```bash
   pnpm rollback:prod
   ```

3. **For Medium/Low:**
   - Create a hotfix branch
   - Fix the issue
   - Re-run `pnpm release:prod`

### Incident Note Template

Add to this file under "Incident Log":

```markdown
### YYYY-MM-DD: Brief Description

**Severity:** Critical / High / Medium / Low
**Duration:** X minutes
**Root Cause:** Description
**Resolution:** What was done
**Prevention:** What will prevent recurrence
```

---

## Incident Log

(Add incidents here as they occur)

---

## Removed: SKIP_GLOSSARY_GENERATOR

As of Phase 8, the `SKIP_GLOSSARY_GENERATOR` environment variable has been removed.

The unified generator (`scripts/build-nexus-glossary-json.ts`) is now the default and only generator.

If you see references to `SKIP_GLOSSARY_GENERATOR` in old scripts or documentation, they can be safely ignored or removed.

---

## Deploy Script Reference

| Script | Purpose |
|--------|---------|
| `scripts/deploy/prepare_release.ts` | Pre-deploy checks |
| `scripts/deploy/verify_live.ts` | Post-deploy verification |
| `scripts/deploy/purge_cache.ts` | CDN cache purge |
| `scripts/build-nexus-glossary-json.ts` | Unified glossary generator |
| `scripts/verify-generator-parity.ts` | Generator determinism check |
| `scripts/verify-glossary-live.ts` | Live site verification |


