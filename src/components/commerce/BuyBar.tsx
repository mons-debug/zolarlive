"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const sizes = ["S", "M", "L", "XL"] as const;
type Size = typeof sizes[number];

export default function BuyBar() {
  const root = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState<Size | "">("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Environment flags
  const forceMotion = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_MOTION === 'true';

  // SSR-safe mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initScrollAnimations = useCallback(() => {
    if (!root.current) return;

    const el = root.current;

    // Check for reduced motion unless forced
    const prefersReduced = !forceMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Static visible state for reduced motion
      gsap.set(el, { y: 0, opacity: 1 });
      return;
    }

    // Initial hidden state
    gsap.set(el, { y: 40, opacity: 0 });

    // Show animation when story finishes (approximate scroll position)
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "body", // Use body as trigger
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          
          // Calculate approximate positions
          const heroHeight = windowHeight; // GTAHero is ~1 viewport
          const storyHeight = windowHeight * 2.2; // StoryStrip is 220%
          
          // Show when story is finishing (around 80% through story)
          const showThreshold = heroHeight + (storyHeight * 0.8);
          
          // Hide while hero is pinned (first viewport)
          const hideInHero = scrollY < heroHeight * 0.9;
          
          if (scrollY > showThreshold && !hideInHero) {
            gsap.to(el, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
          } else if (hideInHero || scrollY < showThreshold * 0.8) {
            gsap.to(el, { y: 40, opacity: 0, duration: 0.4, ease: "power2.in" });
          }
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [forceMotion]);

  useEffect(() => {
    if (!isMounted) return;

    const cleanup = initScrollAnimations();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [isMounted, initScrollAnimations]);

  const handleOrder = () => {
    if (!selectedSize) {
      // Shake effect for no size selected
      const sizeContainer = root.current?.querySelector('.size-selector');
      if (sizeContainer) {
        gsap.timeline()
          .to(sizeContainer, { x: -4, duration: 0.08 })
          .to(sizeContainer, { x: 4, duration: 0.08 })
          .to(sizeContainer, { x: -4, duration: 0.08 })
          .to(sizeContainer, { x: 4, duration: 0.08 })
          .to(sizeContainer, { x: 0, duration: 0.08 });
      }
      return;
    }

    // Open WhatsApp with product + size
    const wa = (process.env.NEXT_PUBLIC_WA_NUMBER || "+971000000000").replace(/\s/g, "");
    const message = encodeURIComponent(
      `ZOLAR Borderline Tee - Size: ${selectedSize}\nPrice: AED 299\n\nI'd like to order this item.`
    );
    
    // Track event if analytics available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'buybar_order', {
        product_id: 'borderline-tee',
        size: selectedSize,
        price: 299,
        currency: 'AED'
      });
    }
    
    window.open(`https://wa.me/${wa}?text=${message}`, "_blank");
  };

  if (!isMounted) {
    return null; // Don't render on server
  }

  return (
    <>
      {/* Floating Buy Bar */}
      <div 
        ref={root}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 will-change-transform"
        style={{ opacity: 0, transform: "translateX(-50%) translateY(40px)" }}
      >
        <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl shadow-2xl p-4 max-w-sm w-full mx-4">
          <div className="flex items-center gap-4">
            {/* Product pill image */}
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
              <Image
                src="/stock/thumb.jpg"
                alt="Borderline Tee"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                quality={90}
              />
            </div>

            {/* Product info */}
            <div className="flex-grow min-w-0">
              <h3 className="text-white font-bold text-sm truncate">
                Borderline Tee
              </h3>
              <p className="text-emerald-400 font-semibold text-lg">
                AED 299
              </p>
            </div>
          </div>

          {/* Size selector */}
          <div className="size-selector mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 text-sm font-medium">Size</span>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-emerald-400 text-sm hover:underline"
              >
                Size Guide
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "bg-emerald-500 text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Order button */}
            <button
              onClick={handleOrder}
              className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Order on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black">Size Guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                All measurements are in inches. Please allow for slight variance.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-black">Size</th>
                      <th className="text-left py-2 font-semibold text-black">Chest</th>
                      <th className="text-left py-2 font-semibold text-black">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium text-black">S</td>
                      <td className="py-2 text-gray-700">20&quot;</td>
                      <td className="py-2 text-gray-700">27&quot;</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium text-black">M</td>
                      <td className="py-2 text-gray-700">21&quot;</td>
                      <td className="py-2 text-gray-700">28&quot;</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium text-black">L</td>
                      <td className="py-2 text-gray-700">22&quot;</td>
                      <td className="py-2 text-gray-700">29&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-black">XL</td>
                      <td className="py-2 text-gray-700">23&quot;</td>
                      <td className="py-2 text-gray-700">30&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-500 text-xs mt-4">
                Model is 6&apos;0&quot; (183cm) wearing size M.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
