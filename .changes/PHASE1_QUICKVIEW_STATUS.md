# Phase 1: Learning Quick-View — Status Report

**Date:** December 1, 2025  
**Scope:** In-place right-panel Quick-View for Glossary terms  
**Status:** ✅ Complete — Ready for QA

---

## Summary

Implemented an in-place right-panel Quick-View for glossary terms that allows users to learn about terms without leaving the current page. The panel opens via pill/link clicks with `data-qv-trigger` attribute and syncs with URL via `?term=<slug>`.

---

## Features Implemented

| Feature | Status |
|---------|--------|
| Panel slides in from right | ✅ Done |
| URL state sync (`?term=<slug>`) | ✅ Done |
| Escape key closes panel | ✅ Done |
| Focus trap within panel | ✅ Done |
| Background made inert | ✅ Done |
| ARIA live announcements | ✅ Done |
| "Go deeper" navigates to full page | ✅ Done |
| Related terms clickable in panel | ✅ Done |
| Back/forward history support | ✅ Done |
| Respects prefers-reduced-motion | ✅ Done |
| Mobile full-bleed layout | ✅ Done |

---

## Files Created

### 1. `apps/web/src/lib/glossary/quickview.state.ts`

URL state management and focus trap utilities:
- `getTermFromUrl()` / `setTermInUrl()` / `removeTermFromUrl()` — URL param management
- `onPopState()` — history navigation listener
- `createFocusTrap()` — keyboard trap with Tab cycling and Escape handler
- `setBackgroundInert()` — makes main content inert when panel open
- `announce()` — ARIA live region for screen reader announcements
- `prefersReducedMotion()` — motion preference check

### 2. `apps/web/src/components/glossary/GlossaryQuickView.tsx`

React island component (client:load):
- Self-contained state management
- Global event listener for `data-qv-trigger` clicks
- Lazy content loading by slug
- Displays: title, category badge, summary, "Why it matters", related terms
- "Go deeper" CTA navigates to canonical page

### 3. `apps/web/tests/e2e/glossary.quickview.spec.ts`

Playwright e2e tests:
- Opens via click on pill
- Esc closes and returns focus
- Direct load with `?term=` auto-opens
- "Go deeper" navigates to canonical page
- Back/forward history maintains state
- ARIA attributes verified
- Edge case: missing term handled gracefully

---

## Files Modified

### 1. `apps/web/src/pages/glossary/[slug].astro`

- Added `GlossaryQuickView` import
- Prepared `quickViewTerms` data (lightweight payload)
- Mounted `<GlossaryQuickView client:load ... />` after Footer
- Added `data-qv-trigger` to related term chips in legacy UI
- Added `data-qv-trigger` to "Related glossary entries" section

### 2. `apps/web/src/components/glossary/GlossaryTermHero.tsx`

- Added `data-qv-trigger` attribute to chips linking to glossary terms

### 3. `apps/web/src/assets/styles/components/glossary.css`

Added ~170 lines of Quick-View panel styles:

```css
/* Key classes */
.qv-backdrop          /* Fixed overlay */
.qv-panel             /* Slide-in panel */
.qv-panel--open       /* Open state */
.qv-panel--closing    /* Closing animation */
.qv-panel__header     /* Close button container */
.qv-panel__content    /* Scrollable content */
.qv-panel__title      /* Term title */
.qv-panel__summary    /* Definition text */
.qv-panel__section    /* Why it matters / Related terms */
.qv-panel__chips      /* Related term buttons */
.qv-panel__footer     /* Go deeper CTA */
.qv-panel__cta        /* CTA button */
```

---

## How It Works

1. **Trigger:** Any element with `data-qv-trigger="<slug>"` opens the Quick-View
2. **URL Sync:** Opening pushes `?term=<slug>` to URL; closing removes it
3. **Focus Management:** Focus trapped in panel; Escape closes; focus returns to trigger
4. **Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, inert background
5. **Content:** Fetches from pre-loaded terms array (no additional API call)
6. **Navigation:** "Go deeper" is a regular link to `/glossary/<slug>`

---

## Verification

```bash
# Typecheck passed
pnpm -w typecheck
# Result: 0 errors

# Build passed
pnpm --filter @soranauts/web build
# Result: 389 page(s) built
```

**Manual QA completed:**
- `/glossary/xor` — VAL chip opens Quick-View panel
- Panel shows category, title, summary, related terms
- Escape closes panel, focus returns to VAL chip
- "Go deeper" navigates to `/glossary/val`
- URL shows `?term=val` when open, removed when closed

---

## Screenshot Evidence

Quick-View panel open showing VAL term:
- Category badge: "Token"
- Title: "VAL"
- Summary: "A validator reward token for the SORA network..."
- Related terms: XOR, PSWAP, Validator, Staking, Deflationary, HASHI
- "Go deeper" CTA at bottom

---

## Known Limitations

1. **Terms data size:** All canonical terms are serialized to the page (~200 terms). For very large glossaries, consider lazy-loading individual term data.

2. **V3 UI flag:** The `data-qv-trigger` attributes are added to the legacy UI path. If `FEATURE_GLOSSARY_V3_UI` is enabled, the GlossaryTermPage component would need similar updates.

---

## CSS Tokens Used

All styling uses existing design tokens:
- `--color-surface`, `--color-border`, `--color-text`, `--color-muted`
- `--space-*` for spacing
- `--radius-*` for border radius
- `--shadow-2xl` for panel shadow
- `--motion-duration-*`, `--motion-ease-*` for animations
- `--focus-ring` for focus states

No new color tokens added.

---

## Accessibility Checklist

- [x] `role="dialog"` with `aria-modal="true"`
- [x] `aria-labelledby` points to title
- [x] Focus trapped within panel
- [x] Escape key closes panel
- [x] Focus returns to trigger on close
- [x] Background made inert
- [x] ARIA live region announces term title
- [x] Close button has `aria-label`
- [x] Respects `prefers-reduced-motion`

---

## Next Steps (Phase 2)

Ready for Phase 2 when you send it!



