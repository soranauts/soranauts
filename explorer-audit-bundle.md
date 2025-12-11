# SORA Explorer Audit Bundle
Generated: $(date)

## Overview

This bundle contains all configuration and processing files for the SORA Explorer tag system.

---

## 1. tag-hub.config.ts

Defines domains, traits, canonical tags, metadata, and quick paths.

```typescript
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
  /**
   * Optional array of related glossary term slugs for cross-linking on tag hub pages.
   */
  relatedSlugs?: string[];
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
      'SORA is a decentralized economic network featuring XOR elastic supply tokenomics, Polkaswap DEX, HASHI cross-chain bridge, and democratic governance through SORA Parliament.',
    traits: ['foundational', 'glossary-linked', 'beginner-friendly'],
    quickPathIds: ['new-to-sora'],
    featured: true,
    weight: 100,
    glossarySlug: 'sora',
    relatedSlugs: ['xor', 'val', 'pswap', 'polkaswap', 'hashi', 'soraparliament', 'kensetsu', 'fearlesswallet'],
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



```

---

## 2. nexus-explorer.config.ts

Defines Nexus Architecture subgroups and quick journeys.

```typescript
/**
 * Nexus Architecture Explorer Configuration
 * 
 * Defines the Nexus Architecture topic as a first-class Explorer category,
 * with structured subgroups and curated quick journeys for onboarding.
 */

export interface NexusSubgroup {
  id: string;
  title: string;
  description: string;
  terms: string[]; // Canonical glossary titles
}

export interface NexusQuickJourney {
  id: string;
  title: string;
  description: string;
  steps: Array<{
    slug: string;
    title: string;
    summary?: string;
  }>;
}

/**
 * Main Nexus Architecture topic configuration
 */
export const NEXUS_TOPIC = {
  id: 'nexus-architecture',
  slug: 'nexus-architecture',
  title: 'Nexus Architecture',
  description: 'SORA Nexus is a modular data-space, execution, and governance architecture built on Hyperledger Iroha 3. It enables sovereign data spaces, deterministic smart contracts, and cross-chain interoperability through a unified execution model.',
  tag: 'Nexus Architecture',
  icon: '🔷',
  featured: true,
  weight: 200, // High weight to appear prominently
} as const;

/**
 * Structured subgroups within the Nexus Architecture topic
 * Each subgroup represents a conceptual "chapter" of the architecture
 */
export const NEXUS_SUBGROUPS: NexusSubgroup[] = [
  {
    id: 'accounts-identity',
    title: 'Accounts & Identity',
    description: 'How Nexus manages user accounts, asset definitions, and identity across data spaces.',
    terms: [
      'Account Lifecycle',
      'AccountId',
      'AssetDefinitionId',
      'Bech32 Format',
      'Dual-Sig',
      'Multisig',
      'Nexus Account Structure',
      'Pre-Authorized Vouchers',
      'Revocation Windows',
    ],
  },
  {
    id: 'execution-vm',
    title: 'Execution & Virtual Machine',
    description: 'The Iroha Virtual Machine (IVM), Kotodama runtime, and how transactions are processed.',
    terms: [
      'Iroha Virtual Machine (IVM)',
      'IVM Bytecode',
      'Kotodama',
      'Kotodama Bytecode',
      'Kotodama Runtime',
      'Action',
      'Triggers',
      'Syscalls',
      'Deterministic Runtime',
      'Deterministic Budgets',
      'Gas Tables',
      'Memory Model',
    ],
  },
  {
    id: 'consensus-scheduling',
    title: 'Consensus & Scheduling',
    description: 'Sumeragi consensus, quorum certificates, and how blocks are finalized.',
    terms: [
      'Sumeragi',
      'Sumeragi Consensus',
      'SUMERAGI Pipeline',
      'Quorum Certificate',
      'Locked QC',
      'Propose-Validate-Vote-Commit',
      'VRF Sortition',
      'VRF Aggregate',
      'Seed Beacon',
      'Epoch Beacon',
      'NPoS Variant',
      'NEW_VIEW',
    ],
  },
  {
    id: 'lanes-data-availability',
    title: 'Lanes & Data Availability',
    description: 'Parallel execution lanes, erasure coding, and data availability guarantees.',
    terms: [
      'Lanes',
      'Parallel Lanes',
      'Compute Lane',
      'Lane Finality',
      'Lane Fusion',
      'Lane Split',
      'Lane Proofs',
      'Data Availability',
      'Data Availability Layer',
      'DA Sampling',
      'DA Certificates',
      'Erasure-Coded Kura',
      'Erasure-Coded WSV',
      'Two-Dimensional Erasure Coding',
      'Reed-Solomon',
    ],
  },
  {
    id: 'governance-rulemaking',
    title: 'Governance & Rulemaking',
    description: 'Data spaces, governance surfaces, and how rules are defined and enforced.',
    terms: [
      'Data Spaces',
      'Data Space Directory',
      'DataSpaceId',
      'DSID',
      'Public Data Spaces',
      'Private Data Spaces',
      'Sovereign Data Spaces',
      'Assembly',
      'Governance Surfaces',
      'Governed Manifest',
      'Parameter Sets',
      'Runtime Upgrades',
      'Slashing',
      'Soracles',
    ],
  },
  {
    id: 'economics-fees',
    title: 'Economics & Fees',
    description: 'Transaction execution units, fee equilibrium, and economic incentives.',
    terms: [
      'Transaction Execution Units (TEU)',
      'Lane TEU Budget',
      'XOR Utility',
      'XOR Fee Equilibrium',
      'XOR Bonds',
      'Budget',
      'Economic Model',
      'Collateralized Locks',
    ],
  },
  {
    id: 'cross-chain-interop',
    title: 'Cross-Chain & Interoperability',
    description: 'Networking, bridges, and cross-chain communication primitives.',
    terms: [
      'SoraNet',
      'Torii',
      'Kaigi',
      'Taikai',
      'Gateways',
      'Three-Hop QUIC Circuits',
      'Hybrid PQ Handshake',
      'Blinded CIDs',
      'Fixed-Size Cells',
      'Exit Caches',
      'ZK-Backed Access Tickets',
    ],
  },
];

/**
 * Quick journeys for Nexus onboarding
 * Each journey is a curated path through related concepts
 */
export const NEXUS_QUICK_JOURNEYS: NexusQuickJourney[] = [
  {
    id: 'nexus-in-5-minutes',
    title: 'Understanding Nexus in 5 Minutes',
    description: 'A rapid introduction to the core concepts that define SORA Nexus architecture.',
    steps: [
      {
        slug: 'accountid',
        title: 'AccountId',
        summary: 'The unique identifier for every account in a Nexus data space.',
      },
      {
        slug: 'irohavirtualmachineivm',
        title: 'Iroha Virtual Machine (IVM)',
        summary: 'The deterministic execution engine that processes all Nexus transactions.',
      },
      {
        slug: 'worldstateviewwsv',
        title: 'World State View (WSV)',
        summary: 'The in-memory snapshot of all account balances and asset states.',
      },
      {
        slug: 'transactionexecutionunitsteu',
        title: 'Transaction Execution Units (TEU)',
        summary: 'The metering system that bounds computation and ensures fair resource allocation.',
      },
      {
        slug: 'lanes',
        title: 'Lanes',
        summary: 'Parallel execution contexts that enable horizontal scaling.',
      },
      {
        slug: 'aggregation',
        title: 'Aggregation',
        summary: 'How lane results are combined into a unified state root.',
      },
      {
        slug: 'sumeragi',
        title: 'Sumeragi',
        summary: 'The BFT consensus protocol that finalizes blocks.',
      },
    ],
  },
  {
    id: 'execution-flow',
    title: 'Execution Flow Inside Nexus',
    description: 'Follow a transaction from submission to finalization, step by step.',
    steps: [
      {
        slug: 'triggers',
        title: 'Triggers',
        summary: 'Events that initiate transaction execution in Nexus.',
      },
      {
        slug: 'kotodama',
        title: 'Kotodama',
        summary: 'The instruction set and runtime for Nexus smart contracts.',
      },
      {
        slug: 'transactionexecutionunitsteu',
        title: 'Transaction Execution Units (TEU)',
        summary: 'Resource metering during execution.',
      },
      {
        slug: 'worldstateviewwsv',
        title: 'World State View (WSV)',
        summary: 'State updates applied after successful execution.',
      },
      {
        slug: 'aggregation',
        title: 'Aggregation',
        summary: 'Combining lane outputs into a unified state.',
      },
      {
        slug: 'lanes',
        title: 'Lanes',
        summary: 'Parallel execution and lane block formation.',
      },
      {
        slug: 'lanefinality',
        title: 'Lane Finality',
        summary: 'How individual lanes achieve finality before global consensus.',
      },
      {
        slug: 'quorumcertificate',
        title: 'Quorum Certificate',
        summary: 'Cryptographic proof of validator agreement.',
      },
    ],
  },
];

/**
 * Get all Nexus terms as a flat array of canonical titles
 */
export function getAllNexusTerms(): string[] {
  const terms = new Set<string>();
  for (const subgroup of NEXUS_SUBGROUPS) {
    for (const term of subgroup.terms) {
      terms.add(term);
    }
  }
  return Array.from(terms).sort();
}

/**
 * Get terms for a specific subgroup
 */
export function getSubgroupTerms(subgroupId: string): string[] {
  const subgroup = NEXUS_SUBGROUPS.find(s => s.id === subgroupId);
  return subgroup?.terms ?? [];
}

/**
 * Find which subgroup a term belongs to
 */
export function getTermSubgroup(termTitle: string): NexusSubgroup | undefined {
  return NEXUS_SUBGROUPS.find(s => s.terms.includes(termTitle));
}

/**
 * Convert a canonical title to a slug
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/\s+/g, '');
}

/**
 * Get journey by ID
 */
export function getJourneyById(journeyId: string): NexusQuickJourney | undefined {
  return NEXUS_QUICK_JOURNEYS.find(j => j.id === journeyId);
}

```

