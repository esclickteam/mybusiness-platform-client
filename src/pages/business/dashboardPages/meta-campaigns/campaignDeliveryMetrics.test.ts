import { describe, expect, it } from "vitest";
import type { MetaCampaign, MetaCampaignsOverview } from "../../../../api/metaCampaignsApi";
import {
  campaignDeliveryMetric,
  compareByDeliveryMetric,
  formatCampaignDeliveryMetric,
  mergeOverviewPreservingMetrics,
} from "./campaignDeliveryMetrics";

const format = (value: number) => new Intl.NumberFormat("en-US").format(value);

function campaign(partial: Partial<MetaCampaign> & Pick<MetaCampaign, "id" | "name" | "status">): MetaCampaign {
  return {
    effectiveStatus: partial.status,
    objective: "OUTCOME_LEADS",
    dailyBudget: 50,
    lifetimeBudget: 0,
    metrics: {
      spend: 0,
      leads: 0,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      cpc: 0,
      costPerLead: 0,
      roas: 0,
    },
    ...partial,
  };
}

describe("campaign delivery metrics", () => {
  it("formats Meta impressions and reach with thousands separators", () => {
    const active = campaign({
      id: "111",
      name: "Active",
      status: "ACTIVE",
      configuredStatus: "ACTIVE",
      metrics: {
        spend: 336.31,
        leads: 2,
        clicks: 40,
        impressions: 4715,
        reach: 2533,
        insightsAvailable: true,
        ctr: 1,
        cpc: 1,
        costPerLead: 10,
        roas: 0,
      },
    });
    expect(formatCampaignDeliveryMetric(active, "impressions", format)).toBe("4,715");
    expect(formatCampaignDeliveryMetric(active, "reach", format)).toBe("2,533");
  });

  it("keeps historical numbers for paused and ended campaigns", () => {
    const paused = campaign({
      id: "222",
      name: "Paused",
      status: "PAUSED",
      configuredStatus: "PAUSED",
      metrics: {
        spend: 10,
        leads: 0,
        clicks: 1,
        impressions: 900,
        reach: 700,
        insightsAvailable: true,
        ctr: 0,
        cpc: 0,
        costPerLead: 0,
        roas: 0,
      },
    });
    const ended = campaign({
      id: "333",
      name: "Ended",
      status: "ARCHIVED",
      configuredStatus: "ARCHIVED",
      metrics: {
        spend: 20,
        leads: 1,
        clicks: 2,
        impressions: 1500,
        reach: 900,
        insightsAvailable: true,
        ctr: 0,
        cpc: 0,
        costPerLead: 0,
        roas: 0,
      },
    });
    expect(campaignDeliveryMetric(paused, "impressions")).toBe(900);
    expect(campaignDeliveryMetric(ended, "reach")).toBe(900);
  });

  it("shows an em dash for unpublished drafts and missing Meta rows", () => {
    const draft = campaign({
      id: "draft-1",
      name: "Draft",
      status: "DRAFT",
      localOnly: true,
      metrics: {
        spend: 0,
        leads: 0,
        clicks: 0,
        impressions: 0,
        reach: 0,
        insightsAvailable: false,
        ctr: 0,
        cpc: 0,
        costPerLead: 0,
        roas: 0,
      },
    });
    const missing = campaign({
      id: "444",
      name: "No insight",
      status: "ACTIVE",
      configuredStatus: "ACTIVE",
      metrics: {
        spend: 0,
        leads: 0,
        clicks: 0,
        impressions: null,
        reach: null,
        insightsAvailable: false,
        ctr: 0,
        cpc: 0,
        costPerLead: 0,
        roas: 0,
      },
    });
    expect(formatCampaignDeliveryMetric(draft, "impressions", format)).toBe("—");
    expect(formatCampaignDeliveryMetric(draft, "reach", format)).toBe("—");
    expect(formatCampaignDeliveryMetric(missing, "impressions", format)).toBe("—");
    expect(formatCampaignDeliveryMetric(missing, "reach", format)).toBe("—");
  });

  it("shows a real zero when Meta returned zero", () => {
    const quiet = campaign({
      id: "555",
      name: "Quiet",
      status: "ACTIVE",
      configuredStatus: "ACTIVE",
      metrics: {
        spend: 0,
        leads: 0,
        clicks: 0,
        impressions: 0,
        reach: 0,
        insightsAvailable: true,
        ctr: 0,
        cpc: 0,
        costPerLead: 0,
        roas: 0,
      },
    });
    expect(formatCampaignDeliveryMetric(quiet, "impressions", format)).toBe("0");
    expect(formatCampaignDeliveryMetric(quiet, "reach", format)).toBe("0");
  });

  it("sorts by impressions and reach and leaves missing rows last", () => {
    const rows = [
      campaign({
        id: "low",
        name: "Low",
        status: "ACTIVE",
        metrics: { spend: 1, leads: 0, clicks: 0, impressions: 100, reach: 80, insightsAvailable: true, ctr: 0, cpc: 0, costPerLead: 0, roas: 0 },
      }),
      campaign({
        id: "draft",
        name: "Draft",
        status: "DRAFT",
        localOnly: true,
        metrics: { spend: 0, leads: 0, clicks: 0, impressions: 0, reach: 0, insightsAvailable: false, ctr: 0, cpc: 0, costPerLead: 0, roas: 0 },
      }),
      campaign({
        id: "high",
        name: "High",
        status: "PAUSED",
        metrics: { spend: 1, leads: 0, clicks: 0, impressions: 4715, reach: 2533, insightsAvailable: true, ctr: 0, cpc: 0, costPerLead: 0, roas: 0 },
      }),
    ];
    expect(compareByDeliveryMetric(rows, "impressions").map((row) => row.id)).toEqual(["high", "low", "draft"]);
    expect(compareByDeliveryMetric(rows, "reach", "asc").map((row) => row.id)).toEqual(["low", "high", "draft"]);
  });

  it("keeps the last real metrics when a later insights sync fails", () => {
    const previous = {
      campaigns: [
        campaign({
          id: "111",
          name: "Active",
          status: "ACTIVE",
          metrics: {
            spend: 336,
            leads: 2,
            clicks: 40,
            impressions: 4715,
            reach: 2533,
            insightsAvailable: true,
            ctr: 1,
            cpc: 1,
            costPerLead: 10,
            roas: 0,
          },
        }),
      ],
      insightsSync: { ok: true, level: "campaign", syncedAt: "2026-10-18T10:00:00.000Z", error: null },
    } as MetaCampaignsOverview;
    const next = {
      ...previous,
      campaigns: [
        campaign({
          id: "111",
          name: "Active",
          status: "ACTIVE",
          metrics: {
            spend: 0,
            leads: 0,
            clicks: 0,
            impressions: null,
            reach: null,
            insightsAvailable: false,
            ctr: 0,
            cpc: 0,
            costPerLead: 0,
            roas: 0,
          },
        }),
      ],
      insightsSync: { ok: false, level: "campaign", syncedAt: null, error: "rate_limit" },
    } as MetaCampaignsOverview;
    const merged = mergeOverviewPreservingMetrics(previous, next);
    expect(merged.campaigns[0].metrics.impressions).toBe(4715);
    expect(merged.campaigns[0].metrics.reach).toBe(2533);
    expect(merged.insightsSync?.syncedAt).toBe("2026-10-18T10:00:00.000Z");
    expect(merged.insightsSync?.error).toBe("rate_limit");
  });
});
