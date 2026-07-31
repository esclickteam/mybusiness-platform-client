import React, { useMemo, useState } from "react";
import { AlertTriangle, Eye, MonitorSmartphone, Smartphone } from "lucide-react";
import type { MetaLeadForm } from "../../../../../../api/metaCampaignsApi";
import type { AdDraft, InstantFormItem } from "../adsManagerTypes";
import AdPlacementPreview from "../../AdPlacementPreview";
import InstantFormFlowPreview from "../InstantFormFlowPreview";
import { metaCtaLabel } from "../metaAdCtas";
import {
  MetaSidebarCard,
  MetaToggle,
  metaBtnSecondary,
} from "../metaAdsUi";

type Props = {
  ad: AdDraft;
  forms: InstantFormItem[];
  selectedLeadForm: MetaLeadForm | null;
  score: number;
};

export default function AdInsightsSidebar({
  ad,
  forms,
  selectedLeadForm,
  score,
}: Props) {
  const [previewOn, setPreviewOn] = useState(true);
  const [tab, setTab] = useState<"ad" | "destination">("ad");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const selectedFormMeta = forms.find((f) => f.id === ad.instantFormId);
  const formForPreview =
    selectedLeadForm ||
    (selectedFormMeta
      ? ({
          id: selectedFormMeta.id,
          name: selectedFormMeta.name,
          questions: [],
        } as MetaLeadForm)
      : null);

  const ctaLabel = metaCtaLabel(ad.callToAction) || "Sign up";
  const issues = useMemo(() => {
    const list: string[] = [];
    if (!ad.imagePreviewUrl && !ad.videoId) list.push("Add image or video");
    if (!ad.instantFormId) list.push("Select or create an instant form");
    if (!ad.primaryText.trim() || !ad.headline.trim()) {
      list.push("Add primary text and headline");
    }
    return list;
  }, [ad]);

  return (
    <div className="space-y-3 pb-6">
      <MetaSidebarCard title="Campaign score">
        <div className="flex items-center gap-3">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#E4E6EB"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#31A24C"
                strokeWidth="3"
                strokeDasharray={`${Math.min(100, score) * 0.97} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[16px] font-bold text-[#050505]">
              {score}
            </span>
          </div>
          <p className="text-[13px] font-semibold text-[#050505]">
            {score >= 90
              ? "You're using our recommended setup."
              : "Complete media, form and text to improve score."}
          </p>
        </div>
      </MetaSidebarCard>

      <MetaSidebarCard title="Verifying your changes">
        {issues.length ? (
          <div className="space-y-2">
            {issues.map((issue) => (
              <div
                key={issue}
                className="flex gap-2 rounded-md border border-[#F5D78E] bg-[#FFF8E5] px-2.5 py-2 text-[13px] text-[#050505]"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F7B928]" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#31A24C]">
            Required ad settings look complete.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className={metaBtnSecondary}>
            <Eye className="h-3.5 w-3.5" />
            Advanced preview
          </button>
          {issues.length ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#F7B928]">
              <AlertTriangle className="h-3.5 w-3.5" />
              {issues.length}
            </span>
          ) : null}
        </div>
      </MetaSidebarCard>

      <MetaSidebarCard title="Ad preview">
        <div className="mb-3 flex items-center justify-between gap-2">
          <MetaToggle
            checked={previewOn}
            onChange={setPreviewOn}
            label="Ad preview"
          />
          <div className="flex gap-1">
            <button
              type="button"
              title="Mobile"
              onClick={() => setDevice("mobile")}
              className={[
                "rounded-md p-1.5",
                device === "mobile"
                  ? "bg-[#E7F3FF] text-[#1877F2]"
                  : "text-[#65676B] hover:bg-[#F0F2F5]",
              ].join(" ")}
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Desktop / mobile"
              onClick={() => setDevice("desktop")}
              className={[
                "rounded-md p-1.5",
                device === "desktop"
                  ? "bg-[#E7F3FF] text-[#1877F2]"
                  : "text-[#65676B] hover:bg-[#F0F2F5]",
              ].join(" ")}
            >
              <MonitorSmartphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        {previewOn ? (
          <>
            <div className="mb-3 flex gap-1 border-b border-[#E4E6EB]">
              {(["ad", "destination"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={[
                    "px-3 py-1.5 text-[13px] font-bold capitalize",
                    tab === key
                      ? "border-b-2 border-[#1877F2] text-[#1877F2]"
                      : "text-[#65676B]",
                  ].join(" ")}
                >
                  {key === "ad" ? "Ad" : "Destination"}
                </button>
              ))}
            </div>

            {tab === "ad" ? (
              <div
                className={[
                  "space-y-4",
                  device === "mobile" ? "mx-auto max-w-[280px]" : "",
                ].join(" ")}
              >
                <div>
                  <p className="mb-2 text-[12px] font-bold text-[#65676B]">
                    Facebook Feed
                  </p>
                  <AdPlacementPreview
                    adFormat="DESKTOP_FEED_STANDARD"
                    pageName={ad.facebookPageName || "Your Page"}
                    primaryText={ad.primaryText}
                    headline={ad.headline}
                    description={ad.description}
                    ctaLabel={ctaLabel}
                    imageUrl={ad.imagePreviewUrl}
                    displayLink={ad.displayLink}
                    link={ad.websiteUrl}
                    creativeFormat={
                      ad.creativeFormat === "video" ? "video" : "single"
                    }
                  />
                </div>

                {/* Meta-style Instant Form preview under ad image + text */}
                <InstantFormFlowPreview
                  form={formForPreview}
                  pageName={ad.facebookPageName || "Your Page"}
                  fallbackHeadline={ad.headline}
                />
              </div>
            ) : (
              <div
                className={device === "mobile" ? "mx-auto max-w-[280px]" : ""}
              >
                <InstantFormFlowPreview
                  form={formForPreview}
                  pageName={ad.facebookPageName || "Your Page"}
                  fallbackHeadline={ad.headline}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-[13px] text-[#65676B]">Preview is turned off.</p>
        )}
      </MetaSidebarCard>
    </div>
  );
}
