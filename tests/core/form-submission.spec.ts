import { test, expect } from '@playwright/test';
import { validEmployeeData, generateRandomEmployee } from '../utils/test-data';
import { waitForFirebaseInit, waitForSubmissionComplete, verifyEmployeeSaved } from '../utils/firebase-helpers';

test.describe('Employee Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForFirebaseInit(page);
  });

  test('should complete full form submission with valid data', async ({ page }) => {
    // Use random data to avoid conflicts
    const employeeData = generateRandomEmployee();

    // Navigate to form
    await page.click('text=Novo Colaborador');
    await expect(page.locator('h5:has-text("Infos Básicas")')).toBeVisible();

    // Step 1: Personal Info
    await page.fill('input[placeholder="João da Silva"]', employeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', employeeData.email);
    
    // Handle activateOnCreate toggle
    const toggleLabel = page.locator('text=Ativar ao criar');
    const currentState = await toggleLabel.locator('input[type="checkbox"]').isChecked();
    if (currentState !== employeeData.activateOnCreate) {
      await toggleLabel.click();
    }

    // Progress should update
    await expect(page.locator('text=67%')).toBeVisible(); // 2 of 3 fields in step 1

    // Move to step 2
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();

    // Step 2: Professional Info
    await page.click('text=Selecione um departamento');
    await page.click(`text=${employeeData.department === 'desenvolvimento' ? 'Desenvolvimento' : 'Design'}`);

    // Progress should be 100%
    await expect(page.locator('text=100%')).toBeVisible();

    // Submit form
    await page.click('text=Concluir');

    // Wait for submission to complete
    await waitForSubmissionComplete(page);

    // Verify we're redirected to the employees list
    await expect(page).toHaveURL(/.*colaboradores/);
    
    // Verify the employee appears in the list
    await expect(page.locator(`text=${employeeData.firstName}`)).toBeVisible({ timeout: 10000 });
  });

  test('should handle form submission with activate toggle off', async ({ page }) => {
    const employeeData = { ...generateRandomEmployee(), activateOnCreate: false };

    // Navigate to form and fill data
    await page.click('text=Novo Colaborador');
    
    // Fill Step 1
    await page.fill('input[placeholder="João da Silva"]', employeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', employeeData.email);
    
    // Ensure toggle is off
    const toggle = page.locator('text=Ativar ao criar').locator('input[type="checkbox"]');
    const isChecked = await toggle.isChecked();
    if (isChecked) {
      await page.click('text=Ativar ao criar');
    }

    await page.click('text=Próximo');

    // Fill Step 2
    await page.click('text=Selecione um departamento');
    await page.click('text=Marketing');

    // Submit
    await page.click('text=Concluir');
    await waitForSubmissionComplete(page);

    // Verify employee is created with Inativo status
    await expect(page.locator(`text=${employeeData.firstName}`)).toBeVisible();
    await expect(page.locator('text=Inativo')).toBeVisible();
  });

  test('should maintain form data during navigation between steps', async ({ page }) => {
    const employeeData = validEmployeeData;

    await page.click('text=Novo Colaborador');

    // Fill Step 1
    await page.fill('input[placeholder="João da Silva"]', employeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', employeeData.email);
    await page.click('text=Ativar ao criar');

    // Go to Step 2
    await page.click('text=Próximo');

    // Go back to Step 1
    await page.click('text=Voltar');

    // Verify data is preserved
    await expect(page.locator('input[placeholder="João da Silva"]')).toHaveValue(employeeData.firstName);
    await expect(page.locator('input[placeholder="e.g. john@gmail.com"]')).toHaveValue(employeeData.email);
    await expect(page.locator('text=Ativar ao criar').locator('input[type="checkbox"]')).toBeChecked();
  });
});