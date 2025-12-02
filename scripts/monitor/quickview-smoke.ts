#!/usr/bin/env tsx
/**
 * Quick-View Smoke Test Monitor
 * 
 * Loads a glossary page with Quick-View deep-link and checks for errors.
 * Designed to run on a schedule to verify Quick-View functionality.
 * 
 * Usage: pnpm monitor:quickview [--url https://soranauts.com]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const GLOSSARY_DATA_PATH = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
const DEFAULT_BASE_URL = 'https://soranauts.com';
const TIMEOUT_MS = 15000;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  slug: string;
  title: string;
  tagline?: string;
}

interface SmokeResult {
  test: string;
  passed: boolean;
  details: string;
  latency?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

async function testPageLoad(baseUrl: string, slug: string): Promise<SmokeResult> {
  const url = `${baseUrl}/glossary/${slug}`;
  const start = Date.now();
  
  try {
    const response = await fetch(url, { 
      method: 'GET',
      headers: { 'Accept': 'text/html' },
    });
    
    if (!response.ok) {
      return {
        test: 'Page Load',
        passed: false,
        details: `Status ${response.status}`,
        latency: Date.now() - start,
      };
    }
    
    const html = await response.text();
    
    // Check for basic page structure
    if (!html.includes('</html>')) {
      return {
        test: 'Page Load',
        passed: false,
        details: 'Invalid HTML response',
        latency: Date.now() - start,
      };
    }
    
    return {
      test: 'Page Load',
      passed: true,
      details: `OK (${html.length} bytes)`,
      latency: Date.now() - start,
    };
  } catch (error: any) {
    return {
      test: 'Page Load',
      passed: false,
      details: error.message,
      latency: Date.now() - start,
    };
  }
}

async function testQuickViewDeepLink(baseUrl: string, slug: string): Promise<SmokeResult> {
  const url = `${baseUrl}/glossary?term=${slug}`;
  const start = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'text/html' },
    });
    
    if (!response.ok) {
      return {
        test: 'Quick-View Deep Link',
        passed: false,
        details: `Status ${response.status}`,
        latency: Date.now() - start,
      };
    }
    
    const html = await response.text();
    
    // Check for Quick-View component markers
    const hasQuickViewComponent = html.includes('GlossaryQuickView') || 
                                   html.includes('data-qv-trigger') ||
                                   html.includes('qv-panel');
    
    if (!hasQuickViewComponent) {
      return {
        test: 'Quick-View Deep Link',
        passed: false,
        details: 'Quick-View component not found in HTML',
        latency: Date.now() - start,
      };
    }
    
    return {
      test: 'Quick-View Deep Link',
      passed: true,
      details: 'Quick-View component present',
      latency: Date.now() - start,
    };
  } catch (error: any) {
    return {
      test: 'Quick-View Deep Link',
      passed: false,
      details: error.message,
      latency: Date.now() - start,
    };
  }
}

async function testTermJsonEndpoint(baseUrl: string, slug: string): Promise<SmokeResult> {
  const url = `${baseUrl}/data/terms/${slug}.json`;
  const start = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      // Term JSON might not exist for all terms (legacy)
      if (response.status === 404) {
        return {
          test: 'Term JSON Endpoint',
          passed: true,
          details: 'Not found (expected for some terms)',
          latency: Date.now() - start,
        };
      }
      return {
        test: 'Term JSON Endpoint',
        passed: false,
        details: `Status ${response.status}`,
        latency: Date.now() - start,
      };
    }
    
    const data = await response.json();
    
    // Validate JSON structure
    if (!data.slug || !data.title) {
      return {
        test: 'Term JSON Endpoint',
        passed: false,
        details: 'Invalid JSON structure',
        latency: Date.now() - start,
      };
    }
    
    return {
      test: 'Term JSON Endpoint',
      passed: true,
      details: `OK (slug: ${data.slug})`,
      latency: Date.now() - start,
    };
  } catch (error: any) {
    return {
      test: 'Term JSON Endpoint',
      passed: false,
      details: error.message,
      latency: Date.now() - start,
    };
  }
}

async function testGlossaryIndex(baseUrl: string): Promise<SmokeResult> {
  const url = `${baseUrl}/data/glossary.v2025.json`;
  const start = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      return {
        test: 'Glossary Index',
        passed: false,
        details: `Status ${response.status}`,
        latency: Date.now() - start,
      };
    }
    
    const data = await response.json();
    
    if (!data.terms || !Array.isArray(data.terms)) {
      return {
        test: 'Glossary Index',
        passed: false,
        details: 'Invalid index structure',
        latency: Date.now() - start,
      };
    }
    
    return {
      test: 'Glossary Index',
      passed: true,
      details: `OK (${data.terms.length} terms)`,
      latency: Date.now() - start,
    };
  } catch (error: any) {
    return {
      test: 'Glossary Index',
      passed: false,
      details: error.message,
      latency: Date.now() - start,
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

  console.log(`\n🔍 Quick-View Smoke Test`);
  console.log(`   Base URL: ${baseUrl}\n`);

  // Load glossary data for test slugs
  let terms: GlossaryTerm[];
  try {
    const data = JSON.parse(fs.readFileSync(GLOSSARY_DATA_PATH, 'utf-8'));
    terms = data.terms || [];
  } catch (error) {
    console.error('❌ Failed to load glossary data');
    process.exit(1);
  }

  // Select a term with tagline for testing
  const testTerm = terms.find(t => t.tagline) || terms[0];
  
  if (!testTerm) {
    console.error('❌ No terms found for testing');
    process.exit(1);
  }

  console.log(`📋 Test Term: ${testTerm.title} (${testTerm.slug})\n`);

  // Run tests
  const results: SmokeResult[] = [];

  console.log('Running tests...\n');

  // Test 1: Glossary Index
  const indexResult = await testGlossaryIndex(baseUrl);
  results.push(indexResult);
  console.log(`   ${indexResult.passed ? '✅' : '❌'} ${indexResult.test}: ${indexResult.details}`);

  // Test 2: Page Load
  const pageResult = await testPageLoad(baseUrl, testTerm.slug);
  results.push(pageResult);
  console.log(`   ${pageResult.passed ? '✅' : '❌'} ${pageResult.test}: ${pageResult.details}`);

  // Test 3: Quick-View Deep Link
  const qvResult = await testQuickViewDeepLink(baseUrl, testTerm.slug);
  results.push(qvResult);
  console.log(`   ${qvResult.passed ? '✅' : '❌'} ${qvResult.test}: ${qvResult.details}`);

  // Test 4: Term JSON Endpoint
  const jsonResult = await testTermJsonEndpoint(baseUrl, testTerm.slug);
  results.push(jsonResult);
  console.log(`   ${jsonResult.passed ? '✅' : '❌'} ${jsonResult.test}: ${jsonResult.details}`);

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const avgLatency = Math.round(
    results.filter(r => r.latency).reduce((sum, r) => sum + (r.latency || 0), 0) / 
    results.filter(r => r.latency).length
  );

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Passed: ${passed}/${results.length}`);
  console.log(`   ❌ Failed: ${failed}/${results.length}`);
  console.log(`   ⏱️  Avg Latency: ${avgLatency}ms`);

  if (failed > 0) {
    console.log(`\n🚨 ALERT: Quick-View smoke test failed!`);
    for (const result of results.filter(r => !r.passed)) {
      console.log(`   - ${result.test}: ${result.details}`);
    }
    process.exit(1);
  }

  console.log(`\n✅ All Quick-View smoke tests passed!`);
  console.log(`   Timestamp: ${new Date().toISOString()}\n`);
}

main().catch((err) => {
  console.error('❌ Monitor failed:', err);
  process.exit(1);
});


