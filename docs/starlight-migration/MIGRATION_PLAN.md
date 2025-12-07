# Soranauts Starlight Migration Plan v3 — Definitive

> **Date:** December 6, 2025  
> **Status:** Ready for Implementation  
> **Executor:** Claude Opus 4.5 in Cursor  
> **Timeline:** 5-6 weeks @ 4-6 hours/day  
> **Reviewed by:** Claude Opus 4.5 (this document)

---

## Executive Summary

### The Goal
Migrate Soranauts knowledge base to Starlight documentation framework with:
- Modern, fast documentation UI
- Clear hierarchy (Official → Technical → Archive)
- Unified search experience
- Preserved glossary system (unchanged)

### Key Decisions Made
1. **Architecture:** Option B — Integrated Starlight at `/docs/*`
2. **Glossary:** Keep separate, untouched
3. **Search:** Unified Pagefind + GlossarySearchV2 overlay
4. **Source Model:** KB is reference material; Starlight docs are curated, original content
5. **Timeline:** 5-6 weeks (Claude-accelerated)

### What Changes
- ✅ New `/docs/*` routes (Starlight-powered)
- ✅ Retire current `/pagefind/` implementation
- ✅ New unified search modal
- ✅ Curated documentation derived from KB sources

### What Stays the Same
- ✅ `/glossary/*` (368 terms, all features intact)
- ✅ `taxonomy.ts` (5000 lines, untouched)
- ✅ `/blog/*`, `/tag-hub/*`
- ✅ Design tokens, Tailwind config
- ✅ KB RAG system for AI retrieval

---

## Architecture Overview

```
soranauts.org/
├── /                           # Homepage (Astro)
├── /blog/*                     # Blog posts (unchanged)
├── /glossary/*                 # 368 terms (UNCHANGED)
├── /tag-hub/*                  # Tag system (unchanged)
└── /docs/*                     # NEW: Starlight documentation
    ├── /fundamentals/          # Level 1: Official (from Wiki)
    │   ├── overview.mdx
    │   ├── tokenomics.mdx
    │   ├── governance.mdx
    │   └── sora-nexus.mdx
    ├── /products/              # Level 1: Official (from Wiki)
    │   ├── polkaswap.mdx
    │   ├── fearless-wallet.mdx
    │   ├── sora-card.mdx
    │   └── tonswap/
    │       ├── index.mdx
    │       └── features.mdx
    ├── /technical/             # Level 2: Technical
    │   ├── /iroha/             # From Iroha docs
    │   │   ├── index.mdx
    │   │   ├── consensus.mdx
    │   │   └── smart-contracts.mdx
    │   ├── /bridges/           # Interoperability
    │   │   ├── ethereum.mdx
    │   │   ├── polkadot.mdx
    │   │   └── ton.mdx
    │   └── /integration/       # Developer guides
    │       └── getting-started.mdx
    ├── /guides/                # How-to content
    │   └── user-guides.mdx
    └── /archive/               # Level 3: Historical
        ├── index.mdx           # Timeline overview
        ├── /2025/
        ├── /2024/
        ├── /2023/
        ├── /2022/
        └── /2021/
```

---

## Content Model

### Source of Truth Clarification

**Knowledge Base (`knowledge_base/curated/`):**
- Raw aggregated content from external sources
- 407K words across 13 files
- Used for RAG retrieval and AI-powered search
- NOT directly converted to Starlight
- Remains unchanged

**Starlight Docs (`apps/web/src/content/docs/`):**
- NEW, curated documentation
- Written by Claude, derived from KB sources
- Concise, user-friendly, authoritative
- IS the source of truth for documentation
- Edited directly

### Content Hierarchy

| Level | Badge | Folder | Source Material | Purpose |
|-------|-------|--------|-----------------|---------|
| 1 | Official (green) | `/fundamentals/`, `/products/` | SORA Wiki | Current, authoritative |
| 2 | Technical (blue) | `/technical/` | Iroha docs, SORAMITSU | Implementation details |
| 3 | Archive (yellow) | `/archive/` | Medium posts (curated) | Historical context |

