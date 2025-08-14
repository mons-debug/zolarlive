"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion, createMediaContext, cleanupScrollTriggers } from "@/lib/gsap";
import { HERO_MEDIA } from "@/data/assets";

interface GTAHeroProps {
  mediaSrc?: string;
  poster?: string;
  title?: string;
  sub?: string;
  ctaPrimary?: string;
  onPrimary?: () => void;
}

export default function GTAHero({
  mediaSrc = HERO_MEDIA.video,
  poster = HERO_MEDIA.poster,
  title = "ZOLAR",
  sub = "BORDERLINE DROP",
  ctaPrimary = "SHOP NOW",
  onPrimary
}: GTAHeroProps) {
  const root = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVideo] = useState(mediaSrc.includes('.mp4') || mediaSrc.includes('.webm'));



  // SSR-safe mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initGSAPAnimations = useCallback(() => {
    if (!root.current || !logoRef.current || !maskRef.current) return;

    const el = root.current;
    const logo = logoRef.current;
    const mask = maskRef.current;
    const mm = createMediaContext();

    // Check for reduced motion
    const isReducedMotion = prefersReducedMotion();
    const isMobile = window.innerWidth < 768;

    if (isReducedMotion) {
      // Simple fade for reduced motion
      gsap.fromTo(el, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, ease: "power2.out" }
      );
      gsap.set(logo, { scale: 1, letterSpacing: "0em", y: 0 });
      gsap.set(mask, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
      return () => cleanupScrollTriggers(mm);
    }

    // Initial setup
    gsap.set(logo, { 
      scale: isMobile ? 2.1 : 2.6, 
      letterSpacing: isMobile ? "-0.08em" : "-0.12em", 
      y: 20 
    });
    gsap.set(mask, { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" });

    // Main timeline with scoped context
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%", // 200% duration as requested
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        }
      });

    // Logo animations
    tl.to(logo, {
      scale: 1,
      letterSpacing: "0em",
      y: 0,
      ease: "power2.out",
      duration: 1,
    }, 0)

    // Media mask reveal - first 40% of timeline
    .to(mask, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power2.inOut", 
      duration: 0.4, // 40% of timeline
    }, 0)
    
    // Full reveal for remaining 60%
    .to(mask, {
      clipPath: "polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)",
      ease: "power2.out",
      duration: 0.6,
    }, 0.4);

    // Glitch effect (desktop only, once at start)
    if (!isMobile) {
      const glitchTl = gsap.timeline({ repeat: 0, delay: 0.2 });
      
      // Micro-jitter sequence
      glitchTl
        .to(logo, { x: 2, duration: 0.05, ease: "none" })
        .to(logo, { x: -3, duration: 0.05, ease: "none" })
        .to(logo, { x: 1, duration: 0.05, ease: "none" })
        .to(logo, { x: 0, duration: 0.05, ease: "none" })
        .to(logo, { opacity: 0.8, duration: 0.03, ease: "none" }, 0)
        .to(logo, { opacity: 1, duration: 0.03, ease: "none" }, 0.1);
    }

      // Glitch effect (desktop only, once at start)
      if (!isMobile) {
        const glitchTl = gsap.timeline({ repeat: 0, delay: 0.2 });
        
        // Micro-jitter sequence
        glitchTl
          .to(logo, { x: 2, duration: 0.05, ease: "none" })
          .to(logo, { x: -3, duration: 0.05, ease: "none" })
          .to(logo, { x: 1, duration: 0.05, ease: "none" })
          .to(logo, { x: 0, duration: 0.05, ease: "none" })
          .to(logo, { opacity: 0.8, duration: 0.03, ease: "none" }, 0)
          .to(logo, { opacity: 1, duration: 0.03, ease: "none" }, 0.1);
      }
    });

    // Mobile fallback
    mm.add("(max-width: 767px)", () => {
      gsap.to(logo, {
        scale: 1,
        letterSpacing: "0em",
        y: 0,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.5
        }
      });
    });

    return () => cleanupScrollTriggers(mm);
  }, []);

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
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-4xl font-bold">Loading...</div>
      </section>
    );
  }

  return (
    <section 
      ref={root} 
      className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center"
      style={{ minHeight: "100vh" }} // Explicit height for pinning
    >
      {/* Background Media with Mask */}
      <div 
        ref={maskRef}
        className="absolute inset-0 will-change-transform"
        style={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={poster}
            muted
            loop
            playsInline
            autoPlay
            onLoadedData={() => {
              // Ensure video starts playing
              const video = videoRef.current;
              video?.play().catch(() => {
                // Fallback to poster if autoplay fails
                console.log('Video autoplay failed, using poster');
              });
            }}
          >
            <source src={mediaSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={mediaSrc}
            alt="ZOLAR Hero Background"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Film Grain */}
      <div 
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noise)' opacity='.4'/></svg>")`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* ZOLAR Logo */}
        <div 
          ref={logoRef}
          className="will-change-transform"
          style={{ 
            fontSize: 'clamp(3rem, 15vw, 12rem)',
            letterSpacing: '-0.12em'
          }}
        >
          <h1 className="font-black text-white leading-none tracking-tighter select-none">
            {title}
          </h1>
        </div>

        {/* Underline */}
        <div className="h-1 w-32 mx-auto mt-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

        {/* Subtitle */}
        <p className="mt-8 text-xl md:text-2xl text-white/90 font-medium tracking-wide">
          {sub}
        </p>

        {/* CTA Button */}
        <button
          onClick={onPrimary}
          className="mt-12 px-8 py-4 md:px-12 md:py-5 bg-white text-black font-bold text-lg rounded-full 
                   hover:bg-white/90 transition-all duration-300 transform hover:scale-105 
                   focus:outline-none focus:ring-4 focus:ring-white/30
                   md:min-w-[200px] min-w-[160px] min-h-[60px] md:min-h-[70px]" // Bigger hit area on mobile
        >
          {ctaPrimary}
        </button>

        {/* Scroll Cue */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-white/40" />
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
              <path d="M6 8L0 2h12L6 8z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
