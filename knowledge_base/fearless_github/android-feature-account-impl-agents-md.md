---
title: 'android: AGENTS'
source: fearless_github
source_url: >-
  https://github.com/soramitsu/fearless-Android/blob/254f17ec67c1d2bd197569b95590c91113d0c1af/feature-account-impl/AGENTS.md
source_commit: 254f17ec67c1d2bd197569b95590c91113d0c1af
doc_id: 487beedd3664441f
snapshot_id: '2025-11-03'
fetched_at: '2025-11-03T06:23:28.117Z'
lang: en
license: Fearless Wallet
checksum_sha256: 4055f59332f591d64484135c4ae9e9494dafce89a681e7cbfea2fa2044708d04
content_hash: 4055f59332f591d64484135c4ae9e9494dafce89a681e7cbfea2fa2044708d04
publishDate: '2025-11-03T06:23:28.117Z'
repo: android
file_path: feature-account-impl/AGENTS.md
---
# AGENTS Guide: feature-account-impl

Purpose
- Implements account management, meta-accounts, address book, and node management screens.
- Bridges account data with chain-specific requirements (Substrate, EVM, TON).

Key Spots
- Data sources/repositories under `impl/data/repository/*` and `impl/data/repository/datasource/*`.
- Node management UI: `presentation/options_switch_node/OptionsSwitchNodeContent.kt`.
- Address book screens and viewmodels live under `presentation/addressbook/*`.

Integration Points
- Uses `core-db` for accounts, nodes, and address book tables.
- Coordinates with `runtime` for node switching via `ChainRegistry.switchNode`.

Common Tasks
- Add derivation path support: extend account repository/data sources and DB fields as needed.
- Implement/adjust meta-account logic: ensure `accountId(chain)` is null-safe for EVM chains.
- Node management polish: unhide/enable switch button when behavior is finalized.

Known TODOs/Tech Debt
- `api/presentation/account/AddressDisplayUseCase.kt`: adopt meta-account logic.
- `api/domain/model/Account.kt`: consider making `cryptoType` optional.
- `impl/data/repository/datasource/AccountDataSource.kt`: compatibility-only path; review necessity.
- `presentation/options_switch_node/OptionsSwitchNodeContent.kt`: button temporarily hidden.

Tests
- `./gradlew :feature-account-impl:testDebugUnitTest`
- Add ViewModel tests using coroutines test; mock repositories/ChainRegistry for node flows.
