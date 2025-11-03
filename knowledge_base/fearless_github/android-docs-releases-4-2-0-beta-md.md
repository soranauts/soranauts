---
title: 'android: 4.2.0-beta'
source: fearless_github
source_url: >-
  https://github.com/soramitsu/fearless-Android/blob/254f17ec67c1d2bd197569b95590c91113d0c1af/docs/releases/4.2.0-beta.md
source_commit: 254f17ec67c1d2bd197569b95590c91113d0c1af
doc_id: 036a118ab0483c55
snapshot_id: '2025-11-03'
fetched_at: '2025-11-03T06:23:28.116Z'
lang: en
license: Fearless Wallet
checksum_sha256: 2972e923e44d30673a1241506a59b1f19ccaea35b31bee5cec0b50b023e57694
content_hash: 2972e923e44d30673a1241506a59b1f19ccaea35b31bee5cec0b50b023e57694
publishDate: '2025-11-03T06:23:28.116Z'
repo: android
file_path: docs/releases/4.2.0-beta.md
---
# Fearless Android 4.2.0-beta.1

## Summary

Beta release enabling public TON features, Coinbase provider integration, Reown (WalletConnect) migration, and Android toolchain upgrades required by Google Play. Includes CI hardening and assorted fixes.

## Highlights

- TON: public features available across supported flows (send/receive, details, explorers)
- Providers: Coinbase provider added; new price service; remote asset sync service
- WalletConnect: migrated integrations to Reown SDK (sessions, signing, disconnect)
- Platform: toolchain upgrades (AGP/Kotlin/SDK/NDK updates) to meet Play requirements
- CI/CD: NDK r28, native libs verification, alignment printing, Jenkins stability improvements
- Fixes: banner closing (FLW‑5177), Ethereum recipient validation/warning → confirmation, UI tweaks

## Changes (since last release)

- Feature: TON features public (user‑visible operations and views)
- Feature: Coinbase provider integration
- Feature: New price service + remote assets sync service
- Migration: WalletConnect → Reown SDK
- Platform: Upgrade Android toolchain to current Play policy
- CI: print Polkadot SDK alignment; native `.so` verification; stable Jenkins ordering; disable parallel for DataBinding
- Fixes: banner close; ETH recipient validation; UX improvements in confirmation flow

## Risks & Notes

- Reown SDK migration spans Substrate/EVM chains; verify dapp sessions end‑to‑end
- Deprecated APIs are still present (Compose theme alias, Flow preview/opt‑in, Room index hints) — safe to ship; tracked for cleanup
- Ensure mirrors and overrides are set for first‑time builds (see README and AGENTS.md)

## Test Matrix (beta)

- Devices: Android 13/14/15; ARM64; one low‑RAM device
- Chains: Polkadot/Kusama (Substrate), Ethereum/Polygon/BSC (EVM), TON
- Scenarios:
 - Onboarding/import/export; chain switching; balances; transfers (all ecosystems)
 - Reown: connect → sign → disconnect with representative dapps
 - Prices/assets: refresh, sorting, remote sync
 - Staking: screens render; basic read flows
 - Regression: deep links, QR scanner, backup/restore, haptics/biometrics

## Exit Criteria

- Crash‑free sessions ≥ 99.5% on beta cohort
- No P0/P1 issues in core flows (onboarding, transfer, Reown)
- Basic staking and transfer flows pass across ecosystems

## Build & Verify

- Alignment: `./gradlew printPolkadotSdkAlignment`
- Static analysis: `./gradlew detektAll`
- Unit tests + coverage: `./gradlew runTest`
- Lint (app): `./gradlew :app:lint`
- Full sequence: `./gradlew postMergeVerify`

## Release Notes (Play)

- Enable TON features publicly; add Coinbase provider
- Migrate WalletConnect to Reown SDK
- New price service and remote asset sync
- Toolchain upgrades for Google Play requirements
- Stability and UX fixes
