import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm preview -- --port 4321 --host 127.0.0.1',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      GLOSSARY_SEARCH_V2: 'true',
      TAG_HUB_V1: 'true',
      FEATURE_GLOSSARY_V2025: 'true',
      FEATURE_GLOSSARY_ALIAS_REDIRECT: 'true',
      NEXT_PUBLIC_FEATURE_GLOSSARY_ALIAS_REDIRECT: 'true',
    },
  },
});


