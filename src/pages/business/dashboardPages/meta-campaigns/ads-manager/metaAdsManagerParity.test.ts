import { describe, expect, it } from "vitest";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import { buildPublishPayloadFromAdsManager } from "./buildPublishPayload";
import { mapUiBidStrategy, placementPayload } from "./metaAdsManagerParity";

describe("Ads Manager Marketing API parity", () => {
  it("maps bid labels to Graph enums", () => {
    expect(mapUiBidStrategy("Highest volume")).toBe("LOWEST_COST_WITHOUT_CAP");
    expect(mapUiBidStrategy("COST_CAP")).toBe("COST_CAP");
    expect(mapUiBidStrategy("Bid cap")).toBe("LOWEST_COST_WITH_BID_CAP");
    expect(mapUiBidStrategy("LOWEST_COST_WITH_MIN_ROAS")).toBe(
      "LOWEST_COST_WITH_MIN_ROAS"
    );
  });

  it("publishes CBO, manual placements, audiences and carousel as PAUSED", () => {
    const state = createDefaultAdsManagerState();
    state.campaign.budgetStrategy = "campaign";
    state.campaign.bidStrategy = "COST_CAP";
    state.campaign.bidAmount = "18";
    state.adSets[0].advantagePlacements = false;
    state.adSets[0].publisherPlatforms = ["facebook", "instagram"];
    state.adSets[0].facebookPositions = ["feed"];
    state.adSets[0].customAudiences = [{ id: "111", name: "Buyers" }];
    state.adSets[0].excludedAudiences = [{ id: "222", name: "Existing" }];
    state.adSets[0].locales = [6];
    state.adSets[0].facebookPageId = "123";
    state.ads[0].facebookPageId = "123";
    state.ads[0].primaryText = "Hello";
    state.ads[0].headline = "Hi";
    state.ads[0].websiteUrl = "https://example.com";
    state.ads[0].creativeFormat = "carousel";
    state.ads[0].carouselCards = [
      {
        headline: "One",
        description: "",
        imageHash: "aaa",
        imagePreviewUrl: "",
        link: "https://example.com/1",
      },
      {
        headline: "Two",
        description: "",
        imageHash: "bbb",
        imagePreviewUrl: "",
        link: "https://example.com/2",
      },
    ];
    const publish = buildPublishPayloadFromAdsManager(state);
    expect(publish.status).toBe("PAUSED");
    expect(publish.useCampaignBudget).toBe(true);
    expect(publish.bidStrategy).toBe("COST_CAP");
    expect(publish.bidAmount).toBe(18);
    expect(publish.advantagePlacements).toBe(false);
    expect(publish.publisherPlatforms).toEqual(["facebook", "instagram"]);
    expect(publish.facebookPositions).toEqual(["feed"]);
    expect(publish.customAudiences).toEqual([{ id: "111", name: "Buyers" }]);
    expect(publish.excludedAudiences).toEqual([{ id: "222", name: "Existing" }]);
    expect(publish.locales).toEqual([6]);
    expect(publish.creativeFormat).toBe("carousel");
    expect(publish.carouselCards).toHaveLength(2);
    expect(placementPayload(state.adSets[0]).advantagePlacements).toBe(false);
  });
});
