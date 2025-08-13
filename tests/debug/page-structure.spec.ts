import { test, expect } from '@playwright/test';

test.describe('Page Structure Debug', () => {
  test('should debug page structure', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });
    
    // Get all text content to see what's available
    const bodyText = await page.locator('body').textContent();
    console.log('Page text content:', bodyText);
    
    // Check for any h4 elements
    const h4Elements = await page.locator('h4').all();
    console.log('Found h4 elements:', h4Elements.length);
    for (const h4 of h4Elements) {
      const text = await h4.textContent();
      console.log('h4 text:', text);
    }
    
    // Check for button elements
    const buttons = await page.locator('button').all();
    console.log('Found buttons:', buttons.length);
    for (const button of buttons) {
      const text = await button.textContent();
      console.log('Button text:', text);
    }
    
    // Check for any text containing "Colaborador"
    const colaboradorElements = await page.locator('*:has-text("Colaborador")').all();
    console.log('Elements with "Colaborador":', colaboradorElements.length);
    
    // This test always passes, it's just for debugging
    expect(true).toBe(true);
  });
});