import React from "react";
import { useTranslation } from "react-i18next";
import { Info, LineChart } from "lucide-react";
import type { AdsManagerGender, AdsManagerState } from "../adsManagerTypes";
import { MetaSidebarCard } from "../metaAdsUi";

type Props = {
  estimate: AdsManagerState["audienceEstimate"];
  locationsSummary: string;
  advantageAudience: boolean;
  ageMin: number;
  ageMax: number;
  gender: AdsManagerGender;
  estimateLoading?: boolean;
};

function ageLabel(ageMin: number, ageMax: number) {
  return `${ageMin} - ${ageMax >= 65 ? "65+" : ageMax}`;
}

function formatAudience(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

export default function AdSetInsightsSidebar({
  estimate,
  locationsSummary,
  advantageAudience,
  ageMin,
  ageMax,
  gender,
  estimateLoading = false,
}: Props) {
  const { t } = useTranslation();
  const cc = (key: string, opts?: Record<string, unknown>) =>
    t(`metaCampaigns.adsManager.chrome.${key}`, opts as never);
  const genderLabel =
    gender === "male"
      ? cc("genderMen")
      : gender === "female"
        ? cc("genderWomen")
        : cc("genderAll");
  const spectrum = Math.min(0.98, Math.max(0.02, estimate.spectrum || 0.5));
  const band =
    spectrum >= 0.66 ? "broad" : spectrum >= 0.33 ? "mid" : "narrow";

  return (
    <div className="space-y-3">
      <MetaSidebarCard title={cc("audienceDefinition")}>
        <div className="space-y-3 text-[13px]">
          <div>
            <p className="font-semibold text-[#65676B]">{cc("locations")}</p>
            <p className="mt-0.5 font-bold text-[#050505]">
              {locationsSummary || cc("notSet")}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#65676B]">{cc("age")}</p>
            <p className="mt-0.5 font-bold text-[#050505]">
              {ageLabel(ageMin, ageMax)}
              {advantageAudience ? (
                <span className="ml-2 rounded-full bg-[#E4E6EB] px-2 py-0.5 text-[10px] font-semibold text-[#65676B]">
                  {cc("suggestion")}
                </span>
              ) : null}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#65676B]">{cc("gender")}</p>
            <p className="mt-0.5 font-bold text-[#050505]">
              {genderLabel}
            </p>
          </div>
        </div>
      </MetaSidebarCard>

      {/* Meta-style potential reach card */}
      <div className="rounded-lg border border-[#E4E6EB] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <p className="text-[13px] leading-snug text-[#050505]">
          {band === "broad"
            ? cc("audienceBroadMsg")
            : band === "mid"
              ? cc("audienceMidMsg")
              : cc("audienceNarrowMsg")}
        </p>

        <div className="mt-3">
          <div className="relative h-2.5 overflow-hidden rounded-sm">
            <div className="absolute inset-0 flex">
              <div className="w-[28%] bg-[#F8D7DA]" />
              <div className="w-[36%] bg-[#FFF3CD]" />
              <div className="w-[36%] bg-[#0D7377]" />
            </div>
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#1877F2] shadow"
              style={{ left: `calc(${Math.round(spectrum * 100)}% - 7px)` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[12px] font-semibold text-[#65676B]">
            <span>{cc("narrow")}</span>
            <span>{cc("broad")}</span>
          </div>
        </div>

        <div className="mt-3 border-t border-[#E4E6EB] pt-3">
          <p className="flex flex-wrap items-center gap-1 text-[13px] font-bold text-[#050505]">
            {cc("estimatedAudienceSize")}{" "}
            {estimateLoading ? (
              <span className="font-semibold text-[#65676B]">
                {cc("updating")}
              </span>
            ) : (
              <span>
                {formatAudience(estimate.lower)} -{" "}
                {formatAudience(estimate.upper)}
              </span>
            )}
            <Info className="h-3.5 w-3.5 text-[#65676B]" />
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-[#65676B]">
            <LineChart className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {cc("estimateDisclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
