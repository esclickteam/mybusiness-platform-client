import React from "react";
import type { AdsManagerGender, AdsManagerState } from "../adsManagerTypes";
import { MetaSidebarCard } from "../metaAdsUi";

type Props = {
  estimate: AdsManagerState["audienceEstimate"];
  locationsSummary: string;
  advantageAudience: boolean;
  ageMin: number;
  ageMax: number;
  gender: AdsManagerGender;
};

function genderLabel(gender: AdsManagerGender) {
  if (gender === "male") return "Men";
  if (gender === "female") return "Women";
  return "All genders";
}

function ageLabel(ageMin: number, ageMax: number) {
  return `${ageMin} - ${ageMax >= 65 ? "65+" : ageMax}`;
}

export default function AdSetInsightsSidebar({
  estimate,
  locationsSummary,
  advantageAudience,
  ageMin,
  ageMax,
  gender,
}: Props) {
  const spectrumPct = Math.round(estimate.spectrum * 100);
  return (
    <div className="space-y-3">
      <MetaSidebarCard title="Audience definition">
        <div className="space-y-3 text-[13px]">
          <div>
            <p className="font-semibold text-[#65676B]">Locations</p>
            <p className="mt-0.5 font-bold text-[#050505]">
              {locationsSummary || "Not set"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#65676B]">Age</p>
            <p className="mt-0.5 font-bold text-[#050505]">
              {ageLabel(ageMin, ageMax)}
              {advantageAudience ? (
                <span className="ml-2 rounded-full bg-[#E4E6EB] px-2 py-0.5 text-[10px] font-semibold text-[#65676B]">
                  Suggestion
                </span>
              ) : null}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#65676B]">Gender</p>
            <p className="mt-0.5 font-bold text-[#050505]">
              {genderLabel(gender)}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#65676B]">Audience type</p>
            <p className="mt-0.5 font-bold text-[#050505]">
              {advantageAudience ? "Advantage+ audience" : "Manual audience"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#65676B]">
              Estimated audience size
            </p>
            <p className="mt-0.5 text-[18px] font-bold text-[#050505]">
              {estimate.lower.toLocaleString()} –{" "}
              {estimate.upper.toLocaleString()}
            </p>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px] font-bold uppercase tracking-wide text-[#65676B]">
              <span>Narrow</span>
              <span>Broad</span>
            </div>
            <div className="relative h-2 rounded-full bg-[#E4E6EB]">
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#1877F2] shadow"
                style={{ left: `calc(${spectrumPct}% - 7px)` }}
              />
            </div>
          </div>
        </div>
      </MetaSidebarCard>
    </div>
  );
}
