# Phase 4-Lite: Visual UX Polish — Status Report

**Date:** December 1, 2025  
**Scope:** Low-risk CSS + markup fixes for Glossary & Explorer consistency  
**Status:** ✅ Complete — Ready for QA

---

## Summary

This phase applied minimal, low-risk visual fixes to unify chips/pills, fix header alignment, and standardize CTAs across Glossary and Explorer. **No new components, islands, or dependencies were added.**

---

## Objectives Completed

| Objective | Status |
|-----------|--------|
| Unify chips/pills (size, spacing, contrast) | ✅ Done |
| Readable numeric count badges | ✅ Done |
| Fix Explorer header alignment | ✅ Done |
| Use brand red tokens for CTAs | ✅ Done |
| Remove off-brand reds | ✅ Done |

---

## Files Modified

### 1. `apps/web/src/assets/styles/tokens.css`

**Added chip count badge tokens:**

```css
/* Light mode (inside :root) */
--chip-count-bg: var(--red-600);
--chip-count-fg: white;
--chip-count-size: 1.125rem;
--chip-count-font: 0.6875rem;

/* Dark mode (inside :root.dark) */
--chip-count-bg: var(--red-500);
--chip-count-fg: white;
```

---

### 2. `apps/web/src/assets/styles/components/glossary.css`

**Changes:**

1. **Normalized `.chip` class** — unified padding (`0.625rem 0.875rem`), font-size (`0.8125rem`), line-height (`1`), and gap (`var(--space-2)`).

2. **Added `.chip__count`** — numeric badge for counts on pills:
   ```css
   .chip__count {
     display: inline-grid;
     place-items: center;
     min-width: var(--chip-count-size);
     height: var(--chip-count-size);
     padding-inline: 0.25rem;
     border-radius: var(--radius-full);
     background: var(--chip-count-bg);
     color: var(--chip-count-fg);
     font-weight: 600;
     font-size: var(--chip-count-font);
     line-height: 1;
   }
   ```

3. **Updated focus ring** — uses `color-mix(in oklab, var(--red-600), white 30%)`.

4. **Fixed `.glossary-alias-hint__cta`** — uses `--red-600` / `--red-700` with hover state.

5. **Added `.btn--primary`** — reusable primary CTA class with brand red.

---

### 3. `apps/web/src/assets/styles/components/tag.css`

**Normalized chip sizes:**

- `.tag-hub-quick-path__tags a` — consistent padding and font-size
- `.tag-card__chip` — consistent sizing
- `.tag-filter-pill` — consistent padding and font-size

---

### 4. `apps/web/src/components/explore/NexusExplorerSection.astro`

**Fixed header alignment issue where titles were breaking mid-word:**

**Markup change:**
```astro
<!-- Before -->
<summary class="nexus-subgroup__header">
  <h4 class="nexus-subgroup__title">{subgroup.title}</h4>
  <span class="nexus-subgroup__count">...</span>
  <span class="nexus-subgroup__chevron">...</span>
</summary>

<!-- After -->
<summary class="nexus-subgroup__header">
  <div class="nexus-subgroup__header-text">
    <h4 class="nexus-subgroup__title">{subgroup.title}</h4>
    <span class="nexus-subgroup__count">...</span>
  </div>
  <span class="nexus-subgroup__chevron">...</span>
</summary>
```

**CSS changes:**
- Added `.nexus-subgroup__header-text` wrapper with `flex: 1` and `min-width: 0`
- Added `white-space: nowrap` to title and count to prevent mid-word breaks
- Added `flex-shrink: 0` to chevron
- Increased grid minmax from `300px` to `340px` for better card widths

---

### 5. `apps/web/src/layouts/MarkdownLayout.astro`

**Fixed off-brand red colors:**

```css
/* Before */
--tw-prose-links: #dc2626;
--tw-prose-links-hover: #ef4444;

/* After */
--tw-prose-links: var(--red-600);
--tw-prose-links-hover: var(--red-500);
```

---

## What's Working

1. **Chips/pills** — Consistent size everywhere (Glossary, Explorer, Tag Hub)
2. **Numeric count badges** — Legible at 100–150% zoom, uses `.chip__count` class
3. **Explorer topic cards** — Headers no longer break mid-word
4. **CTAs** — All use brand red tokens (`--red-600` / `--red-700`)
5. **Dark mode** — All tokens have dark mode variants

---

## Verification

```bash
# Typecheck passed (only pre-existing warnings)
pnpm -w typecheck

# Build passed
pnpm --filter @soranauts/web build
```

**Manual QA completed:**
- `/explore` — Topic card headers display correctly
- `/explore#nexus-architecture` — All subgroup headers on single lines
- Chips have consistent sizing across the site

---

## Known Pre-existing Issues (Not addressed in this phase)

- Astro router warnings about duplicate routes (`/changelog`, etc.)
- Pagefind warnings about pages with no `<html>` element
- Unused variable warnings in `astro.config.mjs`

These are unrelated to the UX polish work.

---

## Deduplication Status

**Already implemented in codebase:**
- `GlossaryTermHero.tsx` — has `normalizeChips()` function that dedupes by href
- `GlossaryCard.astro` — has inline dedupe logic with `seenTags` Set

No additional deduplication was needed.

---

## Next Steps (Future Phase 4-Pro)

If desired, a future phase could add:
- Learning Quick-View panel (React island)
- URL state for term selection
- Count badges on journey pills with actual step counts

---

## Quick Reference: New CSS Classes

| Class | Purpose |
|-------|---------|
| `.chip__count` | Numeric badge inside chips |
| `.btn--primary` | Primary CTA button with brand red |
| `.nexus-subgroup__header-text` | Wrapper for title + count in Explorer cards |

---

## Dev Server

The dev server should still be running on port 4321:
```bash
pnpm --filter @soranauts/web dev
```

If not, start it with the above command.



