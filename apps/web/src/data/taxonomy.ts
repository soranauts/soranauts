// Unified taxonomy dataset for glossary terms, entities, versions, and tags.

import tagsData from './taxonomy-tags.json';

export type TaxonomyNodeType = 'term' | 'entity' | 'version' | 'tag';

export interface TaxonomyNode {
  slug: string;
  title: string;
  type: TaxonomyNodeType;
  category?: 'token' | 'technology' | 'governance' | 'defi' | 'network' | 'economics';
  summary?: string;
  definition?: string;
  aliases: string[];
  relatedTags: string[];
  seeAlso: string[];
  examples?: string[];
  links?: { label: string; url: string }[];
  priority?: number;
  entity?: string;
  versions?: string[];
  glossaryRef?: string;
}

const normalizeKey = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const toTagSlug = (value: string): string => `tag-${normalizeKey(value).replace(/\s+/g, '-')}`;

const humanize = (value: string): string =>
  value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const baseTaxonomy: Record<string, TaxonomyNode> = {
  "xor": {
    "slug": "xor",
    "title": "XOR",
    "type": "term",
    "category": "token",
    "summary": "The network utility token used for transaction fees (gas) where 50% of fees are burned and 50% go to validators. XOR has elastic supply managed by a token bonding curve and can …",
    "definition": "The network utility token used for transaction fees (gas) where 50% of fees are burned and 50% go to validators. XOR has elastic supply managed by a token bonding curve and can be used for staking, liquidity provision, and future SORA Parliament membership.",
    "aliases": [
      "XOR"
    ],
    "relatedTags": [
      "val",
      "pswap",
      "token bonding curve",
      "elastic supply",
      "polkaswap"
    ],
    "seeAlso": [
      "VAL",
      "PSWAP",
      "Token Bonding Curve",
      "Elastic Supply",
      "Polkaswap"
    ],
    "examples": [
      "Transaction fees",
      "Validator staking",
      "Liquidity provision",
      "SORA Parliament citizenship"
    ],
    "links": [
      {
        "label": "SORA Wiki - XOR",
        "url": "https://wiki.sora.org/xor.html"
      },
      {
        "label": "SORA Staking Guide",
        "url": "https://wiki.sora.org/demeter-staking-polkaswap.html#sora-staking"
      },
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/xor"
  },
  "val": {
    "slug": "val",
    "title": "VAL",
    "type": "term",
    "category": "token",
    "summary": "A validator reward token for the SORA network used to reward validators and stake nominators. VAL has deflationary tokenomics with tokens burned on every transaction, and elasti…",
    "definition": "A validator reward token for the SORA network used to reward validators and stake nominators. VAL has deflationary tokenomics with tokens burned on every transaction, and elastic rewards distributed as a percentage of daily burned tokens.",
    "aliases": [
      "VAL"
    ],
    "relatedTags": [
      "xor",
      "pswap",
      "validator",
      "staking",
      "deflationary",
      "hashi"
    ],
    "seeAlso": [
      "XOR",
      "PSWAP",
      "Validator",
      "Staking",
      "Deflationary",
      "HASHI"
    ],
    "examples": [
      "Validator rewards",
      "Staking rewards",
      "Transaction fee burning"
    ],
    "links": [
      {
        "label": "SORA Wiki - VAL",
        "url": "https://wiki.sora.org/val.html"
      },
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/val"
  },
  "pswap": {
    "slug": "pswap",
    "title": "PSWAP",
    "type": "term",
    "category": "token",
    "summary": "A deflationary token used to reward liquidity providers on Polkaswap. PSWAP has a 10 billion max supply that decreases over time, with 0.3% trading fees used for buyback-and-bur…",
    "definition": "A deflationary token used to reward liquidity providers on Polkaswap. PSWAP has a 10 billion max supply that decreases over time, with 0.3% trading fees used for buyback-and-burn, and rewards starting at 90% of burned tokens reminted for LPs, decreasing to 35% after 5 years.",
    "aliases": [
      "PSWAP"
    ],
    "relatedTags": [
      "xor",
      "val",
      "polkaswap",
      "dex",
      "liquidity",
      "deflationary",
      "buyback-and-burn"
    ],
    "seeAlso": [
      "XOR",
      "VAL",
      "Polkaswap",
      "DEX",
      "Liquidity",
      "Deflationary",
      "Buyback-and-burn"
    ],
    "examples": [
      "Liquidity provider rewards",
      "Trading fee buyback",
      "Token burning mechanism"
    ],
    "links": [
      {
        "label": "SORA Wiki - PSWAP",
        "url": "https://wiki.sora.org/pswap.html"
      },
      {
        "label": "Polkaswap Exchange",
        "url": "https://polkaswap.io"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/pswap"
  },
  "hyperledger-iroha": {
    "slug": "hyperledger-iroha",
    "title": "Hyperledger Iroha",
    "type": "entity",
    "category": "technology",
    "summary": "An open-source, permissioned blockchain framework developed by SORAMITSU and part of the Hyperledger Foundation. Designed for simplicity and fast deployment with granular permis…",
    "definition": "An open-source, permissioned blockchain framework developed by SORAMITSU and part of the Hyperledger Foundation. Designed for simplicity and fast deployment with granular permissions, built-in asset management, and Byzantine fault tolerant consensus. Hyperledger Iroha 2 (written in Rust) adds WASM smart contracts and improved performance, making it suitable for enterprise systems, CBDCs, and national-level financial infrastructure.",
    "aliases": [
      "Hyperledger Iroha",
      "hyperledger iroha",
      "iroha",
      "hyperled",
      "iroha blockchain"
    ],
    "relatedTags": [
      "soramitsu",
      "hyperledger foundation",
      "permissioned blockchain",
      "cbdc",
      "enterprise",
      "wasm",
      "hyperledger iroha 2",
      "hyperledger iroha 3"
    ],
    "seeAlso": [
      "SORAMITSU",
      "Hyperledger Foundation",
      "Permissioned Blockchain",
      "CBDC",
      "Enterprise",
      "WASM",
      "Hyperledger Iroha 2",
      "Hyperledger Iroha 3"
    ],
    "examples": [
      "SORA network",
      "Bakong CBDC",
      "Enterprise systems",
      "National financial infrastructure"
    ],
    "links": [
      {
        "label": "Hyperledger Iroha",
        "url": "https://docs.iroha.tech/"
      }
    ],
    "priority": 95,
    "versions": [
      "hyperledger-iroha-2",
      "hyperledger-iroha-3"
    ],
    "glossaryRef": "/glossary/hyperledger-iroha"
  },
  "hyperledger-iroha-2": {
    "slug": "hyperledger-iroha-2",
    "title": "Hyperledger Iroha 2",
    "type": "version",
    "category": "technology",
    "summary": "Hyperledger Iroha 2 is the blockchain framework that provided the foundation for SORA v2 Hubchain Phase 1-2 prototypes. Hyperledger Iroha 2 (written in Rust) provides WASM smart…",
    "definition": "Hyperledger Iroha 2 is the blockchain framework that provided the foundation for SORA v2 Hubchain Phase 1-2 prototypes. Hyperledger Iroha 2 (written in Rust) provides WASM smart contracts and improved performance, making it suitable for enterprise systems, CBDCs, and national-level financial infrastructure. The framework enabled early cross-chain transfer proofs and verifier mechanisms. SORA v3 is transitioning from Hyperledger Iroha 2 to Hyperledger Iroha 3 for improved modularity and scalability.",
    "aliases": [
      "Hyperledger Iroha 2",
      "Iroha 2",
      "iroha 2",
      "iroha2",
      "iroha v2"
    ],
    "relatedTags": [
      "hyperledger iroha",
      "sora v2",
      "sora v3",
      "hyperledger iroha 3",
      "soramitsu",
      "wasm",
      "cbdc",
      "hubchain"
    ],
    "seeAlso": [
      "Hyperledger Iroha",
      "SORA v2",
      "SORA v3",
      "Hyperledger Iroha 3",
      "SORAMITSU",
      "WASM",
      "CBDC",
      "Hubchain"
    ],
    "examples": [
      "SORA v2 network",
      "Hubchain Phase 1-2",
      "Enterprise blockchain systems",
      "CBDC infrastructure"
    ],
    "links": [
      {
        "label": "Hyperledger Iroha Documentation",
        "url": "https://docs.iroha.tech/"
      }
    ],
    "priority": 88,
    "entity": "hyperledger-iroha",
    "glossaryRef": "/glossary/hyperledger-iroha-2"
  },
  "hyperledger-iroha-3": {
    "slug": "hyperledger-iroha-3",
    "title": "Hyperledger Iroha 3",
    "type": "version",
    "category": "technology",
    "summary": "Hyperledger Iroha 3 is the next-generation blockchain framework being developed for SORA v3 (Nexus). Hyperledger Iroha 3 introduces a re-engineered architecture with greater mod…",
    "definition": "Hyperledger Iroha 3 is the next-generation blockchain framework being developed for SORA v3 (Nexus). Hyperledger Iroha 3 introduces a re-engineered architecture with greater modularity, new consensus mechanisms, and enhanced security primitives. It features layered runtime for domain-specific modules, upgraded command model, query isolation for deterministic operations, and simplified validator orchestration. Hyperledger Iroha 3 will support Iroha Special Instructions (ISIs) for deterministic smart-contract logic and provide the foundation for SORA v3's high-performance, cross-chain infrastructure.",
    "aliases": [
      "Hyperledger Iroha 3",
      "Iroha 3",
      "iroha 3",
      "iroha3",
      "iroha v3",
      "nexus",
      "sora v3"
    ],
    "relatedTags": [
      "hyperledger iroha",
      "hyperledger iroha 2",
      "sora v3",
      "iroha special instructions",
      "isi",
      "bft consensus",
      "modular architecture"
    ],
    "seeAlso": [
      "Hyperledger Iroha",
      "Hyperledger Iroha 2",
      "SORA v3",
      "Iroha Special Instructions",
      "ISI",
      "BFT Consensus",
      "Modular Architecture"
    ],
    "examples": [
      "SORA v3 network",
      "Next-generation framework",
      "Enterprise blockchain upgrade",
      "Modular runtime"
    ],
    "links": [
      {
        "label": "Hyperledger Iroha Documentation",
        "url": "https://docs.iroha.tech/"
      }
    ],
    "priority": 94,
    "entity": "hyperledger-iroha",
    "glossaryRef": "/glossary/hyperledger-iroha-3"
  },
  "substrate": {
    "slug": "substrate",
    "title": "Substrate",
    "type": "term",
    "category": "technology",
    "summary": "A modular blockchain framework developed by Parity Technologies. SORA v2 uses Substrate as its foundation to integrate with the Polkadot ecosystem and enable cross-chain functio…",
    "definition": "A modular blockchain framework developed by Parity Technologies. SORA v2 uses Substrate as its foundation to integrate with the Polkadot ecosystem and enable cross-chain functionality through parachain connectivity. SORA v3 (Nexus) is migrating away from Substrate to Hyperledger Iroha 3 for improved efficiency, enterprise integration, and enhanced capabilities for CBDC and government use cases.",
    "aliases": [
      "Substrate"
    ],
    "relatedTags": [
      "polkadot",
      "parachain",
      "cross-chain",
      "sora v2",
      "sora v3",
      "hyperledger iroha",
      "hyperledger iroha 3"
    ],
    "seeAlso": [
      "Polkadot",
      "Parachain",
      "Cross-chain",
      "SORA v2",
      "SORA v3",
      "Hyperledger Iroha",
      "Hyperledger Iroha 3"
    ],
    "examples": [
      "Polkadot parachain",
      "Cross-chain bridges",
      "Modular development",
      "SORA v2 implementation"
    ],
    "links": [
      {
        "label": "Substrate",
        "url": "https://substrate.io"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/substrate"
  },
  "parachain": {
    "slug": "parachain",
    "title": "Parachain",
    "type": "term",
    "category": "network",
    "summary": "A parallel blockchain in the Polkadot ecosystem that connects to the main relay chain and benefits from shared security. Parachains can specialize in specific use cases (DeFi, p…",
    "definition": "A parallel blockchain in the Polkadot ecosystem that connects to the main relay chain and benefits from shared security. Parachains can specialize in specific use cases (DeFi, privacy, smart contracts) while maintaining interoperability through Cross-Consensus Messaging (XCM). They process transactions in parallel and are validated by the relay chain's validator set.",
    "aliases": [
      "Parachain",
      "Parachains",
      "parachains"
    ],
    "relatedTags": [
      "polkadot",
      "relay chain",
      "xcm",
      "shared security",
      "parallel processing",
      "cross-chain"
    ],
    "seeAlso": [
      "Polkadot",
      "Relay Chain",
      "XCM",
      "Shared Security",
      "Parallel Processing",
      "Cross-chain"
    ],
    "examples": [
      "SORA parachain",
      "DeFi parachains",
      "Privacy-focused chains",
      "Smart contract platforms"
    ],
    "links": [
      {
        "label": "Polkadot Parachains Guide",
        "url": "https://wiki.polkadot.com/learn/learn-parachains/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/parachain"
  },
  "ipfs": {
    "slug": "ipfs",
    "title": "IPFS",
    "type": "term",
    "category": "technology",
    "summary": "InterPlanetary File System - a peer-to-peer distributed file system that provides decentralized, content-addressed storage for digital assets. IPFS uses cryptographic hashing to…",
    "definition": "InterPlanetary File System - a peer-to-peer distributed file system that provides decentralized, content-addressed storage for digital assets. IPFS uses cryptographic hashing to create unique identifiers for files, ensuring data integrity and permanent accessibility. In the SORA ecosystem, IPFS is crucial for storing NFT metadata, images, and other digital assets in a censorship-resistant manner.",
    "aliases": [
      "IPFS",
      "InterPlanetary File System"
    ],
    "relatedTags": [
      "nft",
      "decentralized storage",
      "metadata",
      "content addressing",
      "blockchain",
      "digital assets"
    ],
    "seeAlso": [
      "NFT",
      "Decentralized Storage",
      "Metadata",
      "Content Addressing",
      "Blockchain",
      "Digital Assets"
    ],
    "examples": [
      "NFT image storage",
      "Decentralized hosting",
      "Metadata storage",
      "Content distribution"
    ],
    "links": [
      {
        "label": "IPFS Documentation",
        "url": "https://docs.ipfs.tech/"
      },
      {
        "label": "IPFS Protocol",
        "url": "https://ipfs.tech/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/ipfs"
  },
  "polkaswap": {
    "slug": "polkaswap",
    "title": "Polkaswap",
    "type": "term",
    "category": "defi",
    "summary": "A next-generation, cross-chain liquidity aggregator DEX protocol built on SORA network. Polkaswap aggregates liquidity from multiple sources (AMM DEXs, order books, algorithms) …",
    "definition": "A next-generation, cross-chain liquidity aggregator DEX protocol built on SORA network. Polkaswap aggregates liquidity from multiple sources (AMM DEXs, order books, algorithms) and provides smart liquidity routing to find the best prices. It enables seamless trading of ETH/ERC-20 tokens, DOT/KSM, BTC, and future assets with high speed, low fees, and reduced impermanent loss through its unique liquidity infrastructure.",
    "aliases": [
      "Polkaswap",
      "pswap dex",
      "sora dex"
    ],
    "relatedTags": [
      "dex",
      "cross-chain",
      "liquidity aggregation",
      "pswap",
      "smart routing",
      "sora network",
      "tonswap"
    ],
    "seeAlso": [
      "DEX",
      "Cross-chain",
      "Liquidity Aggregation",
      "PSWAP",
      "Smart Routing",
      "SORA Network",
      "TONSWAP"
    ],
    "examples": [
      "Cross-chain token swaps",
      "Multi-source liquidity aggregation",
      "Smart price routing",
      "Reduced impermanent loss"
    ],
    "links": [
      {
        "label": "Polkaswap Exchange",
        "url": "https://polkaswap.io"
      },
      {
        "label": "Polkaswap Wiki",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 80,
    "glossaryRef": "/glossary/polkaswap"
  },
  "tonswap": {
    "slug": "tonswap",
    "title": "TONSWAP",
    "type": "term",
    "category": "defi",
    "summary": "A next-generation decentralized exchange (DEX) and launchpad built on The Open Network (TON) blockchain. TONSWAP combines cutting-edge concentrated liquidity technology with a u…",
    "definition": "A next-generation decentralized exchange (DEX) and launchpad built on The Open Network (TON) blockchain. TONSWAP combines cutting-edge concentrated liquidity technology with a user-friendly design, offering ultra-fast trades, near-zero fees, and seamless Telegram integration. It serves as a TON-native gateway for mobile-first DeFi access. TONSWAP creates sustained on-chain demand for XOR tokens by automatically allocating 10% of all trading fees to buy back and burn XOR, connecting TON ecosystem activity to the SORA economy.",
    "aliases": [
      "TONSWAP",
      "ton swap",
      "telegram dex",
      "ts dex"
    ],
    "relatedTags": [
      "dex",
      "ton",
      "sora",
      "cross-chain",
      "polkaswap",
      "telegram",
      "mobile",
      "liquidity",
      "bridge",
      "launchpad",
      "clmm",
      "xor",
      "buyback-and-burn"
    ],
    "seeAlso": [
      "DEX",
      "TON",
      "SORA",
      "Cross-chain",
      "Polkaswap",
      "Telegram",
      "Mobile",
      "Liquidity",
      "Bridge",
      "Launchpad",
      "CLMM",
      "XOR",
      "Buyback-and-burn"
    ],
    "examples": [
      "Mobile trading via Telegram",
      "Concentrated liquidity provision",
      "Token launchpad",
      "Ultra-low fee swaps",
      "Cross-chain liquidity access",
      "XOR buyback mechanism"
    ],
    "links": [
      {
        "label": "TONSWAP Website",
        "url": "https://tonswap.org/"
      },
      {
        "label": "TONSWAP Roadmap",
        "url": "https://tonswap.org/roadmap"
      },
      {
        "label": "TONSWAP FAQ",
        "url": "https://tonswap.org/faq"
      }
    ],
    "priority": 78,
    "glossaryRef": "/glossary/tonswap"
  },
  "liquidity-pool": {
    "slug": "liquidity-pool",
    "title": "Liquidity Pool",
    "type": "term",
    "category": "defi",
    "summary": "A collection of tokens locked in smart contracts to facilitate trading on DEXs. In Polkaswap's liquidity aggregation system, pools can come from various sources including AMM DE…",
    "definition": "A collection of tokens locked in smart contracts to facilitate trading on DEXs. In Polkaswap's liquidity aggregation system, pools can come from various sources including AMM DEXs, order books, and algorithms. The platform aggregates liquidity from multiple pools to provide better prices and reduced impermanent loss through smart routing.",
    "aliases": [
      "Liquidity Pool"
    ],
    "relatedTags": [
      "dex",
      "liquidity aggregation",
      "trading fees",
      "yield farming",
      "smart routing",
      "impermanent loss"
    ],
    "seeAlso": [
      "DEX",
      "Liquidity Aggregation",
      "Trading Fees",
      "Yield Farming",
      "Smart Routing",
      "Impermanent Loss"
    ],
    "examples": [
      "XYK pools on Polkaswap",
      "Multi-source liquidity aggregation",
      "Cross-chain trading pools",
      "Reduced pair fragmentation"
    ],
    "links": [
      {
        "label": "Polkaswap Liquidity",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/liquidity-pool"
  },
  "token-bonding-curve": {
    "slug": "token-bonding-curve",
    "title": "Token Bonding Curve",
    "type": "term",
    "category": "economics",
    "summary": "A smart contract that manages the supply of XOR in a rational way without human involvement. The TBC automatically adjusts XOR supply based on economic conditions to maintain pr…",
    "definition": "A smart contract that manages the supply of XOR in a rational way without human involvement. The TBC automatically adjusts XOR supply based on economic conditions to maintain price stability, expanding supply during growth and contracting during decline.",
    "aliases": [
      "Token Bonding Curve"
    ],
    "relatedTags": [
      "xor",
      "elastic supply",
      "smart contract",
      "price stability",
      "supply management"
    ],
    "seeAlso": [
      "XOR",
      "Elastic Supply",
      "Smart Contract",
      "Price Stability",
      "Supply Management"
    ],
    "examples": [
      "Automated supply adjustment",
      "Price stability maintenance",
      "Economic condition response"
    ],
    "links": [
      {
        "label": "SORA Wiki - Token Bonding Curve",
        "url": "https://wiki.sora.org/tbc.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/token-bonding-curve"
  },
  "sora-parliament": {
    "slug": "sora-parliament",
    "title": "SORA Parliament",
    "type": "term",
    "category": "governance",
    "summary": "The future democratic governance system of SORA using multi-body sortition with clear separation of powers. The SORA Parliament will replace the current Governance V1 system, im…",
    "definition": "The future democratic governance system of SORA using multi-body sortition with clear separation of powers. The SORA Parliament will replace the current Governance V1 system, implementing sortition-based democracy where citizens are randomly selected (not token voting) and must post XOR bonds for citizenship. Features multiple bodies: Rules Committee, Agenda Council, Interest Panels, Review Panel, and Policy Jury. Main task is allocating newly minted XOR to productive projects. In SORA v3, the Parliament will integrate with a hybrid DAO framework using Iroha Special Instructions (ISIs) for modular governance logic.",
    "aliases": [
      "SORA Parliament"
    ],
    "relatedTags": [
      "xor",
      "val",
      "sortition",
      "citizenship",
      "multi-body governance",
      "supranational",
      "governance v1",
      "iroha special instructions",
      "isi",
      "sora v3"
    ],
    "seeAlso": [
      "XOR",
      "VAL",
      "Sortition",
      "Citizenship",
      "Multi-body Governance",
      "Supranational",
      "Governance V1",
      "Iroha Special Instructions",
      "ISI",
      "SORA v3"
    ],
    "examples": [
      "Random citizen selection",
      "XOR bond posting",
      "Project funding allocation",
      "Rules committee proposals",
      "Modular governance"
    ],
    "links": [
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      },
      {
        "label": "SORA Parliament Article",
        "url": "https://medium.com/sora-xor/the-sora-parliament-af8184dae384"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/sora-parliament"
  },
  "referendum": {
    "slug": "referendum",
    "title": "Referendum",
    "type": "term",
    "category": "governance",
    "summary": "A Democracy Referendum in SORA's current governance system (Polkadot v1 Governance, also called Governance V1). After a Council Motion is approved by the SORA Council, it become…",
    "definition": "A Democracy Referendum in SORA's current governance system (Polkadot v1 Governance, also called Governance V1). After a Council Motion is approved by the SORA Council, it becomes a Democracy Referendum where the entire community can vote on specific proposals, parameter changes, or network upgrades. This differs from Polkadot OpenGov, which SORA v2 does not use.",
    "aliases": [
      "Referendum"
    ],
    "relatedTags": [
      "sora council",
      "council motion",
      "polkadot governance",
      "governance v1",
      "democracy"
    ],
    "seeAlso": [
      "SORA Council",
      "Council Motion",
      "Polkadot Governance",
      "Governance V1",
      "Democracy"
    ],
    "examples": [
      "Network fee changes",
      "Token minting proposals",
      "Parameter updates",
      "On-chain community voting"
    ],
    "links": [
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/referendum"
  },
  "elastic-supply": {
    "slug": "elastic-supply",
    "title": "Elastic Supply",
    "type": "term",
    "category": "economics",
    "summary": "A monetary policy where token supply automatically adjusts based on economic conditions and demand. Unlike conventional tokenomics with limited supply, SORA's XOR uses elastic s…",
    "definition": "A monetary policy where token supply automatically adjusts based on economic conditions and demand. Unlike conventional tokenomics with limited supply, SORA's XOR uses elastic supply managed by the Token Bonding Curve (TBC) smart contract without human involvement. The TBC manages XOR supply rationally to maintain price stability, with the supply expanding or contracting based on market conditions and economic activity.",
    "aliases": [
      "Elastic Supply"
    ],
    "relatedTags": [
      "xor",
      "token bonding curve",
      "monetary policy",
      "price stability",
      "smart contract",
      "economic conditions"
    ],
    "seeAlso": [
      "XOR",
      "Token Bonding Curve",
      "Monetary Policy",
      "Price Stability",
      "Smart Contract",
      "Economic Conditions"
    ],
    "examples": [
      "Supply expansion during growth",
      "Supply contraction during decline",
      "Automated price stability",
      "TBC-managed supply"
    ],
    "links": [
      {
        "label": "SORA Tokenomics",
        "url": "https://wiki.sora.org/tokenomics.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/elastic-supply"
  },
  "cbdc": {
    "slug": "cbdc",
    "title": "CBDC",
    "type": "term",
    "category": "economics",
    "summary": "Central Bank Digital Currency - a digital form of a country's fiat currency issued by the central bank. SORAMITSU has successfully deployed multiple CBDCs including Cambodia's B…",
    "definition": "Central Bank Digital Currency - a digital form of a country's fiat currency issued by the central bank. SORAMITSU has successfully deployed multiple CBDCs including Cambodia's Bakong (8.5M users, $15.5M in payments), Lao CBDC pilot, and Fiji CBDC exploration. These blockchain-based systems enable financial inclusion, cross-border remittances, and interoperable digital payments.",
    "aliases": [
      "CBDC"
    ],
    "relatedTags": [
      "soramitsu",
      "bakong",
      "digital currency",
      "central bank",
      "financial inclusion",
      "cross-border payments"
    ],
    "seeAlso": [
      "SORAMITSU",
      "Bakong",
      "Digital Currency",
      "Central Bank",
      "Financial Inclusion",
      "Cross-border Payments"
    ],
    "examples": [
      "Bakong (Cambodia)",
      "Lao CBDC pilot",
      "Fiji CBDC exploration",
      "Digital payments",
      "Financial inclusion"
    ],
    "links": [
      {
        "label": "CBDC Development in Asia-Pacific",
        "url": "https://www.japanpolicyforum.jp/economy/pt2024041523151814191.html"
      },
      {
        "label": "Bakong White Paper",
        "url": "https://bakong.nbc.gov.kh/download/NBC_BAKONG_White_Paper.pdf"
      },
      {
        "label": "Palau Digital Bonds",
        "url": "https://soramitsu.co.jp/palau-digital-bonds"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/cbdc"
  },
  "validator": {
    "slug": "validator",
    "title": "Validator",
    "type": "term",
    "category": "network",
    "summary": "A network participant that validates transactions and maintains the blockchain. Validators in SORA secure the network and earn rewards for their services.",
    "definition": "A network participant that validates transactions and maintains the blockchain. Validators in SORA secure the network and earn rewards for their services.",
    "aliases": [
      "Validator"
    ],
    "relatedTags": [
      "staking",
      "consensus",
      "security",
      "rewards"
    ],
    "seeAlso": [
      "Staking",
      "Consensus",
      "Security",
      "Rewards"
    ],
    "examples": [
      "Transaction validation",
      "Block production",
      "Network security"
    ],
    "links": [
      {
        "label": "Validator Guide",
        "url": "https://wiki.sora.org/nominating-validators.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/validator"
  },
  "staking": {
    "slug": "staking",
    "title": "Staking",
    "type": "term",
    "category": "network",
    "summary": "The process of locking tokens to support network security and earn rewards. SORA users can stake XOR tokens to validators and receive staking rewards.",
    "definition": "The process of locking tokens to support network security and earn rewards. SORA users can stake XOR tokens to validators and receive staking rewards.",
    "aliases": [
      "Staking"
    ],
    "relatedTags": [
      "validator",
      "rewards",
      "security",
      "xor"
    ],
    "seeAlso": [
      "Validator",
      "Rewards",
      "Security",
      "XOR"
    ],
    "examples": [
      "XOR staking",
      "Validator selection",
      "Reward earning"
    ],
    "links": [
      {
        "label": "Staking Guide",
        "url": "https://wiki.sora.org/nominating-validators.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/staking"
  },
  "sora-v3": {
    "slug": "sora-v3",
    "title": "SORA v3",
    "type": "term",
    "category": "technology",
    "summary": "SORA v3, also known as SORA Nexus, is the next generation of the SORA network. It transitions from Substrate-based SORA v2 to Hyperledger Iroha 3, introducing a modular, high-pe…",
    "definition": "SORA v3, also known as SORA Nexus, is the next generation of the SORA network. It transitions from Substrate-based SORA v2 to Hyperledger Iroha 3, introducing a modular, high-performance design to support scalability and cross-chain interoperability. The SORA v3 Hub Chain (or Hubchain) enables seamless collaboration between permissioned and decentralized systems, designed for CBDCs, government integration, and economic sovereignty while maintaining borderless financial activities. It serves as a supranational platform that de-correlates CBDCs and government-issued digital assets from political and economic instability, providing a stable foundation for global transactions.",
    "aliases": [
      "SORA v3",
      "nexus",
      "sora nexus",
      "hyperledger iroha 3"
    ],
    "relatedTags": [
      "hyperledger iroha",
      "hyperledger iroha 2",
      "hyperledger iroha 3",
      "cbdc",
      "hub chain",
      "hubchain",
      "nexus",
      "economic sovereignty",
      "kusd",
      "fujiwara testnet",
      "supranational platform",
      "sora v2"
    ],
    "seeAlso": [
      "Hyperledger Iroha",
      "Hyperledger Iroha 2",
      "Hyperledger Iroha 3",
      "CBDC",
      "Hub Chain",
      "Hubchain",
      "Nexus",
      "Economic Sovereignty",
      "KUSD",
      "Fujiwara Testnet",
      "Supranational Platform",
      "SORA v2"
    ],
    "examples": [
      "Central bank digital currencies",
      "Government asset creation",
      "Permissioned subnets",
      "Supranational platform",
      "Cross-chain interoperability"
    ],
    "links": [
      {
        "label": "SORA v3 Guide",
        "url": "https://wiki.sora.org/sora-v3.html"
      }
    ],
    "priority": 85,
    "glossaryRef": "/glossary/sora-v3"
  },
  "fujiwara-testnet": {
    "slug": "fujiwara-testnet",
    "title": "Fujiwara Testnet",
    "type": "term",
    "category": "technology",
    "summary": "The first testnet for SORA v3, named after the influential Fujiwara family that shaped Japan's Heian period. This crucial milestone enables experimentation with key SORA v3 feat…",
    "definition": "The first testnet for SORA v3, named after the influential Fujiwara family that shaped Japan's Heian period. This crucial milestone enables experimentation with key SORA v3 features including DeFi capabilities, SORA Parliament governance, and network stability testing. As the first public blockchain implementation of Iroha-based infrastructure, it provides valuable insights for the transition from private to public blockchain features.",
    "aliases": [
      "Fujiwara Testnet"
    ],
    "relatedTags": [
      "sora v3",
      "hyperledger iroha",
      "sora parliament",
      "defi",
      "governance",
      "public blockchain"
    ],
    "seeAlso": [
      "SORA v3",
      "Hyperledger Iroha",
      "SORA Parliament",
      "DeFi",
      "Governance",
      "Public Blockchain"
    ],
    "examples": [
      "DeFi experimentation",
      "Governance participation",
      "Network stability testing",
      "Cross-border transactions"
    ],
    "links": [
      {
        "label": "Fujiwara Testnet Guide",
        "url": "https://wiki.sora.org/sora-v3.html#why-the-fujiwara-testnet-matters"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/fujiwara-testnet"
  },
  "hub-chain": {
    "slug": "hub-chain",
    "title": "Hub Chain",
    "type": "term",
    "category": "technology",
    "summary": "The core infrastructure of SORA v3 (also called Hubchain) that enables seamless collaboration between permissioned and decentralized systems. The SORA v3 Hub Chain bridges diffe…",
    "definition": "The core infrastructure of SORA v3 (also called Hubchain) that enables seamless collaboration between permissioned and decentralized systems. The SORA v3 Hub Chain bridges different blockchain networks (TON, Polkadot, Ethereum) and serves as a unified hub connecting external networks. It enables central banks and institutions to create their own assets on the global SORA v3 platform while maintaining security and interoperability through the supranational, decentralized blockchain.",
    "aliases": [
      "Hub Chain"
    ],
    "relatedTags": [
      "sora v3",
      "hubchain",
      "nexus",
      "cross-chain",
      "interoperability",
      "permissioned subnets",
      "supranational platform"
    ],
    "seeAlso": [
      "SORA v3",
      "Hubchain",
      "Nexus",
      "Cross-chain",
      "Interoperability",
      "Permissioned Subnets",
      "Supranational Platform"
    ],
    "examples": [
      "Cross-chain asset transfers",
      "CBDC infrastructure",
      "Permissioned subnet connections",
      "Multi-chain coordination"
    ],
    "links": [
      {
        "label": "SORA v3 Hub Chain",
        "url": "https://wiki.sora.org/sora-v3.html#the-sora-v3-hubchain"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/hub-chain"
  },
  "hubchain": {
    "slug": "hubchain",
    "title": "Hubchain",
    "type": "term",
    "category": "technology",
    "summary": "Alternative name for the SORA v3 Hub Chain. See Hub Chain for full definition.",
    "definition": "Alternative name for the SORA v3 Hub Chain. See Hub Chain for full definition.",
    "aliases": [
      "Hubchain",
      "Hub Chain"
    ],
    "relatedTags": [
      "hub chain",
      "sora v3",
      "nexus"
    ],
    "seeAlso": [
      "Hub Chain",
      "SORA v3",
      "Nexus"
    ],
    "examples": [],
    "links": [
      {
        "label": "SORA v3 Hub Chain",
        "url": "https://wiki.sora.org/sora-v3.html#the-sora-v3-hubchain"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/hubchain"
  },
  "nexus": {
    "slug": "nexus",
    "title": "Nexus",
    "type": "term",
    "category": "technology",
    "summary": "The code name for SORA v3, also referred to as SORA Nexus. Nexus represents the next-generation SORA Hub Chain designed to succeed the Substrate-based SORA v2 network, built on …",
    "definition": "The code name for SORA v3, also referred to as SORA Nexus. Nexus represents the next-generation SORA Hub Chain designed to succeed the Substrate-based SORA v2 network, built on Hyperledger Iroha 3 for improved modularity, performance, and cross-chain interoperability.",
    "aliases": [
      "Nexus"
    ],
    "relatedTags": [
      "sora v3",
      "hub chain",
      "hyperledger iroha 3",
      "sora v2"
    ],
    "seeAlso": [
      "SORA v3",
      "Hub Chain",
      "Hyperledger Iroha 3",
      "SORA v2"
    ],
    "examples": [
      "SORA v3 (Nexus) upgrade",
      "Next-generation network",
      "Hyperledger Iroha 3 migration"
    ],
    "links": [
      {
        "label": "SORA v3 Guide",
        "url": "https://wiki.sora.org/sora-v3.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/nexus"
  },
  "kensetsu": {
    "slug": "kensetsu",
    "title": "Kensetsu",
    "type": "term",
    "category": "defi",
    "summary": "The Kensetsu Platform is SORA's version of MakerDAO, a decentralized finance (DeFi) solution on the SORA network that enables over-collateralized stablecoin creation and borrowi…",
    "definition": "The Kensetsu Platform is SORA's version of MakerDAO, a decentralized finance (DeFi) solution on the SORA network that enables over-collateralized stablecoin creation and borrowing. The platform facilitates the creation and management of KUSD (Kensetsu USD), allowing users to create vaults, deposit collateral, and borrow stablecoins while maintaining value through algorithmic governance and stability mechanisms.",
    "aliases": [
      "Kensetsu"
    ],
    "relatedTags": [
      "kusd",
      "makerdao",
      "vault",
      "over-collateralized",
      "stablecoin",
      "defi"
    ],
    "seeAlso": [
      "KUSD",
      "MakerDAO",
      "Vault",
      "Over-collateralized",
      "Stablecoin",
      "DeFi"
    ],
    "examples": [
      "Vault creation",
      "Over-collateralized borrowing",
      "Stablecoin generation",
      "Collateral management"
    ],
    "links": [
      {
        "label": "SORA Wiki - KUSD",
        "url": "https://wiki.sora.org/kusd.html"
      },
      {
        "label": "Kensetsu Vaults",
        "url": "https://wiki.sora.org/kensetsu-vaults.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/kensetsu"
  },
  "bft-consensus": {
    "slug": "bft-consensus",
    "title": "BFT Consensus",
    "type": "term",
    "category": "technology",
    "summary": "Byzantine Fault Tolerance (BFT) consensus is a consensus mechanism that allows a distributed system to reach agreement even when some nodes fail or act maliciously. SORA v3 uses…",
    "definition": "Byzantine Fault Tolerance (BFT) consensus is a consensus mechanism that allows a distributed system to reach agreement even when some nodes fail or act maliciously. SORA v3 uses BFT consensus derived from Hyperledger Iroha 3's architecture, providing high-throughput transaction processing with deterministic finality. This differs from SORA v2's Substrate-based consensus, offering improved security and performance for enterprise-grade applications including CBDCs.",
    "aliases": [
      "BFT Consensus"
    ],
    "relatedTags": [
      "consensus",
      "byzantine fault tolerance",
      "hyperledger iroha 3",
      "sora v3",
      "finality",
      "security"
    ],
    "seeAlso": [
      "Consensus",
      "Byzantine Fault Tolerance",
      "Hyperledger Iroha 3",
      "SORA v3",
      "Finality",
      "Security"
    ],
    "examples": [
      "Transaction validation",
      "Network security",
      "CBDC infrastructure",
      "Enterprise blockchain"
    ],
    "links": [
      {
        "label": "SORA v3",
        "url": "https://wiki.sora.org/sora-v3.html"
      },
      {
        "label": "Hyperledger Iroha",
        "url": "https://docs.iroha.tech/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/bft-consensus"
  },
  "supranational-platform": {
    "slug": "supranational-platform",
    "title": "Supranational Platform",
    "type": "term",
    "category": "network",
    "summary": "A blockchain platform that operates above the level of individual nation states, enabling global coordination and collaboration without being subject to any single country's jur…",
    "definition": "A blockchain platform that operates above the level of individual nation states, enabling global coordination and collaboration without being subject to any single country's jurisdiction. SORA v3 serves as a supranational platform that de-correlates CBDCs and government-issued digital assets from political and economic instability, providing a stable foundation for global transactions. This design enables nations, institutions, and individuals to create assets and conduct transactions on a borderless, decentralized infrastructure.",
    "aliases": [
      "Supranational Platform"
    ],
    "relatedTags": [
      "sora v3",
      "cbdc",
      "economic sovereignty",
      "global transactions",
      "borderless finance"
    ],
    "seeAlso": [
      "SORA v3",
      "CBDC",
      "Economic Sovereignty",
      "Global Transactions",
      "Borderless Finance"
    ],
    "examples": [
      "CBDC deployment",
      "International remittances",
      "Cross-border asset creation",
      "Global economic coordination"
    ],
    "links": [
      {
        "label": "SORA v3 Hub Chain",
        "url": "https://wiki.sora.org/sora-v3.html#the-sora-v3-hubchain"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/supranational-platform"
  },
  "economic-sovereignty": {
    "slug": "economic-sovereignty",
    "title": "Economic Sovereignty",
    "type": "term",
    "category": "economics",
    "summary": "The ability of nations, institutions, or individuals to maintain control over their economic policies and financial systems while participating in a global economic network. SOR…",
    "definition": "The ability of nations, institutions, or individuals to maintain control over their economic policies and financial systems while participating in a global economic network. SORA v3's Hub Chain supports economic sovereignty by balancing the role of nation states in managing their domains with the freedom of borderless financial activities. This enables countries to create their own digital assets (like CBDCs) on the SORA platform while maintaining independence and control.",
    "aliases": [
      "Economic Sovereignty"
    ],
    "relatedTags": [
      "sora v3",
      "cbdc",
      "supranational platform",
      "sovereignty",
      "borderless finance"
    ],
    "seeAlso": [
      "SORA v3",
      "CBDC",
      "Supranational Platform",
      "Sovereignty",
      "Borderless Finance"
    ],
    "examples": [
      "CBDC creation",
      "National digital currency",
      "Independent monetary policy",
      "Sovereign asset management"
    ],
    "links": [
      {
        "label": "SORA v3 Hub Chain",
        "url": "https://wiki.sora.org/sora-v3.html#the-sora-v3-hubchain"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/economic-sovereignty"
  },
  "iroha-special-instructions": {
    "slug": "iroha-special-instructions",
    "title": "Iroha Special Instructions",
    "type": "term",
    "category": "technology",
    "summary": "Iroha Special Instructions (ISIs) are domain-oriented command sets in Hyperledger Iroha 3 that enable deterministic smart-contract logic. ISIs allow for modular governance logic…",
    "definition": "Iroha Special Instructions (ISIs) are domain-oriented command sets in Hyperledger Iroha 3 that enable deterministic smart-contract logic. ISIs allow for modular governance logic and domain-specific operations, providing a flexible framework for building complex decentralized applications on SORA v3. This represents a key advancement over Hyperledger Iroha 2, offering enhanced programmability and interoperability.",
    "aliases": [
      "Iroha Special Instructions",
      "ISIs"
    ],
    "relatedTags": [
      "hyperledger iroha 3",
      "smart contract",
      "sora v3",
      "hyperledger iroha",
      "governance",
      "deterministic"
    ],
    "seeAlso": [
      "Hyperledger Iroha 3",
      "Smart Contract",
      "SORA v3",
      "Hyperledger Iroha",
      "Governance",
      "Deterministic"
    ],
    "examples": [
      "Governance modules",
      "Domain-specific commands",
      "Smart contract execution",
      "Modular DApp development"
    ],
    "links": [
      {
        "label": "Hyperledger Iroha",
        "url": "https://docs.iroha.tech/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/iroha-special-instructions"
  },
  "governance-v1": {
    "slug": "governance-v1",
    "title": "Governance V1",
    "type": "term",
    "category": "governance",
    "summary": "The current governance system used by SORA v2, also known as Polkadot v1 Governance. Governance V1 consists of a Council, Technical Committee, and Parliament with on-chain propo…",
    "definition": "The current governance system used by SORA v2, also known as Polkadot v1 Governance. Governance V1 consists of a Council, Technical Committee, and Parliament with on-chain proposals, referenda, and staking-based voting. Unlike Polkadot OpenGov, Governance V1 provides predictable proposal cycles and explicit decision-making processes. SORA v3 will evolve toward a hybrid DAO framework while maintaining the parliamentary structure for strategic oversight.",
    "aliases": [
      "Governance V1"
    ],
    "relatedTags": [
      "governance",
      "polkadot governance",
      "council",
      "referendum",
      "sora parliament",
      "opengov"
    ],
    "seeAlso": [
      "Governance",
      "Polkadot Governance",
      "Council",
      "Referendum",
      "SORA Parliament",
      "OpenGov"
    ],
    "examples": [
      "Council proposals",
      "Referendum voting",
      "On-chain decision making",
      "Network upgrades"
    ],
    "links": [
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/governance-v1"
  },
  "yield-farming": {
    "slug": "yield-farming",
    "title": "Yield Farming",
    "type": "term",
    "category": "defi",
    "summary": "A DeFi strategy where users provide liquidity to protocols and earn rewards. In Polkaswap, users can farm PSWAP tokens by providing liquidity to XYK pools, with rewards distribu…",
    "definition": "A DeFi strategy where users provide liquidity to protocols and earn rewards. In Polkaswap, users can farm PSWAP tokens by providing liquidity to XYK pools, with rewards distributed through the platform's liquidity aggregation system. Polkaswap's unique infrastructure reduces impermanent loss risks while providing competitive yields through multi-source liquidity aggregation.",
    "aliases": [
      "Yield Farming"
    ],
    "relatedTags": [
      "liquidity provision",
      "pswap",
      "xyk pools",
      "liquidity aggregation",
      "impermanent loss"
    ],
    "seeAlso": [
      "Liquidity Provision",
      "PSWAP",
      "XYK Pools",
      "Liquidity Aggregation",
      "Impermanent Loss"
    ],
    "examples": [
      "PSWAP token rewards",
      "XYK pool liquidity provision",
      "Multi-source yield optimization",
      "Reduced IL farming"
    ],
    "links": [
      {
        "label": "Polkaswap Farming",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/yield-farming"
  },
  "impermanent-loss": {
    "slug": "impermanent-loss",
    "title": "Impermanent Loss",
    "type": "term",
    "category": "defi",
    "summary": "A temporary loss of value that can occur when providing liquidity to automated market makers (AMMs) due to price volatility of the paired assets. For example, if you provide 1 E…",
    "definition": "A temporary loss of value that can occur when providing liquidity to automated market makers (AMMs) due to price volatility of the paired assets. For example, if you provide 1 ETH and 2000 USDC to a pool, and ETH price doubles, you may end up with fewer ETH tokens when withdrawing due to the automated rebalancing.",
    "aliases": [
      "Impermanent Loss"
    ],
    "relatedTags": [
      "liquidity",
      "amm",
      "price volatility",
      "risk"
    ],
    "seeAlso": [
      "Liquidity",
      "AMM",
      "Price Volatility",
      "Risk"
    ],
    "examples": [
      "Liquidity provision risk",
      "Price divergence",
      "Temporary loss"
    ],
    "links": [
      {
        "label": "Understanding Impermanent Loss",
        "url": "https://wiki.sora.org/polkaswap.html"
      },
      {
        "label": "What is Impermanent Loss (Cointelegraph)",
        "url": "https://cointelegraph.com/explained/what-is-impermanent-loss-and-how-to-avoid-it"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/impermanent-loss"
  },
  "integrated-plan": {
    "slug": "integrated-plan",
    "title": "Integrated Plan",
    "type": "term",
    "category": "governance",
    "summary": "A comprehensive development roadmap for the SORA ecosystem separated into Business, Backend, Web, and Mobile/Other tracks. The plan tracks development progress with completion p…",
    "definition": "A comprehensive development roadmap for the SORA ecosystem separated into Business, Backend, Web, and Mobile/Other tracks. The plan tracks development progress with completion percentages and includes key milestones like SORA v3 network launch, SORA Parliament implementation, and cross-chain infrastructure development.",
    "aliases": [
      "Integrated Plan"
    ],
    "relatedTags": [
      "sora v3",
      "sora parliament",
      "development roadmap",
      "cross-chain",
      "infrastructure"
    ],
    "seeAlso": [
      "SORA v3",
      "SORA Parliament",
      "Development Roadmap",
      "Cross-chain",
      "Infrastructure"
    ],
    "examples": [
      "Business partnerships",
      "Technical development",
      "Web interface updates",
      "Mobile integration"
    ],
    "links": [
      {
        "label": "SORA Integrated Plan",
        "url": "https://wiki.sora.org/integrated-plan.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/integrated-plan"
  },
  "smart-contract": {
    "slug": "smart-contract",
    "title": "Smart Contract",
    "type": "term",
    "category": "technology",
    "summary": "Self-executing contracts with the terms of the agreement directly written into code. In SORA, smart contracts like the Token Bonding Curve automatically manage token supply and …",
    "definition": "Self-executing contracts with the terms of the agreement directly written into code. In SORA, smart contracts like the Token Bonding Curve automatically manage token supply and economic parameters without human intervention.",
    "aliases": [
      "Smart Contract"
    ],
    "relatedTags": [
      "token bonding curve",
      "automation",
      "code",
      "blockchain"
    ],
    "seeAlso": [
      "Token Bonding Curve",
      "Automation",
      "Code",
      "Blockchain"
    ],
    "examples": [
      "Token Bonding Curve",
      "Automated supply management",
      "Self-executing agreements"
    ],
    "links": [],
    "priority": 0,
    "glossaryRef": "/glossary/smart-contract"
  },
  "nft": {
    "slug": "nft",
    "title": "NFT",
    "type": "term",
    "category": "technology",
    "summary": "Non-Fungible Token - a unique digital asset that represents ownership of a specific item or piece of content on the blockchain. In the SORA ecosystem, NFTs can be minted, traded…",
    "definition": "Non-Fungible Token - a unique digital asset that represents ownership of a specific item or piece of content on the blockchain. In the SORA ecosystem, NFTs can be minted, traded, and pooled on Polkaswap, with support for both divisible and extensible supply models. NFTs can be created using IPFS links or local file uploads.",
    "aliases": [
      "NFT",
      "NFTs",
      "Non-Fungible Token",
      "Non-Fungible Tokens"
    ],
    "relatedTags": [
      "polkaswap",
      "ipfs",
      "digital asset",
      "blockchain",
      "divisible",
      "extensible supply"
    ],
    "seeAlso": [
      "Polkaswap",
      "IPFS",
      "Digital Asset",
      "Blockchain",
      "Divisible",
      "Extensible Supply"
    ],
    "examples": [
      "Digital art",
      "Collectibles",
      "Unique tokens",
      "Fractional ownership",
      "Liquidity pooling"
    ],
    "links": [
      {
        "label": "SORA Wiki - NFTs",
        "url": "https://wiki.sora.org/nft-polkaswap.html"
      },
      {
        "label": "Polkaswap Exchange",
        "url": "https://polkaswap.io"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/nft"
  },
  "cross-chain": {
    "slug": "cross-chain",
    "title": "Cross-chain",
    "type": "term",
    "category": "technology",
    "summary": "The ability to transfer assets and data between different blockchain networks. SORA enables cross-chain functionality through bridges and interoperability protocols, allowing us…",
    "definition": "The ability to transfer assets and data between different blockchain networks. SORA enables cross-chain functionality through bridges and interoperability protocols, allowing users to trade assets from different blockchains on Polkaswap.",
    "aliases": [
      "Cross-chain"
    ],
    "relatedTags": [
      "polkaswap",
      "bridges",
      "interoperability",
      "blockchain networks"
    ],
    "seeAlso": [
      "Polkaswap",
      "Bridges",
      "Interoperability",
      "Blockchain Networks"
    ],
    "examples": [
      "Cross-chain trading",
      "Asset transfers between networks",
      "Multi-blockchain compatibility"
    ],
    "links": [
      {
        "label": "Polkaswap",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/cross-chain"
  },
  "deflationary": {
    "slug": "deflationary",
    "title": "Deflationary",
    "type": "term",
    "category": "economics",
    "summary": "A tokenomic model where the total supply of tokens decreases over time. In SORA, both VAL and PSWAP are deflationary tokens - VAL tokens are burned on every network transaction,…",
    "definition": "A tokenomic model where the total supply of tokens decreases over time. In SORA, both VAL and PSWAP are deflationary tokens - VAL tokens are burned on every network transaction, while PSWAP tokens are burned on every Polkaswap transaction, creating scarcity and potential value appreciation.",
    "aliases": [
      "Deflationary"
    ],
    "relatedTags": [
      "val",
      "pswap",
      "token burning",
      "scarcity",
      "supply reduction"
    ],
    "seeAlso": [
      "VAL",
      "PSWAP",
      "Token Burning",
      "Scarcity",
      "Supply Reduction"
    ],
    "examples": [
      "VAL transaction burning",
      "PSWAP swap burning",
      "Supply reduction over time"
    ],
    "links": [
      {
        "label": "SORA Tokenomics",
        "url": "https://wiki.sora.org/tokenomics.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/deflationary"
  },
  "buyback-and-burn": {
    "slug": "buyback-and-burn",
    "title": "Buyback-and-burn",
    "type": "term",
    "category": "economics",
    "summary": "A tokenomic mechanism where tokens are purchased from the market and permanently destroyed. PSWAP uses a buyback-and-burn model where 0.3% of trading fees are used to buy PSWAP …",
    "definition": "A tokenomic mechanism where tokens are purchased from the market and permanently destroyed. PSWAP uses a buyback-and-burn model where 0.3% of trading fees are used to buy PSWAP tokens from the market and burn them, reducing total supply and potentially increasing token value.",
    "aliases": [
      "Buyback-and-burn"
    ],
    "relatedTags": [
      "pswap",
      "deflationary",
      "token burning",
      "trading fees",
      "supply reduction"
    ],
    "seeAlso": [
      "PSWAP",
      "Deflationary",
      "Token Burning",
      "Trading Fees",
      "Supply Reduction"
    ],
    "examples": [
      "PSWAP fee buybacks",
      "Token destruction",
      "Supply reduction mechanism"
    ],
    "links": [
      {
        "label": "PSWAP Tokenomics",
        "url": "https://wiki.sora.org/pswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/buyback-and-burn"
  },
  "liquidity-aggregation": {
    "slug": "liquidity-aggregation",
    "title": "Liquidity Aggregation",
    "type": "term",
    "category": "defi",
    "summary": "A technology that combines liquidity from multiple sources (AMM DEXs, order books, algorithms) to provide better prices and reduced slippage. Polkaswap uses advanced liquidity a…",
    "definition": "A technology that combines liquidity from multiple sources (AMM DEXs, order books, algorithms) to provide better prices and reduced slippage. Polkaswap uses advanced liquidity aggregation to source the best prices from various liquidity pools and trading venues.",
    "aliases": [
      "Liquidity Aggregation"
    ],
    "relatedTags": [
      "polkaswap",
      "liquidity pool",
      "smart routing",
      "price optimization",
      "multi-source"
    ],
    "seeAlso": [
      "Polkaswap",
      "Liquidity Pool",
      "Smart Routing",
      "Price Optimization",
      "Multi-source"
    ],
    "examples": [
      "Multi-source liquidity",
      "Best price discovery",
      "Reduced slippage"
    ],
    "links": [
      {
        "label": "Polkaswap Liquidity",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/liquidity-aggregation"
  },
  "smart-routing": {
    "slug": "smart-routing",
    "title": "Smart Routing",
    "type": "term",
    "category": "defi",
    "summary": "An algorithm that automatically finds the optimal path for trading to minimize slippage and maximize returns. Polkaswap's smart routing analyzes multiple liquidity sources and a…",
    "definition": "An algorithm that automatically finds the optimal path for trading to minimize slippage and maximize returns. Polkaswap's smart routing analyzes multiple liquidity sources and automatically routes trades through the best available pools to provide optimal pricing.",
    "aliases": [
      "Smart Routing"
    ],
    "relatedTags": [
      "polkaswap",
      "liquidity aggregation",
      "price optimization",
      "slippage reduction",
      "algorithm"
    ],
    "seeAlso": [
      "Polkaswap",
      "Liquidity Aggregation",
      "Price Optimization",
      "Slippage Reduction",
      "Algorithm"
    ],
    "examples": [
      "Optimal trade routing",
      "Price maximization",
      "Slippage minimization"
    ],
    "links": [
      {
        "label": "Polkaswap Features",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/smart-routing"
  },
  "sortition": {
    "slug": "sortition",
    "title": "Sortition",
    "type": "term",
    "category": "governance",
    "summary": "A governance mechanism where participants are randomly selected to make decisions, rather than through voting or token holdings. The SORA Parliament uses sortition as one of its…",
    "definition": "A governance mechanism where participants are randomly selected to make decisions, rather than through voting or token holdings. The SORA Parliament uses sortition as one of its core principles, randomly choosing citizens to participate in governance bodies, ensuring fair representation and preventing plutocracy.",
    "aliases": [
      "Sortition"
    ],
    "relatedTags": [
      "sora parliament",
      "governance",
      "random selection",
      "democracy",
      "citizenship"
    ],
    "seeAlso": [
      "SORA Parliament",
      "Governance",
      "Random Selection",
      "Democracy",
      "Citizenship"
    ],
    "examples": [
      "Random citizen selection",
      "Fair governance participation",
      "Anti-plutocracy mechanism"
    ],
    "links": [
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/sortition"
  },
  "hashi": {
    "slug": "hashi",
    "title": "HASHI",
    "type": "term",
    "category": "technology",
    "summary": "SORA's decentralized and trustless cross-chain bridge that enables secure asset transfers between Ethereum and SORA networks. HASHI uses cryptographic proofs to validate transac…",
    "definition": "SORA's decentralized and trustless cross-chain bridge that enables secure asset transfers between Ethereum and SORA networks. HASHI uses cryptographic proofs to validate transactions across chains, allowing users to move ERC-20 tokens between Ethereum and SORA mainnet without centralized intermediaries. The bridge is integrated with Polkaswap for seamless cross-chain trading.",
    "aliases": [
      "HASHI"
    ],
    "relatedTags": [
      "cross-chain",
      "bridges",
      "interoperability",
      "ethereum",
      "erc-20",
      "polkaswap",
      "trustless"
    ],
    "seeAlso": [
      "Cross-chain",
      "Bridges",
      "Interoperability",
      "Ethereum",
      "ERC-20",
      "Polkaswap",
      "Trustless"
    ],
    "examples": [
      "ETH to SORA transfers",
      "ERC-20 token bridging",
      "Cross-chain trading",
      "Decentralized asset movement"
    ],
    "links": [
      {
        "label": "Adding Tokens to HASHI Bridge",
        "url": "https://wiki.sora.org/adding-tokens-to-hashi-bridge.html"
      },
      {
        "label": "How to Use HASHI Bridge",
        "url": "https://medium.com/polkaswap-community-collective/how-to-use-the-hashi-bridge-eb69e88bc87"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/hashi"
  },
  "citizenship": {
    "slug": "citizenship",
    "title": "Citizenship",
    "type": "term",
    "category": "governance",
    "summary": "A status in the SORA Parliament governance system where individuals become citizens by posting XOR bonds. Citizens are randomly selected through sortition to participate in vari…",
    "definition": "A status in the SORA Parliament governance system where individuals become citizens by posting XOR bonds. Citizens are randomly selected through sortition to participate in various governance bodies and make decisions about XOR allocation to productive projects.",
    "aliases": [
      "Citizenship"
    ],
    "relatedTags": [
      "sora parliament",
      "xor",
      "sortition",
      "governance",
      "bond"
    ],
    "seeAlso": [
      "SORA Parliament",
      "XOR",
      "Sortition",
      "Governance",
      "Bond"
    ],
    "examples": [
      "XOR bond posting",
      "Random selection participation",
      "Governance body membership"
    ],
    "links": [
      {
        "label": "SORA Parliament",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/citizenship"
  },
  "xyk-pools": {
    "slug": "xyk-pools",
    "title": "XYK Pools",
    "type": "term",
    "category": "defi",
    "summary": "Constant Product Market Maker (CPMM) liquidity pools where the product of two token reserves remains constant (x * y = k). These are the primary liquidity pools on Polkaswap whe…",
    "definition": "Constant Product Market Maker (CPMM) liquidity pools where the product of two token reserves remains constant (x * y = k). These are the primary liquidity pools on Polkaswap where users can provide liquidity and earn PSWAP rewards through yield farming.",
    "aliases": [
      "XYK Pools"
    ],
    "relatedTags": [
      "polkaswap",
      "liquidity pool",
      "yield farming",
      "pswap",
      "constant product"
    ],
    "seeAlso": [
      "Polkaswap",
      "Liquidity Pool",
      "Yield Farming",
      "PSWAP",
      "Constant Product"
    ],
    "examples": [
      "ETH/PSWAP pool",
      "XOR/VAL pool",
      "Liquidity provision"
    ],
    "links": [
      {
        "label": "Polkaswap Liquidity",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/xyk-pools"
  },
  "financial-inclusion": {
    "slug": "financial-inclusion",
    "title": "Financial Inclusion",
    "type": "term",
    "category": "economics",
    "summary": "The principle of providing access to financial services to individuals and businesses who are excluded from traditional banking. CBDC implementations like Cambodia's Bakong prom…",
    "definition": "The principle of providing access to financial services to individuals and businesses who are excluded from traditional banking. CBDC implementations like Cambodia's Bakong promote financial inclusion by providing digital payment infrastructure to underserved populations.",
    "aliases": [
      "Financial Inclusion"
    ],
    "relatedTags": [
      "cbdc",
      "digital payments",
      "banking access",
      "underserved populations"
    ],
    "seeAlso": [
      "CBDC",
      "Digital Payments",
      "Banking Access",
      "Underserved Populations"
    ],
    "examples": [
      "Bakong digital payments",
      "Mobile banking access",
      "Rural financial services"
    ],
    "links": [
      {
        "label": "CBDC Development",
        "url": "https://www.japanpolicyforum.jp/economy/pt2024041523151814191.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/financial-inclusion"
  },
  "cross-border-payments": {
    "slug": "cross-border-payments",
    "title": "Cross-border Payments",
    "type": "term",
    "category": "economics",
    "summary": "Financial transactions between parties in different countries. CBDC implementations like Bakong enable faster, cheaper, and more efficient cross-border remittances by using bloc…",
    "definition": "Financial transactions between parties in different countries. CBDC implementations like Bakong enable faster, cheaper, and more efficient cross-border remittances by using blockchain technology to reduce intermediaries and settlement times.",
    "aliases": [
      "Cross-border Payments"
    ],
    "relatedTags": [
      "cbdc",
      "remittances",
      "international transfer",
      "blockchain"
    ],
    "seeAlso": [
      "CBDC",
      "Remittances",
      "International Transfer",
      "Blockchain"
    ],
    "examples": [
      "Bakong remittances",
      "International transfers",
      "Reduced settlement times"
    ],
    "links": [
      {
        "label": "CBDC Development",
        "url": "https://www.japanpolicyforum.jp/economy/pt2024041523151814191.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/cross-border-payments"
  },
  "economic-conditions": {
    "slug": "economic-conditions",
    "title": "Economic Conditions",
    "type": "term",
    "category": "economics",
    "summary": "Market factors and economic indicators that influence token supply and demand. In SORA's elastic supply model, the Token Bonding Curve responds to economic conditions by adjusti…",
    "definition": "Market factors and economic indicators that influence token supply and demand. In SORA's elastic supply model, the Token Bonding Curve responds to economic conditions by adjusting XOR supply - expanding during growth periods and contracting during decline to maintain price stability.",
    "aliases": [
      "Economic Conditions"
    ],
    "relatedTags": [
      "elastic supply",
      "token bonding curve",
      "price stability",
      "market conditions"
    ],
    "seeAlso": [
      "Elastic Supply",
      "Token Bonding Curve",
      "Price Stability",
      "Market Conditions"
    ],
    "examples": [
      "Growth periods",
      "Economic decline",
      "Market volatility"
    ],
    "links": [
      {
        "label": "SORA Tokenomics",
        "url": "https://wiki.sora.org/tokenomics.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/economic-conditions"
  },
  "parallel-processing": {
    "slug": "parallel-processing",
    "title": "Parallel Processing",
    "type": "term",
    "category": "technology",
    "summary": "The ability to process multiple transactions simultaneously across different blockchain networks. Polkadot parachains enable parallel processing by allowing multiple parachains …",
    "definition": "The ability to process multiple transactions simultaneously across different blockchain networks. Polkadot parachains enable parallel processing by allowing multiple parachains to process transactions in parallel, significantly increasing overall network throughput compared to sequential processing.",
    "aliases": [
      "Parallel Processing"
    ],
    "relatedTags": [
      "parachain",
      "polkadot",
      "throughput",
      "scalability"
    ],
    "seeAlso": [
      "Parachain",
      "Polkadot",
      "Throughput",
      "Scalability"
    ],
    "examples": [
      "Simultaneous transactions",
      "Increased throughput",
      "Network scalability"
    ],
    "links": [
      {
        "label": "Polkadot Parachains",
        "url": "https://wiki.polkadot.com/learn/learn-parachains/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/parallel-processing"
  },
  "token-burning": {
    "slug": "token-burning",
    "title": "Token Burning",
    "type": "term",
    "category": "economics",
    "summary": "The permanent removal of tokens from circulation by sending them to an unrecoverable address. In SORA, token burning is used as a deflationary mechanism - VAL tokens are burned …",
    "definition": "The permanent removal of tokens from circulation by sending them to an unrecoverable address. In SORA, token burning is used as a deflationary mechanism - VAL tokens are burned on every network transaction, and PSWAP tokens are burned on every Polkaswap transaction to reduce supply over time.",
    "aliases": [
      "Token Burning"
    ],
    "relatedTags": [
      "val",
      "pswap",
      "deflationary",
      "supply reduction",
      "scarcity"
    ],
    "seeAlso": [
      "VAL",
      "PSWAP",
      "Deflationary",
      "Supply Reduction",
      "Scarcity"
    ],
    "examples": [
      "VAL transaction burning",
      "PSWAP swap burning",
      "Supply reduction"
    ],
    "links": [
      {
        "label": "SORA Tokenomics",
        "url": "https://wiki.sora.org/tokenomics.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/token-burning"
  },
  "price-stability": {
    "slug": "price-stability",
    "title": "Price Stability",
    "type": "term",
    "category": "economics",
    "summary": "The maintenance of relatively stable token prices over time through economic mechanisms. SORA's Token Bonding Curve maintains XOR price stability by automatically adjusting supp…",
    "definition": "The maintenance of relatively stable token prices over time through economic mechanisms. SORA's Token Bonding Curve maintains XOR price stability by automatically adjusting supply based on market conditions - expanding supply during price increases and contracting during price decreases.",
    "aliases": [
      "Price Stability"
    ],
    "relatedTags": [
      "elastic supply",
      "token bonding curve",
      "economic conditions",
      "supply management"
    ],
    "seeAlso": [
      "Elastic Supply",
      "Token Bonding Curve",
      "Economic Conditions",
      "Supply Management"
    ],
    "examples": [
      "Automatic supply adjustment",
      "Price stabilization",
      "Market response"
    ],
    "links": [
      {
        "label": "SORA Tokenomics",
        "url": "https://wiki.sora.org/tokenomics.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/price-stability"
  },
  "soramitsu": {
    "slug": "soramitsu",
    "title": "SORAMITSU",
    "type": "term",
    "category": "network",
    "summary": "A Japanese fintech company that develops blockchain infrastructure and digital identity solutions. SORAMITSU is the company behind the SORA network and has implemented successfu…",
    "definition": "A Japanese fintech company that develops blockchain infrastructure and digital identity solutions. SORAMITSU is the company behind the SORA network and has implemented successful CBDC projects including Cambodia's Bakong and Lao CBDC pilot.",
    "aliases": [
      "SORAMITSU"
    ],
    "relatedTags": [
      "sora network",
      "cbdc",
      "bakong",
      "hyperledger iroha",
      "blockchain infrastructure"
    ],
    "seeAlso": [
      "SORA Network",
      "CBDC",
      "Bakong",
      "Hyperledger Iroha",
      "Blockchain Infrastructure"
    ],
    "examples": [
      "SORA network development",
      "Bakong CBDC implementation",
      "Digital identity solutions"
    ],
    "links": [
      {
        "label": "SORAMITSU Website",
        "url": "https://soramitsu.co.jp/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/soramitsu"
  },
  "polkadot": {
    "slug": "polkadot",
    "title": "Polkadot",
    "type": "term",
    "category": "network",
    "summary": "A heterogeneous multi-chain network that enables different blockchains to transfer messages and value in a trust-free fashion. Polkadot provides shared security, cross-chain int…",
    "definition": "A heterogeneous multi-chain network that enables different blockchains to transfer messages and value in a trust-free fashion. Polkadot provides shared security, cross-chain interoperability, and parallel processing through its relay chain and parachain architecture.",
    "aliases": [
      "Polkadot"
    ],
    "relatedTags": [
      "parachain",
      "relay chain",
      "xcm",
      "shared security",
      "cross-chain",
      "substrate"
    ],
    "seeAlso": [
      "Parachain",
      "Relay Chain",
      "XCM",
      "Shared Security",
      "Cross-chain",
      "Substrate"
    ],
    "examples": [
      "Multi-chain network",
      "Parachain ecosystem",
      "Cross-chain interoperability"
    ],
    "links": [
      {
        "label": "Polkadot Network",
        "url": "https://polkadot.network/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/polkadot"
  },
  "dex": {
    "slug": "dex",
    "title": "DEX",
    "type": "term",
    "category": "defi",
    "summary": "Decentralized Exchange - a cryptocurrency exchange that operates without a central authority, allowing users to trade directly with each other through smart contracts. Polkaswap…",
    "definition": "Decentralized Exchange - a cryptocurrency exchange that operates without a central authority, allowing users to trade directly with each other through smart contracts. Polkaswap is SORA's DEX that provides cross-chain trading and liquidity aggregation.",
    "aliases": [
      "DEX"
    ],
    "relatedTags": [
      "polkaswap",
      "liquidity pool",
      "trading",
      "cross-chain",
      "smart contracts"
    ],
    "seeAlso": [
      "Polkaswap",
      "Liquidity Pool",
      "Trading",
      "Cross-chain",
      "Smart Contracts"
    ],
    "examples": [
      "Polkaswap trading",
      "Decentralized token swaps",
      "Liquidity provision"
    ],
    "links": [
      {
        "label": "Polkaswap DEX",
        "url": "https://polkaswap.io"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/dex"
  },
  "xcm": {
    "slug": "xcm",
    "title": "XCM",
    "type": "term",
    "category": "technology",
    "summary": "Cross-Consensus Messaging - a messaging format that allows different consensus systems to communicate with each other. XCM enables interoperability between parachains in the Pol…",
    "definition": "Cross-Consensus Messaging - a messaging format that allows different consensus systems to communicate with each other. XCM enables interoperability between parachains in the Polkadot ecosystem, allowing SORA to communicate with other parachains.",
    "aliases": [
      "XCM"
    ],
    "relatedTags": [
      "polkadot",
      "parachain",
      "cross-chain",
      "interoperability",
      "consensus"
    ],
    "seeAlso": [
      "Polkadot",
      "Parachain",
      "Cross-chain",
      "Interoperability",
      "Consensus"
    ],
    "examples": [
      "Parachain communication",
      "Cross-chain messaging",
      "Multi-chain interoperability"
    ],
    "links": [
      {
        "label": "XCM Documentation",
        "url": "https://wiki.polkadot.network/docs/learn-crosschain"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/xcm"
  },
  "defi": {
    "slug": "defi",
    "title": "DeFi",
    "type": "term",
    "category": "defi",
    "summary": "Decentralized Finance - financial services built on blockchain networks that operate without traditional financial intermediaries. SORA provides DeFi services through Polkaswap …",
    "definition": "Decentralized Finance - financial services built on blockchain networks that operate without traditional financial intermediaries. SORA provides DeFi services through Polkaswap for trading, yield farming, and liquidity provision.",
    "aliases": [
      "DeFi"
    ],
    "relatedTags": [
      "polkaswap",
      "yield farming",
      "liquidity pool",
      "dex",
      "smart contracts"
    ],
    "seeAlso": [
      "Polkaswap",
      "Yield Farming",
      "Liquidity Pool",
      "DEX",
      "Smart Contracts"
    ],
    "examples": [
      "Decentralized trading",
      "Yield farming",
      "Liquidity provision",
      "Automated market making"
    ],
    "links": [
      {
        "label": "SORA DeFi",
        "url": "https://polkaswap.io"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/defi"
  },
  "amm": {
    "slug": "amm",
    "title": "AMM",
    "type": "term",
    "category": "defi",
    "summary": "Automated Market Maker - a protocol that uses mathematical formulas to price assets and provide liquidity automatically. Polkaswap uses AMM technology combined with liquidity ag…",
    "definition": "Automated Market Maker - a protocol that uses mathematical formulas to price assets and provide liquidity automatically. Polkaswap uses AMM technology combined with liquidity aggregation to provide efficient trading with reduced impermanent loss.",
    "aliases": [
      "AMM"
    ],
    "relatedTags": [
      "polkaswap",
      "liquidity pool",
      "impermanent loss",
      "xyk pools",
      "trading"
    ],
    "seeAlso": [
      "Polkaswap",
      "Liquidity Pool",
      "Impermanent Loss",
      "XYK Pools",
      "Trading"
    ],
    "examples": [
      "Automated pricing",
      "Constant product formula",
      "Liquidity provision automation"
    ],
    "links": [
      {
        "label": "Polkaswap AMM",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/amm"
  },
  "bakong": {
    "slug": "bakong",
    "title": "Bakong",
    "type": "term",
    "category": "economics",
    "summary": "Cambodia's national digital payment system built on blockchain technology by SORAMITSU. Bakong is one of the most successful CBDC implementations, with over 20 million users and…",
    "definition": "Cambodia's national digital payment system built on blockchain technology by SORAMITSU. Bakong is one of the most successful CBDC implementations, with over 20 million users and $70 billion in transactions, demonstrating the potential of blockchain-based digital currencies.",
    "aliases": [
      "Bakong"
    ],
    "relatedTags": [
      "cbdc",
      "soramitsu",
      "digital currency",
      "financial inclusion",
      "cross-border payments"
    ],
    "seeAlso": [
      "CBDC",
      "SORAMITSU",
      "Digital Currency",
      "Financial Inclusion",
      "Cross-border Payments"
    ],
    "examples": [
      "National digital payments",
      "20+ million users",
      "$70B in transactions",
      "Financial inclusion"
    ],
    "links": [
      {
        "label": "Bakong White Paper",
        "url": "https://bakong.nbc.gov.kh/download/NBC_BAKONG_White_Paper.pdf"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/bakong"
  },
  "kusd": {
    "slug": "kusd",
    "title": "KUSD",
    "type": "term",
    "category": "token",
    "summary": "Kensetsu USD (KUSD) is an over-collateralized, algorithmically governed stablecoin built on the SORA network, pegged to the US Dollar. Built on the Kensetsu Platform (SORA's ver…",
    "definition": "Kensetsu USD (KUSD) is an over-collateralized, algorithmically governed stablecoin built on the SORA network, pegged to the US Dollar. Built on the Kensetsu Platform (SORA's version of MakerDAO), KUSD facilitates secure borrowing operations while maintaining its value through robust stability mechanisms. In SORA v3 tokenomics, KUSD is used to pay builders instead of XOR. To maintain the KUSD peg, 19.5% of all SORA network transaction fees are allocated for buyback and burning of KUSD. Users can create vaults, deposit collateral (XOR, VAL, PSWAP, TBCD, ETH, or DAI), and borrow KUSD against their collateral.",
    "aliases": [
      "KUSD"
    ],
    "relatedTags": [
      "sora economy",
      "stable asset",
      "kensetsu",
      "makerdao",
      "builders",
      "funding",
      "over-collateralized",
      "vault",
      "tbcd",
      "sora v3"
    ],
    "seeAlso": [
      "SORA Economy",
      "Stable Asset",
      "Kensetsu",
      "MakerDAO",
      "Builders",
      "Funding",
      "Over-collateralized",
      "Vault",
      "TBCD",
      "SORA v3"
    ],
    "examples": [
      "Builder funding in SORA v3",
      "Stable value borrowing",
      "Over-collateralized lending",
      "Vault creation and management"
    ],
    "links": [
      {
        "label": "SORA Wiki - KUSD",
        "url": "https://wiki.sora.org/kusd.html"
      },
      {
        "label": "Kensetsu Vaults",
        "url": "https://wiki.sora.org/kensetsu-vaults.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/kusd"
  },
  "tbcd": {
    "slug": "tbcd",
    "title": "TBCD",
    "type": "term",
    "category": "token",
    "summary": "Token Bonding Curve Dollar (TBCD) is an algorithmic, non-synthetic stablecoin whose value is maintained by the SORA token bonding curve at approximately $1 USD. TBCD is converti…",
    "definition": "Token Bonding Curve Dollar (TBCD) is an algorithmic, non-synthetic stablecoin whose value is maintained by the SORA token bonding curve at approximately $1 USD. TBCD is convertible to XOR as a reserve asset of the token bonding curve and helps build up reserves while also being used to fund the creation of new goods and services via on-chain governance. In SORA v3 tokenomics, 0.5% of all network transaction fees are allocated for buyback and burning of TBCD. TBCD can only be created and allocated by on-chain governance, meaning XOR token holders decide the supply.",
    "aliases": [
      "TBCD"
    ],
    "relatedTags": [
      "token bonding curve",
      "stable asset",
      "xor",
      "reserve asset",
      "on-chain governance",
      "sora v3",
      "kusd"
    ],
    "seeAlso": [
      "Token Bonding Curve",
      "Stable Asset",
      "XOR",
      "Reserve Asset",
      "On-chain Governance",
      "SORA v3",
      "KUSD"
    ],
    "examples": [
      "Builder funding via governance",
      "Token bonding curve reserves",
      "Stable value asset",
      "On-chain referendum allocation"
    ],
    "links": [
      {
        "label": "SORA Wiki - TBCD",
        "url": "https://wiki.sora.org/tbcd.html"
      },
      {
        "label": "Token Bonding Curve",
        "url": "https://wiki.sora.org/tbc.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/tbcd"
  },
  "ts": {
    "slug": "ts",
    "title": "TS",
    "type": "term",
    "category": "token",
    "summary": "The native token of TONSWAP, a decentralized exchange and launchpad built on The Open Network (TON) blockchain. TS powers platform governance, liquidity incentives, and transact…",
    "definition": "The native token of TONSWAP, a decentralized exchange and launchpad built on The Open Network (TON) blockchain. TS powers platform governance, liquidity incentives, and transaction fee models. A key feature is that 10% of all TONSWAP trading fees are automatically allocated through integrated smart-contract logic to buy back and burn XOR tokens, creating sustained on-chain demand and reducing XOR circulating supply. This mechanism aligns TON ecosystem activity with the SORA economy by turning trading volume into a recurring XOR sink, benefiting both TON and SORA ecosystems.",
    "aliases": [
      "TS"
    ],
    "relatedTags": [
      "tonswap",
      "ton",
      "xor",
      "dex",
      "governance",
      "liquidity",
      "deflationary",
      "cross-chain",
      "buyback-and-burn",
      "smart contract"
    ],
    "seeAlso": [
      "TONSWAP",
      "TON",
      "XOR",
      "DEX",
      "Governance",
      "Liquidity",
      "Deflationary",
      "Cross-chain",
      "Buyback-and-burn",
      "Smart Contract"
    ],
    "examples": [
      "Platform governance",
      "Liquidity incentives",
      "Automatic XOR buyback mechanism",
      "Transaction fee distribution",
      "On-chain XOR demand creation"
    ],
    "links": [
      {
        "label": "TONSWAP Website",
        "url": "https://tonswap.org/"
      },
      {
        "label": "TONSWAP Roadmap",
        "url": "https://tonswap.org/roadmap"
      },
      {
        "label": "TONSWAP FAQ",
        "url": "https://tonswap.org/faq"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/ts"
  },
  "relay-chain": {
    "slug": "relay-chain",
    "title": "Relay Chain",
    "type": "term",
    "category": "network",
    "summary": "The central chain of the Polkadot network that provides security, consensus, and cross-chain interoperability for all connected parachains. The relay chain coordinates the entir…",
    "definition": "The central chain of the Polkadot network that provides security, consensus, and cross-chain interoperability for all connected parachains. The relay chain coordinates the entire network and enables shared security across all parachains.",
    "aliases": [
      "Relay Chain"
    ],
    "relatedTags": [
      "polkadot",
      "parachain",
      "shared security",
      "consensus",
      "cross-chain"
    ],
    "seeAlso": [
      "Polkadot",
      "Parachain",
      "Shared Security",
      "Consensus",
      "Cross-chain"
    ],
    "examples": [
      "Network coordination",
      "Shared security provision",
      "Consensus mechanism"
    ],
    "links": [
      {
        "label": "Polkadot Relay Chain",
        "url": "https://wiki.polkadot.network/docs/learn-architecture"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/relay-chain"
  },
  "shared-security": {
    "slug": "shared-security",
    "title": "Shared Security",
    "type": "term",
    "category": "network",
    "summary": "A security model where multiple blockchains share the same validator set and consensus mechanism. Polkadot's shared security allows parachains like SORA to benefit from the secu…",
    "definition": "A security model where multiple blockchains share the same validator set and consensus mechanism. Polkadot's shared security allows parachains like SORA to benefit from the security of the entire network without maintaining their own validator set.",
    "aliases": [
      "Shared Security"
    ],
    "relatedTags": [
      "polkadot",
      "relay chain",
      "parachain",
      "security",
      "validators"
    ],
    "seeAlso": [
      "Polkadot",
      "Relay Chain",
      "Parachain",
      "Security",
      "Validators"
    ],
    "examples": [
      "Network-wide security",
      "Validator sharing",
      "Reduced security costs"
    ],
    "links": [
      {
        "label": "Polkadot Security",
        "url": "https://wiki.polkadot.network/docs/learn-security"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/shared-security"
  },
  "sora-v2": {
    "slug": "sora-v2",
    "title": "SORA v2",
    "type": "term",
    "category": "network",
    "summary": "The current version of the SORA network built on Substrate framework as a Polkadot parachain. SORA v2 provides DeFi services, cross-chain functionality, and serves as the founda…",
    "definition": "The current version of the SORA network built on Substrate framework as a Polkadot parachain. SORA v2 provides DeFi services, cross-chain functionality, and serves as the foundation for the upcoming SORA v3 migration to Hyperledger Iroha.",
    "aliases": [
      "SORA v2"
    ],
    "relatedTags": [
      "substrate",
      "polkadot",
      "parachain",
      "sora v3",
      "hyperledger iroha"
    ],
    "seeAlso": [
      "Substrate",
      "Polkadot",
      "Parachain",
      "SORA v3",
      "Hyperledger Iroha"
    ],
    "examples": [
      "Current SORA network",
      "Substrate-based",
      "Polkadot parachain"
    ],
    "links": [
      {
        "label": "SORA Network",
        "url": "https://sora.org/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/sora-v2"
  },
  "governance": {
    "slug": "governance",
    "title": "Governance",
    "type": "term",
    "category": "governance",
    "summary": "The system of decision-making and rule enforcement in blockchain networks. SORA v2 currently uses Polkadot v1 Governance (also called Governance V1), which consists of a Council…",
    "definition": "The system of decision-making and rule enforcement in blockchain networks. SORA v2 currently uses Polkadot v1 Governance (also called Governance V1), which consists of a Council, Technical Committee, and Parliament with on-chain proposals and referenda. The future SORA Parliament will implement sortition-based democracy with random citizen selection, moving toward a hybrid DAO framework in SORA v3.",
    "aliases": [
      "Governance"
    ],
    "relatedTags": [
      "sora parliament",
      "polkadot governance",
      "governance v1",
      "democracy",
      "referendum",
      "council",
      "sortition"
    ],
    "seeAlso": [
      "SORA Parliament",
      "Polkadot Governance",
      "Governance V1",
      "Democracy",
      "Referendum",
      "Council",
      "Sortition"
    ],
    "examples": [
      "Network upgrades",
      "Parameter changes",
      "Project funding",
      "Policy decisions",
      "On-chain proposals"
    ],
    "links": [
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/governance"
  },
  "democracy": {
    "slug": "democracy",
    "title": "Democracy",
    "type": "term",
    "category": "governance",
    "summary": "A governance system where decisions are made through collective participation. SORA implements democratic governance through referendum voting in the current system and will use…",
    "definition": "A governance system where decisions are made through collective participation. SORA implements democratic governance through referendum voting in the current system and will use sortition-based democracy in the SORA Parliament, ensuring fair representation without plutocracy.",
    "aliases": [
      "Democracy"
    ],
    "relatedTags": [
      "sora parliament",
      "referendum",
      "sortition",
      "citizenship",
      "governance"
    ],
    "seeAlso": [
      "SORA Parliament",
      "Referendum",
      "Sortition",
      "Citizenship",
      "Governance"
    ],
    "examples": [
      "Referendum voting",
      "Sortition selection",
      "Citizen participation",
      "Fair representation"
    ],
    "links": [
      {
        "label": "SORA Democracy",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/democracy"
  },
  "sora-council": {
    "slug": "sora-council",
    "title": "SORA Council",
    "type": "term",
    "category": "governance",
    "summary": "A governance body in SORA's current Polkadot v1 governance system that consists of elected members who can propose referenda and veto dangerous proposals. The council plays a ke…",
    "definition": "A governance body in SORA's current Polkadot v1 governance system that consists of elected members who can propose referenda and veto dangerous proposals. The council plays a key role in the governance process before transitioning to the SORA Parliament.",
    "aliases": [
      "SORA Council"
    ],
    "relatedTags": [
      "polkadot governance",
      "referendum",
      "council motion",
      "governance",
      "democracy"
    ],
    "seeAlso": [
      "Polkadot Governance",
      "Referendum",
      "Council Motion",
      "Governance",
      "Democracy"
    ],
    "examples": [
      "Proposal vetting",
      "Referendum initiation",
      "Governance oversight"
    ],
    "links": [
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/sora-council"
  },
  "council-motion": {
    "slug": "council-motion",
    "title": "Council Motion",
    "type": "term",
    "category": "governance",
    "summary": "A proposal submitted by the SORA Council in the current governance system. When a council motion is approved, it triggers a Democracy Referendum where token holders can vote on …",
    "definition": "A proposal submitted by the SORA Council in the current governance system. When a council motion is approved, it triggers a Democracy Referendum where token holders can vote on the proposal, enabling community participation in governance decisions.",
    "aliases": [
      "Council Motion"
    ],
    "relatedTags": [
      "sora council",
      "referendum",
      "democracy",
      "governance",
      "proposals"
    ],
    "seeAlso": [
      "SORA Council",
      "Referendum",
      "Democracy",
      "Governance",
      "Proposals"
    ],
    "examples": [
      "Council proposals",
      "Referendum triggers",
      "Governance participation"
    ],
    "links": [
      {
        "label": "SORA Governance",
        "url": "https://wiki.sora.org/sora-governance.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/council-motion"
  },
  "polkadot-governance": {
    "slug": "polkadot-governance",
    "title": "Polkadot Governance",
    "type": "term",
    "category": "governance",
    "summary": "The governance system used by Polkadot and its parachains. SORA v2 uses Polkadot v1 Governance (also called Governance V1), which features council-based proposals, referendum vo…",
    "definition": "The governance system used by Polkadot and its parachains. SORA v2 uses Polkadot v1 Governance (also called Governance V1), which features council-based proposals, referendum voting, and technical committee oversight. This differs from Polkadot OpenGov, which SORA does not currently use. Governance V1 provides a robust framework for network decision-making with predictable proposal cycles.",
    "aliases": [
      "Polkadot Governance"
    ],
    "relatedTags": [
      "sora council",
      "referendum",
      "democracy",
      "governance",
      "governance v1",
      "polkadot",
      "opengov"
    ],
    "seeAlso": [
      "SORA Council",
      "Referendum",
      "Democracy",
      "Governance",
      "Governance V1",
      "Polkadot",
      "OpenGov"
    ],
    "examples": [
      "Council elections",
      "Referendum voting",
      "Technical upgrades",
      "On-chain proposals"
    ],
    "links": [
      {
        "label": "Polkadot Governance",
        "url": "https://wiki.polkadot.network/docs/learn-governance"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/polkadot-governance"
  },
  "liquidity": {
    "slug": "liquidity",
    "title": "Liquidity",
    "type": "term",
    "category": "defi",
    "summary": "The availability of assets for trading without significantly affecting their price. In SORA's ecosystem, liquidity is provided through Polkaswap's aggregated pools, enabling eff…",
    "definition": "The availability of assets for trading without significantly affecting their price. In SORA's ecosystem, liquidity is provided through Polkaswap's aggregated pools, enabling efficient trading with reduced slippage and better price discovery.",
    "aliases": [
      "Liquidity"
    ],
    "relatedTags": [
      "polkaswap",
      "liquidity pool",
      "trading",
      "slippage",
      "price discovery"
    ],
    "seeAlso": [
      "Polkaswap",
      "Liquidity Pool",
      "Trading",
      "Slippage",
      "Price Discovery"
    ],
    "examples": [
      "Pool liquidity provision",
      "Trading efficiency",
      "Price stability"
    ],
    "links": [
      {
        "label": "Polkaswap Liquidity",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/liquidity"
  },
  "trading-fees": {
    "slug": "trading-fees",
    "title": "Trading Fees",
    "type": "term",
    "category": "defi",
    "summary": "Charges applied to trading transactions on decentralized exchanges. In SORA, trading fees on Polkaswap are used for various purposes including PSWAP buyback-and-burn (0.3%), val…",
    "definition": "Charges applied to trading transactions on decentralized exchanges. In SORA, trading fees on Polkaswap are used for various purposes including PSWAP buyback-and-burn (0.3%), validator rewards, and network maintenance.",
    "aliases": [
      "Trading Fees"
    ],
    "relatedTags": [
      "polkaswap",
      "pswap",
      "buyback-and-burn",
      "validators",
      "trading"
    ],
    "seeAlso": [
      "Polkaswap",
      "PSWAP",
      "Buyback-and-burn",
      "Validators",
      "Trading"
    ],
    "examples": [
      "Transaction charges",
      "Fee distribution",
      "Network maintenance"
    ],
    "links": [
      {
        "label": "Polkaswap Trading",
        "url": "https://wiki.sora.org/polkaswap.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/trading-fees"
  },
  "consensus": {
    "slug": "consensus",
    "title": "Consensus",
    "type": "term",
    "category": "network",
    "summary": "The mechanism by which blockchain networks agree on the validity of transactions and maintain a consistent state. SORA v2 uses Substrate-based consensus mechanisms (NPoS - Nomin…",
    "definition": "The mechanism by which blockchain networks agree on the validity of transactions and maintain a consistent state. SORA v2 uses Substrate-based consensus mechanisms (NPoS - Nominated Proof of Stake). SORA v3 will use Byzantine Fault Tolerance (BFT) consensus derived from Hyperledger Iroha 3's architecture, providing high-throughput transaction processing with deterministic finality, making it suitable for enterprise applications and CBDCs.",
    "aliases": [
      "Consensus",
      "Consensus Mechanisms",
      "consensus mechanisms"
    ],
    "relatedTags": [
      "validator",
      "security",
      "bft consensus",
      "byzantine fault tolerance",
      "substrate",
      "hyperledger iroha",
      "npos",
      "sora v2",
      "sora v3"
    ],
    "seeAlso": [
      "Validator",
      "Security",
      "BFT Consensus",
      "Byzantine Fault Tolerance",
      "Substrate",
      "Hyperledger Iroha",
      "NPoS",
      "SORA v2",
      "SORA v3"
    ],
    "examples": [
      "Transaction validation",
      "State agreement",
      "Network security",
      "Deterministic finality"
    ],
    "links": [
      {
        "label": "SORA Consensus",
        "url": "https://wiki.sora.org/consensus.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/consensus"
  },
  "security": {
    "slug": "security",
    "title": "Security",
    "type": "term",
    "category": "network",
    "summary": "The protection of blockchain networks against attacks and malicious behavior. SORA implements multiple security layers including validator-based consensus, shared security throu…",
    "definition": "The protection of blockchain networks against attacks and malicious behavior. SORA implements multiple security layers including validator-based consensus, shared security through Polkadot, and cryptographic protection mechanisms.",
    "aliases": [
      "Security"
    ],
    "relatedTags": [
      "validator",
      "consensus",
      "shared security",
      "cryptography",
      "network protection"
    ],
    "seeAlso": [
      "Validator",
      "Consensus",
      "Shared Security",
      "Cryptography",
      "Network Protection"
    ],
    "examples": [
      "Attack prevention",
      "Data integrity",
      "Network stability"
    ],
    "links": [
      {
        "label": "SORA Security",
        "url": "https://wiki.sora.org/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/security"
  },
  "rewards": {
    "slug": "rewards",
    "title": "Rewards",
    "type": "term",
    "category": "defi",
    "summary": "Incentives distributed to network participants for contributing to network operations. In SORA, rewards include VAL tokens for validators and stakers, PSWAP tokens for liquidity…",
    "definition": "Incentives distributed to network participants for contributing to network operations. In SORA, rewards include VAL tokens for validators and stakers, PSWAP tokens for liquidity providers, and XOR allocations for productive projects through governance.",
    "aliases": [
      "Rewards"
    ],
    "relatedTags": [
      "validator",
      "staking",
      "pswap",
      "yield farming",
      "governance"
    ],
    "seeAlso": [
      "Validator",
      "Staking",
      "PSWAP",
      "Yield Farming",
      "Governance"
    ],
    "examples": [
      "Validator rewards",
      "Staking incentives",
      "Liquidity provider rewards"
    ],
    "links": [
      {
        "label": "SORA Rewards",
        "url": "https://wiki.sora.org/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/rewards"
  },
  "blockchain": {
    "slug": "blockchain",
    "title": "Blockchain",
    "type": "term",
    "category": "technology",
    "summary": "A distributed ledger technology that maintains a continuously growing list of records secured using cryptography. SORA operates on blockchain technology, currently using Substra…",
    "definition": "A distributed ledger technology that maintains a continuously growing list of records secured using cryptography. SORA operates on blockchain technology, currently using Substrate framework and transitioning to Hyperledger Iroha for enhanced enterprise capabilities.",
    "aliases": [
      "Blockchain"
    ],
    "relatedTags": [
      "distributed ledger",
      "cryptography",
      "substrate",
      "hyperledger iroha",
      "decentralization"
    ],
    "seeAlso": [
      "Distributed Ledger",
      "Cryptography",
      "Substrate",
      "Hyperledger Iroha",
      "Decentralization"
    ],
    "examples": [
      "Transaction records",
      "Decentralized storage",
      "Cryptographic security"
    ],
    "links": [
      {
        "label": "Blockchain Technology",
        "url": "https://en.wikipedia.org/wiki/Blockchain"
      },
      {
        "label": "Hyperledger Iroha",
        "url": "https://soramitsu.co.jp/iroha"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/blockchain"
  },
  "sora-card": {
    "slug": "sora-card",
    "title": "SORA Card",
    "type": "term",
    "category": "defi",
    "summary": "A decentralized debit card that allows users to spend their cryptocurrency in the real world. The SORA Card bridges the gap between digital assets and traditional commerce, enab…",
    "definition": "A decentralized debit card that allows users to spend their cryptocurrency in the real world. The SORA Card bridges the gap between digital assets and traditional commerce, enabling users to make purchases at any merchant that accepts card payments while maintaining the benefits of decentralized finance.",
    "aliases": [
      "SORA Card"
    ],
    "relatedTags": [
      "xor",
      "polkaswap",
      "decentralized finance",
      "real-world payments",
      "cryptocurrency"
    ],
    "seeAlso": [
      "XOR",
      "Polkaswap",
      "Decentralized Finance",
      "Real-world Payments",
      "Cryptocurrency"
    ],
    "examples": [
      "Online purchases",
      "Point-of-sale transactions",
      "ATM withdrawals",
      "International payments"
    ],
    "links": [
      {
        "label": "SORA Card Documentation",
        "url": "https://wiki.sora.org/sora-card.html"
      },
      {
        "label": "SORA Card KYC Tutorial",
        "url": "https://wiki.sora.org/sora-card-kyc-tutorial.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/sora-card"
  },
  "monetary-systems": {
    "slug": "monetary-systems",
    "title": "Monetary Systems",
    "type": "term",
    "category": "economics",
    "summary": "The rules, infrastructure, and institutions that govern how money is created, distributed, and used. SORA aims to build a supranational monetary system that replaces legacy intermediaries with algorithmic policy enforced by the token bonding curve.",
    "definition": "Monetary systems define how currency is issued, how value flows through an economy, and how stability is maintained. The SORA network applies a supranational monetary design in which XOR supply, lending, and spending are coordinated by on-chain governance and the token bonding curve instead of central banks, enabling borderless value exchange.",
    "aliases": ["Monetary Systems", "monetary system", "Monetary System"],
    "relatedTags": ["token bonding curve", "redenomination", "economic governance", "elastic supply", "price stability"],
    "seeAlso": ["Token Bonding Curve", "Redenomination", "Elastic Supply", "Economic Governance", "Price Stability"],
    "links": [
      {
        "label": "SORA Economic Vision",
        "url": "https://soranauts.com/sora-blockchain-new-world-economic-order"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/monetary-systems"
  },
  "token-repackaging": {
    "slug": "token-repackaging",
    "title": "Token Repackaging",
    "type": "term",
    "category": "economics",
    "summary": "An initiative in the SORA roadmap to migrate legacy assets into a simplified portfolio of utility, reward, and stable tokens that align with the SORA v3 economic model.",
    "definition": "Token repackaging consolidates historical SORA and Polkaswap assets into a streamlined set of instruments—XOR for settlement, VAL for validator rewards, PSWAP for liquidity incentives, and new stable instruments such as TBCD. The program retires illiquid or redundant tokens, migrates balances, and funds ecosystem development through governance-approved conversions.",
    "aliases": ["Token Repackaging"],
    "relatedTags": ["redenomination", "tokenomics", "XOR", "PSWAP", "VAL"],
    "seeAlso": ["Redenomination", "Tokenomics", "XOR", "PSWAP", "VAL"],
    "links": [
      {
        "label": "SORA Token Repackaging Brief",
        "url": "https://soranauts.com/sora-roadmap-token-repackaging-hub-chain-defi-upgrades"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/token-repackaging"
  },
  "redenomination": {
    "slug": "redenomination",
    "title": "Redenomination",
    "type": "term",
    "category": "economics",
    "summary": "The process of adjusting token denominations without changing total value. SORA redenominated XOR in 2020 to improve usability and align token supply with long-term monetary policy.",
    "definition": "Redenomination changes the nominal unit of account by splitting or combining circulating supply while preserving proportional ownership. SORA implemented a 1:100 XOR redenomination coordinated through on-chain governance to simplify pricing, rebalance treasury reserves, and prepare for the token bonding curve monetary system.",
    "aliases": ["Redenomination"],
    "relatedTags": ["monetary systems", "token repackaging", "elastic supply", "tokenomics"],
    "seeAlso": ["Monetary Systems", "Token Repackaging", "Elastic Supply", "Tokenomics"],
    "links": [
      {
        "label": "Understanding the XOR Token Supply",
        "url": "https://soranauts.com/sora-xor-token-supply-explained"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/redenomination"
  },
  "bokolo-cash": {
    "slug": "bokolo-cash",
    "title": "Bokolo Cash",
    "type": "term",
    "category": "economics",
    "summary": "The Central Bank of Solomon Islands' digital currency pilot developed by SORAMITSU. Bokolo Cash demonstrates how SORA technology powers retail CBDCs with mobile-first payments.",
    "definition": "Bokolo Cash is a CBDC project launched by the Central Bank of Solomon Islands and SORAMITSU. It uses SORA technology to deliver secure wallets, point-of-sale integrations, and compliance workflows that make digital currency available to citizens and merchants without traditional banking infrastructure.",
    "aliases": ["Bokolo Cash"],
    "relatedTags": ["solomon islands", "cbdc", "mobile payments", "qr payments", "soramitsu"],
    "seeAlso": ["Solomon Islands", "CBDC", "Mobile Payments", "QR Payments", "SORAMITSU"],
    "links": [
      {
        "label": "Soramitsu CBDC Pilot",
        "url": "https://soranauts.com/soramitsu-pilots-central-bank-of-solomon-islands-cbdc"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/bokolo-cash"
  },
  "solomon-islands": {
    "slug": "solomon-islands",
    "title": "Solomon Islands",
    "type": "term",
    "category": "economics",
    "summary": "A Pacific Island nation partnering with SORAMITSU to pilot Bokolo Cash and explore SORA-powered financial infrastructure.",
    "definition": "The Solomon Islands collaborate with SORAMITSU on Bokolo Cash and broader digital financial services. The partnership showcases how SORA technology can deliver CBDCs, merchant tools, and cross-border remittances for emerging markets with limited legacy banking infrastructure.",
    "aliases": ["Solomon Islands"],
    "relatedTags": ["bokolo cash", "cbdc", "mobile payments", "financial inclusion", "soramitsu"],
    "seeAlso": ["Bokolo Cash", "CBDC", "Mobile Payments", "Financial Inclusion", "SORAMITSU"],
    "links": [
      {
        "label": "Solomon Islands CBDC Overview",
        "url": "https://soranauts.com/soras-leap-transforming-apac-with-cbdcs-and-savings-bonds"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/solomon-islands"
  },
  "mobile-payments": {
    "slug": "mobile-payments",
    "title": "Mobile Payments",
    "type": "term",
    "category": "defi",
    "summary": "Transactions initiated from smartphones or tablets using NFC, QR codes, or in-app wallets. SORA Card and Bokolo Cash rely on mobile-first experiences to extend financial access.",
    "definition": "Mobile payments enable users to initiate and accept transactions directly from mobile devices. In the SORA ecosystem, mobile payments power SORA Card spending, Bokolo Cash CBDC transfers, and retail experiences that do not require traditional point-of-sale terminals.",
    "aliases": ["Mobile Payments"],
    "relatedTags": ["sora card", "bokolo cash", "qr payments", "financial inclusion", "digital currency"],
    "seeAlso": ["SORA Card", "Bokolo Cash", "QR Payments", "Financial Inclusion", "Digital Currency"],
    "links": [
      {
        "label": "SORA Card Overview",
        "url": "https://wiki.sora.org/sora-card.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/mobile-payments"
  },
  "qr-payments": {
    "slug": "qr-payments",
    "title": "QR Payments",
    "type": "term",
    "category": "defi",
    "summary": "Payments completed by scanning a Quick Response (QR) code. QR flows are widely used in SORA Card pilots and CBDC deployments to provide low-cost merchant acceptance.",
    "definition": "QR payments encode payment instructions in a scannable code that can be read by mobile devices. They remove the need for specialized hardware, letting SORA Card users and CBDC pilots like Bokolo Cash settle transactions instantly while retaining on-chain auditability.",
    "aliases": ["QR Payments", "QR payment"],
    "relatedTags": ["mobile payments", "sora card", "bokolo cash", "financial inclusion"],
    "seeAlso": ["Mobile Payments", "SORA Card", "Bokolo Cash", "Financial Inclusion"],
    "links": [
      {
        "label": "SORA Card FAQ",
        "url": "https://wiki.sora.org/sora-card.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/qr-payments"
  },
  "asset-tokenization": {
    "slug": "asset-tokenization",
    "title": "Asset Tokenization",
    "type": "term",
    "category": "economics",
    "summary": "The process of issuing blockchain-based tokens that represent ownership of real-world or digital assets. SORA leverages tokenization to bring commodities, currencies, and projects on-chain.",
    "definition": "Asset tokenization converts claims on physical or financial assets into programmable tokens. In SORA, tokenization is used to represent real-world assets, raise capital for new ventures, and create liquidity by listing these tokens on Polkaswap or other DeFi applications.",
    "aliases": ["Asset Tokenization"],
    "relatedTags": ["real-world assets", "tokenization", "chainlink", "defi"],
    "seeAlso": ["Real-World Assets", "Tokenization", "Chainlink", "DeFi"],
    "links": [
      {
        "label": "Guide to Asset Tokenization",
        "url": "https://soranauts.com/the-ultimate-guide-to-asset-tokenization-in-crypto-and-blockchain"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/asset-tokenization"
  },
  "real-world-assets": {
    "slug": "real-world-assets",
    "title": "Real-World Assets",
    "type": "term",
    "category": "economics",
    "summary": "Physical or traditional financial assets represented on-chain, such as commodities, invoices, or government bonds. Tokenizing RWAs expands Polkaswap liquidity and supports SORA's economic initiatives.",
    "definition": "Real-world assets (RWAs) are tangible or regulated assets that become programmable once they are tokenized. SORA uses RWAs to collateralize stable instruments, fund infrastructure projects, and provide transparent reporting to stakeholders.",
    "aliases": ["Real-World Assets", "RWA", "real world assets"],
    "relatedTags": ["asset tokenization", "tokenization", "chainlink", "defi"],
    "seeAlso": ["Asset Tokenization", "Tokenization", "Chainlink", "DeFi"],
    "links": [
      {
        "label": "RWA Opportunities on SORA",
        "url": "https://soranauts.com/soras-leap-transforming-apac-with-cbdcs-and-savings-bonds"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/real-world-assets"
  },
  "chainlink": {
    "slug": "chainlink",
    "title": "Chainlink",
    "type": "term",
    "category": "technology",
    "summary": "A decentralized oracle network that provides tamper-resistant data feeds and automation services to smart contracts. SORA integrates Chainlink oracles to bridge real-world data for DeFi and RWA products.",
    "definition": "Chainlink delivers cryptographic proofs and reliable data to smart contracts. On SORA, Chainlink price feeds and automation support Polkaswap trading pairs, collateral monitoring for tokenized assets, and cross-chain messaging for enterprise integrations.",
    "aliases": ["Chainlink"],
    "relatedTags": ["asset tokenization", "real-world assets", "defi", "oracles"],
    "seeAlso": ["Asset Tokenization", "Real-World Assets", "DeFi", "Oracles"],
    "links": [
      {
        "label": "Chainlink Official Site",
        "url": "https://chain.link/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/chainlink"
  },
  "tokenization": {
    "slug": "tokenization",
    "title": "Tokenization",
    "type": "term",
    "category": "economics",
    "summary": "The conversion of rights to an asset into a digital token on a blockchain. Tokenization underpins SORA's strategy of turning real-world economic activity into programmable, composable assets.",
    "definition": "Tokenization abstracts ownership or utility into blockchain-based tokens that can be traded, fractionally owned, or used as collateral. It is a foundational capability for SORA's knowledge base, enabling CBDCs, RWAs, and incentive programs to interoperate within the Polkaswap ecosystem.",
    "aliases": ["Tokenization"],
    "relatedTags": ["asset tokenization", "real-world assets", "chainlink", "defi"],
    "seeAlso": ["Asset Tokenization", "Real-World Assets", "Chainlink", "DeFi"],
    "links": [
      {
        "label": "Tokenization Explained",
        "url": "https://soranauts.com/the-ultimate-guide-to-asset-tokenization-in-crypto-and-blockchain"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/tokenization"
  },
  "crypto-market-cycles": {
    "slug": "crypto-market-cycles",
    "title": "Crypto Market Cycles",
    "type": "term",
    "category": "economics",
    "summary": "Recurring bull and bear phases observed in cryptocurrency markets. Understanding cycles informs staking, liquidity, and treasury decisions in the SORA ecosystem.",
    "definition": "Crypto market cycles describe periods of expansion and contraction driven by macro events, liquidity, and investor sentiment. SORA tracks these cycles to plan token issuance, liquidity incentives, and treasury diversification so that builders can deploy capital efficiently.",
    "aliases": ["Crypto Market Cycles"],
    "relatedTags": ["trading strategy", "market timing", "tokenomics", "defi"],
    "seeAlso": ["Trading Strategy", "Market Timing", "Tokenomics", "DeFi"],
    "links": [
      {
        "label": "Understanding Crypto Bull Markets",
        "url": "https://soranauts.com/understanding-crypto-bull-markets-patterns-triggers-and-psychology"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/crypto-market-cycles"
  },
  "trading-strategy": {
    "slug": "trading-strategy",
    "title": "Trading Strategy",
    "type": "term",
    "category": "economics",
    "summary": "A framework for entering and exiting markets to achieve risk-adjusted returns. Polkaswap traders use strategies to balance liquidity mining, arbitrage, and long-term positioning.",
    "definition": "Trading strategies outline rules for portfolio allocation, order placement, and risk management. In SORA, strategies can combine Polkaswap swaps, liquidity provision, and staking to capture yield while supporting ecosystem liquidity.",
    "aliases": ["Trading Strategy"],
    "relatedTags": ["market timing", "crypto market cycles", "liquidity", "defi"],
    "seeAlso": ["Market Timing", "Crypto Market Cycles", "Liquidity", "DeFi"],
    "links": [
      {
        "label": "Polkaswap Trading Tips",
        "url": "https://soranauts.com/best-decentralized-exchanges-dexs"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/trading-strategy"
  },
  "market-timing": {
    "slug": "market-timing",
    "title": "Market Timing",
    "type": "term",
    "category": "economics",
    "summary": "Deciding when to buy or sell assets based on cycle analysis or signals. Market timing impacts SORA treasury operations and individual liquidity decisions.",
    "definition": "Market timing attempts to anticipate price movements to optimize entry and exit points. SORA's governance and community track macro cycles, on-chain metrics, and liquidity flows to decide when to expand or contract incentives, execute buybacks, or deploy capital.",
    "aliases": ["Market Timing"],
    "relatedTags": ["crypto market cycles", "trading strategy", "tokenomics", "treasury"],
    "seeAlso": ["Crypto Market Cycles", "Trading Strategy", "Tokenomics", "Treasury"],
    "links": [
      {
        "label": "Timing the Crypto Market",
        "url": "https://soranauts.com/timing-the-crypto-market-insights-into-bull-cycles"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/market-timing"
  },
  "dogecoin": {
    "slug": "dogecoin",
    "title": "Dogecoin (DOGE)",
    "type": "term",
    "category": "economics",
    "summary": "A meme-inspired cryptocurrency that helped popularize community-driven token launches. Soranauts track Dogecoin to compare community culture, volatility, and meme coin mechanics with SORA-native projects.",
    "definition": "Dogecoin is a proof-of-work cryptocurrency that began as a meme and grew into a large community economy. Within Soranauts coverage, DOGE is analyzed to highlight how meme coins influence trading behavior, liquidity cycles, and cultural adoption—context that informs SORA initiatives like SOSHIBA.",
    "aliases": [
      "Dogecoin",
      "DOGE"
    ],
    "relatedTags": [
      "meme coins",
      "volatility",
      "blockchain culture",
      "trading strategy"
    ],
    "seeAlso": [
      "SOSHIBA",
      "Pepe",
      "Bonk",
      "Volatility"
    ],
    "links": [
      {
        "label": "Meme Coins vs Traditional Crypto",
        "url": "https://soranauts.com/meme-coins-vs-traditional-crypto"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/dogecoin"
  },
  "shiba-inu": {
    "slug": "shiba-inu",
    "title": "Shiba Inu (SHIB)",
    "type": "term",
    "category": "economics",
    "summary": "An Ethereum-based meme coin ecosystem that showcases community-led token launches, DeFi spin-offs, and extreme volatility. Soranauts reference SHIB when comparing meme coin strategies to SORA's token design.",
    "definition": "Shiba Inu is a meme coin and DeFi ecosystem built on Ethereum. Its rapid growth, NFT integrations, and DAO experiments provide lessons for SORA on community incentives, liquidity programs, and messaging. The project is often contrasted with SORA-native initiatives in Soranauts research.",
    "aliases": [
      "Shiba Inu",
      "SHIB"
    ],
    "relatedTags": [
      "meme coins",
      "volatility",
      "blockchain culture",
      "tokenomics"
    ],
    "seeAlso": [
      "Dogecoin (DOGE)",
      "Pepe",
      "Bonk",
      "SOSHIBA"
    ],
    "links": [
      {
        "label": "Meme Coins vs Traditional Crypto",
        "url": "https://soranauts.com/meme-coins-vs-traditional-crypto"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/shiba-inu"
  },
  "pepe": {
    "slug": "pepe",
    "title": "Pepe (PEPE)",
    "type": "term",
    "category": "economics",
    "summary": "A viral meme coin that highlights capital flows chasing internet culture narratives. Soranauts track PEPE to understand speculative cycles impacting Polkaswap liquidity.",
    "definition": "Pepe is an Ethereum meme coin that surged in 2023, demonstrating how quickly capital moves toward recognizable cultural icons. The Soranauts knowledge base documents PEPE to explain liquidity churn, volatility management, and how SORA can harness culture-driven demand responsibly.",
    "aliases": [
      "Pepe",
      "PEPE"
    ],
    "relatedTags": [
      "meme coins",
      "volatility",
      "blockchain culture"
    ],
    "seeAlso": [
      "Dogecoin (DOGE)",
      "Shiba Inu (SHIB)",
      "Bonk",
      "SOSHIBA"
    ],
    "links": [
      {
        "label": "Meme Coins vs Traditional Crypto",
        "url": "https://soranauts.com/meme-coins-vs-traditional-crypto"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/pepe"
  },
  "bonk": {
    "slug": "bonk",
    "title": "Bonk (BONK)",
    "type": "term",
    "category": "economics",
    "summary": "A Solana-based meme coin used as a case study for ecosystem marketing, community rewards, and airdrop distribution. Soranauts reference BONK when evaluating incentive design for SORA ecosystem tokens.",
    "definition": "Bonk is a meme coin native to the Solana network that launched with a large community airdrop. Its rapid integration into wallets, NFT projects, and merchant pilots provides lessons for SORA builders on distribution mechanics and the risks of speculative mania.",
    "aliases": [
      "Bonk",
      "BONK"
    ],
    "relatedTags": [
      "meme coins",
      "volatility",
      "blockchain culture",
      "tokenomics"
    ],
    "seeAlso": [
      "SOSHIBA",
      "Dogecoin (DOGE)",
      "Shiba Inu (SHIB)",
      "Pepe"
    ],
    "links": [
      {
        "label": "Meme Coins vs Traditional Crypto",
        "url": "https://soranauts.com/meme-coins-vs-traditional-crypto"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/bonk"
  },
  "volatility": {
    "slug": "volatility",
    "title": "Volatility",
    "type": "term",
    "category": "economics",
    "summary": "The rate at which asset prices fluctuate. Volatility impacts SORA's treasury planning, liquidity incentives, and meme coin risk management.",
    "definition": "Volatility measures the magnitude of price changes over time. Soranauts coverage explains how volatility affects Polkaswap liquidity, staking yields, and treasury operations. Strategies like dollar-cost averaging, hedging, and adaptive liquidity incentives are discussed to navigate volatile markets.",
    "aliases": [
      "Volatility"
    ],
    "relatedTags": [
      "crypto market cycles",
      "trading strategy",
      "market timing",
      "risk management"
    ],
    "seeAlso": [
      "Crypto Market Cycles",
      "Trading Strategy",
      "Market Timing",
      "SOSHIBA"
    ],
    "links": [
      {
        "label": "Timing the Crypto Market",
        "url": "https://soranauts.com/timing-the-crypto-market-insights-into-bull-cycles"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/volatility"
  },
  "soshiba": {
    "slug": "soshiba",
    "title": "SOSHIBA",
    "type": "term",
    "category": "economics",
    "summary": "A SORA-native meme coin experiment that channels community energy into educational content and liquidity bootstrapping on Polkaswap.",
    "definition": "SOSHIBA is a community-driven meme coin launched within the SORA ecosystem. It is used to experiment with airdrops, liquidity mining, and social campaigns while promoting financial literacy. Soranauts track SOSHIBA to document best practices for responsible meme coin launches in the SORA community.",
    "aliases": [
      "SOSHIBA"
    ],
    "relatedTags": [
      "meme coins",
      "Polkaswap",
      "community",
      "volatility"
    ],
    "seeAlso": [
      "Dogecoin (DOGE)",
      "Shiba Inu (SHIB)",
      "Pepe",
      "Bonk"
    ],
    "links": [
      {
        "label": "Meme Coins vs Traditional Crypto",
        "url": "https://soranauts.com/meme-coins-vs-traditional-crypto"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/soshiba"
  },
  "blockchain-culture": {
    "slug": "blockchain-culture",
    "title": "Blockchain Culture",
    "type": "term",
    "category": "technology",
    "summary": "The shared values, memes, and narratives that shape how blockchain communities build products and coordinate capital. Soranauts examine culture to explain adoption patterns in the SORA ecosystem.",
    "definition": "Blockchain culture encompasses the memes, stories, rituals, and social norms that influence how decentralized communities operate. Understanding culture helps Soranauts forecast user behavior, design community incentives, and translate SORA's mission to new audiences.",
    "aliases": [
      "Blockchain Culture"
    ],
    "relatedTags": [
      "meme coins",
      "community",
      "SORA ecosystem"
    ],
    "seeAlso": [
      "SOSHIBA",
      "Dogecoin (DOGE)",
      "Shiba Inu (SHIB)",
      "Bonk"
    ],
    "links": [
      {
        "label": "Meme Coins vs Traditional Crypto",
        "url": "https://soranauts.com/meme-coins-vs-traditional-crypto"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/blockchain-culture"
  },
  "blockchain-architecture": {
    "slug": "blockchain-architecture",
    "title": "Blockchain Architecture",
    "type": "term",
    "category": "technology",
    "summary": "The technical structure that defines how blockchain components interact—consensus, networking, execution, and data availability. Soranauts evaluate architecture choices when comparing Substrate and Hyperledger Iroha.",
    "definition": "Blockchain architecture describes how a network is engineered, including runtime modules, consensus layers, networking protocols, and upgrade paths. Soranauts analyze architectures like Polkadot's heterogeneous shards and SORA v3's Hyperledger Iroha stack to understand scalability, security, and product roadmap implications.",
    "aliases": [
      "Blockchain Architecture"
    ],
    "relatedTags": [
      "Polkadot",
      "Hyperledger Iroha",
      "rollups",
      "asynchronous backing",
      "coretime"
    ],
    "seeAlso": [
      "Polkadot",
      "Hyperledger Iroha",
      "Rollups",
      "Asynchronous Backing",
      "Coretime"
    ],
    "links": [
      {
        "label": "Polkadot Architecture Guide",
        "url": "https://soranauts.com/polkadot-architecture-guide"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/blockchain-architecture"
  },
  "kusama": {
    "slug": "kusama",
    "title": "Kusama",
    "type": "term",
    "category": "network",
    "summary": "Polkadot's canary network used for rapid experimentation with parachains, governance upgrades, and economic features. Kusama informed SORA's early integrations and governance strategy.",
    "definition": "Kusama is a scalable, multi-chain network that mirrors Polkadot but moves at a faster pace with looser governance parameters. Soranauts documentation references Kusama to explain historical SORA parachain slots, bridge experiments, and governance learnings that feed into SORA v3.",
    "aliases": [
      "Kusama"
    ],
    "relatedTags": [
      "parachains",
      "crowdloans",
      "auctions",
      "XCMP",
      "OpenGov"
    ],
    "seeAlso": [
      "Polkadot",
      "Parachain",
      "Crowdloans",
      "Auctions",
      "XCMP"
    ],
    "links": [
      {
        "label": "Polkadot & Kusama Parachains",
        "url": "https://soranauts.com/polkadot-kusama-parachains"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/kusama"
  },
  "xcmp": {
    "slug": "xcmp",
    "title": "XCMP",
    "type": "term",
    "category": "technology",
    "summary": "Cross-Chain Message Passing (XCMP) is the protocol Polkadot uses for parachains to talk to each other. It underpins interoperability strategies relevant to SORA bridges.",
    "definition": "XCMP lets Polkadot parachains send messages and assets without going through the relay chain, reducing latency and fees. Soranauts cover XCMP to explain how SORA integrates with Polkadot-era infrastructure and how future Hyperledger Iroha bridges will maintain interoperability.",
    "aliases": [
      "XCMP"
    ],
    "relatedTags": [
      "parachains",
      "Polkadot",
      "interoperability",
      "coretime"
    ],
    "seeAlso": [
      "Parachain",
      "Polkadot",
      "Coretime",
      "Asynchronous Backing"
    ],
    "links": [
      {
        "label": "What Are Polkadot Parachains?",
        "url": "https://soranauts.com/what-are-polkadot-parachains-scalability-shared-security-and-xcm"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/xcmp"
  },
  "coretime": {
    "slug": "coretime",
    "title": "Coretime",
    "type": "term",
    "category": "technology",
    "summary": "Coretime represents the compute resource that Polkadot sells to parachains. Tracking coretime helps Soranauts explain how SORA evaluates slot access and future interoperability.",
    "definition": "Polkadot commoditizes parachain execution capacity as coretime. Projects can purchase coretime in bulk or on-demand to run their logic. Soranauts analyze coretime markets to understand how SORA and partner parachains plan deployment schedules and budgeting.",
    "aliases": [
      "Coretime"
    ],
    "relatedTags": [
      "parachains",
      "agile coretime",
      "auctions",
      "slot leases"
    ],
    "seeAlso": [
      "Agile Coretime",
      "Parachain",
      "Auctions",
      "Slot Leases"
    ],
    "links": [
      {
        "label": "Polkadot & Kusama Parachains",
        "url": "https://soranauts.com/polkadot-kusama-parachains"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/coretime"
  },
  "asynchronous-backing": {
    "slug": "asynchronous-backing",
    "title": "Asynchronous Backing",
    "type": "term",
    "category": "technology",
    "summary": "A Polkadot upgrade that increases parachain throughput by decoupling validation stages. Soranauts track the feature to gauge scalability for SORA integrations.",
    "definition": "Asynchronous backing allows validators to process parachain blocks in overlapping stages, dramatically boosting TPS and reducing latency. The Soranauts knowledge base explains how this upgrade impacts SORA-linked parachains and future Hyperledger Iroha bridges.",
    "aliases": [
      "Asynchronous Backing"
    ],
    "relatedTags": [
      "parachains",
      "coretime",
      "agile coretime",
      "Polkadot"
    ],
    "seeAlso": [
      "Coretime",
      "Agile Coretime",
      "Parachain",
      "Polkadot"
    ],
    "links": [
      {
        "label": "Polkadot Architecture Guide",
        "url": "https://soranauts.com/polkadot-architecture-guide"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/asynchronous-backing"
  },
  "auctions": {
    "slug": "auctions",
    "title": "Parachain Auctions",
    "type": "term",
    "category": "governance",
    "summary": "Parachain slot auctions let projects compete for coretime on Polkadot by bonding DOT or KSM. Soranauts document auctions to explain how SORA secured historical parachain access.",
    "definition": "Auctions are Candle-style events where DOT or KSM is bonded to win parachain slots. Soranauts track auction results, strategies, and crowdloan participation to illustrate the economics of connecting SORA to Polkadot and Kusama.",
    "aliases": [
      "Parachain Auctions",
      "auctions"
    ],
    "relatedTags": [
      "crowdloans",
      "slot leases",
      "coretime",
      "Polkadot"
    ],
    "seeAlso": [
      "Crowdloans",
      "Slot Leases",
      "Polkadot",
      "Kusama"
    ],
    "links": [
      {
        "label": "Polkadot & Kusama Parachains",
        "url": "https://soranauts.com/polkadot-kusama-parachains"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/auctions"
  },
  "crowdloans": {
    "slug": "crowdloans",
    "title": "Crowdloans",
    "type": "term",
    "category": "governance",
    "summary": "Crowdloans allow communities to bond DOT or KSM to support parachain auction bids in exchange for rewards. Soranauts reference crowdloans when detailing SORA's historical Polkadot participation.",
    "definition": "Crowdloans pool tokens from supporters to back a project's parachain auction bid. Contributors receive their stake back after the lease plus rewards from the project. Soranauts document crowdloan strategies as part of the SORA ecosystem governance narrative.",
    "aliases": [
      "Crowdloans"
    ],
    "relatedTags": [
      "auctions",
      "Polkadot",
      "Kusama",
      "slot leases"
    ],
    "seeAlso": [
      "Auctions",
      "Polkadot",
      "Kusama",
      "Slot Leases"
    ],
    "links": [
      {
        "label": "Polkadot & Kusama Parachains",
        "url": "https://soranauts.com/polkadot-kusama-parachains"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/crowdloans"
  },
  "parathreads": {
    "slug": "parathreads",
    "title": "Parathreads",
    "type": "term",
    "category": "technology",
    "summary": "Pay-as-you-go parachain slots on Polkadot and Kusama. Parathreads offer flexible access to coretime before committing to a full lease, relevant for SORA partners testing integrations.",
    "definition": "Parathreads share coretime on demand and pay per block. They allow projects to test workloads or run small services without winning an auction. Soranauts coverage notes parathreads as a stepping stone for SORA-aligned builders exploring Polkadot connectivity.",
    "aliases": [
      "Parathreads"
    ],
    "relatedTags": [
      "parachains",
      "coretime",
      "agile coretime",
      "slot leases"
    ],
    "seeAlso": [
      "Parachain",
      "Coretime",
      "Agile Coretime",
      "Slot Leases"
    ],
    "links": [
      {
        "label": "Polkadot & Kusama Parachains",
        "url": "https://soranauts.com/polkadot-kusama-parachains"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/parathreads"
  },
  "forkless-upgrades": {
    "slug": "forkless-upgrades",
    "title": "Forkless Upgrades",
    "type": "term",
    "category": "technology",
    "summary": "Polkadot and Kusama support runtime upgrades without hard forks. Soranauts highlight this capability when discussing SORA governance and tooling expectations.",
    "definition": "Forkless upgrades allow Polkadot runtime changes to be enacted via governance without network disruption. This capability inspired SORA governance improvements and informs expectations for Hyperledger Iroha upgrades.",
    "aliases": [
      "Forkless Upgrades"
    ],
    "relatedTags": [
      "Polkadot",
      "Kusama",
      "governance",
      "runtime upgrades"
    ],
    "seeAlso": [
      "Polkadot",
      "Kusama",
      "Governance"
    ],
    "links": [
      {
        "label": "Polkadot & Kusama Parachains",
        "url": "https://soranauts.com/polkadot-kusama-parachains"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/forkless-upgrades"
  },
  "slot-leases": {
    "slug": "slot-leases",
    "title": "Slot Leases",
    "type": "term",
    "category": "economics",
    "summary": "Parachain slots are leased for fixed periods (up to 96 weeks on Polkadot). Soranauts track lease structures to analyze SORA deployment costs and timelines.",
    "definition": "Winning parachain auctions grants lease periods split into contiguous 12-week chunks. Projects must plan renewals or transition strategies before leases end. Soranauts documentation explains the financial planning required for SORA and partner parachains.",
    "aliases": [
      "Slot Leases"
    ],
    "relatedTags": [
      "auctions",
      "crowdloans",
      "coretime",
      "Polkadot"
    ],
    "seeAlso": [
      "Auctions",
      "Crowdloans",
      "Coretime",
      "Polkadot"
    ],
    "links": [
      {
        "label": "Polkadot & Kusama Parachains",
        "url": "https://soranauts.com/polkadot-kusama-parachains"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/slot-leases"
  },
  "rollups": {
    "slug": "rollups",
    "title": "Rollups",
    "type": "term",
    "category": "technology",
    "summary": "Rollups bundle transactions off-chain before submitting proofs on-chain. Soranauts compare rollups with SORA v3 architecture when discussing scalability approaches.",
    "definition": "Rollups are a scaling technique where execution happens off-chain, with compressed proofs posted on-chain for security. Soranauts documentation references rollups to evaluate external ecosystems and highlight why SORA focuses on Hyperledger Iroha with deterministic BFT execution.",
    "aliases": [
      "Rollups"
    ],
    "relatedTags": [
      "scalability",
      "blockchain architecture",
      "Polkadot",
      "Hyperledger Iroha"
    ],
    "seeAlso": [
      "Blockchain Architecture",
      "Polkadot",
      "Hyperledger Iroha"
    ],
    "links": [
      {
        "label": "Polkadot Architecture Guide",
        "url": "https://soranauts.com/polkadot-architecture-guide"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/rollups"
  },
  "agile-coretime": {
    "slug": "agile-coretime",
    "title": "Agile Coretime",
    "type": "term",
    "category": "economics",
    "summary": "A marketplace model where Polkadot sells coretime in flexible chunks, allowing projects to acquire execution capacity dynamically. Soranauts track agile coretime developments for future SORA interoperability planning.",
    "definition": "Agile coretime introduces programmatic sales of Polkadot execution resources, complementing auctions and crowdloans. The Soranauts knowledge base monitors this system to advise SORA builders on leasing strategies and cost forecasting.",
    "aliases": [
      "Agile Coretime"
    ],
    "relatedTags": [
      "coretime",
      "parachains",
      "auctions",
      "slot leases"
    ],
    "seeAlso": [
      "Coretime",
      "Parachain",
      "Auctions",
      "Slot Leases"
    ],
    "links": [
      {
        "label": "Polkadot & Kusama Parachains",
        "url": "https://soranauts.com/polkadot-kusama-parachains"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/agile-coretime"
  },
  "blockchain-economics": {
    "slug": "blockchain-economics",
    "title": "Blockchain Economics",
    "type": "term",
    "category": "economics",
    "summary": "The study of how blockchain incentives, monetary policy, and governance interact to produce sustainable networks. Soranauts analyze blockchain economics to articulate SORA's supranational design.",
    "definition": "Blockchain economics covers token supply, demand drivers, incentive alignment, and governance. Soranauts use the discipline to explain SORA's token bonding curve, treasury management, and ecosystem funding, comparing them with broader Web3 experiments.",
    "aliases": [
      "Blockchain Economics"
    ],
    "relatedTags": [
      "tokenomics",
      "monetary systems",
      "token repackaging",
      "elastic supply"
    ],
    "seeAlso": [
      "Monetary Systems",
      "Token Repackaging",
      "Elastic Supply",
      "Tokenomics"
    ],
    "links": [
      {
        "label": "SORA Blockchain: New World Economic Order",
        "url": "https://soranauts.com/sora-blockchain-new-world-economic-order"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/blockchain-economics"
  }
};

const findNodeByAlias = (value: string): TaxonomyNode | undefined => {
  const normalized = normalizeKey(value);
  return Object.values(baseTaxonomy).find((node) =>
    node.aliases?.some((alias) => normalizeKey(alias) === normalized),
  );
};

const tagGlossaryOverrides: Record<string, string> = {
  'bonding-curve': 'token-bonding-curve',
  'iroha3': 'hyperledger-iroha-3',
  'sora-card': 'sora-card',
  'token-repackaging': 'token-repackaging',
  'monetary-systems': 'monetary-systems',
  'redenomination': 'redenomination',
  'bokolo-cash': 'bokolo-cash',
  'solomon-islands': 'solomon-islands',
  'mobile-payments': 'mobile-payments',
  'qr-payments': 'qr-payments',
  'asset-tokenization': 'asset-tokenization',
  'real-world-assets': 'real-world-assets',
  'chainlink': 'chainlink',
  'tokenization': 'tokenization',
  'crypto-market-cycles': 'crypto-market-cycles',
  'trading-strategy': 'trading-strategy',
  'market-timing': 'market-timing',
  'parachains': 'parachain',
  'consensus-mechanisms': 'consensus',
};

const taxonomyWithTags: Record<string, TaxonomyNode> = { ...baseTaxonomy };

for (const node of Object.values(baseTaxonomy)) {
  const tags = new Set<string>(node.relatedTags ?? []);
  if (node.category) tags.add(node.category);

  for (const tag of tags) {
    const slug = toTagSlug(tag);
    if (taxonomyWithTags[slug]) {
      const existing = taxonomyWithTags[slug];
      if (!existing.glossaryRef && node.glossaryRef) {
        existing.glossaryRef = node.glossaryRef;
      }
      continue;
    }

    const possibleTermSlug = normalizeKey(tag).replace(/\s+/g, '-');
    const glossaryCandidate = baseTaxonomy[possibleTermSlug];

    taxonomyWithTags[slug] = {
      slug,
      title: humanize(tag),
      type: 'tag',
      aliases: Array.from(new Set([tag, humanize(tag), normalizeKey(tag)])).filter(Boolean),
      relatedTags: [],
      seeAlso: [],
      glossaryRef: glossaryCandidate?.glossaryRef ?? node.glossaryRef,
    };
  }
}

const externalTags: string[] = Array.isArray(tagsData?.tags) ? tagsData.tags : [];

for (const tag of externalTags) {
  const slug = toTagSlug(tag);
  if (taxonomyWithTags[slug]) continue;

  const normalizedTag = normalizeKey(tag);
  const possibleTermSlug = normalizedTag.replace(/\s+/g, '-');
  const overrideSlug = tagGlossaryOverrides[possibleTermSlug] ?? tagGlossaryOverrides[normalizedTag];
  const candidateSlug = overrideSlug ?? possibleTermSlug;
  const candidateNode =
    baseTaxonomy[candidateSlug] ??
    baseTaxonomy[possibleTermSlug] ??
    findNodeByAlias(tag) ??
    findNodeByAlias(candidateSlug);

  taxonomyWithTags[slug] = {
    slug,
    title: humanize(tag),
    type: 'tag',
    aliases: Array.from(new Set([tag, humanize(tag), normalizeKey(tag)])).filter(Boolean),
    relatedTags: [],
    seeAlso: [],
    glossaryRef: candidateNode?.glossaryRef,
  };
}

export const taxonomy: Record<string, TaxonomyNode> = taxonomyWithTags;
