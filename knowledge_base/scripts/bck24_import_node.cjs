#!/usr/bin/env node
// Pure Node.js version of BCK import (no tsx, uses CommonJS)
// This works around tsx/pnpm module resolution issues locally
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Resolve modules from apps/web/node_modules
const appsWebDir = path.join(__dirname, '../../apps/web');
const appsWebNodeModules = path.join(appsWebDir, 'node_modules');

// Override Module._resolveFilename to check apps/web/node_modules
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain, options) {
  try {
    return originalResolveFilename.apply(this, arguments);
  } catch (e) {
    // Try resolving from apps/web/node_modules
    try {
      return originalResolveFilename.call(this, request, {
        paths: [appsWebNodeModules, ...(parent?.paths || [])]
      }, isMain, options);
    } catch (e2) {
      throw e;
    }
  }
};

let pdfParse, matter, limax;
try {
  pdfParse = require('pdf-parse');
  matter = require('gray-matter');
  limax = require('limax');
} catch (e) {
  console.error('Error loading dependencies:', e.message);
  console.error('Make sure pdf-parse, gray-matter, and limax are installed in apps/web');
  process.exit(1);
}

// KB_DIR should be the knowledge_base directory, not the repo root
const KB_DIR = process.env.KB_DIR || path.join(__dirname, '..');
const BCK_YEARS = ['bck21', 'bck22', 'bck23', 'bck24'];

