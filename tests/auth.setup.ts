import { test as setup, expect } from '@playwright/test';
import { login } from './utils/auth-helpers';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  try {
    // Login once and save the authentication state
    await login(page);
    
    // Verify we're logged in - wait a bit longer and be more flexible
    const collaboratorsHeading = page.locator('h1:has-text("Colaboradores")');
    await expect(collaboratorsHeading).toBeVisible({ timeout: 15000 });
    
    // Save storage state
    await page.context().storageState({ path: authFile });
    console.log('Authentication setup completed successfully');
  } catch (error) {
    console.error('Authentication setup failed:', error);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests/.auth/setup-failed.png' });
    
    // Log what page we're actually on
    const url = page.url();
    const title = await page.title().catch(() => 'Unable to get title');
    console.error(`Failed on URL: ${url}, Title: ${title}`);
    
    // Check if we're seeing an error message
    const errorAlert = page.locator('.MuiAlert-message');
    if (await errorAlert.isVisible({ timeout: 1000 })) {
      const errorText = await errorAlert.textContent();
      console.error(`Error message visible: ${errorText}`);
    }
    
    throw error;
  }
});
