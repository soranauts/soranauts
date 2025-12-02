import { soraGlossary } from '../data/sora-glossary';
import type { GlossaryTerm, GlossaryData } from '../types/glossary';

// Priority mapping for auto-linking (higher = more important)
const TERM_PRIORITIES: Record<string, number> = {
  'XOR': 100,
  'VAL': 95,
  'PSWAP': 90,
  'SORA': 85,
  'Polkaswap': 80,
  'SORA Parliament': 75,
  'Hyperledger Iroha': 70,
  'Hyperledger Iroha 2': 68,
  'Hyperledger Iroha 3': 69,
  'Substrate': 65,
  'Parachain': 60,
  'DeFi': 55,
  'DEX': 50,
  'Liquidity Pool': 45,
  'Staking': 40,
  'Validator': 35,
  'Cross-chain': 30,
  'CBDC': 25,
  'Bakong': 20,
  'SORAMITSU': 15,
  'Polkadot': 10,
  'Blockchain': 5,
};

// Category descriptions
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  token: 'SORA ecosystem tokens and digital assets',
  technology: 'Blockchain technology, protocols, and technical concepts',
  governance: 'Decision-making systems and governance mechanisms',
  defi: 'Decentralized finance protocols and DeFi concepts',
  network: 'Network infrastructure, consensus, and security',
  economics: 'Economic models, monetary policy, and financial concepts',
};

// Generate slug from term
function generateSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Generate aliases from term and related terms
function generateAliases(term: string, relatedTerms: string[]): string[] {
  const aliases = new Set<string>();
  
  // Add the term itself
  aliases.add(term);
  
  // Add related terms that might be used as aliases
  relatedTerms.forEach(related => {
    if (related.length <= 20 && !related.includes(' ')) {
      aliases.add(related);
    }
  });
  
  // Add common variations
  if (term.includes(' ')) {
    aliases.add(term.replace(/\s+/g, ''));
  }
  
  return Array.from(aliases);
}

// Generate tags from category and related terms
function generateTags(term: string, category: string, relatedTerms: string[]): string[] {
  const tags = new Set<string>();
  
  // Add category as tag
  tags.add(category);
  
  // Add related terms as tags (filtered)
  relatedTerms.forEach(related => {
    if (related.length <= 15 && !related.includes(' ')) {
      tags.add(related.toLowerCase());
    }
  });
  
  // Add term variations
  if (term.includes(' ')) {
    const words = term.split(' ');
    words.forEach(word => {
      if (word.length > 2) {
        tags.add(word.toLowerCase());
      }
    });
  }
  
  return Array.from(tags);
}

// Process a single glossary term
function processGlossaryTerm(term: string, data: any): GlossaryTerm {
  const slug = generateSlug(term);
  // Use manual aliases if provided, otherwise generate them
  const manualAliases = data.aliases || [];
  const generatedAliases = generateAliases(term, data.relatedTerms || []);
  // Merge manual aliases with generated ones, removing duplicates
  const aliases = Array.from(new Set([...manualAliases, ...generatedAliases]));
  const tags = generateTags(term, data.category, data.relatedTerms || []);
  const priority = TERM_PRIORITIES[term] || 1;
  
  return {
    term,
    slug,
    title: data.title || term,
    summary: data.summary || data.definition || '',
    definition: data.definition,
    category: data.category,
    relatedTerms: data.relatedTerms || [],
    aliases,
    tags,
    examples: data.examples,
    links: data.links,
    priority,
  };
}

// Process all glossary terms
export function processGlossaryData(): GlossaryData {
  const processedTerms: GlossaryTerm[] = [];
  const categories: Record<string, { name: string; count: number; description?: string }> = {};
  
  // Process each term
  Object.entries(soraGlossary).forEach(([term, data]) => {
    const processedTerm = processGlossaryTerm(term, data);
    processedTerms.push(processedTerm);
    
    // Count categories
    const category = processedTerm.category;
    if (!categories[category]) {
      categories[category] = {
        name: category,
        count: 0,
        description: CATEGORY_DESCRIPTIONS[category],
      };
    }
    categories[category].count++;
  });
  
  // Sort terms by priority (highest first)
  processedTerms.sort((a, b) => b.priority - a.priority);
  
  return {
    terms: processedTerms,
    categories,
    totalCount: processedTerms.length,
    lastUpdated: new Date().toISOString(),
  };
}

// Export function for build-time JSON generation
export function exportGlossaryJSON(): string {
  const data = processGlossaryData();
  return JSON.stringify(data, null, 2);
}

// Helper function to get term by slug
export function getTermBySlug(slug: string, data: GlossaryData): GlossaryTerm | undefined {
  return data.terms.find(term => term.slug === slug);
}

// Helper function to search terms
export function searchTerms(query: string, data: GlossaryData): GlossaryTerm[] {
  const lowercaseQuery = query.toLowerCase();
  
  return data.terms.filter(term => 
    term.term.toLowerCase().includes(lowercaseQuery) ||
    term.definition.toLowerCase().includes(lowercaseQuery) ||
    term.aliases.some(alias => alias.toLowerCase().includes(lowercaseQuery)) ||
    term.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    term.relatedTerms.some(related => related.toLowerCase().includes(lowercaseQuery))
  );
}

// Helper function to get terms by category
export function getTermsByCategory(category: string, data: GlossaryData): GlossaryTerm[] {
  return data.terms.filter(term => term.category === category);
}

// Helper function to get related terms
export function getRelatedTerms(termSlug: string, data: GlossaryData, limit = 5): GlossaryTerm[] {
  const term = getTermBySlug(termSlug, data);
  if (!term) return [];
  
  const related = term.relatedTerms
    .map(relatedTerm => data.terms.find(t => t.term === relatedTerm))
    .filter(Boolean) as GlossaryTerm[];
  
  return related.slice(0, limit);
}
