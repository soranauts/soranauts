import { describe, expect, it, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateGlossarySitemaps } from '../../scripts/generate-glossary-sitemaps';
import { normalizeGlossaryFull } from '../../src/lib/glossary-normalize';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

describe('cross: glossary sitemap generation', () => {
  const tmpDirs: string[] = [];

  afterAll(async () => {
    await Promise.all(tmpDirs.map((dir) => fs.rm(dir, { recursive: true, force: true })));
  });

  it('produces canonical and alias sitemap counts', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sitemap-test-'));
    tmpDirs.push(tempDir);

    const dataPath = path.join(ROOT, 'public/data/glossary.v2025.json');
    const aliasPath = path.join(ROOT, 'public/glossary.aliases.v2025.json');
    const datasetRaw = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    const terms = normalizeGlossaryFull(datasetRaw.terms ?? datasetRaw);
    const aliasDataset = JSON.parse(await fs.readFile(aliasPath, 'utf-8')) as { aliases: Array<{ alias: string }> };
    const expectedCanonicals = terms.filter((term) => term.status === 'canonical').length;
    const expectedAliases = aliasDataset.aliases.length;

    const result = await generateGlossarySitemaps({
      dataPath,
      outputDir: tempDir,
      aliasPath,
      siteOrigin: 'https://soranauts.com',
    });

    expect(result.canonicalCount).toBe(expectedCanonicals);
    expect(result.aliasCount).toBe(expectedAliases);
    await expect(fs.stat(result.canonicalPath)).resolves.toBeDefined();
    await expect(fs.stat(result.aliasPath)).resolves.toBeDefined();
  });
});

