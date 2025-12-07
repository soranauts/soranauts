# SORA Codex - Starlight Documentation Guide

> **Internal guide for maintaining and extending the SORA Codex documentation**

This guide covers how to add, edit, and maintain documentation pages in the SORA Codex (Starlight) section of Soranauts.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [File Structure](#file-structure)
3. [Adding New Pages](#adding-new-pages)
4. [Frontmatter Requirements](#frontmatter-requirements)
5. [Callouts and Badges](#callouts-and-badges)
6. [Cross-linking Glossary Terms](#cross-linking-glossary-terms)
7. [Starlight Components](#starlight-components)
8. [Validation](#validation)
9. [Common Tasks](#common-tasks)

---

## Quick Start

```bash
# Run development server
cd apps/web && pnpm dev

# Run validation
npx tsx scripts/docs-validate.ts

# Build for production
pnpm build

# Preview production build
pnpm preview
```

**Docs are located at:** `apps/web/src/content/docs/docs/`

**URL mapping:**
- `docs/fundamentals/index.mdx` → `/docs/fundamentals`
- `docs/products/polkaswap.mdx` → `/docs/products/polkaswap`
- `docs/technical/iroha/consensus.mdx` → `/docs/technical/iroha/consensus`

---

## File Structure

```
apps/web/src/content/docs/docs/
├── index.mdx                      # /docs (splash page)
├── fundamentals/
│   ├── index.mdx                  # SORA Overview
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
│   └── (future user guides)
└── archive/
    ├── index.mdx                  # Timeline overview
    ├── 2025/
    │   └── sora-nexus-launch.mdx
    ├── 2024/
    │   ├── sora-card-launch.mdx
    │   └── year-review.mdx
    ├── 2023/
    │   └── polkaswap-v2.mdx
    ├── 2022/
    │   └── kusama-parachain.mdx
    └── 2021/
        └── sora-v2-launch.mdx
```

---

## Adding New Pages

### Step 1: Create the MDX file

```bash
# Create a new page
touch apps/web/src/content/docs/docs/products/new-product.mdx
```

### Step 2: Add frontmatter

See [Frontmatter Requirements](#frontmatter-requirements) for the correct template.

### Step 3: Add to sidebar (if needed)

Edit `apps/web/astro.config.mjs` and add the page to the `sidebar` configuration:

```javascript
sidebar: [
  {
    label: 'Products',
    items: [
      // ... existing items
      { slug: 'docs/products/new-product', label: 'New Product' },
    ],
  },
],
```

### Step 4: Run validation

```bash
npx tsx scripts/docs-validate.ts
```

---

## Frontmatter Requirements

### Level 1: Official Documentation (Fundamentals, Products)

```yaml
---
title: "Page Title"
description: "Brief description for SEO and search"
source: wiki
lastVerified: 2025-12-07
sidebar:
  badge:
    text: Official
    variant: success
---

:::tip Official Documentation
This content reflects the current [SORA ecosystem](/glossary/soraecosystem) as of December 2025.
[View SORA Wiki](https://wiki.sora.org)
:::
```

### Level 2: Technical Documentation

```yaml
---
title: "Technical Page Title"
description: "Technical description"
source: iroha_docs
lastVerified: 2025-12-07
sidebar:
  badge:
    text: Technical
    variant: note
---

:::note Technical Documentation
This documentation covers [Hyperledger Iroha](/glossary/hyperledger-iroha) as used in the SORA ecosystem.
[Iroha Documentation](https://hyperledger.github.io/iroha-2-docs/) |
[GitHub Repository](https://github.com/hyperledger/iroha)
:::
```

### Level 3: Archive/Historical Content

```yaml
---
title: "Historical Event Title"
description: "Description of the historical event"
source: update
publishDate: 2024-03-15
sidebar:
  badge:
    text: Archive
    variant: caution
---

:::caution Historical Content
This article documents the [event name] from [date]. For current information, see [Current Documentation](/docs/products/product-name).
:::
```

### Badge Variants

| Variant | Color | Use Case |
|---------|-------|----------|
| `success` | Green | Official wiki content |
| `note` | Blue | Technical documentation |
| `caution` | Yellow | Archive/historical content |
| `danger` | Red | Deprecated (avoid using) |
| `tip` | Purple | Tips and best practices |

---

## Callouts and Badges

### Callout Types

```mdx
:::tip Title
Tip content - use for best practices, recommendations
:::

:::note Title
Note content - use for technical information
:::

:::caution Title
Caution content - use for warnings, historical content
:::

:::danger Title
Danger content - use for critical warnings (rare)
:::
```

### Sidebar Badges

Badges appear next to the page title in the sidebar:

```yaml
sidebar:
  badge:
    text: Official    # Text shown in badge
    variant: success  # Color variant
```

---

## Cross-linking Glossary Terms

### Format

**Always use:** `/glossary/term-slug` (no anchors!)

```mdx
<!-- ✅ CORRECT -->
Learn about [XOR](/glossary/xor) and [Polkaswap](/glossary/polkaswap).

<!-- ❌ WRONG - No anchors! -->
Learn about [XOR](/glossary/xor#definition).
```

### Finding Glossary Slugs

```bash
# Search for a term
grep -l "title.*XOR" apps/web/src/content/glossary/*.mdx

# List all glossary slugs
ls apps/web/src/content/glossary/*.mdx | sed 's/.*\///' | sed 's/\.mdx//'
```

### Auto-linking

The `glossary-auto-link.mjs` plugin automatically converts plain text terms to glossary links during build. Manual links take precedence.

---

## Starlight Components

### Import Components

```mdx
import { Card, CardGrid, LinkCard, Tabs, TabItem, Steps, Aside } from '@astrojs/starlight/components';
```

### CardGrid

```mdx
<CardGrid>
  <LinkCard
    title="Fundamentals"
    description="Core concepts about SORA"
    href="/docs/fundamentals"
  />
  <LinkCard
    title="Products"
    description="SORA ecosystem products"
    href="/docs/products"
  />
</CardGrid>
```

### Tabs

```mdx
<Tabs>
  <TabItem label="JavaScript">
    ```javascript
    console.log('Hello');
    ```
  </TabItem>
  <TabItem label="Python">
    ```python
    print('Hello')
    ```
  </TabItem>
</Tabs>
```

### Steps

```mdx
<Steps>
1. First step description
2. Second step description
3. Third step description
</Steps>
```

### Card (icon-based)

```mdx
<Card title="Feature" icon="rocket">
  Feature description here.
</Card>
```

### Available Icons

Common icons: `rocket`, `puzzle`, `setting`, `document`, `open-book`, `star`, `warning`, `information`

See [Starlight Icons](https://starlight.astro.build/reference/icons/) for full list.

---

## Validation

### Run Validation Script

```bash
# From project root
npx tsx scripts/docs-validate.ts

# Expected output:
# ✅ All documentation files passed validation!
```

### What's Validated

1. **Required frontmatter:** `title` (required), `source` (required for non-index pages)
2. **Archive docs:** Must have `:::caution` callout
3. **Official docs (source: wiki):** Must have `:::tip` callout
4. **Technical docs (source: iroha_docs):** Must have `:::note` callout

### CI Validation

The `docs-validation.yml` workflow runs on:
- PRs that touch `apps/web/src/content/docs/**`
- Pushes to `main` or `feature/starlight-*` branches

---

## Common Tasks

### Add a New Fundamentals Page

```bash
# 1. Create file
cat > apps/web/src/content/docs/docs/fundamentals/new-topic.mdx << 'EOF'
---
title: "New Topic"
description: "Description of new topic"
source: wiki
lastVerified: 2025-12-07
sidebar:
  badge:
    text: Official
    variant: success
---

:::tip Official Documentation
This content reflects the current [SORA ecosystem](/glossary/soraecosystem).
:::

## Introduction

Content here...
EOF

# 2. Add to sidebar in astro.config.mjs

# 3. Validate
npx tsx scripts/docs-validate.ts

# 4. Build and test
pnpm build
```

### Add a New Archive Entry

```bash
# 1. Create year directory if needed
mkdir -p apps/web/src/content/docs/docs/archive/2025

# 2. Create file with archive frontmatter
cat > apps/web/src/content/docs/docs/archive/2025/new-event.mdx << 'EOF'
---
title: "Event Name"
description: "Event description"
source: update
publishDate: 2025-01-15
sidebar:
  badge:
    text: Archive
    variant: caution
---

:::caution Historical Content
This article documents the event from January 2025.
:::

## Overview

Content here...
EOF
```

### Update the Sidebar

Edit `apps/web/astro.config.mjs`:

```javascript
// Find the sidebar configuration
sidebar: [
  {
    label: 'Fundamentals',
    items: [
      { slug: 'docs/fundamentals', label: 'SORA Overview' },
      { slug: 'docs/fundamentals/new-topic', label: 'New Topic' }, // Add here
    ],
  },
],
```

### Fix a Validation Error

```bash
# Run validation to see errors
npx tsx scripts/docs-validate.ts

# Common fixes:
# 1. Missing title → Add title: "Page Title" to frontmatter
# 2. Missing callout → Add :::tip/:::note/:::caution block
# 3. Wrong badge variant → Update sidebar.badge.variant
```

---

## Troubleshooting

### "Page not found" after adding new page

1. Check file is in correct directory: `apps/web/src/content/docs/docs/`
2. Check slug in `astro.config.mjs` matches file path
3. Restart dev server: `pnpm dev`

### Sidebar badge not showing

1. Ensure `sidebar.badge` is properly indented in frontmatter
2. Check variant is valid: `success`, `note`, `caution`, `danger`, `tip`

### Glossary links not working

1. Verify slug exists: `ls apps/web/src/content/glossary/ | grep term-name`
2. Use lowercase slug: `/glossary/xor` not `/glossary/XOR`
3. No anchors: `/glossary/xor` not `/glossary/xor#definition`

### Build errors

```bash
# Clean and rebuild
rm -rf apps/web/.astro apps/web/dist
pnpm build
```

---

## Reference

- [Starlight Documentation](https://starlight.astro.build/)
- [Starlight Components](https://starlight.astro.build/components/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [MDX Documentation](https://mdxjs.com/)

---

*Last updated: December 2025*
