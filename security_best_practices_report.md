# Security Vulnerability Audit Report (Soranauts)

Date: 2026-02-06

Scope:
- Repository: Soranauts monorepo (Astro + React frontend, Node/TS scripts, KB ingestion tooling)
- Reviewed: application code, scripts, GitHub Actions workflows, docker-compose dev configs
- Not reviewed: runtime/edge/CDN security headers actually served in production (must be verified via deployed response headers)

Method:
- Static review via repo inspection + targeted searches (XSS sinks, exec/eval sinks, secrets, workflows).
- Dependency advisory scanning was not performed in this environment (package manager access + network access were restricted), so findings focus on code/config issues visible in the repo.

## Executive Summary

Top risks found:
1. **Broken CI guardrails**: multiple GitHub Actions workflows contain unresolved merge-conflict markers, which can prevent CI from running at all. This increases the chance of security regressions shipping.
2. **XSS risk in client-side UI**: the search modal and table-of-contents build HTML strings and assign them via `innerHTML` without escaping; if attacker-controlled content ever enters the search index/content, this becomes a DOM XSS vector.
3. **Rate-limiting is not production-safe**: the `/api/quote` endpoint uses an in-memory Map keyed by spoofable headers; in serverless/multi-instance production it can be bypassed and can be abused for memory/CPU pressure.
4. **Dev-script command injection / unsafe file writes**: a few scripts use shell execution with interpolated values, and one script writes output paths based on unsanitized frontmatter.

What looked good:
- No committed secrets found by token-pattern scans.
- `/api/quote` validates inputs with Zod.
- KB scrapers sanitize HTML using `sanitize-html` (good baseline).
- `.npmrc` sets `strict-ssl=true`.
- PNPM overrides indicate active mitigation of known advisories (good practice).

## Remediation Status (2026-02-06)

This report captured initial static findings. The repo has since been updated (in the current working tree) to remediate or mitigate all items below; evidence line numbers under each finding refer to the pre-fix state.

- CRIT-001: Fixed (workflow conflict markers removed and permissions blocks restored).
- HIGH-001: Mitigated (escaped dynamic HTML interpolations and hardened href handling/highlighting; TOC now built via DOM APIs).
- HIGH-002: Fixed (glossary definitions are now sanitized/escaped at the rendering boundary via an allowlist sanitizer).
- HIGH-003: Mitigated (rate limiter now keys by trusted runtime client address, does not trust forwarded headers unless explicitly enabled, and bounds in-memory key growth).
- MED-001: Fixed (dev preview script uses `execFile` and validates slugs).
- MED-002: Fixed (release tagging script uses `execFileSync` and validates tag names).
- MED-003: Fixed (OG generator validates slugs before using them as filenames).
- MED-004: Fixed (removed unused script that performed dynamic code execution).
- MED-005: Mitigated (KB scrapers now skip unsafe/private/local image URLs).
- LOW-001: Fixed (compose ports bound to localhost; Typesense key comes from env).
- LOW-002: Fixed (quote API returns detailed error messages only in dev).

## Critical Findings

### CRIT-001: GitHub Actions workflows contain unresolved merge-conflict markers

Impact: **CI and security guardrails may not run**, allowing vulnerable code/config changes to land undetected.

Evidence:
- `.github/workflows/ci.yml:8-13`
- `.github/workflows/web-e2e.yml:14-19`
- `.github/workflows/content-ci.yml:12-18`
- `.github/workflows/docs-validation.yml:30-35`
- `.github/workflows/taxonomy-guard.yml:17-22`
- `.github/workflows/guard-large-files.yml:5-10`
- `.github/workflows/snapshot.yml:14-19`
- `.github/workflows/validate-og.yml:5-11`
- `.github/workflows/redirects-guard.yml:13-18`
- `.github/workflows/kb-backtest.yml:8-14`
- `.github/workflows/ops-budgets.yml:14-20`

Recommendation:
- Resolve these conflicts immediately and confirm workflows execute on PRs and `main` pushes.
- After restoring CI, add at least one security-oriented check (e.g., CodeQL + dependency advisory scanning) to regain defense-in-depth.

