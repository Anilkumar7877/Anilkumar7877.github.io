# Anil — Minimalist Developer Portfolio

A high-performance, single-page developer portfolio website built for **Anil** (B.Tech in Artificial Intelligence & Data Science, IIIT Raichur, Class of 2027).

Designed with a hyper-minimalist **pure black (#000)** aesthetic, off-white text, subtle 1px gray borders, **Space Grotesk** typography, and **JetBrains Mono** micro-labels. Built using Next.js App Router, TypeScript, and Tailwind CSS.

---

## ✦ Key Features

- **Pure Black (#000) Minimalist Aesthetic**: Off-white primary typography (`#ededed`), one muted secondary tone (`#888888`), subtle 1px borders (`#1c1c1c` to `#3a3a3a` on hover), zero gradients, no stock photo fluff.
- **Impactful Hero Statement**: Clean, focused statement on reliable backends, applied AI products, and system design.
- **Clean Left Sidebar Navigation (Desktop)**:
  - Instant scroll-spy tracking across sections (`Intro`, `Work`, `Background`, `About`, `Contact`).
  - Just your name top-left, with zero unnecessary numbering or bullet clutter.
  - Seamlessly collapses into a sleek mobile header with drawer on mobile screens.
- **Featured Projects**:
  - **Real-Time Voice AI Agent**: Groq Whisper, Cartesia TTS, LangGraph, Silero VAD barge-in, SQLite eval harness.
  - **RAG Document Q&A Engine**: FastAPI, LangChain, ChromaDB, BM25 + dense hybrid search, cross-encoder re-ranking (RAGAS ~0.815).
  - **Resume Coach AI Platform**: Next.js App Router, Prisma, Supabase, Clerk, UploadThing, Groq Llama 3.
  - **Merged Contribution Heatmap**: FastAPI, Next.js, Redis, Postgres unified activity aggregator.
  - **Cloud Infrastructure & DevOps**: AWS EC2 Docker + Jenkins CI/CD & AWS EKS 3-Tier Cluster with Terraform.
- **Background Timeline**: Vertical chronological tree with mono caps company headers, large role titles, dates, locations, and impact bullets.
- **About & Competitive Programming**: Personal story + dedicated stats block featuring Peak Rating ~1825 (Top ~7%), 500+ solved problems in C++.
- **Single-Source Data File**: All content, links, bio text, and projects reside in [`src/data/content.ts`](./src/data/content.ts) (also accessible at root [`data/content.ts`](./data/content.ts)).
- **Lighthouse 95+ & Accessibility Ready**:
  - Full keyboard accessibility and ARIA roles (`role="tablist"`, semantic `<header>`, `<main>`, `<article>`, `<aside>`, `<nav>`, `<footer>`).
  - Respects `prefers-reduced-motion` natively.
  - Static generation (`○ Static`) for sub-second load times.

---

## ⚡ Quick Start & Run Instructions

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **pnpm** (or npm / yarn / bun)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production (Deployable on Vercel)
```bash
pnpm build
pnpm start
```

---

## 📝 Placeholders to Replace

All text and configuration can be edited directly in [`src/data/content.ts`](./src/data/content.ts):

| Item | Location | Default / Current Value | Description |
|------|----------|--------------------------|-------------|
| **Resume PDF** | `public/resume.pdf` | Placeholder PDF | Replace `public/resume.pdf` with your actual exported resume PDF. |
| **LinkedIn URL** | `src/data/content.ts` (`personal.linkedinUrl`) | `https://www.linkedin.com/in/anilkumar7877` | Update with your verified LinkedIn profile URL. |
| **Project GitHub Repos** | `src/data/content.ts` (`projects[].links`) | `https://github.com/Anilkumar7877/...` | Confirm exact repo URLs for your 5 projects. |
| **Live Project Demos** | `src/data/content.ts` (`projects[].links`) | Demo links | Replace with active deployment links or API documentation. |
| **LeetCode / Codeforces** | `src/data/content.ts` (`about.competitiveProgramming`) | Handles & stats | Update your profile handles if they differ. |

---

## 🚀 Deploy to Vercel

This repository is optimized out-of-the-box for **Vercel**:
1. Push your repository to GitHub.
2. Import the project into your Vercel Dashboard.
3. Framework Preset: **Next.js**.
4. Build Command: `next build` (or `pnpm build`).
5. Output Directory: `.next`.
6. Click **Deploy**!
