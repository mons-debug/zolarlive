"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { IMAGES } from "@/content/images";

export default function BackReveal() {
  const root = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = root.current!;
    const overlay = el.querySelector(".ov") as HTMLElement;
    const specs = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".spec"));
    
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(overlay, {
        opacity: 0,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "top center",
          scrub: 1
        }
      });
      
      gsap.fromTo(specs, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top center",
            end: "center center",
            scrub: 1
          }
        }
      );
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);
  
  return (
    <section ref={root} className="section relative">
      {/* 2:3 portrait aspect ratio container for back print */}
      <div className="absolute inset-0 aspect-[2/3] w-full h-full">
        <Image 
          src={IMAGES.backPrint}
          alt="Graphic t-shirt back streetwear detail" 
          fill 
          className="object-cover object-center" 
          sizes="100vw"
        />
      </div>
      <div className="ov absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <h3 className="text-3xl md:text-5xl font-extrabold mb-8">Back Print</h3>
        <ul className="grid md:grid-cols-3 gap-6 text-white/85">
          <li className="spec">• Silk-screened graphic</li>
          <li className="spec">• High wash-fastness</li>
          <li className="spec">• Crack-resistant ink</li>
        </ul>
      </div>
    </section>
  );
}
