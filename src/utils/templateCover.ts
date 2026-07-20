import {
  getStudioTemplateById,
  getStudioTemplateSeedById,
} from "../components/site-builder/studio/data/templates";

/**
 * Instant cover image for template/site cards (Webflow-style marketplace).
 * Prefer seed/meta stills so the grid paints immediately without iframes.
 */
export function getTemplateCoverUrl(
  templateKey: string | null | undefined,
): string {
  const key = String(templateKey || "").trim().toLowerCase();
  if (!key) return "";

  const definition = getStudioTemplateById(key) as
    | {
        previewImage?: string;
        image?: string;
        seed?: { image?: string; previewImage?: string };
      }
    | undefined;

  const seed = getStudioTemplateSeedById(key) as
    | { image?: string; previewImage?: string }
    | undefined;

  return (
    String(seed?.image || "").trim() ||
    String(seed?.previewImage || "").trim() ||
    String(definition?.previewImage || "").trim() ||
    String(definition?.image || "").trim() ||
    String(definition?.seed?.image || "").trim() ||
    ""
  );
}