---

## 3. tag-hub.ts (Processing Logic)

Transforms taxonomy nodes into TagHubViewModels.

```typescript
import { taxonomy, type TaxonomyNode } from '../data/taxonomy';
import {
  TAG_HUB_DOMAINS,
  TAG_HUB_TRAITS,
  type TagHubDomain,
  type TagHubMetadataEntry,
  type TagHubQuickPath,
  type TagHubTrait,
  tagHubMetadata,
  tagHubQuickPaths,
  isCanonicalTag,
} from '../data/tag-hub.config';
import { normalizeTaxonomyValue, resolveAlias, toTagSlug } from './taxonomy';
import { FEATURE_GLOSSARY_V2025 } from '~/config/feature-flags';
import {
  getCanonicalSlug as getCanonicalGlossarySlug,
  getGlossaryTerm,
  type GlossaryEntry,
} from '~/lib/glossary/glossary-loader';

const isGlossaryEntry = (value: unknown): value is GlossaryEntry =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'term' in (value as Record<string, unknown>) &&
      'slug' in (value as Record<string, unknown>),
  );

const FALLBACK_DOMAIN_MAP: Record<string, TagHubDomain> = {
  token: 'economics',
  technology: 'technology',
  governance: 'governance',
  defi: 'defi',
  network: 'network',
  economics: 'economics',
};

const DEFAULT_DOMAIN: TagHubDomain = 'ecosystem';

const CANONICAL_LABELS: Record<string, string> = {
  sora: 'SORA',
  'sora-v3': 'SORA v3',
  'sora-parliament': 'SORA Parliament',
  'sora-economy': 'SORA Economy',
  'sora-network': 'SORA Network',
  'sora economy': 'SORA Economy',
  'sora network': 'SORA Network',
  cbdc: 'CBDC',
  'qr-payments': 'QR Payments',
  wasm: 'WASM',
  webassembly: 'WebAssembly',
  ipfs: 'IPFS',
  ton: 'TON',
  amm: 'AMM',
  clmm: 'CLMM',
  'bft-consensus': 'BFT Consensus',
  'erc-20': 'ERC-20',
  'erc20': 'ERC-20',
  'erc 20': 'ERC-20',
  isi: 'ISI',
  makerdao: 'MakerDAO',
  npos: 'NPoS',
  xor: 'XOR',
  pswap: 'PSWAP',
  val: 'VAL',
  kusd: 'KUSD',
  tbcd: 'TBCD',
  opengov: 'OpenGov',
  iroha: 'Iroha',
  iroha3: 'Iroha 3',
  polkaswap: 'Polkaswap',
  soramitsu: 'SORAMITSU',
  tonswap: 'TONSWAP',
  xcm: 'XCM',
  dex: 'DEX',
  'sora-card': 'SORA Card',
  defi: 'DeFi',
  'cross-chain': 'Cross-chain',
};

export const formatTagLabel = (slug: string, fallback: string): string => {
  const key = slug?.toLowerCase?.().replace(/^tag-/, '') ?? '';
  return CANONICAL_LABELS[key] ?? fallback;
};

const sortTraits = (traits: Set<TagHubTrait>): TagHubTrait[] =>
  TAG_HUB_TRAITS.filter((trait) => traits.has(trait));

const sortQuickPathIds = (ids: Set<string>): string[] =>
  tagHubQuickPaths
    .map((path) => path.id)
    .filter((id) => ids.has(id));

const sortByWeightAndTitle = (a: TagHubViewModel, b: TagHubViewModel) => {
  const weightA = a.metadata?.weight ?? 0;
  const weightB = b.metadata?.weight ?? 0;
  if (weightA !== weightB) return weightB - weightA;
  return a.title.localeCompare(b.title, 'en');
};

export interface TagHubViewModel {
  slug: string;
  title: string;
  summary?: string;
  domain: TagHubDomain;
  traits: TagHubTrait[];
  quickPathIds: string[];
  usageCount: number;
  firstSeen?: string;
  lastSeen?: string;
  glossaryRef?: string;
  glossaryCanonicalPath?: string;
  canonicalGlossarySlug?: string | null;
  category?: TaxonomyNode['category'];
  relatedTags: string[];
  aliases: string[];
  metadata?: TagHubMetadataEntry;
}

export interface TagHubQuickPathView {
  id: string;
  title: string;
  description: string;
  slugs: string[];
  tags: TagHubViewModel[];
}

const buildTraits = (node: TaxonomyNode, metadata?: TagHubMetadataEntry): TagHubTrait[] => {
  const collected = new Set<TagHubTrait>(metadata?.traits ?? []);
  if (node.glossaryRef) {
    collected.add('glossary-linked');
  }
  return sortTraits(collected);
};

const buildQuickPathIds = (metadata?: TagHubMetadataEntry): string[] => {
  if (!metadata?.quickPathIds?.length) return [];
  return sortQuickPathIds(new Set(metadata.quickPathIds));
};

const determineDomain = (node: TaxonomyNode, metadata?: TagHubMetadataEntry): TagHubDomain => {
  if (metadata?.domain) return metadata.domain;
  if (node.category && FALLBACK_DOMAIN_MAP[node.category]) {
    return FALLBACK_DOMAIN_MAP[node.category];
  }
  return DEFAULT_DOMAIN;
};

const toRelatedTagSlugs = (node: TaxonomyNode): string[] =>
  Array.isArray(node.relatedTags)
    ? node.relatedTags
        .map((tag) => toTagSlug(tag))
        .filter((value, index, arr) => arr.indexOf(value) === index)
    : [];

const normalizeGlossaryRef = (value?: string | null): { rawPath?: string; canonicalSlug?: string | null; canonicalPath?: string } => {
  if (!value) return {};
  const slug = value.replace(/^\/glossary\//, '').replace(/\/$/, '');
  const canonicalSlug =
    FEATURE_GLOSSARY_V2025 && slug ? getCanonicalGlossarySlug(slug) || slug : slug;
  return {
    rawPath: `/glossary/${slug}`,
    canonicalSlug,
    canonicalPath: canonicalSlug ? `/glossary/${canonicalSlug}` : undefined,
  };
};

const toViewModel = (node: TaxonomyNode): TagHubViewModel => {
  const metadata = node.hub;
  const glossaryRefInfo = normalizeGlossaryRef(node.glossaryRef);
  return {
    slug: node.slug,
    title: node.title,
    summary: metadata?.summary ?? node.summary,
    domain: determineDomain(node, metadata),
    traits: buildTraits(node, metadata),
    quickPathIds: buildQuickPathIds(metadata),
    usageCount: node.usageCount ?? 0,
    firstSeen: node.firstSeen,
    lastSeen: node.lastSeen,
    glossaryRef: glossaryRefInfo.rawPath,
    glossaryCanonicalPath: glossaryRefInfo.canonicalPath ?? glossaryRefInfo.rawPath,
    canonicalGlossarySlug: glossaryRefInfo.canonicalSlug ?? null,
    category: node.category,
    relatedTags: toRelatedTagSlugs(node),
    aliases: node.aliases ?? [],
    metadata,
  };
};

export const getTagHubViewModel = (slug: string): TagHubViewModel | undefined => {
  const node = taxonomy[slug];
  if (!node || node.type !== 'tag') return undefined;
  return toViewModel(node);
};

export const getAllTagHubViewModels = (): TagHubViewModel[] =>
  Object.values(taxonomy)
    .filter((node) => node.type === 'tag' && isCanonicalTag(node.slug))
    .map((node) => toViewModel(node))
    .sort(sortByWeightAndTitle);

export const getTagHubDomains = (): TagHubDomain[] => [...TAG_HUB_DOMAINS];

export const getTagHubQuickPaths = (): TagHubQuickPathView[] =>
  tagHubQuickPaths.map((path) => {
    const tags = path.tags
      .map((slug) => getTagHubViewModel(slug))
      .filter((tag): tag is TagHubViewModel => Boolean(tag));

    return {
      id: path.id,
      title: path.title,
      description: path.description,
      slugs: path.tags,
      tags,
    };
  });

export const getTagHubQuickPathById = (id: string): TagHubQuickPathView | undefined =>
  getTagHubQuickPaths().find((path) => path.id === id);

export const resolveTagHubAlias = (query: string): TagHubViewModel | undefined => {
  const normalized = normalizeTaxonomyValue(query);
  const aliasResult = resolveAlias(normalized);
  if (!aliasResult) return undefined;

  const { node } = aliasResult;
  if (node.type !== 'tag') return undefined;

  return getTagHubViewModel(node.slug);
};

export const hasTagHubMetadata = (slug: string): boolean => Boolean(tagHubMetadata[slug]);

export const getTagHubMetadata = (slug: string): TagHubMetadataEntry | undefined =>
  tagHubMetadata[slug];

export const getTagHubQuickPathConfig = (): TagHubQuickPath[] => [...tagHubQuickPaths];

const normalizeTagSlug = (slug: string): string => slug.replace(/^tag-/, '').toLowerCase();

export interface TagGlossarySelectionOptions {
  taxonomyEntry?: TaxonomyNode | null;
  fallbackSlugs?: string[];
}

export interface TagGlossarySelectionResult {
  entry: GlossaryEntry | null;
  canonicalSlug: string | null;
}

export const resolveTagGlossarySelection = (
  tag: TagHubViewModel,
  options: TagGlossarySelectionOptions = {},
): TagGlossarySelectionResult => {
  const resolvedTagSlug = normalizeTagSlug(tag.slug);
  const canonicalMatch = getGlossaryTerm(resolvedTagSlug);
  const canonicalEntry =
    canonicalMatch && canonicalMatch.status === 'canonical' ? canonicalMatch : null;

  let entry: GlossaryEntry | TaxonomyNode | null = canonicalEntry ?? options.taxonomyEntry ?? null;

  const canonicalSlugCandidate =
    canonicalEntry?.slug ??
    (typeof tag.canonicalGlossarySlug === 'string' && tag.canonicalGlossarySlug.length
      ? tag.canonicalGlossarySlug
      : options.taxonomyEntry?.slug ?? null) ??
    null;

  if (!entry && options.fallbackSlugs?.length) {
    for (const slug of options.fallbackSlugs) {
      const fallbackEntry = getGlossaryTerm(slug);
      if (fallbackEntry && fallbackEntry.status === 'canonical') {
        entry = fallbackEntry;
        break;
      }
    }
  }

  const safeEntry = isGlossaryEntry(entry) ? entry : null;

  return {
    entry: safeEntry,
    canonicalSlug: canonicalSlugCandidate ?? safeEntry?.slug ?? null,
  };
};



```

