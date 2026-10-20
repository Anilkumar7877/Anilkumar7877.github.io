"use client";

import { portfolioContent } from "@/data/content";

export function HeroSection() {
  const mainQuote = portfolioContent.heroByAudience.anyone.title;
  const subtitle = portfolioContent.heroByAudience.anyone.subtitle;

  const handleScrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("bypass-role-lock"));
    const workElement = document.getElementById("work");
    if (workElement) {
      workElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="intro"
      aria-label="Introduction"
      className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-8 py-24 sm:py-32"
    >
      <div className="max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center">
        {/* Huge Centered Hero Statement */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-medium tracking-tight text-[#ededed] leading-[1.12] max-w-5xl xl:max-w-6xl">
          {mainQuote}
        </h1>

        {/* Generous Whitespace & Simple Subtitle */}
        <p className="mt-8 text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl font-normal leading-relaxed">
          {subtitle}
        </p>

        {/* Action Buttons: Resume & Projects Quick Jump */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
          <a
            href="#work"
            onClick={handleScrollToWork}
            className="px-5 py-2.5 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-200 hover:text-white hover:border-neutral-500 transition-colors"
          >
            Explore Projects
          </a>
          <a
            href={portfolioContent.personal.resumePath}
            download
            className="px-5 py-2.5 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors"
          >
            Download Resume (PDF)
          </a>
        </div>
      </div>

      {/* Down-Arrow Scroll Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <a
          href="#work"
          onClick={handleScrollToWork}
          aria-label="Scroll down to Work section"
          className="group flex flex-col items-center gap-2 text-neutral-600 hover:text-neutral-300 transition-colors"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">
            Scroll
          </span>
          <svg
            className="w-5 h-5 animate-bounce stroke-current transition-transform duration-200 group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </a>
      </div>
    </section>
  );
}
