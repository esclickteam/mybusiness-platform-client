import {
  getStudioTemplateById,
  getStudioTemplateSeedById,
} from "../components/site-builder/studio/data/templates";

function firstHttpUrl(...values: unknown[]) {
  for (const value of values) {
    const text = String(value || "").trim();
    if (/^https?:\/\//i.test(text)) return text;
  }
  return "";
}

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
        seed?: Record<string, any>;
        renderer?: { defaultData?: Record<string, any> };
      }
    | undefined;

  const seed = (getStudioTemplateSeedById(key) || definition?.seed || {}) as
    | Record<string, any>
    | undefined;

  const defaultData = (definition?.renderer?.defaultData ||
    seed?.defaultData ||
    {}) as Record<string, any>;

  return (
    firstHttpUrl(
      seed?.image,
      seed?.previewImage,
      definition?.previewImage,
      definition?.image,
      definition?.seed?.image,
      definition?.seed?.previewImage,
      defaultData?.heroImage,
      defaultData?.image,
      defaultData?.coverImage,
      defaultData?.previewImage,
    ) || ""
  );
}
