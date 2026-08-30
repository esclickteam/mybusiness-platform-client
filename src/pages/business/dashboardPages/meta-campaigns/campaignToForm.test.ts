import { describe, expect, it } from "vitest";
import { campaignToForm } from "./campaignEditorForm";
import type { MetaCampaign } from "../../../../api/metaCampaignsApi";

const campaign: MetaCampaign = {
  id: "showcase_leads_fb",
  name: "לידים מפייסבוק · חבילות זוגיות",
  status: "ACTIVE",
  effectiveStatus: "ACTIVE",
  objective: "OUTCOME_LEADS",
  dailyBudget: 180,
  lifetimeBudget: 0,
  startTime: "2026-08-14T10:00:00.000Z",
  pageId: "page_showcase_demo",
  primaryText: "מחפשים צילום זוגי",
  headline: "חבילות זוגיות לחתונה",
  description: "ליד אחד",
  link: "https://bizuply.com",
  imageUrl: "data:image/svg+xml;charset=utf-8,test",
  creativeFormat: "single",
  callToAction: "SIGN_UP",
  leadFormId: "showcase_form_couples",
  locations: [
    { key: "IL", name: "Israel", type: "country", countryCode: "IL" },
  ],
  interests: [{ id: "1", name: "Weddings" }],
  ageMin: 24,
  ageMax: 45,
  advantageAudience: false,
  placementMode: "both",
  facebookPositions: ["feed"],
  instagramPositions: ["reels"],
  metrics: {
    spend: 10,
    leads: 2,
    clicks: 4,
    impressions: 100,
    ctr: 1,
    cpc: 2,
    costPerLead: 5,
    roas: 1,
  },
};

describe("campaignToForm", () => {
  it("maps creative, audience, and placements into the editor", () => {
    const form = campaignToForm(campaign, "fallback-page");
    expect(form.name).toContain("חבילות זוגיות");
    expect(form.dailyBudget).toBe("180");
    expect(form.primaryText).toContain("זוגי");
    expect(form.headline).toContain("חבילות");
    expect(form.leadFormId).toBe("showcase_form_couples");
    expect(form.locations[0].key).toBe("IL");
    expect(form.interests[0].name).toBe("Weddings");
    expect(form.ageMin).toBe("24");
    expect(form.advantageAudience).toBe(false);
    expect(form.facebookFeed).toBe(true);
    expect(form.facebookStory).toBe(false);
    expect(form.instagramReels).toBe(true);
    expect(form.pageId).toBe("page_showcase_demo");
  });
});
