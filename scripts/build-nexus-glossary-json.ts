/**
 * Build Nexus glossary JSON from MDX content files.
 * Outputs:
 *   - apps/web/public/data/glossary.v2025.json
 *   - apps/web/public/glossary.index.json
 *   - apps/web/public/glossary.aliases.v2025.json (merged with Nexus aliases)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'apps/web/src/content/glossary');
const OUT_DATA = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
const OUT_INDEX = path.join(ROOT, 'apps/web/public/glossary.index.json');
const OUT_ALIASES = path.join(ROOT, 'apps/web/public/glossary.aliases.v2025.json');

// Nexus alias mappings to merge
const NEXUS_ALIASES: Array<{ alias: string; target: string }> = [
  { alias: 'ivm', target: 'irohavirtualmachineivm' },
  { alias: 'iroha-virtual-machine', target: 'irohavirtualmachineivm' },
  { alias: 'wsv', target: 'worldstateviewwsv' },
  { alias: 'world-state-view', target: 'worldstateviewwsv' },
  { alias: 'space-directory', target: 'dataspacedirectory' },
  { alias: 'teu', target: 'transactionexecutionunitsteu' },
  { alias: 'transaction-execution-units', target: 'transactionexecutionunitsteu' },
  { alias: 'sfq', target: 'starttimefairqueuingsfq' },
  { alias: 'start-time-fair-queuing', target: 'starttimefairqueuingsfq' },
];

interface FrontMatter {
  title: string;
  slug: string;
  category: string;
  tags?: string[];
  summary: string;
  related?: string[];
}

function parseFrontMatter(content: string): FrontMatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const fm: Partial<FrontMatter> = {};

  // Parse title
  const titleMatch = yaml.match(/^title:\s*"?([^"\n]+)"?/m);
  if (titleMatch) fm.title = titleMatch[1].trim();

  // Parse slug
  const slugMatch = yaml.match(/^slug:\s*(\S+)/m);
  if (slugMatch) fm.slug = slugMatch[1].trim();

  // Parse category
  const categoryMatch = yaml.match(/^category:\s*"?([^"\n]+)"?/m);
  if (categoryMatch) fm.category = categoryMatch[1].trim();

  // Parse summary
  const summaryMatch = yaml.match(/^summary:\s*"([^"]+)"/m);
  if (summaryMatch) fm.summary = summaryMatch[1].trim();

  // Parse tags (array)
  const tagsSection = yaml.match(/^tags:\s*\n((?:\s+-\s*"[^"]+"\n?)+)/m);
  if (tagsSection) {
    fm.tags = [...tagsSection[1].matchAll(/- "([^"]+)"/g)].map((m) => m[1]);
  }

  // Parse related (array)
  const relatedSection = yaml.match(/^related:\s*\n((?:\s+-\s*"[^"]+"\n?)+)/m);
  if (relatedSection) {
    fm.related = [...relatedSection[1].matchAll(/- "([^"]+)"/g)].map((m) => m[1]);
  }

  if (!fm.title || !fm.slug || !fm.category || !fm.summary) {
    return null;
  }

  return fm as FrontMatter;
}

async function main() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  console.log(`Found ${files.length} MDX files in ${CONTENT_DIR}`);

  const terms: Array<{
    slug: string;
    title: string;
    summary: string;
    status: string;
    targetSlug: string | null;
    definition: string;
    category: string;
    aliases: string[];
    tags: string[];
    relatedTerms: string[];
    examples: string[];
    links: Array<{ label: string; url: string }>;
  }> = [];

  const indexEntries: Array<{
    slug: string;
    title: string;
    type: string;
    category: string | null;
    priority: number;
    aliases: string[];
    tags: string[];
    summary: string | null;
    definition: string;
    entity: string | null;
    versions: string[];
    relatedTerms: string[];
    glossaryRef: string;
    blob: string;
  }> = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const fm = parseFrontMatter(content);
    if (!fm) {
      console.warn(`⚠️ Skipping ${file}: could not parse front matter`);
      continue;
    }

    terms.push({
      slug: fm.slug,
      title: fm.title,
      summary: fm.summary,
      status: 'canonical',
      targetSlug: null,
      definition: fm.summary,
      category: fm.category,
      aliases: [],
      tags: fm.tags ?? [],
      relatedTerms: fm.related ?? [],
      examples: [],
      links: [],
    });

    const blobParts = [fm.title, fm.summary, ...(fm.tags ?? []), ...(fm.related ?? [])];
    indexEntries.push({
      slug: fm.slug,
      title: fm.title,
      type: 'term',
      category: fm.category,
      priority: 0,
      aliases: [],
      tags: fm.tags ?? [],
      summary: fm.summary,
      definition: fm.summary,
      entity: null,
      versions: [],
      relatedTerms: fm.related ?? [],
      glossaryRef: `/glossary/${fm.slug}`,
      blob: blobParts.join(' ').toLowerCase(),
    });
  }

  // Sort alphabetically by title
  terms.sort((a, b) => a.title.localeCompare(b.title));
  indexEntries.sort((a, b) => a.title.localeCompare(b.title));

  // Load existing aliases and merge Nexus aliases
  const existingAliases: { aliases: Array<{ alias: string; target: string }> } = fs.existsSync(OUT_ALIASES)
    ? JSON.parse(fs.readFileSync(OUT_ALIASES, 'utf-8'))
    : { aliases: [] };

  const aliasSet = new Set(existingAliases.aliases.map((a) => a.alias));
  for (const nexusAlias of NEXUS_ALIASES) {
    if (!aliasSet.has(nexusAlias.alias)) {
      existingAliases.aliases.push(nexusAlias);
      aliasSet.add(nexusAlias.alias);
    }
  }
  existingAliases.aliases.sort((a, b) => a.alias.localeCompare(b.alias));

  const aliasCount = existingAliases.aliases.length;

  // Write glossary.v2025.json
  const glossaryData = {
    terms,
    canonicalCount: terms.length,
    aliasCount,
    deprecatedCount: 0,
    version: 2025,
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(OUT_DATA, JSON.stringify(glossaryData, null, 2));
  console.log(`✅ Wrote ${OUT_DATA} (${terms.length} canonical, ${aliasCount} aliases)`);

  // Write glossary.index.json
  const indexData = {
    index: indexEntries,
    totalCount: indexEntries.length,
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(OUT_INDEX, JSON.stringify(indexData, null, 2));
  console.log(`✅ Wrote ${OUT_INDEX} (${indexEntries.length} entries)`);

  // Write glossary.aliases.v2025.json
  fs.writeFileSync(OUT_ALIASES, JSON.stringify(existingAliases, null, 2));
  console.log(`✅ Wrote ${OUT_ALIASES} (${aliasCount} aliases)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

