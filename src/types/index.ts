/* ============================================
 * LinguaFlow AI — TypeScript Type Definitions
 * ============================================
 * 
 * WHY DO WE NEED THIS FILE?
 * -------------------------
 * TypeScript types are like "contracts" for our data.
 * They tell the compiler (and other developers) exactly
 * what shape our data should have.
 * 
 * Think of it like a form template:
 * - A "Translation" must have sourceText, targetText, etc.
 * - If you forget a required field, TypeScript will warn you
 *   BEFORE the app even runs. This prevents bugs!
 * 
 * INDUSTRY PRACTICE:
 * - Types are always kept in a separate file/folder
 * - This makes them reusable across the entire app
 * - It's the "single source of truth" for data shapes
 */

// ─── Language ────────────────────────────────────────────
// Represents a single language option in our dropdowns
export interface Language {
  code: string;       // ISO 639-1 code, e.g., "en", "hi", "es"
  name: string;       // English name, e.g., "English", "Hindi"
  nativeName: string; // Name in that language, e.g., "हिन्दी", "Español"
}

// ─── Translation Request ─────────────────────────────────
// What we send TO the API when requesting a translation
export interface TranslationRequest {
  text: string;           // The text to translate
  sourceLang: string;     // Source language code (e.g., "en")
  targetLang: string;     // Target language code (e.g., "es")
  tone?: TranslationTone; // Optional tone adjustment
}

// ─── Translation Response ────────────────────────────────
// What we get BACK from the API after translation
export interface TranslationResponse {
  translatedText: string;     // The translated result
  detectedLanguage?: string;  // If auto-detect was used
  confidence?: number;        // How confident the detection was (0-1)
  provider: string;           // Which API provided the translation
}

// ─── History Entry ───────────────────────────────────────
// A saved translation in the user's history (stored in localStorage)
export interface HistoryEntry {
  id: string;              // Unique identifier (timestamp-based)
  sourceText: string;      // Original text
  translatedText: string;  // Translated result
  sourceLang: string;      // Source language code
  targetLang: string;      // Target language code
  timestamp: number;       // When this translation was made (Unix ms)
  provider: string;        // Which API was used
}

// ─── Toast Notification ──────────────────────────────────
// Controls the toast popup messages (success, error, etc.)
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;        // Unique ID for this toast
  message: string;   // What to display
  type: ToastType;   // Color/icon style
  duration?: number; // How long to show (ms), default 3000
}

// ─── Translation Tone ────────────────────────────────────
// AI tone adjustment options
export type TranslationTone = "default" | "formal" | "casual" | "professional" | "friendly";

// ─── Translation State ──────────────────────────────────
// The complete state of the translation UI
export interface TranslationState {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  tone: TranslationTone;
  isLoading: boolean;
  error: string | null;
}

// ─── API Error ───────────────────────────────────────────
// Standardized error shape for API responses
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
