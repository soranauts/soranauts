#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://soranauts.com}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-5}"
RETRY_COUNT="${RETRY_COUNT:-2}"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required to run this verifier." >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required (used for lightweight HTML checks)." >&2
  exit 1
fi

log() {
  local level="$1"
  shift
  printf '[%s] %s\n' "${level}" "$*"
}

failures=0
alias_checked=0
alias_passed=0
page_checked=0
page_passed=0

declare -A CANONICAL_SAMPLES=(
  [irohavirtualmachineivm]="Iroha Virtual Machine (IVM)"
  [worldstateviewwsv]="World State View (WSV)"
  [starttimefairqueuingsfq]="Start-Time Fair Queuing (SFQ)"
  [transactionexecutionunitsteu]="Transaction Execution Units (TEU)"
  [dataspacedirectory]="Data Space Directory"
)

declare -A ALIAS_REDIRECTS=(
  [ivm]="irohavirtualmachineivm"
  ["iroha-virtual-machine"]="irohavirtualmachineivm"
  [wsv]="worldstateviewwsv"
  ["world-state-view"]="worldstateviewwsv"
  ["space-directory"]="dataspacedirectory"
  [teu]="transactionexecutionunitsteu"
  ["transaction-execution-units"]="transactionexecutionunitsteu"
  [sfq]="starttimefairqueuingsfq"
  ["start-time-fair-queuing"]="starttimefairqueuingsfq"
)

RANDOM_TERMS=(
  "accountlifecycle|Account Lifecycle"
  "accountid|AccountId"
  "activationslot|Activation Slot"
  "aggregation|Aggregation"
  "attestations|Attestations"
  "commitwindow|Commit Window"
  "dataspaces|Data Spaces"
  "exposure|Exposure"
  "governedmanifest|Governed Manifest"
  "hybridpqhandshake|Hybrid PQ Handshake"
  "kotodama|Kotodama"
  "laneproofs|Lane Proofs"
  "laneanddabudgets|Lane and DA Budgets"
  "norito|Norito"
  "parallellanes|Parallel Lanes"
  "proofverificationbudget|Proof Verification Budget"
  "seedbeacon|Seed Beacon"
  "soracles|Soracles"
  "sorafs|SoraFS"
  "zkdaproofs|ZK DA Proofs"
)

fetch_body() {
  local url="$1"
  # Use -sL to follow redirects silently
  curl -sL \
    --max-time "${TIMEOUT_SECONDS}" \
    --retry "${RETRY_COUNT}" \
    --retry-delay 1 \
    "${url}" 2>/dev/null
}

fetch_headers() {
  local url="$1"
  curl -IsS \
    --max-time "${TIMEOUT_SECONDS}" \
    --retry "${RETRY_COUNT}" \
    --retry-delay 1 \
    "${url}"
}

page_contains_h1() {
  local title="$1"
  local html="$2"
  printf '%s' "${html}" | python3 -c "
import re
import sys

title = '''${title}'''
html = sys.stdin.read()
# Match h1 tag containing the title (allowing for whitespace and newlines)
pattern = re.compile(r'<h1[^>]*>.*?' + re.escape(title) + r'.*?</h1>', re.IGNORECASE | re.DOTALL)
sys.exit(0 if pattern.search(html) else 1)
"
}

check_alias() {
  local alias_slug="$1"
  local target_slug="$2"
  local url="${BASE_URL}/glossary/${alias_slug}"
  alias_checked=$((alias_checked + 1))

  log INFO "Alias ${alias_slug} → ${target_slug}"

  local headers status location
  if ! headers="$(fetch_headers "${url}")"; then
    log ERROR "  curl failed for ${url}"
    failures=$((failures + 1))
    return
  fi

  status="$(printf '%s\n' "${headers}" | awk 'NR==1 {print $2}')"
  location="$(printf '%s\n' "${headers}" | awk -F': ' 'tolower($1)=="location" {print $2}' | tail -n1 | tr -d '\r')"

  case "${status}" in
    308)
      local expected="/glossary/${target_slug}"
      if [[ "${location}" == "${expected}" || "${location}" == "${expected}/" ]]; then
        log INFO "  ✅ 308 redirect points to ${location:-<none>}"
        alias_passed=$((alias_passed + 1))
      else
        log ERROR "  ❌ 308 redirect expected ${expected}, got ${location:-<none>}"
        failures=$((failures + 1))
      fi
      ;;
    200)
      log WARN "  ⚠ alias responded 200; assuming on-page canonical rendering"
      alias_passed=$((alias_passed + 1))
      ;;
    *)
      log ERROR "  ❌ unexpected status ${status}"
      failures=$((failures + 1))
      ;;
  esac
}

check_page_h1() {
  local slug="$1"
  local title="$2"
  local label="$3"
  local url="${BASE_URL}/glossary/${slug}"
  page_checked=$((page_checked + 1))

  log INFO "${label}: /glossary/${slug}"

  local body
  body="$(fetch_body "${url}")"
  
  if [[ -z "${body}" ]]; then
    log ERROR "  ❌ failed to load ${url}"
    failures=$((failures + 1))
    return
  fi

  if page_contains_h1 "${title}" "${body}"; then
    log INFO "  ✅ found <h1> for ${title}"
    page_passed=$((page_passed + 1))
  else
    log ERROR "  ❌ missing exact <h1> for ${title}"
    failures=$((failures + 1))
  fi
}

sample_random_terms() {
  local count="$1"
  local available="${#RANDOM_TERMS[@]}"
  if (( count > available )); then
    count="${available}"
  fi
  if command -v shuf >/dev/null 2>&1; then
    printf '%s\n' "${RANDOM_TERMS[@]}" | shuf -n "${count}"
  else
    printf '%s\n' "${RANDOM_TERMS[@]}" | head -n "${count}"
  fi
}

log INFO "Verifying Nexus glossary + Explorer against ${BASE_URL}"

log INFO "Step 1: Canonical slug spot-checks"
for slug in "${!CANONICAL_SAMPLES[@]}"; do
  check_page_h1 "${slug}" "${CANONICAL_SAMPLES[${slug}]}" "  canonical"
done

log INFO "Step 2: Alias redirects"
for alias_slug in "${!ALIAS_REDIRECTS[@]}"; do
  check_alias "${alias_slug}" "${ALIAS_REDIRECTS[${alias_slug}]}"
done

log INFO "Step 3: Explorer availability"
explorer_url="${BASE_URL}/explore"
if explorer_body="$(fetch_body "${explorer_url}")"; then
  if printf '%s' "${explorer_body}" | grep -qi "explorer\|sora\|glossary"; then
    log INFO "  ✅ Explorer page rendered"
  else
    log WARN "  ⚠ Explorer page loaded but may be missing expected content"
  fi
else
  log ERROR "  ❌ Failed to load /explore"
  failures=$((failures + 1))
fi

log INFO "Step 4: Random Nexus entries (10 picks)"
mapfile -t RANDOM_SAMPLE < <(sample_random_terms 10)
idx=1
for entry in "${RANDOM_SAMPLE[@]}"; do
  slug="${entry%%|*}"
  title="${entry#*|}"
  check_page_h1 "${slug}" "${title}" "  random ${idx}"
  idx=$((idx + 1))
done

printf '\n'
log INFO "Alias checks: ${alias_passed}/${alias_checked} passed"
log INFO "Page checks: ${page_passed}/${page_checked} passed"

if (( failures > 0 )); then
  log ERROR "Verification completed with ${failures} failure(s)."
  exit 1
fi

log INFO "Verification completed successfully."
