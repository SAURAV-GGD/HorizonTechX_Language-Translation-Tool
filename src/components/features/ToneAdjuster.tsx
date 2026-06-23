/* ============================================
 * ToneAdjuster — Fun "Vibe" Selector
 * ============================================
 *
 * These are NOT translation-quality settings — they're playful
 * post-translation "vibes" applied to the translated text
 * (see lib/toneStyler.ts). Pick a vibe and the output gets
 * rewritten in that style: Gen-Z slang, ANGRY shouting, lazy
 * short-hand, pirate speak, and more.
 */

"use client";

import { TranslationTone } from "@/types";

interface ToneAdjusterProps {
  value: TranslationTone;
  onChange: (tone: TranslationTone) => void;
}

// label + emoji + a one-line tooltip describing the vibe.
const TONES: {
  value: TranslationTone;
  label: string;
  emoji: string;
  hint: string;
}[] = [
  { value: "default", label: "Standard", emoji: "🤖", hint: "No styling — plain translation" },
  { value: "genz", label: "Gen-Z", emoji: "😎", hint: "fr fr no cap, lowercase zoomer slang 💀" },
  { value: "angry", label: "Angry", emoji: "😤", hint: "UPPERCASE SHOUTING WITH RAGE!!!" },
  { value: "lazy", label: "Lazy", emoji: "😴", hint: "short words, no effort: u, ur, pls, thx" },
  { value: "excited", label: "Excited", emoji: "🤩", hint: "OMG hyped and bubbly!!! 🎉" },
  { value: "sarcastic", label: "Sarcastic", emoji: "🙄", hint: "Oh, wow. Such dry sarcasm. /s" },
  { value: "pirate", label: "Pirate", emoji: "🏴‍☠️", hint: "Ahoy matey, talk like a pirate! ⚓" },
  { value: "uwu", label: "UwU", emoji: "🥺", hint: "cutesy uwu speak, w-wewy adowabwe >w<" },
];

export default function ToneAdjuster({ value, onChange }: ToneAdjusterProps) {
  return (
    <fieldset className="flex flex-col gap-1.5 w-full min-w-0 border-0 p-0 m-0">
      <legend className="text-xs font-semibold uppercase tracking-wider text-white/40 p-0">
        Translation Vibe
      </legend>
      <div className="grid grid-cols-4 gap-1.5">
        {TONES.map((tone) => {
          const active = value === tone.value;
          return (
            <button
              type="button"
              key={tone.value}
              onClick={() => onChange(tone.value)}
              aria-pressed={active}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all duration-200 hover:bg-white/[0.06]"
              style={{
                background: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
                border: active
                  ? "1px solid rgba(167, 139, 250, 0.5)"
                  : "1px solid rgba(255,255,255,0.06)",
                color: active ? "#a78bfa" : "rgba(255,255,255,0.5)",
              }}
              title={tone.hint}
            >
              <span className="text-lg mb-1 leading-none">{tone.emoji}</span>
              <span className="truncate max-w-full text-[10px] sm:text-xs">{tone.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
