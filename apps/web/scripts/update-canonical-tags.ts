import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync, type ExecException } from 'node:child_process';
import { fileURLToPath } from 'node:url';

interface ParsedMatrix {
  primary: Set<string>;
  relatedCandidates: Set<string>;
}

interface CliOptions {
  dryRun: boolean;
  write: boolean;
  includeRelated: boolean;
  expect?: number;
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

type DiffExecError = ExecException & { status?: number };

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const MATRIX_PATH = path.resolve(DIRNAME, '../../../knowledge_base/meta/tag-suggestion-matrix.md');
const CONFIG_PATH = path.resolve(DIRNAME, '../src/data/tag-hub.config.ts');

const options = parseArgs(process.argv.slice(2));

if (!options.write && !options.dryRun) {
  options.dryRun = true;
}

const matrixContent = fs.readFileSync(MATRIX_PATH, 'utf8');
const { primary, relatedCandidates } = parseMatrix(matrixContent);
const missingFromPrimary = setDifference(relatedCandidates, primary);
const promoted = new Set<string>();
const excluded = new Set<string>();

for (const tag of missingFromPrimary) {
  if (RELATED_ALLOWLIST.has(tag)) {
    promoted.add(tag);
  } else {
    excluded.add(tag);
  }
}

const finalSet = new Set(primary);
if (options.includeRelated) {
  for (const tag of promoted) {
    finalSet.add(tag);
  }
}

const canonicalTags = Array.from(finalSet).sort((a, b) => a.localeCompare(b));

logSummary({
  primaryCount: primary.size,
  relatedCount: relatedCandidates.size,
  missingCount: missingFromPrimary.size,
  promoted,
  excluded,
  finalCount: canonicalTags.length,
  includeRelated: options.includeRelated,
  previewFirst: canonicalTags.slice(0, 10),
  previewLast: canonicalTags.slice(-10),
});

if (options.expect !== undefined && options.expect !== canonicalTags.length) {
  console.error(
    `Expected ${options.expect} canonical tags but computed ${canonicalTags.length}.`,
  );
  if (excluded.size > 0) {
    console.error(`Excluded tags: ${Array.from(excluded).sort().join(', ')}`);
  }
  process.exitCode = 1;
}

if (!canonicalTags.length) {
  throw new Error('No canonical tags extracted from the matrix file.');
}

const canonicalSection = buildCanonicalSection(canonicalTags);
const configText = fs.readFileSync(CONFIG_PATH, 'utf8');
const metadataIndex = configText.indexOf('export const tagHubMetadata');
if (metadataIndex === -1) {
  throw new Error('Unable to locate tagHubMetadata export in tag-hub.config.ts');
}

const canonicalStart = configText.indexOf('export const CANONICAL_TAGS =');
const before =
  canonicalStart >= 0 ? configText.slice(0, canonicalStart) : configText.slice(0, metadataIndex);
const after = configText.slice(metadataIndex);
const updatedConfig = `${before}${canonicalSection}${after}`;

if (updatedConfig === configText) {
  console.log('CANONICAL_TAGS already in sync with the matrix.');
  process.exit(0);
}

if (options.write) {
  fs.writeFileSync(CONFIG_PATH, updatedConfig, 'utf8');
  console.log(
    `Updated ${path.relative(process.cwd(), CONFIG_PATH)} with ${canonicalTags.length} canonical tags.`,
  );
} else {
  printDiff(configText, updatedConfig);
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
      const relatedTags = relatedCell.split(',').map((entry) => normalizeTagValue(entry));
      for (const candidate of relatedTags) {
        if (candidate) related.add(candidate);
      }
    }
  }

  return { primary, relatedCandidates: related };
}

