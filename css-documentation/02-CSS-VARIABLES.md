# CSS Variables System

## Overview

The application uses a comprehensive CSS variables system for theming, colors, fonts, and other design tokens. This allows for easy theme switching and consistent styling across the application.

## Variable Definition Locations

### Primary Location: `CustomStyles.astro`

All primary CSS variables are defined in `apps/web/src/components/CustomStyles.astro` in an inline `<style is:global>` block.

### Secondary Location: `tokens-glossary.css`

Glossary-specific CSS variables are defined in `apps/web/src/assets/styles/tokens-glossary.css`.

## Variable Categories

### 1. Font Variables

#### Light Mode
```css
:root {
  --aw-font-sans: 'Inter Variable';
  --aw-font-serif: var(--aw-font-sans);
  --aw-font-heading: var(--aw-font-sans);
}
```

#### Dark Mode
```css
.dark {
  --aw-font-sans: 'Inter Variable';
  --aw-font-serif: var(--aw-font-sans);
  --aw-font-heading: var(--aw-font-sans);
}
```

**Usage**:
- All fonts use the Inter Variable font family
- Fonts are consistent across light and dark modes
- Referenced in Tailwind config: `font-sans`, `font-serif`, `font-heading`

### 2. Color Variables - Primary Colors

#### Light Mode
```css
:root {
  --aw-color-primary: rgb(227, 36, 45);           /* Brand red */
  --aw-color-primary-hover: rgb(163, 24, 31);     /* Darker red for hover */
  --aw-color-secondary: rgb(180, 29, 34);         /* Secondary red */
  --aw-color-accent: rgb(239, 68, 68);            /* Accent red */
}
```

#### Dark Mode
```css
.dark {
  --aw-color-primary: rgb(227, 36, 45);           /* Same brand red */
  --aw-color-primary-hover: rgb(163, 24, 31);     /* Same hover red */
  --aw-color-secondary: rgb(180, 29, 34);         /* Same secondary red */
  --aw-color-accent: rgb(239, 68, 68);            /* Same accent red */
}
```

**Usage in Tailwind**:
```html
<div class="bg-primary">Primary background</div>
<button class="bg-secondary hover:bg-primary-hover">Button</button>
```

**Usage in CSS**:
```css
.button {
  background-color: var(--aw-color-primary);
}
.button:hover {
  background-color: var(--aw-color-primary-hover);
}
```

### 3. Color Variables - Text Colors

#### Light Mode
```css
:root {
  --aw-color-text-heading: rgb(0 0 0);            /* Black */
  --aw-color-text-default: rgb(16 16 16);         /* Dark gray */
  --aw-color-text-muted: rgb(16 16 16 / 66%);     /* Muted gray (66% opacity) */
}
```

#### Dark Mode
```css
.dark {
  --aw-color-text-heading: rgb(0 0 0);            /* Note: Still black - may be a bug */
  --aw-color-text-default: rgb(229 236 246);      /* Light gray */
  --aw-color-text-muted: rgb(229 236 246 / 66%);  /* Muted light gray */
}
```

**Usage in Tailwind**:
```html
<h1 class="text-default">Heading</h1>
<p class="text-muted">Muted text</p>
```

**Usage in CSS**:
```css
.text {
  color: var(--aw-color-text-default);
}
.muted-text {
  color: var(--aw-color-text-muted);
}
```

### 4. Color Variables - Background Colors

#### Light Mode
```css
:root {
  --aw-color-bg-page: rgb(255, 255, 255);         /* White */
  --aw-color-bg-page-dark: rgb(15, 15, 20);       /* Dark background (for dark mode) */
}
```

#### Dark Mode
```css
.dark {
  --aw-color-bg-page: var(--aw-color-bg-page-dark); /* Uses dark background */
  --aw-color-bg-page-dark: rgb(15, 15, 20);        /* Dark background */
}
```

**Usage in Tailwind**:
```html
<div class="bg-page">Page background</div>
```

**Usage in CSS**:
```css
.page {
  background-color: var(--aw-color-bg-page);
}
```

### 5. Color Variables - Link Colors

#### Light Mode
```css
:root {
  --ph-color-link: rgb(59 130 246);               /* Blue */
}
```

#### Dark Mode
```css
.dark {
  --ph-color-link: rgb(59 130 246);               /* Same blue */
}
```

**Usage in Tailwind**:
```html
<a class="text-link">Link</a>
```

### 6. Glossary Color Variables

Defined in `tokens-glossary.css`:

