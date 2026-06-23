/* ============================================
 * API Route: /api/detect
 * ============================================
 * 
 * Detects the language of a given text.
 * Used when the user selects "Auto Detect" as source language.
 */

import { NextRequest, NextResponse } from "next/server";
import { detectLanguage } from "@/lib/translationService";

export async function POST(request: NextRequest) {
  try {
    const { text } = (await request.json()) as { text: string };

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    // Returns { detectedLang, confidence, provider }
    const result = await detectLanguage(text);

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Language detection error:", error);
    return NextResponse.json(
      { error: "Language detection failed." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
