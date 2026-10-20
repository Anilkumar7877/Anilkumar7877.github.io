"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";

export interface RoleConfig {
  label: string;
  bg: string;
  fg: string;
}

// Edit role labels, text background colors, and foreground text colors in one place
export const ROLES: RoleConfig[] = [
  {
    label: "Software Developer",
    bg: "#FACC15",
    fg: "#0A0A0A",
  },
  {
    label: "Backend Developer",
    bg: "#22C55E",
    fg: "#04210F",
  },
  {
    label: "Full Stack Developer",
    bg: "#3B82F6",
    fg: "#FFFFFF",
  },
  {
    label: "AI Engineer",
    bg: "#A855F7",
    fg: "#FFFFFF",
  },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function RoleWindow() {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isLocked, setIsLocked] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Synchronous refs to prevent race conditions during rapid user input
  const isLockedRef = useRef(false);
  const canLockRef = useRef(true);
  const isCoolingDownRef = useRef(false);
  const currentIndexRef = useRef(0);
  const touchStartYRef = useRef(0);
  const prevBoundingTopRef = useRef<number | null>(null);
  const bypassLockRef = useRef(false);

  currentIndexRef.current = currentIndex;
  isLockedRef.current = isLocked;

  // Listen for anchor click bypass events (e.g. clicking "Work" in navbar)
  useEffect(() => {
    const handleBypass = () => {
      bypassLockRef.current = true;
      if (isLockedRef.current) {
        isLockedRef.current = false;
        setIsLocked(false);
        lenis?.start();
      }
      setTimeout(() => {
        bypassLockRef.current = false;
      }, 1400);
    };

    window.addEventListener("bypass-role-lock", handleBypass);
    return () => window.removeEventListener("bypass-role-lock", handleBypass);
  }, [lenis]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  // Unlock and resume smooth scroll onward
  const unlockAndRelease = useCallback(
    (forward: boolean) => {
      isLockedRef.current = false;
      setIsLocked(false);
      lenis?.start();

      const scrollDelta = window.innerHeight * 0.6;
      const targetY = forward
        ? window.scrollY + scrollDelta
        : Math.max(0, window.scrollY - scrollDelta);

      lenis?.scrollTo(targetY, { duration: 0.8 });
    },
    [lenis]
  );

  // Step function: moves exactly ONE role per gesture with 900ms cooldown
  const triggerStep = useCallback(
    (dir: 1 | -1) => {
      if (isCoolingDownRef.current) return;

      isCoolingDownRef.current = true;
      setTimeout(() => {
        isCoolingDownRef.current = false;
      }, 900);

      const nextIndex = currentIndexRef.current + dir;

      if (nextIndex >= 0 && nextIndex < ROLES.length) {
        setDirection(dir);
        setCurrentIndex(nextIndex);
      } else if (nextIndex >= ROLES.length) {
        // Scrolled past the last role -> release lock downward to Projects
        unlockAndRelease(true);
      } else {
        // Scrolled before the first role -> release lock upward to Hero
        unlockAndRelease(false);
      }
    },
    [unlockAndRelease]
  );

  // IntersectionObserver to snap and lock when section fills the screen (0.98)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const currentTop = entry.boundingClientRect.top;
          const wasScrollingUp =
            prevBoundingTopRef.current !== null &&
            currentTop > prevBoundingTopRef.current;
          prevBoundingTopRef.current = currentTop;

          // Re-arm lock when section leaves the viewport (< 0.6)
          if (entry.intersectionRatio < 0.6) {
            canLockRef.current = true;
          }

          // Lock when filling screen (>= 0.98) and not bypassed by a nav link click
          if (
            entry.intersectionRatio >= 0.98 &&
            canLockRef.current &&
            !isLockedRef.current &&
            !bypassLockRef.current
          ) {
            canLockRef.current = false;
            isLockedRef.current = true;
            setIsLocked(true);

            // If entering from below (scrolling up), start on the last role; otherwise first role
            if (wasScrollingUp) {
              setDirection(-1);
              setCurrentIndex(ROLES.length - 1);
            } else {
              setDirection(1);
              setCurrentIndex(0);
            }

            // Snap section to top of viewport and stop lenis scroll
            lenis?.scrollTo(sectionEl, {
              immediate: true,
              onComplete: () => {
                lenis.stop();
              },
            });
            lenis?.stop();
          }
        }
      },
      {
        threshold: [0.55, 0.6, 0.98],
      }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      lenis?.start();
    };
  }, [lenis, prefersReducedMotion]);

  // Intercept wheel, touch, and keyboard navigation while locked
  useEffect(() => {
    if (!isLocked || prefersReducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isLockedRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      if (Math.abs(e.deltaY) < 15) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      triggerStep(dir);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isLockedRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isLockedRef.current) return;
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) >= 40) {
        const dir: 1 | -1 = deltaY > 0 ? 1 : -1;
        triggerStep(dir);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLockedRef.current) return;

      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
      ) {
        e.preventDefault();
        triggerStep(1);
      } else if (
        e.key === "ArrowUp" ||
        e.key === "PageUp" ||
        (e.key === " " && e.shiftKey)
      ) {
        e.preventDefault();
        triggerStep(-1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLocked, prefersReducedMotion, triggerStep]);

  return (
    <section
      ref={sectionRef}
      id="roles"
      aria-label="Role Window Step-Scroll Showcase"
      className={`w-full bg-black select-none relative flex flex-col items-center justify-center overflow-x-visible ${
        prefersReducedMotion ? "h-auto py-24" : "h-screen"
      }`}
    >
      {/* Screen-reader accessible sentence */}
      <h2 className="sr-only">
        I am a {ROLES.map((r) => r.label).join(", ")}.
      </h2>

      {/* Reduced-motion fallback: clean static list with sharp corners */}
      {prefersReducedMotion ? (
        <div className="w-full max-w-5xl mx-auto px-4 py-16 flex flex-col items-center gap-6 text-center">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-white/50">
            I am a
          </p>
          <div className="w-full flex flex-col items-center gap-4">
            {ROLES.map((role) => (
              <div
                key={role.label}
                className="w-full uppercase tracking-[-0.02em] font-extrabold text-2xl sm:text-4xl md:text-5xl whitespace-nowrap flex items-center justify-center gap-3 py-3 rounded-none"
                style={{ color: role.fg, backgroundColor: role.bg }}
              >
                <span>{role.label}</span>
                <span className="text-sm select-none">✦</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 flex flex-col items-center justify-center bg-black">
          {/* Static Lead-in Line: small, muted, uppercase, centered */}
          <p
            aria-hidden="true"
            className="font-mono uppercase tracking-[0.2em] text-white/50 mb-4 sm:mb-6 select-none text-center"
            style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
          >
            I am a
          </p>

          {/* 
            Centered Role Box Window:
            - Full width of container with equal side margins
            - Sharp corners (rounded-none, no rounded edges)
            - overflow-hidden for clean razor edges with zero gaps or color bleed
            - Exactly 1.5em height with equal vertical padding
          */}
          <div
            aria-hidden="true"
            className="relative w-full h-[1.5em] overflow-hidden flex items-center justify-center rounded-none select-none pointer-events-none"
            style={{
              fontSize: "clamp(1.75rem, 5.5vw, 5.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full flex items-center justify-center text-center uppercase whitespace-nowrap rounded-none"
                style={{
                  backgroundColor: ROLES[currentIndex].bg,
                  color: ROLES[currentIndex].fg,
                  willChange: "transform, opacity",
                }}
              >
                {/* Text and star perfectly centered with equal padding */}
                <span className="inline-flex items-center justify-center gap-3 sm:gap-4 leading-none">
                  <span>{ROLES[currentIndex].label}</span>
                  <span className="text-[0.6em] opacity-80 select-none">✦</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtle scroll hint with down arrow: fades out after first step */}
          <div
            aria-hidden="true"
            className={`mt-8 flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-widest transition-opacity duration-500 text-neutral-600 select-none ${
              currentIndex === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <span>Scroll</span>
            <span className="text-xs animate-bounce">↓</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default RoleWindow;
