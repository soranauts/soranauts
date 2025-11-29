export const TAG_HUB_DOMAINS = ['ecosystem', 'defi', 'economics', 'governance', 'technology', 'network'] as const;
export type TagHubDomain = (typeof TAG_HUB_DOMAINS)[number];

export const TAG_HUB_TRAITS = [
  'foundational',
  'glossary-linked',
  'beginner-friendly',
  'advanced',
  'trending',
  'builder-guide',
] as const;
export type TagHubTrait = (typeof TAG_HUB_TRAITS)[number];

export interface TagHubMetadataEntry {
  summary?: string;
  domain: TagHubDomain;
  traits?: TagHubTrait[];
  quickPathIds?: string[];
  featured?: boolean;
  weight?: number;
  /**
   * Optional canonical glossary slug to force-link tag detail pages to the right entry
   * when legacy taxonomy data points to an alias (e.g. SORA previously pointed to TONSWAP).
   */
  glossarySlug?: string;
}

export interface TagHubQuickPath {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export const CANONICAL_TAGS = [
  'adoption',
  'analytics',
  'blockchain',
  'bonding-curve',
  'bridges',
  'council',
  'cross-chain',
  'decentralization',
  'defi',
  'dex',
  'economics',
  'elastic-supply',
  'explorer',
  'fearless-wallet',
  'governance',
  'hashi',
  'hyperledger',
  'interoperability',
  'iroha',
  'iroha3',
  'kensetsu',
  'kusd',
  'liquidity',
  'marketplace',
  'mobile',
  'nft',
  'parachain',
  'parliament',
  'payments',
  'polkaswap',
  'proposal',
  'pswap',
  'real-world-assets',
  'referendum',
  'roadmap',
  'security',
  'sora',
  'sora-card',
  'stablecoin',
  'staking',
  'substrate',
  'tbcd',
  'telegram',
  'tokenization',
  'tokenomics',
  'ton',
  'tonswap',
  'val',
  'validator',
  'voting',
  'wallet',
  'xor',
] as const;

const CANONICAL_TAG_SET = new Set<string>(CANONICAL_TAGS);

export const isCanonicalTag = (value?: string | null): boolean => {
  if (!value) return false;
  const normalized = value
    .toString()
    .toLowerCase()
    .replace(/^tag-/, '')
    .trim();
  return CANONICAL_TAG_SET.has(normalized);
};

export const tagHubMetadata: Record<string, TagHubMetadataEntry> = {
  'tag-sora': {
    domain: 'ecosystem',
    summary:
      'SORA is a decentralized economic system for coordinating global projects, cross-chain liquidity, and identity across the Polkaswap ecosystem.',
    traits: ['foundational', 'glossary-linked', 'beginner-friendly'],
    quickPathIds: ['new-to-sora'],
    featured: true,
    weight: 100,
    glossarySlug: 'sora',
  },
  'tag-xor': {
    domain: 'economics',
    summary:
      'XOR is the elastic-supply utility token that powers SORA network fees, liquidity incentives, and future governance.',
    traits: ['foundational', 'glossary-linked'],
    quickPathIds: ['new-to-sora', 'governance-economics'],
    weight: 95,
  },
  'tag-polkaswap': {
    domain: 'defi',
    summary:
      'Polkaswap is SORA’s cross-chain AMM for token swaps, routing liquidity across Polkadot and partner ecosystems.',
    traits: ['foundational', 'glossary-linked'],
    quickPathIds: ['new-to-sora', 'defi-power-user'],
    featured: true,
    weight: 92,
  },
  'tag-defi': {
    domain: 'defi',
    summary:
      'Decentralized finance concepts, tooling, and strategies inside the SORA and Polkaswap ecosystems.',
    traits: ['foundational', 'beginner-friendly'],
    quickPathIds: ['new-to-sora', 'defi-power-user'],
    weight: 90,
  },
  'tag-tokenomics': {
    domain: 'economics',
    summary:
      'Tokenomics explores supply design, burn models, and incentive loops that guide SORA’s economic roadmap.',
    traits: ['glossary-linked'],
    quickPathIds: ['governance-economics'],
  },
  'tag-governance': {
    domain: 'governance',
    summary:
      'On-chain decision making, bodies, and participation mechanisms that steer the SORA network.',
    traits: ['glossary-linked'],
    quickPathIds: ['governance-economics'],
  },
  'tag-sora-parliament': {
    domain: 'governance',
    summary:
      'SORA Parliament is the elected governance body coordinating treasury spending and strategic programs.',
    traits: ['advanced', 'glossary-linked'],
    quickPathIds: ['governance-economics'],
  },
  'tag-treasury': {
    domain: 'economics',
    summary:
      'The SORA treasury manages network resources, community initiatives, and long-term liquidity deployment.',
    traits: ['advanced'],
    quickPathIds: ['governance-economics'],
  },
  'tag-kusd': {
    domain: 'economics',
    summary:
      'KUSD is the Kensetsu-issued stable asset tuned for Polkaswap trading pairs and SORA payment flows.',
    traits: ['trending'],
    quickPathIds: ['governance-economics', 'defi-power-user'],
  },
  'tag-kensetsu': {
    domain: 'defi',
    summary:
      'Kensetsu vaults enable collateralized debt positions, stability fees, and risk parameters across SORA.',
    traits: ['advanced'],
    quickPathIds: ['defi-power-user'],
  },
  'tag-staking': {
    domain: 'defi',
    summary:
      'Staking in SORA secures validators, distributes rewards, and anchors long-term liquidity strategies.',
    traits: ['foundational'],
    quickPathIds: ['defi-power-user'],
  },
  'tag-liquidity': {
    domain: 'defi',
    summary:
      'Liquidity provisioning strategies for Polkaswap pools, external bridges, and incentive campaigns.',
    traits: ['advanced'],
    quickPathIds: ['defi-power-user'],
  },
  'tag-sora-card': {
    domain: 'ecosystem',
    summary:
      'SORA Card links DeFi balances to everyday spending with compliance-ready issuance across supported regions.',
    traits: ['beginner-friendly'],
    quickPathIds: ['new-to-sora'],
  },
  'tag-tonswap': {
    domain: 'defi',
    summary:
      'TONSwap brings SORA-built AMM technology to the TON ecosystem with cross-chain liquidity experiments.',
    traits: ['trending'],
    quickPathIds: ['defi-power-user'],
  },
  'tag-hyperledger-iroha-3': {
    domain: 'technology',
    summary:
      'Hyperledger Iroha 3 is the modular Rust-based framework powering SORA v3’s deterministic smart contracts.',
    traits: ['builder-guide', 'glossary-linked'],
  },
  'tag-wasm': {
    domain: 'technology',
    summary:
      'WebAssembly execution for predictable smart contracts and cross-language tooling on SORA infrastructure.',
    traits: ['builder-guide'],
  },
  'tag-cross-chain': {
    domain: 'network',
    summary:
      'Cross-chain architecture, bridges, and routing that connect SORA liquidity with external ecosystems.',
    traits: ['advanced'],
  },
  'tag-validator': {
    domain: 'network',
    summary:
      'Validators secure consensus, produce blocks, and stabilize SORA’s hybrid economic design.',
    traits: ['advanced'],
  },
};

export const tagHubQuickPaths: TagHubQuickPath[] = [
  {
    id: 'new-to-sora',
    title: 'New to SORA',
    description: 'Start here to understand the SORA network, its tokens, and core user flows.',
    tags: ['tag-sora', 'tag-xor', 'tag-polkaswap', 'tag-sora-card', 'tag-defi'],
  },
  {
    id: 'governance-economics',
    title: 'Governance & Economics',
    description: 'Dive into treasury mechanics, Parliament processes, and economic primitives.',
    tags: ['tag-governance', 'tag-parliament', 'tag-tokenomics', 'tag-kusd'],
  },
  {
    id: 'defi-power-user',
    title: 'DeFi Power User',
    description: 'Advanced liquidity, staking, and Kensetsu vault strategies for Polkaswap.',
    tags: ['tag-defi', 'tag-liquidity', 'tag-staking', 'tag-kensetsu', 'tag-tonswap'],
  },
];



