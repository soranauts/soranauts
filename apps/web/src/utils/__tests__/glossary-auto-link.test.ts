import { describe, it, expect } from 'vitest';
import { createGlossaryAutoLinkPlugin } from '../glossary-auto-link.mjs';

// Mock glossary data for testing
const mockGlossaryData = {
  terms: [
    {
      term: 'XOR',
      slug: 'xor',
      category: 'token',
      aliases: ['XOR Token', 'XOR Coin'],
      priority: 100
    },
    {
      term: 'PolkaSwap',
      slug: 'polkaswap',
      category: 'defi',
      aliases: ['PolkaSwap DEX', 'PSWAP'],
      priority: 80
    },
    {
      term: 'SORA',
      slug: 'sora',
      category: 'network',
      aliases: ['SORA Network', 'SORA 2.0'],
      priority: 85
    }
  ]
};

describe('Glossary Auto-link Plugin', () => {
  it('should create a plugin function', () => {
    const plugin = createGlossaryAutoLinkPlugin(mockGlossaryData);
    expect(typeof plugin).toBe('function');
  });

  it('should return no-op plugin for invalid data', () => {
    const plugin1 = createGlossaryAutoLinkPlugin(null);
    const plugin2 = createGlossaryAutoLinkPlugin({});
    const plugin3 = createGlossaryAutoLinkPlugin({ terms: [] });
    
    expect(typeof plugin1).toBe('function');
    expect(typeof plugin2).toBe('function');
    expect(typeof plugin3).toBe('function');
  });

  it('should prioritize longer aliases over shorter ones', () => {
    const plugin = createGlossaryAutoLinkPlugin(mockGlossaryData);
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'I use XOR Token and XOR Coin in my portfolio.'
            }
          ]
        }
      ]
    };

    const transformedTree = plugin()(tree);
    const paragraph = transformedTree.children[0];
    const links = paragraph.children.filter(child => child.type === 'link');
    
    // Should only link the first occurrence (XOR Token)
    expect(links).toHaveLength(1);
    expect(links[0].children[0].value).toBe('XOR Token');
  });

  it('should skip linking in paragraphs with code or links', () => {
    const plugin = createGlossaryAutoLinkPlugin(mockGlossaryData);
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'I use '
            },
            {
              type: 'inlineCode',
              value: 'XOR'
            },
            {
              type: 'text',
              value: ' in my code.'
            }
          ]
        }
      ]
    };

    const transformedTree = plugin()(tree);
    const paragraph = transformedTree.children[0];
    const links = paragraph.children.filter(child => child.type === 'link');
    
    // Should not create any links
    expect(links).toHaveLength(0);
  });

  it('should only link first occurrence per paragraph', () => {
    const plugin = createGlossaryAutoLinkPlugin(mockGlossaryData);
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'XOR is great. XOR is amazing. XOR is the best.'
            }
          ]
        }
      ]
    };

    const transformedTree = plugin()(tree);
    const paragraph = transformedTree.children[0];
    const links = paragraph.children.filter(child => child.type === 'link');
    
    // Should only link the first occurrence
    expect(links).toHaveLength(1);
    expect(links[0].children[0].value).toBe('XOR');
  });

  it('should generate correct link URLs and attributes', () => {
    const plugin = createGlossaryAutoLinkPlugin(mockGlossaryData);
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'I use PolkaSwap for trading.'
            }
          ]
        }
      ]
    };

    const transformedTree = plugin()(tree);
    const paragraph = transformedTree.children[0];
    const link = paragraph.children.find(child => child.type === 'link');
    
    expect(link.url).toBe('/glossary#glossary-polkaswap');
    expect(link.data.hProperties.class).toBe('glossary-term glossary-term-defi');
    expect(link.data.hProperties['data-term']).toBe('polkaswap');
    expect(link.data.hProperties['data-category']).toBe('defi');
    expect(link.data.hProperties['aria-describedby']).toBe('tip-polkaswap');
  });

  it('should handle case-insensitive matching', () => {
    const plugin = createGlossaryAutoLinkPlugin(mockGlossaryData);
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'I use xor and POLKASWAP for trading.'
            }
          ]
        }
      ]
    };

    const transformedTree = plugin()(tree);
    const paragraph = transformedTree.children[0];
    const links = paragraph.children.filter(child => child.type === 'link');
    
    // Should link both terms (case-insensitive)
    expect(links).toHaveLength(2);
    expect(links[0].children[0].value).toBe('xor');
    expect(links[1].children[0].value).toBe('POLKASWAP');
  });

  it('should handle word boundaries correctly', () => {
    const plugin = createGlossaryAutoLinkPlugin(mockGlossaryData);
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'I use XOR tokens and XORNET protocol.'
            }
          ]
        }
      ]
    };

    const transformedTree = plugin()(tree);
    const paragraph = transformedTree.children[0];
    const links = paragraph.children.filter(child => child.type === 'link');
    
    // Should only link 'XOR' as a separate word, not as part of 'XORNET'
    expect(links).toHaveLength(1);
    expect(links[0].children[0].value).toBe('XOR');
  });
});


