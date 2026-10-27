import { describe, expect, it } from "vitest";
import type { MetaCampaign } from "../../../../../api/metaCampaignsApi";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import { localSnapshotFromState, metaSnapshotFromCampaign } from "./adsManagerSync";

describe("adsManagerSync snapshots", () => {
  it("reads catalog and existing-post fields from local state", () => {
    const state = createDefaultAdsManagerState();
    state.ads[0].objectStoryId = "11_22";
    state.ads[0].productSetId = "55";
    const snap = localSnapshotFromState(state);
    expect(snap.objectStoryId).toBe("11_22");
    expect(snap.productSetId).toBe("55");
  });

  it("does not invent Meta catalog fields when the campaign has none", () => {
    const snap = metaSnapshotFromCampaign({
      id: "1234567890",
      name: "Live",
      objective: "OUTCOME_LEADS",
      status: "PAUSED",
      dailyBudget: 0,
      lifetimeBudget: 0,
      metrics: {
        spend: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
        ctr: 0,
        cpc: 0,
        costPerLead: null,
        roas: null,
      },
    } as MetaCampaign);
    expect(snap.name).toBe("Live");
    expect(snap.objectStoryId).toBeUndefined();
    expect(snap.productSetId).toBeUndefined();
  });
});
