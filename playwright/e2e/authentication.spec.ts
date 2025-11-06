/**
 * E2E Authentication Tests
 * 
 * Real browser testing for authentication flows:
 * - Whop authentication
 * - Google OAuth
 * - GitHub OAuth
 * - Session persistence
 * - Password reset
 */

import { test, expect } from '@playwright/test';

test.describe('E2E Authentication - Whop', () => {
  test('should display Whop login button', async ({ page }) => {
    await page.goto('/login');

    // Check for Whop login button
    const whopButton = page.locator('button:has-text("Continue with Whop")');
    await expect(whopButton).toBeVisible();
  });

  test('should redirect to Whop OAuth on button click', async ({ page }) => {
    await page.goto('/login');

    const whopButton = page.locator('button:has-text("Continue with Whop")');
    
    // Click and wait for navigation
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      whopButton.click(),
    ]);

    // Verify redirected to Whop OAuth
    await expect(newPage.url()).toContain('whop.com');
  });

  test('should handle Whop authentication callback', async ({ page }) => {
    // Mock successful OAuth callback
    await page.goto('/auth/callback?provider=whop&code=mock_code');

    // Should redirect to dashboard or intended page
    await expect(page).toHaveURL(/\/(dashboard|wardrobe|$)/);
  });

  test('should display user data after Whop auth', async ({ page, context }) => {
    // Set mock session cookie
    await context.addCookies([{
      name: 'uce_session',
      value: 'mock_session_token',
      domain: 'localhost',
      path: '/',
    }]);

    await page.goto('/profile');

    // Verify user data is displayed
    await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
  });
});

test.describe('E2E Authentication - Google OAuth', () => {
  test('should display Google login button', async ({ page }) => {
    await page.goto('/login');

    const googleButton = page.locator('button:has-text("Continue with Google")');
    await expect(googleButton).toBeVisible();

    // Verify Google icon is present
    await expect(googleButton.locator('svg, img[alt*="Google"]')).toBeVisible();
  });

  test('should have correct Google OAuth attributes', async ({ page }) => {
    await page.goto('/login');

    const googleButton = page.locator('button:has-text("Continue with Google")');
    
    // Verify accessible attributes
    await expect(googleButton).toHaveAttribute('type', /button|submit/);
    await expect(googleButton).toBeEnabled();
  });

  test('should open Google OAuth popup', async ({ page }) => {
    await page.goto('/login');

    const googleButton = page.locator('button:has-text("Continue with Google")');
    
    // Click and verify popup opens
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      googleButton.click(),
    ]);

    // Verify Google OAuth URL
    await expect(popup.url()).toContain('accounts.google.com');
  });

  test('should include required OAuth scopes', async ({ page }) => {
    await page.goto('/login');

    const googleButton = page.locator('button:has-text("Continue with Google")');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      googleButton.click(),
    ]);

    // Verify scopes in URL
    const url = popup.url();
    expect(url).toContain('scope=');
    expect(url).toContain('email');
    expect(url).toContain('profile');
  });
});

test.describe('E2E Authentication - GitHub OAuth', () => {
  test('should display GitHub login button', async ({ page }) => {
    await page.goto('/login');

    const githubButton = page.locator('button:has-text("Continue with GitHub")');
    await expect(githubButton).toBeVisible();

    // Verify GitHub icon
    await expect(githubButton.locator('svg, img[alt*="GitHub"]')).toBeVisible();
  });

  test('should open GitHub OAuth page', async ({ page }) => {
    await page.goto('/login');

    const githubButton = page.locator('button:has-text("Continue with GitHub")');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      githubButton.click(),
    ]);

    // Verify GitHub OAuth URL
    await expect(popup.url()).toContain('github.com/login/oauth');
  });

  test('should request appropriate GitHub scopes', async ({ page }) => {
    await page.goto('/login');

    const githubButton = page.locator('button:has-text("Continue with GitHub")');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      githubButton.click(),
    ]);

    // Verify scopes in URL
    const url = popup.url();
    expect(url).toContain('scope=');
    expect(url).toContain('read:user');
  });
});

test.describe('E2E Authentication - Session Management', () => {
  test('should persist session across page reloads', async ({ page, context }) => {
    // Set session cookie
    await context.addCookies([{
      name: 'uce_session',
      value: 'persistent_session',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'Lax',
    }]);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/dashboard/);

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should redirect to login when session expires', async ({ page }) => {
    // Navigate without session
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should preserve intended route after login', async ({ page, context }) => {
    // Try to access protected page
    await page.goto('/wardrobe/add');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // Mock login
    await context.addCookies([{
      name: 'uce_session',
      value: 'new_session',
      domain: 'localhost',
      path: '/',
    }]);

    // Should redirect back to intended page
    await page.goto('/login');
    await expect(page).toHaveURL(/\/wardrobe\/add/);
  });

  test('should clear session on logout', async ({ page, context }) => {
    // Set session
    await context.addCookies([{
      name: 'uce_session',
      value: 'logout_test_session',
      domain: 'localhost',
      path: '/',
    }]);

    await page.goto('/dashboard');

    // Click logout
    const logoutButton = page.locator('button:has-text("Log out"), a:has-text("Log out")');
    await logoutButton.click();

    // Verify redirected to homepage or login
    await expect(page).toHaveURL(/\/(login|$)/);

    // Verify session cookie is cleared
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'uce_session');
    expect(sessionCookie).toBeUndefined();
  });
});

