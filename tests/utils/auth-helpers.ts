/**
 * Authentication test utilities
 * Helpers for handling authentication in Playwright tests
 */

import { Page, expect } from '@playwright/test';

export interface TestCredentials {
  email: string;
  password: string;
}

/**
 * Get test credentials from environment variables
 */
export function getTestCredentials(): TestCredentials {
  // In CI/CD, these should be set from GitHub secrets
  // Fallback values are for local development only
  const email = process.env.REACT_APP_TEST_USER_EMAIL || process.env.TEST_USER_EMAIL || 'test@example.com';
  const password = process.env.REACT_APP_TEST_USER_PASSWORD || process.env.TEST_USER_PASSWORD || 'test123456';
  
  console.log(`Using test email: ${email}`);
  
  return { email, password };
}

/**
 * Login to the application with test credentials
 */
export async function login(page: Page, credentials?: TestCredentials): Promise<void> {
  const creds = credentials || getTestCredentials();
  
  // Navigate directly to the login page
  await page.goto('/login');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait for login form to be visible - the Login text is h4, not h1
  await page.waitForSelector('text=Login', { timeout: 10000 });
  
  // Fill login form - use type selectors which are more reliable
  await page.fill('input[type="email"]', creds.email);
  await page.fill('input[type="password"]', creds.password);
  
  // Submit login form - button with text "Entrar"
  await Promise.all([
    // Wait for either navigation or error message
    Promise.race([
      page.waitForURL('**/colaboradores', { timeout: 30000 }),
      page.waitForSelector('.MuiAlert-message', { timeout: 30000 }),
      page.waitForSelector('h1:has-text("Colaboradores")', { timeout: 30000 })
    ]),
    page.click('button:has-text("Entrar")')
  ]);
  
  // Check if we got an error
  const errorAlert = page.locator('.MuiAlert-message');
  if (await errorAlert.isVisible({ timeout: 1000 })) {
    const errorText = await errorAlert.textContent();
    throw new Error(`Login failed: ${errorText}`);
  }
  
  // Verify we're logged in - wait a bit for the page to settle
  await page.waitForTimeout(2000);
  
  // Check if we're on the main page
  const isOnMainPage = await page.locator('h1:has-text("Colaboradores")').isVisible({ timeout: 5000 });
  if (!isOnMainPage) {
    // Try to navigate to colaboradores directly if not redirected
    await page.goto('/colaboradores');
    await page.waitForSelector('h1:has-text("Colaboradores")', { timeout: 10000 });
  }
}

/**
 * Logout from the application
 */
export async function logout(page: Page): Promise<void> {
  // Look for logout button (usually in header or menu)
  const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout"), [aria-label*="logout" i], [aria-label*="sair" i]');
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    
    // Wait for redirect to login page
    await page.waitForSelector('text=Login', { timeout: 5000 });
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check if we're on the main page (authenticated)
    const isOnMainPage = await page.locator('h1:has-text("Colaboradores")').isVisible({ timeout: 1000 });
    
    // Check if we're on login page (not authenticated)
    const isOnLoginPage = await page.locator('text=Login').isVisible({ timeout: 1000 });
    
    return isOnMainPage && !isOnLoginPage;
  } catch {
    return false;
  }
}

/**
 * Setup authentication state for reuse across tests
 * This can be used with Playwright's storage state feature
 */
export async function setupAuthState(page: Page): Promise<string> {
  await login(page);
  
  // Save storage state to file
  const authFile = 'tests/.auth/user.json';
  await page.context().storageState({ path: authFile });
  
  return authFile;
}

/**
 * Create a test user in Firebase (requires Firebase Admin SDK)
 * Note: This would typically be done via a setup script, not in tests
 */
export async function ensureTestUserExists(): Promise<void> {
  // This would require Firebase Admin SDK which is not available in browser tests
  // Instead, ensure test user is created manually in Firebase Console
  console.log('Ensure test user exists in Firebase Console with credentials from environment variables or use defaults: test@example.com / test123456');
}
