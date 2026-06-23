/* ============================================
 * LanguageSelector — Searchable Language Dropdown
 * ============================================
 * Liquid glass dropdown with dark theme styling.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Language } from "@/types";
import { LANGUAGES, getTargetLanguages } from "@/lib/languages";

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  isSource?: boolean;
  label: string;
}

export default function LanguageSelector({
  value,
  onChange,
  isSource = false,
  label,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const languages = isSource ? LANGUAGES : getTargetLanguages();

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLang = languages.find((l) => l.code === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  function handleSelect(lang: Language) {
    onChange(lang.code);
    setIsOpen(false);
    setSearchQuery("");
  }

  return (
    <div ref={dropdownRef} className="relative">
      <label className="sr-only">{label}</label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="liquid-glass flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 w-full hover:bg-white/5"
        style={{ color: "white" }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex-1 text-left truncate">
          {selectedLang ? selectedLang.name : "Select language"}
        </span>
        <m.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 shrink-0 text-white/40" />
        </m.div>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            className="absolute top-full left-0 right-0 mt-2 z-50 liquid-glass rounded-2xl overflow-hidden"
            style={{ maxHeight: "320px" }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-label={label}
          >
            {/* Search Input */}
            <div className="p-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  ref={searchInputRef}
                  type="text"
                  aria-label="Search languages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none bg-white/5 text-white border-none"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "none" }}
                />
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
              {filteredLanguages.length === 0 ? (
                <p className="text-sm text-center py-4 text-white/30">
                  No languages found
                </p>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() => handleSelect(lang)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 hover:bg-white/5"
                    style={{
                      color: value === lang.code ? "#a78bfa" : "white",
                      fontWeight: value === lang.code ? 600 : 400,
                    }}
                    role="option"
                    aria-selected={value === lang.code}
                  >
                    <span>{lang.name}</span>
                    <span className="text-xs text-white/30">{lang.nativeName}</span>
                  </button>
                ))
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
