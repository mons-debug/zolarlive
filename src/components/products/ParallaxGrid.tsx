"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PRODUCT_CARDS } from "@/data/assets";

interface ProductCard {
  image: string;
  title: string;
  kicker: string;
  cta: string;
}

interface ParallaxGridProps {
  cards?: ProductCard[];
}

export default function ParallaxGrid({ 
  cards = PRODUCT_CARDS 
}: ParallaxGridProps) {
  const root = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Environment flags
  const forceMotion = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_MOTION === 'true';

  // SSR-safe mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initGSAPAnimations = useCallback(() => {
    if (!root.current) return;

    const el = root.current;
    const cardElements = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.parallax-card'));
    const badges = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.card-badge'));
    const captions = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.card-caption'));

    // Check for reduced motion unless forced
    const prefersReduced = !forceMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReduced) {
      // Static state for reduced motion
      gsap.set([badges, captions], { opacity: 1, x: 0 });
      return;
    }

    // Parallax depths for different cards (more depth = more movement)
    const parallaxDepths = isMobile ? [5, 8, 12] : [10, 15, 20];

    cardElements.forEach((card, i) => {
      const badge = badges[i];
      const caption = captions[i];
      const depth = parallaxDepths[i] || 10;

      // Scroll parallax - different yPercent for depth
      gsap.fromTo(card,
        { yPercent: depth },
        {
          yPercent: -depth,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          }
        }
      );

      // Badge & caption slide-in when card hits 40% viewport
      const slideInTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 60%", // 40% from bottom = 60% from top
          toggleActions: "play none none reverse",
        }
      });

      slideInTl
        .fromTo([badge, caption], 
          { x: -12, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
          }
        );

      // Hover tilt effect (GPU accelerated)
      if (!isMobile) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const deltaX = (e.clientX - centerX) / (rect.width / 2);
          const deltaY = (e.clientY - centerY) / (rect.height / 2);
          
          // Subtle tilt based on mouse position
          const tiltX = deltaY * -8; // Inverted for natural feel
          const tiltY = deltaX * 8;
          
          gsap.to(card, {
            rotationX: tiltX,
            rotationY: tiltY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        // Cleanup hover listeners
        return () => {
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [forceMotion]);

  useEffect(() => {
    if (!isMounted) return;

    const cleanup = initGSAPAnimations();
    
    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (cleanup) cleanup();
    };
  }, [isMounted, initGSAPAnimations]);

  if (!isMounted) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-2xl font-medium">Loading products...</div>
      </section>
    );
  }

  return (
    <section 
      ref={root} 
      className="relative py-20 md:py-32 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-4">
            PRODUCT FOCUS
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-6" />
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Every detail engineered for the modern world
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {cards.map((card, i) => (
            <div
              key={i}
              className="parallax-card relative group will-change-transform"
              style={{ 
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden"
              }}
            >
              {/* Card container */}
              <div className="relative h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10 border border-white/20">
                {/* Background image */}
                <Image
                  src={card.image}
                  alt={`${card.title} - ZOLAR product focus`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                  priority={i === 0} // Priority for first card
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Number badge */}
                <div className="card-badge absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0">
                  <span className="text-white font-bold text-lg">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="card-caption absolute bottom-0 left-0 right-0 p-6 opacity-0">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {card.kicker}
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 border border-white/30">
                    {card.cta}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0L6.59 1.41L12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z" />
                    </svg>
                  </button>
                </div>

                {/* Glassy effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card shadow (separate for better GPU performance) */}
              <div className="absolute inset-0 rounded-xl shadow-xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
