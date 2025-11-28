#!/usr/bin/env bash
set -euo pipefail

CACHE_BUSTER="$(date +%s)"

fetch_headers() {
  curl -Is --max-time 10 --retry 5 --retry-delay 1 --retry-all-errors \
    "${1}?ci=${CACHE_BUSTER}"
}

require_status_and_location() {
  local url="$1" expect_status="$2" expect_location="$3"
  local hdrs
  hdrs="$(fetch_headers "$url")" || { echo "$hdrs"; exit 1; }
  echo "$hdrs"
  echo "$hdrs" | grep -iqE "^HTTP/(1\.1|2) +${expect_status}\\b" || exit 1
  echo "$hdrs" | grep -iqE "^location: ${expect_location}\\b" || exit 1
}

require_status() {
  local url="$1" expect_status="$2"
  local hdrs
  hdrs="$(fetch_headers "$url")" || { echo "$hdrs"; exit 1; }
  echo "$hdrs"
  echo "$hdrs" | grep -iqE "^HTTP/(1\.1|2) +${expect_status}\\b" || exit 1
}

ALIASES=(
  "/glossary/hyperledger-iroha|/glossary/iroha"
  "/glossary/hyperledger-iroha-3|/glossary/iroha3"
  "/glossary/sora-council|/glossary/council"
  "/glossary/sora-parliament|/glossary/parliament"
  "/glossary/token-bonding-curve|/glossary/bonding-curve"
)

for pair in "${ALIASES[@]}"; do
  src="${pair%%|*}"
  dst="${pair##*|}"
  require_status_and_location "https://soranauts.com${src}"  "308" "${dst}"
  [[ "$src" =~ /$ ]] || require_status_and_location "https://soranauts.com${src}/" "308" "${dst}"
done
require_status "https://soranauts.com/glossary/bonding-curve" "200"

curl -s "https://soranauts.com/data/glossary.v2025.json?ci=${CACHE_BUSTER}" \
  | jq -e '.canonicalCount==52 and .aliasCount==5 and .deprecatedCount==0' >/dev/null

echo "✅ Redirects OK"
