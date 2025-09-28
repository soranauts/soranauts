# SORA Glossary - Enhanced Search Implementation

This document explains the new glossary implementation with both fallback and Typesense-powered search options.

## 🚀 Quick Start

### Option 1: Fallback Search (No Docker Required)

Perfect for development and when you don't have Docker available:

```bash
cd apps/web
pnpm install
pnpm generate:glossary
pnpm dev
```

Visit `http://localhost:4321/glossary` to see the glossary with local search functionality.

### Option 2: Typesense InstantSearch (Production Ready)

For the best search experience with highlighting, typo tolerance, and advanced features:

```bash
# 1. Start Typesense
cd apps/web
docker compose up -d

# 2. Install dependencies and generate data
pnpm install
pnpm generate:glossary

# 3. Index data into Typesense
pnpm index:glossary

# 4. Switch to Typesense implementation
pnpm glossary:typesense

# 5. Start dev server
pnpm dev
```

## 🔄 Switching Between Implementations

Use the convenient scripts to switch between search implementations:

```bash
# Switch to Typesense InstantSearch
pnpm glossary:typesense

# Switch to fallback search
pnpm glossary:fallback
```

## ✨ Features Comparison

| Feature | Fallback Search | Typesense InstantSearch |
|---------|----------------|-------------------------|
| **Search Speed** | Client-side filtering | Sub-50ms server search |
| **Highlighting** | Basic regex highlighting | Advanced snippet highlighting |
| **Typo Tolerance** | No | Yes (fuzzy matching) |
| **Faceted Filters** | Basic category/tag filters | Advanced faceted search |
| **Pagination** | No | Yes |
| **Deep Linking** | Yes | Yes |
| **Accessibility** | Good | Excellent (ARIA support) |
| **Setup Complexity** | None | Docker + indexing |
| **Production Ready** | Yes (basic) | Yes (enterprise) |

## 🏗️ Architecture

### Fallback Implementation (`GlossarySearchFallback.tsx`)
- **Data Source**: Fetches `/public/glossary.json` at runtime
- **Search**: Client-side filtering using JavaScript
- **Highlighting**: Simple regex-based text highlighting
- **Filters**: Category and tag filtering with local state
- **Performance**: Good for < 500 terms, may slow with larger datasets

### Typesense Implementation (`GlossarySearch.tsx`)
- **Data Source**: Pre-indexed in Typesense search engine
- **Search**: Server-side search with advanced algorithms
- **Highlighting**: Built-in snippet highlighting
- **Filters**: Faceted search with instant updates
- **Performance**: Excellent for any dataset size

## 📊 Data Flow

### Fallback Flow
```
Build Time: generate:glossary → /public/glossary.json
Runtime: React component → fetch JSON → local filtering
```

### Typesense Flow
```
Build Time: generate:glossary → /public/glossary.json
Index Time: index:glossary → Typesense database
Runtime: React InstantSearch → Typesense API → results
```

## 🛠️ Development

### Adding New Terms

1. Edit the source glossary data in `src/data/sora-glossary.ts`
2. Regenerate JSON: `pnpm generate:glossary`
3. If using Typesense: `pnpm index:glossary`

### Customizing Search UI

**Fallback Implementation:**
- Edit `GlossarySearchFallback.tsx`
- Modify filtering logic in the `filteredTerms` useMemo
- Customize highlighting in `highlightText` function

**Typesense Implementation:**
- Edit `GlossarySearch.tsx`
- Modify InstantSearch components (SearchBox, Hits, etc.)
- Customize hit rendering in the `Hit` component

### Styling

Both implementations use Tailwind CSS classes. Key styling areas:

- **Search Box**: `.search-box` class
- **Hit Components**: Individual result styling
- **Filters**: Sidebar filter styling
- **Highlighting**: Search term highlighting

## 🚀 Production Deployment

### Fallback Implementation
No additional setup required. Just build and deploy:

```bash
pnpm build
# Deploy dist/ folder
```

### Typesense Implementation

**Option A: Self-hosted Typesense**
```bash
# On your server
docker run -d --name typesense \
  -p 8108:8108 \
  -v typesense-data:/data \
  typesense/typesense:27.1 \
  --data-dir /data \
  --api-key=your-production-key \
  --enable-cors

# Build and index
pnpm build
pnpm index:glossary
```

**Option B: Typesense Cloud**
1. Create account at [Typesense Cloud](https://cloud.typesense.org)
2. Update Typesense client config with cloud credentials
3. Index your data: `pnpm index:glossary`

**Option C: Algolia (Alternative)**
Replace Typesense with Algolia for hosted search:

```bash
# Update package.json dependencies
# Replace typesense packages with algoliasearch
# Update GlossarySearch.tsx to use Algolia client
```

## 🔧 Troubleshooting

### Common Issues

**"Cannot find module" errors**
- Run `pnpm install` to ensure all dependencies are installed
- Check that you're using the correct import paths

**Search not working**
- Ensure `/public/glossary.json` exists (run `pnpm generate:glossary`)
- Check browser console for JavaScript errors
- Verify the component is properly mounted with `client:load`

**Typesense connection issues**
- Verify Docker is running: `docker ps`
- Check Typesense logs: `docker logs typesense-glossary`
- Ensure port 8108 is accessible

**Slow search performance**
- Consider switching to Typesense for better performance
- Optimize the glossary data size if using fallback

### Performance Tips

1. **Fallback Implementation**: Limit to < 500 terms for best performance
2. **Typesense Implementation**: Can handle thousands of terms efficiently
3. **Data Size**: Compress glossary definitions if needed
4. **Caching**: Typesense automatically caches search results

## 📝 Migration from Custom Implementation

The new implementation replaces the previous custom search with these benefits:

- ✅ **Reliability**: No more debugging custom search logic
- ✅ **Performance**: Optimized search algorithms
- ✅ **Features**: Built-in highlighting, filters, pagination
- ✅ **Accessibility**: Proper ARIA support and keyboard navigation
- ✅ **Maintenance**: Battle-tested components reduce maintenance overhead

## 🎯 Next Steps

1. **Test both implementations** to see which fits your needs
2. **Set up Typesense** for production if you need advanced features
3. **Customize the UI** to match your design system
4. **Add analytics** to track search usage and popular terms
5. **Consider auto-linking** glossary terms in blog posts and content

The new implementation provides a solid foundation for a professional glossary experience that scales with your needs!


