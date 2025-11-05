# SEO Implementation Guide

## 📊 SEO Features Implemented

### 1. Meta Tags & Metadata
**Location**: `lib/seo.ts`

**Default Metadata**:
- Title with template
- Description (150-160 chars)
- Keywords targeting sustainable fashion
- Author and publisher info
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URLs

**Usage in Pages**:
```tsx
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Marketplace - Discover Sustainable Fashion',
  description: 'Browse thousands of quality pre-loved clothing items...',
  path: '/marketplace',
});
```

---

### 2. Structured Data (JSON-LD)
**Organization Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Universal Clothing Exchange",
  "url": "https://universalclothingexchange.com"
}
```

**Product Schema** (for clothing items):
```tsx
import { generateProductSchema } from '@/lib/seo';

const schema = generateProductSchema({
  id: item.id,
  title: item.title,
  description: item.description,
  price: item.estimatedValue,
  imageUrl: item.primaryImage,
  category: item.category,
  condition: item.condition,
  brand: item.brand,
});

// Add to page
<script type="application/ld+json">
  {JSON.stringify(schema)}
</script>
```

---

### 3. Sitemap
**Location**: `app/sitemap.ts`

**Static Pages**:
- Homepage (priority: 1.0)
- Marketplace (priority: 0.9)
- Creators (priority: 0.8)
- About, Help, Blog (priority: 0.6-0.7)

**Dynamic Pages** (TODO):
```typescript
// Fetch from database
const creators = await prisma.user.findMany({
  where: { isCreator: true, isPublic: true },
});

const items = await prisma.wardrobeItem.findMany({
  where: { status: 'AVAILABLE' },
  take: 1000, // Limit for sitemap
});

// Add to sitemap
```

**Access**: `https://yoursite.com/sitemap.xml`

---

### 4. Robots.txt
**Location**: `public/robots.txt`

