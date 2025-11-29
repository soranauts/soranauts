import { describe, expect, it } from 'vitest';

import { getTagHubViewModel } from '~/lib/tag-hub';

describe('TagHub view model glossary links', () => {
  it('maps the SORA tag to the canonical glossary entry', () => {
    const tag = getTagHubViewModel('tag-sora');
    expect(tag).toBeDefined();
    expect(tag?.canonicalGlossarySlug).toBe('sora');
    expect(tag?.glossaryCanonicalPath).toBe('/glossary/sora');
  });
});



