#!/usr/bin/env tsx
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, relative } from 'path';
import { glob as globAsync } from 'glob';
import matter from 'gray-matter';
import { execa } from 'execa';
import { Command } from 'commander';
import { env } from './env';

const program = new Command();
program
  .name('backtest')
  .description('Back-test articles against knowledge base')
  .option('--articles <glob>', 'Article glob pattern', 'apps/web/src/content/post/**/*.md')
  .option('--output <dir>', 'Output directory', 'reports/backtest')
  .option('--sarif', 'Generate SARIF output')
  .option('--json', 'Output JSON summary')
  .option('--pr-diff', 'Only test files changed in PR')
  .parse();

const options = program.opts();

interface Claim {
  claim_id: string;
  text: string;
  line: number;
}

interface Evidence {
  chunk_id: string;
  score: number;
  excerpt: string;
  chunk_url: string;
}

interface ClaimResult {
  claim_id: string;
  text: string;
  line: number;
  support_score: number;
  evidence: Evidence[];
  label: 'ok' | 'warn' | 'error';
  suggestions?: string[];
}

interface BacktestResult {
  article_path: string;
  snapshot_id: string;
  claims: ClaimResult[];
  summary: {
    ok: number;
    warn: number;
    error: number;
  };
  risk_score: number;
}

function extractClaims(content: string, filepath: string): Claim[] {
  const claims: Claim[] = [];
  const lines = content.split('\n');
  let inFrontmatter = false;
  
  // Simple regex-based extraction: sentences with numbers, dates, or proper nouns
  const claimPatterns = [
    /[A-Z][^.!?]*(?:[0-9]{4}|[0-9]+\s*(?:percent|%|million|billion|thousand|days?|years?|months?))/i,
    /[A-Z][A-Za-z]+\s+(?:is|was|are|were|has|have|had)\s+[^.!?]+/,
    /[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)+\s+(?:implements|uses|supports|provides|enables)/i,
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip front-matter
    if (i === 0 && line.trim().startsWith('---')) {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter && line.trim().startsWith('---')) {
      inFrontmatter = false;
      continue;
    }
    if (inFrontmatter) continue;
    
    // Skip code blocks
    if (line.trim().startsWith('```')) continue;
    
    // Extract sentences
    const sentences = line.split(/[.!?]+\s+/);
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length < 12 || trimmed.length > 280) continue;
      
      // Check if it matches claim patterns
      const isClaim = claimPatterns.some(pattern => pattern.test(trimmed));
      if (isClaim) {
        claims.push({
          claim_id: `claim-${i + 1}-${claims.length}`,
          text: trimmed,
          line: i + 1,
        });
      }
    }
  }
  
  return claims.slice(0, 20); // Limit to 20 claims
}

async function retrieveEvidence(claim: string): Promise<Evidence[]> {
  try {
    const { stdout } = await execa('pnpm', [
      '--filter', '@soranauts/web',
      'kb:retrieve',
      claim,
      '--hybrid',
      '--alpha', '0.65',
      '--source', 'iroha_docs,soramitsu,update',
      '--limit', '3',
      '--json',
    ], {
      cwd: process.cwd(),
      timeout: 30000,
    });
    
    const results = JSON.parse(stdout);
    return results.map((r: any, idx: number) => ({
      chunk_id: r.id,
      score: r.score,
      excerpt: r.text.substring(0, 200),
      chunk_url: r.metadata?.source_url || '',
    }));
  } catch (error: any) {
    console.warn(`  ⚠ Failed to retrieve evidence for claim: ${error.message}`);
    return [];
  }
}

function computeSupportScore(evidence: Evidence[]): number {
  if (evidence.length === 0) return 0;
  // Average of top 3 scores
  return evidence.slice(0, 3).reduce((sum, e) => sum + e.score, 0) / Math.min(3, evidence.length);
}

function labelClaim(score: number): 'ok' | 'warn' | 'error' {
  if (score < 0.45) return 'error';
  if (score < 0.60) return 'warn';
  return 'ok';
}

async function backtestArticle(filepath: string): Promise<BacktestResult> {
  console.log(`  Testing: ${filepath}`);
  
  const content = readFileSync(filepath, 'utf8');
  const parsed = matter(content);
  const claims = extractClaims(parsed.content, filepath);
  
  console.log(`    Found ${claims.length} claims`);
  
  const claimResults: ClaimResult[] = [];
  
  for (const claim of claims) {
    const evidence = await retrieveEvidence(claim.text);
    const supportScore = computeSupportScore(evidence);
    const label = labelClaim(supportScore);
    
    const suggestions = label !== 'ok' && evidence.length > 0
      ? evidence.slice(0, 3).map(e => e.chunk_url)
      : undefined;
    
    claimResults.push({
      ...claim,
      support_score: supportScore,
      evidence,
      label,
      suggestions,
    });
  }
  
  const summary = {
    ok: claimResults.filter(c => c.label === 'ok').length,
    warn: claimResults.filter(c => c.label === 'warn').length,
    error: claimResults.filter(c => c.label === 'error').length,
  };
  
  const riskScore = claims.length > 0 ? 1 - (summary.ok / claims.length) : 0;
  
  return {
    article_path: filepath,
    snapshot_id: new Date().toISOString().slice(0, 10),
    claims: claimResults,
    summary,
    risk_score: riskScore,
  };
}

