import type { MetaCampaign } from "../../../../../api/metaCampaignsApi";
import { campaignDeliveryMetric, formatCampaignDeliveryMetric } from "../campaignDeliveryMetrics";
import { formatCurrency, formatDateTimeHe, formatNumber, formatPercent } from "../metaCampaignUtils";
import type { ManagerColumnId } from "./columnPrefs";
import { readManagerMetric } from "./managerMetrics";

function measured(campaign: MetaCampaign, key: string): number | null {
  if (campaign.localOnly || String(campaign.status || "").toUpperCase() === "DRAFT") return null;
  if (campaign.metrics?.insightsAvailable === false) return null;
  return readManagerMetric(
    campaign.metrics ? { ...campaign.metrics, insightsAvailable: campaign.metrics.insightsAvailable ?? true } : null,
    key
  );
}

/** Text for one campaign column. Missing Meta fields stay an em dash. */
export function campaignColumnText(campaign: MetaCampaign, column: ManagerColumnId, currency: string): string {
  if (column === "name") return campaign.name || "—";
  if (column === "status") return campaign.deliveryStatus || campaign.effectiveStatus || campaign.status || "—";
  if (column === "budget") {
    if (campaign.dailyBudget) return formatCurrency(campaign.dailyBudget, currency);
    if (campaign.lifetimeBudget) return formatCurrency(campaign.lifetimeBudget, currency);
    return "—";
  }
  if (column === "updated") return formatDateTimeHe(campaign.localUpdatedAt || campaign.updatedTime);
  if (column === "impressions" || column === "reach") return formatCampaignDeliveryMetric(campaign, column);
  const metricKey =
    column === "cpl" ? "costPerLead" : column === "results" ? "results" : column;
  const value = measured(campaign, metricKey);
  if (value == null) return "—";
  if (column === "spend" || column === "cpc" || column === "cpm" || column === "cpl" || column === "costPerResult") {
    return formatCurrency(value, currency);
  }
  if (column === "ctr") return formatPercent(value);
  if (column === "frequency") return value.toFixed(2);
  return formatNumber(value);
}

export function campaignSortValue(campaign: MetaCampaign, column: ManagerColumnId): number | string | null {
  if (column === "name") return campaign.name || "";
  if (column === "status") return campaign.status || "";
  if (column === "updated") return campaign.localUpdatedAt || campaign.updatedTime || "";
  if (column === "budget") return campaign.dailyBudget || campaign.lifetimeBudget || null;
  if (column === "impressions" || column === "reach") return campaignDeliveryMetric(campaign, column);
  return measured(campaign, column === "cpl" ? "costPerLead" : column);
}
