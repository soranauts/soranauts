// Enhanced Glossary Types for React App and Blog Integration
export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: 'token' | 'technology' | 'governance' | 'defi' | 'network' | 'economics';
  relatedTerms: string[];
  aliases: string[];
  tags: string[];
  examples?: string[];
  links?: {
    label: string;
    url: string;
  }[];
  priority: number; // For auto-linking priority (higher = more important)
}

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

// For blog integration
export interface GlossaryLink {
  term: string;
  slug: string;
  position: number;
  priority: number;
}

export interface ProcessedContent {
  content: string;
  links: GlossaryLink[];
}


