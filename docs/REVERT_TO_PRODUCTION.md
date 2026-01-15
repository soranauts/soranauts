# Revert to Production Site Version - Emergency Backup Plan

## 📋 Latest Backup Information

**Backup Created:** November 11, 2025  
**Production Commit Hash:** `3458f1b0c3a4dc440859dd84ad68baf5bb810f63`  
**Commit Message:** "Improve search highlight styling and fix features page search"  
**Commit Date:** 2025-11-09 08:38:55 -0600

**Backup Branch:** `backup/production-2025-11-11-121924`  
**Backup Tag:** `backup-production-2025-11-11-121924`

This backup represents the state of the production site before merging `feature/about-page-polish` on November 11, 2025.

---

## 📋 Previous Backup Information (November 4, 2025)

**Backup Created:** November 4, 2025  
**Production Commit Hash:** `06a2cf217c93d7209dbe16ecb8a272ef0da90702`  
**Commit Message:** "Merge kb-incremental-embedding-cache: Complete KB implementation with incremental ingestion, embedding cache, TONSWAP, and Fearless GitHub integration"  
**Commit Date:** 2025-11-03 08:30:03 -0600

**Backup Branch:** `backup/pre-changelog-revamp-2025-11-04`  
**Backup Tag:** `backup-production-2025-11-04`

This backup represents the state of the production site before any changes made on November 4, 2025, including the changelog page revamp.

---

## 🚨 Quick Revert Methods

### Method 1: Reset to Backup Branch (Recommended)

**If you haven't committed your changes yet:**

```bash
# Discard all local changes and reset to production state
git fetch origin
git reset --hard backup/production-2025-11-11-121924

# Or reset to the backup tag
git reset --hard backup-production-2025-11-11-121924
```

**If you have already committed changes:**

```bash
# Create a new branch from current state (optional, for safety)
git branch backup/current-state-$(date +%Y-%m-%d)

# Reset main to production state
git reset --hard backup/production-2025-11-11-121924

# Force push to remote (USE WITH CAUTION - only if you're sure)
git push origin main --force
```

### Method 2: Reset to Commit Hash

```bash
# Reset to the exact production commit
git reset --hard 3458f1b0c3a4dc440859dd84ad68baf5bb810f63

# If you need to force push
git push origin main --force
```

### Method 3: Checkout Backup Branch (Read-only)

```bash
# Just view the backup state without changing main
git checkout backup/pre-changelog-revamp-2025-11-04

# Return to main
git checkout main
```

### Method 4: Create New Branch from Backup

```bash
# Create a new branch from the backup to work with
git checkout -b restore-production backup/pre-changelog-revamp-2025-11-04

# Then merge or cherry-pick what you need
```

---

## 🔍 Safety Checks Before Reverting

1. **Check current status:**
   ```bash
   git status
   git log --oneline -10
   ```

2. **Verify backup branch exists:**
   ```bash
   git branch -a | grep backup
   git tag -l | grep backup
   ```

3. **Compare current state with backup:**
   ```bash
   git diff backup/pre-changelog-revamp-2025-11-04..HEAD
   ```

4. **Save current work (if needed):**
   ```bash
   # Stash uncommitted changes
   git stash push -m "Work before revert on $(date +%Y-%m-%d)"
   
   # Or create a branch from current state
   git branch backup/current-state-$(date +%Y-%m-%d)
   ```

---

## 📝 Step-by-Step Revert Process

### Scenario A: Uncommitted Changes Only

```bash
# 1. Save current work (optional)
git stash push -m "Work before revert"

# 2. Reset to production
git reset --hard backup/pre-changelog-revamp-2025-11-04

# 3. Verify the reset
git log -1
git status
```

### Scenario B: Committed Changes Need Revert

```bash
# 1. Create backup of current state
git branch backup/current-state-$(date +%Y-%m-%d)
git tag current-state-$(date +%Y-%m-%d)

# 2. Reset main to production
git checkout main
git reset --hard backup/pre-changelog-revamp-2025-11-04

# 3. Verify
git log -1

# 4. Force push (ONLY if you're sure this is what you want)
git push origin main --force
```

### Scenario C: Partial Revert (Keep Some Changes)

```bash
# 1. Create a branch from backup
git checkout -b restore-from-backup backup/pre-changelog-revamp-2025-11-04

# 2. Cherry-pick specific commits you want to keep
git cherry-pick <commit-hash>

# 3. Merge back to main when ready
git checkout main
git merge restore-from-backup
```

---

## 🔄 Restore from Remote (If Local Backup is Lost)

