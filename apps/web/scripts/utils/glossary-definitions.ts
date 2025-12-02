import { taxonomy } from '../../src/data/taxonomy';
import { GLOSSARY_TERMS } from '../../src/data/glossary.config';

const aliasSources = new Map<string, string[]>();

// Fallback definitions with proper categories
// Categories: 'economics', 'governance', 'technology', 'defi', 'network', 'token', 'ecosystem', 'general'
interface FallbackEntry {
  definition: string;
  category: string;
}

const FALLBACK_ENTRIES: Record<string, FallbackEntry> = {
  adoption: {
    definition: 'Adoption describes the rate at which people, partners, and institutions begin using SORA products, liquidity, and governance tooling in real-world contexts.',
    category: 'ecosystem',
  },
  analytics: {
    definition: 'Analytics covers the dashboards, telemetry, and research teams tracking SORA network health, liquidity depth, bridge flow, and ecosystem growth.',
    category: 'technology',
  },
  bridges: {
    definition: 'Bridges are interoperability protocols that move assets and data between SORA and external chains so liquidity can circulate without centralized custodians.',
    category: 'technology',
  },
  'bonding-curve': {
    definition: 'A smart contract that manages the supply of XOR in a rational way without human involvement. The TBC automatically adjusts XOR supply based on economic conditions to maintain price stability.',
    category: 'economics',
  },
  council: {
    definition: 'The SORA Council is a governance body that evaluates proposals, manages treasury allocation, and coordinates network upgrades through democratic processes.',
    category: 'governance',
  },
  decentralization: {
    definition: 'Decentralization is the principle of distributing power across validators, councils, and citizens so no single entity can control the SORA economy.',
    category: 'governance',
  },
  economics: {
    definition: 'Economics in the SORA context refers to monetary policy, incentives, and treasury allocation that keep XOR supply, liquidity, and funding balanced.',
    category: 'economics',
  },
  explorer: {
    definition: 'Explorer refers to the SORA blockchain explorer experiences that let anyone browse blocks, transactions, governance queues, and validator stats in real time.',
    category: 'technology',
  },
  'fearless-wallet': {
    definition: 'Fearless Wallet is a mobile-first application by SORAMITSU that lets users manage Polkadot, Kusama, and SORA assets with staking, swaps, and governance support.',
    category: 'ecosystem',
  },
  hyperledger: {
    definition: "Hyperledger is the Linux Foundation's family of enterprise blockchain frameworks, including Hyperledger Iroha which powers SORA's regulated deployments.",
    category: 'technology',
  },
  interoperability: {
    definition: 'Interoperability is the ability for SORA assets and smart contracts to communicate with other networks through bridges, XCM, APIs, or shared standards.',
    category: 'technology',
  },
  marketplace: {
    definition: 'Marketplace describes curated hubs where builders showcase SORA-based products, liquidity programs, or governance proposals for community discovery.',
    category: 'ecosystem',
  },
  mobile: {
    definition: "Mobile captures SORA's focus on delivering wallets and dApps with native iOS and Android experiences so users can onboard anywhere.",
    category: 'technology',
  },
  payments: {
    definition: 'Payments covers the QR, CBDC, and merchant integrations that let SORA technology power day-to-day transactions and cross-border settlements.',
    category: 'defi',
  },
  proposal: {
    definition: 'A proposal is a formal request submitted to SORA governance for funding, parameter changes, or new initiatives that citizens can evaluate.',
    category: 'governance',
  },
  roadmap: {
    definition: 'The roadmap outlines upcoming SORA releases, TON integrations, and ecosystem milestones so contributors share the same delivery plan.',
    category: 'ecosystem',
  },
  sora: {
    definition: 'SORA is a decentralized economic network focused on programmable finance, democratic governance, and CBDC-grade infrastructure.',
    category: 'network',
  },
  stablecoin: {
    definition: 'A stablecoin is a digital asset engineered to hold a predictable value, such as KUSD or future SORA settlement tokens used for payments.',
    category: 'token',
  },
  telegram: {
    definition: 'Telegram is the primary chat channel where the SORA community coordinates releases, support, validator updates, and governance calls.',
    category: 'ecosystem',
  },
  tokenomics: {
    definition: 'Tokenomics explains how XOR, VAL, PSWAP, and related assets are minted, burned, bonded, or rewarded to align incentives with long-term growth.',
    category: 'economics',
  },
  ton: {
    definition: "TON (The Open Network) is a Telegram-backed blockchain known for high throughput and mobile-native UX that now powers TONSwap's SORA-linked DeFi.",
    category: 'network',
  },
  voting: {
    definition: 'Voting is the act of citizens or stakeholders signaling support for SORA governance proposals through on-chain referenda or delegated councils.',
    category: 'governance',
  },
  wallet: {
    definition: 'A wallet is the software that stores keys, signs transactions, and connects users to SORA DeFi apps such as Polkaswap, Fearless Wallet, or TONSwap.',
    category: 'technology',
  },
};

// Legacy export for backward compatibility
const FALLBACK_DEFINITIONS: Record<string, string> = Object.fromEntries(
  Object.entries(FALLBACK_ENTRIES).map(([key, entry]) => [key, entry.definition])
);

for (const term of GLOSSARY_TERMS) {
  if (term.status !== 'alias' || !term.targetSlug) continue;
  const list = aliasSources.get(term.targetSlug) ?? [];
  list.push(term.slug);
  aliasSources.set(term.targetSlug, list);
}

export const getDefinitionForSlug = (slug: string): string | null => {
  const normalizedSlug = slug.toLowerCase();
  const direct = taxonomy[normalizedSlug]?.definition ?? taxonomy[slug]?.definition;
  if (direct) return direct;

  const aliases = aliasSources.get(slug) ?? aliasSources.get(normalizedSlug);
  if (aliases) {
    for (const aliasSlug of aliases) {
      const aliasDefinition = taxonomy[aliasSlug]?.definition;
      if (aliasDefinition) return aliasDefinition;
    }
  }

  return FALLBACK_DEFINITIONS[normalizedSlug] ?? null;
};

export const getCategoryForSlug = (slug: string): string | null => {
  const normalizedSlug = slug.toLowerCase();
  
  // Check taxonomy first
  const taxonomyCategory = taxonomy[normalizedSlug]?.category ?? taxonomy[slug]?.category;
  if (taxonomyCategory) return taxonomyCategory;

  // Check fallback entries
  return FALLBACK_ENTRIES[normalizedSlug]?.category ?? null;
};

export { FALLBACK_ENTRIES };

