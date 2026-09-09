import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const cc = (key: string, opts?: Record<string, unknown>) =>
    t(`metaCampaigns.adsManager.chrome.${key}`, opts as never);
  const ring = Math.max(0, Math.min(100, score));
  return (
    <div className="space-y-3">
      <MetaSidebarCard title={cc("campaignScore")}>
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
              {ring >= 80
                ? cc("scoreStrong")
                : ring >= 60
                  ? cc("scoreGood")
                  : cc("scoreNeedsWork")}
            </p>
            <p className="mt-0.5 text-[12px] leading-snug text-[#65676B]">
              {cc("scoreHint")}
            </p>
          </div>
        </div>
      </MetaSidebarCard>

      <MetaSidebarCard title={cc("advantagePlusLeadsTitle")}>
        <MetaToggle
          checked={campaign.advantagePlusLeads}
          onChange={(advantagePlusLeads) => onChange({ advantagePlusLeads })}
          label={cc("advantageOn")}
          description={cc("advantagePlusLeadsDesc")}
        />
      </MetaSidebarCard>

      <MetaSidebarCard title={cc("recommendations")}>
        <ul className="space-y-2 text-[13px] text-[#050505]">
          <li className="rounded-md bg-[#F0F2F5] px-2.5 py-2">
            {cc("recConversionEvent")}
          </li>
          <li className="rounded-md bg-[#F0F2F5] px-2.5 py-2">
            {cc("recBudget")}
          </li>
          <li className="rounded-md bg-[#E7F3FF] px-2.5 py-2 text-[#1877F2]">
            {cc("verifyingChangesShort")}
          </li>
        </ul>
      </MetaSidebarCard>
    </div>
  );
}
