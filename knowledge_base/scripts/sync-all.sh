#!/bin/bash
# Comprehensive script to sync all knowledge base sources and ingest
# This script runs all sync operations (TONSWAP, Medium, Wiki, etc.) then ingests

# Don't exit on error - we want to continue even if some syncs fail
set +e

# Get the script directory and navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

# Check if .env file exists
if [ -f .env ]; then
  echo "📄 Loading environment variables from .env file..."
  set -a
  source .env
  set +a
fi

# Check if OPENAI_API_KEY is set (needed for ingestion)
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  Warning: OPENAI_API_KEY is not set"
  echo "   Sync operations will run, but ingestion will be skipped"
  echo ""
fi

echo "🚀 Starting knowledge base sync operations..."
echo ""

# Track failures
FAILURES=0

# Function to run a sync command with error handling
run_sync() {
  local name="$1"
  local command="$2"
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📥 Syncing: $name"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if eval "$command"; then
    echo "✅ $name sync completed successfully"
    echo ""
  else
    echo "❌ $name sync failed"
    FAILURES=$((FAILURES + 1))
    echo ""
  fi
}

# TONSWAP syncs
run_sync "TONSWAP Site" "pnpm --filter @soranauts/web kb:sync:tonswap"
run_sync "TONSWAP Medium" "pnpm --filter @soranauts/web kb:sync:tonswap:medium"

# Other syncs (commented out for now, uncomment as needed)
# run_sync "SORA Medium" "pnpm --filter @soranauts/web kb:sync:medium"
# run_sync "Polkaswap Medium" "pnpm --filter @soranauts/web kb:sync:polkaswap"
# run_sync "Fearless Medium" "pnpm --filter @soranauts/web kb:sync:fearless"
# run_sync "Fearless GitHub" "pnpm --filter @soranauts/web kb:sync:fearless:github"
# run_sync "SORA Wiki" "pnpm --filter @soranauts/web kb:sync:wiki"
# run_sync "Iroha Docs" "pnpm --filter @soranauts/web kb:sync:iroha"
# run_sync "SORAMITSU Site" "pnpm --filter @soranauts/web kb:sync:soramitsu"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Sync Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILURES -eq 0 ]; then
  echo "✅ All sync operations completed successfully!"
else
  echo "⚠️  $FAILURES sync operation(s) failed"
fi
echo ""

# Run ingestion if API key is available
if [ -n "$OPENAI_API_KEY" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🧠 Starting knowledge base ingestion..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "⚠️  Note: Ingestion requires ChromaDB to be running"
  echo "   If ChromaDB is not running, ingestion will fail"
  echo ""
  
  if pnpm --filter @soranauts/web kb:ingest "$@"; then
    echo ""
    echo "✅ Knowledge base ingestion complete!"
  else
    echo ""
    echo "❌ Knowledge base ingestion failed"
    echo "   This may be due to ChromaDB not running or other connection issues"
    echo "   Sync operations completed successfully - files are ready for ingestion"
    INGEST_FAILED=1
  fi
else
  echo "⏭️  Skipping ingestion (OPENAI_API_KEY not set)"
  echo ""
  echo "To run ingestion, set OPENAI_API_KEY in your .env file"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILURES -eq 0 ] && [ -z "$INGEST_FAILED" ]; then
  echo "✨ All operations complete!"
elif [ $FAILURES -eq 0 ]; then
  echo "✅ Sync operations complete (ingestion skipped/failed)"
else
  echo "⚠️  Some operations failed - check logs above"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Exit with error code if there were failures
if [ $FAILURES -gt 0 ]; then
  exit 1
fi

