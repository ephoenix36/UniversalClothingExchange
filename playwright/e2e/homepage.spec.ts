import { test, expect } from '../fixtures';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the correct URL
    expect(page.url()).toContain('localhost');
    
    // Basic smoke test - page should have a title
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should have a functional navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check that navigation elements exist
    // This is a placeholder - update with actual selectors
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
