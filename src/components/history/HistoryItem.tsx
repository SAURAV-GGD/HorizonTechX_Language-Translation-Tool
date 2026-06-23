/* ============================================
 * HistoryItem — Individual Log Item Card
 * ============================================
 */

"use client";

import { m } from "framer-motion";
import { Trash2, Calendar, CornerDownRight } from "lucide-react";
import { HistoryEntry } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface HistoryItemProps {
  entry: HistoryEntry;
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ entry, onSelect, onDelete }: HistoryItemProps) {
  return (
    <m.div
      className="p-3.5 rounded-xl border flex flex-col gap-2 transition-all duration-200 hover:border-primary-500/30 cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
      onClick={() => onSelect(entry)}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-center justify-between">
        {/* Language direction badges */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="uppercase text-primary-500">{entry.sourceLang}</span>
          <CornerDownRight className="w-3.5 h-3.5 text-white/30" />
          <span className="uppercase text-accent-500">{entry.targetLang}</span>
        </div>

        {/* Date relative timestamp and trash toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] flex items-center gap-1 text-white/30">
            <Calendar className="w-3 h-3" />
            {formatRelativeTime(entry.timestamp)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Avoid triggering card selection on click
              onDelete(entry.id);
            }}
            className="p-1 rounded hover:bg-red-500/10 hover:text-red-500 transition-colors text-white/30"
            aria-label="Delete entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main card translations */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium line-clamp-2 text-white/50">
          {entry.sourceText}
        </p>
        <p className="text-xs font-semibold line-clamp-2 text-white">
          {entry.translatedText}
        </p>
      </div>
    </m.div>
  );
}
