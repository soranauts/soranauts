---
title: "Hyperledger Iroha: Applications, Architecture, and SORA — Seminar by Makoto Takemiya"
slug: "hyperledger-iroha-applications-and-sora-makoto-takemiya"
source: "transcription"
source_url: "internal://soranauts/transcriptions/2025/seminars/hyperledger-iroha-applications-and-sora-makoto-takemiya"
publishDate: "2025-11-15T14:00:00Z"
content_sha256: ""
snapshot_id: "2025-11-15"
event_type: "seminar"
event_name: "Introduction to Hyperledger Iroha"
speakers: ["Makoto Takemiya"]
venue: "Virtual meetup hosted by Hyperledger Kochi"
tags:
  - hyperledger
  - iroha
  - iroha2
  - iroha3
  - sumeragi
  - governance
  - cbdc
  - identity
  - sora
  - d3-ledger
  - bakong
  - payments
  - interoperability
lang: "en"
transcription_date: "2025-11-15T00:00:00Z"
transcriber: "Soranauts Team"
transcript_source: "rough live transcript, spellchecked and edited for clarity"
---

# Hyperledger Iroha Seminar: Applications and Overview

**Speaker:** Makoto Takemiya  
**Topics:** Bakong (Cambodia), D3 Ledger, SORA, Digital Identity, Iroha v1/v2, consensus (Sumeragi), SDKs, performance, and ecosystem relations. A virtual meetup hosted by Hyperledger Kochi featuring Makoto Takemiya, CEO of Soramitsu, speaking about how Iroha aims to provide a development environment where C++ and mobile application developers could contribute to Hyperledger.

---

## Introduction

We are the main maintainers of **Hyperledger Iroha** and have deployed it across several real-world applications. This talk surveys production use cases, architectural choices, and the direction of Iroha v2.

---

## Key Applications of Hyperledger Iroha

### 1) Bakong (National Bank of Cambodia)

**Bakong** is a central-bank-operated **real-time retail payment system** built on **Hyperledger Iroha**.

- **Adoption:** 10,000+ retail users; 14 partner financial institutions; ~600 merchants accepting Bakong (figures referenced at the time of the talk).  
- **User flow:** Anyone with a Cambodian phone number can install the app, register, and send/receive payments using phone numbers or QR codes. Wallet supports **KHR (Riel)** and **USD**.
- **Architecture:**
  - Central bank operates the **core ledger**.
  - **Commercial banks** connect via **payment gateways** integrated with their core banking using **ISO 20022** messaging.
  - **User keys:** The mobile app generates user key pairs locally. The user keeps the private key; the gateway registers the public key.
  - **Account recovery:** Iroha's **permission system** allows authorized institutions to **replace a lost key** (e.g., after KYC) **without touching balances** (using delegated permissions like *grant add signatory*).

**Why blockchain here?**  
A shared ledger provides a **flat, interoperable layer** across banks, cryptographic ownership for end-users, and **auditability**, while keeping commercial banks as the customer interface.

**Financial inclusion context:**  
Cambodia has high mobile penetration (~80% smartphones; >100% mobile subscriptions) but historically low bank account penetration. Bakong reduces remittance frictions (mostly **domestic** remittances) and expands digital payments.

**Onboarding & compliance:**  
App-first onboarding with **phone verification** (low limits). **In-person KYC** at partner banks raises limits. The team has also explored **document scanning, face matching, and liveness** checks.

---

### 2) D3 Ledger (Interledger)

