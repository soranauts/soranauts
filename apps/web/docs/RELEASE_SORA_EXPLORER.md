# SORA Explorer Release Guide

This checklist guides the final rollout of SORA Explorer (`/explore`) and the associated tag detail pages (`/tag/[slug]`). Follow every step to ensure a safe launch with clear rollback paths.

---

## 1. Purpose & Scope

- Deliver the SORA Explorer hub at `/explore` behind the `TAG_HUB_V1` feature flag.
- Expose canonical tag detail pages at `/tag/[slug]`, including statistics, glossary excerpts, and Pagefind metadata.
- Keep all behaviour reversible via feature flags and Git tags.

---

## 2. Pre-Deploy Checklist

Run these commands locally on the rollout branch before submitting the merge request:

```bash
pnpm --filter @soranauts/web lint
pnpm --filter @soranauts/web typecheck
pnpm --filter @soranauts/web web:tags:build
pnpm --filter @soranauts/web web:tags:test
pnpm --filter @soranauts/web test:e2e
```

Confirm:

- `/explore` loads the SORA Explorer experience when `TAG_HUB_V1=true`.
- `/tag/[slug]` renders detail pages (including pagination) with canonical casing.
- Sitemap, Pagefind, and navigation links reflect SORA Explorer naming.

---

## 3. Production Backup

Before merging to `main`, create a production snapshot:

```bash
bash scripts/create-production-backup.sh
git tag -a pre-sora-explorer-backup -m "Backup before enabling SORA Explorer"
git push origin pre-sora-explorer-backup
```

The backup script archives the current production build artefacts. The Git tag records the state for hard rollback.

---

## 4. Deployment Steps

1. **Merge rollout branch**
   ```bash
   git checkout main
   git pull origin main
   git merge feature/sora-explorer-rollout
   git push origin main
   ```
2. **Enable feature flag**
   - Set `TAG_HUB_V1=true` in the production environment (Vercel/Cloud). Ensure staging mirrors production before toggling live.
3. **Deploy**
   - Trigger the production deployment through the existing CI/CD pipeline (Vercel dashboard or `vercel --prod` if applicable).

---

## 5. Rollback Procedures

### Soft Rollback (Preferred)

1. Set `TAG_HUB_V1=false` in the production environment.
2. Redeploy production.

Result: `/explore` returns the preview/disabled messaging and `/tag/[slug]` pages are no longer generated.

### Hard Rollback (If soft rollback insufficient)

1. Reset `main` to the backup tag:
   ```bash
   git checkout main
   git pull origin main
   git revert --no-commit pre-sora-explorer-backup..HEAD
   git commit -m "Revert SORA Explorer rollout"
   git push origin main
   ```
   *Alternatively*: `git reset --hard pre-sora-explorer-backup` followed by `git push --force origin main` (co-ordinate with the team before force-pushing).
2. Redeploy production.

Record any rollback in the project log for traceability.

---

## 6. Post-Deploy Validation

After the production deploy finishes:

- Visit `/explore` in production:
  - Confirm title “SORA Explorer: Discover the Decentralized Economy”.
  - Verify hero image, stats, and filters render correctly on desktop and mobile.
  - Ensure Pagefind metadata (`data-pagefind-*` attributes) exist in the markup.
- Open sample `/tag/[slug]` pages:
  - Check canonical casing (SORA, XOR, PSWAP, Iroha 3, DeFi, SORA Card, etc.).
  - Validate glossary excerpts, stats, pagination, and related tags.
- Confirm sitemap updates (`/sitemap.xml`) include `/explore` and indexable tag pages.
- Use Pagefind search to locate tag results and ensure cards link to `/explore` or `/tag/[slug]`.
- Smoke test navigation: header link “SORA Explorer” and footer link “SORA Explorer” both reach `/explore`.

Document completion (or issues) in the deployment log.

---

## 7. Support Contacts

- **Feature owner:** Soranauts web team
- **Fallback plan:** Follow rollback procedures above and notify #web-release channel.

---

Keep this document updated as we evolve SORA Explorer or adjust rollout tooling.


