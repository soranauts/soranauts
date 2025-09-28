# Build Plan (checklist for Cursor)

- [ ] Create pnpm workspaces monorepo (apps/*, packages/*); move Astro → apps/web
- [ ] packages/config: shared tsconfig, eslint, prettier, tailwind preset
- [ ] packages/chain: scaffold facade + Substrate read adapter (balances, symbol)
- [ ] apps/web: /api/quote (Edge GET, zod validation, 10s KV cache)
- [ ] apps/web: /tools/quote (React island, TanStack Query, Zod)
- [ ] apps/web: /tools/portfolio (read-only balances + CSV export)
- [ ] Glossary a11y (button + aria-describedby, ESC to close, deep link)
- [ ] Env validation (zod) + .env.example
- [ ] Sentry + Playwright smoke tests + GitHub Action (typecheck/lint/build)
