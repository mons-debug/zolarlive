"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

export default function BackRevealV3() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const image = el.querySelector(".back-image") as HTMLElement;
    const content = el.querySelector(".back-content") as HTMLElement;
    const bullets = el.querySelectorAll(".bullet");

    // Ensure content is visible by default
    gsap.set([image, content], { opacity: 1, visibility: "visible" });

    // Simple fade-in animations
    gsap.fromTo(image,
      { opacity: 0.3, scale: 1.05 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          toggleActions: "play none none reverse",
        }
      }
    );

    gsap.fromTo(content,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 60%",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Stagger bullets
    gsap.fromTo(bullets,
      { x: -20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 50%",
          toggleActions: "play none none reverse",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
    };
  }, []);

  return (
    <section ref={root} className="relative min-h-screen bg-black flex items-center py-20">
      {/* Background image */}
      <div className="back-image absolute inset-0">
        <Image
          src={product.images.backPrint1}
          alt="ZOLAR back print graphic detail"
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="back-content relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="text-center md:text-left">
          <h3 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Back Print
          </h3>
          <div className="h-1 w-32 mx-auto md:mx-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-8" />
          
          {/* Bullet points */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {product.copy.backPrintBullets.map((bullet, i) => (
              <div
                key={i}
                className="bullet backdrop-blur-sm bg-white/10 rounded-lg px-6 py-3 border border-white/20"
              >
                <p className="text-white font-medium flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
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
