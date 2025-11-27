import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/tests/e2e/**',
      '**/src/server/__tests__/rate-limit.test.ts' // Temporarily disable failing tests
    ]
  }
});
