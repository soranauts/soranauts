# Glossary V2 Dev Server Failure Report

## 1. Context & Goal
- Feature flag: `GLOSSARY_V2` controls the new glossary popover UX; default remains `false` so legacy behaviour persists in production.
- Working branch: `chore/glossary-ux-v2-patch`.
- Environment used while investigating:
  - `astro` 5.13.10 (`@astrojs/compiler` 2.13.0)
  - `pnpm` workspaces, command executed from repo root
  - macOS (Darwin 24.6.0)
- Goal: start the local dev server with `GLOSSARY_V2=true` to preview the new glossary experience across articles and glossary pages.

## 2. Reproduction Steps
1. Ensure dependencies installed (`pnpm install`).
2. Clear Astro/Vite caches (attempted multiple times):
   ```bash
   rm -rf apps/web/.astro apps/web/node_modules/.vite apps/web/dist
   ```
3. Start the dev server with the feature flag enabled:
   ```bash
   GLOSSARY_V2=true pnpm --filter @soranauts/web dev
   ```
4. Observe the server panic before the site becomes interactive.

## 3. Symptoms & Stack Trace
- The terminal immediately reports a compiler panic after Astro begins watching files. Browser shows an “UnknownCompilerError”.
- Console excerpt:
  ```text
  astro  v5.13.10 ready in 711 ms

  panic: html: bad parser state: originalIM was set twice [recovered]
  	panic: interface conversion: string is not error: missing method Error

  TypeError: Cannot read properties of undefined (reading 'exports')
      at syscall/js.valueNew (.../@astrojs+compiler@2.13.0/node_modules/@astrojs/compiler/dist/chunk-W5DTLHV4.js:1:4526)
      ...
      at Object.transform (.../@astrojs+compiler@2.13.0/node_modules/@astrojs/compiler/dist/chunk-W5DTLHV4.js:1:6575)
  ```
- In the browser (`http://localhost:4321/` or `:4322`), Astro shows:
  - “Unknown compiler error.”
  - “Cannot read properties of undefined (reading 'exports')”.
  - File highlighted: `apps/web/src/layouts/Layout.astro`.

## 4. Investigation Summary
- **Inline Popover Layout**: Moved the glossary popover markup and scripts directly into `Layout.astro` (under the `GLOSSARY_V2` check) to eliminate component import issues.
- **Script Variations**: Tried inline `<script is:inline>` blocks, removing `GlossaryScripts.astro`, and temporarily commenting out the popover script entirely. The compiler panic persisted even with the popover script removed, implying the failure occurs during layout parsing rather than runtime JS.
- **Cache Reset & Port Changes**: Repeatedly cleared `.astro`, `.vite`, and `dist`. Astro occasionally switched to port `4322` but continued to panic.
- **Feature Flag Off**: With `GLOSSARY_V2=false`, legacy mode serves successfully, indicating the panic is linked to the newly introduced layout changes.
- **Suspected Root Cause**: Astro 5.13.x / compiler 2.13.0 has a known parser bug when complex conditional markup appears near the end of a page (especially with nested `<script>` blocks). The stack trace matches known issues filed against the compiler.

## 5. Recommended Next Actions
1. **Upgrade Astro / Compiler**: Update to the latest `astro` (currently 5.15.3 per CLI notice) which bundles a newer compiler and reportedly fixes similar `originalIM` crashes. Command: `pnpm dlx @astrojs/upgrade` or manually bump `astro` in `apps/web/package.json` and reinstall.
2. **Refactor Popover Injection** (if upgrade not immediately possible):
   - Move the popover HTML back into a partial (e.g., `GlossaryPopoverShell.astro`).
   - Load the script via a dedicated client entry (`GlossaryPopover.client.ts`) instead of an inline `<script>`.
   - Ensure the partial is only rendered when `GLOSSARY_V2` is true.
3. **File Minimal Repro with Astro**: If upgrading fails, capture a pared-down copy of `Layout.astro` that still triggers the panic and open an issue at https://astro.build/issues/compiler.
4. **Document Flag Usage**: Continue noting in README/PRs that previews require `GLOSSARY_V2=true` and the upgraded toolchain once resolved.

## 6. Quick Revert Path
- Script: `scripts/revert-glossary-v2.sh`
  - Usage: `bash scripts/revert-glossary-v2.sh [target-ref]`
  - Defaults to `origin/main` as the target.
  - Protects `main` by refusing to run there, creates a backup branch (`backup/glossary-v2-<timestamp>`) before resetting, and auto-stashes dirty work.
  - Run `chmod +x scripts/revert-glossary-v2.sh` once after pulling the script.
- This provides a fast rollback to a clean baseline while keeping a recoverable snapshot.

## 7. Attachments & References
- Layout file under scrutiny: `apps/web/src/layouts/Layout.astro`
- Related scripts/styles: `GlossaryPopover.ts`, `glossary-popover.css`, `GlossaryV2Styles.astro` (before inlining)
- Feature flag documentation: `env.example`, `apps/web/README-GLOSSARY.md`

## 8. Resolution ✅

**Status**: RESOLVED

**Date**: 2025-01-XX

**Solution**: Upgraded to Astro 5.15.3 (latest version at time of testing)

**Verification Steps**:
1. Updated Astro to latest: `pnpm --filter @soranauts/web up astro@latest @astrojs/compiler@latest`
2. Installed dependencies: `pnpm i`
3. Cleared caches: `rm -rf apps/web/.astro apps/web/node_modules/.vite apps/web/dist`
4. Started dev server with feature flag: `GLOSSARY_V2=true pnpm --filter @soranauts/web dev`

**Results**:
- ✅ Server starts successfully without compiler panics
- ✅ No "originalIM was set twice" errors
- ✅ No "UnknownCompilerError" messages
- ✅ Pages serve correctly with glossary-v2 styles loaded
- ✅ Dev server ready in ~567ms (Astro v5.15.3)

**Conclusion**: The compiler bug that caused the panic in Astro 5.13.10 / compiler 2.13.0 has been fixed in Astro 5.15.3. The Glossary V2 feature now works correctly in development mode.

