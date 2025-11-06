/**
 * Creator Dashboard Loading State
 * 
 * Displayed while creator analytics and data are being fetched.
 * Prevents Cumulative Layout Shift (CLS) by reserving space.
 */

import { SkeletonTable } from '@/components/ui/skeleton';

export default function CreatorLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-96 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-gray-200 p-6 dark:border-gray-700">
            <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <SkeletonTable rows={10} columns={5} />
    </div>
  );
}
