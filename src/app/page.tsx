"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ProductSize } from "@/content/product";

// Dynamic imports for better performance
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { ssr: false });
const CursorEffect = dynamic(() => import("@/components/CursorEffect"), { ssr: false });
const MobileMenu = dynamic(() => import("@/components/MobileMenu"), { ssr: false });
const GTAHero = dynamic(() => import("@/components/hero/GTAHero"));
const StoryStrip = dynamic(() => import("@/components/story/StoryStrip"));
const ParallaxGrid = dynamic(() => import("@/components/products/ParallaxGrid"));
const StoryStripV3 = dynamic(() => import("@/components/sections/StoryStripV3"));
const LookbookRailV4 = dynamic(() => import("@/components/sections/LookbookRailV4"));
const BackRevealV3 = dynamic(() => import("@/components/sections/BackRevealV3"));
const OrderV2 = dynamic(() => import("@/components/sections/OrderV2"));
const StickyOrderBar = dynamic(() => import("@/components/StickyOrderBar"));

// Global window type extension for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters: Record<string, unknown>) => void;
  }
}

export default function Page() {
  const [selectedSize, setSelectedSize] = useState<ProductSize | "">("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Disable right-click on images
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleOrder = () => {
    // Scroll to order section if no size selected
    if (!selectedSize) {
      const orderSection = document.getElementById("order");
      orderSection?.scrollIntoView({ behavior: "smooth" });
      
      // Shake the size selector
      setTimeout(() => {
        const sizeButtons = document.querySelector('[data-size-button]')?.parentElement;
        sizeButtons?.classList.add("animate-shake");
        setTimeout(() => sizeButtons?.classList.remove("animate-shake"), 400);
      }, 800);
      return;
    }

    // Open WhatsApp with selected size
    const wa = (process.env.NEXT_PUBLIC_WA_NUMBER || "+971000000000").replace(/\s/g, "");
    const message = encodeURIComponent(
      `ZOLAR Borderline Drop - Size: ${selectedSize}\nPrice: AED 299`
    );
    
    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'wa_click', {
        product_id: 'borderline-tee',
        size: selectedSize,
        source: 'sticky'
      });
    }
    
    window.open(`https://wa.me/${wa}?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Loading screen */}
      {isClient && <LoadingScreen />}
      
      {/* Custom cursor */}
      {isClient && <CursorEffect />}
      
      {/* Mobile menu */}
      {isClient && <MobileMenu />}
      
      {/* Main sections */}
      <main className="relative">
        <GTAHero onPrimary={() => {
          // Scroll to order section
          const orderSection = document.getElementById("order");
          if (orderSection) {
            orderSection.scrollIntoView({ behavior: "smooth" });
          }
        }} />
        
        {/* Story Strip - 3 beats pinned timeline */}
        <StoryStrip />
        
        {/* Product Parallax Grid */}
        <ParallaxGrid />
        
        {/* Transition divider */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <StoryStripV3 />
        
        {/* Transition divider */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        
        <LookbookRailV4 />
        
        {/* Transition divider */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <BackRevealV3 />
        
        {/* Transition divider */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        
        <OrderV2 />
      </main>
      
      {/* Sticky order bar */}
      <StickyOrderBar
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onOrder={handleOrder}
      />
      
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-[90] opacity-[0.015]">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    </div>
    </>
  );
}