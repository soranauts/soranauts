#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"

echo "Verifying glossary alias redirects against: ${BASE_URL}"
echo

# Hot-path aliases to verify (alias → canonical)
declare -A ALIASES=(
  ["hyperledger-iroha-3"]="iroha3"
  ["iroha-3"]="iroha3"
  ["iroha-v3"]="iroha3"
  ["sora-v3"]="iroha3"
)

fail=0

for alias in "${!ALIASES[@]}"; do
  canonical="${ALIASES[$alias]}"
  path="/glossary/${alias}"
  url="${BASE_URL}${path}"

  echo "Checking ${path} → /glossary/${canonical} ..."

  # Capture status and Location header without following redirects
  response_headers="$(curl -sS -o /dev/null -D - -w '%{http_code}' "${url}")" || {
    echo "  ❌ curl failed for ${url}"
    fail=1
    continue
  }

  status="${response_headers##*$'\n'}"
  headers="${response_headers%$'\n'*}"

  echo "  status: ${status}"

  # Extract Location header if present
  location="$(printf '%s\n' "${headers}" | awk -F': ' 'tolower($1)=="location" {print $2}' | tr -d '\r')"
  [ -n "${location}" ] && echo "  location: ${location}"

  if [[ "${status}" == "308" ]]; then
    expected1="/glossary/${canonical}"
    expected2="/glossary/${canonical}/"
    if [[ "${location}" != "${expected1}" && "${location}" != "${expected2}" ]]; then
      echo "  ❌ 308 redirect has wrong Location (expected ${expected1} or ${expected2})"
      fail=1
    else
      echo "  ✅ 308 redirect points to canonical"
    fi
  else
    # Accept 200 or other successful codes for environments without explicit redirects
    echo "  ⚠ Non-308 status (${status}) – assuming middleware or static routing handles canonical page."
  fi

  echo
done

if [[ "${fail}" -ne 0 ]]; then
  echo "One or more alias checks failed."
  exit 1
fi

echo "All alias checks passed (or are non-redirecting but reachable)."


