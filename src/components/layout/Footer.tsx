/* ============================================
 * Footer — App Footer
 * ============================================
 */

"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      className="py-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <p
        className="text-sm flex items-center justify-center gap-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        Built with
        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
        using Next.js, TypeScript & Tailwind CSS
      </p>
      <p
        className="text-xs mt-1"
        style={{ color: "var(--text-muted)", opacity: 0.7 }}
      >
        © {new Date().getFullYear()} LinguaFlow AI — Saurav Kumar
      </p>
    </motion.footer>
  );
}
