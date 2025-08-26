import { test, expect } from '@playwright/test';

// This test file doesn't use global auth to test the login functionality itself
test.describe('Authentication Tests', () => {
  // Don't use global auth for these tests
  test.use({ storageState: { cookies: [], origins: [] } });
  
  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/');
    
    // Should see the login page with "Login" heading
    await expect(page.locator('h1:has-text("Login")')).toBeVisible();
    // Should see email and password fields (Material-UI TextFields with labels)
    await expect(page.locator('text=E-mail')).toBeVisible();
    await expect(page.locator('text=Senha')).toBeVisible();
    // Should see login button
    await expect(page.locator('button:has-text("Entrar")')).toBeVisible();
  });
  
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/');
    
    // Get credentials from environment
    const email = process.env.REACT_APP_TEST_USER_EMAIL;
    const password = process.env.REACT_APP_TEST_USER_PASSWORD;

    // Fill login form using Material-UI TextField selectors
    await page.fill('input:below(:text("E-mail"))', email);
    await page.fill('input:below(:text("Senha"))', password);
    
    // Submit login
    await page.click('button:has-text("Entrar")');
    
    // Should redirect to main page after successful login
    await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible({ timeout: 10000 });
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    // Fill login form with invalid credentials
    await page.fill('input:below(:text("E-mail"))', 'invalid@example.com');
    await page.fill('input:below(:text("Senha"))', 'wrongpassword');
    
    // Submit login
    await page.click('button:has-text("Entrar")');
    
    // Should show error message - check for various possible error texts
    const errorLocator = page.locator('.MuiAlert-message, [role="alert"]');
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
  });
  
  test('should validate required fields', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit without filling any fields
    await page.click('button:has-text("Entrar")');
    
    // Should show validation errors
    await expect(page.locator('text=E-mail é obrigatório')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('text=Senha é obrigatória')).toBeVisible({ timeout: 2000 });
  });
  
  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    
    // Fill with invalid email format
    await page.fill('input:below(:text("E-mail"))', 'notanemail');
    await page.fill('input:below(:text("Senha"))', 'password123');
    await page.click('button:has-text("Entrar")');
    
    // Should show email format validation error
    await expect(page.locator('text=E-mail deve ter um formato válido')).toBeVisible({ timeout: 2000 });
  });
  
  test('should validate password length', async ({ page }) => {
    await page.goto('/');
    
    // Fill with short password
    await page.fill('input:below(:text("E-mail"))', 'test@example.com');
    await page.fill('input:below(:text("Senha"))', '123');
    await page.click('button:has-text("Entrar")');
    
    // Should show password length validation error
    await expect(page.locator('text=Senha deve ter pelo menos 6 caracteres')).toBeVisible({ timeout: 2000 });
  });
  
  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/');
    const email = process.env.REACT_APP_TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.REACT_APP_TEST_USER_PASSWORD || 'test123456';
    
    await page.fill('input:below(:text("E-mail"))', email);
    await page.fill('input:below(:text("Senha"))', password);
    await page.click('button:has-text("Entrar")');
    
    // Wait for login to complete
    await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible({ timeout: 10000 });
    
    // Find and click logout button (usually in header)
    // The logout button might be in a menu or directly visible
    const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout"), [aria-label*="logout" i], [aria-label*="sair" i]');
    await logoutButton.click();
    
    // Should redirect to login page
    await expect(page.locator('h1:has-text("Login")')).toBeVisible({ timeout: 5000 });
  });
});
