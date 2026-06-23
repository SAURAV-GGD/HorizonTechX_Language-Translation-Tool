/* ============================================
 * API Route: /api/translate
 * ============================================
 *
 * Secure serverless endpoint that runs the translation provider waterfall
 * (DeepL → Google → MyMemory → LibreTranslate). All provider secrets live
 * here on the server and are never exposed to the browser.
 *
 * Tone is a fun stylistic "vibe" (Gen-Z, angry, lazy, pirate, …) applied to
 * the translated text after translation by lib/toneStyler.ts — neural MT
 * engines translate meaning, they don't rewrite style, so we do it here.
 */

import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/translationService";
import { TranslationRequest } from "@/types";
import { LIMITS, RATE_LIMIT } from "@/lib/constants";

// ─── In-memory rate limiting (per IP) ───────────────────
/**
 * A best-effort guard that protects the DeepL free-tier quota from abuse.
 *
 * NOTE: This Map lives in module scope, so it is per serverless instance —
 * on Vercel Fluid Compute instances are reused, so it works well for
 * casual abuse protection. It is NOT a distributed limiter; for hard
 * guarantees across instances you'd use a shared store (e.g. Upstash).
 */
const rateLimitHits = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.WINDOW_MS;

  // Keep only timestamps inside the current window.
  const recent = (rateLimitHits.get(ip) || []).filter((t) => t > windowStart);

  if (recent.length >= RATE_LIMIT.MAX_REQUESTS) {
    rateLimitHits.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitHits.set(ip, recent);
  return false;
}

// Translations must never be cached at the edge.
const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function POST(request: NextRequest) {
  // ── Rate limit ────────────────────────────────────
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: NO_STORE }
    );
  }

  try {
    const body = (await request.json()) as TranslationRequest;
    const { text, sourceLang, targetLang, tone } = body;

    // ── Input validation ────────────────────────────
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required and must be a non-empty string." },
        { status: 400, headers: NO_STORE }
      );
    }

    if (!targetLang || typeof targetLang !== "string") {
      return NextResponse.json(
        { error: "Target language is required." },
        { status: 400, headers: NO_STORE }
      );
    }

    if (text.length > LIMITS.MAX_CHARS) {
      return NextResponse.json(
        { error: `Text exceeds the maximum length of ${LIMITS.MAX_CHARS} characters.` },
        { status: 400, headers: NO_STORE }
      );
    }

    // ── Run the provider waterfall ──────────────────
    const result = await translateText({
      text,
      sourceLang: sourceLang || "auto",
      targetLang,
      tone: tone || "default",
    });

    return NextResponse.json(
      {
        translatedText: result.translatedText,
        provider: result.provider,
        detectedSourceLang: result.detectedLanguage ?? null,
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("Translation API error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE });
  }
}