### Frontmatter Schema (Simplified)

**Level 1 — Official:**
```yaml
---
title: "SORA Tokenomics"
description: "How the Token Bonding Curve manages XOR supply"
source: wiki
lastVerified: 2025-12-06
sidebar:
  badge:
    text: Official
    variant: success
---

:::tip Official Documentation
This content reflects the current SORA Wiki as of December 2025.
[View source](https://wiki.sora.org/tokenomics)
:::
```

**Level 2 — Technical:**
```yaml
---
title: "Iroha Consensus (Sumeragi)"
description: "Byzantine fault-tolerant consensus mechanism"
source: iroha_docs
lastVerified: 2025-12-06
sidebar:
  badge:
    text: Technical
    variant: note
---

:::note Technical Documentation
From Hyperledger Iroha 2 documentation.
[View source](https://hyperledger.github.io/iroha-2-docs/)
:::
```

**Level 3 — Archive:**
```yaml
---
title: "SORA Ecosystem Update #85"
description: "March 2025 ecosystem developments"
source: update
published: 2025-03-07
sidebar:
  badge:
    text: Archive
    variant: caution
---

:::caution Historical Content
This is an archived update from March 2025.
For current information, see [Fundamentals](/docs/fundamentals/).
:::
```

---

## Search Architecture

### Current State (To Be Retired)
- `/pagefind/` — Site-wide index (glossary, blog)
- `GlossarySearchV2.tsx` — Custom glossary search with weighted scoring
- `search.ts` — Custom search engine with fuzzy matching

### Target State
- **Single `/pagefind/` index** — Covers `/docs/*`, `/blog/*`, `/glossary/*`
- **GlossarySearchV2** — Enhanced overlay for glossary-specific search
- **Unified Search Modal** — Single Cmd+K experience

### Implementation

```typescript
// components/search/UnifiedSearchModal.tsx

interface SearchResults {
  glossary: GlossarySearchResult[];
  docs: PagefindResult[];
  blog: PagefindResult[];
}

async function unifiedSearch(query: string): Promise<SearchResults> {
  // 1. Search glossary (instant, in-memory)
  const glossaryEngine = await getGlossarySearchEngine();
  const glossaryResults = glossaryEngine.search(query);
  
  // 2. Search Pagefind (docs + blog)
  const pagefind = await import('/pagefind/pagefind.js');
  await pagefind.init();
  const pagefindResults = await pagefind.search(query);
  
  // 3. Categorize Pagefind results
  const docs = pagefindResults.results
    .filter(r => r.url.startsWith('/docs/'))
    .slice(0, 5);
  const blog = pagefindResults.results
    .filter(r => r.url.startsWith('/blog/'))
    .slice(0, 3);
  
  return {
    glossary: glossaryResults.results.slice(0, 5),
    docs: await Promise.all(docs.map(r => r.data())),
    blog: await Promise.all(blog.map(r => r.data())),
  };
}
```

### Search Modal UI

