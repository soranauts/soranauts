# Learning Path Page Specification

## Overview

Dedicated pages for each learning path that render all steps inline with progress tracking. Designed for web now, mobile-ready architecture for future app conversion.

## Route Structure

- `/learn` - Index page listing all paths
- `/learn/[path-id]` - Individual path page (e.g., `/learn/new-to-sora`)

## Data Source

- `LEARNING_PATHS` from `~/data/learning-paths.config.ts`
- Glossary content from `~/lib/glossary/glossary-loader.ts`
- Tag content from `~/lib/tag-hub.ts`

## Learn Index Page (`/learn/index.astro`)

### Layout

- Hero: "SORA Learning Center"
- Subtitle: "Master SORA at your own pace"
- Stats: X paths, Y total minutes
- Grid of path cards grouped by difficulty
- Each card links to `/learn/[path-id]`

## Learning Path Page (`/learn/[path-id].astro`)

### Header Section

- Path title + difficulty badge (green/yellow/red)
- Description
- Progress bar: "Step X of Y" with visual indicator
- Estimated time remaining
- "Back to All Paths" link

### Steps Section

- All steps rendered vertically
- Current step: fully expanded with content
- Completed steps: collapsed, green checkmark, clickable to expand
- Upcoming steps: collapsed, numbered, clickable to preview

### Step Content (when expanded)

- Step number + title
- Full glossary summary OR tag summary
- Related terms as chips (link to glossary, open new tab)
- "Learn More" link to full glossary/tag page (new tab)
- Navigation: "← Previous" and "Next Step →" buttons
- "Mark as Complete" checkbox (optional, for progress tracking)

### Completion Section (after last step)

- "🎉 Path Complete!" message
- Summary of what they learned
- "What's Next" recommendations (other paths)
- CTA: "Try it yourself" with links to Polkaswap/Fearless
- Support CTA: "This helped? Support Soranauts"

## Progress Tracking (Phase 2 - structure now, implement later)

```typescript
interface PathProgress {
  pathId: string;
  currentStep: number;
  completedSteps: number[];
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
}
// Store in localStorage: soranauts_learning_progress
```

## Component Structure

```
pages/learn/
├── index.astro              # Path listing
├── [pathId].astro           # Dynamic path page
└── LEARNING-PATH-SPEC.md    # This spec

components/learn/
├── PathCard.astro           # Card for index grid
├── PathHeader.astro         # Title, progress, meta
├── PathStep.astro           # Individual step (expandable)
├── PathStepContent.astro    # Glossary/tag content render
├── PathNavigation.astro     # Prev/Next buttons
├── PathCompletion.astro     # End-of-path experience
└── ProgressBar.astro        # Visual progress indicator
```

## Styling Requirements

- Max width 800px for content (reading-optimized)
- Sticky progress bar on scroll
- Smooth expand/collapse animations
- Difficulty colors: beginner=#22c55e, intermediate=#eab308, advanced=#ef4444
- Step states: upcoming (gray), current (accent), completed (green)
- Mobile: full-width, larger tap targets

## Content Resolution

For each step:

1. If type='glossary': fetch from getGlossaryTerm(slug)
   - Display: term, summary, tagline, related terms
2. If type='tag': fetch from getTagHubViewModel(slug)
   - Display: title, summary, related tags

## Accessibility

- Keyboard navigation between steps
- ARIA labels for progress
- Focus management on step change
- Reduced motion support for animations

## Mobile App Considerations

- All state in serializable format (JSON-ready)
- No web-specific dependencies in logic
- Content structured as discrete units
- Progress sync-ready (add API later)
