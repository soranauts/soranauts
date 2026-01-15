# Explorer Model

Internal reference for the SORA Explorer structure, Nexus topic configuration, and glossary integration.

---

## Table of Contents

1. [Explorer Overview](#explorer-overview)
2. [Hierarchy Structure](#hierarchy-structure)
3. [Configuration File](#configuration-file)
4. [Subgroup Definition](#subgroup-definition)
5. [Quick Journeys](#quick-journeys)
6. [Glossary Integration](#glossary-integration)
7. [Stats in Hero](#stats-in-hero)
8. [Adding/Editing Subgroups](#addingediting-subgroups)
9. [Quick-View Interaction](#quick-view-interaction)
10. [Rendering Rules](#rendering-rules)

---

## Explorer Overview

The SORA Explorer (`/explore`) is the main navigation hub for discovering topics, tags, and curated learning paths. The Nexus Architecture section is a first-class topic within Explorer, featuring:

- **Subgroups**: Conceptual chapters of the architecture (7 subgroups)
- **Quick Journeys**: Curated step-by-step learning paths (2 journeys)
- **Term Links**: Direct links to canonical glossary pages
- **Stats Display**: Live term count from glossary data

---

## Hierarchy Structure

```
Explorer (/explore)
  └── Topics
        └── Nexus Architecture (NEXUS_TOPIC)
              ├── Quick Journeys (NEXUS_QUICK_JOURNEYS)
              │     └── Journey Steps → Glossary Pages
              └── Subgroups (NEXUS_SUBGROUPS)
                    └── Terms → Glossary Pages
```

### Levels

| Level | Component | Description |
|-------|-----------|-------------|
| 1 | Topic | Top-level category (e.g., "Nexus Architecture") |
| 2 | Subgroup | Conceptual chapter (e.g., "Execution & VM") |
| 3 | Term | Individual glossary entry |
| 2 | Journey | Curated learning path (parallel to subgroups) |
| 3 | Step | Journey waypoint → glossary term |

---

## Configuration File

Location: `apps/web/src/data/nexus-explorer.config.ts`

This file defines all Nexus-related Explorer content:

```typescript
// Topic metadata
export const NEXUS_TOPIC = {
  id: 'nexus-architecture',
  slug: 'nexus-architecture',
  title: 'Nexus Architecture',
  description: 'SORA Nexus is a modular data-space...',
  tag: 'Nexus Architecture',
  icon: '🔷',
  featured: true,
  weight: 200,
} as const;

// Subgroups array
export const NEXUS_SUBGROUPS: NexusSubgroup[] = [...];

// Quick journeys array
export const NEXUS_QUICK_JOURNEYS: NexusQuickJourney[] = [...];
```

### Exported Functions

```typescript
// Get all unique terms across subgroups
getAllNexusTerms(): string[]

// Get terms for a specific subgroup
getSubgroupTerms(subgroupId: string): string[]

// Find which subgroup a term belongs to
getTermSubgroup(termTitle: string): NexusSubgroup | undefined

// Convert title to slug format
titleToSlug(title: string): string

// Get journey by ID
getJourneyById(journeyId: string): NexusQuickJourney | undefined
```

---

## Subgroup Definition

### Interface

```typescript
interface NexusSubgroup {
  id: string;          // Unique identifier (kebab-case)
  title: string;       // Display title
  description: string; // Brief explanation
  terms: string[];     // Array of canonical term titles
}
```

### Example Subgroup

```typescript
{
  id: 'execution-vm',
  title: 'Execution & Virtual Machine',
  description: 'The Iroha Virtual Machine (IVM), Kotodama runtime, and how transactions are processed.',
  terms: [
    'Iroha Virtual Machine (IVM)',
    'IVM Bytecode',
    'Kotodama',
    'Kotodama Bytecode',
    'Kotodama Runtime',
    'Action',
    'Triggers',
    'Syscalls',
    'Deterministic Runtime',
    'Deterministic Budgets',
    'Gas Tables',
    'Memory Model',
  ],
}
```

### Current Subgroups

| ID | Title | Term Count |
|----|-------|------------|
| `accounts-identity` | Accounts & Identity | 9 |
| `execution-vm` | Execution & Virtual Machine | 12 |
| `consensus-scheduling` | Consensus & Scheduling | 12 |
| `lanes-data-availability` | Lanes & Data Availability | 15 |
| `governance-rulemaking` | Governance & Rulemaking | 14 |
| `economics-fees` | Economics & Fees | 8 |
| `cross-chain-interop` | Cross-Chain & Interoperability | 11 |

---

## Quick Journeys

### Interface

```typescript
interface NexusQuickJourney {
  id: string;           // Unique identifier
  title: string;        // Display title
  description: string;  // Brief explanation
  steps: Array<{
    slug: string;       // Canonical glossary slug
    title: string;      // Display title
    summary?: string;   // Optional step summary
  }>;
}
```

### Example Journey

```typescript
{
  id: 'nexus-in-5-minutes',
  title: 'Understanding Nexus in 5 Minutes',
  description: 'A rapid introduction to the core concepts that define SORA Nexus architecture.',
  steps: [
    {
      slug: 'accountid',
      title: 'AccountId',
      summary: 'The unique identifier for every account in a Nexus data space.',
    },
    {
      slug: 'irohavirtualmachineivm',
      title: 'Iroha Virtual Machine (IVM)',
      summary: 'The deterministic execution engine that processes all Nexus transactions.',
    },
    // ... more steps
  ],
}
```

### Current Journeys

| ID | Title | Steps |
|----|-------|-------|
| `nexus-in-5-minutes` | Understanding Nexus in 5 Minutes | 7 |
| `execution-flow` | Execution Flow Inside Nexus | 8 |

---

## Glossary Integration

### How Terms Link to Glossary

Every term in a subgroup or journey step links to a glossary page:

```typescript
// Subgroup term → glossary link
href={`/glossary/${titleToSlug(term)}`}

// Journey step → glossary link
href={`/glossary/${step.slug}`}
```

### Title-to-Slug Conversion

```typescript
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/\s+/g, '');
}

// Examples:
// "Iroha Virtual Machine (IVM)" → "irohavirtualmachineivm"
// "World State View (WSV)" → "worldstateviewwsv"
// "Data Availability" → "dataavailability"
```

### Why Canonical Slugs Only

Journey steps and subgroup terms **must** use canonical slugs because:

1. Aliases may not have dedicated pages
2. Aliases redirect to canonical, causing unnecessary hops
3. Canonical slugs are stable identifiers
4. Search indexing relies on canonical slugs

---

## Stats in Hero

The Explorer hero displays live glossary statistics.

### Data Source

```typescript
// apps/web/src/lib/glossary/stats.ts
import { NEXUS_SUBGROUPS } from '~/data/nexus-explorer.config';

export function getNexusTermCount(): number {
  const terms = new Set<string>();
  for (const subgroup of NEXUS_SUBGROUPS) {
    for (const term of subgroup.terms) {
      terms.add(term);
    }
  }
  return terms.size;
}
```

### Usage in Explorer

```astro
---
import { GLOSSARY_STATS } from '~/lib/glossary/stats';
const nexusTermCount = GLOSSARY_STATS.nexusTermCount;
---

<dl class="tag-hub-hero__stats">
  <div class="tag-hub-hero__stat">
    <dt>Nexus terms</dt>
    <dd>{nexusTermCount}</dd>
  </div>
</dl>
```

### Displayed Stats

| Stat | Source |
|------|--------|
| Curated topics | `tags.length` |
| Quick journeys | `quickPathSections.length` |
| Nexus terms | `GLOSSARY_STATS.nexusTermCount` |
| Latest update | `trendingTopics[0]?.lastSeen` |

---

## Adding/Editing Subgroups

### Step 1: Edit Configuration

Open `apps/web/src/data/nexus-explorer.config.ts`:

```typescript
export const NEXUS_SUBGROUPS: NexusSubgroup[] = [
  // Add new subgroup
  {
    id: 'your-subgroup-id',
    title: 'Your Subgroup Title',
    description: 'Brief description of this conceptual area.',
    terms: [
      'Term One',
      'Term Two',
      'Term Three',
    ],
  },
  // ... existing subgroups
];
```

### Step 2: Verify Terms Exist

Every term in the `terms` array must have a corresponding glossary entry:

```bash
# Check if term exists
grep -r "title: \"Term One\"" apps/web/src/content/glossary/
```

### Step 3: Rebuild

```bash
pnpm glossary:build
pnpm dev
```

### Rules for Subgroups

1. **ID**: Must be unique, kebab-case
2. **Title**: Should match the conceptual area
3. **Description**: 1-2 sentences explaining the scope
4. **Terms**: Use exact canonical titles (case-sensitive)
5. **Order**: Subgroups appear in array order
6. **Limit**: First 3 subgroups are open by default

---

## Quick-View Interaction

### Does Quick-View Work in Explorer?

**Partially.** The Quick-View panel is designed for glossary term pages, not the Explorer. However:

- Term chips in Explorer link directly to `/glossary/{slug}`
- If the user navigates to a glossary page, Quick-View is available there
- Explorer does NOT have `data-qv-trigger` attributes on term links

### Why Not Enable Quick-View in Explorer?

1. Explorer is a navigation hub, not a reading context
2. Users expect to leave Explorer when clicking a term
3. Quick-View is optimized for in-page term exploration
4. Adding Quick-View would require loading all glossary data

### Future Consideration

If Quick-View is desired in Explorer, add `data-qv-trigger` to term links:

```astro
<a 
  href={`/glossary/${slug}`} 
  class="chip chip--sm chip--muted"
  data-qv-trigger={slug}
>
  {term}
</a>
```

This would require mounting `GlossaryQuickView` on the Explorer page.

---

## Rendering Rules

### Subgroup Display

- **First 3 subgroups**: Open by default (`open` attribute)
- **Remaining subgroups**: Collapsed by default
- **Terms per subgroup**: Show first 8, then "+N more" badge
- **Chevron**: Rotates 180° when open

### Journey Display

- **Grid layout**: Auto-fit columns, min 320px
- **Step numbering**: 1-based, displayed as badge
- **Step links**: Chips with accent border

### Responsive Behavior

- **Mobile (<640px)**: Single column, stacked layout
- **Tablet (640-1024px)**: 2-column grid
- **Desktop (>1024px)**: 3+ column grid (auto-fit)

### Accessibility

- Proper heading hierarchy: h2 → h3 → h4
- ARIA labels on collapsible sections
- Focus states for keyboard navigation
- Reduced motion support via `prefers-reduced-motion`

---

## File Reference

| File | Purpose |
|------|---------|
| `nexus-explorer.config.ts` | Subgroups, journeys, topic config |
| `NexusExplorerSection.astro` | Nexus section component |
| `stats.ts` | Glossary statistics (incl. Nexus count) |
| `explore/index.astro` | Explorer page |
| `tag.css` | Explorer/Tag Hub styles |

---

## Example: Full Subgroup Object

```typescript
{
  id: 'lanes-data-availability',
  title: 'Lanes & Data Availability',
  description: 'Parallel execution lanes, erasure coding, and data availability guarantees.',
  terms: [
    'Lanes',
    'Parallel Lanes',
    'Compute Lane',
    'Lane Finality',
    'Lane Fusion',
    'Lane Split',
    'Lane Proofs',
    'Data Availability',
    'Data Availability Layer',
    'DA Sampling',
    'DA Certificates',
    'Erasure-Coded Kura',
    'Erasure-Coded WSV',
    'Two-Dimensional Erasure Coding',
    'Reed-Solomon',
  ],
}
```

This subgroup:
- Contains 15 terms
- Will show first 8 terms + "+7 more" badge
- Links to `/glossary/lanes`, `/glossary/parallellanes`, etc.
- Is collapsed by default (not in first 3)


