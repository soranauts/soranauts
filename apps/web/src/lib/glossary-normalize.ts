export type Term = { slug: string; title?: string; [k: string]: any };
export type IndexEntry = { slug: string; title: string };

type LegacyFull = { terms: Term[] };
type LegacyIndex = { index: IndexEntry[] };

function isLegacyFull(value: unknown): value is LegacyFull {
  return Boolean(value && typeof value === 'object' && Array.isArray((value as LegacyFull).terms));
}

function isLegacyIndex(value: unknown): value is LegacyIndex {
  return Boolean(value && typeof value === 'object' && Array.isArray((value as LegacyIndex).index));
}

function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/** Accepts either old { terms: [...] } or new arrays; returns normalized arrays. */
export function normalizeGlossaryFull(input: LegacyFull | Term[]): Term[] {
  const terms = isLegacyFull(input) ? input.terms : isArray<Term>(input) ? input : undefined;
  if (terms) {
    return terms.map((term) => {
      const fallbackTitle = term.title ?? term.term ?? term.slug;
      const summary = term.summary ?? term.definition ?? null;
      return {
        ...term,
        title: fallbackTitle,
        term: term.term ?? fallbackTitle,
        definition: term.definition ?? summary ?? '',
        summary,
      };
    });
  }
  throw new Error('Unsupported glossary dataset shape');
}

/** Accepts either old { index: [...] } or new arrays. */
export function normalizeGlossaryIndex(
  input: LegacyIndex | IndexEntry[],
  fallbackFromFull?: Term[],
): IndexEntry[] {
  if (isLegacyIndex(input)) return input.index;
  if (isArray<IndexEntry>(input)) return input;
  if (fallbackFromFull) {
    return fallbackFromFull.map((term) => ({
      slug: term.slug,
      title: term.title ?? term.slug,
    }));
  }
  throw new Error('Unsupported glossary index shape');
}

