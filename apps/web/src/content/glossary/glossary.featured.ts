/**
 * Featured Glossary Terms
 * 
 * A curated list of ~16 canonical slugs representing the best high-level
 * introduction to the SORA Nexus architecture. These terms are displayed
 * prominently on the glossary landing page.
 * 
 * Selection criteria:
 * - Core concepts that define Nexus architecture
 * - Terms that help newcomers understand the system
 * - Balanced coverage across major categories
 */

export const FEATURED_GLOSSARY_SLUGS = [
  // Accounts & Identity - Foundation of user interaction
  'accountid',
  'accountlifecycle',
  
  // Execution - How transactions are processed
  'irohavirtualmachineivm',
  'kotodama',
  'transactionexecutionunitsteu',
  'action',
  
  // Data Availability - State management
  'worldstateviewwsv',
  'dataavailability',
  'lanes',
  
  // Consensus - How agreement is reached
  'sumeragi',
  'quorumcertificate',
  
  // Governance - Decision making
  'assembly',
  'dataspaces',
  'governedsurfaces',
  
  // Economics - Value and incentives
  'xorutility',
  
  // Networking - Communication layer
  'soranet',
] as const;

export type FeaturedGlossarySlug = typeof FEATURED_GLOSSARY_SLUGS[number];

/**
 * Check if a slug is in the featured list.
 */
export function isFeaturedTerm(slug: string): boolean {
  return (FEATURED_GLOSSARY_SLUGS as readonly string[]).includes(slug.toLowerCase());
}

/**
 * Get the featured terms in display order.
 */
export function getFeaturedSlugs(): readonly string[] {
  return FEATURED_GLOSSARY_SLUGS;
}

