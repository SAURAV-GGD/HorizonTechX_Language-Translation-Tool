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
 * If we call translation providers directly from components, switching
 * providers means editing many files. With this service, components only
 * ever call translateText(). Swap providers here, in ONE place. This is
 * the "Adapter Pattern" / "Service Layer".
 *
 * ⚠️  SERVER-ONLY MODULE
 * ----------------------
 * This file reads server-side secrets (DEEPL_API_KEY, etc.) and is only
 * imported by API route handlers (/api/translate, /api/detect). It must
 * NEVER be imported into a Client Component, or the keys could leak.
 *
 * STRATEGY: 3-TIER PROVIDER WATERFALL
 * -----------------------------------
 * We try providers in order of quality, falling through on any failure:
 *   1. DeepL          — Google-Translate-level quality (primary)
 *   2. MyMemory       — decent, free with email (fallback)
 *   3. LibreTranslate — open-source, last resort
 * If all three fail we throw a single descriptive error.
 */

import { TranslationRequest, TranslationResponse } from "@/types";
import { API_URLS, LIMITS, TRANSLATION_TIMEOUT_MS } from "./constants";
import { getDeeplCode } from "./languages";
import { applyTone } from "./toneStyler";

// ─── Env helpers (read once, tolerate legacy names) ─────
// We support both the new env names from the spec and the older
// NEXT_PUBLIC_* names so existing local setups keep working.
function getDeeplKey(): string {
  return (process.env.DEEPL_API_KEY || "").trim();
}

function getMyMemoryEmail(): string | undefined {
  const email = process.env.MYMEMORY_EMAIL || process.env.NEXT_PUBLIC_MYMEMORY_EMAIL;
  return email?.trim() || undefined;
}

function getLibreUrl(): string {
  return (
    process.env.LIBRE_TRANSLATE_URL ||
    process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL ||
    API_URLS.LIBRETRANSLATE_DEFAULT
  ).replace(/\/+$/, ""); // strip trailing slash
}

function getLibreKey(): string {
  return (process.env.LIBRE_TRANSLATE_API_KEY || process.env.LIBRETRANSLATE_API_KEY || "").trim();
}

// Free DeepL keys end in ":fx" and must hit the api-free host.
function getDeeplEndpoint(key: string): string {
  return key.endsWith(":fx") ? API_URLS.DEEPL_FREE : API_URLS.DEEPL_PRO;
}

// ─── fetch() with an AbortController timeout ────────────
/**
 * A slow upstream must never hang the whole waterfall. We race each
 * request against a timeout; on timeout the request is aborted and the
 * caller's try/catch falls through to the next provider.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs: number = TRANSLATION_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Main Translation Function ──────────────────────────
/**
 * Translate text from one language to another using the provider waterfall,
 * then apply the requested "vibe" (tone) as a deterministic post-processing
 * pass on the translated text.
 *
 * WHY POST-PROCESS THE TONE (not ask the provider)?
 * Neural MT engines translate MEANING — they don't rewrite text into Gen-Z
 * slang, ANGRY shouting, pirate speak, etc. So the personality is applied
 * here, after translation, by lib/toneStyler.ts (which is multi-language
 * safe — see that file). "default" tone leaves the text untouched.
 *
 * @param request - { text, sourceLang, targetLang, tone? }
 * @returns Promise<TranslationResponse>
 * @throws Error if all providers fail (or input is invalid)
 */
export async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  const { text, sourceLang, targetLang, tone } = request;

  // ── Input Validation ──────────────────────────────
  if (!text.trim()) {
    throw new Error("Please enter some text to translate.");
  }

  if (text.length > LIMITS.MAX_CHARS) {
    throw new Error(`Text is too long. Maximum ${LIMITS.MAX_CHARS} characters allowed.`);
  }

  // Same language (and not auto-detect) → nothing to translate, but we still
  // apply the vibe so users can "style" text without changing its language.
  if (sourceLang === targetLang && sourceLang !== "auto") {
    return { translatedText: applyTone(text, tone), provider: "none" };
  }

  const result = await runProviderWaterfall(text, sourceLang, targetLang);

  // Apply the chosen vibe to the freshly-translated text.
  return { ...result, translatedText: applyTone(result.translatedText, tone) };
}

// ─── Provider Waterfall ─────────────────────────────────
/**
 * Try each translation provider in quality order, falling through on any
 * failure. Returns the raw (un-styled) translation; tone styling is applied
 * by the caller (translateText).
 */
