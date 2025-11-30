## KB Sync Updates – Semi-Automatic System

This script discovers new and updated content from approved SORA / Soramitsu / Polkaswap / TONSWAP / Iroha sources, converts them into KB-ready markdown, and lets you approve each write.

Script entry point:

```bash
pnpm --filter @soranauts/web kb:sync:updates
```

It **never** runs ingestion – you still run:

```bash
pnpm --filter @soranauts/web kb:update
pnpm --filter @soranauts/web kb:bm25:build
```

after you approve changes.

### Sources

- Medium (HTML + embedded JSON):
  - `https://sora-xor.medium.com/latest`
  - `https://polkaswap.medium.com/latest`
  - `https://fearlesswallet.medium.com/latest`
  - `https://tonswap-org.medium.com/latest`
- TONSWAP site:
  - `https://tonswap.org/` via `https://tonswap.org/sitemap.xml`
- SORAMITSU site:
  - `https://soramitsu.co.jp/` via `https://soramitsu.co.jp/sitemap.xml`
  - Only `/news/<slug>` pages are ingested (never `/#news`).
- Iroha docs:
  - `https://iroha.tech/` via sitemap.
- SORA Wiki:
  - `https://wiki.sora.org/` via sitemap.

All synced files are written under:

```text
knowledge_base/curated/sora_updates/<slug>.md
```

with frontmatter matching the canonical KB schema and the SORA v3 tag set.

### CLI Modes

#### Default (interactive)

```bash
pnpm --filter @soranauts/web kb:sync:updates
```

- Discovers **new** and **updated** articles.
- Shows a preview list.
- Prompts per item:
  - New article:
    - If slug exists: `overwrite/new/skip`.
    - Else: `yes/no`.
  - Updated article (hash changed vs last run):
    - `Content changed for <slug>.md (old=<sha_old> new=<sha_new>). Update file? (yes/no/version/skip)`
      - `yes`: overwrite existing file (same slug).
      - `version`: overwrite main file **and** write a versioned copy (see below).
      - `no/skip`: do nothing.
- Writes files and updates `sync_updates.json` state only when you approve.
- Prints a colorized summary dashboard per source at the end.

#### Dry run

```bash
pnpm --filter @soranauts/web kb:sync:updates:dry
```

- Same discovery, hashing, and prompts as interactive mode.
- Shows what **would** be written, but:
  - Does **not** write any files.
  - Does **not** modify `sync_updates.json`.
- Useful to preview the impact of a run.

#### Report (CI / nightly)

```bash
pnpm --filter @soranauts/web kb:sync:updates:report
```

- No prompts.
- Does **not** write files or state.
- Prints a single JSON blob to stdout:
  - `summary.sources[sourceKey]` with `new`, `updated`, `skipped`, `errors`.
  - `summary.totals` with global counts.
  - Arrays: `new[]`, `updated[]`, `skipped[]`, `errors[]` (each item includes `url`, `title`, `slug`, `snapshot_id`, `publishDate`, `content_sha256`, `sourceSystem`, `sourceKey`).
- Intended for GitHub Actions / nightly monitoring.

### Versioned Archive

When you choose `version` for an updated article, the script:

- Updates the main file at:

```text
knowledge_base/curated/sora_updates/<slug>.md
```

- Also writes a snapshot under:

```text
knowledge_base/curated/sora_updates/versions/<slug>/<snapshot_id>.md
```

- The `snapshot_id` in frontmatter matches the version path.

### Tags and Source Keys

Every synced file keeps the SORA v3 tag set:

- `["sora","nexus","iroha3","ivm","fastpq","dataspaces","updates"]`

The script appends one **per-source** secondary tag:

- `sora-medium` – SORA publication on Medium.
- `polkaswap-medium` – Polkaswap Medium.
- `fearless-medium` – Fearless Wallet Medium.
- `tonswap-medium` – TONSWAP Medium.
- `tonswap-site` – TONSWAP site pages.
- `soramitsu-news` – SORAMITSU `/news/<slug>` articles.
- `iroha-docs` – Iroha docs HTML pages.
- `sora-wiki` – SORA Wiki pages.

These are stored both in:

- `frontmatter.tags` (unique list), and
- An internal `sourceKey` field used by the summary dashboard and `--report`.

### State File

State is stored at:

```text
knowledge_base/scripts/.state/sync_updates.json
```

Shape (backwards compatible):

```json
{
  "urls": {
    "https://example.com/article": {
      "last_seen": "2025-11-30T12:34:56.789Z",
      "content_sha256": "<sha256>",
      "updated_at": "2025-11-30T12:34:56.789Z"
    }
  }
}
```

- Older state files without `updated_at` continue to work.
- State is only updated in **interactive** mode when a write actually occurs.


