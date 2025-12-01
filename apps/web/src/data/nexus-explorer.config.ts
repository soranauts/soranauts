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

