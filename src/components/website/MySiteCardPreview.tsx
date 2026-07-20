import React, { useEffect, useState } from "react";
import { LayoutTemplate } from "lucide-react";

import type { MySiteSummary } from "../../api/mySitesApi";
import { getTemplateCoverUrl } from "../../utils/templateCover";
import { scheduleGalleryPreview } from "../../utils/templatePreviewScheduler";
import IframeCardPreview from "./IframeCardPreview";

type MySiteCardPreviewProps = {
  site: MySiteSummary;
};

/**
 * My Sites card preview — same batch-loading UX as templates gallery:
 * poster paints immediately, then live embed of the real saved site mounts
 * in quick batches for every card on page open.
 */
export default function MySiteCardPreview({ site }: MySiteCardPreviewProps) {
  const siteId = String(site._id || "").trim();
  const cover =
    String(site.thumbnailUrl || "").trim() ||
    getTemplateCoverUrl(site.templateKey);

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!siteId) return;

    const subscribe = scheduleGalleryPreview(`site:${siteId}`);
    return subscribe((isActive) => setActive(isActive));
  }, [siteId]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-violet-50">
      {cover ? (
        <img
          src={cover}
          alt={site.name || "תצוגה מקדימה של האתר"}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.025]"
        />
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden px-4">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-violet-200/45 blur-3xl" />
          <div className="absolute -bottom-12 -right-8 h-36 w-36 rounded-full bg-fuchsia-200/35 blur-3xl" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-[18px] border border-white bg-white/80 shadow-md backdrop-blur">
            <LayoutTemplate className="h-7 w-7 text-violet-500" />
          </div>
          <div className="relative text-center">
            <p className="text-sm font-black text-slate-700">
              {site.templateName || site.templateKey || "אתר Bizuply"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              תצוגה מקדימה תופיע לאחר השמירה
            </p>
          </div>
        </div>
      )}

      {!active && cover ? (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-white/10" />
      ) : null}

      {active && siteId ? (
        <div className="absolute inset-0 bg-white">
          <IframeCardPreview
            src={`/embed/site/${encodeURIComponent(siteId)}`}
            title={site.name || "תצוגה מקדימה של האתר"}
            activateOn="immediate"
          />
        </div>
      ) : null}
    </div>
  );
}
