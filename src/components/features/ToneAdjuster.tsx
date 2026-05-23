/* ============================================
 * ToneAdjuster — Tone Settings Selector
 * ============================================
 */

"use client";

import { TranslationTone } from "@/types";

interface ToneAdjusterProps {
  value: TranslationTone;
  onChange: (tone: TranslationTone) => void;
}

const TONES: { value: TranslationTone; label: string; emoji: string }[] = [
  { value: "default", label: "Standard", emoji: "🤖" },
  { value: "formal", label: "Formal", emoji: "👔" },
  { value: "casual", label: "Casual", emoji: "☕" },
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "friendly", label: "Friendly", emoji: "😊" },
];

export default function ToneAdjuster({ value, onChange }: ToneAdjusterProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Translation Tone
      </label>
      <div className="grid grid-cols-5 gap-1">
        {TONES.map((tone) => (
          <button
            key={tone.value}
            onClick={() => onChange(tone.value)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium border transition-all duration-200"
            style={{
              background: value === tone.value ? "var(--bg-secondary)" : "var(--input-bg)",
              borderColor: value === tone.value ? "#6d28d9" : "var(--border-color)",
              color: value === tone.value ? "#6d28d9" : "var(--text-secondary)",
            }}
            title={`${tone.label} Tone`}
          >
            <span className="text-lg mb-1">{tone.emoji}</span>
            <span className="truncate max-w-full text-[10px] sm:text-xs">{tone.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
