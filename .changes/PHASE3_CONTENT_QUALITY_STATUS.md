# Phase 3: Content Quality Sweep — Status Report

**Date:** December 1, 2025  
**Scope:** Improve definitions/summaries for ~40 priority Nexus terms + add "Why it matters" (tagline)  
**Status:** ✅ Complete — Ready for QA

---

## Summary

Updated 44 Nexus-related glossary terms with improved definitions, clearer summaries, and new `tagline` fields explaining real-world importance. No changes to slugs, tags, or routing.

---

## Terms Updated (44 total)

### Execution & VM (11 terms)
| Term | Tagline |
|------|---------|
| Iroha Virtual Machine (IVM) | Ensures every node computes identical results, making cross-chain verification trustless. |
| World State View (WSV) | Gives every validator a consistent snapshot of network state, enabling instant balance queries. |
| Transaction Execution Units (TEU) | Lets users predict transaction costs before submitting, preventing surprise fees. |
| Kotodama | Powers programmable logic on SORA without the unpredictability of Turing-complete VMs. |
| Triggers | Enables smart contracts to self-execute based on time or events, removing reliance on external keepers. |
| Syscalls | Provides a secure, auditable interface between smart contracts and the underlying runtime. |
| Deterministic Runtime | Guarantees every validator reaches the same result, enabling fraud proofs and cross-chain verification. |
| Gas Tables | Lets developers estimate execution costs accurately before deployment. |
| Memory Model | Prevents buffer overflows and enables efficient state proofs for light clients. |
| Action | Separates logic from scheduling, making smart contracts easier to audit and compose. |
| AccountId | Enables human-readable addresses while preventing typos and cross-chain confusion. |

### Consensus (6 terms)
| Term | Tagline |
|------|---------|
| Sumeragi | Delivers sub-second block finality while tolerating up to one-third Byzantine validators. |
| Sumeragi Consensus | Provides mathematical proof that committed blocks cannot be reverted, even under network partitions. |
| Quorum Certificate | Proves supermajority agreement on a block, enabling light clients to verify finality with minimal data. |
| Lane Finality | Enables parallel transaction processing while maintaining global ordering guarantees. |
| VRF Sortition | Prevents validator collusion by making committee selection unpredictable until the moment of reveal. |
| Epoch Beacon | Ensures fair, unpredictable validator selection that no single party can manipulate. |

### Lanes & Data Availability (7 terms)
| Term | Tagline |
|------|---------|
| Lanes | Enables horizontal scaling by running multiple transaction streams concurrently. |
| Data Availability | Prevents data withholding attacks that could halt chain progress or hide fraud. |
| Data Availability Layer | Lets light clients verify block data exists without downloading entire blocks. |
| DA Sampling | Reduces bandwidth requirements for validators while maintaining strong availability guarantees. |
| Erasure-Coded WSV | Allows the network to recover full state even if some validators fail or go offline. |
| Reed-Solomon | Provides mathematical guarantees that data survives validator failures or network partitions. |
| Compute Lane | Isolates resource-intensive workloads so they don't slow down regular transactions. |

### Aggregation (2 terms)
| Term | Tagline |
|------|---------|
| Aggregation | Combines parallel lane outputs into a single verifiable state transition. |
| Commitments | Lets anyone verify state correctness by checking a small proof instead of replaying all transactions. |

### Governance (7 terms)
| Term | Tagline |
|------|---------|
| Data Spaces | Enables enterprises and regulators to participate in SORA while maintaining data isolation. |
| Assembly | Gives token holders direct influence over network upgrades and policy changes. |
| Governance Surfaces | Allows protocol upgrades via voting instead of contentious hard forks. |
| Governed Manifest | Ensures all validators upgrade atomically at the same block height. |
| Parameter Sets | Lets the network tune performance and security without redeploying code. |
| Runtime Upgrades | Allows the network to evolve without disruptive hard forks. |
| Slashing | Discourages misbehavior by making attacks economically costly. |
| Soracles | Brings off-chain data on-chain with the same security guarantees as native transactions. |

### Economics (5 terms)
| Term | Tagline |
|------|---------|
| Budget | Caps resource usage per operation so no single transaction can monopolize the network. |
| Economic Model | Aligns validator, developer, and user incentives to maintain network security and growth. |
| Collateralized Locks | Enables secure offline payments that settle atomically when parties reconnect. |
| XOR Utility | Creates natural demand for XOR through its essential role in every network operation. |
| Lane TEU Budget | Prevents any single lane from starving others of compute resources. |

