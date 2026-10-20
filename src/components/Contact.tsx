"use client";

import { useState, useRef, useEffect, useId } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { portfolioContent } from "@/data/content";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const filterId = rawId.replace(/:/g, "");

  const { personal } = portfolioContent;

  // 1. Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 2. Scroll Parallax for the painting background
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const scrollParallaxY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const smoothParallaxY = useSpring(scrollParallaxY, {
    stiffness: 100,
    damping: 30,
  });

  // 3. Mouse Parallax for the painting background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xRel * 24);
    mouseY.set(yRel * 24);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${personal.email}`;
    }
  };

  return (
    <section
      id="contact"
      aria-label="Contact Information"
      className="py-24 px-0 sm:px-2 w-full max-w-5xl xl:max-w-6xl mx-auto relative"
    >
      {/* Inline SVG Definitions for Canvas Grain & Painterly Effects */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={`canvas-grain-${filterId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.9 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-neutral-900">
        <div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#ededed]">
            Get In Touch
          </h2>
        </div>
        <div className="font-mono text-xs text-neutral-500">
          Inquiries • Opportunities • Collaboration
        </div>
      </div>

      {/* Oil-Painting Landscape Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-[#F5F0E6]/15 bg-[#0a0f14] min-h-[460px] sm:min-h-[520px] p-8 sm:p-14 md:p-20 flex flex-col justify-between overflow-hidden shadow-2xl selection:bg-emerald-950 selection:text-emerald-200"
      >
        {/* Layer 1: Parallax Oil-Painting Landscape Background Image */}
        <motion.div
          aria-hidden="true"
          style={{
            x: prefersReducedMotion ? 0 : smoothMouseX,
            y: prefersReducedMotion ? 0 : smoothParallaxY,
            scale: prefersReducedMotion ? 1 : 1.06,
          }}
          className="pointer-events-none absolute -inset-6 select-none will-change-transform z-0"
        >
          <Image
            src="/oil-painting-landscape.jpg"
            alt="Oil painting of a hillside meadow and trees under golden clouds"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-[center_35%] filter brightness-[1.1] saturate-[1.08] contrast-[1.02]"
          />
        </motion.div>

        {/* Layer 2: Tactile Canvas Grain Texture Overlay */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.06] mix-blend-overlay z-10"
          aria-hidden="true"
        >
          <rect
            width="100%"
            height="100%"
            filter={`url(#canvas-grain-${filterId})`}
          />
        </svg>

        {/* Layer 3: Lighter Text Readability Gradient Overlays */}
        {/* Left-biased gradient to preserve clear readability while letting the bright colors shine */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 via-50% to-transparent z-10"
        />
        {/* Soft top/bottom edge vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10"
        />

        {/* Layer 4: Subtle Drifting Fireflies / Golden Specks */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
          {!prefersReducedMotion && (
            <>
              <motion.div
                animate={{
                  y: [-10, -80],
                  x: [0, 20, -10, 0],
                  opacity: [0.2, 0.85, 0.2],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-28 right-1/4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]"
              />
              <motion.div
                animate={{
                  y: [-15, -95],
                  x: [0, -15, 15, 0],
                  opacity: [0.15, 0.75, 0.15],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-36 right-1/3 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.8)]"
              />
              <motion.div
                animate={{
                  y: [-10, -70],
                  x: [0, 15, -15, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                className="absolute top-1/3 right-16 w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_8px_rgba(254,240,138,0.8)]"
              />
            </>
          )}
        </div>

        {/* Card Content (Relative z-30) */}
        <div className="relative z-30 w-full max-w-3xl">
          {/* Main Headline with Animated Wet-Paint Underline under 'extraordinary' */}
          <h3 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-10 leading-[1.14] drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
            Let&apos;s build something{" "}
            <span className="relative inline-block whitespace-nowrap text-white">
              extraordinary
              {/* Paint-smear brush stroke underline */}
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 280 20"
                fill="none"
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-emerald-400 pointer-events-none"
              >
                <motion.path
                  d="M 4 12 C 45 4, 110 7, 185 5 C 220 4, 255 8, 276 9"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={
                    prefersReducedMotion
                      ? { pathLength: 1, opacity: 0.85 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  whileInView={{ pathLength: 1, opacity: 0.85 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 1.1,
                    delay: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
                {/* Secondary textured wet-paint bristle smear */}
                <motion.path
                  d="M 12 15 C 60 11, 140 12, 220 10 C 248 9, 268 12, 272 13"
                  stroke="#F5F0E6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeOpacity="0.4"
                  initial={
                    prefersReducedMotion
                      ? { pathLength: 1, opacity: 0.4 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  whileInView={{ pathLength: 1, opacity: 0.4 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.9,
                    delay: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </motion.svg>
            </span>{" "}
            together.
          </h3>

          {/* Action Row: Email Button + Resume Button */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-2">
            {/* Primary Email Button: Solid Cream (#F5F0E6), Dark Text, Slight Lift on Hover */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#F5F0E6] text-[#121316] font-medium text-sm sm:text-base hover:bg-[#ede5d5] active:bg-[#e2d8c3] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(245,240,230,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span>{copied ? "Email Copied to Clipboard!" : personal.email}</span>
            </button>

            {/* Resume Download Button: Outlined, Dry-Brush Border, Lighter Fill on Hover */}
            <a
              href={personal.resumePath}
              download
              className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl border-2 border-dashed border-[#F5F0E6]/30 bg-[#F5F0E6]/[0.08] backdrop-blur-md text-[#F5F0E6] hover:text-white hover:border-[#F5F0E6]/65 hover:bg-[#F5F0E6]/[0.16] font-mono text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <svg
                className="w-4 h-4 stroke-current fill-none transition-transform duration-200 group-hover:scale-110"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        {/* Social Links Row at Bottom of Card */}
        <div className="relative z-30 mt-14 sm:mt-20 pt-8 border-t border-[#F5F0E6]/10 flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs text-neutral-300">
          <a
            href={personal.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
          >
            <span>GitHub: {personal.githubUsername}</span>
            <span className="text-neutral-400">↗</span>
          </a>
          <span className="text-neutral-600 select-none">•</span>
          <a
            href={personal.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
          >
            <span>LinkedIn Profile</span>
            <span className="text-neutral-400">↗</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// Re-export as ContactSection for backward compatibility
export const ContactSection = Contact;
export default Contact;
