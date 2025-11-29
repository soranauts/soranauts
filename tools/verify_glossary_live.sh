#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-}"
if [[ -z "$BASE_URL" ]]; then
  echo "Usage: $0 https://your-vercel-url.vercel.app"
  exit 1
fi

timestamp="$(date +%s)"

curl_head() {
  local url="$1"
  curl -sS -o /dev/null -D - "$url"
}

curl_follow() {
  local url="$1"
  curl -sS -o /dev/null -D - -L "$url"
}

expect_200() {
  local path="$1"
  local url="${BASE_URL}${path}?ci=${timestamp}"
  local status
  status="$(curl -sS -o /dev/null -w "%{http_code}" "$url")"
  if [[ "$status" != "200" ]]; then
    echo "ERROR: $path expected 200, got $status"
    curl_head "$url"
    exit 1
  fi
  echo "✓ $path returned 200"
}

expect_redirect() {
  local from="$1"
  local to="$2"
  local url="${BASE_URL}${from}?ci=${timestamp}"
  local head
  head="$(curl -sS -o /dev/null -w "%{http_code}\n%{redirect_url}" -I "$url")"
  local status="$(echo "$head" | sed -n '1p')"
  local location="$(echo "$head" | sed -n '2p')"
  if [[ "$status" != "301" && "$status" != "308" ]]; then
    echo "ERROR: $from expected 301/308, got $status"
    curl_head "$url"
    exit 1
  fi
  if [[ "$location" != "${BASE_URL}${to}"* ]]; then
    echo "ERROR: $from expected Location ${BASE_URL}${to}, got $location"
    curl_head "$url"
    exit 1
  fi
  local final_status
  final_status="$(curl -sS -o /dev/null -w "%{http_code}" -L "$url")"
  if [[ "$final_status" != "200" ]]; then
    echo "ERROR: $from final status expected 200, got $final_status"
    curl_follow "$url"
    exit 1
  fi
  echo "✓ $from redirects to $to (status $status → 200)"
}

expect_200 "/glossary/iroha3"
expect_200 "/glossary/bonding-curve"
expect_200 "/glossary/parliament"
expect_200 "/glossary/council"

expect_redirect "/glossary/sora-v3" "/glossary/iroha3"
expect_redirect "/glossary/token-bonding-curve" "/glossary/bonding-curve"
expect_redirect "/glossary/sora-parliament" "/glossary/parliament"
expect_redirect "/glossary/sora-council" "/glossary/council"

echo "All checks passed."

