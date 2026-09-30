import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DATE_RANGE_OPTIONS,
  resolveMetaDateRangeQuery,
  type MetaDateRangePreset,
} from "./metaCampaignUtils";

const PRESETS = new Set(DATE_RANGE_OPTIONS.map((row) => row.value));

export function presetToServerWindow(preset: MetaDateRangePreset): string {
  if (preset === "today") return "TODAY";
  if (preset === "yesterday") return "YESTERDAY";
  if (preset === "last_14") return "LAST_14D";
  if (preset === "last_30") return "LAST_30D";
  if (preset === "custom" || preset === "this_month" || preset === "last_month") return "CUSTOM";
  return "LAST_7D";
}

export function useMetaAdsDateRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("range") || "last_7";
  const preset = (PRESETS.has(raw as MetaDateRangePreset) ? raw : "last_7") as MetaDateRangePreset;
  const customSince = searchParams.get("since") || "";
  const customUntil = searchParams.get("until") || "";

  const query = useMemo(
    () => resolveMetaDateRangeQuery(preset, { since: customSince, until: customUntil }),
    [preset, customSince, customUntil]
  );

  const setPreset = useCallback(
    (next: MetaDateRangePreset, custom?: { since?: string; until?: string }) => {
      const params = new URLSearchParams(searchParams);
      params.set("range", next);
      const since = custom?.since ?? customSince;
      const until = custom?.until ?? customUntil;
      if (next === "custom" && since) params.set("since", since);
      else params.delete("since");
      if (next === "custom" && until) params.set("until", until);
      else params.delete("until");
      setSearchParams(params, { replace: true });
    },
    [customSince, customUntil, searchParams, setSearchParams]
  );

  return {
    preset,
    customSince,
    customUntil,
    query,
    serverWindow: presetToServerWindow(preset),
    labelKey: DATE_RANGE_OPTIONS.find((row) => row.value === preset)?.labelKey || "metaCampaigns.ranges.last7",
    setPreset,
  };
}
