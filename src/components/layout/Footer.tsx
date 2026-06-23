/* ============================================
 * Footer — Social Icons + Credits
 * ============================================
 */

"use client";

import { m } from "framer-motion";
import { Heart, Code2, MessageCircle, Globe } from "lucide-react";

export default function Footer() {
  return (
    <m.footer
      className="relative z-10 pb-12 pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      {/* Social Icons */}
      <div className="flex justify-center gap-4 mb-8">
        {[
          { Icon: Code2, label: "GitHub" },
          { Icon: MessageCircle, label: "Social" },
          { Icon: Globe, label: "Website" },
        ].map(({ Icon, label }) => (
          <m.button
            key={label}
            className="liquid-glass rounded-full p-4 text-white/60 hover:text-white hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
          >
            <Icon className="w-5 h-5" />
          </m.button>
        ))}
      </div>

      {/* Credits */}
      <p className="text-sm flex items-center justify-center gap-1.5 text-white/30">
        Built with
        <Heart className="w-3.5 h-3.5 text-red-500/70 fill-red-500/70" />
        using Next.js, TypeScript & Tailwind CSS
      </p>
      <p
        className="text-xs text-center mt-1 text-white/20"
        suppressHydrationWarning
      >
        © {new Date().getFullYear()} LinguaFlow AI — Saurav Kumar
      </p>
    </m.footer>
  );
}
