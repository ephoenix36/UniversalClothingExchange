# 🎨 Universal Clothing Exchange - Style Guide

**Version**: 1.0  
**Last Updated**: November 5, 2025  
**Theme**: Sustainable · Earthy · Natural · Modern

---

## 📐 Design Principles

### 1. **Sustainability First**
Every design choice reflects our circular fashion mission. Natural colors, organic shapes, and eco-conscious aesthetics throughout.

### 2. **Clarity Over Complexity**
Clean, minimal interfaces that guide users effortlessly. Information hierarchy is clear, actions are obvious.

### 3. **Warmth & Trust**
Earthy tones create a welcoming, trustworthy environment. This is a community platform—it should feel human.

### 4. **Modern Refinement**
While natural, we're not rustic. Glass morphism, smooth animations, and contemporary UX patterns.

### 5. **Accessibility Always**
WCAG AA compliance minimum. Every user should have a great experience.

---

## 🎨 Color System

### Primary Colors

#### **Sage Green** - Primary Brand Color
```css
HSL: 142 35% 45%
HEX: #4a8a62
RGB: 74, 138, 98
Use: Primary buttons, active states, brand elements, success indicators
Meaning: Growth, sustainability, renewal, nature
```

#### **Terracotta** - Secondary Accent
```css
HSL: 18 60% 60%
HEX: #d98960
RGB: 217, 137, 96
Use: Warm accents, gradient pairs, secondary CTAs, highlights
Meaning: Earth, warmth, grounding, organic
```

#### **Forest Green** - Hover & Success
```css
HSL: 142 45% 40%
HEX: #3a7550
RGB: 58, 117, 80
Use: Hover states, success messages, active indicators
Meaning: Deep nature, reliability, success
```

### Background Colors

#### **Warm Off-White** - Primary Background
```css
HSL: 42 33% 97%
HEX: #f9f7f4
Use: Main page backgrounds, canvas
```

#### **Very Light Beige** - Gradient Mid-Point
```css
HEX: #faf8f6
Use: Subtle gradient transitions
```

#### **Light Beige** - Muted Sections
```css
HSL: 40 25% 92%
HEX: #f2ede6
Use: Alternating sections, subtle backgrounds
```

#### **Soft Sand** - Accent Background
```css
HSL: 45 40% 88%
HEX: #eae4d6
Use: Hover backgrounds, subtle highlights
```

### Text Colors

#### **Deep Earth Brown** - Primary Text
```css
HSL: 20 25% 20%
HEX: #372e28
Use: Headings, body text, primary content
Contrast: 12.6:1 on white (AAA)
```

#### **Medium Brown** - Secondary Text
```css
HSL: 25 20% 40%
HEX: #6b5d50
Use: Labels, captions, helper text
Contrast: 5.8:1 on white (AA)
```

### Border & Divider Colors

#### **Soft Beige** - Primary Borders
```css
HSL: 40 20% 85%
HEX: #dcd6cc
Use: Card borders, dividers, input borders
```

### State Colors

#### **Success** - Forest Green
```css
HEX: #3a7550
Use: Success messages, confirmations, positive feedback
```

#### **Error** - Natural Red-Clay
```css
HEX: #c95945
Use: Errors, destructive actions, warnings
```

#### **Warning** - Warm Amber
```css
HEX: #e4a336
Use: Warnings, caution states, important notices
```

### Color Usage Rules

✅ **Do:**
- Use sage green for primary actions
- Pair sage with terracotta in gradients
- Use forest green for hover states
- Keep backgrounds light and neutral
- Maintain sufficient contrast (4.5:1 minimum)

