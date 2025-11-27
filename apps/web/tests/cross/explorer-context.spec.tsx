import React from 'react';
import { describe, expect, it } from 'vitest';
import { load as loadHtml } from 'cheerio';
import { renderToString } from 'react-dom/server';

import ExplorerGlossaryContext from '~/components/tag-hub/ExplorerGlossaryContext';

describe('cross: explorer glossary context component', () => {
  it('renders related terms and articles', () => {
    const markup = renderToString(
      <ExplorerGlossaryContext
        term="xor"
        category="DeFi & Liquidity"
        relatedTerms={['polkaswap', 'tonswap']}
        relatedArticles={[
          { title: 'Sample coverage', href: '/blog/sample', date: '2025-01-01' },
        ]}
      />,
    );

    const $ = loadHtml(markup);
    expect($('.explorer-context').length).toBe(1);
    expect($('.explorer-context__chips .tag').length).toBeGreaterThan(0);
    expect($('.explorer-context__articles li').length).toBe(1);
    expect($('.explorer-context__articles li a').attr('href')).toBe('/blog/sample');
  });
});

