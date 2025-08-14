"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

const chapters = [
  {
    title: "CUT & WEIGHT",
    description: product.copy.features[0].description,
    image: product.images.features.weight,
    alt: "Fabric texture detail"
  },
  {
    title: "DETAILS THAT LAST",
    description: product.copy.features[1].description,
    image: product.images.features.details,
    alt: "Seam stitch detail"
  },
  {
    title: "BORDERLINE ENERGY",
    description: product.copy.features[2].description,
    image: product.images.features.energy,
    alt: "Print detail"
  }
];

export default function StoryStripV3() {
  const root = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const el = root.current!;

    if (isMobile) {
      // Mobile: Simple scroll-triggered animations
      const chapterElements = el.querySelectorAll(".mobile-chapter");
      
      chapterElements.forEach((chapter) => {
        const image = chapter.querySelector(".chapter-image") as HTMLElement;
        const text = chapter.querySelector(".chapter-text") as HTMLElement;
        
        // Ensure content is visible by default
        gsap.set(chapter, { opacity: 1, visibility: "visible" });
        
        // Animate text on scroll
        gsap.fromTo(text,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 80%",
              end: "top 30%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            }
          }
        );

        // Subtle parallax on image
        if (image) {
          gsap.fromTo(image,
            { y: 0 },
            {
              y: -30,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              }
            }
          );
        }
      });
    } else {
      // Desktop: Simplified version without complex fading
      const desktopChapters = el.querySelectorAll(".desktop-chapter");
      
      desktopChapters.forEach((chapter) => {
        const image = chapter.querySelector(".chapter-image") as HTMLElement;
        const text = chapter.querySelector(".chapter-text") as HTMLElement;
        
        // Ensure content is visible by default
        gsap.set(chapter, { opacity: 1, visibility: "visible" });
        
        // Simple fade-in animation
        gsap.fromTo(text,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 70%",
              end: "top 30%",
              toggleActions: "play none none reverse",
            }
          }
        );

        // Image parallax
        if (image) {
          gsap.fromTo(image,
            { scale: 1.05 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              }
            }
          );
        }
      });
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      ScrollTrigger.getAll().forEach(s => s.kill());
    };
  }, [isMobile]);

  return (
    <section id="story" ref={root} className="relative bg-black">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {chapters.map((chapter, i) => (
          <div key={i} className="mobile-chapter min-h-screen flex items-center py-16 px-6">
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid gap-8">
                {/* Text */}
                <div className="chapter-text">
                  <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                    {chapter.title}
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-6" />
                  <p className="text-lg text-white/80 max-w-lg">
                    {chapter.description}
                  </p>
                </div>

                {/* Image */}
                <div className="chapter-image relative h-[60vh] rounded-2xl overflow-hidden">
                  <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    quality={85}
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {chapters.map((chapter, i) => (
          <div key={i} className="desktop-chapter min-h-screen flex items-center py-20 px-6">
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Text */}
                <div className="chapter-text">
                  <h2 className="text-5xl lg:text-7xl font-extrabold text-white mb-6">
                    {chapter.title}
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-6" />
                  <p className="text-xl text-white/80 max-w-lg">
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
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
