"use client";

import { useEffect, useRef, useState } from "react";
import { portfolioContent } from "@/data/content";

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isWordmarkVisible, setIsWordmarkVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check user's motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    if (mediaQuery.matches) {
      setIsVisible(true);
      setIsWordmarkVisible(true);
      return () => mediaQuery.removeEventListener("change", handleMotionChange);
    }

    const currentFooter = footerRef.current;
    const currentWordmark = wordmarkRef.current;

    // Observer for top footer section fade-in
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            footerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    // Observer for wordmark 24px slide-up and fade-in entrance
    const wordmarkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsWordmarkVisible(true);
            wordmarkObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (currentFooter) footerObserver.observe(currentFooter);
    if (currentWordmark) wordmarkObserver.observe(currentWordmark);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      footerObserver.disconnect();
      wordmarkObserver.disconnect();
    };
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !wordmarkRef.current) return;
    const rect = wordmarkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    wordmarkRef.current.style.setProperty("--x", `${x}px`);
    wordmarkRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!wordmarkRef.current) return;
    wordmarkRef.current.style.setProperty("--x", "-9999px");
    wordmarkRef.current.style.setProperty("--y", "-9999px");
  };

  const { personal } = portfolioContent;

  return (
    <footer
      ref={footerRef}
      role="contentinfo"
      className={`w-full relative bg-[#070104] border-t border-[#1f0710]/80 transition-opacity duration-700 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Top Section: Link Columns & Information */}
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 pb-14 border-b border-white/[0.06]">
          {/* Column 1: Navigate */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-4 font-medium">
              Navigate
            </span>
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <a
                  href="#intro"
                  onClick={(e) => handleSmoothScroll(e, "intro")}
                  className="text-neutral-400 hover:text-white transition-colors inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#work"
                  onClick={(e) => handleSmoothScroll(e, "work")}
                  className="text-neutral-400 hover:text-white transition-colors inline-block"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleSmoothScroll(e, "about")}
                  className="text-neutral-400 hover:text-white transition-colors inline-block"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "contact")}
                  className="text-neutral-400 hover:text-white transition-colors inline-block"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Social */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-4 font-medium">
              Social
            </span>
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <a
                  href="https://github.com/Anilkumar7877"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>GitHub</span>
                  <span className="text-neutral-600 group-hover:text-neutral-300 text-xs transition-colors">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={personal.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>LinkedIn</span>
                  <span className="text-neutral-600 group-hover:text-neutral-300 text-xs transition-colors">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-neutral-400 hover:text-white transition-colors inline-block"
                >
                  Email ({personal.email})
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Work */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-4 font-medium">
              Work
            </span>
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <a
                  href={personal.resumePath}
                  download
                  className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>Resume (PDF)</span>
                  <span className="text-neutral-600 group-hover:text-neutral-300 text-xs transition-colors">↓</span>
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "contact")}
                  className="inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors py-0.5"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Open to opportunities</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
          <p>© 2026 {personal.name}. All rights reserved.</p>
          <a
            href="#intro"
            onClick={(e) => handleSmoothScroll(e, "intro")}
            className="hover:text-neutral-300 transition-colors flex items-center gap-1"
          >
            <span>Back to top</span>
            <span>↑</span>
          </a>
        </div>
      </div>

      {/* Giant Upgraded Wordmark "ANIL KUMAR" (Last element in <footer>) */}
      <div
        ref={wordmarkRef}
        aria-hidden="true"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`w-full select-none pointer-events-none md:pointer-events-auto text-center block transition-all duration-700 ease-out ${
          isWordmarkVisible || prefersReducedMotion
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
        style={{
          paddingBottom: "3vw",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}
      >
        <span
          className="w-full block font-black uppercase tracking-[-0.04em] whitespace-nowrap"
          style={{
            fontSize: "12vw",
            lineHeight: 1,
            fontWeight: 900,
            whiteSpace: "nowrap",
            textAlign: "center",
            userSelect: "none",
            backgroundImage: prefersReducedMotion
              ? "linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 100%)"
              : "radial-gradient(400px circle at var(--x, -9999px) var(--y, -9999px), rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          ANIL KUMAR
        </span>
      </div>
    </footer>
  );
}
