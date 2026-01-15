# Repository Cleanup Candidates — Team Review Required

**Total files:** 14  
**Action required:** Team review and approval for each item  
**⚠️ No deletions will occur without explicit approval**

## Purpose

This document lists files that appear to be temporary, archived, or duplicate content. Each file requires team review before any action is taken.

## Review Process

1. Review each file individually
2. Check the box to approve deletion
3. Leave unchecked to retain
4. Comment with reasoning if unclear
5. Once consensus is reached, deletions (if approved) will be made in a separate PR

**Timeline:** Review by [DATE TBD], deletions (if approved) in separate PR after consensus.

---

## Candidates

### Temporary/Backup Files (5 files)

- [ ] `BACKUP_INFO_2025-11-05_223434.txt` — Dated backup metadata from November 5
- [ ] `BACKUP_INFO_2025-11-06_001139.txt` — Dated backup metadata from November 6
- [ ] `BACKUP_INFO_2025-11-10_130546.txt` — Dated backup metadata from November 10
- [ ] `BACKUP_INFO_2025-11-11_121924.txt` — Dated backup metadata from November 11
- [ ] `package-lock.json.backup` — Old npm lockfile (repo uses pnpm)

**Recommendation:** These appear to be temporary files from backup operations. Verify they're not needed for rollback purposes.

### Archived Documentation (3 files)

- [ ] `cursor-update-summary.md` — Temporary session notes
- [ ] `glossary-v2-dev-issue.md` — Archived troubleshooting documentation
- [ ] `QUICK_REVERT.md` — Temporary rollback notes

**Recommendation:** If the information is valuable, consider moving to `docs/archive/` instead of deleting.

### Duplicate Archives (2 files)

- [ ] `css-documentation.zip` — Possible duplicate of `css-documentation/` directory
- [ ] `soranauts-cursor-starter.zip` — Purpose unclear

**Recommendation:** Verify these aren't required for deployment or external distribution before deleting.

### Archived Scripts (4 files)

- [ ] `scripts/revert-glossary-v2.sh` — Archived revert script for glossary v2
- [ ] `scripts/revert-to-backup.sh` — Archived backup restore script
- [ ] `scripts/revert-to-production.sh` — Archived production rollback script
- [ ] `scripts/create-production-backup.sh` — Archived backup creation script

**Recommendation:** If these scripts are no longer needed, consider moving to `scripts/archive/` or a Git tag for historical reference rather than complete deletion.

---

## Decision Guidelines

**Keep if:**
- Still actively used or referenced
- Part of documented rollback procedures
- Contains unique information not captured elsewhere
- Required for deployment or CI/CD

**Move to archive if:**
- Historically valuable but not actively used
- May be needed for reference in the future
- Contains troubleshooting information

**Delete if:**
- Truly temporary with no future value
- Duplicates existing files/directories
- Superseded by better documentation/tooling
- No longer compatible with current setup

---

## How to Use This Document

### Option 1: GitHub Discussion
1. Create a new Discussion in the repository
2. Copy this content
3. Team members comment with their review
4. Close discussion when consensus is reached

### Option 2: GitHub Issue
1. Create a new Issue with label `cleanup`
2. Copy this content
3. Assign to relevant team members
4. Close issue when consensus is reached

### Option 3: Pull Request
1. Create a draft PR that removes approved files
2. Link to this document for context
3. Convert to ready for review once consensus is reached

