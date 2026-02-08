# COMPONENT_REFERENCE.md
# Soranauts — Blog Component Reference (February 2026)

---

## Overview

Soranauts blog articles use a component system that consumes design tokens from `tokens.css` for automatic light/dark mode support. Components suppress glossary auto-linking internally via the remark plugin's `SKIP_ELEMENTS` set — no manual `data-no-glossary` wrappers needed in MDX.

All components live in `apps/web/src/components/blog/` with corresponding CSS in `apps/web/src/assets/styles/components/`.

---

## Import Block

Every article using components needs imports after the frontmatter `---`:

```jsx
import CalloutBox from '~/components/blog/CalloutBox.astro';
import StyledTable from '~/components/blog/StyledTable.astro';
import TableCaption from '~/components/blog/TableCaption.astro';
import SourcesList from '~/components/blog/SourcesList.astro';
import FaqSection from '~/components/blog/FaqSection.astro';
```

Import only what you use.

---

## CalloutBox

Semantic callout boxes for warnings, key findings, tips, and TL;DR sections. Renders `<aside>` with CSS classes from `callout.css`.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `color` | `'red' \| 'amber' \| 'blue' \| 'green' \| 'purple' \| 'cyan' \| 'accent'` | Yes | — | Sets the accent color (left rail, tinted background) |
| `variant` | `'banner' \| 'callout' \| 'info' \| 'highlight'` | No | `'callout'` | Controls layout and visual weight |
| `icon` | `string` | No | — | Emoji or text prepended to the title |
| `title` | `string` | No | — | Bold heading line inside the callout |

### Variant Guide

| Variant | Use For | Visual Treatment |
|---------|---------|-----------------|
| `banner` | High-importance warnings (dev status, production disclaimers) | Full border, tinted bg, larger padding |
| `callout` | Key findings, quotes, important context | Left accent stripe, standard padding |
| `info` | Tips, supplementary context, notes | Left accent stripe, subtle tinted bg |
| `highlight` | TL;DR boxes, executive summaries | Left accent stripe, tinted bg, larger title |

### Color Guide

| Color | Maps To | Use For |
|-------|---------|---------|
| `red` | `--color-error` | Warnings, critical findings, risks |
| `amber` | `--color-warning` | Cautions, development status, caveats |
| `blue` | `--color-info` | Tips, context, informational notes |
| `green` | `--color-success` | Positive outcomes, confirmations, live status |
| `accent` | `--color-brand-500` | Brand-colored highlights, TL;DR boxes |
| `purple` | `#7C3AED` | Special emphasis (pending tokenization) |
| `cyan` | `#38BDF8` | Technical highlights (pending tokenization) |

### Examples

**Development status banner:**
```jsx
<CalloutBox color="amber" variant="banner" icon="⚠️" title="Development Status">
  <p>This feature is described in the whitepaper but has not been deployed to production.</p>
</CalloutBox>
```

**TL;DR box:**
```jsx
<CalloutBox color="accent" variant="highlight" title="TL;DR">
  <ul class="space-y-2">
    <li>• <strong>Key point one</strong> with supporting context.</li>
    <li>• <strong>Key point two</strong> with supporting context.</li>
  </ul>
</CalloutBox>
```

**Key finding:**
```jsx
<CalloutBox color="red" variant="callout" icon="📊" title="Federal Reserve Finding (2024)">
  <p>"No evidence of fully offline digital payment systems in production today."</p>
</CalloutBox>
```

**Informational tip:**
```jsx
<CalloutBox color="blue" variant="info" icon="💡" title="Good to Know">
  <p>The glossary auto-linker handles term linking automatically — never add manual glossary links.</p>
</CalloutBox>
```

---

## StyledTable

Wrapper for HTML tables providing consistent styling: rounded corners, token-backed border and background, overflow scrolling.

### Usage

Wrap your `<table>` markup — the inner HTML stays exactly as-is:

```jsx
<StyledTable>
  <table class="w-full text-left">
    <thead>
      <tr class="bg-soft text-text-main text-sm font-semibold">
        <th class="p-4">Column A</th>
        <th class="p-4">Column B</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border-subtle">
      <tr class="hover:bg-soft/50 transition-colors">
        <td class="p-4 font-medium text-text-main">Row 1</td>
        <td class="p-4 text-text-muted">Value</td>
      </tr>
    </tbody>
  </table>
</StyledTable>
```

### Standard Table Skeleton (copy this)

