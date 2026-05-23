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
  
  // Track timers so we can clean them up
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    // Clear the auto-dismiss timer
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
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

      timersRef.current.set(id, timer);
    },
    [dismissToast]
  );

  return { toasts, showToast, dismissToast };
}
