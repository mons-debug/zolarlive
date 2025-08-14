"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { IMAGES } from "@/content/images";

const frameAlts = [
  "Streetwear editorial night look",
  "Fashion studio black model",
  "Urban neon street model",
  "Hoodie streetwear night style",
  "T-shirt street shadow look",
  "Denim streetwear editorial",
];

export default function LookbookRail() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const track = el.querySelector(".track") as HTMLElement;
    const total = IMAGES.lookbook.length;
    const vw = 100 * total; // width in vw

    track.style.width = `${vw}vw`;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(track, {
        xPercent: -(100 * (total - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${total * 80}%`,
          scrub: 1,
          pin: true
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);

  return (
    <section ref={root} className="relative section overflow-hidden">
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      <div className="track absolute inset-0 flex gap-[6vw] px-[6vw]">
        {IMAGES.lookbook.map((src, i) => (
          <div key={i} className="relative shrink-0 h-[80vh] w-[60vw] rounded-2xl overflow-hidden">
            {/* 3:4 aspect ratio container for portrait editorial look */}
            <div className="aspect-[3/4] h-full w-full">
              <Image 
                src={src} 
                alt={frameAlts[i]} 
                fill 
                className="object-cover" 
                sizes="60vw" 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
