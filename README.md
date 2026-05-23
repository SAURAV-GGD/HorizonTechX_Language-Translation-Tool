# 🌐 LINGUAFLOW AI — PRODUCTION-GRADE TRANSLATION PLATFORM

LinguaFlow AI is a modern, responsive language translation web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

The platform is designed to provide high-performance neural machine translation with robust offline-ready features, a multi-provider fallback strategy, and a premium glassmorphic user experience.

---

## ✨ Features

### Core Capabilities
*   **Neural Translation:** High-speed translation leveraging deep learning engines.
*   **Dual-Provider Fallback:** Automatically tries the MyMemory API first (no API key required), falling back to a configured LibreTranslate API if rate limits are hit.
*   **AI Tone Adjustments:** Appends custom styling prompts (Standard, Formal, Casual, Professional, Friendly) to translations.
*   **Auto-Language Detection:** Automatically identifies the source language.
*   **Voice Input Typing:** Hands-free voice typing via the browser's built-in Web Speech API.
*   **Text-to-Speech (TTS):** Dynamic vocal playback of translated outputs.
*   **History Logs Caching:** Caches up to 50 translation logs locally in the browser's LocalStorage sandbox.
*   **Download & Export:** Programmatically exports translations as `.txt` files.
*   **Modern SaaS Interface:** Premium glassmorphic cards, custom loaders, responsive mobile-first grid styling, and animated gradient mesh backgrounds.
*   **Dynamic Theming:** Instant, flicker-free light and dark mode toggling.

---

## 🛠️ Tech Stack & Architecture

*   **Core Framework:** Next.js 15 (App Router)
*   **Type Safety:** TypeScript 5+
*   **Styling Engine:** Tailwind CSS v4 (using CSS variables for dynamic theming)
*   **Animation System:** Framer Motion (providing spring physics and layout transitions)
*   **Icon Library:** Lucide React
*   **APIs:** MyMemory Translation API + LibreTranslate API (Failover)
*   **Storage Sandbox:** Browser LocalStorage

---

## 📁 Repository Folder Structure

```
SAURAV_TASK/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router Pages & API Routes
│   │   ├── globals.css     # Tailwind directives, animations & custom variables
│   │   ├── layout.tsx      # Root layout, font definitions & theme flash script
│   │   ├── page.tsx        # Main page controller
│   │   └── api/
│   │       ├── translate/  # Secure API translation router
│   │       └── detect/     # Secure API language detection router
│   ├── components/         # Modular UI Components
│   │   ├── layout/         # Header & Footer wrapper sections
│   │   ├── translation/    # Input/Output text areas & selectors
│   │   ├── history/        # History panel & item logs
│   │   └── ui/             # Reusable UI primitives (GlassCard, Spinner, Toast)
│   ├── hooks/              # Custom React Hooks (State logic)
│   │   ├── useTranslation.ts  # Core API translation hook
│   │   ├── useHistory.ts      # LocalStorage cache hook
│   │   └── useVoiceInput.ts   # Web Speech recognition hook
│   ├── lib/                # Shared utilities & business logic services
│   │   ├── translationService.ts  # Multi-provider API strategy wrapper
│   │   ├── languages.ts           # Supported language models
│   │   └── utils.ts               # Clipboard, file download & TTS helpers
│   └── types/              # Unified TypeScript definitions
├── scripts/                # Utility scripts
│   └── run-graphify.sh     # Knowledge Graph mapping builder script
├── .env.example            # Template for environment variables
├── tsconfig.json           # TypeScript configuration compiler
├── package.json            # Scripts & project dependencies
│
│── Technical Reference Documentation ──
├── LEARNING_GUIDE.md        # Technical explanations & coding patterns guide
├── VIVA_PREPARATION.md      # Q&A cheat sheet for college Vivas and interviews
├── RESEARCH_PAPER_CONTENT.md # Structured, academic draft of the system paper
├── INTERNSHIP_REPORT.md     # Weekly logs, challenges & internship summaries
├── ARCHITECTURE_EXPLANATION.md # Component hierarchies & system diagrams
└── CODE_EXPLANATION.md      # Detailed file-by-file logic guide
```

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js (v18.0.0 or higher)** installed on your local machine.

### 2. Clone and Install Dependencies
Navigate to the project root directory and run the standard install command:
```bash
npm install
```

### 3. Start the Development Server
Launch the local dev server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to run the application!

### 4. (Optional) Run Graphify Project Mapping
To generate a queryable knowledge graph map of this codebase, run the custom build script:
```bash
bash scripts/run-graphify.sh
```

---

## ☁️ Deployment Guide

LinguaFlow AI is fully optimized for zero-configuration deployments on **Vercel** (the creators of Next.js):

1.  Push the project code to your **GitHub** repository using our automated push script:
    ```bash
    bash push.sh
    ```
2.  Log into the **[Vercel Dashboard](https://vercel.com)**.
3.  Click **"Add New Project"** and import your repository.
4.  (Optional) Add environment variables from your `.env.local` file (e.g., `NEXT_PUBLIC_MYMEMORY_EMAIL` for higher translation limits).
5.  Click **"Deploy"**. Vercel will automatically build the serverless API routes and host your frontend globally on edge servers!

# HorizonTechX_Language-Translation-Tool
