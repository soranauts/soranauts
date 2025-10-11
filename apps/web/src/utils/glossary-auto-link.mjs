import { visit } from 'unist-util-visit';
import { generateGlossarySlug } from './slugify.ts';

const SKIP_TYPES = new Set(['link', 'inlineCode', 'code', 'image', 'imageReference']);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walkInline(node, fn) {
  if (!node || !node.children) return;
  node.children.forEach((child, idx) => {
    if (child.type === 'text') {
      fn(child, idx, node);
    } else if (!SKIP_TYPES.has(child.type)) {
      // recurse into strong/emphasis/delete/sup/sub, etc.
      walkInline(child, fn);
    }
  });
}

// Filter overlapping ranges assuming items are sorted by startIndex asc
function dedupeOverlaps(ranges) {
  const out = [];
  let cursor = -1;
  for (const r of ranges) {
    if (r.startIndex >= cursor) {
      out.push(r);
      cursor = r.endIndex;
    }
  }
  return out;
}

// Configuration constants
const MAX_LINKS_PER_ARTICLE = 15;  // Total unique terms to link per article
const MAX_LINKS_PER_PARAGRAPH = 2; // Max links in any single paragraph
const HIGH_PRIORITY_THRESHOLD = 90;

/**
 * Creates a remark plugin that automatically links glossary terms in markdown content
 * Each term is linked only ONCE per article, with even distribution throughout
 * @param {Object} glossaryData - The glossary data with terms, aliases, and slugs
 * @returns {Function} - A remark plugin function
 */
