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
  const units = new Set(keys.map((key) => METRIC_UNITS[key] || "count"));
  return units.size > 1 ? "dual" : "single";
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
