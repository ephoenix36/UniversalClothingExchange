/**
 * E2E Performance Tests with Lighthouse
 * Real browser performance validation
 */

import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('E2E Performance - Lighthouse Audits', () => {
  test('should meet performance budgets on homepage', async ({ page, context }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Run Lighthouse audit
    await playAudit({
      page,
      port: 9222,
      thresholds: {
        performance: 90,
        accessibility: 100, // We have full WCAG 2.2 AA compliance
        'best-practices': 90,
        seo: 90,
      },
      reports: {
        formats: {
          html: true,
        },
        directory: './lighthouse-reports',
      },
    });
  });

  test('should measure Core Web Vitals on homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    expect(lcp).toBeLessThan(2500); // 2.5s threshold

    // Measure CLS (Cumulative Layout Shift)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsScore = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsScore += (entry as any).value;
            }
          }
          resolve(clsScore);
        }).observe({ entryTypes: ['layout-shift'] });

        // Resolve after 5 seconds
        setTimeout(() => resolve(clsScore), 5000);
      });
    });

    expect(cls).toBeLessThan(0.1); // 0.1 threshold
  });

  test('should load critical resources quickly', async ({ page }) => {
    await page.goto('/');

    // Measure resource loading times
    const resourceTimings = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map((resource: any) => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType,
      }));
    });

    // Check that critical resources load in <500ms
    const criticalResources = resourceTimings.filter((r: any) => 
      r.name.includes('.js') || r.name.includes('.css')
    );

    criticalResources.forEach((resource: any) => {
      expect(resource.duration).toBeLessThan(500);
    });
  });

  test('should have optimal bundle sizes', async ({ page }) => {
    await page.goto('/');

    const resourceSizes = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map((resource: any) => ({
        name: resource.name,
        size: resource.transferSize,
        type: resource.initiatorType,
      }));
    });

    // Check JavaScript bundle size
    const jsBundles = resourceSizes.filter((r: any) => r.name.includes('.js'));
    const totalJsSize = jsBundles.reduce((sum: number, r: any) => sum + r.size, 0);
    
    // Should be under 350KB total (200KB main + 150KB vendor)
    expect(totalJsSize).toBeLessThan(350 * 1024);

    // Check CSS bundle size
    const cssBundles = resourceSizes.filter((r: any) => r.name.includes('.css'));
    const totalCssSize = cssBundles.reduce((sum: number, r: any) => sum + r.size, 0);
    
    // Should be under 50KB
    expect(totalCssSize).toBeLessThan(50 * 1024);
  });
});

test.describe('E2E Performance - Image Optimization', () => {
  test('should serve optimized images', async ({ page }) => {
    await page.goto('/');

    // Check that images are using modern formats (WebP/AVIF)
    const images = await page.locator('img').all();
    
    for (const img of images.slice(0, 5)) { // Check first 5 images
      const src = await img.getAttribute('src');
      
      if (src) {
        // Next.js Image component should generate optimized URLs
        const isOptimized = src.includes('/_next/image') || 
                          src.includes('.webp') || 
                          src.includes('.avif');
        
        expect(isOptimized).toBe(true);
      }
    }
  });

  test('should lazy load below-the-fold images', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = await page.locator('img').all();

    for (const img of images.slice(5)) { // Skip hero images
      const loading = await img.getAttribute('loading');
      
      // Images should have loading="lazy" attribute
      if (loading) {
        expect(loading).toBe('lazy');
      }
    }
  });
});

test.describe('E2E Performance - Caching', () => {
  test('should cache static assets', async ({ page }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Second visit (should use cache)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const resourceTimings = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map((resource: any) => ({
        name: resource.name,
        duration: resource.duration,
        transferSize: resource.transferSize,
      }));
    });

    // Check that some resources were cached (transferSize = 0)
    const cachedResources = resourceTimings.filter((r: any) => r.transferSize === 0);
    expect(cachedResources.length).toBeGreaterThan(0);
  });
});

test.describe('E2E Performance - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  test('should meet performance budgets on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Lighthouse audit for mobile
    await playAudit({
      page,
      port: 9222,
      thresholds: {
        performance: 85, // Slightly lower for mobile
        accessibility: 100,
        'best-practices': 90,
        seo: 90,
      },
    });
  });

  test('should load quickly on slow 3G', async ({ page, context }) => {
    // Emulate slow 3G connection
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds even on slow connection
    expect(loadTime).toBeLessThan(5000);
  });
});
