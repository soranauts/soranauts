# CSS Files Documentation

## File Overview

The application uses multiple CSS files, each serving a specific purpose. This document explains each file's purpose, structure, and usage.

## File Loading Order

Files are loaded in this order (in `Layout.astro`):

1. `tailwind.css` - Main Tailwind entry point
2. `glossary.css` - Base glossary styling
3. `tokens-glossary.css` - Glossary CSS variables
4. `glossary-article.css` - Article page glossary links
5. `glossary-index.css` - Glossary index page styles
6. `glossary-popover.css` - Glossary popover/tooltip
7. `CustomStyles.astro` - Inline global styles

**Important**: This order affects CSS specificity and cascade.

---

## 1. tailwind.css

**Location**: `apps/web/src/assets/styles/tailwind.css`

**Purpose**: Main Tailwind CSS entry point and custom utility/component definitions.

### Structure

#### Tailwind Directives
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Custom Utilities Layer
```css
@layer utilities {
  .bg-page {
    background-color: var(--aw-color-bg-page);
  }
  .bg-dark {
    background-color: var(--aw-color-bg-page-dark);
  }
  .bg-light {
    background-color: var(--aw-color-bg-page);
  }
  .text-page {
    color: var(--aw-color-text-page);
  }
  .text-muted {
    color: var(--aw-color-text-muted);
  }
}
```

**Usage**:
```html
<div class="bg-page text-page">Content</div>
```

#### Custom Components Layer
```css
@layer components {
  .btn { /* Base button styles */ }
  .btn-primary { /* Primary button */ }
  .btn-secondary { /* Secondary button */ }
  .btn-tertiary { /* Tertiary button */ }
}
```

**Usage**:
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-tertiary">Tertiary Button</button>
```

#### Header Styles
- Scroll state styling
- Expanded state styling
- Dark mode support

#### Icon Styles
- Light and bold stroke widths
- Menu toggle animations

#### FAQ Styles
- Collapsible details styling
- Summary styling with chevron
- Dark mode support

### Key Features
- Button component system
- Page background utilities
- Header navigation styles
- FAQ accordion styles
- Icon customization

---

## 2. glossary.css

**Location**: `apps/web/src/assets/styles/glossary.css`

**Purpose**: Base glossary term styling for glossary index pages.

### Key Features

#### Glossary Term Base Styling
- Dotted underline decoration
- Pointer cursor
- Focus states for accessibility
- Color transitions

#### Category-Specific Colors
Supports both class-based (legacy) and `data-cat` attribute (V2) formats:

**Categories**:
- Token (Yellow)
- Technology (Red)
- Governance (Purple)
- DeFi (Green)
- Network (Indigo)
- Economics (Pink)
- Tag (Gray)

#### Dark Mode Support
- All category colors have dark mode variants
- Consistent hover states

#### Tooltip Styling
- Positioning
- Dark mode support
- Mobile-specific positioning
- Spacing fixes

#### Restrictions
- Disabled in tables
- Disabled in headings (h1-h6)
- Only applies inside `.glossary-index` pages

### Usage
```html
<!-- Inside glossary index page -->
<div class="glossary-index">
  <a href="#" class="glossary-term" data-cat="token">Token Term</a>
  <span class="glossary-tip">Tooltip content</span>
</div>
```

### Specificity Rules
- High specificity selectors to override prose styles
- Supports both legacy classes and data attributes
- Context-aware (only applies in glossary-index)

---

## 3. glossary-article.css

**Location**: `apps/web/src/assets/styles/glossary-article.css`

**Purpose**: Glossary link styling for article pages (non-glossary pages).

### Key Features

#### Article Page Glossary Links
- Gray color (#AAAAAA) matching navigation
- Dotted underline
- Help cursor
- Category-specific hover colors

#### Category Hover Colors
On hover/focus, glossary links show category-specific colors:
- Token: #92400e (Yellow-800)
- DeFi: #166534 (Green-800)
- Governance: #6b21a8 (Purple-800)
- Technology: #991b1b (Red-800)
- Network: #3730a3 (Indigo-800)
- Economics: #be185d (Pink-800)
- Tag: #4b5563 (Gray-600)

#### Legacy V2 Support
- Maintains backward compatibility with `body.glossary-v2` class
- Similar styling with slight variations

### Usage
```html
<!-- In article content (not glossary-index) -->
<article class="prose">
  <p>This is a <a href="#" class="glossary" data-cat="token">token</a> link.</p>
</article>
```

### Key Differences from glossary.css
- Only applies outside `.glossary-index`
- Different default color (gray vs category colors)
- Category colors only on hover
- Higher specificity to override prose styles

---

## 4. glossary-index.css

**Location**: `apps/web/src/assets/styles/glossary-index.css`

**Purpose**: Glossary index page specific styles (V2).

### Key Features

#### Glossary Index Links
- Underline decoration
- Category-specific colors
- Hover effects

#### Category Colors
- Token: #92400e
- DeFi: #166534
- Governance: #6b21a8
- Technology: #1e40af (Note: Different from other files!)
- Network: #3730a3
- Economics: #be185d
- Tag: #4b5563

### Usage
```html
<!-- Inside glossary index page with V2 class -->
<body class="glossary-v2">
  <div class="glossary-index">
    <a href="#" class="glossary" data-cat="token">Token</a>
  </div>