```jsx
<StyledTable>
  <table class="w-full text-left">
    <thead>
      <tr class="bg-soft text-text-main text-sm font-semibold">
        <th class="p-4">Header</th>
        <th class="p-4">Header</th>
        <th class="p-4">Header</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border-subtle">
      <tr class="hover:bg-soft/50 transition-colors">
        <td class="p-4 font-medium text-text-main">Label</td>
        <td class="p-4 text-text-muted">Value</td>
        <td class="p-4 text-text-muted">Value</td>
      </tr>
    </tbody>
  </table>
</StyledTable>
```

### Token Class Reference (use these, not hardcoded grays)

| Element | Token Class | Replaces |
|---------|------------|----------|
| `<thead> <tr>` background | `bg-soft` | `bg-gray-800/50` |
| `<thead> <th>` text | `text-text-main` | `text-gray-200` |
| `<tbody>` dividers | `divide-y divide-border-subtle` | `divide-y divide-gray-700/50` |
| `<tr>` hover | `hover:bg-soft/50` | `hover:bg-gray-800/30` |
| `<td>` primary text | `text-text-main` | `text-gray-200` |
| `<td>` secondary text | `text-text-muted` | `text-gray-300` |
| Row/cell borders | `border-b border-border-subtle` | `border-b border-gray-700` |

### Semantic Color Overrides (keep these as-is)

These are intentional — do NOT replace with token classes:

- `text-accent` — Nexus-highlighted columns/cells
- `text-green-400 font-semibold` — Status: Live
- `text-blue-400 font-semibold` — Status: PoC completed
- `text-yellow-400 font-semibold` — Status: In development
- `text-amber-400 font-semibold` — Status: Whitepaper specification

---

## TableCaption

Single-line attribution below a table. Uses `text-text-soft` token.

```jsx
<StyledTable>
  {/* table markup */}
</StyledTable>
<TableCaption>Sources: DataReportal, Pacific E-Commerce, Solomon Star News<sup>[7][8][9]</sup></TableCaption>
```

---

## SourcesList

Collapsible bibliography section using `<details>`/`<summary>`. Closed by default.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `count` | `number` | Yes | Total number of sources (shown in summary line) |

### Usage

```jsx
<SourcesList count={56}>

1. Reuters — "Article Title" (Date)
2. Organization — "Article Title" (Date)
3. Organization — "Article Title"

</SourcesList>
```

### Rules

- Use plain numbered text (`1. 2. 3.`), not `<ol>` tags
- Keep the `---` horizontal rule above (separating Stay Connected from Sources)
- Include the exact source count in the `count` prop
- Do not add hyperlinks in the source list unless the source was also linked in the article body
- Source format: `N. Organization — "Title" (Date)`

---

## FaqSection

Collapsible FAQ accordion. Already has glossary suppression built in.

```jsx
<FaqSection>
  <details>
    <summary>What is SORA Nexus?</summary>
    SORA Nexus is the third major version of the SORA network, built on
    Hyperledger Iroha 3. It introduces a unified ledger architecture with
    data spaces, parallel lanes, and the Iroha Virtual Machine (IVM) for
    deterministic smart contract execution.
  </details>
  <details>
    <summary>How is Nexus different from SORA v2?</summary>
    While SORA v2 operates as a Substrate-based chain, Nexus moves to
    Hyperledger Iroha 3 with native support for private data spaces,
    institutional use cases like CBDCs, and infinite horizontal scalability
    through parallel lanes.
  </details>
</FaqSection>
```

**Forbidden:** `items={[...]}` prop syntax. Always use literal `<details>` children.

---

## Citation & Linking Strategy

### Internal Links (5–8 per pillar article)

- Always dofollow
- Format: `[anchor text](/slug)` (bare slugs, no `/blog/` prefix)
- Verify slugs exist before publishing
- Link at the first natural mention of a related topic

### External Links (3–5 max, selective)

Format: `<a href="URL" target="_blank" rel="noopener noreferrer">anchor text</a>`

| Tier | Source Type | Treatment |
|------|-----------|-----------|
| Tier 1 | IMF, BIS, World Bank, Federal Reserve, central bank publications | Dofollow link in body |
| Tier 2 | sora.org whitepaper, wiki.sora.org, soramitsu.co.jp, bakong.nbc.gov.kh | Dofollow link in body |
| Tier 3 | Quality journalism (Reuters, Forbes) — only if essential | Rarely link, only when critical |
| Tier 4 | Industry blogs, LinkedIn, YouTube, aggregators | **No link** — cite in bibliography only |

**Never nofollow editorial links** — Google treats this as unnatural.

