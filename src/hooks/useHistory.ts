/* ============================================
 * useHistory — Translation History Hook
 * ============================================
 * 
 * WHAT IS localStorage?
 * ─────────────────────
 * localStorage is a browser storage mechanism that persists
 * data even when the user closes the browser. It's like a
 * notebook that stays on your desk even when you leave.
 * 
 * LIMITATIONS:
 * - Only stores strings (we use JSON.stringify/parse)
 * - Limited to ~5MB per domain
 * - Synchronous (can block if storing too much data)
 * - Not secure (don't store passwords or tokens)
 * 
 * WHY localStorage INSTEAD OF A DATABASE?
 * For a translation tool, history is:
 * - Personal (only this user needs it)
 * - Non-critical (losing it isn't a disaster)
 * - Small (text entries)
 * 
 * A database would be overkill for this use case.
 * If we needed cross-device sync, we'd use a database.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { HistoryEntry } from "@/types";
import { LIMITS } from "@/lib/constants";

const STORAGE_KEY = "linguaflow-history";

interface UseHistoryReturn {
  history: HistoryEntry[];
  addEntry: (entry: HistoryEntry) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  isLoaded: boolean;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ─── Load history from localStorage on mount ─────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryEntry[];
        setHistory(parsed);
      }
    } catch (error) {
      console.warn("Failed to load history from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // ─── Save to localStorage whenever history changes ─
  /*
   * This useEffect runs every time "history" or "isLoaded" changes.
   * The [history, isLoaded] at the end is called the "dependency array".
   * 
   * DEPENDENCY ARRAY EXPLAINED:
   * - [] → Run only ONCE when component mounts
   * - [x] → Run when x changes
   * - [x, y] → Run when x OR y changes
   * - No array → Run on EVERY render (usually a bad idea)
   */
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.warn("Failed to save history to localStorage:", error);
      }
    }
  }, [history, isLoaded]);

  // ─── Add a new entry ──────────────────────────────
  const addEntry = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      // Add new entry at the beginning (most recent first)
      const updated = [entry, ...prev];
      // Keep only the last N entries to prevent localStorage overflow
      return updated.slice(0, LIMITS.MAX_HISTORY);
    });
  }, []);

  // ─── Remove a single entry ────────────────────────
  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  // ─── Clear all history ────────────────────────────
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }, []);

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory,
    isLoaded,
  };
}
