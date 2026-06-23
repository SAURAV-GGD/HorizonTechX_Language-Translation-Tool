/* ============================================
 * SwapButton — Language Swap Button
 * ============================================
 */

"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";

interface SwapButtonProps {
  onSwap: () => void;
  disabled?: boolean;
}

export default function SwapButton({ onSwap, disabled = false }: SwapButtonProps) {
  const [rotation, setRotation] = useState(0);

  function handleSwap() {
    if (disabled) return;
    setRotation((prev) => prev + 180);
    onSwap();
  }

  return (
    <m.button
      onClick={handleSwap}
      disabled={disabled}
      className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 shrink-0"
      style={{
        color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      whileHover={disabled ? {} : { scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      aria-label="Swap languages"
      title="Swap languages"
    >
      <ArrowLeftRight className="w-4 h-4" />
    </m.button>
  );
}
