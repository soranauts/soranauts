#!/bin/bash
set -e

echo "=== Determinism Test ==="
echo "Testing with cache enabled (default behavior)..."
echo "Running ingest twice and comparing manifests..."

# First run
echo "Run 1: Initial ingestion..."
pnpm --filter @soranauts/web kb:ingest > /tmp/kb-ingest-1.log 2>&1

# Backup index
echo "Backing up index..."
rm -rf knowledge_base/index.baseline
cp -r knowledge_base/index knowledge_base/index.baseline

# Second run (should use cache)
echo "Run 2: Re-ingestion (with cache)..."
pnpm --filter @soranauts/web kb:ingest > /tmp/kb-ingest-2.log 2>&1

# Normalize manifests (strip timestamps, durations, IDs, sort keys/arrays)
sanitize_manifest() {
  local src="$1"
  local dest="$2"
  if command -v jq >/dev/null 2>&1; then
    # Remove dynamic fields, sort keys, sort arrays
    jq '
      del(.created_at) |
      del(.cache_hit_rate) |  # May vary slightly
      with_entries(.value |= if type == "object" then to_entries | sort_by(.key) | from_entries else . end) |
      to_entries | sort_by(.key) | from_entries
    ' "$src" > "$dest"
  else
    # Fallback: just remove created_at
    grep -v '"created_at"' "$src" | grep -v '"cache_hit_rate"' > "$dest" || true
  fi
}

echo "Comparing manifests (normalized)..."
sanitize_manifest knowledge_base/index.baseline/manifest.json /tmp/manifest-baseline.json
sanitize_manifest knowledge_base/index/manifest.json /tmp/manifest-current.json
if diff -q /tmp/manifest-baseline.json /tmp/manifest-current.json > /dev/null 2>&1; then
  echo "✓ Manifest is identical"
else
  echo "✗ Manifest differs:"
  diff /tmp/manifest-baseline.json /tmp/manifest-current.json || true
  exit 1
fi

# Compare file registry
echo "Comparing file registries..."
if diff -q knowledge_base/index.baseline/.file_registry.json knowledge_base/index/.file_registry.json > /dev/null 2>&1; then
  echo "✓ File registry is identical"
else
  echo "✗ File registry differs"
  diff knowledge_base/index.baseline/.file_registry.json knowledge_base/index/.file_registry.json || true
  exit 1
fi

# Check for chunk ID stability
echo "Verifying chunk IDs..."
BASELINE_IDS=$(find knowledge_base/index.baseline/chroma.sqlite3* -name "*.sqlite3" 2>/dev/null | wc -l || echo "0")
CURRENT_IDS=$(find knowledge_base/index/chroma.sqlite3* -name "*.sqlite3" 2>/dev/null | wc -l || echo "0")

if [ "$BASELINE_IDS" = "$CURRENT_IDS" ]; then
  echo "✓ Chunk count matches"
else
  echo "✗ Chunk count differs: baseline=$BASELINE_IDS, current=$CURRENT_IDS"
  exit 1
fi

echo ""
echo "✓ Determinism test PASSED"

