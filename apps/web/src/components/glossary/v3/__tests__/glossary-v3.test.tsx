import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';

import GlossaryAnchors from '../GlossaryAnchors';
import { buildSections, resolveHashTarget } from '../GlossaryTermPage';

describe('Glossary V3 helpers', () => {
  it('buildSections omits optional entries when data missing', () => {
    const base = buildSections({ hasWhy: false, hasRelated: false, hasSources: false });
    expect(base.map((section) => section.id)).toEqual(['definition']);

    const extended = buildSections({ hasWhy: true, hasRelated: true, hasSources: true });
    expect(extended.map((section) => section.id)).toEqual([
      'definition',
      'why',
      'related',
      'sources',
    ]);
  });

  it('resolveHashTarget matches only available sections', () => {
    const sections = buildSections({ hasWhy: true, hasRelated: true, hasSources: false });
    expect(resolveHashTarget('#related', sections)).toBe('related');
    expect(resolveHashTarget('#sources', sections)).toBeNull();
    expect(resolveHashTarget('', sections)).toBeNull();
  });

  it('GlossaryAnchors renders visible anchor labels', () => {
    const sections = [
      { id: 'definition', label: 'Definition', visible: true },
      { id: 'related', label: 'Related', visible: true },
    ];

    const html = renderToString(
      <GlossaryAnchors
        sections={sections}
        activeSection="definition"
        onSelect={() => {}}
        anchorRef={{ current: null }}
        drawerOpen={false}
        onCloseDrawer={() => {}}
      />,
    );

    expect(html).toContain('Definition');
    expect(html).toContain('Related');
  });
});

