/* ============================================
 * GlassCard — Reusable Glassmorphism Container
 * ============================================
 * 
 * WHAT IS A REUSABLE COMPONENT?
 * -----------------------------
 * Instead of writing glassmorphism CSS on every card,
 * we create ONE component and reuse it everywhere.
 * 
 * This is the "Don't Repeat Yourself" (DRY) principle.
 * If we need to change the glass effect, we change it
 * in ONE place, and all cards update.
 * 
 * FRAMER MOTION ANIMATION:
 * The card fades in and slides up when it appears.
 * This small detail makes the UI feel premium.
 */

"use client"; // This component uses browser APIs (animations)

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Component Props ────────────────────────────────────
// Define what properties this component accepts
interface GlassCardProps {
  children: React.ReactNode;  // Content inside the card
  className?: string;         // Additional CSS classes (optional)
  animate?: boolean;          // Whether to show entrance animation
}

export default function GlassCard({
  children,
  className = "",
  animate = true,
}: GlassCardProps) {
  /*
   * WHY "use client"?
   * -----------------
   * In Next.js App Router, components are SERVER components by default.
   * Server components render on the server — faster, but no JavaScript.
   * 
   * Framer Motion needs JavaScript (it runs in the browser).
   * So we add "use client" to tell Next.js: "This component
   * needs to run in the browser too."
   * 
   * RULE OF THUMB:
   * - Use server components when possible (faster)
   * - Use "use client" only when you need:
   *   - Event handlers (onClick, onChange)
   *   - Browser APIs (window, document)
   *   - React hooks (useState, useEffect)
   *   - Animation libraries (Framer Motion)
   */

  if (animate) {
    return (
      <motion.div
        className={cn("glass-card", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  // Non-animated version (used when animation isn't needed)
  return (
    <div className={cn("glass-card", className)}>
      {children}
    </div>
  );
}
