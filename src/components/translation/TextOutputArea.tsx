/* ============================================
 * TextOutputArea — Translated Text Display
 * ============================================
 * 
 * Displays the translated text with action buttons:
 * - Copy to clipboard
 * - Text-to-speech
 * - Download as .txt file
 * 
 * Also shows loading and error states.
 */

"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Volume2,
  Download,
  AlertCircle,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { copyToClipboard, downloadAsTextFile, speakText } from "@/lib/utils";
import { PROVIDER_LABELS, FALLBACK_PROVIDERS } from "@/lib/constants";
import { TranslationProvider } from "@/types";

interface TextOutputAreaProps {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
  targetLang: string;
  provider: TranslationProvider | null;
  onCopySuccess: () => void;
  onCopyError: () => void;
}

export default function TextOutputArea({
  translatedText,
  isLoading,
  error,
  targetLang,
  provider,
  onCopySuccess,
  onCopyError,
}: TextOutputAreaProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Provider metadata for the output badge / fallback hint.
  const hasProvider = !!provider && provider !== "none";
  const providerLabel = provider ? PROVIDER_LABELS[provider] ?? provider : "";
  const isFallbackProvider =
    !!provider && (FALLBACK_PROVIDERS as readonly string[]).includes(provider);

  // ─── Copy to Clipboard ────────────────────────────
  async function handleCopy() {
    if (!translatedText) return;
    const success = await copyToClipboard(translatedText);
    if (success) {
      setIsCopied(true);
      onCopySuccess();
      // Reset copy icon after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      onCopyError();
    }
  }

  // ─── Text-to-Speech ──────────────────────────────
  async function handleSpeak() {
    if (!translatedText || isSpeaking) return;
    setIsSpeaking(true);
    try {
      await speakText(translatedText, targetLang);
    } catch (err) {
      console.warn("TTS failed:", err);
    }
    setIsSpeaking(false);
  }

  // ─── Download as .txt ─────────────────────────────
  function handleDownload() {
    if (!translatedText) return;
    downloadAsTextFile(translatedText, `translation-${targetLang}.txt`);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Output Area */}
      <div className="flex-1 p-4 min-h-[160px] relative">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && (
            <m.div
              key="loading"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner />
            </m.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <m.div
              key="error"
              className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </m.div>
          )}

          {/* Translated Text */}
          {translatedText && !isLoading && !error && (
            <m.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p
                className="text-base leading-relaxed whitespace-pre-wrap"
                style={{
                  color: "white",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {translatedText}
              </p>

              {/* Subtle hint when a fallback provider was used */}
              {isFallbackProvider && (
                <p className="mt-2 text-xs italic text-white/30">
                  Premium translation unavailable — using fallback provider.
                </p>
              )}
            </m.div>
          )}

          {/* Empty State */}
          {!translatedText && !isLoading && !error && (
            <m.p
              key="empty"
              className="text-base text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            >
              Translation will appear here...
            </m.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar — Action Buttons */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <m.button
            onClick={handleCopy}
            disabled={!translatedText}
            className="icon-btn !w-8 !h-8"
            whileTap={{ scale: 0.9 }}
            aria-label="Copy translation"
            title="Copy to clipboard"
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <m.div
                  key="check"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <Check className="w-4 h-4 text-emerald-500" />
                </m.div>
              ) : (
                <m.div
                  key="copy"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <Copy className="w-4 h-4" />
                </m.div>
              )}
            </AnimatePresence>
          </m.button>

          {/* TTS Button */}
          <m.button
            onClick={handleSpeak}
            disabled={!translatedText || isSpeaking}
            className={`icon-btn !w-8 !h-8 ${
              isSpeaking ? "!text-primary-500 !border-primary-500/30" : ""
            }`}
            whileTap={{ scale: 0.9 }}
            aria-label="Listen to translation"
            title="Text to speech"
          >
            <Volume2 className="w-4 h-4" />
          </m.button>

          {/* Download Button */}
          <m.button
            onClick={handleDownload}
            disabled={!translatedText}
            className="icon-btn !w-8 !h-8"
            whileTap={{ scale: 0.9 }}
            aria-label="Download translation"
            title="Download as text file"
          >
            <Download className="w-4 h-4" />
          </m.button>
        </div>

        {/* Provider Badge — shows which API translated the text */}
        {translatedText && (
          <m.span
            className="text-xs italic px-2 py-1 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.4)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            title={hasProvider ? `Translated by ${providerLabel}` : undefined}
          >
            {hasProvider ? `Translated by ${providerLabel} ✓` : "✨ Translated"}
          </m.span>
        )}
      </div>
    </div>
  );
}
