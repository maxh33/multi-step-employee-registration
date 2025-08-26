import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

// Path to store authentication state
const authFile = path.join(__dirname, 'tests', '.auth', 'user.json');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 24,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video recording on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project - runs authentication once
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Test projects that depend on setup
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use saved auth state
        storageState: authFile,
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },
    {
      name: 'smoke',
      testMatch: [
        /.*authentication\.spec\.ts/,
        /.*firebase-integration\.spec\.ts/,
      ],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },
    {
      name: 'smoke-local',
      testMatch: [
        /.*authentication\.spec\.ts/,
        /.*firebase-integration\.spec\.ts/,
      ],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
        // Optimized for speed
        video: 'off',
        screenshot: 'off',
        trace: 'off',
      },
      dependencies: ['setup'],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: process.env.CI ? 'npm run serve' : 'npm start',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },
});
