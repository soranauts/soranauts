# Soranauts Site Structure
Generated: 2025-12-12

## Overview

Soranauts is an Astro-based educational platform for the SORA ecosystem.

## Main Navigation

- **Home** (`/`): Landing page with featured content and recent articles
- **Learn** (`/learn`): Curated learning paths for beginners and advanced users
- **Explore** (`/explore`): Visual topic explorer for discovering content
- **Glossary** (`/glossary`): Comprehensive glossary of terms (179 terms)
- **Blog** (`/[...blog]`): All articles (49 posts)
- **About** (`/about`): About Soranauts and mission

## Content Types

### 1. Blog Articles
- **Location**: `apps/web/src/content/post/`
- **Format**: MDX files with frontmatter
- **Count**: 49 articles
- **URL Pattern**: `/[slug]` (e.g., `/sora-ecosystem-explained`)
- **Features**: Tags, categories, publish/update dates, related content

### 2. Glossary Terms
- **Location**: `apps/web/src/content/glossary/` + `apps/web/src/data/taxonomy.ts`
- **Format**: MDX files + TypeScript data
- **Count**: 179 terms
- **URL Pattern**: `/glossary/[slug]` (e.g., `/glossary/xor`)
- **Features**: Categories, related terms, definitions, examples

### 3. Static Pages
- **Location**: `apps/web/src/pages/`
- **Format**: Astro components
- **Examples**: About, Features, Donate, Tools

### 4. Learning Paths
- **Location**: `apps/web/src/pages/learn/`
- **Format**: Dynamic Astro routes
- **Purpose**: Guided educational journeys

## Architecture

### Three-Layer Glossary System
1. **MDX files** (`apps/web/src/content/glossary/*.mdx`) - Individual pages
2. **Taxonomy** (`apps/web/src/data/taxonomy.ts`) - Master data (137 core terms)
3. **JSON files** (`apps/web/public/data/*.json`) - Build outputs (368 terms total)

### Technology Stack
- **Framework**: Astro 5.x
- **UI Components**: React + Astro components
- **Styling**: Tailwind CSS + design tokens
- **Content**: MDX (Markdown + JSX)
- **Build Tool**: pnpm + Turbo
- **Deployment**: Vercel

## Content Categories

Blog post categories:
- **Blockchain Technology**: 16 articles
- **DeFi & Trading**: 12 articles
- **SORA Ecosystem**: 8 articles
- **Economics & Policy**: 8 articles
- **Web3 & Innovation**: 3 articles
- **Technology & Architecture**: 1 articles
- **Guides**: 1 articles

## Design System

- **Design Tokens**: Defined in `DESIGN-TOKENS.md`
- **CSS Guardrails**: Defined in `CSS_GUARDRAILS.md`
- **Component Library**: Reusable Astro/React components
- **Typography**: System font stack with fallbacks
- **Color Scheme**: CSS variables with light/dark mode support

## Linking Conventions

- Blog articles: `/[slug]` (no prefix)
- Glossary terms: `/glossary/[slug]`
- Tags: `/tag/[slug]`
- Categories: `/[...blog]/[category]`
- Learning paths: `/learn/[pathId]`

## Feature Flags

Some features may be gated behind feature flags. Check `docs/glossary/FEATURE_FLAGS.md` for details.

## Related Documentation

- **Architecture**: See `ARCHITECTURE.md`
- **Glossary System**: See `docs/glossary-architecture-explained.md`
- **CSS System**: See `CSS_GUARDRAILS.md` and `css-documentation/`
- **Master Guardrails**: See `MASTER_GUARDRAILS.md` (AI assistant rules)
