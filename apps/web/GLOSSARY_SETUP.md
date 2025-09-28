# SORA Glossary - InstantSearch Setup

This document explains how to set up and run the new Typesense-powered glossary with React InstantSearch.

## Prerequisites

- Docker (for running Typesense)
- Node.js 20+ and pnpm
- The glossary JSON data (generated automatically)

## Quick Start

**Option A: Fallback Search (No Docker Required)**
```bash
cd apps/web
pnpm install
pnpm generate:glossary
pnpm dev
```

**Option B: Full Typesense Setup (Recommended)**

### 1. Start Typesense Server

**Option A: Docker Compose (Recommended)**
```bash
# Start Typesense with Docker Compose
docker-compose up -d
```

**Option B: Docker Run**
```bash
# Start Typesense with Docker
docker run -d \
  --name typesense-glossary \
  -p 8108:8108 \
  -v $(pwd)/typesense-data:/data \
  typesense/typesense:27.1 \
  --data-dir /data \
  --api-key=xyz \
  --enable-cors \
  --listen-port=8108 \
  --listen-address=0.0.0.0
```

### 2. Install Dependencies

```bash
cd apps/web
pnpm install
```

### 3. Generate Glossary Data

```bash
# This creates /public/glossary.json
pnpm generate:glossary
```

### 4. Index Data into Typesense

```bash
# This uploads glossary.json to Typesense
pnpm index:glossary
```

### 5. Start Development Server

```bash
# Start Astro dev server
pnpm dev
```

Visit `http://localhost:4321/glossary` to see the new InstantSearch-powered glossary!

## Features

✅ **Instant Search**: Real-time search as you type  
✅ **Highlighting**: Search terms are highlighted in results  
✅ **Faceted Filters**: Filter by category and tags  
✅ **Deep Linking**: Direct links to specific terms  
✅ **Responsive Design**: Works on all devices  
✅ **Accessibility**: Full keyboard navigation and screen reader support  

## Architecture

### Components

- **`GlossarySearch.tsx`**: Main React component using InstantSearch
- **`indexGlossary.ts`**: Script to upload data to Typesense
- **`glossary.astro`**: Astro page wrapper with SEO

### Data Flow

1. **Build Time**: `generate:glossary` creates `/public/glossary.json`
2. **Index Time**: `index:glossary` uploads data to Typesense
3. **Runtime**: React InstantSearch queries Typesense for live results

### Typesense Schema

```typescript
{
  name: 'glossary',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'term', type: 'string' },
    { name: 'slug', type: 'string', facet: true },
    { name: 'definition', type: 'string' },
    { name: 'category', type: 'string', facet: true },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'aliases', type: 'string[]' },
    { name: 'priority', type: 'int32' },
  ],
  default_sorting_field: 'priority',
}
```

## Development

### Reindexing Data

When you update glossary terms:

```bash
# Regenerate JSON and reindex
pnpm generate:glossary
pnpm index:glossary
```

### Typesense Management

```bash
# View Typesense logs
docker logs typesense-glossary

# Stop Typesense
docker stop typesense-glossary

# Remove Typesense (data will be lost)
docker rm typesense-glossary
```

### Customization

The InstantSearch components can be customized in `GlossarySearch.tsx`:

- **SearchBox**: Modify search input styling and behavior
- **RefinementList**: Customize filter UI
- **Hits**: Change how results are displayed
- **Highlight**: Adjust search term highlighting

## Production Deployment

### Environment Variables

Set these in your production environment:

```bash
TYPESENSE_HOST=your-typesense-host
TYPESENSE_PORT=8108
TYPESENSE_API_KEY=your-production-key
```

### Build Process

```bash
# 1. Generate glossary data
pnpm generate:glossary

# 2. Index to Typesense
pnpm index:glossary

# 3. Build Astro site
pnpm build
```

### Typesense Hosting

For production, consider:
- **Typesense Cloud**: Managed Typesense hosting
- **Self-hosted**: Run Typesense on your own infrastructure
- **Algolia**: Alternative search service (requires code changes)

## Troubleshooting

### Common Issues

**"Connection refused" to Typesense**
- Ensure Docker is running
- Check if Typesense container is started: `docker ps`
- Verify port 8108 is not blocked

**"No results found"**
- Run `pnpm index:glossary` to ensure data is indexed
- Check Typesense logs: `docker logs typesense-glossary`

**Search not working**
- Verify InstantSearch components are properly imported
- Check browser console for JavaScript errors
- Ensure Typesense is accessible from browser

### Performance

- Typesense is optimized for sub-50ms search responses
- Results are cached automatically by InstantSearch
- Large glossaries (1000+ terms) perform well

## Migration from Custom Implementation

The old custom glossary implementation has been replaced. Key differences:

| Feature | Old (Custom) | New (InstantSearch) |
|---------|--------------|-------------------|
| Search | Manual filtering | Typesense-powered |
| Highlighting | Manual regex | Built-in highlighting |
| Filters | Custom state | Faceted search |
| Performance | Client-side only | Server-side search |
| Reliability | Custom debugging | Battle-tested |

This new implementation provides enterprise-grade search capabilities with minimal maintenance overhead.
