'use client';

/**
 * Wardrobe Route Error Boundary
 * 
 * Catches errors specific to wardrobe features.
 * Provides contextual recovery options.
 */

import { useEffect } from 'react';
import { formatErrorBoundaryError, logError } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Plus } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WardrobeError({ error, reset }: ErrorProps) {
  const errorInfo = formatErrorBoundaryError(error);

  useEffect(() => {
    logError(error, {
      route: '/wardrobe',
      component: 'WardrobeErrorBoundary',
      action: 'wardrobe feature error',
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Wardrobe Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300" role="alert">
            {errorInfo.message}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Button
            onClick={() => (window.location.href = '/wardrobe/add')}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        </div>
      </div>
    </div>
  );
}
