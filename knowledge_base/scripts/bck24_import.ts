#!/usr/bin/env tsx
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename, extname, relative } from 'path';
import { createHash } from 'crypto';
import pdfParse from 'pdf-parse';
import matter from 'gray-matter';
import { Command } from 'commander';
import { env } from './env';
import { normalizeForHash, hashContent } from './utils/text-normalize';
import { kbFrontmatterSchema, type KBFrontmatter } from './types';
import limax from 'limax';

const KB_DIR = env.KB_DIR;
const SOURCES_DIR = join(KB_DIR, 'sources', 'bck24');
const CURATED_DIR = join(KB_DIR, 'curated', 'research', 'bck24');

interface RISEntry {
  title?: string;
  authors: string[];
  doi?: string;
  year?: string;
  abstract?: string;
  journal?: string;
  type?: string;
  url?: string;
  pages?: string;
  volume?: string;
  number?: string;
}

interface PaperMetadata extends RISEntry {
  pdfPath?: string;
  slug: string;
}

function parseRISFile(risPath: string): RISEntry[] {
  const content = readFileSync(risPath, 'utf-8');
  const entries: RISEntry[] = [];
  let currentEntry: Partial<RISEntry> = { authors: [] };
  
  const lines = content.split(/\r?\n/);
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    // RIS format: TAG  - Value
    const match = line.match(/^([A-Z0-9]{2})\s+-\s+(.+)$/);
    if (!match) continue;
    
    const [, tag, value] = match;
    
    switch (tag) {
      case 'TY':
        // Type - start new entry if not first
        if (currentEntry.title || currentEntry.authors.length > 0) {
          entries.push(currentEntry as RISEntry);
          currentEntry = { authors: [] };
        }
        currentEntry.type = value;
        break;
      case 'T1':
      case 'TI':
        currentEntry.title = value;
        break;
      case 'AU':
        if (!currentEntry.authors) currentEntry.authors = [];
        currentEntry.authors.push(value);
        break;
      case 'DO':
        currentEntry.doi = value;
        break;
      case 'PY':
        currentEntry.year = value;
        break;
      case 'AB':
        currentEntry.abstract = (currentEntry.abstract || '') + ' ' + value;
        break;
      case 'JO':
      case 'T2':
        currentEntry.journal = value;
        break;
      case 'UR':
        currentEntry.url = value;
        break;
      case 'SP':
        currentEntry.pages = value;
        break;
      case 'VL':
        currentEntry.volume = value;
        break;
      case 'IS':
        currentEntry.number = value;
        break;
      case 'ER':
        // End of record
        if (currentEntry.title || currentEntry.authors.length > 0) {
          entries.push(currentEntry as RISEntry);
          currentEntry = { authors: [] };
        }
        break;
    }
  }
  
  // Push last entry if exists
  if (currentEntry.title || currentEntry.authors.length > 0) {
    entries.push(currentEntry as RISEntry);
  }
  
  return entries.map(e => ({
    ...e,
    abstract: e.abstract?.trim(),
  }));
}

function generateSlug(title: string, doi?: string): string {
  if (doi) {
    // Extract meaningful part from DOI (e.g., "10.7566/BCK24.123" -> "bck24-123")
    const doiMatch = doi.match(/10\.7566\/BCK24\.?(\d+)/i);
    if (doiMatch) {
      return `bck24-${doiMatch[1]}`;
    }
    // Fallback: use DOI as slug base
    const doiSlug = doi.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    return `bck24-${doiSlug}`;
  }
  
  // Generate from title
  return limax(title, { separator: '-', lowercase: true });
}

function extractPDFSummary(pdfPath: string): { summary: string; abstract: string } {
  try {
    const buffer = readFileSync(pdfPath);
    // This is async, but we'll handle it in the async function
    return { summary: '', abstract: '' };
  } catch (error) {
    return { summary: '', abstract: '' };
  }
}

