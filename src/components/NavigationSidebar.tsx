"use client";

import { useState, useEffect } from "react";
import { portfolioContent } from "@/data/content";

export interface NavSection {
  id: string;
  label: string;
}

export const SECTIONS: NavSection[] = [
  { id: "intro", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "background", label: "Background" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

interface NavigationProps {
  activeSection: string;
}

export function NavigationSidebar({ activeSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent("bypass-role-lock"));
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-900/60 select-none">
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Name on Top Left */}
        <a
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("intro");
          }}
          className="text-sm sm:text-base font-medium text-white hover:text-neutral-300 transition-colors"
          aria-label="Anil — Home"
        >
          {portfolioContent.personal.name}
        </a>

        {/* Section Titles on Desktop */}
        <nav className="hidden sm:flex items-center gap-7" aria-label="Primary Navigation">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(sec.id);
                }}
                className={`text-xs transition-colors py-1 ${
                  isActive
                    ? "text-white font-medium"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {sec.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="sm:hidden p-2 text-neutral-400 hover:text-white text-xs flex items-center gap-1.5 border border-neutral-900 rounded-md bg-neutral-950"
        >
          <span className="text-[11px] uppercase tracking-wider text-neutral-400">
            Menu
          </span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-black/95 border-b border-neutral-900 px-6 py-4 flex flex-col gap-3 animate-fade-in-subtle">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(sec.id);
                }}
                className={`text-sm py-1.5 transition-colors ${
                  isActive ? "text-white font-medium" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {sec.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
