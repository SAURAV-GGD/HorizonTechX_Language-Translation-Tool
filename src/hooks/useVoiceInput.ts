/* ============================================
 * useVoiceInput — Voice Recognition Hook
 * ============================================
 * 
 * WHAT IS THE WEB SPEECH API?
 * ───────────────────────────
 * Modern browsers have a built-in speech recognition system.
 * You talk into your microphone, and it converts your voice
 * to text. No external API needed!
 * 
 * BROWSER SUPPORT:
 * - Chrome: Full support ✅
 * - Edge: Full support ✅
 * - Safari: Partial support ⚠️
 * - Firefox: Limited support ❌
 * 
 * That's why we check for support before trying to use it.
 */

"use client";

import { useState, useCallback, useRef, useSyncExternalStore } from "react";

interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: (lang?: string) => void;
  stopListening: () => void;
}

// TypeScript doesn't have built-in types for Web Speech API
// so we declare them here
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

// Browser speech-recognition support is a fixed fact about the current
// browser, read via useSyncExternalStore so the server snapshot (false)
// hydrates cleanly with no extra mount render. The subscribe is a no-op
// because support never changes at runtime.
const noopSubscribe = () => () => {};
const getSupportSnapshot = () =>
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);

  const isSupported = useSyncExternalStore(
    noopSubscribe,
    getSupportSnapshot,
    () => false
  );

  const startListening = useCallback((lang: string = "en-US") => {
    if (!isSupported) return;

    const recognition = createRecognition();
    if (!recognition) return;

    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript("");
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
  };
}

// Helper to create a SpeechRecognition instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createRecognition(): any {
  if (typeof window === "undefined") return null;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) return null;
  
  return new SpeechRecognition();
}
