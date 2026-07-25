import React, { useEffect, useState } from "react";

const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";

/** Known-dead Unsplash photo ids that still appear in synced/Mongo template data. */
const BROKEN_UNSPLASH_IDS = new Set([
  "1523050854058-8df90110c9f1",
]);

function rewriteBrokenSrc(src: string): string {
  const match = src.match(/images\.unsplash\.com\/photo-([0-9a-zA-Z_-]+)/i);
  if (match && BROKEN_UNSPLASH_IDS.has(match[1])) {
    return SAFE_IMAGE_FALLBACK;
  }
  return src;
}

type SafeImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src?: string | null;
};

/**
 * Image that never shows a broken-icon / letter placeholder.
 * Falls back to a known-good Unsplash asset on missing/failed sources.
 */
export default function SafeImg({ src, alt = "", onError, ...rest }: SafeImgProps) {
  const resolved = rewriteBrokenSrc(String(src || "").trim());
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      {...rest}
      alt={alt}
      src={!resolved || failed ? SAFE_IMAGE_FALLBACK : resolved}
      onError={(event) => {
        const el = event.currentTarget;
        if (el.dataset.fallback === "1") return;
        el.dataset.fallback = "1";
        setFailed(true);
        el.src = SAFE_IMAGE_FALLBACK;
        onError?.(event);
      }}
    />
  );
}
