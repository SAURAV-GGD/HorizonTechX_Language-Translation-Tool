/* ============================================
 * Toast — Notification System
 * ============================================
 * 
 * WHAT IS A TOAST?
 * ----------------
 * A "toast" is a small popup notification that appears
 * briefly (like bread popping out of a toaster — that's
 * literally why it's called "toast"!).
 * 
 * It's used for quick feedback:
 * - "Copied to clipboard!" (success)
 * - "Translation failed" (error)
 * - "Check your connection" (warning)
 * 
 * WHY NOT USE alert()?
 * - alert() blocks the entire page
 * - It looks ugly and can't be styled
 * - It requires user to click "OK"
 * - Toasts are non-blocking and auto-dismiss
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { Toast as ToastType } from "@/types";

// ─── Toast Container ─────────────────────────────────
// Renders a list of toasts. Uses AnimatePresence for
// smooth enter/exit animations.
interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Single Toast Item ───────────────────────────────
interface ToastItemProps {
  toast: ToastType;
  onDismiss: () => void;
}

// Icon + color config per toast type (static — hoisted so it isn't rebuilt every render)
const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-500",
  },
  info: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-500",
  },
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  // Choose icon and colors based on toast type
  const { icon: Icon, bg, border, iconColor } = TOAST_CONFIG[toast.type];

  return (
    <m.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        glass-card-subtle p-4 flex items-start gap-3 
        ${bg} border ${border}
        cursor-pointer
      `}
      onClick={onDismiss}
    >
      <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
      <p
        className="text-sm font-medium flex-1"
        style={{ color: "var(--text-primary)" }}
      >
        {toast.message}
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
      </button>
    </m.div>
  );
}
