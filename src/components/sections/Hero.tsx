"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { IMAGES } from "@/content/images";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const overlay = el.querySelector(".overlay") as HTMLElement;
    const logo = el.querySelector(".logo") as HTMLElement;
    const sub = el.querySelector(".sub") as HTMLElement;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true
        }
      })
        .to(overlay, { opacity: 0, ease: "none" }, 0)
        .fromTo(logo, { y: 30, scale: 1.15 }, { y: 0, scale: 1, ease: "none" }, 0)
        .fromTo(sub, { y: 20, opacity: .4 }, { y: 0, opacity: 1, ease: "none" }, 0);
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);

  return (
    <section ref={root} className="section relative overflow-hidden bg-blackish">
      {/* Hero image container with 16:9 aspect ratio */}
      <div className="absolute inset-0 aspect-video w-full h-full">
        <Image
          src={IMAGES.hero}
          alt="Black streetwear wardrobe minimal"
          fill
          priority
          className="object-cover object-center will-change-transform"
          sizes="100vw"
        />
      </div>
      {/* dark overlay that brightens out */}
      <div className="overlay absolute inset-0 bg-black/80" />
      {/* copy */}
      <div className="relative z-10 text-center px-6">
        <h1 className="logo text-[clamp(48px,12vw,192px)] font-extrabold tracking-tight">ZOLAR</h1>
        <div className="h-1 w-[140px] mx-auto mt-4 rounded-full bg-zolar-grad" />
        <p className="sub mt-8 text-xl/relaxed opacity-90">BORDERLINE DROP</p>
        <div className="mt-12 h-8 w-px mx-auto bg-white/30" />
      </div>
    </section>
  );
}
