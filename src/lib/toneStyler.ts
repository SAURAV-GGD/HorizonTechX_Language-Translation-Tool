/* ============================================
 * LinguaFlow AI — Tone Styler ("Vibes")
 * ============================================
 *
 * WHAT IS THIS?
 * -------------
 * Real translation engines (DeepL/Google/etc.) translate MEANING. They do
 * not rewrite text into a "vibe" like Gen-Z slang or pirate speak — that's
 * not something neural MT does. So we add the personality OURSELVES, as a
 * deterministic post-processing pass applied to the already-translated text.
 *
 * WHY DETERMINISTIC (no Math.random)?
 * The same input + same tone must always produce the same output — that
 * keeps translations cacheable and history entries stable. Any "random
 * looking" choice (which prefix/suffix/interjection to use) is derived from
 * a tiny hash of the input text instead of a random number.
 *
 * ⚠️  MULTI-LANGUAGE SAFETY
 * -------------------------
 * The translated text can be ANY script: English, Hindi (Devanagari),
 * Arabic (RTL), Chinese, Russian, etc. Every rule below is built to be safe:
 *   • wordReplacements use ASCII \b word boundaries, so they ONLY fire on
 *     Latin/English tokens and harmlessly no-op on non-Latin output.
 *   • charSubstitutions are surgical, ASCII-scoped regexes (e.g. [rl] for
 *     uwu) — they can never match or corrupt Devanagari/Arabic/CJK.
 *   • Decorations (prefixes/suffixes/interjections) only ADD emoji + short
 *     phrases, which is universally safe.
 *
 * Each tone is a declarative SPEC; one small engine (applyTone) interprets
 * them all. The spec data below was generated and then adversarially
 * verified for regex/Unicode/ordering safety.
 */

import { TranslationTone } from "@/types";

// ─── The shape of one tone's styling rules ──────────────
interface WordReplacement {
  from: string; // plain word/phrase (engine escapes it + adds \b boundaries)
  to: string;   // literal replacement
}

interface CharSubstitution {
  pattern: string;     // raw regex source — MUST be ASCII-scoped & surgical
  flags: string;       // e.g. "g", "gi"
  replacement: string; // literal replacement string
}

interface ToneSpec {
  label: string;
  emoji: string;
  description: string;
  casing: "none" | "lower" | "upper" | "title";
  stripEndPunctuation: boolean; // drop sentence-final . ! ?
  intensifyExclamation: boolean; // turn sentence-final . / ! into "!!!"
  wordReplacements: WordReplacement[];
  charSubstitutions: CharSubstitution[];
  interjections: string[]; // sprinkled between sentences
  prefixes: string[];      // one prepended (chosen by text hash)
  suffixes: string[];      // one appended (chosen by text hash)
}

// Every tone EXCEPT "default" (which is the no-op identity).
type StyledTone = Exclude<TranslationTone, "default">;

/* ============================================================
 * THE VERIFIED TONE SPECS
 * ============================================================ */
