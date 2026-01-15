# Soranauts Architecture

> **Last Updated:** 2026-01-15
> **Source:** Extracted from actual config files

---

## Tech Stack (Verified from package.json)

| Layer | Technology | Version | Source |
|-------|------------|---------|--------|
| Framework | Astro | ^5.16.9 | `apps/web/package.json` |
| UI | React | ^18.3.1 | `apps/web/package.json` |
| Styling | Tailwind CSS | ^3.4.19 | `apps/web/package.json` |
| Content | MDX | — | `apps/web/src/content/` |
| Search | Pagefind | built-in | Astro integration |
| Testing | Playwright | ^1.57.0 | `apps/web/package.json` |
| Testing | Vitest | ^4.0.17 | `apps/web/package.json` |
| Monorepo | pnpm + Turbo | — | `pnpm-workspace.yaml` |
| Deployment | Vercel | — | `vercel.json` |

---

## Project Structure (Actual)

```
soranauts/
├── apps/
│   └── web/                    # Main Astro site
│       ├── src/
│       │   ├── components/     # React + Astro components
│       │   ├── content/        # Content collections (MDX)
│       │   │   ├── glossary/   # 179 MDX term pages
│       │   │   ├── post/       # 45 blog articles
│       │   │   └── docs/       # 26 Starlight docs
│       │   ├── data/           # TypeScript data files
│       │   │   └── taxonomy.ts
│       │   ├── lib/            # Utility libraries
│       │   │   └── taxonomy.ts
│       │   └── pages/          # Route pages
│       ├── public/
│       │   └── data/           # JSON data files
│       │       ├── glossary.v2025.json
│       │       └── glossary.minimal.json
│       └── tests/e2e/          # 15 Playwright test files
├── packages/
│   ├── chain/                  # Blockchain facade
│   ├── config/                 # Shared config
│   └── ui/                     # Shared components
├── knowledge_base/             # RAG system (future: soranauts-ai)
├── docs/
│   └── claude-context/         # Session continuity files
└── .github/workflows/          # 15 CI workflows
```

---

## Content Collections

| Collection | Location | Count | Format |
|------------|----------|-------|--------|
| Glossary | `apps/web/src/content/glossary/` | 179 | MDX |
| Blog | `apps/web/src/content/post/` | 45 | MDX |
| Docs | `apps/web/src/content/docs/` | 26 | MDX |

**Note:** Canonical glossary terms (370) exceed MDX pages (179). Some terms are rendered from JSON without dedicated MDX files.

---

## CI Workflows (from .github/workflows/)

| Workflow | Purpose |
|----------|---------|
| ci.yml | Main CI pipeline |
| content-ci.yml | Content validation |
| docs-validation.yml | Documentation checks |
| guard-large-files.yml | Prevents large file commits |
| kb-backtest.yml | Knowledge base backtesting |
| kb-index.yml | Knowledge base indexing |
| kb-ingest.yml | Knowledge base ingestion |
| kb-sync.yml | Knowledge base sync |
| ops-budgets.yml | Operations budgets |
| redirects-guard.yml | Redirect validation |
| snapshot.yml | Snapshot testing |
| sync_updates.yml | Sync updates |
| taxonomy-guard.yml | Taxonomy validation |
| validate-og.yml | OpenGraph validation |
| web-e2e.yml | E2E test runner |

---

## Protected Routes

These routes should not break:
- `/glossary/*` — Glossary term pages
- `/explore` — Tag explorer
- `/learn` — Learning paths
- `/docs/*` — Starlight documentation
- `/blog/*` — Blog articles
- `/features` — Features page

---

## Data Flow

```
glossary.v2025.json (370 terms)
        │
        ├──> MDX pages (179 files in src/content/glossary/)
        │
        ├──> API endpoints (/api/glossary/*)
        │
        └──> Search index (Pagefind, 478 pages indexed)
```
