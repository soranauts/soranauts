# Quick Revert Guide

Emergency reference for reverting production to the latest backup.

## Latest Backup (November 11, 2025)

- **Branch:** `backup/production-2025-11-11-121924`
- **Tag:** `backup-production-2025-11-11-121924`
- **Commit:** `3458f1b0c3a4dc440859dd84ad68baf5bb810f63`

## Quick Revert Commands

### Option 1: Use the Revert Script (Recommended)
```bash
./scripts/revert-to-production.sh
git push origin main --force
```

### Option 2: Manual Revert
```bash
git checkout main
git fetch origin
git reset --hard backup/production-2025-11-11-121924
git push origin main --force
```

### Option 3: Use Generic Revert Script
```bash
./scripts/revert-to-backup.sh backup/production-2025-11-11-121924
git push origin main --force
```

## Before Reverting

1. **Verify you're on main branch:** `git branch --show-current`
2. **Save current work** (if needed): `git stash` or create a backup branch
3. **Test locally** after revert: `cd apps/web && pnpm build`

## After Reverting

1. **Verify the revert:** `git log -1` should show commit `3458f1b`
2. **Test the site locally**
3. **Monitor production** after force push

## Emergency Contacts

- **Backup Location:** Local and remote branch/tag
- **Script Location:** `./scripts/revert-to-production.sh`
- **Full Documentation:** See `REVERT_TO_PRODUCTION.md`

---

**Last Updated:** November 11, 2025