---

## 4. taxonomy-tags.json

Raw list of all tags from blog posts.

```json
{
  "tags": [
    "Agile Coretime",
    "apollo-protocol",
    "auctions",
    "bear market",
    "Bitcoin",
    "Bitcoin halving",
    "bitcoin-halving",
    "blockchain",
    "blockchain architecture",
    "blockchain culture",
    "blockchain-development",
    "blockchain-economics",
    "bokolo-cash",
    "bonding-curve",
    "Bonk",
    "borrowing",
    "bridges",
    "bull market",
    "bull-market",
    "cbdc",
    "central-bank",
    "ceres",
    "concurrency",
    "consensus",
    "consensus mechanisms",
    "cross-chain",
    "cross-chain-bridges",
    "crowdloans",
    "crypto-market-cycles",
    "crypto-trends",
    "cryptocurrency",
    "cryptocurrency trends",
    "decentralization",
    "decentralized finance",
    "decentralized-exchanges",
    "decentralized-finance",
    "defi",
    "DeFi",
    "dex",
    "digital assets",
    "digital-ownership",
    "Dogecoin",
    "economic governance",
    "economic systems",
    "economics",
    "energy-efficiency",
    "Ethereum",
    "financial-inclusion",
    "forkless upgrades",
    "Fujiwara Testnet",
    "governance",
    "halving",
    "hub chain",
    "Hub-Chain",
    "hyperledger",
    "Hyperledger",
    "Hyperledger Iroha",
    "hyperledger-iroha",
    "hyperledger-iroha-2",
    "interoperability",
    "investment strategy",
    "investment-strategy",
    "iroha",
    "Iroha",
    "Iroha 2",
    "iroha3",
    "kensetsu",
    "kusama",
    "kusd",
    "lending",
    "liquidity",
    "liquidity-pools",
    "market analysis",
    "market cycles",
    "market psychology",
    "market-analysis",
    "market-psychology",
    "market-timing",
    "meme coins",
    "memory-safety",
    "mobile-payments",
    "monetary policy",
    "monetary-systems",
    "money-market",
    "nfts",
    "on-chain governance",
    "OpenGov",
    "pacific-islands",
    "parachain",
    "parachains",
    "parathreads",
    "Pepe",
    "polkadot",
    "Polkadot",
    "polkaswap",
    "Polkaswap",
    "proof of stake",
    "proof of work",
    "proof-of-stake",
    "proof-of-work",
    "pswap",
    "qr-payments",
    "real-world-assets",
    "redenomination",
    "relay chain",
    "Relay Chain",
    "rollups",
    "rust",
    "scalability",
    "scarcity economics",
    "shared security",
    "Shiba Inu",
    "slot leases",
    "smart-contracts",
    "solana",
    "solomon-islands",
    "sora",
    "SORA",
    "SORA Card",
    "SORA Parliament",
    "SORA v3",
    "sora-ecosystem",
    "sora-v3",
    "soramitsu",
    "SOSHIBA",
    "stablecoin",
    "stablecoins",
    "staking",
    "substrate",
    "Substrate",
    "supply-management",
    "sustainability",
    "tbcd",
    "telegram",
    "token bonding curve",
    "token repackaging",
    "token-bonding-curve",
    "token-repackaging",
    "tokenization",
    "tokenomics",
    "ton",
    "tonswap",
    "TONSWAP",
    "trading",
    "trading-strategy",
    "treasury",
    "val",
    "VAL",
    "validators",
    "volatility",
    "wasm",
    "Web3",
    "xcm",
    "XCM",
    "xor",
    "XOR"
  ]
}```

---

## 5. tag-stats.json

Usage counts and dates per tag.

