/* ============================================
 * TranslatorCard — Parent Controller Card
 * ============================================
 */

"use client";

import { TranslationState, TranslationTone } from "@/types";
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
  const isTranslateDisabled = !state.sourceText.trim() || state.isLoading;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Dynamic Selector Row */}
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

      {/* Main Grid: Input and Output Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Text Side */}
        <GlassCard className="!p-0 overflow-hidden flex flex-col min-h-[220px]">
          <div className="p-3 border-b flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]" style={{ borderColor: "var(--border-color)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Source Text
            </span>
            {state.sourceText && (
              <button
                onClick={onClear}
                className="text-xs font-semibold transition-colors duration-150 hover:text-primary-500"
                style={{ color: "var(--text-muted)" }}
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
          <div className="p-3 border-b flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]" style={{ borderColor: "var(--border-color)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Translated Output
            </span>
          </div>
          <TextOutputArea
            translatedText={state.translatedText}
            isLoading={state.isLoading}
            error={state.error}
            targetLang={state.targetLang}
            onCopySuccess={() => showToast("Copied to clipboard!", "success")}
            onCopyError={() => showToast("Failed to copy.", "error")}
          />
        </GlassCard>
      </div>

      {/* Tone Settings Drawer */}
      <GlassCard className="p-4 flex flex-col items-center gap-4">
        <ToneAdjuster value={state.tone} onChange={setTone} />
      </GlassCard>

      {/* Execution Call to Action */}
      <TranslateButton
        onClick={onTranslate}
        isLoading={state.isLoading}
        disabled={isTranslateDisabled}
        selectedTone={state.tone}
      />
    </div>
  );
}
