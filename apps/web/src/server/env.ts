import { z } from 'zod';

const envSchema = z.object({
  INDEXER_URL: z.string().url().default('http://localhost:8787/indexer'),
  DEX_API_URL: z.string().url().default('http://localhost:8787/dex'),
  SORA_WS_URL: z.string().url().default('wss://example.invalid'),
  KV_URL: z.string().url().default('http://localhost:8787/kv'),
  KV_TOKEN: z.string().default('dev'),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:4321'),
});

export const env = envSchema.parse(process.env);


