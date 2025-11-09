import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const glossaryData = JSON.parse(
  readFileSync(join(__dirname, '../public/glossary.json'), 'utf-8'),
);
import { createGlossarySearchEngine } from '../src/lib/glossary/search';

const engine = createGlossarySearchEngine({
  terms: glossaryData.terms,
  aliasIndex: glossaryData.aliasIndex,
});

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

