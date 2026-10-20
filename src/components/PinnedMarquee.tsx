"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BASE_ROLES = [
  "Software Developer",
  "Full Stack Developer",
  "Backend Developer",
  "AI Engineer",
  "Software Engineer",
];

// Replicated strip for deep vertical travel
const REPEATED_ROLES = [
  ...BASE_ROLES,
  ...BASE_ROLES,
  ...BASE_ROLES,
  ...BASE_ROLES,
  ...BASE_ROLES,
];

export function PinnedMarquee() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Respect user's motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  // Track scroll progress along the 350vh runway
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Vertical movement mappings:
  // Column 1 moves upward (bottom to top)
  const yCol1 = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);

  // Column 2 moves downward (top to bottom)
  const yCol2 = useTransform(scrollYProgress, [0, 1], ["-45%", "0%"]);

  return (
    <section
      ref={targetRef}
      aria-label="Roles and Expertise Showcase"
      className={`relative w-full bg-[#070104] select-none border-y border-white/[0.06] ${
        prefersReducedMotion ? "h-auto py-20" : "h-[350vh]"
      }`}
    >
      {/* Screen-reader text */}
      <h2 className="sr-only">
        Software Developer, Full Stack Developer, Backend Developer, AI Engineer, Software Engineer
      </h2>

      {/* 
        Sticky 100vh full-screen pinned view:
        Completely locks the screen so NO upcoming elements (footer) are visible
        until the full 350vh scroll finishes.
      */}
      <div
        className={`w-full flex items-center justify-center bg-[#070104] ${
          prefersReducedMotion
            ? "relative h-auto py-12"
            : "sticky top-0 h-screen overflow-clip"
        }`}
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="w-full max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 h-full items-center"
        >
          {/* Column 1: Solid Light Text (Scrolling Upward) */}
          <div className="h-full flex justify-center items-center overflow-hidden">
            <motion.div
              style={{ y: prefersReducedMotion ? "0%" : yCol1 }}
              className="flex flex-col items-center gap-6 sm:gap-10 will-change-transform py-20"
            >
              {REPEATED_ROLES.map((role, idx) => (
                <div key={`col1-${idx}`} className="flex flex-col items-center text-center">
                  <span
                    className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-[-0.03em] leading-tight"
                    style={{ color: "rgba(255, 255, 255, 0.88)" }}
                  >
                    {role}
                  </span>
                  <span className="text-emerald-400/80 text-xl sm:text-2xl mt-4 select-none">
                    ✦
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Column 2: Outline Text (Scrolling Downward, hidden on mobile for cleaner focus) */}
          <div className="hidden md:flex h-full justify-center items-center overflow-hidden">
            <motion.div
              style={{ y: prefersReducedMotion ? "0%" : yCol2 }}
              className="flex flex-col items-center gap-6 sm:gap-10 will-change-transform py-20"
            >
              {REPEATED_ROLES.map((role, idx) => (
                <div key={`col2-${idx}`} className="flex flex-col items-center text-center">
                  <span
                    className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-[-0.03em] leading-tight"
                    style={{
                      WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)",
                      color: "transparent",
                    }}
                  >
                    {role}
                  </span>
                  <span
                    className="text-xl sm:text-2xl mt-4 select-none"
                    style={{
                      WebkitTextStroke: "1px rgba(52, 211, 153, 0.6)",
                      color: "transparent",
                    }}
                  >
                    ✦
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PinnedMarquee;
