// SORA Glossary Data
// Comprehensive definitions for SORA ecosystem terms

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'token' | 'technology' | 'governance' | 'defi' | 'network' | 'economics';
  relatedTerms: string[];
  aliases?: string[];
  examples?: string[];
  links?: {
    label: string;
    url: string;
  }[];
}

export const soraGlossary: Record<string, GlossaryTerm> = {
  // Core Tokens
  'XOR': {
    term: 'XOR',
    definition: 'The network utility token used for transaction fees (gas) where 50% of fees are burned and 50% go to validators. XOR has elastic supply managed by a token bonding curve and can be used for staking, liquidity provision, and future SORA Parliament membership.',
    category: 'token',
    relatedTerms: ['VAL', 'PSWAP', 'Token Bonding Curve', 'Elastic Supply', 'Polkaswap'],
    examples: ['Transaction fees', 'Validator staking', 'Liquidity provision', 'SORA Parliament citizenship'],
    links: [
      { label: 'SORA Wiki - XOR', url: 'https://wiki.sora.org/xor.html' },
      { label: 'SORA Staking Guide', url: 'https://wiki.sora.org/demeter-staking-polkaswap.html#sora-staking' },
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'VAL': {
    term: 'VAL',
    definition: 'A validator reward token for the SORA network used to reward validators and stake nominators. VAL has deflationary tokenomics with tokens burned on every transaction, and elastic rewards distributed as a percentage of daily burned tokens.',
    category: 'token',
    relatedTerms: ['XOR', 'PSWAP', 'Validator', 'Staking', 'Deflationary', 'HASHI'],
    examples: ['Validator rewards', 'Staking rewards', 'Transaction fee burning'],
    links: [
      { label: 'SORA Wiki - VAL', url: 'https://wiki.sora.org/val.html' },
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'PSWAP': {
    term: 'PSWAP',
    definition: 'A deflationary token used to reward liquidity providers on Polkaswap. PSWAP has a 10 billion max supply that decreases over time, with 0.3% trading fees used for buyback-and-burn, and rewards starting at 90% of burned tokens reminted for LPs, decreasing to 35% after 5 years.',
    category: 'token',
    relatedTerms: ['XOR', 'VAL', 'Polkaswap', 'DEX', 'Liquidity', 'Deflationary', 'Buyback-and-burn'],
    examples: ['Liquidity provider rewards', 'Trading fee buyback', 'Token burning mechanism'],
    links: [
      { label: 'SORA Wiki - PSWAP', url: 'https://wiki.sora.org/pswap.html' },
      { label: 'Polkaswap Exchange', url: 'https://polkaswap.io' }
    ]
  },

  // Technology Terms
  'Hyperledger Iroha': {
    term: 'Hyperledger Iroha',
    definition: 'An open-source, permissioned blockchain framework developed by SORAMITSU and part of the Hyperledger Foundation. Designed for simplicity and fast deployment with granular permissions, built-in asset management, and Byzantine fault tolerant consensus. Hyperledger Iroha 2 (written in Rust) adds WASM smart contracts and improved performance, making it suitable for enterprise systems, CBDCs, and national-level financial infrastructure.',
    category: 'technology',
    relatedTerms: ['SORAMITSU', 'Hyperledger Foundation', 'Permissioned Blockchain', 'CBDC', 'Enterprise', 'WASM', 'Hyperledger Iroha 2', 'Hyperledger Iroha 3'],
    examples: ['SORA network', 'Bakong CBDC', 'Enterprise systems', 'National financial infrastructure'],
    links: [
      { label: 'Hyperledger Iroha', url: 'https://docs.iroha.tech/' }
    ]
  },
  'Hyperledger Iroha 2': {
    term: 'Hyperledger Iroha 2',
    aliases: ['Iroha 2'],
    definition: 'Hyperledger Iroha 2 is the blockchain framework that provided the foundation for SORA v2 Hubchain Phase 1-2 prototypes. Hyperledger Iroha 2 (written in Rust) provides WASM smart contracts and improved performance, making it suitable for enterprise systems, CBDCs, and national-level financial infrastructure. The framework enabled early cross-chain transfer proofs and verifier mechanisms. SORA v3 is transitioning from Hyperledger Iroha 2 to Hyperledger Iroha 3 for improved modularity and scalability.',
    category: 'technology',
    relatedTerms: ['Hyperledger Iroha', 'SORA v2', 'SORA v3', 'Hyperledger Iroha 3', 'SORAMITSU', 'WASM', 'CBDC', 'Hubchain'],
    examples: ['SORA v2 network', 'Hubchain Phase 1-2', 'Enterprise blockchain systems', 'CBDC infrastructure'],
    links: [
      { label: 'Hyperledger Iroha Documentation', url: 'https://docs.iroha.tech/' }
    ]
  },
  'Hyperledger Iroha 3': {
    term: 'Hyperledger Iroha 3',
    aliases: ['Iroha 3'],
    definition: 'Hyperledger Iroha 3 is the next-generation blockchain framework being developed for SORA v3 (Nexus). Hyperledger Iroha 3 introduces a re-engineered architecture with greater modularity, new consensus mechanisms, and enhanced security primitives. It features layered runtime for domain-specific modules, upgraded command model, query isolation for deterministic operations, and simplified validator orchestration. Hyperledger Iroha 3 will support Iroha Special Instructions (ISIs) for deterministic smart-contract logic and provide the foundation for SORA v3\'s high-performance, cross-chain infrastructure.',
    category: 'technology',
    relatedTerms: ['Hyperledger Iroha', 'Hyperledger Iroha 2', 'SORA v3', 'Iroha Special Instructions', 'ISI', 'BFT Consensus', 'Modular Architecture'],
    examples: ['SORA v3 network', 'Next-generation framework', 'Enterprise blockchain upgrade', 'Modular runtime'],
    links: [
      { label: 'Hyperledger Iroha Documentation', url: 'https://docs.iroha.tech/' }
    ]
  },
  'Substrate': {
    term: 'Substrate',
    definition: 'A modular blockchain framework developed by Parity Technologies. SORA v2 uses Substrate as its foundation to integrate with the Polkadot ecosystem and enable cross-chain functionality through parachain connectivity. SORA v3 (Nexus) is migrating away from Substrate to Hyperledger Iroha 3 for improved efficiency, enterprise integration, and enhanced capabilities for CBDC and government use cases.',
    category: 'technology',
    relatedTerms: ['Polkadot', 'Parachain', 'Cross-chain', 'SORA v2', 'SORA v3', 'Hyperledger Iroha', 'Hyperledger Iroha 3'],
    examples: ['Polkadot parachain', 'Cross-chain bridges', 'Modular development', 'SORA v2 implementation'],
    links: [
      { label: 'Substrate', url: 'https://substrate.io' }
    ]
  },
  'Parachain': {
    term: 'Parachain',
    definition: 'A parallel blockchain in the Polkadot ecosystem that connects to the main relay chain and benefits from shared security. Parachains can specialize in specific use cases (DeFi, privacy, smart contracts) while maintaining interoperability through Cross-Consensus Messaging (XCM). They process transactions in parallel and are validated by the relay chain\'s validator set.',
    category: 'network',
    relatedTerms: ['Polkadot', 'Relay Chain', 'XCM', 'Shared Security', 'Parallel Processing', 'Cross-chain'],
    examples: ['SORA parachain', 'DeFi parachains', 'Privacy-focused chains', 'Smart contract platforms'],
    links: [
      { label: 'Polkadot Parachains Guide', url: 'https://wiki.polkadot.com/learn/learn-parachains/' }
    ]
  },
  'IPFS': {
    term: 'IPFS',
    definition: 'InterPlanetary File System - a peer-to-peer distributed file system that provides decentralized, content-addressed storage for digital assets. IPFS uses cryptographic hashing to create unique identifiers for files, ensuring data integrity and permanent accessibility. In the SORA ecosystem, IPFS is crucial for storing NFT metadata, images, and other digital assets in a censorship-resistant manner.',
    category: 'technology',
    relatedTerms: ['NFT', 'Decentralized Storage', 'Metadata', 'Content Addressing', 'Blockchain', 'Digital Assets'],
    examples: ['NFT image storage', 'Decentralized hosting', 'Metadata storage', 'Content distribution'],
    aliases: ['IPFS', 'InterPlanetary File System'],
    links: [
      { label: 'IPFS Documentation', url: 'https://docs.ipfs.tech/' },
      { label: 'IPFS Protocol', url: 'https://ipfs.tech/' }
    ]
  },

  // DeFi Terms
  'Polkaswap': {
    term: 'Polkaswap',
    definition: 'A next-generation, cross-chain liquidity aggregator DEX protocol built on SORA network. Polkaswap aggregates liquidity from multiple sources (AMM DEXs, order books, algorithms) and provides smart liquidity routing to find the best prices. It enables seamless trading of ETH/ERC-20 tokens, DOT/KSM, BTC, and future assets with high speed, low fees, and reduced impermanent loss through its unique liquidity infrastructure.',
    category: 'defi',
    relatedTerms: ['DEX', 'Cross-chain', 'Liquidity Aggregation', 'PSWAP', 'Smart Routing', 'SORA Network', 'TONSWAP'],
    examples: ['Cross-chain token swaps', 'Multi-source liquidity aggregation', 'Smart price routing', 'Reduced impermanent loss'],
    links: [
      { label: 'Polkaswap Exchange', url: 'https://polkaswap.io' },
      { label: 'Polkaswap Wiki', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'TONSWAP': {
    term: 'TONSWAP',
    definition: 'A next-generation decentralized exchange (DEX) and launchpad built on The Open Network (TON) blockchain. TONSWAP combines cutting-edge concentrated liquidity technology with a user-friendly design, offering ultra-fast trades, near-zero fees, and seamless Telegram integration. It serves as a TON-native gateway for mobile-first DeFi access. TONSWAP creates sustained on-chain demand for XOR tokens by automatically allocating 10% of all trading fees to buy back and burn XOR, connecting TON ecosystem activity to the SORA economy.',
    category: 'defi',
    relatedTerms: ['DEX', 'TON', 'SORA', 'Cross-chain', 'Polkaswap', 'Telegram', 'Mobile', 'Liquidity', 'Bridge', 'Launchpad', 'CLMM', 'XOR', 'Buyback-and-burn'],
    examples: ['Mobile trading via Telegram', 'Concentrated liquidity provision', 'Token launchpad', 'Ultra-low fee swaps', 'Cross-chain liquidity access', 'XOR buyback mechanism'],
    links: [
      { label: 'TONSWAP Website', url: 'https://tonswap.org/' },
      { label: 'TONSWAP Roadmap', url: 'https://tonswap.org/roadmap' },
      { label: 'TONSWAP FAQ', url: 'https://tonswap.org/faq' }
    ]
  },
  'Liquidity Pool': {
    term: 'Liquidity Pool',
    definition: 'A collection of tokens locked in smart contracts to facilitate trading on DEXs. In Polkaswap\'s liquidity aggregation system, pools can come from various sources including AMM DEXs, order books, and algorithms. The platform aggregates liquidity from multiple pools to provide better prices and reduced impermanent loss through smart routing.',
    category: 'defi',
    relatedTerms: ['DEX', 'Liquidity Aggregation', 'Trading Fees', 'Yield Farming', 'Smart Routing', 'Impermanent Loss'],
    examples: ['XYK pools on Polkaswap', 'Multi-source liquidity aggregation', 'Cross-chain trading pools', 'Reduced pair fragmentation'],
    links: [
      { label: 'Polkaswap Liquidity', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Token Bonding Curve': {
    term: 'Token Bonding Curve',
    definition: 'A smart contract that manages the supply of XOR in a rational way without human involvement. The TBC automatically adjusts XOR supply based on economic conditions to maintain price stability, expanding supply during growth and contracting during decline.',
    category: 'economics',
    relatedTerms: ['XOR', 'Elastic Supply', 'Smart Contract', 'Price Stability', 'Supply Management'],
    examples: ['Automated supply adjustment', 'Price stability maintenance', 'Economic condition response'],
    links: [
      { label: 'SORA Wiki - Token Bonding Curve', url: 'https://wiki.sora.org/tbc.html' }
    ]
  },

  // Governance Terms
  'SORA Parliament': {
    term: 'SORA Parliament',
    definition: 'The future democratic governance system of SORA using multi-body sortition with clear separation of powers. The SORA Parliament will replace the current Governance V1 system, implementing sortition-based democracy where citizens are randomly selected (not token voting) and must post XOR bonds for citizenship. Features multiple bodies: Rules Committee, Agenda Council, Interest Panels, Review Panel, and Policy Jury. Main task is allocating newly minted XOR to productive projects. In SORA v3, the Parliament will integrate with a hybrid DAO framework using Iroha Special Instructions (ISIs) for modular governance logic.',
    category: 'governance',
    relatedTerms: ['XOR', 'VAL', 'Sortition', 'Citizenship', 'Multi-body Governance', 'Supranational', 'Governance V1', 'Iroha Special Instructions', 'ISI', 'SORA v3'],
    examples: ['Random citizen selection', 'XOR bond posting', 'Project funding allocation', 'Rules committee proposals', 'Modular governance'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' },
      { label: 'SORA Parliament Article', url: 'https://medium.com/sora-xor/the-sora-parliament-af8184dae384' }
    ]
  },
  'Referendum': {
    term: 'Referendum',
    definition: 'A Democracy Referendum in SORA\'s current governance system (Polkadot v1 Governance, also called Governance V1). After a Council Motion is approved by the SORA Council, it becomes a Democracy Referendum where the entire community can vote on specific proposals, parameter changes, or network upgrades. This differs from Polkadot OpenGov, which SORA v2 does not use.',
    category: 'governance',
    relatedTerms: ['SORA Council', 'Council Motion', 'Polkadot Governance', 'Governance V1', 'Democracy'],
    examples: ['Network fee changes', 'Token minting proposals', 'Parameter updates', 'On-chain community voting'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },

  // Economic Terms
  'Elastic Supply': {
    term: 'Elastic Supply',
    definition: 'A monetary policy where token supply automatically adjusts based on economic conditions and demand. Unlike conventional tokenomics with limited supply, SORA\'s XOR uses elastic supply managed by the Token Bonding Curve (TBC) smart contract without human involvement. The TBC manages XOR supply rationally to maintain price stability, with the supply expanding or contracting based on market conditions and economic activity.',
    category: 'economics',
    relatedTerms: ['XOR', 'Token Bonding Curve', 'Monetary Policy', 'Price Stability', 'Smart Contract', 'Economic Conditions'],
    examples: ['Supply expansion during growth', 'Supply contraction during decline', 'Automated price stability', 'TBC-managed supply'],
    links: [
      { label: 'SORA Tokenomics', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },
  'CBDC': {
    term: 'CBDC',
    definition: 'Central Bank Digital Currency - a digital form of a country\'s fiat currency issued by the central bank. SORAMITSU has successfully deployed multiple CBDCs including Cambodia\'s Bakong (8.5M users, $15.5M in payments), Lao CBDC pilot, and Fiji CBDC exploration. These blockchain-based systems enable financial inclusion, cross-border remittances, and interoperable digital payments.',
    category: 'economics',
    relatedTerms: ['SORAMITSU', 'Bakong', 'Digital Currency', 'Central Bank', 'Financial Inclusion', 'Cross-border Payments'],
    examples: ['Bakong (Cambodia)', 'Lao CBDC pilot', 'Fiji CBDC exploration', 'Digital payments', 'Financial inclusion'],
    links: [
      { label: 'CBDC Development in Asia-Pacific', url: 'https://www.japanpolicyforum.jp/economy/pt2024041523151814191.html' },
      { label: 'Bakong White Paper', url: 'https://bakong.nbc.gov.kh/download/NBC_BAKONG_White_Paper.pdf' },
      { label: 'Palau Digital Bonds', url: 'https://soramitsu.co.jp/palau-digital-bonds' }
    ]
  },

  // Network Terms
  'Validator': {
    term: 'Validator',
    definition: 'A network participant that validates transactions and maintains the blockchain. Validators in SORA secure the network and earn rewards for their services.',
    category: 'network',
    relatedTerms: ['Staking', 'Consensus', 'Security', 'Rewards'],
    examples: ['Transaction validation', 'Block production', 'Network security'],
    links: [
      { label: 'Validator Guide', url: 'https://wiki.sora.org/nominating-validators.html' }
    ]
  },
  'Staking': {
    term: 'Staking',
    definition: 'The process of locking tokens to support network security and earn rewards. SORA users can stake XOR tokens to validators and receive staking rewards.',
    category: 'network',
    relatedTerms: ['Validator', 'Rewards', 'Security', 'XOR'],
    examples: ['XOR staking', 'Validator selection', 'Reward earning'],
    links: [
      { label: 'Staking Guide', url: 'https://wiki.sora.org/nominating-validators.html' }
    ]
  },

  // SORA v3 Terms
  'SORA v3': {
    term: 'SORA v3',
    definition: 'SORA v3, also known as SORA Nexus, is the next generation of the SORA network. It transitions from Substrate-based SORA v2 to Hyperledger Iroha 3, introducing a modular, high-performance design to support scalability and cross-chain interoperability. The SORA v3 Hub Chain (or Hubchain) enables seamless collaboration between permissioned and decentralized systems, designed for CBDCs, government integration, and economic sovereignty while maintaining borderless financial activities. It serves as a supranational platform that de-correlates CBDCs and government-issued digital assets from political and economic instability, providing a stable foundation for global transactions.',
    category: 'technology',
    relatedTerms: ['Hyperledger Iroha', 'Hyperledger Iroha 2', 'Hyperledger Iroha 3', 'CBDC', 'Hub Chain', 'Hubchain', 'Nexus', 'Economic Sovereignty', 'KUSD', 'Fujiwara Testnet', 'Supranational Platform', 'SORA v2'],
    examples: ['Central bank digital currencies', 'Government asset creation', 'Permissioned subnets', 'Supranational platform', 'Cross-chain interoperability'],
    links: [
      { label: 'SORA v3 Guide', url: 'https://wiki.sora.org/sora-v3.html' }
    ]
  },
  'Fujiwara Testnet': {
    term: 'Fujiwara Testnet',
    definition: 'The first testnet for SORA v3, named after the influential Fujiwara family that shaped Japan\'s Heian period. This crucial milestone enables experimentation with key SORA v3 features including DeFi capabilities, SORA Parliament governance, and network stability testing. As the first public blockchain implementation of Iroha-based infrastructure, it provides valuable insights for the transition from private to public blockchain features.',
    category: 'technology',
    relatedTerms: ['SORA v3', 'Hyperledger Iroha', 'SORA Parliament', 'DeFi', 'Governance', 'Public Blockchain'],
    examples: ['DeFi experimentation', 'Governance participation', 'Network stability testing', 'Cross-border transactions'],
    links: [
      { label: 'Fujiwara Testnet Guide', url: 'https://wiki.sora.org/sora-v3.html#why-the-fujiwara-testnet-matters' }
    ]
  },
  'Hub Chain': {
    term: 'Hub Chain',
    definition: 'The core infrastructure of SORA v3 (also called Hubchain) that enables seamless collaboration between permissioned and decentralized systems. The SORA v3 Hub Chain bridges different blockchain networks (TON, Polkadot, Ethereum) and serves as a unified hub connecting external networks. It enables central banks and institutions to create their own assets on the global SORA v3 platform while maintaining security and interoperability through the supranational, decentralized blockchain.',
    category: 'technology',
    relatedTerms: ['SORA v3', 'Hubchain', 'Nexus', 'Cross-chain', 'Interoperability', 'Permissioned Subnets', 'Supranational Platform'],
    examples: ['Cross-chain asset transfers', 'CBDC infrastructure', 'Permissioned subnet connections', 'Multi-chain coordination'],
    links: [
      { label: 'SORA v3 Hub Chain', url: 'https://wiki.sora.org/sora-v3.html#the-sora-v3-hubchain' }
    ]
  },
  'Hubchain': {
    term: 'Hubchain',
    aliases: ['Hub Chain'],
    definition: 'Alternative name for the SORA v3 Hub Chain. See Hub Chain for full definition.',
    category: 'technology',
    relatedTerms: ['Hub Chain', 'SORA v3', 'Nexus'],
    examples: [],
    links: [
      { label: 'SORA v3 Hub Chain', url: 'https://wiki.sora.org/sora-v3.html#the-sora-v3-hubchain' }
    ]
  },
  'Nexus': {
    term: 'Nexus',
    definition: 'The code name for SORA v3, also referred to as SORA Nexus. Nexus represents the next-generation SORA Hub Chain designed to succeed the Substrate-based SORA v2 network, built on Hyperledger Iroha 3 for improved modularity, performance, and cross-chain interoperability.',
    category: 'technology',
    relatedTerms: ['SORA v3', 'Hub Chain', 'Hyperledger Iroha 3', 'SORA v2'],
    examples: ['SORA v3 (Nexus) upgrade', 'Next-generation network', 'Hyperledger Iroha 3 migration'],
    links: [
      { label: 'SORA v3 Guide', url: 'https://wiki.sora.org/sora-v3.html' }
    ]
  },
  'Kensetsu': {
    term: 'Kensetsu',
    definition: 'The Kensetsu Platform is SORA\'s version of MakerDAO, a decentralized finance (DeFi) solution on the SORA network that enables over-collateralized stablecoin creation and borrowing. The platform facilitates the creation and management of KUSD (Kensetsu USD), allowing users to create vaults, deposit collateral, and borrow stablecoins while maintaining value through algorithmic governance and stability mechanisms.',
    category: 'defi',
    relatedTerms: ['KUSD', 'MakerDAO', 'Vault', 'Over-collateralized', 'Stablecoin', 'DeFi'],
    examples: ['Vault creation', 'Over-collateralized borrowing', 'Stablecoin generation', 'Collateral management'],
    links: [
      { label: 'SORA Wiki - KUSD', url: 'https://wiki.sora.org/kusd.html' },
      { label: 'Kensetsu Vaults', url: 'https://wiki.sora.org/kensetsu-vaults.html' }
    ]
  },
  'BFT Consensus': {
    term: 'BFT Consensus',
    definition: 'Byzantine Fault Tolerance (BFT) consensus is a consensus mechanism that allows a distributed system to reach agreement even when some nodes fail or act maliciously. SORA v3 uses BFT consensus derived from Hyperledger Iroha 3\'s architecture, providing high-throughput transaction processing with deterministic finality. This differs from SORA v2\'s Substrate-based consensus, offering improved security and performance for enterprise-grade applications including CBDCs.',
    category: 'technology',
    relatedTerms: ['Consensus', 'Byzantine Fault Tolerance', 'Hyperledger Iroha 3', 'SORA v3', 'Finality', 'Security'],
    examples: ['Transaction validation', 'Network security', 'CBDC infrastructure', 'Enterprise blockchain'],
    links: [
      { label: 'SORA v3', url: 'https://wiki.sora.org/sora-v3.html' },
      { label: 'Hyperledger Iroha', url: 'https://docs.iroha.tech/' }
    ]
  },
  'Supranational Platform': {
    term: 'Supranational Platform',
    definition: 'A blockchain platform that operates above the level of individual nation states, enabling global coordination and collaboration without being subject to any single country\'s jurisdiction. SORA v3 serves as a supranational platform that de-correlates CBDCs and government-issued digital assets from political and economic instability, providing a stable foundation for global transactions. This design enables nations, institutions, and individuals to create assets and conduct transactions on a borderless, decentralized infrastructure.',
    category: 'network',
    relatedTerms: ['SORA v3', 'CBDC', 'Economic Sovereignty', 'Global Transactions', 'Borderless Finance'],
    examples: ['CBDC deployment', 'International remittances', 'Cross-border asset creation', 'Global economic coordination'],
    links: [
      { label: 'SORA v3 Hub Chain', url: 'https://wiki.sora.org/sora-v3.html#the-sora-v3-hubchain' }
    ]
  },
  'Economic Sovereignty': {
    term: 'Economic Sovereignty',
    definition: 'The ability of nations, institutions, or individuals to maintain control over their economic policies and financial systems while participating in a global economic network. SORA v3\'s Hub Chain supports economic sovereignty by balancing the role of nation states in managing their domains with the freedom of borderless financial activities. This enables countries to create their own digital assets (like CBDCs) on the SORA platform while maintaining independence and control.',
    category: 'economics',
    relatedTerms: ['SORA v3', 'CBDC', 'Supranational Platform', 'Sovereignty', 'Borderless Finance'],
    examples: ['CBDC creation', 'National digital currency', 'Independent monetary policy', 'Sovereign asset management'],
    links: [
      { label: 'SORA v3 Hub Chain', url: 'https://wiki.sora.org/sora-v3.html#the-sora-v3-hubchain' }
    ]
  },
  'Iroha Special Instructions': {
    term: 'Iroha Special Instructions',
    aliases: ['ISIs'],
    definition: 'Iroha Special Instructions (ISIs) are domain-oriented command sets in Hyperledger Iroha 3 that enable deterministic smart-contract logic. ISIs allow for modular governance logic and domain-specific operations, providing a flexible framework for building complex decentralized applications on SORA v3. This represents a key advancement over Hyperledger Iroha 2, offering enhanced programmability and interoperability.',
    category: 'technology',
    relatedTerms: ['Hyperledger Iroha 3', 'Smart Contract', 'SORA v3', 'Hyperledger Iroha', 'Governance', 'Deterministic'],
    examples: ['Governance modules', 'Domain-specific commands', 'Smart contract execution', 'Modular DApp development'],
    links: [
      { label: 'Hyperledger Iroha', url: 'https://docs.iroha.tech/' }
    ]
  },
  'Governance V1': {
    term: 'Governance V1',
    definition: 'The current governance system used by SORA v2, also known as Polkadot v1 Governance. Governance V1 consists of a Council, Technical Committee, and Parliament with on-chain proposals, referenda, and staking-based voting. Unlike Polkadot OpenGov, Governance V1 provides predictable proposal cycles and explicit decision-making processes. SORA v3 will evolve toward a hybrid DAO framework while maintaining the parliamentary structure for strategic oversight.',
    category: 'governance',
    relatedTerms: ['Governance', 'Polkadot Governance', 'Council', 'Referendum', 'SORA Parliament', 'OpenGov'],
    examples: ['Council proposals', 'Referendum voting', 'On-chain decision making', 'Network upgrades'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },

  // Additional DeFi Terms
  'Yield Farming': {
    term: 'Yield Farming',
    definition: 'A DeFi strategy where users provide liquidity to protocols and earn rewards. In Polkaswap, users can farm PSWAP tokens by providing liquidity to XYK pools, with rewards distributed through the platform\'s liquidity aggregation system. Polkaswap\'s unique infrastructure reduces impermanent loss risks while providing competitive yields through multi-source liquidity aggregation.',
    category: 'defi',
    relatedTerms: ['Liquidity Provision', 'PSWAP', 'XYK Pools', 'Liquidity Aggregation', 'Impermanent Loss'],
    examples: ['PSWAP token rewards', 'XYK pool liquidity provision', 'Multi-source yield optimization', 'Reduced IL farming'],
    links: [
      { label: 'Polkaswap Farming', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Impermanent Loss': {
    term: 'Impermanent Loss',
    definition: 'A temporary loss of value that can occur when providing liquidity to automated market makers (AMMs) due to price volatility of the paired assets. For example, if you provide 1 ETH and 2000 USDC to a pool, and ETH price doubles, you may end up with fewer ETH tokens when withdrawing due to the automated rebalancing.',
    category: 'defi',
    relatedTerms: ['Liquidity', 'AMM', 'Price Volatility', 'Risk'],
    examples: ['Liquidity provision risk', 'Price divergence', 'Temporary loss'],
    links: [
      { label: 'Understanding Impermanent Loss', url: 'https://wiki.sora.org/polkaswap.html' },
      { label: 'What is Impermanent Loss (Cointelegraph)', url: 'https://cointelegraph.com/explained/what-is-impermanent-loss-and-how-to-avoid-it' }
    ]
  },
  'Integrated Plan': {
    term: 'Integrated Plan',
    definition: 'A comprehensive development roadmap for the SORA ecosystem separated into Business, Backend, Web, and Mobile/Other tracks. The plan tracks development progress with completion percentages and includes key milestones like SORA v3 network launch, SORA Parliament implementation, and cross-chain infrastructure development.',
    category: 'governance',
    relatedTerms: ['SORA v3', 'SORA Parliament', 'Development Roadmap', 'Cross-chain', 'Infrastructure'],
    examples: ['Business partnerships', 'Technical development', 'Web interface updates', 'Mobile integration'],
    links: [
      { label: 'SORA Integrated Plan', url: 'https://wiki.sora.org/integrated-plan.html' }
    ]
  },
  'Smart Contract': {
    term: 'Smart Contract',
    definition: 'Self-executing contracts with the terms of the agreement directly written into code. In SORA, smart contracts like the Token Bonding Curve automatically manage token supply and economic parameters without human intervention.',
    category: 'technology',
    relatedTerms: ['Token Bonding Curve', 'Automation', 'Code', 'Blockchain'],
    examples: ['Token Bonding Curve', 'Automated supply management', 'Self-executing agreements'],
    links: []
  },
  'NFT': {
    term: 'NFT',
    definition: 'Non-Fungible Token - a unique digital asset that represents ownership of a specific item or piece of content on the blockchain. In the SORA ecosystem, NFTs can be minted, traded, and pooled on Polkaswap, with support for both divisible and extensible supply models. NFTs can be created using IPFS links or local file uploads.',
    category: 'technology',
    relatedTerms: ['Polkaswap', 'IPFS', 'Digital Asset', 'Blockchain', 'Divisible', 'Extensible Supply'],
    examples: ['Digital art', 'Collectibles', 'Unique tokens', 'Fractional ownership', 'Liquidity pooling'],
    aliases: ['NFTs', 'Non-Fungible Token', 'Non-Fungible Tokens'],
    links: [
      { label: 'SORA Wiki - NFTs', url: 'https://wiki.sora.org/nft-polkaswap.html' },
      { label: 'Polkaswap Exchange', url: 'https://polkaswap.io' }
    ]
  },
  'Cross-chain': {
    term: 'Cross-chain',
    definition: 'The ability to transfer assets and data between different blockchain networks. SORA enables cross-chain functionality through bridges and interoperability protocols, allowing users to trade assets from different blockchains on Polkaswap.',
    category: 'technology',
    relatedTerms: ['Polkaswap', 'Bridges', 'Interoperability', 'Blockchain Networks'],
    examples: ['Cross-chain trading', 'Asset transfers between networks', 'Multi-blockchain compatibility'],
    links: [
      { label: 'Polkaswap', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Deflationary': {
    term: 'Deflationary',
    definition: 'A tokenomic model where the total supply of tokens decreases over time. In SORA, both VAL and PSWAP are deflationary tokens - VAL tokens are burned on every network transaction, while PSWAP tokens are burned on every Polkaswap transaction, creating scarcity and potential value appreciation.',
    category: 'economics',
    relatedTerms: ['VAL', 'PSWAP', 'Token Burning', 'Scarcity', 'Supply Reduction'],
    examples: ['VAL transaction burning', 'PSWAP swap burning', 'Supply reduction over time'],
    links: [
      { label: 'SORA Tokenomics', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },
  'Buyback-and-burn': {
    term: 'Buyback-and-burn',
    definition: 'A tokenomic mechanism where tokens are purchased from the market and permanently destroyed. PSWAP uses a buyback-and-burn model where 0.3% of trading fees are used to buy PSWAP tokens from the market and burn them, reducing total supply and potentially increasing token value.',
    category: 'economics',
    relatedTerms: ['PSWAP', 'Deflationary', 'Token Burning', 'Trading Fees', 'Supply Reduction'],
    examples: ['PSWAP fee buybacks', 'Token destruction', 'Supply reduction mechanism'],
    links: [
      { label: 'PSWAP Tokenomics', url: 'https://wiki.sora.org/pswap.html' }
    ]
  },
  'Liquidity Aggregation': {
    term: 'Liquidity Aggregation',
    definition: 'A technology that combines liquidity from multiple sources (AMM DEXs, order books, algorithms) to provide better prices and reduced slippage. Polkaswap uses advanced liquidity aggregation to source the best prices from various liquidity pools and trading venues.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'Liquidity Pool', 'Smart Routing', 'Price Optimization', 'Multi-source'],
    examples: ['Multi-source liquidity', 'Best price discovery', 'Reduced slippage'],
    links: [
      { label: 'Polkaswap Liquidity', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Smart Routing': {
    term: 'Smart Routing',
    definition: 'An algorithm that automatically finds the optimal path for trading to minimize slippage and maximize returns. Polkaswap\'s smart routing analyzes multiple liquidity sources and automatically routes trades through the best available pools to provide optimal pricing.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'Liquidity Aggregation', 'Price Optimization', 'Slippage Reduction', 'Algorithm'],
    examples: ['Optimal trade routing', 'Price maximization', 'Slippage minimization'],
    links: [
      { label: 'Polkaswap Features', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Sortition': {
    term: 'Sortition',
    definition: 'A governance mechanism where participants are randomly selected to make decisions, rather than through voting or token holdings. The SORA Parliament uses sortition as one of its core principles, randomly choosing citizens to participate in governance bodies, ensuring fair representation and preventing plutocracy.',
    category: 'governance',
    relatedTerms: ['SORA Parliament', 'Governance', 'Random Selection', 'Democracy', 'Citizenship'],
    examples: ['Random citizen selection', 'Fair governance participation', 'Anti-plutocracy mechanism'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'HASHI': {
    term: 'HASHI',
    definition: 'SORA\'s decentralized and trustless cross-chain bridge that enables secure asset transfers between Ethereum and SORA networks. HASHI uses cryptographic proofs to validate transactions across chains, allowing users to move ERC-20 tokens between Ethereum and SORA mainnet without centralized intermediaries. The bridge is integrated with Polkaswap for seamless cross-chain trading.',
    category: 'technology',
    relatedTerms: ['Cross-chain', 'Bridges', 'Interoperability', 'Ethereum', 'ERC-20', 'Polkaswap', 'Trustless'],
    examples: ['ETH to SORA transfers', 'ERC-20 token bridging', 'Cross-chain trading', 'Decentralized asset movement'],
    links: [
      { label: 'Adding Tokens to HASHI Bridge', url: 'https://wiki.sora.org/adding-tokens-to-hashi-bridge.html' },
      { label: 'How to Use HASHI Bridge', url: 'https://medium.com/polkaswap-community-collective/how-to-use-the-hashi-bridge-eb69e88bc87' }
    ]
  },
  'Citizenship': {
    term: 'Citizenship',
    definition: 'A status in the SORA Parliament governance system where individuals become citizens by posting XOR bonds. Citizens are randomly selected through sortition to participate in various governance bodies and make decisions about XOR allocation to productive projects.',
    category: 'governance',
    relatedTerms: ['SORA Parliament', 'XOR', 'Sortition', 'Governance', 'Bond'],
    examples: ['XOR bond posting', 'Random selection participation', 'Governance body membership'],
    links: [
      { label: 'SORA Parliament', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'XYK Pools': {
    term: 'XYK Pools',
    definition: 'Constant Product Market Maker (CPMM) liquidity pools where the product of two token reserves remains constant (x * y = k). These are the primary liquidity pools on Polkaswap where users can provide liquidity and earn PSWAP rewards through yield farming.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'Liquidity Pool', 'Yield Farming', 'PSWAP', 'Constant Product'],
    examples: ['ETH/PSWAP pool', 'XOR/VAL pool', 'Liquidity provision'],
    links: [
      { label: 'Polkaswap Liquidity', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Financial Inclusion': {
    term: 'Financial Inclusion',
    definition: 'The principle of providing access to financial services to individuals and businesses who are excluded from traditional banking. CBDC implementations like Cambodia\'s Bakong promote financial inclusion by providing digital payment infrastructure to underserved populations.',
    category: 'economics',
    relatedTerms: ['CBDC', 'Digital Payments', 'Banking Access', 'Underserved Populations'],
    examples: ['Bakong digital payments', 'Mobile banking access', 'Rural financial services'],
    links: [
      { label: 'CBDC Development', url: 'https://www.japanpolicyforum.jp/economy/pt2024041523151814191.html' }
    ]
  },
  'Cross-border Payments': {
    term: 'Cross-border Payments',
    definition: 'Financial transactions between parties in different countries. CBDC implementations like Bakong enable faster, cheaper, and more efficient cross-border remittances by using blockchain technology to reduce intermediaries and settlement times.',
    category: 'economics',
    relatedTerms: ['CBDC', 'Remittances', 'International Transfer', 'Blockchain'],
    examples: ['Bakong remittances', 'International transfers', 'Reduced settlement times'],
    links: [
      { label: 'CBDC Development', url: 'https://www.japanpolicyforum.jp/economy/pt2024041523151814191.html' }
    ]
  },
  'Economic Conditions': {
    term: 'Economic Conditions',
    definition: 'Market factors and economic indicators that influence token supply and demand. In SORA\'s elastic supply model, the Token Bonding Curve responds to economic conditions by adjusting XOR supply - expanding during growth periods and contracting during decline to maintain price stability.',
    category: 'economics',
    relatedTerms: ['Elastic Supply', 'Token Bonding Curve', 'Price Stability', 'Market Conditions'],
    examples: ['Growth periods', 'Economic decline', 'Market volatility'],
    links: [
      { label: 'SORA Tokenomics', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },
  'Parallel Processing': {
    term: 'Parallel Processing',
    definition: 'The ability to process multiple transactions simultaneously across different blockchain networks. Polkadot parachains enable parallel processing by allowing multiple parachains to process transactions in parallel, significantly increasing overall network throughput compared to sequential processing.',
    category: 'technology',
    relatedTerms: ['Parachain', 'Polkadot', 'Throughput', 'Scalability'],
    examples: ['Simultaneous transactions', 'Increased throughput', 'Network scalability'],
    links: [
      { label: 'Polkadot Parachains', url: 'https://wiki.polkadot.com/learn/learn-parachains/' }
    ]
  },
  'Token Burning': {
    term: 'Token Burning',
    definition: 'The permanent removal of tokens from circulation by sending them to an unrecoverable address. In SORA, token burning is used as a deflationary mechanism - VAL tokens are burned on every network transaction, and PSWAP tokens are burned on every Polkaswap transaction to reduce supply over time.',
    category: 'economics',
    relatedTerms: ['VAL', 'PSWAP', 'Deflationary', 'Supply Reduction', 'Scarcity'],
    examples: ['VAL transaction burning', 'PSWAP swap burning', 'Supply reduction'],
    links: [
      { label: 'SORA Tokenomics', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },
  'Price Stability': {
    term: 'Price Stability',
    definition: 'The maintenance of relatively stable token prices over time through economic mechanisms. SORA\'s Token Bonding Curve maintains XOR price stability by automatically adjusting supply based on market conditions - expanding supply during price increases and contracting during price decreases.',
    category: 'economics',
    relatedTerms: ['Elastic Supply', 'Token Bonding Curve', 'Economic Conditions', 'Supply Management'],
    examples: ['Automatic supply adjustment', 'Price stabilization', 'Market response'],
    links: [
      { label: 'SORA Tokenomics', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },
  'SORAMITSU': {
    term: 'SORAMITSU',
    definition: 'A Japanese fintech company that develops blockchain infrastructure and digital identity solutions. SORAMITSU is the company behind the SORA network and has implemented successful CBDC projects including Cambodia\'s Bakong and Lao CBDC pilot.',
    category: 'network',
    relatedTerms: ['SORA Network', 'CBDC', 'Bakong', 'Hyperledger Iroha', 'Blockchain Infrastructure'],
    examples: ['SORA network development', 'Bakong CBDC implementation', 'Digital identity solutions'],
    links: [
      { label: 'SORAMITSU Website', url: 'https://soramitsu.co.jp/' }
    ]
  },
  'Polkadot': {
    term: 'Polkadot',
    definition: 'A heterogeneous multi-chain network that enables different blockchains to transfer messages and value in a trust-free fashion. Polkadot provides shared security, cross-chain interoperability, and parallel processing through its relay chain and parachain architecture.',
    category: 'network',
    relatedTerms: ['Parachain', 'Relay Chain', 'XCM', 'Shared Security', 'Cross-chain', 'Substrate'],
    examples: ['Multi-chain network', 'Parachain ecosystem', 'Cross-chain interoperability'],
    links: [
      { label: 'Polkadot Network', url: 'https://polkadot.network/' }
    ]
  },
  'DEX': {
    term: 'DEX',
    definition: 'Decentralized Exchange - a cryptocurrency exchange that operates without a central authority, allowing users to trade directly with each other through smart contracts. Polkaswap is SORA\'s DEX that provides cross-chain trading and liquidity aggregation.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'Liquidity Pool', 'Trading', 'Cross-chain', 'Smart Contracts'],
    examples: ['Polkaswap trading', 'Decentralized token swaps', 'Liquidity provision'],
    links: [
      { label: 'Polkaswap DEX', url: 'https://polkaswap.io' }
    ]
  },
  'XCM': {
    term: 'XCM',
    definition: 'Cross-Consensus Messaging - a messaging format that allows different consensus systems to communicate with each other. XCM enables interoperability between parachains in the Polkadot ecosystem, allowing SORA to communicate with other parachains.',
    category: 'technology',
    relatedTerms: ['Polkadot', 'Parachain', 'Cross-chain', 'Interoperability', 'Consensus'],
    examples: ['Parachain communication', 'Cross-chain messaging', 'Multi-chain interoperability'],
    links: [
      { label: 'XCM Documentation', url: 'https://wiki.polkadot.network/docs/learn-crosschain' }
    ]
  },
  'DeFi': {
    term: 'DeFi',
    definition: 'Decentralized Finance - financial services built on blockchain networks that operate without traditional financial intermediaries. SORA provides DeFi services through Polkaswap for trading, yield farming, and liquidity provision.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'Yield Farming', 'Liquidity Pool', 'DEX', 'Smart Contracts'],
    examples: ['Decentralized trading', 'Yield farming', 'Liquidity provision', 'Automated market making'],
    links: [
      { label: 'SORA DeFi', url: 'https://polkaswap.io' }
    ]
  },
  'AMM': {
    term: 'AMM',
    definition: 'Automated Market Maker - a protocol that uses mathematical formulas to price assets and provide liquidity automatically. Polkaswap uses AMM technology combined with liquidity aggregation to provide efficient trading with reduced impermanent loss.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'Liquidity Pool', 'Impermanent Loss', 'XYK Pools', 'Trading'],
    examples: ['Automated pricing', 'Constant product formula', 'Liquidity provision automation'],
    links: [
      { label: 'Polkaswap AMM', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Bakong': {
    term: 'Bakong',
    definition: 'Cambodia\'s national digital payment system built on blockchain technology by SORAMITSU. Bakong is one of the most successful CBDC implementations, with over 20 million users and $70 billion in transactions, demonstrating the potential of blockchain-based digital currencies.',
    category: 'economics',
    relatedTerms: ['CBDC', 'SORAMITSU', 'Digital Currency', 'Financial Inclusion', 'Cross-border Payments'],
    examples: ['National digital payments', '20+ million users', '$70B in transactions', 'Financial inclusion'],
    links: [
      { label: 'Bakong White Paper', url: 'https://bakong.nbc.gov.kh/download/NBC_BAKONG_White_Paper.pdf' }
    ]
  },
  'KUSD': {
    term: 'KUSD',
    definition: 'Kensetsu USD (KUSD) is an over-collateralized, algorithmically governed stablecoin built on the SORA network, pegged to the US Dollar. Built on the Kensetsu Platform (SORA\'s version of MakerDAO), KUSD facilitates secure borrowing operations while maintaining its value through robust stability mechanisms. In SORA v3 tokenomics, KUSD is used to pay builders instead of XOR. To maintain the KUSD peg, 19.5% of all SORA network transaction fees are allocated for buyback and burning of KUSD. Users can create vaults, deposit collateral (XOR, VAL, PSWAP, TBCD, ETH, or DAI), and borrow KUSD against their collateral.',
    category: 'token',
    relatedTerms: ['SORA Economy', 'Stable Asset', 'Kensetsu', 'MakerDAO', 'Builders', 'Funding', 'Over-collateralized', 'Vault', 'TBCD', 'SORA v3'],
    examples: ['Builder funding in SORA v3', 'Stable value borrowing', 'Over-collateralized lending', 'Vault creation and management'],
    links: [
      { label: 'SORA Wiki - KUSD', url: 'https://wiki.sora.org/kusd.html' },
      { label: 'Kensetsu Vaults', url: 'https://wiki.sora.org/kensetsu-vaults.html' }
    ]
  },
  'TBCD': {
    term: 'TBCD',
    definition: 'Token Bonding Curve Dollar (TBCD) is an algorithmic, non-synthetic stablecoin whose value is maintained by the SORA token bonding curve at approximately $1 USD. TBCD is convertible to XOR as a reserve asset of the token bonding curve and helps build up reserves while also being used to fund the creation of new goods and services via on-chain governance. In SORA v3 tokenomics, 0.5% of all network transaction fees are allocated for buyback and burning of TBCD. TBCD can only be created and allocated by on-chain governance, meaning XOR token holders decide the supply.',
    category: 'token',
    relatedTerms: ['Token Bonding Curve', 'Stable Asset', 'XOR', 'Reserve Asset', 'On-chain Governance', 'SORA v3', 'KUSD'],
    examples: ['Builder funding via governance', 'Token bonding curve reserves', 'Stable value asset', 'On-chain referendum allocation'],
    links: [
      { label: 'SORA Wiki - TBCD', url: 'https://wiki.sora.org/tbcd.html' },
      { label: 'Token Bonding Curve', url: 'https://wiki.sora.org/tbc.html' }
    ]
  },
  'TS': {
    term: 'TS',
    definition: 'The native token of TONSWAP, a decentralized exchange and launchpad built on The Open Network (TON) blockchain. TS powers platform governance, liquidity incentives, and transaction fee models. A key feature is that 10% of all TONSWAP trading fees are automatically allocated through integrated smart-contract logic to buy back and burn XOR tokens, creating sustained on-chain demand and reducing XOR circulating supply. This mechanism aligns TON ecosystem activity with the SORA economy by turning trading volume into a recurring XOR sink, benefiting both TON and SORA ecosystems.',
    category: 'token',
    relatedTerms: ['TONSWAP', 'TON', 'XOR', 'DEX', 'Governance', 'Liquidity', 'Deflationary', 'Cross-chain', 'Buyback-and-burn', 'Smart Contract'],
    examples: ['Platform governance', 'Liquidity incentives', 'Automatic XOR buyback mechanism', 'Transaction fee distribution', 'On-chain XOR demand creation'],
    links: [
      { label: 'TONSWAP Website', url: 'https://tonswap.org/' },
      { label: 'TONSWAP Roadmap', url: 'https://tonswap.org/roadmap' },
      { label: 'TONSWAP FAQ', url: 'https://tonswap.org/faq' }
    ]
  },
  'Relay Chain': {
    term: 'Relay Chain',
    definition: 'The central chain of the Polkadot network that provides security, consensus, and cross-chain interoperability for all connected parachains. The relay chain coordinates the entire network and enables shared security across all parachains.',
    category: 'network',
    relatedTerms: ['Polkadot', 'Parachain', 'Shared Security', 'Consensus', 'Cross-chain'],
    examples: ['Network coordination', 'Shared security provision', 'Consensus mechanism'],
    links: [
      { label: 'Polkadot Relay Chain', url: 'https://wiki.polkadot.network/docs/learn-architecture' }
    ]
  },
  'Shared Security': {
    term: 'Shared Security',
    definition: 'A security model where multiple blockchains share the same validator set and consensus mechanism. Polkadot\'s shared security allows parachains like SORA to benefit from the security of the entire network without maintaining their own validator set.',
    category: 'network',
    relatedTerms: ['Polkadot', 'Relay Chain', 'Parachain', 'Security', 'Validators'],
    examples: ['Network-wide security', 'Validator sharing', 'Reduced security costs'],
    links: [
      { label: 'Polkadot Security', url: 'https://wiki.polkadot.network/docs/learn-security' }
    ]
  },
  'SORA v2': {
    term: 'SORA v2',
    definition: 'The current version of the SORA network built on Substrate framework as a Polkadot parachain. SORA v2 provides DeFi services, cross-chain functionality, and serves as the foundation for the upcoming SORA v3 migration to Hyperledger Iroha.',
    category: 'network',
    relatedTerms: ['Substrate', 'Polkadot', 'Parachain', 'SORA v3', 'Hyperledger Iroha'],
    examples: ['Current SORA network', 'Substrate-based', 'Polkadot parachain'],
    links: [
      { label: 'SORA Network', url: 'https://sora.org/' }
    ]
  },
  'Governance': {
    term: 'Governance',
    definition: 'The system of decision-making and rule enforcement in blockchain networks. SORA v2 currently uses Polkadot v1 Governance (also called Governance V1), which consists of a Council, Technical Committee, and Parliament with on-chain proposals and referenda. The future SORA Parliament will implement sortition-based democracy with random citizen selection, moving toward a hybrid DAO framework in SORA v3.',
    category: 'governance',
    relatedTerms: ['SORA Parliament', 'Polkadot Governance', 'Governance V1', 'Democracy', 'Referendum', 'Council', 'Sortition'],
    examples: ['Network upgrades', 'Parameter changes', 'Project funding', 'Policy decisions', 'On-chain proposals'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'Democracy': {
    term: 'Democracy',
    definition: 'A governance system where decisions are made through collective participation. SORA implements democratic governance through referendum voting in the current system and will use sortition-based democracy in the SORA Parliament, ensuring fair representation without plutocracy.',
    category: 'governance',
    relatedTerms: ['SORA Parliament', 'Referendum', 'Sortition', 'Citizenship', 'Governance'],
    examples: ['Referendum voting', 'Sortition selection', 'Citizen participation', 'Fair representation'],
    links: [
      { label: 'SORA Democracy', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'SORA Council': {
    term: 'SORA Council',
    definition: 'A governance body in SORA\'s current Polkadot v1 governance system that consists of elected members who can propose referenda and veto dangerous proposals. The council plays a key role in the governance process before transitioning to the SORA Parliament.',
    category: 'governance',
    relatedTerms: ['Polkadot Governance', 'Referendum', 'Council Motion', 'Governance', 'Democracy'],
    examples: ['Proposal vetting', 'Referendum initiation', 'Governance oversight'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'Council Motion': {
    term: 'Council Motion',
    definition: 'A proposal submitted by the SORA Council in the current governance system. When a council motion is approved, it triggers a Democracy Referendum where token holders can vote on the proposal, enabling community participation in governance decisions.',
    category: 'governance',
    relatedTerms: ['SORA Council', 'Referendum', 'Democracy', 'Governance', 'Proposals'],
    examples: ['Council proposals', 'Referendum triggers', 'Governance participation'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'Polkadot Governance': {
    term: 'Polkadot Governance',
    definition: 'The governance system used by Polkadot and its parachains. SORA v2 uses Polkadot v1 Governance (also called Governance V1), which features council-based proposals, referendum voting, and technical committee oversight. This differs from Polkadot OpenGov, which SORA does not currently use. Governance V1 provides a robust framework for network decision-making with predictable proposal cycles.',
    category: 'governance',
    relatedTerms: ['SORA Council', 'Referendum', 'Democracy', 'Governance', 'Governance V1', 'Polkadot', 'OpenGov'],
    examples: ['Council elections', 'Referendum voting', 'Technical upgrades', 'On-chain proposals'],
    links: [
      { label: 'Polkadot Governance', url: 'https://wiki.polkadot.network/docs/learn-governance' }
    ]
  },
  'Liquidity': {
    term: 'Liquidity',
    definition: 'The availability of assets for trading without significantly affecting their price. In SORA\'s ecosystem, liquidity is provided through Polkaswap\'s aggregated pools, enabling efficient trading with reduced slippage and better price discovery.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'Liquidity Pool', 'Trading', 'Slippage', 'Price Discovery'],
    examples: ['Pool liquidity provision', 'Trading efficiency', 'Price stability'],
    links: [
      { label: 'Polkaswap Liquidity', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Trading Fees': {
    term: 'Trading Fees',
    definition: 'Charges applied to trading transactions on decentralized exchanges. In SORA, trading fees on Polkaswap are used for various purposes including PSWAP buyback-and-burn (0.3%), validator rewards, and network maintenance.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'PSWAP', 'Buyback-and-burn', 'Validators', 'Trading'],
    examples: ['Transaction charges', 'Fee distribution', 'Network maintenance'],
    links: [
      { label: 'Polkaswap Trading', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Consensus': {
    term: 'Consensus',
    definition: 'The mechanism by which blockchain networks agree on the validity of transactions and maintain a consistent state. SORA v2 uses Substrate-based consensus mechanisms (NPoS - Nominated Proof of Stake). SORA v3 will use Byzantine Fault Tolerance (BFT) consensus derived from Hyperledger Iroha 3\'s architecture, providing high-throughput transaction processing with deterministic finality, making it suitable for enterprise applications and CBDCs.',
    category: 'network',
    relatedTerms: ['Validator', 'Security', 'BFT Consensus', 'Byzantine Fault Tolerance', 'Substrate', 'Hyperledger Iroha', 'NPoS', 'SORA v2', 'SORA v3'],
    examples: ['Transaction validation', 'State agreement', 'Network security', 'Deterministic finality'],
    links: [
      { label: 'SORA Consensus', url: 'https://wiki.sora.org/consensus.html' }
    ]
  },
  'Security': {
    term: 'Security',
    definition: 'The protection of blockchain networks against attacks and malicious behavior. SORA implements multiple security layers including validator-based consensus, shared security through Polkadot, and cryptographic protection mechanisms.',
    category: 'network',
    relatedTerms: ['Validator', 'Consensus', 'Shared Security', 'Cryptography', 'Network Protection'],
    examples: ['Attack prevention', 'Data integrity', 'Network stability'],
    links: [
      { label: 'SORA Security', url: 'https://wiki.sora.org/' }
    ]
  },
  'Rewards': {
    term: 'Rewards',
    definition: 'Incentives distributed to network participants for contributing to network operations. In SORA, rewards include VAL tokens for validators and stakers, PSWAP tokens for liquidity providers, and XOR allocations for productive projects through governance.',
    category: 'defi',
    relatedTerms: ['Validator', 'Staking', 'PSWAP', 'Yield Farming', 'Governance'],
    examples: ['Validator rewards', 'Staking incentives', 'Liquidity provider rewards'],
    links: [
      { label: 'SORA Rewards', url: 'https://wiki.sora.org/' }
    ]
  },
  'Blockchain': {
    term: 'Blockchain',
    definition: 'A distributed ledger technology that maintains a continuously growing list of records secured using cryptography. SORA operates on blockchain technology, currently using Substrate framework and transitioning to Hyperledger Iroha for enhanced enterprise capabilities.',
    category: 'technology',
    relatedTerms: ['Distributed Ledger', 'Cryptography', 'Substrate', 'Hyperledger Iroha', 'Decentralization'],
    examples: ['Transaction records', 'Decentralized storage', 'Cryptographic security'],
    links: [
      { label: 'Blockchain Technology', url: 'https://en.wikipedia.org/wiki/Blockchain' },
      { label: 'Hyperledger Iroha', url: 'https://soramitsu.co.jp/iroha' }
    ]
  },
  'SORA Card': {
    term: 'SORA Card',
    definition: 'A decentralized debit card that allows users to spend their cryptocurrency in the real world. The SORA Card bridges the gap between digital assets and traditional commerce, enabling users to make purchases at any merchant that accepts card payments while maintaining the benefits of decentralized finance.',
    category: 'defi',
    relatedTerms: ['XOR', 'Polkaswap', 'Decentralized Finance', 'Real-world Payments', 'Cryptocurrency'],
    examples: ['Online purchases', 'Point-of-sale transactions', 'ATM withdrawals', 'International payments'],
    links: [
      { label: 'SORA Card Documentation', url: 'https://wiki.sora.org/sora-card.html' },
      { label: 'SORA Card KYC Tutorial', url: 'https://wiki.sora.org/sora-card-kyc-tutorial.html' }
    ]
  }
};

// Helper function to get term by key
export function getGlossaryTerm(key: string): GlossaryTerm | undefined {
  return soraGlossary[key];
}

// Helper function to get all terms
export function getAllGlossaryTerms(): GlossaryTerm[] {
  return Object.values(soraGlossary);
}

// Helper function to search terms
export function searchGlossaryTerms(query: string): GlossaryTerm[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(soraGlossary).filter(term => 
    term.term.toLowerCase().includes(lowercaseQuery) ||
    term.definition.toLowerCase().includes(lowercaseQuery) ||
    term.relatedTerms.some(related => related.toLowerCase().includes(lowercaseQuery))
  );
}

// Helper function to get terms by category
export function getGlossaryTermsByCategory(category: GlossaryTerm['category']): GlossaryTerm[] {
  return Object.values(soraGlossary).filter(term => term.category === category);
}