export function createGlossaryAutoLinkPlugin(glossaryData) {
  if (!glossaryData || !glossaryData.terms) {
    console.warn('No glossary data provided to auto-link plugin');
    return () => {}; // Return no-op plugin
  }

  console.log('🔗 Auto-link plugin loaded with', glossaryData.terms.length, 'terms');

  // Create a map of all possible terms and aliases to their slugs, categories, priorities, and foundational status
  const termMap = new Map();
  const termPriorities = new Map();
  const termCategories = new Map();
  const termFoundational = new Set();

  glossaryData.terms.forEach(term => {
    // Ensure we use the unified slugify function for consistency
    const unifiedSlug = generateGlossarySlug(term.term);
    
    // Add the main term
    termMap.set(term.term.toLowerCase(), unifiedSlug);
    termPriorities.set(term.term.toLowerCase(), term.priority || 0);
    termCategories.set(term.term.toLowerCase(), term.category);
    
    if (term.foundational) {
      termFoundational.add(unifiedSlug);
    }

    // Add aliases with longest-alias-wins logic
    term.aliases
      .sort((a, b) => b.length - a.length) // Sort by length descending (longest first)
      .forEach(alias => {
        const aliasLower = alias.toLowerCase();
        // Only add if this alias has higher priority or doesn't exist
        if (!termPriorities.has(aliasLower) || termPriorities.get(aliasLower) < (term.priority || 0)) {
          termMap.set(aliasLower, unifiedSlug);
          termPriorities.set(aliasLower, term.priority || 0);
          termCategories.set(aliasLower, term.category);
        }
      });
  });

  console.log('🔗 Plugin created successfully:', typeof createGlossaryAutoLinkPlugin);

  return function () {
    return (tree) => {
      console.log('🔗 Auto-link plugin processing tree...');
      console.log('🔍 Tree type:', tree.type, 'Tree children count:', tree.children?.length);
      console.log('🚀 Plugin function called successfully');

      // Track manually linked terms to avoid double-linking
      const manuallyLinkedTerms = new Set();
      
      // First pass: scan for manually linked glossary terms
      visit(tree, 'link', (node) => {
        if (node.url && node.url.startsWith('/glossary/')) {
          const slug = node.url.replace('/glossary/', '');
          manuallyLinkedTerms.add(slug);
        }
      });

      // Build patterns for efficient matching
      const patterns = [];
      for (const [termLower, slug] of termMap.entries()) {
        const priority = termPriorities.get(termLower) || 0;
        const category = termCategories.get(termLower);
        const isFoundational = termFoundational.has(slug);
        
        patterns.push({
          term: termLower,
          slug,
          category,
          priority,
          isFoundational,
          re: new RegExp(`\\b${escapeRegExp(termLower)}\\b`, 'gi')
        });
      }

      // Sort patterns by priority (highest first) and length (longest first)
      patterns.sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority;
        return b.term.length - a.term.length;
      });

      // Track all term occurrences across the document
      const termOccurrences = new Map();
      const paragraphs = [];

      // Second pass: collect all paragraphs and find term occurrences
      visit(tree, 'paragraph', (node, nodeIndex, parent) => {
        console.log('📄 Found paragraph:', nodeIndex, 'parent:', parent?.type);
        
        // Skip if parent is a table cell
        if (parent && (parent.type === 'tableCell' || parent.type === 'table')) {
          console.log('⏭️ Skipping paragraph in table');
          return;
        }

        // Skip if paragraph contains code or existing links
        const hasCodeOrLinks = node.children && node.children.some(child => 
          child.type === 'code' || 
          child.type === 'inlineCode' ||
          child.type === 'link'
        );

        if (hasCodeOrLinks || !node.children) {
          console.log('⏭️ Skipping paragraph with code/links or no children');
          return;
        }

        paragraphs.push({ node, index: nodeIndex, parent });
        const paragraphIndex = paragraphs.length - 1;

        // Find matches across all nested inline text nodes in this paragraph
        const occurrences = [];

        walkInline(node, (textNode, idx, parentInline) => {
          const text = textNode.value;
          if (!text) return;

          for (const pattern of patterns) {
            // Reset regex lastIndex to avoid issues with global regex
            pattern.re.lastIndex = 0;
            
            // iterate all matches
            let m;
            while ((m = pattern.re.exec(text)) !== null) {
              occurrences.push({
                parentInline,              // the parent that actually holds this text node
                textNode,                  // the matched text node
                textIndex: idx,            // index *within* parentInline.children (will re-find)
                startIndex: m.index,
                endIndex: m.index + m[0].length,
                matchText: m[0],
                slug: pattern.slug,
                category: pattern.category,
                priority: pattern.priority,
                isFoundational: pattern.isFoundational
              });
            }
          }
        });

        // Group by the exact text node (so slicing happens per node)
        const byNode = new Map();
        for (const occ of occurrences) {
          const key = occ.textNode; // object identity
          if (!byNode.has(key)) byNode.set(key, []);
          byNode.get(key).push(occ);
        }

        // For each text node: sort, drop overlaps, slice -> replace with [text, link, text...]
        for (const [textNode, nodeOccs] of byNode.entries()) {
          // Skip if manually linked
          if (manuallyLinkedTerms.has(nodeOccs[0].slug)) continue;

          // Sort by start position, then dedupe overlaps
          nodeOccs.sort((a, b) => a.startIndex - b.startIndex);
          const clean = dedupeOverlaps(nodeOccs);

          if (clean.length === 0) continue;
          
          // Only process the first occurrence of each term in this text node
          const uniqueBySlug = new Map();
          clean.forEach(occ => {
            if (!uniqueBySlug.has(occ.slug)) {
              uniqueBySlug.set(occ.slug, occ);
            }
          });
          const finalOccs = Array.from(uniqueBySlug.values());

          // Store for later processing - only one occurrence per term per text node
          finalOccs.forEach(occ => {
            const slug = occ.slug;
            if (!termOccurrences.has(slug)) {
              termOccurrences.set(slug, []);
            }
            
            const occurrences = termOccurrences.get(slug);
            if (occurrences) {
              occurrences.push({
                paragraphIndex,
                textNode,
                parentInline: occ.parentInline,
                textIndex: occ.textIndex,
                startIndex: occ.startIndex,
                endIndex: occ.endIndex,
                matchText: occ.matchText,
                slug: occ.slug,
                category: occ.category,
                priority: occ.priority,
                isFoundational: occ.isFoundational
              });
            }
          });
        }
      });

      console.log('📊 Found', termOccurrences.size, 'unique terms across', paragraphs.length, 'paragraphs');

      // Third pass: select best occurrences for each term (one per article)
      const selectedOccurrences = new Map();
      
      for (const [slug, occurrences] of termOccurrences.entries()) {
        if (occurrences.length === 0) continue;

        // Score each occurrence based on priority, position, and context
        const scoredOccurrences = occurrences.map((occ, index) => {
          let score = occ.priority || 0;
          
          // Boost foundational terms
          if (occ.isFoundational) {
            score += 20;
          }
          
          // Boost early paragraphs (first 1/3 of article)
          const earlyParagraphThreshold = Math.ceil(paragraphs.length / 3);
          if (occ.paragraphIndex < earlyParagraphThreshold) {
            score += 10;
          }
          
          // Boost medium paragraphs (middle 1/3)
          const middleStart = Math.ceil(paragraphs.length / 3);
          const middleEnd = Math.ceil(paragraphs.length * 2 / 3);
          if (occ.paragraphIndex >= middleStart && occ.paragraphIndex < middleEnd) {
            score += 5;
          }
          
          return { ...occ, score, originalIndex: index };
        });

        // Sort by score (highest first), then by position
        scoredOccurrences.sort((a, b) => {
          if (a.score !== b.score) return b.score - a.score;
          return a.paragraphIndex - b.paragraphIndex;
        });

        // Select the best occurrence
        const bestOccurrence = scoredOccurrences[0];
        selectedOccurrences.set(slug, bestOccurrence);
        
        console.log(`✅ Selected "${bestOccurrence.matchText}" (${slug}) with score ${bestOccurrence.score} in paragraph ${bestOccurrence.paragraphIndex}`);
      }

      console.log('🎯 Selected', selectedOccurrences.size, 'terms for linking');
      
      // Debug: Show what we're about to link
      for (const [slug, occurrence] of selectedOccurrences.entries()) {
        console.log(`🔗 Will link "${occurrence.matchText}" (${slug}) in paragraph ${occurrence.paragraphIndex}`);
      }

      // Fourth pass: apply the links
      const linksByParagraph = new Map();
      
      for (const [slug, occurrence] of selectedOccurrences.entries()) {
        const paragraphIndex = occurrence.paragraphIndex;
        if (!linksByParagraph.has(paragraphIndex)) {
          linksByParagraph.set(paragraphIndex, []);
        }
        const paragraphLinks = linksByParagraph.get(paragraphIndex);
        if (paragraphLinks) {
          paragraphLinks.push(occurrence);
        }
      }

      for (const [paragraphIndex, links] of linksByParagraph.entries()) {
        const { node } = paragraphs[paragraphIndex];
        
        // Group links by text node
        const linksByNode = new Map();
        links.forEach(link => {
          if (!linksByNode.has(link.textNode)) {
            linksByNode.set(link.textNode, []);
          }
          linksByNode.get(link.textNode).push(link);
        });

        // Apply links to each text node
        for (const [textNode, nodeLinks] of linksByNode.entries()) {
          // Re-locate the current index of textNode in its parent
          const parentInline = nodeLinks[0].parentInline;
          const iNow = parentInline.children.indexOf(textNode);
          if (iNow === -1) continue;

          // Sort and dedupe overlaps
          nodeLinks.sort((a, b) => a.startIndex - b.startIndex);
          const clean = dedupeOverlaps(nodeLinks);

          const original = textNode.value;
          let last = 0;
          const newChildren = [];

          for (const occ of clean) {
            if (occ.startIndex > last) {
              newChildren.push({ type: 'text', value: original.slice(last, occ.startIndex) });
            }

            const url = getLinkDestination(occ.slug, occ.category, occ.priority, occ.isFoundational);
            newChildren.push({
              type: 'link',
              url,
              data: {
                hProperties: {
                  class: `glossary-term glossary-term-${occ.category}`,
                  'data-term': occ.slug,
                  'data-category': occ.category,
                  'aria-describedby': `tip-${occ.slug}`
                }
              },
              children: [{ type: 'text', value: occ.matchText }]
            });

            last = occ.endIndex;
          }

          if (last < original.length) {
            newChildren.push({ type: 'text', value: original.slice(last) });
          }

          // Replace the single text node with the new sequence
          parentInline.children.splice(iNow, 1, ...newChildren);
        }
      }

      console.log('🎉 Auto-linking complete!');
    };
  };

  // Helper function to determine link destination based on priority and foundational status
  function getLinkDestination(slug, category, priority, isFoundational) {
    // Direct term pages for foundational terms with decent priority OR very high priority
    if (isFoundational && priority >= 30) {
      return `/glossary/${slug}`;  // Direct term page
    }
    if (priority >= HIGH_PRIORITY_THRESHOLD) { // HIGH_PRIORITY_THRESHOLD is 90
      return `/glossary/${slug}`;  // Direct term page
    }
    
    // Anchor links for medium priority
    if (priority >= 20) {
      return `/glossary#glossary-${slug}`;  // Anchor on main page
    }
    
    // Category links for low priority
    return `/glossary#${category}`;  // Category section
  }
}

/**
 * Loads the glossary auto-link plugin with data from the JSON file
 * @returns {Promise<Function>} - The loaded plugin function
 */
export async function loadGlossaryAutoLinkPlugin() {
  try {
    console.log('🔗 Loading glossary auto-link plugin...');
    // Load the glossary data from the JSON file
    const glossaryData = await import('../../public/glossary.json');
    console.log('🔗 Glossary data loaded:', glossaryData.totalCount, 'terms');
    const plugin = createGlossaryAutoLinkPlugin(glossaryData);
    console.log('🔗 Auto-link plugin loaded with', glossaryData.terms.length, 'terms');
    return plugin;
  } catch (error) {
    console.warn('Failed to load glossary data for auto-linking:', error);
    return () => {}; // Return no-op plugin
  }
}