```json
{
  "tag-agile-coretime": {
    "count": 1,
    "firstSeen": "2024-01-23T00:00:00.000Z",
    "lastSeen": "2025-10-31T00:00:00.000Z"
  },
  "tag-apollo-protocol": {
    "count": 1,
    "firstSeen": "2023-12-20T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-auctions": {
    "count": 1,
    "firstSeen": "2024-01-22T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-bear-market": {
    "count": 1,
    "firstSeen": "2023-12-17T00:00:00.000Z",
    "lastSeen": "2025-11-16T00:00:00.000Z"
  },
  "tag-bitcoin": {
    "count": 2,
    "firstSeen": "2023-12-17T00:00:00.000Z",
    "lastSeen": "2025-11-16T00:00:00.000Z"
  },
  "tag-bitcoin-halving": {
    "count": 2,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-blockchain": {
    "count": 5,
    "firstSeen": "2023-11-28T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-blockchain-architecture": {
    "count": 1,
    "firstSeen": "2024-01-07T00:00:00.000Z",
    "lastSeen": "2025-10-25T00:00:00.000Z"
  },
  "tag-blockchain-culture": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-blockchain-development": {
    "count": 1,
    "firstSeen": "2023-12-13T00:00:00.000Z",
    "lastSeen": "2025-11-20T00:00:00.000Z"
  },
  "tag-blockchain-economics": {
    "count": 1,
    "firstSeen": "2023-12-18T00:00:00.000Z",
    "lastSeen": "2025-11-17T00:00:00.000Z"
  },
  "tag-bokolo-cash": {
    "count": 1,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-11-21T00:00:00.000Z"
  },
  "tag-bonding-curve": {
    "count": 2,
    "firstSeen": "2023-10-11T00:00:00.000Z",
    "lastSeen": "2025-11-28T00:00:00.000Z"
  },
  "tag-bonk": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-borrowing": {
    "count": 1,
    "firstSeen": "2023-12-20T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-bridges": {
    "count": 3,
    "firstSeen": "2023-12-16T00:00:00.000Z",
    "lastSeen": "2025-11-19T00:00:00.000Z"
  },
  "tag-bull-market": {
    "count": 2,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-cbdc": {
    "count": 3,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-central-bank": {
    "count": 1,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-11-21T00:00:00.000Z"
  },
  "tag-ceres": {
    "count": 1,
    "firstSeen": "2023-12-20T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-concurrency": {
    "count": 1,
    "firstSeen": "2023-12-13T00:00:00.000Z",
    "lastSeen": "2025-11-20T00:00:00.000Z"
  },
  "tag-consensus": {
    "count": 1,
    "firstSeen": "2023-11-24T00:00:00.000Z",
    "lastSeen": "2025-11-27T00:00:00.000Z"
  },
  "tag-consensus-mechanisms": {
    "count": 1,
    "firstSeen": "2024-01-07T00:00:00.000Z",
    "lastSeen": "2025-10-25T00:00:00.000Z"
  },
  "tag-cross-chain": {
    "count": 5,
    "firstSeen": "2023-10-09T00:00:00.000Z",
    "lastSeen": "2025-11-25T00:00:00.000Z"
  },
  "tag-cross-chain-bridges": {
    "count": 1,
    "firstSeen": "2023-11-25T00:00:00.000Z",
    "lastSeen": "2025-11-24T00:00:00.000Z"
  },
  "tag-crowdloans": {
    "count": 2,
    "firstSeen": "2024-01-15T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-crypto-market-cycles": {
    "count": 1,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-crypto-trends": {
    "count": 1,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-cryptocurrency": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-cryptocurrency-trends": {
    "count": 1,
    "firstSeen": "2023-12-17T00:00:00.000Z",
    "lastSeen": "2025-11-16T00:00:00.000Z"
  },
  "tag-decentralization": {
    "count": 1,
    "firstSeen": "2023-12-21T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-decentralized-exchanges": {
    "count": 1,
    "firstSeen": "2023-11-28T00:00:00.000Z",
    "lastSeen": "2025-11-22T00:00:00.000Z"
  },
  "tag-decentralized-finance": {
    "count": 3,
    "firstSeen": "2023-11-25T00:00:00.000Z",
    "lastSeen": "2025-11-24T00:00:00.000Z"
  },
  "tag-defi": {
    "count": 23,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-dex": {
    "count": 2,
    "firstSeen": "2023-10-09T00:00:00.000Z",
    "lastSeen": "2025-11-25T00:00:00.000Z"
  },
  "tag-digital-assets": {
    "count": 1,
    "firstSeen": "2023-12-17T00:00:00.000Z",
    "lastSeen": "2025-11-16T00:00:00.000Z"
  },
  "tag-digital-ownership": {
    "count": 1,
    "firstSeen": "2023-11-26T00:00:00.000Z",
    "lastSeen": "2025-11-23T00:00:00.000Z"
  },
  "tag-dogecoin": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-economic-governance": {
    "count": 1,
    "firstSeen": "2024-01-19T00:00:00.000Z",
    "lastSeen": "2025-10-29T00:00:00.000Z"
  },
  "tag-economic-systems": {
    "count": 1,
    "firstSeen": "2024-01-17T00:00:00.000Z",
    "lastSeen": "2025-10-29T00:00:00.000Z"
  },
  "tag-economics": {
    "count": 2,
    "firstSeen": "2023-10-11T00:00:00.000Z",
    "lastSeen": "2025-11-28T00:00:00.000Z"
  },
  "tag-energy-efficiency": {
    "count": 1,
    "firstSeen": "2023-11-24T00:00:00.000Z",
    "lastSeen": "2025-11-27T00:00:00.000Z"
  },
  "tag-enterprise": {
    "count": 1,
    "firstSeen": "2025-12-09T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-ethereum": {
    "count": 1,
    "firstSeen": "2024-01-23T00:00:00.000Z",
    "lastSeen": "2025-10-31T00:00:00.000Z"
  },
  "tag-financial-inclusion": {
    "count": 1,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-11-21T00:00:00.000Z"
  },
  "tag-forkless-upgrades": {
    "count": 1,
    "firstSeen": "2024-01-22T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-fujiwara-testnet": {
    "count": 1,
    "firstSeen": "2025-06-08T00:00:00.000Z",
    "lastSeen": "2025-10-22T00:00:00.000Z"
  },
  "tag-governance": {
    "count": 17,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-halving": {
    "count": 1,
    "firstSeen": "2023-12-17T00:00:00.000Z",
    "lastSeen": "2025-11-16T00:00:00.000Z"
  },
  "tag-hub-chain": {
    "count": 2,
    "firstSeen": "2024-01-15T00:00:00.000Z",
    "lastSeen": "2025-10-28T00:00:00.000Z"
  },
  "tag-hyperledger": {
    "count": 2,
    "firstSeen": "2024-01-17T00:00:00.000Z",
    "lastSeen": "2025-11-15T00:00:00.000Z"
  },
  "tag-hyperledger-iroha": {
    "count": 11,
    "firstSeen": "2023-10-11T00:00:00.000Z",
    "lastSeen": "2025-11-28T00:00:00.000Z"
  },
  "tag-hyperledger-iroha-2": {
    "count": 1,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-11-21T00:00:00.000Z"
  },
  "tag-hyperledger-iroha-3": {
    "count": 0
  },
  "tag-interoperability": {
    "count": 9,
    "firstSeen": "2023-11-26T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-investment-strategy": {
    "count": 2,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-iroha": {
    "count": 3,
    "firstSeen": "2023-12-16T00:00:00.000Z",
    "lastSeen": "2025-11-19T00:00:00.000Z"
  },
  "tag-iroha-2": {
    "count": 1,
    "firstSeen": "2024-01-19T00:00:00.000Z",
    "lastSeen": "2025-10-29T00:00:00.000Z"
  },
  "tag-iroha3": {
    "count": 5,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-kensetsu": {
    "count": 5,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-11-30T00:00:00.000Z"
  },
  "tag-kusama": {
    "count": 1,
    "firstSeen": "2023-12-21T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-kusd": {
    "count": 6,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-11-30T00:00:00.000Z"
  },
  "tag-lending": {
    "count": 1,
    "firstSeen": "2023-12-20T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-liquidity": {
    "count": 2,
    "firstSeen": "2024-01-03T00:00:00.000Z",
    "lastSeen": "2025-11-20T00:00:00.000Z"
  },
  "tag-liquidity-pools": {
    "count": 1,
    "firstSeen": "2023-11-25T00:00:00.000Z",
    "lastSeen": "2025-11-24T00:00:00.000Z"
  },
  "tag-market-analysis": {
    "count": 2,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-market-cycles": {
    "count": 1,
    "firstSeen": "2023-12-17T00:00:00.000Z",
    "lastSeen": "2025-11-16T00:00:00.000Z"
  },
  "tag-market-psychology": {
    "count": 2,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-market-timing": {
    "count": 1,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-meme-coins": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-memory-safety": {
    "count": 1,
    "firstSeen": "2023-12-13T00:00:00.000Z",
    "lastSeen": "2025-11-20T00:00:00.000Z"
  },
  "tag-mobile-payments": {
    "count": 1,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-11-21T00:00:00.000Z"
  },
  "tag-monetary-policy": {
    "count": 1,
    "firstSeen": "2024-01-17T00:00:00.000Z",
    "lastSeen": "2025-10-29T00:00:00.000Z"
  },
  "tag-monetary-systems": {
    "count": 1,
    "firstSeen": "2023-12-18T00:00:00.000Z",
    "lastSeen": "2025-11-17T00:00:00.000Z"
  },
  "tag-money-market": {
    "count": 1,
    "firstSeen": "2023-12-20T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-nexus": {
    "count": 1,
    "firstSeen": "2025-12-09T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-nfts": {
    "count": 1,
    "firstSeen": "2023-11-26T00:00:00.000Z",
    "lastSeen": "2025-11-23T00:00:00.000Z"
  },
  "tag-on-chain-governance": {
    "count": 1,
    "firstSeen": "2024-01-19T00:00:00.000Z",
    "lastSeen": "2025-10-29T00:00:00.000Z"
  },
  "tag-opengov": {
    "count": 1,
    "firstSeen": "2024-01-23T00:00:00.000Z",
    "lastSeen": "2025-10-31T00:00:00.000Z"
  },
  "tag-pacific-islands": {
    "count": 1,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-11-21T00:00:00.000Z"
  },
  "tag-parachain": {
    "count": 2,
    "firstSeen": "2023-12-21T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-parachains": {
    "count": 3,
    "firstSeen": "2024-01-07T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-parathreads": {
    "count": 1,
    "firstSeen": "2024-01-22T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-pepe": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-polkadot": {
    "count": 9,
    "firstSeen": "2023-12-13T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-polkaswap": {
    "count": 15,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-11-30T00:00:00.000Z"
  },
  "tag-proof-of-stake": {
    "count": 2,
    "firstSeen": "2023-11-24T00:00:00.000Z",
    "lastSeen": "2025-11-27T00:00:00.000Z"
  },
  "tag-proof-of-work": {
    "count": 2,
    "firstSeen": "2023-11-24T00:00:00.000Z",
    "lastSeen": "2025-11-27T00:00:00.000Z"
  },
  "tag-pswap": {
    "count": 2,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-11-30T00:00:00.000Z"
  },
  "tag-qr-payments": {
    "count": 1,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-11-21T00:00:00.000Z"
  },
  "tag-real-world-assets": {
    "count": 1,
    "firstSeen": "2023-12-16T00:00:00.000Z",
    "lastSeen": "2025-11-19T00:00:00.000Z"
  },
  "tag-redenomination": {
    "count": 1,
    "firstSeen": "2023-12-25T00:00:00.000Z",
    "lastSeen": "2025-11-19T00:00:00.000Z"
  },
  "tag-relay-chain": {
    "count": 2,
    "firstSeen": "2024-01-07T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-rollups": {
    "count": 1,
    "firstSeen": "2024-01-23T00:00:00.000Z",
    "lastSeen": "2025-10-31T00:00:00.000Z"
  },
  "tag-rust": {
    "count": 1,
    "firstSeen": "2023-12-13T00:00:00.000Z",
    "lastSeen": "2025-11-20T00:00:00.000Z"
  },
  "tag-scalability": {
    "count": 1,
    "firstSeen": "2024-01-22T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-scarcity-economics": {
    "count": 1,
    "firstSeen": "2023-12-17T00:00:00.000Z",
    "lastSeen": "2025-11-16T00:00:00.000Z"
  },
  "tag-shared-security": {
    "count": 2,
    "firstSeen": "2024-01-07T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-shiba-inu": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-slot-leases": {
    "count": 1,
    "firstSeen": "2024-01-22T00:00:00.000Z",
    "lastSeen": "2025-10-30T00:00:00.000Z"
  },
  "tag-smart-contracts": {
    "count": 1,
    "firstSeen": "2023-12-13T00:00:00.000Z",
    "lastSeen": "2025-11-20T00:00:00.000Z"
  },
  "tag-solana": {
    "count": 1,
    "firstSeen": "2023-12-13T00:00:00.000Z",
    "lastSeen": "2025-11-20T00:00:00.000Z"
  },
  "tag-solomon-islands": {
    "count": 1,
    "firstSeen": "2023-11-29T00:00:00.000Z",
    "lastSeen": "2025-11-21T00:00:00.000Z"
  },
  "tag-sora": {
    "count": 23,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-sora-card": {
    "count": 1,
    "firstSeen": "2025-06-08T00:00:00.000Z",
    "lastSeen": "2025-10-22T00:00:00.000Z"
  },
  "tag-sora-ecosystem": {
    "count": 3,
    "firstSeen": "2023-11-26T00:00:00.000Z",
    "lastSeen": "2025-11-23T00:00:00.000Z"
  },
  "tag-sora-parliament": {
    "count": 1,
    "firstSeen": "2024-01-19T00:00:00.000Z",
    "lastSeen": "2025-10-29T00:00:00.000Z"
  },
  "tag-sora-v3": {
    "count": 4,
    "firstSeen": "2023-10-11T00:00:00.000Z",
    "lastSeen": "2025-11-28T00:00:00.000Z"
  },
  "tag-soramitsu": {
    "count": 1,
    "firstSeen": "2023-12-18T00:00:00.000Z",
    "lastSeen": "2025-11-17T00:00:00.000Z"
  },
  "tag-soshiba": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-stablecoin": {
    "count": 2,
    "firstSeen": "2023-10-11T00:00:00.000Z",
    "lastSeen": "2025-11-28T00:00:00.000Z"
  },
  "tag-stablecoins": {
    "count": 1,
    "firstSeen": "2023-11-25T00:00:00.000Z",
    "lastSeen": "2025-11-24T00:00:00.000Z"
  },
  "tag-staking": {
    "count": 1,
    "firstSeen": "2023-11-28T00:00:00.000Z",
    "lastSeen": "2025-11-22T00:00:00.000Z"
  },
  "tag-substrate": {
    "count": 2,
    "firstSeen": "2024-01-07T00:00:00.000Z",
    "lastSeen": "2025-11-15T00:00:00.000Z"
  },
  "tag-supply-management": {
    "count": 1,
    "firstSeen": "2023-12-25T00:00:00.000Z",
    "lastSeen": "2025-11-19T00:00:00.000Z"
  },
  "tag-sustainability": {
    "count": 1,
    "firstSeen": "2023-11-24T00:00:00.000Z",
    "lastSeen": "2025-11-27T00:00:00.000Z"
  },
  "tag-tbcd": {
    "count": 2,
    "firstSeen": "2023-10-11T00:00:00.000Z",
    "lastSeen": "2025-11-28T00:00:00.000Z"
  },
  "tag-telegram": {
    "count": 1,
    "firstSeen": "2025-11-13T00:00:00.000Z",
    "lastSeen": "2025-11-13T00:00:00.000Z"
  },
  "tag-token-bonding-curve": {
    "count": 4,
    "firstSeen": "2023-12-18T00:00:00.000Z",
    "lastSeen": "2025-11-19T00:00:00.000Z"
  },
  "tag-token-repackaging": {
    "count": 2,
    "firstSeen": "2023-12-25T00:00:00.000Z",
    "lastSeen": "2025-11-19T00:00:00.000Z"
  },
  "tag-tokenization": {
    "count": 2,
    "firstSeen": "2023-11-26T00:00:00.000Z",
    "lastSeen": "2025-11-23T00:00:00.000Z"
  },
  "tag-tokenomics": {
    "count": 9,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  },
  "tag-ton": {
    "count": 2,
    "firstSeen": "2023-11-25T00:00:00.000Z",
    "lastSeen": "2025-11-24T00:00:00.000Z"
  },
  "tag-tonswap": {
    "count": 6,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-11-30T00:00:00.000Z"
  },
  "tag-trading": {
    "count": 2,
    "firstSeen": "2023-10-09T00:00:00.000Z",
    "lastSeen": "2025-11-25T00:00:00.000Z"
  },
  "tag-trading-strategy": {
    "count": 1,
    "firstSeen": "2023-10-22T00:00:00.000Z",
    "lastSeen": "2025-11-29T00:00:00.000Z"
  },
  "tag-treasury": {
    "count": 1,
    "firstSeen": "2024-01-19T00:00:00.000Z",
    "lastSeen": "2025-10-29T00:00:00.000Z"
  },
  "tag-val": {
    "count": 3,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-11-30T00:00:00.000Z"
  },
  "tag-validator": {
    "count": 0
  },
  "tag-validators": {
    "count": 4,
    "firstSeen": "2023-11-24T00:00:00.000Z",
    "lastSeen": "2025-11-27T00:00:00.000Z"
  },
  "tag-volatility": {
    "count": 1,
    "firstSeen": "2024-01-10T00:00:00.000Z",
    "lastSeen": "2025-10-27T00:00:00.000Z"
  },
  "tag-wasm": {
    "count": 1,
    "firstSeen": "2023-12-13T00:00:00.000Z",
    "lastSeen": "2025-11-20T00:00:00.000Z"
  },
  "tag-web3": {
    "count": 2,
    "firstSeen": "2024-01-07T00:00:00.000Z",
    "lastSeen": "2025-10-31T00:00:00.000Z"
  },
  "tag-xcm": {
    "count": 2,
    "firstSeen": "2023-12-21T00:00:00.000Z",
    "lastSeen": "2025-11-18T00:00:00.000Z"
  },
  "tag-xor": {
    "count": 11,
    "firstSeen": "2023-10-04T00:00:00.000Z",
    "lastSeen": "2025-12-09T00:00:00.000Z"
  }
}
```

