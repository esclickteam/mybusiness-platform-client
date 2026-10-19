import type { MetaCampaign, MetaCampaignsOverview } from "../../../../api/metaCampaignsApi";
import { formatNumber } from "./metaCampaignUtils";

export type DeliveryMetricKey = "impressions" | "reach";

export type CampaignMetricSort = {
  key: DeliveryMetricKey;
  direction: "asc" | "desc";
};

type MetricCarrier = {
  id?: string;
  localOnly?: boolean;
  localDraft?: boolean;
  status?: string | null;
  configuredStatus?: string | null;
  metaCampaignId?: string | null;
  metrics?: {
    impressions?: number | null;
    reach?: number | null;
    insightsAvailable?: boolean;
  } | null;
};

/** Unpublished local drafts have no Meta delivery. */
export function isUnpublishedDraft(campaign: MetricCarrier): boolean {
  if (campaign.localOnly) return true;
  const status = String(campaign.configuredStatus || campaign.status || "").toUpperCase();
  if (status === "DRAFT") return true;
  if (campaign.localDraft && !String(campaign.metaCampaignId || "").trim()) return true;
  return false;
}

/**
 * Impressions or reach from a campaign-level Meta insight.
 * Null when the campaign was never published or Meta did not return the field.
 */
export function campaignDeliveryMetric(
  campaign: MetricCarrier,
  key: DeliveryMetricKey
): number | null {
  if (isUnpublishedDraft(campaign)) return null;
  const metrics = campaign.metrics;
  if (!metrics || metrics.insightsAvailable === false) return null;
  const value = metrics[key];
  if (value == null || Number.isNaN(Number(value))) return null;
  // Older payloads coerced a missing insight to 0. Do not present that as a measurement.
  if (metrics.insightsAvailable == null && Number(value) === 0) return null;
  return Number(value);
}

export function formatCampaignDeliveryMetric(
  campaign: MetricCarrier,
  key: DeliveryMetricKey,
  formatter: (value: number) => string = formatNumber
): string {
  const value = campaignDeliveryMetric(campaign, key);
  if (value == null) return "—";
  return formatter(value);
}

/** Highest values first. Campaigns without a measurement stay at the end. */
export function compareByDeliveryMetric<T extends MetricCarrier>(
  rows: T[],
  key: DeliveryMetricKey,
  direction: "asc" | "desc" = "desc"
): T[] {
  return [...rows].sort((a, b) => {
    const av = campaignDeliveryMetric(a, key);
    const bv = campaignDeliveryMetric(b, key);
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return direction === "asc" ? av - bv : bv - av;
  });
}

/**
 * A failed insights refresh must not replace the last real impressions and reach
 * with empty values.
 */
export function mergeOverviewPreservingMetrics(
  previous: MetaCampaignsOverview | null,
  next: MetaCampaignsOverview
): MetaCampaignsOverview {
  if (!previous || next.insightsSync?.ok !== false) return next;
  const priorRows = new Map((previous.campaigns || []).map((row) => [row.id, row]));
  return {
    ...next,
    campaigns: (next.campaigns || []).map((row) => {
      if (row.metrics?.insightsAvailable !== false) return row;
      const prior = priorRows.get(row.id);
      if (!prior?.metrics || prior.metrics.insightsAvailable === false) return row;
      if (
        campaignDeliveryMetric(prior, "impressions") == null &&
        campaignDeliveryMetric(prior, "reach") == null
      ) {
        return row;
      }
      return { ...row, metrics: prior.metrics };
    }),
    insightsSync: {
      ok: false,
      level: next.insightsSync?.level || previous.insightsSync?.level || "campaign",
      error: next.insightsSync?.error || previous.insightsSync?.error || "unavailable",
      syncedAt: previous.insightsSync?.syncedAt || next.insightsSync?.syncedAt || null,
    },
  };
}

export function metricSortFromValue(value: string): CampaignMetricSort | null {
  const [key, direction] = String(value || "").split(":");
  if ((key !== "impressions" && key !== "reach") || (direction !== "asc" && direction !== "desc")) {
    return null;
  }
  return { key, direction };
}

export type { MetaCampaign };
