#!/bin/bash

# Generic Revert Script - Revert to any backup branch or tag
# Usage: ./scripts/revert-to-backup.sh [backup-branch-or-tag]

set -e  # Exit on error

if [ -z "$1" ]; then
    echo "❌ Error: No backup specified"
    echo ""
    echo "Usage: $0 <backup-branch-or-tag>"
    echo ""
    echo "Examples:"
    echo "  $0 backup/production-2025-11-04-143022"
    echo "  $0 backup-production-2025-11-04-143022"
    echo ""
    echo "Available backups:"
    echo "  Branches:"
    git branch -a | grep backup | sed 's/^/    /'
    echo "  Tags:"
    git tag -l | grep backup | sed 's/^/    /'
    exit 1
fi

BACKUP_REF="$1"
CURRENT_BRANCH=$(git branch --show-current)

echo "⚠️  WARNING: This will reset '$CURRENT_BRANCH' to the backup: $BACKUP_REF"
echo ""

# Check if backup exists
if ! git show-ref --verify --quiet "refs/heads/$BACKUP_REF" && \
   ! git show-ref --verify --quiet "refs/remotes/origin/$BACKUP_REF" && \
   ! git show-ref --verify --quiet "refs/tags/$BACKUP_REF"; then
    echo "❌ Error: Backup '$BACKUP_REF' not found"
    echo ""
    echo "Available backups:"
    echo "  Local branches:"
    git branch | grep backup | sed 's/^/    /' || echo "    (none)"
    echo "  Remote branches:"
    git branch -r | grep backup | sed 's/^/    /' || echo "    (none)"
    echo "  Tags:"
    git tag -l | grep backup | sed 's/^/    /' || echo "    (none)"
    exit 1
fi

# Get backup commit info
if git show-ref --verify --quiet "refs/heads/$BACKUP_REF"; then
    BACKUP_COMMIT=$(git rev-parse "$BACKUP_REF")
    BACKUP_TYPE="local branch"
elif git show-ref --verify --quiet "refs/remotes/origin/$BACKUP_REF"; then
    BACKUP_COMMIT=$(git rev-parse "origin/$BACKUP_REF")
    BACKUP_TYPE="remote branch"
    echo "ℹ️  Found remote backup, fetching..."
    git fetch origin "$BACKUP_REF:$BACKUP_REF" 2>/dev/null || true
else
    BACKUP_COMMIT=$(git rev-parse "$BACKUP_REF")
    BACKUP_TYPE="tag"
fi

BACKUP_MSG=$(git log -1 --format="%s" "$BACKUP_COMMIT")
BACKUP_DATE=$(git log -1 --format="%ad" --date=iso "$BACKUP_COMMIT")

echo "📋 Backup Information:"
echo "   Reference: $BACKUP_REF"
echo "   Type: $BACKUP_TYPE"
echo "   Commit: $BACKUP_COMMIT"
echo "   Message: $BACKUP_MSG"
echo "   Date: $BACKUP_DATE"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes!"
    echo ""
    read -p "Save current work to a stash? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        STASH_NAME="pre-revert-$(date +%Y-%m-%d-%H%M%S)"
        git stash push -m "$STASH_NAME"
        echo "✅ Saved to stash: $STASH_NAME"
        echo "   Restore with: git stash pop"
    else
        read -p "Create backup branch before reverting? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            BACKUP_NAME="backup/before-revert-$(date +%Y-%m-%d-%H%M%S)"
            git branch "$BACKUP_NAME"
            echo "✅ Created backup branch: $BACKUP_NAME"
        else
            echo "⚠️  Proceeding without backup - uncommitted changes will be lost!"
            read -p "Are you absolutely sure? (yes/N): " -n 3 -r
            echo
            if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
                echo "Aborted."
                exit 1
            fi
        fi
    fi
fi

# Confirm action
echo ""
read -p "Continue with revert? (yes/N): " -n 3 -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Fetch latest from remote
echo ""
echo "📥 Fetching latest from remote..."
git fetch origin

# Reset to backup
echo ""
echo "🔄 Resetting to backup state..."
git reset --hard "$BACKUP_REF"

# Verify
echo ""
echo "✅ Reset complete!"
echo ""
echo "📋 Verification:"
echo "   Current commit: $(git rev-parse HEAD)"
echo "   Backup commit: $BACKUP_COMMIT"
echo ""

if [ "$(git rev-parse HEAD)" = "$BACKUP_COMMIT" ]; then
    echo "✅ Successfully reverted to backup: $BACKUP_REF"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Review the changes: git log --oneline -5"
    echo "   2. Test the site locally"
    echo "   3. If satisfied, force push to remote:"
    echo "      git push origin $CURRENT_BRANCH --force"
    echo ""
    echo "⚠️  Remember: Force push will overwrite remote history!"
else
    echo "❌ Error: Commit hash mismatch!"
    echo "   Please check manually"
    exit 1
fi


