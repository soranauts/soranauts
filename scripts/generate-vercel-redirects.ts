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

interface RedirectRule {
  source: string;
  destination: string;
  permanent?: boolean;
}

interface VercelConfig {
  redirects?: RedirectRule[];
  [key: string]: unknown;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WEB_ROOT = path.join(ROOT, 'apps', 'web');
const DATA_PATH = path.join(WEB_ROOT, 'public', 'data', 'glossary.v2025.json');
const TARGET_FILES = [
  path.join(ROOT, 'vercel.json'),
  path.join(WEB_ROOT, 'vercel.json'),
];
const COMMENT_TEXT =
  'AUTO-GENERATED: keep this file in sync by running "pnpm glossary:redirects:build".';

async function loadGlossary(): Promise<GlossaryData> {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as GlossaryData;
}

async function loadVercelConfig(filePath: string): Promise<VercelConfig> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as VercelConfig;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

function buildRedirects(terms: GlossaryTerm[]): RedirectRule[] {
  const redirects: RedirectRule[] = [];

  for (const term of terms) {
    if (term.status !== 'alias' || !term.targetSlug) continue;

    const canonical = term.targetSlug.replace(/\/+$/, '');
    const alias = term.slug.replace(/\/+$/, '');

    redirects.push({
      source: `/glossary/${alias}`,
      destination: `/glossary/${canonical}`,
      permanent: true,
    });

    redirects.push({
      source: `/glossary/${alias}/`,
      destination: `/glossary/${canonical}`,
      permanent: true,
    });
  }

  return redirects;
}

async function saveConfig(filePath: string, config: VercelConfig, redirectCount: number) {
  const withComment: VercelConfig = {
    __comment: COMMENT_TEXT,
    ...config,
  };
  const serialized = `${JSON.stringify(withComment, null, 2)}\n`;
  await fs.writeFile(filePath, serialized, 'utf-8');
  console.log(`[redirects] ${filePath} → ${redirectCount} rules`);
}

async function main() {
  const glossary = await loadGlossary();
  const redirectRules = buildRedirects(glossary.terms);

  await Promise.all(
    TARGET_FILES.map(async (filePath) => {
      const existing = await loadVercelConfig(filePath);
      const nextConfig: VercelConfig = {
        ...existing,
        redirects: redirectRules,
      };
      await saveConfig(filePath, nextConfig, redirectRules.length);
    }),
  );
}

main().catch((error) => {
  console.error('[generate-vercel-redirects] failed:', error);
  process.exitCode = 1;
});

