import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { taxonomy } from '../src/data/taxonomy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../public/glossary.index.json');

const entries = Object.values(taxonomy)
  .filter((node) => node.type !== 'tag' && Boolean(node.definition))
  .map((node) => {
    const tags = new Set<string>();
    if (node.category) tags.add(node.category);
    (node.relatedTags ?? []).forEach((tag) => tags.add(tag));

    const blobParts = [
      node.title,
      ...(node.aliases ?? []),
      ...(node.seeAlso ?? []),
      ...(node.relatedTags ?? []),
      node.definition ?? '',
    ];

    return {
      slug: node.slug,
      title: node.title,
      type: node.type,
      category: node.category ?? null,
      priority: node.priority ?? 0,
      aliases: node.aliases ?? [],
      tags: Array.from(tags).filter(Boolean),
      summary: node.summary ?? null,
      definition: node.definition ?? '',
      entity: node.entity ?? null,
      versions: node.versions ?? [],
      relatedTerms: node.seeAlso ?? [],
      glossaryRef: node.glossaryRef ?? `/glossary/${node.slug}`,
      blob: blobParts.join(' ').toLowerCase(),
    };
  });

const payload = {
  index: entries,
  totalCount: entries.length,
  lastUpdated: new Date().toISOString(),
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));

console.log(`✅ glossary.index.json updated (${entries.length} entries)`);

