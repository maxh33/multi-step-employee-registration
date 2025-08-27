import { test, expect } from '@playwright/test';

// Authentication is handled globally via playwright.config.ts and auth.setup.ts
// Tests now use the saved authentication state automatically

test.describe('Simple Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page - authentication is already handled
    await page.goto('/colaboradores');
    
    // Verify we're on the main page
    await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible();
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
    
    // Wait for step 2 to be visible
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
    
    // Fill all required fields in step 2 (Phase 2 added new required fields)
    
    // Department
    await page.click('text=Selecione um departamento');
    await page.click('text=Desenvolvimento');
    
    // Position
    await page.fill('input[placeholder*="Cargo"]', 'Developer');
    
    // Admission Date
    await page.fill('input[placeholder*="Data"]', '01/01/2024');
    
    // Hierarchical Level
    await page.click('text=Pleno');
    
    // Base Salary
    await page.fill('input[placeholder*="Salário"]', '5000');
    
    // Responsible Manager (should appear for non-manager levels)
    const managerDropdown = page.locator('text=Selecione o gerente responsável');
    if (await managerDropdown.isVisible({ timeout: 1000 })) {
      await managerDropdown.click();
      // Select first available manager
      await page.locator('[role="option"]').first().click();
    }
    
    // Submit form
    await page.click('button:has-text("Concluir")');
    
    // Should return to employee list - use the h1 heading specifically
    await expect(page.locator('h1:has-text("Colaboradores")')).toBeVisible({ timeout: 15000 });
    
    // Should show the new employee
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible({ timeout: 10000 });
  });
});