#### Light Mode
```css
:root {
  --brand-red-400: #E3242D;                       /* Link red */
  --brand-red-500: #d92378;                       /* Action red */
  --brand-red-600: #c41e3a;                       /* Visited red */
  
  --link-subtle-red: var(--brand-red-400);
  --link-subtle-red-hover: var(--brand-red-500);
  --link-subtle-red-visited: #8B1A1F;
  
  --bg: #ffffff;
  --text: #0f1226;
  --muted: #5b6178;
  --accent-400: #14b8a6;
  --accent-500: #0ea5a3;
  --accent-300: #2dd4bf;
  --link-action: var(--brand-red-500);
  --link-action-hov: var(--brand-red-600);
  --link-internal: #3b82f6;
  --link-internal-hov: #2563eb;
  --focus-ring: 2px solid #7dd3fc;
  --glow: 0 0 0.35rem rgba(20, 184, 166, 0.5);
}
```

#### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  :root,
  [data-theme="dark"] {
    --bg: #0b0f1a;
    --text: #e7eaf3;
    --muted: #aab1c6;
    --accent-400: #22d3ee;
    --accent-500: #06b6d4;
    --accent-300: #67e8f9;
    --link-internal: #60a5fa;
    --link-internal-hov: #3b82f6;
    --focus-ring: 2px solid #38bdf8;
    --glow: 0 0 0.45rem rgba(34, 211, 238, 0.55);
  }
}
```

**Note**: Glossary variables use `@media (prefers-color-scheme: dark)` instead of `.dark` class, which may cause inconsistencies.

## Variable Naming Conventions

### Pattern
- `--aw-color-*`: Main application colors (aw = AstroWind?)
- `--aw-font-*`: Font families
- `--ph-color-*`: Link colors (ph = Pagefind?)
- `--*`: Glossary-specific variables (no prefix)

### Structure
```
--[namespace]-[category]-[property]-[variant]
```

Examples:
- `--aw-color-primary` - Application color, primary
- `--aw-color-text-default` - Application color, text, default
- `--aw-font-sans` - Application font, sans serif
- `--ph-color-link` - Pagefind color, link

## Using Variables

### In CSS
```css
.my-component {
  color: var(--aw-color-text-default);
  background-color: var(--aw-color-bg-page);
  font-family: var(--aw-font-sans);
}
```

### In Tailwind Config
```javascript
colors: {
  primary: 'var(--aw-color-primary)',
  default: 'var(--aw-color-text-default)',
}
```

### In HTML/Tailwind Classes
```html
<div class="bg-primary text-default font-sans">
  Content
</div>
```

### In Inline Styles
```html
<div style="color: var(--aw-color-primary)">
  Content
</div>
```

## Variable Scoping

### Global Variables (`:root`)
- Available everywhere
- Can be overridden in specific contexts

### Context-Specific Variables (`.dark`)
- Override global variables when `.dark` class is present
- Same variable names, different values

## Important Notes

### 1. Dark Mode Inconsistency
- Main variables use `.dark` class selector
- Glossary variables use `@media (prefers-color-scheme: dark)`
- This can cause inconsistencies - consider standardizing

### 2. Text Heading Color
- `--aw-color-text-heading` is `rgb(0 0 0)` in both light and dark modes
- This appears to be a bug - should be light in dark mode

### 3. Variable Dependencies
- Some variables reference others: `--aw-color-bg-page: var(--aw-color-bg-page-dark)`
- Be careful when changing dependent variables

### 4. Fallback Values
- Variables don't have fallback values
- If a variable is undefined, the property won't apply
- Consider adding fallbacks: `var(--aw-color-primary, #E3242D)`

## Best Practices

1. **Always use variables**: Don't hardcode colors or fonts
2. **Use semantic names**: `--aw-color-primary` not `--aw-color-red`
3. **Define both modes**: Always define variables for light and dark modes
4. **Document variables**: Add comments explaining variable purposes
5. **Test both modes**: Always test variables in both light and dark modes
6. **Consistent naming**: Follow the established naming conventions

## Adding New Variables

### Step 1: Define in CustomStyles.astro
```css
:root {
  --aw-color-new-color: rgb(255, 0, 0);
}

.dark {
  --aw-color-new-color: rgb(255, 100, 100);
}
```

### Step 2: Add to Tailwind Config (if needed)
```javascript
colors: {
  'new-color': 'var(--aw-color-new-color)',
}
```

### Step 3: Use in Components
```html
<div class="bg-new-color">Content</div>
```

### Step 4: Document
Add the variable to this documentation file.




