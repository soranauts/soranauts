#!/usr/bin/env ts-node
/**
 * Validate internal links and find orphan content
 * Detects broken links and articles with no incoming references
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONTENT_POST_DIR = path.join(PROJECT_ROOT, 'apps/web/src/content/post');
const CONTENT_GLOSSARY_DIR = path.join(PROJECT_ROOT, 'apps/web/src/content/glossary');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'docs/claude-reference');

interface ValidationResult {
  brokenLinks: {
    sourceFile: string;
    link: string;
    lineNumber?: number;
  }[];
  orphanContent: {
    slug: string;
    title: string;
    type: 'blog' | 'glossary';
  }[];
  warnings: string[];
}

function extractLinks(content: string): string[] {
  const links = new Set<string>();

  // Match markdown links [text](url)
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = mdLinkRegex.exec(content)) !== null) {
    const url = match[2];
    // Only internal links starting with /
    if (url.startsWith('/') && !url.startsWith('//')) {
      links.add(url.split('#')[0].split('?')[0]); // Remove anchors and query params
    }
  }

  // Match HTML links <a href="url">
  const htmlLinkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/g;
  while ((match = htmlLinkRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.startsWith('/') && !url.startsWith('//')) {
      links.add(url.split('#')[0].split('?')[0]);
    }
  }

  return Array.from(links);
}

function getAllSlugs(): { blog: Set<string>; glossary: Set<string>; static: Set<string> } {
  const blog = new Set<string>();
  const glossary = new Set<string>();
  const staticPages = new Set<string>();

  // Get blog posts
  const postFiles = fs.readdirSync(CONTENT_POST_DIR).filter(f => f.endsWith('.mdx'));
  for (const file of postFiles) {
    const filePath = path.join(CONTENT_POST_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    const slug = data.customSlug || file.replace('.mdx', '');
    blog.add(`/${slug}`);
  }

  // Get glossary terms
  if (fs.existsSync(CONTENT_GLOSSARY_DIR)) {
    const glossaryFiles = fs.readdirSync(CONTENT_GLOSSARY_DIR).filter(f => f.endsWith('.mdx'));
    for (const file of glossaryFiles) {
      const filePath = path.join(CONTENT_GLOSSARY_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      const slug = data.slug || file.replace('.mdx', '').toLowerCase();
      glossary.add(`/glossary/${slug}`);
    }
  }

  // Add known static pages
  staticPages.add('/');
  staticPages.add('/about');
  staticPages.add('/explore');
  staticPages.add('/learn');
  staticPages.add('/glossary');
  staticPages.add('/changelog');
  staticPages.add('/features');
  staticPages.add('/donate');
  staticPages.add('/privacy');
  staticPages.add('/terms');
  staticPages.add('/tools/quote');

  return { blog, glossary, static: staticPages };
}

function validateLinks(): ValidationResult {
  const result: ValidationResult = {
    brokenLinks: [],
    orphanContent: [],
    warnings: [],
  };

  const { blog, glossary, static: staticPages } = getAllSlugs();
  const allValidSlugs = new Set([...blog, ...glossary, ...staticPages]);
  const incomingLinks = new Map<string, number>();

  // Initialize incoming link counts
  for (const slug of allValidSlugs) {
    incomingLinks.set(slug, 0);
  }

  // Check blog posts
  const postFiles = fs.readdirSync(CONTENT_POST_DIR).filter(f => f.endsWith('.mdx'));
  for (const file of postFiles) {
    const filePath = path.join(CONTENT_POST_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    const sourceSlug = data.customSlug || file.replace('.mdx', '');

    const links = extractLinks(fileContent);

    for (const link of links) {
      // Check if link is valid
      if (!allValidSlugs.has(link)) {
        // Might be a dynamic route - check patterns
        const isDynamicRoute = 
          link.startsWith('/tag/') ||
          link.startsWith('/learn/') ||
          link === '/blog' ||
          link.match(/^\/\[\.\.\.blog\]/);

        if (!isDynamicRoute) {
          result.brokenLinks.push({
            sourceFile: file,
            link: link,
          });
        }
      } else {
        // Count incoming link
        incomingLinks.set(link, (incomingLinks.get(link) || 0) + 1);
      }
    }
  }

  // Check glossary terms
  if (fs.existsSync(CONTENT_GLOSSARY_DIR)) {
    const glossaryFiles = fs.readdirSync(CONTENT_GLOSSARY_DIR).filter(f => f.endsWith('.mdx'));
    for (const file of glossaryFiles) {
      const filePath = path.join(CONTENT_GLOSSARY_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      const links = extractLinks(fileContent);

      for (const link of links) {
        if (!allValidSlugs.has(link)) {
          const isDynamicRoute = 
            link.startsWith('/tag/') ||
            link.startsWith('/learn/') ||
            link === '/blog';

          if (!isDynamicRoute) {
            result.brokenLinks.push({
              sourceFile: `glossary/${file}`,
              link: link,
            });
          }
        } else {
          incomingLinks.set(link, (incomingLinks.get(link) || 0) + 1);
        }
      }
    }
  }

  // Find orphan content (blog posts with 0 incoming links)
  for (const [slug, count] of incomingLinks.entries()) {
    if (count === 0) {
      if (blog.has(slug)) {
        const filename = slug.replace('/', '') + '.mdx';
        const filePath = path.join(CONTENT_POST_DIR, filename);
        
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data } = matter(fileContent);
          
          result.orphanContent.push({
            slug,
            title: data.title || 'Untitled',
            type: 'blog',
          });
        }
      }
      // Note: We don't flag glossary terms as orphans since they're reference material
    }
  }

  // Generate warnings
  if (result.brokenLinks.length > 0) {
    result.warnings.push(`Found ${result.brokenLinks.length} broken internal links`);
  }
  if (result.orphanContent.length > 0) {
    result.warnings.push(`Found ${result.orphanContent.length} orphan articles (no incoming links)`);
  }

  return result;
}

function generateValidationReport(): string {
  const now = new Date().toISOString().split('T')[0];
  const result = validateLinks();

  let output = `# Link Validation Report\n`;
  output += `Generated: ${now}\n\n`;

  if (result.warnings.length === 0) {
    output += `✅ **All validation checks passed!**\n\n`;
  } else {
    output += `⚠️  **Issues Found:**\n`;
    for (const warning of result.warnings) {
      output += `- ${warning}\n`;
    }
    output += `\n`;
  }

  // Broken links section
  if (result.brokenLinks.length > 0) {
    output += `## 🔴 Broken Internal Links (${result.brokenLinks.length})\n\n`;
    output += `These links point to content that doesn't exist:\n\n`;
    output += `| Source File | Broken Link |\n`;
    output += `|-------------|-------------|\n`;

    for (const item of result.brokenLinks) {
      output += `| ${item.sourceFile} | ${item.link} |\n`;
    }

    output += `\n### How to Fix\n`;
    output += `1. Check if the slug is correct in LINK_INVENTORY.md\n`;
    output += `2. Update the link to use the correct slug\n`;
    output += `3. If content doesn't exist, consider creating it or removing the link\n\n`;
  } else {
    output += `## ✅ Broken Links\n\n`;
    output += `No broken internal links found.\n\n`;
  }

  // Orphan content section
  if (result.orphanContent.length > 0) {
    output += `## 🟡 Orphan Content (${result.orphanContent.length})\n\n`;
    output += `These articles have no incoming links from other content:\n\n`;
    output += `| Slug | Title | Type |\n`;
    output += `|------|-------|------|\n`;

    for (const item of result.orphanContent) {
      output += `| ${item.slug} | ${item.title} | ${item.type} |\n`;
    }

    output += `\n### Impact\n`;
    output += `- Orphan content is harder for readers to discover\n`;
    output += `- May indicate content that needs better integration\n`;
    output += `- Consider adding links from related articles\n\n`;

    output += `### Recommendations\n`;
    output += `1. Review each orphan article for relevance\n`;
    output += `2. Add contextual links from related content\n`;
    output += `3. Feature high-value orphans on the home page or learning paths\n`;
    output += `4. Consider removing or archiving outdated orphan content\n\n`;
  } else {
    output += `## ✅ Orphan Content\n\n`;
    output += `No orphan articles found. All content is linked from somewhere!\n\n`;
  }

  // Summary statistics
  output += `## 📊 Summary\n\n`;
  output += `- **Broken Links:** ${result.brokenLinks.length}\n`;
  output += `- **Orphan Articles:** ${result.orphanContent.length}\n`;
  output += `- **Status:** ${result.warnings.length === 0 ? '✅ Healthy' : '⚠️  Needs Attention'}\n`;

  return output;
}

// Main execution
console.log('🔍 Validating internal links...');
const report = generateValidationReport();

const outputPath = path.join(OUTPUT_DIR, 'VALIDATION_REPORT.md');
fs.writeFileSync(outputPath, report, 'utf-8');

console.log('✅ Validation report generated');
console.log(`📁 Output: ${outputPath}`);

// Also log to console for immediate feedback
const result = validateLinks();
if (result.brokenLinks.length > 0) {
  console.log(`\n🔴 Found ${result.brokenLinks.length} broken links`);
}
if (result.orphanContent.length > 0) {
  console.log(`🟡 Found ${result.orphanContent.length} orphan articles`);
}
if (result.warnings.length === 0) {
  console.log(`\n✅ All validation checks passed!`);
}


