"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

export default function HeroV4() {
  const root = useRef<HTMLDivElement>(null);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageLoaded) return;
    
    const el = root.current!;
    const heroContent = el.querySelector(".hero-content") as HTMLElement;
    const heroImage = el.querySelector(".hero-image") as HTMLElement;
    const overlay = el.querySelector(".overlay") as HTMLElement;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Set initial states
      gsap.set(heroContent, { opacity: 0, y: 50 });
      
      // Intro animation
      const introTl = gsap.timeline({ delay: 0.3 });
      
      introTl
        .to(heroContent, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        })
        .from(".logo-letter", {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out"
        }, "-=0.5")
        .from(".hero-line", {
          scaleX: 0,
          duration: 0.6,
          ease: "power2.inOut"
        }, "-=0.3")
        .from(".hero-sub", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.2");

      // Simpler scroll animation to prevent black screen
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Parallax effect
          gsap.set(heroImage, {
            y: progress * 100,
            scale: 1 + (progress * 0.1)
          });
          
          // Fade overlay
          gsap.set(overlay, {
            opacity: 0.7 + (progress * 0.3)
          });
          
          // Move content
          gsap.set(heroContent, {
            y: progress * -50,
            opacity: 1 - (progress * 0.5)
          });
        }
      });

      // Tagline rotation
      const taglineInterval = setInterval(() => {
        setTaglineIndex((prev) => (prev + 1) % product.copy.heroTaglines.length);
      }, 3000);

      return () => {
        clearInterval(taglineInterval);
      };
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, [imageLoaded]);

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-black">
      {/* Background image */}
      <div className="hero-image absolute inset-0 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=90"
          alt="ZOLAR Borderline Drop"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Gradient overlay */}
      <div className="overlay absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 pointer-events-none" />
      
      {/* Content */}
      <div className="hero-content relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-6 max-w-6xl mx-auto">
          {/* Animated logo */}
          <h1 className="text-display font-extrabold tracking-tight text-white mb-6">
            {"ZOLAR".split("").map((letter, i) => (
              <span key={i} className="logo-letter inline-block">
                {letter}
              </span>
            ))}
          </h1>
          
          {/* Gradient line */}
          <div className="hero-line h-1 w-[180px] mx-auto rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          
          {/* Subtitle */}
          <div className="hero-sub mt-6 space-y-3">
            <p className="text-h3 font-bold text-white/90">
              BORDERLINE DROP
            </p>
            <p className="text-body text-white/70 max-w-md mx-auto min-h-[1.6em]">
              <span className="inline-block animate-fade" key={taglineIndex}>
                {product.copy.heroTaglines[taglineIndex]}
              </span>
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <button
              onClick={() => {
                document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative px-10 py-4 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-emerald-400/50 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 text-white font-semibold tracking-wide uppercase text-sm">
                Shop Now
              </span>
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade {
          0%, 100% { opacity: 0; }
          20%, 80% { opacity: 1; }
        }
        .animate-fade {
          animation: fade 3s ease-in-out;
        }
      `}</style>
    </section>
  );
}
