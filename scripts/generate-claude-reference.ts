#!/usr/bin/env ts-node
/**
 * Generate comprehensive reference files for Claude article editing sessions
 * Creates documentation about site structure, content inventory, and linking patterns
 *
 * CodeQL: Safe - This build script processes only trusted internal MDX content
 * from the repository. All string operations (escaping, replacement) handle
 * content authored by repository maintainers, not external user input.
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

interface BlogPost {
  slug: string;
  title: string;
  publishDate?: string;
  updateDate?: string;
  category?: string;
  tags: string[];
  customSlug?: string;
  filePath: string;
  content: string;
}

interface GlossaryTerm {
  slug: string;
  title: string;
  category?: string;
  tags: string[];
  summary?: string;
  filePath: string;
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Escape string for use in markdown table cells.
 * Escapes backslashes first, then pipe characters to avoid incomplete sanitization.
 */
function escapeForMarkdownTable(str: string): string {
  return str.replaceAll('\\', '\\\\').replaceAll('|', '\\|');
}

function extractLinks(content: string): { internal: string[]; external: string[] } {
  const internal: Set<string> = new Set();
  const external: Set<string> = new Set();

  // Match markdown links [text](url)
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = mdLinkRegex.exec(content)) !== null) {
    const url = match[2];
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const domain = new URL(url).hostname;
        external.add(domain);
      } catch (e) {
        // Invalid URL, skip
      }
    } else if (url.startsWith('/')) {
      internal.add(url);
    }
  }

  // Match HTML links <a href="url">
  const htmlLinkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/g;
  while ((match = htmlLinkRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const domain = new URL(url).hostname;
        external.add(domain);
      } catch (e) {
        // Invalid URL, skip
      }
    } else if (url.startsWith('/')) {
      internal.add(url);
    }
  }

  return {
    internal: Array.from(internal).sort(),
    external: Array.from(external).sort(),
  };
}

