import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../public/data/glossary.v2025.json');
const SITEMAP_DIR = path.join(__dirname, '../public/sitemaps');
const CANONICAL_SITEMAP = path.join(SITEMAP_DIR, 'sitemap-glossary-canonical.xml');
const ALIAS_SITEMAP = path.join(SITEMAP_DIR, 'sitemap-glossary-alias.xml');

const SITE_ORIGIN =
  (process.env.SITE_ORIGIN && process.env.SITE_ORIGIN.trim()) || 'https://soranauts.com';

interface GlossaryDataset {
  terms: Array<{
    slug: string;
    status: 'canonical' | 'alias' | 'deprecated';
  }>;
  canonicalCount: number;
  aliasCount: number;
}

const normalizeOrigin = (origin: string): string => origin.replace(/\/+$/, '');

const buildUrlset = (slugs: string[], origin: string): string => {
  const base = normalizeOrigin(origin);
  const locs = slugs
    .map((slug) => slug.trim().replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .map((slug) => `<url><loc>${`${base}/glossary/${slug}`}</loc></url>`)
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${locs}\n</urlset>\n`;
};

async function main() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const dataset = JSON.parse(raw) as GlossaryDataset;

  const canonicalTerms = dataset.terms.filter((term) => term.status === 'canonical');
  const aliasTerms = dataset.terms.filter((term) => term.status === 'alias');

  if (canonicalTerms.length !== dataset.canonicalCount) {
    throw new Error(
      `Canonical term count mismatch: expected ${dataset.canonicalCount}, found ${canonicalTerms.length}`,
    );
  }

  if (aliasTerms.length !== dataset.aliasCount) {
    throw new Error(
      `Alias term count mismatch: expected ${dataset.aliasCount}, found ${aliasTerms.length}`,
    );
  }

  await fs.mkdir(SITEMAP_DIR, { recursive: true });

  const canonicalXml = buildUrlset(
    canonicalTerms.map((term) => term.slug),
    SITE_ORIGIN,
  );
  const aliasXml = buildUrlset(
    aliasTerms.map((term) => term.slug),
    SITE_ORIGIN,
  );

  await Promise.all([
    fs.writeFile(CANONICAL_SITEMAP, canonicalXml, 'utf-8'),
    fs.writeFile(ALIAS_SITEMAP, aliasXml, 'utf-8'),
  ]);

  console.log(
    `Generated glossary sitemaps: canonical=${canonicalTerms.length}, alias=${aliasTerms.length}`,
  );
}

main().catch((error) => {
  console.error('[generate-glossary-sitemaps] failed:', error);
  process.exitCode = 1;
});

