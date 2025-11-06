'use client';

/**
 * Web Vitals Reporter Component
 * Tracks Core Web Vitals and sends to analytics
 * 
 * Usage: Add to app/layout.tsx
 * <WebVitals />
 */

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/lib/performance';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Report to custom analytics endpoint
    reportWebVitals(metric);
  });

  // Report initial page load performance
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        const metrics = {
          // DNS lookup time
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          // TCP connection time
          tcp: navigation.connectEnd - navigation.connectStart,
          // Server response time (TTFB)
          ttfb: navigation.responseStart - navigation.requestStart,
          // DOM processing time
          domProcessing: navigation.domComplete - navigation.domInteractive,
          // Total page load time
          pageLoad: navigation.loadEventEnd - navigation.fetchStart,
        };

        if (process.env.NODE_ENV === 'development') {
          console.log('[Navigation Timing]', metrics);
        }
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
