---
title: Internal Notes - TONSWAP, SORA v3, and Iroha
source: internal
date: 2025-11-04
tags: [internal, tonswap, sora-v3, iroha, governance, private]
---

# Internal Notes: TONSWAP, SORA v3, and Iroha

> **Note**: This document contains non-public information shared directly with the team. These details should be used for internal reference and may not be suitable for public documentation.

---

## TONSWAP

- **Fee Structure**  
  - 10% of TONSWAP trading fees are allocated to **buy back and burn XOR**, creating sustained on-chain demand and reducing circulating supply.  
  - The mechanism aligns TON ecosystem activity with the SORA economy by turning trading volume into a recurring XOR sink.  
  - Burns are executed automatically through integrated smart-contract logic; accounting and transparency improvements are planned for upcoming releases.

---

## SORA v3 (“SORA Nexus”)

- **Overview**  
  - SORA v3 — code-named **SORA Nexus** — is the next-generation SORA Hub Chain designed to succeed the Substrate-based SORA v2 network.  
  - Development began with experimental **Hubchain Phase 1–2** prototypes built on **Hyperledger Iroha 2**, providing cross-chain transfer proofs and verifier mechanisms.  
  - The project is now transitioning toward a full implementation on **Hyperledger Iroha 3**, featuring improved modularity, new consensus logic, and scalability enhancements.

- **Status (September 2025)**  
  - SORA v2 continues maintenance and runtime updates (v4.7.0 released).  
  - Hubchain Phase 2 completed: decentralized verifier system, prover–verifier framework, and Iroha JS updates.  
  - **SORA v3 (Nexus)** repository in active development alongside the **Iroha 3** repo.  
  - A dedicated **SORA v3 whitepaper** is being drafted, outlining network vision, interoperability goals, and governance integration with the broader SORA ecosystem.  

- **Technical Direction**  
  - Migration planning from Iroha 2 → Iroha 3 is under evaluation to ensure backward compatibility and smooth transition.  
  - Core design goals:  
    - Unified **Hub Chain** connecting external networks (TON, Polkadot, Ethereum).  
    - High-throughput, BFT-finality consensus model derived from new Iroha 3 architecture.  
    - Deterministic smart-contract logic using **Iroha Special Instructions (ISI)** and domain-oriented command sets.  
    - Enhanced governance with **on-chain council + Parliament integration**, moving toward fully modular SORA DAO operations.  
  - Focus areas: scalability, performance, modular governance, and cross-chain interoperability.

- **Parallel Work**  
  - Ongoing collaboration between SORAMITSU Helvetia AG and SORA Trust.  
  - Alignment of **SORA Integrated Plan** milestones with Iroha 3 roadmap.  
  - Continuous evaluation of **SORA Nexus** as the anchor layer for multi-chain economic coordination across ecosystems.

---

## Governance

- **Current Model (SORA v2)**  
  - Contrary to some earlier materials that referenced **Polkadot OpenGov**, the SORA network currently operates under **Governance V1**, not OpenGov.  
  - Governance V1 consists of a **Council**, **Technical Committee**, and **Parliament**, with proposals, referenda, and staking-based voting managed through these entities.  
  - Decision-making is conducted on-chain, but without OpenGov’s continuous referendum model or adaptive delegation mechanisms.  
  - This structure provides predictability and explicit proposal cycles, aligning with the SORA Parliament’s role in approving runtime upgrades, parameter changes, and treasury allocations.  

- **Planned Evolution (SORA v3)**  
  - Governance in **SORA v3 (Nexus)** aims to evolve toward a **hybrid DAO framework**, integrating council-based accountability with modular governance logic written in Iroha 3’s **Special Instructions (ISI)**.  
  - The new system may adopt elements of Polkadot’s OpenGov philosophy (greater inclusivity and automation) while maintaining SORA’s distinct parliamentary structure for strategic oversight.  
  - This would allow more granular proposal management, domain-specific voting (e.g., for bridges or subnets), and interoperability with external governance systems like TON or Polkadot.

---

## Iroha 2 → Iroha 3 Transition

- **Iroha 2 (Completed Phases)**  
  - Provided the foundation for the Hubchain Phase 1–2 cross-chain prototypes.  
  - Implemented simplified flow and prover-verifier logic without full proofs in Phase 1, then decentralized verification in Phase 2.  

- **Iroha 3 (Next-Generation Platform)**  
  - Introduces a re-engineered architecture with greater modularity, new consensus mechanisms, and enhanced security primitives.  
  - **Whitepaper in progress** — will describe conceptual framework, modular components, and interoperability with external blockchains.  
  - Development team conducting feasibility studies to determine a structured migration path from Iroha 2 → Iroha 3 for SORA v3.  
  - Key improvements expected:  
    - Layered runtime for domain-specific modules.  
    - Upgraded command model and query isolation for deterministic operations.  
    - Simplified validator orchestration for multi-domain deployments.  

---

## Additional Context

- The September 2025 SORA Community Memo (Invoice #900134) details 672 total hours of development and education work:  
  - **512 hrs – Blockchain & Backend** (SORA v2 maintenance, SORA v3 planning).  
  - **159 hrs – Education** (including SORA v3 whitepaper drafting).  
  - **1 hr – DevOps/Security** support.  
- SORA v3 and Iroha 3 are both positioned as the long-term foundation for the **SORA Integrated Plan** and the evolving decentralized economy connecting Polkaswap, TONSWAP, and future bridges.

---
