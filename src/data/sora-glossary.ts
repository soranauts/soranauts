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
    definition: 'The primary utility token of the SORA network, used for transaction fees, governance voting, and as a store of value. XOR has an elastic supply model that adjusts based on economic conditions.',
    category: 'token',
    relatedTerms: ['VAL', 'PSWAP', 'Token Bonding Curve', 'Elastic Supply'],
    examples: ['Transaction fees', 'Governance voting', 'Staking rewards'],
    links: [
      { label: 'SORA Wiki - XOR', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },
  'VAL': {
    term: 'VAL',
    definition: 'A governance token in the SORA ecosystem that represents voting power in the SORA Parliament. VAL holders can participate in democratic decision-making processes.',
    category: 'governance',
    relatedTerms: ['XOR', 'SORA Parliament', 'Governance', 'Voting'],
    examples: ['Proposal voting', 'Parameter changes', 'Network upgrades'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'PSWAP': {
    term: 'PSWAP',
    definition: 'The native token of Polkaswap, SORA\'s decentralized exchange. PSWAP is used for liquidity provision rewards and governance of the DEX.',
    category: 'defi',
    relatedTerms: ['Polkaswap', 'DEX', 'Liquidity', 'Trading'],
    examples: ['Liquidity mining', 'Trading fees', 'DEX governance'],
    links: [
      { label: 'Polkaswap', url: 'https://polkaswap.io' }
    ]
  },

  // Technology Terms
  'Hyperledger Iroha': {
    term: 'Hyperledger Iroha',
    definition: 'A blockchain framework developed by SORAMITSU and now part of the Linux Foundation. SORA is built on Iroha, providing enterprise-grade security and scalability.',
    category: 'technology',
    relatedTerms: ['SORAMITSU', 'Blockchain', 'Enterprise', 'Linux Foundation'],
    examples: ['SORA network', 'Bakong CBDC', 'Enterprise solutions'],
    links: [
      { label: 'Hyperledger Iroha', url: 'https://iroha.readthedocs.io' }
    ]
  },
  'Substrate': {
    term: 'Substrate',
    definition: 'A modular blockchain framework developed by Parity Technologies. SORA v3 uses Substrate to integrate with the Polkadot ecosystem and enable cross-chain functionality.',
    category: 'technology',
    relatedTerms: ['Polkadot', 'Parachain', 'Cross-chain', 'SORA v3'],
    examples: ['Polkadot parachain', 'Cross-chain bridges', 'Modular development'],
    links: [
      { label: 'Substrate', url: 'https://substrate.io' }
    ]
  },
  'Parachain': {
    term: 'Parachain',
    definition: 'A parallel blockchain in the Polkadot ecosystem that connects to the main relay chain. SORA secured a parachain slot to integrate with Polkadot\'s shared security model.',
    category: 'network',
    relatedTerms: ['Polkadot', 'Relay Chain', 'Cross-chain', 'Shared Security'],
    examples: ['SORA parachain', 'Cross-chain transfers', 'Shared security'],
    links: [
      { label: 'Polkadot Parachains', url: 'https://polkadot.network/parachains' }
    ]
  },

  // DeFi Terms
  'Polkaswap': {
    term: 'Polkaswap',
    definition: 'SORA\'s decentralized exchange (DEX) that enables cross-chain trading and liquidity aggregation. It supports trading between assets from different blockchains without bridges.',
    category: 'defi',
    relatedTerms: ['DEX', 'Cross-chain', 'Liquidity', 'PSWAP'],
    examples: ['Cross-chain trading', 'Liquidity provision', 'Token swaps'],
    links: [
      { label: 'Polkaswap Exchange', url: 'https://polkaswap.io' }
    ]
  },
  'Liquidity Pool': {
    term: 'Liquidity Pool',
    definition: 'A collection of tokens locked in a smart contract to facilitate trading on a DEX. Users provide liquidity and earn fees from trading activity.',
    category: 'defi',
    relatedTerms: ['DEX', 'Liquidity', 'Trading Fees', 'Yield Farming'],
    examples: ['XOR/PSWAP pool', 'ETH/BTC pool', 'Liquidity mining'],
    links: [
      { label: 'Liquidity Pools Guide', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Token Bonding Curve': {
    term: 'Token Bonding Curve',
    definition: 'A mathematical model that determines token price based on supply and demand. SORA uses bonding curves to create elastic money that adjusts to economic conditions.',
    category: 'economics',
    relatedTerms: ['Elastic Supply', 'XOR', 'Price Discovery', 'Economic Model'],
    examples: ['XOR price mechanism', 'Supply adjustments', 'Economic stability'],
    links: [
      { label: 'SORA Tokenomics', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },

  // Governance Terms
  'SORA Parliament': {
    term: 'SORA Parliament',
    definition: 'The democratic governance system of SORA where VAL token holders vote on proposals, parameter changes, and network upgrades. It ensures decentralized decision-making.',
    category: 'governance',
    relatedTerms: ['VAL', 'Governance', 'Voting', 'Democracy'],
    examples: ['Proposal voting', 'Parameter changes', 'Network upgrades'],
    links: [
      { label: 'SORA Governance', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },
  'Referendum': {
    term: 'Referendum',
    definition: 'A democratic voting process in SORA where community members vote on specific proposals or changes to the network. Referendums ensure transparent decision-making.',
    category: 'governance',
    relatedTerms: ['SORA Parliament', 'Voting', 'Proposals', 'Democracy'],
    examples: ['Parameter changes', 'Feature additions', 'Network upgrades'],
    links: [
      { label: 'Governance Process', url: 'https://wiki.sora.org/sora-governance.html' }
    ]
  },

  // Economic Terms
  'Elastic Supply': {
    term: 'Elastic Supply',
    definition: 'A monetary policy where token supply automatically adjusts based on economic conditions and demand. SORA\'s XOR uses elastic supply to maintain price stability.',
    category: 'economics',
    relatedTerms: ['XOR', 'Token Bonding Curve', 'Monetary Policy', 'Price Stability'],
    examples: ['Supply expansion', 'Supply contraction', 'Price stability'],
    links: [
      { label: 'SORA Economics', url: 'https://wiki.sora.org/tokenomics.html' }
    ]
  },
  'CBDC': {
    term: 'CBDC',
    definition: 'Central Bank Digital Currency - a digital form of a country\'s fiat currency issued by the central bank. SORAMITSU has successfully deployed CBDCs like Cambodia\'s Bakong.',
    category: 'economics',
    relatedTerms: ['SORAMITSU', 'Bakong', 'Digital Currency', 'Central Bank'],
    examples: ['Bakong (Cambodia)', 'Digital payments', 'Financial inclusion'],
    links: [
      { label: 'Bakong CBDC', url: 'https://soramitsu.co.jp/projects/bakong' }
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
    definition: 'The latest version of SORA that integrates with Polkadot as a parachain, enabling cross-chain functionality and enhanced DeFi capabilities.',
    category: 'technology',
    relatedTerms: ['Polkadot', 'Parachain', 'Cross-chain', 'DeFi'],
    examples: ['Polkadot integration', 'Cross-chain bridges', 'Enhanced DeFi'],
    links: [
      { label: 'SORA v3 Guide', url: 'https://wiki.sora.org/sora-v3.html' }
    ]
  },
  'Fujiwara Testnet': {
    term: 'Fujiwara Testnet',
    definition: 'SORA v3\'s test network where new features and upgrades are tested before mainnet deployment. It allows developers and users to experiment with new functionality.',
    category: 'technology',
    relatedTerms: ['SORA v3', 'Testnet', 'Development', 'Testing'],
    examples: ['Feature testing', 'Development environment', 'User experimentation'],
    links: [
      { label: 'Fujiwara Testnet', url: 'https://wiki.sora.org/fujiwara-testnet.html' }
    ]
  },

  // Additional DeFi Terms
  'Yield Farming': {
    term: 'Yield Farming',
    definition: 'A DeFi strategy where users provide liquidity to protocols and earn rewards in the form of additional tokens. Common in Polkaswap and other SORA DeFi protocols.',
    category: 'defi',
    relatedTerms: ['Liquidity', 'Rewards', 'DeFi', 'PSWAP'],
    examples: ['Liquidity provision', 'Token rewards', 'APY earning'],
    links: [
      { label: 'Yield Farming Guide', url: 'https://wiki.sora.org/polkaswap.html' }
    ]
  },
  'Impermanent Loss': {
    term: 'Impermanent Loss',
    definition: 'A temporary loss of value that can occur when providing liquidity to automated market makers (AMMs) due to price volatility of the paired assets.',
    category: 'defi',
    relatedTerms: ['Liquidity', 'AMM', 'Price Volatility', 'Risk'],
    examples: ['Liquidity provision risk', 'Price divergence', 'Temporary loss'],
    links: [
      { label: 'Understanding Impermanent Loss', url: 'https://wiki.sora.org/polkaswap.html' }
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
