import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

import { taxonomy, type TaxonomyNode } from '../src/data/taxonomy';
import { tagHubQuickPaths } from '../src/data/tag-hub.config';

type GlossaryStatus = 'canonical' | 'deprecated';

interface ParsedMatrix {
  primary: Set<string>;
  related: Set<string>;
}

interface GlossaryAuditResult {
  canonicalMissingGlossary: string[];
  glossaryMissingStatus: string[];
  deprecatedTermSlugs: string[];
  deprecatedTagSlugs: Set<string>;
}

interface PostIssue {
  file: string;
  tagCount: number;
  tags: string[];
  nonCanonical: string[];
  deprecated: string[];
  invalidFormat: string[];
  tagCountViolation?: { count: number; min: number; max: number };
}

interface QuickPathViolation {
  id: string;
  invalidTags: string[];
}

interface ReportPayload {
  summary: {
    canonicalTotal: number;
    canonicalMissingGlossary: number;
    glossaryMissingStatus: number;
    deprecatedTerms: number;
    postsScanned: number;
    postsWithIssues: number;
    quickPathViolations: number;
    reportPath: string;
  };
  canonicalTagsMissingGlossary: string[];
  glossaryEntriesMissingStatus: string[];
  deprecatedGlossaryTerms: string[];
  postIssues: PostIssue[];
  quickPathViolations: QuickPathViolation[];
}

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

const VALID_TAG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_TAGS = 8;
const MAX_TAGS = 12;

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const MATRIX_PATH = path.resolve(DIRNAME, '../../../knowledge_base/meta/tag-suggestion-matrix.md');
const POSTS_DIR = path.resolve(DIRNAME, '../src/content/post');
const OUTPUT_PATH = '/tmp/taxonomy_consistency.json';

const matrixContent = fs.readFileSync(MATRIX_PATH, 'utf8');
const canonicalTags = buildCanonicalTags(matrixContent);
const canonicalSet = new Set(canonicalTags);

const glossaryAudit = auditGlossary(canonicalTags);
const postIssues = scanPostFrontmatter(canonicalSet, glossaryAudit.deprecatedTagSlugs);
const quickPathViolations = auditQuickPaths(canonicalSet);

const report: ReportPayload = {
  summary: {
    canonicalTotal: canonicalTags.length,
    canonicalMissingGlossary: glossaryAudit.canonicalMissingGlossary.length,
    glossaryMissingStatus: glossaryAudit.glossaryMissingStatus.length,
    deprecatedTerms: glossaryAudit.deprecatedTermSlugs.length,
    postsScanned: postIssues.totalScanned,
    postsWithIssues: postIssues.issues.length,
    quickPathViolations: quickPathViolations.length,
    reportPath: OUTPUT_PATH,
  },
  canonicalTagsMissingGlossary: glossaryAudit.canonicalMissingGlossary,
  glossaryEntriesMissingStatus: glossaryAudit.glossaryMissingStatus,
  deprecatedGlossaryTerms: glossaryAudit.deprecatedTermSlugs,
  postIssues: postIssues.issues,
  quickPathViolations,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));