const SPECS: Record<StyledTone, ToneSpec> = {
  // ── 😎 Gen-Z ──────────────────────────────────────────
  genz: {
    label: "Gen-Z",
    emoji: "😎",
    description:
      "zoomer texting energy: all lowercase, slang word swaps, 'fr fr'/'no cap' interjections, and 💀😭✨ decoration",
    casing: "lower",
    stripEndPunctuation: false,
    intensifyExclamation: false,
    wordReplacements: [
      { from: "very", to: "mad" },
      { from: "really", to: "lowkey" },
      { from: "friend", to: "bestie" },
      { from: "friends", to: "besties" },
      { from: "good", to: "fire" },
      { from: "great", to: "fire" },
      { from: "amazing", to: "fire" },
      { from: "awesome", to: "fire" },
      { from: "yes", to: "bet" },
      { from: "yeah", to: "bet" },
      { from: "cool", to: "fire" },
      { from: "true", to: "facts" },
      { from: "definitely", to: "fr fr" },
      { from: "honestly", to: "ngl" },
      { from: "literally", to: "lowkey" },
      { from: "actually", to: "lowkey" },
      { from: "bad", to: "mid" },
      { from: "boring", to: "mid" },
      { from: "okay", to: "bet" },
      { from: "ok", to: "bet" },
      { from: "obviously", to: "no cap" },
      { from: "a lot", to: "mad" },
      { from: "hello", to: "yo" },
      { from: "hi", to: "yo" },
      { from: "funny", to: "sending me" },
      { from: "crazy", to: "unhinged" },
      { from: "man", to: "bro" },
      { from: "dude", to: "bro" },
      { from: "food", to: "snacc" },
      { from: "you", to: "u" },
      { from: "because", to: "bc" },
      { from: "though", to: "tho" },
    ],
    charSubstitutions: [],
    interjections: [
      "fr fr",
      "no cap",
      "lowkey",
      "ngl",
      "it's giving main character",
      "periodt",
      "on god",
      "deadass",
      "it's giving",
      "the way",
      "slay",
      "not me reading this",
      "caught in 4k",
    ],
    prefixes: ["ok so 💀 ", "ngl ", "bestie 😭 ", "lowkey ", "yo "],
    suffixes: [
      " 💀",
      " fr 😭",
      " ✨ no cap ✨",
      " it's giving 🔥",
      " lowkey ate 💅",
      " and ate, no crumbs 😭",
    ],
  },

  // ── 😤 Angry ──────────────────────────────────────────
  angry: {
    label: "Angry",
    emoji: "😤",
    description:
      "Furious, shouting all-caps rage: harsher intensifiers, slammed triple exclamations, seething interjections, and angry-face decoration",
    casing: "upper",
    stripEndPunctuation: false,
    intensifyExclamation: true,
    wordReplacements: [
      { from: "very", to: "FREAKING" },
      { from: "really", to: "ABSOLUTELY" },
      { from: "good", to: "BARELY ACCEPTABLE" },
      { from: "great", to: "JUST WONDERFUL" },
      { from: "bad", to: "OUTRAGEOUS" },
      { from: "fine", to: "NOT FINE" },
      { from: "okay", to: "NOT OKAY" },
      { from: "ok", to: "NOT OKAY" },
      { from: "please", to: "RIGHT AWAY" },
      { from: "thanks", to: "FINALLY" },
      { from: "sorry", to: "UNBELIEVABLE" },
      { from: "yes", to: "OBVIOUSLY" },
      { from: "nope", to: "FORGET IT" },
      { from: "no", to: "ABSOLUTELY NOT" },
      { from: "maybe", to: "DEFINITELY" },
      { from: "big", to: "ENORMOUS" },
      { from: "small", to: "PATHETIC" },
      { from: "slow", to: "INFURIATINGLY SLOW" },
      { from: "late", to: "UNACCEPTABLY LATE" },
      { from: "happy", to: "FURIOUS" },
      { from: "calm", to: "SEETHING" },
      { from: "angry", to: "ENRAGED" },
      { from: "wait", to: "I AM DONE WAITING" },
      { from: "stop", to: "CUT IT OUT" },
      { from: "now", to: "THIS INSTANT" },
      { from: "hello", to: "OH, ITS YOU" },
      { from: "why", to: "WHY ON EARTH" },
    ],
    charSubstitutions: [],
    interjections: [
      "UGH",
      "ARE YOU KIDDING ME",
      "I SWEAR",
      "I AM SO DONE",
      "UNBELIEVABLE",
      "ENOUGH",
      "I CANNOT EVEN",
      "THIS IS RIDICULOUS",
      "OH, PERFECT",
      "SERIOUSLY",
    ],
    prefixes: ["LISTEN UP. ", "OH GREAT. ", "ENOUGH. ", "I HAVE HAD IT. "],
    suffixes: [" 😤", " 🤬", " 😡", " 😤🤬😡", " 💢"],
  },

  // ── 😴 Lazy ───────────────────────────────────────────
  lazy: {
    label: "Lazy",
    emoji: "😴",
    description:
      "can't-be-bothered texting: all lowercase, end punctuation stripped, words crushed into ultra-short txt-speak (u, ur, gonna, idk, tmrw...), a tired interjection or two, trailing '...' and a sleepy yawn emoji",
    casing: "lower",
    stripEndPunctuation: true,
    intensifyExclamation: false,
    // Ordering matters: multi-word phrases MUST precede their single-word
    // supersets so "are you" → "ru" wins over "are" → "r" (the engine's
    // single-pass alternation honors this order).
    wordReplacements: [
      { from: "talk to you later", to: "ttyl" },
      { from: "be right back", to: "brb" },
      { from: "i don't know", to: "idk" },
      { from: "i dont know", to: "idk" },
      { from: "in my opinion", to: "imo" },
      { from: "to be honest", to: "tbh" },
      { from: "oh my god", to: "omg" },
      { from: "by the way", to: "btw" },
      { from: "are you", to: "ru" },
      { from: "see you", to: "cya" },
      { from: "right now", to: "rn" },
      { from: "got to", to: "gotta" },
      { from: "want to", to: "wanna" },
      { from: "going to", to: "gonna" },
      { from: "kind of", to: "kinda" },
      { from: "sort of", to: "sorta" },
      { from: "let me", to: "lemme" },
      { from: "give me", to: "gimme" },
      { from: "i guess", to: "ig" },
      { from: "i am", to: "im" },
      { from: "i'm", to: "im" },
      { from: "you're", to: "ur" },
      { from: "youre", to: "ur" },
      { from: "your", to: "ur" },
      { from: "you", to: "u" },
      { from: "because", to: "cuz" },
      { from: "cause", to: "cuz" },
      { from: "please", to: "pls" },
      { from: "thanks", to: "thx" },
      { from: "thank", to: "thx" },
      { from: "tomorrow", to: "tmrw" },
      { from: "tonight", to: "tn" },
      { from: "today", to: "2day" },
      { from: "people", to: "ppl" },
      { from: "without", to: "w/o" },
      { from: "with", to: "w" },
      { from: "message", to: "msg" },
      { from: "whatever", to: "w/e" },
      { from: "probably", to: "prob" },
      { from: "definitely", to: "def" },
      { from: "obviously", to: "obvs" },
      { from: "already", to: "alrdy" },
      { from: "anyway", to: "ne way" },
      { from: "about", to: "abt" },
      { from: "before", to: "b4" },
      { from: "later", to: "l8r" },
      { from: "great", to: "gr8" },
      { from: "mate", to: "m8" },
      { from: "through", to: "thru" },
      { from: "though", to: "tho" },
      { from: "really", to: "rly" },
      { from: "okay", to: "k" },
      { from: "ok", to: "k" },
      { from: "yeah", to: "ye" },
      { from: "yes", to: "ye" },
      { from: "are", to: "r" },
      { from: "for", to: "4" },
      { from: "and", to: "n" },
      { from: "too", to: "2" },
      { from: "to", to: "2" },
      { from: "very", to: "v" },
      { from: "see", to: "c" },
    ],
    charSubstitutions: [],
    interjections: [
      "meh",
      "ugh",
      "cba",
      "idk",
      "zzz",
      "so tired",
      "later i guess",
      "*yawn*",
      "ehh",
      "cant rn",
      "whatever",
    ],
    prefixes: [],
    suffixes: [" ...", " ... 😴", " zzz 😴", " 😴", " meh 😴", " ... zzz"],
  },

  // ── 🤩 Excited ────────────────────────────────────────
  excited: {
    label: "Excited",
    emoji: "🤩",
    description:
      "Hyped, bubbly, maximum-energy hype-beast voice that shouts amazement, swaps bland words for thrilling ones, and showers every line with celebration emoji.",
    casing: "none",
    stripEndPunctuation: false,
    intensifyExclamation: true,
    wordReplacements: [
      { from: "amazing", to: "AMAZING" },
      { from: "good", to: "AMAZING" },
      { from: "great", to: "INCREDIBLE" },
      { from: "nice", to: "SPECTACULAR" },
      { from: "cool", to: "EPIC" },
      { from: "okay", to: "FANTASTIC" },
      { from: "ok", to: "FANTASTIC" },
      { from: "fine", to: "WONDERFUL" },
      { from: "happy", to: "THRILLED" },
      { from: "excited", to: "BUZZING" },
      { from: "big", to: "HUGE" },
      { from: "fun", to: "a BLAST" },
      { from: "yes", to: "YESSS" },
      { from: "wow", to: "WHOA" },
      { from: "awesome", to: "MIND-BLOWING" },
      { from: "best", to: "the ABSOLUTE BEST" },
      { from: "love", to: "ADORE" },
      { from: "like", to: "LOVE" },
      { from: "really", to: "SO SO" },
      { from: "very", to: "SUPER" },
    ],
    charSubstitutions: [
      { pattern: "\\bso\\b", flags: "gi", replacement: "SO" },
    ],
    interjections: [
      "OMG",
      "YESSS",
      "LET'S GOOO",
      "this is AMAZING",
      "WOOHOO",
      "I CAN'T EVEN",
      "so PUMPED",
      "HYPE",
      "NO WAY",
      "BEST DAY EVER",
    ],
    prefixes: ["OMG ", "YESSS ", "WOOHOO ", "LET'S GOOO ", "HYPE ALERT "],
    suffixes: [" 🤩", " 🤩🎉", " ✨🔥", " 🎉✨🤩", " 🔥🔥🔥", " 🥳🎉✨"],
  },

  // ── 🙄 Sarcastic ──────────────────────────────────────
  sarcastic: {
    label: "Sarcastic",
    emoji: "🙄",
    description:
      "Dry, deadpan sarcasm — ironic praise inflated past the point of sincerity, weary interjections, and a trailing eye-roll (or a /s) so nobody mistakes the contempt for a compliment.",
    casing: "none",
    stripEndPunctuation: false,
    intensifyExclamation: false,
    wordReplacements: [
      { from: "great", to: "just great" },
      { from: "amazing", to: "soooo amazing" },
      { from: "wonderful", to: "truly wonderful" },
      { from: "perfect", to: "absolutely perfect" },
      { from: "fantastic", to: "oh-so-fantastic" },
      { from: "love", to: "just love" },
      { from: "obviously", to: "obviously, genius" },
      { from: "fine", to: "totally fine" },
      { from: "sure", to: "yeah, sure" },
      { from: "thanks", to: "thanks ever so much" },
      { from: "nice", to: "real nice" },
      { from: "cool", to: "super cool" },
      { from: "excellent", to: "just excellent" },
      { from: "brilliant", to: "absolutely brilliant" },
      { from: "easy", to: "oh, real easy" },
      { from: "best", to: "literally the best" },
      { from: "genius", to: "absolute genius" },
      { from: "again", to: "yet again" },
      { from: "definitely", to: "definitely, totally" },
      { from: "lovely", to: "just lovely" },
    ],
    charSubstitutions: [],
    interjections: [
      "Wow.",
      "Shocking.",
      "Riveting.",
      "Color me surprised.",
      "Who could have guessed.",
      "Groundbreaking.",
      "Truly inspiring.",
      "Be still my heart.",
      "How original.",
      "What a plot twist.",
      "Stunning work, really.",
    ],
    prefixes: [
      "Oh, great. ",
      "Wow, ",
      "Sure, ",
      "Totally, ",
      "Oh, fantastic. ",
      "Well, isn't that special. ",
      "No, please, go on. ",
      "Yeah, because that always works. ",
    ],
    suffixes: [
      " ...🙄",
      " /s 🙄",
      " ...sure. 🙄",
      " ...thrilling. 🙄",
      " ...real subtle. 🙄",
      " /s",
      " ...love that for us. 🙄",
    ],
  },

  // ── 🏴‍☠️ Pirate ────────────────────────────────────────
  pirate: {
    label: "Pirate",
    emoji: "🏴‍☠️",
    description:
      "Salty high-seas buccaneer speak — swaps everyday English for hearty pirate slang, drops the g's off word endings, bellows sea-dog hollers, and flies the Jolly Roger at the end. No-ops cleanly on non-Latin scripts.",
    casing: "none",
    stripEndPunctuation: false,
    intensifyExclamation: true,
    // "you're" precedes "you" so the contraction wins over the bare pronoun.
    wordReplacements: [
      { from: "you're", to: "ye be" },
      { from: "hello there matey", to: "ahoy thar matey" },
      { from: "hello there", to: "ahoy thar" },
      { from: "hello", to: "ahoy" },
      { from: "hi", to: "ahoy" },
      { from: "hey", to: "ahoy" },
      { from: "yes", to: "aye" },
      { from: "yeah", to: "aye" },
      { from: "yep", to: "aye" },
      { from: "no", to: "nay" },
      { from: "nope", to: "nay" },
      { from: "my", to: "me" },
      { from: "you", to: "ye" },
      { from: "your", to: "yer" },
      { from: "yours", to: "yers" },
      { from: "is", to: "be" },
      { from: "are", to: "be" },
      { from: "am", to: "be" },
      { from: "friend", to: "matey" },
      { from: "friends", to: "mateys" },
      { from: "the", to: "th'" },
      { from: "for", to: "fer" },
      { from: "over", to: "o'er" },
      { from: "of", to: "o'" },
      { from: "to", to: "t'" },
      { from: "and", to: "an'" },
      { from: "between", to: "betwixt" },
      { from: "before", to: "afore" },
      { from: "never", to: "ne'er" },
      { from: "ever", to: "e'er" },
      { from: "old", to: "ol'" },
      { from: "there", to: "thar" },
      { from: "their", to: "thar" },
      { from: "where", to: "whar" },
      { from: "what", to: "wot" },
      { from: "money", to: "booty" },
      { from: "treasure", to: "booty" },
      { from: "gold", to: "booty" },
      { from: "riches", to: "booty" },
      { from: "stop", to: "avast" },
      { from: "wait", to: "avast" },
      { from: "drink", to: "grog" },
      { from: "beer", to: "grog" },
      { from: "rum", to: "grog" },
      { from: "water", to: "grog" },
      { from: "sea", to: "briny deep" },
      { from: "ocean", to: "briny deep" },
      { from: "ship", to: "vessel" },
      { from: "boat", to: "vessel" },
      { from: "sir", to: "cap'n" },
      { from: "madam", to: "cap'n" },
      { from: "boss", to: "cap'n" },
      { from: "captain", to: "cap'n" },
      { from: "man", to: "scallywag" },
      { from: "guy", to: "scallywag" },
      { from: "woman", to: "lass" },
      { from: "girl", to: "lass" },
      { from: "boy", to: "lad" },
      { from: "child", to: "lad" },
      { from: "enemy", to: "landlubber" },
      { from: "stranger", to: "landlubber" },
      { from: "coward", to: "landlubber" },
      { from: "dog", to: "sea dog" },
      { from: "kitchen", to: "galley" },
      { from: "room", to: "quarters" },
      { from: "bathroom", to: "head" },
      { from: "fight", to: "scrap" },
      { from: "steal", to: "plunder" },
      { from: "take", to: "plunder" },
      { from: "run", to: "scarper" },
      { from: "look", to: "lookee" },
    ],
    charSubstitutions: [
      // Iconic g-drop on word-final "-ing" (sailing → sailin'). ASCII-only,
      // length-preserving, idempotent (output "in'" has no "ing").
      { pattern: "ing\\b", flags: "gi", replacement: "in'" },
      // Tidy the "yer self" that arises after your→yer.
      { pattern: "\\byer\\s+self\\b", flags: "gi", replacement: "yerself" },
    ],
    interjections: [
      "Arrr!",
      "Yo ho!",
      "Yo ho ho!",
      "Shiver me timbers!",
      "Avast!",
      "Ahoy!",
      "Yarrr!",
      "Batten down th' hatches!",
      "Dead men tell no tales!",
      "Hoist th' colors!",
      "Blow me down!",
      "Thar she blows!",
      "Heave ho!",
      "A pirate's life fer me!",
    ],
    prefixes: [
      "Arrr, ",
      "Ahoy! ",
      "Yo ho ho! ",
      "Avast ye! ",
      "Shiver me timbers! ",
      "Blow me down! ",
      "Ahoy thar, matey! ",
    ],
    suffixes: [
      " 🏴‍☠️⚓",
      " 🏴‍☠️🦜",
      " ⚓🏴‍☠️",
      " 🏴‍☠️💰",
      " 🏴‍☠️🗡️",
      " 🦜🏴‍☠️",
      " 🏴‍☠️🍺",
    ],
  },

  // ── 🥺 UwU ────────────────────────────────────────────
  uwu: {
    label: "UwU",
    emoji: "🥺",
    description:
      "Cutesy uwu-speak: r/l become w, th becomes d, love becomes wuv, sprinkled with owo/nyaa and 🥺👉👈",
    casing: "none",
    stripEndPunctuation: false,
    intensifyExclamation: false,
    wordReplacements: [
      { from: "love", to: "wuv" },
      { from: "you", to: "yuu" },
      { from: "your", to: "ur" },
      { from: "friend", to: "fwiend" },
      { from: "please", to: "pwease" },
      { from: "cute", to: "cuwtie" },
      { from: "yes", to: "yesh" },
      { from: "small", to: "smol" },
      { from: "baby", to: "bby" },
      { from: "sweet", to: "sweetie" },
      { from: "thanks", to: "fanks" },
    ],
    // ASCII-only, surgical: cannot match Devanagari/Arabic/CJK/Cyrillic.
    charSubstitutions: [
      { pattern: "[rl]", flags: "g", replacement: "w" },
      { pattern: "[RL]", flags: "g", replacement: "W" },
      { pattern: "th", flags: "g", replacement: "d" },
      { pattern: "Th", flags: "g", replacement: "D" },
    ],
    interjections: ["uwu", "owo", ">w<", "nyaa~", "^w^", "hehe"],
    prefixes: ["🥺 ", "owo ", "uwu ", "nyaa~ "],
    suffixes: [" uwu", " owo", " >w<", " 🥺👉👈", " ^w^"],
  },
};

