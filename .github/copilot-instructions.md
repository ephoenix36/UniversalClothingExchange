# GitHub Copilot Instructions - Universal Clothing Exchange

## 🌿 Project Overview

Universal Clothing Exchange (UCE) is a **sustainable, circular fashion platform** where users can swap clothing items instead of buying new ones. The mission is to reduce textile waste, build community, and make sustainable fashion accessible.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- Whop SDK (Authentication & Monetization)
- React 19

---

## 🎨 Design System & Styling

### Color Palette (Use These Exact Values)

**Primary Colors:**
```typescript
const colors = {
  sage: '#4a8a62',        // Primary brand color
  terracotta: '#d98960',  // Secondary accent
  forest: '#3a7550',      // Hover states, success
}
```

**Text Colors:**
```typescript
const text = {
  primary: '#372e28',     // Main text (deep earth brown)
  secondary: '#6b5d50',   // Labels, captions (medium brown)
}
```

**Backgrounds:**
```typescript
const backgrounds = {
  base: '#f9f7f4',        // Warm off-white
  muted: '#f2ede6',       // Light beige
  accent: '#eae4d6',      // Soft sand
}
```

**Borders:**
```typescript
const borders = {
  default: '#dcd6cc',     // Soft beige
}
```

### Glass Morphism Classes

When creating cards or surfaces, prefer these glass effects:

```tsx
// Standard card
<div className="glass-card rounded-2xl p-6">

// Navigation bar
<nav className="glass-nav">

// Modal/dialog
<div className="glass-heavy">

// Subtle background
<div className="glass-clear">
```

### Gradient Patterns

Use **subtle** gradients only:

```tsx
// Background gradients (subtle)
className="bg-gradient-to-br from-[#f9f7f4] via-[#faf8f6] to-[#f2ede6]"

// Text gradients (for headings only)
className="bg-gradient-to-r from-[#5a9a72] via-[#4a8a62] to-[#6aaa82] bg-clip-text text-transparent"
```

### Typography Classes

```tsx
// Use these predefined classes:
heading-xl    // Page titles
heading-lg    // Section headers
heading-md    // Card headers
heading-sm    // Subsections
body-lg       // Intro text
body-md       // Standard text
body-sm       // Labels, captions
```

---

## 🧩 Component Patterns

### Buttons

```tsx
// Primary button
<button className="
  bg-[#4a8a62] 
  text-white 
  px-6 py-3 
  rounded-xl 
  font-medium 
  hover:bg-[#3a7550] 
  active:scale-95 
  transition-all 
  shadow-sm 
  hover:shadow-md
">
  Primary Action
</button>

// Secondary button
<button className="
  bg-transparent 
  text-[#4a8a62] 
  border-2 border-[#4a8a62] 
  px-6 py-3 
  rounded-xl 
  font-medium 
  hover:bg-[#4a8a62]/10 
  active:scale-95 
  transition-all
">
  Secondary Action
</button>
```

### Cards

```tsx
// Use glass morphism for modern feel
<div className="
  glass-card 
  rounded-2xl 
  p-6 
  shadow-sm 
  hover:shadow-xl 
  transition-all
  card-interactive
">
  {content}
</div>
```

### Forms

```tsx
// Text inputs
<input
  type="text"
  className="
    w-full 
    px-4 py-2.5 
    rounded-xl 
    bg-white 
    border border-[#dcd6cc] 
    text-[#372e28] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#4a8a62] 
    transition-all
  "
/>
```

---

## 📐 Coding Standards

### TypeScript

**Always use TypeScript.** Define interfaces for:
- Component props
- API responses
- Database models
- Form data
- State shapes

```typescript
// Example
interface ItemCardProps {
  id: string;
  name: string;
  imageUrl: string;
  size: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  onSwapRequest: () => void;
}
```

### React Best Practices

```tsx
// ✅ Do: Use React 19 features
'use client'; // For client components
import { useState, useEffect } from 'react';

// ✅ Do: Keep components small and focused
export default function ItemCard({ item }: ItemCardProps) {
  return <div>...</div>;
}

// ✅ Do: Use descriptive names
const handleSwapRequest = () => { ... };
const isSwapAvailable = item.status === 'available';

// ❌ Don't: Use inline styles
style={{ color: 'red' }} // Bad!

// ❌ Don't: Forget error boundaries
// Always handle loading and error states
```

### File Structure

```
/app
  /page.tsx              # Homepage
  /discover/page.tsx     # Browse items
  /profile/page.tsx      # User profile
  /swaps/page.tsx        # Swap management
  /api                   # API routes
  
/components
  /ui                    # Base components
  /layout                # Layout components
  /features              # Feature-specific
  
/lib
  /utils.ts              # Utilities
  /hooks.ts              # Custom hooks
  /types.ts              # Type definitions
```

---

## 🔐 Authentication & Security

**We use Whop SDK for authentication:**