function normalizeCells(line: string): string[] {
  const rawCells = line.split('|').map((cell) => cell.trim());
  const cells = rawCells.filter((_, index) => !(index === 0 || index === rawCells.length - 1));
  return cells;
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

function buildCanonicalSection(tags: string[]): string {
  const tagLines = tags.map((tag) => `  '${tag}',`).join('\n');
  return `
export const CANONICAL_TAGS = [
${tagLines}
] as const;

const CANONICAL_TAG_SET = new Set<string>(CANONICAL_TAGS);

export const isCanonicalTag = (value?: string | null): boolean => {
  if (!value) return false;
  const normalized = value
    .toString()
    .toLowerCase()
    .replace(/^tag-/, '')
    .trim();
  return CANONICAL_TAG_SET.has(normalized);
};

`;
}

function printDiff(original: string, updated: string): void {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'canonical-dryrun-'));
  const tmpPath = path.join(tmpDir, path.basename(CONFIG_PATH));
  fs.writeFileSync(tmpPath, updated, 'utf8');

  try {
    const diffOutput = execSync(`diff -u "${CONFIG_PATH}" "${tmpPath}"`, {
      encoding: 'utf8',
    });
    console.log(diffOutput);
  } catch (error) {
    if (isExecDiffError(error)) {
      if (error.stdout) {
        console.log(error.stdout);
      }
    } else {
      throw error;
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function logSummary({
  primaryCount,
  relatedCount,
  missingCount,
  promoted,
  excluded,
  finalCount,
  includeRelated,
  previewFirst,
  previewLast,
}: {
  primaryCount: number;
  relatedCount: number;
  missingCount: number;
  promoted: Set<string>;
  excluded: Set<string>;
  finalCount: number;
  includeRelated: boolean;
  previewFirst: string[];
  previewLast: string[];
}): void {
  console.log(`Primary (Tag column): ${primaryCount}`);
  console.log(`Related candidates (unique): ${relatedCount}`);
  console.log(`Missing from Tag column: ${missingCount}`);
  console.log(`Promoted related tags: ${Array.from(promoted).sort().join(', ') || '—'}`);
  console.log(`Excluded related tags: ${Array.from(excluded).sort().join(', ') || '—'}`);
  console.log(
    `Final canonical count (includeRelated=${includeRelated ? 'true' : 'false'}): ${finalCount}`,
  );
  if (previewFirst.length > 0) {
    console.log(`Preview (first 10): ${previewFirst.join(', ')}`);
  }
  if (previewLast.length > 0) {
    console.log(`Preview (last 10): ${previewLast.join(', ')}`);
  }
}

function parseArgs(rawArgs: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: true,
    write: false,
    includeRelated: true,
  };

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg === '--write') {
      options.write = true;
      options.dryRun = false;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      options.write = false;
      continue;
    }

    if (arg === '--include-related') {
      options.includeRelated = true;
      continue;
    }

    if (arg === '--no-include-related') {
      options.includeRelated = false;
      continue;
    }

    if (arg.startsWith('--include-related=')) {
      options.includeRelated = parseBooleanValue(arg.split('=')[1]);
      continue;
    }

    if (arg.startsWith('--expect')) {
      const value = parseNumericFlag(arg, rawArgs, index);
      if (value === undefined || Number.isNaN(value)) {
        throw new Error('Expected numeric value for --expect');
      }
      if (!arg.includes('=')) index += 1;
      options.expect = value;
      continue;
    }
  }

  return options;
}

function parseNumericFlag(arg: string, args: string[], index: number): number | undefined {
  if (arg.includes('=')) {
    const [, rawValue] = arg.split('=');
    return Number.parseInt(rawValue, 10);
  }
  const next = args[index + 1];
  if (next && !next.startsWith('--')) {
    return Number.parseInt(next, 10);
  }
  return undefined;
}

function parseBooleanValue(value: string): boolean {
  const normalized = value.toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  throw new Error(`Invalid boolean value: ${value}`);
}

function isExecDiffError(error: unknown): error is DiffExecError {
  if (!(error instanceof Error)) return false;
  const candidate = error as Partial<DiffExecError>;
  return typeof candidate.status === 'number' && candidate.status === 1;
}

