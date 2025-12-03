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
  // === HIGH-FREQUENCY TAGS (used on 4+ terms) ===
  nexusarchitecture: {
    definition: 'Nexus Architecture is the core technical framework of SORA v3, encompassing accounts, transactions, execution, consensus, cryptography, and data availability primitives. It defines how the network processes state transitions, validates blocks, and maintains distributed consensus across all participants.',
    category: 'technology',
  },
  'cross-chain': {
    definition: 'Cross-chain refers to protocols and mechanisms that enable assets, data, and messages to move between different blockchain networks. SORA uses bridges, XCM, and the HASHI protocol to achieve interoperability with Polkadot, Ethereum, TON, and other ecosystems.',
    category: 'technology',
  },
  hyperledgeriroha: {
    definition: 'Hyperledger Iroha is an open-source, permissioned blockchain framework developed by SORAMITSU and maintained under the Linux Foundation. It provides enterprise-grade features including granular permissions, built-in asset management, and Byzantine fault tolerant consensus.',
    category: 'technology',
  },
  memecoins: {
    definition: 'Meme coins are cryptocurrency tokens that originate from internet memes or cultural phenomena. On SORA, projects like Soshiba explore lightweight community incentives through airdrops, social quests, and liquidity rewards separate from core network assets.',
    category: 'token',
  },
  rust: {
    definition: 'Rust is a systems programming language known for memory safety and performance. SORA and Hyperledger Iroha 2 are built with Rust, enabling secure, high-throughput blockchain execution with compile-time guarantees against common vulnerabilities.',
    category: 'technology',
  },
  parachains: {
    definition: 'Parachains are independent blockchains that connect to the Polkadot or Kusama relay chain for shared security and cross-chain messaging. SORA operates as a parachain, benefiting from Polkadot consensus while maintaining its own specialized runtime.',
    category: 'network',
  },
  trading: {
    definition: 'Trading on SORA encompasses swapping tokens on Polkaswap, providing liquidity to pools, and participating in price discovery through the DEX. The network supports multiple liquidity sources and algorithmic pricing for efficient markets.',
    category: 'defi',
  },
  hyperledgeriroha3: {
    definition: 'Hyperledger Iroha 3 is the next-generation version of the Iroha framework, featuring enhanced performance, WASM smart contracts, and improved developer tooling. SORA v3 architecture draws from Iroha 3 innovations for enterprise-grade blockchain infrastructure.',
    category: 'technology',
  },
  community: {
    definition: 'The SORA community comprises developers, validators, liquidity providers, governance participants, and users who collectively shape the network direction through proposals, discussions, and on-chain voting.',
    category: 'ecosystem',
  },
  'buyback-and-burn': {
    definition: 'Buyback-and-burn is a deflationary mechanism where a portion of network fees or revenues is used to purchase tokens from the market and permanently remove them from circulation. SORA uses this for PSWAP and other strategic supply management.',
    category: 'economics',
  },
  
  // === MEDIUM-FREQUENCY TAGS (used on 2-3 terms) ===
  supplyreduction: {
    definition: 'Supply reduction refers to mechanisms that decrease the circulating supply of tokens over time, including burns, lockups, and deflationary tokenomics. SORA implements supply reduction through transaction fee burns and buyback programs.',
    category: 'economics',
  },
  soraecosystem: {
    definition: 'The SORA Ecosystem encompasses all applications, protocols, and communities built on or integrated with the SORA network, including Polkaswap, Fearless Wallet, TONSwap, CBDC implementations, and governance infrastructure.',
    category: 'ecosystem',
  },
  'real-worldassets': {
    definition: 'Real-world assets (RWAs) are physical or traditional financial assets represented as tokens on blockchain. SORA infrastructure supports tokenization of commodities, securities, and fiat-backed instruments for DeFi integration.',
    category: 'defi',
  },
  opengov: {
    definition: 'OpenGov is the advanced governance framework used by Polkadot and Kusama parachains, featuring multiple referendum tracks, delegation, and conviction voting. SORA governance draws from these democratic primitives.',
    category: 'governance',
  },
  digitalcurrency: {
    definition: 'Digital currency refers to any currency existing in electronic form, including cryptocurrencies like XOR and central bank digital currencies (CBDCs). SORA provides infrastructure for both decentralized and regulated digital money.',
    category: 'economics',
  },
  vault: {
    definition: 'A vault is a smart contract that securely holds collateral for minting synthetic assets or stablecoins. On SORA, Kensetsu vaults allow users to deposit XOR, VAL, or other assets to borrow KUSD.',
    category: 'defi',
  },
  validators: {
    definition: 'Validators are network operators who stake tokens to produce blocks, validate transactions, and maintain consensus. SORA validators earn VAL rewards for securing the network and processing state transitions.',
    category: 'network',
  },
  supplymanagement: {
    definition: 'Supply management encompasses all mechanisms controlling token issuance, burning, and circulation. SORA uses the Token Bonding Curve, fee burns, and strategic reserves to maintain healthy token economics.',
    category: 'economics',
  },
  stableasset: {
    definition: 'A stable asset is any token designed to maintain a consistent value, typically pegged to fiat currency. KUSD is SORA primary stable asset, backed by over-collateralized vaults and stability mechanisms.',
    category: 'token',
  },
  soranetwork: {
    definition: 'SORA Network is the decentralized blockchain infrastructure powering XOR, Polkaswap, and the broader SORA ecosystem. It provides programmable finance, democratic governance, and interoperability with multiple chains.',
    category: 'network',
  },
  smartcontracts: {
    definition: 'Smart contracts are self-executing programs stored on blockchain that automatically enforce agreement terms. SORA supports smart contracts through Ink! (Rust-based) and future WASM execution environments.',
    category: 'technology',
  },
  scarcity: {
    definition: 'Scarcity in tokenomics refers to limited supply that can drive value. SORA manages scarcity through the Token Bonding Curve, which algorithmically controls XOR minting based on economic conditions.',
    category: 'economics',
  },
  scalability: {
    definition: 'Scalability is the ability of a blockchain to handle increasing transaction volume without degrading performance. SORA achieves scalability through parachain architecture, efficient consensus, and optimized runtime.',
    category: 'technology',
  },
  priceoptimization: {
    definition: 'Price optimization refers to mechanisms that improve trade execution and reduce slippage. Polkaswap aggregates multiple liquidity sources and uses smart order routing for optimal swap prices.',
    category: 'defi',
  },
  'over-collateralized': {
    definition: 'Over-collateralized means providing more collateral value than the borrowed amount, creating a safety buffer. Kensetsu requires over-collateralization to mint KUSD, protecting against liquidation risk.',
    category: 'defi',
  },
  nexus: {
    definition: 'Nexus refers to the SORA v3 technical specification and whitepaper defining the next-generation network architecture, including new consensus, execution, and data availability layers.',
    category: 'technology',
  },
  marketcycles: {
    definition: 'Market cycles are recurring patterns of bull and bear phases in cryptocurrency markets. SORA tokenomics, particularly the Token Bonding Curve, is designed to provide stability across market cycles.',
    category: 'economics',
  },
  makerdao: {
    definition: 'MakerDAO is the Ethereum protocol behind DAI stablecoin. Kensetsu draws inspiration from Maker vault model while adapting it for SORA multi-collateral and KUSD minting system.',
    category: 'defi',
  },
  energy: {
    definition: 'Energy in SORA context refers to sustainability considerations and the network efficient Proof of Stake consensus, which uses minimal energy compared to Proof of Work systems.',
    category: 'technology',
  },
  decentralizedexchange: {
    definition: 'A decentralized exchange (DEX) enables peer-to-peer trading without intermediaries. Polkaswap is SORA DEX, offering multi-source liquidity, low fees, and permissionless token swaps.',
    category: 'defi',
  },
  cryptography: {
    definition: 'Cryptography in blockchain provides security through digital signatures, hash functions, and encryption. SORA uses Ed25519, BLAKE2b, and other primitives to secure accounts and transactions.',
    category: 'technology',
  },
  'cross-borderpayments': {
    definition: 'Cross-border payments are international money transfers. SORA CBDC infrastructure and stablecoin rails enable fast, low-cost cross-border settlements without traditional banking intermediaries.',
    category: 'defi',
  },
  byzantinefaulttolerance: {
    definition: 'Byzantine Fault Tolerance (BFT) is a consensus property ensuring network operation even when some nodes act maliciously. SORA uses BFT-based SUMERAGI consensus for deterministic finality.',
    category: 'technology',
  },
  borderlessfinance: {
    definition: 'Borderless finance refers to financial services accessible globally without geographic restrictions. SORA enables borderless DeFi through permissionless access to Polkaswap, staking, and governance.',
    category: 'defi',
  },
  
  // === ORIGINAL ENTRIES ===
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
  iroha: {
    definition: 'An open-source, permissioned blockchain framework developed by SORAMITSU and part of the Hyperledger Foundation. Designed for simplicity and fast deployment with granular permissions, built-in asset management, and Byzantine fault tolerant consensus.',
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
  parliament: {
    definition: 'The future democratic governance system of SORA using multi-body sortition with clear separation of powers. The SORA Parliament will replace the current Governance V1 system, implementing sortition-based democracy.',
    category: 'governance',
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

