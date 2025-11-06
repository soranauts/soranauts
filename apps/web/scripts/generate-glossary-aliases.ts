import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

import { taxonomy } from '../src/data/taxonomy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GLOSSARY_DIR = path.join(__dirname, '../src/content/glossary');

function updateFrontMatter(filePath: string, aliases: string[]) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const existingAliases: string[] = Array.isArray(parsed.data?.aliases) ? parsed.data.aliases : [];
  const merged = Array.from(new Set([...existingAliases, ...aliases])).filter(Boolean);

  if (merged.length === existingAliases.length && merged.every((alias, index) => alias === existingAliases[index])) {
    return false;
  }

  parsed.data.aliases = merged;
  const output = matter.stringify(parsed.content, parsed.data);
  fs.writeFileSync(filePath, output, 'utf8');
  return true;
}

function main() {
  if (!fs.existsSync(GLOSSARY_DIR)) {
    console.log('ℹ️  No glossary content directory found; skipping alias backfill.');
    return;
  }

  let updated = 0;

  for (const node of Object.values(taxonomy)) {
    if (node.type === 'tag') continue;
    const aliases = Array.from(new Set([node.title, ...(node.aliases ?? [])])).filter(Boolean);
    if (!aliases.length) continue;

    const slugPath = path.join(GLOSSARY_DIR, `${node.slug}.mdx`);
    const altPath = path.join(GLOSSARY_DIR, `${node.slug}.md`);
    const filePath = fs.existsSync(slugPath) ? slugPath : fs.existsSync(altPath) ? altPath : null;
    if (!filePath) continue;

    if (updateFrontMatter(filePath, aliases)) {
      updated += 1;
      console.log(`✅ Updated aliases for ${node.slug}`);
    }
  }

  if (updated === 0) {
    console.log('ℹ️  No glossary files required alias updates.');
  } else {
    console.log(`✅ Alias backfill complete for ${updated} glossary entries.`);
  }
}

main();

