import { describe, expect, it, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateGlossarySitemaps } from '../../scripts/generate-glossary-sitemaps';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

describe('cross: glossary sitemap generation', () => {
  const tmpDirs: string[] = [];

  afterAll(async () => {
    await Promise.all(tmpDirs.map((dir) => fs.rm(dir, { recursive: true, force: true })));
  });

  it('produces canonical and alias sitemap counts', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sitemap-test-'));
    tmpDirs.push(tempDir);

    const result = await generateGlossarySitemaps({
      dataPath: path.join(ROOT, 'public/data/glossary.v2025.json'),
      outputDir: tempDir,
      siteOrigin: 'https://soranauts.com',
    });

    expect(result.canonicalCount).toBe(52);
    expect(result.aliasCount).toBe(5);
    await expect(fs.stat(result.canonicalPath)).resolves.toBeDefined();
    await expect(fs.stat(result.aliasPath)).resolves.toBeDefined();
  });
});

