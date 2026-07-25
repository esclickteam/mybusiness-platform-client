import React, { useEffect, useState } from "react";

const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

type SafeImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src?: string | null;
};

/**
 * Image that never shows a broken-icon / letter placeholder.
 * Falls back to a known-good Unsplash asset on missing/failed sources.
 */
export default function SafeImg({ src, alt = "", onError, ...rest }: SafeImgProps) {
  const resolved = String(src || "").trim();
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
