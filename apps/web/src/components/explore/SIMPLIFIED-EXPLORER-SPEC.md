# Simplified Explorer Component Spec

## Overview

Replace the 7-section explore page with a focused 4-section layout optimized for learning and conversion.

## Data Dependencies

- `LEARNING_PATHS` from `~/data/learning-paths.config`
- `getAllTagHubViewModels()` from `~/lib/tag-hub`
- `TagFilters` component from `~/components/tag-hub/TagFilters`

## Section 1: Hero

- Kicker: "SORA EXPLORER"
- H1: "Learn SORA"
- Description: "Your guide to the decentralized economic network. Start with the basics or dive deep into the architecture."
- Two CTAs: "Start Learning" (anchor to #learning-paths), "Search Topics" (anchor to #search)
- Stats bar: Learning Paths count, Glossary Terms (369), Articles (49), Total Time (~3h)

## Section 2: Learning Paths

- H2: "Choose Your Path"
- Description: "Structured learning from beginner to advanced. Each path builds on the last."
- Three groups by difficulty:
  - "Start Here" (beginner, green dot)
  - "Go Deeper" (intermediate, yellow dot)
  - "Master the Architecture" (advanced, red dot)
- Each path card shows:
  - Title + estimated time
  - Description
  - Numbered step pills linking to glossary or tag pages
  - Optional CTA (e.g., "Get Fearless Wallet")

## Section 3: Search & Discover

- id="search" for anchor link
- H2: "Explore All Topics"
- Description with tag count
- TagFilters component (client:load)

## Section 4: Support

- H2: "Support Soranauts"
- Text: "This resource is independently maintained. If you found it helpful, consider supporting continued development."
- CTA: "Learn How to Support →" linking to /donate

## Styling Requirements

- Max width 1200px, centered
- Use existing CSS variables (--space-*, --text-*, --color-*, --radius-*, --red-*)
- Difficulty colors: beginner=#22c55e, intermediate=#eab308, advanced=#ef4444
- Path cards have left border accent matching difficulty
- Responsive: single column on mobile

## Path Step Links

- type='glossary' → /glossary/{slug}
- type='tag' → /tag/{slug}

## Component Props

```typescript
interface Props {
  // None - all data loaded internally
}
```

## Accessibility

- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels on interactive elements
- Focus visible states
- Reduced motion support
