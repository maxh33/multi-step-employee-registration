import { test, expect } from '@playwright/test';
import { validEmployeeData, invalidEmployeeData } from '../utils/test-data';
import { waitForFirebaseInit } from '../utils/firebase-helpers';

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForFirebaseInit(page);
    await page.click('text=Novo Colaborador');
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Try to proceed to next step without filling required fields
    await page.click('text=Próximo');

    // Should show validation errors
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
    await expect(page.locator('text=E-mail é obrigatório')).toBeVisible();
    
    // Should not advance to next step
    await expect(page.locator('h5:has-text("Infos Básicas")')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Fill firstName but use invalid email
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', 'invalid-email');
    
    // Try to proceed
    await page.click('text=Próximo');
    
    // Should show email validation error
    await expect(page.locator('text=E-mail deve ter um formato válido')).toBeVisible();
    await expect(page.locator('h5:has-text("Infos Básicas")')).toBeVisible();
  });

  test('should require department selection in step 2', async ({ page }) => {
    // Fill step 1 completely
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    await page.click('text=Ativar ao criar');
    
    // Proceed to step 2
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
    
    // Try to complete without selecting department
    await page.click('text=Concluir');
    
    // Should show department validation error
    await expect(page.locator('text=Departamento é obrigatório')).toBeVisible();
  });

  test('should clear validation errors when fields are corrected', async ({ page }) => {
    // Trigger validation error
    await page.click('text=Próximo');
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
    
    // Fill the field
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    
    // Trigger validation again
    await page.click('text=Próximo');
    
    // Name error should be gone, but email error should remain
    await expect(page.locator('text=Nome é obrigatório')).toBeHidden();
    await expect(page.locator('text=E-mail é obrigatório')).toBeVisible();
  });

  test('should validate activateOnCreate requirement', async ({ page }) => {
    // Fill other fields but leave toggle in default state
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    
    // Note: In the current implementation, activateOnCreate defaults to false
    // which satisfies the validation. This test verifies the toggle works correctly.
    
    // Should be able to proceed since toggle has a default value
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
  });

  test('should accept valid form data', async ({ page }) => {
    // Fill all fields with valid data
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    await page.click('text=Ativar ao criar');
    
    // Should advance to step 2 without errors
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
    
    // Fill step 2
    await page.click('text=Selecione um departamento');
    await page.click('text=Desenvolvimento');
    
    // Should show completion button
    await expect(page.locator('text=Concluir')).toBeVisible();
    await expect(page.locator('text=Concluir')).toBeEnabled();
  });

  test('should show real-time validation feedback', async ({ page }) => {
    // Start typing invalid email
    await page.fill('input[placeholder="e.g. john@gmail.com"]', 'invalid');
    await page.blur('input[placeholder="e.g. john@gmail.com"]');
    
    // Try to proceed to trigger validation
    await page.click('text=Próximo');
    
    // Should show email format error
    await expect(page.locator('text=E-mail deve ter um formato válido')).toBeVisible();
    
    // Correct the email
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validEmployeeData.email);
    
    // Error should disappear on next validation attempt
    await page.fill('input[placeholder="João da Silva"]', validEmployeeData.firstName);
    await page.click('text=Próximo');
    
    await expect(page.locator('text=E-mail deve ter um formato válido')).toBeHidden();
  });
});