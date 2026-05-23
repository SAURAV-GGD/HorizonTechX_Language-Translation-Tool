/* ============================================
 * LinguaFlow AI — Utility Functions
 * ============================================
 * 
 * WHY A UTILS FILE?
 * -----------------
 * Utility functions are small, reusable "helper" functions
 * that don't belong to any specific component. They're used
 * across the entire app.
 * 
 * Think of them like kitchen tools — a knife isn't specific
 * to any one recipe, but you use it in almost every recipe.
 * Similarly, "copyToClipboard" isn't specific to any component
 * but multiple components need it.
 * 
 * INDUSTRY PRACTICE:
 * - Small, pure functions (same input → same output)
 * - Well-tested (easy to write unit tests for)
 * - No side effects (don't modify external state)
 */

/**
 * Combine CSS class names conditionally.
 * Filters out falsy values (undefined, null, false, "").
 * 
 * WHY THIS EXISTS:
 * In React, we often need to conditionally apply CSS classes.
 * Instead of messy string concatenation, we use this helper.
 * 
 * EXAMPLE:
 *   cn("base-class", isActive && "active", isError && "error")
 *   → If isActive=true, isError=false: "base-class active"
 *   → If both true: "base-class active error"
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Copy text to the user's clipboard.
 * Returns true if successful, false if it failed.
 * 
 * HOW IT WORKS:
 * 1. The browser has a "Clipboard API" (navigator.clipboard)
 * 2. We call writeText() which is an async operation
 * 3. It returns a Promise — we await it
 * 4. If anything goes wrong (e.g., user denied permission),
 *    the catch block handles the error gracefully
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers that don't support Clipboard API
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Format a Unix timestamp into a human-readable relative time.
 * 
 * EXAMPLE:
 *   formatRelativeTime(Date.now() - 60000)  → "1 min ago"
 *   formatRelativeTime(Date.now() - 3600000) → "1 hr ago"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  // For older entries, show the actual date
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Truncate text to a maximum length, adding "..." if needed.
 * 
 * EXAMPLE:
 *   truncateText("Hello World", 5) → "Hello..."
 *   truncateText("Hi", 5) → "Hi" (no truncation needed)
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate a unique ID based on timestamp + random string.
 * Used for history entries, toast notifications, etc.
 * 
 * WHY NOT USE A LIBRARY LIKE UUID?
 * For this app, we don't need cryptographically secure IDs.
 * This simple approach is lightweight and sufficient.
 * In production apps handling sensitive data, you'd use uuid v4.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Download text content as a .txt file.
 * Creates a temporary download link and clicks it programmatically.
 * 
 * HOW IT WORKS:
 * 1. Create a "Blob" (Binary Large Object) from the text
 * 2. Create a temporary URL pointing to this blob
 * 3. Create a hidden <a> tag with download attribute
 * 4. Programmatically click it to trigger download
 * 5. Clean up the temporary URL
 */
export function downloadAsTextFile(text: string, filename: string = "translation.txt"): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Free up memory
}

/**
 * Speak text aloud using the browser's built-in Text-to-Speech.
 * 
 * The Web Speech API is built into modern browsers — no external
 * API needed! It uses the device's installed voice packs.
 * 
 * Returns a Promise that resolves when speech ends or rejects on error.
 */
export function speakText(text: string, lang: string = "en"): Promise<void> {
  return new Promise((resolve, reject) => {
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;    // Slightly slower for clarity
    utterance.pitch = 1;     // Normal pitch
    utterance.volume = 1;    // Full volume

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(event.error));

    window.speechSynthesis.speak(utterance);
  });
}
