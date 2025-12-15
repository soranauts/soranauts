import { taxonomy } from '../../src/data/taxonomy';
import { GLOSSARY_TERMS } from '../../src/data/glossary.config';

const aliasSources = new Map<string, string[]>();

// Fallback definitions with proper categories
// Categories: 'economics', 'governance', 'technology', 'defi', 'network', 'token', 'ecosystem', 'general'
interface FallbackEntry {
  definition: string;
  category: string;
  whyItMatters?: string;
}

const FALLBACK_ENTRIES: Record<string, FallbackEntry> = {
  // === CORE TAXONOMY TERMS (taglines for ecosystem tokens) ===
  xor: {
    definition: 'The network utility token used for transaction fees (gas) where 50% of fees are burned and 50% go to validators.',
    category: 'token',
    whyItMatters: 'Powers every transaction on SORA and gives holders governance rights in the network.',
  },
  val: {
    definition: 'A validator reward token for the SORA network used to reward validators and stake nominators.',
    category: 'token',
    whyItMatters: 'Incentivizes network security through deflationary rewards to validators and nominators.',
  },
  pswap: {
    definition: 'A deflationary token used to reward liquidity providers on Polkaswap.',
    category: 'token',
    whyItMatters: 'Rewards users who provide liquidity, creating sustainable DeFi incentives.',
  },
  polkaswap: {
    definition: 'A non-custodial DEX on the SORA network with multiple liquidity sources including XYK pools, TBC, and order books.',
    category: 'defi',
    whyItMatters: 'Enables permissionless trading with best-price routing across multiple liquidity sources.',
  },
  kusd: {
    definition: 'A USD-pegged stablecoin on SORA, issued through over-collateralized Kensetsu vaults.',
    category: 'token',
    whyItMatters: 'Provides stable value for trading, payments, and DeFi without relying on centralized custodians.',
  },
  tbcd: {
    definition: 'Token Bonding Curve Dollar, an algorithmic stablecoin backed by XOR reserves on the token bonding curve.',
    category: 'token',
    whyItMatters: 'Offers algorithmic stability through the token bonding curve mechanism.',
  },
  tokenbondingcurve: {
    definition: 'An automated market maker that uses a mathematical curve to set token prices based on supply.',
    category: 'economics',
    whyItMatters: 'Creates predictable pricing and built-in liquidity for XOR without requiring external market makers.',
  },
  elasticsupply: {
    definition: 'A tokenomics model where supply adjusts based on demand through minting and burning mechanisms.',
    category: 'economics',
    whyItMatters: 'Enables sustainable economic policy that adapts to real network usage.',
  },
  tonswap: {
    definition: 'A DEX integration bringing SORA liquidity to the TON blockchain ecosystem.',
    category: 'defi',
    whyItMatters: 'Expands SORA DeFi reach to Telegram users through TON integration.',
  },
  hashi: {
    definition: 'A trustless cross-chain bridge protocol enabling asset transfers between SORA and external networks.',
    category: 'technology',
    whyItMatters: 'Enables secure asset transfers without trusted intermediaries.',
  },
  kensetsu: {
    definition: 'A lending protocol on SORA allowing users to mint KUSD stablecoins against collateralized assets.',
    category: 'defi',
    whyItMatters: 'Unlocks liquidity from existing holdings without selling your assets.',
  },
  fearlesswallet: {
    definition: 'Fearless Wallet is a mobile-first, non-custodial cryptocurrency wallet developed by SORAMITSU. It provides secure access to the Polkadot, Kusama, and SORA ecosystems from iOS and Android devices with features including native staking, Polkaswap integration, crowdloan participation, governance voting, and fiat on-ramp via Mercuryo and MoonPay.',
    category: 'ecosystem',
    whyItMatters: 'Provides the primary mobile gateway to SORA DeFi, enabling secure self-custody, staking rewards, and ecosystem participation without desktop access.',
  },
  soracard: {
    definition: 'A crypto debit card allowing users to spend SORA ecosystem tokens at traditional merchants.',
    category: 'ecosystem',
    whyItMatters: 'Bridges crypto and traditional payments for everyday spending.',
  },
  demeter: {
    definition: 'A farming platform on Polkaswap offering yield opportunities through liquidity provision.',
    category: 'defi',
    whyItMatters: 'Enables users to earn additional rewards on their liquidity positions.',
  },
  ceres: {
    definition: 'A DeFi service platform on SORA offering tools, liquidity lockers, and launchpad services.',
    category: 'defi',
    whyItMatters: 'Provides essential DeFi infrastructure for projects building on SORA.',
  },
  soraparliament: {
    definition: 'The governance body of the SORA network where token holders vote on proposals and network direction.',
    category: 'governance',
    whyItMatters: 'Gives the community direct control over network upgrades and treasury spending.',
  },

  // === HIGH-FREQUENCY TAGS (used on 4+ terms) ===
  nexusarchitecture: {
    definition: 'Nexus Architecture is the core technical framework of SORA v3, encompassing accounts, transactions, execution, consensus, cryptography, and data availability primitives. It defines how the network processes state transitions, validates blocks, and maintains distributed consensus across all participants.',
    category: 'technology',
    whyItMatters: 'Provides the foundation for all SORA v3 capabilities including speed, security, and scalability.',
  },
  'cross-chain': {
    definition: 'Cross-chain refers to protocols and mechanisms that enable assets, data, and messages to move between different blockchain networks. SORA uses bridges, XCM, and the HASHI protocol to achieve interoperability with Polkadot, Ethereum, TON, and other ecosystems.',
    category: 'technology',
    whyItMatters: 'Enables users to move assets freely between blockchains without intermediaries.',
  },
  hyperledgeriroha: {
    definition: 'Hyperledger Iroha is an open-source, permissioned blockchain framework developed by SORAMITSU and maintained under the Linux Foundation. It provides enterprise-grade features including granular permissions, built-in asset management, and Byzantine fault tolerant consensus.',
    category: 'technology',
    whyItMatters: 'Powers enterprise blockchain deployments with production-proven reliability.',
  },
  memecoins: {
    definition: 'Meme coins are cryptocurrency tokens that originate from internet memes or cultural phenomena. On SORA, projects like Soshiba explore lightweight community incentives through airdrops, social quests, and liquidity rewards separate from core network assets.',
    category: 'token',
    whyItMatters: 'Engages new users and builds community through accessible entry points.',
  },
  rust: {
    definition: 'Rust is a systems programming language known for memory safety and performance. SORA and Hyperledger Iroha 2 are built with Rust, enabling secure, high-throughput blockchain execution with compile-time guarantees against common vulnerabilities.',
    category: 'technology',
    whyItMatters: 'Ensures network security through memory-safe code that prevents common exploits.',
  },
  parachains: {
    definition: 'Parachains are independent blockchains that connect to the Polkadot or Kusama relay chain for shared security and cross-chain messaging. SORA operates as a parachain, benefiting from Polkadot consensus while maintaining its own specialized runtime.',
    category: 'network',
    whyItMatters: 'Provides shared security and seamless interoperability with the Polkadot ecosystem.',
  },
  trading: {
    definition: 'Trading on SORA encompasses swapping tokens on Polkaswap, providing liquidity to pools, and participating in price discovery through the DEX. The network supports multiple liquidity sources and algorithmic pricing for efficient markets.',
    category: 'defi',
    whyItMatters: 'Enables permissionless access to DeFi markets with competitive rates.',
  },
  hyperledgeriroha3: {
    definition: 'Hyperledger Iroha 3 is the next-generation version of the Iroha framework, featuring enhanced performance, WASM smart contracts, and improved developer tooling. SORA v3 architecture draws from Iroha 3 innovations for enterprise-grade blockchain infrastructure.',
    category: 'technology',
    whyItMatters: 'Delivers next-generation performance and developer experience for SORA v3.',
  },
  community: {
    definition: 'The SORA community comprises developers, validators, liquidity providers, governance participants, and users who collectively shape the network direction through proposals, discussions, and on-chain voting.',
    category: 'ecosystem',
    whyItMatters: 'Drives network decisions and ensures SORA evolves to meet user needs.',
  },
  'buyback-and-burn': {
    definition: 'Buyback-and-burn is a deflationary mechanism where a portion of network fees or revenues is used to purchase tokens from the market and permanently remove them from circulation. SORA uses this for PSWAP and other strategic supply management.',
    category: 'economics',
    whyItMatters: 'Creates sustainable value through automatic supply reduction.',
  },
  
  // === MEDIUM-FREQUENCY TAGS (used on 2-3 terms) ===
  supplyreduction: {
    definition: 'Supply reduction refers to mechanisms that decrease the circulating supply of tokens over time, including burns, lockups, and deflationary tokenomics. SORA implements supply reduction through transaction fee burns and buyback programs.',
    category: 'economics',
    whyItMatters: 'Helps maintain token value through controlled deflation.',
  },
  soraecosystem: {
    definition: 'The SORA Ecosystem encompasses all applications, protocols, and communities built on or integrated with the SORA network, including Polkaswap, Fearless Wallet, TONSwap, CBDC implementations, and governance infrastructure.',
    category: 'ecosystem',
    whyItMatters: 'Provides a complete suite of tools for decentralized finance and governance.',
  },
  'real-worldassets': {
    definition: 'Real-world assets (RWAs) are physical or traditional financial assets represented as tokens on blockchain. SORA infrastructure supports tokenization of commodities, securities, and fiat-backed instruments for DeFi integration.',
    category: 'defi',
    whyItMatters: 'Bridges traditional finance with DeFi for broader asset accessibility.',
  },
  opengov: {
    definition: 'OpenGov is the advanced governance framework used by Polkadot and Kusama parachains, featuring multiple referendum tracks, delegation, and conviction voting. SORA governance draws from these democratic primitives.',
    category: 'governance',
    whyItMatters: 'Enables sophisticated community governance with flexible voting mechanisms.',
  },
  digitalcurrency: {
    definition: 'Digital currency refers to any currency existing in electronic form, including cryptocurrencies like XOR and central bank digital currencies (CBDCs). SORA provides infrastructure for both decentralized and regulated digital money.',
    category: 'economics',
    whyItMatters: 'Enables programmable money for both retail and institutional use cases.',
  },
  vault: {
    definition: 'A vault is a smart contract that securely holds collateral for minting synthetic assets or stablecoins. On SORA, Kensetsu vaults allow users to deposit XOR, VAL, or other assets to borrow KUSD.',
    category: 'defi',
    whyItMatters: 'Unlocks liquidity from existing holdings without selling.',
  },
  validators: {
    definition: 'Validators are network operators who stake tokens to produce blocks, validate transactions, and maintain consensus. SORA validators earn VAL rewards for securing the network and processing state transitions.',
    category: 'network',
    whyItMatters: 'Secures the network while earning rewards for participants.',
  },
  supplymanagement: {
    definition: 'Supply management encompasses all mechanisms controlling token issuance, burning, and circulation. SORA uses the Token Bonding Curve, fee burns, and strategic reserves to maintain healthy token economics.',
    category: 'economics',
    whyItMatters: 'Maintains economic stability through algorithmic monetary policy.',
  },
  stableasset: {
    definition: 'A stable asset is any token designed to maintain a consistent value, typically pegged to fiat currency. KUSD is SORA primary stable asset, backed by over-collateralized vaults and stability mechanisms.',
    category: 'token',
    whyItMatters: 'Provides price stability for everyday transactions and DeFi.',
  },
  soranetwork: {
    definition: 'SORA Network is the decentralized blockchain infrastructure powering XOR, Polkaswap, and the broader SORA ecosystem. It provides programmable finance, democratic governance, and interoperability with multiple chains.',
    category: 'network',
    whyItMatters: 'Foundation for all SORA applications and economic activity.',
  },
  smartcontracts: {
    definition: 'Smart contracts are self-executing programs stored on blockchain that automatically enforce agreement terms. SORA supports smart contracts through Ink! (Rust-based) and future WASM execution environments.',
    category: 'technology',
    whyItMatters: 'Enables trustless automation of complex financial agreements.',
  },
  scarcity: {
    definition: 'Scarcity in tokenomics refers to limited supply that can drive value. SORA manages scarcity through the Token Bonding Curve, which algorithmically controls XOR minting based on economic conditions.',
    category: 'economics',
    whyItMatters: 'Supports long-term value through controlled supply dynamics.',
  },
  scalability: {
    definition: 'Scalability is the ability of a blockchain to handle increasing transaction volume without degrading performance. SORA achieves scalability through parachain architecture, efficient consensus, and optimized runtime.',
    category: 'technology',
    whyItMatters: 'Ensures the network can grow to support mass adoption.',
  },
  priceoptimization: {
    definition: 'Price optimization refers to mechanisms that improve trade execution and reduce slippage. Polkaswap aggregates multiple liquidity sources and uses smart order routing for optimal swap prices.',
    category: 'defi',
    whyItMatters: 'Gets users better prices on every trade.',
  },
  'over-collateralized': {
    definition: 'Over-collateralized means providing more collateral value than the borrowed amount, creating a safety buffer. Kensetsu requires over-collateralization to mint KUSD, protecting against liquidation risk.',
    category: 'defi',
    whyItMatters: 'Protects borrowers and the system from market volatility.',
  },
  nexus: {
    definition: 'Nexus refers to the SORA v3 technical specification and whitepaper defining the next-generation network architecture, including new consensus, execution, and data availability layers.',
    category: 'technology',
    whyItMatters: 'Defines the future of SORA with enterprise-grade capabilities.',
  },
  marketcycles: {
    definition: 'Market cycles are recurring patterns of bull and bear phases in cryptocurrency markets. SORA tokenomics, particularly the Token Bonding Curve, is designed to provide stability across market cycles.',
    category: 'economics',
    whyItMatters: 'Provides economic resilience during market volatility.',
  },
  makerdao: {
    definition: 'MakerDAO is the Ethereum protocol behind DAI stablecoin. Kensetsu draws inspiration from Maker vault model while adapting it for SORA multi-collateral and KUSD minting system.',
    category: 'defi',
    whyItMatters: 'Proven model for decentralized stablecoin generation.',
  },
  energy: {
    definition: 'Energy in SORA context refers to sustainability considerations and the network efficient Proof of Stake consensus, which uses minimal energy compared to Proof of Work systems.',
    category: 'technology',
    whyItMatters: 'Ensures environmental sustainability of blockchain operations.',
  },
  decentralizedexchange: {
    definition: 'A decentralized exchange (DEX) enables peer-to-peer trading without intermediaries. Polkaswap is SORA DEX, offering multi-source liquidity, low fees, and permissionless token swaps.',
    category: 'defi',
    whyItMatters: 'Enables trading without trusting centralized platforms.',
  },
  cryptography: {
    definition: 'Cryptography in blockchain provides security through digital signatures, hash functions, and encryption. SORA uses Ed25519, BLAKE2b, and other primitives to secure accounts and transactions.',
    category: 'technology',
    whyItMatters: 'Ensures transaction security and account protection.',
  },
  'cross-borderpayments': {
    definition: 'Cross-border payments are international money transfers. SORA CBDC infrastructure and stablecoin rails enable fast, low-cost cross-border settlements without traditional banking intermediaries.',
    category: 'defi',
    whyItMatters: 'Reduces cost and time for international transfers.',
  },
  byzantinefaulttolerance: {
    definition: 'Byzantine Fault Tolerance (BFT) is a consensus property ensuring network operation even when some nodes act maliciously. SORA uses BFT-based SUMERAGI consensus for deterministic finality.',
    category: 'technology',
    whyItMatters: 'Guarantees network security even with malicious actors.',
  },
  borderlessfinance: {
    definition: 'Borderless finance refers to financial services accessible globally without geographic restrictions. SORA enables borderless DeFi through permissionless access to Polkaswap, staking, and governance.',
    category: 'defi',
    whyItMatters: 'Opens financial services to anyone, anywhere.',
  },
  
  // === ORIGINAL ENTRIES ===
  adoption: {
    definition: 'Adoption describes the rate at which people, partners, and institutions begin using SORA products, liquidity, and governance tooling in real-world contexts.',
    category: 'ecosystem',
    whyItMatters: 'Drives network effects and increases utility for all participants.',
  },
  analytics: {
    definition: 'Analytics covers the dashboards, telemetry, and research teams tracking SORA network health, liquidity depth, bridge flow, and ecosystem growth.',
    category: 'technology',
    whyItMatters: 'Enables data-driven decisions for network optimization.',
  },
  bridges: {
    definition: 'Bridges are interoperability protocols that move assets and data between SORA and external chains so liquidity can circulate without centralized custodians.',
    category: 'technology',
    whyItMatters: 'Connects SORA to the broader blockchain ecosystem.',
  },
  'bonding-curve': {
    definition: 'A smart contract that manages the supply of XOR in a rational way without human involvement. The TBC automatically adjusts XOR supply based on economic conditions to maintain price stability.',
    category: 'economics',
    whyItMatters: 'Provides algorithmic price stability without central bank intervention.',
  },
  council: {
    definition: 'The SORA Council is a governance body that evaluates proposals, manages treasury allocation, and coordinates network upgrades through democratic processes.',
    category: 'governance',
    whyItMatters: 'Ensures community oversight of network development.',
  },
  decentralization: {
    definition: 'Decentralization is the principle of distributing power across validators, councils, and citizens so no single entity can control the SORA economy.',
    category: 'governance',
    whyItMatters: 'Prevents censorship and ensures permissionless access.',
  },
  economics: {
    definition: 'Economics in the SORA context refers to monetary policy, incentives, and treasury allocation that keep XOR supply, liquidity, and funding balanced.',
    category: 'economics',
    whyItMatters: 'Creates sustainable incentives for long-term network growth.',
  },
  explorer: {
    definition: 'Explorer refers to the SORA blockchain explorer experiences that let anyone browse blocks, transactions, governance queues, and validator stats in real time.',
    category: 'technology',
    whyItMatters: 'Provides transparency and accountability for all network activity.',
  },
  'fearless-wallet': {
    definition: 'Fearless Wallet is a mobile-first application by SORAMITSU that lets users manage Polkadot, Kusama, and SORA assets with staking, swaps, and governance support.',
    category: 'ecosystem',
    whyItMatters: 'Makes SORA accessible from any mobile device.',
  },
  hyperledger: {
    definition: "Hyperledger is the Linux Foundation's family of enterprise blockchain frameworks, including Hyperledger Iroha which powers SORA's regulated deployments.",
    category: 'technology',
    whyItMatters: 'Provides enterprise-grade credibility and interoperability.',
  },
  interoperability: {
    definition: 'Interoperability is the ability for SORA assets and smart contracts to communicate with other networks through bridges, XCM, APIs, or shared standards.',
    category: 'technology',
    whyItMatters: 'Enables seamless asset movement across ecosystems.',
  },
  iroha: {
    definition: 'An open-source, permissioned blockchain framework developed by SORAMITSU and part of the Hyperledger Foundation. Designed for simplicity and fast deployment with granular permissions, built-in asset management, and Byzantine fault tolerant consensus.',
    category: 'technology',
    whyItMatters: 'Powers enterprise blockchain with production-proven reliability.',
  },
  marketplace: {
    definition: 'Marketplace describes curated hubs where builders showcase SORA-based products, liquidity programs, or governance proposals for community discovery.',
    category: 'ecosystem',
    whyItMatters: 'Connects builders with users to grow the ecosystem.',
  },
  mobile: {
    definition: "Mobile captures SORA's focus on delivering wallets and dApps with native iOS and Android experiences so users can onboard anywhere.",
    category: 'technology',
    whyItMatters: 'Brings blockchain to billions of smartphone users.',
  },
  payments: {
    definition: 'Payments covers the QR, CBDC, and merchant integrations that let SORA technology power day-to-day transactions and cross-border settlements.',
    category: 'defi',
    whyItMatters: 'Enables real-world commerce with digital assets.',
  },
  parliament: {
    definition: 'The future democratic governance system of SORA using multi-body sortition with clear separation of powers. The SORA Parliament will replace the current Governance V1 system, implementing sortition-based democracy.',
    category: 'governance',
    whyItMatters: 'Enables fair representation through democratic lottery selection.',
  },
  proposal: {
    definition: 'A proposal is a formal request submitted to SORA governance for funding, parameter changes, or new initiatives that citizens can evaluate.',
    category: 'governance',
    whyItMatters: 'Gives every community member a voice in network decisions.',
  },
  roadmap: {
    definition: 'The roadmap outlines upcoming SORA releases, TON integrations, and ecosystem milestones so contributors share the same delivery plan.',
    category: 'ecosystem',
    whyItMatters: 'Aligns community expectations with development priorities.',
  },
  sora: {
    definition: 'SORA is a decentralized economic network focused on programmable finance, democratic governance, and CBDC-grade infrastructure. The network features elastic supply tokenomics with XOR, cross-chain interoperability via HASHI, and a suite of DeFi applications including Polkaswap DEX.',
    category: 'ecosystem',
    whyItMatters: 'Foundation for a new decentralized world economy with programmable finance and democratic governance.',
  },
  stablecoin: {
    definition: 'A stablecoin is a digital asset engineered to hold a predictable value, such as KUSD or future SORA settlement tokens used for payments.',
    category: 'token',
    whyItMatters: 'Enables everyday transactions without price volatility.',
  },
  telegram: {
    definition: 'Telegram is the primary chat channel where the SORA community coordinates releases, support, validator updates, and governance calls.',
    category: 'ecosystem',
    whyItMatters: 'Central hub for community coordination and support.',
  },
  tokenomics: {
    definition: 'Tokenomics explains how XOR, VAL, PSWAP, and related assets are minted, burned, bonded, or rewarded to align incentives with long-term growth.',
    category: 'economics',
    whyItMatters: 'Creates sustainable value through aligned incentives.',
  },
  ton: {
    definition: "TON (The Open Network) is a Telegram-backed blockchain known for high throughput and mobile-native UX that now powers TONSwap's SORA-linked DeFi.",
    category: 'network',
    whyItMatters: 'Opens SORA to Telegram massive user base.',
  },
  voting: {
    definition: 'Voting is the act of citizens or stakeholders signaling support for SORA governance proposals through on-chain referenda or delegated councils.',
    category: 'governance',
    whyItMatters: 'Ensures democratic control over network evolution.',
  },
  wallet: {
    definition: 'A wallet is the software that stores keys, signs transactions, and connects users to SORA DeFi apps such as Polkaswap, Fearless Wallet, or TONSwap.',
    category: 'technology',
    whyItMatters: 'Gateway to all SORA services and assets.',
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

export const getWhyItMattersForSlug = (slug: string): string | null => {
  const normalizedSlug = slug.toLowerCase();
  
  // Check fallback entries (includes both core taxonomy terms and tag-derived terms)
  return FALLBACK_ENTRIES[normalizedSlug]?.whyItMatters ?? null;
};

export { FALLBACK_ENTRIES };

