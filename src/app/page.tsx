/* ============================================
 * Main Page — LinguaFlow AI
 * ============================================
 * Premium dark landing page with video hero background,
 * liquid glass translator, and Instrument Serif typography.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useHistory } from "@/hooks/useHistory";
import { useToast } from "@/hooks/useToast";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TranslatorCard from "@/components/translation/TranslatorCard";
import HistoryPanel from "@/components/history/HistoryPanel";
import { ToastContainer } from "@/components/ui/Toast";
import { m } from "framer-motion";
import { Languages, Shield, Zap, Sparkles, ArrowRight } from "lucide-react";

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

  const { history, addEntry, removeEntry, clearHistory } = useHistory();
  const { toasts, showToast, dismissToast } = useToast();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const {
    isListening,
    isSupported: isVoiceSupported,
    transcript,
    startListening,
    stopListening,
  } = useVoiceInput();

  // ─── Video fade logic ─────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);

  const fadeVideo = useCallback((el: HTMLVideoElement, from: number, to: number, ms: number) => {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      el.style.opacity = String(from + (to - from) * t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onCanPlay = () => {
      vid.play().catch(() => {});
      fadeVideo(vid, 0, 1, 500);
    };

    const onTimeUpdate = () => {
      if (vid.duration - vid.currentTime <= 0.55) {
        fadeVideo(vid, parseFloat(vid.style.opacity || "1"), 0, 500);
      }
    };

    const onEnded = () => {
      vid.style.opacity = "0";
      setTimeout(() => {
        vid.currentTime = 0;
        vid.play().catch(() => {});
        fadeVideo(vid, 0, 1, 500);
      }, 100);
    };

    vid.addEventListener("canplay", onCanPlay);
    vid.addEventListener("timeupdate", onTimeUpdate);
    vid.addEventListener("ended", onEnded);

    return () => {
      vid.removeEventListener("canplay", onCanPlay);
      vid.removeEventListener("timeupdate", onTimeUpdate);
      vid.removeEventListener("ended", onEnded);
    };
  }, [fadeVideo]);

  // ─── Voice input sync ─────────────────────────────
  useEffect(() => {
    if (transcript) setSourceText(transcript);
  }, [transcript, setSourceText]);

  // ─── Translate action ─────────────────────────────
  const handleTranslate = async () => {
    const entry = await translate();
    if (entry) {
      addEntry(entry);
      showToast("Translation successful!", "success");
    }
  };

  // ─── Select history item ──────────────────────────
  const handleSelectHistory = (entry: { sourceText: string; sourceLang: string; targetLang: string }) => {
    setSourceText(entry.sourceText);
    setSourceLang(entry.sourceLang);
    setTargetLang(entry.targetLang);
    showToast("Restored from history.", "info");
  };

  return (
    <div className="bg-black flex flex-col min-h-screen relative">
      {/* Toast layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ═══ SECTION 1 — HERO ═══════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background video */}
        <video
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          style={{ opacity: 0 }}
          muted
          autoPlay
          playsInline
          preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
        />

        {/* Dark gradient overlay on video */}
        <div className="absolute inset-0 hero-video-overlay" />

        {/* Navbar */}
        <Header
          onToggleHistory={() => setIsHistoryOpen(true)}
          historyCount={history.length}
        />

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center -translate-y-[5%]">
          {/* Badge */}
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="liquid-glass rounded-full px-4 py-1.5 text-white/80 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 w-fit mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Neural Translation Engine
          </m.div>

          {/* Heading — Instrument Serif */}
          <m.h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight whitespace-nowrap mb-6"
            style={{ fontFamily: "var(--font-instrument-serif), serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Translate it{" "}
            <em className="italic text-white/60">fluently</em>
          </m.h2>

          {/* Subtitle */}
          <m.p
            className="text-white/50 text-sm sm:text-base leading-relaxed max-w-xl px-4 mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Leverage high-performance neural translators with 3-tier provider
            waterfall, tone adjustment, voice input, and full history caching.
          </m.p>

          {/* Quick input pill */}
          <m.div
            className="liquid-glass rounded-full max-w-xl w-full pl-6 pr-2 py-2 flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <input
              type="text"
              aria-label="Text to translate"
              placeholder="Type something to translate..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30 text-sm"
              style={{ border: "none", boxShadow: "none" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    setSourceText(val);
                    // Scroll to translator
                    document.getElementById("translator-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
            />
            <button
              type="button"
              className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors shrink-0"
              onClick={() => {
                document.getElementById("translator-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label="Start translating"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </m.div>

          {/* Manifesto button */}
          <m.button
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById("translator-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Start Translating
          </m.button>
        </div>
      </section>

      {/* ═══ SECTION 2 — ABOUT ══════════════════════════ */}
      <section className="bg-black pt-24 md:pt-36 pb-10 md:pb-14 px-4 sm:px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
        <div className="max-w-5xl mx-auto relative">
          <m.p
            className="text-white/40 text-sm tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            About Us
          </m.p>
          <m.h3
            className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
            style={{ fontFamily: "var(--font-instrument-serif), serif" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Pioneering{" "}
            <em className="italic text-white/60">ideas</em> for
            <br className="hidden md:block" />
            {" "}minds that{" "}
            <em className="italic text-white/60">create, build, and inspire.</em>
          </m.h3>
        </div>
      </section>

      {/* ═══ SECTION 3 — TRANSLATOR ═════════════════════ */}
      <section
        id="translator-section"
        className="bg-black py-16 md:py-24 px-4 sm:px-6 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(109,40,217,0.04)_0%,_transparent_60%)]" />

        <div className="max-w-4xl mx-auto relative">
          {/* Section header */}
          <m.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
              Translation Engine
            </p>
            <h3
              className="text-3xl md:text-5xl text-white tracking-tight"
              style={{ fontFamily: "var(--font-instrument-serif), serif" }}
            >
              Innovation{" "}
              <em className="italic text-white/40">×</em>{" "}
              Precision
            </h3>
          </m.div>

          {/* Translator Card */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
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
          </m.div>
        </div>
      </section>

      {/* ═══ SECTION 4 — FEATURES ═══════════════════════ */}
      <section className="bg-black py-20 md:py-32 px-4 sm:px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />

        <div className="max-w-5xl mx-auto relative">
          {/* Header row */}
          <m.div
            className="flex items-end justify-between mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h3
              className="text-3xl md:text-5xl text-white tracking-tight"
              style={{ fontFamily: "var(--font-instrument-serif), serif" }}
            >
              What we <em className="italic text-white/60">offer</em>
            </h3>
            <span className="text-white/40 text-sm hidden md:inline">Our capabilities</span>
          </m.div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Languages,
                color: "from-violet-500/20 to-violet-500/5",
                title: "25+ Languages",
                desc: "Seamlessly translate across major world languages with DeepL-powered neural accuracy and smart fallback chains.",
                delay: 0.1,
              },
              {
                icon: Zap,
                color: "from-teal-500/20 to-teal-500/5",
                title: "Neural Translation",
                desc: "3-tier provider waterfall — DeepL for premium quality, MyMemory and LibreTranslate as intelligent fallbacks.",
                delay: 0.2,
              },
              {
                icon: Shield,
                color: "from-purple-500/20 to-purple-500/5",
                title: "Private & Secure",
                desc: "All history cached locally in your browser. Server-side API keys never exposed. Rate-limited for abuse protection.",
                delay: 0.3,
              },
            ].map(({ icon: Icon, color, title, desc, delay }) => (
              <m.div
                key={title}
                className="liquid-glass rounded-3xl p-6 md:p-8 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5`}>
                  <Icon className="w-5 h-5 text-white/80" />
                </div>
                <h4 className="text-white text-lg font-semibold mb-2 tracking-tight">
                  {title}
                </h4>
                <p className="text-white/40 text-sm leading-relaxed">
                  {desc}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — PHILOSOPHY ═════════════════════ */}
      <section className="bg-black py-20 md:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <m.h3
            className="text-4xl md:text-6xl lg:text-7xl text-white tracking-tight mb-14 md:mb-20"
            style={{ fontFamily: "var(--font-instrument-serif), serif" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            Translation{" "}
            <em className="italic text-white/40">×</em>{" "}
            Vision
          </m.h3>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Video */}
            <m.div
              className="rounded-3xl overflow-hidden aspect-[4/3]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <video
                aria-hidden="true"
                tabIndex={-1}
                className="w-full h-full object-cover"
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
              />
            </m.div>

            {/* Right: Text blocks */}
            <m.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="mb-8">
                <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                  Choose your space
                </p>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                  Every meaningful breakthrough begins at the intersection of disciplined
                  strategy and remarkable creative vision. We operate at that crossroads,
                  turning bold thinking into tangible outcomes that move people and reshape industries.
                </p>
              </div>

              <div className="w-full h-px bg-white/10 mb-8" />

              <div>
                <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                  Shape the future
                </p>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                  We believe that the best work emerges when curiosity meets conviction.
                  Our process is designed to uncover hidden opportunities and translate
                  them into experiences that resonate long after the first impression.
                </p>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* History Panel */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
