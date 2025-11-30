---
id: sora-nexus-whitepaper-v2025-11-26
title: "SORA Nexus Whitepaper (v2025-11-26)"
slug: "sora-nexus-whitepaper-v2025-11-26"
version: "2025-11-26 (Draft for Review)"
source: internal-research
source_url: "internal://soranauts/nexus-whitepaper/v2025-11-26"
source_pdf: ./sora_nexus_whitepaper.pdf
publishDate: "2025-11-26T00:00:00Z"
snapshot_id: "2025-11-26"
lang: en
tags:
  - sora
  - nexus
  - iroha3
  - ivm
  - fastpq
  - dataspaces
  - sumeragi
  - data-availability
  - governance
  - economics
  - updates
  - iso20022
summary: >
  SORA Nexus is a single logical ledger built on Hyperledger Iroha 3 that
  combines sovereign data spaces, deterministic execution via the Iroha Virtual Machine (IVM),
  parallel lanes + merge ledger finality, and modern cryptography (FASTPQ zk-STARKs, PQ signatures),
  to deliver a governed, scalable, and auditable platform capable of hosting both public and private domains
  on one network with sub-second finality.
content_sha256: "c00c8ffde2b279e596912f5c2ab959551303c7c3434cf7088ceaae5d71aa4e2b"
---

# Hyperledger Iroha 3: SORA Nexus  
**One World. One Economy. One Ledger.**  
**Version:** 2025-11-26 (Draft for Review)

> Canonical source: SORA Nexus Whitepaper PDF (stored next to this file).  
> This Markdown is a faithful conversion for Soranauts KB ingestion.

---

## Contents

