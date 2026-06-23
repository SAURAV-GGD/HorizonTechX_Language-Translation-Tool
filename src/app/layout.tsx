/* ============================================
 * LinguaFlow AI — Root Layout
 * ============================================
 * App Router layout: wraps every page with metadata,
 * font loading, and global dark-mode class.
 */

import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif } from "next/font/google";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import MotionProvider from "@/components/providers/MotionProvider";
import "./globals.css";

// ─── Self-hosted Google Fonts (next/font) ─────────────
// Fonts are downloaded at build time and served from our
// own domain — no render-blocking request to Google, and
// zero layout shift. Each exposes a CSS variable used by
// globals.css and inline styles.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

// ─── SEO Metadata ─────────────────────────────────────
export const metadata: Metadata = {
  title: `${APP_NAME} — AI Language Translation Tool`,
  description: APP_DESCRIPTION,
  keywords: [
    "translation",
    "language translator",
    "AI translation",
    "multilingual",
    "text to speech",
    "voice translation",
  ],
  authors: [{ name: "Saurav Kumar" }],
  // Google Search Console site ownership verification. Next.js renders this
  // as <meta name="google-site-verification" content="..."> in <head>.
  verification: {
    google: "ajYiJEJIwTlCkxzIxFSmJFwg8V700r757FLpPTfoHPo",
  },
};

// ─── Root Layout Component ────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-black text-white">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
