---
title: 'Website Improvements'
layout: '~/layouts/MarkdownLayout.astro'
lastUpdated: '2025-11-09'
metadata:
  title: 'Website Improvements | Soranauts'
  description: 'Recent improvements and new features added to the Soranauts website.'
  robots:
    index: true
    follow: true
---

Soranauts is a living platform. Each deploy blends design, documentation, and automation updates so contributors can trust what they read and ship faster. Key improvements now live on the main branch are summarised below.

## 2025 Highlights

- **Glossary expansion & resilience** — 130+ terms now include category-aware relations, meme-coin context, Polkadot coretime concepts, and safer Pagefind fallbacks so `/glossary` loads instantly even if search assets lag.
- **Static build reliability** — Reverted to Astro’s static output, guarded rate limiting during prerender, and refreshed unit/e2e suites to keep CI green while avoiding adapter-related outages.
- **Navigation polish** — Mobile action bars gained contrast, search and theme controls share consistent focus states, and layout guardrails from the design token refresh keep About, Changelog, and Donate cohesive.

## Recent Platform Work

- Nightly ingestion plus deterministic embeddings keep the knowledge base aligned with wiki, Medium, and GitHub sources without bloating rebuild times.
- Unified Pagefind search replaced Typesense, adds glossary auto-linking, and trims infrastructure cost while maintaining instant answers.
- Canonical, sitemap, and Open Graph checks run in CI to guarantee accurate social previews and clean indexing after every deploy.
- Monorepo guardrails (pnpm parity, large-file blocks, Pagefind cache validation) prevent flaky builds and maintain reproducible environments.

## Looking Ahead

We’re tracking telemetry-informed UX experiments (interactive roadmap metrics, contributor dashboards) and continuing the article-modernisation rollout across legacy posts. Share requests or issues anytime in the [Soranauts Telegram](https://t.me/Soranauts).

---

*Last updated: November 9, 2025*