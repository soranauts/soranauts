#!/usr/bin/env tsx
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob as globAsync } from 'glob';
import matter from 'gray-matter';
import { Command } from 'commander';
import { env } from './env';
import { computeAuthority } from './utils/authority';

// Import MiniSearch - resolve package path relative to this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const miniSearchPath = join(__dirname, '../../node_modules/minisearch/dist/es/index.js');
const MiniSearchModule = await import(miniSearchPath);
const MiniSearchClass = (MiniSearchModule.default || MiniSearchModule) as typeof import('minisearch').default;
type MiniSearch<T> = InstanceType<typeof MiniSearchClass>;

const program = new Command();
program
  .option('--build', 'Build BM25 index')
  .option('--json', 'Output JSON');

// Only parse args if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export interface Bm25Document {
  id: string;
  title: string;
  h1: string;
  body: string;
  source: string;
  source_url: string;
  snapshot_id: string;
  authority: number; // Authority level: 1 (highest) to 4 (lowest), default 3
}

async function buildIndex(): Promise<MiniSearch<Bm25Document>> {
  console.log('Building BM25 index...');
  
  const indexDir = env.BM25_INDEX_DIR;
  mkdirSync(indexDir, { recursive: true });
  
  const files = await globAsync('**/*.md', {
    cwd: env.KB_DIR,
    absolute: true,
      ignore: ['**/node_modules/**', '**/.git/**', '**/.kb_index/**', '**/snapshots/**', '**/sources/**'],
  });
  
  const documents: Bm25Document[] = [];
  
  for (const filepath of files) {
    try {
      const content = readFileSync(filepath, 'utf8');
      const parsed = matter(content);
      const frontmatter = parsed.data as any;
      
      // Extract h1 from markdown
      const h1Match = parsed.content.match(/^#\s+(.+)$/m);
      const h1 = h1Match ? h1Match[1].trim() : '';
      
      // Compute authority based on source and file path
      const source = frontmatter.source || 'unknown';
      const relativePath = filepath.replace(env.KB_DIR + '/', '');
      const authority = computeAuthority(source, relativePath);
      
      const doc: Bm25Document = {
        id: filepath,
        title: frontmatter.title || '',
        h1: h1,
        body: parsed.content,
        source: source,
        source_url: frontmatter.source_url || '',
        snapshot_id: frontmatter.snapshot_id || '',
        authority: authority,
      };
      
      documents.push(doc);
    } catch (error: any) {
      console.warn(`  ⚠ Failed to process ${filepath}: ${error.message}`);
    }
  }
  
  console.log(`  Indexing ${documents.length} documents...`);
  
  const search = new MiniSearchClass<Bm25Document>({
    fields: ['title', 'h1', 'body'],
    storeFields: ['title', 'h1', 'source', 'source_url', 'snapshot_id', 'authority'],
  });
  
  search.addAll(documents);
  
  // Save index
  const indexData = JSON.stringify(search.toJSON());
  writeFileSync(join(indexDir, 'index.json'), indexData);
  
  console.log(`✓ BM25 index built: ${documents.length} documents`);
  
  return search;
}

export async function loadIndex(): Promise<MiniSearch<Bm25Document>> {
  const indexPath = join(env.BM25_INDEX_DIR, 'index.json');
  
  if (!existsSync(indexPath)) {
    throw new Error('BM25 index not found. Run with --build first.');
  }
  
  const indexData = JSON.parse(readFileSync(indexPath, 'utf8'));
  return MiniSearchClass.loadJSON(indexData, {
    fields: ['title', 'h1', 'body'],
    storeFields: ['title', 'h1', 'source', 'source_url', 'snapshot_id', 'authority'],
  });
}

async function main() {
  if (program.opts().build) {
    await buildIndex();
    return;
  }
  
  // If not building, this is used by retrieve.ts via import
  // The actual query logic is in retrieve.ts
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { buildIndex };

