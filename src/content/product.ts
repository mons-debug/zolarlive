// Product manifest for ZOLAR Borderline Drop
export const product = {
  id: "borderline-tee",
  name: "Borderline Tee",
  brand: "ZOLAR",
  priceAED: 299,
  currency: "AED",
  sizes: ["S", "M", "L", "XL"] as const,
  defaultSize: "M" as const,
  images: {
    hero: "/stock/hero.jpg", // Hero shot placeholder
    lookdown: "/stock/look02.jpg", // Look down placeholder
    backPrint1: "/stock/backprint.jpg", // Back print detail
    backPrint2: "/stock/backprint.jpg", // Back print wide
    maleAngled: "/stock/look03.jpg", // Angled shot placeholder
    maleFront: "/stock/look04.jpg", // Front shot placeholder
    femaleWhite1: "/stock/look05.jpg", // Female model placeholder
    femaleWhite2: "/stock/look06.jpg", // Female model side placeholder
    // Lookbook order for rail - using our downloaded stock images
    lookbook: [
      "/stock/look01.jpg",
      "/stock/look02.jpg", 
      "/stock/look03.jpg",
      "/stock/look04.jpg",
      "/stock/look05.jpg",
      "/stock/look06.jpg",
    ],
    // Feature/story images - using our downloaded stock
    features: {
      weight: "/stock/feature-front.jpg", // Fabric texture detail
      details: "/stock/feature-stitch.jpg", // Seam detail
      energy: "/stock/feature-ink.jpg", // Print detail
    }
  },
  copy: {
    tagline: "Heavy knit essentials engineered for the modern world",
    heroTaglines: [
      "BORDERLINE DROP",
      "ENGINEERED FOR THE GRIND",
      "HEAVYWEIGHT ESSENTIALS",
      "240 GSM PRECISION",
      "BUILT TO LAST",
      "STREET MEETS TECHNICAL"
    ],
    bullets: [
      "240 GSM heavyweight cotton",
      "Reinforced double-stitch seams", 
      "Crack-resistant silk-screen print",
      "Pre-shrunk & enzyme washed"
    ],
    backPrintBullets: [
      "Silk-screened graphic",
      "High wash-fastness", 
      "Crack-resistant ink"
    ],
    features: [
      {
        title: "CUT & WEIGHT",
        description: "Precision engineered with 240 GSM heavyweight cotton. Built for those who demand more."
      },
      {
        title: "DETAILS THAT LAST", 
        description: "Reinforced seams. Double-stitch construction. Built for the grind."
      },
      {
        title: "BORDERLINE ENERGY",
        description: "Where streetwear meets technical precision. No compromise."
      }
    ]
  },
  sizeChart: {
    units: ["in", "cm"] as const,
    sizes: {
      S: { chest: { in: 36, cm: 91 }, length: { in: 27, cm: 69 } },
      M: { chest: { in: 40, cm: 102 }, length: { in: 28, cm: 71 } },
      L: { chest: { in: 44, cm: 112 }, length: { in: 29, cm: 74 } },
      XL: { chest: { in: 48, cm: 122 }, length: { in: 30, cm: 76 } }
    }
  },
  availability: "InStock",
  sku: "ZLR-BDL-001",
  releaseDate: "2024-08-14",
  category: "Streetwear",
  materials: ["100% Cotton", "240 GSM", "Enzyme Washed"],
  care: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron medium heat"],
  fit: "Oversized",
} as const;

export type ProductSize = typeof product.sizes[number];
export type ProductUnit = typeof product.sizeChart.units[number];
