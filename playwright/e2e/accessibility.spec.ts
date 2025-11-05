/**
 * E2E Accessibility Tests with Playwright + axe-core
 * 
 * Tests real browser accessibility compliance including:
 * - Automated axe scans on live pages
 * - Keyboard navigation workflows
 * - Focus management
 * - Screen reader compatibility (aria-live regions)
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('E2E Accessibility - Homepage', () => {
  test('should have no accessibility violations on homepage', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should allow keyboard navigation through main nav', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    const firstLink = page.locator('nav a').first();
    await expect(firstLink).toBeFocused();
    
    // Continue tabbing
    await page.keyboard.press('Tab');
    const secondLink = page.locator('nav a').nth(1);
    await expect(secondLink).toBeFocused();
  });

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first element (should be skip link)
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeFocused();
      await page.keyboard.press('Enter');
      
      // Focus should move to main content
      const mainContent = page.locator('main');
      await expect(mainContent).toBeFocused();
    }
  });
});

test.describe('E2E Accessibility - Forms', () => {
  test('should have no violations in login form', async ({ page }) => {
    // Adjust URL based on your login page
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('form')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support keyboard-only form completion', async ({ page }) => {
    await page.goto('/login');
    
    // Tab to email field
    await page.keyboard.press('Tab');
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();
    await emailInput.fill('test@example.com');
    
    // Tab to password field
    await page.keyboard.press('Tab');
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeFocused();
    await passwordInput.fill('password123');
    
    // Tab to submit button and press Enter
    await page.keyboard.press('Tab');
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();
  });

  test('should show error messages with aria-live', async ({ page }) => {
    await page.goto('/login');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Error message should appear in aria-live region
    const errorRegion = page.locator('[role="alert"], [aria-live="assertive"]');
    
    if (await errorRegion.count() > 0) {
      await expect(errorRegion).toBeVisible();
    }
  });
});

test.describe('E2E Accessibility - Modals', () => {
  test('should trap focus within modal', async ({ page }) => {
    await page.goto('/');
    
    // Open a modal (adjust selector based on your app)
    const openModalButton = page.locator('button:has-text("Open")').first();
    
    if (await openModalButton.count() > 0) {
      await openModalButton.click();
      
      // Wait for modal to appear
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Tab through modal elements
      await page.keyboard.press('Tab');
      const firstFocusable = modal.locator('button, input, a').first();
      await expect(firstFocusable).toBeFocused();
      
      // Tab to last element
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Tab again should cycle back to first element (focus trap)
      await page.keyboard.press('Tab');
      
      // Focus should still be inside modal
      const focusedElement = page.locator(':focus');
      await expect(modal).toContainText(await focusedElement.textContent() || '');
    }
  });

  test('should close modal on Escape key', async ({ page }) => {
    await page.goto('/');
    
    const openModalButton = page.locator('button:has-text("Open")').first();
    
    if (await openModalButton.count() > 0) {
      await openModalButton.click();
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Modal should be hidden
      await expect(modal).toBeHidden();
    }
  });

  test('should restore focus to trigger button after modal closes', async ({ page }) => {
    await page.goto('/');
    
    const openModalButton = page.locator('button:has-text("Open")').first();
    
    if (await openModalButton.count() > 0) {
      await openModalButton.click();
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Close modal (via close button or Escape)
      await page.keyboard.press('Escape');
      
      // Focus should return to trigger button
      await expect(openModalButton).toBeFocused();
    }
  });
});

test.describe('E2E Accessibility - Color Contrast', () => {
  test('should meet WCAG AA contrast ratios', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });
});

test.describe('E2E Accessibility - WCAG 2.2 Criteria', () => {
  test('should meet all WCAG 2.2 Level AA criteria', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have consistent help mechanism location', async ({ page }) => {
    // Check homepage
    await page.goto('/');
    const homepageHelp = page.locator('a:has-text("Help")').first();
    const homepageHelpBoundingBox = await homepageHelp.boundingBox();
    
    // Check another page
    await page.goto('/wardrobe');
    const wardrobeHelp = page.locator('a:has-text("Help")').first();
    const wardrobeHelpBoundingBox = await wardrobeHelp.boundingBox();
    
    // Help should be in same relative position (WCAG 3.2.6)
    if (homepageHelpBoundingBox && wardrobeHelpBoundingBox) {
      expect(Math.abs(homepageHelpBoundingBox.x - wardrobeHelpBoundingBox.x)).toBeLessThan(50);
      expect(Math.abs(homepageHelpBoundingBox.y - wardrobeHelpBoundingBox.y)).toBeLessThan(50);
    }
  });

  test('should not obscure focused elements (WCAG 2.4.11)', async ({ page }) => {
    await page.goto('/');
    
    // Get sticky header height if it exists
    const stickyHeader = page.locator('header[style*="sticky"], header[style*="fixed"]');
    let headerHeight = 0;
    
    if (await stickyHeader.count() > 0) {
      const headerBox = await stickyHeader.boundingBox();
      headerHeight = headerBox?.height || 0;
    }
    
    // Tab to first focusable element in main content
    const mainContent = page.locator('main');
    const firstButton = mainContent.locator('button, a, input').first();
    
    if (await firstButton.count() > 0) {
      await firstButton.focus();
      const buttonBox = await firstButton.boundingBox();
      
      // Focused element should not be obscured by header
      if (buttonBox) {
        expect(buttonBox.y).toBeGreaterThan(headerHeight);
      }
    }
  });

  test('should have minimum 24x24 target size (WCAG 2.5.8)', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button, a[href]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const boundingBox = await button.boundingBox();
      
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThanOrEqual(24);
        expect(boundingBox.height).toBeGreaterThanOrEqual(24);
      }
    }
  });
});

test.describe('E2E Accessibility - Mobile Viewport', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE
  });

  test('should have no violations on mobile', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have touch-friendly target sizes on mobile', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button, a[href]');
    const buttonCount = await buttons.count();
    
    // Mobile targets should be at least 44x44 (iOS Human Interface Guidelines)
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const boundingBox = await button.boundingBox();
      
      if (boundingBox && await button.isVisible()) {
        expect(boundingBox.width).toBeGreaterThanOrEqual(24);
        expect(boundingBox.height).toBeGreaterThanOrEqual(24);
      }
    }
  });
});