function generateSARIF(results: BacktestResult[]): any {
  const rules = [
    { id: 'RAG001', name: 'Insufficient Evidence', helpUri: 'https://soranauts.com' },
    { id: 'RAG002', name: 'Weak Evidence', helpUri: 'https://soranauts.com' },
  ];
  
  const results_sarif = [];
  
  for (const result of results) {
    for (const claim of result.claims) {
      if (claim.label === 'ok') continue;
      
      const ruleId = claim.label === 'error' ? 'RAG001' : 'RAG002';
      const helpUri = claim.suggestions?.[0] || '';
      
      results_sarif.push({
        ruleId,
        level: claim.label === 'error' ? 'error' : 'warning',
        message: {
          text: `Claim lacks sufficient evidence: "${claim.text.substring(0, 100)}..."`,
        },
        locations: [{
          physicalLocation: {
            artifactLocation: {
              uri: relative(process.cwd(), result.article_path),
            },
            region: {
              startLine: claim.line,
              startColumn: 1,
            },
          },
        }],
        properties: {
          support_score: claim.support_score,
          suggestions: claim.suggestions || [],
        },
        help: {
          text: `Top suggested citation: ${helpUri}`,
          markdown: helpUri ? `See: ${helpUri}` : undefined,
        },
      });
    }
  }
  
  return {
    version: '2.1.0',
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    runs: [{
      tool: {
        driver: {
          name: 'Soranauts KB Backtest',
          version: '1.0.0',
          rules,
        },
      },
      results: results_sarif,
    }],
  };
}

async function main() {
  let articles = await globAsync(options.articles, {
    absolute: true,
  });
  
  // Filter by PR diff if requested
  if (options.prDiff) {
    try {
      const { stdout } = await execa('git', ['diff', '--name-only', 'origin/main...HEAD'], {
        cwd: process.cwd(),
      });
      const changedFiles = stdout.split('\n').filter(Boolean);
      articles = articles.filter(article => 
        changedFiles.some(changed => article.includes(changed))
      );
    } catch (error: any) {
      console.warn(`  ⚠ Could not determine PR diff: ${error.message}`);
    }
  }
  
  console.log(`Found ${articles.length} articles to test`);
  
  if (articles.length === 0) {
    console.log('No articles to test.');
    return;
  }
  
  const results: BacktestResult[] = [];
  
  for (const article of articles) {
    try {
      const result = await backtestArticle(article);
      results.push(result);
    } catch (error: any) {
      console.error(`  ✗ Error testing ${article}: ${error.message}`);
    }
  }
  
  // Generate output
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = options.output;
  mkdirSync(outputDir, { recursive: true });
  
  const reportPath = join(outputDir, `${timestamp}.json`);
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  if (options.sarif) {
    const sarifPath = join(outputDir, `${timestamp}.sarif`);
    const sarif = generateSARIF(results);
    writeFileSync(sarifPath, JSON.stringify(sarif, null, 2));
    console.log(`\n✓ SARIF report: ${sarifPath}`);
  }
  
  // Summary
  const totalOk = results.reduce((sum, r) => sum + r.summary.ok, 0);
  const totalWarn = results.reduce((sum, r) => sum + r.summary.warn, 0);
  const totalError = results.reduce((sum, r) => sum + r.summary.error, 0);
  const avgRisk = results.length > 0 
    ? results.reduce((sum, r) => sum + r.risk_score, 0) / results.length 
    : 0;
  
  if (options.json) {
    console.log(JSON.stringify({
      articles_tested: results.length,
      claims_total: results.reduce((sum, r) => sum + r.claims.length, 0),
      ok: totalOk,
      warn: totalWarn,
      error: totalError,
      avg_risk_score: avgRisk,
    }));
  } else {
    console.log(`\n=== Backtest Summary ===`);
    console.log(`Articles tested: ${results.length}`);
    console.log(`Claims: OK=${totalOk}, WARN=${totalWarn}, ERROR=${totalError}`);
    console.log(`Average risk score: ${avgRisk.toFixed(2)}`);
    console.log(`\nReport: ${reportPath}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { main };














