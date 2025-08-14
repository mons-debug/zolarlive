# Image Swap Guide - ZOLAR Borderline Drop

## Quick Image Replacement

To replace any placeholder image with your actual product photos, simply:

1. **Replace files in `/public/stock/`** with the same filenames
2. **No code changes needed** - the site will automatically use the new images

## Image Specifications

### Hero Section
- **File**: `hero.jpg`  
- **Aspect Ratio**: 16:9 (1920x1080px recommended)
- **Alt Text**: Automatically set to "Black streetwear wardrobe minimal"

### Lookbook Rail (6 images)
- **Files**: `look01.jpg` through `look06.jpg`
- **Aspect Ratio**: 3:4 portrait (1200x1600px recommended)  
- **Alt Texts**:
  - look01: "Streetwear editorial night look"
  - look02: "Fashion studio black model"
  - look03: "Urban neon street model"
  - look04: "Hoodie streetwear night style"
  - look05: "T-shirt street shadow look"
  - look06: "Denim streetwear editorial"

### Feature Stack (3 images)
- **Files**: `feature-front.jpg`, `feature-stitch.jpg`, `feature-ink.jpg`
- **Aspect Ratio**: 4:3 landscape (1600x1200px recommended)
- **Alt Texts**:
  - feature-front: "Black t-shirt close-up texture detail"
  - feature-stitch: "Garment seam stitch detail"  
  - feature-ink: "Screen print ink detail"

### Back Print Reveal
- **File**: `backprint.jpg`
- **Aspect Ratio**: 2:3 portrait (1200x1800px recommended)
- **Alt Text**: "Graphic t-shirt back streetwear detail"

### Product Thumbnail
- **File**: `thumb.jpg`
- **Aspect Ratio**: 1:1 square (1000x1000px recommended)
- **Alt Text**: "Black t-shirt flatlay"

## Advanced Customization

If you need to change alt texts or add more images:

1. Edit `/src/content/images.ts` to modify image paths
2. Update component files in `/src/components/sections/` to change alt texts

## Image Optimization

- All images use Next.js Image component for automatic optimization
- WebP conversion happens automatically in production
- Lazy loading is enabled for all images except the hero
- Proper aspect ratios prevent layout shifts

## WhatsApp Integration

Update your WhatsApp number in `.env.local`:
```
NEXT_PUBLIC_WA_NUMBER=+971XXXXXXXXX
```
