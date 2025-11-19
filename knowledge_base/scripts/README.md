# Knowledge Base Scripts

## Quick Start: Manual Knowledge Base Update

**To update the knowledge base locally after adding/editing files:**

```bash
# One-time setup: Create .env file with your API key
echo "OPENAI_API_KEY=your-key-here" > ../../.env

# Then update the KB anytime with:
pnpm --filter @soranauts/web kb:update

# OR run the script directly:
bash update-kb.sh
```

That's it! The script automatically:
- ✅ Loads your API key from `.env`
- ✅ Validates the API key is set
- ✅ Runs the ingestion process
- ✅ Shows progress and results

## Automatic Updates

**You typically don't need to update manually!** The knowledge base updates automatically via GitHub Actions:

- **Daily sync**: Runs at 03:00 UTC to sync external sources and re-index
- **On push**: When you push changes to `knowledge_base/**`, it automatically re-indexes

The API key is stored securely in GitHub Secrets, so GitHub Actions handles everything automatically.

## Manual Update Script

The `update-kb.sh` script is a convenience wrapper that:
1. Loads environment variables from `.env` file (if it exists)
2. Checks that `OPENAI_API_KEY` is set
3. Runs the ingestion process with proper error handling

## Other Scripts

- `ingest.ts` - Main ingestion script (runs embeddings and indexing)
- `retrieve.ts` - Query/search the knowledge base
- `backtest.ts` - Validate articles against the knowledge base
- `sync_*.ts` - Sync external sources (wiki, Medium, etc.)

See `knowledge_base/README.md` for full documentation.

