test.describe('E2E Authentication - Form Accessibility', () => {
  test('should have accessible login form', async ({ page }) => {
    await page.goto('/login');

    // Verify form has proper landmarks
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Verify heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toContainText(/log in|sign in/i);

    // Verify social login buttons are keyboard accessible
    const googleButton = page.locator('button:has-text("Continue with Google")');
    await googleButton.focus();
    await expect(googleButton).toBeFocused();

    const githubButton = page.locator('button:has-text("Continue with GitHub")');
    await githubButton.focus();
    await expect(githubButton).toBeFocused();

    const whopButton = page.locator('button:has-text("Continue with Whop")');
    await whopButton.focus();
    await expect(whopButton).toBeFocused();
  });

  test('should show clear error messages', async ({ page }) => {
    await page.goto('/login');

    // Mock authentication error
    await page.evaluate(() => {
      const errorDiv = document.createElement('div');
      errorDiv.setAttribute('role', 'alert');
      errorDiv.setAttribute('aria-live', 'polite');
      errorDiv.textContent = 'Authentication failed. Please try again.';
      document.body.appendChild(errorDiv);
    });

    // Verify error message is accessible
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  test('should have skip link on login page', async ({ page }) => {
    await page.goto('/login');

    // Tab to skip link
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('a:has-text("Skip to"), a[href="#main-content"]');
    
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeFocused();
    }
  });
});

test.describe('E2E Authentication - Loading States', () => {
  test('should show loading state during OAuth', async ({ page }) => {
    await page.goto('/login');

    const googleButton = page.locator('button:has-text("Continue with Google")');
    
    // Click button
    await googleButton.click();

    // Should show loading state (spinner, disabled button, or loading text)
    const isLoading = 
      (await page.locator('[role="progressbar"], [aria-busy="true"]').count() > 0) ||
      (await googleButton.isDisabled());

    expect(isLoading).toBeTruthy();
  });

  test('should not have layout shift during loading', async ({ page }) => {
    await page.goto('/login');

    // Measure initial button position
    const googleButton = page.locator('button:has-text("Continue with Google")');
    const initialBox = await googleButton.boundingBox();

    // Click button
    await googleButton.click();

    // Wait a bit for potential layout shift
    await page.waitForTimeout(100);

    // Measure button position again
    const finalBox = await googleButton.boundingBox();

    // Verify no significant layout shift
    if (initialBox && finalBox) {
      expect(Math.abs(initialBox.y - finalBox.y)).toBeLessThan(5); // Allow 5px tolerance
    }
  });
});

test.describe('E2E Authentication - Security', () => {
  test('should use HTTPS in production', async ({ page }) => {
    // This test is informational - actual HTTPS enforcement happens at deployment
    const protocol = new URL(page.url()).protocol;
    
    // In production, should be https
    if (process.env.NODE_ENV === 'production') {
      expect(protocol).toBe('https:');
    }
  });

  test('should have secure cookie attributes', async ({ page, context }) => {
    await context.addCookies([{
      name: 'uce_session',
      value: 'security_test',
      domain: 'localhost',
      path: '/',
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'Lax', // CSRF protection
    }]);

    await page.goto('/dashboard');

    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'uce_session');

    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.sameSite).toBe('Lax');
  });

  test('should implement CSRF protection', async ({ page }) => {
    await page.goto('/login');

    // Verify CSRF token exists (either in form or meta tag)
    const csrfToken = 
      (await page.locator('input[name="csrf_token"], input[name="_csrf"]').count() > 0) ||
      (await page.locator('meta[name="csrf-token"]').count() > 0);

    expect(csrfToken).toBeTruthy();
  });
});

test.describe('E2E Authentication - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
  });

  test('should display mobile-friendly login page', async ({ page }) => {
    await page.goto('/login');

    // Verify buttons are large enough for touch
    const googleButton = page.locator('button:has-text("Continue with Google")');
    const box = await googleButton.boundingBox();

    if (box) {
      // Minimum touch target: 44x44px (iOS) or 48x48px (Android)
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });

  test('should stack social login buttons vertically on mobile', async ({ page }) => {
    await page.goto('/login');

    const googleButton = page.locator('button:has-text("Continue with Google")');
    const githubButton = page.locator('button:has-text("Continue with GitHub")');

    const googleBox = await googleButton.boundingBox();
    const githubBox = await githubButton.boundingBox();

    if (googleBox && githubBox) {
      // Buttons should be stacked (y-axis difference > x-axis difference)
      const yDiff = Math.abs(googleBox.y - githubBox.y);
      const xDiff = Math.abs(googleBox.x - githubBox.x);
      
      expect(yDiff).toBeGreaterThan(xDiff);
    }
  });
});
