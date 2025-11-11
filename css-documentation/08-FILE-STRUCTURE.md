# CSS File Structure Reference

## Complete File Tree

```
soranauts/
├── apps/
│   └── web/
│       ├── tailwind.config.cjs          # Tailwind configuration
│       ├── astro.config.mjs             # Astro config (Tailwind integration)
│       ├── vscode.tailwind.json         # VS Code Tailwind IntelliSense
│       ├── package.json                 # Dependencies
│       │
│       └── src/
│           ├── assets/
│           │   └── styles/
│           │       ├── tailwind.css              # Main Tailwind entry point
│           │       ├── glossary.css              # Glossary term styling
│           │       ├── glossary-article.css      # Article page glossary links
│           │       ├── glossary-index.css        # Glossary index page styles
│           │       ├── glossary-popover.css      # Glossary popover/tooltip
│           │       └── tokens-glossary.css       # Glossary CSS variables
│           │
│           ├── components/
│           │   └── CustomStyles.astro    # Inline global styles & CSS variables
│           │
│           └── layouts/
│               └── Layout.astro          # Main layout (loads CSS files)
```

## File Descriptions

### Configuration Files

#### `tailwind.config.cjs`
- **Purpose**: Tailwind CSS configuration
- **Location**: `apps/web/tailwind.config.cjs`
- **Key Settings**:
  - Content sources
  - Theme extensions (colors, fonts)
  - Typography plugin config
  - Dark mode: 'class'
- **Dependencies**: None
- **Used By**: Tailwind CSS processor

#### `astro.config.mjs`
- **Purpose**: Astro configuration including Tailwind integration
- **Location**: `apps/web/astro.config.mjs`
- **Key Settings**:
  - Tailwind integration: `applyBaseStyles: false`
  - Vite configuration
  - Build settings
- **Dependencies**: None
- **Used By**: Astro build process

#### `vscode.tailwind.json`
- **Purpose**: VS Code IntelliSense configuration for Tailwind
- **Location**: `apps/web/vscode.tailwind.json`
- **Key Settings**:
  - Tailwind directives
  - @layer support
  - @apply support
- **Dependencies**: None
- **Used By**: VS Code editor

### CSS Files

#### `tailwind.css`
- **Purpose**: Main Tailwind CSS entry point
- **Location**: `apps/web/src/assets/styles/tailwind.css`
- **Contents**:
  - `@tailwind base;`
  - `@tailwind components;`
  - `@tailwind utilities;`
  - Custom utilities layer
  - Custom components layer
  - Header styles
  - Icon styles
  - FAQ styles
- **Dependencies**: CSS variables from CustomStyles.astro
- **Used By**: All components

#### `glossary.css`
- **Purpose**: Base glossary term styling
- **Location**: `apps/web/src/assets/styles/glossary.css`
- **Contents**:
  - Glossary term base styles
  - Category-specific colors
  - Dark mode support
  - Tooltip styling
  - Restricted contexts (tables, headings)
- **Dependencies**: tailwind.css
- **Used By**: Glossary index pages

#### `glossary-article.css`
- **Purpose**: Glossary link styling for article pages
- **Location**: `apps/web/src/assets/styles/glossary-article.css`
- **Contents**:
  - Article page glossary links
  - Category hover colors
  - Legacy V2 support
- **Dependencies**: glossary.css
- **Used By**: Article pages (non-glossary)

#### `glossary-index.css`
- **Purpose**: Glossary index page specific styles (V2)
- **Location**: `apps/web/src/assets/styles/glossary-index.css`
- **Contents**:
  - Glossary index link styles
  - Category colors for index
- **Dependencies**: glossary.css
- **Used By**: Glossary index pages with V2 class

#### `glossary-popover.css`
- **Purpose**: Glossary popover/tooltip component styling
- **Location**: `apps/web/src/assets/styles/glossary-popover.css`
- **Contents**:
  - Popover container
  - Popover card
  - Mobile sheet mode
  - Accessibility styles
- **Dependencies**: tokens-glossary.css
- **Used By**: Glossary popover component

#### `tokens-glossary.css`
- **Purpose**: CSS variables for glossary functionality
- **Location**: `apps/web/src/assets/styles/tokens-glossary.css`
- **Contents**:
  - Brand colors
  - Link colors
  - Theme colors
  - Utility variables (focus-ring, glow)
  - Dark mode variables
- **Dependencies**: None
- **Used By**: Glossary popover, glossary components

### Component Files

#### `CustomStyles.astro`
- **Purpose**: Inline global styles and CSS variable definitions
- **Location**: `apps/web/src/components/CustomStyles.astro`
- **Contents**:
  - Font variable definitions
  - Color variable definitions (primary, secondary, accent)
  - Text color variables
  - Background color variables
  - Link color variables
  - Selection styling
  - Link styling overrides
- **Dependencies**: None
- **Used By**: All components (via Layout.astro)

