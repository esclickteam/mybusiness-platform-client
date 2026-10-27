import { describe, expect, it } from "vitest";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import {
  audienceTargetingFromAdsManager,
  buildAudienceEstimatePayload,
  buildPublishPayloadFromAdsManager,
  validateAdsManagerClient,
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
    state.adSets[0].interests = [
      { id: "6003139266461", name: "Beauty", type: "interests" },
      {
        id: "6002714895372",
        name: "Engaged shoppers",
        type: "behaviors",
      },
    ];
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

  it("publishes Click to WhatsApp with the Page-linked number", () => {
    const state = createDefaultAdsManagerState();
    state.adSets[0].conversionLocation = "WhatsApp";
    state.adSets[0].facebookPageId = "111";
    state.adSets[0].whatsappPhone = "972515573699";
    state.ads[0].facebookPageId = "111";
    state.ads[0].callToAction = "WHATSAPP_MESSAGE";
    state.ads[0].primaryText = "Hello";
    state.ads[0].headline = "Chat";
    const publish = buildPublishPayloadFromAdsManager(state);
    expect(publish.destinationType).toBe("WHATSAPP");
    expect(publish.whatsappPhone).toBe("972515573699");
    expect(publish.callToAction).toBe("WHATSAPP_MESSAGE");
    expect(validateAdsManagerClient(state)).toEqual([]);
  });

  it("blocks Instant Form publish while OPEN_LINK is still selected", () => {
    const state = createDefaultAdsManagerState();
    state.campaign.objective = "OUTCOME_LEADS";
    state.adSets[0].conversionLocation = "Instant forms";
    state.adSets[0].facebookPageId = "111";
    state.ads[0].facebookPageId = "111";
    state.ads[0].instantFormId = "form_9";
    state.ads[0].callToAction = "OPEN_LINK";
    state.ads[0].primaryText = "Hello";
    state.ads[0].headline = "Lead";
    const publish = buildPublishPayloadFromAdsManager(state);
    expect(publish.leadFormId).toBe("form_9");
    expect(publish.callToAction).toBe("OPEN_LINK");
    expect(validateAdsManagerClient(state).join(" ")).toMatch(/Instant Form|טופס|OPEN_LINK|לפרטים/i);
  });

  it("publishes GET_QUOTE with an Instant Form id", () => {
    const state = createDefaultAdsManagerState();
    state.campaign.objective = "OUTCOME_LEADS";
    state.adSets[0].conversionLocation = "Instant forms";
    state.adSets[0].facebookPageId = "111";
    state.ads[0].facebookPageId = "111";
    state.ads[0].instantFormId = "form_9";
    state.ads[0].callToAction = "GET_QUOTE";
    state.ads[0].primaryText = "Hello";
    state.ads[0].headline = "Lead";
    const publish = buildPublishPayloadFromAdsManager(state);
    expect(publish.callToAction).toBe("GET_QUOTE");
    expect(publish.leadFormId).toBe("form_9");
    expect(validateAdsManagerClient(state)).toEqual([]);
  });

  it("keeps OPEN_LINK on website traffic and drops a leftover form id", () => {
    const state = createDefaultAdsManagerState();
    state.campaign.objective = "OUTCOME_TRAFFIC";
    state.adSets[0].conversionLocation = "Website";
    state.ads[0].instantFormId = "stale_form";
    state.ads[0].callToAction = "OPEN_LINK";
    state.ads[0].websiteUrl = "https://example.com";
    state.ads[0].facebookPageId = "111";
    state.ads[0].primaryText = "Hello";
    state.ads[0].headline = "Visit";
    const publish = buildPublishPayloadFromAdsManager(state);
    expect(publish.leadFormId).toBeUndefined();
    expect(publish.callToAction).toBe("OPEN_LINK");
  });
});
