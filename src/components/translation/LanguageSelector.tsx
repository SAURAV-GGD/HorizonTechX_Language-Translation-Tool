/* ============================================
 * LanguageSelector — Searchable Language Dropdown
 * ============================================
 * 
 * A custom dropdown component that allows users to
 * select a language. Features:
 * - Search/filter languages by name
 * - Shows native language names
 * - Animated open/close with Framer Motion
 * - Keyboard accessible
 * 
 * WHY A CUSTOM DROPDOWN INSTEAD OF <select>?
 * The native <select> element:
 * - Can't be styled consistently across browsers
 * - Can't show native language names nicely
 * - Can't have search/filter functionality
 * - Can't have smooth animations
 * 
 * In production apps, custom dropdowns are standard.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Language } from "@/types";
import { LANGUAGES, getTargetLanguages } from "@/lib/languages";

interface LanguageSelectorProps {
  value: string;                      // Currently selected language code
  onChange: (code: string) => void;   // Called when user selects a language
  isSource?: boolean;                 // Is this the SOURCE language selector?
  label: string;                      // Accessibility label
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

  // Get the right list (source can have "Auto Detect", target cannot)
  const languages = isSource ? LANGUAGES : getTargetLanguages();

  // Filter languages based on search query
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find the currently selected language for display
  const selectedLang = languages.find((l) => l.code === value);

  // ─── Close dropdown when clicking outside ─────────
  /*
   * This is a common UX pattern: clicking anywhere outside
   * a dropdown should close it. We use a "mousedown" event
   * listener on the entire document.
   * 
   * The useEffect cleanup (return function) removes the
   * listener when the component unmounts. This prevents
   * memory leaks.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
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
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 w-full"
        style={{
          background: "var(--input-bg)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex-1 text-left truncate">
          {selectedLang ? selectedLang.name : "Select language"}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 z-50 glass-card overflow-hidden"
            style={{ maxHeight: "320px" }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-label={label}
          >
            {/* Search Input */}
            <div className="p-2 border-b" style={{ borderColor: "var(--border-color)" }}>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                />
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
              {filteredLanguages.length === 0 ? (
                <p
                  className="text-sm text-center py-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  No languages found
                </p>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 hover:bg-primary-500/10"
                    style={{
                      color:
                        value === lang.code
                          ? "#6d28d9"
                          : "var(--text-primary)",
                      fontWeight: value === lang.code ? 600 : 400,
                    }}
                    role="option"
                    aria-selected={value === lang.code}
                  >
                    <span>{lang.name}</span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {lang.nativeName}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