## High Findings

### HIGH-001: DOM XSS risk from HTML-string construction + `innerHTML` in search UI

Why this matters:
- `innerHTML` is a dangerous sink. If any attacker-controlled string can reach it (CMS content, imported content, compromised content source, or accidental inclusion of raw `<...>` characters), this can become an XSS vulnerability.

Evidence:
- `apps/web/src/components/SearchModal.astro:1170` sets `this.results.innerHTML = sections.join('')`.
- `apps/web/src/components/SearchModal.astro:1292-1383` builds HTML strings that interpolate dynamic fields (e.g., `item.url`, `item.term`, `item.title`, `item.category`, aliases, tags).
- `apps/web/src/components/SearchModal.astro:1406-1441` generates `<mark>` tags by concatenating raw substrings of `text` without HTML escaping.

Risk assessment:
- If all `item.*` fields are strictly from trusted, review-gated repo content, the risk is reduced.
- If any content is imported/synced from third parties or user input, this becomes a likely exploitation path.

Recommendation:
- Avoid `innerHTML` for result rendering. Preferred fixes:
  - Build DOM nodes using `document.createElement()` and assign `textContent` for text.
  - If highlighting is required, wrap ranges by creating `<mark>` nodes, not by concatenating HTML strings.
- If you must use HTML strings:
  - Escape all dynamic interpolations (`item.*`) before insertion.
  - Consider a Trusted Types + CSP plan to constrain future XSS sinks.

### HIGH-002: Glossary definition HTML bypass path (raw HTML accepted when detected)

Why this matters:
- The glossary term page renders `definitionHtml` via `set:html` / `dangerouslySetInnerHTML`. A code path explicitly returns raw `displayDefinition` when it contains HTML tags, skipping escaping/sanitization.

Evidence:
- `apps/web/src/pages/glossary/[slug].astro:339-387`:
  - `definitionHasHtml = /</?[a-z][\\s>]/i.test(displayDefinition)`
  - `if (definitionHasHtml) return displayDefinition;`
- `apps/web/src/pages/glossary/[slug].astro:663` renders `<div ... set:html={definitionHtml}>`.
- `apps/web/src/components/glossary/v3/GlossaryTermPage.tsx:204-207` renders `definitionHtml` via `dangerouslySetInnerHTML`.

Notes:
- As of this audit, the generated glossary datasets inspected (`apps/web/public/glossary.json`, `apps/web/public/data/glossary.v2025.json`) did not appear to contain HTML tags. This reduces immediate exploitability, but the bypass is still a latent footgun.

Recommendation:
- Treat glossary definitions as untrusted by default at the rendering boundary.
- Either:
  - Forbid HTML in definitions and always escape, or
  - Sanitize allowed HTML (allowlist-based) before rendering, and centralize that sanitization.

### HIGH-003: Rate limiting is in-memory and header-based; vulnerable to bypass/DoS characteristics in production

Why this matters:
- Serverless/multi-instance deployments make in-memory rate limiting ineffective.
- Keying by `x-forwarded-for`/`x-real-ip` without a trusted proxy boundary makes the limiter susceptible to spoofing and unbounded key growth.

Evidence:
- `apps/web/src/server/rate-limit.ts:9-38` uses a process-local `Map` and iterates the whole map every request to clean expired entries.
- `apps/web/src/server/rate-limit.ts:104-124` derives identity from `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`.
- `apps/web/src/pages/api/quote.ts:26-45` enforces this limiter before proxying to the DEX.

Recommendation:
- Use a distributed limiter (Redis/Upstash/Vercel KV/Cloudflare KV/Workers Durable Objects) and key by a trusted client identity source.
- Put hard caps on memory growth if any in-process limiter remains (LRU/size limit), and avoid trusting spoofable headers unless you can guarantee they are overwritten by your edge.

## Medium Findings

### MED-001: Dev-script command injection risk via `exec()` with interpolated URL

