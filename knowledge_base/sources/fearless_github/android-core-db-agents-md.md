---
title: 'android: AGENTS'
source: fearless_github
source_url: >-
  https://github.com/soramitsu/fearless-Android/blob/254f17ec67c1d2bd197569b95590c91113d0c1af/core-db/AGENTS.md
source_commit: 254f17ec67c1d2bd197569b95590c91113d0c1af
doc_id: 3f21db2061ea9aa1
snapshot_id: '2025-11-03'
fetched_at: '2025-11-03T06:23:28.114Z'
lang: en
license: Fearless Wallet
checksum_sha256: d4cabdbab028e2173fd00ce807641a1b83fe667bfda252b834ac22d30449eb4d
content_hash: d4cabdbab028e2173fd00ce807641a1b83fe667bfda252b834ac22d30449eb4d
publishDate: '2025-11-03T06:23:28.114Z'
repo: android
file_path: core-db/AGENTS.md
---
# AGENTS Guide: core-db

Purpose
- Central Room database with entities, DAOs, and migrations for chains, assets, accounts, operations, and integrations.

Key Files
- `AppDatabase.kt` — database definition, versioning, and type converters.
- Entities: `model/*` and `model/chain/*` (e.g., `ChainLocal`, `ChainAssetLocal`, `MetaAccountLocal`).
- DAOs: `dao/*` (e.g., `ChainDao`, `AssetDao`, `MetaAccountDao`).
- Migrations: `migrations/*` with helpers for version-to-version upgrades.
- Schemas: `schemas/` for Room schema snapshots (used by migration tests).

Common Tasks
- Add a table/column:
 1) Add/update entity model(s) with Room annotations.
 2) Increment DB version in `AppDatabase`.
 3) Add a migration under `migrations/` and wire it in `Migrations.kt`.
 4) Update DAOs.
 5) Write a migration test.

Migration Testing
- Pattern: use Room’s auto-migration/migration test harness.
- Run: `./gradlew :core-db:testDebugUnitTest`.

Integration
- `runtime` consumes `ChainDao` for chain info, nodes, and sync decisions.
- Feature modules query/update asset/account data via DAOs.

Notes
- Keep converters focused; large JSON fields should be carefully versioned.
- Ensure `@Transaction` is used for multi-DAO updates where consistency matters.
