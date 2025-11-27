import { describe, expect, it } from 'vitest';

import { createGlossaryAutoLinkPlugin } from '../glossary-auto-link.mjs';

const glossaryTerms = [
  {
    term: 'XOR',
    slug: 'xor',
    category: 'token',
    aliases: ['XOR Token'],
    priority: 100,
    summary: 'Primary utility token of the SORA network.',
  },
  {
    term: 'Polkaswap',
    slug: 'polkaswap',
    category: 'defi',
    aliases: ['PSWAP'],
    priority: 90,
    summary: 'Cross-chain liquidity aggregator.',
  },
  {
    term: 'SORA Network',
    slug: 'sora',
    category: 'network',
    aliases: [],
    priority: 80,
    summary: 'Decentralised economic system.',
  },
];

const clone = (tree) => JSON.parse(JSON.stringify(tree));

const runPlugin = (tree, frontmatter = {}) => {
  const plugin = createGlossaryAutoLinkPlugin(glossaryTerms);
  const transformer = plugin();
  transformer(tree, { data: { astro: { frontmatter } } });
  return tree;
};

const extractLinks = (node) => {
  if (!node?.children) return [];
  return node.children.filter((child) => child.type === 'link');
};

describe('glossary auto-link plugin', () => {
  it('skips inline code content', () => {
    const tree = clone({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', value: 'Install ' },
            { type: 'inlineCode', value: 'xor-cli' },
            { type: 'text', value: ' to manage XOR.' },
          ],
        },
      ],
    });

    runPlugin(tree);
    expect(extractLinks(tree.children[0])).toHaveLength(0);
  });

  it('links alias text to canonical slug', () => {
    const tree = clone({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'PSWAP provides liquidity for traders.' }],
        },
      ],
    });

    runPlugin(tree);
    const link = extractLinks(tree.children[0])[0];
    expect(link.url).toBe('/glossary/polkaswap#definition');
    expect(link.children[0].value).toBe('PSWAP');
    expect(link.data.hProperties['data-alias-source']).toBe('true');
    expect(link.data.hProperties['data-canonical-slug']).toBe('polkaswap');
  });

  it('prevents duplicate links per paragraph', () => {
    const tree = clone({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'XOR is powerful. XOR drives the network.' }],
        },
      ],
    });

    runPlugin(tree);
    expect(extractLinks(tree.children[0])).toHaveLength(1);
  });

  it('honors glossaryNoLink frontmatter overrides', () => {
    const tree = clone({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'XOR appears here but should not link.' }],
        },
      ],
    });

    runPlugin(tree, { glossaryNoLink: ['xor'] });
    expect(extractLinks(tree.children[0])).toHaveLength(0);
  });

  it('enforces glossaryMaxLinksPerTerm limit', () => {
    const tree = clone({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'XOR is great. Another XOR mention.' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'A third XOR mention later.' }],
        },
      ],
    });

    runPlugin(tree, { glossaryMaxLinksPerTerm: 1 });
    const totalLinks =
      extractLinks(tree.children[0]).length + extractLinks(tree.children[1]).length;
    expect(totalLinks).toBe(1);
  });

  it('respects glossaryMaxLinksPerPost limit', () => {
    const tree = clone({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'XOR is paired with SORA.' }],
        },
      ],
    });

    runPlugin(tree, { glossaryMaxLinksPerPost: 1 });
    const links = extractLinks(tree.children[0]);
    expect(links).toHaveLength(1);
    expect(links[0].data.hProperties['data-canonical-slug']).toBe('xor');
  });
});
