import React, { useState } from "react";
import { AlertTriangle, Eye, Share2 } from "lucide-react";
import type { AdDraft, InstantFormItem } from "../adsManagerTypes";
import {
  MetaSidebarCard,
  MetaToggle,
  metaBtnGhost,
  metaBtnSecondary,
} from "../metaAdsUi";

type Props = {
  ad: AdDraft;
  forms: InstantFormItem[];
  score: number;
};

export default function AdInsightsSidebar({ ad, forms, score }: Props) {
  const [previewOn, setPreviewOn] = useState(true);
  const [tab, setTab] = useState<"ad" | "destination">("destination");
  const selectedForm = forms.find((f) => f.id === ad.instantFormId);

  return (
    <div className="space-y-3">
      <MetaSidebarCard title="Campaign score">
        <p className="text-[28px] font-bold leading-none text-[#050505]">
          {score}
        </p>
        <p className="mt-1 text-[12px] text-[#65676B]">
          Based on completeness across campaign structure.
        </p>
      </MetaSidebarCard>

      <MetaSidebarCard title="Verifying your changes">
        {!ad.instantFormId ? (
          <div className="flex gap-2 rounded-md border border-[#F5D78E] bg-[#FFF8E5] px-2.5 py-2 text-[13px] text-[#050505]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F7B928]" />
            <span>Create an instant form to publish this campaign.</span>
          </div>
        ) : (
          <p className="text-[13px] text-[#31A24C]">
            Required ad settings look complete.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={metaBtnSecondary}>
            <Eye className="h-3.5 w-3.5" />
            Advanced preview
          </button>
          <button type="button" className={metaBtnGhost}>
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </MetaSidebarCard>

      <MetaSidebarCard title="Ad preview">
        <div className="mb-3">
          <MetaToggle
            checked={previewOn}
            onChange={setPreviewOn}
            label="Show preview"
          />
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
              <div className="overflow-hidden rounded-xl border border-[#CED0D4] bg-[#F0F2F5]">
                <div className="bg-white px-3 py-2.5">
                  <p className="text-[12px] font-bold text-[#050505]">
                    {ad.facebookPageName}
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-[#050505]">
                    {ad.primaryText}
                  </p>
                  <div className="mt-3 flex h-28 items-center justify-center bg-[#E4E6EB] text-[12px] font-semibold text-[#65676B]">
                    {ad.mediaLabel}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] uppercase text-[#65676B]">
                        {ad.displayLink || "example.com"}
                      </p>
                      <p className="text-[13px] font-bold text-[#050505]">
                        {ad.headline}
                      </p>
                    </div>
                    <span className="rounded-md bg-[#E4E6EB] px-2 py-1 text-[11px] font-bold">
                      Learn more
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[1.4rem] border-[6px] border-[#1C1E21] bg-white shadow-lg">
                <div className="border-b border-[#E4E6EB] px-3 py-2 text-center text-[12px] font-bold text-[#050505]">
                  {selectedForm?.name || "Instant form"}
                </div>
                <div className="space-y-2.5 px-3 py-3">
                  <div className="h-8 rounded-md bg-[#F0F2F5]" />
                  <div className="h-8 rounded-md bg-[#F0F2F5]" />
                  <div className="h-8 rounded-md bg-[#F0F2F5]" />
                  <p className="text-[11px] text-[#65676B]">
                    {selectedForm
                      ? `${selectedForm.customQuestions} custom questions`
                      : "Select a form to preview questions"}
                  </p>
                </div>
                <div className="border-t border-[#E4E6EB] px-3 py-2.5">
                  <button
                    type="button"
                    className="flex h-9 w-full items-center justify-center rounded-md bg-[#1877F2] text-[14px] font-bold text-white"
                  >
                    Continue
                  </button>
                </div>
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
