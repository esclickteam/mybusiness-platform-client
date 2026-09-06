import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CAPTIONS_STORAGE_KEY = "bizuply_meta_ads_review_captions_hidden";

type CaptionSet = "settings" | "overview";

const SETTINGS_CAPTION_KEYS = [
  "metaCampaigns.review.settingsCaption1",
  "metaCampaigns.review.settingsCaption2",
  "metaCampaigns.review.settingsCaption3",
  "metaCampaigns.review.settingsCaption4",
] as const;

const OVERVIEW_CAPTION_KEYS = [
  "metaCampaigns.review.overviewCaption1",
  "metaCampaigns.review.overviewCaption2",
  "metaCampaigns.review.overviewCaption3",
  "metaCampaigns.review.overviewCaption4",
] as const;

export default function MetaAdsReviewCaptions({
  set = "overview",
}: {
  set?: CaptionSet;
}) {
  const { t } = useTranslation();
  const captionKeys = set === "settings" ? SETTINGS_CAPTION_KEYS : OVERVIEW_CAPTION_KEYS;
  const captions = captionKeys.map((key) => t(key));
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(CAPTIONS_STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!show) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % captions.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [captions.length, show]);

  if (!show) return null;

  const hide = () => {
    setShow(false);
    try {
      sessionStorage.setItem(CAPTIONS_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:inset-x-auto">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-700">
            {set === "settings"
              ? t("metaCampaigns.review.captionsAuth", {
                  defaultValue:
                    "App Review · Facebook Login · ads_read · ads_management · business_management",
                })
              : t("metaCampaigns.review.captionsUse", {
                  defaultValue:
                    "App Review · ads_read · ads_management · business_management",
                })}
          </p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700">
            {captions[index]}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {captions.map((caption, captionIndex) => (
              <button
                key={caption}
                type="button"
                onClick={() => setIndex(captionIndex)}
                className={[
                  "h-1.5 w-6 rounded-full",
                  captionIndex === index ? "bg-violet-500" : "bg-slate-200",
                ].join(" ")}
                aria-label={t("metaCampaigns.review.captionN", { n: captionIndex + 1 })}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={hide}
          className="shrink-0 rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-50"
        >
          {t("metaCampaigns.review.hideCaptions", { defaultValue: "Hide" })}
        </button>
      </div>
    </div>
  );
}
