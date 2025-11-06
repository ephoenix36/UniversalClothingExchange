/**
 * Loading Skeleton Components
 * 
 * Reusable skeleton components to prevent Cumulative Layout Shift (CLS)
 * during async operations.
 * 
 * Usage:
 * - Use exact dimensions to match final content
 * - Pulse animation for visual feedback
 * - Accessible ARIA labels
 */

import { cn } from '@/lib/utils';

// ============================================================================
// Base Skeleton Component
// ============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base skeleton with pulse animation
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
}

// ============================================================================
// Wardrobe Item Skeletons
// ============================================================================

/**
 * Skeleton for a single wardrobe item card
 */
export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Tags skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>
    </div>
  );
}

/**
 * Skeleton for wardrobe item grid
 */
export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// List Skeletons
// ============================================================================

/**
 * Skeleton for a single list item
 */
export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      {/* Avatar */}
      <Skeleton className="h-12 w-12 rounded-full" />
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      
      {/* Action */}
      <Skeleton className="h-9 w-20 rounded-md" />
    </div>
  );
}

/**
 * Skeleton for a list of items
 */
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// Profile Skeletons
// ============================================================================

/**
 * Skeleton for user profile page
 */
export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <Skeleton className="h-24 w-24 rounded-full" />
        
        {/* Info */}
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      
      {/* Content grid */}
      <SkeletonGrid count={8} />
    </div>
  );
}

// ============================================================================
// Table Skeletons
// ============================================================================

/**
 * Skeleton for table row
 */
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton for data table
 */
export function SkeletonTable({ rows = 10, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Form Skeletons
// ============================================================================

/**
 * Skeleton for form input field
 */
export function SkeletonInput() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

/**
 * Skeleton for form
 */
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <SkeletonInput key={i} />
      ))}
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

// ============================================================================
// Chat Skeletons
// ============================================================================

/**
 * Skeleton for chat message
 */
export function SkeletonMessage({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={cn('flex gap-3', isOwn && 'flex-row-reverse')}>
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className={cn('space-y-2', isOwn ? 'items-end' : 'items-start', 'flex flex-col')}>
        <Skeleton className="h-4 w-32" />
        <Skeleton className={cn('h-16 rounded-lg', isOwn ? 'w-64' : 'w-72')} />
      </div>
    </div>
  );
}

/**
 * Skeleton for chat conversation
 */
export function SkeletonChat({ messages = 5 }: { messages?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: messages }).map((_, i) => (
        <SkeletonMessage key={i} isOwn={i % 3 === 0} />
      ))}
    </div>
  );
}

// ============================================================================
// Text Skeletons
// ============================================================================

/**
 * Skeleton for text paragraph
 */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Image Skeletons
// ============================================================================

/**
 * Skeleton for image with aspect ratio
 */
export function SkeletonImage({ aspectRatio = '1/1' }: { aspectRatio?: string }) {
  return <Skeleton className="w-full" style={{ aspectRatio }} />;
}

// ============================================================================
// Page Skeletons
// ============================================================================

/**
 * Skeleton for full page
 */
export function SkeletonPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <SkeletonText lines={5} />
          <SkeletonImage aspectRatio="16/9" />
          <SkeletonText lines={4} />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
