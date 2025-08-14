"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

export default function HeroV2() {
  const root = useRef<HTMLDivElement>(null);
  const taglineIndex = useRef(0);

  useEffect(() => {
    const el = root.current!;
    const overlay = el.querySelector(".overlay") as HTMLElement;
    const logo = el.querySelector(".logo") as HTMLElement;
    const sub = el.querySelector(".sub") as HTMLElement;
    const tagline = el.querySelector(".tagline") as HTMLElement;
    const line = el.querySelector(".line") as HTMLElement;
    const scroll = el.querySelector(".scroll-indicator") as HTMLElement;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
        }
      });

      tl.to(overlay, { 
        opacity: 0, 
        ease: "none" 
      }, 0)
      .fromTo(logo, 
        { y: 30, scale: 1.15 }, 
        { y: 0, scale: 1, ease: "power2.out" }, 
        0
      )
      .fromTo(sub, 
        { y: 20, opacity: 0.4 }, 
        { y: 0, opacity: 1, ease: "power2.out" }, 
        0.1
      )
      .fromTo(line,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, ease: "power2.out" },
        0.2
      )
      .to(scroll,
        { opacity: 0, y: -20, ease: "power2.out" },
        0
      );

      // Rotate taglines every 3 seconds
      const taglineTimer = setInterval(() => {
        gsap.to(tagline, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          onComplete: () => {
            taglineIndex.current = (taglineIndex.current + 1) % product.copy.heroTaglines.length;
            tagline.textContent = product.copy.heroTaglines[taglineIndex.current];
            gsap.fromTo(tagline,
              { opacity: 0, y: 10 },
              { opacity: 0.9, y: 0, duration: 0.3 }
            );
          }
        });
      }, 3000);

      return () => clearInterval(taglineTimer);
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([overlay, logo, sub, line], { clearProps: "all" });
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);

  return (
    <section ref={root} className="section relative overflow-hidden bg-blackish">
      {/* Hero image with parallax */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={product.images.hero}
          alt="ZOLAR Borderline Drop hero"
          fill
          priority
          className="object-cover object-center will-change-transform"
          sizes="100vw"
          quality={90}
        />
      </div>
      
      {/* Dark overlay with gradient */}
      <div className="overlay absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <h1 className="logo text-display font-extrabold tracking-tight text-ink mb-4">
          ZOLAR
        </h1>
        <div className="line h-1 w-[140px] mx-auto rounded-full bg-zolar-grad origin-center" />
        <p className="sub mt-8 text-h3 font-bold text-ink-90">
          BORDERLINE DROP
        </p>
        <p className="tagline mt-4 text-body text-ink-70 max-w-md mx-auto">
          {product.copy.heroTaglines[0]}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-70">
        <div className="flex flex-col items-center gap-2">
          <span className="text-small uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
