import type { AliasIndexEntry, TaxonomyNodeType } from '../taxonomy';

export interface GlossarySearchTermInput {
  term: string;
  slug: string;
  definition: string;
  category?: string;
  aliases: string[];
  tags: string[];
  relatedTerms: string[];
  priority: number;
  type: TaxonomyNodeType;
  entity?: string;
  versions?: string[];
  summary?: string;
  seeAlso?: string[];
  relatedTags?: string[];
}

export interface GlossarySearchIndexInput {
  terms: GlossarySearchTermInput[];
  aliasIndex: AliasIndexEntry[];
}

export interface GlossarySearchOptions {
  category?: string;
  types?: Set<TaxonomyNodeType>;
}

export interface GlossarySearchResult {
  term: GlossarySearchTermInput;
  score: number;
  matches: string[];
}

export interface FeaturedEntityResult {
  entity: GlossarySearchResult;
  children: GlossarySearchResult[];
}

export interface GlossarySearchResponse {
  results: GlossarySearchResult[];
  featured?: FeaturedEntityResult;
  didYouMean?: string;
}

interface SearchDocument {
  input: GlossarySearchTermInput;
  slug: string;
  normalizedTitle: string;
  titleTokens: string[];
  aliases: string[];
  aliasTokens: string[][];
  relatedTags: string[];
  definitionText: string;
  priority: number;
}

const WEIGHTS = {
  titleExact: 1000,
  aliasExact: 900,
  prefix: 700,
  titleToken: 600,
  aliasToken: 500,
  tag: 300,
  body: 200,
  fuzzy: 100,
  priority: 5,
};

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string): string[] => normalize(value).split(' ').filter(Boolean);

const levenshtein = (a: string, b: string): number => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) matrix[i][0] = i;
  for (let j = 0; j < cols; j++) matrix[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
};

export function createGlossarySearchEngine({ terms, aliasIndex }: GlossarySearchIndexInput) {
  const docs: SearchDocument[] = terms.map((term) => {
    const aliases = Array.from(new Set([term.term, ...(term.aliases ?? [])]));
    const relatedTags = new Set<string>();
    (term.tags ?? []).forEach((tag) => relatedTags.add(normalize(tag)));
    (term.relatedTags ?? []).forEach((tag) => relatedTags.add(normalize(tag)));

    return {
      input: term,
      slug: term.slug,
      normalizedTitle: normalize(term.term),
      titleTokens: tokenize(term.term),
      aliases,
      aliasTokens: aliases.map(tokenize),
      relatedTags: Array.from(relatedTags),
      definitionText: normalize(term.definition ?? ''),
      priority: term.priority ?? 0,
    } satisfies SearchDocument;
  });

  const aliasMap = buildAliasMap(aliasIndex);

  const search = (queryRaw: string, options: GlossarySearchOptions = {}): GlossarySearchResponse => {
    const queryNormalized = normalize(queryRaw);
    const queryTokens = tokenize(queryRaw);
    const results: GlossarySearchResult[] = [];

    let bestAliasSuggestion: string | undefined;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const doc of docs) {
      if (options.category && doc.input.category && doc.input.category !== options.category) continue;
      if (options.types && !options.types.has(doc.input.type)) continue;

      let score = 0;
      const matches: string[] = [];

      if (queryNormalized) {
        if (doc.normalizedTitle === queryNormalized) {
          score += WEIGHTS.titleExact;
          matches.push('titleExact');
        }

        for (const alias of doc.aliases) {
          const aliasNormalized = normalize(alias);

          if (aliasNormalized === queryNormalized) {
            score += WEIGHTS.aliasExact;
            matches.push(`alias:${alias}`);
          }

          if (aliasNormalized.startsWith(queryNormalized) || queryNormalized.startsWith(aliasNormalized)) {
            score += WEIGHTS.prefix;
            matches.push(`prefix:${alias}`);
          }

          const distance = levenshtein(queryNormalized, aliasNormalized);
          if (distance > 0 && distance <= 2) {
            score += WEIGHTS.fuzzy - distance * 10;
            matches.push(`fuzzy:${alias}`);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestAliasSuggestion = alias;
            }
          }
        }

        const importantTokens = queryTokens
          .map(normalize)
          .filter((token) => token.length >= 2);

        for (const token of importantTokens) {
          if (doc.titleTokens.includes(token)) {
            score += WEIGHTS.titleToken;
            matches.push(`titleToken:${token}`);
          }

          if (doc.aliasTokens.some((tokens) => tokens.includes(token))) {
            score += WEIGHTS.aliasToken;
            matches.push(`aliasToken:${token}`);
          }

          if (doc.relatedTags.includes(token)) {
            score += WEIGHTS.tag;
            matches.push(`tag:${token}`);
          }

          if (doc.definitionText.includes(token)) {
            score += WEIGHTS.body;
            matches.push(`body:${token}`);
          }
        }
      }

      score += doc.priority * WEIGHTS.priority;

      if (queryNormalized.length === 0 && score === 0) {
        score = doc.priority * WEIGHTS.priority;
        matches.push('default');
      }

      if (score > 0 || queryNormalized.length === 0) {
        results.push({ term: doc.input, score, matches });
      }
    }

    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.term.term.localeCompare(b.term.term);
    });

    let didYouMean: string | undefined;
    if (bestAliasSuggestion && bestDistance <= 2 && normalize(bestAliasSuggestion) !== queryNormalized) {
      didYouMean = bestAliasSuggestion;
    } else if (!results.length) {
      const aliasSuggestion = getAliasSuggestion(queryNormalized, aliasMap);
      if (aliasSuggestion) {
        didYouMean = aliasSuggestion;
      }
    }

    const featured = buildFeatured(results, queryNormalized);

    return {
      results,
      featured,
      didYouMean,
    };
  };

  const resolveAlias = (query: string) => {
    const key = normalize(query);
    const candidates = aliasMap.get(key);
    if (!candidates) return undefined;
    const [best] = candidates;
    const doc = docs.find((candidate) => candidate.slug === best.slug);
    if (!doc) return undefined;
    return {
      term: doc.input,
      matchedAlias: best.alias,
    };
  };

  return {
    search,
    resolveAlias,
  };
}

