/* ============================================
 * LinguaFlow AI — Supported Languages
 * ============================================
 *
 * This file contains ALL languages our app supports.
 * Each language has these properties:
 *   - code: ISO 639-1 standard code (used by APIs)
 *   - name: English name (for display in UI)
 *   - nativeName: How speakers of that language call it
 *   - deeplCode: Uppercase DeepL code (OPTIONAL — see note below)
 *
 * WHY ISO 639-1 CODES?
 * --------------------
 * ISO 639-1 is an international standard for language codes.
 * Every translation API (Google, DeepL, MyMemory) uses these
 * same codes. Using a standard means our app can switch
 * between different APIs without changing language codes.
 *
 * Think of it like phone country codes: +91 is always India,
 * no matter which phone company you use. Similarly, "hi" is
 * always Hindi, no matter which translation API you use.
 *
 * DEEPL SUPPORT NOTE:
 * -------------------
 * `deeplCode` is the uppercase code DeepL expects (e.g. "FR").
 * Languages WITHOUT a `deeplCode` are NOT supported by DeepL — the
 * translation service detects this and skips DeepL for them, going
 * straight to MyMemory. Most Indian languages (Hindi, Bengali, Tamil…),
 * Thai, and Vietnamese fall into this "no DeepL" bucket.
 */

import { Language } from "@/types";

export const LANGUAGES: Language[] = [
  { code: "auto", name: "Auto Detect", nativeName: "🔍 Auto Detect" },
  { code: "en", name: "English", nativeName: "English", deeplCode: "EN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español", deeplCode: "ES" },
  { code: "fr", name: "French", nativeName: "Français", deeplCode: "FR" },
  { code: "de", name: "German", nativeName: "Deutsch", deeplCode: "DE" },
  { code: "it", name: "Italian", nativeName: "Italiano", deeplCode: "IT" },
  { code: "pt", name: "Portuguese", nativeName: "Português", deeplCode: "PT" },
  { code: "ru", name: "Russian", nativeName: "Русский", deeplCode: "RU" },
  { code: "ja", name: "Japanese", nativeName: "日本語", deeplCode: "JA" },
  { code: "ko", name: "Korean", nativeName: "한국어", deeplCode: "KO" },
  { code: "zh", name: "Chinese", nativeName: "中文", deeplCode: "ZH" },
  { code: "ar", name: "Arabic", nativeName: "العربية", deeplCode: "AR" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", deeplCode: "NL" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", deeplCode: "TR" },
  { code: "pl", name: "Polish", nativeName: "Polski", deeplCode: "PL" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", deeplCode: "SV" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", deeplCode: "ID" },
];

/**
 * Get all languages EXCEPT "Auto Detect".
 * Used for the TARGET language dropdown (you can't translate TO "auto").
 */
export function getTargetLanguages(): Language[] {
  return LANGUAGES.filter((lang) => lang.code !== "auto");
}

/**
 * Find a language by its ISO 639-1 code (e.g. "hi" → the Hindi entry),
 * or undefined if we don't support that code.
 */
// Internal helper — only used by getDeeplCode below, so not exported.
function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Resolve the DeepL uppercase code for an ISO code, or null if DeepL
 * does not support that language.
 *
 * The translation service uses this to decide whether to attempt DeepL
 * at all — if it returns null (e.g. for "hi"), DeepL is skipped and the
 * waterfall falls through to MyMemory.
 *
 * Example: getDeeplCode("fr") → "FR"   |   getDeeplCode("hi") → null
 */
export function getDeeplCode(code: string): string | null {
  return getLanguageByCode(code)?.deeplCode ?? null;
}
