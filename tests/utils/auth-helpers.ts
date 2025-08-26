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
  const email = process.env.REACT_APP_TEST_USER_EMAIL || 'test@example.com';
  const password = process.env.REACT_APP_TEST_USER_PASSWORD || 'test123456';
  
  if (!email || !password) {
    throw new Error('Test credentials not configured. Please set REACT_APP_TEST_USER_EMAIL and REACT_APP_TEST_USER_PASSWORD in .env');
  }
  
  return { email, password };
}

/**
 * Login to the application with test credentials
 */
export async function login(page: Page, credentials?: TestCredentials): Promise<void> {
  const creds = credentials || getTestCredentials();
  
  // Navigate to login page
  await page.goto('/');
  
  // Wait for login form to be visible - look for the Login heading
  await page.waitForSelector('h1:has-text("Login")', { timeout: 10000 });
  
  // Fill login form using the Material-UI TextField labels
  // The TextField with label="E-mail" becomes an input with a label
  await page.fill('input[name="email"], input:below(:text("E-mail"))', creds.email);
  await page.fill('input[name="password"], input:below(:text("Senha"))', creds.password);
  
  // Submit login form - button with text "Entrar"
  await page.click('button:has-text("Entrar")');
  
  // Wait for successful login - should redirect to main page
  await page.waitForURL('**/colaboradores', { timeout: 10000 }).catch(async () => {
    // Fallback: wait for main content to appear
    await page.waitForSelector('h1:has-text("Colaboradores")', { timeout: 10000 });
  });
  
  // Verify we're logged in
  await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible();
}

/**
 * Logout from the application
 */
export async function logout(page: Page): Promise<void> {
  // Look for logout button (usually in header or menu)
  const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout")');
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    
    // Wait for redirect to login page
    await page.waitForSelector('h1:has-text("Login")', { timeout: 5000 });
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
    const isOnLoginPage = await page.locator('h1:has-text("Login")').isVisible({ timeout: 1000 });
    
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
  console.log('Ensure test user exists in Firebase Console with credentials from .env');
}
