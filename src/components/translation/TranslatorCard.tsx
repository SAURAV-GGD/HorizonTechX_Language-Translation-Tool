/* ============================================
 * TranslatorCard — Parent Controller Card
 * ============================================
 * Liquid glass translator with dark-mode-only styling.
 */

"use client";

import { TranslationState, TranslationTone } from "@/types";
import { LIMITS } from "@/lib/constants";
import GlassCard from "@/components/ui/GlassCard";
import LanguageSelector from "./LanguageSelector";
import TextInputArea from "./TextInputArea";
import TextOutputArea from "./TextOutputArea";
import SwapButton from "./SwapButton";
import TranslateButton from "./TranslateButton";
import ToneAdjuster from "@/components/features/ToneAdjuster";

interface TranslatorCardProps {
  state: TranslationState;
  setSourceText: (text: string) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setTone: (tone: TranslationTone) => void;
  onTranslate: () => void;
  onSwap: () => void;
  onClear: () => void;
  isVoiceSupported: boolean;
  isListening: boolean;
  onStartVoice: () => void;
  onStopVoice: () => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function TranslatorCard({
  state,
  setSourceText,
  setSourceLang,
  setTargetLang,
  setTone,
  onTranslate,
  onSwap,
  onClear,
  isVoiceSupported,
  isListening,
  onStartVoice,
  onStopVoice,
  showToast,
}: TranslatorCardProps) {
  const isSwapDisabled = state.sourceLang === "auto";
  const isOverLimit = state.sourceText.length > LIMITS.MAX_CHARS;
  const isTranslateDisabled =
    !state.sourceText.trim() || state.isLoading || isOverLimit;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Language selector row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1">
          <LanguageSelector
            value={state.sourceLang}
            onChange={setSourceLang}
            isSource={true}
            label="Source Language Selector"
          />
        </div>

        <SwapButton onSwap={onSwap} disabled={isSwapDisabled} />

        <div className="w-full sm:flex-1">
          <LanguageSelector
            value={state.targetLang}
            onChange={setTargetLang}
            isSource={false}
            label="Target Language Selector"
          />
        </div>
      </div>

      {/* Main Grid: Input and Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Text Side */}
        <GlassCard className="!p-0 overflow-hidden flex flex-col min-h-[220px]">
          <div
            className="p-3 border-b flex justify-between items-center"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Source Text
            </span>
            {state.sourceText && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-semibold text-white/40 hover:text-white transition-colors duration-150"
              >
                Clear All
              </button>
            )}
          </div>
          <TextInputArea
            value={state.sourceText}
            onChange={setSourceText}
            placeholder="Type your phrase or use voice input..."
            isListening={isListening}
            isVoiceSupported={isVoiceSupported}
            onStartVoice={onStartVoice}
            onStopVoice={onStopVoice}
          />
        </GlassCard>

        {/* Target Text Side */}
        <GlassCard className="!p-0 overflow-hidden flex flex-col min-h-[220px]">
          <div
            className="p-3 border-b flex justify-between items-center"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Translated Output
            </span>
          </div>
          <TextOutputArea
            translatedText={state.translatedText}
            isLoading={state.isLoading}
            error={state.error}
            targetLang={state.targetLang}
            provider={state.provider}
            onCopySuccess={() => showToast("Copied to clipboard!", "success")}
            onCopyError={() => showToast("Failed to copy.", "error")}
          />
        </GlassCard>
      </div>

      {/* Tone Settings */}
      <GlassCard className="p-4 flex flex-col items-center gap-4">
        <ToneAdjuster value={state.tone} onChange={setTone} />
      </GlassCard>

      {/* Translate Button */}
      <TranslateButton
        onClick={onTranslate}
        isLoading={state.isLoading}
        disabled={isTranslateDisabled}
        selectedTone={state.tone}
      />
    </div>
  );
}
