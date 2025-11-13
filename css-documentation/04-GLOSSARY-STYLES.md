# Glossary Styling System

## Overview

The glossary system has complex styling requirements with multiple contexts, category-based color coding, and progressive enhancement. This document explains the complete glossary styling system.

## Styling Contexts

### 1. Glossary Index Pages
- **Selector**: `.glossary-index` or `body.glossary-v2 .glossary-index`
- **Files**: `glossary.css`, `glossary-index.css`
- **Behavior**: Category colors always visible, tooltips enabled

### 2. Article Pages (Non-Glossary)
- **Selector**: `:not(.glossary-index *)` or `body:not(.glossary-index)`
- **Files**: `glossary-article.css`
- **Behavior**: Gray by default, category colors on hover

### 3. Restricted Contexts
- **Tables**: Glossary terms disabled
- **Headings (h1-h6)**: Glossary terms disabled
- **Reason**: Avoid positioning and visual interference issues

## Category System

### Categories

| Category | Light Mode | Dark Mode | Usage |
|----------|-----------|-----------|-------|
| Token | #92400e (Yellow-800) | #fbbf24 (Yellow-400) | Token-related terms |
| Technology | #991b1b (Red-800) | #f87171 (Red-400) | Technology terms |
| Governance | #6b21a8 (Purple-800) | #a78bfa (Purple-400) | Governance terms |
| DeFi | #166534 (Green-800) | #4ade80 (Green-400) | DeFi terms |
| Network | #3730a3 (Indigo-800) | #818cf8 (Indigo-400) | Network terms |
| Economics | #be185d (Pink-800) | #f472b6 (Pink-400) | Economics terms |
| Tag | #4b5563 (Gray-600) | #d1d5db (Gray-300) | Generic tags |

### Hover States

Each category has a hover state that's slightly lighter/darker:
- Light mode: Generally one shade lighter (e.g., Yellow-700)
- Dark mode: Generally one shade darker (e.g., Yellow-500)

## Implementation Methods

### Method 1: Class-Based (Legacy)
```html
<a href="#" class="glossary-term glossary-term-token">Token</a>
<a href="#" class="glossary-term glossary-term-technology">Technology</a>
```

### Method 2: Data Attribute (V2 - Preferred)
```html
<a href="#" class="glossary-term" data-cat="token">Token</a>
<a href="#" class="glossary-term" data-cat="technology">Technology</a>
```

**Current Status**: Both methods are supported for backward compatibility.

## Glossary Index Page Styling

### File: `glossary.css`

#### Base Term Styling
```css
.glossary-index .glossary-term {
  text-decoration: underline dotted !important;
  cursor: pointer;
  position: relative;
  color: #1f2937; /* Light mode */
  transition: all 0.2s ease;
  display: inline-block;
}
```

#### Category Colors (Always Visible)
```css
.glossary-index .glossary-term-token,
.glossary-index a[data-cat="token"] {
  color: #92400e !important; /* Yellow-800 */
}

.glossary-index .glossary-term-technology,
.glossary-index a[data-cat="technology"] {
  color: #991b1b !important; /* Red-800 */
}
/* ... other categories ... */
```

#### Dark Mode Category Colors
```css
.glossary-index .dark .glossary-term-token,
.glossary-index .dark a[data-cat="token"] {
  color: #fbbf24 !important; /* Yellow-400 */
}
/* ... other categories ... */
```

#### Hover States
```css
.glossary-index .glossary-term-token:hover,
.glossary-index a[data-cat="token"]:hover {
  color: #b45309 !important; /* Yellow-700 */
}
```

### Tooltip Styling
```css
.glossary-tip {
  position: absolute;
  z-index: 20;
  max-width: 28rem;
  padding: .6rem .8rem;
  border-radius: .5rem;
  background: #111;
  color: #fff;
  box-shadow: 0 6px 24px rgba(0,0,0,.24);
  font-size: 14px;
  line-height: 1.4;
}
```

#### Mobile Tooltip
```css
@media (max-width: 768px) {
  .glossary-tip {
    position: fixed !important;
    bottom: 20px !important;
    left: 20px !important;
    right: 20px !important;
    max-width: none !important;
    max-height: 200px !important;
    overflow-y: auto !important;
    z-index: 99999 !important;
  }
}
```

## Article Page Styling

### File: `glossary-article.css`

#### Base Link Styling
```css
:where(body) :not(.glossary-index *) a.glossary,
:where(body) :not(.glossary-index *) .glossary-term {
  color: #AAAAAA !important; /* Matches navigation gray */
  text-decoration: underline dotted !important;
  text-decoration-thickness: .06em;
  text-underline-offset: .14em;
  cursor: help;
}
```

#### Category Hover Colors
```css
body:not(.glossary-index) main article .prose a.glossary[data-cat="token"]:hover,
:where(body) :not(.glossary-index *) a.glossary[data-cat="token"]:hover {
  color: #92400e !important;
  text-decoration-color: #92400e !important;
  text-decoration-style: solid !important;
}
```

