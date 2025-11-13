# Tailwind CSS Configuration

## Configuration File

**Location**: `apps/web/tailwind.config.cjs`

## Configuration Overview

### Content Sources

```javascript
content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']
```

Tailwind scans all these file types for class names to include in the generated CSS. This ensures that all components and pages are properly scanned.

### Theme Extensions

#### Colors

All colors are defined using CSS variables for theming support:

```javascript
colors: {
  primary: 'var(--aw-color-primary)',        // Brand red: rgb(227, 36, 45)
  secondary: 'var(--aw-color-secondary)',    // Secondary red: rgb(180, 29, 34)
  accent: 'var(--aw-color-accent)',          // Accent red: rgb(239, 68, 68)
  default: 'var(--aw-color-text-default)',   // Default text color
  muted: 'var(--aw-color-text-muted)',       // Muted text color
  link: 'var(--ph-color-link)',              // Link color: rgb(59 130 246)
}
```

**Usage**:
```html
<div class="bg-primary text-default">Content</div>
<button class="bg-accent hover:bg-secondary">Click</button>
<a class="text-link">Link</a>
```

#### Font Families

```javascript
fontFamily: {
  sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
  serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
  heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
}
```

**Usage**:
```html
<div class="font-sans">Sans serif text</div>
<h1 class="font-heading">Heading</h1>
```

All fonts use the Inter Variable font family defined in CSS variables.

### Typography Plugin Configuration

The `@tailwindcss/typography` plugin is configured with custom link colors:

#### Light Mode Prose Links

```javascript
typography: (theme) => ({
  DEFAULT: {
    css: {
      'a': {
        color: '#dc2626',        // red-600
        textDecoration: 'none',
        fontWeight: 'inherit',
        '&:hover': {
          color: '#ef4444',      // red-500 - lighter on hover
          textDecoration: 'underline',
        },
      },
      '--tw-prose-links': '#f87171',           // red-400
      '--tw-prose-links-hover': '#fca5a5',     // red-300
    },
  },
})
```

#### Dark Mode Prose Links

```javascript
invert: {
  css: {
    'a': {
      color: '#f87171',          // red-400
      textDecoration: 'none',
      '&:hover': {
        color: '#fca5a5',        // red-300
        textDecoration: 'underline',
      },
    },
  },
}
```

**Usage**:
```html
<article class="prose dark:prose-invert">
  <p>This is a <a href="#">link</a> in prose content.</p>
</article>
```

### Plugins

```javascript
plugins: [typography]
```

Only the Typography plugin is enabled. Other Tailwind plugins can be added here if needed.

### Dark Mode

```javascript
darkMode: 'class'
```

Dark mode is triggered by the `.dark` class on a parent element (typically `<html>`).

**Usage**:
```html
<html class="dark">
  <!-- Dark mode active -->
</html>
```

```html
<div class="bg-white dark:bg-gray-800">
  <!-- Light mode: white, Dark mode: gray-800 -->
</div>
```

## Astro Integration

### Configuration

**Location**: `apps/web/astro.config.mjs`

```javascript
tailwind({
  applyBaseStyles: false,
})
```

**Key Setting**: `applyBaseStyles: false`

This prevents Tailwind from injecting its default base styles. This gives you full control over base styles, but means you need to define base styles manually if needed.

### Why `applyBaseStyles: false`?

1. **Full Control**: Complete control over base styles
2. **CSS Variables**: Base styles are defined using CSS variables in `CustomStyles.astro`
3. **Custom Normalization**: Custom selection and other base styles
4. **Reduced Conflicts**: Prevents conflicts with existing styles

## VS Code Integration

**File**: `apps/web/vscode.tailwind.json`

This file provides IntelliSense support for Tailwind directives:
- `@tailwind`
- `@layer`
- `@apply`

## Build Process

1. **Development**: Tailwind processes CSS on-demand via Astro's Vite integration
2. **Production**: Tailwind generates optimized CSS during `astro build`
3. **Content Scanning**: Tailwind scans all content files to determine which classes to generate
4. **Purging**: Unused classes are automatically removed in production builds

## Custom Utilities and Components

Custom utilities and components are defined in `tailwind.css` using `@layer`:

### Utilities Layer
```css
@layer utilities {
  .bg-page {
    background-color: var(--aw-color-bg-page);
  }
  .text-page {
    color: var(--aw-color-text-page);
  }
}
```

### Components Layer
```css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-full ...;
  }
  .btn-primary {
    @apply btn font-semibold bg-primary text-white ...;
  }
}
```

## Common Tailwind Patterns Used

### Responsive Design
```html
<div class="w-full md:w-1/2 lg:w-1/3">
```

### Dark Mode
```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

### Hover States
```html
<button class="bg-red-600 hover:bg-red-700">
```

### Focus States
```html
<input class="focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
```

### Transitions
```html
<div class="transition-all duration-200 ease-in-out">
```

## Troubleshooting

### Classes Not Working
1. Check if the class is in a scanned file type
2. Verify the class name spelling
3. Check if the class is being purged (try adding it to a safelist if needed)
4. Ensure the file is being processed by Tailwind

### Dark Mode Not Working
1. Verify `.dark` class is on `<html>` or parent element
2. Check `darkMode: 'class'` is set in config
3. Ensure you're using `dark:` variant: `dark:bg-gray-800`

### Custom Colors Not Working
1. Verify CSS variables are defined in `CustomStyles.astro`
2. Check if variable names match: `--aw-color-primary` vs `primary`
3. Ensure variables are available in both light and dark modes

## Best Practices

1. **Use CSS Variables**: Prefer CSS variables for colors to support theming
2. **Use Tailwind Utilities First**: Only create custom components when needed
3. **Follow Naming Conventions**: Use consistent naming for custom utilities
4. **Document Custom Classes**: Document any custom classes you create
5. **Test Dark Mode**: Always test styles in both light and dark modes









