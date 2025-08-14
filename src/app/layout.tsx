import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Smooth from "@/components/Smooth";
import Script from "next/script";
import { product } from "@/content/product";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B0B0B",
};

export const metadata: Metadata = {
  title: "ZOLAR — Borderline Drop | Heavy Knit Essentials",
  description: product.copy.tagline,
  keywords: ["streetwear", "fashion", "heavyweight cotton", "ZOLAR", "UAE fashion", "Dubai streetwear"],
  authors: [{ name: "ZOLAR" }],
  creator: "ZOLAR",
  publisher: "ZOLAR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ZOLAR — Borderline Drop",
    description: product.copy.tagline,
    url: "https://zolar.ae",
    siteName: "ZOLAR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZOLAR Borderline Drop",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZOLAR — Borderline Drop",
    description: product.copy.tagline,
    images: ["/og-image.jpg"],
    creator: "@zolar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
};

// Structured data for Product
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.copy.tagline,
  brand: {
    "@type": "Brand",
    name: product.brand,
  },
  offers: {
    "@type": "Offer",
    price: product.priceAED,
    priceCurrency: product.currency,
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "ZOLAR",
    },
  },
  image: [
    product.images.hero,
    product.images.maleFront,
    product.images.backPrint1,
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "24",
  },
  material: product.materials.join(", "),
  size: product.sizes.join(", "),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="grain antialiased">
        <Smooth>{children}</Smooth>
        
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}