function countWords(content: string): number {
  // Remove frontmatter, code blocks, HTML tags, and markdown punctuation in one pass
  const cleaned = content.replace(
    /^---[\s\S]*?---|```[\s\S]*?```|<[^>]+>|[#*_`]/g,
    ''
  );
  
  const words = cleaned.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  const files = fs.readdirSync(CONTENT_POST_DIR).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(CONTENT_POST_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const slug = data.customSlug || file.replace('.mdx', '');
    
    posts.push({
      slug,
      title: data.title || 'Untitled',
      publishDate: data.publishDate,
      updateDate: data.updateDate,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      customSlug: data.customSlug,
      filePath: file,
      content: fileContent,
    });
  }

  return posts.sort((a, b) => a.slug.localeCompare(b.slug));
}

function getAllGlossaryTerms(): GlossaryTerm[] {
  const terms: GlossaryTerm[] = [];
  
  if (!fs.existsSync(CONTENT_GLOSSARY_DIR)) {
    return terms;
  }

  const files = fs.readdirSync(CONTENT_GLOSSARY_DIR).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(CONTENT_GLOSSARY_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    const slug = data.slug || file.replace('.mdx', '').toLowerCase();
    
    terms.push({
      slug,
      title: data.title || file.replace('.mdx', ''),
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: data.summary,
      filePath: file,
    });
  }

  return terms.sort((a, b) => a.slug.localeCompare(b.slug));
}

function generateLinkInventory(posts: BlogPost[], terms: GlossaryTerm[]): string {
  const now = new Date().toISOString().split('T')[0];
  
  let output = `# Soranauts Link Inventory\n`;
  output += `Generated: ${now}\n\n`;
  output += `This file contains all valid internal links for the Soranauts website.\n`;
  output += `Use this as a reference when creating or editing articles.\n\n`;
  
  // Blog posts
  output += `## Blog Post Slugs (Valid Internal Links)\n\n`;
  output += `Total blog posts: ${posts.length}\n\n`;
  output += `| Slug | Title | File |\n`;
  output += `|------|-------|------|\n`;
  
  for (const post of posts) {
    const slug = `/${post.slug}`;
    const title = escapeForMarkdownTable(post.title);
    output += `| ${slug} | ${title} | ${post.filePath} |\n`;
  }
  
  // Glossary terms
  output += `\n## Glossary Terms\n\n`;
  output += `Total glossary terms: ${terms.length}\n\n`;
  output += `| Slug | Display Name | File |\n`;
  output += `|------|--------------|------|\n`;
  
  for (const term of terms) {
    const slug = `/glossary/${term.slug}`;
    const title = escapeForMarkdownTable(term.title);
    output += `| ${slug} | ${title} | ${term.filePath} |\n`;
  }
  
  // Static pages
  output += `\n## Static Pages\n\n`;
  output += `| Route | Description |\n`;
  output += `|-------|-------------|\n`;
  output += `| / | Home page |\n`;
  output += `| /about | About Soranauts |\n`;
  output += `| /explore | Topic explorer and visual navigation |\n`;
  output += `| /learn | Learning paths overview |\n`;
  output += `| /glossary | Glossary index |\n`;
  output += `| /changelog | Site changelog |\n`;
  output += `| /features | Platform features |\n`;
  output += `| /donate | Support the project |\n`;
  output += `| /privacy | Privacy policy |\n`;
  output += `| /terms | Terms of service |\n`;
  output += `| /tools/quote | Quote generator tool |\n`;
  
  // Tag pages
  output += `\n## Dynamic Routes\n\n`;
  output += `| Pattern | Description |\n`;
  output += `|---------|-------------|\n`;
  output += `| /[...blog] | Blog listing and pagination |\n`;
  output += `| /[...blog]/[category] | Category-filtered blog posts |\n`;
  output += `| /[...blog]/[tag] | Tag-filtered blog posts |\n`;
  output += `| /tag/[slug] | Individual tag pages |\n`;
  output += `| /learn/[pathId] | Individual learning path pages |\n`;
  output += `| /glossary/[slug] | Individual glossary term pages |\n`;
  
  output += `\n## Notes\n\n`;
  output += `- All blog post slugs should be prefixed with \`/\` when linking\n`;
  output += `- Glossary terms should be linked as \`/glossary/[term-slug]\`\n`;
  output += `- Custom slugs override filename-based slugs (only 2 posts currently use this)\n`;
  output += `- Always verify slug exists before linking to avoid 404s\n`;
  
  return output;
}

function generateContentSummary(posts: BlogPost[]): string {
  const now = new Date().toISOString().split('T')[0];
  
  let output = `# Soranauts Content Summary\n`;
  output += `Generated: ${now}\n`;
  output += `Total Articles: ${posts.length}\n\n`;
  output += `This file provides metadata for all blog content on Soranauts.\n\n`;
  
  output += `## Articles\n\n`;
  
  for (const post of posts) {
    const links = extractLinks(post.content);
    const wordCount = countWords(post.content);
    
    output += `### ${post.slug}\n\n`;
    output += `- **Title:** ${post.title}\n`;
    
    if (post.publishDate) {
      const pubDate = new Date(post.publishDate).toISOString().split('T')[0];
      output += `- **Published:** ${pubDate}\n`;
    }
    
    if (post.updateDate) {
      const updDate = new Date(post.updateDate).toISOString().split('T')[0];
      output += `- **Updated:** ${updDate}\n`;
    }
    
    if (post.category) {
      output += `- **Category:** ${post.category}\n`;
    }
    
    output += `- **Word Count:** ~${wordCount.toLocaleString()}\n`;
    
    if (post.tags.length > 0) {
      output += `- **Tags:** ${post.tags.join(', ')}\n`;
    }
    
    if (links.internal.length > 0) {
      output += `- **Internal Links:** ${links.internal.join(', ')}\n`;
    }
    
    if (links.external.length > 0) {
      output += `- **External Domains:** ${links.external.join(', ')}\n`;
    }
    
    output += `- **File:** ${post.filePath}\n`;
    output += `\n`;
  }
  
  return output;
}

function generateTagMatrix(posts: BlogPost[], terms: GlossaryTerm[]): string {
  const now = new Date().toISOString().split('T')[0];
  const tagCounts = new Map<string, { count: number; type: Set<string> }>();
  
  // Count tags from blog posts
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagCounts.has(tag)) {
        tagCounts.set(tag, { count: 0, type: new Set() });
      }
      const entry = tagCounts.get(tag)!;
      entry.count++;
      entry.type.add('blog');
    }
  }
  
  // Count tags from glossary
  for (const term of terms) {
    for (const tag of term.tags) {
      if (!tagCounts.has(tag)) {
        tagCounts.set(tag, { count: 0, type: new Set() });
      }
      const entry = tagCounts.get(tag)!;
      entry.count++;
      entry.type.add('glossary');
    }
  }
  
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1].count - a[1].count);
  
  let output = `# Soranauts Tag Matrix\n`;
  output += `Generated: ${now}\n\n`;
  output += `Total unique tags: ${sortedTags.length}\n`;
  output += `Total blog posts: ${posts.length}\n`;
  output += `Total glossary terms: ${terms.length}\n\n`;
  
  output += `## Tag Inventory\n\n`;
  output += `| Tag | Count | Used In |\n`;
  output += `|-----|-------|----------|\n`;
  
  for (const [tag, data] of sortedTags) {
    const usedIn = Array.from(data.type).sort().join(', ');
    output += `| ${tag} | ${data.count} | ${usedIn} |\n`;
  }
  
  output += `\n## High-Value Tags (10+ uses)\n\n`;
  const highValueTags = sortedTags.filter(([_, data]) => data.count >= 10);
  output += `Total: ${highValueTags.length}\n\n`;
  
  for (const [tag, data] of highValueTags) {
    output += `- **${tag}**: ${data.count} uses\n`;
  }
  
  output += `\n## Tag Guidelines\n\n`;
  output += `- Use lowercase for consistency\n`;
  output += `- Prefer established tags over creating new ones\n`;
  output += `- Core SORA tags: sora, xor, val, pswap, polkaswap, kensetsu\n`;
  output += `- Technology tags: blockchain, defi, dex, tokenomics, governance\n`;
  output += `- Network tags: polkadot, kusama, substrate\n`;
  
  return output;
}