</body>
```

### Notes
- Only applies when `body.glossary-v2` class is present
- Technology color differs from other files (#1e40af vs #991b1b)
- This may be a bug or intentional difference

---

## 5. glossary-popover.css

**Location**: `apps/web/src/assets/styles/glossary-popover.css`

**Purpose**: Glossary popover/tooltip component styling (V2).

### Key Features

#### Popover Container
- Fixed positioning
- Full viewport coverage
- Pointer events control
- Z-index: 60

#### Popover Card
- Positioned absolutely
- Max width: 28rem (92vw on mobile)
- Background from CSS variable
- Border and shadow
- Border radius: 12px
- Padding

#### Popover Content
- Title styling (font-weight: 700)
- Body text styling
- CTA link styling

#### Mobile Support
- Sheet mode on mobile (< 640px)
- Bottom positioning
- Backdrop overlay
- Full width

### Usage
```html
<!-- V2 popover structure -->
<body class="glossary-v2">
  <div class="g-pop" aria-hidden="true">
    <div class="g-pop__backdrop"></div>
    <div class="g-pop__card">
      <div class="g-pop__title">Term Title</div>
      <div class="g-pop__body">Definition content</div>
      <a href="#" class="g-pop__cta">Learn more</a>
      <button class="g-pop__close">×</button>
    </div>
  </div>
</body>
```

### Accessibility
- Uses `aria-hidden` for visibility control
- Keyboard accessible
- Reduced motion support

---

## 6. tokens-glossary.css

**Location**: `apps/web/src/assets/styles/tokens-glossary.css`

**Purpose**: CSS variables for glossary functionality.

### Key Features

#### Brand Colors
```css
--brand-red-400: #E3242D;
--brand-red-500: #d92378;
--brand-red-600: #c41e3a;
```

#### Link Colors
```css
--link-subtle-red: var(--brand-red-400);
--link-subtle-red-hover: var(--brand-red-500);
--link-subtle-red-visited: #8B1A1F;
```

#### Theme Colors
```css
--bg: #ffffff;
--text: #0f1226;
--muted: #5b6178;
--accent-400: #14b8a6;
--accent-500: #0ea5a3;
--accent-300: #2dd4bf;
```

#### Link Variables
```css
--link-action: var(--brand-red-500);
--link-action-hov: var(--brand-red-600);
--link-internal: #3b82f6;
--link-internal-hov: #2563eb;
```

#### Utility Variables
```css
--focus-ring: 2px solid #7dd3fc;
--glow: 0 0 0.35rem rgba(20, 184, 166, 0.5);
```

### Dark Mode
Uses `@media (prefers-color-scheme: dark)` instead of `.dark` class.

**Note**: This is inconsistent with the main variable system which uses `.dark` class.

### Usage
```css
.glossary-link {
  color: var(--link-subtle-red);
}
.glossary-link:hover {
  color: var(--link-subtle-red-hover);
}
```

---

## 7. CustomStyles.astro

**Location**: `apps/web/src/components/CustomStyles.astro`

**Purpose**: Inline global styles and CSS variable definitions.

### Key Features

#### CSS Variable Definitions
- Font variables
- Color variables (primary, secondary, accent)
- Text color variables
- Background color variables
- Link color variables

#### Selection Styling
```css
::selection {
  background-color: lavender; /* Light mode */
}
.dark ::selection {
  background-color: black;
  color: snow; /* Dark mode */
}
```

#### Link Styling Overrides
- Homepage text-link class
- Glossary "Learn More" section links
- Footer links
- Header navigation links
- Button exclusions

### Usage
Loaded automatically in `Layout.astro`:
```astro
---
import CustomStyles from '~/components/CustomStyles.astro';
---
<head>
  <CustomStyles />
</head>
```

### Important Notes
- Uses `is:inline is:global` attributes
- Styles are injected directly into HTML
- High specificity to override other styles
- Contains `!important` flags for critical overrides

---

## File Dependencies

```
tailwind.css
  └── Depends on: CSS variables from CustomStyles.astro

glossary.css
  └── Depends on: tailwind.css (for utilities)

glossary-article.css
  └── Depends on: glossary.css (for base styles)

glossary-index.css
  └── Depends on: glossary.css (for base styles)

glossary-popover.css
  └── Depends on: tokens-glossary.css (for variables)

tokens-glossary.css
  └── No dependencies

CustomStyles.astro
  └── No dependencies
```

## Best Practices

1. **Load Order**: Maintain the current loading order
2. **Specificity**: Use appropriate specificity levels
3. **Scoping**: Scope styles to appropriate contexts
4. **Variables**: Use CSS variables for themeable values
5. **Dark Mode**: Always provide dark mode support
6. **Documentation**: Document any custom styles added

## Common Issues

### Styles Not Applying
- Check file loading order
- Verify specificity is sufficient
- Ensure correct context/selector

### Dark Mode Not Working
- Check if using `.dark` class or `@media (prefers-color-scheme: dark)`
- Verify variables are defined for dark mode
- Test in both modes

### Conflicts Between Files
- Check specificity
- Verify scoping (e.g., `.glossary-index` vs `:not(.glossary-index)`)
- Review `!important` usage







