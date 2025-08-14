"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { IMAGES } from "@/content/images";

const slides = [
  {
    title: "CUT & WEIGHT",
    copy: "Precision engineered with 240 GSM heavyweight cotton.",
    img: IMAGES.feature.front,
    alt: "Black t-shirt close-up texture detail"
  },
  {
    title: "DETAILS THAT LAST",
    copy: "Reinforced seams. Built for the grind.",
    img: IMAGES.feature.stitch,
    alt: "Garment seam stitch detail"
  },
  {
    title: "BORDERLINE ENERGY",
    copy: "Streetwear meets technical precision.",
    img: IMAGES.feature.ink,
    alt: "Screen print ink detail"
  },
];

export default function FeatureStack() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const imgs = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".swap"));
    const heads = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".head"));

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true
        }
      });

      imgs.forEach((node, i) => {
        tl.to(imgs, { opacity: (j) => j === i ? 1 : 0.05, scale: (j) => j === i ? 1 : 0.95, duration: 0.5 }, i);
        tl.to(heads, { opacity: (j) => j === i ? 1 : 0.2, y: (j) => j === i ? 0 : 10, duration: 0.5 }, i);
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);

  return (
    <section ref={root} className="section relative px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center w-full max-w-6xl mx-auto">
        <div className="space-y-12">
          {slides.map((s, i) => (
            <div key={i} className="head opacity-20 translate-y-2">
              <h2 className="text-4xl md:text-6xl font-extrabold">{s.title}</h2>
              <div className="h-1 w-32 mt-4 rounded-full bg-zolar-grad" />
              <p className="mt-4 text-lg text-white/80 max-w-[48ch]">{s.copy}</p>
            </div>
          ))}
        </div>
        <div className="relative h-[70vh] w-full">
          {slides.map((s, i) => (
            <div key={i} className={`swap absolute inset-0 rounded-2xl overflow-hidden ${i === 0 ? "opacity-100" : "opacity-5"} will-change-transform`}>
              {/* 4:3 landscape aspect ratio container */}
              <div className="aspect-[4/3] h-full w-full">
                <Image 
                  src={s.img} 
                  alt={s.alt} 
                  fill 
                  className="object-cover" 
                  sizes="50vw" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
