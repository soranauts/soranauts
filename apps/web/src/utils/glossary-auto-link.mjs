import { visit } from 'unist-util-visit';
import { generateGlossarySlug } from './slugify.ts';

/**
 * Creates a remark plugin that automatically links glossary terms in markdown content
 * @param {Object} glossaryData - The glossary data with terms, aliases, and slugs
 * @returns {Function} - A remark plugin function
 */
export function createGlossaryAutoLinkPlugin(glossaryData) {
  if (!glossaryData || !glossaryData.terms) {
    console.warn('No glossary data provided to auto-link plugin');
    return () => {}; // Return no-op plugin
  }

  console.log('🔗 Auto-link plugin loaded with', glossaryData.terms.length, 'terms');

  // Create a map of all possible terms and aliases to their slugs and categories
  const termMap = new Map();
  const termPriorities = new Map();
  const termCategories = new Map();

  glossaryData.terms.forEach(term => {
    // Ensure we use the unified slugify function for consistency
    const unifiedSlug = generateGlossarySlug(term.term);
    
    // Add the main term
    termMap.set(term.term.toLowerCase(), unifiedSlug);
    termPriorities.set(term.term.toLowerCase(), term.priority);
    termCategories.set(term.term.toLowerCase(), term.category);

    // Add aliases with longest-alias-wins logic
    term.aliases
      .sort((a, b) => b.length - a.length) // Sort by length descending (longest first)
      .forEach(alias => {
        const aliasLower = alias.toLowerCase();
        // Only add if this alias has higher priority or doesn't exist
        if (!termPriorities.has(aliasLower) || termPriorities.get(aliasLower) < term.priority) {
          termMap.set(aliasLower, unifiedSlug);
          termPriorities.set(aliasLower, term.priority);
          termCategories.set(aliasLower, term.category);
        }
      });
  });

  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);

  return function () {
    return (tree) => {
      console.log('🔗 Auto-link plugin processing tree...');
      // Track processed paragraphs to avoid over-linking
      const processedParagraphs = new Set();

      visit(tree, 'paragraph', (node, index, parent) => {
        if (!node.children || processedParagraphs.has(node)) return;

        // Skip if paragraph contains code, links, or headings
        const hasCodeOrLinks = node.children.some(child => 
          child.type === 'code' || 
          child.type === 'inlineCode' ||
          child.type === 'link' ||
          child.type === 'strong' ||
          child.type === 'emphasis'
        );

        if (hasCodeOrLinks) {
          processedParagraphs.add(node);
          return;
        }

        // Process text nodes for auto-linking
        const newChildren = [];
        let hasChanges = false;

        for (const child of node.children) {
          if (child.type === 'text') {
            let text = child.value;
            let lastIndex = 0;

            // Collect all matches first, then process them in order
            const allMatches = [];
            for (const term of sortedTerms) {
              const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
              const matches = [...text.matchAll(regex)];

              for (const match of matches) {
                const termLower = match[0].toLowerCase();
                if (termMap.has(termLower)) {
                  const slug = termMap.get(termLower);
                  const category = termCategories.get(termLower);
                  const startIndex = match.index;
                  const endIndex = startIndex + match[0].length;

                  // Check if this is the first occurrence in this paragraph
                  const beforeText = text.substring(0, startIndex);
                  const termCount = (beforeText.match(new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi')) || []).length;
                  
                  if (termCount === 0) { // First occurrence
                    allMatches.push({
                      startIndex,
                      endIndex,
                      text: match[0],
                      slug,
                      category
                    });
                  }
                }
              }
            }

            // Sort matches by position
            allMatches.sort((a, b) => a.startIndex - b.startIndex);

            // Process matches in order
            for (const match of allMatches) {
              // Add text before the match
              if (match.startIndex > lastIndex) {
                newChildren.push({
                  type: 'text',
                  value: text.substring(lastIndex, match.startIndex)
                });
              }

              // Add the link with category-specific styling
              newChildren.push({
                type: 'link',
                url: `/glossary#glossary-${match.slug}`,
                children: [{
                  type: 'text',
                  value: match.text
                }],
                data: {
                  hProperties: {
                    class: `glossary-term glossary-term-${match.category}`,
                    'data-term': match.slug,
                    'data-category': match.category,
                    'aria-describedby': `tip-${match.slug}`
                  }
                }
              });

              lastIndex = match.endIndex;
              hasChanges = true;
            }

            // Add remaining text
            if (lastIndex < text.length) {
              newChildren.push({
                type: 'text',
                value: text.substring(lastIndex)
              });
            }

            // If no changes were made, keep the original text node
            if (!hasChanges) {
              newChildren.push(child);
            }
          } else {
            newChildren.push(child);
          }
        }

        if (hasChanges) {
          node.children = newChildren;
          processedParagraphs.add(node);
        }
      });
      
      return tree;
    };
  };
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
