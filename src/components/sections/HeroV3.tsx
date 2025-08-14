"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

export default function HeroV3() {
  const root = useRef<HTMLDivElement>(null);
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const el = root.current!;
    const heroContent = el.querySelector(".hero-content") as HTMLElement;
    const heroImage = el.querySelector(".hero-image") as HTMLElement;
    const overlay = el.querySelector(".overlay") as HTMLElement;
    const particles = el.querySelectorAll(".particle");
    const glitchLayers = el.querySelectorAll(".glitch-layer");

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Initial animation on load
      const introTl = gsap.timeline({ delay: 0.5 });
      
      introTl
        .from(heroContent, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out"
        })
        .from(".logo-letter", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out"
        }, "-=0.8")
        .from(".hero-line", {
          scaleX: 0,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=0.4")
        .from(".hero-sub", {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.2");

      // Main scroll animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=150%",
          scrub: 1.5,
          pin: true,
        }
      });

      scrollTl
        .to(heroImage, {
          scale: 1.3,
          y: "20%",
          ease: "none"
        }, 0)
        .to(overlay, {
          opacity: 0.2,
          ease: "none"
        }, 0)
        .to(heroContent, {
          y: -50,
          opacity: 0,
          ease: "power2.in"
        }, 0.3)
        .to(particles, {
          y: (i) => -100 - (i * 20),
          opacity: 0,
          stagger: 0.02,
          ease: "none"
        }, 0);

      // Glitch effect on hover
      const glitchTl = gsap.timeline({ paused: true });
      glitchLayers.forEach((layer, i) => {
        glitchTl.to(layer, {
          x: () => gsap.utils.random(-5, 5),
          y: () => gsap.utils.random(-5, 5),
          opacity: 0.8,
          duration: 0.1,
          ease: "none"
        }, i * 0.02);
      });

      // Logo hover effect
      const logo = el.querySelector(".logo");
      if (logo) {
        logo.addEventListener("mouseenter", () => {
          glitchTl.play();
          setTimeout(() => glitchTl.reverse(), 100);
        });
      }

      // Floating particles
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: gsap.utils.random(-30, 30),
          x: gsap.utils.random(-20, 20),
          duration: gsap.utils.random(3, 6),
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: i * 0.2
        });
      });

      // Tagline rotation
      const taglineInterval = setInterval(() => {
        setTaglineIndex((prev) => (prev + 1) % product.copy.heroTaglines.length);
      }, 3000);

      return () => {
        clearInterval(taglineInterval);
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([heroContent, overlay, heroImage], { clearProps: "all" });
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);

  return (
    <section ref={root} className="relative h-[120vh] overflow-hidden bg-black">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Main hero image */}
        <div className="hero-image absolute inset-0 scale-110">
          <Image
            src={product.images.hero}
            alt="ZOLAR Borderline Drop"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
          />
        </div>

        {/* Glitch layers for effect */}
        <div className="glitch-layer absolute inset-0 mix-blend-screen opacity-0">
          <Image
            src={product.images.hero}
            alt=""
            fill
            className="object-cover hue-rotate-90"
            sizes="100vw"
          />
        </div>
        <div className="glitch-layer absolute inset-0 mix-blend-screen opacity-0">
          <Image
            src={product.images.hero}
            alt=""
            fill
            className="object-cover hue-rotate-180"
            sizes="100vw"
          />
        </div>

        {/* Gradient overlays */}
        <div className="overlay absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        
        {/* Animated gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/20 animate-pulse" />
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-6 max-w-7xl mx-auto">
          {/* Logo with split letters for animation */}
          <h1 className="logo text-display font-extrabold tracking-tight text-white mb-6 cursor-pointer select-none">
            {"ZOLAR".split("").map((letter, i) => (
              <span key={i} className="logo-letter inline-block">
                {letter}
              </span>
            ))}
          </h1>
          
          {/* Animated line */}
          <div className="hero-line h-1 w-[200px] mx-auto rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          
          {/* Subtitle */}
          <div className="hero-sub mt-8 space-y-2">
            <p className="text-h3 font-bold text-white/90 tracking-wide">
              BORDERLINE DROP
            </p>
            <p className="text-body text-white/70 max-w-md mx-auto h-[1.6em] flex items-center justify-center">
              <span className="inline-block animate-fade-in-out" key={taglineIndex}>
                {product.copy.heroTaglines[taglineIndex]}
              </span>
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center gap-8">
            <button
              onClick={() => {
                const orderSection = document.getElementById("order");
                orderSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative px-8 py-4 overflow-hidden rounded-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-transform group-hover:scale-110" />
              <span className="relative z-10 text-black font-semibold tracking-wide">
                SHOP NOW
              </span>
            </button>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">Scroll</span>
              <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic bars */}
      <div className="absolute top-0 left-0 right-0 h-[10vh] bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          20%, 80% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out;
        }
      `}</style>
    </section>
  );
}
