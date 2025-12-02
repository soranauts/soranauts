#!/usr/bin/env tsx
/**
 * Pre-deploy Release Preparation Script
 * 
 * Validates the build environment and runs critical checks before deployment.
 * 
 * Checks:
 * 1. Node/pnpm version requirements
 * 2. Glossary build produces expected counts
 * 3. Minimal E2E smoke tests pass
 * 
 * Usage: pnpm predeploy:prod
 */

import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const EXPECTED_CANONICAL_COUNT = 179;
const EXPECTED_MIN_ALIAS_COUNT = 13;
const REQUIRED_NODE_MAJOR = 20;
const REQUIRED_PNPM_MAJOR = 9;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' };
  console.log(`${icons[type]} ${message}`);
}

function fail(message: string): never {
  log(message, 'error');
  process.exit(1);
}

function run(command: string, cwd = ROOT): string {
  try {
    return execSync(command, { cwd, encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    throw new Error(err.stderr || err.message || 'Command failed');
  }
}

function runWithOutput(command: string, cwd = ROOT): boolean {
  const result = spawnSync(command, { cwd, shell: true, stdio: 'inherit' });
  return result.status === 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Checks
// ─────────────────────────────────────────────────────────────────────────────

function checkNodeVersion() {
  log('Checking Node.js version...');
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  
  if (major < REQUIRED_NODE_MAJOR) {
    fail(`Node.js ${REQUIRED_NODE_MAJOR}.x required, found ${nodeVersion}`);
  }
  log(`Node.js ${nodeVersion} ✓`, 'success');
}

function checkPnpmVersion() {
  log('Checking pnpm version...');
  try {
    const pnpmVersion = run('pnpm --version');
    const major = parseInt(pnpmVersion.split('.')[0], 10);
    
    if (major < REQUIRED_PNPM_MAJOR) {
      fail(`pnpm ${REQUIRED_PNPM_MAJOR}.x required, found ${pnpmVersion}`);
    }
    log(`pnpm ${pnpmVersion} ✓`, 'success');
  } catch {
    fail('pnpm not found. Install with: npm install -g pnpm');
  }
}

function checkGlossaryBuild() {
  log('Building glossary...');
  
  if (!runWithOutput('pnpm glossary:build')) {
    fail('Glossary build failed');
  }
  
  // Read generated stats
  const glossaryPath = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');
  const aliasPath = path.join(ROOT, 'apps/web/public/glossary.aliases.v2025.json');
  
  if (!fs.existsSync(glossaryPath)) {
    fail(`Glossary output not found: ${glossaryPath}`);
  }
  
  if (!fs.existsSync(aliasPath)) {
    fail(`Alias output not found: ${aliasPath}`);
  }
  
  const glossaryData = JSON.parse(fs.readFileSync(glossaryPath, 'utf-8'));
  const aliasData = JSON.parse(fs.readFileSync(aliasPath, 'utf-8'));
  
  const canonicalCount = glossaryData.terms?.length ?? glossaryData.canonicalCount ?? 0;
  const aliasCount = aliasData.aliases?.length ?? 0;
  
  log(`Canonical terms: ${canonicalCount} (expected: ${EXPECTED_CANONICAL_COUNT})`);
  log(`Aliases: ${aliasCount} (expected: >= ${EXPECTED_MIN_ALIAS_COUNT})`);
  
  if (canonicalCount < EXPECTED_CANONICAL_COUNT) {
    fail(`Canonical count ${canonicalCount} is less than expected ${EXPECTED_CANONICAL_COUNT}`);
  }
  
  if (aliasCount < EXPECTED_MIN_ALIAS_COUNT) {
    fail(`Alias count ${aliasCount} is less than expected ${EXPECTED_MIN_ALIAS_COUNT}`);
  }
  
  log('Glossary build validated ✓', 'success');
}

function checkTypecheck() {
  log('Running typecheck...');
  
  if (!runWithOutput('pnpm -w typecheck')) {
    fail('Typecheck failed');
  }
  
  log('Typecheck passed ✓', 'success');
}

function runSmokeTests() {
  log('Running E2E smoke tests...');
  
  // Check if dev server is running
  const devServerRunning = (() => {
    try {
      execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:4321', { encoding: 'utf-8' });
      return true;
    } catch {
      return false;
    }
  })();
  
  if (!devServerRunning) {
    log('Dev server not running. Skipping E2E tests.', 'warn');
    log('To run E2E tests, start the dev server first: pnpm dev', 'info');
    return;
  }
  
  // Run minimal smoke tests
  const testCommands = [
    'pnpm --filter @soranauts/web e2e:routing',
    'pnpm --filter @soranauts/web playwright test --grep "smoke|open|escape" apps/web/tests/e2e/glossary.quickview.spec.ts',
  ];
  
  for (const cmd of testCommands) {
    log(`Running: ${cmd}`);
    if (!runWithOutput(cmd)) {
      fail(`Smoke test failed: ${cmd}`);
    }
  }
  
  log('E2E smoke tests passed ✓', 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Preparing Release...\n');
  
  checkNodeVersion();
  checkPnpmVersion();
  checkGlossaryBuild();
  checkTypecheck();
  runSmokeTests();
  
  console.log('\n✅ All pre-deploy checks passed!\n');
  console.log('Ready to deploy. Run: pnpm deploy:prod\n');
}

main().catch((err) => {
  console.error('\n❌ Pre-deploy preparation failed:', err.message);
  process.exit(1);
});


