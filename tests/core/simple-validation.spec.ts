import { test, expect } from '@playwright/test';

test.describe('Simple Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Simple wait for page load instead of Firebase detection
    await page.waitForSelector('text=Colaboradores', { timeout: 10000 });
  });

  test('should load the application correctly', async ({ page }) => {
    // Verify main page loads - use the h1 heading specifically
    await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible();
    await expect(page.locator('button:has-text("Novo Colaborador")')).toBeVisible();
  });

  test('should open new employee form', async ({ page }) => {
    // Click to create new employee
    await page.click('button:has-text("Novo Colaborador")');
    
    // Should navigate to form - use the h5 heading specifically
    await expect(page.locator('h5:has-text("Infos Básicas")')).toBeVisible();
  });

  test('should validate required fields in step 1', async ({ page }) => {
    await page.click('button:has-text("Novo Colaborador")');
    
    // Try to proceed without filling anything
    await page.click('button:has-text("Próximo")');
    
    // Should show validation errors
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
    await expect(page.locator('text=E-mail é obrigatório')).toBeVisible();
  });

  test('should advance to step 2 with valid data', async ({ page }) => {
    await page.click('button:has-text("Novo Colaborador")');
    
    // Generate unique email to prevent duplicates
    const timestamp = Date.now();
    const uniqueEmail = `test-user-${timestamp}@example.com`;
    
    // Fill required fields
    await page.fill('input[placeholder="João da Silva"]', 'Test User');
    await page.fill('input[placeholder="e.g. john@gmail.com"]', uniqueEmail);
    
    // Click the toggle for activate on create
    await page.click('text=Ativar ao criar');
    
    // Should be able to proceed
    await page.click('button:has-text("Próximo")');
    
    // Should reach step 2 - use the h5 heading specifically
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
  });

  test('should complete form submission', async ({ page }) => {
    await page.click('button:has-text("Novo Colaborador")');
    
    // Generate unique email to prevent duplicates
    const timestamp = Date.now();
    const uniqueEmail = `test-employee-${timestamp}@example.com`;
    const uniqueName = `Test Employee ${timestamp}`;
    
    // Fill step 1
    await page.fill('input[placeholder="João da Silva"]', uniqueName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', uniqueEmail);
    await page.click('text=Ativar ao criar');
    await page.click('button:has-text("Próximo")');
    
    // Fill step 2
    await page.click('text=Selecione um departamento');
    await page.click('text=Desenvolvimento');
    
    // Submit form
    await page.click('button:has-text("Concluir")');
    
    // Should return to employee list - use the h1 heading specifically
    await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible({ timeout: 15000 });
    
    // Should show the new employee
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible({ timeout: 10000 });
  });
});