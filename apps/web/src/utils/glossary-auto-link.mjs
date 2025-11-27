import { visit } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import { getAllTerms, getAliasEntries } from '../lib/glossary/glossary-loader.ts';

const SKIP_TYPES = new Set(['link', 'inlineCode', 'code', 'image', 'imageReference']);
const TABLE_TYPES = new Set(['table', 'tableRow', 'tableCell', 'thead', 'tbody', 'tr', 'th', 'td']);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasNoGlossaryAttribute(node) {
  if (!node || typeof node !== 'object') return false;
  const attributes = node.attributes;
  if (!Array.isArray(attributes)) return false;
  return attributes.some((attr) => attr?.name === 'data-no-glossary');
}

function toPlainText(value = '') {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSkippable(ancestors) {
  if (!Array.isArray(ancestors)) return false;
  
  for (const a of ancestors) {
    if (a.type === 'mdxJsxFlowElement') {
      const elementName = typeof a.name === 'string' ? a.name.toLowerCase() : '';
      if (
        elementName === 'faqsection' ||
        elementName === 'details' ||
        elementName === 'summary' ||
        elementName === 'pre' ||
        elementName === 'code'
      ) {
        return true;
      }
      if (hasNoGlossaryAttribute(a)) {
        return true;
      }
    }
    if (a.type === 'heading') {
      return true;
    }
    if (a.type === 'mdxJsxTextElement') {
      const elementName = typeof a.name === 'string' ? a.name.toLowerCase() : '';
      if (elementName === 'summary' || elementName === 'details') {
        return true;
      }
      if (hasNoGlossaryAttribute(a)) {
        return true;
      }
    }
    // Skip inside tables
    if (TABLE_TYPES.has(a.type)) {
      return true;
    }
    // Skip inside links/code/images
    if (a.type === 'link' || a.type === 'linkReference' || 
        a.type === 'inlineCode' || a.type === 'code' || 
        a.type === 'image' || a.type === 'imageReference') {
      return true;
    }
  }
  return false;
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

export function createGlossaryAutoLinkPlugin(glossaryTerms) {
  const terms = Array.isArray(glossaryTerms) ? glossaryTerms : [];
  if (!terms.length) {
    console.warn('No glossary data provided to auto-link plugin');
    return () => {};
  }

  const termMap = new Map();
  const termPriorities = new Map();
  const termCategories = new Map();
  const termFoundational = new Set();
  const termMetadata = new Map();

  terms.forEach((term) => {
    const slug = term.slug;
    termMetadata.set(slug, {
      title: term.term,
      definition: toPlainText(term.summary || term.definition || ''),
      category: term.category || '',
    });

    const baseKeys = [term.term, slug];
    baseKeys.forEach((key) => {
      if (!key) return;
      const keyLower = key.toLowerCase();
      termMap.set(keyLower, slug);
      termPriorities.set(keyLower, term.priority || 0);
      termCategories.set(keyLower, term.category);
    });

    if (term.foundational) {
      termFoundational.add(slug);
    }

    (term.aliases ?? [])
      .sort((a, b) => b.length - a.length)
      .forEach((alias) => {
        const aliasLower = alias.toLowerCase();
        if (
          !termPriorities.has(aliasLower) ||
          (term.priority || 0) >= (termPriorities.get(aliasLower) || 0)
        ) {
          termMap.set(aliasLower, slug);
          termPriorities.set(aliasLower, term.priority || 0);
          termCategories.set(aliasLower, term.category);
        }
      });
  });

  getAliasEntries().forEach((entry) => {
    const aliasLower = entry.alias.toLowerCase();
    if (!aliasLower) return;
    if (!termMap.has(aliasLower)) {
      termMap.set(aliasLower, entry.canonicalSlug);
      termPriorities.set(aliasLower, 0);
    }
  });

  return function () {
    return (tree, file) => {
      // Check frontmatter flag
      if (file?.data?.frontmatter?.disableGlossaryAutoLink) {
        return;
      }

      // Fallback: YAML parsing
      if (tree.children?.[0]?.type === 'yaml') {
        const frontmatter = tree.children[0].value || '';
        if (/disableGlossaryAutoLink:\s*true/.test(frontmatter)) {
          return;
        }
      }

      // Track manually linked terms to avoid double-linking
      const manuallyLinkedTerms = new Set();

      // First pass: scan for manually linked glossary terms
      visit(tree, 'link', (node) => {
        if (!node?.url || typeof node.url !== 'string') return;
        if (!node.url.startsWith('/glossary/')) return;
        const rawSlug = node.url.replace('/glossary/', '').split('#')[0];
        const normalized = typeof rawSlug === 'string' ? rawSlug.trim().toLowerCase() : '';
        if (!normalized) return;
        const canonicalSlug = termMap.get(normalized) ?? normalized;
        manuallyLinkedTerms.add(canonicalSlug);
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
      const candidateTextNodes = []; // { textNode, ancestors, paragraphIndex }

      // Count paragraphs first for distribution logic
      let paragraphCounter = -1;
      visit(tree, 'paragraph', () => { paragraphCounter += 1; });

      // Collect text nodes with ancestor context using visitParents
      let currentParagraphIndex = -1;
      
      // First, collect text nodes from paragraphs
      visitParents(tree, (node) => node.type === 'paragraph', (node, ancestors) => {
        currentParagraphIndex += 1;
        visitParents(node, (n) => n.type === 'text', (textNode, textAncestors) => {
          candidateTextNodes.push({
            textNode,
            ancestors: textAncestors,
            paragraphIndex: currentParagraphIndex
          });
        });
      });
      
      // Also collect text nodes that are direct children of details elements (for FAQs)
      visitParents(tree, (node) => node.type === 'mdxJsxFlowElement' && node.name === 'details', (node, ancestors) => {
        visitParents(node, (n) => n.type === 'text', (textNode, textAncestors) => {
          candidateTextNodes.push({
            textNode,
            ancestors: textAncestors,
            paragraphIndex: -1 // Mark as non-paragraph content
          });
        });
      });

      // Process each text node candidate
      for (const entry of candidateTextNodes) {
        const { textNode, ancestors, paragraphIndex } = entry;
        
        // Skip if inside FAQs, tables, or other unwanted contexts
        if (isSkippable(ancestors)) continue;
        
        const text = textNode.value;
        if (!text) continue;

        // Find matches in this text node
        for (const pattern of patterns) {
          // Reset regex lastIndex to avoid issues with global regex
          pattern.re.lastIndex = 0;
          
          // iterate all matches
          let m;
          while ((m = pattern.re.exec(text)) !== null) {
            const slug = pattern.slug;
            if (!termOccurrences.has(slug)) {
              termOccurrences.set(slug, []);
            }
            
            const occurrences = termOccurrences.get(slug);
            if (occurrences) {
              occurrences.push({
                paragraphIndex,
                textNode,
                ancestors,
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
        }
      }

      console.log('📊 Found', termOccurrences.size, 'unique terms across', paragraphCounter + 1, 'paragraphs');

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
          const totalParagraphs = paragraphCounter + 1;
          const earlyParagraphThreshold = Math.ceil(totalParagraphs / 3);
          if (occ.paragraphIndex < earlyParagraphThreshold) {
            score += 10;
          }
          
          // Boost medium paragraphs (middle 1/3)
          const middleStart = Math.ceil(totalParagraphs / 3);
          const middleEnd = Math.ceil(totalParagraphs * 2 / 3);
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
      }

      // Enforce MAX_LINKS_PER_ARTICLE limit by sorting all occurrences by score
      // and taking only the top N highest-scoring terms
      if (selectedOccurrences.size > MAX_LINKS_PER_ARTICLE) {
        const sortedByScore = Array.from(selectedOccurrences.entries())
          .map(([slug, occ]) => ({ slug, ...occ }))
          .sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            return a.paragraphIndex - b.paragraphIndex;
          })
          .slice(0, MAX_LINKS_PER_ARTICLE);
        
        selectedOccurrences.clear();
        for (const item of sortedByScore) {
          const { slug, ...occ } = item;
          selectedOccurrences.set(slug, occ);
        }
        
        console.log(`📊 Limited glossary links to ${MAX_LINKS_PER_ARTICLE} highest-priority terms (${termOccurrences.size} total found)`);
      }

      // Fourth pass: apply the links directly to text nodes
      for (const [slug, occurrence] of selectedOccurrences.entries()) {
        const { textNode, startIndex, endIndex, matchText, category, priority, isFoundational, ancestors } =
          occurrence;
        
        // Skip if manually linked
        if (manuallyLinkedTerms.has(slug)) continue;

        const parentNode = Array.isArray(ancestors) && ancestors.length > 0 ? ancestors[ancestors.length - 1] : null;
        if (parentNode?.type === 'link') {
          const existingClass = parentNode.data?.hProperties?.class || '';
          if (typeof existingClass === 'string') {
            const classList = existingClass.split(' ');
            if (classList.includes('glossary') || classList.includes('glossary-term')) {
              continue;
            }
          }
        }
        if (parentNode?.children?.some((child) => child?.data?.hProperties?.['data-canonical-slug'] === slug)) {
          continue;
        }

        const original = textNode.value;
        const newChildren = [];

        // Add text before the match
        if (startIndex > 0) {
          newChildren.push({ type: 'text', value: original.slice(0, startIndex) });
        }

        // Add the link
        const url = getLinkDestination(slug, category, priority, isFoundational);
        const meta = termMetadata.get(slug) || { title: matchText, definition: '', category: category || '' };
        
        // Determine link type for visual indicators
        const isFullPageLink = (isFoundational && priority >= 30) || priority >= HIGH_PRIORITY_THRESHOLD;
        const linkType = isFullPageLink ? 'full-page' : url.includes('#') ? 'anchor' : 'tooltip';

        const linkNode = {
          type: 'link',
          url,
          data: {
            hProperties: {},
          },
          children: [{ type: 'text', value: matchText }],
        };

        // Always use V2 mode attributes (legacy mode removed)
        linkNode.data.hProperties = {
          class: 'glossary',
          'data-cat': meta.category || '',
          'data-title': meta.title || matchText,
          'data-def': toPlainText(meta.definition).slice(0, 240),
          'data-link-type': linkType,
          'data-slug': slug,
          'data-canonical-slug': slug,
          'aria-label': `Glossary term: ${meta.title || matchText}. Click for definition.`,
        };

        newChildren.push(linkNode);

        // Add text after the match
        if (endIndex < original.length) {
          newChildren.push({ type: 'text', value: original.slice(endIndex) });
        }

        // Find the parent of this text node and replace it
        for (const entry of candidateTextNodes) {
          if (entry.textNode === textNode) {
            const parent = entry.ancestors[entry.ancestors.length - 1];
            if (parent && parent.children) {
              const textIndex = parent.children.indexOf(textNode);
              if (textIndex !== -1) {
                parent.children.splice(textIndex, 1, ...newChildren);
              }
            }
            break;
          }
        }
      }

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
    const glossaryTerms = getAllTerms();
    console.log('🔗 Glossary data loaded:', glossaryTerms.length, 'terms');
    const plugin = createGlossaryAutoLinkPlugin(glossaryTerms);
    console.log('🔗 Auto-link plugin initialized');
    return plugin;
  } catch (error) {
    console.warn('Failed to load glossary data for auto-linking:', error);
    return () => {};
  }
}