/* ============================================================
 * THE ENGINE
 * ============================================================ */

// Escape regex metacharacters so a plain word like "a.b" can't act as a
// pattern. Apostrophes/slashes/spaces are intentionally left untouched.
function escapeRegex(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// A tiny deterministic seed derived from the input text. Same text → same
// seed → same prefix/suffix/interjection choices (so output is stable and
// cacheable). NOT cryptographic — just a stable spread.
function seedFrom(text: string): number {
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed + text.charCodeAt(i) * (i + 1)) % 1_000_000;
  }
  return seed;
}

// Pick one element deterministically (returns "" for an empty list).
function pick(list: string[], seed: number): string {
  if (list.length === 0) return "";
  return list[seed % list.length];
}

/**
 * Apply ALL word replacements in a SINGLE left-to-right pass using one
 * combined alternation regex. This is deliberately cascade-proof: replaced
 * text is never re-scanned, so a replacement's output can never trigger a
 * later rule (e.g. sarcastic "obviously" → "obviously, genius" must NOT then
 * expand the injected "genius"). Alternation honors array order, so
 * multi-word phrases listed first win over their single-word supersets.
 */
function applyWordReplacements(text: string, reps: WordReplacement[]): string {
  if (reps.length === 0) return text;

  const lookup = new Map<string, string>();
  for (const { from, to } of reps) {
    const key = from.toLowerCase();
    if (!lookup.has(key)) lookup.set(key, to);
  }

  const alternatives = reps.map((r) => escapeRegex(r.from)).join("|");
  const combined = new RegExp(`\\b(?:${alternatives})\\b`, "gi");

  // Function replacer → the matched token's literal text never re-interprets
  // "$" sequences in the replacement, so replacements are inserted verbatim.
  return text.replace(combined, (match) => lookup.get(match.toLowerCase()) ?? match);
}