```
┌─────────────────────────────────────────────────────┐
│  🔍 Search Soranauts...                    [⌘K]    │
├─────────────────────────────────────────────────────┤
│  Query: [xor token_________________]               │
│                                                     │
│  📖 GLOSSARY                                       │
│  ┌─────────────────────────────────────────────┐  │
│  │ XOR                                    token │  │
│  │ The network utility token for SORA...       │  │
│  └─────────────────────────────────────────────┘  │
│  │ Token Bonding Curve              economics │  │
│                                                     │
│  📚 DOCUMENTATION                                  │
│  │ SORA Tokenomics           /docs/fundamentals │  │
│  │ XOR Economics             /docs/archive/2023 │  │
│                                                     │
│  📝 BLOG                                          │
│  │ Understanding XOR         /blog/xor-guide    │  │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Plan (5-6 Weeks)

### Week 1: Foundation

**Day 1-2: Starlight Installation**

```bash
# In apps/web/
pnpm add @astrojs/starlight
```

```javascript
// astro.config.mjs
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Soranauts Docs',
      // Disable Starlight's Pagefind - we'll use our own unified index
      pagefind: false,
      logo: {
        src: './src/assets/soranauts-logo.svg',
      },
      customCss: [
        './src/styles/starlight-custom.css',
      ],
      sidebar: [
        {
          label: 'Fundamentals',
          items: [
            { label: 'Overview', link: '/docs/fundamentals/' },
            { label: 'Tokenomics', link: '/docs/fundamentals/tokenomics' },
            { label: 'Governance', link: '/docs/fundamentals/governance' },
            { label: 'SORA Nexus', link: '/docs/fundamentals/sora-nexus' },
          ],
        },
        {
          label: 'Products',
          items: [
            { label: 'Polkaswap', link: '/docs/products/polkaswap' },
            { label: 'Fearless Wallet', link: '/docs/products/fearless-wallet' },
            { label: 'SORA Card', link: '/docs/products/sora-card' },
            { label: 'TONSWAP', link: '/docs/products/tonswap/' },
          ],
        },
        {
          label: 'Technical',
          collapsed: true,
          items: [
            {
              label: 'Iroha',
              items: [
                { label: 'Overview', link: '/docs/technical/iroha/' },
                { label: 'Consensus', link: '/docs/technical/iroha/consensus' },
              ],
            },
            {
              label: 'Bridges',
              items: [
                { label: 'Ethereum', link: '/docs/technical/bridges/ethereum' },
                { label: 'Polkadot', link: '/docs/technical/bridges/polkadot' },
              ],
            },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'User Guides', link: '/docs/guides/user-guides' },
          ],
        },
        {
          label: 'Archive',
          collapsed: true,
          badge: { text: 'Historical', variant: 'caution' },
          items: [
            { label: 'Timeline', link: '/docs/archive/' },
            { label: '2025', link: '/docs/archive/2025/' },
            { label: '2024', link: '/docs/archive/2024/' },
            { label: '2023', link: '/docs/archive/2023/' },
          ],
        },
      ],
      components: {
        // Custom header with glossary link
        Header: './src/components/starlight/Header.astro',
        // Custom search that uses unified modal
        Search: './src/components/starlight/Search.astro',
      },
    }),
    // ... existing integrations
  ],
});
```

**Day 3-4: Design Token Integration**

```css
/* src/styles/starlight-custom.css */

:root {
  /* Map Soranauts tokens to Starlight */
  --sl-color-accent-low: hsl(0, 80%, 20%);
  --sl-color-accent: hsl(0, 80%, 50%); /* SORA Red #E3242D */
  --sl-color-accent-high: hsl(0, 80%, 70%);
  
  /* Category colors for badges */
  --color-token: #F97316;
  --color-technology: #E3242D;
  --color-governance: #7C3AED;
  --color-defi: #15803D;
  --color-network: #2563EB;
  --color-economics: #BE185D;
  
  /* Typography */
  --sl-font: 'Inter', sans-serif;
  --sl-font-mono: 'JetBrains Mono', monospace;
}

/* Custom badge styles */
.sl-badge[data-variant="success"] {
  background: var(--color-defi);
}

.sl-badge[data-variant="note"] {
  background: var(--color-network);
}

