#!/usr/bin/env bash
set -euo pipefail

check_redirect() {
  local src="$1" dst="$2"
  hdrs="$(curl -Is "https://soranauts.com${src}")"
  echo "$hdrs"
  echo "$hdrs" | grep -qE "^HTTP/2 308$"
  echo "$hdrs" | grep -qi "location: ${dst}"
}

check_redirect "/glossary/token-bonding-curve"  "/glossary/bonding-curve"
check_redirect "/glossary/token-bonding-curve/" "/glossary/bonding-curve"

curl -s https://soranauts.com/data/glossary.v2025.json | jq -e '.canonicalCount==52 and .aliasCount==5 and .deprecatedCount==0' >/dev/null

echo "✅ Glossary redirects + counts OK"