If you need to restore from the remote repository:

```bash
# Fetch all remote branches and tags
git fetch origin

# Reset to remote main (if it matches production)
git reset --hard origin/main

# Or reset to the backup tag on remote
git fetch origin refs/tags/backup-production-2025-11-04:refs/tags/backup-production-2025-11-04
git reset --hard backup-production-2025-11-04
```

---

## 📦 Verify Backup Integrity

```bash
# Check backup branch points to correct commit
git show backup/pre-changelog-revamp-2025-11-04:apps/web/src/pages/changelog.md | head -20

# Compare with current (if you want to see what changed)
git diff backup/pre-changelog-revamp-2025-11-04 HEAD -- apps/web/src/pages/changelog.md
```

---

## 🆘 Emergency Contacts & Notes

- **Backup Location:** Local branch `backup/pre-changelog-revamp-2025-11-04` and tag `backup-production-2025-11-04`
- **Production Commit:** `06a2cf217c93d7209dbe16ecb8a272ef0da90702`
- **Date Created:** November 4, 2025

**Important:** Before force pushing, always:
1. Verify you're on the correct branch
2. Ensure you have a backup of current state
3. Notify team members if working collaboratively
4. Test the revert in a local environment first

---

## 📚 Additional Git Commands Reference

```bash
# View all branches
git branch -a

# View all tags
git tag -l

# View commit history
git log --oneline --graph --all -20

# See what files changed between backup and current
git diff --name-status backup/pre-changelog-revamp-2025-11-04..HEAD

# See commit messages between backup and current
git log backup/pre-changelog-revamp-2025-11-04..HEAD --oneline
```

---

## 🔄 Reusable Backup System for Future Deployments

This backup system can be used for **any future deployment**. Here's how to create new backups:

### Creating a New Backup Before Deployment

**Before deploying major changes, create a backup:**

```bash
# Option 1: Use the automated script (recommended)
./scripts/create-production-backup.sh "Description of changes being deployed"

# Example:
./scripts/create-production-backup.sh "Major UI update and new features"
```

This will:
- Create a backup branch with timestamp (e.g., `backup/production-2025-11-15-143022`)
- Create a backup tag with timestamp (e.g., `backup-production-2025-11-15-143022`)
- Save backup information to a text file
- Optionally push to remote

**Manual method:**

```bash
# Get current date/time
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H%M%S)
COMMIT=$(git rev-parse HEAD)

# Create backup branch
git branch "backup/production-${DATE}-${TIME}" "$COMMIT"

# Create backup tag
git tag -a "backup-production-${DATE}-${TIME}" -m "Production backup before deployment" "$COMMIT"

# Push to remote
git push origin "backup/production-${DATE}-${TIME}"
git push origin "backup-production-${DATE}-${TIME}"
```

### Reverting to Any Backup

**Use the generic revert script:**

```bash
# List available backups
./scripts/revert-to-backup.sh

# Revert to a specific backup
./scripts/revert-to-backup.sh backup/production-2025-11-15-143022

# Or use a tag
./scripts/revert-to-backup.sh backup-production-2025-11-15-143022
```

**Manual revert:**

```bash
# Reset to any backup branch
git reset --hard backup/production-2025-11-15-143022

# Or use a tag
git reset --hard backup-production-2025-11-15-143022
```

### Best Practices for Future Deployments

1. **Always create a backup before:**
   - Major feature deployments
   - Breaking changes
   - Database migrations
   - Large refactoring
   - Production deployments

2. **Naming convention:**
   - Branches: `backup/production-YYYY-MM-DD-HHMMSS`
   - Tags: `backup-production-YYYY-MM-DD-HHMMSS`
   - Include descriptive commit messages

3. **Keep backups organized:**
   - List all backups: `git branch -a | grep backup`
   - Clean up old backups periodically (keep last 5-10)
   - Document what each backup represents

4. **Test revert process:**
   - Test the revert in a local branch first
   - Verify the backup works before you need it

### Workflow Example

```bash
# 1. Before deploying, create backup
./scripts/create-production-backup.sh "Deploying new changelog page"

# 2. Make your changes and deploy
git add .
git commit -m "New changelog page"
git push origin main

# 3. If something goes wrong, revert
./scripts/revert-to-backup.sh backup/production-2025-11-15-143022

# 4. Force push if needed (after testing locally)
git push origin main --force
```

---

**Note:** The current backup (`backup/pre-changelog-revamp-2025-11-04`) is specific to November 4, 2025. For future deployments, create new backups using the process above.

**Last Updated:** November 4, 2025