function normalizeForHash(markdown) {
  return markdown
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function hashContent(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function parseRISFile(risPath) {
  const content = fs.readFileSync(risPath, 'utf-8');
  const entries = [];
  let currentEntry = { authors: [] };
  
  const lines = content.split(/\r?\n/);
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const match = line.match(/^([A-Z0-9]{2})\s+-\s+(.+)$/);
    if (!match) continue;
    
    const [, tag, value] = match;
    
    switch (tag) {
      case 'TY':
        if (currentEntry.title || currentEntry.authors.length > 0) {
          entries.push(currentEntry);
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
        currentEntry.authors.push(value.trim());
        break;
      case 'DO':
        currentEntry.doi = value.replace(/^doi:/i, '');
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
      case 'ER':
        if (currentEntry.title || currentEntry.authors.length > 0) {
          entries.push(currentEntry);
          currentEntry = { authors: [] };
        }
        break;
    }
  }
  
  if (currentEntry.title || currentEntry.authors.length > 0) {
    entries.push(currentEntry);
  }
  
  return entries.map(e => ({
    ...e,
    abstract: e.abstract?.trim(),
  }));
}

function detectBCKYear(doi, year) {
  if (doi) {
    const match = doi.match(/10\.7566\/JPSCP\.(\d{2})/i);
    if (match) {
      const vol = parseInt(match[1]);
      // Volume mapping: 36=BCK21, 40=BCK22, 43=BCK23, 44=BCK24
      if (vol === 36) return 'bck21';
      if (vol === 40) return 'bck22';
      if (vol === 43) return 'bck23';
      if (vol === 44) return 'bck24';
    }
  }
  if (year) {
    const yearNum = parseInt(year);
    if (yearNum === 2021) return 'bck21';
    if (yearNum === 2022 || yearNum === 2023) return 'bck22'; // BCK22 published in 2023
    if (yearNum === 2024) return 'bck23';
    if (yearNum === 2025) return 'bck24';
  }
  return 'bck24';
}

function generateSlug(title, doi, bckYear) {
  if (doi) {
    const match = doi.match(/10\.7566\/JPSCP\.\d{2}\.(\d+)/i);
    if (match) {
      return `${bckYear}-${match[1]}`;
    }
  }
  return `${bckYear}-${limax(title, { separator: '-', lowercase: true })}`;
}

async function processPDFForSummary(pdfPath, risAbstract) {
  try {
    const buffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(buffer);
    
    const fullText = data.text;
    let abstract = risAbstract || '';
    
    const abstractMatch = fullText.match(/(?:abstract|概要)[\s:]*\n([^\n]{50,500})/i);
    if (abstractMatch && !abstract) {
      abstract = abstractMatch[1].trim();
    }
    
    const introMatch = fullText.match(/(?:introduction|はじめに|序論)[\s:]*\n([^\n]{100,800})/i);
    const conclMatch = fullText.match(/(?:conclusion|まとめ|結論)[\s:]*\n([^\n]{100,800})/i);
    
    let summary = '';
    if (introMatch) {
      summary += introMatch[1].trim().substring(0, 300) + '... ';
    }
    if (conclMatch) {
      summary += conclMatch[1].trim().substring(0, 300);
    }
    
    if (!summary && fullText.length > 100) {
      summary = fullText.substring(0, 500).trim() + '...';
    }
    
    return { summary: summary.trim(), abstract: abstract.trim() };
  } catch (error) {
    console.warn(`  ⚠ Error processing PDF ${pdfPath}: ${error.message}`);
    return { summary: '', abstract: risAbstract || '' };
  }
}

function shouldIncludePaper(metadata) {
  const authors = metadata.authors.map(a => a.toLowerCase());
  if (authors.some(a => a.includes('takemiya') || a.includes('makoto'))) {
    return { include: true, reason: 'Makoto Takemiya author' };
  }
  
  const title = (metadata.title || '').toLowerCase();
  const abstract = (metadata.abstract || '').toLowerCase();
  const text = `${title} ${abstract}`;
  
  const keywords = [
    'sora', 'iroha', 'soramitsu', 'hyperledger',
    'cbdc', 'central bank', 'digital currency',
    'blockchain', 'consensus', 'substrate',
    'polkadot', 'parachain', 'defi',
    'cross-chain', 'bridge', 'interoperability'
  ];
  
  if (keywords.some(k => text.includes(k))) {
    return { include: true, reason: 'Relevant to SORA/Iroha/Soramitsu themes' };
  }
  
  return { include: true, reason: 'BCK general research' };
}

async function generateMarkdown(metadata, summary, abstract, bckYear) {
  const yearNum = parseInt(bckYear.replace('bck', ''));
  const fullYear = 2000 + yearNum;
  const publishDate = metadata.year ? `${metadata.year}-01-01T00:00:00Z` : `${fullYear}-01-01T00:00:00Z`;
  const snapshotId = metadata.year || `${fullYear}-11-11`;
  
  let content = `# ${metadata.title}\n\n`;
  
  if (summary) {
    content += `${summary}\n\n`;
  }
  
  if (abstract && abstract !== summary) {
    content += `## Abstract\n\n${abstract}\n\n`;
  }
  
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
  
  if (metadata.doi) {
    const doiUrl = `https://doi.org/${metadata.doi}`;
    content += `## Citation\n\nDOI: [${metadata.doi}](${doiUrl})\n\n`;
    content += `Official publication: [${doiUrl}](${doiUrl})\n`;
  }
  
  const normalizedContent = normalizeForHash(content);
  const contentHash = hashContent(normalizedContent);
  
  const tags = ['research', 'academic', bckYear];
  if (hasRelevance) {
    tags.push('blockchain', 'sora-ecosystem');
  } else {
    tags.push('general');
  }
  
  const frontmatter = {
    title: metadata.title || 'Untitled Paper',
    slug: metadata.slug,
    source: bckYear,
    source_url: metadata.doi ? `https://doi.org/${metadata.doi}` : (metadata.url || ''),
    publishDate,
    content_sha256: contentHash,
    snapshot_id: snapshotId,
    tags,
  };
  
  if (metadata.authors.length > 0) {
    frontmatter.authors = metadata.authors;
  }
  
  if (metadata.pdfPath) {
    const curatedDir = path.join(KB_DIR, 'curated', 'research', bckYear);
    const pdfRelativePath = path.relative(curatedDir, metadata.pdfPath);
    frontmatter.pdf_path = pdfRelativePath;
  }
  
  return matter.stringify(content, frontmatter);
}

async function processBCKYear(bckYear) {
  const sourcesDir = path.join(KB_DIR, 'sources', bckYear);
  const curatedDir = path.join(KB_DIR, 'curated', 'research', bckYear);
  
  if (!fs.existsSync(sourcesDir)) {
    console.log(`\n⚠ Directory does not exist: ${sourcesDir}`);
    return { processed: 0, included: 0, skipped: 0 };
  }
  
  const risFiles = fs.readdirSync(sourcesDir).filter(f => f.endsWith('.ris'));
  
  if (risFiles.length === 0) {
    console.log(`\n⚠ No RIS files found in ${sourcesDir}`);
    return { processed: 0, included: 0, skipped: 0 };
  }
  
  console.log(`\n📚 Processing ${bckYear.toUpperCase()}`);
  console.log(`Found ${risFiles.length} RIS file(s)`);
  
  const pdfFiles = fs.readdirSync(sourcesDir).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${pdfFiles.length} PDF file(s)`);
  
  fs.mkdirSync(curatedDir, { recursive: true });
  
  let processed = 0;
  let included = 0;
  let skipped = 0;
  
  for (const risFile of risFiles) {
    const risPath = path.join(sourcesDir, risFile);
    console.log(`\n  Processing RIS: ${risFile}`);
    
    const entries = parseRISFile(risPath);
    console.log(`    Found ${entries.length} entries`);
    
    for (const entry of entries) {
      processed++;
      
      if (!entry.title) {
        console.warn(`    ⚠ Skipping entry without title`);
        skipped++;
        continue;
      }
      
      const detectedYear = detectBCKYear(entry.doi, entry.year);
      const slug = generateSlug(entry.title, entry.doi, detectedYear);
      const metadata = {
        ...entry,
        slug,
      };
      
      const pdfMatch = pdfFiles.find(pdf => {
        const pdfBase = path.basename(pdf, '.pdf').toLowerCase();
        const slugBase = slug.toLowerCase();
        const titleBase = entry.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return pdfBase.includes(slugBase) || pdfBase.includes(titleBase.substring(0, 20));
      });
      
      if (pdfMatch) {
        metadata.pdfPath = path.join(sourcesDir, pdfMatch);
        console.log(`    ✓ Found PDF: ${pdfMatch}`);
      }
      
      const { include, reason } = shouldIncludePaper(metadata);
      if (!include) {
        console.log(`    ⊘ Skipping: ${entry.title} (${reason})`);
        skipped++;
        continue;
      }
      
      console.log(`    ✓ Including: ${entry.title} (${reason})`);
      
      let summary = '';
      let abstract = entry.abstract || '';
      
      if (metadata.pdfPath && fs.existsSync(metadata.pdfPath)) {
        const pdfData = await processPDFForSummary(metadata.pdfPath, abstract);
        summary = pdfData.summary;
        if (pdfData.abstract) abstract = pdfData.abstract;
      }
      
      const markdown = await generateMarkdown(metadata, summary, abstract, detectedYear);
      const outputPath = path.join(curatedDir, `${slug}.md`);
      fs.writeFileSync(outputPath, markdown);
      console.log(`    ✓ Created: ${slug}.md`);
      
      included++;
    }
  }
  
  return { processed, included, skipped };
}

async function main() {
  const yearArg = process.argv.find(arg => arg.startsWith('--year='))?.split('=')[1] || 
                  (process.argv.includes('--year') && process.argv[process.argv.indexOf('--year') + 1]) ||
                  'all';
  
  const yearsToProcess = yearArg === 'all' ? BCK_YEARS : [yearArg].filter(y => BCK_YEARS.includes(y));
  
  if (yearsToProcess.length === 0) {
    console.error('Invalid year. Use: bck21, bck22, bck23, bck24, or "all"');
    process.exit(1);
  }
  
  let totalProcessed = 0;
  let totalIncluded = 0;
  let totalSkipped = 0;
  
  for (const year of yearsToProcess) {
    const stats = await processBCKYear(year);
    totalProcessed += stats.processed;
    totalIncluded += stats.included;
    totalSkipped += stats.skipped;
  }
  
  console.log(`\n📊 Summary`);
  console.log(`  Processed: ${totalProcessed} papers`);
  console.log(`  Included: ${totalIncluded}`);
  console.log(`  Skipped: ${totalSkipped}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { main };

