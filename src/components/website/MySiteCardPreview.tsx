import React, { useState } from "react";
import { LayoutTemplate } from "lucide-react";

import type { MySiteSummary } from "../../api/mySitesApi";
import { getSiteCardScreenshotUrl } from "../../utils/captureSiteScreenshot";

type MySiteCardPreviewProps = {
  site: MySiteSummary;
  eager?: boolean;
};

function NeutralSitePlaceholder({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#eef1f4] p-4">
      <LayoutTemplate className="h-10 w-10 text-[#9ca3af]" aria-hidden />
      <span className="max-w-[85%] truncate text-center text-xs font-bold text-[#6b7280]">
        {label || "האתר שלי"}
      </span>
    </div>
  );
}

/**
 * My Sites card preview — static full-page screenshot only.
 * Never mounts iframes, PublicVisualSiteRenderer, or hero/cover images.
 */
export default function MySiteCardPreview({
  site,
  eager = false,
}: MySiteCardPreviewProps) {
  const src = getSiteCardScreenshotUrl(site);
  const [failed, setFailed] = useState(false);
  const label = site.name || site.templateName || "האתר שלי";

  if (!src || failed) {
    return (
      <div
        className="relative h-full w-full overflow-hidden bg-[#eef1f4]"
        aria-label={label}
      >
        <NeutralSitePlaceholder label={label} />
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#eef1f4]"
      aria-label={label}
    >
      <img
        src={src}
        alt={label}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
      />
    </div>
  );
}
