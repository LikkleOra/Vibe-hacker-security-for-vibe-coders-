import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'global setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'unauthenticated',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['global setup'],
      testMatch: /.*.spec.ts/,
    },
    {
      name: 'authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './playwright/.clerk/user.json',
      },
      dependencies: ['global setup'],
      testMatch: /.*.authenticated.spec.ts/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
