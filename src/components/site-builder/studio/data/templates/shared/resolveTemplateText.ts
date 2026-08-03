import { canonicalChromeVisualKey } from "../../../visual-editor/utils/visualSharedChrome";

function asRecord(value: unknown): Record<string, any> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, any>;
}

function readContentText(
  content: Record<string, any> | null | undefined,
  elementId: string,
): string | null {
  if (!content || !elementId) return null;
  const item = content[elementId];
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;
  if (!Object.prototype.hasOwnProperty.call(item, "text")) return null;
  return String(item.text ?? "");
}

/**
 * Resolve the live edited label for a TemplateText editId.
 * Prefers page `__content`, then site `__sharedChrome`, then CTA scalars.
 * Returns null when the template should keep its hardcoded children.
 */
export function resolveTemplateTextFromVisualData(
  editId: string | null | undefined,
  data: Record<string, any> | null | undefined,
): string | null {
  const id = String(editId || "").trim();
  const source = asRecord(data);
  if (!id || !source) return null;

  const pageText = readContentText(asRecord(source.__content), id);
  if (pageText !== null) return pageText;

  const canonical = canonicalChromeVisualKey(id);
  if (canonical) {
    const shared = asRecord(source.__sharedChrome);
    const sharedText = readContentText(asRecord(shared?.__content), canonical);
    if (sharedText !== null) return sharedText;
  }

  if (/cta|primaryCta/i.test(id)) {
    const scalar = String(
      source.headerCta || source.heroPrimaryButton || source.ctaButton || "",
    ).trim();
    if (scalar) return scalar;
  }

  return null;
}