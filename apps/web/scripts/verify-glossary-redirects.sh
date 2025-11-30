#!/usr/bin/env bash
set -euo pipefail

CACHE_BUSTER="$(date +%s)"
ROOT="https://soranauts.com"

fetch_headers() {
  curl -Is --max-time 10 --retry 5 --retry-delay 1 --retry-all-errors \
    "${1}?ci=${CACHE_BUSTER}"
}

require_status_and_location() {
  local url="$1" expect_status="$2" expect_location="$3"
  local hdrs
  hdrs="$(fetch_headers "$url")"
  echo "$hdrs"
  echo "$hdrs" | grep -iqE "^HTTP/(1\.1|2) +${expect_status}\\b"
  echo "$hdrs" | grep -iqE "^location: ${expect_location}\\b"
}

require_status() {
  local url="$1" expect_status="$2"
  local hdrs
  hdrs="$(fetch_headers "$url")"
  echo "$hdrs"
  echo "$hdrs" | grep -iqE "^HTTP/(1\.1|2) +${expect_status}\\b"
}

mapfile -t PAIRS < <(jq -r '
  .redirects[]
  | select(.source|startswith("/glossary/"))
  | select(.destination|startswith("/glossary/"))
  | "\(.source)|\(.destination)"' apps/web/vercel.json)

echo "Found ${#PAIRS[@]} glossary redirects in vercel.json"
test "${#PAIRS[@]}" -gt 0

for pair in "${PAIRS[@]}"; do
  src="${pair%%|*}"
  dst="${pair##*|}"
  require_status_and_location "${ROOT}${src}"  "308" "${dst}"
  [[ "$src" =~ /$ ]] || require_status_and_location "${ROOT}${src}/" "308" "${dst}"
done

require_status "${ROOT}/glossary/bonding-curve" "200"
curl -s "${ROOT}/data/glossary.v2025.json?ci=${CACHE_BUSTER}" \
  | jq -e '.canonicalCount==157 and .aliasCount==38 and .deprecatedCount==0' >/dev/null

echo "✅ All glossary redirects verified dynamically"
