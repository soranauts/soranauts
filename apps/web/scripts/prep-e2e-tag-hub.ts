import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = process.cwd();
const distDir = join(projectRoot, 'dist');

try {
  rmSync(distDir, { recursive: true, force: true });
} catch {
  // ignore cleanup errors
}

const result = spawnSync('pnpm', ['build'], {
  cwd: projectRoot,
  env: {
    ...process.env,
    TAG_HUB_V1: 'true',
  },
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}


