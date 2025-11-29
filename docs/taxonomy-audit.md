# Taxonomy Audit & Guard

This checklist keeps glossary redirects deterministic and production-safe.

## Core Commands

- `pnpm taxonomy:audit --debug` — scan markdown/tsx/astro sources for `/glossary/*` refs using the mtime cache. Use `--changed-only` during tight loops, or drop the flag to force a full pass.
- `pnpm taxonomy:fix --debug` — regenerates the glossary redirect block, adds any missing alias pairs, and rewrites `apps/web/vercel.json` with the stable splice logic.
- `pnpm taxonomy:test:snapshot` — snapshot test for the redirect block. Fails if the glossary slice is non-contiguous, unsorted (source, then destination, using `Intl.Collator`), or if duplicate `source` paths appear.
- `pnpm taxonomy:guard` — runs `pnpm taxonomy:fix` and asserts that all non-glossary redirects remain byte-for-byte identical.
- `pnpm verify:live` — hits the production deployment (`https://soranauts.com`) to confirm that canonical slugs return `200` and legacy aliases 308 → 200 chains.

## Exit Codes

| Code | Meaning |
| --- | --- |
| `0` | Clean run (or `--fix` completed). |
| `10` | Alias link references exist without matching redirects. |
| `11` | Content references a slug that is neither canonical nor aliased. |

> When `--fix` is supplied the script always exits `0` after applying changes, but it still prints the unresolved canonical gaps for follow-up.

## Changed-Only Expectations

- `pnpm taxonomy:audit --debug --changed-only` diffs against `origin/main`.
- When no changed files are detected and the cache is valid, the command prints “No files to scan; glossary audit clean.”
- If the glossary dataset (`glossary.v2025.json`) hash changes, the mtime cache is invalidated automatically and a full scan is forced on the next run.

## Live Verification Targets

`pnpm verify:live` asserts:

- Canonical slugs respond with HTTP `200`.
- Legacy aliases issue an HTTP `308` to the canonical slug, which then resolves to `200`.
- The script emits ✅/✓ style lines so it can be copied into deployment notes.

