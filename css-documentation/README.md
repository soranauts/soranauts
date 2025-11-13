# Soranauts CSS Documentation

## Overview

This documentation provides a comprehensive guide to the CSS architecture, structure, and best practices for the Soranauts web application. It is designed to be easily readable by ChatGPT and other AI assistants for developing a bulletproof plan for working with custom CSS and Tailwind.

## Documentation Structure

### 00-OVERVIEW.md
High-level overview of the CSS architecture, including:
- Technology stack
- File structure
- Style priority system
- Key features

**Start here** if you're new to the codebase.

### 01-TAILWIND-CONFIG.md
Detailed documentation of Tailwind CSS configuration:
- Configuration file structure
- Theme extensions
- Typography plugin setup
- Dark mode implementation
- Common patterns

**Read this** to understand Tailwind setup and customization.

### 02-CSS-VARIABLES.md
Complete guide to the CSS variables system:
- Variable categories
- Naming conventions
- Usage patterns
- Dark mode variables
- Best practices

**Read this** to understand the theming system.

### 03-CSS-FILES.md
Detailed documentation of each CSS file:
- File purposes
- Structure and contents
- Dependencies
- Usage examples
- Key features

**Read this** to understand individual CSS files.

### 04-GLOSSARY-STYLES.md
Comprehensive guide to glossary styling:
- Styling contexts
- Category system
- Implementation methods
- Tooltip/popover system
- Accessibility

**Read this** to understand the complex glossary styling system.

### 05-INTEGRATION.md
How all CSS components work together:
- Integration flow
- File dependencies
- CSS cascade and specificity
- Build process
- Testing integration

**Read this** to understand how everything integrates.

### 06-TROUBLESHOOTING.md
Common issues and solutions:
- Tailwind classes not working
- Dark mode issues
- Glossary styles not applying
- CSS variables not working
- Performance problems
- Debugging tips

**Read this** when you encounter problems.

### 07-BEST-PRACTICES.md
Best practices for working with CSS:
- General principles
- Tailwind-specific practices
- CSS file organization
- CSS variables best practices
- Performance practices
- Accessibility practices

**Read this** to follow best practices.

### 08-FILE-STRUCTURE.md
Complete file structure reference:
- File tree
- File descriptions
- File relationships
- Modification guidelines
- Naming conventions

**Read this** for file structure reference.

## Quick Start Guide

### For New Developers

1. Read `00-OVERVIEW.md` for high-level understanding
2. Read `01-TAILWIND-CONFIG.md` for Tailwind setup
3. Read `02-CSS-VARIABLES.md` for theming system
4. Read `03-CSS-FILES.md` for file structure
5. Reference `07-BEST-PRACTICES.md` while coding

### For Understanding Glossary Styling

1. Read `04-GLOSSARY-STYLES.md` for complete glossary system
2. Read relevant sections in `03-CSS-FILES.md`
3. Reference `02-CSS-VARIABLES.md` for glossary variables

### For Troubleshooting

1. Check `06-TROUBLESHOOTING.md` for common issues
2. Reference `05-INTEGRATION.md` for integration details
3. Check `08-FILE-STRUCTURE.md` for file organization

### For Planning CSS Changes

1. Read `07-BEST-PRACTICES.md` for guidelines
2. Read `05-INTEGRATION.md` for integration flow
3. Read `08-FILE-STRUCTURE.md` for modification guidelines
4. Reference `02-CSS-VARIABLES.md` for variable system

## Key Concepts

### CSS Architecture
- **Hybrid Approach**: Tailwind CSS + Custom CSS
- **CSS Variables**: Comprehensive theming system
- **Dark Mode**: Class-based implementation
- **Layered Styles**: Utilities, components, custom styles

### File Organization
- **Main Entry**: `tailwind.css`
- **Feature Files**: `glossary-*.css`
- **Variables**: `tokens-glossary.css`, `CustomStyles.astro`
- **Loading Order**: Critical for CSS cascade

### Styling System
- **Tailwind First**: Use utilities when possible
- **Custom When Needed**: Complex components use custom CSS
- **Variable-Based**: Colors and fonts use CSS variables
- **Context-Aware**: Different styles for different contexts

## Common Workflows

### Adding a New Component Style

1. Check if Tailwind utilities can be used
2. If not, add to `@layer components` in `tailwind.css`
3. Use CSS variables for colors
4. Add dark mode support
5. Test in both modes

### Modifying Glossary Styles

1. Identify which file to modify:
   - `glossary.css`: Base glossary styles
   - `glossary-article.css`: Article page links
   - `glossary-index.css`: Index page styles
   - `glossary-popover.css`: Popover component
2. Check context selectors
3. Verify category colors
4. Test in all contexts
5. Test dark mode

### Adding CSS Variables

1. Add to `CustomStyles.astro` in `:root`
2. Add dark mode variant in `.dark`
3. Document the variable
4. Use in Tailwind config if needed
5. Update documentation

### Debugging CSS Issues

1. Check `06-TROUBLESHOOTING.md` for common issues
2. Verify file loading order
3. Check specificity
4. Inspect in browser DevTools
5. Test in isolation

## Important Notes

### Dark Mode Inconsistency
- Main variables use `.dark` class
- Glossary variables use `@media (prefers-color-scheme: dark)`
- This may cause inconsistencies - consider standardizing

### Specificity
- Glossary styles use high specificity
- This is intentional to override prose styles
- Be careful when modifying

### File Loading Order
- Order is critical for CSS cascade
- Don't change without testing
- Document any changes

## Contributing

When making CSS changes:

1. **Follow Best Practices**: See `07-BEST-PRACTICES.md`
2. **Test Thoroughly**: Test in all contexts and modes
3. **Document Changes**: Update relevant documentation
4. **Check Integration**: Verify no conflicts with other files
5. **Performance**: Consider impact on file size and performance

## Getting Help

If you need help:

1. **Check Documentation**: Review relevant documentation files
2. **Troubleshooting Guide**: See `06-TROUBLESHOOTING.md`
3. **File Structure**: Check `08-FILE-STRUCTURE.md` for file organization
4. **Integration**: See `05-INTEGRATION.md` for integration details

## Document Maintenance

This documentation should be updated when:

- CSS architecture changes
- New files are added
- File purposes change
- Best practices evolve
- Common issues are discovered

## Version Information

- **Created**: 2024-01-XX
- **Last Updated**: 2024-01-XX
- **CSS Framework**: Tailwind CSS v3.4.17
- **Typography Plugin**: @tailwindcss/typography v0.5.19
- **Astro Version**: ^5.15.3

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Astro Documentation](https://docs.astro.build)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Specificity Calculator](https://specificity.keegan.st/)

---

**Note**: This documentation is designed to be comprehensive and easily readable by AI assistants. Each file is self-contained but references others where appropriate. Use the table of contents and cross-references to navigate effectively.









