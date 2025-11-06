/**
 * Swaps Loading State
 * 
 * Displayed while swap data is being fetched.
 * Prevents Cumulative Layout Shift (CLS) by reserving space.
 */

import { SkeletonList } from '@/components/ui/skeleton';

export default function SwapsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
      
      {/* Tabs skeleton */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 w-28 animate-pulse rounded-t-md bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
      
      {/* List skeleton */}
      <SkeletonList count={8} />
    </div>
  );
}
