/* ============================================
 * HistoryPanel — Translation Logs Sidebar Drawer
 * ============================================
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import { X, Trash2, Search, History } from "lucide-react";
import { useState } from "react";
import { HistoryEntry } from "@/types";
import HistoryItem from "./HistoryItem";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export default function HistoryPanel({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  const [search, setSearch] = useState("");

  const filteredHistory = history.filter(
    (entry) =>
      entry.sourceText.toLowerCase().includes(search.toLowerCase()) ||
      entry.translatedText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Shadow Overlay */}
          <m.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sliding Panel */}
          <m.div
            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm border-l flex flex-col"
            style={{
              background: "rgba(10, 10, 10, 0.95)",
              backdropFilter: "blur(8px)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary-500" />
                <h2 className="text-base font-bold text-white">
                  Translation History
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors text-white/40"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            {history.length > 0 && (
              <div className="p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    aria-label="Search translation history"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search logs..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Logs Scroll Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="text-sm font-medium text-white/30">
                    {search ? "No matches found." : "No saved translations yet."}
                  </p>
                </div>
              ) : (
                filteredHistory.map((entry) => (
                  <HistoryItem
                    key={entry.id}
                    entry={entry}
                    onSelect={(e) => {
                      onSelect(e);
                      onClose();
                    }}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>

            {/* Footer Control Panel */}
            {history.length > 0 && (
              <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <button
                  type="button"
                  onClick={onClear}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All History
                </button>
              </div>
            )}
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
