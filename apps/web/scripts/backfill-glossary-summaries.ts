import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  needsSummary,
  synthesizeSummaryFromDefinition,
} from '../src/lib/glossary/summary';
import { getDefinitionForSlug } from './utils/glossary-definitions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../public/data/glossary.v2025.json');

interface GlossaryPayload {
  terms: Array<{
    slug: string;
    title: string;
    summary: string | null;
    status: 'canonical' | 'alias' | 'deprecated';
    targetSlug: string | null;
  }>;
}

async function main() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const payload = JSON.parse(raw) as GlossaryPayload;

  let updated = 0;

  for (const term of payload.terms) {
    if (term.status !== 'canonical') continue;
    if (!needsSummary(term.summary)) continue;

    const definition = getDefinitionForSlug(term.slug);
    const synthesized = synthesizeSummaryFromDefinition(definition);
    if (!synthesized) continue;

    term.summary = synthesized;
    updated += 1;
  }

  await fs.writeFile(DATA_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Updated ${updated} canonical summaries in glossary.v2025.json`);
}

main().catch((error) => {
  console.error('[backfill-glossary-summaries] failed:', error);
  process.exitCode = 1;
});

