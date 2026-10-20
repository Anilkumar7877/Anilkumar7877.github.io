export type AudienceType = "anyone" | "recruiters" | "engineers" | "pm";

export interface ProjectLink {
  label: string;
  url: string;
  type: "github" | "live" | "demo";
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  techTags: string[];
  links: ProjectLink[];
  audienceHighlights: {
    anyone: string;
    recruiters: string;
    engineers: string;
    pm: string;
  };
  metrics?: string;
  architectureNote?: string;
}

export interface TimelineItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights?: string[];
  type: "work" | "leadership" | "education";
}

export interface CompetitiveProgrammingStats {
  rating: string;
  rankingPercentile: string;
  solvedProblemsCount: string;
  primaryLanguage: string;
  platformSummary: string;
  platforms: {
    name: string;
    handle: string;
    url: string;
    metric: string;
  }[];
}

export interface PortfolioData {
  personal: {
    name: string;
    monogram: string;
    role: string;
    university: string;
    degree: string;
    graduationYear: string;
    location: string;
    email: string;
    githubUsername: string;
    githubUrl: string;
    linkedinUrl: string; // PLACEHOLDER: Replace with your actual LinkedIn profile URL
    resumePath: string; // PLACEHOLDER: Put your resume file in /public/resume.pdf
    statusTag: string;
  };
  heroByAudience: Record<
    AudienceType,
    {
      title: string;
      subtitle: string;
      audienceBadge: string;
      focusSummary: string;
    }
  >;
  projects: ProjectItem[];
  timeline: TimelineItem[];
  about: {
    paragraphs: string[];
    competitiveProgramming: CompetitiveProgrammingStats;
    technicalStrengths: {
      category: string;
      skills: string[];
    }[];
  };
  contact: {
    headline: string;
    subheadline: string;
    availability: string;
  };
}

