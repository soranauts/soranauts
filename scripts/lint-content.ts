#!/usr/bin/env tsx
/**
 * Content Linter Script
 * 
 * Scans MDX glossary files for content quality issues:
 * - Passive voice
 * - Vague phrases
 * - Overlong summaries
 * - Missing taglines
 * 
 * Usage: pnpm content:lint
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'apps/web/src/content/glossary');
const REPORT_PATH = path.join(ROOT, 'content-lint-report.md');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface LintIssue {
  file: string;
  slug: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  line?: number;
}

interface FrontMatter {
  title: string;
  slug: string;
  category: string;
  summary: string;
  tagline?: string;
  related?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Lint Rules
// ─────────────────────────────────────────────────────────────────────────────

const PASSIVE_VOICE_PATTERNS = [
  /\bis used to\b/gi,
  /\bis designed to\b/gi,
  /\bis intended to\b/gi,
  /\bwas created\b/gi,
  /\bwas developed\b/gi,
  /\bcan be used\b/gi,
  /\bare used\b/gi,
  /\bis called\b/gi,
  /\bis known as\b/gi,
];

const VAGUE_PHRASES = [
  { pattern: /\butilize\b/gi, suggestion: 'use' },
  { pattern: /\butilizes\b/gi, suggestion: 'uses' },
  { pattern: /\butilization\b/gi, suggestion: 'use' },
  { pattern: /\ballows for\b/gi, suggestion: 'enables' },
  { pattern: /\bin order to\b/gi, suggestion: 'to' },
  { pattern: /\bdue to the fact that\b/gi, suggestion: 'because' },
  { pattern: /\bat this point in time\b/gi, suggestion: 'now' },
  { pattern: /\bvery\b/gi, suggestion: '(remove or use specific term)' },
  { pattern: /\bbasically\b/gi, suggestion: '(remove)' },
  { pattern: /\bactually\b/gi, suggestion: '(remove)' },
  { pattern: /\bsimply\b/gi, suggestion: '(remove or rephrase)' },
];

const MAX_SUMMARY_SENTENCES = 2;
const MAX_SUMMARY_LENGTH = 300;

// ─────────────────────────────────────────────────────────────────────────────
// Parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseFrontMatter(content: string): FrontMatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const fm: Partial<FrontMatter> = {};

  const titleMatch = yaml.match(/^title:\s*"?([^"\n]+)"?/m);
  if (titleMatch) fm.title = titleMatch[1].trim();

  const slugMatch = yaml.match(/^slug:\s*(\S+)/m);
  if (slugMatch) fm.slug = slugMatch[1].trim();

  const categoryMatch = yaml.match(/^category:\s*"?([^"\n]+)"?/m);
  if (categoryMatch) fm.category = categoryMatch[1].trim();

  const summaryMatch = yaml.match(/^summary:\s*"([^"]+)"/m);
  if (summaryMatch) fm.summary = summaryMatch[1].trim();

  const taglineMatch = yaml.match(/^tagline:\s*"([^"]+)"/m);
  if (taglineMatch) fm.tagline = taglineMatch[1].trim();

  // Also check for whyItMatters (alternative field name)
  const whyItMattersMatch = yaml.match(/^whyItMatters:\s*"([^"]+)"/m);
  if (whyItMattersMatch && !fm.tagline) {
    fm.tagline = whyItMattersMatch[1].trim();
  }

  if (!fm.title || !fm.slug || !fm.category || !fm.summary) {
    return null;
  }

  return fm as FrontMatter;
}

function countSentences(text: string): number {
  // Simple sentence counting (split on . ! ?)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return sentences.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// Linting Functions
// ─────────────────────────────────────────────────────────────────────────────

function lintFile(filePath: string, content: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const filename = path.basename(filePath);
  
  const fm = parseFrontMatter(content);
  if (!fm) {
    issues.push({
      file: filename,
      slug: filename.replace('.mdx', ''),
      severity: 'error',
      rule: 'missing-frontmatter',
      message: 'Missing or invalid front matter',
    });
    return issues;
  }

  // Check for missing tagline
  if (!fm.tagline) {
    issues.push({
      file: filename,
      slug: fm.slug,
      severity: 'warning',
      rule: 'missing-tagline',
      message: 'Missing tagline/whyItMatters field',
    });
  }

  // Check summary length
  if (fm.summary.length > MAX_SUMMARY_LENGTH) {
    issues.push({
      file: filename,
      slug: fm.slug,
      severity: 'warning',
      rule: 'summary-too-long',
      message: `Summary is ${fm.summary.length} chars (max ${MAX_SUMMARY_LENGTH})`,
    });
  }

  // Check summary sentence count
  const sentenceCount = countSentences(fm.summary);
  if (sentenceCount > MAX_SUMMARY_SENTENCES) {
    issues.push({
      file: filename,
      slug: fm.slug,
      severity: 'warning',
      rule: 'summary-too-many-sentences',
      message: `Summary has ${sentenceCount} sentences (max ${MAX_SUMMARY_SENTENCES})`,
    });
  }

  // Check for passive voice in summary
  for (const pattern of PASSIVE_VOICE_PATTERNS) {
    const match = fm.summary.match(pattern);
    if (match) {
      issues.push({
        file: filename,
        slug: fm.slug,
        severity: 'info',
        rule: 'passive-voice',
        message: `Passive voice detected: "${match[0]}"`,
      });
    }
  }

  // Check for vague phrases in summary
  for (const { pattern, suggestion } of VAGUE_PHRASES) {
    const match = fm.summary.match(pattern);
    if (match) {
      issues.push({
        file: filename,
        slug: fm.slug,
        severity: 'info',
        rule: 'vague-phrase',
        message: `Vague phrase "${match[0]}" → ${suggestion}`,
      });
    }
  }

  // Check tagline for issues too
  if (fm.tagline) {
    for (const pattern of PASSIVE_VOICE_PATTERNS) {
      const match = fm.tagline.match(pattern);
      if (match) {
        issues.push({
          file: filename,
          slug: fm.slug,
          severity: 'info',
          rule: 'passive-voice-tagline',
          message: `Passive voice in tagline: "${match[0]}"`,
        });
      }
    }
  }

  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Report Generation
// ─────────────────────────────────────────────────────────────────────────────

function generateReport(issues: LintIssue[]): string {
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  let report = `# Content Lint Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `| Severity | Count |\n`;
  report += `|----------|-------|\n`;
  report += `| 🔴 Error | ${errorCount} |\n`;
  report += `| 🟡 Warning | ${warningCount} |\n`;
  report += `| 🔵 Info | ${infoCount} |\n`;
  report += `| **Total** | **${issues.length}** |\n\n`;

  if (issues.length === 0) {
    report += `✅ No issues found!\n`;
    return report;
  }

  // Group by severity
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  if (errors.length > 0) {
    report += `## 🔴 Errors\n\n`;
    for (const issue of errors) {
      report += `- **${issue.file}** (${issue.slug}): ${issue.message} [${issue.rule}]\n`;
    }
    report += `\n`;
  }

  if (warnings.length > 0) {
    report += `## 🟡 Warnings\n\n`;
    for (const issue of warnings) {
      report += `- **${issue.file}** (${issue.slug}): ${issue.message} [${issue.rule}]\n`;
    }
    report += `\n`;
  }

  if (infos.length > 0) {
    report += `## 🔵 Info\n\n`;
    for (const issue of infos) {
      report += `- **${issue.file}** (${issue.slug}): ${issue.message} [${issue.rule}]\n`;
    }
    report += `\n`;
  }

  // Group by rule
  report += `## Issues by Rule\n\n`;
  const byRule = new Map<string, LintIssue[]>();
  for (const issue of issues) {
    const existing = byRule.get(issue.rule) ?? [];
    existing.push(issue);
    byRule.set(issue.rule, existing);
  }

  for (const [rule, ruleIssues] of byRule) {
    report += `### ${rule} (${ruleIssues.length})\n\n`;
    for (const issue of ruleIssues.slice(0, 10)) {
      report += `- ${issue.file}: ${issue.message}\n`;
    }
    if (ruleIssues.length > 10) {
      report += `- ... and ${ruleIssues.length - 10} more\n`;
    }
    report += `\n`;
  }

  return report;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Linting glossary content...\n');

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  console.log(`📂 Found ${files.length} MDX files\n`);

  const allIssues: LintIssue[] = [];

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues = lintFile(filePath, content);
    allIssues.push(...issues);
  }

  // Generate report
  const report = generateReport(allIssues);
  fs.writeFileSync(REPORT_PATH, report, 'utf-8');

  // Print summary
  const errorCount = allIssues.filter((i) => i.severity === 'error').length;
  const warningCount = allIssues.filter((i) => i.severity === 'warning').length;
  const infoCount = allIssues.filter((i) => i.severity === 'info').length;

  console.log('📊 Results:');
  console.log(`   🔴 Errors:   ${errorCount}`);
  console.log(`   🟡 Warnings: ${warningCount}`);
  console.log(`   🔵 Info:     ${infoCount}`);
  console.log(`\n📝 Report saved to: ${REPORT_PATH}`);

  // Exit with error if there are errors
  if (errorCount > 0) {
    console.log('\n❌ Content lint failed with errors');
    process.exit(1);
  }

  console.log('\n✅ Content lint passed');
}

main().catch((err) => {
  console.error('❌ Content lint failed:', err);
  process.exit(1);
});


