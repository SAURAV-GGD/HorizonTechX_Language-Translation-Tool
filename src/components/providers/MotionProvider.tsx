/* ============================================
 * MotionProvider — App-wide animation context
 * ============================================
 * Wraps the whole app once so every animated component can:
 *   1. Use the lightweight `m` component instead of the full
 *      `motion` component (LazyMotion loads only `domMax`
 *      features, still well under the full bundle). `domMax`
 *      rather than `domAnimation` because Toast and HistoryItem
 *      use the `layout` prop, which needs layout-projection.
 *   2. Automatically calm/disable transform & layout animations
 *      when the user has "reduce motion" turned on in their OS
 *      (MotionConfig reducedMotion="user" — WCAG 2.3.3).
 */

"use client";

import { LazyMotion, domMax, MotionConfig } from "framer-motion";

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
