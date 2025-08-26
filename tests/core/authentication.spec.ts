import { test, expect } from '@playwright/test';

// This test file doesn't use global auth to test the login functionality itself
test.describe('Authentication Tests', () => {
  // Don't use global auth for these tests
  test.use({ storageState: { cookies: [], origins: [] } });
  
  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/login');
    
    // Should see the login page with "Login" text
    await expect(page.locator('text=Login').first()).toBeVisible();
    // Should see email and password fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    // Should see login button
    await expect(page.locator('button:has-text("Entrar")')).toBeVisible();
  });
  
  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to access protected route
    await page.goto('/colaboradores');
    
    // Should be redirected to unauthorized page (based on App.tsx fallback)
    await expect(page).toHaveURL(/\/unauthorized/);
    
    // Navigate to login from unauthorized page
    await page.goto('/login');
    await expect(page.locator('text=Login').first()).toBeVisible();
  });
  
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Get credentials from environment with fallback
    const email = process.env.REACT_APP_TEST_USER_EMAIL || process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.REACT_APP_TEST_USER_PASSWORD || process.env.TEST_USER_PASSWORD || 'test123456';
    
    // Fill login form
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    
    // Submit login
    await page.click('button:has-text("Entrar")');
    
    // Should redirect to main page after successful login
    await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible({ timeout: 15000 });
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit login
    await page.click('button:has-text("Entrar")');
    
    // Should show error message
    const errorLocator = page.locator('.MuiAlert-message, [role="alert"]');
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
  });
  
  test('should validate required fields', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit without filling any fields
    await page.click('button:has-text("Entrar")');
    
    // Should show validation errors
    await expect(page.locator('text=E-mail é obrigatório')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('text=Senha é obrigatória')).toBeVisible({ timeout: 2000 });
  });
  
  test('should validate email format', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid email format
    await page.fill('input[type="email"]', 'notanemail');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Entrar")');
    
    // Should show email format validation error
    await expect(page.locator('text=E-mail deve ter um formato válido')).toBeVisible({ timeout: 2000 });
  });
  
  test('should validate password length', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with short password
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123');
    await page.click('button:has-text("Entrar")');
    
    // Should show password length validation error
    await expect(page.locator('text=Senha deve ter pelo menos 6 caracteres')).toBeVisible({ timeout: 2000 });
  });
  
  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    const email = process.env.REACT_APP_TEST_USER_EMAIL || process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.REACT_APP_TEST_USER_PASSWORD || process.env.TEST_USER_PASSWORD || 'test123456';
    
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button:has-text("Entrar")');
    
    // Wait for login to complete
    await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible({ timeout: 15000 });
    
    // Find and click logout button
    const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout"), [aria-label*="logout" i], [aria-label*="sair" i]');
    await logoutButton.click();
    
    // Should redirect to login page
    await expect(page.locator('text=Login').first()).toBeVisible({ timeout: 5000 });
  });
});
