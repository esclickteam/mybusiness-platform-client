import { describe, expect, it } from "vitest";
import { adsManagerStateFromMetaCampaign } from "./adsManagerStateFromMetaCampaign";
import { diffAdsManagerState } from "./adsManagerDiff";
import {
  buildAdSetUpdateFromDiff,
  buildAdUpdateFromDiff,
} from "./adsManagerEditPayloads";
import type { MetaCampaign } from "../../../../../api/metaCampaignsApi";

const campaign: MetaCampaign = {
  id: "120251467028970469",
  name: "Live",
  status: "PAUSED",
  objective: "OUTCOME_LEADS",
  dailyBudget: 100,
  headline: "Headline from Meta",
  primaryText: "Primary",
  ageMin: 24,
  ageMax: 35,
  genders: [],
  advantageAudience: true,
  locations: [{ key: "IL", name: "Israel", type: "country", countryCode: "IL" }],
  adSets: [
    {
      id: "adset-1",
      name: "Main ad set",
      ageMin: 24,
      ageMax: 35,
      genders: [],
      advantageAudience: true,
      targetingLoaded: true,
      targetingRaw: {
        geo_locations: { countries: ["IL"] },
        age_min: 24,
        age_max: 35,
        custom_audiences: [{ id: "ca-1", name: "Buyers" }],
        targeting_automation: { advantage_audience: 1 },
      },
      locations: [{ key: "IL", name: "Israel", type: "country", countryCode: "IL" }],
    },
  ],
  ads: [
    {
      id: "ad-1",
      name: "Main ad",
      adSetId: "adset-1",
      headline: "Headline from Meta",
      primaryText: "Primary",
    },
  ],
};

describe("adsManagerEditPayloads", () => {
  it("does not PATCH targeting when only the headline changed", () => {
    const baseline = adsManagerStateFromMetaCampaign(campaign);
    const current = {
      ...baseline,
      ads: baseline.ads.map((ad) => ({ ...ad, headline: "New headline" })),
    };
    const changes = diffAdsManagerState(baseline, current);
    const adSetPatch = buildAdSetUpdateFromDiff(
      current.adSets[0],
      current.campaign,
      changes
    );
    const adPatch = buildAdUpdateFromDiff(current.ads[0], changes);
    expect(adSetPatch).toBeNull();
    expect(adPatch).toEqual(expect.objectContaining({ headline: "New headline" }));
    expect(adPatch).not.toHaveProperty("ageMin");
    expect(adPatch).not.toHaveProperty("targeting");
  });

  it("overlays age on Meta targetingRaw without dropping custom audiences", () => {
    const baseline = adsManagerStateFromMetaCampaign(campaign);
    const current = {
      ...baseline,
      adSets: baseline.adSets.map((adSet) => ({ ...adSet, ageMin: 27, ageMax: 50 })),
    };
    const changes = diffAdsManagerState(baseline, current);
    const patch = buildAdSetUpdateFromDiff(
      current.adSets[0],
      current.campaign,
      changes
    );
    expect(patch?.targeting).toEqual(
      expect.objectContaining({
        age_range: [27, 50],
        custom_audiences: [{ id: "ca-1", name: "Buyers" }],
        targeting_automation: { advantage_audience: 1 },
      })
    );
  });
});
