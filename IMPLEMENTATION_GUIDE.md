# ZOLAR Borderline Drop - Implementation Guide

## 🚀 Project Overview

A premium streetwear e-commerce site built with Next.js 14, featuring:
- Advanced GSAP animations with ScrollTrigger
- Smooth scroll with Lenis
- Centralized product data management
- WhatsApp order integration
- Full SEO optimization

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx       # SEO, metadata, structured data
│   ├── page.tsx         # Main page with all sections
│   └── globals.css      # Brand tokens & utilities
├── components/
│   ├── sections/        # Page sections
│   │   ├── HeroV2.tsx   # Hero with parallax & tagline rotation
│   │   ├── StoryStrip.tsx # 3-chapter pinned narrative
│   │   ├── LookbookRailV2.tsx # Horizontal scroll gallery
│   │   ├── BackRevealV2.tsx # Cinematic diagonal reveal
│   │   └── OrderV2.tsx  # Main order section with size guide
│   ├── StickyOrderBar.tsx # Persistent CTA
│   ├── SizeGuide.tsx    # Modal with size chart
│   └── Smooth.tsx       # Lenis wrapper
├── content/
│   ├── product.ts       # Central product manifest
│   └── images.ts        # Legacy image paths
└── lib/
    └── gsap.ts          # GSAP configuration
```

## 🎨 Brand System

### Colors
- `--zolar-black`: #0B0B0B
- `--zolar-ink`: #F5F5F5
- `--zolar-red`: #D91E2E
- `--zolar-green-1`: #19E58F
- `--zolar-green-2`: #0B7C50
- `--zolar-grad`: Linear gradient green spectrum

### Typography Scale
- Display: clamp(40px, 10vw, 144px)
- H1: clamp(32px, 8vw, 96px)
- H2: clamp(24px, 4.2vw, 56px)
- H3: clamp(20px, 3vw, 40px)
- Body: clamp(16px, 1.8vw, 18px)

### Motion
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Durations: 0.3s (fast), 0.6s (base), 1.2s (slow)
- Scrub values: 0.5-1 for smooth tracking
- Pin distances: 120-220vh for story sections

## 🖼️ Image Management

### Quick Swap Process
1. Replace files in `/public/stock/` keeping same filenames
2. Or update paths in `/src/content/product.ts`
3. No code changes needed - site updates automatically

### Required Images & Specs
| Section | Filename | Aspect Ratio | Recommended Size |
|---------|----------|--------------|------------------|
| Hero | IMG_8775.jpg | 16:9 | 1920x1080 |
| Story 1 | IMG_8779.jpg | 4:3 | 1600x1200 |
| Story 2 | e849a990.jpg | 4:3 | 1600x1200 |
| Story 3 | IMG_8775.jpg | 4:3 | 1600x1200 |
| Lookbook (6) | Various | 3:4 | 1200x1600 |
| Back Print | 325a2024.jpg | 2:3 | 1200x1800 |
| Product | 1e3a3ffb.jpg | 1:1 | 1000x1000 |

## ⚙️ Configuration

### Environment Variables
Create `.env.local`:
```bash
# WhatsApp Business
NEXT_PUBLIC_WA_NUMBER=+971500000000

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Product Data
Edit `/src/content/product.ts` to update:
- Pricing
- Sizes
- Copy/taglines
- Image paths
- Size chart measurements

## 🎯 Features

### 1. Hero Section
- 120vh pin with brightness scrub (0.8 → 0)
- Rotating taglines (3s interval)
- Parallax background image
- Scale & Y transforms on scroll

### 2. Story Strip (3 Chapters)
- 220vh pinned narrative
- Progress bar on right edge
- Sequential chapter reveals
- Image scale (1.08 → 1) with light sweep
- Desktop: ±24px parallax, Mobile: ±10px

### 3. Lookbook Rail
- Horizontal scroll (300vh → horizontal)
- Snap points at each frame
- Frame captions fade by proximity
- Mobile: Touch carousel fallback

### 4. Back Print Reveal
- Diagonal clip-path animation
- Staggered bullet reveals
- Vignette & grain overlay
- 15% vertical parallax

### 5. Order Section
- Size selection with validation
- Size guide modal (Headless UI)
- WhatsApp deep linking
- Analytics tracking (view/select/order)
- Sticky CTA bar (appears after 80vh scroll)

## 📊 Analytics Events

The site tracks:
- `view_product`: Page load
- `select_size`: Size button click
- `wa_click`: WhatsApp button click (with source)

## 🚦 Performance Targets

- **LCP**: ≤ 2.5s (hero image preloaded)
- **CLS**: ≤ 0.02 (aspect ratios prevent shift)
- **FID**: ≤ 100ms (minimal JS blocking)
- **Lighthouse**: 90+ across all metrics

## ♿ Accessibility

- `prefers-reduced-motion`: Disables pins & complex animations
- Focus visible states on all interactive elements
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📱 Responsive Breakpoints

- Mobile: < 768px (no pinning, shorter animations)
- Tablet: 768px - 1024px (reduced parallax)
- Desktop: > 1024px (full experience)

## 🎬 Animation Sequences

### ScrollTrigger Pins
- Hero: 120vh
- Story Strip: 220vh  
- Lookbook Rail: 300vh
- Back Reveal: No pin (reveal on enter)

### Scrub Values
- Hero: 1 (smooth follow)
- Story: 1 (smooth follow)
- Lookbook: 0.5 (tighter tracking)
- Back Reveal: 0.5 (responsive reveal)

## 🚢 Deployment Checklist

- [ ] Update `.env.local` with real WhatsApp number
- [ ] Replace placeholder images in `/public/stock/`
- [ ] Create OG image (1200x630) at `/public/og-image.jpg`
- [ ] Update Google Analytics ID
- [ ] Test all animations on mobile
- [ ] Verify WhatsApp links work
- [ ] Check accessibility with screen reader
- [ ] Run Lighthouse audit
- [ ] Test with slow 3G throttling

## 📝 Content Management

### To Update Copy
Edit `/src/content/product.ts`:
- `heroTaglines[]`: Rotating hero messages
- `features[]`: Story chapter content
- `bullets[]`: Product detail points
- `backPrintBullets[]`: Back print specs

### To Add Variants
Extend product object with:
```typescript
variants: [
  { id: "black", name: "Black", images: {...} },
  { id: "white", name: "White", images: {...} }
]
```

## 🎨 Customization

### Add New Section
1. Create component in `/src/components/sections/`
2. Import in `/src/app/page.tsx`
3. Add ScrollTrigger animations
4. Update sticky bar hide logic if needed

### Modify Animations
- Edit `/src/app/globals.css` for timing functions
- Adjust scrub/pin values in components
- Update parallax ranges (currently 10-24px)

---

Built with precision for ZOLAR by the Borderline team.
