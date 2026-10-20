"use client";

import { useEffect, useState, useRef } from "react";

export function CustomCursor() {
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Smooth lerp coordinates for trailing ring
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const mousePosition = useRef({ x: -100, y: -100 });
  const ringPosition = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable custom cursor for devices with mouse/trackpad (pointer: fine)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!mediaQuery.matches || prefersReducedMotion) {
      return;
    }

    setHasFinePointer(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Instant update for the central dot & ambient light
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
      }

      // Check if target is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("a, button, input, textarea, select, [role='button'], article")
        );
        setIsHovering(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Smooth lerp animation loop for the outer trailing ring
    let animationFrameId: number;

    const animateRing = () => {
      // Linear interpolation factor (smooth trailing lag)
      const lerpSpeed = 0.18;
      ringPosition.current.x += (mousePosition.current.x - ringPosition.current.x) * lerpSpeed;
      ringPosition.current.y += (mousePosition.current.y - ringPosition.current.y) * lerpSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosition.current.x}px, ${ringPosition.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animateRing);
    };

    animationFrameId = requestAnimationFrame(animateRing);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!hasFinePointer) return null;

  return (
    <>
      {/* Ambient Cursor Spotlight (Subtle light revealing subtle borders) */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full z-0 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 35%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* Central Precision Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-white z-50 transition-opacity duration-150 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovering ? "scale-75" : "scale-100"}`}
        style={{ willChange: "transform" }}
      />

      {/* Fluid Trailing Ring with Expansion on Hover */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 rounded-full border border-white/30 z-50 transition-all duration-200 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${
          isHovering
            ? "-ml-5 -mt-5 w-10 h-10 border-white/60 bg-white/[0.04] scale-110 backdrop-blur-[1px]"
            : "-ml-3.5 -mt-3.5 w-7 h-7 border-white/25 scale-100"
        } ${isClicking ? "scale-90 border-white/80" : ""}`}
        style={{ willChange: "transform" }}
      />
    </>
  );
}