Why this matters:
- `exec()` runs through a shell. If `slug` or `url` contain quotes or shell metacharacters, a malicious frontmatter value can lead to arbitrary command execution when a developer runs this script.

Evidence:
- `scripts/dev/preview-term.ts:59-69` uses `execAsync(\`open "${url}"\`)` / `start` / `xdg-open`.
- `scripts/dev/preview-term.ts:168-173` builds `previewUrl` containing `slug`, which is read from glossary MDX frontmatter (`scripts/dev/preview-term.ts:75-105`).

Recommendation:
- Replace `exec()` with `execFile()`/`spawn()` using argument arrays (no shell).
- Validate `slug` against an allowlist regex (e.g., `^[a-z0-9-]+$`) before using it in a URL.

### MED-002: Command injection risk in release helper script

Evidence:
- `scripts/release-tag.js:5,18-24` interpolates `tagName` (argv) into shell commands executed by `execSync()`.

Recommendation:
- Validate `tagName` (e.g., `^[A-Za-z0-9._/-]+$` with additional git tag constraints), or use `execFileSync('git', [...])` to avoid shell parsing.

### MED-003: Path traversal risk in OG generator (unsanitized slug used in output path)

Evidence:
- `scripts/generate-og.ts:157-173` reads `slug` from frontmatter without sanitization.
- `scripts/generate-og.ts:227-243` writes `OUTPUT_DIR/${term.slug}.svg` via `path.join(...)`.

Recommendation:
- Enforce a strict slug allowlist and reject/normalize anything else before using it as a filename.

### MED-004: Dynamic code execution (`new Function`) in glossary generator script

Evidence:
- `apps/web/scripts/generate-glossary-fixed.js:167-173` evaluates generated JS via `new Function(...)()`.

Recommendation:
- Avoid `new Function` and parse the source with a real parser (TypeScript compiler API, Babel parser) or change the source format to JSON/YAML so it can be parsed safely. In this repo, the cited script was removed because it was unused and relied on dynamic code execution.

### MED-005: Potential SSRF characteristics in KB scrapers via image downloads

Why this matters:
- Scrapers download `img[src]` URLs found in third-party HTML and write them to disk. If upstream HTML is compromised, this can be used to fetch internal resources when running in privileged networks.

Evidence:
- `knowledge_base/scripts/soramitsu_scrape.ts:213-226` downloads any `http(s)` image URL discovered in sanitized HTML.
- Similar pattern exists in Medium import (`knowledge_base/scripts/medium_import.ts:40-83` and `:260-267`).

Recommendation:
- Block private IP ranges and non-allowed domains for downloads, or only allow known CDN hosts for images.
- Enforce size limits/timeouts and limit concurrent downloads (some scripts already set request timeouts).

## Low Findings

### LOW-001: Dev docker-compose configs expose services on 0.0.0.0 with weak/no auth defaults

Evidence:
- `apps/web/docker-compose.yml` runs Typesense with `--api-key=xyz --enable-cors --listen-address=0.0.0.0`.
- `docker-compose.chroma.yml` runs Chroma with `CHROMA_SERVER_HOST=0.0.0.0` and `ALLOW_RESET=TRUE`.

Recommendation:
- Bind to `127.0.0.1` for local dev.
- Use non-default secrets and disable dangerous flags (`ALLOW_RESET`) outside ephemeral/local environments.

### LOW-002: Quote API returns internal error details

Evidence:
- `apps/web/src/pages/api/quote.ts:100-113` returns `details: error.message` to clients.

Recommendation:
- In production, return a generic message and log the detailed error server-side only.

## Suggested Next Steps

1. Fix CRIT-001 to restore CI and prevent unreviewed/unchecked changes from landing.
2. Address HIGH-001/HIGH-002 (XSS sinks) and add a CSP plan to mitigate any remaining escape hatches.
3. Replace the in-memory/header-based rate limiter (HIGH-003) with a distributed, trusted-source limiter.
4. Harden dev/ops scripts (MED-001..004) to reduce maintainer workstation/CI risk.
5. Add automated security checks once CI is healthy (CodeQL + dependency advisory scanning + secret scanning).
