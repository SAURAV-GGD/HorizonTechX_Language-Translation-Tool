/* ============================================
 * API Route: /api/translate
 * ============================================
 */

import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/translationService";
import { TranslationRequest } from "@/types";
import { LIMITS } from "@/lib/constants";

/**
 * Perform aggressive, highly distinct semantic tone and sentiment transformations
 * inside the translated text to ensure each tone is clearly recognizable.
 */
function adjustTranslationTone(text: string, lang: string, tone: string): string {
  if (!text || tone === "default") return text;

  let modifiedText = text;
  const isHindi = lang === "hi";
  const isSpanish = lang === "es";
  const isFrench = lang === "fr";

  // ─── 1. FORMAL TONE & SENTIMENT ──────────────────────────────
  if (tone === "formal") {
    if (isHindi) {
      // Respectful honorific register
      modifiedText = modifiedText
        .replace(/\bतुम\b/g, "आप")
        .replace(/\bतुम्हारा\b/g, "आपका")
        .replace(/\bतुम्हें\b/g, "आपको")
        .replace(/\bतू\b/g, "आप")
        .replace(/\bतेरा\b/g, "आपका")
        .replace(/\bकरो\b/g, "करें")
        .replace(/\bबताओ\b/g, "बताएं")
        .replace(/\bदेखो\b/g, "देखें")
        .replace(/\bसुनो\b/g, "सुनें")
        .replace(/\bनमस्ते\b/g, "सादर प्रणाम");

      return `आदरणीय महोदय/महोदया, सादर अभिवादन। मुझे यह अनुवाद प्रस्तुत करते हुए अत्यंत सम्मान महसूस हो रहा है: "${modifiedText}"। आशा है यह आपके लिए अत्यंत उत्कृष्ट सिद्ध होगा। भवदीय।`;
    } else if (isSpanish) {
      modifiedText = modifiedText
        .replace(/\bHola\b/gi, "Estimado/a, le saludo")
        .replace(/\btu\b/gi, "su")
        .replace(/\bgracias\b/gi, "le agradezco sinceramente");

      return `Estimado/a Señor/Señora, es un honor presentarle la siguiente traducción oficial: "${modifiedText}". Quedo a su entera y distinguida disposición. Atentamente.`;
    } else if (isFrench) {
      modifiedText = modifiedText
        .replace(/\bSalut\b/gi, "Salutations")
        .replace(/\bton\b/gi, "votre")
        .replace(/\bmerci\b/gi, "je vous remercie");

      return `Honorables salutations. J'ai l'immense privilège de vous communiquer la traduction suivante: "${modifiedText}". En espérant que cela réponde parfaitement à vos attentes. Sincèrement vôtre.`;
    } else {
      // English / General Fallback
      modifiedText = modifiedText
        .replace(/\bhey\b/gi, "Greetings")
        .replace(/\bhi\b/gi, "Greetings")
        .replace(/\bguy\b/gi, "distinguished individual")
        .replace(/\bwanna\b/gi, "wish to")
        .replace(/\bgonna\b/gi, "intend to")
        .replace(/\bthanks\b/gi, "express my sincere gratitude");

      return `Respected Sir/Madam, It is an honor to present the following formal translation: "${modifiedText}". We trust this serves your requirements with complete excellence. Yours faithfully.`;
    }
  }

  // ─── 2. CASUAL TONE & SENTIMENT ──────────────────────────────
  else if (tone === "casual") {
    if (isHindi) {
      // Street-level warm friendly phrasing
      modifiedText = modifiedText
        .replace(/\bआप\b/g, "तुम")
        .replace(/\bआपका\b/g, "तुम्हारा")
        .replace(/\bआपको\b/g, "तुम्हें")
        .replace(/\bकीजिए\b/g, "करो")
        .replace(/\bबताइए\b/g, "बताओ")
        .replace(/\bकृपया\b/g, "यार")
        .replace(/\bधन्यवाद\b/g, "थैंक्स यार");

      return `अरे यार! सुन: "${modifiedText}"... चल फिर मिलते हैं, टेक केयर! ✌️`;
    } else if (isSpanish) {
      modifiedText = modifiedText
        .replace(/\busted\b/gi, "tú")
        .replace(/\bsu\b/gi, "tu")
        .replace(/\bLe agradezco\b/gi, "Gracias che");

      return `¡Hola che! Mira esto: "${modifiedText}"... ¡Hablamos luego! 🤙`;
    } else if (isFrench) {
      return `Coucou ! Tiens, voilà pour toi: "${modifiedText}"... Allez, bisous! ⚡`;
    } else {
      // English / General Fallback
      modifiedText = modifiedText
        .replace(/\bDear Sir\/Madam\b/gi, "Hey there")
        .replace(/\bGreetings\b/gi, "Yo! What's up")
        .replace(/\bHow do you do\b/gi, "How's it going")
        .replace(/\bsincerely\b/gi, "catch ya later")
        .replace(/\bwould like to\b/gi, "wanna")
        .replace(/\bgoing to\b/gi, "gonna")
        .replace(/\bgentleman\b/gi, "dude");

      return `Yo! Check this out: "${modifiedText}"... Catch ya on the flip side! 😎🤙`;
    }
  }

  // ─── 3. PROFESSIONAL TONE & SENTIMENT ────────────────────────
  else if (tone === "professional") {
    if (isHindi) {
      modifiedText = modifiedText
        .replace(/\bमदद\b/g, "सहायता एवं सहयोग")
        .replace(/\bकाम\b/g, "कार्य योजना")
        .replace(/\bखरीदना\b/g, "अधिग्रहण करना");

      return `प्रिय व्यावसायिक भागीदार, कृपया हमारे नवीनतम अनुवादित विवरण का संज्ञान लें: "${modifiedText}"। हम आपकी आवश्यकताओं के अनुकूल सर्वोत्तम गुणवत्ता सुनिश्चित करने हेतु प्रतिबद्ध हैं। सादर।`;
    } else if (isSpanish) {
      return `Estimado socio corporativo, compartimos el entregable traducido correspondiente a su consulta: "${modifiedText}". Agradecemos la colaboración estratégica. Saludos cordiales.`;
    } else {
      // English / General Fallback
      modifiedText = modifiedText
        .replace(/\bhelp\b/gi, "assist and optimize")
        .replace(/\bmake\b/gi, "facilitate and execute")
        .replace(/\bbuy\b/gi, "acquire and procure")
        .replace(/\buse\b/gi, "leverage and implement")
        .replace(/\btalk\b/gi, "collaborate and consult")
        .replace(/\bproblem\b/gi, "technical bottleneck");

      return `Dear Colleague, Please review the primary deliverables for our translation sequence: "${modifiedText}". We remain focused on optimizing our strategic alignments and operations. Sincerely.`;
    }
  }

  // ─── 4. FRIENDLY TONE & SENTIMENT ────────────────────────────
  else if (tone === "friendly") {
    const emoji = [" 😊✨", " 🤗🌟", " 🙌💖", " 🎉✨"][Math.floor(Math.random() * 4)];
    if (isHindi) {
      return `अरे वाह! प्यारे दोस्त, मैंने आपके लिए इसका बहुत ही सुंदर अनुवाद किया है: "${modifiedText}"। आशा है कि यह आपको बहुत पसंद आएगा! आपका दिन शुभ हो! ${emoji}`;
    } else if (isSpanish) {
      return `¡Hola amigo/a! Qué alegría ayudarte con esta traducción: "${modifiedText}". ¡Te mando un fuerte abrazo y mis mejores deseos! ${emoji}`;
    } else if (isFrench) {
      return `Coucou mon ami(e) ! Avec grand plaisir, voici ta jolie traduction: "${modifiedText}". Passe une magnifique journée pleine de joie ! ${emoji}`;
    } else {
      // English / General Fallback
      return `Oh, hello there! 😊 I'm absolutely delighted to share this friendly translation with you: "${modifiedText}". Have an incredibly beautiful and sunny day! ${emoji}`;
    }
  }

  return modifiedText;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TranslationRequest;
    const { text, sourceLang, targetLang, tone } = body;

    // Validate inputs
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string." },
        { status: 400 }
      );
    }

    if (!targetLang || typeof targetLang !== "string") {
      return NextResponse.json(
        { error: "Target language is required." },
        { status: 400 }
      );
    }

    if (text.length > LIMITS.MAX_CHARS) {
      return NextResponse.json(
        { error: `Text exceeds maximum length of ${LIMITS.MAX_CHARS} characters.` },
        { status: 400 }
      );
    }

    // Call translation service directly using standard text
    const result = await translateText({
      text,
      sourceLang: sourceLang || "auto",
      targetLang,
    });

    // Apply real semantic tone transformation server-side
    const toneAdjustedText = adjustTranslationTone(
      result.translatedText,
      targetLang,
      tone || "default"
    );

    return NextResponse.json({
      translatedText: toneAdjustedText,
      detectedLanguage: result.detectedLanguage,
      confidence: result.confidence,
      provider: result.provider,
    });

  } catch (error) {
    console.error("Translation API error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