function buildAliasMap(aliasIndex: AliasIndexEntry[]): Map<string, AliasIndexEntry[]> {
  const map = new Map<string, AliasIndexEntry[]>();
  for (const alias of aliasIndex) {
    const key = normalize(alias.alias);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(alias);
  }

  for (const [, entries] of map) {
    entries.sort((a, b) => typePriority(b.type) - typePriority(a.type));
  }

  return map;
}

function typePriority(type: TaxonomyNodeType): number {
  switch (type) {
    case 'entity':
      return 3;
    case 'version':
      return 2;
    case 'term':
      return 1;
    case 'tag':
    default:
      return 0;
  }
}

function buildFeatured(results: GlossarySearchResult[], queryNormalized: string): FeaturedEntityResult | undefined {
  if (!results.length || !queryNormalized) return undefined;

  const entityResult = results.find((result) => result.term.type === 'entity');

  if (entityResult) {
    const children = collectTopVersions(entityResult.term.slug, results);
    if (!children.length) return undefined;
    return {
      entity: entityResult,
      children,
    };
  }

  const versionResult = results.find((result) => result.term.type === 'version' && result.term.entity);
  if (!versionResult?.term.entity) return undefined;

  const parent = results.find((result) => result.term.slug === versionResult.term.entity);
  if (parent) {
    const children = collectTopVersions(parent.term.slug, results);
    return { entity: parent, children };
  }

  return undefined;
}

function collectTopVersions(entitySlug: string, results: GlossarySearchResult[]): GlossarySearchResult[] {
  return results
    .filter((result) => result.term.type === 'version' && result.term.entity === entitySlug)
    .slice(0, 2);
}

function getAliasSuggestion(queryNormalized: string, aliasMap: Map<string, AliasIndexEntry[]>): string | undefined {
  if (!queryNormalized) return undefined;
  let suggestion: string | undefined;
  let distance = Number.POSITIVE_INFINITY;

  for (const [aliasKey, entries] of aliasMap.entries()) {
    const d = levenshtein(queryNormalized, aliasKey);
    if (d === 0 || d > 2) continue;
    if (d < distance) {
      distance = d;
      suggestion = entries[0]?.alias;
    }
  }

  return suggestion;
}

