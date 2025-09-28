# Soranauts Monorepo Architecture

## Goals
- Keep content (Astro) fast and static while tools behave like small web apps.
- Abstract chain access behind a typed facade so backends can change (Substrate now, Iroha later).
- Use a thin server layer for caching, rate limiting, and secret management.

## Layout
```
/apps
  /web    # Astro site (content, SEO, glossary)
  /tools  # Tools mounted at /tools (React islands inside Astro)
/packages
  /chain  # Chain/index/dex adapters exposed via a typed facade
  /ui     # Shared UI components (buttons, cards, charts)
  /config # Shared tsconfig, eslint, tailwind preset
```

## Data Flow
UI → `/api/*` (Edge/Serverless) → adapters in `packages/chain` → chain/indexers.

## Chain Facade (sketch)
```ts
export interface Chain {
  accounts: {
    connect(): Promise<void>;
    getAddress(): string | null;
    signAndSend(tx: unknown): Promise<{ hash: string }>;
  };
  sora: {
    symbol(): Promise<string>;
    balance(address: string): Promise<bigint>;
  };
  dex: {
    getQuote(a: string, b: string, amount: string): Promise<{ out: string; fee: string; route: string[] }>;
  };
  index: {
    swapsByAddress(address: string, opts?: { limit?: number; cursor?: string }): Promise<{ items: any[]; cursor?: string }>;
  };
}
```

## Server Endpoints
- `GET /api/quote?a&b&amount` → `Chain.dex.getQuote` (cache 10s via KV).
- `GET /api/portfolio?address` → balances + history via `Chain.sora` + `Chain.index`.

## Security
- All secrets and base URLs are server-side env.
- CORS allowlist, rate limiting per IP/address, Sentry everywhere.

## Testing
- Unit tests for adapters (mock network).
- Playwright for quote and portfolio happy paths.
