# CSS Architecture Overview

## Introduction

This document provides a comprehensive guide to the CSS architecture of the Soranauts web application. The application uses a hybrid approach combining **Tailwind CSS** for utility-first styling and **custom CSS** for complex component-specific styles, particularly for the glossary functionality.

## Architecture Summary

### Technology Stack
- **Framework**: Astro
- **CSS Framework**: Tailwind CSS v3.4.17
- **Tailwind Plugin**: @tailwindcss/typography v0.5.19
- **Build Tool**: Vite (via Astro)
- **PostCSS**: Yes (via Tailwind)

### Key Design Decisions

1. **Tailwind Integration**: Astro Tailwind integration with `applyBaseStyles: false` to prevent default base styles
2. **CSS Variables**: Extensive use of CSS custom properties for theming and color management
3. **Dark Mode**: Class-based dark mode (`.dark` class) implementation
4. **Layered Approach**: 
   - Tailwind utilities for common patterns
   - Custom components in `@layer components`
   - Custom utilities in `@layer utilities`
   - Feature-specific CSS files for complex functionality

## File Structure

```
apps/web/
├── tailwind.config.cjs          # Tailwind configuration
├── astro.config.mjs             # Astro config (Tailwind integration)
├── vscode.tailwind.json         # VS Code Tailwind IntelliSense config
└── src/
    ├── assets/
    │   └── styles/
    │       ├── tailwind.css          # Main Tailwind entry point
    │       ├── glossary.css          # Glossary term styling
    │       ├── glossary-article.css  # Article page glossary links
    │       ├── glossary-index.css    # Glossary index page styles
    │       ├── glossary-popover.css  # Glossary popover/tooltip styles
    │       └── tokens-glossary.css   # Glossary CSS variables
    └── components/
        └── CustomStyles.astro    # Inline global styles & CSS variables
```

## CSS Loading Order

The CSS files are loaded in this order (defined in `Layout.astro`):

1. `tailwind.css` - Tailwind base, components, and utilities
2. `glossary.css` - Base glossary term styling
3. `tokens-glossary.css` - Glossary CSS variables
4. `glossary-article.css` - Article page glossary links
5. `glossary-index.css` - Glossary index page styles
6. `glossary-popover.css` - Glossary popover/tooltip
7. `CustomStyles.astro` - Inline global styles (loaded via component)

**Important**: This loading order is critical for CSS specificity and cascade behavior.

## Style Priority System

1. **Tailwind Utilities** - Highest specificity utility classes
2. **Custom Components** - `@layer components` in `tailwind.css`
3. **Custom Utilities** - `@layer utilities` in `tailwind.css`
4. **Feature CSS Files** - Glossary-specific styles
5. **Inline Styles** - CustomStyles.astro inline styles

## Dark Mode Implementation

- **Mode**: Class-based (`darkMode: 'class'` in Tailwind config)
- **Trigger**: `.dark` class on `<html>` or parent element
- **Variables**: CSS variables change values in `.dark` context
- **Consistency**: All styles support dark mode via CSS variables or Tailwind dark: variant

## Key Features

### 1. CSS Variables System
- Centralized color and font definitions
- Theme-aware (light/dark mode)
- Used throughout Tailwind config and custom styles

### 2. Glossary Styling
- Complex color-coded category system
- Tooltip/popover functionality
- Multiple context-aware styles (article vs index pages)

### 3. Typography
- Tailwind Typography plugin for prose content
- Custom link colors configured
- Dark mode support

### 4. Button System
- Reusable button components via Tailwind classes
- Custom hover states
- Focus ring accessibility

## Common Patterns

### Using Tailwind Classes
```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
```

### Using CSS Variables
```css
color: var(--aw-color-primary);
background-color: var(--aw-color-bg-page);
```

### Custom Components
```html
<button class="btn btn-primary">Click me</button>
```

## Next Steps

- Read `01-TAILWIND-CONFIG.md` for Tailwind configuration details
- Read `02-CSS-VARIABLES.md` for the CSS variables system
- Read `03-CSS-FILES.md` for individual CSS file documentation
- Read `04-GLOSSARY-STYLES.md` for glossary styling details









