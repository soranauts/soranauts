# Alias Coverage Report

**Generated:** 2025-12-01  
**Phase:** 1 - Ground Truth & Taxonomy Fixes

## Overview

This report confirms alias coverage for the Soranauts glossary system.

## Alias Statistics

| Metric | Value |
|--------|-------|
| Total aliases | 47 |
| Legacy aliases (pre-Nexus) | 38 |
| Nexus-specific aliases | 9 |

## Nexus-Specific Aliases

| Alias | Target Slug | Status |
|-------|-------------|--------|
| `ivm` | `irohavirtualmachineivm` | ✅ Verified |
| `iroha-virtual-machine` | `irohavirtualmachineivm` | ✅ Verified |
| `wsv` | `worldstateviewwsv` | ✅ Verified |
| `world-state-view` | `worldstateviewwsv` | ✅ Verified |
| `teu` | `transactionexecutionunitsteu` | ✅ Verified |
| `transaction-execution-units` | `transactionexecutionunitsteu` | ✅ Verified |
| `sfq` | `starttimefairqueuingsfq` | ✅ Verified |
| `start-time-fair-queuing` | `starttimefairqueuingsfq` | ✅ Verified |
| `space-directory` | `dataspacedirectory` | ✅ Verified |

## Legacy Aliases (Pre-Nexus)

| Alias | Target Slug |
|-------|-------------|
| `bitcoin-halving` | `halving` |
| `btc` | `bitcoin` |
| `consensus-mechanisms` | `consensus` |
| `doge` | `dogecoin` |
| `hyperled` | `iroha` |
| `hyperledger-iroha` | `iroha` |
| `hyperledger-iroha-2` | `iroha2` |
| `hyperledger-iroha-3` | `iroha3` |
| `interplanetary-file-system` | `ipfs` |
| `iroha-2` | `iroha2` |
| `iroha-3` | `iroha3` |
| `iroha-blockchain` | `iroha` |
| `iroha-v2` | `iroha2` |
| `iroha-v3` | `iroha3` |
| `isis` | `iroha-special-instructions` |
| `monetary-system` | `monetary-systems` |
| `nexus` | `iroha3` |
| `nfts` | `nft` |
| `non-fungible-token` | `nft` |
| `non-fungible-tokens` | `nft` |
| `parachain-auctions` | `auctions` |
| `parachains` | `parachain` |
| `pos` | `proof-of-stake` |
| `pow` | `proof-of-work` |
| `pswap-dex` | `polkaswap` |
| `qr-payment` | `qr-payments` |
| `rust` | `rust-language` |
| `rwa` | `real-world-assets` |
| `shib` | `shiba-inu` |
| `sora-council` | `council` |
| `sora-dex` | `polkaswap` |
| `sora-parliament` | `parliament` |
| `sora-v3` | `iroha3` |
| `telegram-dex` | `tonswap` |
| `token-bonding-curve` | `bonding-curve` |
| `ton-swap` | `tonswap` |
| `ts-dex` | `tonswap` |
| `webassembly` | `wasm` |

## Redirect Verification

All 9 Nexus aliases are configured in `vercel.json` for 308 permanent redirects:

```json
{
  "source": "/glossary/ivm",
  "destination": "/glossary/irohavirtualmachineivm",
  "permanent": true
}
```

## Potential Additional Aliases

The following aliases could be considered for future addition:

| Potential Alias | Target | Rationale |
|-----------------|--------|-----------|
| `da` | `dataavailability` | Common abbreviation |
| `zk` | `zkstarkvsstarks` | Common abbreviation |
| `qc` | `quorumcertificate` | Common abbreviation |
| `bft` | `sumeragi` | Byzantine Fault Tolerance |

**Note:** These are suggestions only. No changes were made in Phase 1.

## Conclusion

All 47 aliases are properly configured and verified. The 9 Nexus-specific aliases cover the most common abbreviations for core Nexus concepts.

