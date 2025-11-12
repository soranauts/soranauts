# CSS Troubleshooting Guide

## Common Issues and Solutions

This document provides solutions to common CSS issues in the Soranauts application.

---

## Issue: Tailwind Classes Not Working

### Symptoms
- Tailwind utility classes don't apply styles
- Classes appear in HTML but have no effect
- Styles work in development but not production

### Possible Causes

1. **File Not Scanned by Tailwind**
   - File type not in `content` array
   - File path not matching pattern

2. **Class Name Typo**
   - Misspelled class name
   - Wrong variant syntax

3. **Purging Issues**
   - Class removed in production build
   - Dynamic class names not detected

### Solutions

#### Solution 1: Check Tailwind Config
```javascript
// tailwind.config.cjs
content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']
```

Verify your file type is included.

#### Solution 2: Verify Class Name
```html
<!-- Wrong -->
<div class="bg-red-600 text-wite">

<!-- Correct -->
<div class="bg-red-600 text-white">
```

#### Solution 3: Safelist Class (if needed)
```javascript
// tailwind.config.cjs
export default {
  safelist: [
    'bg-red-600',
    'text-white',
  ],
}
```

#### Solution 4: Use Square Brackets for Dynamic Classes
```html
<!-- Wrong -->
<div class={`bg-${color}-600`}>

<!-- Correct -->
<div class={color === 'red' ? 'bg-red-600' : 'bg-blue-600'}>
```

### Prevention
- Use Tailwind IntelliSense in VS Code
- Test in both development and production
- Check browser DevTools for applied styles

---

## Issue: Dark Mode Not Working

### Symptoms
- Dark mode toggle doesn't change styles
- Some elements change, others don't
- Dark mode colors incorrect

### Possible Causes

1. **Missing .dark Class**
   - `.dark` class not on `<html>` element
   - JavaScript toggle not working

2. **Wrong Dark Mode Selector**
   - Using `@media (prefers-color-scheme: dark)` instead of `.dark`
   - Inconsistent dark mode implementation

3. **CSS Variables Not Defined**
   - Missing dark mode variable definitions
   - Variables not updated in `.dark` context

### Solutions

#### Solution 1: Check .dark Class
```javascript
// Verify .dark class is present
console.log(document.documentElement.classList.contains('dark'));
```

#### Solution 2: Verify Dark Mode Config
```javascript
// tailwind.config.cjs
export default {
  darkMode: 'class',  // Must be 'class', not 'media'
}
```

#### Solution 3: Check CSS Variables
```css
/* CustomStyles.astro */
:root {
  --aw-color-bg-page: rgb(255, 255, 255);
}

.dark {
  --aw-color-bg-page: rgb(15, 15, 20);  /* Must be defined */
}
```

#### Solution 4: Use Correct Tailwind Variant
```html
<!-- Wrong -->
<div class="bg-white dark-mode:bg-gray-800">

<!-- Correct -->
<div class="bg-white dark:bg-gray-800">
```

### Prevention
- Always define dark mode variables
- Use `.dark` class consistently
- Test dark mode toggle functionality

---

## Issue: Glossary Styles Not Applying

### Symptoms
- Glossary terms don't have category colors
- Tooltips not appearing
- Styles work in one context but not another

### Possible Causes

1. **Wrong Context Selector**
   - Missing `.glossary-index` class
   - Wrong page context

2. **Missing Category Attribute**
   - `data-cat` attribute not present
   - Legacy class not applied

3. **Specificity Issues**
   - Other styles overriding glossary styles
   - Missing `!important` flag

4. **File Loading Order**
   - CSS files loaded in wrong order
   - Glossary styles overridden by later files

### Solutions

#### Solution 1: Verify Context
```html
<!-- Glossary Index Page -->
<body class="glossary-index">
  <a href="#" class="glossary-term" data-cat="token">Token</a>
</body>

<!-- Article Page -->
<body>
  <article>
    <a href="#" class="glossary" data-cat="token">Token</a>
  </article>
</body>
```

#### Solution 2: Check Category Attribute
```html
<!-- Wrong -->
<a href="#" class="glossary-term">Token</a>

<!-- Correct -->
<a href="#" class="glossary-term" data-cat="token">Token</a>
```

#### Solution 3: Verify File Loading Order
```astro
<!-- Layout.astro -->
---
import '~/assets/styles/tailwind.css';
import '~/assets/styles/glossary.css';
import '~/assets/styles/glossary-article.css';
// ... other files
---
```

#### Solution 4: Increase Specificity (if needed)
```css
/* Low specificity - may be overridden */
.glossary-term { color: red; }

/* High specificity - more reliable */
body:not(.glossary-index) main article .prose a.glossary-term[data-cat="token"] {
  color: #92400e !important;
}
```

### Prevention
- Use consistent context classes
- Always include category attributes
- Test in all contexts (index vs article)

---

## Issue: CSS Variables Not Working

### Symptoms
- Colors not applying
- Variables show as undefined
- Styles break when variables change

### Possible Causes

1. **Variable Not Defined**
   - Missing variable definition
   - Variable name typo

2. **Wrong Scope**
   - Variable defined in wrong scope
   - `.dark` class not present

3. **Fallback Missing**
   - No fallback value provided
   - Variable undefined causes property to fail

### Solutions

#### Solution 1: Verify Variable Definition
```css
/* CustomStyles.astro */
:root {
  --aw-color-primary: rgb(227, 36, 45);  /* Must be defined */
}

.dark {
  --aw-color-primary: rgb(227, 36, 45);  /* Also define for dark mode */
}
```

