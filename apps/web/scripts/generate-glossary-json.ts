import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

import { taxonomy } from '../src/data/taxonomy';
import {
  clientAliasIndex,
  taxonomyNodes,
  normalizeTaxonomyValue,
} from '../src/lib/taxonomy';
import {
  GLOSSARY_TERMS,
  type GlossaryStatus,
  type GlossaryTerm as ConfigGlossaryTerm,
} from '../src/data/glossary.config';

interface LegacyGlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category?: string;
  aliases: string[];
  tags: string[];
  relatedTerms: string[];
  priority: number;
  type: string;
  entity?: string;
  versions?: string[];
  summary?: string;
  seeAlso?: string[];
  relatedTags?: string[];
  examples?: string[];
  links?: { label: string; url: string }[];
}

interface GlossaryJson {
  terms: LegacyGlossaryTerm[];
  categories: Record<string, { name: string; count: number }>;
  totalCount: number;
  lastUpdated: string;
  aliasIndex: typeof clientAliasIndex;
}

interface Glossary2025Term {
  slug: string;
  title: string;
  summary: string | null;
  status: GlossaryStatus;
  targetSlug: string | null;
}

interface Glossary2025Payload {
  terms: Glossary2025Term[];
  canonicalCount: number;
  aliasCount: number;
  deprecatedCount: number;
  version: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '../public/glossary.json');
const OUTPUT_PATH_V2025 = path.join(__dirname, '../public/glossary.v2025.json');
const ALIAS_OUTPUT_PATH_V2025 = path.join(__dirname, '../public/glossary.aliases.v2025.json');
const TAXONOMY_TAGS_PATH = path.join(__dirname, '../src/data/taxonomy-tags.json');
const POSTS_DIR = path.join(__dirname, '../src/content/post');

const terms: LegacyGlossaryTerm[] = taxonomyNodes
  .filter((node) => Boolean(node.definition))
  .map((node) => {
    const tags = new Set<string>();
    if (node.category) tags.add(node.category);
    (node.relatedTags ?? []).forEach((tag) => tags.add(tag));

    return {
      term: node.title,
      slug: node.slug,
      definition: node.definition ?? '',
      category: node.category,
      aliases: node.aliases ?? [],
      tags: Array.from(tags),
      relatedTerms: node.seeAlso ?? [],
      priority: node.priority ?? 0,
      type: node.type,
      entity: node.entity,
      versions: node.versions,
      summary: node.summary,
      seeAlso: node.seeAlso,
      relatedTags: node.relatedTags,
      examples: node.examples,
      links: node.links,
    } satisfies LegacyGlossaryTerm;
  });

const categories = terms.reduce<Record<string, { name: string; count: number }>>((acc, term) => {
  const key = term.category ?? 'uncategorized';
  if (!acc[key]) {
    acc[key] = { name: key, count: 0 };
  }
  acc[key].count += 1;
  return acc;
}, {});

const glossaryJson: GlossaryJson = {
  terms,
  categories,
  totalCount: terms.length,
  lastUpdated: new Date().toISOString(),
  aliasIndex: clientAliasIndex,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(glossaryJson, null, 2));

// Generate lightweight alias index for client consumption (<30KB target)
const aliasPayload = clientAliasIndex.map((entry) => ({
  alias: normalizeTaxonomyValue(entry.alias),
  slug: entry.slug,
  type: entry.type,
}));

fs.writeFileSync(
  path.join(__dirname, '../public/glossary.aliases.json'),
  JSON.stringify({ aliases: aliasPayload }, null, 2),
);

const to2025Term = (term: ConfigGlossaryTerm): Glossary2025Term => ({
  slug: term.slug,
  title: term.title,
  summary: term.summary ?? null,
  status: term.status,
  targetSlug: term.status === 'canonical' ? null : term.targetSlug ?? null,
});

const sortBySlug = (a: Glossary2025Term, b: Glossary2025Term): number =>
  a.slug.localeCompare(b.slug);

const glossary2025Terms = GLOSSARY_TERMS.map(to2025Term).sort(sortBySlug);

const canonicalCount2025 = glossary2025Terms.filter((term) => term.status === 'canonical').length;
const aliasTerms2025 = glossary2025Terms.filter((term) => term.status === 'alias');
const aliasCount2025 = aliasTerms2025.length;
const deprecatedCount2025 = glossary2025Terms.filter((term) => term.status === 'deprecated').length;

const glossary2025Payload: Glossary2025Payload = {
  terms: glossary2025Terms,
  canonicalCount: canonicalCount2025,
  aliasCount: aliasCount2025,
  deprecatedCount: deprecatedCount2025,
  version: 2025,
};

fs.writeFileSync(OUTPUT_PATH_V2025, JSON.stringify(glossary2025Payload, null, 2));

const aliasPayload2025 = aliasTerms2025
  .map((term) => ({
    alias: term.slug,
    target: term.targetSlug ?? null,
  }))
  .sort((a, b) => a.alias.localeCompare(b.alias));

fs.writeFileSync(ALIAS_OUTPUT_PATH_V2025, JSON.stringify({ aliases: aliasPayload2025 }, null, 2));

const collectPostTags = (): string[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const tagSet = new Set<string>();

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const filePath = path.join(dir, entry);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
        continue;
      }
      if (!entry.endsWith('.mdx') && !entry.endsWith('.md')) continue;

      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(raw);
      const tags: unknown = parsed.data?.tags;
      if (Array.isArray(tags)) {
        tags.forEach((tag) => {
          if (typeof tag === 'string' && tag.trim().length > 0) {
            tagSet.add(tag.trim());
          }
        });
      }
    }
  };

  walk(POSTS_DIR);
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
};

const postTags = collectPostTags();
fs.writeFileSync(TAXONOMY_TAGS_PATH, JSON.stringify({ tags: postTags }, null, 2));

console.log(
  '✅ Generated glossary.json (+v2025), glossary.aliases.json (+v2025), and taxonomy-tags.json',
);

