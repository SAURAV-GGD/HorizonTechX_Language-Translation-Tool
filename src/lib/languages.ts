/* ============================================
 * LinguaFlow AI — Supported Languages
 * ============================================
 * 
 * This file contains ALL languages our app supports.
 * Each language has three properties:
 *   - code: ISO 639-1 standard code (used by APIs)
 *   - name: English name (for display in UI)
 *   - nativeName: How speakers of that language call it
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
 */

import { Language } from "@/types";

export const LANGUAGES: Language[] = [
  { code: "auto", name: "Auto Detect", nativeName: "🔍 Auto Detect" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
];

/**
 * Get a language object by its code.
 * Returns undefined if the code is not found.
 * 
 * Example: getLanguageByCode("hi") → { code: "hi", name: "Hindi", nativeName: "हिन्दी" }
 */
export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Get all languages EXCEPT "Auto Detect".
 * Used for the TARGET language dropdown (you can't translate TO "auto").
 */
export function getTargetLanguages(): Language[] {
  return LANGUAGES.filter((lang) => lang.code !== "auto");
}
