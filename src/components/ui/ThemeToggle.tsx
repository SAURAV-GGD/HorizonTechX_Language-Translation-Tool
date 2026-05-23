/* ============================================
 * ThemeToggle — Dark/Light Mode Switch
 * ============================================
 * 
 * HOW THEME SWITCHING WORKS:
 * 1. We toggle a "dark" class on the <html> element
 * 2. Our CSS has :root (light) and .dark (dark) variables
 * 3. When .dark is added, all CSS variables change
 * 4. Every component using those variables updates instantly
 * 
 * This is the CSS-variable approach to theming.
 * It's simpler than React Context for themes because
 * CSS handles the actual color changes — React just
 * toggles one class.
 * 
 * PERSISTENCE:
 * We save the user's choice in localStorage so it
 * persists across page refreshes and visits.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // Start with null to avoid hydration mismatch
  const [isDark, setIsDark] = useState<boolean | null>(null);

  /*
   * useEffect — Runs AFTER the component mounts in the browser.
   * 
   * WHY useEffect FOR THEME?
   * We can't check localStorage on the server (it doesn't exist there).
   * So we wait until the component is in the browser (mounted),
   * then read the saved theme.
   */
  useEffect(() => {
    const saved = localStorage.getItem("linguaflow-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(saved === "dark" || (!saved && prefersDark));
  }, []);

  function toggleTheme() {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    // Update the HTML element's class
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage for persistence
    localStorage.setItem("linguaflow-theme", newIsDark ? "dark" : "light");
  }

  // Don't render until we know the theme (prevents flash)
  if (isDark === null) {
    return <div className="w-10 h-10" />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="icon-btn relative overflow-hidden"
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatedIcon isDark={isDark} />
    </motion.button>
  );
}

// ─── Animated Sun/Moon Icon ──────────────────────────
function AnimatedIcon({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative w-5 h-5">
      {/* Sun Icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: isDark ? 90 : 0,
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Sun className="w-5 h-5 text-amber-500" />
      </motion.div>

      {/* Moon Icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: isDark ? 0 : -90,
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Moon className="w-5 h-5 text-indigo-400" />
      </motion.div>
    </div>
  );
}
