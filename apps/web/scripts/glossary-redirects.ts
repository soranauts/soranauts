import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { taxonomy } from '../src/data/taxonomy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../src/data/redirects.glossary.json');

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

interface RedirectEntry {
  from: string;
  to: string;
}

const redirects: RedirectEntry[] = [];
const seen = new Set<string>();

for (const node of Object.values(taxonomy)) {
  if (node.type === 'tag') continue;
  const aliases = node.aliases ?? [];
  for (const alias of aliases) {
    const aliasSlug = normalize(alias);
    if (!aliasSlug || aliasSlug === node.slug) continue;

    const from = `/glossary/${aliasSlug}`;
    const to = node.glossaryRef ?? `/glossary/${node.slug}`;

    if (seen.has(from)) continue;
    seen.add(from);
    redirects.push({ from, to });
  }
}

redirects.sort((a, b) => a.from.localeCompare(b.from));

fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ redirects }, null, 2));

console.log(`✅ Generated ${redirects.length} glossary redirects at ${OUTPUT_PATH}`);

