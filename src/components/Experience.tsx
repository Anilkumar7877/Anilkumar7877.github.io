"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { portfolioContent } from "@/data/content";

const TIMELINE_YEARS: Record<string, { year: string; periodLabel: string }> = {
  "the-circle-nextgen": { year: "2026", periodLabel: "Present • Monorepo SWE" },
  "optifyx-technology": { year: "2025", periodLabel: "Dec 2025 – May 2026" },
  "coding-club-lead": { year: "2024", periodLabel: "Aug 2024 – Leadership" },
  "iiit-raichur-degree": { year: "2023", periodLabel: "2023 – 2027 (Undergrad)" },
};

const entryContainerVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.06,
    },
  },
};

const childItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// Count-up animated year component for the right-side sticky panel
function YearCounter({ year }: { year: string }) {
  const numericTarget = parseInt(year, 10);
  const [displayYear, setDisplayYear] = useState(numericTarget);

  useEffect(() => {
    if (isNaN(numericTarget)) return;

    const start = displayYear;
    const end = numericTarget;
    if (start === end) return;

    const duration = 250;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      setDisplayYear(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const handle = requestAnimationFrame(step);
    return () => cancelAnimationFrame(handle);
  }, [numericTarget]);

  return <span>{displayYear}</span>;
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const entryRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [circleOffsets, setCircleOffsets] = useState<number[]>([]);

  // 1. Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  // 2. Measure circle center offsets relative to timeline container (top = offsetTop + 12px)
  const measureCircleOffsets = useCallback(() => {
    const offsets = entryRefs.current.map((el) => {
      if (!el) return 0;
      return el.offsetTop + 12; // 12px is vertical center of first 24px row
    });
    setCircleOffsets(offsets);
  }, []);

  // 3. Active entry detection: compute active index from distance between entry vertical center
  // and viewport center (window.innerHeight / 2). Always picks the entry with smallest distance.
  const updateActive = useCallback(() => {
    const elements = entryRefs.current;
    if (!elements.length || !elements[0]) return;

    const viewportCenter = window.innerHeight / 2;
    const firstRect = elements[0].getBoundingClientRect();

    // If first entry's top is still below viewport center, line hasn't reached it yet
    if (firstRect.top > viewportCenter) {
      setActiveIndex(-1);
      return;
    }

    let minDistance = Infinity;
    let closestIndex = 0;

    elements.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const entryCenter = rect.top + rect.height / 2;
      const distance = Math.abs(entryCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  // 4. Scroll & resize listener using requestAnimationFrame (compatible with Lenis)
  useEffect(() => {
    let rafId: number | null = null;

    const handleScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        measureCircleOffsets();
        updateActive();
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    // Initial measurement
    handleScrollOrResize();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [measureCircleOffsets, updateActive]);

  // Total track height from top (0) to the last circle's center
  const lastCircleOffset = circleOffsets[circleOffsets.length - 1] ?? 0;
  const maxTrackHeight = lastCircleOffset > 0 ? lastCircleOffset : 0;

  // The green fill height equals the distance from top to the active circle's center
  const targetGreenHeight =
    activeIndex >= 0 && circleOffsets[activeIndex] !== undefined
      ? circleOffsets[activeIndex]
      : 0;

  const lineScaleY =
    maxTrackHeight > 0 ? Math.min(1, targetGreenHeight / maxTrackHeight) : 0;

  // Safe index for panel info
  const safeActiveIndex = Math.max(0, activeIndex);
  const activeItemId = portfolioContent.timeline[safeActiveIndex]?.id || "";
  const activeMeta = TIMELINE_YEARS[activeItemId] || {
    year: "2026",
    periodLabel: "Chronological",
  };

  return (
    <section
      ref={sectionRef}
      id="background"
      aria-label="Experience & Education"
      className="py-20 px-0 sm:px-2 w-full max-w-5xl xl:max-w-6xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16 pb-4 border-b border-neutral-900">
        <div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#ededed]">
            Experience & Education
          </h2>
        </div>
        <div className="font-mono text-xs text-neutral-500">
          Chronological • 2023 — Present
        </div>
      </div>

      {/* Main Grid: Left Timeline + Right Sticky Progress Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 relative">
        {/* Left Column: Vertical Timeline */}
        <div className="md:col-span-8 lg:col-span-9 relative">
          {/* Timeline Track Container */}
          <div className="relative">
            {/* Unfilled Dim Gray Track */}
            <div
              aria-hidden="true"
              style={{
                top: 0,
                height: maxTrackHeight > 0 ? maxTrackHeight : "100%",
              }}
              className="absolute left-[16px] w-[2px] -translate-x-1/2 bg-neutral-800 rounded-full"
            />

            {/* Scroll-Drawn Green Line: height equals distance from top to active circle's center */}
            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                initial={false}
                style={{
                  top: 0,
                  height: maxTrackHeight > 0 ? maxTrackHeight : "100%",
                  transformOrigin: "top",
                }}
                animate={{
                  scaleY: lineScaleY,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute left-[16px] w-[2px] -translate-x-1/2 bg-emerald-400 rounded-full will-change-transform z-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
              />
            )}

            {/* Timeline Items List */}
            <ol className="space-y-16 list-none p-0 m-0">
              {portfolioContent.timeline.map((item, index) => {
                const isItemActive =
                  !prefersReducedMotion && activeIndex === index;
                const isPassed =
                  prefersReducedMotion || activeIndex > index;
                const isUpcoming =
                  !prefersReducedMotion && activeIndex < index;

                return (
                  <motion.li
                    key={item.id}
                    ref={(el) => {
                      entryRefs.current[index] = el;
                    }}
                    data-timeline-id={item.id}
                    variants={entryContainerVariants}
                    initial={prefersReducedMotion ? "visible" : "hidden"}
                    whileInView="visible"
                    viewport={{ once: true, margin: "-15%" }}
                    className={`relative pl-10 sm:pl-12 group transition-all duration-300 ease-out ${
                      isItemActive || prefersReducedMotion
                        ? "opacity-100 filter-none"
                        : "opacity-40 blur-[0.4px] hover:opacity-85 hover:filter-none"
                    } hover:translate-x-1.5`}
                  >
                    {/* Circle Node on the line */}
                    {/* Centered on line's X (left: 16px, -translate-x-1/2) and aligned with first row (top: 12px, -translate-y-1/2) */}
                    <span
                      aria-hidden="true"
                      className="absolute left-[16px] top-3 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none"
                    >
                      <span
                        className={`relative w-[14px] h-[14px] rounded-full border-2 transition-all duration-300 ease-out ${
                          isItemActive
                            ? "bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.85)] scale-110"
                            : isPassed
                            ? "bg-emerald-400 border-emerald-400"
                            : "bg-black border-neutral-700 group-hover:border-neutral-400"
                        }`}
                      >
                        {/* Soft glow/pulse ring when active */}
                        {isItemActive && !prefersReducedMotion && (
                          <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400/40" />
                        )}
                      </span>
                    </span>

                    {/* Company / Institution + Role Type Badge (first row, h-6) */}
                    <motion.div
                      variants={childItemVariants}
                      className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1 min-h-[24px]"
                    >
                      <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-medium">
                        {item.organization}
                      </span>
                      <span className="text-neutral-700 hidden sm:inline">•</span>
                      <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/30 group-hover:text-emerald-300 transition-colors duration-300">
                        {item.type}
                      </span>
                    </motion.div>

                    {/* Role Title with Highlight Sweep on Active */}
                    <motion.h3
                      variants={childItemVariants}
                      animate={
                        isItemActive && !prefersReducedMotion
                          ? { backgroundPosition: ["120% 0", "-120% 0"] }
                          : {}
                      }
                      transition={{
                        duration: 1.0,
                        ease: "easeOut",
                      }}
                      style={{
                        backgroundImage:
                          isItemActive && !prefersReducedMotion
                            ? "linear-gradient(90deg, #ededed 0%, #ffffff 35%, #34d399 50%, #ffffff 65%, #ededed 100%)"
                            : undefined,
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip:
                          isItemActive && !prefersReducedMotion ? "text" : undefined,
                        backgroundClip:
                          isItemActive && !prefersReducedMotion ? "text" : undefined,
                        color:
                          isItemActive && !prefersReducedMotion ? "transparent" : undefined,
                      }}
                      className={`text-xl sm:text-2xl font-medium tracking-tight mt-1 transition-colors duration-300 ${
                        isItemActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                      }`}
                    >
                      {item.role}
                    </motion.h3>

                    {/* Date & Location */}
                    <motion.div
                      variants={childItemVariants}
                      className="mt-1 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-neutral-500"
                    >
                      <time className="text-neutral-400">{item.period}</time>
                      <span className="text-neutral-700">•</span>
                      <span>{item.location}</span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      variants={childItemVariants}
                      className="text-sm text-neutral-400 leading-relaxed max-w-3xl"
                    >
                      {item.description}
                    </motion.p>

                    {/* Highlights Bullet List (Staggered 60ms) */}
                    {item.highlights && item.highlights.length > 0 && (
                      <motion.ul
                        variants={childItemVariants}
                        className="mt-3.5 space-y-2 list-none p-0"
                      >
                        {item.highlights.map((bullet, idx) => (
                          <motion.li
                            key={idx}
                            variants={childItemVariants}
                            className="text-xs sm:text-sm text-neutral-400 flex items-start gap-2.5"
                          >
                            <span className="text-emerald-400 font-mono mt-1 text-[10px] select-none">
                              ▹
                            </span>
                            <span>{bullet}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Right Side: Sticky Mini Progress Panel (Hidden on mobile, visible md+) */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3">
          <div className="sticky top-28 p-6 rounded-2xl border border-white/[0.06] bg-neutral-950/70 backdrop-blur-md flex flex-col gap-6 select-none shadow-xl">
            {/* Active Year & Period Header */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 block mb-1 font-medium">
                Active Timeline
              </span>
              <div className="font-mono text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-baseline gap-1">
                {prefersReducedMotion ? (
                  <span>{activeMeta.year}</span>
                ) : (
                  <YearCounter year={activeMeta.year} />
                )}
              </div>
              <p className="font-mono text-xs text-emerald-400 mt-1 truncate">
                {activeMeta.periodLabel}
              </p>
            </div>

            {/* Vertical Progress Bar Driving from activeIndex */}
            <div className="flex items-center gap-4 py-1">
              <div className="relative w-1.5 h-32 bg-neutral-800 rounded-full overflow-hidden">
                {!prefersReducedMotion && (
                  <motion.div
                    style={{
                      transformOrigin: "top",
                    }}
                    animate={{
                      scaleY:
                        activeIndex >= 0
                          ? (safeActiveIndex + 1) / portfolioContent.timeline.length
                          : 0,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute inset-x-0 top-0 bottom-0 bg-emerald-400 rounded-full will-change-transform shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                  />
                )}
              </div>
              <div className="flex flex-col justify-between h-32 font-mono text-[11px] text-neutral-500">
                <span className={activeMeta.year === "2026" ? "text-white font-medium" : ""}>
                  2026
                </span>
                <span className={activeMeta.year === "2025" ? "text-white font-medium" : ""}>
                  2025
                </span>
                <span className={activeMeta.year === "2024" ? "text-white font-medium" : ""}>
                  2024
                </span>
                <span className={activeMeta.year === "2023" ? "text-white font-medium" : ""}>
                  2023
                </span>
              </div>
            </div>

            {/* Entry Counter & Focus Indicator */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-neutral-400">
              <span>
                {activeIndex >= 0 ? safeActiveIndex + 1 : 0} /{" "}
                {portfolioContent.timeline.length}
              </span>
              {activeIndex >= 0 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Focused</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-neutral-500 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                  <span>Timeline</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const BackgroundSection = Experience;
export default Experience;
