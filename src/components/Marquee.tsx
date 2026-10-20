"use client";

import { useEffect, useRef } from "react";

const ROLES = [
  "Software Developer",
  "Full Stack Developer",
  "Backend Developer",
  "AI Engineer",
  "Software Engineer",
];

export function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let lastScrollY = window.scrollY;
    let targetSpeed = 1;
    let currentSpeed = 1;
    let rafId: number;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      // Increase speed slightly with scroll velocity (capped at 2.6x)
      targetSpeed = Math.min(1 + delta * 0.035, 2.6);
    };

    const updateSpeed = () => {
      // Smoothly ease current speed back to normal (1.0)
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;
      targetSpeed += (1 - targetSpeed) * 0.04;

      const container = containerRef.current;
      if (container) {
        const animations = container.getAnimations({ subtree: true });
        for (const animation of animations) {
          animation.playbackRate = currentSpeed;
        }
      }

      rafId = requestAnimationFrame(updateSpeed);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(updateSpeed);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      aria-label="Roles and Expertise Marquee"
      className="relative w-full bg-[#070104] py-10 sm:py-16 overflow-hidden border-y border-white/[0.06] select-none"
    >
      {/* Accessible screen-reader text */}
      <h2 className="sr-only">
        Software Developer, Full Stack Developer, Backend Developer, AI Engineer, Software Engineer
      </h2>

      {/* Edge-faded Marquee Container */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="group relative flex flex-col gap-3 sm:gap-6 w-full cursor-default"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {/* Row 1: Right to Left (Solid light text ~85% opacity) */}
        <div className="flex w-full overflow-hidden">
          <div className="flex w-max shrink-0 animate-marquee-left group-hover:[animation-play-state:paused] will-change-transform">
            {/* Loop Segment 1 */}
            <div className="flex shrink-0 items-center">
              {ROLES.map((role, idx) => (
                <span
                  key={`r1-1-${idx}`}
                  className="flex items-center whitespace-nowrap text-[7vw] font-extrabold uppercase tracking-[-0.02em] leading-none"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  <span>{role}</span>
                  <span className="text-emerald-400/80 text-[0.6em] mx-4 sm:mx-8 select-none">✦</span>
                </span>
              ))}
            </div>

            {/* Loop Segment 2 (Duplicate for seamless loop) */}
            <div className="flex shrink-0 items-center">
              {ROLES.map((role, idx) => (
                <span
                  key={`r1-2-${idx}`}
                  className="flex items-center whitespace-nowrap text-[7vw] font-extrabold uppercase tracking-[-0.02em] leading-none"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  <span>{role}</span>
                  <span className="text-emerald-400/80 text-[0.6em] mx-4 sm:mx-8 select-none">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Left to Right (Outline text with transparent fill) */}
        <div className="flex w-full overflow-hidden">
          <div className="flex w-max shrink-0 animate-marquee-right group-hover:[animation-play-state:paused] will-change-transform">
            {/* Loop Segment 1 */}
            <div className="flex shrink-0 items-center">
              {ROLES.map((role, idx) => (
                <span
                  key={`r2-1-${idx}`}
                  className="flex items-center whitespace-nowrap text-[7vw] font-extrabold uppercase tracking-[-0.02em] leading-none"
                  style={{
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)",
                    color: "transparent",
                  }}
                >
                  <span>{role}</span>
                  <span
                    className="text-[0.6em] mx-4 sm:mx-8 select-none"
                    style={{
                      WebkitTextStroke: "1px rgba(52, 211, 153, 0.6)",
                      color: "transparent",
                    }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </div>

            {/* Loop Segment 2 (Duplicate for seamless loop) */}
            <div className="flex shrink-0 items-center">
              {ROLES.map((role, idx) => (
                <span
                  key={`r2-2-${idx}`}
                  className="flex items-center whitespace-nowrap text-[7vw] font-extrabold uppercase tracking-[-0.02em] leading-none"
                  style={{
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)",
                    color: "transparent",
                  }}
                >
                  <span>{role}</span>
                  <span
                    className="text-[0.6em] mx-4 sm:mx-8 select-none"
                    style={{
                      WebkitTextStroke: "1px rgba(52, 211, 153, 0.6)",
                      color: "transparent",
                    }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Marquee;
