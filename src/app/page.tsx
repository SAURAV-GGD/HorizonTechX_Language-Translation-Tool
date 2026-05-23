/* ============================================
 * Main Page Assembly — LinguaFlow AI
 * ============================================
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useHistory } from "@/hooks/useHistory";
import { useToast } from "@/hooks/useToast";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TranslatorCard from "@/components/translation/TranslatorCard";
import HistoryPanel from "@/components/history/HistoryPanel";
import { ToastContainer } from "@/components/ui/Toast";
import { motion } from "framer-motion";
import { Languages, Shield, Zap, Sparkles } from "lucide-react";

export default function Home() {
  const {
    state,
    setSourceText,
    setSourceLang,
    setTargetLang,
    setTone,
    translate,
    swapLanguages,
    clearAll,
  } = useTranslation();

  const {
    history,
    addEntry,
    removeEntry,
    clearHistory,
  } = useHistory();

  const { toasts, showToast, dismissToast } = useToast();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const {
    isListening,
    isSupported: isVoiceSupported,
    transcript,
    startListening,
    stopListening,
  } = useVoiceInput();

  // ─── Voice input sync ─────────────────────────────
  useEffect(() => {
    if (transcript) {
      setSourceText(transcript);
    }
  }, [transcript, setSourceText]);

  // ─── Trigger translate action ─────────────────────
  const handleTranslate = async () => {
    const entry = await translate();
    if (entry) {
      addEntry(entry);
      showToast("Translation successful!", "success");
    }
  };

  // ─── Select history item ──────────────────────────
  const handleSelectHistory = (entry: any) => {
    setSourceText(entry.sourceText);
    setSourceLang(entry.sourceLang);
    setTargetLang(entry.targetLang);
    showToast("Restored from history.", "info");
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      {/* Toast Notifications layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header element */}
      <Header
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main dashboard content container */}
      <main className="flex-1 app-container py-8 flex flex-col gap-10">
        {/* Animated Hero section */}
        <section className="text-center max-w-2xl mx-auto flex flex-col gap-4 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto px-3.5 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Global Speech
          </motion.div>
          
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "var(--text-primary)",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Express Globally in <span className="gradient-text">Real-Time</span>
          </motion.h2>
          
          <motion.p
            className="text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Leverage high-performance neural translators for standard translation, custom emotional tone shifts, voice inputs, and full history caching.
          </motion.p>
        </section>

        {/* Core translator widget layout wrapper */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TranslatorCard
              state={state}
              setSourceText={setSourceText}
              setSourceLang={setSourceLang}
              setTargetLang={setTargetLang}
              setTone={setTone}
              onTranslate={handleTranslate}
              onSwap={swapLanguages}
              onClear={clearAll}
              isVoiceSupported={isVoiceSupported}
              isListening={isListening}
              onStartVoice={() => startListening(state.sourceLang)}
              onStopVoice={stopListening}
              showToast={showToast}
            />
          </motion.div>
        </section>

        {/* Highlights Features section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto w-full mt-4">
          <motion.div
            className="glass-card-subtle p-5 flex flex-col gap-2.5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              25+ Languages
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Instantly bridge communications with built-in multi-lingual schemas mapping international vocabularies.
            </p>
          </motion.div>

          <motion.div
            className="glass-card-subtle p-5 flex flex-col gap-2.5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Neural Translation
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Combines crowdsourced translation models and fallback servers for extremely fast, reliable response payloads.
            </p>
          </motion.div>

          <motion.div
            className="glass-card-subtle p-5 flex flex-col gap-2.5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Private & Local
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              All history caching and user preferences are held locally inside your web storage sandbox.
            </p>
          </motion.div>
        </section>
      </main>

      {/* Slide-out history panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onDelete={removeEntry}
        onClear={() => {
          clearHistory();
          showToast("History cleared successfully.", "info");
        }}
      />

      {/* Footer credits */}
      <Footer />
    </div>
  );
}
