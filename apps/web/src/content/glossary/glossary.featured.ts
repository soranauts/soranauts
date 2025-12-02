/**
 * Featured Glossary Terms (Nexus Architecture)
 * 
 * A curated list of accessible Nexus terms for users who want to go deeper.
 * These appear AFTER the user-facing terms (XOR, Polkaswap, etc.) on the
 * glossary landing page.
 * 
 * Selection criteria:
 * - Accessible concepts that bridge user experience to architecture
 * - Terms newcomers can understand without deep technical background
 * - Entry points to deeper exploration
 */

export const FEATURED_GLOSSARY_SLUGS = [
  // Most accessible Nexus concepts
  'soranet',           // The network itself
  'xorutility',        // XOR's role in Nexus
  'dataspaces',        // Logical data organization
  'assembly',          // Governance entry point
  
  // Core architecture (slightly more technical)
  'sumeragi',          // Consensus - users may have heard of this
  'lanes',             // Parallel processing concept
  'dataavailability',  // Important for understanding reliability
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

