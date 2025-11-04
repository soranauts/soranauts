#!/bin/bash

# Emergency Revert Script - Restore to Production State
# Created: November 4, 2025
# Backup Commit: 06a2cf217c93d7209dbe16ecb8a272ef0da90702

set -e  # Exit on error

BACKUP_BRANCH="backup/pre-changelog-revamp-2025-11-04"
BACKUP_TAG="backup-production-2025-11-04"
BACKUP_COMMIT="06a2cf217c93d7209dbe16ecb8a272ef0da90702"

echo "⚠️  WARNING: This will reset your current branch to the production state!"
echo "📋 Backup Information:"
echo "   Branch: $BACKUP_BRANCH"
echo "   Tag: $BACKUP_TAG"
echo "   Commit: $BACKUP_COMMIT"
echo ""

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  You are not on the 'main' branch. Current branch: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

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
echo "This will reset '$CURRENT_BRANCH' to the production state."
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
echo "🔄 Resetting to production state..."
if git show-ref --verify --quiet refs/heads/$BACKUP_BRANCH; then
    echo "   Using backup branch: $BACKUP_BRANCH"
    git reset --hard $BACKUP_BRANCH
elif git show-ref --verify --quiet refs/tags/$BACKUP_TAG; then
    echo "   Using backup tag: $BACKUP_TAG"
    git reset --hard $BACKUP_TAG
else
    echo "   Using commit hash: $BACKUP_COMMIT"
    git reset --hard $BACKUP_COMMIT
fi

# Verify
echo ""
echo "✅ Reset complete!"
echo ""
echo "📋 Verification:"
echo "   Current commit: $(git rev-parse HEAD)"
echo "   Expected commit: $BACKUP_COMMIT"
echo ""

if [ "$(git rev-parse HEAD)" = "$BACKUP_COMMIT" ]; then
    echo "✅ Successfully reverted to production state!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Review the changes: git log --oneline -5"
    echo "   2. Test the site locally"
    echo "   3. If satisfied, force push to remote:"
    echo "      git push origin main --force"
    echo ""
    echo "⚠️  Remember: Force push will overwrite remote history!"
else
    echo "❌ Error: Commit hash mismatch!"
    echo "   Please check manually and refer to REVERT_TO_PRODUCTION.md"
    exit 1
fi

