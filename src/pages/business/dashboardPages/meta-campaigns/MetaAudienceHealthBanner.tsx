import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Users } from "lucide-react";
import type {
  MetaInterestTarget,
  MetaLocationTarget,
} from "../../../../api/metaCampaignsApi";

type Props = {
  locations: MetaLocationTarget[];
  interests: MetaInterestTarget[];
  ageMin: string;
  ageMax: string;
  gender: "all" | "1" | "2";
  advantageAudience: boolean;
  placementMode: "advantage" | "facebook" | "instagram" | "both" | string;
};

function formatAudienceSize(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

function isAgeRangeValid(ageMin: string, ageMax: string) {
  const min = Number(ageMin);
  const max = Number(ageMax);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return false;
  return min >= 13 && max >= min;
}

function hasPlacements(placementMode: string) {
  const mode = String(placementMode || "").toLowerCase();
  return mode === "advantage" || ["facebook", "instagram", "both"].includes(mode);
}

export default function MetaAudienceHealthBanner({
  locations,
  interests,
  ageMin,
  ageMax,
  gender,
  advantageAudience,
  placementMode,
}: Props) {
  const { t } = useTranslation();

  const health = useMemo(() => {
    const hasLocations = locations.length > 0;
    const ageValid = advantageAudience || isAgeRangeValid(ageMin, ageMax);
    const hasTargeting = advantageAudience || interests.length > 0;
    const hasGender = advantageAudience || gender === "all" || gender === "1" || gender === "2";
    const placementsOk = hasPlacements(placementMode);

    let score = 0;
    if (hasLocations) score += 25;
    if (ageValid) score += 20;
    if (hasTargeting) score += 20;
    if (hasGender) score += 15;
    if (placementsOk) score += 20;

    const warnings: string[] = [];
    if (!hasLocations) {
      warnings.push(t("metaCampaigns.wizard.health.warnNoLocations"));
    }
    if (!advantageAudience && !interests.length) {
      warnings.push(t("metaCampaigns.wizard.health.warnNoInterests"));
    }
    if (!advantageAudience && !isAgeRangeValid(ageMin, ageMax)) {
      warnings.push(t("metaCampaigns.wizard.health.warnInvalidAge"));
    }
    if (!placementsOk) {
      warnings.push(t("metaCampaigns.wizard.health.warnNoPlacements"));
    }

    const interestSum = interests.reduce(
      (sum, item) => sum + (Number(item.audienceSize) || 0),
      0
    );

    return { score, warnings, hasLocations, interestSum };
  }, [
    locations,
    interests,
    ageMin,
    ageMax,
    gender,
    advantageAudience,
    placementMode,
    t,
  ]);

  const tone =
    health.score >= 80
      ? {
          ring: "text-emerald-600",
          bar: "bg-emerald-500",
          bg: "border-emerald-200 bg-emerald-50",
        }
      : health.score >= 50
        ? {
            ring: "text-amber-600",
            bar: "bg-amber-500",
            bg: "border-amber-200 bg-amber-50",
          }
        : {
            ring: "text-rose-600",
            bar: "bg-rose-500",
            bg: "border-rose-200 bg-rose-50",
          };

  const estimatedLabel =
    health.interestSum > 0
      ? t("metaCampaigns.wizard.health.estimatedSize", {
          size: formatAudienceSize(health.interestSum),
        })
      : advantageAudience
        ? t("metaCampaigns.wizard.health.broadAdvantage")
        : t("metaCampaigns.wizard.health.broadGeneral");

  return (
    <div
      className={[
        "rounded-2xl border p-4",
        tone.bg,
      ].join(" ")}
      dir="rtl"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 h-20 w-20 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-white/60"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${health.score} 100`}
              strokeLinecap="round"
              className={tone.ring}
            />
          </svg>
          <div className="text-center">
            <p className="text-xl font-black text-slate-900">{health.score}</p>
            <p className="text-[10px] font-bold text-slate-500">
              {t("metaCampaigns.wizard.health.scoreLabel")}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-900">
            {t("metaCampaigns.wizard.health.title")}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
            <div
              className={["h-full rounded-full transition-all", tone.bar].join(" ")}
              style={{ width: `${health.score}%` }}
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Users className="h-3.5 w-3.5 shrink-0" />
            {estimatedLabel}
          </p>
        </div>
      </div>

      {health.warnings.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {health.warnings.map((warning) => (
            <li
              key={warning}
              className="flex items-start gap-2 text-xs font-semibold text-slate-700"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              {warning}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs font-semibold text-emerald-700">
          {t("metaCampaigns.wizard.health.allGood")}
        </p>
      )}
    </div>
  );
}
