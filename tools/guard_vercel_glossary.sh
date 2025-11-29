#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
VERCEL_JSON="$ROOT_DIR/apps/web/vercel.json"
TMP_BEFORE=""
TMP_AFTER=""

strip_glossary_block() {
  perl -MJSON::PP -0ne '
    my $json = decode_json($_);
    if (exists $json->{redirects}) {
      my @kept = grep {
        !exists $_->{source} || $_->{source} !~ m{^/glossary/}
      } @{$json->{redirects}};
      $json->{redirects} = \@kept;
    }
    my $encoder = JSON::PP->new->canonical(1)->pretty(1);
    print $encoder->encode($json);
  ' "$1"
}

clean_tmp() {
  [[ -n "$TMP_BEFORE" ]] && rm -f "$TMP_BEFORE"
  [[ -n "$TMP_AFTER" ]] && rm -f "$TMP_AFTER"
}

main() {
  if [[ ! -f "$VERCEL_JSON" ]]; then
    echo "Unable to find $VERCEL_JSON" >&2
    exit 1
  fi

  TMP_BEFORE="$(mktemp "${TMPDIR:-/tmp}/vercel.guard.before.XXXXXX")"
  TMP_AFTER="$(mktemp "${TMPDIR:-/tmp}/vercel.guard.after.XXXXXX")"
  trap clean_tmp EXIT

  strip_glossary_block "$VERCEL_JSON" >"$TMP_BEFORE"

  (cd "$ROOT_DIR" && pnpm taxonomy:fix --debug >/dev/null)

  strip_glossary_block "$VERCEL_JSON" >"$TMP_AFTER"

  if ! cmp -s "$TMP_BEFORE" "$TMP_AFTER"; then
    echo "Non-glossary redirect region changed after pnpm taxonomy:fix" >&2
    diff -u "$TMP_BEFORE" "$TMP_AFTER" || true
    exit 1
  fi

  echo "Glossary guard: non-glossary redirects unchanged."
}

main "$@"

