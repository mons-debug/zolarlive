"use client";
import { useEffect, useState } from "react";
import { product, ProductSize } from "@/content/product";

interface StickyOrderBarProps {
  selectedSize: ProductSize | "";
  onSelectSize: (size: ProductSize) => void;
  onOrder: () => void;
}

export default function StickyOrderBar({
  selectedSize,
  onSelectSize,
  onOrder,
}: StickyOrderBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show after scrolling past first section
      setIsVisible(scrollY > windowHeight * 0.8);
      
      // Hide when 120px from footer
      setAtBottom(scrollY + windowHeight >= documentHeight - 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible || atBottom) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="pointer-events-auto bg-zinc-900/95 backdrop-blur-md border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Product info */}
          <div className="hidden sm:block">
            <p className="font-bold text-ink">{product.name}</p>
            <p className="text-small text-ink-70">AED {product.priceAED}</p>
          </div>

          {/* Size selector */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-center sm:justify-start">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSelectSize(size)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedSize === size
                    ? "bg-white/10 text-ink border border-emerald-400/50"
                    : "bg-transparent text-ink-70 border border-white/20 hover:border-white/40"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onOrder}
            className="btn-primary text-sm px-6 py-2 whitespace-nowrap"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
