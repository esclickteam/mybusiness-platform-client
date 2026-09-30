import { describe, expect, it } from "vitest";
import {
  isTechnicalRecommendationCopy,
  localizeRecommendationCopy,
  looksForeignForLocale,
  recommendationKind,
} from "./localizeMetaRecommendation";
import type { AiCampaignRecommendation } from "../../../../api/metaCampaignsApi";

const rec = (
  overrides: Partial<AiCampaignRecommendation> = {}
): AiCampaignRecommendation => ({
  id: "rec-1",
  businessId: "biz-1",
  metaCampaignId: "120251636463900469",
  campaignName: "Invistimo RSVP",
  sourceRuleKeys: ["Phase5 Recommend CPL watch"],
  severity: "WARNING",
  title: "Phase5 Recommend CPL watch",
  finding: "CREATE_RECOMMENDATION CAMPAIGN 120251636463900469",
  explanation: "Deterministic TEST hygiene candidate",
  recommendedActionType: "CREATE_RECOMMENDATION",
  recommendedAction: "CREATE_RECOMMENDATION",
  requiresApproval: true,
  status: "OPEN",
  aiGenerated: false,
  ...overrides,
});

describe("localizeMetaRecommendation", () => {
  it("detects technical and English copy in Hebrew UI", () => {
    expect(isTechnicalRecommendationCopy("Phase5 Recommend CPL watch")).toBe(true);
    expect(looksForeignForLocale("Cost per lead needs attention in this campaign", "he")).toBe(
      true
    );
    expect(recommendationKind(rec())).toBe("cpl");
  });

  it("maps historical English recommendations to localized customer copy", () => {
    const t = (key: string) => key;
    const copy = localizeRecommendationCopy(rec(), t, "he");
    expect(copy.title).toBe("metaCampaigns.recommendations.kinds.cpl.title");
    expect(copy.body).toBe("metaCampaigns.recommendations.kinds.cpl.body");
    expect(copy.why).toBe("metaCampaigns.recommendations.kinds.cpl.why");
    expect(copy.campaignName).toBe("Invistimo RSVP");
  });
});
