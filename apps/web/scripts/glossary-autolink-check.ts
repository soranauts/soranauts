import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import Table from 'cli-table3';
import { VFile } from 'vfile';

import { createGlossaryAutoLinkPlugin } from '../src/utils/glossary-auto-link.mjs';
import { getAllTerms } from '../src/lib/glossary/glossary-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'post');
const REPORT_PATH = '/tmp/phase11-autolink-report.txt';

const collectPostFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

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
  const reports = [];

  const pluginFactory = createGlossaryAutoLinkPlugin(glossaryTerms, {
    mode: 'analyze',
    reporter: (report) => reports.push(report),
  });

  const processor = unified().use(remarkParse).use(remarkMdx).use(pluginFactory);
  const files = await collectPostFiles(POSTS_DIR);

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);
    const vfile = new VFile({ value: parsed.content, path: filePath });
    vfile.data.frontmatter = parsed.data;
    vfile.data.astro = { frontmatter: parsed.data };

    const tree = processor.parse(vfile);
    await processor.run(tree, vfile);
  }

  const total = reports.length;
  const changed = reports.filter((report) => report.added > 0).length;
  const skipped = total - changed;
  const conflicts = reports.filter(
    (report) =>
      report.skipped.perTermLimit > 0 ||
      report.skipped.perParagraphLimit > 0 ||
      report.skipped.perPostLimit > 0,
  ).length;

  const table = new Table({
    head: ['Metric', 'Value'],
  });

  table.push(
    ['Posts scanned', total],
    ['Posts with links', changed],
    ['Posts unchanged', skipped],
    ['Posts hitting limits', conflicts],
  );

  console.log(table.toString());

  const topChanged = reports
    .filter((report) => report.added > 0)
    .sort((a, b) => b.added - a.added)
    .slice(0, 10);

  const lines = [
    '# Phase 11 — Glossary Auto-link Dry-Run',
    '',
    `Total posts scanned: ${total}`,
    `Posts with proposed links: ${changed}`,
    `Posts unchanged: ${skipped}`,
    `Posts hitting limits: ${conflicts}`,
    '',
    '## Top files by proposed link count',
    ...topChanged.map(
      (report) => `- ${report.filePath.replace(`${ROOT}/`, '')}: ${report.added} links`,
    ),
  ];

  await fs.writeFile(REPORT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Dry-run report written to ${REPORT_PATH}`);
};

main().catch((error) => {
  console.error('[glossary:autolink:check] failed', error);
  process.exit(1);
});