.sl-badge[data-variant="caution"] {
  background: var(--color-token);
}
```

**Day 5: Route Configuration & Testing**

Verify no route conflicts:
```typescript
// Test that these routes don't conflict:
// /docs/*        → Starlight
// /glossary/*    → Existing Astro pages
// /blog/*        → Existing Astro pages
// /tag-hub/*     → Existing Astro pages
```

**Deliverables:**
- [ ] Starlight installed and configured
- [ ] Design tokens mapped
- [ ] Custom header with glossary link
- [ ] No route conflicts
- [ ] Basic test page renders

---

### Week 2: Content Creation (Level 1 — Official)

**Reference Material:** `knowledge_base/curated/wiki/`

Claude reads the KB sources and creates concise, curated documentation.

**Day 1: Fundamentals**

Create these files by synthesizing KB content:

| File | Source Material | Target Length |
|------|-----------------|---------------|
| `fundamentals/index.mdx` | `sora-overview.md` | 1,500-2,000 words |
| `fundamentals/tokenomics.mdx` | `governance-tokenomics.md` + Wiki | 2,000-2,500 words |
| `fundamentals/governance.mdx` | `governance-tokenomics.md` + Wiki | 1,500-2,000 words |
| `fundamentals/sora-nexus.mdx` | Wiki (SORA Nexus section) | 1,000-1,500 words |

**Day 2-3: Products**

| File | Source Material | Target Length |
|------|-----------------|---------------|
| `products/polkaswap.mdx` | `polkaswap-fearless.md` + Wiki | 2,000-2,500 words |
| `products/fearless-wallet.mdx` | `polkaswap-fearless.md` + Wiki | 1,500-2,000 words |
| `products/sora-card.mdx` | Wiki + recent updates | 1,000-1,500 words |
| `products/tonswap/index.mdx` | `tonswap-soramitsu.md` + Wiki | 1,500-2,000 words |
| `products/tonswap/features.mdx` | `tonswap-soramitsu.md` | 1,000-1,500 words |

**Day 4-5: Review & Polish**

- [ ] All frontmatter correct
- [ ] All callouts present
- [ ] Cross-links to glossary working
- [ ] Images referenced correctly
- [ ] Build succeeds

**Deliverables:**
- [ ] 9 Level 1 documentation pages
- [ ] All marked "Official" with green badge
- [ ] All have source callouts
- [ ] Cross-linked to glossary terms

---

### Week 3: Content Creation (Level 2 + Archive)

**Day 1-2: Technical Documentation**

| File | Source Material | Target Length |
|------|-----------------|---------------|
| `technical/iroha/index.mdx` | `iroha-documentation.md` | 2,000-2,500 words |
| `technical/iroha/consensus.mdx` | `iroha-documentation.md` | 1,500-2,000 words |
| `technical/iroha/smart-contracts.mdx` | `iroha-documentation.md` | 1,500-2,000 words |
| `technical/bridges/ethereum.mdx` | `interoperability.md` | 1,000-1,500 words |
| `technical/bridges/polkadot.mdx` | `interoperability.md` | 1,000-1,500 words |
| `technical/bridges/ton.mdx` | `interoperability.md` | 1,000-1,500 words |
| `technical/integration/getting-started.mdx` | `technical-ref.md` | 1,500-2,000 words |

**Day 3: Guides**

| File | Source Material | Target Length |
|------|-----------------|---------------|
| `guides/user-guides.mdx` | `user-guides.md` | 2,000-2,500 words |

**Day 4-5: Archive (Curated)**

Create archive index and curated historical highlights:

```mdx
// archive/index.mdx
---
title: "Historical Updates Archive"
description: "Ecosystem updates and announcements from 2021-2025"
sidebar:
  badge:
    text: Archive
    variant: caution
---

# Historical Updates Archive

This archive contains curated ecosystem updates and announcements.
For current information, see [Fundamentals](/docs/fundamentals/).

## Timeline

### 2025
- [SORA Nexus Announcement](/docs/archive/2025/sora-nexus-launch)
- [Q1 Ecosystem Summary](/docs/archive/2025/q1-summary)

### 2024
- [SORA Card Launch](/docs/archive/2024/sora-card-launch)
- [Year in Review](/docs/archive/2024/year-review)

### 2023
- [Polkaswap 2.0](/docs/archive/2023/polkaswap-v2)

### 2022
- [Kusama Parachain](/docs/archive/2022/kusama-parachain)

### 2021
- [SORA v2 Launch](/docs/archive/2021/sora-v2-launch)
```

**Curated Archive Selection Criteria:**
- Major product launches
- Significant protocol changes
- Annual/quarterly summaries
- Technical milestones

**NOT included in archive:**
- Weekly ecosystem updates (too granular)
- Minor feature announcements
- Temporary promotions

**Deliverables:**
- [ ] 7 Level 2 technical pages
- [ ] 1 guides page
- [ ] Archive index with timeline
- [ ] 5-10 curated archive pages (landmark events only)

---

### Week 4: Search & Automation

**Day 1-2: Unified Search Implementation**

1. Retire old Pagefind configuration
2. Create new unified search modal
3. Configure Pagefind to index entire site

```javascript
// pagefind.config.js (if using explicit config)
module.exports = {
  site: 'dist',
  outputPath: 'dist/pagefind',
  excludeSelectors: [
    '.no-index',
    'nav',
    'footer',
    '.sidebar',
  ],
  // Index everything
  glob: '**/*.html',
};
```

```typescript
// src/components/search/UnifiedSearchModal.tsx
// Implement the unified search modal as specified above
```

**Day 3: Custom Starlight Components**

```astro
<!-- src/components/starlight/Header.astro -->
---
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Header.astro';
---

