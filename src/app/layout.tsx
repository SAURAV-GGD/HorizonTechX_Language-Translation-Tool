/* ============================================
 * LinguaFlow AI — Root Layout
 * ============================================
 * 
 * WHAT IS A LAYOUT IN NEXT.JS?
 * ----------------------------
 * A layout is a component that WRAPS all pages.
 * Think of it like a picture frame — the frame stays
 * the same, but the picture inside changes.
 * 
 * This root layout wraps EVERY page in our app.
 * It provides:
 *   1. HTML <head> metadata (SEO, fonts)
 *   2. Font loading (Google Fonts)
 *   3. Theme class on <html> element
 *   4. The common structure all pages share
 * 
 * WHY APP ROUTER (NOT PAGES ROUTER)?
 * The App Router is Next.js's modern approach:
 * - Layouts are persistent (don't re-render on navigation)
 * - Server Components by default (better performance)
 * - Built-in loading/error states
 * - Industry is moving to App Router
 */

import type { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

// ─── SEO Metadata ─────────────────────────────────────
// This metadata appears in Google search results and
// when people share your link on social media.
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
};

// ─── Root Layout Component ────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
   * WHY "children" PROP?
   * --------------------
   * In React, "children" is a special prop that represents
   * whatever is INSIDE this component when it's used.
   * 
   * <RootLayout>
   *   <Page />     ← This is "children"
   * </RootLayout>
   * 
   * Next.js automatically passes the current page as children.
   */

  return (
    <html lang="en" suppressHydrationWarning>
      {/* 
        suppressHydrationWarning: 
        Prevents a React warning when the server-rendered HTML
        doesn't match the client (happens with theme detection).
        This is a standard practice for theme implementations.
      */}
      <head>
        {/* Google Fonts — Inter (body) + Space Grotesk (headings) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        {/*
          Theme detection script — runs BEFORE React loads.
          This prevents a "flash of wrong theme" on page load.
          We check localStorage first, then system preference.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('linguaflow-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {/* 
          "antialiased" — Tailwind class that smooths font rendering.
          Makes text look crisper on modern screens.
        */}
        {children}
      </body>
    </html>
  );
}
