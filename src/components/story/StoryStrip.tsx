"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion, createMediaContext, cleanupScrollTriggers } from "@/lib/gsap";
import { STORY_BEATS } from "@/data/assets";

interface StoryBeat {
  title: string;
  sub: string;
  mediaSrc: string;
  effect: "parallax" | "pan" | "zoom";
}

interface StoryStripProps {
  items?: StoryBeat[];
}

export default function StoryStrip({ 
  items = STORY_BEATS 
}: StoryStripProps) {
  const root = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  


  // SSR-safe mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initGSAPAnimations = useCallback(() => {
    if (!root.current) return;

    const el = root.current;
    const beats = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.story-beat'));
    const captions = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.story-caption'));
    const images = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.story-image'));
    const mm = createMediaContext();

    // Check for reduced motion
    const isReducedMotion = prefersReducedMotion();

    if (isReducedMotion) {
      // Simple sequential fades for reduced motion
      captions.forEach((caption, i) => {
        gsap.fromTo(caption,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.3,
            scrollTrigger: {
              trigger: caption,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
      return () => cleanupScrollTriggers(mm);
    }

    // Main timeline with pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "+=220%", // 220% duration as requested
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      }
    });

    // Beat timings (each beat gets ~73% of timeline)
    const beatDuration = 0.73;
    const beatOverlap = 0.1; // Small overlap between beats

    items.forEach((item, i) => {
      const beat = beats[i];
      const caption = captions[i];
      const image = images[i];
      const startTime = i * (beatDuration - beatOverlap);
      const endTime = startTime + beatDuration;

      if (!beat || !caption || !image) return;

      // Caption animations - fade in and out
      tl.fromTo(caption, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.2,
          ease: "power2.out"
        }, 
        startTime
      )
      .to(caption,
        {
          opacity: 0,
          y: -20,
          duration: 0.15,
          ease: "power2.in"
        },
        endTime - 0.15
      );

      // Beat-specific image effects
      switch (item.effect) {
        case "parallax":
          // Y + slight scale 1.05 for tee macro
          tl.fromTo(image,
            { y: 50, scale: 1 },
            {
              y: -30,
              scale: 1.05,
              duration: beatDuration,
              ease: "none"
            },
            startTime
          );
          break;

        case "pan":
          // Pan-left for craftsman/label close-up
          tl.fromTo(image,
            { x: 0 },
            {
              x: -100,
              duration: beatDuration,
              ease: "none"
            },
            startTime
          );
          break;

        case "zoom":
          // Zoom-in 1.0→1.12 + vertical parallax for lifestyle wide
          tl.fromTo(image,
            { scale: 1, y: 20 },
            {
              scale: 1.12,
              y: -40,
              duration: beatDuration,
              ease: "none"
            },
            startTime
          );
          break;
      }

      // Beat visibility
      if (i > 0) {
        tl.set(beat, { zIndex: 10 + i }, startTime);
      }
    });

    return () => cleanupScrollTriggers(mm);
  }, [items]);

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
        <div className="text-white text-2xl font-medium">Loading story...</div>
      </section>
    );
  }

  return (
    <section 
      ref={root} 
      className="relative min-h-screen bg-black overflow-hidden"
      style={{ minHeight: "220vh" }} // Explicit height for 220% pin duration
    >
      {/* Edge fades - top/bottom black gradients */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

      {/* Soft grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23grain)' opacity='.3'/></svg>")`,
        }}
      />

      {/* Story beats */}
      {items.map((item, i) => (
        <div
          key={i}
          className={`story-beat absolute inset-0 ${i === 0 ? 'z-10' : 'z-0'}`}
        >
          {/* Background image */}
          <div className="story-image absolute inset-0 will-change-transform">
            <Image
              src={item.mediaSrc}
              alt={`${item.title} - ZOLAR story beat`}
              fill
              className="object-cover"
              sizes="100vw"
              quality={85}
              priority={i === 0}
            />
            
            {/* Image overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Caption */}
          <div className="story-caption absolute inset-0 flex items-center z-20">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Text content - left side */}
                <div className="text-white">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-6">
                    {item.title}
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-6" />
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-lg">
                    {item.sub}
                  </p>
                  
                  {/* Beat indicator */}
                  <div className="flex items-center gap-2 mt-8">
                    {items.map((_, beatIndex) => (
                      <div
                        key={beatIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          beatIndex === i 
                            ? "bg-emerald-400 w-8" 
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                    <span className="ml-4 text-sm text-white/60 font-mono">
                      {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Right side - spacer for image focus */}
                <div className="hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
