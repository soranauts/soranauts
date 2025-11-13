# Contributing to Soranauts

Welcome to the Soranauts monorepo! This guide will help you get started with development.

## Protected Paths

⚠️ **IMPORTANT**: The following paths are protected and should **NEVER** be modified unless you are explicitly working on content or feature updates:

**Content & Data:**
- `apps/web/src/content/**` — All MDX blog posts and pages
- `apps/web/src/data/sora-glossary.ts` — Glossary term definitions
- `apps/web/src/data/taxonomy.ts` — Term taxonomy and relationships
- `apps/web/public/**` — Static assets, OG images, glossary JSON

**Website Pages (ALL ROUTES):**
- `apps/web/src/pages/**` — ALL Astro page templates and API routes
  - This includes: `/explore` (SORA Explorer), `/glossary`, `/blog`, `/tools/*`, API endpoints
  - NO pages should be modified without explicit approval

**Application Code:**
- `apps/web/src/components/**` — UI components (unless fixing bugs)
- `apps/web/src/assets/styles/**` — Design tokens and CSS system
- `apps/web/tailwind.config.cjs` — Tailwind configuration
- `apps/web/astro.config.mjs` — Astro build configuration

**Build & Generation:**
- `apps/web/scripts/**` — Content pipelines (OG, taxonomy, glossary indexing)
- `knowledge_base/**` — RAG system and ingestion scripts

Pre-commit hooks (see below) will automatically skip linting/formatting for protected paths.

## Prerequisites

- **Node.js**: v20.x (use `.nvmrc` file)
- **pnpm**: v9.0.0+ (enforced via preinstall script)

## Quick Start

### 1. Setup Environment

```bash
# Clone the repository
git clone <repository-url>
cd soranauts

# Use the correct Node version
nvm use  # or: nvm install $(cat .nvmrc)

# Install dependencies (pnpm is enforced)
pnpm install

# Copy environment variables
cp env.example .env
```

### 2. Development

```bash
# Start the development server
pnpm dev

# Or specifically for web app
pnpm dev:web
```

The site will be available at `http://localhost:4321/`

### 3. Testing

```bash
# Run Playwright tests
pnpm exec playwright test

# Test specific endpoints
curl http://localhost:4321/                    # Home page
curl http://localhost:4321/glossary           # Glossary
curl http://localhost:4321/tools/quote        # Quote tool
```

## Project Structure

```
soranauts/
├── apps/
│   ├── web/                    # Main Astro website
│   │   ├── src/pages/api/     # API endpoints
│   │   ├── src/components/    # React/Astro components
│   │   └── tests/             # Playwright tests
│   └── tools/                 # Future tools (optional)
├── packages/
│   ├── chain/                 # Blockchain facade
│   ├── config/                # Shared configs
│   └── ui/                    # UI components
└── .cursorrules               # Cursor AI guardrails
```

## Architecture Principles

- **UI never imports blockchain SDKs** - Use `packages/chain` facade
- **All chain calls via `/api`** - No secrets in browser
- **Zod validation** - At all boundaries
- **Accessibility first** - Proper ARIA attributes
- **Small focused diffs** - ~300 lines unless migration

## Development Workflow

1. **Create a feature branch** from `main`
2. **Make changes** following the architecture principles
3. **Test locally** with `pnpm dev`
4. **Run tests** with `pnpm exec playwright test`
5. **Validate changes** (see validation workflows below)
6. **Commit with conventional commits** (feat:, fix:, chore:, etc.)
7. **Create PR** with description and checklist

### Pre-Commit Hooks

The repository uses Husky and lint-staged to automatically check code quality before commits:

- **Automatic formatting**: Prettier runs on staged files
- **Linting**: ESLint checks TypeScript/JavaScript files
- **Protected path exemption**: Content and protected files are automatically skipped

**Emergency bypass** (use sparingly):
```bash
git commit --no-verify
```

Hooks are automatically installed when you run `pnpm install`.

## Key Features

- **Quote Tool**: React island with TanStack Query at `/tools/quote`
- **Enhanced Glossary**: Accessible with ARIA attributes at `/glossary`
- **API Endpoints**: Rate-limited endpoints in `/src/pages/api/`
- **Environment Validation**: Zod schemas for all env vars
- **Testing**: Playwright smoke tests for key flows

## Validation Workflows

### Open Graph (OG) Image Validation

Before deploying, ensure all content has valid OG images:

```bash
# Run OG validation
pnpm verify:og

# Or manually validate during build
pnpm build  # OG validation runs automatically in prebuild
```

The validation checks:
- All blog posts have corresponding OG images
- Images exist in `apps/web/public/og/`
- Images meet size and format requirements

### Knowledge Base Workflows

**Syncing External Content:**
```bash
# Sync from Medium publications
pnpm kb:sync:medium
pnpm kb:sync:polkaswap
pnpm kb:sync:fearless

# Sync from other sources
pnpm kb:sync:wiki           # SORA Wiki
pnpm kb:sync:fearless:github  # Fearless GitHub docs
pnpm kb:sync:soramitsu      # SORAMITSU site
```

**Testing Knowledge Base Quality:**
```bash
# Run retrieval backtests
pnpm kb:backtest

# Verify system health
pnpm kb:verify
```

For detailed KB documentation, see [knowledge_base/README.md](../../knowledge_base/README.md).

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on port 4321
lsof -ti:4321 | xargs kill -9

# Or use a different port
pnpm --filter ./apps/web dev --port 4322
```

### Missing Dependencies
```bash
# Clean install
rm -rf node_modules apps/web/node_modules
pnpm install
```

### Build Issues
```bash
# Clean build artifacts
rm -rf apps/web/dist apps/web/.astro
pnpm build
```

## Code Style

- **ESLint + Prettier**: Configured in `packages/config`
- **TypeScript**: Strict mode enabled
- **Conventional Commits**: For clear changelog generation
- **EditorConfig**: Consistent formatting across editors

## Need Help?

- Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Review [TASKS.md](./TASKS.md) for current project status
- Look at existing components in `apps/web/src/components/`

Happy coding! 🚀


