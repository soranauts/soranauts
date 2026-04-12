---
description: Orientation for frontend/UI work — load visual and component context
---

# Prime Frontend: UI Context Loading

## Objective

Orient on the frontend before working on pages, components, or styling. This loads the domain-specific context that the generic prime doesn't cover.

**This is a template.** Copy it to your project's `.claude/commands/prime-frontend.md` and fill in the `<!-- CUSTOMIZE -->` markers with your project's values.

## Prerequisites

Run `/prime` first if you haven't already this session.

## Process

### 1. Read Frontend Structure

```bash
# <!-- CUSTOMIZE: replace with your project's frontend directories -->
ls src/app/
ls src/components/
ls src/lib/
```

### 2. Read Design System

If a design system doc exists, read it:
```bash
cat docs/specs/DESIGN-SYSTEM.md 2>/dev/null || echo "No design system doc found"
```

### 3. Confirm Sizing Scale

<!-- CUSTOMIZE: replace with your project's sizing scale. Delete this section if your project uses framework defaults. -->

```
SIZING SCALE (project defaults):
Hero headline: <!-- CUSTOMIZE: e.g., text-5xl sm:text-6xl lg:text-7xl -->
Section headings: <!-- CUSTOMIZE: e.g., text-3xl sm:text-4xl lg:text-5xl -->
Section descriptions: <!-- CUSTOMIZE: e.g., text-xl sm:text-2xl -->
Body text: <!-- CUSTOMIZE: e.g., text-lg (18px baseline) -->
Card titles: <!-- CUSTOMIZE: e.g., text-xl font-semibold -->
Card body: <!-- CUSTOMIZE: e.g., text-base sm:text-lg -->
Nav links: <!-- CUSTOMIZE: e.g., text-lg font-medium -->
CTA buttons: <!-- CUSTOMIZE: e.g., h-14 px-8 text-lg -->
Section padding: <!-- CUSTOMIZE: e.g., py-24 sm:py-32 -->
Min text: <!-- CUSTOMIZE: e.g., 16px -->
```

### 4. Read Brand Configuration

```bash
# <!-- CUSTOMIZE: replace with your project's font and color config paths -->
# Check font configuration
cat src/lib/fonts.ts 2>/dev/null || cat src/app/fonts.ts 2>/dev/null
# Check theme/colors
head -50 src/app/globals.css 2>/dev/null
```

<!-- CUSTOMIZE: document your brand values -->
Brand font: <!-- CUSTOMIZE: e.g., Inter, Outfit, etc. -->
Brand colors: <!-- CUSTOMIZE: e.g., primary #2563EB, accent #06B6D4, background #0F172A -->

### 5. Check Recent Frontend Changes

```bash
# <!-- CUSTOMIZE: replace with your project's frontend path -->
git log --oneline -8 -- src/app/ src/components/
```

### 6. Check for Domain Rules

```bash
cat .claude/rules/frontend.md 2>/dev/null || echo "No frontend rules file"
```

## Output

Summarize in under 150 words:

~~~
### Route Structure
- [List pages and their paths]

### Component Organization
- [Key component directories and their purposes]

### Design Tokens
- Font: [confirmed font]
- Colors: [primary, accent, background]
- Sizing: [confirmed scale is loaded / discrepancies noted]

### Recent Changes
- [Last 3-5 frontend commits]

### Frontend Issues
- [Any broken pages, missing assets, or known visual bugs]
~~~

**Ready for frontend IMPLEMENT prompts after human confirms.**
