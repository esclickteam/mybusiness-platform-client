import React, { useState } from "react";
import { LayoutTemplate } from "lucide-react";

import { getTemplateCoverUrl } from "../../utils/templateCover";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /** Static cover / thumbnail for the card. */
  coverImage?: string;
  /** First-viewport cards may eager-load; others stay lazy. */
  eager?: boolean;
};

function firstNonEmpty(...values: unknown[]) {
  for (const value of values) {
    const text = String(value || "").trim();
    if (text) return text;
  }
  return "";
}

/** Prefer a smaller still for gallery cards (avoid loading full hero assets). */
export function toCardThumbnailUrl(url: string): string {
  const src = String(url || "").trim();
  if (!src) return "";

  try {
    if (src.includes("images.unsplash.com")) {
      const parsed = new URL(src);
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set("w", "640");
      parsed.searchParams.set("q", "70");
      return parsed.toString();
    }

    if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
      if (/\/upload\/[^/]*[fw]_/.test(src)) return src;
      return src.replace("/upload/", "/upload/f_auto,q_auto,w_640,c_fill/");
    }
  } catch {
    return src;
  }

  return src;
}

export function canRenderTemplatePreview(
  templateKey?: string | null,
) {
  // Cards always render as static stills (image or placeholder).
  void templateKey;
  return true;
}

function PreviewPlaceholder({ title }: { title?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#eef1f4] p-4">
      <LayoutTemplate className="h-10 w-10 text-[#9ca3af]" aria-hidden />
      <span className="max-w-[85%] truncate text-center text-xs font-bold text-[#6b7280]">
        {title || "תצוגה מקדימה"}
      </span>
    </div>
  );
}

/**
 * Gallery card — static preview still only.
 * Never mounts template components, iframes, or live site renderers.
 */
export default function TemplateCardPreview({
  templateKey,
  title,
  coverImage,
  eager = false,
}: TemplateCardPreviewProps) {
  const rawSrc = firstNonEmpty(coverImage, getTemplateCoverUrl(templateKey));
  const src = toCardThumbnailUrl(rawSrc);
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
        alt={title || templateKey || "תצוגה מקדימה של תבנית"}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
      />
    </div>
  );
}
