#!/usr/bin/env npx tsx
/**
 * Verify Glossary Live
 * 
 * A Node script to verify glossary pages on a deployed site.
 * Useful for post-deployment verification.
 * 
 * Usage:
 *   npx tsx scripts/verify-glossary-live.ts https://soranauts.com
 *   npx tsx scripts/verify-glossary-live.ts http://localhost:4321
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const GLOSSARY_PATH = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
const ALIASES_PATH = path.join(ROOT, 'apps/web/public/glossary.aliases.v2025.json');

const SAMPLE_SIZE = 20; // Number of random terms to test
const TIMEOUT_MS = 10000;
const CONCURRENT_REQUESTS = 5;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  slug: string;
  title: string;
}

interface GlossaryV2025 {
  terms: GlossaryTerm[];
  canonicalCount: number;
  aliasCount: number;
}

interface AliasData {
  aliases: Array<{ alias: string; target: string }>;
}

interface VerificationResult {
  url: string;
  status: number | 'error';
  ok: boolean;
  error?: string;
  redirectedTo?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function loadGlossaryData(): GlossaryV2025 {
  return JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf-8'));
}

function loadAliasData(): AliasData {
  return JSON.parse(fs.readFileSync(ALIASES_PATH, 'utf-8'));
}

function getRandomSample<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'manual', // Don't follow redirects automatically
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function verifyUrl(url: string): Promise<VerificationResult> {
  try {
    const response = await fetchWithTimeout(url, TIMEOUT_MS);
    
    const result: VerificationResult = {
      url,
      status: response.status,
      ok: response.status === 200 || (response.status >= 300 && response.status < 400),
    };
    
    if (response.status >= 300 && response.status < 400) {
      result.redirectedTo = response.headers.get('location') || undefined;
    }
    
    return result;
  } catch (error) {
    return {
      url,
      status: 'error',
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Verification Functions
// ─────────────────────────────────────────────────────────────────────────────

async function verifyCanonicalTerms(baseUrl: string): Promise<VerificationResult[]> {
  const glossaryData = loadGlossaryData();
  const sampleTerms = getRandomSample(glossaryData.terms, SAMPLE_SIZE);
  
  console.log(`\n📋 Verifying ${sampleTerms.length} canonical terms...`);
  
  const urls = sampleTerms.map(term => `${baseUrl}/glossary/${term.slug}`);
  const results = await runBatch(urls, verifyUrl, CONCURRENT_REQUESTS);
  
  return results;
}

async function verifyAliases(baseUrl: string): Promise<VerificationResult[]> {
  const aliasData = loadAliasData();
  
  console.log(`\n🔗 Verifying ${aliasData.aliases.length} aliases...`);
  
  const urls = aliasData.aliases.map(a => `${baseUrl}/glossary/${a.alias}`);
  const results = await runBatch(urls, verifyUrl, CONCURRENT_REQUESTS);
  
  return results;
}

async function verifyKeyPages(baseUrl: string): Promise<VerificationResult[]> {
  const keyPages = [
    '/glossary',
    '/explore',
    '/glossary/sumeragi',
    '/glossary/irohavirtualmachineivm',
    '/glossary/worldstateviewwsv',
    '/glossary/lanes',
    '/glossary/dataavailability',
    '/glossary/kotodama',
  ];
  
  console.log(`\n🔑 Verifying ${keyPages.length} key pages...`);
  
  const urls = keyPages.map(page => `${baseUrl}${page}`);
  const results = await runBatch(urls, verifyUrl, CONCURRENT_REQUESTS);
  
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reporting
// ─────────────────────────────────────────────────────────────────────────────

function printResults(title: string, results: VerificationResult[]): void {
  const passed = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);
  
  console.log(`\n${title}`);
  console.log(`  ✅ Passed: ${passed.length}`);
  console.log(`  ❌ Failed: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\n  Failed URLs:');
    for (const result of failed.slice(0, 10)) {
      console.log(`    - ${result.url}`);
      console.log(`      Status: ${result.status}`);
      if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    }
    if (failed.length > 10) {
      console.log(`    ... and ${failed.length - 10} more`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    console.error('Usage: npx tsx scripts/verify-glossary-live.ts <base-url>');
    console.error('Example: npx tsx scripts/verify-glossary-live.ts https://soranauts.com');
    process.exit(1);
  }
  
  console.log(`🌐 Verifying glossary at: ${baseUrl}`);
  console.log('─'.repeat(50));
  
  // Load stats
  const glossaryData = loadGlossaryData();
  const aliasData = loadAliasData();
  
  console.log(`\n📊 Local Stats:`);
  console.log(`   Canonical: ${glossaryData.canonicalCount}`);
  console.log(`   Aliases:   ${aliasData.aliases.length}`);
  
  // Run verifications
  const keyResults = await verifyKeyPages(baseUrl);
  const canonicalResults = await verifyCanonicalTerms(baseUrl);
  const aliasResults = await verifyAliases(baseUrl);
  
  // Print results
  printResults('🔑 Key Pages', keyResults);
  printResults('📋 Canonical Terms (sample)', canonicalResults);
  printResults('🔗 Alias Redirects', aliasResults);
  
  // Summary
  const allResults = [...keyResults, ...canonicalResults, ...aliasResults];
  const totalPassed = allResults.filter(r => r.ok).length;
  const totalFailed = allResults.filter(r => !r.ok).length;
  
  console.log('\n' + '═'.repeat(50));
  console.log(`📊 SUMMARY`);
  console.log(`   Total Verified: ${allResults.length}`);
  console.log(`   ✅ Passed: ${totalPassed}`);
  console.log(`   ❌ Failed: ${totalFailed}`);
  
  if (totalFailed > 0) {
    console.log('\n❌ VERIFICATION FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ VERIFICATION PASSED');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});



