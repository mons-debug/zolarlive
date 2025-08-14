// Legacy image paths - now using product.ts for centralized data
// This file is kept for backwards compatibility with existing components
// New components should import from @/content/product instead

export const IMAGES = {
  hero: '/stock/hero.jpg',
  lookbook: [
    '/stock/look01.jpg',
    '/stock/look02.jpg', 
    '/stock/look03.jpg',
    '/stock/look04.jpg',
    '/stock/look05.jpg',
    '/stock/look06.jpg',
  ],
  feature: {
    front: '/stock/feature-front.jpg',
    stitch: '/stock/feature-stitch.jpg', 
    ink: '/stock/feature-ink.jpg',
  },
  backPrint: '/stock/backprint.jpg',
  thumb: '/stock/thumb.jpg',
};
