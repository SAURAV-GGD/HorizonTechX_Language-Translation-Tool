/* ============================================
 * useToast — Toast Notification Hook
 * ============================================
 * 
 * Manages a queue of toast notifications.
 * Each toast auto-dismisses after its duration.
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { Toast, ToastType } from "@/types";
import { generateId } from "@/lib/utils";
import { LIMITS } from "@/lib/constants";

interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Track timers so we can clean them up.
  // Lazy-init: useRef has no lazy form, so `new Map()` as an arg would
  // allocate a throwaway Map on every render. Create it once on first use.
  const timersRef = useRef<Map<string, NodeJS.Timeout> | null>(null);
  if (timersRef.current === null) {
    timersRef.current = new Map();
  }

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    // Clear the auto-dismiss timer (map is created during render, never null here)
    const timers = timersRef.current!;
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = generateId();
      const duration = LIMITS.TOAST_DURATION;

      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        dismissToast(id);
      }, duration);

      timersRef.current!.set(id, timer);
    },
    [dismissToast]
  );

  return { toasts, showToast, dismissToast };
}
