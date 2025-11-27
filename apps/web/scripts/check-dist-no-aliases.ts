import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../public/data/glossary.v2025.json');
const DIST_DIR = path.join(__dirname, '../dist/glossary');

type GlossaryEntry = {
  slug: string;
  status: 'canonical' | 'alias' | 'deprecated';
};

async function readGlossary(): Promise<GlossaryEntry[]> {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw) as { terms: GlossaryEntry[] };
  return parsed.terms;
}

async function main() {
  const entries = await readGlossary();
  const aliasSlugs = entries.filter((term) => term.status === 'alias').map((term) => term.slug);

  if (!aliasSlugs.length) {
    console.log('[alias-guard] No alias terms found in dataset.');
    return;
  }

  const offenders: string[] = [];

  for (const alias of aliasSlugs) {
    const indexPath = path.join(DIST_DIR, alias, 'index.html');
    const flatPath = path.join(DIST_DIR, `${alias}.html`);

    if (await fileExists(indexPath)) {
      offenders.push(indexPath);
      continue;
    }
    if (await fileExists(flatPath)) {
      offenders.push(flatPath);
    }
  }

  if (offenders.length > 0) {
    console.error('[alias-guard] Alias HTML detected in dist output:');
    offenders.slice(0, 10).forEach((file) => console.error(` - ${file}`));
    if (offenders.length > 10) {
      console.error(` ...and ${offenders.length - 10} more`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('[alias-guard] No alias HTML files found in dist.');
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error('[alias-guard] Failed to validate dist output:', error);
  process.exitCode = 1;
});

