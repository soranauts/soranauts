---
title: 'android: roadmap'
source: fearless_github
source_url: >-
  https://github.com/soramitsu/fearless-Android/blob/254f17ec67c1d2bd197569b95590c91113d0c1af/roadmap.md
source_commit: 254f17ec67c1d2bd197569b95590c91113d0c1af
doc_id: 0855acaf35162818
snapshot_id: '2025-11-03'
fetched_at: '2025-11-03T06:23:28.118Z'
lang: en
license: Fearless Wallet
checksum_sha256: 277c7983e34937db7b96ad24f78ce372233165abfb2400b24e737c972480874c
content_hash: 277c7983e34937db7b96ad24f78ce372233165abfb2400b24e737c972480874c
publishDate: '2025-11-03T06:23:28.118Z'
repo: android
file_path: roadmap.md
---
# Full support for Polkadot SDK release: polkadot-stable2503

Why: Align the wallet with the latest stable Polkadot SDK, ensuring type/metadata compatibility and correct decoding/encoding across chains.

Scope: Substrate runtime alignment across Polkadot/Kusama/Westend/AssetHub and major parachains used by the app (per `chains.json`).

Acceptance criteria:
- App runs without SCALE decode errors on target chains.
- Balances, transfers, fees, and staking screens load and execute extrinsics successfully on Polkadot and Kusama.
- Chain sync (ChainRegistry) stable: connections establish, runtime providers load, subscriptions update on version bumps.
- No regressions in unit tests; detekt/lint green.
- If APIs changed (e.g., extrinsic names/signatures), code updated or guarded by capability checks; createPool/rename items validated.

Suggested steps:
1) Registry overrides: In `local.properties`, set
 - `TYPES_URL_OVERRIDE=https://<your>/all_chains_types_android.json` (stable2503-aligned)
 - `DEFAULT_V13_TYPES_URL_OVERRIDE=https://<your>/default_v13_types.json`
 - `CHAINS_URL_OVERRIDE=https://<your>/chains.json` (validated against stable2503)
2) Utils integration (remote source): The build fetches `soramitsu/fearless-utils-Android` via sourceControl and compiles it from source. Ensure NDK 25.2.9519653 + Rust toolchain with Android targets are installed (see README).
3) Optional: pin `shared_features` via `SHARED_FEATURES_VERSION_OVERRIDE=1.x.y` if required by the SDK combo.
4) Build + checks:
 - `./gradlew detektAll runTest :app:lint`
 - `./gradlew :app:assembleDebug`
5) Runtime smoke tests (manual):
 - Verify ChainRegistry establishes connections and loads metadata (logcat).
 - Wallet → Balances shows assets and fiat values.
 - Send: compute fee and submit a small transfer on Westend/Kusama dev if available.
 - Staking: validators/nominators decode, no crashes.
6) Address API deltas:
 - Update runtime-extrinsic assumptions and storage paths; add capability checks as needed.
7) Update defaults (optional): If stable2503 becomes default, update `runtime/build.gradle` and docs with new registry URLs.
8) Document: Add the exact registry URLs used to `docs/status.md` and a short note on verification results.

Bugfix backlog (from QA CSV):
- [ ] TON: 'address' in HEX form — approval window missing; Wrong address format (code 1)
- [ ] TON: user declined the transaction — error surfaced; SDK code 300
- [ ] TON: 'validUntil' expired during confirmation — “Transaction has expired” (code 1)
- [ ] TON: 'address' in non-bounceable form — processed with bounce=false; verify UI/SDK handling

Verification matrix (execute manually or script):
- Polkadot: balances load, transfer fee computed, send succeeds on test account.
- Kusama: same as above; staking validator list loads.
- AssetHub: asset enumeration works; transfers to another account OK.
- Westend: basic transfer path for low-risk checks.

—

More roadmap items (P0/P1/P2), including technical debt and follow-ups, are maintained in `docs/roadmap.md`.

## Build & Play Compliance
- Gradle/AGP update: bump Gradle wrapper and Android Gradle Plugin to the latest stable release; remove deprecations (e.g., use `url = uri(...)`, `namespace = '…'`). Verify builds with JDK 21 locally and in CI.
- Google Play 16KB page size: migrate native libraries (e.g., sr25519) to NDK r28+ (16 KB pages by default). Validate with `readelf -l` and address Play Console checks. Keep packaging compliant (uncompressed native libs or required flags).
