// Unified taxonomy dataset for glossary terms, entities, versions, and tags.

import type { TagHubMetadataEntry } from './tag-hub.config';
type TagStatsEntry = {
  count: number;
  firstSeen?: string;
  lastSeen?: string;
};

async function importJson<T>(specifier: string): Promise<T> {
  // Node 25+ requires import attributes for JSON modules, while older toolchains
  // (and Vite/Astro) may handle JSON without them.
  try {
    const mod = await import(specifier, { with: { type: 'json' } } as unknown as undefined);
    return (mod as { default: T }).default;
  } catch {
    try {
      const mod = await import(specifier, { assert: { type: 'json' } } as unknown as undefined);
      return (mod as { default: T }).default;
    } catch {
      const mod = await import(specifier);
      return (mod as { default: T }).default;
    }
  }
}

const tagsData = await importJson<{ tags?: unknown }>('./taxonomy-tags.json');
const rawTagStats = await importJson<Record<string, TagStatsEntry>>('./tag-stats.json');
const tagStats = rawTagStats as Record<string, TagStatsEntry>;

// Node's ESM loader (including type-stripped TS execution) requires explicit extensions.
// Keep a dynamic import so bundlers can still resolve this module as usual.
const { tagHubMetadata } = await import('./tag-hub.config.ts');


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
  hub?: TagHubMetadataEntry;
  usageCount?: number;
  firstSeen?: string;
  lastSeen?: string;
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
      "iroha3"
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
  "iroha3": {
    "slug": "iroha3",
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
    "glossaryRef": "/glossary/iroha3"
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
        "label": "Polkaswap Wiki",
        "url": "https://wiki.sora.org/polkaswap.html"
      },
      {
        "label": "Polkaswap Exchange",
        "url": "https://polkaswap.io"
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
        "label": "TONSWAP FAQ",
        "url": "https://tonswap.org/faq"
      },
      {
        "label": "TONSWAP Roadmap",
        "url": "https://tonswap.org/roadmap"
      },
      {
        "label": "TONSWAP Website",
        "url": "https://tonswap.org/"
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
    "glossaryRef": "/glossary/bonding-curve"
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
    "glossaryRef": "/glossary/parliament"
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
        "label": "Palau Digital Bonds",
        "url": "https://soramitsu.co.jp/palau-digital-bonds"
      },
      {
        "label": "Bakong White Paper",
        "url": "https://bakong.nbc.gov.kh/download/NBC_BAKONG_White_Paper.pdf"
      },
      {
        "label": "CBDC Development in Asia-Pacific",
        "url": "https://www.japanpolicyforum.jp/economy/pt2024041523151814191.html"
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
    "glossaryRef": "/glossary/iroha3"
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
    "glossaryRef": "/glossary/hub-chain"
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
    "summary": "Iroha Special Instructions (ISIs) are the syscall surface that IVM smart contracts use to call into the host ledger in Hyperledger Iroha 3, enabling deterministic and metered operations.",
    "definition": "In Hyperledger Iroha 3, smart contracts execute as IVM bytecode and interact with the host ledger via the SCALL instruction; its immediate selects an Iroha Special Instruction (ISI). ISIs define the deterministic, metered operations available to contracts and governance logic, while the host/executor defines the exact semantics and gas costs. This syscall surface is the programmable interface used across SORA v3/Nexus for domain-specific behavior and governed automation.",
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
    "summary": "The platform token for TONSWAP, a decentralized exchange and launchpad on The Open Network (TON).",
    "definition": "TS grants governance rights and distributes incentives on TONSWAP, the TON-based DEX that integrates with SORA liquidity programs. Holders can participate in fee distribution and vote on protocol upgrades that affect listings and incentive schedules.",
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
        "label": "TONSWAP",
        "url": "https://tonswap.org/"
      },
      {
        "label": "TONSWAP Documentation",
        "url": "https://tonswap.org/roadmap"
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
    "glossaryRef": "/glossary/council"
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
        "label": "Hyperledger Iroha",
        "url": "https://soramitsu.co.jp/iroha"
      },
      {
        "label": "Blockchain Technology",
        "url": "https://en.wikipedia.org/wiki/Blockchain"
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
    "aliases": [
      "Monetary Systems",
      "monetary system",
      "Monetary System"
    ],
    "relatedTags": [
      "token bonding curve",
      "redenomination",
      "economic governance",
      "elastic supply",
      "price stability"
    ],
    "seeAlso": [
      "Token Bonding Curve",
      "Redenomination",
      "Elastic Supply",
      "Economic Governance",
      "Price Stability"
    ],
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
    "aliases": [
      "Token Repackaging"
    ],
    "relatedTags": [
      "redenomination",
      "tokenomics",
      "XOR",
      "PSWAP",
      "VAL"
    ],
    "seeAlso": [
      "Redenomination",
      "Tokenomics",
      "XOR",
      "PSWAP",
      "VAL"
    ],
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
    "aliases": [
      "Redenomination"
    ],
    "relatedTags": [
      "monetary systems",
      "token repackaging",
      "elastic supply",
      "tokenomics"
    ],
    "seeAlso": [
      "Monetary Systems",
      "Token Repackaging",
      "Elastic Supply",
      "Tokenomics"
    ],
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
    "aliases": [
      "Bokolo Cash"
    ],
    "relatedTags": [
      "solomon islands",
      "cbdc",
      "mobile payments",
      "qr payments",
      "soramitsu"
    ],
    "seeAlso": [
      "Solomon Islands",
      "CBDC",
      "Mobile Payments",
      "QR Payments",
      "SORAMITSU"
    ],
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
    "aliases": [
      "Solomon Islands"
    ],
    "relatedTags": [
      "bokolo cash",
      "cbdc",
      "mobile payments",
      "financial inclusion",
      "soramitsu"
    ],
    "seeAlso": [
      "Bokolo Cash",
      "CBDC",
      "Mobile Payments",
      "Financial Inclusion",
      "SORAMITSU"
    ],
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
    "aliases": [
      "Mobile Payments"
    ],
    "relatedTags": [
      "sora card",
      "bokolo cash",
      "qr payments",
      "financial inclusion",
      "digital currency"
    ],
    "seeAlso": [
      "SORA Card",
      "Bokolo Cash",
      "QR Payments",
      "Financial Inclusion",
      "Digital Currency"
    ],
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
    "aliases": [
      "QR Payments",
      "QR payment"
    ],
    "relatedTags": [
      "mobile payments",
      "sora card",
      "bokolo cash",
      "financial inclusion"
    ],
    "seeAlso": [
      "Mobile Payments",
      "SORA Card",
      "Bokolo Cash",
      "Financial Inclusion"
    ],
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
    "aliases": [
      "Asset Tokenization"
    ],
    "relatedTags": [
      "real-world assets",
      "tokenization",
      "chainlink",
      "defi"
    ],
    "seeAlso": [
      "Real-World Assets",
      "Tokenization",
      "Chainlink",
      "DeFi"
    ],
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
    "aliases": [
      "Real-World Assets",
      "RWA",
      "real world assets"
    ],
    "relatedTags": [
      "asset tokenization",
      "tokenization",
      "chainlink",
      "defi"
    ],
    "seeAlso": [
      "Asset Tokenization",
      "Tokenization",
      "Chainlink",
      "DeFi"
    ],
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
    "aliases": [
      "Chainlink"
    ],
    "relatedTags": [
      "asset tokenization",
      "real-world assets",
      "defi",
      "oracles"
    ],
    "seeAlso": [
      "Asset Tokenization",
      "Real-World Assets",
      "DeFi",
      "Oracles"
    ],
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
    "aliases": [
      "Tokenization"
    ],
    "relatedTags": [
      "asset tokenization",
      "real-world assets",
      "chainlink",
      "defi"
    ],
    "seeAlso": [
      "Asset Tokenization",
      "Real-World Assets",
      "Chainlink",
      "DeFi"
    ],
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
    "aliases": [
      "Crypto Market Cycles"
    ],
    "relatedTags": [
      "trading strategy",
      "market timing",
      "tokenomics",
      "defi"
    ],
    "seeAlso": [
      "Trading Strategy",
      "Market Timing",
      "Tokenomics",
      "DeFi"
    ],
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
    "aliases": [
      "Trading Strategy"
    ],
    "relatedTags": [
      "market timing",
      "crypto market cycles",
      "liquidity",
      "defi"
    ],
    "seeAlso": [
      "Market Timing",
      "Crypto Market Cycles",
      "Liquidity",
      "DeFi"
    ],
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
    "aliases": [
      "Market Timing"
    ],
    "relatedTags": [
      "crypto market cycles",
      "trading strategy",
      "tokenomics",
      "treasury"
    ],
    "seeAlso": [
      "Crypto Market Cycles",
      "Trading Strategy",
      "Tokenomics",
      "Treasury"
    ],
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
    "summary": "A proof-of-work cryptocurrency launched in 2013 as a Litecoin fork, known for its meme origins and community tipping culture.",
    "definition": "Dogecoin (DOGE) uses the Scrypt proof-of-work algorithm and has an uncapped supply that increases at a fixed rate to reward miners. It began as a meme experiment but today secures payments, tipping, and charity campaigns backed by an active open-source community.",
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
        "label": "Dogecoin Official Site",
        "url": "https://dogecoin.com/"
      },
      {
        "label": "Dogecoin Core Repository",
        "url": "https://github.com/dogecoin/dogecoin"
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
    "summary": "An ERC-20 meme token ecosystem launched in 2020 that includes SHIB, governance token BONE, and liquidity token LEASH.",
    "definition": "Shiba Inu (SHIB) is an Ethereum-based token that fuels a DeFi ecosystem of staking, governance, and NFT applications. Its community-run projects such as ShibaSwap and the Shibarium layer-2 network expand use cases beyond meme culture.",
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
        "label": "Shiba Inu Portal",
        "url": "https://www.shibatoken.com/"
      },
      {
        "label": "Shiba Inu Documentation",
        "url": "https://docs.shibatoken.com/"
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
    "summary": "An Ethereum meme token released in 2023 that demonstrates how rapidly community narratives can attract liquidity.",
    "definition": "PEPE is an ERC-20 token themed after the Pepe the Frog meme. It has no formal roadmap or presale and relies on community-led liquidity pools, illustrating the speculative dynamics that influence wider crypto markets.",
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
        "label": "PEPE Token on Etherscan",
        "url": "https://etherscan.io/token/0x6982508145454ce325ddbe47a25d4ec3d2311933"
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
    "summary": "A Solana-based meme token launched in 2022 that distributed a large airdrop to builders and NFT projects to revive Solana activity.",
    "definition": "BONK runs on the Solana blockchain and uses token airdrops, liquidity incentives, and NFT partnerships to encourage ecosystem engagement. It highlights how meme assets can accelerate network usage outside of SORA.",
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
        "label": "BONK Overview",
        "url": "https://bonkcoin.com/"
      },
      {
        "label": "BONK Token on Solscan",
        "url": "https://solscan.io/token/DezXkwLmNwjX1JdacoZ1DAEYBDH1dY9Y7JqeyK8G1g9w"
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
    "summary": "A measure of how widely an asset's price fluctuates over a period of time.",
    "definition": "Volatility quantifies price dispersion using metrics such as standard deviation or implied volatility from derivatives markets. Higher volatility signals greater uncertainty and risk, influencing position sizing and hedging decisions for SORA participants.",
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
        "label": "Market Volatility Explained",
        "url": "https://www.investopedia.com/terms/v/volatility.asp"
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
    "summary": "A community-launched meme token within the SORA ecosystem that experiments with gamified engagement and education.",
    "definition": "SOSHIBA was introduced to test lightweight incentive campaigns for the SORA community, including airdrops, social quests, and liquidity rewards. It provides a low-stakes environment for exploring meme-driven outreach while keeping treasury resources separate from core network assets.",
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
        "label": "Meme Coins vs. Traditional Crypto",
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
    "summary": "The shared narratives, rituals, and community norms that influence how blockchain networks grow and govern themselves.",
    "definition": "Blockchain culture covers memes, language, social coordination, and incentive structures that shape contributor behavior. Understanding culture helps projects design governance, communication, and incentive programs that resonate with their communities.",
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
        "label": "Harvard Business Review – What Blockchain Can Do",
        "url": "https://hbr.org/2017/01/the-truth-about-blockchain"
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
    "summary": "The design of blockchain components, including consensus, networking, data storage, and execution layers.",
    "definition": "Blockchain architecture defines how nodes reach consensus, manage state, and upgrade over time. Reference models such as Substrate or Hyperledger Iroha separate the runtime, networking, and application layers to support modular upgrades and interoperability.",
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
        "label": "Hyperledger Iroha Docs",
        "url": "https://docs.iroha.tech/"
      },
      {
        "label": "Polkadot Technology Overview",
        "url": "https://polkadot.network/technology/"
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
    "summary": "A canary network for Polkadot that runs the same codebase with faster governance and higher risk tolerance.",
    "definition": "Kusama provides a live environment for testing upgrades, parachain deployments, and economic experiments before they reach Polkadot. It offers shared security, staking, and governance mechanisms that closely mirror the Polkadot relay chain.",
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
        "label": "Kusama Network",
        "url": "https://kusama.network/"
      },
      {
        "label": "Polkadot Wiki – Kusama",
        "url": "https://wiki.polkadot.network/docs/learn-kusama"
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
    "summary": "Polkadot's Cross-Chain Message Passing protocol for parachain-to-parachain communication.",
    "definition": "XCMP allows parachains to exchange messages directly while relying on the relay chain for ordering and security. It underpins trust-minimized asset transfers and remote calls, enabling SORA-aligned parachains to interoperate with the wider Polkadot ecosystem.",
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
        "label": "Polkadot Wiki – XCMP",
        "url": "https://wiki.polkadot.network/docs/learn-xcmp"
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
    "summary": "The compute resource that Polkadot sells to projects so they can execute workloads on relay-chain validators.",
    "definition": "Coretime packages validator execution capacity into timeslices that projects buy via auctions or agile markets. Managing coretime commitments helps parachains plan throughput needs, budget DOT expenditures, and coordinate upgrades.",
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
        "label": "Polkadot Wiki – Coretime",
        "url": "https://wiki.polkadot.network/docs/learn-coretime"
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
    "summary": "A Polkadot upgrade that lets parachains submit work in parallel stages to raise throughput and lower latency.",
    "definition": "Asynchronous backing separates block production, validation, and availability into overlapping phases. Validators can approve availability for one block while producing the next, increasing parachain capacity without compromising security.",
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
        "label": "Polkadot Wiki – Asynchronous Backing",
        "url": "https://wiki.polkadot.network/docs/learn-async-backing"
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
    "summary": "Candle-style events where Polkadot and Kusama projects bond DOT or KSM to lease parachain slots.",
    "definition": "Parachain slot auctions determine which projects gain access to shared security for a fixed lease period. Bids accumulate until a randomized ending block is selected, encouraging honest bidding and staking participation through crowdloans.",
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
        "label": "Polkadot Wiki – Parachain Auctions",
        "url": "https://wiki.polkadot.network/docs/learn-auction"
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
    "summary": "Campaigns that let token holders bond assets to support a project's parachain auction bid.",
    "definition": "Crowdloans escrow contributor DOT or KSM on the relay chain, returning the stake after the lease while projects distribute rewards separately. They democratize access to parachain slots and align community incentives with network growth.",
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
        "label": "Polkadot Wiki – Crowdloans",
        "url": "https://wiki.polkadot.network/docs/learn-crowdloan"
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
    "summary": "On-demand parachain slots that pay for execution per block instead of committing to a full lease.",
    "definition": "Parathreads let projects share coretime in a pay-as-you-go model, ideal for lower throughput applications or pilots. They can later transition into full parachains once usage justifies a dedicated lease.",
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
        "label": "Polkadot Wiki – Parathreads",
        "url": "https://wiki.polkadot.network/docs/learn-parathreads"
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
    "summary": "A Polkadot and Kusama feature that lets runtime logic be upgraded without hard forks.",
    "definition": "Forkless upgrades leverage on-chain governance to authorize new runtime code. Validators automatically adopt the change once approved, minimizing chain splits and ensuring continuous availability for parachains and dApps.",
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
        "label": "Polkadot Wiki – Upgrades",
        "url": "https://wiki.polkadot.network/docs/learn-upgrades"
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
    "summary": "Fixed-duration access to Polkadot or Kusama validator resources granted after a successful parachain auction.",
    "definition": "Slot leases are divided into 12-week periods bundled into longer terms (up to 96 weeks on Polkadot). Projects must plan renewal strategies or migrations before the lease expires to maintain uninterrupted service.",
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
        "label": "Polkadot Wiki – Parachains",
        "url": "https://wiki.polkadot.network/docs/learn-parachains"
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
    "summary": "Scaling solutions that execute transactions off-chain and submit proofs or bundles on-chain for security.",
    "definition": "Rollups batch transactions, compress state transitions, and post validity or fraud proofs to a base layer. They lower fees while retaining trust minimization, complementing approaches like Hyperledger Iroha's deterministic consensus.",
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
        "label": "Ethereum.org – Rollups",
        "url": "https://ethereum.org/en/developers/docs/scaling/#rollups"
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
    "summary": "A flexible market where Polkadot sells coretime slices directly through brokered deals instead of fixed auctions.",
    "definition": "Agile coretime lets projects purchase future execution capacity programmatically, smoothing demand and reducing the need for large upfront bids. It complements auctions and crowdloans by offering shorter-term or incremental commitments.",
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
        "label": "Polkadot Wiki – Agile Coretime",
        "url": "https://wiki.polkadot.network/docs/learn-agile-coretime"
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
    "summary": "The study of how token supply, incentives, and governance interact to sustain decentralized networks.",
    "definition": "Blockchain economics analyzes monetary policy, reward distribution, and treasury design to keep participants aligned. Frameworks like the SORA token bonding curve illustrate how supply elasticity and governance controlled reserves stabilize ecosystem growth.",
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
        "label": "SORA Tokenomics",
        "url": "https://wiki.sora.org/tokenomics.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/blockchain-economics"
  },
  "apollo-protocol": {
    "slug": "apollo-protocol",
    "title": "Apollo Protocol",
    "type": "term",
    "category": "defi",
    "summary": "A SORA ecosystem initiative focused on community-built tooling, analytics, and governance support for Polkaswap and SORA v3 upgrades.",
    "definition": "Apollo Protocol coordinates community contributors who research tokenomics, publish knowledge base updates, and build automation for SORA releases. The group produces roadmap briefings, glossary enhancements, and documentation that keep builders aligned with Kensetsu, TBCD, and Polkaswap milestones.",
    "aliases": [
      "Apollo Protocol"
    ],
    "relatedTags": [
      "apollo token",
      "community",
      "SORA ecosystem",
      "token repackaging"
    ],
    "seeAlso": [
      "Apollo Token",
      "SORA Roadmap",
      "Token Repackaging"
    ],
    "links": [
      {
        "label": "Apollo Protocol Overview",
        "url": "https://soranauts.com/apollo-protocol-sora-network"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/apollo-protocol"
  },
  "apollo-token": {
    "slug": "apollo-token",
    "title": "APOLLO Token",
    "type": "term",
    "category": "token",
    "summary": "A community reward token used by the Apollo Protocol to incentivize research, documentation, and tooling for the SORA ecosystem.",
    "definition": "The APOLLO token compensates contributors who publish technical research, produce analytics, and maintain documentation that supports SORA builders. Distribution is coordinated by the Apollo Protocol collective based on measurable ecosystem contributions.",
    "aliases": [
      "APOLLO Token",
      "Apollo Token"
    ],
    "relatedTags": [
      "apollo protocol",
      "community",
      "tokenomics"
    ],
    "seeAlso": [
      "Apollo Protocol",
      "Tokenomics",
      "SORA Roadmap"
    ],
    "links": [
      {
        "label": "Apollo Protocol Overview",
        "url": "https://soranauts.com/apollo-protocol-sora-network"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/apollo-token"
  },
  "ceres": {
    "slug": "ceres",
    "title": "Ceres",
    "type": "term",
    "category": "defi",
    "summary": "A SORA-based DeFi suite providing launchpad services, stablecoins, and liquidity tools that complement Polkaswap.",
    "definition": "Ceres offers decentralized applications such as Demeter Farming, SORA Card integrations, and liquidity vaults built on the SORA network. Its tooling accelerates adoption of Polkaswap pairs and supports Kensetsu stablecoin use cases.",
    "aliases": [
      "Ceres"
    ],
    "relatedTags": [
      "SORA ecosystem",
      "Polkaswap",
      "DeFi"
    ],
    "seeAlso": [
      "SORA Ecosystem",
      "Polkaswap",
      "DeFi"
    ],
    "links": [
      {
        "label": "Ceres Official Site",
        "url": "https://cerestoken.io/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/ceres"
  },
  "lending": {
    "slug": "lending",
    "title": "Lending",
    "type": "term",
    "category": "defi",
    "summary": "Providing assets to a protocol or counterparty in exchange for yield or collateral. In DeFi this is handled by smart contracts that manage collateralized positions.",
    "definition": "Lending allows participants to supply assets to automated vaults or liquidity pools in return for interest. Kensetsu vaults on SORA formalize this process by locking collateral, applying stability fees, and enforcing liquidation rules through on-chain governance.",
    "aliases": [
      "Lending"
    ],
    "relatedTags": [
      "borrowing",
      "money market",
      "collateral",
      "vaults"
    ],
    "seeAlso": [
      "Borrowing",
      "Money Market",
      "Collateral",
      "Vaults"
    ],
    "links": [
      {
        "label": "SORA Wiki – Kensetsu Vaults",
        "url": "https://wiki.sora.org/kensetsu-vaults.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/lending"
  },
  "borrowing": {
    "slug": "borrowing",
    "title": "Borrowing",
    "type": "term",
    "category": "defi",
    "summary": "Taking on debt against posted collateral using smart contracts that enforce repayment and liquidation rules.",
    "definition": "Borrowing in DeFi involves locking approved collateral to mint or draw assets, paying stability fees until the position is closed. Kensetsu vaults on SORA apply governance-defined collateral ratios and liquidation procedures to keep the system solvent while providing access to KUSD or other approved assets.",
    "aliases": [
      "Borrowing"
    ],
    "relatedTags": [
      "lending",
      "collateral",
      "vaults",
      "money market"
    ],
    "seeAlso": [
      "Lending",
      "Collateral",
      "Vaults",
      "Money Market"
    ],
    "links": [
      {
        "label": "SORA Wiki – Kensetsu Vaults",
        "url": "https://wiki.sora.org/kensetsu-vaults.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/borrowing"
  },
  "money-market": {
    "slug": "money-market",
    "title": "Money Market",
    "type": "term",
    "category": "defi",
    "summary": "A financial marketplace for short-term lending and borrowing backed by collateral and dynamic interest rates.",
    "definition": "Money markets match liquidity providers with borrowers who post collateral and pay variable yields. In DeFi, smart contracts automate liquidations and rate adjustments—concepts that inform Kensetsu vault design within the SORA ecosystem.",
    "aliases": [
      "Money Market"
    ],
    "relatedTags": [
      "lending",
      "borrowing",
      "vaults",
      "collateral"
    ],
    "seeAlso": [
      "Lending",
      "Borrowing",
      "Vaults",
      "Collateral"
    ],
    "links": [
      {
        "label": "SORA Wiki – Kensetsu Vaults",
        "url": "https://wiki.sora.org/kensetsu-vaults.html"
      },
      {
        "label": "International Monetary Fund – Money Market",
        "url": "https://www.imf.org/external/np/exr/glossary/showTerm.asp#80"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/money-market"
  },
  "digital-ownership": {
    "slug": "digital-ownership",
    "title": "Digital Ownership",
    "type": "term",
    "category": "technology",
    "summary": "The ability to control and transfer digital assets using cryptographic proofs instead of centralized registries.",
    "definition": "Digital ownership leverages NFTs, decentralized identifiers, and smart contracts to authenticate provenance and rights. It underpins use cases such as tokenized art, rewards, and governance credentials on networks like SORA.",
    "aliases": [
      "Digital Ownership"
    ],
    "relatedTags": [
      "NFTs",
      "tokenization",
      "blockchain development"
    ],
    "seeAlso": [
      "NFTs",
      "Tokenization",
      "Blockchain Development"
    ],
    "links": [
      {
        "label": "SORA Wiki – NFTs",
        "url": "https://wiki.sora.org/nft.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/digital-ownership"
  },
  "bitcoin": {
    "slug": "bitcoin",
    "title": "Bitcoin (BTC)",
    "type": "term",
    "category": "economics",
    "summary": "The first decentralized cryptocurrency, created by Satoshi Nakamoto in 2009 with a capped 21 million supply.",
    "definition": "Bitcoin combines proof-of-work consensus, public-key cryptography, and halving-based issuance to secure peer-to-peer digital cash. Its monetary policy and liquidity cycles influence broader crypto markets, including assets listed on Polkaswap.",
    "aliases": [
      "Bitcoin",
      "BTC"
    ],
    "relatedTags": [
      "market cycles",
      "halving",
      "bear market",
      "bull market"
    ],
    "seeAlso": [
      "Crypto Market Cycles",
      "Bull Market",
      "Bear Market",
      "Halving"
    ],
    "links": [
      {
        "label": "Bitcoin Whitepaper",
        "url": "https://bitcoin.org/bitcoin.pdf"
      },
      {
        "label": "Bitcoin.org – How Bitcoin Works",
        "url": "https://bitcoin.org/en/how-it-works"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/bitcoin"
  },
  "halving": {
    "slug": "halving",
    "title": "Halving",
    "type": "term",
    "category": "economics",
    "summary": "A scheduled reduction of block rewards that halves new coin issuance in proof-of-work networks like Bitcoin.",
    "definition": "Bitcoin halves miner rewards roughly every four years, decreasing supply inflation and historically triggering market repricing. Similar emission cuts exist in other proof-of-work chains, shaping expectations for liquidity and mining economics.",
    "aliases": [
      "Halving",
      "Bitcoin Halving"
    ],
    "relatedTags": [
      "bitcoin",
      "scarcity economics",
      "market cycles"
    ],
    "seeAlso": [
      "Bitcoin (BTC)",
      "Scarcity Economics",
      "Crypto Market Cycles"
    ],
    "links": [
      {
        "label": "Bitcoin.org – Halving FAQ",
        "url": "https://bitcoin.org/en/faq#what-is-the-bitcoin-halving"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/halving"
  },
  "market-psychology": {
    "slug": "market-psychology",
    "title": "Market Psychology",
    "type": "term",
    "category": "economics",
    "summary": "Behavioral factors—such as fear and greed—that drive investor decisions and market cycles.",
    "definition": "Market psychology examines how sentiment, narratives, and cognitive biases influence trading volume and volatility. Recognizing these patterns helps risk managers and treasuries plan for swings in liquidity across crypto ecosystems.",
    "aliases": [
      "Market Psychology"
    ],
    "relatedTags": [
      "crypto market cycles",
      "trading strategy",
      "bull market",
      "bear market"
    ],
    "seeAlso": [
      "Crypto Market Cycles",
      "Trading Strategy",
      "Bull Market",
      "Bear Market"
    ],
    "links": [
      {
        "label": "Behavioral Finance Overview",
        "url": "https://www.cfainstitute.org/en/research/foundation/2013/behavioral-finance"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/market-psychology"
  },
  "bull-market": {
    "slug": "bull-market",
    "title": "Bull Market",
    "type": "term",
    "category": "economics",
    "summary": "A prolonged period of rising asset prices accompanied by expanding liquidity and optimism.",
    "definition": "Bull markets occur when demand consistently outpaces supply, often supported by macro trends, innovation, or positive narratives. Participants may increase risk exposure, but prudent treasury management still prepares for eventual reversals.",
    "aliases": [
      "Bull Market"
    ],
    "relatedTags": [
      "bear market",
      "market psychology",
      "crypto market cycles"
    ],
    "seeAlso": [
      "Bear Market",
      "Crypto Market Cycles",
      "Market Psychology"
    ],
    "links": [
      {
        "label": "Investopedia – Bull Market",
        "url": "https://www.investopedia.com/terms/b/bullmarket.asp"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/bull-market"
  },
  "bear-market": {
    "slug": "bear-market",
    "title": "Bear Market",
    "type": "term",
    "category": "economics",
    "summary": "A market environment characterized by falling prices and defensive positioning.",
    "definition": "Bear markets reflect sustained declines—commonly defined as drops of 20% or more—driven by risk aversion, deleveraging, or macro shocks. Strategies include conserving liquidity, diversifying collateral, and accelerating development to prepare for the next cycle.",
    "aliases": [
      "Bear Market"
    ],
    "relatedTags": [
      "bull market",
      "market psychology",
      "crypto market cycles"
    ],
    "seeAlso": [
      "Bull Market",
      "Crypto Market Cycles",
      "Market Psychology"
    ],
    "links": [
      {
        "label": "Investopedia – Bear Market",
        "url": "https://www.investopedia.com/terms/b/bearmarket.asp"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/bear-market"
  },
  "scarcity-economics": {
    "slug": "scarcity-economics",
    "title": "Scarcity Economics",
    "type": "term",
    "category": "economics",
    "summary": "An economic framework where limited supply influences value. SORA's token bonding curve applies scarcity economics to manage XOR supply.",
    "definition": "Scarcity economics studies how limited supply affects pricing and behavior. XOR uses algorithmic elasticity to balance scarcity with utility, ensuring the network can scale while preserving long-term value for participants.",
    "aliases": [
      "Scarcity Economics"
    ],
    "relatedTags": [
      "token bonding curve",
      "monetary systems",
      "halving"
    ],
    "seeAlso": [
      "Token Bonding Curve",
      "Monetary Systems",
      "Halving"
    ],
    "links": [
      {
        "label": "SORA XOR Token Supply Explained",
        "url": "https://soranauts.com/sora-xor-token-supply-explained"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/scarcity-economics"
  },
  "economic-systems": {
    "slug": "economic-systems",
    "title": "Economic Systems",
    "type": "term",
    "category": "economics",
    "summary": "Structures that govern production, distribution, and governance of resources. SORA proposes a supranational economic system driven by decentralized governance.",
    "definition": "Economic systems range from centralized fiat regimes to decentralized crypto economies. SORA combines algorithmic monetary policy, community governance, and cross-chain infrastructure to build an inclusive economic system beyond national borders.",
    "aliases": [
      "Economic Systems"
    ],
    "relatedTags": [
      "monetary systems",
      "blockchain economics",
      "token repackaging"
    ],
    "seeAlso": [
      "Monetary Systems",
      "Blockchain Economics",
      "Token Repackaging"
    ],
    "links": [
      {
        "label": "SORA Blockchain: New World Economic Order",
        "url": "https://soranauts.com/sora-blockchain-new-world-economic-order"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/economic-systems"
  },
  "proof-of-work": {
    "slug": "proof-of-work",
    "title": "Proof of Work (PoW)",
    "type": "term",
    "category": "technology",
    "summary": "A consensus method where miners expend computational energy to propose blocks and earn rewards.",
    "definition": "Proof of Work secures networks such as Bitcoin by requiring miners to solve cryptographic puzzles. The difficulty adjusts to maintain steady block production, making attacks costly because adversaries must control the majority of hashing power.",
    "aliases": [
      "Proof of Work",
      "PoW"
    ],
    "relatedTags": [
      "mining",
      "energy",
      "bitcoin"
    ],
    "seeAlso": [
      "Mining",
      "Bitcoin (BTC)",
      "Consensus"
    ],
    "links": [
      {
        "label": "Bitcoin.org – Proof of Work",
        "url": "https://bitcoin.org/en/developer-guide#proof-of-work"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/proof-of-work"
  },
  "proof-of-stake": {
    "slug": "proof-of-stake",
    "title": "Proof of Stake (PoS)",
    "type": "term",
    "category": "technology",
    "summary": "A consensus mechanism where validators stake tokens to secure the network. SORA v2 uses NPoS on Substrate while SORA v3 moves toward BFT consensus.",
    "definition": "Proof of Stake selects validators based on staked assets rather than energy expenditure. The model incentivizes honest behavior by slashing or rewarding stake. SORA references PoS to explain historical network phases and to contrast with Hyperledger Iroha's BFT consensus.",
    "aliases": [
      "Proof of Stake",
      "PoS"
    ],
    "relatedTags": [
      "staking",
      "validator",
      "consensus"
    ],
    "seeAlso": [
      "Staking",
      "Validator",
      "Consensus"
    ],
    "links": [
      {
        "label": "Proof of Stake vs Proof of Work",
        "url": "https://soranauts.com/differences-between-proof-of-stake-and-proof-of-work"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/proof-of-stake"
  },
  "web3": {
    "slug": "web3",
    "title": "Web3",
    "type": "term",
    "category": "technology",
    "summary": "The next iteration of the internet where decentralized protocols give users ownership over identity, assets, and coordination.",
    "definition": "Web3 combines blockchain, decentralized storage, and smart contracts to deliver user-owned networks. SORA positions itself as a Web3 supranational economy that blends DeFi, governance, and real-world integrations.",
    "aliases": [
      "Web3"
    ],
    "relatedTags": [
      "digital ownership",
      "tokenization",
      "decentralized exchange"
    ],
    "seeAlso": [
      "Digital Ownership",
      "Tokenization",
      "DEX"
    ],
    "links": [
      {
        "label": "SORA Ecosystem Overview",
        "url": "https://soranauts.com"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/web3"
  },
  "mining": {
    "slug": "mining",
    "title": "Mining",
    "type": "term",
    "category": "technology",
    "summary": "The process of validating transactions and producing blocks in proof-of-work systems.",
    "definition": "Mining bundles transactions into candidate blocks, expends computational work, and—if successful—broadcasts the new block to the network. Rewards combine new coin issuance with transaction fees, incentivizing miners to secure the chain.",
    "aliases": [
      "Mining"
    ],
    "relatedTags": [
      "proof of work",
      "energy",
      "bitcoin"
    ],
    "seeAlso": [
      "Proof of Work",
      "Bitcoin (BTC)",
      "Energy"
    ],
    "links": [
      {
        "label": "Bitcoin.org – Mining Guide",
        "url": "https://bitcoin.org/en/how-it-works#mining"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/mining"
  },
  "vaults": {
    "slug": "vaults",
    "title": "Vaults",
    "type": "term",
    "category": "defi",
    "summary": "Smart-contract containers that manage pooled assets. Vaults underpin planned Kensetsu money markets and Polkaswap liquidity programs.",
    "definition": "Vaults automate strategies such as lending, liquidity provision, or reward distribution. In SORA, vaults will back Kensetsu stablecoins, manage collateral, and automate treasury deployments.",
    "aliases": [
      "Vaults"
    ],
    "relatedTags": [
      "collateral",
      "lending",
      "borrowing",
      "money market"
    ],
    "seeAlso": [
      "Collateral",
      "Lending",
      "Borrowing",
      "Money Market"
    ],
    "links": [
      {
        "label": "Kensetsu Explained",
        "url": "https://soranauts.com/exploring-sora-kensetsu-polkaswap"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/vaults"
  },
  "collateral": {
    "slug": "collateral",
    "title": "Collateral",
    "type": "term",
    "category": "economics",
    "summary": "Assets pledged to secure loans or stablecoin issuance. Collateral design determines the safety of SORA's future lending products.",
    "definition": "Collateral provides assurance that loans can be repaid or liquidated. SORA plans to accept XOR, stablecoins, and real-world assets as collateral for Kensetsu vaults, combining decentralized governance with transparent risk metrics.",
    "aliases": [
      "Collateral"
    ],
    "relatedTags": [
      "lending",
      "borrowing",
      "vaults",
      "money market"
    ],
    "seeAlso": [
      "Lending",
      "Borrowing",
      "Vaults",
      "Money Market"
    ],
    "links": [
      {
        "label": "SORA Token Bonding Curve Dollar Explained",
        "url": "https://soranauts.com/soras-token-bonding-curve-dollar-tbcd-explained"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/collateral"
  },
  "algorithmic-stability": {
    "slug": "algorithmic-stability",
    "title": "Algorithmic Stability",
    "type": "term",
    "category": "economics",
    "summary": "Mechanisms that maintain stable asset value through programmatic supply adjustments—core to TBCD and SORA's monetary policy.",
    "definition": "Algorithmic stability uses smart contracts and liquidity incentives to keep stablecoins near target value. SORA's Token Bonding Curve Dollar (TBCD) and Kensetsu architecture rely on algorithmic stability backed by governance oversight.",
    "aliases": [
      "Algorithmic Stability"
    ],
    "relatedTags": [
      "token bonding curve",
      "scarcity economics",
      "monetary systems"
    ],
    "seeAlso": [
      "Token Bonding Curve",
      "Scarcity Economics",
      "Monetary Systems"
    ],
    "links": [
      {
        "label": "TBCD Explained",
        "url": "https://soranauts.com/soras-token-bonding-curve-dollar-tbcd-explained"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/algorithmic-stability"
  },
  "blockchain-development": {
    "slug": "blockchain-development",
    "title": "Blockchain Development",
    "type": "term",
    "category": "technology",
    "summary": "Engineering decentralized applications, smart contracts, and infrastructure that run on blockchain networks.",
    "definition": "Blockchain development spans consensus clients, runtime modules, front-end interfaces, and integrations. Tooling such as Substrate, Hyperledger Iroha, and smart-contract frameworks enable teams to build features like Polkaswap, Kensetsu vaults, and cross-chain bridges.",
    "aliases": [
      "Blockchain Development"
    ],
    "relatedTags": [
      "programming",
      "rust",
      "web3",
      "decentralized exchange"
    ],
    "seeAlso": [
      "Programming",
      "Rust",
      "Web3",
      "DEX"
    ],
    "links": [
      {
        "label": "Hyperledger Iroha Docs",
        "url": "https://docs.iroha.tech/"
      },
      {
        "label": "Substrate Developer Hub",
        "url": "https://docs.substrate.io/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/blockchain-development"
  },
  "rust-language": {
    "slug": "rust-language",
    "title": "Rust",
    "type": "term",
    "category": "technology",
    "summary": "A systems programming language focused on memory safety, concurrency, and performance.",
    "definition": "Rust eliminates most classes of memory errors through ownership and borrowing rules, making it popular for blockchain clients and cryptography. Hyperledger Iroha 2 and 3, key components of SORA v3, are implemented in Rust to benefit from its safety guarantees.",
    "aliases": [
      "Rust"
    ],
    "relatedTags": [
      "memory safety",
      "performance",
      "concurrency",
      "webassembly"
    ],
    "seeAlso": [
      "Memory Safety",
      "Performance",
      "Concurrency",
      "WebAssembly"
    ],
    "links": [
      {
        "label": "Rust Book – Concurrency",
        "url": "https://doc.rust-lang.org/book/ch16-00-concurrency.html"
      },
      {
        "label": "Rust Programming Language",
        "url": "https://www.rust-lang.org/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/rust-language"
  },
  "programming": {
    "slug": "programming",
    "title": "Programming",
    "type": "term",
    "category": "technology",
    "summary": "The act of designing and writing instructions that computers execute.",
    "definition": "Programming involves translating requirements into source code, testing, and maintaining software. Blockchain initiatives rely on languages such as Rust, TypeScript, and Python to build clients, tooling, and user interfaces.",
    "aliases": [
      "Programming"
    ],
    "relatedTags": [
      "blockchain development",
      "rust",
      "web3"
    ],
    "seeAlso": [
      "Blockchain Development",
      "Rust",
      "Web3"
    ],
    "links": [
      {
        "label": "MDN Web Docs – Programming Basics",
        "url": "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/Programming_basics"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/programming"
  },
  "solana": {
    "slug": "solana",
    "title": "Solana",
    "type": "term",
    "category": "network",
    "summary": "A high-performance layer-1 blockchain that uses Proof of History and parallel transaction processing.",
    "definition": "Solana achieves low-latency finality through a combination of Proof of History and a Tower BFT consensus. Its ecosystem of DeFi, NFT, and consumer apps provides comparative data points for cross-chain liquidity strategies.",
    "aliases": [
      "Solana"
    ],
    "relatedTags": [
      "bonk",
      "meme coins",
      "performance"
    ],
    "seeAlso": [
      "Bonk",
      "Performance",
      "Meme Coins"
    ],
    "links": [
      {
        "label": "Solana Docs",
        "url": "https://docs.solana.com/"
      },
      {
        "label": "Solana.com",
        "url": "https://solana.com/"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/solana"
  },
  "memory-safety": {
    "slug": "memory-safety",
    "title": "Memory Safety",
    "type": "term",
    "category": "technology",
    "summary": "Protection against common programming errors like null references or buffer overflows. Rust delivers memory safety guarantees for SORA v3.",
    "definition": "Memory safety prevents vulnerabilities that could compromise blockchain nodes. Rust enforces ownership rules, allowing Hyperledger Iroha 3 to run critical financial infrastructure without garbage collection overhead.",
    "aliases": [
      "Memory Safety"
    ],
    "relatedTags": [
      "rust",
      "performance",
      "concurrency"
    ],
    "seeAlso": [
      "Rust",
      "Performance",
      "Concurrency"
    ],
    "links": [
      {
        "label": "Why Cryptocurrencies Are Embracing Rust",
        "url": "https://soranauts.com/cryptocurrencies-rust-programming"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/memory-safety"
  },
  "wasm": {
    "slug": "wasm",
    "title": "WASM (WebAssembly)",
    "type": "term",
    "category": "technology",
    "summary": "A portable binary instruction format used for sandboxed, high-performance execution (often for smart contracts and blockchain runtime modules).",
    "definition": "WebAssembly lets runtimes execute code securely and efficiently across platforms. Many blockchain ecosystems (including Substrate-based chains) use WASM for runtimes or smart contracts. SORA v3 / Hyperledger Iroha 3 executes on-ledger programmable logic as IVM bytecode (Kotodama) rather than general-purpose WASM modules.",
    "aliases": [
      "WASM",
      "WebAssembly"
    ],
    "relatedTags": [
      "rust",
      "performance",
      "concurrency"
    ],
    "seeAlso": [
      "Rust",
      "Performance",
      "Concurrency"
    ],
    "links": [
      {
        "label": "WASM vs EVM Analysis",
        "url": "https://soranauts.com/wasm-rust-substrate-vs-evm-solidity-ethereum"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/wasm"
  },
  "performance": {
    "slug": "performance",
    "title": "Performance",
    "type": "term",
    "category": "technology",
    "summary": "How efficiently a system executes work relative to resources such as time, memory, and energy.",
    "definition": "Performance analysis measures throughput, latency, and resource utilization to spot bottlenecks. Optimizing performance is crucial for blockchain clients, smart contracts, and front-end applications that must stay responsive under load.",
    "aliases": [
      "Performance"
    ],
    "relatedTags": [
      "rust",
      "concurrency",
      "wasm"
    ],
    "seeAlso": [
      "Rust",
      "Concurrency",
      "WASM"
    ],
    "links": [
      {
        "label": "Computer Performance Overview",
        "url": "https://en.wikipedia.org/wiki/Computer_performance"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/performance"
  },
  "concurrency": {
    "slug": "concurrency",
    "title": "Concurrency",
    "type": "term",
    "category": "technology",
    "summary": "The ability of a system to handle multiple tasks or processes overlapping in time.",
    "definition": "Concurrency techniques—such as threads, async executors, and message passing—allow software to utilize multi-core hardware and keep I/O operations non-blocking. SORA infrastructure written in Rust relies on disciplined concurrency to maintain reliability.",
    "aliases": [
      "Concurrency"
    ],
    "relatedTags": [
      "rust",
      "performance",
      "wasm"
    ],
    "seeAlso": [
      "Rust",
      "Performance",
      "WASM"
    ],
    "links": [
      {
        "label": "Rust Book – Fearless Concurrency",
        "url": "https://doc.rust-lang.org/book/ch16-00-concurrency.html"
      }
    ],
    "priority": 0,
    "glossaryRef": "/glossary/concurrency"
  },
  "fearlesswallet": {
    "slug": "fearlesswallet",
    "title": "Fearless Wallet",
    "type": "term",
    "category": "defi",
    "summary": "Fearless Wallet is a non-custodial mobile wallet by SORAMITSU for managing Polkadot, Kusama, and SORA ecosystem assets with staking, DeFi access, and governance participation.",
    "definition": "Fearless Wallet is a mobile-first, non-custodial cryptocurrency wallet developed by SORAMITSU. It provides secure access to the Polkadot, Kusama, and SORA ecosystems from iOS and Android devices. Key features include non-custodial security, multi-chain support for 100+ Substrate-based networks, native staking, Polkaswap integration for token swaps, crowdloan participation, governance voting, fiat on-ramp via Mercuryo and MoonPay, and NFT support. The wallet has deep integration with the SORA ecosystem including Polkaswap, SORA Card connectivity, and XOR/VAL/PSWAP management.",
    "aliases": [
      "Fearless Wallet",
      "Fearless"
    ],
    "relatedTags": [
      "polkaswap",
      "sora",
      "staking",
      "polkadot",
      "kusama",
      "xor"
    ],
    "seeAlso": [
      "Polkaswap",
      "SORA",
      "SORA Card",
      "Staking",
      "Polkadot",
      "Kusama",
      "XOR"
    ],
    "links": [
      {
        "label": "Fearless Wallet Official",
        "url": "https://fearlesswallet.io/"
      },
      {
        "label": "iOS App Store",
        "url": "https://apps.apple.com/us/app/fearless-wallet/id1537745558"
      },
      {
        "label": "Google Play Store",
        "url": "https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless"
      },
      {
        "label": "Fearless Wiki",
        "url": "https://wiki.fearlesswallet.io/"
      },
      {
        "label": "SORAMITSU",
        "url": "https://soramitsu.co.jp/"
      },
      {
        "label": "GitHub",
        "url": "https://github.com/soramitsu/fearless-iOS"
      }
    ],
    "priority": 8,
    "glossaryRef": "/glossary/fearlesswallet"
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
  'blockchain-technology': 'blockchain',
  'market-cycles': 'crypto-market-cycles',
  'investment-strategy': 'trading-strategy',
  'cryptocurrency-trends': 'crypto-market-cycles',
  'market-analysis': 'crypto-market-cycles',
  'bitcoin-halving': 'halving',
  'decentralized-exchange': 'dex',
  'validator-rewards': 'validator',
  'hyperledger': 'hyperledger-iroha',
  'pos': 'proof-of-stake',
  'pow': 'proof-of-work',
  'ken': 'kensetsu',
  'energy': 'proof-of-work',
  'webassembly': 'wasm',
  'performance': 'performance',
  'concurrency': 'concurrency',
  'rust': 'rust-language'
};

const taxonomyWithTags: Record<string, TaxonomyNode> = { ...baseTaxonomy };

const applyMetadataGlossaryOverride = (slug: string): void => {
  const metadata = tagHubMetadata[slug];
  if (!metadata?.glossarySlug) return;
  const normalizedSlug = metadata.glossarySlug.replace(/^\/?glossary\//, '').trim();
  if (!normalizedSlug || !taxonomyWithTags[slug]) return;
  taxonomyWithTags[slug].glossaryRef = `/glossary/${normalizedSlug}`;
};

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
    const overrideSlug = tagGlossaryOverrides[possibleTermSlug] ?? tagGlossaryOverrides[normalizeKey(tag)];
    const candidateSlug = overrideSlug ?? possibleTermSlug;
    const glossaryCandidate =
      baseTaxonomy[candidateSlug] ??
      baseTaxonomy[possibleTermSlug] ??
      findNodeByAlias(tag) ??
      findNodeByAlias(candidateSlug);

    taxonomyWithTags[slug] = {
      slug,
      title: glossaryCandidate?.title ?? humanize(tag),
      type: 'tag',
      aliases: Array.from(new Set([tag, glossaryCandidate?.title ?? tag, humanize(tag), normalizeKey(tag)])).filter(Boolean),
      relatedTags: [],
      seeAlso: [],
      glossaryRef: glossaryCandidate?.glossaryRef ?? node.glossaryRef,
      hub: tagHubMetadata[slug],
    };
    applyMetadataGlossaryOverride(slug);
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
    title: candidateNode?.title ?? tag,
    type: 'tag',
    aliases: Array.from(new Set([tag, candidateNode?.title ?? tag, humanize(tag), normalizeKey(tag)])).filter(Boolean),
    relatedTags: [],
    seeAlso: [],
    glossaryRef: candidateNode?.glossaryRef,
    hub: tagHubMetadata[slug],
  };
  applyMetadataGlossaryOverride(slug);
}

for (const [slug, metadata] of Object.entries(tagHubMetadata)) {
  if (!taxonomyWithTags[slug]) {
    const tagName = slug.replace(/^tag-/, '');
    const normalizedTag = normalizeKey(tagName);
    const possibleTermSlug = normalizedTag.replace(/\s+/g, '-');
    const overrideSlug = tagGlossaryOverrides[possibleTermSlug] ?? tagGlossaryOverrides[normalizedTag];
    const candidateSlug = overrideSlug ?? possibleTermSlug;
    const candidateNode =
      baseTaxonomy[candidateSlug] ??
      baseTaxonomy[possibleTermSlug] ??
      findNodeByAlias(tagName) ??
      findNodeByAlias(candidateSlug);
    
    taxonomyWithTags[slug] = {
      slug,
      title: candidateNode?.title ?? humanize(tagName),
      type: 'tag',
      aliases: Array.from(new Set([tagName, candidateNode?.title ?? tagName, humanize(tagName), normalizeKey(tagName)])).filter(Boolean),
      relatedTags: [],
      seeAlso: [],
      glossaryRef: candidateNode?.glossaryRef,
      hub: metadata,
    };
    applyMetadataGlossaryOverride(slug);
  } else {
    taxonomyWithTags[slug].hub = metadata;
    applyMetadataGlossaryOverride(slug);
  }
}

for (const [slug, stat] of Object.entries(tagStats)) {
  if (!taxonomyWithTags[slug]) continue;
  taxonomyWithTags[slug].usageCount = stat.count;
  if (stat.firstSeen) taxonomyWithTags[slug].firstSeen = stat.firstSeen;
  if (stat.lastSeen) taxonomyWithTags[slug].lastSeen = stat.lastSeen;
}

export const taxonomy: Record<string, TaxonomyNode> = taxonomyWithTags;
