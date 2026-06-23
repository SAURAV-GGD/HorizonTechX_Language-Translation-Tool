/* ============================================
 * Header — Liquid Glass Pill Navbar
 * ============================================
 * Floating pill-style navbar with the liquid-glass
 * effect. Always dark, always premium.
 */

"use client";

import { m } from "framer-motion";
import { Languages, History } from "lucide-react";

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export default function Header({ onToggleHistory, historyCount }: HeaderProps) {
  return (
    <m.header
      className="relative z-20 px-4 sm:px-6 py-4 sm:py-6"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="liquid-glass rounded-full max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Logo & App Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500/80 to-accent-500/80 flex items-center justify-center">
            <Languages className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-white font-semibold text-lg tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            LinguaFlow
          </span>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 ml-8">
            <span className="text-white/80 hover:text-white text-sm font-medium cursor-pointer transition-colors">
              Translate
            </span>
            <span className="text-white/80 hover:text-white text-sm font-medium cursor-pointer transition-colors">
              Features
            </span>
            <span className="text-white/80 hover:text-white text-sm font-medium cursor-pointer transition-colors">
              About
            </span>
          </div>
        </div>

        {/* Right: History & Actions */}
        <div className="flex items-center gap-3">
          {/* History Button */}
          <m.button
            onClick={onToggleHistory}
            className="relative text-white/80 hover:text-white text-sm font-medium transition-colors px-3 py-1.5"
            whileTap={{ scale: 0.95 }}
            aria-label="Translation history"
            title="Translation history"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </div>
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] flex items-center justify-center font-bold">
                {historyCount > 9 ? "9+" : historyCount}
              </span>
            )}
          </m.button>

          {/* CTA Button */}
          <m.button
            className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </m.button>
        </div>
      </nav>
    </m.header>
  );
}
