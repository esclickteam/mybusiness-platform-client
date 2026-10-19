import { describe, expect, it } from "vitest";
import type { AdsManagerState } from "../ads-manager/adsManagerTypes";
import { applyColumnPreset, moveColumn, sanitizeColumnPrefs, visibleColumns } from "./columnPrefs";
import { draftContainsMetaObjectId, duplicateManagerDraft } from "./duplicateManagerDraft";
import { bucketPoints, mergeChartSeries, readManagerMetric } from "./managerMetrics";
import { bulkLivePlan, matchesManagerQuery, runBulkStatus } from "./managerSelection";

const state = {
  sessionMode: "edit",
  mode: "edit",
  selectedLevel: "ad",
  selectedId: "120257524330680405",
  saveStatus: "saved",
  lastSavedAt: null,
  metaObjectIds: {
    campaignId: "120257519669290405",
    adSetId: "120257524329420405",
    adId: "120257524330680405",
    creativeId: "4611120585773478",
  },
  publishRecordId: "6ad522a0026119f4b42a2cdb",
  campaign: {
    id: "120257519669290405",
    name: "Evently360",
    status: "ACTIVE",
    buyingType: "auction",
    objective: "OUTCOME_LEADS",
    budgetStrategy: "adset",
    budgetType: "daily",
    budgetAmount: "100",
    currency: "ILS",
    bidStrategy: "",
    advantagePlusLeads: true,
    showMoreDetails: false,
    showMoreBudget: false,
  },
  adSets: [{ id: "120257524329420405", name: "קבוצה" }],
  ads: [
    {
      id: "120257524330680405",
      adSetId: "120257524329420405",
      name: "מודעה",
      status: "ACTIVE",
      creativeId: "4611120585773478",
    },
  ],
  instantForms: [],
  audienceEstimate: { lower: 0, upper: 0, spectrum: 0.5 },
  campaignScore: 0,
} as AdsManagerState;

describe("meta ads manager board", () => {
  it("copies an ad into a local draft without Meta ids", () => {
    const copy = duplicateManagerDraft(state, { level: "ad", id: "120257524330680405" });
    expect(copy.sessionMode).toBe("create");
    expect(copy.metaObjectIds).toEqual({ campaignId: "", adSetId: "", adId: "", creativeId: "" });
    expect(copy.publishRecordId).toBeUndefined();
    expect(copy.ads[0].id).toBe("ad_1");
    expect(copy.ads[0].creativeId).toBe("");
    expect(copy.adSets[0].id).toBe("adset_1");
    expect(copy.campaign.name).toContain("עותק");
    expect(draftContainsMetaObjectId(copy)).toBe(false);
    expect(draftContainsMetaObjectId(state)).toBe(true);
  });

  it("keeps a measured zero and hides a missing metric", () => {
    expect(readManagerMetric({ spend: 0, leads: 0, clicks: 0, impressions: 0, ctr: 0, cpc: 0, costPerLead: null, roas: null, insightsAvailable: true }, "spend")).toBe(0);
    expect(readManagerMetric({ spend: 0, leads: 0, clicks: 0, impressions: null, ctr: 0, cpc: 0, costPerLead: null, roas: null, insightsAvailable: true }, "impressions")).toBeNull();
    expect(readManagerMetric({ spend: 0, leads: 0, clicks: 0, impressions: 10, ctr: 0, cpc: 0, costPerLead: null, roas: null, insightsAvailable: false }, "impressions")).toBeNull();
  });

  it("does not add reach across days", () => {
    const rows = bucketPoints(
      [
        { date: "2026-10-01", reach: 10, spend: 5, insightsAvailable: true, leads: 0, clicks: 0, impressions: 1, ctr: 0, cpc: 0, costPerLead: null, roas: null },
        { date: "2026-10-02", reach: 8, spend: 4, insightsAvailable: true, leads: 0, clicks: 0, impressions: 1, ctr: 0, cpc: 0, costPerLead: null, roas: null },
      ],
      "week",
      ["reach", "spend"]
    );
    expect(rows[0].reach).toBeNull();
    expect(rows[0].spend).toBe(9);
  });

  it("keeps one campaign's reach and recomputes a combined CTR", () => {
    const point = {
      insightsAvailable: true,
      leads: 1,
      clicks: 10,
      impressions: 100,
      ctr: 9,
      cpc: 2,
      costPerLead: null,
      roas: null,
    };
    const single = mergeChartSeries(
      [{ id: "120257519669290405", points: [{ date: "2026-10-01", ...point, reach: 40, spend: 20 }] }],
      ["spend", "impressions", "reach", "ctr", "cpc", "clicks"]
    );
    expect(single[0].reach).toBe(40);
    expect(single[0].ctr).toBe(9);
    const combined = mergeChartSeries(
      [
        { id: "120257519669290405", points: [{ date: "2026-10-01", ...point, reach: 40, spend: 20 }] },
        { id: "120200000000000002", points: [{ date: "2026-10-01", ...point, reach: 15, spend: 5, clicks: 5, impressions: 50, ctr: 4 }] },
      ],
      ["spend", "impressions", "reach", "ctr", "cpc", "clicks"]
    );
    expect(combined[0].reach).toBeUndefined();
    expect(combined[0]["120257519669290405:reach"]).toBe(40);
    expect(combined[0]["120200000000000002:reach"]).toBe(15);
    expect(combined[0].spend).toBe(25);
    expect(combined[0].impressions).toBe(150);
    expect(combined[0].ctr).toBe(10);
    expect(combined[0].cpc).toBeCloseTo(25 / 15);
  });

  it("searches by name or Meta id and plans a live bulk action", () => {
    expect(matchesManagerQuery({ id: "120257519669290405", name: "Evently" }, "669290405")).toBe(true);
    expect(matchesManagerQuery({ id: "120257519669290405", name: "Evently" }, "missing")).toBe(false);
    const plan = bulkLivePlan(
      [
        { id: "120257519669290405", name: "חי" },
        { id: "draft-1", name: "טיוטה", localOnly: true },
      ],
      "PAUSED"
    );
    expect(plan.count).toBe(1);
    expect(plan.names).toEqual(["חי"]);
    expect(plan.skipped).toBe(1);
    expect(plan.changesLiveDelivery).toBe(true);
  });

  it("reports a partial bulk failure per object", async () => {
    const result = await runBulkStatus(
      [
        { id: "120257519669290405", name: "א" },
        { id: "120257524329420405", name: "ב" },
      ],
      "PAUSED",
      async (id) => {
        if (id.endsWith("405") && id.startsWith("120257524")) throw new Error("Meta סירבה");
      }
    );
    expect(result.ok).toEqual(["120257519669290405"]);
    expect(result.failed[0].name).toBe("ב");
  });

  it("saves a personal column view and can reset it", () => {
    const prefs = sanitizeColumnPrefs({
      order: ["spend", "name", "status", "leads"],
      hidden: ["name", "leads"],
      widths: { spend: 180 },
    });
    expect(prefs.order[0]).toBe("spend");
    expect(prefs.hidden).toEqual(["leads"]);
    expect(visibleColumns(prefs)).toContain("name");
    const moved = moveColumn(prefs, "spend", 1);
    expect(moved.order[0]).toBe("name");
    expect(visibleColumns(applyColumnPreset("leads"))).toContain("cpl");
  });
});