Worked with **Moscow Exchange Group** and **KDD (Slovenia's CSD)** on **D3 Ledger**, an interledger platform linking **Hyperledger Iroha**, **Ethereum**, and **Bitcoin**.

- Tokenize BTC or ERC-20 assets on Iroha and move them across chains.  
- Uses federated notaries and smart contracts (on Ethereum) to mint/burn wrapped assets and coordinate cross-chain transfers.  
- Open source: **D3 Ledger**.

---

### 3) SORA: Decentralized Economic System

**SORA** is a **decentralized economic system** using Iroha for:

- On-chain governance and treasury allocation.  
- Token issuance (XOR) via **voting** ("decentralized autonomous economy").  
- Bridges to **Ethereum**, **Polkadot/Kusama**, and **Bitcoin** (multi-network asset mobility).  
- DEX and other DeFi apps planned/operational in the broader SORA stack.

---

### 4) Digital Identity (W3C DID & Verifiable Credentials)

Prototyped an identity system with **Bank Central Asia (Indonesia)** using **DIDs** and **Verifiable Credentials**. Iroha accounts include a **key-value map** suitable for attaching identity attributes and claims.

A related paper ("**SORA Identity**: Secure Digital Identity on the Blockchain") discusses the protocol and approach.

---

## Other Collaborations

- **Web3 Foundation:** C++ implementation efforts related to **Polkadot** (inter-chain protocol).  
- **Protocol Labs:** Built a **C client for Filecoin**.  
- **Local/Community Currencies (Japan):**
  - **Moika** (Aizuwakamatsu, Fukushima Prefecture): Event currency minted via social interaction (QR handshake).
  - **Biako** (University of Aizu): Campus currency; cash-in for JPY tokens, QR payments between students/merchants.

---

## Hyperledger Iroha: Architecture & Model

### Data Model

- **Domains:** Namespaces/containers.  
- **Assets:** `{name, quantity}` — represent currencies or other scarce digital items (e.g., rights, titles).  
- **Accounts:** Hold assets and execute commands.  
- **Signatories:** Public keys attached to accounts; **quorum** defines signature thresholds.

### Core Commands (v1)

- `create_asset`, `add_asset_quantity` (mint), `transfer_asset`  
- `add_signatory`, `remove_signatory`, `set_quorum`  
- Queries (e.g., `get_account_assets`) governed by permissions

**Permissions** guard **every command and query** (e.g., `can_add_signatory`, `can_transfer_asset`, `can_grant_add_signatory`). This enables secure flows like **bank-assisted key rotation** for account recovery.

---

## Developer Experience & Demo (Python SDK)

Using the **Python SDK** (and similar patterns across Swift/Android/JS):

1. Create `coin@test`, mint `777.2` with `add_asset_quantity`.  
2. Transfer `3` coins from **Alice@test** to **Bob@test** using `transfer_asset`.  
3. Query **Bob**'s assets with `get_account_assets`.

**Transaction lifecycle:**
- **Stateless validation** (syntax, signatures)  
- **Stateful validation** (permissions, balances)  
- **Commit** (included in a block)

---

## Storage & Performance

- **Iroha v1:**  
  - **PostgreSQL** for world state (accounts, assets, signatories).  
  - **Block store** on disk (JSON by default).  
- **Iroha v2:**  
  - **In-memory world state** (hash maps) for speed; blocks still persisted on disk.  
  - On startup, replay blocks to reconstruct state in memory.

**Performance:** With ~4–22 validators and good networking, **thousands of TPS** are achievable (workload dependent).

---

## Iroha v2 (Rust) Highlights

- **Rust rewrite** (safer memory model; some `no_std` areas).  
- **Sumeragi** consensus (Byzantine Fault Tolerant, inspired by **B-Chain**):
  - Known validator set; **ordered topology** with leader and **proxy tail**.  
  - Re-orders nodes each round (seeded by previous block hash) to reduce censorship risk.  
  - **3F+1** validators; **2F+1** signatures to commit.  
  - Optimized **single-phase** commit for payments; **finality on the next block** (trade-off: ~1–2s block time suitable for payments).  
- **ISI (Iroha Special Instructions):** programmable, modular logic; event-driven composition (toward Turing completeness via event handlers).  
- **Substrate/Polkadot bridge crate** (work-in-progress).  
- **Cryptography:** **Hyperledger Ursa**.  
- **Solidity in v1.2:** Integration with **Hyperledger Burrow** enables executing certain Solidity contracts in Iroha v1.2 environments.

---

## Ecosystem & Community

- **Open Source:** Apache-2.0, repos on GitHub (`hyperledger/iroha`).  
- **Docs & RFCs:** Hyperledger Iroha wiki (Iroha v1 & v2 sections; RFCs include DSL/ISI details).  
- **SDKs:** Python, iOS (Swift via CocoaPods), Android, JavaScript.  
- **Community channels:** Telegram, Gitter, Rocket.Chat (bridged).  
- **Tooling:** Prior **Caliper** integration (subject to upstream changes); basic **Hyperledger Explorer** integration exists but limited.

---

## Q&A Notes (Selected)

- **Why Iroha vs. Fabric/Sawtooth/EVM stacks?**  
  - Iroha focuses on **asset & identity** management with a simple data model and explicit commands.  
  - Fabric emphasizes generic key-value state and flexible chaincode.  
  - Sawtooth provides transaction families; Ethereum/EVM stacks focus on Solidity smart contracts.  
  - Choose based on your **use case and constraints**.

- **Messaging use-case over Iroha?**  
  - Transactions include an **optional description/message blob**. One could implement a simple messenger by sending a tiny-value transfer (or agreed minimal unit) carrying the message payload.

- **Bridges (v1 vs v2):**  
  - **v1:** D3 Ledger (federated notaries + ETH contracts).  
  - **v2:** Aim to make bridging more **first-class** but cross-chain remains complex.

- **Throughput:**  
  - Payments-optimized; typically **low-second** finality and **multi-k TPS** with appropriate topology.

---

## Conclusion

**Hyperledger Iroha** prioritizes a clear data model, strong permissions, and mobile-friendly SDKs to make **asset and identity** workflows straightforward.  
- **v1** is stable and production-proven (e.g., **Bakong**).  
- **v2** advances safety/performance with **Rust**, **Sumeragi**, **ISI**, and improved bridging.

**SORA**, **D3 Ledger**, and multiple pilots show how Iroha underpins CBDC-like retail payments, interledger asset mobility, and governance-driven economies.

---

## References & Projects Mentioned

- **Bakong** — National Bank of Cambodia retail payment system  
- **D3 Ledger** — Interledger platform (Iroha ↔ Ethereum/Bitcoin)  
- **SORA** — Decentralized economic system (governance, treasury, bridges)  
- **Moika / Biako** — Event & campus currencies (Aizu/Fukushima)  
- **Hyperledger Ursa** — Cryptography library  
- **Hyperledger Burrow** — Solidity/EVM integration (Iroha v1.2)  
- **Hyperledger Sawtooth, Fabric, Indy** — Related Hyperledger projects

> "Blockchain isn't just about decentralization—it's about verifiable systems that make trust measurable." — Makoto Takemiya




