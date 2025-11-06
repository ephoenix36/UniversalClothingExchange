'use client';

/**
 * App-Level Error Boundary Component
 * 
 * Catches all unhandled React component errors across the entire application.
 * Provides user-friendly error UI with reset functionality.
 * Logs errors to monitoring service.
 */

import { useEffect } from 'react';
import { AppError, formatErrorBoundaryError, logError } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * App-level error boundary (app/error.tsx)
 * 
 * This file is automatically used by Next.js App Router as the error boundary
 * for the entire application.
 */
export default function Error({ error, reset }: ErrorProps) {
  const errorInfo = formatErrorBoundaryError(error);

  useEffect(() => {
    // Log error to monitoring service
    logError(error, {
      route: window.location.pathname,
      component: 'AppErrorBoundary',
      action: 'render error',
      userAgent: navigator.userAgent,
      deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
        </div>

        {/* Error Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {errorInfo.title}
          </h1>
          
          {/* User-friendly error message */}
          <p 
            className="text-lg text-gray-600 dark:text-gray-300"
            role="alert"
            aria-live="assertive"
          >
            {errorInfo.message}
          </p>
        </div>

        {/* Actionable guidance */}
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            {errorInfo.action}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="inline-flex items-center gap-2"
            size="lg"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </Button>

          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="inline-flex items-center gap-2"
            size="lg"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go Home
          </Button>
        </div>

        {/* Development mode: Show error details */}
        {process.env.NODE_ENV === 'development' && errorInfo.details && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 max-h-96 overflow-auto rounded-lg bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {errorInfo.details}
            </pre>
          </details>
        )}

        {/* Error digest (for support) */}
        {error.digest && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Error ID: <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">{error.digest}</code>
          </p>
        )}
      </div>
    </div>
  );
}
