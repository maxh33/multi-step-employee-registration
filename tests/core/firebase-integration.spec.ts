import { test, expect } from '@playwright/test';
import { generateRandomEmployee } from '../utils/test-data';
import { waitForFirebaseInit, waitForSubmissionComplete, verifyFirebaseConnection } from '../utils/firebase-helpers';

test.describe('Firebase Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForFirebaseInit(page);
  });

  test('should have working Firebase connection', async ({ page }) => {
    // Verify Firebase is properly initialized
    const isConnected = await verifyFirebaseConnection(page);
    expect(isConnected).toBe(true);
  });

  test('should persist employee data to Firestore', async ({ page }) => {
    const employeeData = generateRandomEmployee();

    // Create new employee
    await page.click('text=Novo Colaborador');
    
    // Fill form
    await page.fill('input[placeholder="João da Silva"]', employeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', employeeData.email);
    
    // Set activation status
    const toggle = page.locator('text=Ativar ao criar').locator('input[type="checkbox"]');
    const isChecked = await toggle.isChecked();
    if (isChecked !== employeeData.activateOnCreate) {
      await page.click('text=Ativar ao criar');
    }

    await page.click('text=Próximo');
    
    await page.click('text=Selecione um departamento');
    await page.click('text=Desenvolvimento');
    
    // Submit form
    await page.click('text=Concluir');
    await waitForSubmissionComplete(page);
    
    // Verify employee appears in the list (confirms Firebase persistence)
    await expect(page.locator(`text=${employeeData.firstName}`)).toBeVisible({ timeout: 10000 });
    
    // Verify correct status based on activateOnCreate
    const expectedStatus = employeeData.activateOnCreate ? 'Ativo' : 'Inativo';
    const employeeRow = page.locator(`tr:has-text("${employeeData.firstName}")`);
    await expect(employeeRow.locator(`text=${expectedStatus}`)).toBeVisible();
  });

  test('should load existing employees from Firestore', async ({ page }) => {
    // Create an employee first
    const employeeData = generateRandomEmployee();
    
    await page.click('text=Novo Colaborador');
    await page.fill('input[placeholder="João da Silva"]', employeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', employeeData.email);
    await page.click('text=Ativar ao criar');
    await page.click('text=Próximo');
    await page.click('text=Selecione um departamento');
    await page.click('text=Marketing');
    await page.click('text=Concluir');
    await waitForSubmissionComplete(page);
    
    // Refresh the page to test loading from Firebase
    await page.reload();
    await waitForFirebaseInit(page);
    
    // Employee should still be visible (loaded from Firestore)
    await expect(page.locator(`text=${employeeData.firstName}`)).toBeVisible({ timeout: 10000 });
  });

  test('should handle Firebase errors gracefully', async ({ page }) => {
    // This test would be more meaningful with network throttling or Firebase emulator
    // For now, we test that form shows loading states
    
    const employeeData = generateRandomEmployee();
    
    await page.click('text=Novo Colaborador');
    await page.fill('input[placeholder="João da Silva"]', employeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', employeeData.email);
    await page.click('text=Ativar ao criar');
    await page.click('text=Próximo');
    await page.click('text=Selecione um departamento');
    await page.click('text=Desenvolvimento');
    
    // Submit form and check for loading state
    await page.click('text=Concluir');
    
    // Should show loading state during submission
    await expect(page.locator('text=Enviando...')).toBeVisible();
    
    // Wait for completion
    await waitForSubmissionComplete(page);
    
    // Should complete successfully under normal conditions
    await expect(page.locator(`text=${employeeData.firstName}`)).toBeVisible();
  });

  test('should maintain data consistency across form steps', async ({ page }) => {
    const employeeData = generateRandomEmployee();
    
    await page.click('text=Novo Colaborador');
    
    // Fill step 1
    await page.fill('input[placeholder="João da Silva"]', employeeData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', employeeData.email);
    if (employeeData.activateOnCreate) {
      await page.click('text=Ativar ao criar');
    }
    
    // Navigate to step 2 and back multiple times
    await page.click('text=Próximo');
    await page.click('text=Voltar');
    await page.click('text=Próximo');
    
    // Fill step 2
    await page.click('text=Selecione um departamento');
    await page.click('text=TI');
    
    // Submit and verify all data was preserved correctly
    await page.click('text=Concluir');
    await waitForSubmissionComplete(page);
    
    // Verify employee data in the list
    await expect(page.locator(`text=${employeeData.firstName}`)).toBeVisible();
    
    // Check that the correct department was saved
    const employeeRow = page.locator(`tr:has-text("${employeeData.firstName}")`);
    await expect(employeeRow.locator('text=TI')).toBeVisible();
  });

  test('should update progress indicator based on Firebase operations', async ({ page }) => {
    await page.click('text=Novo Colaborador');
    
    // Initial progress should be low
    await expect(page.locator('text=0%')).toBeVisible();
    
    // Fill first field
    await page.fill('input[placeholder="João da Silva"]', 'Test User');
    // Progress updates are typically triggered by navigation or validation
    
    // Fill email
    await page.fill('input[placeholder="e.g. john@gmail.com"]', 'test@example.com');
    
    // Set activation status
    await page.click('text=Ativar ao criar');
    
    // Progress should increase
    await expect(page.locator('text=75%')).toBeVisible(); // 3 of 4 fields completed
    
    // Go to step 2
    await page.click('text=Próximo');
    
    // Fill department
    await page.click('text=Selecione um departamento');
    await page.click('text=Produto');
    
    // Should show 100%
    await expect(page.locator('text=100%')).toBeVisible();
  });
});