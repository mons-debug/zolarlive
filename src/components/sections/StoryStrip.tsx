"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { product } from "@/content/product";

export default function StoryStrip() {
  const root = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const progress = progressRef.current!;
    const chapters = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".chapter"));
    const images = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".chapter-image"));
    const texts = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".chapter-text"));

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Main pin timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=220%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            // Update progress bar
            gsap.set(progress, { scaleX: self.progress });
          }
        }
      });

      // Setup initial states
      chapters.forEach((chapter, i) => {
        if (i > 0) {
          gsap.set(chapter, { autoAlpha: 0 });
        }
      });

      // Animate chapters
      chapters.forEach((chapter, i) => {
        const image = images[i];
        const text = texts[i];

        if (i === 0) {
          // First chapter starts visible, fades out
          tl.to(chapter, {
            autoAlpha: 0,
            duration: 0.5
          }, 0.8);
        } else if (i < chapters.length - 1) {
          // Middle chapters fade in and out
          tl.fromTo(chapter,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.5 },
            (i - 0.5) / chapters.length * 2
          )
          .to(chapter, {
            autoAlpha: 0,
            duration: 0.5
          }, (i + 0.5) / chapters.length * 2);
        } else {
          // Last chapter fades in and stays
          tl.fromTo(chapter,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.5 },
            (i - 0.5) / chapters.length * 2
          );
        }

        // Image animation (scale and light sweep)
        tl.fromTo(image,
          { scale: 1.08, filter: "brightness(0.7)" },
          { 
            scale: 1, 
            filter: "brightness(1)",
            duration: 1,
            ease: "power2.out"
          },
          i === 0 ? 0 : (i - 0.5) / chapters.length * 2
        );

        // Text animation
        tl.fromTo(text,
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          },
          i === 0 ? 0 : (i - 0.5) / chapters.length * 2
        );
      });

      // Parallax for desktop
      mm.add("(min-width: 768px)", () => {
        images.forEach((image) => {
          gsap.to(image, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        });
      });
    });

          mm.add("(prefers-reduced-motion: reduce)", () => {
      // Simple sequential reveal without pinning
      chapters.forEach((chapter) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 80%",
          onEnter: () => {
            gsap.to(chapter, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            });
          }
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(s => s.kill());
      mm.kill();
    };
  }, []);

  const chapters = [
    {
      title: "CUT & WEIGHT",
      description: product.copy.features[0].description,
      image: product.images.features.weight,
      alt: "Close-up of sleeves and shoulder construction"
    },
    {
      title: "DETAILS THAT LAST",
      description: product.copy.features[1].description,
      image: product.images.features.details,
      alt: "Back graphic detail"
    },
    {
      title: "BORDERLINE ENERGY",
      description: product.copy.features[2].description,
      image: product.images.features.energy,
      alt: "Dynamic pose showcasing fit"
    }
  ];

  return (
    <section id="story" ref={root} className="section relative bg-blackish">
      {/* Progress bar */}
      <div className="fixed top-0 right-0 w-1 h-full z-30 bg-white/10">
        <div 
          ref={progressRef}
          className="absolute top-0 left-0 w-full h-full bg-zolar-grad origin-top transform scale-x-0"
        />
      </div>

      {/* Chapters */}
      {chapters.map((chapter, i) => (
        <div
          key={i}
          className="chapter absolute inset-0 w-full h-full"
          style={{ visibility: i === 0 ? 'visible' : 'hidden' }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center h-full max-w-6xl mx-auto px-6">
            {/* Text */}
            <div className="chapter-text space-y-6">
              <h2 className="text-h2 font-extrabold text-ink">
                {chapter.title}
              </h2>
              <div className="h-1 w-32 rounded-full bg-zolar-grad" />
              <p className="text-body text-ink-90 max-w-lg">
                {chapter.description}
              </p>
            </div>

            {/* Image */}
            <div className="relative h-[70vh] w-full rounded-2xl overflow-hidden">
              <div className="chapter-image absolute inset-0 w-full h-full">
                {/* Light sweep mask */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none z-10" />
                <Image
                  src={chapter.image}
                  alt={chapter.alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  quality={85}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
