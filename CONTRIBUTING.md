# Contributing to Soranauts

Welcome to the Soranauts monorepo! This guide will help you get started with development.

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
5. **Commit with conventional commits** (feat:, fix:, chore:, etc.)
6. **Create PR** with description and checklist

## Key Features

- **Quote Tool**: React island with TanStack Query at `/tools/quote`
- **Enhanced Glossary**: Accessible with ARIA attributes at `/glossary`
- **API Endpoints**: Rate-limited endpoints in `/src/pages/api/`
- **Environment Validation**: Zod schemas for all env vars
- **Testing**: Playwright smoke tests for key flows

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


