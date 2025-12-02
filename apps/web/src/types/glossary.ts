/**
 * Glossary Types
 * 
 * Unified type definitions for the glossary system.
 * These types match the output of build-nexus-glossary-json.ts
 */

// ─────────────────────────────────────────────────────────────────────────────
// Core Term Types
// ─────────────────────────────────────────────────────────────────────────────

export type GlossaryCategory =
  | 'token'
  | 'technology'
  | 'governance'
  | 'defi'
  | 'network'
  | 'economics'
  | 'execution'
  | 'consensus'
  | 'data availability'
  | 'networking'
  | 'accounts & identity'
  | 'cryptography'
  | 'storage'
  | 'general';

export interface GlossaryTerm {
  /** Unique identifier (lowercase alphanumeric) */
  slug: string;
  /** Display name (may include acronyms in parentheses) */
  term: string;
  /** Display title (Title Case) */
  title: string;
  /** Full definition text */
  definition: string;
  /** Short summary (1-2 sentences) */
  summary: string;
  /** Category classification */
  category: string;
  /** Related term slugs (canonical only) */
  relatedTerms: string[];
  /** Alternative names/abbreviations */
  aliases: string[];
  /** Topic tags for filtering */
  tags: string[];
  /** Optional examples */
  examples?: string[];
  /** Optional external links */
  links?: GlossaryLink[];
  /** Auto-linking priority (higher = more important) */
  priority: number;
  /** "Why it matters" - one sentence explaining real-world importance */
  tagline?: string;
  /** Status: canonical, alias, or deprecated */
  status?: 'canonical' | 'alias' | 'deprecated';
  /** Target slug if this is an alias */
  targetSlug?: string | null;
}

export interface GlossaryLink {
  label: string;
  url: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data File Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * glossary.v2025.json structure
 */
export interface GlossaryV2025Data {
  terms: GlossaryTerm[];
  canonicalCount: number;
  aliasCount: number;
  deprecatedCount: number;
  version: number;
  lastUpdated: string;
}

/**
 * glossary.index.json structure
 */
export interface GlossaryIndexData {
  index: GlossaryIndexEntry[];
  totalCount: number;
  lastUpdated: string;
}

export interface GlossaryIndexEntry {
  slug: string;
  title: string;
  type: 'term' | 'entity' | 'version';
  category: string | null;
  priority: number;
  aliases: string[];
  tags: string[];
  summary: string | null;
  definition: string;
  entity: string | null;
  versions: string[];
  relatedTerms: string[];
  glossaryRef: string;
  blob: string;
}

/**
 * glossary.aliases.v2025.json structure
 */
export interface GlossaryAliasData {
  aliases: GlossaryAlias[];
}

export interface GlossaryAlias {
  alias: string;
  target: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy Types (for backwards compatibility)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use GlossaryV2025Data instead
 */
export interface GlossaryData {
  terms: GlossaryTerm[];
  categories: {
    [key: string]: {
      name: string;
      count: number;
      description?: string;
    };
  };
  totalCount: number;
  lastUpdated: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GlossarySearchResult {
  term: GlossaryTerm;
  score: number;
  matchedFields: string[];
}

export interface GlossaryFilter {
  category?: string;
  tags?: string[];
  search?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Blog Integration Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GlossaryAutoLink {
  term: string;
  slug: string;
  position: number;
  priority: number;
}

export interface ProcessedContent {
  content: string;
  links: GlossaryAutoLink[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Generator Stats
// ─────────────────────────────────────────────────────────────────────────────

export interface GeneratorStats {
  canonical: number;
  aliases: number;
  deprecated: number;
  warnings: number;
}