<Default {...Astro.props}>
  <div class="custom-nav-links">
    <a href="/glossary" class="nav-link">
      📖 Glossary
    </a>
    <a href="/blog" class="nav-link">
      📝 Blog
    </a>
  </div>
</Default>
```

```astro
<!-- src/components/starlight/Search.astro -->
---
// Replace Starlight's search with our unified modal trigger
---

<button 
  class="unified-search-trigger"
  data-search-modal-trigger
  aria-label="Search (⌘K)"
>
  <span class="search-icon">🔍</span>
  <span class="search-text">Search...</span>
  <kbd>⌘K</kbd>
</button>
```

**Day 4-5: CI/CD & Validation**

```yaml
# .github/workflows/docs-validation.yml
name: Docs Validation

on:
  push:
    paths:
      - 'apps/web/src/content/docs/**'
  pull_request:
    paths:
      - 'apps/web/src/content/docs/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Validate frontmatter
        run: pnpm docs:validate
        
      - name: Check links
        run: pnpm docs:check-links
        
      - name: Build
        run: pnpm build
```

```typescript
// scripts/docs-validate.ts
import { glob } from 'glob';
import matter from 'gray-matter';
import { readFile } from 'fs/promises';

interface ValidationError {
  file: string;
  rule: string;
  message: string;
}

async function validateDocs(): Promise<void> {
  const files = await glob('apps/web/src/content/docs/**/*.{md,mdx}');
  const errors: ValidationError[] = [];
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const { data, content: body } = matter(content);
    
    // Rule 1: Must have title
    if (!data.title) {
      errors.push({
        file,
        rule: 'has-title',
        message: 'Missing title in frontmatter',
      });
    }
    
    // Rule 2: Must have source
    if (!data.source) {
      errors.push({
        file,
        rule: 'has-source',
        message: 'Missing source field (wiki, iroha_docs, or update)',
      });
    }
    
    // Rule 3: Archive docs must have caution callout
    if (file.includes('/archive/') && !body.includes(':::caution')) {
      errors.push({
        file,
        rule: 'archive-has-warning',
        message: 'Archive docs must have :::caution callout',
      });
    }
    
    // Rule 4: Official docs must have official badge
    if (data.source === 'wiki') {
      const badge = data.sidebar?.badge;
      if (!badge || badge.text !== 'Official') {
        errors.push({
          file,
          rule: 'wiki-has-official-badge',
          message: 'Wiki-sourced docs must have Official badge',
        });
      }
    }
  }
  
  if (errors.length > 0) {
    console.error('Validation errors:');
    errors.forEach(e => console.error(`  ${e.file}: ${e.message}`));
    process.exit(1);
  }
  
  console.log(`✅ Validated ${files.length} docs files`);
}

validateDocs();
```

**Deliverables:**
- [ ] Unified search modal working
- [ ] Old Pagefind retired
- [ ] Custom Starlight header with glossary link
- [ ] CI validation pipeline
- [ ] Link checking in CI

---

### Week 5: Testing & Polish

**Day 1-2: Comprehensive Testing**

```bash
# Run all validation
pnpm docs:validate
pnpm docs:check-links
pnpm build
pnpm test:e2e