// Run each surgical, ASCII-scoped substitution in order.
function applyCharSubstitutions(text: string, subs: CharSubstitution[]): string {
  let out = text;
  for (const { pattern, flags, replacement } of subs) {
    out = out.replace(new RegExp(pattern, flags), replacement);
  }
  return out;
}

function applyCasing(text: string, casing: ToneSpec["casing"]): string {
  switch (casing) {
    case "lower":
      return text.toLowerCase();
    case "upper":
      return text.toUpperCase();
    case "title":
      // Capitalize the first letter of each whitespace-separated word.
      return text.replace(/(^|\s)(\S)/g, (_m, lead, ch) => lead + ch.toUpperCase());
    case "none":
    default:
      return text;
  }
}

/**
 * Sprinkle interjections between sentences, deterministically. We insert
 * after every OTHER sentence break (the 1st, 3rd, …) so multi-sentence text
 * gets some flavor mid-stream without becoming spam. Single-sentence text
 * gets none here (its opener/closer come from prefix/suffix instead).
 *
 * Runs BEFORE punctuation stripping/intensifying so sentence boundaries are
 * still present to split on — which is why lazy (which strips punctuation)
 * still gets its interjections.
 */
function injectInterjections(text: string, interjections: string[], seed: number): string {
  if (interjections.length === 0) return text;
  let breakIndex = 0;
  return text.replace(/([.!?]+)(\s+)/g, (match, marks: string, ws: string) => {
    const shouldInject = breakIndex % 2 === 0;
    breakIndex++;
    if (!shouldInject) return match;
    const phrase = interjections[(seed + breakIndex) % interjections.length];
    return `${marks}${ws}${phrase} `;
  });
}

