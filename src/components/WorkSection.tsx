"use client";

import { portfolioContent } from "@/data/content";

export function WorkSection() {
  return (
    <section id="work" aria-label="Selected Projects" className="py-20 px-0 sm:px-2 w-full max-w-5xl xl:max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-neutral-900">
        <div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#ededed]">
            Selected Projects
          </h2>
        </div>
        <div className="font-mono text-xs text-neutral-500">
          Showing 5 key projects
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {portfolioContent.projects.map((project) => {
          return (
            <article
              key={project.id}
              className="group relative rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.035]"
            >
              {/* Top row: Title and Links */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-medium text-[#ededed] group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm font-mono text-neutral-400">
                    {project.tagline}
                  </p>
                </div>

                {/* Project Links with Minimal Icons (only renders if valid real deployed/repo URL exists) */}
                <div className="flex items-center gap-3 font-mono text-xs">
                  {project.links
                    .filter((link) => Boolean(link.url) && link.url !== "https://github.com/Anilkumar7877")
                    .map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03] backdrop-blur-md text-neutral-300 hover:text-white hover:border-white/30 transition-all duration-200"
                      aria-label={`${project.title} ${link.label}`}
                    >
                      {link.type === "github" ? (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      )}
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Main Description */}
              <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                {project.description}
              </p>

              {/* Architecture & Metrics Indicators */}
              {(project.metrics || project.architectureNote) && (
                <div className="mt-4 pt-3 border-t border-neutral-900/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-neutral-400">
                  {project.metrics && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-600">Metric:</span>
                      <span className="text-neutral-300">{project.metrics}</span>
                    </div>
                  )}
                  {project.architectureNote && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-600">Arch:</span>
                      <span className="text-neutral-400">{project.architectureNote}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tech Tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {project.techTags.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[11px] px-2.5 py-1 rounded bg-white/[0.03] text-neutral-400 border border-white/[0.06] backdrop-blur-sm group-hover:border-white/15 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
