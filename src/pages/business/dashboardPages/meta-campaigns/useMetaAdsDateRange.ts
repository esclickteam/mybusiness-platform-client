import { useCallback, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_AD_ACCOUNT_TIMEZONE,
  isMetaRangePreset,
  previousWindow,
  rangeToApiQuery,
  resolveMetaRange,
  zonedIsoDate,
  type MetaRangePreset,
} from "./metaAdsCalendar";
import { MetaAdsTimeZoneContext } from "./metaAdsTimeZone";

export type MetaDateRangePreset = MetaRangePreset;

const PRESET_LABEL: Record<MetaRangePreset, string> = {
  today: "metaCampaigns.ranges.today",
  yesterday: "metaCampaigns.ranges.yesterday",
  today_yesterday: "metaCampaigns.ranges.todayYesterday",
  last_7: "metaCampaigns.ranges.last7",
  rolling_7: "metaCampaigns.ranges.rolling7",
  last_14: "metaCampaigns.ranges.last14",
  last_28: "metaCampaigns.ranges.last28",
  last_30: "metaCampaigns.ranges.last30",
  this_week: "metaCampaigns.ranges.thisWeek",
  last_week: "metaCampaigns.ranges.lastWeek",
  this_month: "metaCampaigns.ranges.thisMonth",
  last_month: "metaCampaigns.ranges.lastMonth",
  maximum: "metaCampaigns.ranges.maximum",
  custom: "metaCampaigns.ranges.custom",
};

export function presetToServerWindow(preset: MetaDateRangePreset): string {
  if (preset === "today") return "TODAY";
  if (preset === "yesterday") return "YESTERDAY";
  if (preset === "last_14") return "LAST_14D";
  if (preset === "last_30") return "LAST_30D";
  if (preset === "last_7") return "LAST_7D";
  if (preset === "custom" || preset === "rolling_7" || preset === "today_yesterday" || preset === "maximum") return "CUSTOM";
  return "CUSTOM";
}

export function useMetaAdsDateRange(now?: Date) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { timeZone } = useContext(MetaAdsTimeZoneContext);
  const zone = timeZone || DEFAULT_AD_ACCOUNT_TIMEZONE;
  const raw = searchParams.get("range") || "rolling_7";
  const preset = (isMetaRangePreset(raw) ? raw : "rolling_7") as MetaRangePreset;
  const customSince = searchParams.get("since") || "";
  const customUntil = searchParams.get("until") || "";
  const compare = searchParams.get("compare") === "1";
  const compareMode = searchParams.get("compareMode") === "custom" ? "custom" : "previous";
  const compareSinceParam = searchParams.get("compareSince") || "";
  const compareUntilParam = searchParams.get("compareUntil") || "";
  const todayKey = now ? now.toISOString() : zonedIsoDate(zone);

  const resolved = useMemo(
    () => resolveMetaRange(preset, zone, now || new Date(), { since: customSince, until: customUntil }),
    [preset, zone, todayKey, customSince, customUntil, now]
  );

  const comparison = useMemo(() => {
    if (!compare) return null;
    if (compareMode === "custom" && compareSinceParam && compareUntilParam) {
      return { since: compareSinceParam, until: compareUntilParam };
    }
    if (!resolved.since || !resolved.until) return null;
    return previousWindow(resolved.since, resolved.until);
  }, [compare, compareMode, compareSinceParam, compareUntilParam, resolved.since, resolved.until]);

  const query = useMemo(
    () =>
      rangeToApiQuery(resolved, {
        timeZone: zone,
        compare,
        compareSince: compareMode === "custom" ? comparison?.since : undefined,
        compareUntil: compareMode === "custom" ? comparison?.until : undefined,
      }),
    [resolved, zone, compare, compareMode, comparison]
  );

  const commitRange = useCallback(
    (next: {
      preset: MetaRangePreset;
      since?: string;
      until?: string;
      compare: boolean;
      compareMode: "previous" | "custom";
      compareSince?: string;
      compareUntil?: string;
    }) => {
      const params = new URLSearchParams(searchParams);
      params.set("range", next.preset);
      if (next.preset === "custom") {
        if (next.since) params.set("since", next.since);
        if (next.until) params.set("until", next.until);
      } else {
        params.delete("since");
        params.delete("until");
      }
      if (next.compare) {
        params.set("compare", "1");
        params.set("compareMode", next.compareMode);
        if (next.compareMode === "custom" && next.compareSince && next.compareUntil) {
          params.set("compareSince", next.compareSince);
          params.set("compareUntil", next.compareUntil);
        } else {
          params.delete("compareSince");
          params.delete("compareUntil");
        }
      } else {
        params.delete("compare");
        params.delete("compareMode");
        params.delete("compareSince");
        params.delete("compareUntil");
      }
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return {
    preset,
    customSince,
    customUntil,
    resolved,
    comparison,
    compare,
    compareMode,
    query,
    timeZone: zone,
    serverWindow: presetToServerWindow(preset),
    labelKey: PRESET_LABEL[preset],
    commitRange,
  };
}
