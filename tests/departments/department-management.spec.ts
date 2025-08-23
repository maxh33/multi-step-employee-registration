// Department CRUD operations test
import { test, expect } from '@playwright/test';

test.describe('Department Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    
    // Login with test credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'test123456');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForURL('**/colaboradores');
  });

  test('should navigate to departments page', async ({ page }) => {
    // Click on Departamentos in sidebar
    await page.click('text=Departamentos');
    
    // Check if we're on the departments page
    await expect(page).toHaveURL('**/departamentos');
    await expect(page.locator('h1')).toContainText('Departamentos');
  });

  test('should open create department form', async ({ page }) => {
    // Navigate to departments
    await page.goto('http://localhost:3000/departamentos');
    
    // Click on new department button
    await page.click('button:has-text("Novo Departamento")');
    
    // Check if form dialog is open
    await expect(page.locator('text=Novo Departamento').nth(1)).toBeVisible();
    await expect(page.locator('text=Nome do Departamento')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Navigate to departments
    await page.goto('http://localhost:3000/departamentos');
    
    // Open create form
    await page.click('button:has-text("Novo Departamento")');
    
    // Try to submit empty form
    await page.click('button:has-text("Criar")');
    
    // Check for validation errors
    await expect(page.locator('text=Nome do departamento é obrigatório')).toBeVisible();
    await expect(page.locator('text=Responsável é obrigatório')).toBeVisible();
  });
});
