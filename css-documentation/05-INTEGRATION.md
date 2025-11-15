# CSS Integration Guide

## How Everything Works Together

This document explains how all the CSS components integrate and work together in the application.

## Integration Flow

### 1. Build Time

```
Astro Build Process
  ├── Tailwind CSS Processing
  │   ├── Scans content files for classes
  │   ├── Generates utility classes
  │   ├── Processes @tailwind directives
  │   └── Applies custom theme config
  │
  ├── PostCSS Processing
  │   ├── Processes CSS files
  │   ├── Applies Tailwind transformations
  │   └── Optimizes output
  │
  └── Vite Bundling
      ├── Bundles CSS files
      ├── Minifies production CSS
      └── Injects into HTML
```

### 2. Runtime (Development)

```
Browser Request
  ├── HTML Loads
  │   └── Layout.astro renders
  │
  ├── CSS Files Load (in order)
  │   1. tailwind.css (via import)
  │   2. glossary.css (via import)
  │   3. tokens-glossary.css (via import)
  │   4. glossary-article.css (via import)
  │   5. glossary-index.css (via import)
  │   6. glossary-popover.css (via import)
  │   7. CustomStyles.astro (via component)
  │
  └── JavaScript Enhances
      ├── Dark mode toggle
      ├── Glossary tooltips
      └── Interactive components
```

## File Dependencies

### Dependency Graph

```
CustomStyles.astro (CSS Variables)
  │
  ├──→ tailwind.config.cjs (Theme Config)
  │     │
  │     └──→ tailwind.css (Generated Utilities)
  │           │
  │           ├──→ All Components (Using Tailwind Classes)
  │           │
  │           └──→ glossary.css (Uses Tailwind Utilities)
  │                 │
  │                 ├──→ glossary-article.css (Extends glossary.css)
  │                 │
  │                 └──→ glossary-index.css (Extends glossary.css)
  │
  └──→ tokens-glossary.css (Glossary Variables)
        │
        └──→ glossary-popover.css (Uses Glossary Variables)
```

## CSS Cascade and Specificity

### Specificity Hierarchy

1. **Inline Styles** (1000) - Highest
2. **ID Selectors** (100)
3. **Class Selectors** (10)
4. **Element Selectors** (1)

### Application-Specific Cascade

```
CustomStyles.astro (Inline Global)
  ↓ (Highest specificity - !important flags)
glossary-popover.css
  ↓
glossary-index.css
  ↓
glossary-article.css
  ↓
glossary.css
  ↓
tokens-glossary.css
  ↓
tailwind.css (Utilities)
  ↓ (Lowest specificity)
Browser Defaults
```

### Specificity Examples

```css
/* Low Specificity - Tailwind Utility */
.text-red-600 { color: #dc2626; }  /* Specificity: 10 */

/* Medium Specificity - Custom Component */
.btn-primary { color: white; }  /* Specificity: 10 */

/* High Specificity - Glossary Article */
body:not(.glossary-index) main article .prose a.glossary[data-cat="token"]:hover {
  color: #92400e !important;  /* Specificity: 134 + !important */
}

/* Highest Specificity - Inline Styles */
<style is:inline>
  a.text-link {
    color: #dc2626 !important;  /* Specificity: 11 + !important */
  }
</style>
```

## Tailwind and Custom CSS Interaction

### How They Work Together

1. **Tailwind Provides Utilities**
   ```html
   <div class="bg-white dark:bg-gray-800 rounded-lg">
   ```

2. **Custom CSS Extends Tailwind**
   ```css
   @layer components {
     .btn {
       @apply bg-primary text-white rounded-full;
     }
   }
   ```

3. **Custom CSS Overrides When Needed**
   ```css
   .glossary-term {
     /* Overrides Tailwind prose link styles */
     color: #AAAAAA !important;
   }
   ```

### Conflict Resolution

#### Scenario 1: Tailwind vs Custom CSS
```html
<div class="text-red-600 custom-text-blue">
```
- **Winner**: Last loaded CSS (custom-text-blue)
- **Solution**: Use Tailwind's `@apply` or higher specificity

#### Scenario 2: Multiple Custom CSS Files
```css
/* glossary.css */
.glossary-term { color: red; }

/* glossary-article.css */
.glossary-term { color: blue; }
```
- **Winner**: Last loaded file (glossary-article.css)
- **Solution**: Use more specific selectors or load order

#### Scenario 3: !important Flags
```css
.text-red-600 { color: #dc2626; }
.custom { color: blue !important; }
```
- **Winner**: !important always wins
- **Solution**: Avoid !important unless necessary

