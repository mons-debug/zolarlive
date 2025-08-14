"use client";
import { PropsWithChildren, useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

export default function Smooth({ children }: PropsWithChildren) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.08,
      wheelMultiplier: 1,
    });

    // iOS Safari fix: update on viewport resize (address bar expand/collapse)
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.documentElement);

    // Bridge Lenis with GSAP ScrollTrigger to avoid desync/black gaps
    lenis.on('scroll', ScrollTrigger.update);
    function raf(t: number) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      resizeObserver.disconnect();
      ScrollTrigger?.killAll?.();
    };
  }, []);
  return <>{children}</>;
}
