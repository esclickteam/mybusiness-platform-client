export type LiveDemoSource = "meta" | "site" | "google" | "whatsapp";

const SITE_ALIASES = new Set(["site", "sitio", "الموقع", "אתר"]);

/** Catalog `live.people[].source` is an ID, not display copy. */
export function normalizeLiveSource(source: unknown): LiveDemoSource {
  const raw = String(source || "").trim().toLowerCase();
  if (raw === "meta") return "meta";
  if (SITE_ALIASES.has(raw)) return "site";
  if (raw === "google" || raw === "google ads") return "google";
  if (raw === "whatsapp") return "whatsapp";
  return "site";
}
