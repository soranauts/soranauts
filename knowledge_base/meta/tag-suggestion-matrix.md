---
title: "Tag Suggestion Matrix"
source: "meta"
publishDate: "2025-11-05T00:00:00Z"
tags: ["taxonomy", "metadata", "kb", "sora", "iroha"]
slug: "tag-suggestion-matrix"
---

# Tag Suggestion Matrix

## Purpose

The **Tag Suggestion Matrix** provides a standardized tagging vocabulary for the Soranauts Knowledge Base. It ensures consistent, semantically rich tagging across all articles, wiki entries, and documentation — improving hybrid retrieval, editorial coherence, and metadata quality.

This matrix helps Cursor (and other automation tools) automatically select the best **9–12 tags** for each article during editing or ingestion.

## Usage Guidelines

- **Select 9–12 tags** per article from this matrix
- All tags are **lowercase** (matching `cleanSlug()` normalization)
- Use **kebab-case** for multi-word tags
- Tags are normalized via `cleanSlug()` in web articles for URL matching
- The RelatedArticles component matches articles based on tag overlap

## Matrix Structure

Each domain contains tags organized by category, with complete metadata:
- **Category**: Domain classification
- **Tag**: Canonical tag name (lowercase, kebab-case)
- **Description**: What the tag represents
- **Use When**: When to apply this tag
- **Related Tags**: Tags that commonly appear together

---

## 1. Core Protocols

Core foundational network components and blockchain infrastructure.

| Category | Tag | Description | Use When | Related Tags |
|----------|-----|-------------|----------|--------------|
| Core Protocols | sora | The SORA blockchain network and ecosystem | Articles about SORA network, blockchain, or ecosystem | iroha, xor, val, governance, defi |
| Core Protocols | iroha | Hyperledger Iroha blockchain framework | Articles about Iroha technology, consensus, or infrastructure | hyperledger, substrate, sora, iroha3 |
| Core Protocols | iroha3 | Hyperledger Iroha 3 (Nexus) - next-generation framework | Articles about SORA v3, Nexus, or Iroha 3 features | iroha, bridges, substrate, sora |
| Core Protocols | hyperledger | Hyperledger project and technologies | Articles about Hyperledger ecosystem or Iroha's foundation | iroha, iroha3, substrate |
| Core Protocols | substrate | Substrate blockchain framework | Articles about Polkadot, parachains, or Substrate development | parachain, polkadot, governance, cross-chain |
| Core Protocols | xor | XOR utility and governance token | Articles about XOR token, supply, economics, or governance | val, pswap, governance, tokenomics |
| Core Protocols | val | VAL validator reward token | Articles about validators, staking, or network security | xor, staking, validator, tokenomics |
| Core Protocols | pswap | PSWAP liquidity reward token | Articles about Polkaswap, liquidity provision, or DeFi rewards | polkaswap, liquidity, defi, tokenomics |

---

## 2. Tokenomics

Economic models, digital assets, and monetary mechanisms.

| Category | Tag | Description | Use When | Related Tags |
|----------|-----|-------------|----------|--------------|
| Tokenomics | kensetsu | Kensetsu economic framework and tokenomics | Articles about Kensetsu, economic models, or tokenomics | kusd, tbcd, economics, governance |
| Tokenomics | kusd | KUSD stablecoin | Articles about KUSD, stablecoins, or dollar-pegged assets | kensetsu, tbcd, defi, stablecoin |
| Tokenomics | tbcd | Token Bonding Curve Dollar | Articles about TBCD, bonding curves, or elastic supply | bonding-curve, kusd, kensetsu, economics |
| Tokenomics | bonding-curve | Token bonding curve mechanism | Articles about bonding curves, price discovery, or supply models | tbcd, elastic-supply, economics, tokenomics |
| Tokenomics | elastic-supply | Elastic or dynamic token supply mechanisms | Articles about supply adjustments, algorithmic money, or economic models | bonding-curve, tbcd, economics |
| Tokenomics | real-world-assets | Real-world asset tokenization | Articles about RWA, asset tokenization, or traditional finance integration | tokenization, economics, defi |
| Tokenomics | tokenomics | Token economics and monetary policy | General articles about token economics, supply, or distribution | economics, governance, xor, val |
| Tokenomics | stablecoin | Stablecoin concepts and implementations | Articles about stablecoins, peg mechanisms, or price stability | kusd, defi, economics |

---

## 3. Governance

Decision-making systems, community structure, and voting mechanisms.

| Category | Tag | Description | Use When | Related Tags |
|----------|-----|-------------|----------|--------------|
| Governance | parliament | SORA Parliament governance body | Articles about Parliament, governance decisions, or community leadership | governance, council, voting, proposal |
| Governance | governance | Governance systems and processes | General articles about governance, decision-making, or community management | parliament, council, voting, proposal |
| Governance | council | Governance council or committee | Articles about council members, elections, or governance structure | parliament, governance, voting |
| Governance | voting | Voting mechanisms and processes | Articles about voting systems, proposals, or democratic processes | governance, proposal, referendum, parliament |
| Governance | proposal | Governance proposals and submissions | Articles about specific proposals, referenda, or governance changes | governance, voting, referendum, parliament |
| Governance | referendum | Referendum voting processes | Articles about referenda, public votes, or major governance decisions | voting, proposal, governance |

