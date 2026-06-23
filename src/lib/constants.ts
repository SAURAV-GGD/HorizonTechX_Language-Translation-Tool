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
  // DeepL: PRIMARY provider (Google-Translate-level quality).
  // Free keys end in ":fx" and use the api-free host; Pro keys use api.deepl.com.
  // The service picks the right host from the key suffix at runtime.
  // Docs: https://developers.deepl.com/api-reference/translate
  DEEPL_FREE: "https://api-free.deepl.com/v2/translate",
  DEEPL_PRO: "https://api.deepl.com/v2/translate",

  // Google: free public translate endpoint (no key needed). De-facto
  // PRIMARY when no DeepL key is set — reliable, fast, supports every
  // language in our list (including Indian languages DeepL can't do).
  GOOGLE: "https://translate.googleapis.com/translate_a/single",

  // MyMemory: FALLBACK translation API (free, no key needed).
  // Docs: https://mymemory.translated.net/doc/spec.php
  MYMEMORY: "https://api.mymemory.translated.net/get",

  // LibreTranslate: LAST-RESORT open-source provider.
  // Default public instance; override via LIBRE_TRANSLATE_URL.
  // (libretranslate.de is frequently down; libretranslate.com is the
  // maintained public host.)
  LIBRETRANSLATE_DEFAULT: "https://libretranslate.com",
} as const;
// "as const" makes this object deeply readonly — you can't
// accidentally change these values at runtime.

// ─── Provider Display Labels ────────────────────────────
// Maps the lowercase provider keys returned by the API to the
// human-friendly names shown in the output badge.
export const PROVIDER_LABELS: Record<string, string> = {
  deepl: "DeepL",
  google: "Google",
  mymemory: "MyMemory",
  libretranslate: "LibreTranslate",
  none: "Direct",
};

// Providers considered "fallback" quality — used to surface a subtle
// "premium unavailable" hint in the UI.
export const FALLBACK_PROVIDERS = ["mymemory", "libretranslate"] as const;

// ─── Network / Abuse Protection ─────────────────────────
// Per-provider fetch timeout (AbortController) so a slow upstream
// never hangs the whole waterfall.
export const TRANSLATION_TIMEOUT_MS = 15000;

// In-memory rate limit applied per client IP in the translate route.
// Protects the DeepL free-tier quota from abuse.
export const RATE_LIMIT = {
  WINDOW_MS: 60_000, // 1 minute window
  MAX_REQUESTS: 30,  // max requests per IP per window
} as const;

// ─── App Limits ─────────────────────────────────────────
export const LIMITS = {
  MAX_CHARS: 5000,           // Maximum characters per translation
  MAX_HISTORY: 50,           // Maximum saved history entries
  DEBOUNCE_MS: 500,          // Delay before auto-translate triggers
  TOAST_DURATION: 3000,      // Toast notification display time (ms)
  MYMEMORY_MAX_BYTES: 500,   // MyMemory API limit per request
} as const;

// ─── App Metadata ───────────────────────────────────────
export const APP_NAME = "LinguaFlow AI";
export const APP_DESCRIPTION = "AI-Powered Language Translation Tool — Translate text between 25+ languages instantly with smart features like voice input, tone adjustment, and translation history.";
