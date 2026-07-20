import React from "react";

import { hasStudioTemplateRenderer } from "../site-builder/studio/data/templates/templateRendererRegistry";
import IframeCardPreview from "./IframeCardPreview";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
};

function normalizeKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

export function canRenderTemplatePreview(
  templateKey: string | null | undefined,
) {
  return hasStudioTemplateRenderer(templateKey);
}

/**
 * Webflow-style live thumbnail: embeds the real template homepage via
 * /embed/template/:key so the card shows actual template UX (Tailwind +
 * editorCss), not a static screenshot or unstyled SSR markup.
 */
export default function TemplateCardPreview({
  templateKey,
  title,
}: TemplateCardPreviewProps) {
  const key = normalizeKey(templateKey);

  if (!key || !canRenderTemplatePreview(key)) {
    return <div className="h-full w-full animate-pulse bg-slate-100" />;
  }

  return (
    <IframeCardPreview
      src={`/embed/template/${encodeURIComponent(key)}`}
      title={title || key}
      enableHoverPan
    />
  );
}
