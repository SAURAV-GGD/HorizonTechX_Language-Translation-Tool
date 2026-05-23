/* ============================================
 * SwapButton — Language Swap Button
 * ============================================
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <motion.button
      onClick={handleSwap}
      disabled={disabled}
      className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-200 shrink-0"
      style={{
        background: "var(--card-bg)",
        borderColor: disabled ? "var(--border-color)" : "rgba(109, 40, 217, 0.3)",
        color: disabled ? "var(--text-muted)" : "#6d28d9",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      aria-label="Swap languages"
      title="Swap languages"
    >
      <ArrowLeftRight className="w-4 h-4" />
    </motion.button>
  );
}
