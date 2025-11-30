import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { normalizeGlossaryFull } from '../src/lib/glossary-normalize';
import { clientAliasIndex } from '../src/lib/taxonomy';
import { getCanonicalSlug } from '../src/lib/glossary/glossary-loader';
import { createGlossarySearchEngine, type GlossarySearchTermInput } from '../src/lib/glossary/search';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const glossaryRaw = JSON.parse(readFileSync(join(__dirname, '../public/glossary.json'), 'utf-8'));
const glossaryTerms = normalizeGlossaryFull(glossaryRaw) as GlossarySearchTermInput[];

const engine = createGlossarySearchEngine(
  {
    terms: glossaryTerms,
    aliasIndex: clientAliasIndex,
  },
  { resolveCanonicalSlug: getCanonicalSlug },
);

const QUERIES = ['hyperled', 'iroha v3', 'pswap', 'sora dex'];

let hasError = false;

for (const query of QUERIES) {
  const baseline = engine.search(query).results.map((result) => result.term.slug);
  for (let attempt = 0; attempt < 3; attempt++) {
    const compared = engine.search(query).results.map((result) => result.term.slug);
    const mismatch = baseline.some((slug, index) => slug !== compared[index]);
    if (mismatch) {
      console.error(`❌ Non-deterministic ordering detected for query "${query}"`);
      console.error('Baseline:', baseline.join(', '));
      console.error('Variation:', compared.join(', '));
      hasError = true;
      break;
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log('✅ Glossary search ordering is deterministic for sampled queries.');