#### Solution 2: Check Variable Name
```css
/* Wrong */
color: var(--aw-color-primay);  /* Typo */

/* Correct */
color: var(--aw-color-primary);
```

#### Solution 3: Add Fallback Value
```css
/* Without fallback - fails if variable undefined */
color: var(--aw-color-primary);

/* With fallback - uses fallback if variable undefined */
color: var(--aw-color-primary, rgb(227, 36, 45));
```

#### Solution 4: Verify Scope
```css
/* Global scope */
:root {
  --aw-color-primary: rgb(227, 36, 45);
}

/* Component scope (may not be accessible elsewhere) */
.component {
  --component-color: red;
}
```

### Prevention
- Define variables in `:root` for global access
- Use consistent naming conventions
- Add fallback values for critical variables

---

## Issue: Styles Overriding Each Other

### Symptoms
- Expected styles not applying
- Styles change unexpectedly
- !important flags everywhere

### Possible Causes

1. **Specificity Conflicts**
   - Multiple selectors targeting same element
   - Higher specificity wins

2. **Loading Order**
   - Later files override earlier files
   - Wrong file order

3. **!important Overuse**
   - Too many !important flags
   - Hard to override when needed

### Solutions

#### Solution 1: Understand Specificity
```css
/* Specificity: 1 (element) */
div { color: red; }

/* Specificity: 10 (class) */
.text { color: blue; }  /* Wins */

/* Specificity: 100 (ID) */
#content { color: green; }  /* Wins */

/* Specificity: 1000 (inline) */
<div style="color: yellow;">  /* Wins */
```

#### Solution 2: Use Correct Load Order
```astro
<!-- Load in order of specificity needs -->
import '~/assets/styles/tailwind.css';      /* Base utilities */
import '~/assets/styles/glossary.css';      /* Base glossary */
import '~/assets/styles/glossary-article.css';  /* Specific overrides */
```

#### Solution 3: Reduce !important Usage
```css
/* Bad - too many !important */
.text { color: red !important; }
.button { background: blue !important; }

/* Good - use specificity instead */
.content .text { color: red; }
.container .button { background: blue; }
```

#### Solution 4: Use CSS Layers (Future)
```css
/* Define layer order */
@layer base, components, utilities;

/* Styles in later layers override earlier */
@layer components {
  .btn { color: blue; }
}

@layer utilities {
  .btn { color: red; }  /* Wins */
}
```

### Prevention
- Use appropriate specificity levels
- Maintain consistent file loading order
- Avoid !important unless absolutely necessary

---

## Issue: Performance Problems

### Symptoms
- Slow page loads
- Large CSS file sizes
- Flash of unstyled content (FOUC)

### Possible Causes

1. **Unused CSS**
   - Too many unused Tailwind classes
   - Unused custom styles

2. **Large CSS Files**
   - Multiple large CSS files
   - No minification

3. **Render Blocking**
   - CSS blocking page render
   - No critical CSS extraction

### Solutions

#### Solution 1: Enable Tailwind Purging
```javascript
// tailwind.config.cjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // Purging is automatic in production
}
```

#### Solution 2: Minify CSS
```javascript
// astro.config.mjs
export default {
  vite: {
    build: {
      cssMinify: true,  // Minify CSS in production
    },
  },
}
```

#### Solution 3: Extract Critical CSS
```astro
<!-- Inline critical CSS -->
<style is:inline>
  /* Critical above-the-fold styles */
</style>

<!-- Defer non-critical CSS -->
<link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

#### Solution 4: Reduce File Count
```css
/* Combine similar CSS files if possible */
/* Reduce duplication */
/* Use CSS variables for common values */
```

### Prevention
- Regularly audit CSS file sizes
- Remove unused styles
- Optimize for production builds

---

## Issue: Responsive Styles Not Working

### Symptoms
- Mobile styles not applying
- Breakpoints not working
- Styles apply on wrong screen sizes

### Possible Causes

1. **Wrong Breakpoint**
   - Using incorrect Tailwind breakpoint
   - Custom breakpoint not defined

2. **Viewport Meta Tag**
   - Missing viewport meta tag
   - Incorrect viewport settings

3. **Media Query Issues**
   - Custom media queries conflicting
   - Wrong syntax

### Solutions

#### Solution 1: Check Tailwind Breakpoints
```html
<!-- Tailwind default breakpoints -->
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  <!-- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px -->
</div>
```

#### Solution 2: Verify Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### Solution 3: Check Custom Media Queries
```css
/* Wrong */
@media (max-width: 768px) {
  .mobile { display: block; }
}

/* Correct */
@media (max-width: 767px) {
  .mobile { display: block; }
}
```

### Prevention
- Always include viewport meta tag
- Test on actual devices
- Use Tailwind responsive utilities

---

## Debugging Tips

### 1. Browser DevTools
- Inspect element to see applied styles
- Check computed styles
- View CSS cascade
- Test media queries

### 2. CSS Validation
- Validate CSS syntax
- Check for typos
- Verify selectors

### 3. Console Logging
```javascript
// Check if class is present
console.log(element.classList.contains('dark'));

// Check computed styles
console.log(getComputedStyle(element).color);

// Check CSS variables
console.log(getComputedStyle(document.documentElement)
  .getPropertyValue('--aw-color-primary'));
```

### 4. Temporary Debug Styles
```css
/* Add temporary border to see element */
.debug {
  border: 2px solid red !important;
}
```

## Getting Help

If you can't resolve an issue:

1. **Check Documentation**: Review relevant documentation files
2. **Search Issues**: Check if issue is known
3. **Create Minimal Reproduction**: Isolate the problem
4. **Document Context**: Note browser, screen size, etc.
5. **Ask for Help**: Provide detailed information