# Manual testing checklist
```

**Manual Testing Checklist:**

- [ ] **Navigation**
  - [ ] Sidebar expands/collapses correctly
  - [ ] All sidebar links work
  - [ ] Mobile navigation works
  - [ ] Glossary link in header works
  
- [ ] **Search**
  - [ ] Cmd+K opens unified modal
  - [ ] Glossary results appear instantly
  - [ ] Docs results appear
  - [ ] Blog results appear
  - [ ] Clicking result navigates correctly
  - [ ] Search works on mobile
  
- [ ] **Content**
  - [ ] All pages render correctly
  - [ ] Badges display correctly
  - [ ] Callouts render correctly
  - [ ] Code blocks highlight correctly
  - [ ] Images load
  - [ ] Cross-links to glossary work
  
- [ ] **Performance**
  - [ ] First Contentful Paint < 1.5s
  - [ ] Search results < 300ms
  - [ ] No layout shift
  
- [ ] **Accessibility**
  - [ ] Keyboard navigation works
  - [ ] Screen reader tested
  - [ ] Color contrast passes

**Day 3-4: Bug Fixes & Polish**

Address any issues found in testing.

**Day 5: Documentation**

Create internal documentation:

```markdown
// docs/STARLIGHT_GUIDE.md

# Starlight Documentation Guide

## Adding New Pages

1. Create `.mdx` file in appropriate folder
2. Add frontmatter with required fields
3. Add to sidebar in `astro.config.mjs`
4. Run `pnpm docs:validate`

## Frontmatter Reference

[Include frontmatter examples]

## Updating Content

1. Edit the file directly in `src/content/docs/`
2. Run validation
3. Submit PR

## Archive Guidelines

Only add to archive if:
- Major product launch
- Significant protocol change
- Annual/quarterly summary
```

**Deliverables:**
- [ ] All tests passing
- [ ] All manual checks pass
- [ ] Bugs fixed
- [ ] Internal documentation complete

---

### Week 6: Launch

**Day 1-2: Staging Deployment**

Deploy to staging environment (Vercel preview):
- [ ] Create PR with all changes
- [ ] Vercel preview deployment
- [ ] Full QA on preview URL
- [ ] Stakeholder review (if applicable)

**Day 3: Production Deployment**

- [ ] Merge to main
- [ ] Verify production deployment
- [ ] Smoke test critical paths
- [ ] Monitor for errors (Sentry)

**Day 4-5: Post-Launch Monitoring**

- [ ] Monitor Vercel Analytics
- [ ] Check for 404s
- [ ] Monitor search usage
- [ ] Address any urgent issues

**Launch Checklist:**

```markdown
## Pre-Launch
- [ ] All content reviewed
- [ ] All links validated
- [ ] Search working
- [ ] Mobile tested
- [ ] Performance acceptable
- [ ] Staging approved

## Launch
- [ ] Merge PR
- [ ] Production deployed
- [ ] Smoke test complete
- [ ] No errors in monitoring

## Post-Launch
- [ ] Analytics tracking
- [ ] User feedback channel ready
- [ ] Rollback plan documented
```

---

## Rollback Plan

### If Issues Are Found

**During Week 1-4 (Pre-Launch):**
```bash
# Simply abandon the feature branch
git checkout main
git branch -D feature/starlight-docs
```

**After Launch:**
```bash
# Revert the merge commit
git revert -m 1 <merge-commit-sha>
git push origin main
# Vercel auto-deploys
```

### Rollback Checkpoints

| Phase | Rollback Difficulty | What's Lost |
|-------|---------------------|-------------|
| Week 1-2 | Easy | Setup work only |
| Week 3-4 | Easy | Content can be re-created |
| Week 5 | Medium | Testing time |
| Week 6+ | Hard | User bookmarks, external links |

---

## Success Metrics

### Quantitative
- [ ] Build time < 3 minutes
- [ ] Page load < 2 seconds
- [ ] Search results < 300ms
- [ ] Zero broken links
- [ ] 100% validation passing

### Qualitative
- [ ] Users can distinguish official vs. archive content
- [ ] Navigation is intuitive
- [ ] Search feels fast and relevant
- [ ] Mobile experience is smooth
- [ ] Design is consistent with existing site

---

## Files to Create/Modify

### New Files
```
apps/web/src/content/docs/
├── fundamentals/
│   ├── index.mdx
│   ├── tokenomics.mdx
│   ├── governance.mdx
│   └── sora-nexus.mdx
├── products/
│   ├── polkaswap.mdx
│   ├── fearless-wallet.mdx
│   ├── sora-card.mdx
│   └── tonswap/
│       ├── index.mdx
│       └── features.mdx
├── technical/
│   ├── iroha/
│   │   ├── index.mdx
│   │   ├── consensus.mdx
│   │   └── smart-contracts.mdx
│   ├── bridges/
│   │   ├── ethereum.mdx
│   │   ├── polkadot.mdx
│   │   └── ton.mdx
│   └── integration/
│       └── getting-started.mdx
├── guides/
│   └── user-guides.mdx
└── archive/
    ├── index.mdx
    ├── 2025/
    ├── 2024/
    ├── 2023/
    ├── 2022/
    └── 2021/

