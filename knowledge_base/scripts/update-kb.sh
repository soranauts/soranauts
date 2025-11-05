#!/bin/bash
# Convenience script to manually update the knowledge base
# This script loads the API key from .env and runs ingestion

set -e  # Exit on error

# Get the script directory and navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

# Check if .env file exists
if [ -f .env ]; then
  echo "📄 Loading environment variables from .env file..."
  # Load .env file (export variables)
  set -a
  source .env
  set +a
fi

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "❌ Error: OPENAI_API_KEY is not set"
  echo ""
  echo "Please set it in one of these ways:"
  echo "  1. Create a .env file in the repo root with: OPENAI_API_KEY=your-key"
  echo "  2. Export it: export OPENAI_API_KEY=your-key"
  echo ""
  exit 1
fi

echo "✅ OPENAI_API_KEY found"
echo "🚀 Starting knowledge base ingestion..."
echo ""

# Run the ingestion (pass through any additional arguments)
pnpm --filter @soranauts/web kb:ingest "$@"

echo ""
echo "✅ Knowledge base update complete!"


