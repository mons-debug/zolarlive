"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LOOKBOOK_FRAMES } from "@/data/assets";

interface LookbookFrame {
  image: string;
  label: string;
}

interface StickyLookbookProps {
  frames?: LookbookFrame[];
}

export default function StickyLookbook({ 
  frames = LOOKBOOK_FRAMES 
}: StickyLookbookProps) {
  const root = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  // Environment flags
  const debugScroll = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_SCROLL === 'true';
  const forceMotion = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_MOTION === 'true';

  // SSR-safe mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initGSAPAnimations = useCallback(() => {
    if (!root.current || !containerRef.current) return;

    const el = root.current;
    const container = containerRef.current;
    const isMobile = window.innerWidth < 768;
    
    // Mobile: reduce to 4 frames, smaller stick duration
    const displayFrames = isMobile ? frames.slice(0, 4) : frames;
    const totalFrames = displayFrames.length;
    const stickDuration = isMobile ? "+=80%" : "+=100%"; // Smaller duration on mobile

    // Check for reduced motion unless forced
    const prefersReduced = !forceMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Static state for reduced motion
      gsap.set(container, { x: 0 });
      return;
    }

    // Set container width for horizontal scroll
    const containerWidth = totalFrames * 100; // 100vw per frame
    gsap.set(container, { width: `${containerWidth}vw` });

    // Main horizontal scrub animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: stickDuration, // Stick for one viewport (or 80% on mobile)
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        markers: debugScroll,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update active frame based on progress
          const progress = self.progress;
          const currentFrame = Math.min(
            Math.floor(progress * totalFrames),
            totalFrames - 1
          );
          setActiveFrame(currentFrame);
        }
      }
    });

    // Horizontal scroll animation
    tl.to(container, {
      x: `-${(totalFrames - 1) * 100}vw`, // Move left by (frames-1) * 100vw
      ease: "none"
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [frames, debugScroll, forceMotion]);

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
        <div className="text-white text-2xl font-medium">Loading lookbook...</div>
      </section>
    );
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const displayFrames = isMobile ? frames.slice(0, 4) : frames;

  return (
    <section 
      ref={root} 
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Horizontal container */}
      <div 
        ref={containerRef}
        className="flex h-screen will-change-transform"
        style={{ width: `${displayFrames.length * 100}vw` }}
      >
        {displayFrames.map((frame, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-screen h-full"
          >
            {/* Background image */}
            <Image
              src={frame.image}
              alt={`${frame.label} - ZOLAR lookbook frame ${i + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
              quality={85}
              priority={i < 2} // Priority for first 2 frames
            />
            
            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Frame label */}
            <div className="absolute top-8 left-8 z-10">
              <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 border border-white/20">
                <span className="text-white text-sm font-mono">
                  {String(i + 1).padStart(2, '0')}/{String(displayFrames.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Frame description */}
            <div className="absolute bottom-32 left-8 right-8 z-10">
              <div className="backdrop-blur-md bg-black/20 rounded-xl p-6 border border-white/20 max-w-md">
                <h3 className="text-white text-xl font-bold mb-2">
                  Frame {String(i + 1).padStart(2, '0')}
                </h3>
                <p className="text-white/80 text-sm">
                  {frame.label}
                </p>
              </div>
            </div>

            {/* Vignette effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Progress dots - centered under */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-3">
          {displayFrames.map((_, i) => (
            <button
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === activeFrame
                  ? "w-4 h-4 bg-white scale-150" // Active dot scales 1.6 (close to 1.5 for better visual)
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
              }`}
              onClick={() => {
                // Optional: Allow manual navigation
                const progress = i / (displayFrames.length - 1);
                const scrollPosition = window.scrollY + (window.innerHeight * progress);
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
        
        {/* Current frame indicator */}
        <div className="text-center mt-4">
          <span className="text-white/60 text-xs font-mono tracking-wider">
            LOOKBOOK {String(activeFrame + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Scroll hint (only on first frame) */}
      {activeFrame === 0 && (
        <div className="absolute bottom-24 right-8 z-20 animate-bounce">
          <div className="flex items-center gap-2 text-white/60">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L6.59 1.41L12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z" />
            </svg>
          </div>
        </div>
      )}

      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23grain)' opacity='.4'/></svg>")`,
        }}
      />
    </section>
  );
}
