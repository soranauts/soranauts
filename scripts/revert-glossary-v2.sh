#!/usr/bin/env bash

set -euo pipefail

TARGET_REF="${1:-origin/main}"

# Ensure we are inside the repo root
if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  echo "[revert-glossary-v2] Error: not inside a git repository." >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || echo "")"

if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "[revert-glossary-v2] Error: unable to determine current branch." >&2
  exit 1
fi

if [[ "$CURRENT_BRANCH" == "main" ]]; then
  echo "[revert-glossary-v2] Refusing to run on main. Please checkout your feature branch first." >&2
  exit 1
fi

if ! git rev-parse --verify "$TARGET_REF" >/dev/null 2>&1; then
  echo "[revert-glossary-v2] Error: target ref '$TARGET_REF' not found." >&2
  exit 1
fi

echo "This will hard-reset branch '$CURRENT_BRANCH' to '$TARGET_REF'"
echo "A backup branch will be created so you can recover the current state."
read -rp "Continue? [y/N] " CONFIRM

if [[ "${CONFIRM,,}" != "y" ]]; then
  echo "Aborted."
  exit 0
fi

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_BRANCH="backup/glossary-v2-$TIMESTAMP"

echo "Creating backup branch '$BACKUP_BRANCH'..."
git branch "$BACKUP_BRANCH"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has local changes — stashing before reset."
  git stash push -u -m "glossary-v2-auto-backup-$TIMESTAMP"
fi

echo "Resetting '$CURRENT_BRANCH' to '$TARGET_REF'..."
git reset --hard "$TARGET_REF"
git clean -fd

echo
echo "Revert complete."
echo "Backup branch: $BACKUP_BRANCH"
echo "If a stash was created, list it with: git stash list"










