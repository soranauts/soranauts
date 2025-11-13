# Knowledge Base Finalization Plan

## ✅ Completed

- ✅ Core infrastructure (ingest, retrieve, backtest)
- ✅ Incremental ingestion + embedding cache
- ✅ PR #2 merged and deployed to main
- ✅ Content improvement guide created
- ✅ CI workflows configured (non-blocking for PRs)
- ✅ `.gitignore` properly configured

## 📋 Remaining Tasks to Finalize

### 1. Configure GitHub Secrets (REQUIRED for CI)

**Action:** Add `OPENAI_API_KEY` to GitHub repository secrets

**Steps:**
1. Go to: `https://github.com/soranauts/soranauts/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `OPENAI_API_KEY`
4. Value: Your OpenAI API key
5. Click "Add secret"

**Why:** Enables automated indexing in CI workflows

---

### 2. Add Remaining Content Sources

#### 2a. TONSWAP Website & Blog

**URLs to scrape:**
- `https://tonswap.org/`
- `https://tonswap.org/roadmap`
- `https://tonswap.org/faq`
- `https://tonswap.org/blog/introducing-tonswap`
- `https://tonswap.org/blog/tonswap-dex-for-mass-adoption`
- `https://tonswap.org/blog/ts-token`
- `https://tonswap.org/blog/meowfi-by-tonswap`
- `https://tonswap.org/blog/tonswap-defi-hub-mass-adoption`

**Implementation:**
- Create `knowledge_base/scripts/tonswap_scrape.ts`
- Similar to `soramitsu_scrape.ts` but for `tonswap.org`
- Save content to `knowledge_base/tonswap_site/`
- Add to `.gitignore`: `knowledge_base/tonswap_site/images/`

#### 2b. TONSWAP Medium Blog

**RSS Feed:** `https://tonswap-org.medium.com/feed`

**Implementation:**
- Extend `medium_import.ts` to support TONSWAP publication
- Add `--publication tonswap` flag
- Save content to `knowledge_base/ecosystem_updates/` or `knowledge_base/tonswap_updates/`
- Update `kbSourceSchema` to include `tonswap_update` or `tonswap_site`

#### 2c. Fearless Wallet GitHub Repos

**Repos:**
- `https://github.com/soramitsu/fearless-Android`
- `https://github.com/soramitsu/fearless-iOS`

**Implementation:**
- Create `knowledge_base/scripts/fearless_github_sync.ts`
- Clone/pull updates from both repos
- Extract relevant content:
  - `README.md`
  - `CHANGELOG.md`
  - Files in `docs/` directories
  - Release notes
  - Developer documentation
- Save to `knowledge_base/fearless_github/`
- Record `source_commit` for provenance
- Focus on new features and developer notes

---

### 3. Update Configuration & Schemas

**Files to update:**

1. **`apps/web/src/server/env.ts`**
   - Add environment variables:
     - `TONSWAP_START_URLS` (comma-separated URLs)
     - `TONSWAP_MEDIUM_FEED_URL`
     - `FEARLESS_GITHUB_REPOS` (comma-separated repo URLs)

2. **`knowledge_base/scripts/types.ts`**
   - Add to `kbSourceSchema`: `'tonswap_site'`, `'tonswap_update'`, `'fearless_github'`

3. **`knowledge_base/scripts/ingest.ts`**
   - Ensure new source directories are discovered:
     - `knowledge_base/tonswap_site/`
     - `knowledge_base/tonswap_updates/` (if separate)
     - `knowledge_base/fearless_github/`

4. **`apps/web/package.json`**
   - Add npm scripts:
     ```json
     "kb:sync:tonswap": "...",
     "kb:sync:tonswap:medium": "...",
     "kb:sync:fearless:github": "..."
     ```

5. **`.github/workflows/kb-sync.yml`**
   - Add steps to sync TONSWAP and Fearless sources

---

### 4. Full Knowledge Base Verification

**Run complete verification:**

```bash
# 1. Sync all sources
npm run kb:sync:wiki
npm run kb:sync:iroha
npm run kb:sync:medium
npm run kb:sync:polkaswap
npm run kb:sync:fearless
npm run kb:sync:soramitsu
npm run kb:sync:tonswap          # After implementation
npm run kb:sync:tonswap:medium   # After implementation
npm run kb:sync:fearless:github  # After implementation

# 2. Ingest everything
npm run kb:ingest

# 3. Run acceptance tests
npm run kb:test:determinism
npm run kb:test:retrieval

# 4. Test retrieval with new sources
npm run kb:retrieve -- --query "TONSWAP features" --source tonswap_site
npm run kb:retrieve -- --query "Fearless Wallet features" --source fearless_github
```

---

### 5. Documentation Updates

**Files to update:**

1. **`knowledge_base/README.md`**
   - Add TONSWAP and Fearless sources to structure
   - Update quick start examples
   - Document new sync commands

2. **`knowledge_base/docs/CONTENT_IMPROVEMENT_GUIDE.md`** (already created)
   - This is ready to use

---

## Priority Order

1. **HIGH:** Configure GitHub secrets (enables CI)
2. **HIGH:** Add TONSWAP sources (requested by user)
3. **MEDIUM:** Add Fearless GitHub sources
4. **MEDIUM:** Full verification
5. **LOW:** Documentation polish

---

## Testing Checklist

Before considering KB "finalized":

- [ ] All sources sync successfully
- [ ] `kb:ingest` completes without errors
- [ ] Cache hit rate ≥95% on re-run (no content changes)
- [ ] Determinism tests pass
- [ ] Retrieval tests pass
- [ ] Can retrieve from all sources
- [ ] CI workflows run successfully (with secrets configured)
- [ ] Content improvement guide is accessible

---

## Quick Start After Finalization

Once everything is complete, you can use the KB like this:

```bash
# Research a topic
npm run kb:retrieve -- --query "SORA v3 governance" --limit 8

# Validate an article
npm run kb:backtest -- --article apps/web/src/content/post/article.mdx

# Check specific source
npm run kb:retrieve -- --query "TONSWAP" --source tonswap_site,tonswap_update
```















