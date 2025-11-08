# Verification Checklist

After implementing the KB system, verify the following:

## ✅ Acceptance Tests (Iroha-only)

```bash
# Set API key first
export OPENAI_API_KEY=your_key_here

# Run tests
pnpm kb:test:determinism
pnpm kb:test:retrieval
```

**Expected**: Both tests pass

## ✅ Soramitsu Scraper

```bash
pnpm kb:sync:soramitsu
```

**Expected**: 
- 10-20 pages ingested (or fewer if some URLs don't exist)
- Files saved to `knowledge_base/soramitsu_site/`
- Images downloaded to `knowledge_base/soramitsu_site/images/`
- State file updated in `.state/.soramitsu_state.json`
- Front-matter includes: source, source_url, lang, snapshot_id, content_sha256

## ✅ Medium Importer

```bash
pnpm kb:sync:medium
```

**Expected**:
- 3+ recent posts imported
- Files saved to `knowledge_base/ecosystem_updates/`
- Images downloaded to `knowledge_base/ecosystem_updates/images/`
- State file updated in `.state/.medium_state.json`
- Front-matter includes: source: "update", image_rights: "SORA Official / Medium"

## ✅ Multi-Source Ingestion

```bash
pnpm kb:ingest
```

**Expected**:
- All sources processed (iroha_docs, soramitsu, ecosystem_updates)
- Chunks created with deterministic IDs
- Manifest generated at `knowledge_base/index/manifest.json`
- Metrics output shows files/chunks processed

## ✅ Multi-Source Retrieval

```bash
pnpm kb:retrieve "Iroha consensus" --source iroha_docs,soramitsu --limit 8
```

**Expected**:
- Results from both sources
- Results include source_url and snapshot_id
- Scores are reasonable (>0.2)

## ✅ CI Workflows

- `.github/workflows/kb-index.yml` - Reindexes on changes
- `.github/workflows/kb-sync.yml` - Nightly sync

**Expected**:
- Both workflows are valid YAML
- Secrets are referenced correctly (`OPENAI_API_KEY`)
- Artifacts are uploaded correctly

## ✅ Idempotency

```bash
# Run scraper twice
pnpm kb:sync:soramitsu
pnpm kb:sync:soramitsu

# Second run should skip unchanged pages (304 Not Modified)
```

**Expected**: Second run shows "Skipped (not modified)" for pages that haven't changed










