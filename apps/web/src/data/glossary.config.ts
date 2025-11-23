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



