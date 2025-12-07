import { visit } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';

import { getAllTerms, getAliasEntries } from '../lib/glossary/glossary-loader.ts';
import { resolveAutoLinkConfig } from '../lib/glossary/autoLinkConfig.ts';
const TABLE_TYPES = new Set(['table', 'tableRow', 'tableCell', 'thead', 'tbody', 'tr', 'th', 'td']);
const URL_REGEX = /https?:\/\/[^\s)]+/gi;
const MAX_LINKS_PER_PARAGRAPH = 2;
// Removed #definition anchor - it skips headers on glossary pages
// See: docs/starlight-migration/ISSUES.md "Deferred Tasks"
const SECTION_ANCHOR = '';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toPlainText = (value = '') =>
  String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeKey = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const hasNoGlossaryAttribute = (node) => {
  if (!node || typeof node !== 'object') return false;
  const attributes = Array.isArray(node.attributes) ? node.attributes : [];
  return attributes.some((attr) => attr?.name === 'data-no-glossary');
};

const isSkippable = (ancestors) => {
  if (!Array.isArray(ancestors)) return false;
  
  for (const ancestor of ancestors) {
    if (!ancestor) continue;
    if (ancestor.type === 'heading') return true;
    if (TABLE_TYPES.has(ancestor.type)) return true;
    if (ancestor.type === 'link' || ancestor.type === 'linkReference') return true;
    if (ancestor.type === 'inlineCode' || ancestor.type === 'code') return true;
    if (ancestor.type === 'image' || ancestor.type === 'imageReference') return true;

    if (ancestor.type === 'mdxJsxFlowElement' || ancestor.type === 'mdxJsxTextElement') {
      const elementName = typeof ancestor.name === 'string' ? ancestor.name.toLowerCase() : '';
      if (elementName === 'summary' || elementName === 'details' || elementName === 'faqsection' || elementName === 'pre') {
        return true;
      }
      if (hasNoGlossaryAttribute(ancestor)) return true;
    }
  }

  return false;
};

const dedupeOverlaps = (ranges) => {
  const result = [];
  let cursor = -1;
  for (const range of ranges) {
    if (range.startIndex >= cursor) {
      result.push(range);
      cursor = range.endIndex;
    }
  }
  return result;
};

