"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

const frameCaptions = [
  "Close detail — heavyweight construction",
  "Hero shot — engineered for impact", 
  "Angled perspective — dimensional fit",
  "Front facing — clean lines",
  "Graphic detail — precision printing",
  "Back print — statement piece"
];

export default function LookbookRailV2() {
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const track = trackRef.current!;
    const frames = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".frame"));
    const captions = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".caption"));

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const totalWidth = frames.length * 70; // 60vw + 10vw gap per frame

      // Main horizontal scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${frames.length * 100}%`,
          scrub: 0.5,
          pin: true,
          snap: {
            snapTo: 1 / (frames.length - 1),
            duration: { min: 0.2, max: 0.6 },
            ease: "power2.inOut"
          }
        }
      });

      tl.to(track, {
        x: `-${totalWidth - 100}vw`,
        ease: "none"
      });

      // Captions fade in/out based on position
      frames.forEach((frame, i) => {
        const caption = captions[i];
        
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: `+=${frames.length * 100}%`,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const frameProgress = progress * (frames.length - 1);
            const distance = Math.abs(frameProgress - i);
            const opacity = Math.max(0, 1 - distance * 2);
            
            gsap.set(caption, { 
              opacity: opacity * 0.7,
              y: (1 - opacity) * 10
            });
          }
        });
      });

      // Parallax depth for each frame
      frames.forEach((frame, i) => {
        const img = frame.querySelector("img");
        if (img) {
          gsap.to(img, {
            x: `${(i % 2 === 0 ? 5 : -5)}%`,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: `+=${frames.length * 100}%`,
              scrub: 1
            }
          });
        }
      });
    });

    // Mobile: Touch-enabled carousel
    mm.add("(max-width: 767px)", () => {
      // Enable touch scrolling
      track.style.overflowX = "auto";
      track.style.scrollSnapType = "x mandatory";
      // webkit-overflow-scrolling is deprecated but still useful for older iOS
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (track.style as any).webkitOverflowScrolling = "touch";
      
      frames.forEach((frame) => {
        frame.style.scrollSnapAlign = "center";
      });

      // Show captions on intersection
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const caption = entry.target.querySelector(".caption");
            if (caption) {
              gsap.to(caption, {
                opacity: entry.isIntersecting ? 0.7 : 0,
                duration: 0.3
              });
            }
          });
        },
        { threshold: 0.5, root: track }
      );

      frames.forEach((frame) => observer.observe(frame));

      return () => observer.disconnect();
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);

  return (
    <section id="lookbook" ref={root} className="relative section bg-blackish overflow-hidden">
      {/* Section title */}
      <div className="absolute top-8 left-6 z-20">
        <p className="text-small uppercase tracking-widest text-ink-70">Lookbook</p>
      </div>

      {/* Track */}
      <div 
        ref={trackRef}
        className="track flex gap-[10vw] px-[20vw] md:px-[10vw] items-center h-full md:absolute md:inset-0 md:overflow-visible overflow-x-auto md:overflow-x-visible"
      >
        {product.images.lookbook.map((src, i) => (
          <div
            key={i}
            className="frame relative shrink-0 h-[70vh] w-[80vw] md:w-[60vw] rounded-2xl overflow-hidden group"
          >
            {/* Image container with aspect ratio */}
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`Lookbook ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 80vw, 60vw"
                quality={85}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Caption */}
            <div className="caption absolute bottom-6 left-6 right-6 opacity-0">
              <p className="text-small text-ink-90 backdrop-blur-sm bg-black/20 rounded px-3 py-2">
                {frameCaptions[i]}
              </p>
            </div>

            {/* Frame number */}
            <div className="absolute top-6 right-6 text-ink-70">
              <span className="text-small font-mono">
                {String(i + 1).padStart(2, '0')}/{String(product.images.lookbook.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
