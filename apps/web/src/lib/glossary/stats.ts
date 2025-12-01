/**
 * Glossary Statistics Module
 * Dynamically computes glossary metrics from the canonical dataset.
 */

import glossaryData from '../../../public/data/glossary.v2025.json';
import aliasData from '../../../public/glossary.aliases.v2025.json';

export interface GlossaryStats {
  totalTerms: number;
  totalAliases: number;
  totalCategories: number;
  categories: string[];
  categoryDistribution: Record<string, number>;
}

/**
 * Compute live glossary statistics from the dataset.
 * This replaces any hardcoded constants.
 */
export function getGlossaryStats(): GlossaryStats {
  const terms = glossaryData.terms ?? [];
  const aliases = aliasData.aliases ?? [];

  // Count unique categories
  const categorySet = new Set<string>();
  const categoryDistribution: Record<string, number> = {};

  for (const term of terms) {
    const category = term.category;
    if (category) {
      categorySet.add(category);
      categoryDistribution[category] = (categoryDistribution[category] ?? 0) + 1;
    }
  }

  return {
    totalTerms: terms.length,
    totalAliases: aliases.length,
    totalCategories: categorySet.size,
    categories: Array.from(categorySet).sort(),
    categoryDistribution,
  };
}

/**
 * Get the total number of canonical glossary terms.
 */
export function getTotalTerms(): number {
  return glossaryData.terms?.length ?? 0;
}

/**
 * Get the total number of aliases.
 */
export function getTotalAliases(): number {
  return aliasData.aliases?.length ?? 0;
}

/**
 * Get all unique categories.
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  for (const term of glossaryData.terms ?? []) {
    if (term.category) {
      categories.add(term.category);
    }
  }
  return Array.from(categories).sort();
}

/**
 * Get category distribution (count per category).
 */
export function getCategoryDistribution(): Record<string, number> {
  const distribution: Record<string, number> = {};
  for (const term of glossaryData.terms ?? []) {
    const category = term.category;
    if (category) {
      distribution[category] = (distribution[category] ?? 0) + 1;
    }
  }
  return distribution;
}

// Pre-computed stats for static imports
export const GLOSSARY_STATS = getGlossaryStats();

