#!/usr/bin/env tsx
/**
 * Slugs Health Check Monitor
 * 
 * Checks 30 random glossary slugs for availability.
 * Designed to run on a schedule (e.g., every 6 hours).
 * 
 * Usage: pnpm monitor:slugs [--url https://soranauts.com]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const GLOSSARY_DATA_PATH = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
const DEFAULT_BASE_URL = 'https://soranauts.com';
const CHECK_COUNT = 30;
const TIMEOUT_MS = 10000;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  slug: string;
  title: string;
}

interface CheckResult {
  slug: string;
  url: string;
  status: number;
  ok: boolean;
  latency: number;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function checkUrl(url: string): Promise<CheckResult> {
  const start = Date.now();
  const slug = url.split('/').pop() || '';
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });
    
    clearTimeout(timeout);
    
    return {
      slug,
      url,
      status: response.status,
      ok: response.ok,
      latency: Date.now() - start,
    };
  } catch (error: any) {
    return {
      slug,
      url,
      status: 0,
      ok: false,
      latency: Date.now() - start,
      error: error.message,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const baseUrl = process.argv[2]?.startsWith('--url')
    ? process.argv[3]
    : process.argv[2] || DEFAULT_BASE_URL;

  console.log(`\n🔍 Glossary Slugs Health Check`);
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Checking: ${CHECK_COUNT} random slugs\n`);

  // Load glossary data
  let terms: GlossaryTerm[];
  try {
    const data = JSON.parse(fs.readFileSync(GLOSSARY_DATA_PATH, 'utf-8'));
    terms = data.terms || [];
  } catch (error) {
    console.error('❌ Failed to load glossary data');
    process.exit(1);
  }

  if (terms.length === 0) {
    console.error('❌ No terms found in glossary data');
    process.exit(1);
  }

  // Select random slugs
  const selectedTerms = shuffleArray(terms).slice(0, CHECK_COUNT);
  
  console.log(`📊 Checking ${selectedTerms.length} slugs...\n`);

  // Check all slugs
  const results: CheckResult[] = [];
  
  for (const term of selectedTerms) {
    const url = `${baseUrl}/glossary/${term.slug}`;
    const result = await checkUrl(url);
    results.push(result);
    
    const statusIcon = result.ok ? '✅' : '❌';
    const latencyStr = `${result.latency}ms`.padStart(6);
    console.log(`   ${statusIcon} ${result.slug.padEnd(30)} ${result.status} ${latencyStr}`);
  }

  // Summary
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  const avgLatency = Math.round(results.reduce((sum, r) => sum + r.latency, 0) / results.length);

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   ⏱️  Avg Latency: ${avgLatency}ms`);

  if (failed > 0) {
    console.log(`\n❌ Failed Slugs:`);
    for (const result of results.filter(r => !r.ok)) {
      console.log(`   - ${result.slug}: ${result.error || `Status ${result.status}`}`);
    }
    console.log(`\n🚨 ALERT: ${failed} slug(s) failed health check!`);
    process.exit(1);
  }

  console.log(`\n✅ All ${passed} slugs healthy!`);
  console.log(`   Timestamp: ${new Date().toISOString()}\n`);
}

main().catch((err) => {
  console.error('❌ Monitor failed:', err);
  process.exit(1);
});