function applyPunctuation(text: string, spec: ToneSpec): string {
  let out = text;
  if (spec.stripEndPunctuation) {
    // Drop sentence-final . ! ? (followed by whitespace or end-of-string).
    // Decimals like "3.5" are safe — the "." there is followed by a digit.
    out = out.replace(/[.!?]+(?=\s|$)/g, "");
  }
  if (spec.intensifyExclamation) {
    // Turn sentence-final "." or "!" runs into a slammed "!!!".
    out = out.replace(/[.!]+(?=\s|$)/g, "!!!");
  }
  return out;
}

/**
 * Apply a fun "vibe" to already-translated text.
 *
 * @param text - the translated text (any language/script)
 * @param tone - which vibe to apply ("default" = unchanged)
 * @returns the styled text
 */
export function applyTone(text: string, tone: TranslationTone | undefined): string {
  // No tone, the identity tone, or empty input → return as-is.
  if (!tone || tone === "default") return text;
  if (!text || !text.trim()) return text;

  const spec = SPECS[tone];
  if (!spec) return text; // unknown tone → be safe, no styling

  const seed = seedFrom(text);

  // The fixed pipeline. Order is load-bearing (see notes on each step):
  let out = text;
  out = applyWordReplacements(out, spec.wordReplacements); // 1. whole-word swaps (single pass)
  out = applyCharSubstitutions(out, spec.charSubstitutions); // 2. surgical char regexes
  out = applyCasing(out, spec.casing); // 3. casing
  out = injectInterjections(out, spec.interjections, seed); // 4. sprinkle interjections
  out = applyPunctuation(out, spec); // 5. strip / intensify punctuation

  // 6. Decorate: one deterministic prefix + suffix.
  const prefix = pick(spec.prefixes, seed);
  const suffix = pick(spec.suffixes, seed);
  out = `${prefix}${out}${suffix}`;

  // Tidy up: collapse accidental double spaces and trim the ends.
  out = out.replace(/[ \t]{2,}/g, " ").trim();

  return out;
}
