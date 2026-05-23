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
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Volume2,
  Download,
  AlertCircle,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { copyToClipboard, downloadAsTextFile, speakText } from "@/lib/utils";

interface TextOutputAreaProps {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
  targetLang: string;
  onCopySuccess: () => void;
  onCopyError: () => void;
}

export default function TextOutputArea({
  translatedText,
  isLoading,
  error,
  targetLang,
  onCopySuccess,
  onCopyError,
}: TextOutputAreaProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
            <motion.div
              key="loading"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              key="error"
              className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Translated Text */}
          {translatedText && !isLoading && !error && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p
                className="text-base leading-relaxed whitespace-pre-wrap"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {translatedText}
              </p>
            </motion.div>
          )}

          {/* Empty State */}
          {!translatedText && !isLoading && !error && (
            <motion.p
              key="empty"
              className="text-base"
              style={{ color: "var(--text-muted)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            >
              Translation will appear here...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar — Action Buttons */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <motion.button
            onClick={handleCopy}
            disabled={!translatedText}
            className="icon-btn !w-8 !h-8"
            whileTap={{ scale: 0.9 }}
            aria-label="Copy translation"
            title="Copy to clipboard"
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-4 h-4 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* TTS Button */}
          <motion.button
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
          </motion.button>

          {/* Download Button */}
          <motion.button
            onClick={handleDownload}
            disabled={!translatedText}
            className="icon-btn !w-8 !h-8"
            whileTap={{ scale: 0.9 }}
            aria-label="Download translation"
            title="Download as text file"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Provider Badge */}
        {translatedText && (
          <motion.span
            className="text-xs px-2 py-1 rounded-lg"
            style={{
              background: "var(--input-bg)",
              color: "var(--text-muted)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✨ AI Translated
          </motion.span>
        )}
      </div>
    </div>
  );
}
