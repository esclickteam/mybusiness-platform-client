import { describe, expect, it } from "vitest";
import type { MetaCampaign } from "../../../../../api/metaCampaignsApi";
import { adsManagerStateFromMetaCampaign } from "./adsManagerStateFromMetaCampaign";
import { diffAdsManagerState } from "./adsManagerDiff";

const campaign: MetaCampaign = {
  id: "120251467028970469",
  name: "Invistimo live campaign",
  status: "PAUSED",
  effectiveStatus: "PAUSED",
  objective: "OUTCOME_LEADS",
  dailyBudget: 100,
  lifetimeBudget: 0,
  buyingType: "AUCTION",
  startTime: "2026-08-01T08:00:00.000Z",
  pageId: "1222199210985216",
  instagramUserId: "17841400000000000",
  primaryText: "Primary from Meta",
  headline: "Headline from Meta",
  description: "Desc",
  link: "https://invistimo.com",
  displayLink: "invistimo.com",
  imageHash: "hash-abc",
  imageUrl: "https://example.com/ad.png",
  callToAction: "SIGN_UP",
  leadFormId: "form-77",
  creativeId: "creative-1",
  adId: "ad-1",
  adSetId: "adset-1",
  locations: [{ key: "IL", name: "Israel", type: "country", countryCode: "IL" }],
  interests: [{ id: "600", name: "Small business" }],
  ageMin: 25,
  ageMax: 55,
  genders: [1],
  advantageAudience: false,
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
  adSets: [
    {
      id: "adset-1",
      name: "Main ad set",
      status: "PAUSED",
      dailyBudget: 0,
      ageMin: 25,
      ageMax: 55,
      genders: [1],
      locations: [
        { key: "IL", name: "Israel", type: "country", countryCode: "IL" },
      ],
      interests: [{ id: "600", name: "Small business" }],
      advantageAudience: false,
      pageId: "1222199210985216",
      optimizationGoal: "LEAD_GENERATION",
      billingEvent: "IMPRESSIONS",
    },
  ],
  ads: [
    {
      id: "ad-1",
      name: "Main ad",
      status: "PAUSED",
      adSetId: "adset-1",
      headline: "Headline from Meta",
      primaryText: "Primary from Meta",
      description: "Desc",
      imageHash: "hash-abc",
      imageUrl: "https://example.com/ad.png",
      link: "https://invistimo.com",
      displayLink: "invistimo.com",
      callToAction: "SIGN_UP",
      pageId: "1222199210985216",
      instagramUserId: "17841400000000000",
      leadFormId: "form-77",
      creativeId: "creative-1",
    },
  ],
};

describe("adsManagerStateFromMetaCampaign", () => {
  it("prefills Create-builder fields from Meta campaign 120251467028970469", () => {
    const state = adsManagerStateFromMetaCampaign(campaign, { currency: "ILS" });
    expect(state.sessionMode).toBe("edit");
    expect(state.campaign.id).toBe("120251467028970469");
    expect(state.campaign.name).toBe("Invistimo live campaign");
    expect(state.campaign.objective).toBe("OUTCOME_LEADS");
    expect(state.campaign.budgetAmount).toBe("100");
    expect(state.campaign.status).toBe("PAUSED");
    expect(state.adSets[0].ageMin).toBe(25);
    expect(state.adSets[0].ageMax).toBe(55);
    expect(state.adSets[0].gender).toBe("male");
    expect(state.adSets[0].locations[0].name).toBe("Israel");
    expect(state.adSets[0].interests[0].name).toBe("Small business");
    expect(state.ads[0].headline).toBe("Headline from Meta");
    expect(state.ads[0].primaryText).toBe("Primary from Meta");
    expect(state.ads[0].instantFormId).toBe("form-77");
    expect(state.ads[0].imageHash).toBe("hash-abc");
    expect(state.ads[0].callToAction).toBe("SIGN_UP");
    expect(state.ads[0].adSetId).toBe("adset-1");
    expect(state.ads[0].facebookPageId).toBe("1222199210985216");
  });

  it("diffs only changed fields such as headline", () => {
    const baseline = adsManagerStateFromMetaCampaign(campaign);
    const current = {
      ...baseline,
      ads: baseline.ads.map((ad) => ({ ...ad, headline: "New headline" })),
    };
    const changes = diffAdsManagerState(baseline, current);
    expect(changes).toHaveLength(1);
    expect(changes[0].labelKey).toBe("changeHeadline");
    expect(changes[0].oldValue).toBe("Headline from Meta");
    expect(changes[0].newValue).toBe("New headline");
  });
});