---

## 6. Sample Blog Frontmatter (3 posts)

Shows how tags are defined in blog posts.

```yaml
--- deep-dive-into-xor-val-and-pswap.mdx ---
---
publishDate: 2023-11-08T00:00:00Z
updateDate: 2025-11-26T00:00:00Z
title: "How XOR, VAL, and PSWAP Power the SORA Ecosystem"
excerpt: Discover how XOR, VAL, and PSWAP drive SORA’s economy, governance, and liquidity — and how they extend into SORA v3 (Nexus) on Hyperledger Iroha 3.
image: ~/assets/images/xor-pswap-val-investment-strategies.jpg
category: "DeFi & Trading"
tags:
  - sora
  - xor
  - val
  - pswap
  - hyperledger-iroha
  - kensetsu
  - kusd
  - polkaswap
  - tonswap
  - bonding-curve
  - governance
  - defi
canonicalURL: https://soranauts.com/deep-dive-into-xor-val-and-pswap
---

import FaqSection from '~/components/blog/FaqSection.astro';

## TL;DR

SORA’s economy runs on three interconnected tokens: **XOR** as the monetary base, **VAL** for governance, and **PSWAP** for liquidity rewards across Polkaswap and Kensetsu.  
Together they coordinate currency, governance, and market activity that sustain DeFi on SORA and cross-chain platforms like TONSWAP.  
These mechanisms are now evolving under **SORA v3 (SORA Nexus)** — a new hub chain built on **Hyperledger Iroha 3** and tested on the Fujiwara network.

---

## Understanding SORA’s Token Framework


--- exploring-sora-kensetsu-polkaswap.mdx ---
---
publishDate: 2024-01-03T00:00:00Z
updateDate: 2025-11-20T00:00:00Z
title: "SORA Kensetsu Explained: Stablecoins and DeFi on Polkaswap"
excerpt: SORA Kensetsu lets users mint KUSD, an over-collateralized stablecoin, using crypto collateral to support liquidity and risk-managed DeFi on Polkaswap.
image: ~/assets/images/exploring-sora-kensetsu-polkaswap.jpg
category: "SORA Ecosystem"
canonicalURL: https://soranauts.com/exploring-sora-kensetsu-polkaswap
tags:
  - sora
  - xor
  - kensetsu
  - kusd
  - tbcd
  - stablecoin
  - polkaswap
  - defi
  - governance
  - liquidity
  - tokenomics
---

import FaqSection from '~/components/blog/FaqSection.astro';

Stablecoins have transformed DeFi by providing price stability in volatile crypto markets. Unlike fiat-backed models, **SORA Kensetsu** introduces a decentralized, over-collateralized approach that puts users fully in control of issuance and risk.

Imagine minting a digital dollar backed entirely by your own crypto assets — safely locked in a smart vault — while supporting a balanced, decentralized economy. That’s the essence of **SORA Kensetsu**.

Kensetsu is SORA’s native **over-collateralized stablecoin system**, letting users lock assets like [XOR, VAL, PSWAP](/deep-dive-into-xor-val-and-pswap), ETH, DAI, or [TBCD](/soras-token-bonding-curve-dollar-tbcd-explained) to mint **KUSD (Kensetsu USD)** — a blockchain-based stablecoin pegged to the U.S. dollar and governed collectively by the SORA community.

> **TL;DR:**
> As of **November 2025**, SORA Kensetsu is an over-collateralized vault system that lets users mint **KUSD**, a stablecoin backed by approved collateral such as XOR, VAL, PSWAP, TBCD, ETH, and DAI.
> Governed by XOR holders, Kensetsu maintains solvency through collateralization rules, liquidation safeguards, and parameters like a 1% borrow tax.
> Alongside the **KEN** reward token and Polkaswap liquidity, it helps lock XOR, deepen SORA’s liquidity, and support future multi-stablecoin swaps under **SORA v3**.


--- sora-ecosystem-explained.mdx ---
---
publishDate: 2023-10-04T00:00:00Z
updateDate: 2025-11-30T00:00:00Z
title: "SORA Ecosystem: Complete DeFi & Tokenomics Playbook"
excerpt: "How SORA coordinates XOR, Polkaswap, Kensetsu, TONSWAP, and Nexus governance across DeFi rails and real-world pilots."
image: ~/assets/images/sora-ecosystem-explained.jpg
category: "Blockchain Technology"
tags:
  - sora
  - xor
  - val
  - pswap
  - polkaswap
  - kensetsu
  - kusd
  - iroha3
  - tonswap
  - defi
  - tokenomics
  - governance
canonicalURL: https://soranauts.com/sora-ecosystem-explained
customSlug: sora-ecosystem-explained
---

import FaqSection from '~/components/blog/FaqSection.astro';

## Introduction
The <a href="https://wiki.sora.org" target="_blank" rel="noopener noreferrer">SORA ecosystem</a>, stewarded by <a href="https://soramitsu.co.jp" target="_blank" rel="noopener noreferrer">SORAMITSU</a>, pairs the XOR monetary base, Polkaswap liquidity, Kensetsu stablecoins, and Hyperledger Iroha governance to build a supranational economy. Rather than a single chain, SORA coordinates public DeFi rails with permissioned partners so bridges, CBDCs, and consumer apps run on shared rules.

This guide explains how those building blocks work today and how SORA Nexus (v3) expands them into a multi-lane Hub Chain.

## TL;DR
SORA is an elastic economy coordinated by XOR, Polkaswap, Kensetsu (KUSD), TONSWAP, and a Nexus hub chain built on Hyperledger Iroha 3.  
As of November 2025, Nexus modules operate on the Fujiwara testnet while Gov1 governance, Polkaswap liquidity, and Kensetsu vaults run production usage.  
Together these layers connect cross-chain DeFi with real-world rails such as Bakong, Bokolo Cash, and the SORA Card program.
```

