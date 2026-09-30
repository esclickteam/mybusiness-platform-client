import React from "react";
import { useTranslation } from "react-i18next";
import { DATE_RANGE_OPTIONS, daysAgoIso, todayIso, type MetaDateRangePreset } from "./metaCampaignUtils";
import { useMetaAdsDateRange } from "./useMetaAdsDateRange";

export default function MetaAdsDateRangeBar() {
  const { t } = useTranslation();
  const { preset, customSince, customUntil, setPreset } = useMetaAdsDateRange();

  return (
    <div className="flex flex-wrap items-end gap-2" data-testid="meta-ads-date-range">
      <label className="block">
        <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-slate-500">
          {t("metaCampaigns.ux.sharedRange")}
        </span>
        <select
          value={preset}
          onChange={(event) => {
            const next = event.target.value as MetaDateRangePreset;
            if (next === "custom") {
              setPreset(next, {
                since: customSince || daysAgoIso(29),
                until: customUntil || todayIso(),
              });
              return;
            }
            setPreset(next);
          }}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-violet-200 focus:ring-2 focus:ring-violet-100"
        >
          {DATE_RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </label>
      {preset === "custom" ? (
        <>
          <label className="block">
            <span className="mb-1 block text-[11px] font-black text-slate-500">
              {t("metaCampaigns.ranges.since")}
            </span>
            <input
              type="date"
              value={customSince}
              onChange={(event) => setPreset("custom", { since: event.target.value, until: customUntil })}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-black text-slate-500">
              {t("metaCampaigns.ranges.until")}
            </span>
            <input
              type="date"
              value={customUntil}
              onChange={(event) => setPreset("custom", { since: customSince, until: event.target.value })}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
            />
          </label>
        </>
      ) : null}
    </div>
  );
}
