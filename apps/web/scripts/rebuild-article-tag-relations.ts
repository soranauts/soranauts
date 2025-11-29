import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { VFile } from 'vfile';

import { createGlossaryAutoLinkPlugin } from '../src/utils/glossary-auto-link.mjs';
import { getAllTerms } from '../src/lib/glossary/glossary-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'post');
const OUTPUT_PATH = path.join(ROOT, 'public', 'data', 'article-glossary-map.json');

interface GlossaryAutoLinkReport {
  filePath: string;
  linkedSlugs?: string[];
}

const collectPostFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectPostFiles(entryPath)));
      continue;
    }
    if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(entryPath);
    }
  }

  return files;
};

const main = async () => {
  const glossaryTerms = getAllTerms();
  const reports = new Map<string, GlossaryAutoLinkReport>();

  const pluginFactory = createGlossaryAutoLinkPlugin(glossaryTerms, {
    mode: 'analyze',
    reporter: (report) => reports.set(report.filePath, report),
  });

  const processor = unified().use(remarkParse).use(remarkMdx).use(pluginFactory);
  const files = await collectPostFiles(POSTS_DIR);

  const postsMap: Record<string, string[]> = {};
  const termsMap: Record<string, string[]> = {};

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);
    const slug =
      typeof parsed.data.slug === 'string' && parsed.data.slug.length
        ? parsed.data.slug
        : path.basename(filePath, path.extname(filePath));

    const vfile = new VFile({ value: parsed.content, path: filePath });
    vfile.data.frontmatter = parsed.data;
    vfile.data.astro = { frontmatter: parsed.data };

    const tree = processor.parse(vfile);
    await processor.run(tree, vfile);

    const report = reports.get(filePath) ?? { filePath, linkedSlugs: [] };
    const uniqueSlugs = Array.from(new Set(report.linkedSlugs ?? [])).sort();
    if (!uniqueSlugs.length) continue;

    postsMap[slug] = uniqueSlugs;
    uniqueSlugs.forEach((termSlug) => {
      if (!termsMap[termSlug]) {
        termsMap[termSlug] = [];
      }
      termsMap[termSlug].push(slug);
    });
  }

  for (const slug of Object.keys(termsMap)) {
    termsMap[slug] = Array.from(new Set(termsMap[slug])).sort();
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    posts: postsMap,
    terms: termsMap,
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(
    `Article glossary map saved to ${OUTPUT_PATH} (terms: ${Object.keys(termsMap).length}, posts: ${Object.keys(postsMap).length})`,
  );
};

main().catch((error) => {
  console.error('[glossary:relations:build] failed', error);
  process.exit(1);
});

