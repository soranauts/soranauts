# Glossary Content Standards

This document defines the quality standards for all glossary terms in the Soranauts knowledge base.

## Definition Requirements

### Minimum Length
- **Target**: 150+ characters (2-3 sentences)
- **Structure**: What it is → How it works → Why it matters to SORA

### Content Structure
Each definition should answer:
1. **What is it?** - Clear, jargon-free explanation
2. **How does it work?** - Technical context where relevant
3. **Why does it matter?** - Connection to SORA ecosystem

## Formatting Rules

### Token Names & Protocol Acronyms (UPPERCASE)
- XOR, VAL, PSWAP, KUSD, TBCD, XSTUSD
- TONSWAP, HASHI
- DEX, AMM, TVL, APY, APR
- BFT, TEU, IVM, WSV, DA

### Product Names (Title Case)
- Polkaswap
- Fearless Wallet
- Kensetsu
- Demeter

### Technical Terms
- Nexus Architecture
- Token Bonding Curve
- Data Spaces
- Merge Ledger

## WHY IT MATTERS Section

Every term should have a `tagline` field explaining practical importance:

```yaml
tagline: "One sentence explaining why users should care about this concept."
```

Good examples:
- "Enables human-readable addresses while preventing typos and cross-chain confusion."
- "Prevents any single lane from starving others of compute resources."
- "Allows privacy-preserving transactions while maintaining network auditability."

## Source Links

### Required
Every term must have at least 1 source link.

### Valid Source Types

| Type | URL Pattern | When to Use |
|------|-------------|-------------|
| SORA Wiki | `https://wiki.sora.org/...` | User-friendly explanations |
| Nexus Whitepaper | `/documents/sora_nexus_whitepaper.pdf` | Technical Nexus terms |
| Medium Articles | `https://medium.com/sora-xor/...` | Economic model, announcements |
| Polkaswap Docs | `https://wiki.sora.org/polkaswap.html` | DeFi/trading terms |
| Fearless Docs | `https://wiki.sora.org/fearless-wallet.html` | Wallet-related terms |

### Link Format in MDX

```yaml
links:
  - label: "SORA Wiki"
    url: "https://wiki.sora.org/xor.html"
  - label: "Nexus Whitepaper"
    url: "/documents/sora_nexus_whitepaper.pdf"
```

## Quality Checklist

Before submitting a glossary term, verify:

- [ ] Definition is 150+ characters
- [ ] No jargon without explanation
- [ ] Has `tagline` field (WHY IT MATTERS)
- [ ] Has at least 1 source link
- [ ] Token names are UPPERCASE
- [ ] Product names are Title Case
- [ ] Related terms are accurate and exist
- [ ] Category is appropriate

## Examples

### Good Definition

```yaml
title: "XOR"
slug: xor
category: "Token"
summary: "The network utility token used for transaction fees (gas) where 50% of fees are burned and 50% go to validators. XOR has elastic supply managed by a token bonding curve and can be used for staking, liquidity provision, and future SORA Parliament membership."
tagline: "The foundation of all SORA network activity and governance participation."
links:
  - label: "SORA Wiki - XOR"
    url: "https://wiki.sora.org/xor.html"
```

### Needs Improvement

```yaml
title: "SM3"
slug: sm3
category: "Cryptography"
summary: "The companion hash function from the Chinese SM cryptographic family."
# Missing: tagline, links, expanded definition
```