1. [Abstract](#1-abstract)  
2. [Executive Summary](#2-executive-summary)  
   - [SORA Nexus Highlights](#21-sora-nexus-highlights)  
3. [SORA Nexus: The End of History](#3-sora-nexus-the-end-of-history)  
4. [Context and Goals](#4-context-and-goals)  
   - [Motivation](#41-motivation)  
   - [Design Goals](#42-design-goals)  
5. [IVM at the Core](#5-ivm-at-the-core)  
6. [Architecture Overview](#6-architecture-overview)  
   - [Components and Roles](#61-components-and-roles)  
   - [Data Spaces](#62-data-spaces)  
   - [Lanes and Merge Ledger](#63-lanes-and-merge-ledger)  
7. [Data Space Model and Governance](#7-data-space-model-and-governance)  
   - [Private and Public Domains](#71-private-and-public-domains)  
   - [Governance Surfaces](#72-governance-surfaces)  
8. [Consensus, Scheduling, and Finality](#8-consensus-scheduling-and-finality)  
   - [SUMERAGI Pipeline](#81-sumeragi-pipeline)  
   - [Admission and Fairness](#82-admission-and-fairness)  
   - [Lane Fusion and Split](#83-lane-fusion-and-split)  
   - [Sumeragi: Safety and Liveness](#84-sumeragi-consensus-safety-and-liveness)  
9. [Data Availability and Storage](#9-data-availability-and-storage)  
   - [Erasure-Coded Kura and WSV](#91-erasure-coded-kura-and-wsv)  
   - [Two-Dimensional Erasure Coding with ZK DA Proofs](#92-two-dimensional-erasure-coding-with-zk-da-proofs)  
   - [DA Certificates and Sampling](#93-da-certificates-and-sampling)  
   - [Proofs](#94-proofs)  
10. [Cryptography and Serialization](#10-cryptography-and-serialization)  
    - [Canonical Primitives](#101-canonical-primitives)  
    - [Serialization](#102-serialization)  
11. [Smart Contracts and Execution](#11-smart-contracts-and-execution)  
    - [Kotodama to IVM](#111-kotodama-to-ivm)  
    - [Why IVM Instead of EVM](#112-why-a-custom-ivm-instead-of-evm)  
    - [Pointer ABI and Memory Model](#113-pointer-abi-and-memory-model)  
    - [Syscalls and Gas](#114-syscalls-and-gas)  
12. [Transaction Lifecycle and Networking](#12-transaction-lifecycle-and-networking)  
13. [Account Model, Encoding, and Multisig](#13-account-model-encoding-and-multisig)  
    - [Nexus Account Structure](#131-nexus-account-structure)  
    - [Account Lifecycle and State Application](#132-account-lifecycle-and-state-application)  
    - [Triggers and Automation](#133-triggers-and-automation)  
14. [Interoperability and Connectors](#14-interoperability-and-connectors)  
15. [Ecosystem Components](#15-ecosystem-components)  
    - [SoraFS](#151-sorafs)  
    - [SoraNet](#152-soranet)  
    - [Soracles](#153-soracles)  
    - [ISO 20022 Alignment](#154-iso-20022-alignment)  
    - [Norito Codec and Streaming](#155-norito-codec-and-streaming)  
    - [Kaigi and Taikai](#156-kaigi-and-taikai)  
16. [Governance: SORA Parliament](#16-governance-sora-parliament)  
    - [Bodies and Selection](#161-bodies-and-selection)  
    - [Runtime Upgrades](#162-runtime-upgrades)  
    - [Economic Model and XOR Utility](#163-economic-model-and-xor-utility)  
    - [Offline-Offline Transactions](#164-offline-offline-transactions)  
    - [SDKs and Developer Experience](#165-sdks-and-developer-experience)  
17. [Privacy, Security, and Compliance](#17-privacy-security-and-compliance)  
    - [Privacy Transactions and Proof Systems](#171-privacy-transactions-and-proof-systems)  
18. [Operations and Observability](#18-operations-and-observability)  
19. [Performance Targets and Defaults](#19-performance-targets-and-defaults)  
20. [Mathematical Foundations](#20-mathematical-foundations)  
    - [Start-Time Fair Queuing (SFQ)](#201-start-time-fair-queuing-sfq)  
    - [Lane and DA Budgets](#202-lane-and-da-budgets)  
    - [Two-Dimensional Erasure Coding](#203-two-dimensional-erasure-coding)  
    - [DA Sampling Confidence](#204-da-sampling-confidence)  
    - [STARK Security Budget](#205-stark-security-budget)  
    - [FASTPQ Constraint System](#206-fastpq-constraint-system)  
    - [FASTPQ Proof Composition](#207-fastpq-proof-composition)  
    - [Fiat–Shamir Transform](#208-fiatshamir-transform)  
    - [FASTPQ End-to-End Example](#209-fastpq-end-to-end-example-narrative)  
    - [zk-STARK vs. STARK](#2010-zk-stark-vs-stark)  
    - [XOR Fee Equilibrium](#2011-xor-fee-equilibrium)  
21. [Use Cases](#21-use-cases)  
22. [Conclusion](#22-conclusion)  
References

---

## 1. Abstract

SORA Nexus (on Hyperledger Iroha 3) presents a single logical ledger that unifies private data spaces (regulated) and public domains (open innovation) under deterministic execution, governed configuration, and modern cryptographic/data-availability primitives. The paper covers goals, architecture, cryptography, execution, operations, and deployment for sovereign or cross-border networks on one ledger. 

## 2. Executive Summary

**Core idea:** one global SORA Nexus (no parallel chains) targeting ~1 s finality, providing data sovereignty and post-quantum security. Problems addressed: privacy leakage on public chains, performance unpredictability, silos losing composability, regulatory/audit friction, and missing cross-app atomicity.  
**Solution pillars:** parallel **lanes** + **merge ledger** for a single canonical order; **data spaces** as sovereign zones; deterministic **IVM** + **Kotodama** runtime; **FASTPQ zk-STARK** proofs; scalable DA; ISO 20022 + Norito for interop; XOR-aligned economics.  
Performance: lane finality ~1 s; proofs verify <100 ms; DA budgets bound verification; post-quantum signatures (ML-DSA). Experience: single ledger, sovereign control, composable and auditable.

### 2.1 SORA Nexus Highlights

- **One ledger:** Iroha 3-based, 1 s finality, PQ-ready.  
- **Scalability:** lanes + merge ledger; IVM determinism; horizontal DA.  
- **FASTPQ:** DS-scoped ZK/STARK proofs; ~10k proofs/s generation; <100 ms verification on consumer hardware.  
- **Sovereign + open:** privacy by construction with governed interop.

## 3. SORA Nexus: The End of History

Architecturally claims capacity to host *all* transactions by tying scale to:  
- **Lanes + merge ledger** (parallelism without rewriting lane history).  
- **Deterministic budgets/scheduling** (SFQ, TEU budgets, circuit breakers, deterministic lane fuse/split).  
- **Efficient proofs + DA** (bounded work, governed parameters).  
- **Deterministic runtime** (IVM pointer-ABI, explicit syscalls, no FP).  
- **Governed evolution** (add data spaces/lanes/params vs. forking new chains).

## 4. Context and Goals

### 4.1 Motivation
Iroha 3 targets central banks/FMIs/open ecosystems needing predictable finality, verifiable execution, strict policy, and safe programmability. Nexus expresses this via governed data spaces that can interoperate or isolate.

### 4.2 Design Goals
Determinism across hardware, privacy by construction, performance isolation (TEU/SFQ/must-serve), operational resilience (stateless gateways, lane fusion), and governed evolution (versioned configs, pointer-ABI/syscalls, cryptographic suites).

## 5. IVM at the Core

Purpose-built VM for deterministic execution of **Kotodama** bytecode (`.to`).  
- **Instruction set:** 16/32-bit opcodes; 256 64-bit regs (`r0`=0).  
- **Pointer-ABI:** typed handles (AccountId, AssetDefinitionId, DataSpaceId) via Norito TLV; malformed pointers trap.  
- **State transition:** all changes are deterministic ISIs applied to WSV/Kura.  
- **Determinism:** no floating point; explicit syscalls; no reentrancy; audited gas tables.  
- **Cross-DS safety:** typed references across data spaces when policy allows.  
- **Acceleration:** SIMD/GPU permitted only if bit-for-bit identical to scalar.  
- **Auditability:** Merkle commitments over memory/regs; Norito receipts.

## 6. Architecture Overview

### 6.1 Components and Roles
Validators (Sumeragi/IVM/DA/proofs/storage), Gateways (stateless admission/routing), Provers & Attesters (FASTPQ/DA), Space Directory (DSID → routing/owner/policy).

### 6.2 Data Spaces
First-class partitions with explicit privacy/routing; private DS confine data/proofs; public DS allow open participation with the same deterministic admission rules; each DS emits cryptographic artifacts (state roots, DA commitments, attestations) bundled into lane blocks.

### 6.3 Lanes and Merge Ledger
Multiple lanes scale throughput; each lane finalizes blocks independently; a lightweight merge ledger orders lane tips into a single global sequence. Under low load, lanes fuse; under high load, they split—deterministically and without re-ordering finalized lane history.

## 7. Data Space Model and Governance

### 7.1 Private and Public Domains
- **Private DS:** permissioned, ML-DSA-87 attestations, no public sampling.  
- **Public DS:** in-slot DA sampling; Ed25519 samples (PQ fields reserved).

### 7.2 Governance Surfaces
- **Configuration:** `iroha_config` is source of truth; env flags only for tests.  
- **Parameter sets:** cryptography, scheduling, admission caps are versioned and on-chain.  
- **Attestations:** new DS requires bond + signed certificate; unknown DSID → reject.

## 8. Consensus, Scheduling, and Finality

### 8.1 SUMERAGI Pipeline
BFT with deterministic leader rotation; blocks only when work exists; ~1 s lane finality; commit windows bounded (∆ ≤ 2 slots); QCs are PQ-signed (ML-DSA-87).

### 8.2 Admission and Fairness
Work measured in **TEU**. Defaults: ~20,000 TEU/s per lane.  
- **SFQ scheduling** with per-DS floors/caps.  
- **Must-serve slice:** any DS with backlog is included within bounded slots (default S=120) if within size/DA limits.  
- **Circuit breakers:** auto-reduce caps/sizes on stress; hysteresis prevents oscillation.

### 8.3 Lane Fusion and Split
Deterministic triggers (λ_floor, λ_exit). Mapping from `(DSID ∥ slot)` → lane is fixed; fusion reduces latency/overhead; split increases throughput; WSV/Kura continuity preserved; operators get telemetry on lanes/thresholds.

### 8.4 Sumeragi Consensus: Safety and Liveness

- **Committee:** \( N=3f+1 \), QC requires \(|QC| \ge 2f+1\).  
- **Assumptions:** ≤ f Byzantine, authenticated links, partial synchrony after GST.  
- **Leader rotation:**  
  \[
  L_{h,v} = H_{\mathrm{blake2b}}(\text{seed} \parallel h \parallel v) \bmod N
  \]
  Seed from prior epoch beacon (VRF aggregate).  
- **Pipeline:** `Propose → Validate & Vote → Commit → Broadcast receipt`.  
- **Timeout:** if no valid proposal/QC by \(T>2\Delta\), skip slot; next leader.  
- **Locking rule:** track `locked_qc(h,v,hash)`; proposals must extend the locked chain; monotone updates mirror HotStuff-style safety.  
- **NEW_VIEW gating:** propose only after NEW_VIEW quorum whose `highest_qc` extends `locked_qc`.

*Key results (sketches aligned to implementation):*  
- **QC intersection:** any two QCs intersect in ≥ \(f+1\) validators.  
- **Safety:** conflicting blocks cannot both commit at same height.  
- **Liveness:** with PRF/VRF leader selection and \(T>2\Delta\), honest-leader slots commit infinitely often with overwhelming probability.  
- **NPoS variant:** committees via VRF sortition; safety/liveness hold conditioned on honest-majority committees; slashing for double-signs.

## 9. Data Availability and Storage

Execution pairs with a DA layer using erasure coding, sampling, and ZK binding proofs so validators can prove recoverability and correctness without exposing private payloads.

### 9.1 Erasure-Coded Kura and WSV
Kura (history) + WSV (state) support erasure-coded shards; private DS data stays local to authorized nodes while preserving reconstructability.

### 9.2 Two-Dimensional Erasure Coding with ZK DA Proofs
SoraFS uses 2-D Reed–Solomon: rows/cols parity; validators/auditors recover envelopes from subsets; ZK proofs bind shards to block Merkle/DA roots; attesters sample shards, verify ZK, and sign DA certificates; committees enforce sampled proofs before finality.  
**Example:** 8 MB envelope → 32 data + 16 parity (48×~1 MB); any 32 reconstruct; with \(q_{\text{total}}=2048\) samples across lanes, DA checks finish in ~300 ms at ~1.5× overhead.

### 9.3 DA Certificates and Sampling
- **Public DS:** lane DA root + small in-slot signature sample (e.g., \(q_{\text{per\_ds}}=8\)); full thresholds off-path.  
- **Private DS:** DA handled internally via ML-DSA-87 attestations.  
- **Sizing:** typical envelope ≤ 16 MB (hard cap 32 MB); micro-segment/defer if needed.

### 9.4 Proofs
FASTPQ-ISI proofs per DS aggregate into ≤ 2 lane proofs (public/private). Verify within per-slot budgets (100–200 ms). Provers may use GPU if outputs are identical.

## 10. Cryptography and Serialization

### 10.1 Canonical Primitives
- **Hashing:** Poseidon2 (Goldilocks) for internal traces/SMTs; SHA-2/3 where required.  
- **Proof system:** STARK (DEEP-FRI, arity 8/16, blow-up 8/16), ≥ 128-bit security.  
- **Sigs:** Ed25519 (default), secp256k1 (legacy), ML-DSA-87 for consensus/DS attestations; public DA samples Ed25519 (PQ fields reserved).  
- **National suites:** SM2/3/4 and GOST suites available when governed.

### 10.2 Serialization
**Norito** is canonical for all ledger data; binary/JSON derived from Norito schemas; **SignedBlockWire** encodes persisted/distributed blocks with versioned headers. SCALE is excluded from production paths.

## 11. Smart Contracts and Execution

### 11.1 Kotodama to IVM
Contracts compile to IVM bytecode (`.to`). Headers include magic, `abi_version`, `feature_bits`, vector table len, `max_cycles`, and metadata. Pointer-ABI defines typed handles for inputs; gas costs are fixed and deterministic.

### 11.2 Why a Custom IVM Instead of EVM
Deterministic semantics (no FP/reentrancy/refund quirks), structured inputs (Norito + pointers), cross-DS safety by type-checked references, and flexible cryptography without opcode baggage; hardware acceleration must be bit-exact.

### 11.3 Pointer ABI and Memory Model
Versioned ABI with stable 16-bit type IDs; input is read-only Norito TLV; output append-only with validation; memory regions (code/heap/input/output/stack) trap on OOB/misalignment; Merkle commitments over registers/memory for ZK tracing.

### 11.4 Syscalls and Gas
Syscalls have 8-bit IDs and fixed deterministic gas; unknown IDs fail deterministically. Gas tables are versioned alongside ABI and governed.

## 12. Transaction Lifecycle and Networking

1) **Submission** (signed Norito ISIs via gateway → DS).  
2) **Admission** (roles/fees/quotas; SFQ queueing).  
3) **Execution** (IVM; collect DS proofs/DA).  
4) **Aggregation** (bundle DS outputs; ≤ 2 lane proofs).  
5) **Consensus** (lane Sumeragi → merge ordering; apply to WSV; persist Kura; order preserves lane internal order).  
6) **Exposure** (receipts, Merkle/DA proofs; ISO 20022/Norito connectors).

## 13. Account Model, Encoding, and Multisig

### 13.1 Nexus Account Structure
Canonical binary layout with HRP Bech32-like string; fields: `net`, `flags`, `dsid (UUID)`, `domain`, `name`, multisig `(m-of-n)`, signer list (typed), checksum (blake2b-32 trunc). Mixed key types supported.

### 13.2 Account Lifecycle and State Application
Creation/updates via ISIs respecting DS policy; IVM validates AccountId/DataSpaceId via Norito decoder before use; multisig enforced at admission (distinct keys; mixed schemes allowed).

### 13.3 Triggers and Automation
Deterministic automations stored in WSV; **Condition** (time/event/receipt predicate), **Action** (ISIs or Kotodama call), **Budget** (TEU/fees). Scheduled under the same fairness/DA budgets. Governance sets ceilings; invalid actions are rejected deterministically.

**Examples:**  
- Stipend every 24h (treasury → user).  
- Event-driven compliance (notify regulator on large mint).

## 14. Interoperability and Connectors

ISO 20022-aligned messaging; Norito payloads mirror ISO fields; gateways/bridges translate to domestic rails/partner ledgers with auditability.

## 15. Ecosystem Components

### 15.1 SoraFS
Decentralized storage layer for erasure-coded Kura blocks + WSV snapshots; reliable broadcast sessions; DA/retry policies; relay telemetry; privacy-preserving audits without raw payload exposure.

### 15.2 SoraNet
Privacy overlay and decentralized CDN: three-hop QUIC circuits, hybrid PQ handshake (Curve25519 + Kyber768), ZK-backed access tickets, fixed-size cells, blinded CIDs, exit caches. On-chain **Data Space Directory**, deterministic admission via SFQ, governed compute lane (ComputeManifest), Norito/Kaigi streaming, lane-scoped state/recovery, telemetry and rewards.

### 15.3 Soracles
Deterministic oracle actors with governed onboarding, rate limits, mixed-scheme multisig, and DA/proof budgets identical to other DS artifacts; slashing/rotation via governance.

### 15.4 ISO 20022 Alignment
ISO messages (pacs/pain/camt) map deterministically to Norito/ledger fields (e.g., pacs.008 → Norito transfer with DS-qualified accounts); versioning pinned; ambiguous mappings rejected.

### 15.5 Norito Codec and Streaming
Norito is the only production serializer. Norito/Kaigi streams chunk payloads with deterministic framing; relays spool to disk and refresh manifests on governance updates.

### 15.6 Kaigi and Taikai
Real-time conferencing (Kaigi) and streaming/data pipelines (Taikai). On-chain ISIs manage rooms/relays/usage; Halo2-IPA proofs for privacy; telemetry via Torii; governed manifests and slashing.

## 16. Governance: SORA Parliament

On-chain, Norito-encoded proposals; deterministic enactment via IVM/ISIs.

### 16.1 Bodies and Selection
Two bodies: **Council** (fixed seats by NPoS/appointment) and **Assembly** (stake-weighted or 1p1v). Selection by VRF sortition with thresholds; slashing for equivocation. Proposals include kind/payload/quorum/threshold/window/enactment; XOR bonds; mixed key types accepted.

### 16.2 Runtime Upgrades
Governed manifest with hashes/ABI/config and activation slot; stage/verify, atomic activation at slot; reject mismatched manifests; lane-agnostic; dry-run checks; live manifest telemetry.

### 16.3 Economic Model and XOR Utility
XOR is universal fee/settlement/reward/bond asset across public/private DS; DS assets (e.g., CBDCs) can bridge/collateralize with XOR; fee markets per DS while keeping XOR rewards stable.

### 16.4 Offline-Offline Transactions
Pre-authorized vouchers bound to snapshots and revocation windows; gateways reconcile; replay protection; circuit breakers; policy caps/dual-sig/collateralized locks.

### 16.5 SDKs and Developer Experience
Language SDKs (mobile/web/server) with Norito-first APIs, deterministic builders, ISO helpers, offline flows; REST/gRPC gateways; receipts/proofs aligned to protocol primitives.

## 17. Privacy, Security, and Compliance

Role/domain controls; deterministic errors for invalid envelopes/opcodes/policy violations; ML-DSA-87 for consensus/attestations; DA certs reserve PQ fields for dual-sign policies.

### 17.1 Privacy Transactions and Proof Systems
Shielded transfers with commitments \(c_m=H(\text{tag}\parallel\text{payload})\), nullifiers \(n_f=H(sk\parallel c_m\parallel \text{salt})\). Halo2 circuits (PLONKish) with gates/copy/lookup constraints; IPA commitments keep verifier cost logarithmic; Fiat–Shamir transcript binding; typical verification in a few ms; flows enforce nullifier uniqueness and update shielded roots.

## 18. Operations and Observability

Telemetry for lane finality, DA failures, envelope sizes, schedulers; circuit-breaker state observable; rolling upgrades; geo-redundancy; scale provers independently.

## 19. Performance Targets and Defaults

- Lane finality: ≤ 1 s (non-empty); no empty blocks.  
- Commit window: \( \Delta \le 2 \) slots.  
- Lanes: \(K=4\) (fuse under low load).  
- Lane TEU budget: ~20,000 TEU/s.  
- Envelope size: typical ≤ 16 MB; hard cap 32 MB.  
- DA sampling: \(q_{\text{per\_ds}}=8\); \(q_{\text{total}} \le 2048\).  
- Proof verify: 100–200 ms per lane committee.  
- Example quorum: 22 validators per lane (\(f=7\)).  
- Attestations: ML-DSA-87 (QCs/DS); Ed25519 for public DA samples.

## 20. Mathematical Foundations

### 20.1 Start-Time Fair Queuing (SFQ)

Let \(w_i\) be DS weight from fee density and packet size \(p_i\) (TEU). Define:

\[
V(t)=\max_j \{ s_j(t) \}, \quad
s_i = \max(V, f_i^{\text{prev}}), \quad
f_i = s_i + \frac{p_i}{w_i}.
\]

Serve by ascending \(f_i\) subject to \(p_i \le p_{\max}\), \(\sum p_i \le \mathrm{TEU}_{\text{lane}}\), and age \(a_i \le S\).  
Fusion when \(\sum \lambda_i \le \lambda_{\text{floor}}\) for two slots; split when \(\sum \lambda_i \ge \lambda_{\text{exit}}\).

### 20.2 Lane and DA Budgets

Choose \(q \in [6,16]\) signatures per public DS; enforce changed\_public\_ds \(\le \left\lfloor \frac{q_{\text{total}}}{q} \right\rfloor\) with \(q_{\text{total}} \le 2048\). DA verify by \(t_{\mathrm{DA}} \le 300\,\mathrm{ms}\); lane proof verify \(t_{\mathrm{proof}} \le 200\,\mathrm{ms}\). Envelope: \(\text{bytes}_{\text{env}} \le 16\,\mathrm{MB}\) (target), 32 MB (hard).

### 20.3 Two-Dimensional Erasure Coding

Partition blocks into \(m\times n\) shards; systematic Reed–Solomon over \( \mathrm{GF}(2^8) \):

\[
p^{\text{row}}_r = \sum_{c=1}^{n} \alpha_c\, d_{r,c}, \quad
p^{\text{col}}_c = \sum_{r=1}^{m} \beta_r\, d_{r,c}.
\]

Any \(k\) shards reconstruct (MDS). ZK proofs bind parity roots to the block Merkle root.

### 20.4 DA Sampling Confidence

Threshold set size \(S\), requirement \(T\), in-slot sample \(q\), faulty fraction \(f\). Detection probability:

\[
P[\text{detect}] = 1 - \frac{\binom{S-f}{q}}{\binom{S}{q}}.
\]

Tune \(q\) to achieve desired detection (e.g., >99.9%) within verify budgets.

### 20.5 STARK Security Budget

DEEP-FRI with blow-up \(b\), query count \(Q\), soundness \(\varepsilon\) per query:  
\(\varepsilon_{\text{tot}} \le Q \cdot b^{-\sigma}\), with \(\sigma \approx \log_b(\mathrm{LD}/\mathrm{HD})\). Choose \(b\in\{8,16\}\), \(Q\in[34,46]\), grinding \(g\in[21,23]\) for ≥128-bit security; effective security \(\ge 2^{g} \cdot \varepsilon_{\text{tot}}^{-1}\).

### 20.6 FASTPQ Constraint System

AIR over Goldilocks for key/value updates. Example constraints:

\[
s_{\text{active}}(s_{\text{transfer}}+\cdots+s_{\text{meta\_set}} - 1)=0,
\quad
\Delta_{\text{asset},i} = (1-r_{\text{start},i})\,\Delta_{\text{asset},i-1} + \delta_i,
\]
\[
\text{SMT}_\ell :
\begin{cases}
\text{node}_{\text{out}} = \text{Poseidon2}(\text{node}_{\text{in}}, \text{sibling}), & \text{if } \text{path\_bit}=0,\\
\text{node}_{\text{out}} = \text{Poseidon2}(\text{sibling}, \text{node}_{\text{in}}), & \text{if } \text{path\_bit}=1.
\end{cases}
\]

Constraints lifted to low-degree domain and divided by vanishing polynomial to form composition polynomials.

### 20.7 FASTPQ Proof Composition

1) Commit to trace/lookup LDEs (Poseidon2 Merkle roots).  
2) Derive challenges via Fiat–Shamir; build lookup grand product; composition \(C(X)\).  
3) Run DEEP-FRI (arity \(r\in\{8,16\}\)).  
4) Open queried positions with Merkle proofs.  
5) Verifier replays challenges, checks grand product, Merkle openings, and FRI degree bound.

### 20.8 Fiat–Shamir Transform

Turn interactive public-coin protocols noninteractive by hashing transcript (domain-separated tags) after each commitment to derive challenges; grinding expands challenge space.

### 20.9 FASTPQ End-to-End Example (Narrative)

Trace rows for transfers/mints/burns with SMT neighbors and metadata; sort/pad; commit; derive challenges; build quotient; fold with DEEP-FRI; open queries; verifier checks products/FRI consistency; accept without revealing private books.

### 20.10 zk-STARK vs. STARK

FASTPQ is a zk-STARK (transparent, hash-based). Audit-only mode disables blinding; privacy mode enables blinding with same AIR/FRI, so verification logic is identical.

### 20.11 XOR Fee Equilibrium

For DS \(i\) with fee \(F_i\), demand \(d_i\), TEU cost \(c_i\), lane capacity \(\mathrm{TEU}_{\text{lane}}\):

\[
\sum_i \min\!\left(d_i,\frac{F_i}{c_i}\right) \le \mathrm{TEU}_{\text{lane}}, \qquad
F_i^\* = \arg\max_{F_i} \; F_i \cdot \min\!\left(d_i,\frac{F_i}{c_i}\right),
\]

subject to fairness caps; governance steers \(F_i\) floors/ceilings while keeping XOR rewards predictable.

## 21. Use Cases

CBDCs, interbank settlement (RTGS modernization), tokenized assets/registries, cross-border corridors—all with deterministic policy, proofs, and ISO-aligned connectors.

## 22. Conclusion

SORA Nexus (Iroha 3) is presented as a single, scalable ledger—**one network, many data spaces**—combining deterministic IVM, governed data spaces, XOR-aligned economics, and proof/DA infrastructure to host CBDCs, capital markets, and open innovation without spawning new chains.

---

## References

(See the original PDF stored alongside this file for the exact bibliography entries.)
