import React from "react";

import {
  getStudioTemplateById,
  hasStudioTemplateDefinition,
} from "../site-builder/studio/data/templates";
import IframeCardPreview from "./IframeCardPreview";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
};

export function canRenderTemplatePreview(
  templateKey: string | null | undefined,
) {
  const key = String(templateKey || "").trim().toLowerCase();
  if (!key) return false;
  return (
    hasStudioTemplateDefinition(key) &&
    Boolean(getStudioTemplateById(key))
  );
}

/**
 * Live preview of the real built template, rendered in an isolated <iframe> via
 * the standalone /embed/template route so it looks 1:1 like the actual template.
 */
export default function TemplateCardPreview({
  templateKey,
  title,
}: TemplateCardPreviewProps) {
  const key = String(templateKey || "").trim().toLowerCase();

  return (
    <IframeCardPreview
      src={`/embed/template/${encodeURIComponent(key)}`}
      title={title}
    />
  );
}
