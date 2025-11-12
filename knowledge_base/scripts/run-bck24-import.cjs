#!/usr/bin/env node
// Wrapper script to run bck24_import.ts with proper module resolution
// Uses pnpm exec from apps/web directory to ensure proper module resolution
const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'bck24_import.ts');
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

