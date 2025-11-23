import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const MATRIX_PATH = path.resolve(DIRNAME, '../../../knowledge_base/meta/tag-suggestion-matrix.md');
const POSTS_DIR = path.resolve(DIRNAME, '../src/content/post');
const OUTPUT_PATH = '/tmp/taxonomy_update_articles.json';

const MIN_TAGS = 8;
const MAX_TAGS = 12;

const RELATED_ALLOWLIST = new Set([
  'nft',
  'payments',
  'adoption',
  'mobile',
  'analytics',
  'telegram',
  'ton',
  'security',
]);

interface CliOptions {
  apply: boolean;
}

interface PostReport {
  file: string;
  currentTags: string[];
  normalizedTags?: string[];
  issues: string[];
  suggested: string[];
}

interface ReportPayload {
  summary: {
    postsScanned: number;
    postsWithIssues: number;
    reportPath: string;
  };
  entries: PostReport[];
}

const options = parseArgs(process.argv.slice(2));
const matrixContent = fs.readFileSync(MATRIX_PATH, 'utf8');
const canonicalTags = buildCanonicalTags(matrixContent);
const canonicalSet = new Set(canonicalTags);

const postFiles = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.mdx'));
const reports: PostReport[] = [];

for (const file of postFiles) {
  const fullPath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const parsed = matter(raw);
  const frontmatter = parsed.data ?? {};

  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
    continue;
  }

  const originalTags = frontmatter.tags.map((tag) => String(tag));
  const normalizedTags = originalTags.map((tag) => normalizeTag(tag));
  const issues: string[] = [];

  const nonCanonical = normalizedTags.filter((tag) => tag && !canonicalSet.has(tag));
  if (nonCanonical.length > 0) {
    issues.push('nonCanonical');
  }

  const caseIssues = originalTags.some((tag, index) => normalizedTags[index] && tag !== normalizedTags[index]);
  if (caseIssues) {
    issues.push('case');
  }

  const tagCount = originalTags.length;
  if (tagCount < MIN_TAGS) {
    issues.push('count<8');
  } else if (tagCount > MAX_TAGS) {
    issues.push('count>12');
  }

  if (issues.length === 0) {
    continue;
  }

  const report: PostReport = {
    file: path.relative(path.resolve(DIRNAME, '..'), fullPath),
    currentTags: originalTags,
    issues,
    suggested: [],
  };

  const normalizationChanged = originalTags.some((tag, index) => normalizedTags[index] && tag !== normalizedTags[index]);
  if (normalizationChanged) {
    report.normalizedTags = normalizedTags;
  }

  reports.push(report);

  if (options.apply) {
    const updatedFrontmatter = {
      ...frontmatter,
      tags: originalTags,
    };
    const newContent = matter.stringify(parsed.content, updatedFrontmatter);
    fs.writeFileSync(fullPath, newContent, 'utf8');
  }
}

const payload: ReportPayload = {
  summary: {
    postsScanned: postFiles.length,
    postsWithIssues: reports.length,
    reportPath: OUTPUT_PATH,
  },
  entries: reports,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));

console.log('=== Article Tag Normalization (Dry Run) ===');
console.table(
  reports.map((report) => ({
    file: report.file,
    issues: report.issues.join(', '),
    tagCount: report.currentTags.length,
  })),
);
console.log(`Report saved to ${OUTPUT_PATH}`);

function parseArgs(rawArgs: string[]): CliOptions {
  return {
    apply: rawArgs.includes('--apply'),
  };
}

function buildCanonicalTags(markdown: string): string[] {
  const { primary, related } = parseMatrix(markdown);
  const missing = setDifference(related, primary);
  const final = new Set(primary);

  for (const tag of missing) {
    if (RELATED_ALLOWLIST.has(tag)) {
      final.add(tag);
    }
  }

  return Array.from(final).sort((a, b) => a.localeCompare(b));
}

interface ParsedMatrix {
  primary: Set<string>;
  related: Set<string>;
}

function parseMatrix(markdown: string): ParsedMatrix {
  const primary = new Set<string>();
  const related = new Set<string>();

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.startsWith('|')) continue;
    if (line.includes('|---')) continue;

    const cells = normalizeCells(line);
    if (cells.length < 5) continue;

    const [categoryCell, tagCell, , , relatedCell] = cells;
    if (!categoryCell || categoryCell.toLowerCase() === 'category') continue;
    if (!tagCell || tagCell.toLowerCase() === 'tag') continue;

    const normalizedTag = normalizeTag(tagCell);
    if (normalizedTag) primary.add(normalizedTag);

    if (relatedCell) {
      for (const candidate of relatedCell.split(',').map((entry) => normalizeTag(entry))) {
        if (candidate) related.add(candidate);
      }
    }
  }

  return { primary, related };
}

function normalizeCells(line: string): string[] {
  const rawCells = line.split('|').map((cell) => cell.trim());
  return rawCells.filter((_, index) => !(index === 0 || index === rawCells.length - 1));
}

function normalizeTag(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-_]/g, '')
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

function setDifference(a: Set<string>, b: Set<string>): Set<string> {
  const difference = new Set<string>();
  for (const value of a) {
    if (!b.has(value)) difference.add(value);
  }
  return difference;
}

