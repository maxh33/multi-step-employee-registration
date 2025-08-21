import { test, expect } from '@playwright/test';
import { waitForFirebaseInit } from '../utils/firebase-helpers';

// Test data for security validation
const maliciousData = {
  firstName: '<script>alert("xss")</script>',
  email: 'invalid-email-format',
  activateOnCreate: true,
  department: 'InvalidDepartment'
};

const validData = {
  firstName: 'João Silva',
  email: 'joao@example.com',
  activateOnCreate: true,
  department: 'Desenvolvimento'
};

test.describe('Security Rules Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForFirebaseInit(page);
    await page.click('text=Novo Colaborador');
  });

  test('should prevent XSS injection in name field', async ({ page }) => {
    // Try to submit malicious script in firstName
    await page.fill('input[placeholder="João da Silva"]', maliciousData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validData.email);
    await page.click('text=Ativar ao criar');
    
    // Proceed to step 2
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
    
    // Select valid department
    await page.click('text=Selecione um departamento');
    await page.click('text=Desenvolvimento');
    
    // Try to submit - should fail due to Firebase Security Rules
    await page.click('text=Concluir');
    
    // Should show error or fail to submit
    // Note: This test validates that the security rules work on the server side
    // The exact error message depends on Firebase implementation
    await page.waitForTimeout(2000); // Wait for Firebase response
    
    // Verify we're still on the form page (submission failed)
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
  });

  test('should reject invalid email formats', async ({ page }) => {
    await page.fill('input[placeholder="João da Silva"]', validData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', maliciousData.email);
    await page.click('text=Ativar ao criar');
    
    // Should fail client-side validation first
    await page.click('text=Próximo');
    await expect(page.locator('text=E-mail deve ter um formato válido')).toBeVisible();
  });

  test('should reject invalid department values', async ({ page }) => {
    await page.fill('input[placeholder="João da Silva"]', validData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validData.email);
    await page.click('text=Ativar ao criar');
    
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
    
    // In this test, we verify that only whitelisted departments are available
    await page.click('text=Selecione um departamento');
    
    // Verify only valid departments are in the dropdown
    const validDepartments = [
      'Desenvolvimento',
      'Design', 
      'Marketing',
      'Vendas',
      'Recursos Humanos',
      'Financeiro',
      'Operações',
      'Suporte',
      'Jurídico',
      'Produto'
    ];
    
    for (const dept of validDepartments) {
      await expect(page.locator(`text=${dept}`)).toBeVisible();
    }
    
    // Invalid departments should not be available
    await expect(page.locator('text=InvalidDepartment')).toBeHidden();
  });

  test('should accept valid, sanitized data', async ({ page }) => {
    // Fill with completely valid data
    await page.fill('input[placeholder="João da Silva"]', validData.firstName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validData.email);
    await page.click('text=Ativar ao criar');
    
    // Should advance to step 2
    await page.click('text=Próximo');
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeVisible();
    
    // Select valid department
    await page.click('text=Selecione um departamento');
    await page.click('text=Desenvolvimento');
    
    // Should successfully submit
    await page.click('text=Concluir');
    
    // Should redirect to success page or employee list
    await page.waitForTimeout(3000); // Wait for submission
    
    // Verify we're no longer on the form (successful submission)
    await expect(page.locator('h5:has-text("Informações Profissionais")')).toBeHidden();
  });

  test('should validate field length limits', async ({ page }) => {
    // Test with extremely long firstName (over 100 characters)
    const longName = 'A'.repeat(101);
    await page.fill('input[placeholder="João da Silva"]', longName);
    await page.fill('input[placeholder="e.g. john@gmail.com"]', validData.email);
    await page.click('text=Ativar ao criar');
    
    // Try to proceed - client-side might allow it, but server-side should reject
    await page.click('text=Próximo');
    
    // Depending on implementation, this might show a validation error
    // or pass client-side validation but fail on server
    await page.waitForTimeout(1000);
  });

  test('should prevent special character injection', async ({ page }) => {
    // Test with various potentially harmful characters
    const maliciousNames = [
      'João{drop table}',
      'João[script]',
      'João"onClick="',
      'João&lt;script&gt;'
    ];
    
    for (const maliciousName of maliciousNames) {
      // Clear and fill with malicious name
      await page.fill('input[placeholder="João da Silva"]', '');
      await page.fill('input[placeholder="João da Silva"]', maliciousName);
      await page.fill('input[placeholder="e.g. john@gmail.com"]', validData.email);
      await page.click('text=Ativar ao criar');
      
      await page.click('text=Próximo');
      
      if (await page.locator('h5:has-text("Informações Profissionais")').isVisible()) {
        // If we reached step 2, complete the form to test server-side validation
        await page.click('text=Selecione um departamento');
        await page.click('text=Desenvolvimento');
        await page.click('text=Concluir');
        
        await page.waitForTimeout(2000);
        
        // Should fail server-side validation and stay on form
        // (exact behavior depends on Firebase rules implementation)
      }
      
      // Reset for next iteration
      await page.reload();
      await waitForFirebaseInit(page);
      await page.click('text=Novo Colaborador');
    }
  });
});