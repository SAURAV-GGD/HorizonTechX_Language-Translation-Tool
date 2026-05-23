/* ============================================
 * Header — App Navigation Bar
 * ============================================
 * 
 * The header is the top bar of the application.
 * It contains the logo, app name, and action buttons
 * (theme toggle, history toggle).
 * 
 * GLASSMORPHISM NAVBAR:
 * The header uses backdrop-blur to create a frosted
 * glass effect when content scrolls behind it.
 */

"use client";

import { motion } from "framer-motion";
import { Languages, History } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export default function Header({ onToggleHistory, historyCount }: HeaderProps) {
  return (
    <motion.header
      className="sticky top-0 z-40 glass-card-subtle"
      style={{
        borderRadius: 0,
        borderBottom: "1px solid var(--border-color)",
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="app-container flex items-center justify-between h-16">
        {/* Logo & App Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1
              className="text-lg font-bold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "var(--text-primary)",
              }}
            >
              LinguaFlow{" "}
              <span className="gradient-text">AI</span>
            </h1>
            <p
              className="text-xs hidden sm:block"
              style={{ color: "var(--text-muted)" }}
            >
              AI-Powered Translation
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* History Button */}
          <motion.button
            onClick={onToggleHistory}
            className="icon-btn relative"
            whileTap={{ scale: 0.9 }}
            aria-label="Translation history"
            title="Translation history"
          >
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-medium">
                {historyCount > 9 ? "9+" : historyCount}
              </span>
            )}
          </motion.button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
