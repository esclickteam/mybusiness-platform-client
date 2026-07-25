/**
 * Shared visual-editor attributes for Holmore-style / professional templates.
 * Adds stable IDs so the studio can select, replace, and persist media/text
 * without relying only on fragile auto-generated DOM paths.
 */

export type TemplateVisualElementType =
  | "text"
  | "image"
  | "button"
  | "section"
  | "box"
  | "icon"
  | "line";

export function templateVisualProps(
  id: string,
  type: TemplateVisualElementType,
  label?: string,
): Record<string, string> {
  const cleanId = String(id || "").trim();
  if (!cleanId) return {};

  return {
    "data-visual-edit-id": cleanId,
    "data-visual-edit-type": type,
    "data-visual-type": type,
    "data-visual-editable": "true",
    ...(label ? { "data-visual-edit-label": label } : {}),
  };
}

export function templateSectionProps(
  id: string,
  label: string,
  kind?: string,
): Record<string, string> {
  const cleanId = String(id || "").trim();
  const sectionKind = String(kind || cleanId || "section").trim();

  return {
    ...templateVisualProps(cleanId, "section", label),
    "data-template-section-id": cleanId,
    "data-section-kind": sectionKind,
    "data-section-title": label,
    "data-bizuply-block": "section",
  };
}

export function templateMediaProps(
  id: string,
  label?: string,
): Record<string, string> {
  const cleanId = String(id || "").trim();
  if (!cleanId) return {};

  return {
    ...templateVisualProps(cleanId, "image", label || "תמונה"),
    "data-editable": "image",
    "data-field": cleanId,
    "data-image-field": cleanId,
    "data-visual-image-field": cleanId,
    "data-media-field": cleanId,
  };
}
