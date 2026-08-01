import React, { useState } from "react";
import { LayoutTemplate } from "lucide-react";

import {
  getTemplateFullPageScreenshotUrl,
  hasTemplateFullPageScreenshot,
} from "../../utils/templateScreenshot";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /**
   * Full-page template screenshot URL only.
   * Must NOT be a hero/cover/featured image.
   */
  fullPageScreenshot?: string;
  /** First-viewport cards may eager-load; others stay lazy. */
  eager?: boolean;
};

function resolveScreenshotSrc(
  templateKey: string,
  fullPageScreenshot?: string,
) {
  const explicit = String(fullPageScreenshot || "").trim();
  if (explicit) return explicit;
  return getTemplateFullPageScreenshotUrl(templateKey);
}

export function canRenderTemplatePreview(
  templateKey?: string | null,
) {
  return hasTemplateFullPageScreenshot(templateKey);
}

function PreviewPlaceholder({ title }: { title?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#eef1f4] p-4">
      <LayoutTemplate className="h-10 w-10 text-[#9ca3af]" aria-hidden />
      <span className="max-w-[85%] truncate text-center text-xs font-bold text-[#6b7280]">
        {title || "צילום תבנית בקרוב"}
      </span>
    </div>
  );
}

/**
 * Gallery card — static full-page template screenshot only.
 * Never mounts template components, iframes, live renderers, or hero images.
 */
export default function TemplateCardPreview({
  templateKey,
  title,
  fullPageScreenshot,
  eager = false,
}: TemplateCardPreviewProps) {
  const src = resolveScreenshotSrc(templateKey, fullPageScreenshot);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="relative h-full w-full overflow-hidden bg-[#eef1f4]"
        aria-label={title || templateKey || "תצוגה מקדימה"}
      >
        <PreviewPlaceholder title={title} />
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#eef1f4]"
      aria-label={title || templateKey || "תצוגה מקדימה"}
    >
      <img
        src={src}
        alt={title || templateKey || "צילום מסך מלא של התבנית"}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
      />
    </div>
  );
}