async function processPDFForSummary(pdfPath: string, risAbstract?: string): Promise<{ summary: string; abstract: string }> {
  try {
    const buffer = readFileSync(pdfPath);
    const data = await pdfParse(buffer);
    
    const fullText = data.text;
    
    // Try to extract abstract section
    let abstract = risAbstract || '';
    const abstractMatch = fullText.match(/(?:abstract|概要)[\s:]*\n([^\n]{50,500})/i);
    if (abstractMatch && !abstract) {
      abstract = abstractMatch[1].trim();
    }
    
    // Extract introduction and conclusion for summary
    const introMatch = fullText.match(/(?:introduction|はじめに|序論)[\s:]*\n([^\n]{100,800})/i);
    const conclMatch = fullText.match(/(?:conclusion|まとめ|結論)[\s:]*\n([^\n]{100,800})/i);
    
    let summary = '';
    if (introMatch) {
      summary += introMatch[1].trim().substring(0, 300) + '... ';
    }
    if (conclMatch) {
      summary += conclMatch[1].trim().substring(0, 300);
    }
    
    // If no structured sections found, use first 500 chars
    if (!summary && fullText.length > 100) {
      summary = fullText.substring(0, 500).trim() + '...';
    }
    
    return { summary: summary.trim(), abstract: abstract.trim() };
  } catch (error: any) {
    console.warn(`  ⚠ Error processing PDF ${pdfPath}: ${error.message}`);
    return { summary: '', abstract: risAbstract || '' };
  }
}

function shouldIncludePaper(metadata: PaperMetadata): { include: boolean; reason: string } {
  const title = (metadata.title || '').toLowerCase();
  const abstract = (metadata.abstract || '').toLowerCase();
  const authors = metadata.authors.map(a => a.toLowerCase());
  
  // Always include Makoto Takemiya papers
  if (authors.some(a => a.includes('takemiya') || a.includes('makoto'))) {
    return { include: true, reason: 'Makoto Takemiya author' };
  }
  
  // Keywords for SORA/Iroha/Soramitsu relevance
  const relevantKeywords = [
    'sora', 'iroha', 'soramitsu', 'hyperledger',
    'cbdc', 'central bank', 'digital currency',
    'blockchain', 'consensus', 'substrate',
    'polkadot', 'parachain', 'defi',
    'cross-chain', 'bridge', 'interoperability'
  ];
  
  const text = `${title} ${abstract}`.toLowerCase();
  const hasRelevantKeyword = relevantKeywords.some(keyword => text.includes(keyword));
  
  if (hasRelevantKeyword) {
    return { include: true, reason: 'Relevant to SORA/Iroha/Soramitsu themes' };
  }
  
  // Include all BCK24 papers but tag as general
  return { include: true, reason: 'BCK24 general research' };
}

async function generateMarkdown(metadata: PaperMetadata, summary: string, abstract: string): Promise<string> {
  const publishDate = metadata.year ? `${metadata.year}-01-01T00:00:00Z` : '2024-01-01T00:00:00Z';
  const snapshotId = metadata.year || '2024-11-11';
  
  // Build content
  let content = `# ${metadata.title}\n\n`;
  
  if (summary) {
    content += `${summary}\n\n`;
  }
  
  if (abstract && abstract !== summary) {
    content += `## Abstract\n\n${abstract}\n\n`;
  }
  
  // Relevance note
  const relevanceKeywords = ['sora', 'iroha', 'soramitsu', 'cbdc', 'hyperledger'];
  const hasRelevance = relevanceKeywords.some(k => 
    (metadata.title || '').toLowerCase().includes(k) ||
    (abstract || '').toLowerCase().includes(k) ||
    metadata.authors.some(a => a.toLowerCase().includes('takemiya'))
  );
  
  if (hasRelevance) {
    content += `## Relevance to SORA Ecosystem\n\n`;
    if (metadata.authors.some(a => a.toLowerCase().includes('takemiya'))) {
      content += `This paper is authored by Makoto Takemiya, CEO of SORAMITSU and co-founder of the SORA ecosystem. `;
    }
    content += `This research contributes to blockchain infrastructure, consensus mechanisms, or digital currency systems relevant to SORA, Hyperledger Iroha, or SORAMITSU's work.\n\n`;
  }
  
  // DOI link
  if (metadata.doi) {
    const doiUrl = metadata.doi.startsWith('http') ? metadata.doi : `https://doi.org/${metadata.doi}`;
    content += `## Citation\n\nDOI: [${metadata.doi}](${doiUrl})\n\n`;
    content += `Official publication: [${doiUrl}](${doiUrl})\n`;
  }
  
  // Normalize and hash content
  const normalizedContent = normalizeForHash(content);
  const contentHash = hashContent(normalizedContent);
  
  // Build frontmatter
  const tags = ['research', 'academic', 'bck24'];
  if (hasRelevance) {
    tags.push('blockchain', 'sora-ecosystem');
  } else {
    tags.push('general');
  }
  
  const frontmatter: Partial<KBFrontmatter> = {
    title: metadata.title || 'Untitled Paper',
    slug: metadata.slug,
    source: 'bck24',
    source_url: metadata.doi ? (metadata.doi.startsWith('http') ? metadata.doi : `https://doi.org/${metadata.doi}`) : (metadata.url || ''),
    publishDate,
    content_sha256: contentHash,
    snapshot_id: snapshotId,
    tags,
  };
  
  if (metadata.authors.length > 0) {
    (frontmatter as any).authors = metadata.authors;
  }
  
  if (metadata.pdfPath) {
    const pdfRelativePath = relative(CURATED_DIR, metadata.pdfPath);
    (frontmatter as any).pdf_path = pdfRelativePath;
  }
  
  // Validate frontmatter
  const validated = kbFrontmatterSchema.parse(frontmatter);
  
  return matter.stringify(content, validated as any);
}

