# How to Use SORA Glossary in Articles

## Method 1: Inline Glossary Component (Recommended)

### Step 1: Import the Component
Add this import at the top of your MDX file:

```mdx
---
// Your existing frontmatter
---

import InlineGlossary from '~/components/blog/InlineGlossary.astro';
```

### Step 2: Use in Your Content
Replace regular text with the glossary component:

**Before:**
```mdx
The SORA network uses an elastic supply model for its XOR token, which is secured by validators through staking.
```

**After:**
```mdx
The <InlineGlossary term="SORA" /> network uses an <InlineGlossary term="Elastic Supply" /> model for its <InlineGlossary term="XOR" /> token, which is secured by <InlineGlossary term="Validator" />s through <InlineGlossary term="Staking" />.
```

## Method 2: Manual HTML (Alternative)

You can also use the standalone SORAGlossary component:

```mdx
import SORAGlossary from '~/components/blog/SORAGlossary.astro';

The <SORAGlossary term="Polkaswap" category="defi" definition="SORA's decentralized exchange for cross-chain trading" relatedTerms={["DEX", "Liquidity", "Trading"]} /> enables seamless trading.
```

## Available Terms

The glossary includes 19+ terms across 6 categories:

### Tokens
- XOR, VAL, PSWAP

### Technology  
- Hyperledger Iroha, Substrate, Parachain, SORA v3, Fujiwara Testnet

### Governance
- SORA Parliament, Referendum

### DeFi
- Polkaswap, Liquidity Pool, Yield Farming, Impermanent Loss

### Network
- Validator, Staking

### Economics
- Token Bonding Curve, Elastic Supply, CBDC

## Example Implementation

Here's how you could update the SORAMITSU article:

```mdx
---
// Existing frontmatter
---

import InlineGlossary from '~/components/blog/InlineGlossary.astro';

The future of finance is being rewritten by three powerful forces: **SORAMITSU**, the <InlineGlossary term="SORA" /> network, and <InlineGlossary term="Polkaswap" />. Together, they're not just building another blockchain project—they're creating an entirely new economic paradigm that challenges traditional financial systems and empowers users worldwide.

## What Makes This Ecosystem Different?

Unlike typical cryptocurrency projects that focus solely on token speculation, the SORAMITSU-SORA-Polkaswap ecosystem represents a **complete financial infrastructure** designed for real-world adoption. From <InlineGlossary term="CBDC" />s to decentralized exchanges, this trio is proving that blockchain technology can serve both institutions and individuals.

## SORAMITSU: The Enterprise Blockchain Pioneer

[SORAMITSU](https://soramitsu.co.jp) isn't your typical blockchain startup. This Japan-based fintech company has a proven track record of delivering enterprise-grade blockchain solutions that actually work in production environments.

**Key Achievements:**
- **<InlineGlossary term="Hyperledger Iroha" /> Development**: SORAMITSU created Hyperledger Iroha, now part of the Linux Foundation's Hyperledger project
- **Bakong <InlineGlossary term="CBDC" />**: Successfully deployed Cambodia's national digital currency, serving millions of users
- **Enterprise Partnerships**: Working with central banks and financial institutions worldwide

## SORA: A Revolutionary Economic Model

The [SORA network](https://sora.org) represents a fundamental reimagining of how economic systems should work. Instead of replicating traditional financial models, SORA introduces innovative concepts that could reshape global finance.

### Key Innovations

**1. <InlineGlossary term="Elastic Supply" /> Model**
- Unlike Bitcoin's fixed supply or fiat's arbitrary printing, SORA uses an elastic supply mechanism
- Automatically adjusts based on economic conditions and network needs
- Designed to maintain stability while enabling growth

**2. Decentralized Governance**
- Community-driven decision making through <InlineGlossary term="SORA Parliament" /> voting
- Transparent proposal and funding system
- Direct democracy for network improvements

**3. Cross-Chain Integration**
- Built for interoperability with multiple blockchains
- Seamless asset transfers across different networks
- Future-proof architecture for evolving blockchain landscape

### SORA v3: The Next Evolution

<InlineGlossary term="SORA v3" /> represents a significant leap forward, incorporating:
- Enhanced <InlineGlossary term="Hyperledger Iroha" /> integration
- Improved scalability and performance
- Better developer tools and APIs
- Advanced governance mechanisms
```

## Benefits

1. **Instant Learning**: Users can hover over terms to get definitions
2. **Better SEO**: Search engines can understand technical terms better
3. **Improved UX**: Reduces cognitive load for readers
4. **Consistent Definitions**: All terms use the same authoritative definitions
5. **Visual Appeal**: Color-coded categories make content more engaging

## Best Practices

1. **Don't overuse**: Only highlight terms that need explanation
2. **Be consistent**: Use the same term format throughout
3. **Test tooltips**: Make sure they work on mobile devices
4. **Keep definitions current**: Update the glossary data as needed
5. **Use sparingly**: Too many highlighted terms can be overwhelming

