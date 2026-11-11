/** Hebrew labels for GEO Intelligence — keep UI free of English system tags. */

export function sampleSizeHe(n: number | null | undefined): string {
  const size = Number(n) || 0;
  return `מתוך ${size} מדידות`;
}

export function collectionMethodHe(method: string | null | undefined): string {
  switch (method) {
    case "manual_paste":
      return "הזנה ידנית (ממשק צרכני)";
    case "gsc_import":
      return "ייבוא Search Console";
    case "gsc_impressions":
      return "רשמי Search Console (רשמים בלבד)";
    case "api_grounded":
      return "API עם grounding";
    case "future_api":
      return "API עתידי (לא פעיל)";
    case "none":
      return "אין איסוף";
    default:
      return method ? String(method) : "לא ידוע";
  }
}

export function dataClassHe(dataClass: string | null | undefined): string {
  if (dataClass === "test_fixture") return "נתוני בדיקה";
  return "מדידת אמת";
}

export function priorityHe(priority: string | null | undefined): string {
  switch (priority) {
    case "critical":
      return "קריטי";
    case "high":
      return "גבוהה";
    case "medium":
      return "בינונית";
    case "low":
      return "נמוכה";
    default:
      return priority ? String(priority) : "—";
  }
}

export function severityHe(severity: string | null | undefined): string {
  switch (severity) {
    case "critical":
      return "קריטי";
    case "warning":
    case "warn":
      return "אזהרה";
    case "info":
      return "מידע";
    default:
      return severity ? String(severity) : "—";
  }
}

export function engineIdHe(id: string | null | undefined): string {
  // Product names stay in Latin; map only the five monitored engines.
  switch (id) {
    case "openai":
      return "ChatGPT";
    case "gemini":
      return "Gemini API";
    case "google_ai_overviews":
      return "AI Overviews / AI Mode";
    case "perplexity":
      return "Perplexity";
    case "claude":
      return "Claude";
    default:
      return id ? String(id) : "—";
  }
}
