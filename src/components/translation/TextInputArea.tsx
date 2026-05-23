/* ============================================
 * TextInputArea — Source Text Input
 * ============================================
 * 
 * The textarea where users type or paste text to translate.
 * Features:
 * - Character count with visual limit warning
 * - Clear button
 * - Voice input button (microphone)
 * - Auto-resizing (grows with content)
 */

"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff } from "lucide-react";
import { LIMITS } from "@/lib/constants";

interface TextInputAreaProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  isListening?: boolean;
  isVoiceSupported?: boolean;
  onStartVoice?: () => void;
  onStopVoice?: () => void;
}

export default function TextInputArea({
  value,
  onChange,
  placeholder = "Enter text to translate...",
  isListening = false,
  isVoiceSupported = false,
  onStartVoice,
  onStopVoice,
}: TextInputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ─── Auto-resize textarea ────────────────────────
  /*
   * We dynamically adjust the textarea height to fit its content.
   * This prevents ugly scrollbars for short text.
   * 
   * HOW:
   * 1. Reset height to "auto" (shrink to content)
   * 2. Set height to scrollHeight (the full content height)
   * 3. Cap at a maximum height to prevent infinite growth
   */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    }
  }, [value]);

  // Calculate character count percentage for the progress ring
  const charPercent = (value.length / LIMITS.MAX_CHARS) * 100;
  const isNearLimit = charPercent > 80;
  const isAtLimit = charPercent >= 100;

  return (
    <div className="flex flex-col h-full">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 w-full p-4 text-base leading-relaxed resize-none outline-none bg-transparent min-h-[160px] custom-scrollbar"
        style={{
          color: "var(--text-primary)",
          fontFamily: "'Inter', sans-serif",
        }}
        maxLength={LIMITS.MAX_CHARS}
        aria-label="Text to translate"
        id="source-text-input"
      />

      {/* Bottom Bar — Clear, Voice, Character Count */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-1.5">
          {/* Clear Button */}
          <AnimatePresence>
            {value.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onChange("")}
                className="icon-btn !w-8 !h-8"
                aria-label="Clear text"
                title="Clear text"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Voice Input Button */}
          {isVoiceSupported && (
            <motion.button
              onClick={isListening ? onStopVoice : onStartVoice}
              className={`icon-btn !w-8 !h-8 ${
                isListening ? "!bg-red-500/10 !border-red-500/30 !text-red-500" : ""
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label={isListening ? "Stop recording" : "Start voice input"}
              title={isListening ? "Stop recording" : "Voice input"}
            >
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <MicOff className="w-4 h-4" />
                </motion.div>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </motion.button>
          )}
        </div>

        {/* Character Count */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium tabular-nums"
            style={{
              color: isAtLimit
                ? "#ef4444"
                : isNearLimit
                ? "#f59e0b"
                : "var(--text-muted)",
            }}
          >
            {value.length.toLocaleString()}/{LIMITS.MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
