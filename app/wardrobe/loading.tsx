/**
 * Wardrobe Loading State
 * 
 * Displayed while wardrobe data is being fetched.
 * Prevents Cumulative Layout Shift (CLS) by reserving space.
 */

import { SkeletonGrid } from '@/components/ui/skeleton';

export default function WardrobeLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
      
      {/* Filters skeleton */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
      
      {/* Grid skeleton */}
      <SkeletonGrid count={12} />
    </div>
  );
}
