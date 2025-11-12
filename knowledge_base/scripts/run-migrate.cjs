#!/usr/bin/env node
// Wrapper script to run migrate-frontmatter.ts with proper module resolution
// Note: This script has known module resolution issues with tsx/pnpm locally
// It works correctly in CI. For local execution, use: pnpm --filter @soranauts/web exec tsx knowledge_base/scripts/migrate-frontmatter.ts
const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'migrate-frontmatter.ts');
const args = process.argv.slice(2);

// Get directories
const rootDir = path.join(__dirname, '../..');
const appsWebDir = path.join(rootDir, 'apps/web');

// Change to apps/web directory and use pnpm exec (same as CI)
process.chdir(appsWebDir);

// Use pnpm exec tsx from apps/web (matches CI execution pattern)
// This ensures proper module resolution in pnpm workspaces
const child = spawn('pnpm', ['exec', 'tsx', path.relative(appsWebDir, scriptPath), ...args], {
  stdio: 'inherit',
  cwd: appsWebDir,
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

