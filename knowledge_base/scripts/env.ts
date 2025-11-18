import { env } from '../../apps/web/src/server/env';

// Re-export the extended env schema for KB scripts
export { env };
export type KBEnv = typeof env;


















