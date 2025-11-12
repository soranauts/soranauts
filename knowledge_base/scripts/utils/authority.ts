/**
 * Authority computation for KB documents
 * 
 * Authority levels:
 * - 1: Highest - BCK papers, formal whitepapers/specs
 * - 2: High - Official docs (wiki, iroha_docs, soramitsu_site, tonswap_site)
 * - 3: Normal - Soranauts editorial content (default)
 * - 4: Low - External blogs/opinion/unverified commentary
 */

/**
 * Compute authority level based on source type and file path
 * @param source - Source type from frontmatter
 * @param filePath - Relative file path from KB root
 * @returns Authority level (1-4), default 3
 */
export function computeAuthority(source: string, filePath: string): number {
  // Authority 1: BCK papers, formal research, and internal research
  const bckSources = ['bck21', 'bck22', 'bck23', 'bck24'];
  const internalResearchSources = ['internal-research'];
  
  if (bckSources.includes(source) || internalResearchSources.includes(source)) {
    return 1;
  }
  
  // Check path for BCK research papers or internal research
  if (filePath.includes('curated/research/bck') || filePath.includes('curated/internal-research/')) {
    return 1;
  }
  
  // Authority 2: Official documentation
  const officialSources = ['wiki', 'iroha_docs', 'soramitsu', 'tonswap_site'];
  if (officialSources.includes(source)) {
    return 2;
  }
  
  // Check path for official docs
  if (filePath.includes('curated/wiki/') || 
      filePath.includes('curated/iroha_docs/') ||
      filePath.includes('curated/soramitsu_site/') ||
      filePath.includes('curated/tonswap_site/')) {
    return 2;
  }
  
  // Authority 4: External/opinion content (if identifiable)
  // For now, we don't have clear markers for external content
  // This can be extended if we add external source types
  
  // Authority 3: Default (Soranauts editorial, ecosystem updates, articles, community memos, etc.)
  return 3;
}

/**
 * Get authority multiplier for scoring
 * @param authority - Authority level (1-4), defaults to 3 if missing/invalid
 * @returns Multiplier to apply to scores
 */
export function getAuthorityMultiplier(authority?: number): number {
  // Default to 3 (neutral) if missing or invalid
  const auth = authority && authority >= 1 && authority <= 4 ? authority : 3;
  
  switch (auth) {
    case 1: return 1.30; // Highest authority: +30% boost
    case 2: return 1.15; // High authority: +15% boost
    case 3: return 1.00; // Normal authority: no change
    case 4: return 0.85; // Low authority: -15% penalty
    default: return 1.00;
  }
}