```typescript
import { authorizeUser } from "@whop/dev-auth";
import { validateWhopToken } from "@/lib/whop-sdk";

// In API routes
const user = await authorizeUser(req);
if (!user) {
  return new Response('Unauthorized', { status: 401 });
}
```

**Never expose:**
- API keys in client code
- Database credentials
- User emails publicly
- Internal IDs in URLs (use slugs)

---

## 💾 Database (Prisma)

**Always:**
- Use Prisma for database operations
- Define models in `prisma/schema.prisma`
- Run `npx prisma generate` after schema changes
- Handle errors gracefully

```typescript
// Example
import prisma from '@/lib/prisma';

const items = await prisma.wardrobeItem.findMany({
  where: { userId: user.id },
  include: { photos: true },
  orderBy: { createdAt: 'desc' },
});
```

---

## ♿ Accessibility Requirements

**Every component must:**
- Support keyboard navigation
- Have proper ARIA labels
- Maintain 4.5:1 contrast ratio minimum
- Work with screen readers
- Have visible focus states
- Support reduced motion

```tsx
// Example
<button
  aria-label="Request swap for vintage jacket"
  className="focus:ring-2 focus:ring-[#4a8a62]"
>
  <Icon />
</button>
```

---

## 📱 Responsive Design

**Mobile-first approach:**

```tsx
// ✅ Do: Start with mobile, enhance for desktop
<div className="
  flex flex-col      // Mobile: stack vertically
  md:flex-row        // Tablet+: side-by-side
  gap-4              // Consistent spacing
  p-4 md:p-6 lg:p-8  // Scale padding
">
```

**Touch targets:**
- Minimum 44x44px for interactive elements
- Use `btn-touch-target` class

---

## 🎯 Feature Implementation Guidelines

### When Building New Features:

1. **Plan the UI first**
   - Sketch component structure
   - Define states (loading, error, empty, success)
   - Consider responsive behavior

2. **Create types**
   - Define TypeScript interfaces
   - Document expected shapes

3. **Build incrementally**
   - Start with static UI
   - Add interactivity
   - Connect to backend
   - Handle edge cases

4. **Test thoroughly**
   - Check all states
   - Test on mobile
   - Verify accessibility
   - Test error scenarios

### API Route Pattern

```typescript
// app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authorizeUser } from "@whop/dev-auth";
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await authorizeUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const items = await prisma.wardrobeItem.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ 
      success: true, 
      items 
    });

  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
```

---

## 🚫 What NOT to Do

❌ **Don't:**
- Use pure black (#000000) - use `#372e28` instead
- Use bright, saturated colors - stick to the earthy palette
- Create horizontal scroll
- Use hover as the only way to access features
- Skip loading states
- Forget error handling
- Use inline styles
- Mix CSS frameworks (we use Tailwind only)
- Create components over 200 lines (split them up!)
- Commit console.logs to main branch
- Use `any` type in TypeScript
- Skip TypeScript types
- Forget responsive design
- Ignore accessibility

---

## ✨ Code Generation Preferences

### When I ask you to create a component:

1. **Use TypeScript** with proper types
2. **Include all states**: loading, error, empty, success
3. **Make it responsive** with Tailwind classes
4. **Add accessibility** features (ARIA labels, keyboard support)
5. **Use glass morphism** for cards/surfaces
6. **Follow the color palette** exactly
7. **Add hover/active states** for interactive elements
8. **Include comments** for complex logic
9. **Export interfaces** separately
10. **Make it reusable** with props

### Example Request:
```
"Create a ClothingItemCard component"

Should result in:
- TypeScript component with ClothingItemCardProps interface
- Glass morphism card styling
- Responsive design (mobile-first)
- Hover effects
- Accessibility features
- Loading state support
- Click handler prop
- Proper image optimization
```

---

## 🌱 Platform Philosophy

**Remember these core principles:**

1. **Sustainability First** - Every feature should support circular fashion
2. **Community Driven** - Build features that connect people
3. **Simple & Clear** - Don't overcomplicate the UX
4. **Trust & Safety** - Verify, protect, moderate
5. **Delight Users** - Small animations, helpful feedback

---

## 📚 Helpful References

**Documentation:**
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- Prisma: https://www.prisma.io/docs
- Whop: https://docs.whop.com

**Project Files:**
- Style Guide: `/STYLE_GUIDE.md`
- Handoff Instructions: `/HANDOFF_INSTRUCTIONS.md`
- Theme Transformation: `/EARTHY_THEME_TRANSFORMATION.md`

---

## 🤖 Auto-Completions

When I'm typing common patterns, suggest:

**Import statements:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { useState, useEffect } from 'react';
import prisma from '@/lib/prisma';
```

**Tailwind classes:**
```
glass-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all
```

**Common patterns:**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

try {
  setIsLoading(true);
  // ... operation
} catch (err) {
  setError(err.message);
} finally {
  setIsLoading(false);
}
```

---

**Thank you for helping build a sustainable future through circular fashion! 🌿♻️**
