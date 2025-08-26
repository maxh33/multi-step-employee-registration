import { test as setup, expect } from '@playwright/test';
import { login } from './utils/auth-helpers';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Login once and save the authentication state
  await login(page);
  
  // Verify we're logged in
  await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible();
  
  // Save storage state
  await page.context().storageState({ path: authFile });
});
