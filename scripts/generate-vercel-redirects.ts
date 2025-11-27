import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface GlossaryTerm {
  slug: string;
  status: 'canonical' | 'alias' | 'deprecated';
  targetSlug?: string | null;
}

interface GlossaryData {
  terms: GlossaryTerm[];
}

interface VercelConfig {
  redirects?: Array<{
    source: string;
    destination: string;
    permanent?: boolean;
  }>;
  [key: string]: unknown;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'apps', 'web', 'public', 'data', 'glossary.v2025.json');
const VERCEL_CONFIG_PATH = path.join(ROOT, 'vercel.json');

async function loadGlossary(): Promise<GlossaryData> {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as GlossaryData;
}

async function loadExistingVercelConfig(): Promise<VercelConfig> {
  try {
    const raw = await fs.readFile(VERCEL_CONFIG_PATH, 'utf-8');
    return JSON.parse(raw) as VercelConfig;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function saveVercelConfig(config: VercelConfig) {
  const serialized = `${JSON.stringify(config, null, 2)}\n`;
  await fs.writeFile(VERCEL_CONFIG_PATH, serialized, 'utf-8');
}

async function main() {
  const glossary = await loadGlossary();
  const existingConfig = await loadExistingVercelConfig();

  const redirects =
    glossary.terms
      .filter((term) => term.status === 'alias' && term.targetSlug)
      .map((term) => ({
        source: `/glossary/${term.slug}`,
        destination: `/glossary/${term.targetSlug}`,
        permanent: true,
      })) ?? [];

  const nextConfig: VercelConfig = {
    ...existingConfig,
    redirects,
  };

  await saveVercelConfig(nextConfig);

  console.log(`vercel.json updated with ${redirects.length} alias redirects.`);
}

main().catch((error) => {
  console.error('[generate-vercel-redirects] Failed:', error);
  process.exitCode = 1;
});

