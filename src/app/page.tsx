"use client";

import { useState, useEffect } from "react";
import { NavigationSidebar, SECTIONS } from "@/components/NavigationSidebar";
import { HeroSection } from "@/components/HeroSection";
import { WorkSection } from "@/components/WorkSection";
import { BackgroundSection } from "@/components/BackgroundSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { FadeInSection } from "@/components/FadeInSection";
import { CustomCursor } from "@/components/CustomCursor";
import { RoleWindow } from "@/components/RoleWindow";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("intro");

  // Scroll-spy observer to track active section
  useEffect(() => {
    const sectionElements = SECTIONS.map((section) =>
      document.getElementById(section.id)
    ).filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section with highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#ededed] relative selection:bg-neutral-800 selection:text-white">
      {/* Custom Fluid Pointer & Ambient Glow */}
      <CustomCursor />

      {/* Top Navigation Bar: Name on Left, Titles on Right */}
      <NavigationSidebar activeSection={activeSection} />

      {/* Hero Section */}
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 pt-16">
        <HeroSection />
      </div>

      {/* Step-Scrolling Role Window Section (Immediately before Projects) */}
      <RoleWindow />

      {/* Main Content: Projects, Background, About, Contact */}
      <main className="w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center justify-between px-4 sm:px-8">
        {/* Selected Work Section (Projects) */}
        <FadeInSection id="work-wrapper" className="w-full">
          <WorkSection />
        </FadeInSection>

        {/* Experience & Education Timeline */}
        <FadeInSection id="background-wrapper" className="w-full">
          <BackgroundSection />
        </FadeInSection>

        {/* About & Competitive Programming */}
        <FadeInSection id="about-wrapper" className="w-full">
          <AboutSection />
        </FadeInSection>

        {/* Contact Section */}
        <FadeInSection id="contact-wrapper" className="w-full">
          <ContactSection />
        </FadeInSection>
      </main>

      {/* Full-width Footer with Giant Wordmark */}
      <Footer />
    </div>
  );
}
