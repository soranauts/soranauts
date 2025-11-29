import type { Term } from './glossary-data';

const normalizeValue = (value: string): string => value?.trim().toLowerCase();

export function findBySlug(terms: Term[], slug: string): Term | undefined {
  const normalized = normalizeValue(slug);
  if (!normalized) return undefined;
  return terms.find((term) => normalizeValue(term.slug ?? '') === normalized);
}

export function findByAlias(terms: Term[], slug: string): Term | undefined {
  const normalized = normalizeValue(slug);
  if (!normalized) return undefined;
  return terms.find(
    (term) =>
      Array.isArray(term.aliases) &&
      term.aliases.some((alias: string) => normalizeValue(alias || '') === normalized),
  );
}

/** Resolve a user-facing slug to its canonical Term (by slug, then alias). */
export function resolveGlossaryEntry(terms: Term[], slug: string): Term | undefined {
  return findBySlug(terms, slug) ?? findByAlias(terms, slug);
}

