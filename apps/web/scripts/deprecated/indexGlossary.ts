import fs from 'fs';

type Term = {
  term: string; slug: string; definition: string; category: string;
  aliases?: string[]; tags?: string[]; relatedTerms?: string[]; priority?: number;
};

const raw = JSON.parse(fs.readFileSync("public/glossary.json","utf8"));
const terms: Term[] = raw.terms;

const index = terms.map(t => ({
  slug: t.slug,
  priority: t.priority ?? 0,
  // minimal blob to keep client payload small
  blob: [
    t.term, t.slug, t.category, t.definition,
    ...(t.aliases ?? []), ...(t.tags ?? []), ...(t.relatedTerms ?? [])
  ].join(" ").toLowerCase()
}));

fs.writeFileSync(
  "public/glossary.index.json",
  JSON.stringify({ index, count: index.length, lastUpdated: raw.lastUpdated }, null, 2)
);
console.log(`✅ glossary.index.json (${index.length} terms)`);