console.log('=== Taxonomy Consistency Summary ===');
console.table([
  { issue: 'Canonical tags', count: canonicalTags.length },
  { issue: 'Canonical tags missing glossary linkage', count: glossaryAudit.canonicalMissingGlossary.length },
  { issue: 'Glossary entries missing status', count: glossaryAudit.glossaryMissingStatus.length },
  { issue: 'Deprecated glossary terms', count: glossaryAudit.deprecatedTermSlugs.length },
  { issue: 'Posts scanned', count: postIssues.totalScanned },
  { issue: 'Posts with issues', count: postIssues.issues.length },
  { issue: 'Quick path violations', count: quickPathViolations.length },
]);
console.log(`Report saved to ${OUTPUT_PATH}`);

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

    const normalizedTag = normalizeTagValue(tagCell);
    if (normalizedTag) primary.add(normalizedTag);

    if (relatedCell) {
      for (const candidate of relatedCell.split(',').map((entry) => normalizeTagValue(entry))) {
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

function normalizeTagValue(value: string): string {
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

function auditGlossary(canonical: string[]): GlossaryAuditResult {
  const missingGlossary = new Set<string>();
  const missingStatus = new Set<string>();
  const deprecatedTerms = new Set<string>();
  const deprecatedTags = new Set<string>();

  for (const tag of canonical) {
    const tagSlug = `tag-${tag}`;
    const tagNode = taxonomy[tagSlug];
    const glossaryRef = tagNode?.glossaryRef;
    if (!tagNode || tagNode.type !== 'tag' || !glossaryRef) {
      missingGlossary.add(tag);
      continue;
    }

    const glossarySlug = toGlossarySlug(glossaryRef);
    const glossaryNode = taxonomy[glossarySlug] as (TaxonomyNode & { status?: GlossaryStatus }) | undefined;
    if (!glossaryNode) {
      missingGlossary.add(tag);
      continue;
    }

    const status = glossaryNode.status;
    if (!status) {
      missingStatus.add(glossarySlug);
    } else if (status === 'deprecated') {
      deprecatedTerms.add(glossarySlug);
      deprecatedTags.add(tag);
    }
  }

  return {
    canonicalMissingGlossary: Array.from(missingGlossary).sort(),
    glossaryMissingStatus: Array.from(missingStatus).sort(),
    deprecatedTermSlugs: Array.from(deprecatedTerms).sort(),
    deprecatedTagSlugs: deprecatedTags,
  };
}

function toGlossarySlug(ref: string): string {
  return ref.replace(/^\/+/, '').replace(/^glossary\//, '').replace(/\/$/, '');
}

function scanPostFrontmatter(canonical: Set<string>, deprecatedTags: Set<string>) {
  const entries = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.mdx'));
  const issues: PostIssue[] = [];

  for (const file of entries) {
    const fullPath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const frontmatter = matter(raw).data ?? {};
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map((tag) => String(tag)) : [];

    const normalized = tags.map((tag) => ({
      original: tag,
      normalized: normalizeTagValue(tag),
    }));

    const invalidFormat = normalized
      .filter((entry) => !VALID_TAG_REGEX.test(entry.original))
      .map((entry) => entry.original);

    const nonCanonical = normalized
      .filter((entry) => entry.normalized && !canonical.has(entry.normalized))
      .map((entry) => entry.original);

    const deprecated = normalized
      .filter((entry) => entry.normalized && deprecatedTags.has(entry.normalized))
      .map((entry) => entry.original);

    const tagCount = tags.length;
    const hasTagCountViolation = tagCount < MIN_TAGS || tagCount > MAX_TAGS;

    if (
      invalidFormat.length > 0 ||
      nonCanonical.length > 0 ||
      deprecated.length > 0 ||
      hasTagCountViolation
    ) {
      issues.push({
        file: path.relative(path.resolve(DIRNAME, '..'), fullPath),
        tagCount,
        tags,
        nonCanonical: Array.from(new Set(nonCanonical)),
        deprecated: Array.from(new Set(deprecated)),
        invalidFormat: Array.from(new Set(invalidFormat)),
        tagCountViolation: hasTagCountViolation
          ? { count: tagCount, min: MIN_TAGS, max: MAX_TAGS }
          : undefined,
      });
    }
  }

  return { totalScanned: entries.length, issues };
}

function auditQuickPaths(canonical: Set<string>): QuickPathViolation[] {
  const violations: QuickPathViolation[] = [];

  for (const quickPath of tagHubQuickPaths) {
    const invalid = quickPath.tags
      .map((slug) => slug.replace(/^tag-/, ''))
      .filter((tag) => !canonical.has(tag));

    if (invalid.length > 0) {
      violations.push({
        id: quickPath.id,
        invalidTags: Array.from(new Set(invalid)).sort(),
      });
    }
  }

  return violations;
}