**Key Difference**: Colors only appear on hover in article pages, not by default.

## Popover System (V2)

### File: `glossary-popover.css`

#### Popover Container
```css
body.glossary-v2 .g-pop {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 60;
}

body.glossary-v2 .g-pop[aria-hidden="false"] {
  pointer-events: auto;
}
```

#### Popover Card
```css
body.glossary-v2 .g-pop__card {
  position: absolute;
  max-width: min(28rem, 92vw);
  background: var(--bg);
  color: var(--text);
  border: 1px solid color-mix(in oklab, var(--text) 15%, transparent);
  border-radius: 12px;
  box-shadow: var(--glow);
  padding: 0.9rem 1rem 0.8rem;
  transform: translate(-50%, -100%);
}
```

#### Mobile Sheet Mode
```css
@media (max-width: 640px) {
  body.glossary-v2 .g-pop--sheet .g-pop__card {
    left: 50% !important;
    top: auto !important;
    bottom: 0.75rem;
    transform: translateX(-50%);
    width: 92vw;
    max-width: 36rem;
  }
}
```

## Disabled Contexts

### Tables
```css
table .glossary-term {
  text-decoration: none !important;
  cursor: default !important;
  color: inherit !important;
}

table .glossary-tip {
  display: none !important;
}
```

### Headings
```css
h1 .glossary-term,
h2 .glossary-term,
/* ... h3-h6 ... */ {
  text-decoration: none !important;
  cursor: default !important;
  color: inherit !important;
}

h1 .glossary-tip,
/* ... h2-h6 ... */ {
  display: none !important;
}
```

## Specificity Strategy

### High Specificity Selectors
The glossary styles use high specificity to override prose and other styles:

```css
/* Example: High specificity for article pages */
body:not(.glossary-index) main article .prose a.glossary[data-cat="token"]:hover,
body:not(.glossary-index) main[data-pagefind-body] article .prose a.glossary[data-cat="token"]:hover,
:where(body) :not(.glossary-index *) a.glossary[data-cat="token"]:hover
```

### Why High Specificity?
1. Override Tailwind Typography prose styles
2. Override other link styles
3. Ensure category colors appear correctly
4. Maintain context-specific behavior

### !important Usage
Used sparingly but necessary for:
- Color overrides (category colors)
- Text decoration
- Cursor styles
- Display properties in restricted contexts

## Progressive Enhancement

### Base (CSS Only)
- Dotted underline
- Category colors
- Basic hover states

### Enhanced (JavaScript)
- Tooltip positioning
- Popover functionality
- Keyboard navigation
- Mobile interactions

### Fallback
- Pure CSS hover tooltips (`.glossary-term:hover + .glossary-tip`)
- Works without JavaScript
- Basic functionality maintained

## Accessibility

### Focus States
```css
.glossary-index .glossary-term:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### Keyboard Navigation
- Popover opens on focus
- Close button accessible
- Escape key support (via JavaScript)

### Screen Readers
- `aria-hidden` on popover
- Proper heading structure
- Semantic HTML

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .glossary-term {
    transition: none;
  }
}
```

## Common Issues and Solutions

### Issue: Colors Not Showing
**Cause**: Wrong context selector or missing category attribute
**Solution**: 
- Verify page has correct class (`.glossary-index` or not)
- Check `data-cat` attribute is present
- Verify CSS file is loaded

### Issue: Hover Colors Not Working
**Cause**: Specificity too low or conflicting styles
**Solution**:
- Check selector specificity
- Verify hover state is defined
- Check for conflicting `!important` rules

### Issue: Tooltip Not Positioning
**Cause**: Position context or z-index issues
**Solution**:
- Verify parent has `position: relative`
- Check z-index values
- Test on mobile (different positioning)

### Issue: Dark Mode Colors Wrong
**Cause**: Missing dark mode definitions or wrong selector
**Solution**:
- Verify dark mode selectors (`.dark` class)
- Check variable definitions
- Test both light and dark modes

## Best Practices

1. **Use Data Attributes**: Prefer `data-cat` over classes for V2
2. **Test All Contexts**: Test in glossary index and article pages
3. **Test Both Modes**: Always test light and dark modes
4. **Test Mobile**: Verify tooltip positioning on mobile
5. **Maintain Specificity**: Use appropriate specificity levels
6. **Document Changes**: Document any category color changes
7. **Accessibility First**: Ensure keyboard and screen reader support

## Future Improvements

1. **Consolidate Colors**: Create a single source of truth for category colors
2. **Standardize Dark Mode**: Use `.dark` class consistently
3. **Reduce Specificity**: Refactor to use lower specificity where possible
4. **Variable System**: Move category colors to CSS variables
5. **Simplify Selectors**: Reduce selector complexity where possible









