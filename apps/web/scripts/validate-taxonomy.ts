import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

import { taxonomy } from '../src/data/taxonomy';
import tagStats from '../src/data/tag-stats.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_DIR = path.join(__dirname, '../src/content/post');

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const toTagSlug = (value: string): string => `tag-${normalize(value).replace(/\s+/g, '-')}`;

interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  file?: string;
}

const issues: ValidationIssue[] = [];

function collectPostTags(): Map<string, Set<string>> {
  const tagUsage = new Map<string, Set<string>>();

  const entries = fs.readdirSync(POSTS_DIR);
  for (const entry of entries) {
    const filePath = path.join(POSTS_DIR, entry);
    if (fs.statSync(filePath).isDirectory()) continue;
    if (!entry.endsWith('.mdx') && !entry.endsWith('.md')) continue;

    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);
    const tags: string[] = Array.isArray(data?.tags) ? data.tags : [];

    for (const tag of tags) {
      const slug = toTagSlug(String(tag));
      if (!tagUsage.has(slug)) tagUsage.set(slug, new Set());
      tagUsage.get(slug)!.add(entry);
    }
  }

  return tagUsage;
}

function validateTags(tagUsage: Map<string, Set<string>>) {
  for (const [tag, files] of tagUsage.entries()) {
    const tagNode = taxonomy[tag];
    if (!tagNode) {
      issues.push({
        type: 'error',
        message: `Tag "${tag}" is used in posts but missing from taxonomy`,
        file: Array.from(files).join(', '),
      });
    } else if (!tagNode.glossaryRef) {
      issues.push({
        type: 'warning',
        message: `Tag "${tag}" exists in taxonomy but lacks a glossaryRef`,
      });
    }
  }
}

function validateTagStats(tagUsage: Map<string, Set<string>>) {
  for (const [tag, files] of tagUsage.entries()) {
    const stat = tagStats[tag];
    const usageCount = files.size;

    if (!stat) {
      issues.push({
        type: 'error',
        message: `Tag stats missing entry for "${tag}"`,
        file: Array.from(files).join(', '),
      });
      continue;
    }

    if (stat.count !== usageCount) {
      issues.push({
        type: 'error',
        message: `Tag stats for "${tag}" count ${stat.count} does not match usage ${usageCount}`,
        file: Array.from(files).join(', '),
      });
    }
  }

  for (const slug of Object.keys(tagStats)) {
    if (!taxonomy[slug]) {
      issues.push({
        type: 'warning',
        message: `Tag stats include "${slug}" which is missing from taxonomy`,
      });
    }
  }
}

function validateTerms() {
  for (const node of Object.values(taxonomy)) {
    if (node.type === 'tag') continue;
    if (!node.definition) {
      issues.push({
        type: 'warning',
        message: `Taxonomy node "${node.slug}" is missing a definition`,
      });
    }
    if (!node.category && node.type !== 'entity') {
      issues.push({
        type: 'error',
        message: `Glossary entry "${node.slug}" is missing a category`,
      });
    }
    if (!node.slug) {
      issues.push({
        type: 'error',
        message: `Glossary entry "${node.title}" is missing a slug property`,
      });
    }
  }
}

function main() {
  const tagUsage = collectPostTags();
  validateTags(tagUsage);
  validateTagStats(tagUsage);
  validateTerms();

  const errors = issues.filter((issue) => issue.type === 'error');
  const warnings = issues.filter((issue) => issue.type === 'warning');

  if (!issues.length) {
    console.log('✅ Taxonomy validation passed with no issues.');
    return;
  }

  if (errors.length) {
    console.error('❌ Taxonomy validation failed with errors:');
    for (const error of errors) {
      console.error(`  - ${error.message}${error.file ? ` (files: ${error.file})` : ''}`);
    }
  }

  if (warnings.length) {
    console.warn('⚠️  Taxonomy validation warnings:');
    for (const warning of warnings) {
      console.warn(`  - ${warning.message}${warning.file ? ` (files: ${warning.file})` : ''}`);
    }
  }

  if (errors.length) {
    process.exit(1);
  }
}

main();

