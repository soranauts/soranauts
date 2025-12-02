/**
 * Glossary Statistics Module
 * Dynamically computes glossary metrics from the canonical dataset.
 */

import glossaryData from '../../../public/data/glossary.v2025.json';
import aliasData from '../../../public/glossary.aliases.v2025.json';
import { NEXUS_SUBGROUPS } from '~/data/nexus-explorer.config';

export interface GlossaryStats {
  totalTerms: number;
  totalAliases: number;
  totalCategories: number;
  categories: string[];
  categoryDistribution: Record<string, number>;
  nexusTermCount: number;
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

  // Count Nexus Architecture terms from config
  const nexusTermCount = getNexusTermCount();

  return {
    totalTerms: terms.length,
    totalAliases: aliases.length,
    totalCategories: categorySet.size,
    categories: Array.from(categorySet).sort(),
    categoryDistribution,
    nexusTermCount,
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

/**
 * Get the count of Nexus Architecture terms.
 * Counts unique terms from the Nexus Explorer config subgroups.
 */
export function getNexusTermCount(): number {
  const terms = new Set<string>();
  for (const subgroup of NEXUS_SUBGROUPS) {
    for (const term of subgroup.terms) {
      terms.add(term);
    }
  }
  return terms.size;
}

// Pre-computed stats for static imports
export const GLOSSARY_STATS = getGlossaryStats();