---

## 7. explore/index.astro (Current Page)

The main explorer page implementation.

```astro
---
import PageLayout from '~/layouts/PageLayout.astro';
import { TAG_HUB_V1 } from '~/utils/featureFlags';
import {
  formatTagLabel,
  getAllTagHubViewModels,
  getTagHubDomains,
  getTagHubQuickPaths,
} from '~/lib/tag-hub';
import type { MetaData } from '~/types';
import TagFilters from '~/components/tag-hub/TagFilters.tsx';
import type {
  TagHubDomainOption,
  TagHubTraitFilter,
  TagHubClientTag,
} from '~/components/tag-hub/TagFilters.tsx';
import ExplorerGlossaryContext from '~/components/tag-hub/ExplorerGlossaryContext';
import { FEATURE_EXPLORER_GLOSSARY_CONTEXT } from '~/config/feature-flags';
import { getTopTermsForDomain } from '~/lib/glossary/article-relations';
import NexusExplorerSection from '~/components/explore/NexusExplorerSection.astro';
import { getNexusTermCount } from '~/lib/glossary/stats';

export const prerender = true;

const disabledMetadata: MetaData = {
  title: 'Explore SORA Topics',
  description: 'Topic exploration is coming soon.',
  robots: {
    index: false,
    follow: false,
  },
};

const placeholderCopy =
  'SORA Explorer is in preview and not yet available on this environment. Check back after the next release to map governance activity, DeFi strategies, and ecosystem journeys curated by Soranauts.';

const isEnabled = TAG_HUB_V1;

const tags = isEnabled ? getAllTagHubViewModels() : [];
const quickPaths = isEnabled ? getTagHubQuickPaths() : [];
const domainOrder = isEnabled ? getTagHubDomains() : [];

// Get live Nexus term count from glossary stats
const nexusTermCount = getNexusTermCount();

const domainLabels: Record<string, string> = {
  ecosystem: 'Ecosystem & Adoption',
  defi: 'DeFi & Liquidity',
  economics: 'Economics & Tokenomics',
  governance: 'Governance & Policy',
  technology: 'Technology & Infrastructure',
  network: 'Network & Validators',
};

const domainOptions: TagHubDomainOption[] = domainOrder.map((domain) => ({
  id: domain,
  label:
    domainLabels[domain] ?? domain.replace(/-/g, ' ').replace(/(^|\s)\S/g, (match) => match.toUpperCase()),
}));

const traitFilters: TagHubTraitFilter[] = [
  { id: 'foundational', label: 'Foundational', trait: 'foundational' },
  { id: 'glossary', label: 'Glossary linked', trait: 'glossary-linked' },
  { id: 'beginner', label: 'Beginner friendly', trait: 'beginner-friendly' },
  { id: 'builder', label: 'Builder guide', trait: 'builder-guide' },
  { id: 'trending', label: 'Trending now', trait: 'trending' },
];

const foundationalTopics = tags
  .filter((tag) => tag.traits.includes('foundational'))
  .sort((a, b) => (b.metadata?.weight ?? 0) - (a.metadata?.weight ?? 0))
  .slice(0, 6);

const trendingTopics = tags
  .filter((tag) => Boolean(tag.lastSeen))
  .sort((a, b) => {
    const aDate = a.lastSeen ? new Date(a.lastSeen).valueOf() : 0;
    const bDate = b.lastSeen ? new Date(b.lastSeen).valueOf() : 0;
    if (bDate === aDate) {
      return b.usageCount - a.usageCount;
    }
    return bDate - aDate;
  })
  .slice(0, 8);

const domainSections = domainOrder.map((domain) => ({
  id: domain,
  label: domainLabels[domain] ?? domain,
  tags: tags
    .filter((tag) => tag.domain === domain)
    .sort((a, b) => (b.metadata?.weight ?? 0) - (a.metadata?.weight ?? 0))
    .slice(0, 6),
}));

const heroCopy =
  'Navigate the SORA knowledge graph in one place. SORA Explorer unifies glossary terms, governance updates, DeFi strategies, and ecosystem signals so you can map and understand the network.';

const glossaryContextByDomain =
  isEnabled && FEATURE_EXPLORER_GLOSSARY_CONTEXT
    ? Object.fromEntries(
        domainOrder.map((domain) => [domain, getTopTermsForDomain(domain, tags)]),
      )
    : {};

const enabledMetadata: MetaData = {
  title: 'SORA Explorer: Discover the Decentralized Economy',
  description:
    'SORA Explorer unites glossary insights, governance updates, DeFi strategies, and ecosystem signals—helping contributors map the network with confidence.',
  canonical: 'https://soranauts.com/explore',
  openGraph: {
    type: 'website',
    url: 'https://soranauts.com/explore',
    images: [
      {
        url: 'https://soranauts.com/og/sora-explorer.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

const metadata: MetaData = isEnabled ? enabledMetadata : disabledMetadata;

const pagefindMeta = isEnabled
  ? {
      type: 'collection',
      title: enabledMetadata.title,
      description: enabledMetadata.description,
      url: '/explore/',
    }
  : undefined;

const collectionJsonLd = isEnabled
  ? {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: enabledMetadata.title,
      description: enabledMetadata.description,
      url: 'https://soranauts.com/explore',
    }
  : undefined;

const islandTags: TagHubClientTag[] = tags.map((tag) => ({
  slug: tag.slug,
  title: tag.title,
  summary: tag.summary,
  domain: tag.domain,
  domainLabel: domainLabels[tag.domain] ?? tag.domain,
  traits: tag.traits,
  quickPathIds: tag.quickPathIds,
  usageCount: tag.usageCount,
  firstSeen: tag.firstSeen,
  lastSeen: tag.lastSeen,
  glossaryRef: tag.glossaryRef,
  category: tag.category,
  relatedTags: tag.relatedTags,
  aliases: tag.aliases,
}));

const quickPathSections = quickPaths.map((path) => ({
  id: path.id,
  title: path.title,
  description: path.description,
  tags: path.tags,
}));
---

<PageLayout metadata={metadata}>
  {collectionJsonLd && <script is:inline type="application/ld+json">{JSON.stringify(collectionJsonLd)}</script>}
  <main
    id="main-content"
    class="tag-hub-page px-4 md:px-6 lg:px-12 pt-8 md:pt-10 lg:pt-12 pb-12 md:pb-16 lg:pb-20 mx-auto max-w-7xl"
    data-pagefind-ignore="all"
  >
    <section class="tag-hub-hero">
      <span class="tag-hub-hero__kicker">SORA Explorer</span>
      <h1>SORA Explorer</h1>
      <p>{heroCopy}</p>
      <dl class="tag-hub-hero__stats">
        {isEnabled ? (
          <>
            <div class="tag-hub-hero__stat">
              <dt>Curated topics</dt>
              <dd>{tags.length}</dd>
            </div>
            <div class="tag-hub-hero__stat">
              <dt>Quick journeys</dt>
              <dd>{quickPathSections.length}</dd>
            </div>
            {nexusTermCount > 0 && (
              <div class="tag-hub-hero__stat">
                <dt>Nexus terms</dt>
                <dd>{nexusTermCount}</dd>
              </div>
            )}
            <div class="tag-hub-hero__stat">
              <dt>Latest update</dt>
              <dd>
                {trendingTopics[0]?.lastSeen
                  ? new Date(trendingTopics[0].lastSeen).toLocaleDateString('en', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </dd>
            </div>
          </>
        ) : (
          <>
            <div class="tag-hub-hero__stat">
              <dt>Status</dt>
              <dd>Preview</dd>
            </div>
            <div class="tag-hub-hero__stat">
              <dt>Availability</dt>
              <dd>Disabled</dd>
            </div>
            <div class="tag-hub-hero__stat">
              <dt>Next step</dt>
              <dd>Watch the release notes</dd>
            </div>
          </>
        )}
      </dl>
    </section>

    {!isEnabled && (
      <section class="px-4 py-16 mx-auto max-w-4xl text-center space-y-6">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">SORA Explorer Preview</h2>
        <p class="text-lg text-muted">{placeholderCopy}</p>
      </section>
    )}

    {isEnabled && (
      <>
        <section class="tag-hub-section" id="foundational">
      <div class="tag-hub-section__header">
        <h2>Foundational Topics</h2>
        <p class="tag-hub-section__description">
          Start here for SORA's core primitives—network tokens, liquidity venues, and economic
          guardrails that every contributor should know.
        </p>
      </div>
      <div class="tag-hub-section__grid">
        <!-- Tag cards are fully clickable anchors. When adding nested interactive controls, ensure they stop propagation so navigation remains intact. -->
        {foundationalTopics.map((tag) => {
          const formattedTitle = formatTagLabel(tag.slug, tag.title);
          return (
            <a class="tag-card" href={`/tag/${tag.slug.replace(/^tag-/, '')}`} role="group">
              <div class="tag-card__header">
                <span class="tag-card__domain">{domainLabels[tag.domain] ?? tag.domain.replace(/-/g, ' ')}</span>
                {tag.glossaryRef && <span class="tag-card__badge">Glossary</span>}
              </div>
              <h3 class="tag-card__title">{formattedTitle}</h3>
              {tag.summary && <p class="tag-card__summary">{tag.summary}</p>}
              <div class="tag-card__footer">
                <span class="tag-card__stat">
                  {tag.usageCount === 1 ? '1 post' : `${tag.usageCount} posts`}
                </span>
                {tag.lastSeen && (
                  <span class="tag-card__stat tag-card__stat--muted">
                    Updated{' '}
                    {new Date(tag.lastSeen).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>

    <!-- Nexus Architecture Section -->
    <NexusExplorerSection />

    <section class="tag-hub-section" id="quick-paths">
      <div class="tag-hub-section__header">
        <h2>Quick Paths</h2>
        <p class="tag-hub-section__description">
          Curated journeys bundle the most relevant tags for onboarding, governance deep dives, and
          DeFi power users.
        </p>
      </div>
      <div class="tag-hub-section__grid">
        {quickPathSections.map((path) => (
          <article class="tag-hub-quick-path">
            <h3 class="tag-hub-quick-path__title">{path.title}</h3>
            <p class="tag-hub-quick-path__description">{path.description}</p>
            <div class="tag-hub-quick-path__tags">
              {path.tags.map((tag) => {
                const formattedTitle = formatTagLabel(tag.slug, tag.title);
                return <a href={`/tag/${tag.slug.replace(/^tag-/, '')}`}>{formattedTitle}</a>;
              })}
            </div>
          </article>
        ))}
      </div>
    </section>

        <TagFilters 
          client:load 
          tags={islandTags} 
          domains={domainOptions} 
          traitFilters={traitFilters}
          title="Search SORA Explorer"
          description="Look up topics, tags, and curated journeys. Filters and sorting help you discover governance updates, DeFi strategies, and ecosystem insights."
        />

    <section class="tag-hub-section" id="domains">
      <div class="tag-hub-section__header">
        <h2>Explore by Domain</h2>
        <p class="tag-hub-section__description">
          Browse tags grouped by focus area—economics, governance, technology, network security, and
          the wider ecosystem.
        </p>
      </div>
      <div class="space-y-12">
        {domainSections.map((section) => (
          <div class="space-y-5" id={`domain-${section.id}`}>
            <div>
              <div class="tag-hub-section__domain">Domain focus</div>
              <h3 class="text-2xl font-semibold tracking-tight">{section.label}</h3>
            </div>
            {FEATURE_EXPLORER_GLOSSARY_CONTEXT &&
              (glossaryContextByDomain[section.id]?.length ?? 0) > 0 && (
                <ExplorerGlossaryContext
                  category={section.label}
                  relatedTerms={glossaryContextByDomain[section.id]}
                />
              )}
            <div class="tag-hub-section__grid">
              {section.tags.map((tag) => {
                const formattedTitle = formatTagLabel(tag.slug, tag.title);
                return (
                  <a class="tag-card" href={`/tag/${tag.slug.replace(/^tag-/, '')}`} role="group">
                    <div class="tag-card__header">
                      <span class="tag-card__domain">{domainLabels[tag.domain] ?? tag.domain.replace(/-/g, ' ')}</span>
                      {tag.glossaryRef && <span class="tag-card__badge">Glossary</span>}
                    </div>
                    <h3 class="tag-card__title">{formattedTitle}</h3>
                    {tag.summary && <p class="tag-card__summary">{tag.summary}</p>}
                    <div class="tag-card__footer">
                      <span class="tag-card__stat">
                        {tag.usageCount === 1 ? '1 post' : `${tag.usageCount} posts`}
                      </span>
                      {tag.lastSeen && (
                        <span class="tag-card__stat tag-card__stat--muted">
                          Updated{' '}
                          {new Date(tag.lastSeen).toLocaleDateString('en', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section class="tag-hub-section" id="trending">
      <div class="tag-hub-section__header">
        <h2>Trending & Recently Updated</h2>
        <p class="tag-hub-section__description">
          Follow emerging discussions and freshly updated knowledge—perfect for tracking governance
          votes or hot DeFi integrations.
        </p>
      </div>
      <div class="tag-hub-section__grid">
        {trendingTopics.map((tag) => {
          const formattedTitle = formatTagLabel(tag.slug, tag.title);
          return (
            <a class="tag-card" href={`/tag/${tag.slug.replace(/^tag-/, '')}`} role="group">
              <div class="tag-card__header">
                <span class="tag-card__domain">{domainLabels[tag.domain] ?? tag.domain.replace(/-/g, ' ')}</span>
                {tag.glossaryRef && <span class="tag-card__badge">Glossary</span>}
              </div>
              <h3 class="tag-card__title">{formattedTitle}</h3>
              {tag.summary && <p class="tag-card__summary">{tag.summary}</p>}
              <div class="tag-card__footer">
                <span class="tag-card__stat">
                  {tag.usageCount === 1 ? '1 post' : `${tag.usageCount} posts`}
                </span>
                {tag.lastSeen && (
                  <span class="tag-card__stat tag-card__stat--muted">
                    Updated{' '}
                    {new Date(tag.lastSeen).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              {tag.traits.length > 0 && (
                <div class="tag-card__traits">
                  {tag.traits.map((trait) => (
                    <span class="tag-card__chip">{trait.replace(/-/g, ' ')}</span>
                  ))}
                </div>
              )}
            </a>
          );
        })}
      </div>
    </section>
      </>
    )}
  </main>
</PageLayout>


```

