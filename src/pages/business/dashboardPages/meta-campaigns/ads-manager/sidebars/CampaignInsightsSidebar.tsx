import React from "react";
import type { CampaignDraft } from "../adsManagerTypes";
import { MetaSidebarCard, MetaToggle } from "../metaAdsUi";

type Props = {
  campaign: CampaignDraft;
  score: number;
  onChange: (patch: Partial<CampaignDraft>) => void;
};

export default function CampaignInsightsSidebar({
  campaign,
  score,
  onChange,
}: Props) {
  const ring = Math.max(0, Math.min(100, score));
  return (
    <div className="space-y-3">
      <MetaSidebarCard title="Campaign score">
        <div className="flex items-center gap-3">
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#1877F2 ${ring * 3.6}deg, #E4E6EB 0deg)`,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[15px] font-bold text-[#050505]">
              {ring}
            </div>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#050505]">
              {ring >= 80 ? "Strong setup" : ring >= 60 ? "Good start" : "Needs work"}
            </p>
            <p className="mt-0.5 text-[12px] leading-snug text-[#65676B]">
              Finish required settings across campaign, ad set and ad to improve
              your score.
            </p>
          </div>
        </div>
      </MetaSidebarCard>

      <MetaSidebarCard title="Advantage+ leads campaign">
        <MetaToggle
          checked={campaign.advantagePlusLeads}
          onChange={(advantagePlusLeads) => onChange({ advantagePlusLeads })}
          label="Advantage+ on"
          description="Use AI to find people most likely to convert into leads."
        />
      </MetaSidebarCard>

      <MetaSidebarCard title="Recommendations">
        <ul className="space-y-2 text-[13px] text-[#050505]">
          <li className="rounded-md bg-[#F0F2F5] px-2.5 py-2">
            Add a clear conversion event for better optimization.
          </li>
          <li className="rounded-md bg-[#F0F2F5] px-2.5 py-2">
            Review your budget against expected cost per lead.
          </li>
          <li className="rounded-md bg-[#E7F3FF] px-2.5 py-2 text-[#1877F2]">
            Verifying your changes…
          </li>
        </ul>
      </MetaSidebarCard>
    </div>
  );
}
