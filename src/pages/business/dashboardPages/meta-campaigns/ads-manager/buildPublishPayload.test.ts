import { describe, expect, it } from "vitest";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import {
  audienceTargetingFromAdsManager,
  buildAudienceEstimatePayload,
  buildPublishPayloadFromAdsManager,
} from "./buildPublishPayload";

describe("audience estimate and publish use the same targeting", () => {
  it("sends location, age, gender, interests and Advantage+ on both payloads", () => {
    const state = createDefaultAdsManagerState();
    state.campaign.objective = "OUTCOME_LEADS";
    state.adSets[0].ageMin = 25;
    state.adSets[0].ageMax = 44;
    state.adSets[0].gender = "female";
    state.adSets[0].advantageAudience = true;
    state.adSets[0].furtherLimitReach = false;
    state.adSets[0].interests = [{ id: "6003139266461", name: "Beauty" }];
    state.adSets[0].locations = [
      {
        key: "IL",
        name: "Israel",
        type: "country",
        countryCode: "IL",
        include: true,
      },
    ];

    const audience = audienceTargetingFromAdsManager(state);
    const estimate = buildAudienceEstimatePayload(state);
    const publish = buildPublishPayloadFromAdsManager({
      ...state,
      ads: [
        {
          ...state.ads[0],
          facebookPageId: "123456",
          primaryText: "Hello",
          headline: "Headline",
          websiteUrl: "https://example.com",
        },
      ],
    });

    expect(estimate.ageMin).toBe(25);
    expect(estimate.ageMax).toBe(44);
    expect(estimate.genders).toEqual([2]);
    expect(estimate.interests).toEqual(audience.interests);
    expect(estimate.advantageAudience).toBe(true);
    expect(estimate.objective).toBe("OUTCOME_LEADS");
    expect(estimate.countries).toEqual(["IL"]);
    expect(publish.ageMin).toBe(estimate.ageMin);
    expect(publish.ageMax).toBe(estimate.ageMax);
    expect(publish.genders).toEqual(estimate.genders);
    expect(publish.interests).toEqual(estimate.interests);
    expect(publish.advantageAudience).toBe(estimate.advantageAudience);
    expect(publish.locations).toEqual(estimate.locations);
    expect(state.audienceEstimate.ready).toBe(false);
    expect(state.audienceEstimate.lower).toBe(0);
    expect(publish.status).toBe("PAUSED");
    expect(publish.activateAfterPublish).toBe(false);
  });

  it("turns the campaign on only when publish is explicitly confirmed", () => {
    const state = createDefaultAdsManagerState();
    const draft = buildPublishPayloadFromAdsManager(state);
    const live = buildPublishPayloadFromAdsManager(state, { activate: true });
    expect(draft.status).toBe("PAUSED");
    expect(draft.activateAfterPublish).toBe(false);
    expect(live.status).toBe("ACTIVE");
    expect(live.activateAfterPublish).toBe(true);
  });
});
