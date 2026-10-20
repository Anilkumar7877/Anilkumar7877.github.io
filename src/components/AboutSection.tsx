"use client";

import { portfolioContent } from "@/data/content";

export function AboutSection() {
  const { about } = portfolioContent;
  const { competitiveProgramming } = about;

  return (
    <section id="about" aria-label="About Anil" className="py-20 px-0 sm:px-2 w-full max-w-5xl xl:max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-neutral-900">
        <div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#ededed]">
            About & Philosophy
          </h2>
        </div>
        <div className="font-mono text-xs text-neutral-500">
          Personal • Core Systems • Problem Solving
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Short Personal Story (3-4 lines) */}
        <div className="lg:col-span-7 space-y-5">
          {about.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Technical Strengths */}
          <div className="pt-6 border-t border-neutral-900 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Technical Tooling & Foundations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.technicalStrengths.map((group) => (
                <div
                  key={group.category}
                  className="p-4 rounded-lg border border-neutral-800/80 bg-neutral-950/60"
                >
                  <span className="font-mono text-xs text-neutral-400 block mb-2 font-medium">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Competitive Programming Highlight Card */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 sm:p-7 relative overflow-hidden h-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800/60">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
                Competitive Programming
              </span>
              <span className="w-2 h-2 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Peak Rating
                </span>
                <span className="text-2xl font-mono font-medium text-white mt-1 block">
                  {competitiveProgramming.rating}
                </span>
              </div>
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Global Rank
                </span>
                <span className="text-2xl font-mono font-medium text-white mt-1 block">
                  {competitiveProgramming.rankingPercentile}
                </span>
              </div>
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Solved Count
                </span>
                <span className="text-2xl font-mono font-medium text-white mt-1 block">
                  {competitiveProgramming.solvedProblemsCount}
                </span>
              </div>
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Primary Dialect
                </span>
                <span className="text-2xl font-mono font-medium text-white mt-1 block">
                  C++
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 font-mono leading-relaxed mb-6">
              {competitiveProgramming.platformSummary} Daily dedication to algorithmic optimization, graph algorithms, dynamic programming, and complexity bounds.
            </p>

            {/* Platform Links */}
            <div className="space-y-2 border-t border-neutral-900 pt-4">
              {competitiveProgramming.platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-900/60 border border-transparent hover:border-neutral-800 transition-colors font-mono text-xs text-neutral-400 hover:text-white"
                >
                  <span className="font-medium text-neutral-300">{platform.name}</span>
                  <span className="text-neutral-500 text-[11px]">{platform.metric}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
