/**
 * Glossary configuration and canonical term whitelist
 * 
 * This file defines which glossary terms are considered "canonical"
 * for display purposes when status is not explicitly set.
 */

/**
 * Canonical term whitelist - terms that should always be shown
 * even if they don't have an explicit status field
 */
const CANONICAL_TERM_SLUGS = new Set([
  'xor',
  'val',
  'pswap',
  'sora',
  'polkaswap',
  'tonswap',
  'sora-parliament',
  'hyperledger-iroha',
  'hyperledger-iroha-2',
  'hyperledger-iroha-3',
  'substrate',
  'parachain',
  'ipfs',
  'dex',
  'liquidity-pool',
  'token-bonding-curve',
  'staking',
  'validator',
  'sora-v3',
  'fujiwara-testnet',
  'hub-chain',
  'nexus',
  'kensetsu',
  'bft-consensus',
  'governance',
  'democracy',
  'sora-council',
  'referendum',
  'defi',
  'amm',
  'xyk-pools',
  'cross-chain',
  'cbdc',
  'bakong',
  'kusd',
  'tbcd',
  'elastic-supply',
  'buyback-and-burn',
  'liquidity-aggregation',
  'smart-routing',
  'sortition',
  'hashi',
  'citizenship',
  'financial-inclusion',
  'cross-border-payments',
  'economic-conditions',
  'parallel-processing',
  'token-burning',
  'price-stability',
  'soramitsu',
  'polkadot',
  'relay-chain',
  'shared-security',
  'sora-v2',
  'polkadot-governance',
  'liquidity',
  'trading-fees',
  'consensus',
  'smart-contract',
  'nft',
  'yield-farming',
  'impermanent-loss',
  'economic-sovereignty',
  'supranational-platform',
  'iroha-special-instructions',
  'governance-v1',
  'integrated-plan',
]);

/**
 * Check if a glossary term slug is considered canonical
 * @param slug - The term slug to check
 * @returns true if the term is in the canonical whitelist
 */
export function isCanonicalGlossaryTerm(slug: string): boolean {
  if (!slug) return false;
  return CANONICAL_TERM_SLUGS.has(slug.toLowerCase());
}

export type GlossaryStatus = 'canonical' | 'deprecated' | 'alias';

