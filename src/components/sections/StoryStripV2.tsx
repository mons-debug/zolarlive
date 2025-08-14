"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const chapters = [
  {
    title: "CUT & WEIGHT",
    description: "Precision engineered with 240 GSM heavyweight cotton. Built for those who demand more.",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1600&h=1200&fit=crop&q=85",
    alt: "Fabric texture detail"
  },
  {
    title: "DETAILS THAT LAST",
    description: "Reinforced seams. Double-stitch construction. Built for the grind.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=1200&fit=crop&q=85",
    alt: "Seam stitch detail"
  },
  {
    title: "BORDERLINE ENERGY",
    description: "Where streetwear meets technical precision. No compromise.",
    image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=1600&h=1200&fit=crop&q=85",
    alt: "Print detail"
  }
];

export default function StoryStripV2() {
  const root = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const progress = progressRef.current!;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile: Fade-in + light parallax (no pin)
      const mobChapters = el.querySelectorAll(".chapter");
      mobChapters.forEach((chapter) => {
        const image = chapter.querySelector(".chapter-image") as HTMLElement;

        // Text fade
        gsap.fromTo(chapter,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
              invalidateOnRefresh: true,
            }
          }
        );

        // Subtle parallax on image
        if (image) {
          gsap.fromTo(image,
            { y: 20 },
            {
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              }
            }
          );
        }
      });
    } else {
      // Desktop: Pinned scroll with progress
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        const chapters = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".chapter"));
        
        // Create timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=200%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              gsap.set(progress, { scaleY: self.progress });
            }
          }
        });

        // Animate chapters
        chapters.forEach((chapter, i) => {
          const image = chapter.querySelector(".chapter-image") as HTMLElement;
          const text = chapter.querySelector(".chapter-text") as HTMLElement;
          
          if (i === 0) {
            // First chapter starts visible
            tl.set(chapter, { opacity: 1, visibility: "visible" });
          } else {
            // Other chapters fade in
            tl.fromTo(chapter,
              { opacity: 0, visibility: "hidden" },
              { 
                opacity: 1, 
                visibility: "visible",
                duration: 0.5
              },
              i * 0.8
            );
          }
          
          // Animate image
          tl.fromTo(image,
            { scale: 1.1, filter: "brightness(0.6)" },
            { 
              scale: 1,
              filter: "brightness(1)",
              duration: 1,
              ease: "power2.out"
            },
            i * 0.8
          );
          
          // Animate text
          tl.fromTo(text,
            { y: 30, opacity: 0 },
            { 
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out"
            },
            i * 0.8 + 0.2
          );
          
          // Fade out (except last)
          if (i < chapters.length - 1) {
            tl.to(chapter,
              { 
                opacity: 0,
                duration: 0.5
              },
              (i + 1) * 0.8 - 0.3
            );
          }
        });
      });

      return () => {
        mm.kill();
      };
    }

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
    };
  }, []);

  return (
    <section id="story" ref={root} className="relative min-h-[100svh] bg-black">
      {/* Progress bar (desktop only) */}
      <div className="hidden md:block fixed right-0 top-0 w-1 h-full z-30 bg-white/10">
        <div 
          ref={progressRef}
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-400 to-emerald-600 origin-top"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      {/* Mobile: Stack chapters */}
      <div className="md:hidden">
        {chapters.map((chapter, i) => (
          <div key={i} className="chapter min-h-[100svh] flex items-center py-16">
            <div className="container mx-auto px-6">
              <div className="space-y-8">
                {/* Text */}
                <div className="chapter-text">
                  <h2 className="text-h2 font-extrabold text-white mb-4">
                    {chapter.title}
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-6" />
                  <p className="text-body text-white/80 max-w-lg">
                    {chapter.description}
                  </p>
                </div>

                {/* Image */}
                <div className="chapter-image relative h-[70vh] rounded-2xl overflow-hidden will-change-transform">
                  <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    quality={85}
                    priority={i===0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Layered chapters */}
      <div className="hidden md:block">
        {chapters.map((chapter, i) => (
          <div
            key={i}
            className="chapter absolute inset-0 w-full h-full flex items-center"
            style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
          >
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Text */}
                <div className="chapter-text">
                  <h2 className="text-h2 font-extrabold text-white mb-6">
                    {chapter.title}
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-6" />
                  <p className="text-body text-white/80 max-w-lg">
                    {chapter.description}
                  </p>
                </div>

                {/* Image */}
                <div className="chapter-image relative h-[70vh] rounded-2xl overflow-hidden">
                  <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
