// SORA Glossary Data
// Comprehensive definitions for SORA ecosystem terms

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'token' | 'technology' | 'governance' | 'defi' | 'network' | 'economics';
  relatedTerms: string[];
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
    definition: 'An open-source, permissioned blockchain framework developed by SORAMITSU and part of the Hyperledger Foundation. Designed for simplicity and fast deployment with granular permissions, built-in asset management, and Byzantine fault tolerant consensus. Iroha 2 (written in Rust) adds WASM smart contracts and improved performance, making it suitable for enterprise systems, CBDCs, and national-level financial infrastructure.',
    category: 'technology',
    relatedTerms: ['SORAMITSU', 'Hyperledger Foundation', 'Permissioned Blockchain', 'CBDC', 'Enterprise', 'WASM'],
    examples: ['SORA network', 'Bakong CBDC', 'Enterprise systems', 'National financial infrastructure'],
    links: [
      { label: 'Hyperledger Iroha', url: 'https://iroha.readthedocs.io' }
    ]
  },
  'Substrate': {
    term: 'Substrate',
    definition: 'A modular blockchain framework developed by Parity Technologies. SORA v2 uses Substrate to integrate with the Polkadot ecosystem and enable cross-chain functionality, while SORA v3 is migrating away from Substrate to Hyperledger Iroha for improved efficiency and enterprise integration.',
    category: 'technology',
    relatedTerms: ['Polkadot', 'Parachain', 'Cross-chain', 'SORA v2', 'SORA v3', 'Hyperledger Iroha'],
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
    definition: 'A next-generation decentralized exchange (DEX) and launchpad built on The Open Network (TON) blockchain. TONSWAP combines cutting-edge concentrated liquidity technology with a user-friendly design, offering ultra-fast trades, near-zero fees, and seamless Telegram integration. It serves as a TON-native gateway for mobile-first DeFi access.',
    category: 'defi',
    relatedTerms: ['DEX', 'TON', 'SORA', 'Cross-chain', 'Polkaswap', 'Telegram', 'Mobile', 'Liquidity', 'Bridge', 'Launchpad', 'CLMM'],
    examples: ['Mobile trading via Telegram', 'Concentrated liquidity provision', 'Token launchpad', 'Ultra-low fee swaps', 'Cross-chain liquidity access'],
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
    definition: 'The democratic governance system of SORA using multi-body sortition with clear separation of powers. Citizens are randomly selected (not token voting) and must post XOR bonds for citizenship. Features multiple bodies: Rules Committee, Agenda Council, Interest Panels, Review Panel, and Policy Jury. Main task is allocating newly minted XOR to productive projects.',
    category: 'governance',
    relatedTerms: ['XOR', 'VAL', 'Sortition', 'Citizenship', 'Multi-body Governance', 'Supranational'],
    examples: ['Random citizen selection', 'XOR bond posting', 'Project funding allocation', 'Rules committee proposals'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' },
      { label: 'SORA Parliament Article', url: 'https://medium.com/sora-xor/the-sora-parliament-af8184dae384' }
    ]
  },
  'Referendum': {
    term: 'Referendum',
    definition: 'A Democracy Referenda in SORA\'s current governance system (Polkadot v1 Governance). After a Council Motion is approved by the SORA Council, it becomes a Democracy Referenda where the entire community can vote on specific proposals, parameter changes, or network upgrades.',
    category: 'governance',
    relatedTerms: ['SORA Council', 'Council Motion', 'Polkadot Governance', 'Democracy'],
    examples: ['Network fee changes', 'Token minting proposals', 'Parameter updates'],
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
    definition: 'The latest version of SORA built on Hyperledger Iroha 2, featuring the SORA v3 Hub Chain that enables seamless collaboration between permissioned and decentralized systems. Designed for CBDCs, government integration, and economic sovereignty while maintaining borderless financial activities.',
    category: 'technology',
    relatedTerms: ['Hyperledger Iroha', 'CBDC', 'Hub Chain', 'Economic Sovereignty', 'KUSD', 'Fujiwara Testnet'],
    examples: ['Central bank digital currencies', 'Government asset creation', 'Permissioned subnets', 'Supranational platform'],
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
    definition: 'A stable asset in the SORA Economy designed for funding and rewarding builders. KUSD provides price stability for ecosystem participants and is part of SORA\'s comprehensive tokenomics system alongside XOR, VAL, and PSWAP.',
    category: 'token',
    relatedTerms: ['SORA Economy', 'Stable Asset', 'Builders', 'Funding', 'Rewards'],
    examples: ['Builder funding', 'Stable value storage', 'Ecosystem rewards'],
    links: [
      { label: 'SORA Tokenomics', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },
  'TS': {
    term: 'TS',
    definition: 'The native token of TONSWAP, a decentralized exchange and launchpad built on The Open Network (TON) blockchain. TS powers platform governance, liquidity incentives, and transaction fee models, with 10% of all trading fees used to buy back and burn XOR tokens, creating a deflationary mechanism that benefits both TON and SORA ecosystems.',
    category: 'token',
    relatedTerms: ['TONSWAP', 'TON', 'XOR', 'DEX', 'Governance', 'Liquidity', 'Deflationary', 'Cross-chain'],
    examples: ['Platform governance', 'Liquidity incentives', 'XOR buyback mechanism', 'Transaction fee distribution'],
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
    definition: 'The system of decision-making and rule enforcement in blockchain networks. SORA implements multiple governance mechanisms including the current Polkadot v1 governance system and the future SORA Parliament with sortition-based democracy.',
    category: 'governance',
    relatedTerms: ['SORA Parliament', 'Polkadot Governance', 'Democracy', 'Referendum', 'Council'],
    examples: ['Network upgrades', 'Parameter changes', 'Project funding', 'Policy decisions'],
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
    definition: 'The governance system used by Polkadot and its parachains, including SORA\'s current governance model. It features council-based proposals, referendum voting, and technical committee oversight, providing a robust framework for network decision-making.',
    category: 'governance',
    relatedTerms: ['SORA Council', 'Referendum', 'Democracy', 'Governance', 'Polkadot'],
    examples: ['Council elections', 'Referendum voting', 'Technical upgrades'],
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
    definition: 'The mechanism by which blockchain networks agree on the validity of transactions and maintain a consistent state. SORA uses various consensus mechanisms depending on the version - Substrate consensus in v2 and Byzantine Fault Tolerance (BFT) consensus in Hyperledger Iroha for v3.',
    category: 'network',
    relatedTerms: ['Validator', 'Security', 'BFT', 'Substrate', 'Hyperledger Iroha'],
    examples: ['Transaction validation', 'State agreement', 'Network security'],
    links: [
      { label: 'SORA Consensus', url: 'https://wiki.sora.org/' }
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