### Bibliography (SourcesList)

- All sources appear in the `<SourcesList>` component at the end of the article
- Inline citations: `<sup>[N]</sup>` in the article body
- Format: `N. Organization — "Title" (Date)`
- Sources linked in the body don't need the URL repeated in the bibliography
- Sources NOT linked should provide enough info for independent lookup

### Glossary Terms

- **Never manually link glossary terms** — the auto-linker handles this
- Glossary links are automatically suppressed inside CalloutBox, StyledTable, TableCaption, SourcesList, and FaqSection
- For inline HTML blocks that need suppression, use `<div data-no-glossary>` wrapping
- The `SKIP_ELEMENTS` set in `glossary-auto-link.mjs` controls build-time suppression

---

## Related Articles (Layout Component)

The Related Articles component appears automatically at the bottom of every blog post. It is NOT imported in MDX — it's wired into `BlogPostLayout.astro`. Authors interact with it only through the optional `relatedArticles` frontmatter field.

### Algorithm (V2 Hybrid Scorer)

Six signals with configurable weights (see `config/related.config.ts`):

| Signal | Weight | Description |
|--------|--------|-------------|
| Tag Match (IDF-weighted) | 1.5 × IDF sum | Rare shared tags score higher than common ones |
| Foundational Bonus | 0.4 (once) | Boost for tags with high priority or glossary refs |
| Glossary Overlap | 1.6 per term | Shared glossary terms between articles |
| Title Keywords | 1.2 per word | Shared meaningful words in titles |
| Same Category | 0.6 (once) | Bonus if articles share a category |
| Recency | 0.0–0.8 | Curve favoring articles updated within 90 days |

Tag IDF formula: `log2(totalArticles / articlesWithThisTag)`. A tag used by 2 of 46 articles scores ~4.5. A tag used by 40 scores ~0.2.

### Frontmatter Override

Pin specific articles when the algorithm picks poorly:

```yaml
relatedArticles:
  - sora-nexus-complete-guide
  - sora-ecosystem-explained
  - deep-dive-into-xor-val-and-pswap
```

When set, articles appear in exact order and the algorithm is skipped. When omitted, the IDF-weighted scorer runs automatically.

### Card Display

Each card shows:
- **Tag pill** — highest-IDF shared tag (e.g., "CBDC", "Nexus"). Manual picks show "Recommended"
- **Title** — links to the article
- **Excerpt** — from frontmatter description

3 cards shown by default. On hover: inset left accent via box-shadow, title transitions to brand color.

### Configuration

- Algorithm weights: `apps/web/src/config/related.config.ts`
- Scoring engine: `apps/web/src/utils/related.ts`
- Component: `apps/web/src/components/blog/RelatedArticles.astro`
- Layout wiring: `apps/web/src/layouts/BlogPostLayout.astro`

---

## Design Token Architecture

Components consume tokens from `apps/web/src/assets/styles/tokens.css`. The CSS component files are in `apps/web/src/assets/styles/components/` and imported via `system.css` using `@layer components`.

### Available Component CSS Files

| File | Classes | Purpose |
|------|---------|---------|
| `callout.css` | `.callout`, `.callout--banner`, `.callout--warning`, etc. | Callout box variants and tones |
| `status-badge.css` | `.status-badge`, `.status-badge--dot`, `.status-badge--success`, etc. | Inline status indicators |
| `sources-list.css` | `.sources-list`, `.sources-list__summary`, `.sources-list__content` | Collapsible bibliography |

### Adding New Component CSS

1. Create file in `apps/web/src/assets/styles/components/`
2. Wrap all rules in `@layer components { }`
3. Use token variables (never hardcode colors)
4. Import in `system.css` after existing component imports
5. Add the component name (lowercase) to `SKIP_ELEMENTS` in `glossary-auto-link.mjs` if it will contain prose content

---

## Glossary Auto-Linker Suppression

The remark plugin (`apps/web/src/utils/glossary-auto-link.mjs`) automatically suppresses glossary linking inside these MDX component names:

```
SKIP_ELEMENTS: summary, details, faqsection, calloutbox, styledtable,
               tablecaption, sourceslist, pre
```

This works at build time during MDX AST processing. The `data-no-glossary` attribute on component Astro templates is a secondary safety net for any hypothetical client-side processing but does not affect the remark plugin.

To add a new component to the skip list, add its lowercase name to the `SKIP_ELEMENTS` Set in `glossary-auto-link.mjs`.

---

# END OF REFERENCE