async function runProviderWaterfall(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse> {
  // ── Tier 1: DeepL ─────────────────────────────────
  // Only attempt DeepL when a key is configured AND DeepL supports the
  // target language (skip e.g. Hindi/Tamil straight to MyMemory).
  if (getDeeplKey() && getDeeplCode(targetLang)) {
    try {
      console.warn("[Translation] Trying provider: deepl");
      return await translateWithDeepL(text, sourceLang, targetLang);
    } catch (deeplError) {
      console.warn(
        "[Translation] DeepL failed, falling back to MyMemory:",
        deeplError instanceof Error ? deeplError.message : deeplError
      );
    }
  }

  // ── Tier 2: Google (free public endpoint, no key) ─
  // Reliable + fast, supports every language in our list (incl. Hindi
  // and other Indian languages DeepL can't do). This is the de-facto
  // primary when no DeepL key is configured.
  try {
    console.warn("[Translation] Trying provider: google");
    return await translateWithGoogle(text, sourceLang, targetLang);
  } catch (googleError) {
    console.warn(
      "[Translation] Google failed, falling back to MyMemory:",
      googleError instanceof Error ? googleError.message : googleError
    );
  }

  // ── Tier 3: MyMemory ──────────────────────────────
  try {
    console.warn("[Translation] Trying provider: mymemory");
    return await translateWithMyMemory(text, sourceLang, targetLang);
  } catch (myMemoryError) {
    console.warn(
      "[Translation] MyMemory failed, falling back to LibreTranslate:",
      myMemoryError instanceof Error ? myMemoryError.message : myMemoryError
    );
  }

  // ── Tier 4: LibreTranslate ────────────────────────
  try {
    console.warn("[Translation] Trying provider: libretranslate");
    return await translateWithLibreTranslate(text, sourceLang, targetLang);
  } catch (libreError) {
    console.warn(
      "[Translation] LibreTranslate also failed:",
      libreError instanceof Error ? libreError.message : libreError
    );
  }

  // ── All providers failed ──────────────────────────
  throw new Error("All translation providers failed. Please try again.");
}

// ─── Provider 1: DeepL ──────────────────────────────────
/**
 * DeepL API v2. Free keys (":fx" suffix) hit api-free.deepl.com.
 *
 * Request body (JSON):
 *   { text: [string], target_lang: "DE", source_lang?: "EN" }
 * Response:
 *   { translations: [{ detected_source_language: "EN", text: "..." }] }
 *
 * Status 456 = quota exceeded → throw so the waterfall falls through.
 *
 * NOTE: "tone" is NOT sent to DeepL — our tones are fun stylistic vibes
 * applied after translation (see lib/toneStyler.ts), not formality shifts.
 */
async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse> {
  const key = getDeeplKey();
  if (!key) throw new Error("DeepL API key not configured");

  const targetDeepl = getDeeplCode(targetLang);
  if (!targetDeepl) throw new Error(`DeepL does not support target language: ${targetLang}`);

  const body: Record<string, unknown> = {
    text: [text],
    target_lang: targetDeepl,
  };

  // Only send source_lang when known AND DeepL supports it; otherwise let
  // DeepL auto-detect (omitting the param).
  if (sourceLang !== "auto") {
    const sourceDeepl = getDeeplCode(sourceLang);
    if (sourceDeepl) body.source_lang = sourceDeepl;
  }

  const response = await fetchWithTimeout(getDeeplEndpoint(key), {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 456) {
    throw new Error("DeepL quota exceeded (456)");
  }

  if (!response.ok) {
    throw new Error(`DeepL API error: ${response.status}`);
  }

  const data = await response.json();
  const result = data?.translations?.[0];

  if (!result?.text) {
    throw new Error("DeepL returned no translation");
  }

  return {
    translatedText: result.text,
    detectedLanguage: result.detected_source_language
      ? String(result.detected_source_language).toLowerCase()
      : undefined,
    provider: "deepl",
  };
}

// ─── Provider 2: Google (free public endpoint) ──────────
/**
 * Google's unofficial public translate endpoint (the one used by the
 * web widget). No API key required, generous limits, and it supports
 * every language in our list — including the Indian languages DeepL
 * doesn't cover. Used as the de-facto primary when DeepL isn't set up.
 *
 * EXAMPLE:
 *   GET https://translate.googleapis.com/translate_a/single
 *       ?client=gtx&sl=auto&tl=hi&dt=t&q=Hello
 *
 * Response is a nested array; the translated chunks live in data[0],
 * each chunk being [translatedText, originalText, ...]. We join the
 * chunk texts to rebuild the full translation.
 */
async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse> {
  const params = new URLSearchParams({
    client: "gtx",
    sl: sourceLang === "auto" ? "auto" : sourceLang,
    tl: targetLang,
    dt: "t",
    q: text,
  });

  const response = await fetchWithTimeout(
    `${API_URLS.GOOGLE}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Google API error: ${response.status}`);
  }

  const data = await response.json();

  // data[0] is an array of [translatedChunk, originalChunk, ...] tuples.
  const chunks = data?.[0];
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("Google returned no translation");
  }

  const translatedText = chunks
    .map((chunk: unknown[]) => (Array.isArray(chunk) ? chunk[0] : ""))
    .join("");

  if (!translatedText.trim()) {
    throw new Error("Google returned an empty translation");
  }

  // data[2] holds the detected source language code (e.g. "en").
  const detected = typeof data?.[2] === "string" ? data[2] : undefined;

  return {
    translatedText,
    detectedLanguage: detected,
    provider: "google",
  };
}

