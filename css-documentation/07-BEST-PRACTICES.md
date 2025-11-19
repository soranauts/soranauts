# CSS Best Practices

## General Principles

### 1. Use Tailwind First

Prefer Tailwind utility classes over custom CSS when possible.

```html
<!-- Good - Tailwind utilities -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">

<!-- Bad - Custom CSS for simple styles -->
<div class="custom-card">
```

**Exception**: Use custom CSS for complex components or when Tailwind doesn't provide the needed functionality.

### 2. Use CSS Variables for Theming

Always use CSS variables for themeable values (colors, fonts, spacing).

```css
/* Good - CSS variable */
.button {
  background-color: var(--aw-color-primary);
}

/* Bad - Hardcoded color */
.button {
  background-color: rgb(227, 36, 45);
}
```

### 3. Maintain Consistent Naming

Follow established naming conventions.

```css
/* Good - Consistent naming */
--aw-color-primary
--aw-color-secondary
--aw-font-sans

/* Bad - Inconsistent naming */
--primary-color
--secondaryColor
--fontSans
```

### 4. Support Dark Mode

Always provide dark mode support for custom styles.

```css
/* Good - Dark mode support */
.component {
  background-color: var(--aw-color-bg-page);
  color: var(--aw-color-text-default);
}

/* Also define dark mode variables */
.dark {
  --aw-color-bg-page: rgb(15, 15, 20);
  --aw-color-text-default: rgb(229, 236, 246);
}
```

### 5. Use Appropriate Specificity

Use the lowest specificity that works.

```css
/* Good - Low specificity */
.button { color: blue; }

/* Bad - Unnecessarily high specificity */
body > div > .container > .button { color: blue; }
```

---

## Tailwind-Specific Practices

### 1. Use Tailwind Variants

Prefer Tailwind's built-in variants over custom media queries.

```html
<!-- Good - Tailwind responsive variant -->
<div class="w-full md:w-1/2 lg:w-1/3">

<!-- Bad - Custom media query -->
<div class="responsive-width">
```

### 2. Use @apply for Repeated Patterns

Use `@apply` for patterns that repeat but aren't worth a full component.

```css
/* Good - @apply for repeated pattern */
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-4;
}

/* Bad - Repeated classes everywhere */
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
```

### 3. Organize Custom Utilities

Place custom utilities in the `@layer utilities` block.

```css
/* Good - Organized in utilities layer */
@layer utilities {
  .bg-page {
    background-color: var(--aw-color-bg-page);
  }
}
```

### 4. Use Tailwind Config for Extensions

Extend Tailwind theme instead of overriding.

```javascript
// Good - Extend theme
theme: {
  extend: {
    colors: {
      primary: 'var(--aw-color-primary)',
    },
  },
}

// Bad - Override entire theme
theme: {
  colors: {
    // Loses all default colors
  },
}
```

---

## CSS File Organization

### 1. Single Responsibility

Each CSS file should have a single, clear purpose.

```
tailwind.css - Tailwind directives and custom utilities/components
glossary.css - Glossary term styling
glossary-article.css - Article page glossary links
glossary-index.css - Glossary index page styles
glossary-popover.css - Glossary popover component
tokens-glossary.css - Glossary CSS variables
```

### 2. Logical Grouping

Group related styles together.

```css
/* Good - Grouped by function */
/* Button Styles */
.btn { /* ... */ }
.btn-primary { /* ... */ }

/* Header Styles */
#header { /* ... */ }
#header.scroll { /* ... */ }
```

### 3. Consistent File Structure

Follow a consistent structure within files.

```css
/* 1. Imports/Directives */
@tailwind base;
@tailwind components;

/* 2. Variables (if any) */
:root { /* ... */ }

/* 3. Utilities Layer */
@layer utilities { /* ... */ }

/* 4. Components Layer */
@layer components { /* ... */ }

/* 5. Custom Styles */
.custom-style { /* ... */ }
```

---

## CSS Variables Best Practices

### 1. Define in :root

Define global variables in `:root` for accessibility.

```css
/* Good - Global scope */
:root {
  --aw-color-primary: rgb(227, 36, 45);
}

/* Bad - Component scope (not accessible elsewhere) */
.component {
  --component-color: red;
}
```

### 2. Use Semantic Names

Use semantic names that describe purpose, not appearance.

```css
/* Good - Semantic naming */
--aw-color-primary
--aw-color-text-default
--aw-color-bg-page

/* Bad - Appearance-based naming */
--aw-color-red
--aw-color-dark-gray
--aw-color-white
```

### 3. Provide Fallbacks

Provide fallback values for critical variables.

```css
/* Good - With fallback */
color: var(--aw-color-primary, rgb(227, 36, 45));

/* Bad - No fallback */
color: var(--aw-color-primary);
```

### 4. Document Variables

Document the purpose and usage of variables.