async function main() {
  const program = new Command();
  program
    .option('--ris <file>', 'RIS file path', join(SOURCES_DIR, '*.ris'))
    .option('--dry-run', 'Preview changes without writing files')
    .parse();
  
  const options = program.opts();
  
  // Find RIS files
  const risFiles = readdirSync(SOURCES_DIR).filter(f => f.endsWith('.ris'));
  
  if (risFiles.length === 0) {
    console.log('No RIS files found in', SOURCES_DIR);
    console.log('Please place RIS files in:', SOURCES_DIR);
    return;
  }
  
  console.log(`Found ${risFiles.length} RIS file(s)`);
  
  // Find PDF files
  const pdfFiles = readdirSync(SOURCES_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${pdfFiles.length} PDF file(s)`);
  
  mkdirSync(CURATED_DIR, { recursive: true });
  
  let processed = 0;
  let included = 0;
  let skipped = 0;
  
  for (const risFile of risFiles) {
    const risPath = join(SOURCES_DIR, risFile);
    console.log(`\nProcessing RIS: ${risFile}`);
    
    const entries = parseRISFile(risPath);
    console.log(`  Found ${entries.length} entries`);
    
    for (const entry of entries) {
      processed++;
      
      if (!entry.title) {
        console.warn(`  ⚠ Skipping entry without title`);
        skipped++;
        continue;
      }
      
      const slug = generateSlug(entry.title, entry.doi);
      const metadata: PaperMetadata = {
        ...entry,
        slug,
      };
      
      // Try to find matching PDF
      const pdfMatch = pdfFiles.find(pdf => {
        const pdfBase = basename(pdf, '.pdf').toLowerCase();
        const slugBase = slug.toLowerCase();
        const titleBase = entry.title!.toLowerCase().replace(/[^a-z0-9]/g, '');
        return pdfBase.includes(slugBase) || pdfBase.includes(titleBase.substring(0, 20));
      });
      
      if (pdfMatch) {
        metadata.pdfPath = join(SOURCES_DIR, pdfMatch);
        console.log(`  ✓ Found PDF: ${pdfMatch}`);
      }
      
      // Check if should include
      const { include, reason } = shouldIncludePaper(metadata);
      if (!include) {
        console.log(`  ⊘ Skipping: ${entry.title} (${reason})`);
        skipped++;
        continue;
      }
      
      console.log(`  ✓ Including: ${entry.title} (${reason})`);
      
      // Process PDF for summary if available
      let summary = '';
      let abstract = entry.abstract || '';
      
      if (metadata.pdfPath && existsSync(metadata.pdfPath)) {
        const pdfData = await processPDFForSummary(metadata.pdfPath, abstract);
        summary = pdfData.summary;
        if (pdfData.abstract) abstract = pdfData.abstract;
      }
      
      // Generate markdown
      const markdown = await generateMarkdown(metadata, summary, abstract);
      
      if (options.dryRun) {
        console.log(`  [DRY RUN] Would create: ${slug}.md`);
        console.log(`  Frontmatter preview:`, JSON.stringify(metadata, null, 2));
      } else {
        const outputPath = join(CURATED_DIR, `${slug}.md`);
        writeFileSync(outputPath, markdown);
        console.log(`  ✓ Created: ${slug}.md`);
      }
      
      included++;
    }
  }
  
  console.log(`\n✓ Processed ${processed} papers`);
  console.log(`  Included: ${included}`);
  console.log(`  Skipped: ${skipped}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { main };

