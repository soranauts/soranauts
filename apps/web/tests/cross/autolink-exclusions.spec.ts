import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createGlossaryAutoLinkPlugin } from '../../src/utils/glossary-auto-link.mjs';

const mockGlossaryTerms = [
  {
    term: 'XOR',
    slug: 'xor',
    category: 'token',
    aliases: ['XOR Token', 'XOR Coin'],
    priority: 100,
    summary: 'Primary utility token of the SORA network.',
  },
  {
    term: 'PolkaSwap',
    slug: 'polkaswap',
    category: 'defi',
    aliases: ['PolkaSwap DEX', 'PSWAP'],
    priority: 80,
    summary: 'Cross-chain liquidity aggregator for SORA.',
  },
  {
    term: 'SORA',
    slug: 'sora',
    category: 'network',
    aliases: ['SORA Network', 'SORA 2.0'],
    priority: 85,
    summary: 'Decentralised economic system built on Substrate.',
  },
];

const cloneTree = (tree) => JSON.parse(JSON.stringify(tree));

const applyPlugin = (tree) => {
  const plugin = createGlossaryAutoLinkPlugin(mockGlossaryTerms);
  const transformer = plugin();
  expect(typeof transformer).toBe('function');
  transformer(tree);
  return tree;
};

let previousEnv;

beforeEach(() => {
  previousEnv = process.env.GLOSSARY_V2;
  process.env.GLOSSARY_V2 = 'false';
});

afterEach(() => {
  if (typeof previousEnv === 'undefined') {
    delete process.env.GLOSSARY_V2;
  } else {
    process.env.GLOSSARY_V2 = previousEnv;
  }
});

describe('cross: autolink legacy exclusions', () => {
  it('creates a plugin function', () => {
    expect(typeof createGlossaryAutoLinkPlugin(mockGlossaryTerms)).toBe('function');
  });

  it('returns a noop for invalid data', () => {
    expect(typeof createGlossaryAutoLinkPlugin(null)).toBe('function');
    expect(typeof createGlossaryAutoLinkPlugin({})).toBe('function');
    expect(typeof createGlossaryAutoLinkPlugin([])).toBe('function');
  });

  it('skips text inside inline code nodes', () => {
    const tree = cloneTree({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', value: 'I use ' },
            { type: 'inlineCode', value: 'XOR' },
            { type: 'text', value: ' in my code.' },
          ],
        },
      ],
    });

    applyPlugin(tree);
    const paragraph = tree.children[0];
    const links = paragraph.children.filter((child) => child.type === 'link');
    expect(links).toHaveLength(0);
  });

  it('links only the first occurrence per paragraph', () => {
    const tree = cloneTree({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'XOR is great. XOR is amazing. XOR is the best.' }],
        },
      ],
    });

    applyPlugin(tree);
    const paragraph = tree.children[0];
    const links = paragraph.children.filter((child) => child.type === 'link');
    expect(links).toHaveLength(1);
    expect(links[0].children[0].value).toBe('XOR');
  });

  it('emits tooltip attributes in legacy mode', () => {
    const tree = cloneTree({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'I use PolkaSwap for trading.' }],
        },
      ],
    });

    applyPlugin(tree);
    const paragraph = tree.children[0];
    const link = paragraph.children.find((child) => child.type === 'link');
    expect(link?.url).toBe('/glossary#glossary-polkaswap');
    expect(link?.data.hProperties.class).toBe('glossary');
    expect(link?.data.hProperties['aria-label']).toContain('Glossary term');
  });
});

describe('cross: autolink v2 mode', () => {
  it('adds glossary data attributes for popover use', () => {
    process.env.GLOSSARY_V2 = 'true';
    const tree = cloneTree({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'I use PolkaSwap for trading.' }],
        },
      ],
    });

    applyPlugin(tree);
    const paragraph = tree.children[0];
    const link = paragraph.children.find((child) => child.type === 'link');
    expect(link.data.hProperties.class).toBe('glossary');
    expect(link.data.hProperties['data-cat']).toBe('defi');
    expect(link.data.hProperties['data-title']).toBe('PolkaSwap');
    expect(link.data.hProperties['data-def']).toContain('Cross-chain liquidity');
    expect(link.data.hProperties['aria-describedby']).toBeUndefined();
  });

  it('skips headings and data-no-glossary regions', () => {
    process.env.GLOSSARY_V2 = 'true';
    const tree = cloneTree({
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'text', value: 'PolkaSwap' }],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'mdxJsxTextElement',
              name: 'span',
              attributes: [{ type: 'mdxJsxAttribute', name: 'data-no-glossary', value: true }],
              children: [{ type: 'text', value: 'XOR token' }],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'SORA ecosystem' }],
        },
      ],
    });

    applyPlugin(tree);
    const heading = tree.children[0];
    const guardedParagraph = tree.children[1];
    const linkedParagraph = tree.children[2];

    expect(heading.children.find((child) => child.type === 'link')).toBeUndefined();
    const span = guardedParagraph.children[0];
    expect(span.children.some((child) => child.type === 'link')).toBe(false);
    const link = linkedParagraph.children.find((child) => child.type === 'link');
    expect(link).toBeDefined();
    expect(link.data.hProperties.class).toBe('glossary');
  });

  it('is idempotent when run multiple times', () => {
    process.env.GLOSSARY_V2 = 'true';
    const tree = cloneTree({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'XOR enables the SORA network.' }],
        },
      ],
    });

    applyPlugin(tree);
    applyPlugin(tree);

    const paragraph = tree.children[0];
    const links = paragraph.children.filter((child) => child.type === 'link');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].data.hProperties.class).toBe('glossary');
  });
});