const buildUrlRanges = (text) => {
  const ranges = [];
  let match;
  while ((match = URL_REGEX.exec(text)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }
  return ranges;
};

const isWithinRanges = (start, end, ranges) =>
  ranges.some((range) => start >= range.start && end <= range.end);

const getFilePath = (file) => {
  if (!file) return 'unknown';
  return (
    file.path ||
    (Array.isArray(file.history) && file.history.length ? file.history[0] : undefined) ||
    'unknown'
  );
};

const getLinkDestination = (slug) => `/glossary/${slug}${SECTION_ANCHOR}`;

const createEmptyReport = (filePath) => ({
  filePath,
  added: 0,
  skipped: {
    manual: 0,
    noLink: 0,
    perTermLimit: 0,
    perParagraphLimit: 0,
    perPostLimit: 0,
    urlContext: 0,
    codeContext: 0,
  },
  linkedSlugs: new Set(),
});

const resolveCanonicalSlug = (value, lookup) => {
  const key = normalizeKey(value);
  if (!key) return undefined;
  return lookup.get(key) || undefined;
};

export function createGlossaryAutoLinkPlugin(glossaryTerms, options = {}) {
  const {
    mode = 'transform',
    reporter,
  } = options ?? {};

  const terms = Array.isArray(glossaryTerms) ? glossaryTerms : [];
  const canonicalTerms = terms.filter(
    (term) => (term.status ?? 'canonical') === 'canonical',
  );

  if (!canonicalTerms.length) {
    console.warn('[glossary-auto-link] No canonical glossary data provided.');
    return () => () => {};
  }

  const aliasEntries = getAliasEntries();
  const termMetadata = new Map();
  const lookupKeys = new Map(); // normalized term -> { slug, priority, category, isAlias }

  const registerKey = (key, slug, priority = 0, category = '', isAlias = false) => {
    const normalized = normalizeKey(key);
    if (!normalized) return;
    const existing = lookupKeys.get(normalized);
    if (!existing || existing.priority < priority) {
      lookupKeys.set(normalized, { slug, priority, category, isAlias });
    }
  };

  canonicalTerms.forEach((term) => {
    const slug = term.slug;
    termMetadata.set(slug, {
      title: term.term,
      definition: toPlainText(term.summary || term.definition || ''),
      category: term.category || '',
    });
    
    registerKey(term.term, slug, term.priority || 0, term.category || '', false);
    registerKey(slug, slug, term.priority || 0, term.category || '', false);

    (term.aliases ?? [])
      .sort((a, b) => b.length - a.length)
      .forEach((alias) => registerKey(alias, slug, term.priority || 0, term.category || '', true));
  });

  aliasEntries.forEach((entry) => {
    registerKey(entry.alias, entry.canonicalSlug, 0, '', true);
  });

  const patterns = Array.from(lookupKeys.entries()).map(([term, data]) => ({
    term,
    slug: data.slug,
    priority: data.priority || 0,
    category: data.category || '',
    isAliasMatch: data.isAlias,
    re: new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi'),
  }));

  patterns.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return b.term.length - a.term.length;
  });

  const canonicalLookup = new Map(
    Array.from(lookupKeys.entries()).map(([key, value]) => [key, value.slug]),
  );

  return function glossaryAutoLinkPlugin() {
    return (tree, file) => {
      const report = createEmptyReport(getFilePath(file));
      const frontmatter =
        file?.data?.astro?.frontmatter ?? file?.data?.frontmatter ?? null;
      const config = resolveAutoLinkConfig(frontmatter);

      if (config.disabled) {
        if (typeof reporter === 'function') {
          reporter({ ...report, linkedSlugs: [] });
        }
        return;
      }

      const doNotLinkSlugs = new Set(
        config.noLink
          .map((value) => resolveCanonicalSlug(value, canonicalLookup))
          .filter(Boolean),
      );

      const manuallyLinkedTerms = new Set();
      visit(tree, 'link', (node) => {
        if (!node?.url || typeof node.url !== 'string') return;
        if (!node.url.startsWith('/glossary/')) return;
        const slug = node.url.replace('/glossary/', '').split('#')[0];
        const canonicalSlug = resolveCanonicalSlug(slug, canonicalLookup);
        if (canonicalSlug) {
          manuallyLinkedTerms.add(canonicalSlug);
        }
      });

      const paragraphIndices = new Map();
      const suppressedParagraphs = new WeakSet();
      let paragraphCounter = 0;
      visit(tree, 'paragraph', (node) => {
        paragraphIndices.set(node, paragraphCounter++);
        if (
          Array.isArray(node.children) &&
          node.children.some(
            (child) => child?.type === 'inlineCode' || child?.type === 'code',
          )
        ) {
          suppressedParagraphs.add(node);
        }
      });

      const candidateTextNodes = [];
      let nonParagraphCounter = 0;

      visitParents(
        tree,
        (node) => node.type === 'text',
        (textNode, ancestors) => {
          if (!textNode?.value) return;
          const paragraphAncestor = [...ancestors].reverse().find((ancestor) => ancestor.type === 'paragraph');
          const paragraphNumber = paragraphAncestor ? paragraphIndices.get(paragraphAncestor) : -1;
          const paragraphKey = paragraphAncestor
            ? `p-${paragraphNumber}`
            : `np-${nonParagraphCounter++}`;

          candidateTextNodes.push({
            textNode,
            ancestors,
            paragraphNumber,
            paragraphKey,
            parentParagraph: paragraphAncestor ?? null,
          });
        },
      );

      const paragraphLinkCounts = new Map();
      const paragraphTermUsage = new Set();
      const termCounts = new Map();
      let totalLinks = 0;

      const shouldRespectPostLimit =
        Number.isFinite(config.maxLinksPerPost) && config.maxLinksPerPost > 0;

      for (const entry of candidateTextNodes) {
        if (isSkippable(entry.ancestors)) continue;
        if (entry.parentParagraph && suppressedParagraphs.has(entry.parentParagraph)) {
          report.skipped.codeContext += 1;
          continue;
        }
        
        const original = entry.textNode.value;
        if (!original || !original.trim()) continue;
        
        const urlRanges = buildUrlRanges(original);
        const nodeMatches = [];

        for (const pattern of patterns) {
          pattern.re.lastIndex = 0;
          let match;
          while ((match = pattern.re.exec(original)) !== null) {
            const startIndex = match.index;
            const endIndex = match.index + match[0].length;
            nodeMatches.push({
              startIndex,
              endIndex,
              matchText: match[0],
                slug: pattern.slug,
                category: pattern.category,
                priority: pattern.priority,
              isAliasMatch: pattern.isAliasMatch,
            });
          }
        }

        if (!nodeMatches.length) continue;

        nodeMatches.sort((a, b) => a.startIndex - b.startIndex);
        const filteredMatches = dedupeOverlaps(nodeMatches);
        const approvedMatches = [];

        for (const match of filteredMatches) {
          if (isWithinRanges(match.startIndex, match.endIndex, urlRanges)) {
            report.skipped.urlContext += 1;
            continue;
          }

          const slug = match.slug;
          if (manuallyLinkedTerms.has(slug)) {
            report.skipped.manual += 1;
            continue;
          }

          if (doNotLinkSlugs.has(slug)) {
            report.skipped.noLink += 1;
            continue;
          }

          if (shouldRespectPostLimit && totalLinks >= config.maxLinksPerPost) {
            report.skipped.perPostLimit += 1;
            continue;
          }

          const currentTermCount = termCounts.get(slug) ?? 0;
          if (currentTermCount >= config.maxLinksPerTerm) {
            report.skipped.perTermLimit += 1;
            continue;
          }

          const paragraphSlugKey = `${entry.paragraphKey}:${slug}`;
          if (paragraphTermUsage.has(paragraphSlugKey)) {
            report.skipped.perParagraphLimit += 1;
            continue;
          }

          const paragraphCount = paragraphLinkCounts.get(entry.paragraphKey) ?? 0;
          if (paragraphCount >= MAX_LINKS_PER_PARAGRAPH) {
            report.skipped.perParagraphLimit += 1;
              continue;
          }

          approvedMatches.push(match);
          paragraphTermUsage.add(paragraphSlugKey);
          paragraphLinkCounts.set(entry.paragraphKey, paragraphCount + 1);
          termCounts.set(slug, currentTermCount + 1);
          totalLinks += 1;
          report.added += 1;
          report.linkedSlugs.add(slug);
        }

        if (mode !== 'transform' || !approvedMatches.length) {
          continue;
        }

        const newChildren = [];
        let cursor = 0;

        for (const match of approvedMatches) {
          if (match.startIndex > cursor) {
            newChildren.push({
              type: 'text',
              value: original.slice(cursor, match.startIndex),
            });
          }

          const meta =
            termMetadata.get(match.slug) ?? {
              title: match.matchText,
              definition: '',
              category: match.category ?? '',
            };

        const linkNode = {
          type: 'link',
            url: getLinkDestination(match.slug),
          data: {
              hProperties: {
          class: 'glossary',
          'data-cat': meta.category || '',
                'data-title': meta.title || match.matchText,
          'data-def': toPlainText(meta.definition).slice(0, 240),
                'data-link-type': 'anchor',
                'data-slug': match.slug,
                'data-canonical-slug': match.slug,
                'aria-label': `Glossary term: ${meta.title || match.matchText}. Click for definition.`,
              },
            },
            children: [{ type: 'text', value: match.matchText }],
          };

          if (match.isAliasMatch) {
            linkNode.data.hProperties['data-alias-source'] = 'true';
            linkNode.data.hProperties['data-alias-label'] = match.matchText;
          }

        newChildren.push(linkNode);
          cursor = match.endIndex;
        }

        if (cursor < original.length) {
          newChildren.push({
            type: 'text',
            value: original.slice(cursor),
          });
        }

        const parentNode = entry.ancestors.at(-1);
        if (parentNode?.children) {
          const index = parentNode.children.indexOf(entry.textNode);
          if (index !== -1) {
            parentNode.children.splice(index, 1, ...newChildren);
          }
        }
      }

      if (typeof reporter === 'function') {
        reporter({
          ...report,
          linkedSlugs: Array.from(report.linkedSlugs),
        });
      }
    };
  };
}

export async function loadGlossaryAutoLinkPlugin() {
  try {
    const glossaryTerms = getAllTerms();
    return createGlossaryAutoLinkPlugin(glossaryTerms);
  } catch (error) {
    console.warn('Failed to load glossary data for auto-linking:', error);
    return () => () => {};
  }
}
