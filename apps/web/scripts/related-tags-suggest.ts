#!/usr/bin/env tsx
/**
 * Tag suggestion CLI for blog posts
 * 
 * Suggests tags for posts with 0 tags based on:
 * - Glossary term matches in title/excerpt/content
 * - Nearest neighbors via title keyword similarity
 * - Existing taxonomy tags
 * 
 * Usage:
 *   pnpm web:related:suggest              # Preview suggestions
 *   pnpm web:related:suggest --limit 20   # Limit to 20 posts
 *   pnpm web:related:suggest --confidence 0.5  # Higher confidence threshold
 *   pnpm web:related:suggest --apply       # Write tags back to files
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { getCollection } from 'astro:content';
import { fetchPosts } from '../src/utils/blog';
import { stopWordsArray, stopWords } from '../src/config/related.config';
import { getTagNode } from '../src/lib/taxonomy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GlossaryTerm {
  term: string;
  slug: string;
  aliases: string[];
  tags: string[];
}

interface GlossaryData {
  terms: GlossaryTerm[];
}

interface TagSuggestion {
  tag: string;
  confidence: number;
  source: 'glossary' | 'neighbor' | 'taxonomy';
}

interface PostSuggestion {
  slug: string;
  filePath: string;
  currentTags: string[];
  suggestedTags: TagSuggestion[];
  signalsUsed: string[];
  confidence: number;
}

/**
 * Load glossary data
 */
function loadGlossary(): GlossaryData | null {
  try {
    const glossaryPath = path.join(process.cwd(), 'public', 'glossary.json');
    if (!fs.existsSync(glossaryPath)) {
      return null;
    }
    const raw = fs.readFileSync(glossaryPath, 'utf-8');
    return JSON.parse(raw) as GlossaryData;
  } catch (error) {
    console.error('Failed to load glossary:', error);
    return null;
  }
}

/**
 * Tokenize text (same logic as related.ts)
 */
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 0 && !stopWords.has(token))
  );
}

/**
 * Extract glossary terms from text
 */
function extractGlossaryTerms(text: string, glossary: GlossaryData): Set<string> {
  const terms = new Set<string>();
  const lowerText = text.toLowerCase();

  for (const term of glossary.terms) {
    // Check slug
    if (lowerText.includes(term.slug.toLowerCase())) {
      terms.add(term.slug);
    }
    // Check aliases
    for (const alias of term.aliases || []) {
      if (lowerText.includes(alias.toLowerCase())) {
        terms.add(term.slug);
        break;
      }
    }
    // Check tags
    for (const tag of term.tags || []) {
      if (lowerText.includes(tag.toLowerCase())) {
        terms.add(term.slug);
        break;
      }
    }
  }

  return terms;
}

/**
 * Find nearest neighbors by title keyword similarity
 */