#### `Layout.astro`
- **Purpose**: Main layout component that loads CSS files
- **Location**: `apps/web/src/layouts/Layout.astro`
- **Key Function**: Imports and loads all CSS files in correct order
- **CSS Loading Order**:
  1. tailwind.css
  2. glossary.css
  3. tokens-glossary.css
  4. glossary-article.css
  5. glossary-index.css
  6. glossary-popover.css
  7. CustomStyles.astro (via component)

## File Relationships

### Dependency Graph

```
CustomStyles.astro
  ├──→ Defines CSS variables
  │
  ├──→ Used by tailwind.config.cjs (theme config)
  │     └──→ Used by tailwind.css (generated utilities)
  │           └──→ Used by all components
  │
  └──→ Used by glossary.css (via CSS variables)
        ├──→ Used by glossary-article.css
        └──→ Used by glossary-index.css

tokens-glossary.css
  └──→ Used by glossary-popover.css

Layout.astro
  └──→ Loads all CSS files in order
```

### Import Chain

```
Layout.astro
  ├── import '~/assets/styles/tailwind.css'
  ├── import '~/assets/styles/glossary.css'
  ├── import '~/assets/styles/tokens-glossary.css'
  ├── import '~/assets/styles/glossary-article.css'
  ├── import '~/assets/styles/glossary-index.css'
  ├── import '~/assets/styles/glossary-popover.css'
  └── import CustomStyles from '~/components/CustomStyles.astro'
```

## File Sizes (Approximate)

Based on typical production builds:

- `tailwind.css`: ~50-100KB (production, purged)
- `glossary.css`: ~10-15KB
- `glossary-article.css`: ~8-12KB
- `glossary-index.css`: ~1-2KB
- `glossary-popover.css`: ~2-3KB
- `tokens-glossary.css`: ~1-2KB
- `CustomStyles.astro`: ~2-3KB (inline)

**Total**: ~75-135KB (production, minified)

## File Modification Guidelines

### When to Modify Each File

#### `tailwind.config.cjs`
- Add new theme extensions
- Modify content sources
- Add Tailwind plugins
- Change dark mode strategy

#### `tailwind.css`
- Add custom utilities
- Add custom components
- Modify header/styles
- Add global styles

#### `glossary.css`
- Modify glossary term styling
- Change category colors
- Update tooltip styles
- Modify restricted contexts

#### `glossary-article.css`
- Modify article page glossary links
- Change hover colors
- Update legacy V2 styles

#### `glossary-index.css`
- Modify glossary index page styles
- Change index-specific colors

#### `glossary-popover.css`
- Modify popover component
- Change positioning
- Update mobile styles

#### `tokens-glossary.css`
- Add/remove glossary variables
- Modify glossary color values
- Update dark mode variables

#### `CustomStyles.astro`
- Add/modify CSS variables
- Change base styles
- Update selection styles
- Modify link overrides

### Modification Checklist

Before modifying any CSS file:

- [ ] Understand the file's purpose
- [ ] Check dependencies
- [ ] Verify loading order
- [ ] Test in both light and dark modes
- [ ] Test in all contexts (glossary index vs article)
- [ ] Check for conflicts with other files
- [ ] Test responsive design
- [ ] Verify accessibility
- [ ] Document changes

## Adding New Files

### When to Create a New File

Create a new CSS file when:

1. **New Feature**: Adding a new feature with significant styling
2. **Isolation**: Need to isolate styles from existing files
3. **Organization**: Large amount of related styles
4. **Conditional Loading**: Styles only needed in specific contexts

### How to Add a New File

1. **Create File**
   ```
   apps/web/src/assets/styles/new-feature.css
   ```

2. **Add to Layout.astro**
   ```astro
   ---
   import '~/assets/styles/tailwind.css';
   import '~/assets/styles/new-feature.css';
   // ... other imports
   ---
   ```

3. **Document Purpose**
   - Add comments in file
   - Update this documentation
   - Note dependencies

4. **Test**
   - Verify loading order
   - Test in all contexts
   - Check for conflicts

## File Naming Conventions

### Current Conventions

- **Feature-based**: `glossary-*.css`
- **Purpose-based**: `tokens-*.css`
- **Main file**: `tailwind.css`
- **Component styles**: `CustomStyles.astro`

### Recommended Conventions

- Use kebab-case: `feature-name.css`
- Be descriptive: `glossary-article-links.css` not `glossary2.css`
- Group related files: `glossary-*.css` for glossary-related files
- Use prefixes for organization: `tokens-*.css` for variables

## Maintenance

### Regular Tasks

1. **Audit File Sizes**: Check for unnecessary bloat
2. **Remove Unused Styles**: Clean up unused CSS
3. **Consolidate Files**: Merge small, related files if appropriate
4. **Update Documentation**: Keep this file structure up to date
5. **Test Loading Order**: Verify CSS cascade still works correctly

### File Organization Principles

1. **Single Responsibility**: Each file has one clear purpose
2. **Logical Grouping**: Related styles together
3. **Minimal Dependencies**: Reduce file interdependencies
4. **Clear Naming**: File names reflect purpose
5. **Documentation**: Document file purposes and relationships







