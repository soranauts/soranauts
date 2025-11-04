# Adding Internal/Private Information to the Knowledge Base

This guide explains how to add non-public, private information to the Soranauts knowledge base system.

## Overview

The knowledge base has two main systems for storing information:

1. **Knowledge Base RAG System** (`knowledge_base/`) - For detailed documents that get indexed into a vector database for retrieval
2. **Glossary** (`apps/web/src/data/sora-glossary.ts`) - For term definitions that appear on the website

### Automatic Updates via GitHub Actions

**Yes, the knowledge base updates automatically!** GitHub Actions runs daily at 03:00 UTC to:
- Sync content from external sources (SORA Wiki, Iroha docs, Medium posts, etc.)
- Re-index the knowledge base with new content
- The API key is stored in GitHub Secrets (`secrets.OPENAI_API_KEY`)

Additionally, when you push changes to `knowledge_base/**` files, the `kb-index.yml` workflow automatically re-indexes your changes.

**So you typically don't need to manually update**, but if you want to test locally or add internal notes immediately, use the manual update process below.

## Method 1: Adding to Knowledge Base RAG System (Recommended for Detailed Notes)

### Step 1: Create a Markdown File

Create a new markdown file in one of these locations:
- `knowledge_base/articles/` - For reference articles
- `knowledge_base/internal/` - For private/internal notes (create this directory if needed)

Example structure:
```markdown
---
title: Internal Notes - [Topic]
source: internal
date: YYYY-MM-DD
tags: [internal, topic1, topic2]
---

# Your Title

[Your content here]
```

### Step 2: Add Your Information

Edit the template file at:
- `knowledge_base/articles/internal-notes-tonswap-sora-v3-iroha.md`

Or create a new file with your specific information.

### Step 3: Set Up Environment Variables (First Time Only)

The ingestion script requires an OpenAI API key for generating embeddings. **Create a `.env` file** in the repository root (it's gitignored, so it won't be committed):

```bash
# Create .env file with your API key
echo "OPENAI_API_KEY=your-api-key-here" > .env

# Optional: Use smaller/cheaper model for local testing
echo "EMBED_MODEL=text-embedding-3-small" >> .env
```

**Note**: 
- The `.env` file is gitignored, so it's safe to store your API key there locally
- Once created, the convenience script (`kb:update`) will automatically load it
- You can use either `text-embedding-3-large` (default, more accurate) or `text-embedding-3-small` (cheaper, faster) for local testing

### Step 4: Ingest into the Knowledge Base

**Easy way** (recommended): Use the convenience script that automatically loads your API key:

```bash
# From anywhere in the repo - the script handles everything:
pnpm --filter @soranauts/web kb:update

# OR run the script directly:
bash knowledge_base/scripts/update-kb.sh
```

**Manual way**: If you prefer to run it manually:

```bash
# From the repository root:
pnpm --filter @soranauts/web kb:ingest

# OR, if you're in the apps/web directory:
pnpm kb:ingest
```

**Note**: The convenience script (`kb:update`) automatically:
- Loads `OPENAI_API_KEY` from `.env` file if it exists
- Checks that the API key is set
- Runs the ingestion with proper error handling

**Important**: The `kb:ingest` command is defined in `apps/web/package.json`, so you must either:
- Use `pnpm --filter @soranauts/web kb:ingest` from the root
- Run `pnpm kb:ingest` from inside the `apps/web` directory

This will:
- Process all markdown files in the knowledge base
- Create embeddings for semantic search
- Index them in ChromaDB for retrieval

### Step 5: Verify the Content

Test that your content is searchable:

```bash
# From repository root
pnpm --filter @soranauts/web kb:retrieve "your search query"

# OR from apps/web directory
pnpm kb:retrieve "your search query"
```

## Method 2: Updating Glossary Entries (For Term Definitions)

If your private information affects term definitions, update the glossary:

### Step 1: Edit Glossary Source

Edit `apps/web/src/data/sora-glossary.ts` and update the relevant term:

```typescript
'TONSWAP': {
  term: 'TONSWAP',
  definition: 'Your updated definition with private details...',
  // ... rest of the entry
}
```

### Step 2: Regenerate Glossary JSON

```bash
# Regenerate the glossary JSON file
pnpm generate:glossary
```

### Step 3: Reindex Glossary (Optional)

If you're using Typesense for glossary search:

```bash
pnpm index:glossary
```

## Best Practices

1. **Mark Internal Content**: Use tags like `[internal, private]` in frontmatter to identify non-public content
2. **Source Attribution**: Include where the information came from (who told you, when, etc.)
3. **Date Your Notes**: Always include dates so you can track when information was added
4. **Organize by Topic**: Create separate files or sections for different topics
5. **Keep Updated**: Review and update internal notes periodically

## File Organization

Suggested structure for internal notes:

```
knowledge_base/
  articles/
    internal-notes-tonswap-sora-v3-iroha.md  # Your private notes
  internal/  # Alternative: dedicated directory for private info
    tonswap-details.md
    sora-v3-details.md
    iroha-details.md
```

## Security Considerations

⚠️ **Important**: 
- Files in the knowledge base are tracked in git by default
- If information is truly sensitive, consider:
  - Using git-crypt or similar encryption
  - Storing in a separate private repository
  - Using environment variables for highly sensitive data
  - Adding to `.gitignore` if you don't want to commit it

## Example: Adding TONSWAP Details

1. Open `knowledge_base/articles/internal-notes-tonswap-sora-v3-iroha.md`
2. Add your information in the TONSWAP section:
   ```markdown
   ## TONSWAP
   
   **Bridge Architecture**: [Your private details]
   **Tokenomics Details**: [Your private details]
   **Integration Timeline**: [Your private details]
   ```
3. Set `OPENAI_API_KEY` environment variable
4. Save and run `pnpm --filter @soranauts/web kb:ingest`

## Troubleshooting

**Content not appearing in search?**
- Make sure you set `OPENAI_API_KEY` environment variable
- Make sure you ran `pnpm --filter @soranauts/web kb:ingest` (or `pnpm kb:ingest` from `apps/web` directory)
- Check that the file has proper frontmatter
- Verify the file is in a directory that gets ingested (not in `index/`, `snapshots/`, or `node_modules/`)

**Getting "OPENAI_API_KEY is required" error?**
- Export the API key: `export OPENAI_API_KEY="your-key"`
- Or create a `.env` file in the repository root with `OPENAI_API_KEY=your-key`
- Make sure to restart your terminal/shell after setting the environment variable

**Getting "Command not found" error?**
- Use `pnpm --filter @soranauts/web kb:ingest` from the repository root
- Or navigate to `apps/web` directory and run `pnpm kb:ingest`

**Need to exclude certain files?**
- Files in `knowledge_base/index/` and `knowledge_base/snapshots/` are automatically excluded
- You can modify the ignore patterns in `knowledge_base/scripts/ingest.ts` if needed

## Next Steps

After adding your information:
1. ✅ Save your markdown file
2. ✅ Create `.env` file with `OPENAI_API_KEY` (first time only)
3. ✅ Run `pnpm --filter @soranauts/web kb:update` to index the content
4. ✅ Test retrieval with `pnpm --filter @soranauts/web kb:retrieve "your query"`
5. ✅ Update glossary if definitions changed

**Or just push to GitHub** - the automatic workflow will handle indexing within a few minutes!