## Dark Mode Integration

### How Dark Mode Works

1. **Toggle Mechanism** (JavaScript)
   ```javascript
   // Adds/removes .dark class on <html>
   document.documentElement.classList.toggle('dark');
   ```

2. **CSS Variable Updates** (CustomStyles.astro)
   ```css
   :root {
     --aw-color-bg-page: rgb(255, 255, 255);
   }
   .dark {
     --aw-color-bg-page: rgb(15, 15, 20);
   }
   ```

3. **Tailwind Dark Mode** (tailwind.config.cjs)
   ```css
   .bg-white { background-color: white; }
   .dark .bg-white { background-color: white; }  /* Doesn't change */
   .dark .bg-gray-800 { background-color: #1f2937; }  /* Changes */
   ```

4. **Custom CSS Dark Mode** (glossary.css)
   ```css
   .glossary-term { color: #1f2937; }
   .dark .glossary-term { color: #f9fafb; }
   ```

### Dark Mode Inconsistency

**Problem**: Glossary variables use `@media (prefers-color-scheme: dark)` instead of `.dark` class.

**Impact**: Glossary styles may not match site dark mode toggle.

**Solution**: Standardize on `.dark` class for consistency.

## Component Integration

### Astro Components

```astro
---
// Component file
import '~/assets/styles/tailwind.css';
---

<div class="bg-primary text-white">
  Content
</div>
```

### React Components

```tsx
// React component
export function Button() {
  return (
    <button className="btn btn-primary">
      Click me
    </button>
  );
}
```

### Markdown/MDX Content

```markdown
<!-- Markdown content -->
This is a [glossary term](/glossary/term) with styling.
```

Processed by:
1. Remark plugins (adds glossary classes)
2. Rehype plugins (adds prose classes)
3. CSS applies styles

## Build Optimization

### Production Build

1. **Tailwind Purging**
   - Removes unused utility classes
   - Reduces CSS file size
   - Scans all content files

2. **CSS Minification**
   - Removes whitespace
   - Optimizes selectors
   - Combines rules

3. **Asset Optimization**
   - Inlines critical CSS
   - Defers non-critical CSS
   - Compresses assets

### Development Build

1. **Full CSS Generation**
   - All Tailwind utilities available
   - Source maps enabled
   - Hot module replacement

2. **Fast Refresh**
   - CSS changes apply instantly
   - No full page reload
   - Maintains state

## Testing Integration

### Manual Testing Checklist

- [ ] All CSS files load in correct order
- [ ] Tailwind utilities work
- [ ] Custom components work
- [ ] Glossary styles work in all contexts
- [ ] Dark mode works correctly
- [ ] Responsive styles work
- [ ] No CSS conflicts
- [ ] Performance is acceptable

### Automated Testing

```javascript
// Example: Test CSS class exists
expect(document.querySelector('.btn-primary')).toBeTruthy();

// Example: Test CSS variable exists
const styles = getComputedStyle(document.documentElement);
expect(styles.getPropertyValue('--aw-color-primary')).toBe('rgb(227, 36, 45)');
```

## Troubleshooting Integration Issues

### Issue: Styles Not Applying

**Check**:
1. CSS file loading order
2. Specificity conflicts
3. File paths correct
4. Build process completed

### Issue: Dark Mode Not Working

**Check**:
1. `.dark` class on `<html>`
2. CSS variables defined for dark mode
3. Tailwind `dark:` variants used correctly
4. No conflicting media queries

### Issue: Glossary Styles Conflicting

**Check**:
1. Correct context selectors
2. File loading order
3. Specificity levels
4. Category attributes present

### Issue: Build Size Too Large

**Check**:
1. Tailwind purging enabled
2. Unused CSS removed
3. CSS minification enabled
4. No duplicate styles

## Best Practices for Integration

1. **Load Order**: Maintain consistent CSS file loading order
2. **Specificity**: Use appropriate specificity levels
3. **Variables**: Use CSS variables for themeable values
4. **Dark Mode**: Always test both light and dark modes
5. **Performance**: Minimize CSS file size and count
6. **Documentation**: Document any integration changes
7. **Testing**: Test all integration points

## Future Improvements

1. **CSS Modules**: Consider CSS modules for component isolation
2. **PostCSS Plugins**: Add useful PostCSS plugins
3. **CSS-in-JS**: Evaluate CSS-in-JS for complex components
4. **Critical CSS**: Implement critical CSS extraction
5. **CSS Architecture**: Refactor to reduce complexity










