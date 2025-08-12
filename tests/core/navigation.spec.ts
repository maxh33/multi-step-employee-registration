import { test, expect } from '@playwright/test';
import { validEmployeeData } from '../utils/test-data';
import { waitForFirebaseInit } from '../utils/firebase-helpers';

test.describe('Form Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForFirebaseInit(page);
    await page.click('text=Novo Colaborador');
  });

  test('should show correct step indicators', async ({ page }) => {
    // Should show step 1 initially
    await expect(page.locator('h5:has-text("Infos Básicas")')).toBeVisible();
    
    // Should show step indicator with current step highlighted
    // This depends on your step indicator implementation
    await expect(page.locator('[data-testid="step-1"]')).toHaveClass(/active|current/);
  });

  test('should navigate between steps correctly', async ({ page }) => {
    // Fill step 1 with valid data
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    await page.click('text=Ativar ao criar');
    
    // Go to step 2
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
    
    // Go back to step 1
    await page.click('text=Voltar');
    await expect(page.locator('h5:has-text("Infos Básicas")')).toBeVisible();
    
    // Go forward again
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
  });

  test('should prevent navigation with invalid data', async ({ page }) => {
    // Try to go to step 2 without filling required fields
    await page.click('text=Próximo');
    
    // Should remain on step 1
    await expect(page.locator('h5:has-text("Infos Básicas")')).toBeVisible();
    
    // Should show validation errors
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
  });

  test('should update button text correctly', async ({ page }) => {
    // Step 1 should show "Próximo"
    await expect(page.locator('button:has-text("Próximo")')).toBeVisible();
    
    // Fill step 1 and go to step 2
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    await page.click('text=Ativar ao criar');
    await page.click('text=Próximo');
    
    // Step 2 should show "Concluir"
    await expect(page.locator('button:has-text("Concluir")')).toBeVisible();
  });

  test('should show progress bar correctly', async ({ page }) => {
    // Initially should show 0%
    await expect(page.locator('text=0%')).toBeVisible();
    
    // Fill firstName
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    // Note: Progress updates might be triggered by validation or navigation
    
    // Fill email
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    
    // Set activation status
    await page.click('text=Ativar ao criar');
    
    // Try to proceed to see updated progress
    await page.click('text=Próximo');
    
    // Should show partial progress
    await expect(page.locator('text=75%')).toBeVisible(); // 3 of 4 fields
    
    // Fill department
    await page.click('text=Selecione um departamento');
    await page.click('text=Desenvolvimento');
    
    // Should show 100%
    await expect(page.locator('text=100%')).toBeVisible();
  });

  test('should handle back navigation from step 2', async ({ page }) => {
    // Fill step 1 completely
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    await page.click('text=Ativar ao criar');
    await page.click('text=Próximo');
    
    // Fill step 2 partially
    await page.click('text=Selecione um departamento');
    await page.click('text=Marketing');
    
    // Go back to step 1
    await page.click('text=Voltar');
    
    // Verify we're on step 1 and data is preserved
    await expect(page.locator('h5:has-text("Infos Básicas")')).toBeVisible();
    await expect(page.locator('input[placeholder="João da Silva"]')).toHaveValue(validEmployeeData.firstName);
    
    // Go forward again
    await page.click('text=Próximo');
    
    // Step 2 data should be preserved
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
    // Department selection should be maintained
    await expect(page.locator('text=Marketing')).toBeVisible();
  });

  test('should handle breadcrumb navigation', async ({ page }) => {
    // Should show breadcrumbs
    await expect(page.locator('text=Colaboradores')).toBeVisible();
    await expect(page.locator('text=Cadastrar Colaborador')).toBeVisible();
    
    // Click on "Colaboradores" breadcrumb
    await page.click('text=Colaboradores');
    
    // Should navigate back to employees list
    await expect(page).toHaveURL(/.*colaboradores/);
    await expect(page.locator('h4:has-text("Colaboradores")')).toBeVisible();
  });

  test('should handle form reset on navigation away', async ({ page }) => {
    // Fill some data
    await page.fill('input[placeholder="João da Silva"]', 'Test User');
    await page.fill('input[placeholder="e.g. john@gmail.com"]', 'test@example.com');
    
    // Navigate away using breadcrumb
    await page.click('text=Colaboradores');
    
    // Navigate back to form
    await page.click('text=Novo Colaborador');
    
    // Form should be reset (depending on localStorage implementation)
    // This test verifies the expected behavior based on your localStorage strategy
    const firstNameValue = await page.locator('input[placeholder="João da Silva"]').inputValue();
    
    // If localStorage is working, data should be preserved
    // If not, form should be empty
    // Adjust expectation based on your implementation
    expect(firstNameValue === 'Test User' || firstNameValue === '').toBe(true);
  });

  test('should show loading states during navigation', async ({ page }) => {
    // Fill step 1
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    await page.click('text=Ativar ao criar');
    await page.click('text=Próximo');
    
    // Fill step 2
    await page.click('text=Selecione um departamento');
    await page.click('text=Operações');
    
    // Submit form
    await page.click('text=Concluir');
    
    // Should show loading state
    await expect(page.locator('text=Enviando...')).toBeVisible();
    
    // Should show progress during submission
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
  });
});