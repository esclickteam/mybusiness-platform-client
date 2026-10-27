import type { ManagerColumnId } from "./columnPrefs";
import type { MetaManagerLevel } from "../../../../../api/metaCampaignsApi";

export const COLUMN_LABEL: Record<ManagerColumnId, string> = {
  name: "metaCampaigns.table.name",
  status: "metaCampaigns.table.status",
  budget: "metaCampaigns.table.budget",
  spend: "metaCampaigns.table.spend",
  results: "metaCampaigns.table.results",
  leads: "metaCampaigns.table.leads",
  impressions: "metaCampaigns.table.impressions",
  reach: "metaCampaigns.table.reach",
  frequency: "metaCampaigns.table.frequency",
  linkClicks: "metaCampaigns.table.linkClicks",
  landingPageViews: "metaCampaigns.levels.landingPageViews",
  clicks: "metaCampaigns.table.clicks",
  ctr: "metaCampaigns.table.ctr",
  cpc: "metaCampaigns.table.cpc",
  cpm: "metaCampaigns.table.cpm",
  cpl: "metaCampaigns.table.cpl",
  costPerResult: "metaCampaigns.table.costPerResult",
  purchases: "metaCampaigns.levels.purchases",
  updated: "metaCampaigns.overview.lastUpdatedLabel",
};

export function columnLabelKey(
  column: ManagerColumnId,
  level?: MetaManagerLevel | "campaign" | "adset" | "ad"
): string {
  if (column === "name" && level === "ad") return "metaCampaigns.table.adName";
  if (column === "name" && level === "adset") return "metaCampaigns.table.adSetName";
  return COLUMN_LABEL[column];
}