// ─── Provider 3: MyMemory ───────────────────────────────
/**
 * MyMemory: simple GET with query params. No key needed; adding an email
 * (`de` param) raises the daily quota substantially.
 *
 * EXAMPLE:
 *   GET https://api.mymemory.translated.net/get?q=Hello&langpair=en|es
 */
async function translateWithMyMemory(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse> {
  const params = new URLSearchParams({
    q: text,
    // Empty/"autodetect" source lets MyMemory detect the language.
    langpair: `${sourceLang === "auto" ? "autodetect" : sourceLang}|${targetLang}`,
  });

  const email = getMyMemoryEmail();
  if (email) {
    params.set("de", email);
  }

  const response = await fetchWithTimeout(`${API_URLS.MYMEMORY}?${params.toString()}`);

  // Treat explicit rate-limit responses as a fall-through signal.
  if (response.status === 429) {
    throw new Error("MyMemory rate limit (429)");
  }

  if (!response.ok) {
    throw new Error(`MyMemory API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
    throw new Error(data.responseDetails || "MyMemory translation failed");
  }

  // MyMemory sometimes returns quota warnings as the "translation".
  const translated: string = data.responseData.translatedText;
  if (
    translated.includes("MYMEMORY WARNING") ||
    translated.includes("QUERY LENGTH LIMIT EXCEEDED") ||
    translated.includes("PLEASE CONTACT")
  ) {
    throw new Error("MyMemory quota/limit reached");
  }

  return {
    translatedText: translated,
    detectedLanguage: data.responseData.detectedLanguage || undefined,
    confidence: data.responseData.match || undefined,
    provider: "mymemory",
  };
}

// ─── Provider 4: LibreTranslate ─────────────────────────
/**
 * LibreTranslate: open-source, POST with JSON body.
 * Endpoint comes from LIBRE_TRANSLATE_URL (or the public default).
 */
async function translateWithLibreTranslate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse> {
  const apiKey = getLibreKey();

  const body: Record<string, string> = {
    q: text,
    source: sourceLang === "auto" ? "auto" : sourceLang,
    target: targetLang,
    format: "text",
  };

  if (apiKey) {
    body.api_key = apiKey;
  }

  const response = await fetchWithTimeout(`${getLibreUrl()}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `LibreTranslate error: ${response.status}`);
  }

  const data = await response.json();

  if (!data?.translatedText) {
    throw new Error("LibreTranslate returned no translation");
  }

  return {
    translatedText: data.translatedText,
    detectedLanguage: data.detectedLanguage?.language,
    confidence: data.detectedLanguage?.confidence,
    provider: "libretranslate",
  };
}

// ─── Language Detection ─────────────────────────────────
/**
 * Detect the language of a given text.
 *   Primary:  DeepL — translate a sample to EN and read back
 *             `detected_source_language`.
 *   Fallback: MyMemory autodetect.
 *
 * @returns { detectedLang (ISO lowercase), confidence (0-1), provider }
 */
export async function detectLanguage(
  text: string
): Promise<{ detectedLang: string; confidence: number; provider: string }> {
  const sample = text.slice(0, 200).trim();
  if (!sample) {
    return { detectedLang: "en", confidence: 0, provider: "none" };
  }

  // ── Primary: DeepL ────────────────────────────────
  const key = getDeeplKey();
  if (key) {
    try {
      const response = await fetchWithTimeout(getDeeplEndpoint(key), {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: [sample], target_lang: "EN" }),
      });

      if (response.ok) {
        const data = await response.json();
        const detected = data?.translations?.[0]?.detected_source_language;
        if (detected) {
          return {
            detectedLang: String(detected).toLowerCase(),
            confidence: 1,
            provider: "deepl",
          };
        }
      }
    } catch {
      console.warn("[Detect] DeepL detection failed, trying MyMemory");
    }
  }

  // ── Fallback: MyMemory autodetect ─────────────────
  try {
    const params = new URLSearchParams({
      q: text.slice(0, 100),
      langpair: "autodetect|en",
    });
    const email = getMyMemoryEmail();
    if (email) params.set("de", email);

    const response = await fetchWithTimeout(`${API_URLS.MYMEMORY}?${params.toString()}`);
    const data = await response.json();

    const detected = data?.responseData?.detectedLanguage;
    if (detected) {
      return {
        detectedLang: String(detected).toLowerCase(),
        confidence: data.responseData.match || 0.5,
        provider: "mymemory",
      };
    }
  } catch {
    console.warn("[Detect] MyMemory detection failed");
  }

  return { detectedLang: "en", confidence: 0, provider: "none" };
}
