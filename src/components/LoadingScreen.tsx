"use client";
import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Animate out after load
    const timer = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsLoading(false)
      });

      tl.to(".loading-screen", {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut"
      })
      .to(".loading-content", {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.8");
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-screen fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <div className="loading-content text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-display font-extrabold text-ink animate-pulse">
            ZOLAR
          </h1>
          <div className="h-1 w-32 mx-auto mt-4 bg-zolar-grad rounded-full" />
        </div>

        {/* Progress bar */}
        <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-zolar-grad transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Loading text */}
        <p className="mt-4 text-small text-ink-70 uppercase tracking-widest">
          Loading Experience
        </p>
      </div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/10 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
