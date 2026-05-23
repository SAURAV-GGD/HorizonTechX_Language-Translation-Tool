/* ============================================
 * LinguaFlow AI — Translation Service
 * ============================================
 * 
 * WHAT IS A "SERVICE" IN SOFTWARE ARCHITECTURE?
 * ---------------------------------------------
 * A service is a module that handles a specific concern.
 * This service handles ALL translation-related API calls.
 * 
 * WHY ABSTRACT THE API?
 * If we call the MyMemory API directly from 5 different
 * components, and then want to switch to Google Translate,
 * we'd have to update 5 files.
 * 
 * With this service, all components call translateText().
 * If we switch APIs, we only change THIS file.
 * This is called the "Adapter Pattern" or "Service Layer".
 * 
 * STRATEGY: FALLBACK CHAIN
 * We try APIs in order of preference:
 * 1. MyMemory (free, no key needed)
 * 2. LibreTranslate (open source, if configured)
 * If all fail, we return a helpful error message.
 */

import { TranslationRequest, TranslationResponse } from "@/types";
import { API_URLS, LIMITS } from "./constants";

// ─── Main Translation Function ──────────────────────────
/**
 * Translate text from one language to another.
 * Tries MyMemory API first, falls back to LibreTranslate.
 * 
 * @param request - The translation request object
 * @returns Promise<TranslationResponse> - The translation result
 * @throws Error if all translation attempts fail
 */
export async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  const { text, sourceLang, targetLang } = request;

  // ── Input Validation ──────────────────────────────
  // Always validate input before making API calls.
  // This prevents unnecessary network requests and
  // gives users immediate feedback.
  if (!text.trim()) {
    throw new Error("Please enter some text to translate.");
  }

  if (text.length > LIMITS.MAX_CHARS) {
    throw new Error(`Text is too long. Maximum ${LIMITS.MAX_CHARS} characters allowed.`);
  }

  if (sourceLang === targetLang && sourceLang !== "auto") {
    // If source and target are the same, just return the text
    return {
      translatedText: text,
      provider: "none",
    };
  }

  // ── Try MyMemory API ──────────────────────────────
  try {
    const result = await translateWithMyMemory(text, sourceLang, targetLang);
    return result;
  } catch (myMemoryError) {
    console.warn("MyMemory failed, trying LibreTranslate...", myMemoryError);
  }

  // ── Try LibreTranslate (Fallback) ─────────────────
  try {
    const result = await translateWithLibreTranslate(text, sourceLang, targetLang);
    return result;
  } catch (libreError) {
    console.warn("LibreTranslate also failed.", libreError);
  }

  // ── All APIs Failed ───────────────────────────────
  throw new Error(
    "Translation failed. Please check your internet connection and try again."
  );
}

// ─── MyMemory API ───────────────────────────────────────
/**
 * HOW MyMemory API WORKS:
 * 
 * 1. It's a simple GET request with query parameters
 * 2. No API key needed (free tier: 5,000 chars/day)
 * 3. Language pair format: "en|es" (source|target)
 * 4. Returns JSON with the translation
 * 
 * EXAMPLE REQUEST:
 * GET https://api.mymemory.translated.net/get?q=Hello&langpair=en|es
 * 
 * EXAMPLE RESPONSE:
 * {
 *   "responseData": {
 *     "translatedText": "Hola",
 *     "match": 1
 *   },
 *   "responseStatus": 200
 * }
 */
async function translateWithMyMemory(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse> {
  // Build the API URL with query parameters
  const params = new URLSearchParams({
    q: text,
    langpair: `${sourceLang === "auto" ? "" : sourceLang}|${targetLang}`,
  });

  // Add email for higher rate limits (50K chars/day instead of 5K)
  const email = process.env.NEXT_PUBLIC_MYMEMORY_EMAIL;
  if (email) {
    params.set("de", email);
  }

  const url = `${API_URLS.MYMEMORY}?${params.toString()}`;

  /*
   * WHAT IS fetch()?
   * ────────────────
   * fetch() is the browser's built-in way to make HTTP requests.
   * It's like a postman — you give it a URL, it goes to that
   * server, gets data, and brings it back.
   * 
   * It returns a Promise, so we use "await" to wait for the response.
   * 
   * WHAT IS await?
   * ──────────────
   * When we call an API, the response takes time (network delay).
   * "await" pauses this function until the response arrives.
   * But it doesn't block the entire app — other code can still run.
   * 
   * Think of it like ordering food at a restaurant:
   * - await = you wait for YOUR order
   * - But other tables are being served simultaneously
   */
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`MyMemory API error: ${response.status}`);
  }

  const data = await response.json();

  // Check if the API returned a valid translation
  if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
    throw new Error(data.responseDetails || "MyMemory translation failed");
  }

  // Check for error messages disguised as translations
  const translated = data.responseData.translatedText;
  if (translated.includes("MYMEMORY WARNING") || 
      translated.includes("PLEASE CONTACT")) {
    throw new Error("MyMemory rate limit reached. Trying fallback...");
  }

  return {
    translatedText: translated,
    detectedLanguage: data.responseData.detectedLanguage || undefined,
    confidence: data.responseData.match || undefined,
    provider: "MyMemory",
  };
}

// ─── LibreTranslate API ─────────────────────────────────
/**
 * LibreTranslate is an open-source translation API.
 * It can be self-hosted (run on your own server) for free.
 * 
 * HOW IT WORKS:
 * 1. POST request with JSON body
 * 2. Requires: q (text), source (lang), target (lang)
 * 3. Optional: api_key for authenticated instances
 */
async function translateWithLibreTranslate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse> {
  const apiUrl = API_URLS.LIBRETRANSLATE;
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;

  const body: Record<string, string> = {
    q: text,
    source: sourceLang === "auto" ? "auto" : sourceLang,
    target: targetLang,
    format: "text",
  };

  if (apiKey) {
    body.api_key = apiKey;
  }

  const response = await fetch(`${apiUrl}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `LibreTranslate error: ${response.status}`
    );
  }

  const data = await response.json();

  return {
    translatedText: data.translatedText,
    detectedLanguage: data.detectedLanguage?.language,
    confidence: data.detectedLanguage?.confidence,
    provider: "LibreTranslate",
  };
}

// ─── Language Detection ─────────────────────────────────
/**
 * Detect the language of a given text.
 * Uses MyMemory with auto-detect, or LibreTranslate's /detect endpoint.
 */
export async function detectLanguage(
  text: string
): Promise<{ language: string; confidence: number }> {
  try {
    // Try MyMemory auto-detection by translating to English
    const params = new URLSearchParams({
      q: text.slice(0, 100), // Only need a sample for detection
      langpair: "|en",       // Empty source = auto-detect
    });

    const response = await fetch(`${API_URLS.MYMEMORY}?${params.toString()}`);
    const data = await response.json();

    if (data.responseData?.detectedLanguage) {
      return {
        language: data.responseData.detectedLanguage,
        confidence: data.responseData.match || 0.5,
      };
    }
  } catch {
    console.warn("MyMemory detection failed");
  }

  // Default fallback
  return { language: "en", confidence: 0 };
}
