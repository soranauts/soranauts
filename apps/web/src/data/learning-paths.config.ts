/**
 * Unified Learning Paths Configuration
 * 
 * Combines ecosystem journeys and Nexus architecture into one system.
 * Each path is a curated sequence of tags or glossary terms.
 */

export interface LearningPathStep {
  type: 'tag' | 'glossary';
  slug: string;
  title: string;
  summary?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'ecosystem' | 'architecture' | 'defi';
  estimatedMinutes: number;
  steps: LearningPathStep[];
  cta?: {
    label: string;
    href: string;
  };
}

export const LEARNING_PATHS: LearningPath[] = [
  // ============================================================
  // BEGINNER PATHS - Start here
  // ============================================================
  
  {
    id: 'new-to-sora',
    title: 'New to SORA',
    description: 'Your first 10 minutes with SORA. Learn what it is, why it matters, and how to get started.',
    difficulty: 'beginner',
    category: 'ecosystem',
    estimatedMinutes: 10,
    steps: [
      { type: 'tag', slug: 'sora', title: 'SORA', summary: 'The decentralized economic network' },
      { type: 'tag', slug: 'xor', title: 'XOR', summary: 'The native utility token' },
      { type: 'tag', slug: 'polkaswap', title: 'Polkaswap', summary: 'Trade tokens on SORA' },
      { type: 'tag', slug: 'sora-card', title: 'SORA Card', summary: 'Spend crypto in real life' },
      { type: 'glossary', slug: 'fearlesswallet', title: 'Fearless Wallet', summary: 'Your gateway to SORA' },
    ],
    cta: { label: 'Get Fearless Wallet', href: 'https://fearlesswallet.io' },
  },
  
  {
    id: 'nexus-in-5-minutes',
    title: 'Understanding Nexus in 5 Minutes',
    description: 'A rapid intro to SORA Nexus architecture for the curious.',
    difficulty: 'beginner',
    category: 'architecture',
    estimatedMinutes: 5,
    steps: [
      { type: 'glossary', slug: 'soranexus', title: 'SORA Nexus', summary: 'The unified global ledger' },
      { type: 'glossary', slug: 'irohavirtualmachineivm', title: 'IVM', summary: 'The execution engine' },
      { type: 'glossary', slug: 'lanes', title: 'Lanes', summary: 'Parallel transaction processing' },
      { type: 'glossary', slug: 'sumeragi', title: 'Sumeragi', summary: 'BFT consensus protocol' },
    ],
  },
  
  // ============================================================
  // INTERMEDIATE PATHS - Deeper understanding
  // ============================================================
  
  {
    id: 'governance-economics',
    title: 'Governance & Economics',
    description: 'How SORA makes decisions and manages its economy.',
    difficulty: 'intermediate',
    category: 'ecosystem',
    estimatedMinutes: 15,
    steps: [
      { type: 'tag', slug: 'governance', title: 'Governance', summary: 'On-chain decision making' },
      { type: 'tag', slug: 'tokenomics', title: 'Tokenomics', summary: 'Token supply design' },
      { type: 'tag', slug: 'kusd', title: 'KUSD', summary: 'The Kensetsu stablecoin' },
      { type: 'glossary', slug: 'soraparliament', title: 'SORA Parliament', summary: 'The governance body' },
    ],
  },
  
  {
    id: 'defi-power-user',
    title: 'DeFi Power User',
    description: 'Advanced liquidity strategies on Polkaswap.',
    difficulty: 'intermediate',
    category: 'defi',
    estimatedMinutes: 20,
    steps: [
      { type: 'tag', slug: 'liquidity', title: 'Liquidity', summary: 'Providing LP tokens' },
      { type: 'tag', slug: 'staking', title: 'Staking', summary: 'Earn rewards' },
      { type: 'tag', slug: 'kensetsu', title: 'Kensetsu', summary: 'CDP vaults' },
      { type: 'tag', slug: 'tonswap', title: 'TONSWAP', summary: 'DeFi on TON' },
    ],
  },
  
  {
    id: 'nexus-data-spaces',
    title: 'Data Spaces & Governance',
    description: 'How Nexus organizes data and enforces rules.',
    difficulty: 'intermediate',
    category: 'architecture',
    estimatedMinutes: 15,
    steps: [
      { type: 'glossary', slug: 'dataspaces', title: 'Data Spaces', summary: 'Isolated execution environments' },
      { type: 'glossary', slug: 'publicdataspaces', title: 'Public Data Spaces', summary: 'Open participation' },
      { type: 'glossary', slug: 'privatedataspaces', title: 'Private Data Spaces', summary: 'Permissioned access' },
      { type: 'glossary', slug: 'assembly', title: 'Assembly', summary: 'Data space governance' },
      { type: 'glossary', slug: 'governedmanifest', title: 'Governed Manifest', summary: 'Configuration rules' },
    ],
  },
  
  // ============================================================
  // ADVANCED PATHS - Deep technical dives
  // ============================================================
  
  {
    id: 'execution-flow',
    title: 'Execution Flow Deep Dive',
    description: 'Follow a transaction from submission to finalization.',
    difficulty: 'advanced',
    category: 'architecture',
    estimatedMinutes: 30,
    steps: [
      { type: 'glossary', slug: 'submission', title: 'Submission', summary: 'Transaction enters network' },
      { type: 'glossary', slug: 'kotodama', title: 'Kotodama', summary: 'Smart contract runtime' },
      { type: 'glossary', slug: 'transactionexecutionunitsteu', title: 'TEU', summary: 'Gas metering' },
      { type: 'glossary', slug: 'execution', title: 'Execution', summary: 'IVM processes instructions' },
      { type: 'glossary', slug: 'worldstateviewwsv', title: 'World State View', summary: 'State updates' },
      { type: 'glossary', slug: 'lanefinality', title: 'Lane Finality', summary: 'Lane-level consensus' },
      { type: 'glossary', slug: 'sumeragi', title: 'Sumeragi', summary: 'Global consensus' },
    ],
  },
  
  {
    id: 'consensus-mechanics',
    title: 'Consensus Mechanics',
    description: 'How Sumeragi achieves Byzantine fault tolerance.',
    difficulty: 'advanced',
    category: 'architecture',
    estimatedMinutes: 25,
    steps: [
      { type: 'glossary', slug: 'sumeragi', title: 'Sumeragi', summary: 'BFT consensus protocol' },
      { type: 'glossary', slug: 'sumeragiconsensus', title: 'Sumeragi Consensus', summary: 'The full pipeline' },
      { type: 'glossary', slug: 'proposevalidatevotecommit', title: 'Propose-Validate-Vote-Commit', summary: 'Consensus phases' },
      { type: 'glossary', slug: 'vrfsortition', title: 'VRF Sortition', summary: 'Random leader selection' },
      { type: 'glossary', slug: 'epochbeacon', title: 'Epoch Beacon', summary: 'Randomness source' },
      { type: 'glossary', slug: 'lockedqc', title: 'Locked QC', summary: 'Safety guarantees' },
    ],
  },
  
  {
    id: 'cryptography-proofs',
    title: 'Cryptography & Proofs',
    description: 'Zero-knowledge proofs and post-quantum security in Nexus.',
    difficulty: 'advanced',
    category: 'architecture',
    estimatedMinutes: 35,
    steps: [
      { type: 'glossary', slug: 'fastpq', title: 'FASTPQ', summary: 'Post-quantum proof system' },
      { type: 'glossary', slug: 'stark', title: 'STARK', summary: 'Transparent proofs' },
      { type: 'glossary', slug: 'poseidon2', title: 'Poseidon2', summary: 'ZK-friendly hashing' },
      { type: 'glossary', slug: 'kyber768', title: 'Kyber768', summary: 'Post-quantum key exchange' },
      { type: 'glossary', slug: 'mldsa87', title: 'ML-DSA-87', summary: 'Post-quantum signatures' },
    ],
  },
];

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get all paths filtered by difficulty level
 */
