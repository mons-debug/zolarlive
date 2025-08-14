"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { product, ProductSize } from "@/content/product";
import SizeGuide from "@/components/SizeGuide";

// Analytics helper
const trackEvent = (eventName: string, parameters: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
  console.log('Track event:', eventName, parameters);
};

export default function OrderV2() {
  const [selectedSize, setSelectedSize] = useState<ProductSize | "">("");
  const [shake, setShake] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const wa = (process.env.NEXT_PUBLIC_WA_NUMBER || "+971000000000").replace(/\s/g, "");

  useEffect(() => {
    // Track product view
    trackEvent('view_product', {
      product_name: product.name,
      product_id: product.id,
      price: product.priceAED,
      currency: product.currency
    });
  }, []);

  const handleSizeSelect = (size: ProductSize) => {
    setSelectedSize(size);
    trackEvent('select_size', {
      product_id: product.id,
      size: size
    });
  };

  const handleOrder = (source: 'main' | 'sticky' = 'main') => {
    if (!selectedSize) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      
      // Focus first size button
      const firstSizeButton = document.querySelector('[data-size-button]') as HTMLButtonElement;
      firstSizeButton?.focus();
      return;
    }

    // Track WhatsApp click
    trackEvent('wa_click', {
      product_id: product.id,
      size: selectedSize,
      source: source
    });

    const message = encodeURIComponent(
      `ZOLAR Borderline Drop - Size: ${selectedSize}\nPrice: AED ${product.priceAED}`
    );
    window.open(`https://wa.me/${wa}?text=${message}`, "_blank");
  };

  return (
    <>
      <section id="order" className="section px-6 bg-blackish">
        <div className="w-full max-w-4xl mx-auto">
          {/* Product showcase */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            {/* Product image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900">
              <Image
                src={product.images.maleFront}
                alt={product.name}
                fill
                className="object-cover hover-lift"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 backdrop-blur-md bg-black/30 rounded-lg px-3 py-1">
                <span className="text-small text-ink-90">New Drop</span>
              </div>
            </div>

            {/* Product info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-h2 font-extrabold text-ink mb-2">
                  {product.name}
                </h2>
                <p className="text-h3 font-bold text-ink-90">
                  AED {product.priceAED}
                </p>
              </div>

              <p className="text-body text-ink-70">
                {product.copy.tagline}
              </p>

              {/* Material badges */}
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material) => (
                  <span
                    key={material}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-small text-ink-70"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Size selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-body font-semibold text-ink">
                Select Size
              </label>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-small text-ink-70 hover:text-ink underline underline-offset-2"
              >
                Size Guide
              </button>
            </div>

            <div 
              className={`flex flex-wrap gap-3 ${
                shake ? "animate-shake" : ""
              }`}
            >
              {product.sizes.map((size) => (
                <button
                  key={size}
                  data-size-button
                  onClick={() => handleSizeSelect(size)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedSize === size
                      ? "bg-white/10 text-ink border-2 border-emerald-400 shadow-lg shadow-emerald-400/20"
                      : "bg-transparent text-ink-70 border-2 border-white/20 hover:border-white/40 hover:text-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {!selectedSize && shake && (
              <p className="text-small text-red-400 animate-pulse">
                Please select a size to continue
              </p>
            )}
          </div>

          {/* Order button */}
          <button
            onClick={() => handleOrder('main')}
            className="btn-primary w-full mt-8 text-lg"
          >
            Order on WhatsApp
          </button>

          {/* Product details */}
          <div className="mt-12 pt-12 border-t border-white/10">
            <h3 className="text-h3 font-bold text-ink mb-6">Details</h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {product.copy.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-zolar-grad mt-2 shrink-0" />
                  <span className="text-body text-ink-70">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Care instructions */}
          <div className="mt-8">
            <h3 className="text-body font-semibold text-ink mb-3">Care</h3>
            <div className="flex flex-wrap gap-2">
              {product.care.map((instruction) => (
                <span
                  key={instruction}
                  className="px-3 py-1 rounded-lg bg-white/5 text-small text-ink-70"
                >
                  {instruction}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </>
  );
}
