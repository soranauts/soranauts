#!/usr/bin/env bash
set -euo pipefail

check() {
  url="$1"
  echo "--- $url"
  curl -sI "$url" | sed -n '1p;/^location:/Ip'
  echo
}

check "https://www.soranauts.com/soramitsu-sora-polkaswap"
check "https://soranauts.com/soramitsu-sora-polkaswap"
check "https://soranauts.com/soramitsu-sora-polkaswap/"
