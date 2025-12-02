# Design Notes

Internal reference for Soranauts design tokens, component patterns, and styling rules.

---

## Table of Contents

1. [Token Overview](#token-overview)
2. [Spacing System](#spacing-system)
3. [Border Radius](#border-radius)
4. [Shadow System](#shadow-system)
5. [Typography](#typography)
6. [Color System](#color-system)
7. [Chip System](#chip-system)
8. [CTA Buttons](#cta-buttons)
9. [Card Patterns](#card-patterns)
10. [Quick-View Panel](#quick-view-panel)
11. [Approved vs Not Approved](#approved-vs-not-approved)

---

## Token Overview

All design tokens live in `apps/web/src/assets/styles/tokens.css`. This file is the single source of truth and must stay in sync with `tailwind.config.cjs`.

Tokens are organized into categories:
- **Spacing**: `--space-*` (0 through 96)
- **Radius**: `--radius-*` (none, sm, md, lg, xl, 2xl, 3xl, full)
- **Shadow**: `--shadow-*` (none, sm, md, lg, xl, 2xl, card, soft, hero)
- **Color**: `--color-*` (bg, surface, text, muted, brand, etc.)
- **Typography**: `--text-*`, `--font-weight-*`, `--tracking-*`
- **Motion**: `--motion-duration-*`, `--motion-ease-*`
- **Chip**: `--chip-*` (bg, border, text, count)

---

## Spacing System

Based on Tailwind's spacing scale (4px base unit).

| Token | Value | Use Case |
|-------|-------|----------|
| `--space-0` | 0 | Reset |
| `--space-1` | 0.25rem (4px) | Tight gaps |
| `--space-2` | 0.5rem (8px) | Chip padding, small gaps |
| `--space-3` | 0.75rem (12px) | Button padding |
| `--space-4` | 1rem (16px) | Card padding, section gaps |
| `--space-6` | 1.5rem (24px) | Panel padding |
| `--space-8` | 2rem (32px) | Section margins |
| `--space-12` | 3rem (48px) | Hero padding |
| `--space-14` | 3.5rem (56px) | Page section gaps |

**Rule**: Never use raw `px` or `rem` values. Always use `var(--space-*)`.

---

## Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `--radius-none` | 0 | Sharp corners |
| `--radius-sm` | 0.5rem | Search highlights |
| `--radius` | 0.75rem | Default |
| `--radius-md` | 1rem | Stats cards |
| `--radius-lg` | 1.5rem | Cards, CTAs |
| `--radius-2xl` | 2rem | Hero sections |
| `--radius-3xl` | 2.5rem | Search shells |
| `--radius-full` | 9999px | Chips, pills, avatars |

**Rule**: Chips always use `--radius-full`. Cards use `--radius-lg` to `--radius-3xl`.

---

## Shadow System

| Token | Use Case |
|-------|----------|
| `--shadow-sm` | Subtle elevation |
| `--shadow-md` | CTA buttons |
| `--shadow-lg` | Elevated cards |
| `--shadow-card` | Standard card shadow |
| `--shadow-soft` | Glossary cards, tag cards |
| `--shadow-hero` | Hero sections |
| `--shadow-brand-glow` | Active filter pills |
| `--shadow-2xl` | Quick-View panel |

**Rule**: Never use raw `box-shadow` values. Use token references.

---

## Typography

### Font Scale

| Token | Size | Use Case |
|-------|------|----------|
| `--text-xs` | 0.75rem | Kickers, labels |
| `--text-sm` | 0.875rem | Body small, CTAs |
| `--text-base` | 1rem | Body text |
| `--text-lg` | 1.125rem | Section titles |
| `--text-xl` | 1.25rem | Card titles |
| `--text-2xl` | 1.5rem | H3 headings |
| `--text-3xl` | 1.875rem | H2 headings |
| `--text-4xl` | 2.25rem | H1 headings |
| `--text-5xl` | 3rem | Hero titles |

### Font Weights

| Token | Value | Use Case |
|-------|-------|----------|
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-medium` | 500 | Emphasized text |
| `--font-weight-semibold` | 600 | Headings, chips |
| `--font-weight-bold` | 700 | Hero titles |

### Letter Spacing

| Token | Value | Use Case |
|-------|-------|----------|
| `--tracking-tight` | -0.02em | Hero titles |
| `--tracking-normal` | 0 | Body text |
| `--tracking-wide` | 0.08em | Uppercase labels |

---

## Color System

### Brand Colors

```css
--red-500: #e23a3a;  /* Lighter brand red */
--red-600: #c92f2f;  /* Primary brand red */
--red-700: #a82828;  /* Darker brand red */
```

### Semantic Colors

| Token | Light Mode | Dark Mode | Use Case |
|-------|------------|-----------|----------|
| `--color-bg` | #f4f5f7 | #050609 | Page background |
| `--color-surface` | #ffffff | #0c0f14 | Card backgrounds |
| `--color-text` | #111827 | #e5e7eb | Primary text |
| `--color-muted` | #4b5563 | #9ca3af | Secondary text |
| `--color-link` | var(--red-600) | var(--red-500) | Links |

**Rule**: Use `--color-brand-500` for CTAs. Use `--color-link` for inline links.

---

## Chip System

Chips are used for tags, categories, related terms, and filter pills.

### Variants

```css
.chip              /* Default chip */
.chip--sm          /* Small: padding var(--space-2) var(--space-3) */
.chip--md          /* Medium: padding var(--space-2-5) var(--space-3-5) */
.chip--neutral     /* Default colors */
.chip--muted       /* Subdued colors */
.chip--accent      /* Brand accent border */
.chip--canonical   /* Dashed border */
```

### Token Usage

```css
.chip {
  padding: var(--space-2-5) var(--space-3-5);
  border-radius: var(--radius-full);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--chip-text);
  font-size: 0.8125rem;
  font-weight: 600;
}
```

### Chip Count Badge

For numeric counts on journey/quick-path pills:

```css
.chip__count {
  min-width: var(--chip-count-size);
  height: var(--chip-count-size);
  background: var(--chip-count-bg);
  color: var(--chip-count-fg);
  font-size: var(--chip-count-font);
  border-radius: var(--radius-full);
}
```

---

## CTA Buttons

Primary CTA style used across Glossary, Explorer, and Quick-View:

```css
.btn--primary {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  background: var(--red-600);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.btn--primary:hover {
  background: var(--red-700);
  transform: translateY(-1px);
}
```

**Rule**: All CTAs use `--red-600` as base, `--red-700` on hover. Never use raw hex colors.

---

## Card Patterns

### Glossary Card

```css
.glossary-card {
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
  background: linear-gradient(...);
  box-shadow: var(--shadow-card);
}
```

### Tag Card

```css
.tag-card {
  padding: var(--space-5);
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-soft);
}
```

### Hero Sections

```css
.glossary-hero, .tag-hub-hero {
  padding-block: var(--space-12);
  padding-inline: var(--space-6);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-hero);
}
```

---

## Quick-View Panel

The Quick-View panel slides in from the right to show glossary term details.

### Dimensions

```css
.qv-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100dvh;
  max-width: 480px;
  width: 90vw;
}
```

### Token Usage

```css
.qv-panel {
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-2xl);
}

.qv-panel__header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.qv-panel__content {
  padding: var(--space-6);
  gap: var(--space-5);
}

.qv-panel__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
}
```

### Backdrop

```css
.qv-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
```

---

## Approved vs Not Approved

### ✅ Approved

```css
/* Spacing */
padding: var(--space-4);
margin-bottom: var(--space-6);
gap: var(--space-2);

/* Radius */
border-radius: var(--radius-full);
border-radius: var(--radius-lg);

/* Shadow */
box-shadow: var(--shadow-card);
box-shadow: var(--shadow-md);

/* Color */
background: var(--red-600);
color: var(--color-text);
border-color: var(--chip-border);

/* Typography */
font-size: var(--text-lg);
font-weight: var(--font-weight-semibold);
```

### ❌ Not Approved

```css
/* Raw values */
padding: 16px;
padding: 1rem;
margin-bottom: 24px;

/* Raw radius */
border-radius: 8px;
border-radius: 9999px;

/* Raw shadow */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Raw color */
background: #c92f2f;
color: #111827;
border-color: rgba(17, 24, 39, 0.12);

/* Hardcoded font */
font-size: 1.125rem;
font-weight: 600;
```

### Exception Cases

Raw `rgba()` is acceptable for:
- Subtle overlays (e.g., `rgba(0, 0, 0, 0.5)` for backdrops)
- Inset shadows (e.g., `inset 0 1px 0 rgba(255, 255, 255, 0.08)`)

These are intentionally neutral and not brand-specific.

---

## Motion

### Duration Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| `--motion-duration-fast` | 90ms | Hover states |
| `--motion-duration-normal` | 180ms | Transitions |
| `--motion-duration-slow` | 260ms | Panel animations |

### Easing Tokens

| Token | Use Case |
|-------|----------|
| `--motion-ease-standard` | General transitions |
| `--motion-ease-emphasized` | Card hover, panel slide |

### Reduced Motion

Always wrap transitions in `@media (prefers-reduced-motion: reduce)`:

```css
@media (prefers-reduced-motion: reduce) {
  .chip {
    transition: none;
  }
}
```

---

## Dark Mode

Dark mode is activated via `.dark` class on `:root`.

All color tokens have dark mode overrides in `tokens.css`:

```css
:root.dark {
  --color-bg: #050609;
  --color-surface: #0c0f14;
  --color-text: #e5e7eb;
  --color-muted: #9ca3af;
  --color-link: var(--color-brand-400);
  /* ... */
}
```

**Rule**: Never add dark-mode-specific colors outside of `tokens.css`. Use existing tokens.

---

## File Reference

| File | Purpose |
|------|---------|
| `tokens.css` | All CSS custom properties |
| `glossary.css` | Glossary page and card styles |
| `tag.css` | Explorer/Tag Hub styles |
| `button.css` | Button component styles |
| `card.css` | Generic card styles |