### Interop & Networking (5 terms)
| Term | Tagline |
|------|---------|
| SoraNet | Protects user privacy while delivering content with predictable latency. |
| Torii | Provides real-time updates to applications without polling. |
| Gateways | Simplifies client integration by handling protocol translation and routing. |
| Three-Hop QUIC Circuits | Hides user IP addresses from destination servers while maintaining fast connections. |
| Hybrid PQ Handshake | Future-proofs connections against quantum computing attacks. |

---

## Files Modified

### MDX Content Files (44 files)
All in `apps/web/src/content/glossary/`:
- AccountId.mdx, Action.mdx, Aggregation.mdx, Assembly.mdx
- Budget.mdx, CollateralizedLocks.mdx, Commitments.mdx, ComputeLane.mdx
- DASampling.mdx, DataAvailability.mdx, DataAvailabilityLayer.mdx, DataSpaces.mdx
- DeterministicRuntime.mdx, EconomicModel.mdx, EpochBeacon.mdx, ErasureCodedWSV.mdx
- GasTables.mdx, Gateways.mdx, GovernanceSurfaces.mdx, GovernedManifest.mdx
- HybridPQHandshake.mdx, IrohaVirtualMachineIVM.mdx, Kotodama.mdx
- LaneFinality.mdx, LaneTEUBudget.mdx, Lanes.mdx, MemoryModel.mdx
- ParameterSets.mdx, QuorumCertificate.mdx, ReedSolomon.mdx, RuntimeUpgrades.mdx
- Slashing.mdx, Soracles.mdx, SoraNet.mdx, Sumeragi.mdx, SumeragiConsensus.mdx
- Syscalls.mdx, ThreeHopQUICCircuits.mdx, Torii.mdx
- TransactionExecutionUnitsTEU.mdx, Triggers.mdx, VRFSortition.mdx
- WorldStateViewWSV.mdx, XORUtility.mdx

### Build Script
`scripts/build-nexus-glossary-json.ts`:
- Added `tagline` field to `FrontMatter` interface
- Added parsing for `tagline` in YAML front matter
- Added `tagline` to output term objects

---

## MDX Format (Example)

```mdx
---
title: "Sumeragi"
slug: sumeragi
category: "Consensus"
tags:
  - "Nexus Architecture"
summary: "The BFT consensus protocol for Iroha 3, featuring deterministic leader rotation and locking rules for fast finality."
tagline: "Delivers sub-second block finality while tolerating up to one-third Byzantine validators."
related:
  - "SUMERAGI Pipeline"
  - "Sumeragi Consensus"
  - "Commit Window"
  - "Epoch Beacon"
  - "Lane Finality"
---
```

---

## Verification

```bash
# Build glossary from MDX
npx tsx scripts/build-nexus-glossary-json.ts
# Result: 179 MDX files processed, 44 with taglines

# Typecheck passed
pnpm -w typecheck
# Result: 0 errors

# Build passed
pnpm --filter @soranauts/web build
# Result: 389 page(s) built
```

**Glossary JSON output:**
- 179 canonical terms
- 44 terms with tagline field
- 47 aliases

---

## Quick-View Integration

The `GlossaryQuickView.tsx` component already displays the `tagline` field as "Why it matters":

```tsx
{whyItMatters && (
  <div className="qv-panel__section">
    <h3 className="qv-panel__section-title">Why it matters</h3>
    <p className="qv-panel__section-text">{whyItMatters}</p>
  </div>
)}
```

---

## Writing Rules Applied

✅ Summaries: 1–2 sentences, concise  
✅ Definitions: Direct, no filler language  
✅ Taglines: 1 sentence explaining real-world importance  
✅ No passive voice (replaced "is used to" with active verbs)  
✅ No marketing language  

---

## Done Criteria

- [x] All target terms updated (44 terms)
- [x] No changes to slugs, tags, or related schema
- [x] Glossary rebuild produces deterministic output (179 terms)
- [x] Quick-View displays definition, summary, and tagline
- [x] No glossary warnings for missing fields
- [x] Typecheck + build clean

---

## Build Note

The `build-nexus-glossary-json.ts` script must be run after the main build to update the glossary JSON with the MDX content. This is currently a manual step:

```bash
npx tsx scripts/build-nexus-glossary-json.ts
```

Consider integrating this into the build pipeline for production.

---

## Next Steps (Phase 4)

Ready for Phase 4 when you send it!



