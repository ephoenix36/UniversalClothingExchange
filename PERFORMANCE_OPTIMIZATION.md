# Performance Optimization Guide

## 🚀 Implemented Optimizations

### 1. Image Optimization
**Next.js Image Component**:
- Automatic WebP/AVIF conversion
- Responsive image sizing
- Lazy loading by default
- Blur placeholder support

**Configuration**:
```javascript
// next.config.mjs
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  minimumCacheTTL: 60, // 1 minute cache
}
```

**Usage**:
```tsx
import Image from 'next/image';

<Image
  src={item.imageUrl}
  alt={item.title}
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
/>
```

---

### 2. Code Splitting
**Automatic Route-Based Splitting**:
- Each page is a separate bundle
- Shared code in common chunks
- Vendor libraries separated

**Dynamic Imports**:
```tsx
// Heavy components loaded on demand
const AIConsentModal = dynamic(() => import('@/components/AIConsentModal'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Client-side only if needed
});
```

**Bundle Analysis**:
```bash
pnpm build
pnpm analyze  # If bundle analyzer installed
```

---

### 3. Database Query Optimization
**Connection Pooling**:
- Reuse database connections
- Pool size configured in DATABASE_URL
- Connection timeout management

**Query Optimization**:
```typescript
// ✅ GOOD - Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    username: true,
    avatarUrl: true,
  },
});

// ❌ BAD - Fetches all fields
const users = await prisma.user.findMany();
```

**Eager Loading (Avoid N+1)**:
```typescript
// ✅ GOOD - Single query with include
const items = await prisma.wardrobeItem.findMany({
  include: {
    images: true,
    owner: { select: { username: true } },
  },
});

// ❌ BAD - N+1 problem
const items = await prisma.wardrobeItem.findMany();
for (const item of items) {
  const images = await prisma.wardrobeImage.findMany({ where: { itemId: item.id } });
}
```

**Pagination**:
```typescript
import { getPagination } from '@/lib/db-utils';

const { skip, take } = getPagination({ page: 1, pageSize: 20 });

const items = await prisma.wardrobeItem.findMany({
  skip,
  take,
  orderBy: { createdAt: 'desc' },
});
```

---

### 4. React Performance
**Memoization**:
```tsx
import { memo, useMemo, useCallback } from 'react';

// Prevent unnecessary re-renders
const ItemCard = memo(({ item }) => {
  return <div>{item.title}</div>;
});

// Memoize expensive calculations
const filteredItems = useMemo(() => {
  return items.filter(item => item.status === 'AVAILABLE');
}, [items]);

// Memoize callbacks
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

**Virtualization** (for long lists):
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 200, // Item height
});
```

---

### 5. Caching Strategies
**Browser Caching**:
```typescript
// next.config.mjs
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

**API Response Caching**:
```typescript
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

---

### 6. Loading States
**Suspense Boundaries**:
```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DataComponent />
    </Suspense>
  );
}
```

**Loading Skeletons**:
```tsx
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-a3 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-a3 rounded w-1/2" />
    </div>
  );
}
```

---

### 7. Bundle Size Reduction
**Tree Shaking**:
```typescript
// ✅ GOOD - Named imports
import { Button } from '@whop/react/components';

// ❌ BAD - Full library import
import * as Whop from '@whop/react';
```

**Package Optimization**:
```json
// package.json
{
  "sideEffects": false, // Enable tree shaking
  "type": "module"
}
```

---

## 📊 Performance Metrics

### Target Scores (Lighthouse)
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Monitoring
```bash
# Run Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Check bundle size
pnpm build
# Look for bundle size warnings
```

---

## 🔍 Optimization Checklist

### Images
- [ ] Use Next.js Image component
- [ ] Provide width/height to prevent layout shift
- [ ] Use appropriate image formats (WebP/AVIF)
- [ ] Implement lazy loading
- [ ] Add blur placeholders

### Code
- [ ] Enable code splitting
- [ ] Use dynamic imports for heavy components
- [ ] Minimize JavaScript bundle size
- [ ] Remove unused dependencies
- [ ] Use production builds

### Database
- [ ] Add indexes on frequently queried fields
- [ ] Use select to fetch only needed fields
- [ ] Implement pagination
- [ ] Avoid N+1 queries with includes
- [ ] Use connection pooling

### Caching
- [ ] Set appropriate Cache-Control headers
- [ ] Implement browser caching
- [ ] Use CDN for static assets
- [ ] Cache API responses when appropriate

### Performance
- [ ] Minimize render-blocking resources
- [ ] Optimize critical rendering path
- [ ] Reduce main thread work
- [ ] Minimize request waterfalls
- [ ] Optimize font loading

---

## 🛠️ Tools

### Analysis
- **Lighthouse**: `lighthouse http://localhost:3000`
- **Bundle Analyzer**: `pnpm add -D @next/bundle-analyzer`
- **React DevTools**: Profiler tab
- **Chrome DevTools**: Performance tab

### Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and performance
- **Google Analytics**: User engagement metrics

---

## 📈 Expected Improvements

### Before Optimization
- First Load JS: ~300-400kb
- LCP: 3-4s
- FID: 100-200ms
- Bundle Size: Large

### After Optimization
- First Load JS: ~150-200kb  (-50%)
- LCP: 1.5-2s  (-50%)
- FID: 50-100ms  (-50%)
- Bundle Size: Optimized  (-40%)

---

**Last Updated**: November 4, 2025
