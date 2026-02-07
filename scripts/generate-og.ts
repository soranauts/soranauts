#!/usr/bin/env tsx
/**
 * OG Image Generator Script
 * 
 * Generates deterministic Open Graph images for glossary terms.
 * Uses SVG-based generation for zero external dependencies.
 * 
 * Usage: 
 *   pnpm og:glossary              # Generate for all terms
 *   pnpm og:glossary --changed    # Generate for changed terms only
 *   pnpm og:glossary --top 50     # Generate for top 50 terms
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'apps/web/src/content/glossary');
const OUTPUT_DIR = path.join(ROOT, 'apps/web/public/og/glossary');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface TermData {
  title: string;
  slug: string;
  category: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Brand Colors & Styles
// ─────────────────────────────────────────────────────────────────────────────

const BRAND = {
  background: '#0a0a0f',
  gradientStart: '#1a1a2e',
  gradientEnd: '#0a0a0f',
  accent: '#c92f2f',
  accentLight: '#ff4d4d',
  text: '#ffffff',
  textMuted: '#a0a0b0',
  categoryBg: 'rgba(201, 47, 47, 0.2)',
  categoryBorder: 'rgba(201, 47, 47, 0.5)',
};

const CATEGORY_COLORS: Record<string, string> = {
  Technology: '#3b82f6',
  Governance: '#8b5cf6',
  Economics: '#10b981',
  Tokens: '#f59e0b',
  DeFi: '#06b6d4',
  Infrastructure: '#6366f1',
  Community: '#ec4899',
  Security: '#ef4444',
  Interoperability: '#14b8a6',
  Development: '#84cc16',
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG Generation
// ─────────────────────────────────────────────────────────────────────────────

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncateTitle(title: string, maxLength = 40): string {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength - 3) + '...';
}

function generateOGSvg(term: TermData): string {
  const categoryColor = CATEGORY_COLORS[term.category] || BRAND.accent;
  const displayTitle = truncateTitle(term.title);
  
  // Calculate font size based on title length
  let fontSize = 64;
  if (displayTitle.length > 25) fontSize = 52;
  if (displayTitle.length > 35) fontSize = 44;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND.gradientStart}"/>
      <stop offset="100%" style="stop-color:${BRAND.gradientEnd}"/>
    </linearGradient>
    
    <!-- Accent glow -->
    <radialGradient id="accentGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${BRAND.accent};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:${BRAND.accent};stop-opacity:0"/>
    </radialGradient>
    
    <!-- Grid pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  
  <!-- Grid overlay -->
  <rect width="1200" height="630" fill="url(#grid)"/>
  
  <!-- Accent glow circle -->
  <ellipse cx="900" cy="200" rx="400" ry="300" fill="url(#accentGlow)"/>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="200" fill="none" stroke="${BRAND.accent}" stroke-width="1" opacity="0.1"/>
  <circle cx="1100" cy="530" r="150" fill="none" stroke="${BRAND.accent}" stroke-width="1" opacity="0.1"/>
  
  <!-- Category badge -->
  <rect x="80" y="80" width="${term.category.length * 14 + 40}" height="44" rx="22" 
        fill="${categoryColor}" fill-opacity="0.2" stroke="${categoryColor}" stroke-width="2"/>
  <text x="100" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="20" 
        font-weight="600" fill="${categoryColor}">${escapeXml(term.category)}</text>
  
  <!-- Title -->
  <text x="80" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" 
        font-weight="700" fill="${BRAND.text}">${escapeXml(displayTitle)}</text>
  
  <!-- Subtitle line -->
  <text x="80" y="360" font-family="system-ui, -apple-system, sans-serif" font-size="24" 
        fill="${BRAND.textMuted}">SORA Glossary</text>
  
  <!-- Bottom bar -->
  <rect x="0" y="590" width="1200" height="40" fill="${BRAND.accent}"/>
  
  <!-- Logo area -->
  <text x="80" y="560" font-family="system-ui, -apple-system, sans-serif" font-size="18" 
        font-weight="600" fill="${BRAND.textMuted}">soranauts.com</text>
  
  <!-- Decorative corner -->
  <path d="M 1120 0 L 1200 0 L 1200 80" fill="none" stroke="${BRAND.accent}" stroke-width="4"/>
  <path d="M 0 550 L 0 630 L 80 630" fill="none" stroke="${BRAND.accent}" stroke-width="4"/>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// File Operations
// ─────────────────────────────────────────────────────────────────────────────

function parseFrontMatter(content: string): TermData | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  
  const titleMatch = yaml.match(/^title:\s*"?([^"\n]+)"?/m);
  const slugMatch = yaml.match(/^slug:\s*(\S+)/m);
  const categoryMatch = yaml.match(/^category:\s*"?([^"\n]+)"?/m);

  if (!titleMatch || !slugMatch || !categoryMatch) return null;

  const slug = slugMatch[1].trim().replace(/^["']|["']$/g, '');
  // Slug is used as a filename; reject anything that could lead to path traversal or unsafe output paths.
  if (!/^[a-z0-9-]+$/i.test(slug) || slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    return null;
  }

  return {
    title: titleMatch[1].trim(),
    slug,
    category: categoryMatch[1].trim(),
  };
}

function getChangedFiles(): Set<string> {
  try {
    const output = execFileSync('git', ['diff', '--name-only', 'HEAD~1', 'HEAD'], { encoding: 'utf-8' });
    const files = output.split('\n').filter(f => f.endsWith('.mdx'));
    return new Set(files.map(f => path.basename(f)));
  } catch {
    return new Set();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const changedOnly = args.includes('--changed');
  const topN = args.includes('--top') ? parseInt(args[args.indexOf('--top') + 1], 10) : 0;
  
  console.log('🖼️  Generating OG images for glossary terms...\n');

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  const changedFiles = changedOnly ? getChangedFiles() : new Set<string>();
  
  let terms: TermData[] = [];
  
  for (const file of files) {
    if (changedOnly && !changedFiles.has(file)) continue;
    
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const term = parseFrontMatter(content);
    
    if (term) {
      terms.push(term);
    }
  }

  // Limit to top N if specified
  if (topN > 0) {
    terms = terms.slice(0, topN);
  }

  console.log(`📂 Processing ${terms.length} terms\n`);

  let generated = 0;
  let skipped = 0;

  for (const term of terms) {
    const outputPath = path.join(OUTPUT_DIR, `${term.slug}.svg`);
    
    // Check if already exists and is recent (skip regeneration)
    if (fs.existsSync(outputPath) && !changedOnly) {
      const stats = fs.statSync(outputPath);
      const age = Date.now() - stats.mtimeMs;
      // Skip if less than 1 hour old
      if (age < 3600000) {
        skipped++;
        continue;
      }
    }
    
    const svg = generateOGSvg(term);
    fs.writeFileSync(outputPath, svg, 'utf-8');
    generated++;
    
    if (generated <= 10) {
      console.log(`   ✓ ${term.slug}.svg`);
    }
  }

  if (generated > 10) {
    console.log(`   ... and ${generated - 10} more`);
  }

  console.log(`\n📊 Results:`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Skipped:   ${skipped}`);
  console.log(`\n✅ OG images saved to: ${OUTPUT_DIR}`);
  console.log('\n💡 Note: SVG images are generated. For PNG conversion, use a tool like sharp or Inkscape.');
}

main().catch((err) => {
  console.error('❌ OG generation failed:', err);
  process.exit(1);
});