```css
/* Good - Documented */
/* Primary brand color - used for buttons and accents */
--aw-color-primary: rgb(227, 36, 45);

/* Bad - Undocumented */
--aw-color-primary: rgb(227, 36, 45);
```

---

## Specificity Best Practices

### 1. Start Low, Increase as Needed

Start with low specificity and increase only when necessary.

```css
/* Good - Low specificity */
.button { color: blue; }

/* Only increase if needed */
.container .button { color: blue; }
```

### 2. Avoid !important

Avoid `!important` unless absolutely necessary.

```css
/* Good - Use specificity */
.content .link { color: blue; }

/* Bad - Use !important */
.link { color: blue !important; }
```

### 3. Use Specificity Calculators

Use tools to calculate and compare specificity.

- Online calculators
- Browser DevTools
- CSS linting tools

### 4. Document High Specificity

Document why high specificity is needed.

```css
/* High specificity needed to override Tailwind Typography prose styles */
body:not(.glossary-index) main article .prose a.glossary[data-cat="token"]:hover {
  color: #92400e !important;
}
```

---

## Performance Best Practices

### 1. Minimize CSS File Size

Keep CSS files as small as possible.

- Remove unused styles
- Enable Tailwind purging
- Minify production CSS
- Combine files when possible

### 2. Optimize Selectors

Use efficient selectors.

```css
/* Good - Efficient selector */
.button { color: blue; }

/* Bad - Inefficient selector */
div > div > div > .button { color: blue; }
```

### 3. Avoid Deep Nesting

Avoid deep nesting in CSS.

```css
/* Good - Flat structure */
.button { }
.button-primary { }
.button-secondary { }

/* Bad - Deep nesting */
.container {
  .content {
    .section {
      .button { }
    }
  }
}
```

### 4. Use CSS Containment

Use CSS containment for isolated components.

```css
.component {
  contain: layout style paint;
}
```

---

## Accessibility Best Practices

### 1. Provide Focus States

Always provide visible focus states.

```css
.button:focus {
  outline: 2px solid var(--aw-color-primary);
  outline-offset: 2px;
}
```

### 2. Support Reduced Motion

Respect user motion preferences.

```css
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    transition: none;
  }
}
```

### 3. Maintain Color Contrast

Ensure sufficient color contrast ratios.

- Text: 4.5:1 for normal text, 3:1 for large text
- UI components: 3:1 for interactive elements
- Use contrast checking tools

### 4. Test with Screen Readers

Test styles with screen readers to ensure they don't interfere.

---

## Maintenance Best Practices

### 1. Document Changes

Document any CSS changes you make.

```css
/* Added 2024-01-15: Fix glossary link colors in article pages */
/* Updated 2024-01-20: Adjust dark mode colors for better contrast */
```

### 2. Use Version Control

Use version control to track CSS changes.

- Commit frequently
- Write descriptive commit messages
- Review changes before merging

### 3. Regular Audits

Regularly audit CSS for:

- Unused styles
- Duplicate styles
- Performance issues
- Accessibility issues

### 4. Refactor When Needed

Refactor CSS when it becomes:

- Too complex
- Too large
- Hard to maintain
- Performance bottleneck

---

## Testing Best Practices

### 1. Test in Multiple Browsers

Test styles in multiple browsers:

- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

### 2. Test Responsive Design

Test at various screen sizes:

- Mobile (320px - 640px)
- Tablet (641px - 1024px)
- Desktop (1025px+)

### 3. Test Dark Mode

Always test both light and dark modes.

### 4. Test Interactions

Test interactive states:

- Hover
- Focus
- Active
- Disabled

---

## Common Anti-Patterns to Avoid

### 1. Inline Styles

Avoid inline styles in production code.

```html
<!-- Bad - Inline styles -->
<div style="color: red; background: blue;">

<!-- Good - Use classes -->
<div class="text-red-600 bg-blue-600">
```

### 2. Magic Numbers

Avoid magic numbers without explanation.

```css
/* Bad - Magic number */
.margin { margin: 17px; }

/* Good - Explained or using standard value */
.margin { margin: 1rem; }  /* Standard spacing unit */
```

### 3. Over-Nesting

Avoid excessive nesting.

```css
/* Bad - Over-nested */
.container .content .section .article .paragraph .link { }

/* Good - Flat */
.article-link { }
```

### 4. Duplicate Styles

Avoid duplicating styles across files.

```css
/* Bad - Duplicate */
/* file1.css */
.button { color: blue; }

/* file2.css */
.button { color: blue; }

/* Good - Single definition */
/* shared.css */
.button { color: blue; }
```

---

## Conclusion

Following these best practices will help you:

- Write maintainable CSS
- Avoid common pitfalls
- Improve performance
- Ensure accessibility
- Facilitate collaboration

Remember: CSS is a tool, and like any tool, it's most effective when used correctly and consistently.













