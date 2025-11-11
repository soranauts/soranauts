#!/usr/bin/env tsx
import { glob as globAsync } from 'glob';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename, relative } from 'path';
import pdfParse from 'pdf-parse';
import matter from 'gray-matter';
import { Command } from 'commander';
import { createHash } from 'crypto';

const program = new Command();
program
  .option('--in <glob>', 'Input glob pattern', 'knowledge_base/pdfs/**/*.pdf')
  .option('--out <dir>', 'Output directory', 'knowledge_base/pdfs_md')
  .option('--json', 'Output JSON summary')
  .parse();

const options = program.opts();

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

async function importPDF(pdfPath: string, outputDir: string): Promise<number> {
  const buffer = readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  
  // Split by pages (approximate - pdf-parse doesn't always give perfect page breaks)
  // Use page numbers if available, otherwise split by form feeds
  const pages = data.numpages > 0 
    ? Array.from({ length: data.numpages }, (_, i) => {
        // Approximate page content - pdf-parse gives full text, so we'll split evenly
        const pageSize = Math.floor(data.text.length / data.numpages);
        return data.text.slice(i * pageSize, (i + 1) * pageSize).trim();
      })
    : data.text.split(/\f/).filter(p => p.trim());
  
  let pageCount = 0;
  
  for (let i = 0; i < pages.length; i++) {
    const pageText = pages[i].trim();
    if (!pageText || pageText.length < 50) continue; // Skip very short pages
    
    const normalized = pageText
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    const contentHash = sha256(normalized);
    const baseName = basename(pdfPath, '.pdf');
    const slug = `${baseName}-page-${i + 1}`;
    
    const frontmatter = {
      title: `${basename(pdfPath)} - Page ${i + 1}`,
      source: 'pdf',
      source_url: `file://${relative(process.cwd(), pdfPath)}`,
      pdf_source: relative(process.cwd(), pdfPath),
      pdf_page: i + 1,
      content_sha256: contentHash,
      snapshot_id: new Date().toISOString().slice(0, 10),
    };
    
    const mdContent = `# ${frontmatter.title}\n\n${normalized}`;
    const fileContent = matter.stringify(mdContent, frontmatter);
    
    const outputPath = join(outputDir, `${slug}.md`);
    writeFileSync(outputPath, fileContent);
    pageCount++;
  }
  
  return pageCount;
}

async function main() {
  const pdfs = await globAsync(options.in);
  console.log(`Found ${pdfs.length} PDFs to import`);
  
  if (pdfs.length === 0) {
    console.log('No PDFs found. Create knowledge_base/pdfs/ directory and add PDF files.');
    return;
  }
  
  mkdirSync(options.out, { recursive: true });
  
  let processed = 0;
  let totalPages = 0;
  
  for (const pdfPath of pdfs) {
    console.log(`  Processing: ${pdfPath}`);
    try {
      const pages = await importPDF(pdfPath, options.out);
      processed++;
      totalPages += pages;
      console.log(`    ✓ Extracted ${pages} pages`);
    } catch (error: any) {
      console.warn(`  ⚠ Error processing ${pdfPath}: ${error.message}`);
    }
  }
  
  if (options.json) {
    console.log(JSON.stringify({
      processed,
      total_pages: totalPages,
    }));
  } else {
    console.log(`\n✓ Processed ${processed} PDFs, extracted ${totalPages} pages`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { main };