---

## 8. NexusExplorerSection.astro

The Nexus Architecture section component.

```astro
---
/**
 * Nexus Explorer Section
 * 
 * Renders the Nexus Architecture topic with subgroups and quick journeys
 * as a first-class section in the SORA Explorer.
 * 
 * Accessibility:
 * - Proper heading hierarchy (h2 → h3 → h4)
 * - ARIA labels for collapsible sections
 * - Focus states for keyboard navigation
 * - Reduced motion support
 */
import { NEXUS_TOPIC, NEXUS_SUBGROUPS, NEXUS_QUICK_JOURNEYS, titleToSlug } from '~/data/nexus-explorer.config';
import { GLOSSARY_STATS } from '~/lib/glossary/stats';

interface Props {
  collapsed?: boolean;
}

const { collapsed = false } = Astro.props;
const totalNexusTerms = GLOSSARY_STATS.totalTerms;
---

<section 
  class="nexus-explorer-section" 
  id="nexus-architecture" 
  aria-labelledby="nexus-section-title"
  data-collapsed={collapsed}
>
  <div class="nexus-explorer-section__header">
    <div class="nexus-explorer-section__meta">
      <span class="nexus-explorer-section__kicker">Architecture Deep Dive</span>
      <h2 id="nexus-section-title" class="nexus-explorer-section__title">{NEXUS_TOPIC.title}</h2>
    </div>
    <div class="nexus-explorer-section__stat">
      <span class="nexus-explorer-section__stat-value">{totalNexusTerms}</span>
      <span class="nexus-explorer-section__stat-label">Nexus Terms</span>
    </div>
  </div>
  
  <p class="nexus-explorer-section__description">{NEXUS_TOPIC.description}</p>
  
  <!-- Quick Journeys -->
  <div class="nexus-explorer-journeys" role="region" aria-labelledby="journeys-heading">
    <h3 id="journeys-heading" class="nexus-explorer-journeys__title">Quick Journeys</h3>
    <div class="nexus-explorer-journeys__grid">
      {NEXUS_QUICK_JOURNEYS.map((journey) => (
        <article class="nexus-journey-card" aria-labelledby={`journey-${journey.id}`}>
          <h4 id={`journey-${journey.id}`} class="nexus-journey-card__title">{journey.title}</h4>
          <p class="nexus-journey-card__description">{journey.description}</p>
          <nav class="nexus-journey-card__steps" aria-label={`${journey.title} steps`}>
            {journey.steps.map((step, index) => (
              <a 
                href={`/glossary/${step.slug}`} 
                class="chip chip--sm chip--accent nexus-journey-card__step"
                aria-label={`Step ${index + 1}: ${step.title}${step.summary ? ` - ${step.summary}` : ''}`}
              >
                <span class="nexus-journey-card__step-number" aria-hidden="true">{index + 1}</span>
                <span class="nexus-journey-card__step-title">{step.title}</span>
              </a>
            ))}
          </nav>
        </article>
      ))}
    </div>
  </div>
  
  <!-- Subgroups -->
  <div class="nexus-explorer-subgroups" role="region" aria-labelledby="subgroups-heading">
    <h3 id="subgroups-heading" class="nexus-explorer-subgroups__title">Explore by Topic</h3>
    <div class="nexus-explorer-subgroups__grid">
      {NEXUS_SUBGROUPS.map((subgroup, idx) => (
        <details 
          class="nexus-subgroup" 
          open={idx < 3}
          id={`subgroup-${subgroup.id}`}
        >
          <summary 
            class="nexus-subgroup__header"
            aria-controls={`subgroup-content-${subgroup.id}`}
          >
            <div class="nexus-subgroup__header-text">
              <h4 class="nexus-subgroup__title">{subgroup.title}</h4>
              <span class="nexus-subgroup__count" aria-label={`${subgroup.terms.length} terms`}>
                {subgroup.terms.length} terms
              </span>
            </div>
            <span class="nexus-subgroup__chevron" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </summary>
          <div id={`subgroup-content-${subgroup.id}`} class="nexus-subgroup__content">
            <p class="nexus-subgroup__description">{subgroup.description}</p>
            <div class="nexus-subgroup__terms" role="list">
              {subgroup.terms.slice(0, 8).map((term) => (
                <a 
                  href={`/glossary/${titleToSlug(term)}`} 
                  class="chip chip--sm chip--muted nexus-subgroup__term"
                  role="listitem"
                >
                  {term}
                </a>
              ))}
              {subgroup.terms.length > 8 && (
                <span class="chip chip--sm chip--neutral nexus-subgroup__more" aria-label={`${subgroup.terms.length - 8} more terms available`}>
                  +{subgroup.terms.length - 8} more
                </span>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  </div>
  
  <!-- View All Link -->
  <div class="nexus-explorer-section__footer">
    <a href="/glossary?tag=Nexus+Architecture" class="nexus-explorer-section__cta">
      <span>View all {totalNexusTerms} Nexus terms in Glossary</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>
</section>

<style>
  .nexus-explorer-section {
    margin-top: var(--space-12);
    padding: var(--space-10);
    background: linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 90%, var(--color-brand-soft) 10%) 0%, var(--color-surface) 100%);
    border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-card);
    scroll-margin-top: 6rem; /* Offset for sticky header */
  }
  
  .nexus-explorer-section__header {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }
  
  .nexus-explorer-section__meta {
    flex: 1;
    min-width: 200px;
  }
  
  .nexus-explorer-section__kicker {
    display: block;
    font-size: var(--text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-accent);
    margin-bottom: var(--space-1);
  }
  
  .nexus-explorer-section__title {
    font-size: var(--text-2xl);
    font-weight: 700;
    margin: 0;
    color: var(--color-text);
  }
  
  .nexus-explorer-section__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-3) var(--space-5);
    background: color-mix(in srgb, var(--color-surface) 92%, rgba(255, 255, 255, 0.04));
    border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
    border-radius: var(--radius-md);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
  
  .nexus-explorer-section__stat-value {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
  }
  
  .nexus-explorer-section__stat-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: var(--space-1);
  }
  
  .nexus-explorer-section__description {
    font-size: var(--text-base);
    color: var(--color-text-muted);
    max-width: 80ch;
    margin-bottom: var(--space-8);
    line-height: 1.6;
  }
  
  /* Quick Journeys */
  .nexus-explorer-journeys {
    margin-bottom: var(--space-10);
  }
  
  .nexus-explorer-journeys__title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-4);
    color: var(--color-text);
  }
  
  .nexus-explorer-journeys__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-6);
  }
  
  .nexus-journey-card {
    padding: var(--space-6);
    background: var(--color-surface);
    border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    transition:
      border-color var(--motion-duration-fast) var(--motion-ease-standard),
      box-shadow var(--motion-duration-fast) var(--motion-ease-standard);
  }
  
  .nexus-journey-card:hover {
    border-color: color-mix(in srgb, var(--color-accent) 25%, var(--color-border) 75%);
    box-shadow: var(--shadow-card);
  }
  
  .nexus-journey-card:focus-within {
    outline: 2px solid var(--focus-ring);
    outline-offset: 3px;
  }
  
  .nexus-journey-card__title {
    font-size: var(--text-base);
    font-weight: 600;
    margin: 0 0 var(--space-2);
    color: var(--color-text);
  }
  
  .nexus-journey-card__description {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-4);
    line-height: 1.5;
  }
  
  .nexus-journey-card__steps {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  
  .nexus-journey-card__step {
    text-decoration: none;
  }
  
  .nexus-journey-card__step-number {
    display: inline-grid;
    place-items: center;
    min-width: var(--chip-count-size);
    height: var(--chip-count-size);
    padding-inline: 0.25rem;
    font-size: var(--chip-count-font);
    font-weight: 600;
    background: var(--red-600);
    color: white;
    border-radius: var(--radius-full);
    line-height: 1;
  }
  
  .nexus-journey-card__step-title {
    font-weight: 500;
  }
  
  /* Subgroups */
  .nexus-explorer-subgroups__title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-4);
    color: var(--color-text);
  }
  
  .nexus-explorer-subgroups__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: var(--space-4);
  }
  
  .nexus-subgroup {
    background: var(--color-surface);
    border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    scroll-margin-top: 6rem;
  }
  
  .nexus-subgroup__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-4);
    cursor: pointer;
    user-select: none;
    background: var(--color-surface-elevated);
    border-bottom: 1px solid transparent;
    transition: background-color 0.15s ease;
    list-style: none;
  }
  
  .nexus-subgroup__header::-webkit-details-marker {
    display: none;
  }
  
  .nexus-subgroup__header:hover {
    background: var(--color-surface-hover);
  }
  
  .nexus-subgroup__header:focus {
    outline: none;
  }
  
  .nexus-subgroup__header:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -2px;
  }
  
  .nexus-subgroup[open] .nexus-subgroup__header {
    border-bottom-color: var(--color-border);
  }
  
  .nexus-subgroup__header-text {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
    flex: 1;
    min-width: 0;
  }
  
  .nexus-subgroup__title {
    font-size: var(--text-sm);
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
    white-space: nowrap;
  }
  
  .nexus-subgroup__count {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    white-space: nowrap;
  }
  
  .nexus-subgroup__chevron {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    transition: transform 0.2s ease;
  }
  
  .nexus-subgroup[open] .nexus-subgroup__chevron {
    transform: rotate(180deg);
  }
  
  .nexus-subgroup__content {
    animation: slideDown 0.2s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .nexus-subgroup__description {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    padding: var(--space-3) var(--space-4);
    margin: 0;
    border-bottom: 1px solid var(--color-border);
    line-height: 1.5;
  }
  
  .nexus-subgroup__terms {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-4);
  }
  
  .nexus-subgroup__term,
  .nexus-subgroup__more {
    text-decoration: none;
  }
  
  /* Footer */
  .nexus-explorer-section__footer {
    margin-top: var(--space-8);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
    text-align: center;
  }
  
  .nexus-explorer-section__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-sm);
    font-weight: 600;
    background: var(--red-600);
    color: white;
    border-radius: var(--radius-lg);
    text-decoration: none;
    box-shadow: var(--shadow-md);
    transition:
      background-color var(--motion-duration-fast) var(--motion-ease-standard),
      transform var(--motion-duration-fast) var(--motion-ease-standard);
  }
  
  .nexus-explorer-section__cta:hover {
    background: var(--red-700);
    transform: translateY(-1px);
  }
  
  .nexus-explorer-section__cta:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
  
  .nexus-explorer-section__cta svg {
    flex-shrink: 0;
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .nexus-journey-card,
    .nexus-journey-card__step,
    .nexus-subgroup__header,
    .nexus-subgroup__chevron,
    .nexus-subgroup__term,
    .nexus-explorer-section__cta {
      transition: none;
    }
    
    .nexus-subgroup__content {
      animation: none;
    }
    
    .nexus-explorer-section__cta:hover {
      transform: none;
    }
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .nexus-explorer-section {
      padding: var(--space-5);
    }
    
    .nexus-explorer-section__header {
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .nexus-explorer-section__stat {
      align-self: flex-start;
      flex-direction: row;
      gap: var(--space-2);
    }
    
    .nexus-explorer-section__stat-label {
      margin-top: 0;
    }
    
    .nexus-explorer-journeys__grid,
    .nexus-explorer-subgroups__grid {
      grid-template-columns: 1fr;
    }
    
    .nexus-journey-card__steps {
      gap: var(--space-1);
    }
    
    .nexus-journey-card__step {
      flex: 1 1 auto;
      justify-content: center;
    }
  }
</style>

```

---

## Summary Statistics

| Component | Count/Size |
|-----------|------------|
| Canonical Tags | 51 |
| Tags with Metadata | 17 |
| Tags in Stats | 135 |
| Domains | 6 |
| Traits | 6 |
| Ecosystem Quick Paths | 3 |
| Nexus Subgroups | 7 |
| Nexus Quick Journeys | 2 |
| Blog Posts | 49 |