function generateGlossaryTerms(terms: GlossaryTerm[]): string {
  const now = new Date().toISOString().split('T')[0];
  
  let output = `# Soranauts Glossary Terms\n`;
  output += `Generated: ${now}\n`;
  output += `Total Terms: ${terms.length}\n\n`;
  
  output += `## All Glossary Terms\n\n`;
  output += `| Slug | Title | Category | Summary |\n`;
  output += `|------|-------|----------|----------|\n`;
  
  for (const term of terms) {
    const slug = term.slug;
    const title = escapeForMarkdownTable(term.title);
    const category = term.category || 'N/A';
    const summary = term.summary ? escapeForMarkdownTable(term.summary.substring(0, 80)) + '...' : 'N/A';
    
    output += `| ${slug} | ${title} | ${category} | ${summary} |\n`;
  }
  
  // Group by category
  const byCategory = new Map<string, GlossaryTerm[]>();
  for (const term of terms) {
    const cat = term.category || 'uncategorized';
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
    }
    byCategory.get(cat)!.push(term);
  }
  
  output += `\n## Terms by Category\n\n`;
  
  for (const [category, catTerms] of Array.from(byCategory.entries()).sort()) {
    output += `### ${category} (${catTerms.length} terms)\n\n`;
    
    for (const term of catTerms) {
      output += `- **${term.title}** (\`/glossary/${term.slug}\`)`;
      if (term.summary) {
        output += `: ${term.summary.substring(0, 100)}...`;
      }
      output += `\n`;
    }
    
    output += `\n`;
  }
  
  return output;
}