export interface GlossaryTerm {
  slug: string;
  title: string;
  summary?: string;
  status: GlossaryStatus;
  targetSlug?: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { slug: 'adoption', title: 'Adoption', summary: 'TODO', status: 'canonical' },
  { slug: 'analytics', title: 'Analytics', summary: 'TODO', status: 'canonical' },
  { slug: 'blockchain', title: 'Blockchain', summary: 'TODO', status: 'canonical' },
  { slug: 'bonding-curve', title: 'Bonding Curve', summary: 'TODO', status: 'canonical' },
  { slug: 'bridges', title: 'Bridges', summary: 'TODO', status: 'canonical' },
  { slug: 'council', title: 'Council', summary: 'TODO', status: 'canonical' },
  { slug: 'cross-chain', title: 'Cross Chain', summary: 'TODO', status: 'canonical' },
  { slug: 'decentralization', title: 'Decentralization', summary: 'TODO', status: 'canonical' },
  { slug: 'defi', title: 'DeFi', summary: 'TODO', status: 'canonical' },
  { slug: 'dex', title: 'DEX', summary: 'TODO', status: 'canonical' },
  { slug: 'economics', title: 'Economics', summary: 'TODO', status: 'canonical' },
  { slug: 'elastic-supply', title: 'Elastic Supply', summary: 'TODO', status: 'canonical' },
  { slug: 'explorer', title: 'Explorer', summary: 'TODO', status: 'canonical' },
  { slug: 'fearless-wallet', title: 'Fearless Wallet', summary: 'TODO', status: 'canonical' },
  { slug: 'governance', title: 'Governance', summary: 'TODO', status: 'canonical' },
  { slug: 'hashi', title: 'HASHI', summary: 'TODO', status: 'canonical' },
  { slug: 'hyperledger', title: 'Hyperledger', summary: 'TODO', status: 'canonical' },
  { slug: 'hyperledger-iroha', title: 'Hyperledger Iroha', summary: 'TODO', status: 'alias', targetSlug: 'iroha' },
  { slug: 'hyperledger-iroha-3', title: 'Hyperledger Iroha 3', summary: 'TODO', status: 'alias', targetSlug: 'iroha3' },
  { slug: 'interoperability', title: 'Interoperability', summary: 'TODO', status: 'canonical' },
  { slug: 'iroha', title: 'Iroha', summary: 'TODO', status: 'canonical' },
  { slug: 'iroha3', title: 'Iroha 3', summary: 'TODO', status: 'canonical' },
  { slug: 'kensetsu', title: 'Kensetsu', summary: 'TODO', status: 'canonical' },
  { slug: 'kusd', title: 'KUSD', summary: 'TODO', status: 'canonical' },
  { slug: 'liquidity', title: 'Liquidity', summary: 'TODO', status: 'canonical' },
  { slug: 'marketplace', title: 'Marketplace', summary: 'TODO', status: 'canonical' },
  { slug: 'mobile', title: 'Mobile', summary: 'TODO', status: 'canonical' },
  { slug: 'nft', title: 'NFT', summary: 'TODO', status: 'canonical' },
  { slug: 'parachain', title: 'Parachain', summary: 'TODO', status: 'canonical' },
  { slug: 'parliament', title: 'Parliament', summary: 'TODO', status: 'canonical' },
  { slug: 'payments', title: 'Payments', summary: 'TODO', status: 'canonical' },
  { slug: 'polkaswap', title: 'Polkaswap', summary: 'TODO', status: 'canonical' },
  { slug: 'proposal', title: 'Proposal', summary: 'TODO', status: 'canonical' },
  { slug: 'pswap', title: 'PSWAP', summary: 'TODO', status: 'canonical' },
  { slug: 'real-world-assets', title: 'Real-World Assets', summary: 'TODO', status: 'canonical' },
  { slug: 'referendum', title: 'Referendum', summary: 'TODO', status: 'canonical' },
  { slug: 'roadmap', title: 'Roadmap', summary: 'TODO', status: 'canonical' },
  { slug: 'security', title: 'Security', summary: 'TODO', status: 'canonical' },
  { slug: 'sora', title: 'SORA', summary: 'TODO', status: 'canonical' },
  { slug: 'sora-card', title: 'SORA Card', summary: 'TODO', status: 'canonical' },
  { slug: 'sora-council', title: 'SORA Council', summary: 'TODO', status: 'alias', targetSlug: 'council' },
  { slug: 'sora-parliament', title: 'SORA Parliament', summary: 'TODO', status: 'alias', targetSlug: 'parliament' },
  { slug: 'stablecoin', title: 'Stablecoin', summary: 'TODO', status: 'canonical' },
  { slug: 'staking', title: 'Staking', summary: 'TODO', status: 'canonical' },
  { slug: 'substrate', title: 'Substrate', summary: 'TODO', status: 'canonical' },
  { slug: 'tbcd', title: 'TBCD', summary: 'TODO', status: 'canonical' },
  { slug: 'telegram', title: 'Telegram', summary: 'TODO', status: 'canonical' },
  { slug: 'token-bonding-curve', title: 'Token Bonding Curve', summary: 'TODO', status: 'alias', targetSlug: 'bonding-curve' },
  { slug: 'tokenization', title: 'Tokenization', summary: 'TODO', status: 'canonical' },
  { slug: 'tokenomics', title: 'Tokenomics', summary: 'TODO', status: 'canonical' },
  { slug: 'ton', title: 'TON', summary: 'TODO', status: 'canonical' },
  { slug: 'tonswap', title: 'TONSwap', summary: 'TODO', status: 'canonical' },
  { slug: 'val', title: 'VAL', summary: 'TODO', status: 'canonical' },
  { slug: 'validator', title: 'Validator', summary: 'TODO', status: 'canonical' },
  { slug: 'voting', title: 'Voting', summary: 'TODO', status: 'canonical' },
  { slug: 'wallet', title: 'Wallet', summary: 'TODO', status: 'canonical' },
  { slug: 'xor', title: 'XOR', summary: 'TODO', status: 'canonical' },
];
