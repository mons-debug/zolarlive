"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on desktop
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current!;
    const dot = cursorDotRef.current!;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Animate cursor
    const animateCursor = () => {
      // Smooth follow for outer cursor
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;

      // Faster follow for dot
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;
      dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

      requestAnimationFrame(animateCursor);
    };

    // Hover effects
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.matches("button, a, [data-cursor='hover']")) {
        gsap.to(cursor, {
          scale: 1.5,
          borderColor: "var(--zolar-green-1)",
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.3
        });
      }

      if (target.matches("img, video")) {
        gsap.to(cursor, {
          scale: 2,
          mixBlendMode: "difference",
          duration: 0.3
        });
      }
    };

    const handleMouseOut = () => {
      gsap.to(cursor, {
        scale: 1,
        borderColor: "rgba(245, 245, 245, 0.3)",
        mixBlendMode: "normal",
        duration: 0.3
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.3
      });
    };

    // Hide on leave
    const handleMouseLeave = () => {
      gsap.to([cursor, dot], {
        opacity: 0,
        duration: 0.3
      });
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, dot], {
        opacity: 1,
        duration: 0.3
      });
    };

    // Start animation
    animateCursor();

    // Add listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Outer cursor */}
      <div
        ref={cursorRef}
        className="hidden md:block fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[200] mix-blend-difference"
        style={{ transition: "border-color 0.3s, transform 0s" }}
      />
      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[201]"
      />

      <style jsx>{`
        @media (hover: none) {
          div {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
