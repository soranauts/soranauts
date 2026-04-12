<!-- LEAD-V v3.1 -->
# Agent Context

This file provides universal project context for any AI tool. Read this first.

## Project Overview

**Name:** Soranauts
**Description:** An independent educational platform for the SORA blockchain ecosystem. Features a 384-term fuzzy-matched glossary, 46 blog articles, and 26 Starlight documentation pages ("SORA Codex"). Built as a static site with Astro, serving as a comprehensive knowledge hub for the SORA network, Polkaswap DEX, Fearless Wallet, and SORA Nexus.
**Status:** Production — v1.0.0 released, content complete, active maintenance
**URL:** https://soranauts.com

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro | ^5.16.9 |
| UI | React | ^18.3.1 |
| Styling | Tailwind CSS | ^3.4.19 |
| Typography | @tailwindcss/typography | ^0.5.19 |
| Content | MDX | — |
| Documentation | Starlight | — |
| Search | Pagefind | built-in |
| Unit Tests | Vitest | ^4.0.17 |
| E2E Tests | Playwright | ^1.57.0 |
| Package Manager | pnpm | 9.12.2 (enforced) |
| Monorepo | pnpm workspaces | — |
| Deployment | Vercel | — |

## Build Commands

| Command | Purpose |
|---------|---------|
| `pnpm build` | Full build (prebuild chain + astro build + alias check) |
| `pnpm dev` | Dev server at localhost:4321 |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm pre-push` | Full validation (install + build + test) |
| `pnpm taxonomy:audit` | Glossary taxonomy audit |
| `pnpm content:lint` | Content linting |
| `pnpm content:validate` | Frontmatter validation |

## Folder Structure

~~~
soranauts/
├── apps/
│   └── web/                        # Main Astro site (@soranauts/web)
│       ├── src/
│       │   ├── components/         # React + Astro components
│       │   ├── content/            # Content collections (MDX)
│       │   │   ├── glossary/       # 194 MDX term pages
│       │   │   ├── post/           # 46 blog articles
│       │   │   └── docs/           # 26 Starlight doc pages (SORA Codex)
│       │   ├── data/               # TypeScript data files (taxonomy.ts)
│       │   ├── lib/                # Utility libraries
│       │   └── pages/              # Route pages
│       ├── public/
│       │   └── data/               # JSON data (glossary.v2025.json, glossary.minimal.json)
│       ├── scripts/                # Build scripts (prebuild chain)
│       └── tests/
│           ├── e2e/                # 16 Playwright spec files
│           ├── unit/               # Vitest unit tests
│           └── cross/              # Cross-cutting tests
├── packages/
│   ├── chain/                      # Blockchain facade
│   ├── config/                     # Shared config
│   └── ui/                         # Shared components
├── docs/                           # Project documentation (~80 files)
│   ├── MASTER_GUARDRAILS.md        # Production safety rules (read first)
│   ├── ARTICLE_CREATION_GUIDE.md   # Content editorial standards
│   ├── AUTHORING_GUIDE.md          # Content authoring conventions
│   ├── claude-context/             # AI assistant context (ARCHITECTURE.md, etc.)
│   ├── css-system/                 # CSS_GUARDRAILS.md, DESIGN-TOKENS.md
│   ├── claude-reference/           # Auto-generated: LINK_INVENTORY, CONTENT_SUMMARY, etc.
│   ├── archive/                    # Historical docs
│   ├── specs/                      # Locked specifications (Layer 3)
│   ├── guides/                     # Living documentation (Layer 3)
│   ├── research/                   # Decision logs (Layer 3)
│   └── handoffs/                   # Archived session handoffs
├── .claude/
│   ├── commands/                   # Slash commands (LEAD-V v3.1)
│   ├── agents/                     # Sub-agent definitions
│   ├── rules.md                    # Global guardrails (always loaded)
│   └── settings.local.json         # Local permissions (gitignored)
├── CLAUDE.md                       # Claude Code context pointer (Layer 1A)
├── AGENTS.md                       # This file — universal agent context (Layer 1A)
├── VERIFY.md                       # Auditor session context (Layer 1A)
├── PROJECT_STATE.md                # Current session state (Layer 2)
├── .cursorrules                    # Cursor IDE rules (Layer 1A)
├── templates/                      # LEAD-V templates
│   ├── INITIAL-template.md         # Structured feature request
│   ├── SPEC-template.md            # Feature specification
│   └── SUBAGENT-DISPATCH-template.md
└── .github/workflows/              # 15 CI workflows
~~~

## Key Conventions

- **Branching:** Content-only changes push to `main` directly with `content:` prefix. Code changes require feature branches with conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `perf:`, `style:`).
- **Component naming:** PascalCase for React and Astro components. One component per file.
- **File naming:** kebab-case for content files (MDX), PascalCase for component files.
- **Content format:** MDX with frontmatter schema defined per collection. See `docs/ARTICLE_CREATION_GUIDE.md`.
- **Glossary:** 384 canonical terms in `glossary.v2025.json`. 194 have dedicated MDX pages. Remainder rendered from JSON.
- **Tag system:** IDF-weighted algorithmic scoring. Do not use manual frontmatter overrides for related articles.
- **CSS:** Follow `docs/css-system/CSS_GUARDRAILS.md` and `docs/css-system/DESIGN-TOKENS.md`.
- **Testing:** Vitest for unit tests, Playwright for E2E. All tests in `apps/web/tests/`.
- **Build validation:** `pnpm build` runs a prebuild chain (tags → glossary JSON → redirects → taxonomy validation → OG build → OG manifest → OG validate) before `astro build`.
- **Protected routes:** `/glossary/*`, `/explore`, `/learn`, `/docs/*`, `/blog/*`, `/features` — these must not break.
- **pnpm.overrides:** Used for transitive dependency vulnerabilities (not direct dep updates). Remove overrides when Astro updates past affected versions.

## Content Collections

| Collection | Location | Count | Format |
|------------|----------|-------|--------|
| Glossary | `apps/web/src/content/glossary/` | 194 | MDX |
| Blog | `apps/web/src/content/post/` | 46 | MDX |
| Docs (SORA Codex) | `apps/web/src/content/docs/` | 26 | MDX |

## Current State

Read `PROJECT_STATE.md` for what we're working on right now.
If `HANDOFF.md` exists, read it for continuation context from the previous session.

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/prime` | Cold-start orientation — load project context, verify state |
| `/prime-frontend` | Frontend/UI-specific orientation (template — needs customization) |
| `/handoff` | Create structured session handoff document |
| `/commit` | Standardized atomic commit with AI context tracking |
| `/verify` | Post-implementation audit checklist |
| `/scaffold` | Bootstrap LEAD-V in a new project |
| `/simplify` | Code simplification audit |

## Domain Rules

`.claude/rules.md` contains the Soranauts Master Guardrails (global, always loaded).
If `.claude/rules/` is created with path-triggered domain rules, they load automatically when working on matching file paths. Do not read them preemptively.

## Sub-Agents

| Agent | Purpose |
|-------|---------|
| research-analyst | Codebase exploration, pattern discovery, convention analysis |

## Reference Docs

When your task involves a specific area, check these:

- `docs/MASTER_GUARDRAILS.md` — Production safety, branching, push checklist
- `docs/ARTICLE_CREATION_GUIDE.md` — Article editorial standards
- `docs/AUTHORING_GUIDE.md` — Content authoring conventions
- `docs/css-system/CSS_GUARDRAILS.md` — CSS rules
- `docs/css-system/DESIGN-TOKENS.md` — Design system tokens
- `docs/claude-context/ARCHITECTURE.md` — System architecture
- `docs/claude-reference/` — Auto-generated reference files (run `npx tsx scripts/generate-claude-reference.ts` to regenerate)
