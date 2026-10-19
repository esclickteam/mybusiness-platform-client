import type { MetaCampaignMetrics } from "../../../../../api/metaCampaignsApi";

export type MetricUnit = "count" | "money" | "rate";

export const METRIC_UNITS: Record<string, MetricUnit> = {
  spend: "money",
  cpc: "money",
  cpm: "money",
  cpl: "money",
  costPerLead: "money",
  costPerResult: "money",
  ctr: "rate",
  frequency: "rate",
  results: "count",
  leads: "count",
  impressions: "count",
  reach: "count",
  clicks: "count",
  linkClicks: "count",
  landingPageViews: "count",
  purchases: "count",
};

const KEY_ALIASES: Record<string, keyof MetaCampaignMetrics> = {
  cpl: "costPerLead",
};

export function readManagerMetric(
  metrics: MetaCampaignMetrics | null | undefined,
  key: string
): number | null {
  if (!metrics || metrics.insightsAvailable === false) return null;
  const field = (KEY_ALIASES[key] || key) as keyof MetaCampaignMetrics;
  const value = metrics[field];
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return value;
}

export function chartAxisFor(keys: string[]): "single" | "dual" {
  const units = new Set(keys.map((key) => chartMetricUnit(key)));
  return units.size > 1 ? "dual" : "single";
}

export function chartMetricUnit(key: string): MetricUnit {
  const base = key.includes(":") ? key.slice(key.lastIndexOf(":") + 1) : key;
  return METRIC_UNITS[base] || "count";
}

const ADDITIVE_CHART_METRICS = new Set([
  "spend",
  "impressions",
  "leads",
  "clicks",
  "linkClicks",
  "landingPageViews",
  "purchases",
  "results",
]);

/**
 * One chart row per date. Additive metrics add across campaigns.
 * Reach and frequency stay on their own series. Rates are Meta's value for
 * one campaign, or recomputed from the summed clicks for several campaigns.
 */
export function mergeChartSeries(
  series: Array<{ id: string; points: Array<Record<string, unknown> & { date?: string }> }>,
  metricKeys: string[]
): Array<Record<string, number | string | null>> {
  const single = series.length <= 1;
  const merged = new Map<string, Record<string, number | string | null>>();
  series.forEach((row) => {
    row.points.forEach((point) => {
      const date = String(point.date || "");
      const current = merged.get(date) || { date };
      metricKeys.forEach((key) => {
        const value = readManagerMetric(point as MetaCampaignMetrics, key);
        if (key === "reach" || key === "frequency") {
          current[single ? key : `${row.id}:${key}`] = value;
          return;
        }
        if (!ADDITIVE_CHART_METRICS.has(key)) {
          if (single) current[key] = value;
          return;
        }
        if (value == null) {
          if (current[key] == null) current[key] = null;
          return;
        }
        current[key] = Number(current[key] || 0) + value;
      });
      const clicks = readManagerMetric(point as MetaCampaignMetrics, "clicks");
      if (clicks != null) current._clicks = Number(current._clicks || 0) + clicks;
      merged.set(date, current);
    });
  });
  return [...merged.values()].map((row) => {
    const clicks = typeof row._clicks === "number" ? row._clicks : null;
    if (!single) {
      if (metricKeys.includes("ctr")) {
        row.ctr =
          typeof row.impressions === "number" && row.impressions > 0 && clicks != null
            ? (clicks / row.impressions) * 100
            : null;
      }
      if (metricKeys.includes("cpc")) {
        row.cpc = typeof row.spend === "number" && clicks != null && clicks > 0 ? row.spend / clicks : null;
      }
      if (metricKeys.includes("cpm")) {
        row.cpm =
          typeof row.spend === "number" && typeof row.impressions === "number" && row.impressions > 0
            ? (row.spend / row.impressions) * 1000
            : null;
      }
    }
    delete row._clicks;
    return row;
  });
}

export function weeklyBucket(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + mondayOffset);
  return date.toISOString().slice(0, 10);
}

export function bucketPoints<T extends { date?: string }>(
  points: T[],
  grain: "day" | "week" | "month",
  keys: string[]
): Array<Record<string, number | string | null>> {
  const groups = new Map<string, T[]>();
  points.forEach((point) => {
    const raw = String(point.date || "");
    const bucket = grain === "month" ? raw.slice(0, 7) : grain === "week" ? weeklyBucket(raw) : raw;
    const list = groups.get(bucket) || [];
    list.push(point);
    groups.set(bucket, list);
  });
  return [...groups.entries()].map(([date, rows]) => {
    const out: Record<string, number | string | null> = { date };
    keys.forEach((key) => {
      if (key === "reach" || key === "frequency") {
        out[key] = rows.length === 1 ? readManagerMetric(rows[0] as MetaCampaignMetrics, key) : null;
        return;
      }
      const values = rows
        .map((row) => readManagerMetric(row as MetaCampaignMetrics, key))
        .filter((value): value is number => value != null);
      out[key] = values.length ? values.reduce((sum, value) => sum + value, 0) : null;
    });
    return out;
  });
}
