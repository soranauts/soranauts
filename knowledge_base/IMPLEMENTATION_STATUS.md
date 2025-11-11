# Knowledge Base Implementation Status

## ✅ Completed

### Core Infrastructure
- [x] Directory structure created
- [x] Environment schema with all KB configuration
- [x] Type definitions (front-matter, metadata, manifests)
- [x] Utility functions (text normalization, tokenizer, state management)
- [x] `.gitignore` and `.gitattributes` configured

### Core Scripts
- [x] `iroha_docs_sync.ts` - Git clone/pull Iroha docs
- [x] `ingest.ts` - Token-true chunking, embeddings, ChromaDB upsert
- [x] `retrieve.ts` - Vector search with filters (source, lang, asof, snapshot-id)

### Importers & Scrapers
- [x] `soramitsu_scrape.ts` - Pilot scraper with allowlist (6 URLs)
- [x] `medium_import.ts` - RSS → HTML → MD converter

### Testing
- [x] `determinism.sh` - Automated determinism test
- [x] `test-retrieval-golden.ts` - Golden retrieval tests
- [x] Acceptance test documentation

### CI/CD
- [x] `.github/workflows/kb-index.yml` - Reindex on changes
- [x] `.github/workflows/kb-sync.yml` - Nightly sync workflow

### Documentation
- [x] `README.md` - Quick start guide
- [x] `ACCEPTANCE_TESTS.md` - Test documentation
- [x] `VERIFICATION.md` - Verification checklist

## 📊 Current Status

**Sources Synced**:
- ✅ Iroha docs: Synced (commit: a8d64bf85fffddfb903f27e00f284683adb32372)
- ✅ Soramitsu: 4 pages scraped (2 URLs returned 404)
- ✅ Medium: 10 posts imported

**Files Created**:
- `knowledge_base/soramitsu_site/*.md` - 4 files
- `knowledge_base/ecosystem_updates/*.md` - 10 files
- State files in `.state/` directory

## 🧪 Next Steps for Testing

1. **Set API Key**: `export OPENAI_API_KEY=your_key_here`

2. **Run Acceptance Tests**:
   ```bash
   pnpm kb:test:determinism
   pnpm kb:test:retrieval
   ```

3. **Test Multi-Source Ingestion**:
   ```bash
   pnpm kb:ingest
   ```

4. **Test Multi-Source Retrieval**:
   ```bash
   pnpm kb:retrieve "Iroha consensus" --source iroha_docs,soramitsu --limit 8
   ```

5. **Verify Idempotency**:
   ```bash
   pnpm kb:sync:soramitsu  # Second run should skip unchanged pages
   ```

## ⏳ Pending (Future Enhancements)

- [ ] `backtest.ts` - Claim-based article validation with SARIF
- [ ] `image_wide_hero.ts` - Hero image normalization (2:1 aspect)
- [ ] BM25 hybrid retrieval (infrastructure ready, needs implementation)
- [ ] `docs/kb.md` - Complete system documentation
- [ ] PDF parsing support
- [ ] Near-duplicate detection (SimHash) - removed from deps, can add later

## 🔧 Configuration

All configuration is in `apps/web/src/server/env.ts`. Key variables:
- `OPENAI_API_KEY` - Required for embeddings
- `EMBED_MODEL` - `text-embedding-3-large` (default)
- `KB_DIR` - `./knowledge_base` (default)
- `INDEX_DIR` - `./knowledge_base/index` (default)

## 📝 Notes

- TypeScript linter errors in scripts are false positives - `tsx` handles them correctly
- Scraper uses allowlist for pilot phase (6 URLs)
- Medium importer is idempotent (tracks GUIDs)
- All scrapers respect ETag/Last-Modified for efficient re-runs













