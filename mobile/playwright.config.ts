import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  fullyParallel: false,
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:19006',
    trace: 'on-first-retry',
  },
  workers: 1,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: '..\\..\\.venv\\Scripts\\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000',
      cwd: '../backend',
      name: 'backend',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: 'http://127.0.0.1:8000/health',
    },
    {
      command: 'npm run web -- --port 19006',
      cwd: '.',
      name: 'expo-web',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      url: 'http://127.0.0.1:19006/',
    },
  ],
});