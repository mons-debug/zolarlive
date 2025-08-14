"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global ScrollTrigger defaults
if (typeof window !== 'undefined') {
  const debugMarkers = process.env.NEXT_PUBLIC_DEBUG_SCROLL === 'true';
  
  ScrollTrigger.defaults({
    markers: debugMarkers,
    anticipatePin: 1,
    fastScrollEnd: true,
    pinSpacing: true // Prevent layout shift
  });

  // Note: normalizeScroll must not run before hydration (it mutates <html> styles).
  // We call it lazily inside client effects (e.g., Smooth.tsx) after mount to avoid hydration mismatch.

  // Refresh ScrollTrigger after images load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  // Refresh on resize with debounce
  let resizeTimeout: NodeJS.Timeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });
}

// Utility function to check for reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  const forceMotion = process.env.NEXT_PUBLIC_FORCE_MOTION === 'true';
  return !forceMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Utility function to create scoped matchMedia context
export const createMediaContext = () => {
  return gsap.matchMedia();
};

// Utility function for consistent cleanup
export const cleanupScrollTriggers = (context?: gsap.Context | gsap.MatchMedia) => {
  if (context) {
    context.kill();
  }
  // Clean up any orphaned ScrollTriggers
  ScrollTrigger.getAll().forEach(st => {
    if (!st.trigger || !document.contains(st.trigger as Element)) {
      st.kill();
    }
  });
};

export { gsap, ScrollTrigger };
