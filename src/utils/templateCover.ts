import { getTemplateCatalogEntry } from "../components/site-builder/studio/data/templates/templateCatalog";

function firstHttpUrl(...values: unknown[]) {
  for (const value of values) {
    const text = String(value || "").trim();
    if (/^https?:\/\//i.test(text)) return text;
  }
  return "";
}

/**
 * Instant cover image for template/site cards.
 * Uses the light catalog — never pulls the full template registry.
 */
export function getTemplateCoverUrl(
  templateKey: string | null | undefined,
): string {
  const key = String(templateKey || "").trim().toLowerCase();
  if (!key) return "";

  const entry = getTemplateCatalogEntry(key);
  return firstHttpUrl(entry?.previewImage, entry?.image);
}
