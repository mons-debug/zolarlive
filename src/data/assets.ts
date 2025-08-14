export const HERO_MEDIA = {
  video: "/stock/hero-video.mp4", // Placeholder for hero video
  poster: "/stock/hero.jpg", // Current hero image as poster
  fallback: "/stock/hero.jpg", // Fallback image
  alt: "ZOLAR Borderline Drop - Hero visual"
};

export const BRAND_ASSETS = {
  logo: {
    svg: "/brand/zolar-logo.svg", // SVG logo for masking
    png: "/brand/zolar-logo.png", // Fallback PNG
    white: "/brand/zolar-logo-white.svg"
  }
};

export const STORY_BEATS = [
  {
    title: "CUT & WEIGHT",
    sub: "Precision engineered with 240 GSM heavyweight cotton. Designed for a modern, relaxed fit.",
    mediaSrc: "/stock/feature-front.jpg",
    effect: "parallax" as const // Y + slight scale 1.05
  },
  {
    title: "DETAILS THAT LAST", 
    sub: "Reinforced seams and a durable ribbed collar. Built for the grind, designed to endure.",
    mediaSrc: "/stock/feature-stitch.jpg",
    effect: "pan" as const // pan-left
  },
  {
    title: "BORDERLINE ENERGY",
    sub: "Streetwear meets technical precision. A statement piece that defines your edge.",
    mediaSrc: "/stock/feature-ink.jpg", 
    effect: "zoom" as const // zoom-in 1.0→1.12 + vertical parallax
  }
];

export const STOCK_IMAGES = {
  hero: "/stock/hero.jpg",
  lookbook: [
    "/stock/look01.jpg",
    "/stock/look02.jpg", 
    "/stock/look03.jpg",
    "/stock/look04.jpg",
    "/stock/look05.jpg",
    "/stock/look06.jpg"
  ],
  features: {
    weight: "/stock/feature-front.jpg",
    details: "/stock/feature-stitch.jpg", 
    energy: "/stock/feature-ink.jpg"
  },
  backprint: "/stock/backprint.jpg",
  thumb: "/stock/thumb.jpg"
};
