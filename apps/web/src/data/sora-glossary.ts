import { taxonomy, type TaxonomyNode } from './taxonomy';

export type GlossaryCategory =
  | 'token'
  | 'technology'
  | 'governance'
  | 'defi'
  | 'network'
  | 'economics';

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: GlossaryCategory;
  relatedTerms: string[];
  aliases?: string[];
  examples?: string[];
  links?: {
    label: string;
    url: string;
  }[];
}

function isGlossaryNode(node: TaxonomyNode): node is TaxonomyNode & {
  definition: string;
  category: GlossaryCategory;
} {
  return Boolean(node.definition) && Boolean(node.category);
}

function toGlossaryTerm(node: TaxonomyNode & { definition: string; category: GlossaryCategory }): GlossaryTerm {
  return {
    term: node.title,
    definition: node.definition,
    category: node.category,
    relatedTerms: node.seeAlso ?? [],
    aliases: node.aliases?.length ? node.aliases : undefined,
    examples: node.examples?.length ? node.examples : undefined,
    links: node.links?.length ? node.links : undefined,
  };
}

const glossaryEntries = Object.values(taxonomy)
  .filter(isGlossaryNode)
  .map((node) => [node.title, toGlossaryTerm(node)] as const);

export const soraGlossary: Record<string, GlossaryTerm> = Object.fromEntries(glossaryEntries);

export function getGlossaryTerm(key: string): GlossaryTerm | undefined {
  return soraGlossary[key];
}

export function getAllGlossaryTerms(): GlossaryTerm[] {
  return Object.values(soraGlossary);
}

export function searchGlossaryTerms(query: string): GlossaryTerm[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(soraGlossary).filter((term) =>
    term.term.toLowerCase().includes(lowercaseQuery) ||
    term.definition.toLowerCase().includes(lowercaseQuery) ||
    term.relatedTerms.some((related) => related.toLowerCase().includes(lowercaseQuery)) ||
    term.aliases?.some((alias) => alias.toLowerCase().includes(lowercaseQuery)),
  );
}

export function getGlossaryTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return Object.values(soraGlossary).filter((term) => term.category === category);
}