function findNearestNeighbors(
  currentTitle: string,
  allPosts: Array<{ title: string; tags: string[] }>,
  limit: number = 5
): string[] {
  const currentTokens = tokenize(currentTitle);
  const scored = allPosts
    .map((post) => {
      const postTokens = tokenize(post.title);
      const intersection = new Set([...currentTokens].filter((t) => postTokens.has(t)));
      const union = new Set([...currentTokens, ...postTokens]);
      const similarity = union.size > 0 ? intersection.size / union.size : 0;
      return { post, similarity };
    })
    .filter((item) => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  // Collect tags from neighbors
  const neighborTags = new Set<string>();
  for (const { post } of scored) {
    for (const tag of post.tags || []) {
      neighborTags.add(tag);
    }
  }

  return Array.from(neighborTags);
}

/**
 * Suggest tags for a post
 */
async function suggestTags(
  post: { title: string; excerpt?: string; slug: string },
  allPosts: Array<{ title: string; tags: string[] }>,
  glossary: GlossaryData | null,
  confidenceThreshold: number
): Promise<PostSuggestion | null> {
  const text = `${post.title} ${post.excerpt || ''}`.toLowerCase();
  const suggestions: TagSuggestion[] = [];
  const signalsUsed: string[] = [];

  // 1. Glossary term matches
  if (glossary) {
    const glossaryTerms = extractGlossaryTerms(text, glossary);
    for (const termSlug of glossaryTerms) {
      const term = glossary.terms.find((t) => t.slug === termSlug);
      if (term) {
        // Use term slug or first tag as suggestion
        const suggestedTag = term.slug;
        suggestions.push({
          tag: suggestedTag,
          confidence: 0.7, // High confidence for glossary matches
          source: 'glossary',
        });
        signalsUsed.push(`glossary:${termSlug}`);
      }
    }
  }

  // 2. Nearest neighbors
  const neighborTags = findNearestNeighbors(post.title, allPosts);
  for (const tag of neighborTags) {
    // Check if already suggested
    if (!suggestions.some((s) => s.tag === tag)) {
      suggestions.push({
        tag,
        confidence: 0.5, // Medium confidence for neighbors
        source: 'neighbor',
      });
      signalsUsed.push(`neighbor:${tag}`);
    }
  }

  // 3. Taxonomy tags (check if any suggested tags exist in taxonomy)
  for (const suggestion of suggestions) {
    const tagNode = getTagNode(suggestion.tag);
    if (tagNode && tagNode.type === 'tag') {
      suggestion.confidence += 0.1; // Boost confidence if in taxonomy
      if (!signalsUsed.includes(`taxonomy:${suggestion.tag}`)) {
        signalsUsed.push(`taxonomy:${suggestion.tag}`);
      }
    }
  }

  // Filter by confidence threshold and limit to 4 tags max
  const filtered = suggestions
    .filter((s) => s.confidence >= confidenceThreshold)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4);

  if (filtered.length === 0) {
    return null;
  }

  const avgConfidence =
    filtered.reduce((sum, s) => sum + s.confidence, 0) / filtered.length;

  return {
    slug: post.slug,
    filePath: '', // Will be set by caller
    currentTags: [],
    suggestedTags: filtered,
    signalsUsed,
    confidence: avgConfidence,
  };
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1] || '100', 10) : 100;
  const confidenceIndex = args.indexOf('--confidence');
  const confidenceThreshold =
    confidenceIndex >= 0 ? parseFloat(args[confidenceIndex + 1] || '0.3') : 0.3;

  console.log('🔍 Analyzing posts for tag suggestions...\n');

  // Load glossary
  const glossary = loadGlossary();
  if (!glossary) {
    console.warn('⚠️  Glossary not found, skipping glossary-based suggestions');
  }

  // Get all posts
  const allPosts = await fetchPosts();
  const postsWithTags = allPosts.filter((p) => (p.tags || []).length > 0);
  const postsWithoutTags = allPosts.filter((p) => !p.tags || p.tags.length === 0);

  console.log(`📊 Found ${postsWithoutTags.length} posts without tags`);
  console.log(`📊 Found ${postsWithTags.length} posts with tags (used for neighbor matching)\n`);

  // Get content collection entries to find file paths
  const contentEntries = await getCollection('post');
  const entryMap = new Map(contentEntries.map((e) => [e.id, e]));

  // Suggest tags for posts without tags
  const suggestions: PostSuggestion[] = [];

  for (const post of postsWithoutTags.slice(0, limit)) {
    const entry = entryMap.get(post.id);
    if (!entry) continue;

    const suggestion = await suggestTags(
      {
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
      },
      postsWithTags,
      glossary,
      confidenceThreshold
    );

    if (suggestion) {
      const filePath = path.join(process.cwd(), 'src', 'content', 'post', entry.id);
      suggestion.filePath = filePath;
      suggestions.push(suggestion);
    }
  }

  // Display results table
  console.log('─'.repeat(100));
  console.log(
    `SLUG`.padEnd(50) +
      `CURRENT`.padEnd(15) +
      `SUGGESTED`.padEnd(25) +
      `CONFIDENCE`.padEnd(12) +
      `SIGNALS`
  );
  console.log('─'.repeat(100));

  for (const suggestion of suggestions) {
    const currentStr = suggestion.currentTags.length > 0 ? suggestion.currentTags.join(',') : '—';
    const suggestedStr = suggestion.suggestedTags.map((s) => s.tag).join(', ');
    const confidenceStr = suggestion.confidence.toFixed(2);
    const signalsStr = suggestion.signalsUsed.slice(0, 3).join('; ');

    console.log(
      suggestion.slug.padEnd(50) +
        currentStr.padEnd(15) +
        suggestedStr.padEnd(25) +
        confidenceStr.padEnd(12) +
        signalsStr
    );
  }

  console.log('─'.repeat(100));
  console.log(`\n📝 Found ${suggestions.length} posts with suggestions\n`);

  if (!apply) {
    console.log('💡 Run with --apply to write tags back to frontmatter');
    console.log('💡 Example: pnpm web:related:suggest --apply --limit 20\n');
    return;
  }

  // Apply changes
  console.log('✍️  Writing tags to files...\n');

  let written = 0;
  let skipped = 0;

  for (const suggestion of suggestions) {
    if (!fs.existsSync(suggestion.filePath)) {
      console.warn(`⚠️  File not found: ${suggestion.filePath}`);
      skipped++;
      continue;
    }

    try {
      const fileContent = fs.readFileSync(suggestion.filePath, 'utf-8');
      const parsed = matter(fileContent);

      // Get existing tags (if any)
      const existingTags = Array.isArray(parsed.data.tags) ? parsed.data.tags : [];
      const existingSet = new Set(existingTags.map((t: string) => t.toLowerCase()));

      // Add new tags (only if not already present)
      const newTags = suggestion.suggestedTags
        .map((s) => s.tag)
        .filter((tag) => !existingSet.has(tag.toLowerCase()));

      if (newTags.length === 0) {
        skipped++;
        continue;
      }

      // Merge tags (preserve existing, add new)
      const allTags = [...existingTags, ...newTags];

      // Update frontmatter
      parsed.data.tags = allTags;

      // Write back
      const updatedContent = matter.stringify(parsed.content, parsed.data, {
        language: 'yaml',
        delimiters: '---',
      });

      fs.writeFileSync(suggestion.filePath, updatedContent, 'utf-8');
      console.log(`✅ ${suggestion.slug}: Added ${newTags.join(', ')}`);
      written++;
    } catch (error) {
      console.error(`❌ Error processing ${suggestion.slug}:`, error);
      skipped++;
    }
  }

  console.log(`\n✅ Written: ${written}`);
  console.log(`⏭️  Skipped: ${skipped}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

