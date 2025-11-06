/**
 * Performance Utilities
 * Core Web Vitals Tracking & Optimization Helpers
 */

import type { Metric } from 'web-vitals';

/**
 * Core Web Vitals Thresholds (Google)
 */
export const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP): measures loading performance
  LCP: {
    GOOD: 2500, // ms
    NEEDS_IMPROVEMENT: 4000, // ms
  },
  // First Input Delay (FID): measures interactivity
  FID: {
    GOOD: 100, // ms
    NEEDS_IMPROVEMENT: 300, // ms
  },
  // Cumulative Layout Shift (CLS): measures visual stability
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    GOOD: 1800, // ms
    NEEDS_IMPROVEMENT: 3000, // ms
  },
  // Time to First Byte (TTFB)
  TTFB: {
    GOOD: 600, // ms
    NEEDS_IMPROVEMENT: 1500, // ms
  },
  // Interaction to Next Paint (INP) - new metric replacing FID
  INP: {
    GOOD: 200, // ms
    NEEDS_IMPROVEMENT: 500, // ms
  },
} as const;

/**
 * Lighthouse Performance Budgets
 */
export const LIGHTHOUSE_BUDGETS = {
  PERFORMANCE_SCORE: 90,
  ACCESSIBILITY_SCORE: 100, // We have full WCAG 2.2 AA compliance
  BEST_PRACTICES_SCORE: 90,
  SEO_SCORE: 90,
} as const;

/**
 * Bundle Size Budgets (KB)
 */
export const BUNDLE_SIZE_BUDGETS = {
  MAIN_JS: 200, // Main JavaScript bundle
  VENDOR_JS: 150, // Third-party libraries
  MAIN_CSS: 50, // Main stylesheet
  FONTS: 100, // Web fonts
  IMAGES_PER_PAGE: 500, // Total images per page
} as const;

/**
 * Get performance rating based on metric value
 */
export function getPerformanceRating(
  metricName: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName];
  
  if (value <= thresholds.GOOD) return 'good';
  if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vitals to analytics
 * Usage in _app.tsx or app/layout.tsx
 */
export function reportWebVitals(metric: Metric): void {
  const { name, value, rating, delta, id } = metric;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
      id,
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Send to Google Analytics, Vercel Analytics, or custom endpoint
    // Example: gtag('event', name, { value, metric_id: id, metric_delta: delta });
    
    // Or send to custom API endpoint
    const body = JSON.stringify({
      name,
      value,
      rating,
      delta,
      id,
      navigationType: (metric as any).navigationType,
    });

    // Use sendBeacon for reliability (doesn't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/web-vitals', body);
    } else {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(console.error);
    }
  }
}

/**
 * Measure and log component render time
 * Usage: const cleanup = measureRenderTime('ComponentName');
 */
export function measureRenderTime(componentName: string): () => void {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Render Time] ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    // Track slow renders (> 16ms = 60fps threshold)
    if (renderTime > 16) {
      console.warn(`[Slow Render] ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  };
}

/**
 * Debounce function for performance optimization
 * Use for search inputs, scroll handlers, resize handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * Use for scroll handlers, mouse move handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request Idle Callback wrapper with fallback
 * Use for non-critical work (analytics, prefetching)
 */
export function runWhenIdle(callback: () => void, options?: IdleRequestOptions): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    // Fallback for Safari
    setTimeout(callback, 1);
  }
}

/**
 * Preload critical resources
 * Call in <head> or early in component lifecycle
 */
export function preloadResource(href: string, as: string, type?: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
}

/**
 * Prefetch likely navigation targets
 * Use for anticipated user actions
 */
export function prefetchPage(href: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Check if user is on a slow connection
 * Use to conditionally load heavy resources
 */
export function isSlowConnection(): boolean {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    // Slow connection types
    const slowTypes = ['slow-2g', '2g', '3g'];
    if (slowTypes.includes(connection.effectiveType)) {
      return true;
    }

    // Check save-data preference
    if (connection.saveData) {
      return true;
    }
  }

  return false;
}

/**
 * Get optimal image format for browser
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpeg' {
  // Check for AVIF support (best compression)
  const avifSupport = document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;
  if (avifSupport) return 'avif';

  // Check for WebP support (good compression)
  const webpSupport = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  if (webpSupport) return 'webp';

  // Fallback to JPEG
  return 'jpeg';
}

/**
 * Lazy load images below the fold
 * Returns an IntersectionObserver for cleanup
 */
export function lazyLoadImages(selector: string = 'img[data-src]'): IntersectionObserver {
  const images = document.querySelectorAll(selector);

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  return imageObserver;
}

/**
 * Measure API response time
 * Use in API route handlers
 */
export function measureApiTime(route: string): () => void {
  const startTime = Date.now();

  return () => {
    const duration = Date.now() - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${route}: ${duration}ms`);
    }

    // Log slow API calls (> 500ms)
    if (duration > 500) {
      console.warn(`[Slow API] ${route} took ${duration}ms`);
    }
  };
}

/**
 * Cache API responses in memory
 * Simple in-memory cache with TTL
 */
class SimpleCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();

  set(key: string, data: T, ttlMs: number = 60000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  get(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new SimpleCache();

/**
 * Batch multiple requests into a single API call
 * Use for GraphQL-style batch queries
 */
export class RequestBatcher<T> {
  private queue: Array<{
    id: string;
    resolve: (value: T) => void;
    reject: (error: any) => void;
  }> = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(
    private batchFn: (ids: string[]) => Promise<T[]>,
    private batchDelay: number = 10
  ) {}

  add(id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, resolve, reject });

      if (this.batchTimeout) clearTimeout(this.batchTimeout);
      
      this.batchTimeout = setTimeout(() => {
        this.flush();
      }, this.batchDelay);
    });
  }

  private async flush(): Promise<void> {
    const batch = [...this.queue];
    this.queue = [];
    this.batchTimeout = null;

    try {
      const ids = batch.map((item) => item.id);
      const results = await this.batchFn(ids);

      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach((item) => {
        item.reject(error);
      });
    }
  }
}

/**
 * Performance marks and measures
 * Use for custom performance tracking
 */
export const performanceMark = {
  start(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  },

  end(name: string): number | null {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      
      try {
        const measure = performance.measure(name, `${name}-start`, `${name}-end`);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
        }

        return measure.duration;
      } catch (error) {
        console.error(`Performance measurement failed for ${name}:`, error);
        return null;
      }
    }
    return null;
  },
};

/**
 * Check if resource is already cached
 * Use to avoid redundant requests
 */
export function isResourceCached(url: string): boolean {
  if (!('caches' in window)) return false;

  // This is async, but we can use it for future optimization
  caches.match(url).then((response) => {
    return !!response;
  });

  return false; // Synchronous check not possible with Cache API
}

/**
 * Get memory usage (Chrome only)
 */
export function getMemoryUsage(): { used: number; total: number; percentage: number } | null {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
    };
  }
  return null;
}