function generateSiteStructure(posts: BlogPost[], terms: GlossaryTerm[]): string {
  const now = new Date().toISOString().split('T')[0];
  
  let output = `# Soranauts Site Structure\n`;
  output += `Generated: ${now}\n\n`;
  
  output += `## Overview\n\n`;
  output += `Soranauts is an Astro-based educational platform for the SORA ecosystem.\n\n`;
  
  output += `## Main Navigation\n\n`;
  output += `- **Home** (\`/\`): Landing page with featured content and recent articles\n`;
  output += `- **Learn** (\`/learn\`): Curated learning paths for beginners and advanced users\n`;
  output += `- **Explore** (\`/explore\`): Visual topic explorer for discovering content\n`;
  output += `- **Glossary** (\`/glossary\`): Comprehensive glossary of terms (${terms.length} terms)\n`;
  output += `- **Blog** (\`/[...blog]\`): All articles (${posts.length} posts)\n`;
  output += `- **About** (\`/about\`): About Soranauts and mission\n\n`;
  
  output += `## Content Types\n\n`;
  
  output += `### 1. Blog Articles\n`;
  output += `- **Location**: \`apps/web/src/content/post/\`\n`;
  output += `- **Format**: MDX files with frontmatter\n`;
  output += `- **Count**: ${posts.length} articles\n`;
  output += `- **URL Pattern**: \`/[slug]\` (e.g., \`/sora-ecosystem-explained\`)\n`;
  output += `- **Features**: Tags, categories, publish/update dates, related content\n\n`;
  
  output += `### 2. Glossary Terms\n`;
  output += `- **Location**: \`apps/web/src/content/glossary/\` + \`apps/web/src/data/taxonomy.ts\`\n`;
  output += `- **Format**: MDX files + TypeScript data\n`;
  output += `- **Count**: ${terms.length} terms\n`;
  output += `- **URL Pattern**: \`/glossary/[slug]\` (e.g., \`/glossary/xor\`)\n`;
  output += `- **Features**: Categories, related terms, definitions, examples\n\n`;
  
  output += `### 3. Static Pages\n`;
  output += `- **Location**: \`apps/web/src/pages/\`\n`;
  output += `- **Format**: Astro components\n`;
  output += `- **Examples**: About, Features, Donate, Tools\n\n`;
  
  output += `### 4. Learning Paths\n`;
  output += `- **Location**: \`apps/web/src/pages/learn/\`\n`;
  output += `- **Format**: Dynamic Astro routes\n`;
  output += `- **Purpose**: Guided educational journeys\n\n`;
  
  output += `## Architecture\n\n`;
  
  output += `### Three-Layer Glossary System\n`;
  output += `1. **MDX files** (\`apps/web/src/content/glossary/*.mdx\`) - Individual pages\n`;
  output += `2. **Taxonomy** (\`apps/web/src/data/taxonomy.ts\`) - Master data (137 core terms)\n`;
  output += `3. **JSON files** (\`apps/web/public/data/*.json\`) - Build outputs (368 terms total)\n\n`;
  
  output += `### Technology Stack\n`;
  output += `- **Framework**: Astro 5.x\n`;
  output += `- **UI Components**: React + Astro components\n`;
  output += `- **Styling**: Tailwind CSS + design tokens\n`;
  output += `- **Content**: MDX (Markdown + JSX)\n`;
  output += `- **Build Tool**: pnpm + Turbo\n`;
  output += `- **Deployment**: Vercel\n\n`;
  
  output += `## Content Categories\n\n`;
  
  const categories = new Map<string, number>();
  for (const post of posts) {
    if (post.category) {
      categories.set(post.category, (categories.get(post.category) || 0) + 1);
    }
  }
  
  output += `Blog post categories:\n`;
  for (const [cat, count] of Array.from(categories.entries()).sort((a, b) => b[1] - a[1])) {
    output += `- **${cat}**: ${count} articles\n`;
  }
  
  output += `\n## Design System\n\n`;
  output += `- **Design Tokens**: Defined in \`DESIGN-TOKENS.md\`\n`;
  output += `- **CSS Guardrails**: Defined in \`CSS_GUARDRAILS.md\`\n`;
  output += `- **Component Library**: Reusable Astro/React components\n`;
  output += `- **Typography**: System font stack with fallbacks\n`;
  output += `- **Color Scheme**: CSS variables with light/dark mode support\n\n`;
  
  output += `## Linking Conventions\n\n`;
  output += `- Blog articles: \`/[slug]\` (no prefix)\n`;
  output += `- Glossary terms: \`/glossary/[slug]\`\n`;
  output += `- Tags: \`/tag/[slug]\`\n`;
  output += `- Categories: \`/[...blog]/[category]\`\n`;
  output += `- Learning paths: \`/learn/[pathId]\`\n\n`;
  
  output += `## Feature Flags\n\n`;
  output += `Some features may be gated behind feature flags. Check \`docs/glossary/FEATURE_FLAGS.md\` for details.\n\n`;
  
  output += `## Related Documentation\n\n`;
  output += `- **Architecture**: See \`ARCHITECTURE.md\`\n`;
  output += `- **Glossary System**: See \`docs/glossary-architecture-explained.md\`\n`;
  output += `- **CSS System**: See \`CSS_GUARDRAILS.md\` and \`css-documentation/\`\n`;
  output += `- **Master Guardrails**: See \`MASTER_GUARDRAILS.md\` (AI assistant rules)\n`;
  
  return output;
}

// Main execution
console.log('🔍 Gathering blog posts...');
const posts = getAllBlogPosts();
console.log(`✅ Found ${posts.length} blog posts`);

console.log('🔍 Gathering glossary terms...');
const terms = getAllGlossaryTerms();
console.log(`✅ Found ${terms.length} glossary terms`);

console.log('\n📝 Generating reference files...\n');

// Generate each reference file
const files = [
  { name: 'LINK_INVENTORY.md', generator: () => generateLinkInventory(posts, terms) },
  { name: 'CONTENT_SUMMARY.md', generator: () => generateContentSummary(posts) },
  { name: 'TAG_MATRIX.md', generator: () => generateTagMatrix(posts, terms) },
  { name: 'GLOSSARY_TERMS.md', generator: () => generateGlossaryTerms(terms) },
  { name: 'SITE_STRUCTURE.md', generator: () => generateSiteStructure(posts, terms) },
];

for (const file of files) {
  console.log(`  Generating ${file.name}...`);
  const content = file.generator();
  const outputPath = path.join(OUTPUT_DIR, file.name);
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`  ✅ ${file.name} created`);
}

console.log(`\n✨ All reference files generated successfully!`);
console.log(`📁 Output directory: ${OUTPUT_DIR}`);
console.log(`\n📊 Summary:`);
console.log(`   - ${posts.length} blog posts`);
console.log(`   - ${terms.length} glossary terms`);
console.log(`   - 5 reference files created`);

