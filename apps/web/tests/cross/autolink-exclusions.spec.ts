const findLink = (node?: TestNode) =>
  node?.children?.find((child: TestNode) => child.type === 'link');

const filterLinks = (node?: TestNode) =>
  node?.children?.filter((child: TestNode) => child.type === 'link') ?? [];

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

type TestNode = {
  type: string;
  children?: TestNode[];
  [key: string]: any;
};

const cloneTree = (tree: TestNode): TestNode => JSON.parse(JSON.stringify(tree));

const applyPlugin = (tree: TestNode): TestNode => {
  const plugin = createGlossaryAutoLinkPlugin(mockGlossaryTerms);
  const transformer = plugin();
  expect(typeof transformer).toBe('function');
  transformer(tree);
  return tree;
};

let previousEnv: string | undefined;

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
    const paragraph = tree.children?.[0] as TestNode | undefined;
    const links = filterLinks(paragraph);
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
    const paragraph = tree.children?.[0] as TestNode | undefined;
    const links = filterLinks(paragraph);
    expect(links).toHaveLength(1);
    const firstLink = links[0]!;
    expect(firstLink.children?.[0]?.value).toBe('XOR');
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
    const paragraph = tree.children?.[0] as TestNode | undefined;
    const link = findLink(paragraph);
    expect(link).toBeDefined();
    if (!link) return;
    expect(link.url).toBe('/glossary/polkaswap');
    expect(link.data?.hProperties?.class).toBe('glossary');
    expect(link.data?.hProperties?.['aria-label']).toContain('Glossary term');
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
    const paragraph = tree.children?.[0] as TestNode | undefined;
    const link = findLink(paragraph);
    expect(link).toBeDefined();
    if (!link) return;
    expect(link.url).toBe('/glossary/polkaswap');
    expect(link.data?.hProperties?.class).toBe('glossary');
    expect(link.data?.hProperties?.['data-cat']).toBe('defi');
    expect(link.data?.hProperties?.['data-title']).toBe('PolkaSwap');
    expect(link.data?.hProperties?.['data-def']).toContain('Cross-chain liquidity');
    expect(link.data?.hProperties?.['aria-describedby']).toBeUndefined();
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
    const heading = tree.children?.[0] as TestNode | undefined;
    const guardedParagraph = tree.children?.[1] as TestNode | undefined;
    const linkedParagraph = tree.children?.[2] as TestNode | undefined;

    expect(findLink(heading)).toBeUndefined();
    const span = guardedParagraph?.children?.[0] as TestNode | undefined;
    expect(span?.children?.some((child: TestNode) => child.type === 'link') ?? false).toBe(false);
    const link = findLink(linkedParagraph);
    expect(link).toBeDefined();
    if (!link) return;
    expect(link.data?.hProperties?.class).toBe('glossary');
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

    const paragraph = tree.children?.[0] as TestNode | undefined;
    const links = filterLinks(paragraph);
    expect(links.length).toBeGreaterThan(0);
    const firstLink = links[0]!;
    expect(firstLink.data?.hProperties?.class).toBe('glossary');
  });
});
