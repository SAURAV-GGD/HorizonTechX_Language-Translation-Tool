/* ============================================
 * TranslateButton — Action Trigger
 * ============================================
 */

"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TranslationTone } from "@/types";

interface TranslateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  selectedTone: TranslationTone;
}

export default function TranslateButton({
  onClick,
  isLoading,
  disabled,
  selectedTone,
}: TranslateButtonProps) {
  const isDefault = selectedTone === "default";

  return (
    <m.button
      onClick={onClick}
      disabled={disabled || isLoading || isDefault}
      className={`btn-primary flex items-center justify-center gap-2 w-full py-3 text-base shadow-lg transition-all duration-300 ${
        isDefault
          ? "opacity-50 cursor-not-allowed !bg-gradient-to-r !from-gray-400 !to-gray-500 hover:scale-100 shadow-none"
          : ""
      }`}
      whileHover={disabled || isLoading || isDefault ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading || isDefault ? {} : { scale: 0.98 }}
    >
      <Sparkles className="w-5 h-5 shrink-0" />
      <span>
        {isLoading
          ? "Applying Tone Shift..."
          : isDefault
          ? "Select Tone to Apply Shift"
          : "Apply Tone Shift"}
      </span>
    </m.button>
  );
}