export const getLearningPathsByDifficulty = (difficulty: LearningPath['difficulty']): LearningPath[] =>
  LEARNING_PATHS.filter(p => p.difficulty === difficulty);

/**
 * Get all paths filtered by category
 */
export const getLearningPathsByCategory = (category: LearningPath['category']): LearningPath[] =>
  LEARNING_PATHS.filter(p => p.category === category);

/**
 * Get a single path by ID
 */
export const getLearningPathById = (id: string): LearningPath | undefined =>
  LEARNING_PATHS.find(p => p.id === id);

/**
 * Get total estimated time for all paths
 */
export const getTotalLearningTime = (): number =>
  LEARNING_PATHS.reduce((sum, p) => sum + p.estimatedMinutes, 0);

/**
 * Get counts by difficulty
 */
export const getPathCountsByDifficulty = (): Record<LearningPath['difficulty'], number> => ({
  beginner: LEARNING_PATHS.filter(p => p.difficulty === 'beginner').length,
  intermediate: LEARNING_PATHS.filter(p => p.difficulty === 'intermediate').length,
  advanced: LEARNING_PATHS.filter(p => p.difficulty === 'advanced').length,
});

/**
 * Get counts by category
 */
export const getPathCountsByCategory = (): Record<LearningPath['category'], number> => ({
  ecosystem: LEARNING_PATHS.filter(p => p.category === 'ecosystem').length,
  architecture: LEARNING_PATHS.filter(p => p.category === 'architecture').length,
  defi: LEARNING_PATHS.filter(p => p.category === 'defi').length,
});

