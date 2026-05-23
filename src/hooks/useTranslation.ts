/* ============================================
 * useTranslation — Core Translation Logic Hook
 * ============================================
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TranslationState, TranslationTone, HistoryEntry } from "@/types";
import { generateId } from "@/lib/utils";
import { LIMITS } from "@/lib/constants";

interface UseTranslationReturn {
  state: TranslationState;
  setSourceText: (text: string) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setTone: (tone: TranslationTone) => void;
  translate: (forcedTone?: TranslationTone) => Promise<HistoryEntry | null>;
  swapLanguages: () => void;
  clearAll: () => void;
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed.");
      }

      setTranslatedText(data.translatedText);
      setIsLoading(false);

      const historyEntry: HistoryEntry = {
        id: generateId(),
        sourceText: textVal,
        translatedText: data.translatedText,
        sourceLang: srcLangVal,
        targetLang: tgtLangVal,
        timestamp: Date.now(),
        provider: data.provider || "Unknown",
      };

      return historyEntry;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return null;
      }

      const message = err instanceof Error ? err.message : "Translation failed.";
      setError(message);
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
  }, []);

  const state: TranslationState = {
    sourceText,
    translatedText,
    sourceLang,
    targetLang,
    tone,
    isLoading,
    error,
  };

  return {
    state,
    setSourceText,
    setSourceLang,
    setTargetLang,
    setTone,
    translate,
    swapLanguages,
    clearAll,
  };
}