**Allowed**:
- Public pages (/, /marketplace, /creators/*)
- Blog and help content
- Creator storefronts

**Disallowed**:
- User dashboards (/wardrobe, /settings)
- Private messages (/messages)
- API endpoints (/api/*)
- Admin pages (/admin/*)

**Crawl Delay**: 1 second (respectful crawling)

---

### 5. PWA Manifest
**Location**: `public/site.webmanifest`

**Features**:
- App name and description
- Icons (192x192, 512x512)
- Theme colors
- Display mode: standalone
- Shortcuts to key pages
- Categories: shopping, lifestyle, sustainability

**Install Prompt**:
Users can "Add to Home Screen" on mobile devices

---

### 6. Page Speed Optimization
**Next.js Config** (`next.config.mjs`):
- Image optimization (WebP/AVIF)
- Compression enabled
- Security headers
- DNS prefetch
- ETags for caching

**Performance Targets**:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

---

## 🎯 SEO Best Practices Implemented

### Content
✅ Unique page titles (50-60 characters)
✅ Meta descriptions (150-160 characters)
✅ H1-H6 heading hierarchy
✅ Keyword-optimized content
✅ Alt text for all images
✅ Internal linking structure

### Technical
✅ Semantic HTML5 tags
✅ Mobile-responsive design
✅ Fast page load times
✅ HTTPS (in production)
✅ Clean URL structure
✅ XML sitemap
✅ Robots.txt

### Social
✅ Open Graph tags
✅ Twitter Cards
✅ Social media meta images (1200x630)
✅ Shareable URLs

### Accessibility (SEO Benefit)
✅ ARIA labels
✅ Keyboard navigation
✅ Screen reader friendly
✅ Color contrast ratios
✅ Form labels

---

## 📈 Target Keywords

### Primary Keywords
1. **Clothing swap**
2. **Sustainable fashion marketplace**
3. **Pre-loved clothing**
4. **Fashion exchange**
5. **Circular fashion**

### Long-Tail Keywords
- "How to swap clothes online"
- "Sustainable fashion platform"
- "Digital wardrobe management"
- "Eco-friendly clothing exchange"
- "Second-hand designer clothes"
- "Virtual try-on sustainable fashion"

### Location-Based (Future)
- "Clothing swap [city]"
- "Fashion exchange near me"

---

## 🔍 Page-Specific SEO

### Homepage
**Title**: "Universal Clothing Exchange - Sustainable Fashion Marketplace"
**Description**: "Join the circular fashion revolution. Swap, trade, and discover quality pre-loved clothing. Manage your digital wardrobe and connect with fashion enthusiasts."
**Keywords**: clothing swap, sustainable fashion, wardrobe management

### Marketplace
**Title**: "Marketplace - Browse Thousands of Clothing Items"
**Description**: "Discover unique, sustainable fashion pieces. Filter by size, style, brand, and condition. Start swapping today!"
**Keywords**: clothing marketplace, second-hand fashion, style swap

### Creator Storefronts
**Title**: "[Creator Name]'s Closet - Sustainable Fashion"
**Description**: "Explore [Creator Name]'s curated collection of [number] items. Discover their unique style and sustainable picks."
**Keywords**: creator storefront, curated fashion, sustainable closet

### AI Try-On
**Title**: "Virtual Try-On - AI-Powered Fashion Styling"
**Description**: "See how clothes look on you with AI-powered virtual try-on. Get personalized style recommendations."
**Keywords**: virtual try-on, AI fashion, style recommendations

---

## 🛠️ Implementation Checklist

### Setup (Complete)
- [x] Configure SEO utilities (`lib/seo.ts`)
- [x] Add default metadata
- [x] Create sitemap generator
- [x] Setup robots.txt
- [x] Create PWA manifest
- [x] Add structured data helpers

### Page Meta Tags
- [ ] Homepage metadata
- [ ] Marketplace metadata
- [ ] Individual item pages
- [ ] Creator storefronts
- [ ] Blog posts
- [ ] Help/Support pages

### Structured Data
- [ ] Organization schema (homepage)
- [ ] Product schema (item pages)
- [ ] BreadcrumbList schema (navigation)
- [ ] Review schema (item reviews - future)

### Performance
- [x] Image optimization config
- [x] Code splitting
- [x] Compression
- [ ] CDN setup (production)
- [ ] Database query optimization

### Analytics
- [ ] Google Analytics 4
- [ ] Google Search Console
- [ ] Bing Webmaster Tools
- [ ] Hotjar/user behavior tracking

---

## 📊 Monitoring & Tracking

### Google Search Console
1. Verify site ownership
2. Submit sitemap (`/sitemap.xml`)
3. Monitor crawl errors
4. Track search performance
5. Review index coverage

### Google Analytics 4
```tsx
// Add to app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Performance Monitoring
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

---

## 🚀 Future Enhancements

### Content
- [ ] Blog with fashion/sustainability articles
- [ ] User testimonials
- [ ] Creator success stories
- [ ] How-to guides and tutorials
- [ ] FAQ schema markup

### Technical
- [ ] AMP pages for blog
- [ ] Prerender for SEO
- [ ] Image lazy loading
- [ ] Infinite scroll with pagination
- [ ] Progressive Web App features

### Marketing
- [ ] Backlink building
- [ ] Guest posting
- [ ] Social media integration
- [ ] Email marketing SEO
- [ ] Video content (YouTube)

---

## 📝 Content Guidelines

### Title Tags
- Keep under 60 characters
- Include primary keyword
- Brand name at end
- Unique for each page

### Meta Descriptions
- 150-160 characters
- Include call-to-action
- Use active voice
- Include target keyword naturally

### Headings
- One H1 per page
- Use H2-H6 for structure
- Include keywords naturally
- Descriptive and clear

### Images
- Descriptive file names
- Alt text with keywords
- Compress for speed
- Use next/image component

---

## 🎓 Resources

**SEO Tools**:
- Google Search Console
- Google Analytics
- Ahrefs / SEMrush
- Screaming Frog
- Lighthouse

**Learning**:
- Google SEO Starter Guide
- Moz Beginner's Guide to SEO
- Search Engine Journal
- Ahrefs Blog

---

**Last Updated**: November 4, 2025  
**Next Review**: December 4, 2025
