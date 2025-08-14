"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

export default function BackRevealV2() {
  const root = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const imageContainer = imageRef.current!;
    const mask = maskRef.current!;
    const bullets = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".bullet"));
    const title = el.querySelector(".reveal-title") as HTMLElement;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Set initial clip-path
      gsap.set(mask, {
        clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)"
      });

      // Main reveal timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 50%",
          end: "center center",
          scrub: 0.5
        }
      });

      // Diagonal reveal animation
      tl.to(mask, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.2,
        ease: "power2.out"
      })
      .fromTo(imageContainer,
        { scale: 1.1, filter: "brightness(0.6)" },
        { scale: 1, filter: "brightness(1)", duration: 1.2, ease: "power2.out" },
        0
      )
      .fromTo(title,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        0.3
      );

      // Stagger bullets
      bullets.forEach((bullet, i) => {
        tl.fromTo(bullet,
          { x: -30, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.6,
            ease: "power2.out"
          },
          0.4 + (i * 0.1)
        );
      });

      // Parallax effect
      gsap.to(imageContainer, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([mask, imageContainer, title, bullets], { clearProps: "all" });
      gsap.set(mask, { clipPath: "none" });
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);

  return (
    <section ref={root} className="section relative bg-blackish overflow-hidden">
      {/* Background with vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40 pointer-events-none z-20" />
      
      {/* Image container with mask */}
      <div ref={maskRef} className="absolute inset-0 w-full h-full">
        <div ref={imageRef} className="relative w-full h-full">
          <Image
            src={product.images.backPrint2}
            alt="ZOLAR back print graphic detail"
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={90}
          />
          {/* Film grain overlay */}
          <div className="absolute inset-0 mix-blend-overlay opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-30 flex items-end h-full">
        <div className="w-full max-w-6xl mx-auto px-6 pb-20">
          <h3 className="reveal-title text-h2 font-extrabold text-ink mb-8">
            Back Print
          </h3>
          
          {/* Bullet points with backdrop blur */}
          <div className="flex flex-wrap gap-6">
            {product.copy.backPrintBullets.map((bullet, i) => (
              <div
                key={i}
                className="bullet backdrop-blur-md bg-black/30 rounded-lg px-4 py-2 border border-white/10"
              >
                <p className="text-small text-ink-90 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-zolar-grad" />
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
