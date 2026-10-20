import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { portfolioContent } from "@/data/content";
import { SmoothScroll } from "@/components/SmoothScroll";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${portfolioContent.personal.name} — Full Stack & Backend Engineer | AI & Systems`,
  description: `${portfolioContent.personal.name} is a software engineer (IIIT Raichur '27) specializing in reliable backends, real-time AI agents, distributed systems, and competitive programming (~1825 rating).`,
  keywords: [
    "Anil",
    "Software Engineer",
    "Backend Engineer",
    "Full Stack Developer",
    "IIIT Raichur",
    "AI Systems",
    "LangGraph",
    "Voice AI",
    "FastAPI",
    "Next.js",
    "Distributed Systems",
    "Competitive Programming",
  ],
  authors: [{ name: portfolioContent.personal.name, url: portfolioContent.personal.githubUrl }],
  creator: portfolioContent.personal.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anilkumar.dev",
    title: `${portfolioContent.personal.name} — Software Engineer (AI & Systems)`,
    description: "Reliable backends, real-time AI agent architectures, and clean systems with great UX.",
    siteName: `${portfolioContent.personal.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${portfolioContent.personal.name} — Software Engineer`,
    description: "Reliable backends, real-time AI agent architectures, and clean systems with great UX.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-black text-[#ededed] antialiased selection:bg-neutral-800 selection:text-white min-h-screen">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
