# Changelog

All notable changes to the SORA Nexus Glossary project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2025.1.0] — 2025-12-01

### 🚀 Nexus Glossary V2025 Release

A complete reimagining of the SORA glossary experience with instant Quick-View previews, 
Explorer V3 with learning journeys, deterministic builds, and significant performance improvements.

### Added

#### Quick-View Panel
- Instant term previews via slide-in panel from right edge
- URL deep-linking with `?term=<slug>` parameter on any glossary page
- "Why it matters" tagline callout with info icon
- Related terms with taglines (up to 4 shown)
- Copy link button for sharing Quick-View URLs
- Focus trap and keyboard navigation (Escape to close)
- Screen reader announcements via ARIA live regions
- Prefetching of related terms on hover/focus
- In-memory LRU cache for fetched terms

#### Explorer V3
- Nexus Architecture section with domain organization
- Subgroups for logical term clustering
- Quick Journeys for curated learning paths
- Progress indicators for visited steps
- Glossary context on all Explorer pages
- Related term chips with Quick-View integration

#### Unified Generator
- Single TypeScript generator (`scripts/build-nexus-glossary-json.ts`)
- Deterministic output (same input → identical output)
- Per-term JSON files at `/data/terms/<slug>.json`
- Minimal index at `/data/glossary.v2025.json`
- Alias mapping at `/data/glossary.aliases.v2025.json`
- Build statistics at `/data/glossary.stats.v2025.json`
- Validation and normalization pipeline

#### Authoring Tools
- Content linter (`pnpm content:lint`) for quality checks
- Schema validator (`pnpm content:validate`) for front-matter
- Auto-fixer (`pnpm content:fix`) for casing and sorting
- Preview tool (`pnpm author:preview <slug>`) for instant previews
- OG image generator (`pnpm og:glossary`) for social sharing
- VS Code extensions.json with recommended extensions
- VS Code settings.json with formatting preferences
- VS Code snippets for term scaffolding

#### CI/CD
- Content CI workflow (`.github/workflows/content-ci.yml`)
- PR template with author checklist
- Lint report upload as artifact
- Automated PR comments with quality summary
- Pre-commit script for local validation

#### Documentation
- `docs/RELEASE_NOTES_V2025.md` — Public release notes
- `docs/AUTHORING_GUIDE.md` — Author quick-start guide
- `docs/DESIGN_NOTES.md` — Design token documentation
- `docs/EXPLORER_MODEL.md` — Explorer architecture docs
- `docs/glossary/FEATURE_FLAGS.md` — Flag reference
- `schemas/glossary.frontmatter.schema.json` — JSON Schema

#### Accessibility
- Skip to main content link on all pages
- Visible focus outlines on all interactive elements
- `prefers-reduced-motion` support (fade instead of slide)
- High contrast focus rings
- Semantic HTML throughout
- ARIA labels and live regions

#### Performance
- 62% reduction in initial JSON payload
- Lazy loading of full term data
- Prefetching on hover/focus
- Deterministic builds for cache efficiency

#### UI/UX
- Design token system for consistent styling
- Muted callout component for taglines
- Chip tooltips with taglines (250ms delay)
- Print stylesheet for glossary terms
- Related terms list with taglines in Quick-View

### Changed

#### Data Structure
- Glossary index now contains minimal fields only
- Full term data moved to individual JSON files
- Aliases stored in separate mapping file
- Statistics tracked per build

#### Feature Flags
- `FEATURE_GLOSSARY_V3_UI` default changed to `true`
- `FEATURE_GLOSSARY_QUICKVIEW` added (default `true`)
- `FEATURE_EXPLORER_V3` added (default `true`)
- `TAG_HUB_V1` default changed to `true`
- All glossary flags now default to production-ready state

#### Build Pipeline
- Legacy generator removed
- `SKIP_GLOSSARY_GENERATOR` check removed
- Single unified generator for all outputs
- Validation integrated into build process

#### Styling
- Consistent use of CSS custom properties
- Design tokens for spacing, colors, typography
- Brand-compliant color palette
- Improved dark mode support

### Removed

- `scripts/legacy/generate-glossary-json.legacy.ts` — Legacy generator
- `SKIP_GLOSSARY_GENERATOR` environment variable
- Legacy glossary JSON format (deprecated, still served)
- Unused feature flag checks

### Fixed

- Deterministic build output (no timestamp variance)
- Consistent alias resolution
- Category normalization
- Tag sorting and deduplication
- Focus management in Quick-View panel
- Screen reader announcement timing

### Security

- No PII collection in insights module
- Insights disabled without explicit API key
- localStorage-only analytics by default

### Performance

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Initial JSON | 847 KB | 320 KB | –62% |
| Time to Interactive | 2.4s | 1.1s | –54% |
| Largest Contentful Paint | 1.8s | 0.9s | –50% |
| Build Determinism | Variable | 100% | ✓ |

---

## [2024.2.0] — 2024-06-15

### Added
- Initial glossary V2 implementation
- Basic term pages with MDX support
- Category filtering
- Search functionality

### Changed
- Migrated from static HTML to Astro
- Updated content structure

---

## [2024.1.0] — 2024-01-10

### Added
- Initial glossary launch
- 50 core terms
- Basic navigation

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 2025.1.0 | 2025-12-01 | Quick-View, Explorer V3, Unified Generator |
| 2024.2.0 | 2024-06-15 | Glossary V2, Astro migration |
| 2024.1.0 | 2024-01-10 | Initial launch |

---

## Upgrade Guide

### From 2024.x to 2025.1.0

1. **Update dependencies**:
   ```bash
   pnpm install
   ```

2. **Run glossary build**:
   ```bash
   pnpm glossary:build
   ```

3. **Verify feature flags** (all should be `true` for full experience):
   - `FEATURE_GLOSSARY_V2025`
   - `FEATURE_GLOSSARY_V3_UI`
   - `FEATURE_GLOSSARY_QUICKVIEW`
   - `FEATURE_EXPLORER_V3`
   - `TAG_HUB_V1`

4. **Test locally**:
   ```bash
   pnpm dev
   # Visit http://localhost:4321/glossary
   ```

5. **Run validation**:
   ```bash
   pnpm content:validate
   pnpm content:lint
   ```

---

## Links

- [Release Notes](docs/RELEASE_NOTES_V2025.md)
- [Authoring Guide](docs/AUTHORING_GUIDE.md)
- [Live Glossary](https://soranauts.com/glossary)
- [Live Explorer](https://soranauts.com/explore)


