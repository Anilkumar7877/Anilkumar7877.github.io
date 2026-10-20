"use client";

import { useEffect, useRef, useState, useId } from "react";
import { motion, useTransform, useSpring, type MotionValue } from "framer-motion";

interface PaintedLandscapeProps {
  scrollYProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  prefersReducedMotion: boolean;
}

export function PaintedLandscape({
  scrollYProgress,
  mouseX,
  mouseY,
  prefersReducedMotion,
}: PaintedLandscapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const rawId = useId();
  const filterId = rawId.replace(/:/g, "");

  // IntersectionObserver to pause heavy SVG / Framer animations when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Responsive check for mobile (below 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Parallax shifts from mouse and scroll
  const parallaxX = useTransform(mouseX, [-28, 28], [-12, 12]);
  const smoothParallaxX = useSpring(parallaxX, { stiffness: 90, damping: 25 });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const smoothParallaxY = useSpring(parallaxY, { stiffness: 90, damping: 25 });

  const active = isInView && !prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none"
    >
      {/* Slow camera drift (scale between 1.00 and 1.04 over 30s) */}
      <motion.div
        style={{
          x: prefersReducedMotion ? 0 : smoothParallaxX,
          y: prefersReducedMotion ? 0 : smoothParallaxY,
          transformOrigin: "center center",
        }}
        animate={
          active
            ? {
                scale: [1.0, 1.04, 1.0],
              }
            : { scale: 1.0 }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full relative will-change-transform"
      >
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
        >
          <defs>
            {/* 1. Sky Gradient: Deep Indigo -> Rich Teal -> Warm Amber Horizon */}
            <linearGradient id={`sky-grad-${filterId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a101d" />
              <stop offset="30%" stopColor="#0f2938" />
              <stop offset="55%" stopColor="#115e59" />
              <stop offset="78%" stopColor="#b45309" />
              <stop offset="92%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* 2. River Gradient: Deep blue-teal winding towards viewer */}
            <linearGradient id={`river-grad-${filterId}`} x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="25%" stopColor="#0d9488" />
              <stop offset="55%" stopColor="#0891b2" />
              <stop offset="85%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* 3. River Reflection Gradient */}
            <linearGradient id={`reflect-grad-${filterId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#d97706" stopOpacity="0.35" />
              <stop offset="65%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.85" />
            </linearGradient>

            {/* 4. Oil Painting Brush Texture Filter (feTurbulence + feDisplacementMap) */}
            <filter
              id={`oil-paint-${filterId}`}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02"
                numOctaves="2"
                result="paintNoise"
              >
                {active && !isMobile && (
                  <animate
                    attributeName="baseFrequency"
                    dur="24s"
                    values="0.02; 0.025; 0.02"
                    repeatCount="indefinite"
                  />
                )}
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="paintNoise"
                scale="8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* 5. Canvas Grain Texture Filter */}
            <filter id={`canvas-grain-${filterId}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.9 0"
              />
            </filter>
          </defs>

          {/* MAIN OIL-PAINTED SCENE GROUP (Filter applied to the whole scene once) */}
          <g filter={`url(#oil-paint-${filterId})`}>
            {/* ── LAYER 1: SKY & BRUSHWORK ── */}
            <rect width="1200" height="800" fill={`url(#sky-grad-${filterId})`} />

            {/* Textured Curved Sky Brush Strokes */}
            <g opacity="0.35" strokeLinecap="round">
              <path d="M 60,60 Q 220,40 400,65" stroke="#1e293b" strokeWidth="8" />
              <path d="M 320,80 Q 520,60 780,85" stroke="#0f172a" strokeWidth="12" />
              <path d="M 700,50 Q 920,40 1140,70" stroke="#0f2938" strokeWidth="10" />
              <path d="M 120,130 Q 340,110 560,135" stroke="#134e4a" strokeWidth="9" />
              <path d="M 500,160 Q 750,135 1020,165" stroke="#115e59" strokeWidth="11" />
              <path d="M 80,220 Q 320,190 620,225" stroke="#0d9488" strokeWidth="10" />
              <path d="M 540,240 Q 820,215 1100,245" stroke="#b45309" strokeWidth="12" />
              <path d="M 160,310 Q 440,285 780,315" stroke="#d97706" strokeWidth="14" />
              <path d="M 680,330 Q 920,305 1180,335" stroke="#f59e0b" strokeWidth="16" strokeOpacity="0.6" />
            </g>

            {/* Drifting Clouds (Soft brush shapes, translateX loops 40-60s) */}
            <g>
              {/* Cloud 1 */}
              <motion.g
                animate={active ? { x: [-120, 260] } : { x: 0 }}
                transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
                opacity="0.45"
              >
                <ellipse cx="240" cy="140" rx="140" ry="24" fill="#38bdf8" />
                <ellipse cx="290" cy="132" rx="90" ry="28" fill="#e0f2fe" opacity="0.6" />
                <ellipse cx="200" cy="145" rx="80" ry="18" fill="#0284c7" opacity="0.4" />
              </motion.g>

              {/* Cloud 2 */}
              <motion.g
                animate={active ? { x: [-180, 220] } : { x: 0 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear", delay: 8 }}
                opacity="0.4"
              >
                <ellipse cx="780" cy="190" rx="170" ry="28" fill="#fdba74" />
                <ellipse cx="840" cy="180" rx="110" ry="32" fill="#fef08a" opacity="0.5" />
                <ellipse cx="730" cy="196" rx="90" ry="22" fill="#ea580c" opacity="0.3" />
              </motion.g>

              {/* Cloud 3 */}
              <motion.g
                animate={active ? { x: [-140, 240] } : { x: 0 }}
                transition={{ duration: 44, repeat: Infinity, ease: "linear", delay: 18 }}
                opacity="0.35"
              >
                <ellipse cx="520" cy="230" rx="120" ry="20" fill="#fde68a" />
                <ellipse cx="560" cy="224" rx="75" ry="24" fill="#fed7aa" opacity="0.7" />
              </motion.g>
            </g>

            {/* ── LAYER 2: FAR ROLLING HILLS (Dark blue-green, layered) ── */}
            {/* Distant Ridge */}
            <path
              d="M -20,410 Q 180,340 380,380 T 820,360 Q 1020,340 1220,390 L 1220,520 L -20,520 Z"
              fill="#062e2c"
              opacity="0.85"
            />
            {/* Distant Ridge brushwork */}
            <path
              d="M 60,375 Q 240,350 440,380 M 640,365 Q 860,345 1080,370"
              stroke="#0f766e"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
              fill="none"
            />

            {/* Mid Hill Layer */}
            <path
              d="M -20,440 Q 220,380 460,425 T 920,410 Q 1080,385 1220,430 L 1220,580 L -20,580 Z"
              fill="#073a36"
              opacity="0.95"
            />

            {/* ── LAYER 3: THE WINDING RIVER ── */}
            {/* Main River Geometry: winding from horizon (y: 420) down to bottom edge (y: 800) */}
            <path
              d="M 590,420 
                 C 620,460 670,490 650,540 
                 C 620,600 480,630 460,680 
                 C 435,740 520,770 380,820 
                 L 860,820 
                 C 740,760 760,720 740,670 
                 C 720,615 810,570 780,515 
                 C 760,470 650,445 615,420 Z"
              fill={`url(#river-grad-${filterId})`}
            />

            {/* Sky & Foliage Colors Reflection on the Water */}
            <path
              d="M 600,430 
                 C 630,470 670,500 650,545 
                 C 625,605 500,635 480,685 
                 C 460,740 520,770 420,820 
                 L 810,820 
                 C 715,765 735,725 715,675 
                 C 695,620 780,575 750,520 
                 C 730,480 645,450 615,430 Z"
              fill={`url(#reflect-grad-${filterId})`}
              opacity="0.5"
            />

            {/* Flowing Water Brush-Stroke Highlights (Moving along the river toward the viewer) */}
            <g strokeLinecap="round" fill="none">
              {/* Highlight Stream 1 (Cream / light blue) */}
              <motion.path
                d="M 605,435 C 630,475 660,505 645,545 C 620,605 510,635 490,685 C 465,745 530,775 440,815"
                stroke="#f5f0e6"
                strokeWidth="2.5"
                strokeDasharray="40 80"
                strokeOpacity="0.75"
                animate={active ? { strokeDashoffset: [0, -240] } : {}}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              />

              {/* Highlight Stream 2 (Cyan / sky highlight) */}
              <motion.path
                d="M 612,445 C 640,485 675,515 655,555 C 630,615 540,640 520,695 C 495,750 580,780 530,815"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeDasharray="50 110"
                strokeOpacity="0.65"
                animate={active ? { strokeDashoffset: [0, -320] } : {}}
                transition={{ duration: 8.5, repeat: Infinity, ease: "linear", delay: 0.8 }}
              />

              {/* Highlight Stream 3 (Right river bank water flow) */}
              <motion.path
                d="M 625,440 C 655,475 710,510 690,550 C 665,600 640,645 620,700 C 595,755 690,785 640,815"
                stroke="#a5f3fc"
                strokeWidth="3"
                strokeDasharray="35 90"
                strokeOpacity="0.7"
                animate={active ? { strokeDashoffset: [0, -250] } : {}}
                transition={{ duration: 6.5, repeat: Infinity, ease: "linear", delay: 1.5 }}
              />

              {/* Short textured water ripples near foreground */}
              <path d="M 470,725 Q 520,718 570,726" stroke="#f5f0e6" strokeWidth="2.5" strokeOpacity="0.6" />
              <path d="M 560,755 Q 630,746 700,757" stroke="#38bdf8" strokeWidth="3" strokeOpacity="0.5" />
              <path d="M 500,785 Q 580,774 670,786" stroke="#f5f0e6" strokeWidth="3" strokeOpacity="0.55" />
            </g>

            {/* River Banks (Rich earth and mossy ground) */}
            {/* Left Bank */}
            <path
              d="M -20,490 Q 220,470 420,530 T 630,520 Q 580,590 480,630 Q 420,690 440,750 Q 410,790 320,820 L -20,820 Z"
              fill="#06281f"
            />
            {/* Right Bank */}
            <path
              d="M 1220,480 Q 980,470 780,500 Q 730,540 760,590 Q 820,640 750,700 Q 730,750 820,820 L 1220,820 Z"
              fill="#05241b"
            />

            {/* ── LAYER 4: STYLIZED OIL-PAINTED TREES & SWAYING BRANCHES ── */}
            {/* Background Trees (Smaller, lighter, subtle sway) */}
            <g>
              {/* Back Tree 1 (Left bank distant) */}
              <motion.g
                style={{ transformOrigin: "320px 520px" }}
                animate={active ? { rotate: [-1.2, 1.2, -1.2] } : { rotate: 0 }}
                transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                <path d="M 318,520 L 322,460" stroke="#041f17" strokeWidth="5" />
                <circle cx="320" cy="450" r="32" fill="#065f46" opacity="0.9" />
                <circle cx="308" cy="442" r="22" fill="#047857" opacity="0.85" />
                <circle cx="332" cy="444" r="24" fill="#0d9488" opacity="0.75" />
                <circle cx="320" cy="430" r="16" fill="#b45309" opacity="0.6" />
              </motion.g>

              {/* Back Tree 2 (Right bank distant) */}
              <motion.g
                style={{ transformOrigin: "860px 500px" }}
                animate={active ? { rotate: [1.3, -1.3, 1.3] } : { rotate: 0 }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
              >
                <path d="M 858,500 L 862,440" stroke="#041f17" strokeWidth="6" />
                <circle cx="860" cy="430" r="36" fill="#064e3b" />
                <circle cx="875" cy="425" r="26" fill="#0f766e" opacity="0.85" />
                <circle cx="848" cy="420" r="24" fill="#d97706" opacity="0.65" />
              </motion.g>

              {/* Back Tree 3 (Autumn touch) */}
              <motion.g
                style={{ transformOrigin: "940px 510px" }}
                animate={active ? { rotate: [-1.4, 1.0, -1.4] } : { rotate: 0 }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
              >
                <path d="M 938,510 L 942,455" stroke="#041f17" strokeWidth="5" />
                <circle cx="940" cy="445" r="30" fill="#b45309" opacity="0.85" />
                <circle cx="952" cy="438" r="22" fill="#c2410c" opacity="0.8" />
                <circle cx="928" cy="442" r="20" fill="#f59e0b" opacity="0.75" />
              </motion.g>
            </g>

            {/* Foreground Trees (Larger, richer colors, deep shadows) */}
            <g>
              {/* Fore Tree 1: Prominent Left Tree */}
              <motion.g
                style={{ transformOrigin: "140px 720px" }}
                animate={active ? { rotate: [-1.8, 1.5, -1.8] } : { rotate: 0 }}
                transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                {/* Trunk */}
                <path d="M 132,720 Q 142,620 138,520 Q 144,480 140,440" stroke="#031710" strokeWidth="18" strokeLinecap="round" />
                <path d="M 140,540 Q 180,500 200,470" stroke="#031710" strokeWidth="9" strokeLinecap="round" />
                <path d="M 135,560 Q 90,520 70,490" stroke="#031710" strokeWidth="8" strokeLinecap="round" />
                {/* Foliage Blobs */}
                <circle cx="140" cy="430" r="70" fill="#022c22" />
                <circle cx="110" cy="410" r="54" fill="#064e3b" />
                <circle cx="170" cy="405" r="58" fill="#047857" opacity="0.9" />
                <circle cx="210" cy="460" r="46" fill="#0f766e" opacity="0.85" />
                <circle cx="70" cy="480" r="42" fill="#065f46" opacity="0.9" />
                <circle cx="145" cy="370" r="45" fill="#15803d" opacity="0.8" />
                <circle cx="130" cy="360" r="34" fill="#b45309" opacity="0.55" />
                {/* Textured Leaves Highlights */}
                <path d="M 120,380 Q 150,370 175,385" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
                <path d="M 160,420 Q 190,410 215,428" stroke="#10b981" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
              </motion.g>

              {/* Fore Tree 2: Stately Right Tree */}
              <motion.g
                style={{ transformOrigin: "1060px 720px" }}
                animate={active ? { rotate: [1.6, -1.6, 1.6] } : { rotate: 0 }}
                transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
              >
                {/* Trunk */}
                <path d="M 1065,720 Q 1050,600 1058,490 Q 1052,440 1055,400" stroke="#02140d" strokeWidth="20" strokeLinecap="round" />
                <path d="M 1055,510 Q 1000,470 970,440" stroke="#02140d" strokeWidth="9" strokeLinecap="round" />
                <path d="M 1060,530 Q 1110,480 1140,450" stroke="#02140d" strokeWidth="9" strokeLinecap="round" />
                {/* Foliage Blobs */}
                <circle cx="1050" cy="390" r="76" fill="#022c22" />
                <circle cx="980" cy="430" r="58" fill="#064e3b" />
                <circle cx="1120" cy="435" r="54" fill="#0f766e" opacity="0.9" />
                <circle cx="1030" cy="340" r="55" fill="#15803d" opacity="0.85" />
                <circle cx="1080" cy="330" r="44" fill="#d97706" opacity="0.6" />
                <circle cx="1000" cy="370" r="38" fill="#ca8a04" opacity="0.5" />
                {/* Impressionist Highlights */}
                <path d="M 1010,345 Q 1040,335 1070,348" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" opacity="0.55" />
                <path d="M 960,420 Q 990,410 1020,425" stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" opacity="0.5" />
              </motion.g>

              {/* Additional Middle Trees (Only rendered on desktop for performance) */}
              {!isMobile && (
                <motion.g
                  style={{ transformOrigin: "260px 660px" }}
                  animate={active ? { rotate: [-1.4, 1.2, -1.4] } : { rotate: 0 }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                >
                  <path d="M 260,660 L 258,540" stroke="#021710" strokeWidth="10" />
                  <circle cx="260" cy="530" r="48" fill="#064e3b" />
                  <circle cx="240" cy="510" r="36" fill="#047857" opacity="0.9" />
                  <circle cx="280" cy="515" r="38" fill="#b45309" opacity="0.75" />
                  <circle cx="260" cy="485" r="28" fill="#d97706" opacity="0.65" />
                </motion.g>
              )}
            </g>

            {/* ── LAYER 5: FOREGROUND REEDS, GRASS STROKES & FIREFLIES ── */}
            {/* Left Foreground Grass & Swaying Reeds */}
            <g strokeLinecap="round">
              <motion.path
                d="M 40,810 Q 55,750 45,690"
                stroke="#0f766e"
                strokeWidth="5"
                fill="none"
                style={{ transformOrigin: "40px 810px" }}
                animate={active ? { rotate: [-2.5, 2.5, -2.5] } : { rotate: 0 }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M 65,815 Q 85,745 75,675"
                stroke="#15803d"
                strokeWidth="6"
                fill="none"
                style={{ transformOrigin: "65px 815px" }}
                animate={active ? { rotate: [2.0, -2.5, 2.0] } : { rotate: 0 }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.path
                d="M 95,820 Q 120,760 115,705"
                stroke="#047857"
                strokeWidth="5"
                fill="none"
                style={{ transformOrigin: "95px 820px" }}
                animate={active ? { rotate: [-2.0, 2.0, -2.0] } : { rotate: 0 }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              />
              {/* Reed Cat-tails */}
              <ellipse cx="45" cy="690" rx="4" ry="14" fill="#78350f" />
              <ellipse cx="75" cy="675" rx="5" ry="16" fill="#78350f" />
            </g>

            {/* Right Foreground Grass & Swaying Reeds */}
            <g strokeLinecap="round">
              <motion.path
                d="M 1150,810 Q 1135,745 1145,685"
                stroke="#15803d"
                strokeWidth="5"
                fill="none"
                style={{ transformOrigin: "1150px 810px" }}
                animate={active ? { rotate: [2.5, -2.5, 2.5] } : { rotate: 0 }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M 1110,815 Q 1090,750 1105,680"
                stroke="#0f766e"
                strokeWidth="6"
                fill="none"
                style={{ transformOrigin: "1110px 815px" }}
                animate={active ? { rotate: [-2.2, 2.2, -2.2] } : { rotate: 0 }}
                transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              />
              <ellipse cx="1145" cy="685" rx="4.5" ry="15" fill="#78350f" />
            </g>

            {/* Floating Fireflies / Gold Autumn Specks drifting upward */}
            <g>
              {/* Particle 1 */}
              <motion.circle
                cx="380"
                cy="620"
                r="3"
                fill="#fde047"
                animate={
                  active
                    ? {
                        y: [-20, -110],
                        x: [0, 25, -15, 0],
                        opacity: [0.2, 0.9, 0.2],
                      }
                    : {}
                }
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Particle 2 */}
              <motion.circle
                cx="670"
                cy="560"
                r="3.5"
                fill="#fde68a"
                animate={
                  active
                    ? {
                        y: [-10, -130],
                        x: [0, -30, 20, 0],
                        opacity: [0.15, 0.85, 0.15],
                      }
                    : {}
                }
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
              />
              {/* Particle 3 */}
              <motion.circle
                cx="820"
                cy="640"
                r="2.5"
                fill="#fef08a"
                animate={
                  active
                    ? {
                        y: [-25, -100],
                        x: [0, 20, -20, 0],
                        opacity: [0.2, 0.8, 0.2],
                      }
                    : {}
                }
                transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 4.2 }}
              />
              {/* Particle 4 */}
              <motion.circle
                cx="510"
                cy="680"
                r="3"
                fill="#6ee7b7"
                animate={
                  active
                    ? {
                        y: [-15, -120],
                        x: [0, -25, 15, 0],
                        opacity: [0.1, 0.75, 0.1],
                      }
                    : {}
                }
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              />
            </g>
          </g>

          {/* OVERLAY: Full-Card Canvas Grain (Tactile oil on canvas woven texture) */}
          <rect
            width="1200"
            height="800"
            filter={`url(#canvas-grain-${filterId})`}
            opacity="0.08"
            style={{ mixBlendMode: "overlay" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default PaintedLandscape;
