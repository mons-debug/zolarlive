"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

const frameCaptions = [
  "Editorial night vibes",
  "Studio precision",
  "Urban aesthetic",
  "Heavyweight comfort",
  "Shadow play",
  "Borderline energy"
];

export default function LookbookRailV4() {
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const track = trackRef.current!;

    if (isMobile) {
      // Mobile: Horizontal scroll with snap
      track.style.overflowX = "auto";
      track.style.scrollSnapType = "x mandatory";
      track.style.scrollBehavior = "smooth";
      
      const handleScroll = () => {
        const scrollLeft = track.scrollLeft;
        const itemWidth = track.scrollWidth / product.images.lookbook.length;
        const newIndex = Math.round(scrollLeft / itemWidth);
        setActiveIndex(Math.min(newIndex, product.images.lookbook.length - 1));
      };
      
      track.addEventListener("scroll", handleScroll);
      
      return () => {
        track.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", checkMobile);
      };
    } else {
      // Desktop: Simple fade-in animations, no complex pinning
      const frames = track.querySelectorAll(".frame");
      
      frames.forEach((frame, i) => {
        gsap.fromTo(frame,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: frame,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );

        // Subtle hover effect
        const image = frame.querySelector("img");
        if (image) {
          frame.addEventListener("mouseenter", () => {
            gsap.to(image, { scale: 1.05, duration: 0.6, ease: "power2.out" });
          });
          frame.addEventListener("mouseleave", () => {
            gsap.to(image, { scale: 1, duration: 0.6, ease: "power2.out" });
          });
        }
      });
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      ScrollTrigger.getAll().forEach(s => s.kill());
    };
  }, [isMobile]);

  return (
    <section id="lookbook" ref={root} className="relative min-h-screen bg-black py-20">
      {/* Section title */}
      <div className="text-center mb-12 px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Lookbook</h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
      </div>

      {/* Mobile: Horizontal scroll */}
      {isMobile ? (
        <div
          ref={trackRef}
          className="flex overflow-x-auto gap-4 px-4 snap-x snap-mandatory pb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {product.images.lookbook.map((src, i) => (
            <div
              key={i}
              className="frame flex-shrink-0 w-[85vw] h-[70vh] rounded-2xl overflow-hidden snap-center"
            >
              <Image
                src={src}
                alt={`Lookbook ${i + 1}`}
                width={340}
                height={500}
                className="w-full h-full object-cover"
                quality={85}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Desktop: Grid layout */
        <div ref={trackRef} className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.images.lookbook.map((src, i) => (
              <div
                key={i}
                className="frame relative h-[60vh] rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`Lookbook ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Caption */}
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-medium">{frameCaptions[i]}</p>
                  <p className="text-white/70 text-sm mt-1">
                    {String(i + 1).padStart(2, '0')} / {String(product.images.lookbook.length).padStart(2, '0')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile indicators */}
      {isMobile && (
        <div className="flex justify-center gap-2 mt-6">
          {product.images.lookbook.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const track = trackRef.current!;
                const itemWidth = track.scrollWidth / product.images.lookbook.length;
                track.scrollTo({ left: i * itemWidth, behavior: "smooth" });
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? "bg-emerald-400 w-8" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
