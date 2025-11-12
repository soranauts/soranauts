---
title: 'android: pull_request_template'
source: fearless_github
source_url: >-
  https://github.com/soramitsu/fearless-Android/blob/254f17ec67c1d2bd197569b95590c91113d0c1af/.github/pull_request_template.md
source_commit: 254f17ec67c1d2bd197569b95590c91113d0c1af
doc_id: 096d03479c7f5b30
snapshot_id: '2025-11-03'
fetched_at: '2025-11-03T06:23:28.111Z'
lang: en
license: Fearless Wallet
checksum_sha256: 36e7569faf730c06d8847065a33c818a4e6cc8e9b4b8b32841a8fa4363b2f86c
content_hash: 36e7569faf730c06d8847065a33c818a4e6cc8e9b4b8b32841a8fa4363b2f86c
publishDate: '2025-11-03T06:23:28.111Z'
repo: android
file_path: .github/pull_request_template.md
---
## Summary

Describe the change and why it’s needed.

## Related Issue

Closes #<issue-number> (or) Relates to #<issue-number>

## Type of Change

- [ ] feat (new feature)
- [ ] fix (bug fix)
- [ ] refactor (no functional change)
- [ ] chore/build (tooling, CI, deps)
- [ ] docs (README/AGENTS, comments)

## Screenshots / Videos

If UI changes, include before/after.

## Test Plan

Commands run locally:

```
./gradlew detektAll
./gradlew runTest
./gradlew :app:lint
```

Additional checks and scenarios covered:
- 

## Risks & Rollout

Potential impact, migrations, or config/secrets required.

## Checklist

- [ ] Linked an issue and added a clear description
- [ ] Added/updated tests for changed code (where applicable)
- [ ] Updated docs (README/AGENTS) when behavior or commands changed
- [ ] Ran detektAll, runTest, and :app:lint locally (or via CI)
- [ ] No secrets or local.properties committed
