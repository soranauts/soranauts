import { getAllTerms, getAliasEntries } from './glossary-loader';

type GlossaryTerms = ReturnType<typeof getAllTerms>;
type GlossaryAliasEntries = ReturnType<typeof getAliasEntries>;

let glossaryTermsCache: GlossaryTerms | null = null;
let aliasEntriesCache: GlossaryAliasEntries | null = null;

export const getCachedGlossaryTerms = (): GlossaryTerms => {
  if (!glossaryTermsCache) {
    glossaryTermsCache = getAllTerms();
  }
  return glossaryTermsCache;
};

export const getCachedAliasEntries = (): GlossaryAliasEntries => {
  if (!aliasEntriesCache) {
    aliasEntriesCache = getAliasEntries();
  }
  return aliasEntriesCache;
};

export const resetGlossaryCache = () => {
  glossaryTermsCache = null;
  aliasEntriesCache = null;
};

