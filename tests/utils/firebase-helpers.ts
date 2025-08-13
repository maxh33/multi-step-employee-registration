/**
 * Firebase test utilities
 * Helpers for testing Firebase integration in Playwright tests
 */

import { Page, expect } from '@playwright/test';

export interface FirebaseTestConfig {
  projectId: string;
  apiKey: string;
  authDomain: string;
}

/**
 * Wait for Firebase to be initialized on the page
 * Modern Firebase v9+ doesn't expose global variables, so we check for React app readiness
 */
export async function waitForFirebaseInit(page: Page): Promise<void> {
  // Wait for React app to load and render main content
  await page.waitForSelector('[data-testid="app-loaded"]', { timeout: 5000 }).catch(async () => {
    // Fallback: wait for main navigation elements - use h1 specifically
    await page.waitForSelector('h1:has-text("Colaboradores")', { timeout: 10000 });
  });
}

/**
 * Check if Firebase connection is working
 * We do this by checking if the app loads without Firebase errors
 */
export async function verifyFirebaseConnection(page: Page): Promise<boolean> {
  try {
    // Check for Firebase initialization errors in console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Firebase')) {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit for any Firebase errors to surface
    await page.waitForTimeout(2000);
    
    // If we can see the main content and no Firebase errors, connection is good
    const hasMainContent = await page.locator('h1:has-text("Colaboradores")').isVisible();
    const hasFirebaseErrors = errors.length > 0;
    
    return hasMainContent && !hasFirebaseErrors;
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    return false;
  }
}

/**
 * Wait for form submission to complete
 */
export async function waitForSubmissionComplete(page: Page): Promise<void> {
  // Wait for loading state to disappear
  await page.waitForSelector('[data-testid="loading"]', { state: 'hidden', timeout: 10000 });
  
  // Wait for success message or redirect
  await Promise.race([
    page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 }),
    page.waitForURL('**/colaboradores', { timeout: 5000 }),
    page.waitForSelector('.MuiAlert-standardSuccess', { timeout: 5000 }),
  ]);
}

/**
 * Verify employee data was saved to Firebase
 * Note: This would require Firebase Admin SDK for full verification
 */
export async function verifyEmployeeSaved(page: Page, employeeData: any): Promise<void> {
  // In a real test, you might:
  // 1. Use Firebase Admin SDK to query the database
  // 2. Check if the employee appears in the list
  // 3. Verify the data matches what was submitted
  
  // For now, we'll check if the employee appears in the list
  await page.goto('/colaboradores');
  await expect(page.locator('text=' + employeeData.firstName)).toBeVisible({ timeout: 10000 });
}

/**
 * Clean up test data (if needed)
 */
export async function cleanupTestData(page: Page, testId?: string): Promise<void> {
  // In a real implementation, you might:
  // 1. Use Firebase Admin SDK to delete test records
  // 2. Clear localStorage/sessionStorage
  // 3. Reset application state
  
  // For now, clear browser storage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}