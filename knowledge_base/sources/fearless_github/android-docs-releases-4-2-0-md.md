---
title: 'android: 4.2.0'
source: fearless_github
source_url: >-
  https://github.com/soramitsu/fearless-Android/blob/254f17ec67c1d2bd197569b95590c91113d0c1af/docs/releases/4.2.0.md
source_commit: 254f17ec67c1d2bd197569b95590c91113d0c1af
doc_id: 3149d4fb5dfbc6fa
snapshot_id: '2025-11-03'
fetched_at: '2025-11-03T06:23:28.116Z'
lang: en
license: Fearless Wallet
checksum_sha256: 4897d71e3a820f01f0d231340bd1063e6d876b0d2fa1e964fd645a9194a8da09
content_hash: 4897d71e3a820f01f0d231340bd1063e6d876b0d2fa1e964fd645a9194a8da09
publishDate: '2025-11-03T06:23:28.116Z'
repo: android
file_path: docs/releases/4.2.0.md
---
# Fearless Android 4.2.0 (stable)

## Summary

Promote 4.2.0 from 4.2.0‑beta.1 with no functional changes. Stability verified across core flows and ecosystems.

## Changes Since 4.2.0‑beta.1

- No functional changes; version bump only
- Continue to monitor crash/ANR metrics and session health

## Rollout Plan

- Staged rollout: 10% → 25% → 50% → 100%
- Halt criteria: crash‑free drop > 0.5% or new P0/P1 defects in core flows

## Store Notes (Play)

- Use the same release notes as the beta
- Attach links to docs/releases/4.2.0-beta.md for internal reference

## Post‑Release

- Tag: `git tag -s 4.2.0 -m "fearless-Android 4.2.0" && git push origin 4.2.0`
- Create `4.2.x` patch branch if needed
- Update `docs/status.md` and `docs/roadmap.md` to reflect current state
