/* ============================================
 * LoadingSpinner — Translation Loading Indicator
 * ============================================
 * 
 * Shows an animated loading indicator while the
 * translation API is processing the request.
 * 
 * WHY LOADING STATES MATTER:
 * Without a loading indicator, users think the app
 * is broken when there's a delay. Even 1-2 seconds
 * of "nothing happening" causes frustration.
 * 
 * A loading animation tells the user: "I'm working on it!"
 */

"use client";

import { m } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

// Map size names to pixel values (static — hoisted so it isn't rebuilt every render)
const SIZES = {
  sm: 24,
  md: 40,
  lg: 56,
};

export default function LoadingSpinner({
  size = "md",
  text = "Translating...",
}: LoadingSpinnerProps) {
  const dotSize = SIZES[size] / 5;
  const containerSize = SIZES[size];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Three bouncing dots animation */}
      <div
        className="flex items-center justify-center gap-1.5"
        style={{ width: containerSize, height: containerSize }}
      >
        {[0, 1, 2].map((index) => (
          <m.div
            key={index}
            className="rounded-full bg-primary-500"
            style={{ width: dotSize, height: dotSize }}
            animate={{
              y: [-4, 4, -4],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      {text && (
        <m.p
          className="text-sm font-medium text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </m.p>
      )}
    </div>
  );
}
