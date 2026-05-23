/* ============================================
 * LinguaFlow AI — Application Constants
 * ============================================
 * 
 * WHY CONSTANTS IN A SEPARATE FILE?
 * ----------------------------------
 * Imagine you have the number 5000 scattered across
 * 10 different files. Now you need to change it to 3000.
 * You'd have to find and update ALL 10 places!
 * 
 * Instead, we define it ONCE here as MAX_CHARS = 5000.
 * Every file imports this constant. Change it in ONE place,
 * and it updates everywhere. This is called the
 * "Single Source of Truth" principle.
 * 
 * INDUSTRY PRACTICE:
 * - Magic numbers (random numbers in code) are a code smell
 * - Named constants make code self-documenting
 * - Constants files are standard in professional codebases
 */

// ─── API Configuration ─────────────────────────────────
export const API_URLS = {
  // MyMemory: Free translation API, no key needed
  // Docs: https://mymemory.translated.net/doc/spec.php
  MYMEMORY: "https://api.mymemory.translated.net/get",

  // LibreTranslate: Open-source fallback
  // Can be self-hosted or use public instances
  LIBRETRANSLATE: process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL || "https://libretranslate.com",
} as const;
// "as const" makes this object deeply readonly — you can't
// accidentally change these values at runtime.

// ─── App Limits ─────────────────────────────────────────
export const LIMITS = {
  MAX_CHARS: 5000,           // Maximum characters per translation
  MAX_HISTORY: 50,           // Maximum saved history entries
  DEBOUNCE_MS: 800,          // Delay before auto-translate triggers
  TOAST_DURATION: 3000,      // Toast notification display time (ms)
  MYMEMORY_MAX_BYTES: 500,   // MyMemory API limit per request
} as const;

// ─── Animation Durations ────────────────────────────────
// Keeping animation timings consistent across the app
export const ANIMATION = {
  FAST: 0.15,      // Quick micro-interactions (button clicks)
  NORMAL: 0.3,     // Standard transitions (panel open/close)
  SLOW: 0.5,       // Dramatic entrances (page load animations)
  SPRING: {        // Spring physics for bouncy animations
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  },
} as const;

// ─── App Metadata ───────────────────────────────────────
export const APP_NAME = "LinguaFlow AI";
export const APP_DESCRIPTION = "AI-Powered Language Translation Tool — Translate text between 25+ languages instantly with smart features like voice input, tone adjustment, and translation history.";
export const APP_VERSION = "1.0.0";
