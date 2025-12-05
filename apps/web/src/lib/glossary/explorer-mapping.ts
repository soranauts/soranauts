/**
 * Maps glossary categories to Explorer domains.
 * Used to add "Explore {Domain} topics" links in term page sidebars.
 */

export const CATEGORY_TO_EXPLORER_DOMAIN: Record<string, string> = {
  // Core categories
  'Economics': 'economics',
  'Token': 'economics',
  'economics': 'economics',
  'token': 'economics',
  
  // Technology categories
  'Technology': 'technology',
  'technology': 'technology',
  'Cryptography': 'technology',
  'cryptography': 'technology',
  'Execution': 'technology',
  'execution': 'technology',
  'Data Availability': 'technology',
  'Data & Availability': 'technology',
  'data-availability': 'technology',
  'Serialization & Encoding': 'technology',
  'serialization': 'technology',
  'Networking': 'technology',
  'networking': 'technology',
  'Developer Experience': 'technology',
  'Developer & Experience': 'technology',
  'developer-experience': 'technology',
  'Accounts': 'technology',
  'Accounts & Identity': 'technology',
  'accounts': 'technology',
  'Storage': 'technology',
  'storage': 'technology',
  
  // Governance categories
  'Governance': 'governance',
  'governance': 'governance',
  'Consensus': 'governance',
  'consensus': 'governance',
  'Consensus & Scheduling': 'governance',
  
  // DeFi categories
  'DeFi': 'defi',
  'defi': 'defi',
  
  // Network categories
  'Network': 'network',
  'network': 'network',
  
  // Ecosystem categories
  'Ecosystem': 'ecosystem',
  'ecosystem': 'ecosystem',
  
  // Operations
  'Observability & Operations': 'technology',
  'observability': 'technology',
  
  // Use Cases
  'Use Cases': 'ecosystem',
  'Use & Cases': 'ecosystem',
  'use-cases': 'ecosystem',
};

/**
 * Get the Explorer domain for a glossary category.
 * Returns null if no mapping exists.
 */
export function getExplorerDomainForCategory(category: string): string | null {
  return CATEGORY_TO_EXPLORER_DOMAIN[category] ?? null;
}

/**
 * Get the Explorer URL for a category.
 * Returns null if no mapping exists.
 */
export function getExplorerUrlForCategory(category: string): string | null {
  const domain = getExplorerDomainForCategory(category);
  if (!domain) return null;
  return `/explore#domain-${domain}`;
}

/**
 * Get a human-readable domain label.
 */
export function getExplorerDomainLabel(domain: string): string {
  const labels: Record<string, string> = {
    economics: 'Economics',
    technology: 'Technology',
    governance: 'Governance',
    defi: 'DeFi',
    network: 'Network',
    ecosystem: 'Ecosystem',
  };
  return labels[domain] ?? domain;
}
