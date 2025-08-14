"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

const lookbookImages = product.images.lookbook.map((src, i) => ({
  src,
  alt: `Lookbook ${i + 1}`,
  caption: [
    "Editorial night vibes",
    "Studio precision",
    "Urban aesthetic",
    "Heavyweight comfort",
    "Shadow play",
    "Borderline energy",
  ][i] || "Borderline"
}));

export default function LookbookRailV3() {
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

    const el = root.current!;
    const track = trackRef.current!;

    if (isMobile) {
      // Mobile: Touch scroll with snap
      track.style.overflowX = "auto";
      track.style.scrollSnapType = "x mandatory";
      track.style.scrollBehavior = "smooth";
      
      // Track active image on scroll
      const handleScroll = () => {
        const scrollLeft = track.scrollLeft;
        const width = track.clientWidth;
        const newIndex = Math.round(scrollLeft / (width * 0.85));
        setActiveIndex(newIndex);
      };
      
      track.addEventListener("scroll", handleScroll);
      
      return () => {
        track.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", checkMobile);
      };
    } else {
      // Desktop: GSAP horizontal scroll
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        const frames = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".frame"));
        
        // Pin and scroll horizontally
        gsap.to(track, {
          x: `-${(frames.length - 1) * 70}vw`,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${frames.length * 100}%`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const newIndex = Math.round(progress * (frames.length - 1));
              setActiveIndex(newIndex);
            }
          }
        });

        // Add parallax to images
        frames.forEach((frame, i) => {
          const img = frame.querySelector("img");
          if (img) {
            gsap.to(img, {
              x: `${(i % 2 === 0 ? -10 : 10)}%`,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: `+=${frames.length * 100}%`,
                scrub: 1
              }
            });
          }
        });
      });

      return () => {
        mm.kill();
        ScrollTrigger.getAll().forEach(s => s.kill());
        window.removeEventListener("resize", checkMobile);
      };
    }
  }, [isMobile]);

  return (
    <section id="lookbook" ref={root} className="relative min-h-[100svh] bg-black overflow-hidden">
      {/* Section title */}
      <div className="absolute top-6 left-6 z-20">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Lookbook</p>
      </div>

      {/* Desktop indicator */}
      {!isMobile && (
        <div className="hidden md:flex absolute top-6 right-6 z-20 gap-2">
          {lookbookImages.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full transition-all ${
                i === activeIndex ? "bg-emerald-400 w-12" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      )}

      {/* Image track */}
      <div
        ref={trackRef}
        className={`
          flex items-center h-[100svh]
          ${isMobile 
            ? "overflow-x-auto overflow-y-hidden gap-4 px-4 snap-x" 
            : "gap-[10vw] px-[20vw]"
          }
        `}
      >
        {lookbookImages.map((image, i) => (
          <div
            key={i}
            className={`
              frame relative shrink-0 rounded-2xl overflow-hidden
              ${isMobile 
                ? "w-[85vw] h-[70vh] snap-center" 
                : "w-[60vw] h-[80vh]"
              }
            `}
          >
            {/* Image */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes={isMobile ? "85vw" : "60vw"}
              quality={85}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Caption */}
            <div className={`
              absolute bottom-6 left-6 right-6
              ${activeIndex === i ? "opacity-100" : "opacity-0 md:opacity-100"}
              transition-opacity duration-500
            `}>
              <p className="text-white font-medium">{image.caption}</p>
              <p className="text-white/50 text-sm mt-1">
                {String(i + 1).padStart(2, '0')} / {String(lookbookImages.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile indicators */}
      {isMobile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 md:hidden">
          {lookbookImages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const track = trackRef.current!;
                const width = track.clientWidth;
                track.scrollTo({ left: i * width * 0.85, behavior: "smooth" });
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? "bg-emerald-400 w-8" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          div::-webkit-scrollbar {
            display: none;
          }
          div {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </section>
  );
}
