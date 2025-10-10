import { visit } from 'unist-util-visit';
import { generateGlossarySlug } from './slugify.ts';

// Configuration constants
const MAX_LINKS_PER_ARTICLE = 15;  // Total unique terms to link per article
const MAX_LINKS_PER_PARAGRAPH = 2; // Max links in any single paragraph
const HIGH_PRIORITY_THRESHOLD = 90;
const MEDIUM_PRIORITY_THRESHOLD = 50;

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

  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);

  return function () {
    return (tree) => {
      console.log('🔗 Auto-link plugin processing tree...');
      
      // First pass: scan for manually linked glossary terms
      const manuallyLinkedTerms = new Set();
      visit(tree, 'link', (node) => {
        if (node.url && node.url.includes('/glossary')) {
          // Extract slug from URL
          const match = node.url.match(/\/glossary\/([^#?]+)|#glossary-([^?]+)|#([^?]+)/);
          if (match) {
            const slug = match[1] || match[2] || match[3];
            manuallyLinkedTerms.add(slug);
          }
        }
      });

      // Second pass: collect all paragraphs and ALL term occurrences
      const paragraphs = [];
      const termOccurrences = new Map(); // slug -> [ALL occurrences]
      
      visit(tree, 'paragraph', (node, nodeIndex, parent) => {
        // Skip if parent is a table cell
        if (parent && (parent.type === 'tableCell' || parent.type === 'table')) {
          return;
        }

        // Skip if paragraph contains code or existing links
        const hasCodeOrLinks = node.children && node.children.some(child => 
          child.type === 'code' || 
          child.type === 'inlineCode' ||
          child.type === 'link'
        );

        if (hasCodeOrLinks || !node.children) {
          return;
        }

        const paragraphIndex = paragraphs.length;
        paragraphs.push({ node, nodeIndex, parent });

        // Find ALL term occurrences in this paragraph
        node.children.forEach((child, textNodeIndex) => {
          if (child.type === 'text') {
            const text = child.value;
            const seenInThisParagraph = new Set(); // Track terms already found in THIS paragraph

            for (const term of sortedTerms) {
              const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
              const matches = [...text.matchAll(regex)];

              if (matches.length > 0) {
                const termLower = term.toLowerCase();
                if (termMap.has(termLower)) {
                  const slug = termMap.get(termLower);
                  
                  // Skip if manually linked or already seen in this paragraph
                  if (manuallyLinkedTerms.has(slug) || seenInThisParagraph.has(slug)) {
                    continue;
                  }

                  seenInThisParagraph.add(slug);
                  const category = termCategories.get(termLower);
                  const priority = termPriorities.get(termLower) || 0;

                  // Use first match in this text node
                  const match = matches[0];

                  // Store this occurrence
                  if (!termOccurrences.has(slug)) {
                    termOccurrences.set(slug, []);
                  }

                  termOccurrences.get(slug).push({
                    paragraphIndex,
                    textNodeIndex,
                    startIndex: match.index,
                    endIndex: match.index + match[0].length,
                    text: match[0],
                    slug,
                    category,
                    priority,
                    isFoundational: termFoundational.has(slug)
                  });
                }
              }
            }
          }
        });
      });

      if (paragraphs.length === 0) {
        return tree; // No paragraphs to process
      }

      // Third pass: select top terms and choose best occurrence for even distribution
      const uniqueTerms = Array.from(termOccurrences.keys());
      
      // Score each unique term (use first occurrence for scoring)
      const scoredTerms = uniqueTerms.map(slug => {
        const occurrences = termOccurrences.get(slug);
        const firstOccurrence = occurrences[0];
        const score = calculateTermScore(firstOccurrence, termFoundational);
        
        return {
          slug,
          occurrences,
          score,
          priority: firstOccurrence.priority
        };
      });

      // Sort by score and select top MAX_LINKS_PER_ARTICLE terms
      scoredTerms.sort((a, b) => b.score - a.score);
      const selectedTerms = scoredTerms.slice(0, MAX_LINKS_PER_ARTICLE);

      // Calculate ideal spacing for even distribution
      const totalParagraphs = paragraphs.length;
      const numLinks = selectedTerms.length;
      const idealSpacing = totalParagraphs / (numLinks + 1); // +1 to avoid edges

      // For each selected term, choose the occurrence closest to its ideal position
      const linksToAdd = new Map(); // paragraphIndex -> [links to add]
      const paragraphLinkCounts = new Map(); // paragraphIndex -> count
      const usedParagraphs = new Set(); // Track which paragraphs already have links

      selectedTerms.forEach((term, index) => {
        // Calculate ideal paragraph position for this term
        const idealPosition = Math.floor((index + 1) * idealSpacing);
        
        // Find the occurrence closest to the ideal position
        let bestOccurrence = null;
        let bestDistance = Infinity;

        for (const occurrence of term.occurrences) {
          const pIndex = occurrence.paragraphIndex;
          
          // Check paragraph link limit
          const currentCount = paragraphLinkCounts.get(pIndex) || 0;
          if (currentCount >= MAX_LINKS_PER_PARAGRAPH) {
            continue; // Skip if paragraph already has max links
          }

          // Calculate distance from ideal position
          const distance = Math.abs(pIndex - idealPosition);
          
          // Prefer occurrences that are closer to ideal AND in unused paragraphs
          const penalty = usedParagraphs.has(pIndex) ? 100 : 0;
          const adjustedDistance = distance + penalty;

          if (adjustedDistance < bestDistance) {
            bestDistance = adjustedDistance;
            bestOccurrence = occurrence;
          }
        }

        if (bestOccurrence) {
          const pIndex = bestOccurrence.paragraphIndex;
          
          // Add this link
          if (!linksToAdd.has(pIndex)) {
            linksToAdd.set(pIndex, []);
          }
          linksToAdd.get(pIndex).push(bestOccurrence);
          
          const currentCount = paragraphLinkCounts.get(pIndex) || 0;
          paragraphLinkCounts.set(pIndex, currentCount + 1);
          usedParagraphs.add(pIndex);
        }
      });

      // Fourth pass: apply the links
      linksToAdd.forEach((links, paragraphIndex) => {
        const { node } = paragraphs[paragraphIndex];
        
        // Group links by text node
        const linksByTextNode = new Map();
        links.forEach(link => {
          if (!linksByTextNode.has(link.textNodeIndex)) {
            linksByTextNode.set(link.textNodeIndex, []);
          }
          linksByTextNode.get(link.textNodeIndex).push(link);
        });

        // Process each text node that has links
        const newChildren = [];
        node.children.forEach((child, textNodeIndex) => {
          if (child.type === 'text' && linksByTextNode.has(textNodeIndex)) {
            const text = child.value;
            const nodeLinks = linksByTextNode.get(textNodeIndex);
            
            // Sort links by position
            nodeLinks.sort((a, b) => a.startIndex - b.startIndex);

            let lastIndex = 0;
            for (const link of nodeLinks) {
              // Add text before the link
              if (link.startIndex > lastIndex) {
                newChildren.push({
                  type: 'text',
                  value: text.substring(lastIndex, link.startIndex)
                });
              }

              // Add the link
              const linkUrl = getLinkDestination(link.slug, link.category, link.priority, link.isFoundational);
              newChildren.push({
                type: 'link',
                url: linkUrl,
                children: [{
                  type: 'text',
                  value: link.text
                }],
                data: {
                  hProperties: {
                    class: `glossary-term glossary-term-${link.category}`,
                    'data-term': link.slug,
                    'data-category': link.category,
                    'aria-describedby': `tip-${link.slug}`
                  }
                }
              });

              lastIndex = link.endIndex;
            }

            // Add remaining text
            if (lastIndex < text.length) {
              newChildren.push({
                type: 'text',
                value: text.substring(lastIndex)
              });
            }
          } else {
            newChildren.push(child);
          }
        });

        node.children = newChildren;
      });
      
      return tree;
    };
  };
}

/**
 * Calculate relevance score for a term match
 */
function calculateTermScore(match, termFoundational) {
  let score = match.priority || 0;
  
  // Boost foundational terms
  if (termFoundational.has(match.slug)) {
    score += 20;
  }
  
  return score;
}

/**
 * Determine link destination based on priority and foundational status
 */
function getLinkDestination(slug, category, priority, isFoundational) {
  // Direct term pages for foundational terms with decent priority OR very high priority
  if (isFoundational && priority >= 50) {
    return `/glossary/${slug}`;  // Direct term page
  }
  if (priority >= HIGH_PRIORITY_THRESHOLD) {
    return `/glossary/${slug}`;  // Direct term page
  }
  
  // Anchor links for medium priority
  if (priority >= 45) {
    return `/glossary#glossary-${slug}`;  // Anchor on main page
  }
  
  // Category links for low priority
  return `/glossary#${category}`;  // Category section
}

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Load glossary data and create the auto-link plugin
 */
export async function loadGlossaryAutoLinkPlugin() {
  try {
    console.log('🔗 Loading glossary auto-link plugin...');
    // Load the glossary data from the JSON file
    const glossaryData = await import('../../public/glossary.json');
    console.log('🔗 Glossary data loaded:', glossaryData.totalCount, 'terms');
    return createGlossaryAutoLinkPlugin(glossaryData);
  } catch (error) {
    console.warn('Failed to load glossary data for auto-linking:', error);
    return () => {}; // Return no-op plugin
  }
}
