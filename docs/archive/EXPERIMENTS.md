# UX Experiments Guide

**Status:** Dev-only  
**Location:** `apps/web/src/lib/flags/experiments.ts`

---

## Overview

The experiments module provides a safe way to test UX variations in development without affecting production. All experiments are:

- **Dev-only**: Disabled in production builds
- **Local**: Results stored in localStorage
- **Non-blocking**: No impact on build or runtime
- **Privacy-safe**: No data leaves the browser

---

## Available Experiments

### 1. Quick-View Animation

**Key:** `quickViewAnimation`  
**Variants:** `'slide'` (default) | `'fade'`

Controls how the Quick-View panel opens:
- `slide`: Panel slides in from the right edge
- `fade`: Panel fades in with a subtle scale

### 2. Tagline Emphasis

**Key:** `taglineEmphasis`  
**Variants:** `'normal'` (default) | `'strong'`

Controls the visual prominence of the "Why it matters" callout:
- `normal`: Standard callout styling
- `strong`: Larger text, more prominent background

### 3. Related Terms Count

**Key:** `relatedCount`  
**Variants:** `3` (default) | `6`

Controls how many related terms appear in Quick-View:
- `3`: Show 3 related terms (compact)
- `6`: Show 6 related terms (comprehensive)

### 4. Show Badge

**Key:** `showBadge`  
**Variants:** `false` (default) | `true`

Shows a visual indicator when experiments are active and logs events to console.

---

## How to Run Experiments

### Via Console

Open browser DevTools and use the global API:

```javascript
// View current config
__experiments.config

// Set an experiment
__experiments.set('quickViewAnimation', 'fade')
__experiments.set('relatedCount', 6)
__experiments.set('showBadge', true)

// Reset all to defaults
__experiments.reset()

// View results
__experiments.results()

// Clear event history
__experiments.clear()
```

### Via Code

```typescript
import { 
  experiments, 
  setExperiment, 
  trackExperimentEvent 
} from '~/lib/flags/experiments';

// Check current variant
if (experiments.quickViewAnimation === 'fade') {
  // Apply fade animation
}

// Track an event
trackExperimentEvent('quickViewAnimation', 'view');
trackExperimentEvent('quickViewAnimation', 'click');
trackExperimentEvent('quickViewAnimation', 'dwell', 3500); // ms
```

---

## Reading Results

The results API returns aggregated metrics per experiment variant:

```javascript
__experiments.results()

// Output:
{
  "quickViewAnimation:slide": {
    "views": 45,
    "clicks": 12,
    "avgDwell": 4200
  },
  "quickViewAnimation:fade": {
    "views": 38,
    "clicks": 15,
    "avgDwell": 5100
  }
}
```

### Metrics

| Metric | Description |
|--------|-------------|
| `views` | Number of times the variant was shown |
| `clicks` | Number of interactions (e.g., click related term) |
| `avgDwell` | Average time spent (ms) with the variant visible |

---

## Experiment Workflow

### 1. Define Hypothesis

```
Hypothesis: Fade animation will increase Quick-View engagement
Metric: Click-through rate on related terms
Success: +10% clicks with fade vs slide
```

### 2. Run Experiment

```javascript
// Session 1: Test slide (default)
// Use the app normally, events auto-tracked

// Session 2: Test fade
__experiments.set('quickViewAnimation', 'fade')
// Use the app normally
```

### 3. Analyze Results

```javascript
const results = __experiments.results();

const slideClicks = results['quickViewAnimation:slide']?.clicks || 0;
const slideViews = results['quickViewAnimation:slide']?.views || 0;
const slideCTR = slideViews > 0 ? (slideClicks / slideViews * 100).toFixed(1) : 0;

const fadeClicks = results['quickViewAnimation:fade']?.clicks || 0;
const fadeViews = results['quickViewAnimation:fade']?.views || 0;
const fadeCTR = fadeViews > 0 ? (fadeClicks / fadeViews * 100).toFixed(1) : 0;

console.log(`Slide CTR: ${slideCTR}%`);
console.log(`Fade CTR: ${fadeCTR}%`);
```

### 4. Document Findings

Add results to this file or create an issue with findings.

---

## Adding New Experiments

### 1. Update Types

In `experiments.ts`:

```typescript
export interface ExperimentConfig {
  // ... existing
  myNewExperiment: 'variantA' | 'variantB';
}
```

### 2. Add Default

```typescript
const DEFAULT_CONFIG: ExperimentConfig = {
  // ... existing
  myNewExperiment: 'variantA',
};
```

### 3. Implement in Component

```typescript
import { experiments, trackExperimentEvent } from '~/lib/flags/experiments';

function MyComponent() {
  useEffect(() => {
    trackExperimentEvent('myNewExperiment', 'view');
  }, []);

  if (experiments.myNewExperiment === 'variantB') {
    return <VariantB />;
  }
  return <VariantA />;
}
```

---

## Best Practices

### Do

- ✅ Test one variable at a time
- ✅ Collect sufficient sample size (50+ views per variant)
- ✅ Document hypothesis before testing
- ✅ Reset between test sessions if needed
- ✅ Consider reduced-motion preferences

### Don't

- ❌ Ship experiments to production
- ❌ Make breaking changes via experiments
- ❌ Test multiple experiments simultaneously
- ❌ Draw conclusions from small samples

---

## Experiment History

| Date | Experiment | Winner | Notes |
|------|------------|--------|-------|
| — | — | — | No experiments run yet |

---

## Troubleshooting

### Experiments not working?

1. Check you're in dev mode (`localhost` or `DEV=true`)
2. Check localStorage is available
3. Check console for `[Experiments]` logs

### Results not saving?

1. Check localStorage quota
2. Try `__experiments.clear()` to reset

### Need to test in production?

Create a feature flag instead. Experiments are dev-only by design.

---

*Last updated: December 2025*


