import React, { useEffect, useRef, useState } from "react";

import type { MySiteSummary } from "../../api/mySitesApi";
import { getTemplateCoverUrl } from "../../utils/templateCover";
import {
  releaseGalleryPreview,
  scheduleGalleryPreview,
} from "../../utils/templatePreviewScheduler";
import IframeCardPreview from "./IframeCardPreview";

type MySiteCardPreviewProps = {
  site: MySiteSummary;
};

function NeutralSitePlaceholder({
  label,
  loading = false,
}: {
  label?: string;
  loading?: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-end justify-start bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 p-4 ${
        loading ? "animate-pulse" : ""
      }`}
    >
      <div className="rounded-md bg-white/80 px-3 py-2 text-xs font-black text-slate-700 shadow-sm">
        {label || "האתר שלי"}
      </div>
    </div>
  );
}

/**
 * My Sites card preview — live embed of the saved/published site.
 * Never flash the template's stock cover; show a neutral placeholder until
 * the latest saved site iframe is ready.
 */
export default function MySiteCardPreview({ site }: MySiteCardPreviewProps) {
  const siteId = String(site._id || "").trim();
  const templateKey = String(site.templateKey || "").trim();
  const templateCover = getTemplateCoverUrl(templateKey);
  const rawThumbnail = String(site.thumbnailUrl || "").trim();
  // Skip thumbnails that are just the template stock poster — those look
  // unrelated to the user's edited site.
  const sitePoster =
    rawThumbnail && rawThumbnail !== templateCover ? rawThumbnail : "";
  const cacheKey = String(
    site.updatedAt || (site as { publishedAt?: string }).publishedAt || "",
  ).trim();
  const previewKey = siteId ? `site:${siteId}` : "";

  const frameRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [active, setActive] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting || entry.intersectionRatio > 0);
      },
      { rootMargin: "360px 0px", threshold: 0.01 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!previewKey) return;

    if (!inView) {
      releaseGalleryPreview(previewKey);
      setActive(false);
      setIframeLoaded(false);
      return;
    }

    const subscribe = scheduleGalleryPreview(previewKey, { priority: true });
    return subscribe((isActive) => {
      setActive(isActive);
      if (!isActive) setIframeLoaded(false);
    });
  }, [inView, previewKey]);

  useEffect(() => {
    setIframeLoaded(false);
  }, [cacheKey, siteId]);

  const embedSrc = siteId
    ? `/embed/site/${encodeURIComponent(siteId)}${
        cacheKey ? `?v=${encodeURIComponent(cacheKey)}` : ""
      }`
    : "";

  const showLive = active && iframeLoaded;

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-[#eef1f4]"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          showLive ? "opacity-0" : "opacity-100"
        }`}
      >
        {sitePoster ? (
          <img
            src={sitePoster}
            alt={site.name || "תצוגה מקדימה של האתר"}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <NeutralSitePlaceholder
            label={site.name || site.templateName || "האתר שלי"}
            loading={!showLive}
          />
        )}
      </div>

      {active && embedSrc ? (
        <div
          className={`absolute inset-0 bg-transparent transition-opacity duration-200 ${
            showLive ? "opacity-100" : "opacity-0"
          }`}
        >
          <IframeCardPreview
            src={embedSrc}
            title={site.name || "תצוגה מקדימה של האתר"}
            activateOn="immediate"
            enableHoverPan
            eagerLoad
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      ) : null}
    </div>
  );
}