❌ **Don't:**
- Use pure black (#000000)
- Use bright, saturated colors
- Mix warm and cool tones randomly
- Use low-contrast color combinations
- Overuse terracotta (it's an accent!)

---

## 🔤 Typography

### Font Family

```css
font-family: 'Geist Sans', system-ui, -apple-system, sans-serif;
```

**Why Geist Sans?**
- Modern, clean, highly legible
- Excellent x-height for readability
- Professional yet approachable
- Great number rendering
- Variable font for performance

### Type Scale

```css
/* Display - Hero sections */
.text-display {
  font-size: clamp(3rem, 8vw, 6rem);     /* 48-96px */
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Heading XL - Page titles */
.heading-xl {
  font-size: clamp(2.5rem, 5vw, 4rem);   /* 40-64px */
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Heading L - Section headers */
.heading-lg {
  font-size: clamp(2rem, 4vw, 3rem);     /* 32-48px */
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Heading M - Card headers */
.heading-md {
  font-size: clamp(1.5rem, 3vw, 2rem);   /* 24-32px */
  line-height: 1.3;
  font-weight: 600;
}

/* Heading S - Subsections */
.heading-sm {
  font-size: clamp(1.25rem, 2.5vw, 1.5rem); /* 20-24px */
  line-height: 1.4;
  font-weight: 600;
}

/* Body L - Introductions */
.body-lg {
  font-size: 1.125rem;                   /* 18px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body M - Standard text */
.body-md {
  font-size: 1rem;                       /* 16px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body S - Labels, captions */
.body-sm {
  font-size: 0.875rem;                   /* 14px */
  line-height: 1.5;
  font-weight: 400;
}

/* Body XS - Helper text */
.body-xs {
  font-size: 0.75rem;                    /* 12px */
  line-height: 1.5;
  font-weight: 400;
}
```

### Typography Guidelines

✅ **Do:**
- Use heading hierarchy (h1 → h6)
- Keep line-length under 75 characters
- Use adequate line-height (1.5-1.6 for body)
- Use font weights sparingly (400, 600, 700)
- Apply letter-spacing to large headings

❌ **Don't:**
- Skip heading levels
- Use all caps excessively
- Use more than 3 font weights
- Set line-height below 1.4
- Use italic for large text blocks

---

## 🎭 Components

### Buttons

#### **Primary Button**
```tsx
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
```

#### **Secondary Button**
```tsx
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

#### **Ghost Button**
```tsx
<button className="
  bg-transparent 
  text-[#372e28]
  px-6 py-3 
  rounded-xl 
  font-medium 
  hover:bg-[#eae4d6]
  active:scale-95
  transition-all
">
  Ghost Action
</button>
```

### Cards

#### **Glass Card** (Recommended)
```tsx
<div className="
  glass-card
  rounded-2xl 
  p-6 
  shadow-sm 
  hover:shadow-xl
  transition-all
">
  Card Content
</div>
```

#### **Solid Card**
```tsx
<div className="
  bg-white 
  border border-[#dcd6cc]
  rounded-2xl 
  p-6 
  shadow-sm 
  hover:shadow-md
  transition-all
">
  Card Content
</div>
```

### Form Inputs

#### **Text Input**
```tsx
<input
  type="text"
  className="
    w-full 
    px-4 py-2.5 
    rounded-xl 
    bg-white
    border border-[#dcd6cc]
    text-[#372e28]
    placeholder:text-[#6b5d50]
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#4a8a62]
    transition-all
  "
  placeholder="Enter text..."
/>
```

#### **Textarea**
```tsx
<textarea
  className="
    w-full 
    px-4 py-2.5 
    rounded-xl 
    bg-white
    border border-[#dcd6cc]
    text-[#372e28]
    resize-none
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#4a8a62]
    transition-all
  "
  rows={4}
/>
```

### Badges

#### **Status Badge**
```tsx
<span className="
  inline-flex 
  items-center 
  px-3 py-1 
  rounded-full 
  text-sm 
  font-medium
  bg-[#4a8a62]/10 
  text-[#4a8a62]
  border border-[#4a8a62]/20
">
  New
</span>
```

### Navigation

#### **Nav Link (Active)**
```tsx
<a className="
  flex items-center gap-2 
  px-4 py-2.5 
  rounded-xl 
  text-sm font-medium
  bg-gradient-to-r from-[#4a8a62] to-[#d98960]
  text-white
  shadow-md shadow-[#4a8a62]/20
">
  Active Link
</a>
```

#### **Nav Link (Inactive)**
```tsx
<a className="
  flex items-center gap-2 
  px-4 py-2.5 
  rounded-xl 
  text-sm font-medium
  text-[#372e28]
  hover:bg-[#eae4d6]
  transition-all
">
  Link
</a>
```

---

## ✨ Effects & Interactions

### Glass Morphism

```css
/* Standard Glass */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Clear Glass */
.glass-clear {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(220, 214, 204, 0.5);
}

/* Card Glass */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 214, 204, 0.3);
  box-shadow: 0 8px 32px 0 rgba(74, 138, 98, 0.05);
}

/* Navigation Glass */
.glass-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(220, 214, 204, 0.5);
}
```

### Gradients

#### **Subtle Background Gradient**
```css
background: linear-gradient(
  to bottom right,
  #f9f7f4,
  #faf8f6,
  #f2ede6
);
```

#### **Brand Gradient (Text)**
```css
background: linear-gradient(
  to right,
  #5a9a72,
  #4a8a62,
  #6aaa82
);
background-clip: text;
-webkit-background-clip: text;
color: transparent;
```

#### **Card Overlay Gradient**
```css
background: linear-gradient(
  135deg,
  rgba(74, 138, 98, 0.05) 0%,
  rgba(217, 137, 96, 0.05) 100%
);
```

### Shadows

```css
/* Subtle */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);

/* Small */
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

/* Medium */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);

/* Large */
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* XL */
box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Colored (Sage) */
box-shadow: 0 8px 32px 0 rgba(74, 138, 98, 0.1);
```

### Transitions

```css
/* Standard */
transition: all 0.2s ease;

/* Slow */
transition: all 0.3s ease;

/* Fast */
transition: all 0.15s ease;

/* Transform only */
transition: transform 0.2s ease;

/* Opacity fade */
transition: opacity 0.3s ease;
```

### Hover States

```css
/* Scale up */
hover:scale-105

/* Scale down (button press) */
active:scale-95

/* Lift */
hover:translate-y-[-2px]

/* Shadow increase */
hover:shadow-lg

/* Opacity */
hover:opacity-80
```

---

## 📏 Spacing System

### Base Unit: 4px (0.25rem)

```css
/* Spacing Scale */
0   = 0px
1   = 4px    (0.25rem)
2   = 8px    (0.5rem)
3   = 12px   (0.75rem)
4   = 16px   (1rem)
5   = 20px   (1.25rem)
6   = 24px   (1.5rem)
8   = 32px   (2rem)
10  = 40px   (2.5rem)
12  = 48px   (3rem)
16  = 64px   (4rem)
20  = 80px   (5rem)
24  = 96px   (6rem)
```

### Common Patterns

```css
/* Card Padding */
.card-spacing { padding: 1.5rem; }       /* 24px */

/* Section Spacing */
.section-spacing { padding: 3rem 0; }    /* 48px vertical */

/* Container Padding */
.container-spacing { padding: 0 1rem; }  /* 16px horizontal */

/* Element Gap */
gap: 1rem;                               /* 16px */
gap: 1.5rem;                             /* 24px */
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm:   640px   /* Small tablets, large phones */
md:   768px   /* Tablets */
lg:   1024px  /* Small laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large desktops */
```

### Mobile Design Rules

✅ **Do:**
- Design mobile-first
- Use min-width media queries
- Stack layouts vertically on mobile
- Increase touch targets (44px minimum)
- Test on real devices

❌ **Don't:**
- Hide important content on mobile
- Use hover states as primary interaction
- Create horizontal scrolling
- Use fixed pixel widths
- Forget about landscape orientation

### Container Widths

```css
.container {
  width: 100%;
  max-width: 1280px;  /* xl breakpoint */
  margin: 0 auto;
  padding: 0 1rem;
}

/* Narrow container for text */
.container-narrow {
  max-width: 768px;
}

/* Wide container for grids */
.container-wide {
  max-width: 1536px;
}
```

---

## ♿ Accessibility

### Color Contrast

**Minimum Ratios (WCAG AA):**
- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

**Our Ratios:**
- `#372e28` on `#f9f7f4`: 12.6:1 ✅
- `#6b5d50` on `#f9f7f4`: 5.8:1 ✅
- `#4a8a62` on white: 4.7:1 ✅

### Touch Targets

```css
/* Minimum touch target size */
min-width: 44px;
min-height: 44px;

/* Better for mobile */
.btn-touch-target {
  min-width: 48px;
  min-height: 48px;
  padding: 0.75rem 1.5rem;
}
```

### Focus States

```css
/* Always visible focus ring */
focus:outline-none
focus:ring-2
focus:ring-[#4a8a62]
focus:ring-offset-2
```

### Keyboard Navigation

✅ **Do:**
- Support tab navigation
- Provide skip links
- Make modals keyboard-accessible
- Trap focus in modals
- Ensure logical tab order

### Screen Readers

```tsx
/* Descriptive aria labels */
<button aria-label="Upload wardrobe item">
  <Icon />
</button>

/* Announce dynamic changes */
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

/* Hide decorative images */
<img src="..." alt="" role="presentation" />
```

---

## 🎬 Animation Guidelines

### Timing

```css
/* UI Feedback */
duration-150    /* 150ms - Instant feedback */
duration-200    /* 200ms - Standard */
duration-300    /* 300ms - Deliberate */

/* Page Transitions */
duration-500    /* 500ms - Modal open/close */
duration-700    /* 700ms - Route changes */
```

### Easing

```css
/* Standard */
ease-in-out     /* Acceleration & deceleration */

/* Specific */
ease-in         /* Starts slow */
ease-out        /* Ends slow */
ease            /* Smooth curve */
```

### What to Animate

✅ **Do Animate:**
- Hover states (opacity, scale, shadow)
- Modal open/close
- Dropdown menus
- Loading states
- Success/error feedback
- Page transitions

❌ **Don't Animate:**
- Initial page load (annoying)
- Every small interaction
- Text content
- Critical actions (confusing)
- Layout shifts (jarring)

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📸 Images & Media

### Image Ratios

```css
/* Card thumbnails */
aspect-ratio: 1 / 1;         /* Square */

/* Product photos */
aspect-ratio: 3 / 4;         /* Portrait */

/* Banner images */
aspect-ratio: 16 / 9;        /* Landscape */
aspect-ratio: 21 / 9;        /* Ultra-wide */

/* Profile photos */
aspect-ratio: 1 / 1;         /* Circle crop */
```

### Image Optimization

✅ **Do:**
- Use WebP with fallback
- Provide multiple sizes (srcset)
- Lazy load below-fold images
- Optimize for web (compress)
- Use appropriate formats

❌ **Don't:**
- Use images larger than displayed size
- Forget alt text
- Use PNG for photos (use JPG/WebP)
- Load all images on mount

### Placeholder States

```tsx
/* Clothing placeholder with natural colors */
<ClothingPlaceholder type="jacket" />

/* Gradient skeleton */
<div className="
  h-48 rounded-xl
  bg-gradient-to-r from-[#f2ede6] via-[#eae4d6] to-[#f2ede6]
  animate-pulse
" />
```

---

## 📋 Content Guidelines

### Voice & Tone

**Brand Voice:**
- Friendly but not overly casual
- Encouraging and positive
- Educational without being preachy
- Community-focused
- Sustainability-conscious

**Writing Style:**
- Use active voice
- Keep sentences short
- Be specific and clear
- Avoid jargon
- Use "you" to address users

### Microcopy Examples

```
✅ Good:
"Add your first item to start swapping"
"Found a piece you love? Request a swap!"
"Your swap request has been sent"

❌ Bad:
"No items in database"
"Click here to proceed"
"Error: 404"
```

### Error Messages

```tsx
/* Friendly & helpful */
"Oops! We couldn't find that item. Try searching again?"

/* Actionable */
"This swap is no longer available. Browse similar items?"

/* Clear */
"Please add at least one photo to continue"
```

---

## 🚀 Performance

### Best Practices

✅ **Do:**
- Lazy load images
- Code split routes
- Minimize bundle size
- Use CSS instead of JS animations
- Optimize fonts
- Cache aggressively
- Compress images

❌ **Don't:**
- Load entire libraries for one function
- Use inline styles excessively
- Ignore Lighthouse scores
- Skip image optimization
- Load unused fonts

### Loading States

```tsx
/* Skeleton screens */
<div className="space-y-4">
  <div className="h-4 bg-[#eae4d6] rounded animate-pulse" />
  <div className="h-4 bg-[#eae4d6] rounded animate-pulse w-3/4" />
</div>

/* Spinners */
<div className="
  w-8 h-8 
  border-4 border-[#eae4d6]
  border-t-[#4a8a62]
  rounded-full 
  animate-spin
" />
```

---

## 🔒 Security & Privacy

### Data Handling

- Never expose sensitive data in URLs
- Sanitize all user input
- Use HTTPS only
- Implement CSP headers
- Rate limit API calls

### User Privacy

- Clear privacy policy
- GDPR compliance
- Cookie consent
- Data deletion options
- Privacy-by-default settings

---

## 📦 Component Library

### Recommended Structure

```
/components
  /ui             - Base components (Button, Input, Card)
  /layout         - Layout components (Header, Footer, Nav)
  /features       - Feature-specific (SwapCard, ItemCard)
  /common         - Shared utilities (LoadingSpinner, Badge)
```

### Naming Conventions

```tsx
/* Component files: PascalCase */
Button.tsx
ClothingCard.tsx
SwapModal.tsx

/* Utility files: camelCase */
formatDate.ts
calculateImpact.ts
validateForm.ts

/* CSS files: kebab-case */
button.module.css
card-styles.css
```

---

## ✅ Checklist for New Components

Before marking a component as complete:

- [ ] Responsive on all breakpoints
- [ ] Accessible (ARIA, keyboard, screen reader)
- [ ] Focus states visible
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Hover/active states work
- [ ] Touch targets are 44px+
- [ ] Color contrast meets WCAG AA
- [ ] Works with reduced motion
- [ ] TypeScript types defined
- [ ] Props documented
- [ ] Example usage provided
- [ ] Tested on real devices

---

**This style guide is a living document. Update it as the design system evolves!** 🌱