export const portfolioContent: PortfolioData = {
  personal: {
    name: "Anil Kumar",
    monogram: "AK",
    role: "Full Stack & Backend Engineer",
    university: "Indian Institute of Information Technology Raichur",
    degree: "B.Tech in Artificial Intelligence & Data Science",
    graduationYear: "2027",
    location: "Raichur / Karnataka, India",
    email: "anilpython7877@gmail.com",
    githubUsername: "Anilkumar7877",
    githubUrl: "https://github.com/Anilkumar7877",
    linkedinUrl: "https://www.linkedin.com/in/anilkumar7877", // PLACEHOLDER: Replace with your verified LinkedIn profile
    resumePath: "/Anil_Kumar_Resume.pdf",
    statusTag: "Seeking 2025/2026 Internships & New Grad Roles (2027)",
  },

  heroByAudience: {
    anyone: {
      title: "I build the systems behind great products.",
      subtitle: "B.Tech AI & Data Science @ IIIT Raichur (2027). Obsessed with low-latency APIs, agentic pipelines, and resilient system architectures.",
      audienceBadge: "General Overview",
      focusSummary: "Highlighting core software engineering breadth, full-stack craftsmanship, and production-tested AI applications.",
    },
    recruiters: {
      title: "Building scalable production services and applied AI products with high ownership, speed, and clean code hygiene.",
      subtitle: "IIIT Raichur '27 (AI & DS) | SWE Intern @ The Circle NextGen | Top ~7% Competitive Programmer (~1825 Peak). Ready for high-impact SWE / Backend roles.",
      audienceBadge: "Impact & Hiring Lens",
      focusSummary: "Showcasing verified production internships, measurable engineering metrics, clean documentation, and resume downloads.",
    },
    engineers: {
      title: "Designing high-throughput async backends, RAG search pipelines, and sub-second voice AI agent architectures.",
      subtitle: "FastAPI, Next.js, Redis, LangChain, Cartesia/Groq, Docker, AWS EKS, and C++ algorithmic problem solving (500+ solved).",
      audienceBadge: "Architecture & Systems Lens",
      focusSummary: "Deep-diving into concurrency models, vector retrieval benchmarks (RAGAS ~0.815), caching strategies, and CI/CD pipelines.",
    },
    pm: {
      title: "Shipping zero-to-one AI products and user-centric features rapidly without sacrificing system reliability.",
      subtitle: "Bridging complex model capabilities with intuitive workflows. From barge-in voice UX to automated resume analytics.",
      audienceBadge: "Problem & Outcome Lens",
      focusSummary: "Emphasizing time-to-market, product-market validation, edge-case mitigation, and seamless end-to-end user satisfaction.",
    },
  },

  projects: [
    {
      id: "real-time-voice-ai-agent",
      title: "Real-Time Voice AI Agent",
      tagline: "Sub-second bidirectional conversational agent with interruptible streaming audio.",
      description:
        "Full-duplex voice interface engineered with Groq Whisper for speech transcription, Cartesia Sonic for ultra-low latency TTS, LangGraph for cyclical stateful agent orchestration, and Silero VAD for instant barge-in detection. Features SQLite-backed LLM-as-a-judge evaluation harness to benchmark conversational latency, intent accuracy, and context retention.",
      techTags: ["Groq Whisper", "Cartesia TTS", "LangGraph", "Silero VAD", "Python", "SQLite", "WebSockets"],
      links: [
        { label: "Code", url: "https://github.com/Anilkumar7877/Voice-Agent", type: "github" },
      ],
      metrics: "< 450ms voice-to-voice turn latency, 99.2% barge-in precision",
      architectureNote: "WebSocket state machine with parallel audio chunks and LangGraph memory persistence",
      audienceHighlights: {
        anyone: "Enables human-like verbal conversation with instant interruption support.",
        recruiters: "Built end-to-end voice infrastructure demonstrating mastery of modern AI pipelines and async programming.",
        engineers: "Engineered barge-in interruption via Silero VAD frames, streaming Cartesia PCM bytes, and automated SQLite eval harness.",
        pm: "Solves robotic conversational delays to unlock natural customer service and voice-assisted workflow execution.",
      },
    },
    {
      id: "rag-document-qa",
      title: "RAG Document Q&A Engine",
      tagline: "Production-grade retrieval pipeline with semantic embeddings and enterprise ingest workflows.",
      description:
        "High-accuracy enterprise document intelligence API constructed with FastAPI, LangChain, ChromaDB, and Gemini API. Implements complex internal algorithms for semantic embeddings, building secure ingest pipelines capable of parsing large-scale enterprise data with low-latency page-attributed vector lookups.",
      techTags: ["Python", "FastAPI", "LangChain", "ChromaDB", "Gemini API", "Vector Search"],
      links: [
        { label: "Code", url: "https://github.com/Anilkumar7877/RAG-QA-System", type: "github" },
        { label: "Live Demo", url: "https://rag-qa-system-lemon.vercel.app/", type: "live" },
      ],
      metrics: "Low-latency page-attributed vector lookups, large-scale enterprise data ingest",
      architectureNote: "Semantic chunking pipeline with dynamic token windowing, vector indexing, and memory retention",
      audienceHighlights: {
        anyone: "Ask questions against complex PDF and technical manuals with verifiable citations.",
        recruiters: "Demonstrates rigorous evaluation methodology using RAGAS and scalable API architecture.",
        engineers: "Robust semantic search pipeline with ChromaDB vector embeddings and clean FastAPI endpoints.",
        pm: "Transforms unorganized organizational documents into trusted, hallucination-resistant knowledge for teams.",
      },
    },
    {
      id: "resume-coach",
      title: "Resume Coach AI Platform",
      tagline: "Full-stack app that analyzes resumes and helps with interview prep using AI.",
      description:
        "Next.js app where users upload a resume (UploadThing), sign in with Clerk, and get AI feedback from Groq-hosted Llama models. Data is stored in Supabase Postgres through Prisma.",
      techTags: ["Next.js", "TypeScript", "Prisma", "Supabase", "Clerk", "UploadThing", "Groq", "Tailwind CSS"],
      links: [
        { label: "Code", url: "https://github.com/Anilkumar7877/resume-coach", type: "github" },
        { label: "Live App", url: "https://resume-coach-tan.vercel.app/", type: "live" },
      ],
      metrics: "End-to-end resume analysis with structured AI feedback.",
      architectureNote: "Next.js App Router -> Clerk auth -> UploadThing file intake -> Groq Llama analysis -> Prisma + Supabase Postgres.",
      audienceHighlights: {
        anyone: "Upload your resume and receive AI-driven actionable recommendations and interview preparation.",
        recruiters: "Demonstrates end-to-end full stack development with modern authentication, file storage, and AI inference.",
        engineers: "Structured schema design with Prisma ORM, Supabase PostgreSQL, and clean component architecture.",
        pm: "Direct user value proposition with seamless file upload and structured AI insights.",
      },
    },
    {
      id: "merged-contribution-graph",
      title: "Merged Contribution Heatmap",
      tagline: "Unified developer activity aggregator syncing GitHub, LeetCode, Codeforces, and GFG.",
      description:
        "Distributed scraping and synchronization platform unifying fragmented engineering activity across GitHub, LeetCode, Codeforces, and GeeksforGeeks into a cohesive SVG contribution matrix. Powered by an asynchronous FastAPI backend, Redis write-through caching layer, and Postgres storage, surfaced through an interactive Next.js dashboard.",
      techTags: ["FastAPI", "Next.js", "Redis", "PostgreSQL", "AsyncIO", "Docker", "Tailwind CSS"],
      links: [
        { label: "Code", url: "https://github.com/Anilkumar7877/merged-progress-contribution", type: "github" },
      ],
      metrics: "15-minute background sync cron, sub-20ms cached response time",
      architectureNote: "Distributed rate-limited scrapers with Redis fallback, exponential backoff, and idempotent DB upserts",
      audienceHighlights: {
        anyone: "A single unified calendar showing all coding activity across multiple platforms in one place.",
        recruiters: "Highlights personal initiative, competitive coding discipline, and end-to-end full stack architecture.",
        engineers: "Solves varying 3rd-party rate limits using Redis caching, celery-style background workers, and Postgres upserts.",
        pm: "Consolidates fragmented profiles into one compelling portfolio asset for modern developers.",
      },
    },
    {
      id: "focusflow-flask-mysql-cicd",
      title: "FocusFlow: Two-Tier Flask/MySQL CI/CD on AWS EC2",
      tagline: "Containerized task-management app deployed to AWS EC2 by an automated Jenkins pipeline.",
      description:
        "A Flask REST API with a MySQL database and a glassmorphic vanilla-JS frontend, run with Docker Compose on an Ubuntu EC2 instance. A declarative Jenkinsfile checks out the code, builds the images, deploys the containers, and runs health checks on every push.",
      techTags: ["Jenkins", "Docker", "Docker Compose", "AWS EC2", "Flask", "MySQL", "GitHub Webhooks", "Python"],
      links: [
        { label: "Repo", url: "https://github.com/Anilkumar7877/Two-Tier-Flask-App-Docker-Jenkins", type: "github" },
      ],
      metrics: "Push-to-deploy via GitHub webhook trigger, with health checks after every deployment.",
      architectureNote: "GitHub webhook -> Jenkins (EC2, port 8080) -> Docker Compose build -> Flask app (5000) + MySQL (3307 on the host), with a security group limited to SSH, 8080, and 5000.",
      audienceHighlights: {
        anyone: "Containerized task-management app deployed to AWS EC2 by an automated Jenkins pipeline.",
        recruiters: "Demonstrates practical DevOps, CI/CD pipeline automation, and container orchestration on cloud infrastructure.",
        engineers: "Declarative Jenkinsfile pipeline running Docker Compose with isolated network ports and automated health checks.",
        pm: "Automates the delivery lifecycle with GitHub webhooks, eliminating manual deployments and deployment errors.",
      },
    },
  ],

  timeline: [
    {
      id: "the-circle-nextgen",
      organization: "THE CIRCLE NEXTGEN",
      role: "Software Developer Intern",
      period: "Jun 2026 – Present", // Matches user specification
      location: "Remote / Bengaluru, India",
      description:
        "Architecting and shipping features across a production Next.js and Firebase monorepo platform. Optimizing backend data flows, modularizing reusable UI systems, and ensuring low-latency data synchronization across distributed clients.",
      highlights: [
        "Developing scalable features within a high-velocity Next.js / Firebase monorepo ecosystem",
        "Streamlining state management and client-server caching to minimize redundant network roundtrips",
        "Collaborating across frontend and backend boundaries in an agile sprint environment",
      ],
      type: "work",
    },
    {
      id: "optifyx-technology",
      organization: "OPTIFYX TECHNOLOGY",
      role: "Full Stack Developer Intern",
      period: "Dec 2025 – May 2026",
      location: "Bengaluru, India",
      description:
        "Constructed responsive web interfaces and resilient backend microservice endpoints. Integrated third-party APIs, implemented structured error handling, and optimized database queries for core business dashboards.",
      highlights: [
        "Built responsive client portals adhering to strict design fidelity and accessibility guidelines",
        "Implemented RESTful endpoints with input sanitization, JWT auth, and database indexing",
        "Reduced initial dashboard payload size by 35% via dynamic code splitting and asset optimization",
      ],
      type: "work",
    },
    {
      id: "coding-club-lead",
      organization: "IIIT RAICHUR",
      role: "Coding Club Lead & E-Cell Lead",
      period: "Aug 2024 – Present",
      location: "Raichur, India",
      description:
        "Directing algorithmic workshops, competitive programming bootcamps, and hackathons for 200+ students. Spearheading entrepreneurship initiatives to nurture student-led technical ventures and open source contributions.",
      highlights: [
        "Mentored junior cohorts in Data Structures, Algorithms (C++), and dynamic programming paradigms",
        "Organized flagship campus hackathons with industry mentors and sponsored project tracks",
        "Curated contest problems on internal judges and cultivated competitive programming culture",
      ],
      type: "leadership",
    },
    {
      id: "iiit-raichur-degree",
      organization: "INDIAN INSTITUTE OF INFORMATION TECHNOLOGY RAICHUR",
      role: "B.Tech in Artificial Intelligence & Data Science",
      period: "2023 – 2027",
      location: "Raichur, Karnataka, India",
      description:
        "Rigorous coursework in Operating Systems, Database Management Systems, Computer Networks, Machine Learning, Deep Learning, and Distributed Computing. Current CGPA: 7.08 / 10.",
      highlights: [
        "Core Coursework: Advanced Algorithms, AI/ML, System Design, Operating Systems, Cloud Computing",
        "Undergraduate competitive programming enthusiast with 500+ solved algorithmic challenges",
      ],
      type: "education",
    },
  ],

  about: {
    paragraphs: [
      "I'm an undergraduate engineer at IIIT Raichur (graduating 2027) with an intense curiosity for how distributed software handles load and how modern language models can be grounded into reliable, real-world tools.",
      "Most of my work sits at the intersection of robust backend infrastructure and applied AI—building asynchronous streaming pipelines, low-latency APIs, and deterministic evaluation harnesses instead of fragile demos.",
      "When I am not designing architectures or profiling database queries, I spend my evenings sharpening algorithmic problem solving in C++ or helping organize tech initiatives at college.",
    ],
    competitiveProgramming: {
      rating: "~1825",
      rankingPercentile: "Top ~7%",
      solvedProblemsCount: "500+",
      primaryLanguage: "C++ (STL, Graph Algorithms, DP)",
      platformSummary: "Consistently competing across LeetCode, Codeforces, and CodeChef.",
      platforms: [
        {
          name: "LeetCode",
          handle: "Anilkumar7877",
          url: "https://leetcode.com/u/Anilkumar7877", // PLACEHOLDER: Verify your handle
          metric: "Knight / Rating ~1825 (Top 7%)",
        },
        {
          name: "Codeforces",
          handle: "Anilkumar7877",
          url: "https://codeforces.com/profile/Anilkumar7877", // PLACEHOLDER: Verify your handle
          metric: "Specialist / 500+ Solved",
        },
        {
          name: "GitHub",
          handle: "Anilkumar7877",
          url: "https://github.com/Anilkumar7877",
          metric: "Active Repositories & OSS",
        },
      ],
    },
    technicalStrengths: [
      {
        category: "Languages",
        skills: ["C++", "Python", "TypeScript", "JavaScript", "SQL", "Go (Basics)"],
      },
      {
        category: "Backend & Systems",
        skills: ["FastAPI", "Node.js", "Express", "RESTful APIs", "WebSockets", "Redis", "PostgreSQL", "Prisma"],
      },
      {
        category: "AI & Data Engineering",
        skills: ["LangChain", "LangGraph", "ChromaDB", "Groq Whisper/Llama", "Cartesia TTS", "Silero VAD", "RAGAS"],
      },
      {
        category: "DevOps & Cloud",
        skills: ["Docker", "Kubernetes (EKS)", "Terraform", "AWS (EC2, S3, IAM)", "Jenkins", "Linux/Bash", "Git"],
      },
    ],
  },

  contact: {
    headline: "Let's build something extraordinary together.",
    subheadline:
      "I'm actively seeking Software Engineering / Backend / AI Engineering internships and full-time opportunities (Class of 2027). Whether you have a challenging project, an open role, or just want to chat systems and algorithms, my inbox is open.",
    availability: "Available for Summer 2025/2026 Internships & New Grad 2027 Roles",
  },
};
