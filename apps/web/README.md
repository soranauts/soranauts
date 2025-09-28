# SORA Glossary Web App

This is the main Astro web application for the SORA ecosystem, featuring an interactive glossary with search functionality.

## Features

- **Interactive Glossary**: Search and filter SORA ecosystem terms
- **React Islands**: Interactive components using Astro's React integration
- **Search Functionality**: Both Typesense-powered search and fallback local search
- **Responsive Design**: Mobile-first design with dark/light mode support
- **SEO Optimized**: Server-side rendering with proper meta tags

## Quick Start

1. **Install dependencies** (from monorepo root):
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   ```
   The site will be available at `http://localhost:4321`

3. **Generate glossary data**:
   ```bash
   pnpm generate:glossary
   ```

## Glossary Search Options

### Option 1: Typesense Search (Recommended)

For advanced search with highlighting and faceted search:

1. **Start Typesense Docker container**:
   ```bash
   docker run -p 8108:8108 typesense/typesense:0.25.1 \
     --data-dir /data \
     --api-key=xyz \
     --enable-cors
   ```

2. **Index the glossary data**:
   ```bash
   pnpm index:glossary
   ```

3. **Switch to Typesense search**:
   ```bash
   pnpm glossary:typesense
   ```

### Option 2: Fallback Search (Default)

Uses client-side filtering with local JSON data:

```bash
pnpm glossary:fallback
```

## Development

- **Build**: `pnpm build`
- **Preview**: `pnpm preview`
- **Type Check**: `pnpm astro check`
- **Lint**: `pnpm lint`

## Project Structure

```
src/
├── components/
│   ├── glossary/          # Glossary search components
│   ├── tools/             # Interactive tools (React islands)
│   └── widgets/           # Shared UI components
├── pages/
│   ├── glossary.astro     # Main glossary page
│   ├── tools/             # Tool pages
│   └── api/               # API endpoints
├── data/
│   └── sora-glossary.ts   # Glossary data source
├── scripts/
│   ├── generate-glossary-fixed.js  # Generate glossary.json
│   └── indexGlossary.ts   # Typesense indexing script
└── types/
    └── glossary.ts        # TypeScript interfaces
```

## API Endpoints

- `GET /api/quote` - Token quote endpoint with rate limiting
- `GET /glossary.json` - Static glossary data export

## Environment Variables

Required environment variables (see `env.example` in project root):

- `INDEXER_URL` - Blockchain indexer endpoint
- `DEX_API_URL` - DEX API endpoint  
- `SORA_WS_URL` - SORA WebSocket endpoint
- `KV_URL` - Key-value store URL
- `KV_TOKEN` - Key-value store token
- `SENTRY_DSN` - Error monitoring (optional)
- `NEXT_PUBLIC_SITE_URL` - Public site URL
