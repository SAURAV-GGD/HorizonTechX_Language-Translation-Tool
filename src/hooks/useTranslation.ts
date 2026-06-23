/* ============================================
 * useTranslation — Core Translation Logic Hook
 * ============================================
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  TranslationState,
  TranslationTone,
  TranslationProvider,
  TranslationErrorType,
  HistoryEntry,
} from "@/types";
import { generateId } from "@/lib/utils";
import { LIMITS } from "@/lib/constants";

interface UseTranslationReturn {
  state: TranslationState;
  currentProvider: TranslationProvider | null;
  setSourceText: (text: string) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setTone: (tone: TranslationTone) => void;
  translate: (forcedTone?: TranslationTone) => Promise<HistoryEntry | null>;
  swapLanguages: () => void;
  clearAll: () => void;
}

// Shape of the JSON returned by /api/translate.
interface TranslateApiResponse {
  translatedText?: string;
  provider?: TranslationProvider;
  detectedSourceLang?: string | null;
  error?: string;
}

export function useTranslation(): UseTranslationReturn {
  // ─── Decoupled Hook States ──────────────────────────
  const [sourceText, setSourceTextState] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLangState] = useState("en");
  const [targetLang, setTargetLangState] = useState("hi");
  const [tone, setToneState] = useState<TranslationTone>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<TranslationErrorType | null>(null);
  const [provider, setProvider] = useState<TranslationProvider | null>(null);

  // ─── Parameter Refs to Decouple translate Callback ──
  const sourceTextRef = useRef(sourceText);
  const sourceLangRef = useRef(sourceLang);
  const targetLangRef = useRef(targetLang);
  const toneRef = useRef(tone);

  useEffect(() => { sourceTextRef.current = sourceText; }, [sourceText]);
  useEffect(() => { sourceLangRef.current = sourceLang; }, [sourceLang]);
  useEffect(() => { targetLangRef.current = targetLang; }, [targetLang]);
  useEffect(() => { toneRef.current = tone; }, [tone]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Setters ──────────────────────────────────────
  const setSourceText = useCallback((text: string) => {
    if (text.length > LIMITS.MAX_CHARS) return;
    setSourceTextState(text);
    setError(null);
    setErrorType(null);
  }, []);

  const setSourceLang = useCallback((lang: string) => {
    setSourceLangState(lang);
  }, []);

  const setTargetLang = useCallback((lang: string) => {
    setTargetLangState(lang);
  }, []);

  const setTone = useCallback((t: TranslationTone) => {
    setToneState(t);
  }, []);

  // ─── Translate Execution (Zero dependency ref loop!) ──
  const translate = useCallback(async (forcedTone?: TranslationTone): Promise<HistoryEntry | null> => {
    const textVal = sourceTextRef.current;
    const srcLangVal = sourceLangRef.current;
    const tgtLangVal = targetLangRef.current;
    const activeTone = forcedTone !== undefined ? forcedTone : toneRef.current;

    if (!textVal.trim()) {
      setTranslatedText("");
      setError(null);
      return null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setErrorType(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textVal,
          sourceLang: srcLangVal,
          targetLang: tgtLangVal,
          tone: activeTone,
        }),
        signal: controller.signal,
      });

      if (controller.signal.aborted) return null;

      const data: TranslateApiResponse = await response.json().catch(() => ({}));

      // ── Differentiated error handling ──────────────
      if (!response.ok) {
        const type: TranslationErrorType =
          response.status === 429
            ? "quota"
            : response.status === 400
            ? "invalid"
            : "generic";
        const fallbackMsg =
          type === "quota"
            ? "Too many requests — please slow down and try again shortly."
            : type === "invalid"
            ? "Invalid input. Please check your text and language selection."
            : "Translation failed. Please try again.";
        setError(data.error || fallbackMsg);
        setErrorType(type);
        setProvider(null);
        setIsLoading(false);
        return null;
      }

      const translated = data.translatedText ?? "";
      const usedProvider = (data.provider as TranslationProvider) || null;

      setTranslatedText(translated);
      setProvider(usedProvider);
      setError(null);
      setErrorType(null);
      setIsLoading(false);

      const historyEntry: HistoryEntry = {
        id: generateId(),
        sourceText: textVal,
        translatedText: translated,
        sourceLang: srcLangVal,
        targetLang: tgtLangVal,
        timestamp: Date.now(),
        provider: usedProvider || "Unknown",
      };

      return historyEntry;
    } catch (err) {
      // Aborted requests are intentional (debounce/superseded) — ignore.
      if (err instanceof Error && err.name === "AbortError") {
        return null;
      }

      // A thrown fetch (vs. a non-ok response) means a network failure.
      setError("Network error. Please check your connection and try again.");
      setErrorType("network");
      setProvider(null);
      setIsLoading(false);
      return null;
    }
  }, []);

  // ─── Real-Time Debounce auto-translator trigger ────
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!sourceText.trim()) {
      setTranslatedText("");
      setError(null);
      setErrorType(null);
      setProvider(null);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      translate("default");
    }, LIMITS.DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [sourceText, sourceLang, targetLang, translate]);

  // ─── Swap ─────────────────────────────────────────
  const swapLanguages = useCallback(() => {
    if (sourceLang === "auto") return;

    setSourceLangState(targetLang);
    setTargetLangState(sourceLang);
    setSourceTextState(translatedText);
    setTranslatedText(sourceText);
    // The displayed output is now the old input — its provider no longer applies.
    setProvider(null);
  }, [sourceLang, targetLang, sourceText, translatedText]);

  // ─── Clear ────────────────────────────────────────
  const clearAll = useCallback(() => {
    setSourceTextState("");
    setTranslatedText("");
    setSourceLangState("en");
    setTargetLangState("hi");
    setToneState("default");
    setIsLoading(false);
    setError(null);
    setErrorType(null);
    setProvider(null);
  }, []);

  const state: TranslationState = {
    sourceText,
    translatedText,
    sourceLang,
    targetLang,
    tone,
    isLoading,
    error,
    provider,
    errorType,
  };

  return {
    state,
    currentProvider: provider,
    setSourceText,
    setSourceLang,
    setTargetLang,
    setTone,
    translate,
    swapLanguages,
    clearAll,
  };
}
