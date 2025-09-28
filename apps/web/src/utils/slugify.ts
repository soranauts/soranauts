/**
 * Unified slugify function for consistent URL-safe slugs across the application
 * Used by both glossary generation and remark auto-linker plugins
 */

/**
 * Generate a URL-safe slug from a string
 * - Lowercase
 * - NFKD normalize (decompose unicode characters)
 * - Strip non-alphanumeric characters except spaces and hyphens
 * - Collapse multiple spaces/hyphens into single hyphens
 * - Trim leading/trailing hyphens
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD') // Decompose unicode characters (é -> e + ´)
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Generate a glossary-specific slug with consistent formatting
 * This ensures the same term always generates the same slug
 */
export function generateGlossarySlug(term: string): string {
  return slugify(term);
}

/**
 * Check if two terms would generate the same slug
 * Useful for detecting potential slug collisions
 */
export function wouldCollide(term1: string, term2: string): boolean {
  return generateGlossarySlug(term1) === generateGlossarySlug(term2);
}

/**
 * Generate all possible slugs for a term and its aliases
 * Used for comprehensive term matching
 */
export function generateAllSlugs(term: string, aliases: string[] = []): string[] {
  const slugs = new Set<string>();
  
  // Add main term slug
  slugs.add(generateGlossarySlug(term));
  
  // Add alias slugs
  aliases.forEach(alias => {
    slugs.add(generateGlossarySlug(alias));
  });
  
  return Array.from(slugs);
}


