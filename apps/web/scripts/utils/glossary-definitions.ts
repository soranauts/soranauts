import { taxonomy } from '../../src/data/taxonomy';
import { GLOSSARY_TERMS } from '../../src/data/glossary.config';

const aliasSources = new Map<string, string[]>();

const FALLBACK_DEFINITIONS: Record<string, string> = {
  adoption:
    'Adoption describes the rate at which people, partners, and institutions begin using SORA products, liquidity, and governance tooling in real-world contexts.',
  analytics:
    'Analytics covers the dashboards, telemetry, and research teams tracking SORA network health, liquidity depth, bridge flow, and ecosystem growth.',
  bridges:
    'Bridges are interoperability protocols that move assets and data between SORA and external chains so liquidity can circulate without centralized custodians.',
  decentralization:
    'Decentralization is the principle of distributing power across validators, councils, and citizens so no single entity can control the SORA economy.',
  economics:
    'Economics in the SORA context refers to monetary policy, incentives, and treasury allocation that keep XOR supply, liquidity, and funding balanced.',
  explorer:
    'Explorer refers to the SORA blockchain explorer experiences that let anyone browse blocks, transactions, governance queues, and validator stats in real time.',
  'fearless-wallet':
    'Fearless Wallet is a mobile-first application by SORAMITSU that lets users manage Polkadot, Kusama, and SORA assets with staking, swaps, and governance support.',
  hyperledger:
    'Hyperledger is the Linux Foundation’s family of enterprise blockchain frameworks, including Hyperledger Iroha which powers SORA’s regulated deployments.',
  interoperability:
    'Interoperability is the ability for SORA assets and smart contracts to communicate with other networks through bridges, XCM, APIs, or shared standards.',
  marketplace:
    'Marketplace describes curated hubs where builders showcase SORA-based products, liquidity programs, or governance proposals for community discovery.',
  mobile:
    'Mobile captures SORA’s focus on delivering wallets and dApps with native iOS and Android experiences so users can onboard anywhere.',
  payments:
    'Payments covers the QR, CBDC, and merchant integrations that let SORA technology power day-to-day transactions and cross-border settlements.',
  proposal:
    'A proposal is a formal request submitted to SORA governance for funding, parameter changes, or new initiatives that citizens can evaluate.',
  roadmap:
    'The roadmap outlines upcoming SORA releases, TON integrations, and ecosystem milestones so contributors share the same delivery plan.',
  sora:
    'SORA is a decentralized economic network focused on programmable finance, democratic governance, and CBDC-grade infrastructure.',
  stablecoin:
    'A stablecoin is a digital asset engineered to hold a predictable value, such as KUSD or future SORA settlement tokens used for payments.',
  telegram:
    'Telegram is the primary chat channel where the SORA community coordinates releases, support, validator updates, and governance calls.',
  tokenomics:
    'Tokenomics explains how XOR, VAL, PSWAP, and related assets are minted, burned, bonded, or rewarded to align incentives with long-term growth.',
  ton:
    'TON (The Open Network) is a Telegram-backed blockchain known for high throughput and mobile-native UX that now powers TONSwap’s SORA-linked DeFi.',
  voting:
    'Voting is the act of citizens or stakeholders signaling support for SORA governance proposals through on-chain referenda or delegated councils.',
  wallet:
    'A wallet is the software that stores keys, signs transactions, and connects users to SORA DeFi apps such as Polkaswap, Fearless Wallet, or TONSwap.',
};

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

