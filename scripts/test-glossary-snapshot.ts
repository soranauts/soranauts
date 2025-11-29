import path from 'node:path';

import { readJSON, repoRoot } from './glossary-utils';

interface RedirectRule {
  source?: string;
  destination?: string;
  permanent?: boolean;
}

interface VercelConfig {
  redirects?: RedirectRule[];
}

const VERCEL_PATH = path.resolve(repoRoot, 'apps/web/vercel.json');
const collator = new Intl.Collator('en', { sensitivity: 'case', numeric: true });

function compareRules(a: RedirectRule, b: RedirectRule): number {
  if (!a.source || !b.source) return 0;
  const sourceCompare = collator.compare(a.source, b.source);
  if (sourceCompare !== 0) return sourceCompare;
  if (!a.destination || !b.destination) return 0;
  return collator.compare(a.destination, b.destination);
}

function assertContiguous(indexes: number[]): void {
  if (indexes.length <= 1) return;
  const expectedSpan = indexes[indexes.length - 1] - indexes[0] + 1;
  if (expectedSpan !== indexes.length) {
    const first = indexes[0];
    const last = indexes[indexes.length - 1];
    console.error(
      `Glossary redirects must form a contiguous block (found gap between indexes ${first} and ${last}).`,
    );
    process.exit(1);
  }
}

async function main() {
  const vercel = await readJSON<VercelConfig>(VERCEL_PATH);
  const redirects = Array.isArray(vercel.redirects) ? vercel.redirects : [];

  const glossaryEntries = redirects
    .map((rule, index) => ({ rule, index }))
    .filter(({ rule }) => typeof rule.source === 'string' && rule.source.startsWith('/glossary/'));

  if (!glossaryEntries.length) {
    console.log('No glossary redirects present; snapshot skipped.');
    return;
  }

  const indexes = glossaryEntries.map((entry) => entry.index).sort((a, b) => a - b);
  assertContiguous(indexes);

  const glossaryRules = glossaryEntries.map((entry) => entry.rule);
  const seenSources = new Set<string>();

  for (let i = 0; i < glossaryRules.length; i += 1) {
    const rule = glossaryRules[i];
    if (!rule.source || !rule.destination) {
      console.error(`Glossary redirect at position ${i} is missing required fields.`);
      process.exit(1);
    }

    if (seenSources.has(rule.source)) {
      console.error(`Duplicate glossary redirect source detected: ${rule.source}`);
      process.exit(1);
    }
    seenSources.add(rule.source);

    if (i === 0) continue;
    const previous = glossaryRules[i - 1];
    if (compareRules(previous, rule) > 0) {
      console.error(
        `Glossary redirects must remain sorted: "${previous.source}" should not precede "${rule.source}".`,
      );
      process.exit(1);
    }
  }

  console.log(`Glossary redirect snapshot OK (${glossaryRules.length} entries).`);
}

main().catch((error) => {
  console.error('Glossary snapshot failed:', error);
  process.exit(1);
});