apps/web/src/components/
├── starlight/
│   ├── Header.astro
│   └── Search.astro
└── search/
    └── UnifiedSearchModal.tsx

apps/web/src/styles/
└── starlight-custom.css

scripts/
└── docs-validate.ts

.github/workflows/
└── docs-validation.yml
```

### Modified Files
```
apps/web/astro.config.mjs        # Add Starlight integration
apps/web/package.json            # Add @astrojs/starlight
apps/web/src/components/SearchModal.tsx  # Update to unified search
```

---

## Cursor Prompts for Claude

### Week 1 Prompt
```
I'm implementing Starlight documentation for Soranauts. 

Context:
- Astro 5.x site with React islands
- 368-term glossary at /glossary/* (don't touch)
- Design tokens in Tailwind config
- Need /docs/* routes for Starlight

Task:
1. Install @astrojs/starlight
2. Configure astro.config.mjs with sidebar structure
3. Create starlight-custom.css with Soranauts design tokens
4. Create custom Header.astro component with glossary link
5. Verify no route conflicts

Reference the migration plan at [path] for specifications.
```

### Week 2 Prompt
```
I'm creating Level 1 documentation pages for Soranauts Starlight.

Reference material in knowledge_base/curated/:
- wiki/ (SORA Wiki)
- Read sora-overview.md, governance-tokenomics.md

Task:
1. Create fundamentals/index.mdx (SORA overview, 1500-2000 words)
2. Create fundamentals/tokenomics.mdx (TBC, XOR, 2000-2500 words)
3. Create fundamentals/governance.mdx (Parliament, voting, 1500-2000 words)
4. Create fundamentals/sora-nexus.mdx (new features, 1000-1500 words)

Requirements:
- Use the frontmatter schema from the migration plan
- Add "Official" badge (green/success)
- Add :::tip callout with source link
- Cross-link glossary terms like [XOR](/glossary/xor)
- Concise, user-friendly language
```

### Week 3 Prompt
```
I'm creating Level 2 technical documentation for Soranauts Starlight.

Reference material:
- knowledge_base/curated/iroha_docs/
- knowledge_base/curated/interoperability.md

Task:
1. Create technical/iroha/index.mdx (Iroha overview)
2. Create technical/iroha/consensus.mdx (Sumeragi BFT)
3. Create technical/bridges/ethereum.mdx (HASHI bridge)
4. Create technical/bridges/polkadot.mdx (XCM)

Requirements:
- Use "Technical" badge (blue/note)
- Developer-focused language
- Include code examples where relevant
- Cross-link to glossary terms
```

---

## Questions Resolved

| Question | Decision | Rationale |
|----------|----------|-----------|
| Integration approach? | Option B (Integrated) | Balance of risk and UX |
| Migrate glossary? | No | Too complex, works perfectly |
| Search strategy? | Unified Pagefind + GlossarySearchV2 | Best of both worlds |
| KB relationship? | Reference material, not source | KB is too raw, docs should be curated |
| Timeline? | 5-6 weeks | Claude acceleration |
| Large files? | Don't convert directly | Write new, concise docs instead |

---

## Ready to Start

This plan is ready for implementation. Start with Week 1, Day 1.

**First command:**
```bash
cd apps/web && pnpm add @astrojs/starlight
```

🚀
