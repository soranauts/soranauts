import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { load as loadHtml } from 'cheerio';
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

describe('cross: canonical links', () => {
  let outDir: string;
  let canonicalHtml: string;
  let aliasHtml: string;

  beforeAll(async () => {
    outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'astro-cross-'));
    const env = {
      ...process.env,
      SKIP_OG_VALIDATION: process.env.SKIP_OG_VALIDATION ?? '1',
    };
    const astroBin = path.join(ROOT, 'node_modules', '.bin', process.platform === 'win32' ? 'astro.cmd' : 'astro');
    execFileSync(astroBin, ['build', '--outDir', outDir, '--silent'], {
      cwd: ROOT,
      env,
      stdio: 'inherit',
    });
    canonicalHtml = await fs.readFile(path.join(outDir, 'glossary/xor/index.html'), 'utf-8');
    aliasHtml = await fs.readFile(
      path.join(outDir, 'glossary/token-bonding-curve/index.html'),
      'utf-8',
    );
  }, 180_000);

  afterAll(async () => {
    if (outDir) {
      await fs.rm(outDir, { recursive: true, force: true });
    }
  });

  const assertCanonical = (html: string, expectedSlug: string) => {
    const $ = loadHtml(html);
    const links = $('head link[rel="canonical"]');
    expect(links.length).toBeGreaterThan(0);
    const hrefs = links
      .map((_, element) => $(element).attr('href'))
      .get()
      .filter(Boolean);
    expect(hrefs).toContain(`https://soranauts.com/glossary/${expectedSlug}`);
  };

  it('renders canonical slug for xor', () => {
    assertCanonical(canonicalHtml, 'xor');
  });

  it('renders canonical slug for alias pages', () => {
    assertCanonical(aliasHtml, 'bonding-curve');
  });
});