---

## 4. Infrastructure

Technical integrations, cross-chain connectivity, and network architecture.

| Category | Tag | Description | Use When | Related Tags |
|----------|-----|-------------|----------|--------------|
| Infrastructure | bridges | Cross-chain bridges and connectivity | Articles about bridges, cross-chain transfers, or interoperability | cross-chain, hashi, interoperability, parachain |
| Infrastructure | hashi | Hashi bridge aggregator | Articles about Hashi, bridge security, or multi-bridge systems | bridges, cross-chain, interoperability |
| Infrastructure | cross-chain | Cross-chain functionality and interoperability | General articles about cross-chain operations, transfers, or compatibility | bridges, interoperability, parachain, polkadot |
| Infrastructure | interoperability | Blockchain interoperability and compatibility | Articles about multi-chain systems, compatibility, or integration | cross-chain, bridges, substrate, polkadot |
| Infrastructure | parachain | Polkadot parachain technology | Articles about parachains, Polkadot integration, or parallel chains | substrate, polkadot, cross-chain, sora |

---

## 5. Products & Ecosystem

User-facing tools, platforms, and ecosystem applications.

| Category | Tag | Description | Use When | Related Tags |
|----------|-----|-------------|----------|--------------|
| Products & Ecosystem | polkaswap | Polkaswap decentralized exchange | Articles about Polkaswap, DEX, trading, or liquidity | pswap, dex, liquidity, defi, sora |
| Products & Ecosystem | sora-card | SORA Card payment solution | Articles about SORA Card, payments, or real-world usage | sora, payments, adoption, real-world-assets |
| Products & Ecosystem | fearless-wallet | Fearless Wallet application | Articles about Fearless Wallet, mobile apps, or wallet features | wallet, mobile, sora, polkaswap |
| Products & Ecosystem | marketplace | NFT or asset marketplace | Articles about marketplaces, NFT trading, or asset exchange | nft, defi, polkaswap |
| Products & Ecosystem | explorer | Blockchain explorer tools | Articles about explorers, block explorers, or on-chain analytics | sora, blockchain, analytics |
| Products & Ecosystem | tonswap | TONSWAP DEX on TON blockchain | Articles about TONSWAP, TON ecosystem, or Telegram integration | dex, ton, telegram, defi |
| Products & Ecosystem | dex | Decentralized exchange platforms | General articles about DEXs, trading, or exchange platforms | polkaswap, tonswap, liquidity, defi |
| Products & Ecosystem | wallet | Wallet applications and tools | Articles about wallets, custody, or key management | fearless-wallet, sora, security |

---

## 6. Concepts & Research

Theoretical concepts, research topics, and broader blockchain/DeFi themes.

| Category | Tag | Description | Use When | Related Tags |
|----------|-----|-------------|----------|--------------|
| Concepts & Research | defi | Decentralized finance concepts | General articles about DeFi, decentralized finance, or financial protocols | liquidity, staking, dex, governance |
| Concepts & Research | decentralization | Decentralization principles and concepts | Articles about decentralization, distributed systems, or governance models | governance, defi, blockchain |
| Concepts & Research | liquidity | Liquidity provision and pools | Articles about liquidity, LP tokens, or market making | defi, polkaswap, dex, pswap |
| Concepts & Research | economics | Economic theory and models | Articles about economics, monetary policy, or economic systems | tokenomics, kensetsu, bonding-curve, governance |
| Concepts & Research | roadmap | Development roadmaps and plans | Articles about roadmaps, future plans, or development timelines | sora, iroha3, governance |
| Concepts & Research | staking | Staking mechanisms and validator rewards | Articles about staking, validators, or network security | val, validator, governance, defi |
| Concepts & Research | validator | Validator nodes and network security | Articles about validators, consensus, or network operations | val, staking, iroha, governance |
| Concepts & Research | blockchain | General blockchain concepts | Articles about blockchain technology, distributed ledgers, or consensus | sora, iroha, substrate, decentralization |
| Concepts & Research | tokenization | Asset tokenization processes | Articles about tokenizing assets, NFTs, or creating tokens | real-world-assets, nft, economics |

---

## Tag Statistics

**Total Tags**: 52

**Distribution by Domain:**
- Core Protocols: 8 tags
- Tokenomics: 8 tags
- Governance: 6 tags
- Infrastructure: 5 tags
- Products & Ecosystem: 8 tags
- Concepts & Research: 9 tags

---

## Verification & Maintenance

### Tag Validation Rules

1. **Tag Relevance**: Every tag should appear in at least 2–3 KB documents
2. **Coverage**: No major high-frequency terms should be missing
3. **Relationships**: Related tags should connect logically
4. **Balance**: Each category should have 6–10 tags
5. **Naming Consistency**: All tags follow lowercase and kebab-case conventions

### Integration Notes

- Cursor and KB scripts should reference this file (`knowledge_base/meta/tag-suggestion-matrix.md`) when optimizing or generating tags automatically
- During article edits, Cursor should select **9–12 tags** per post using this matrix as its vocabulary source
- Matrix updates should be ingested with: `pnpm kb:ingest`

---

## Changelog

- **2025-11-05**: Initial matrix creation with 52 tags across 6 domains

