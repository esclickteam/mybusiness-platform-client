import { describe, expect, it } from "vitest";
import { adsManagerStateFromMetaCampaign } from "./adsManagerStateFromMetaCampaign";
import { diffAdsManagerState } from "./adsManagerDiff";
import {
  buildAdSetUpdateFromDiff,
  buildAdUpdateFromDiff,
  buildExistingPublishPayload,
} from "./adsManagerEditPayloads";
import { isRealMetaObjectId } from "./editorDraft";
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

  it("saves a description change without clearing an empty image hash", () => {
    const baseline = adsManagerStateFromMetaCampaign(campaign);
    const current = {
      ...baseline,
      ads: baseline.ads.map((ad) => ({
        ...ad,
        description: "New description",
        imageHash: "",
      })),
    };
    const changes = diffAdsManagerState(baseline, current);
    const patch = buildAdUpdateFromDiff(current.ads[0], changes);
    expect(changes.some((row) => row.labelKey === "changeDescription")).toBe(true);
    expect(patch?.description).toBe("New description");
    expect(patch?.primaryText).toBe("Primary");
    expect(patch).not.toHaveProperty("imageHash");
  });

  it("reloads a draft form and creative when Meta has no ad yet", () => {
    const state = adsManagerStateFromMetaCampaign({
      ...campaign,
      ads: [],
      adId: "",
      creativeId: "",
      publishRecordId: "6aca8fb83890493cd9ec705d",
      creativeLinkedOnMeta: false,
      editorDraft: {
        ads: [
          {
            instantFormId: "form-9",
            instantFormName: "Lead form",
            formPageId: "page-1",
            facebookPageId: "page-1",
            instagramAccountId: "1789",
            primaryText: "Hello",
            headline: "Title",
            description: "Desc",
            callToAction: "SIGN_UP",
            imageHash: "hash-1",
            imagePreviewUrl: "https://cdn.example/a.jpg",
          },
        ],
      },
    });
    expect(state.publishRecordId).toBe("6aca8fb83890493cd9ec705d");
    expect(state.ads[0].instantFormId).toBe("form-9");
    expect(state.ads[0].headline).toBe("Title");
    expect(state.ads[0].description).toBe("Desc");
    expect(state.ads[0].primaryText).toBe("Hello");
    expect(state.ads[0].callToAction).toBe("SIGN_UP");
    expect(state.ads[0].imageHash).toBe("hash-1");
    expect(state.ads[0].imagePreviewUrl).toBe("https://cdn.example/a.jpg");
    expect(state.ads[0].facebookPageId).toBe("page-1");
    expect(state.ads[0].instagramAccountId).toBe("1789");
    expect(state.ads[0].formLinkedOnMeta).toBe(false);
    expect(isRealMetaObjectId(state.ads[0].id)).toBe(false);
    expect(isRealMetaObjectId("120251823719850469")).toBe(true);
  });

  it("keeps a Meta creative form distinct from a draft-only form", () => {
    const linked = adsManagerStateFromMetaCampaign({
      ...campaign,
      creativeLinkedOnMeta: true,
      editorDraft: {
        ads: [{ id: "ad-1", instantFormId: "form-9", headline: "Headline from Meta" }],
      },
      ads: [
        {
          id: "ad-1",
          name: "Main ad",
          adSetId: "adset-1",
          headline: "Headline from Meta",
          primaryText: "Primary",
          leadFormId: "form-9",
          creativeId: "120251800000000469",
        },
      ],
    });
    expect(linked.ads[0].formLinkedOnMeta).toBe(true);
    expect(linked.ads[0].instantFormId).toBe("form-9");
  });

  it("sends a lead-form change without a budget or status change", () => {
    const baseline = adsManagerStateFromMetaCampaign(campaign);
    const current = {
      ...baseline,
      ads: baseline.ads.map((ad) => ({ ...ad, instantFormId: "form-new" })),
    };
    const changes = diffAdsManagerState(baseline, current);
    const payload = buildExistingPublishPayload(current, changes);
    expect(payload.leadFormId).toBe("form-new");
    expect(payload.metaCampaignId).toBe("120251467028970469");
    expect(payload.metaAdId).toBeUndefined();
    expect(payload.metaAdSetId).toBeUndefined();
    expect(payload.allowBudgetChange).toBe(false);
    expect(payload.allowStatusChange).toBe(false);
    expect(payload.confirmCreateAd).toBe(false);
    expect(payload.campaign).toBeUndefined();
    expect(payload.adSet).toBeUndefined();
    expect(payload.ad).toEqual(expect.objectContaining({ leadFormId: "form-new" }));
    expect(payload.ad).not.toHaveProperty("dailyBudget");
    expect(payload.ad).not.toHaveProperty("status");
  });

  it("keeps a local editor id out of the Meta payload", () => {
    const localId = "6ad522a0026119f4b42a2cdb";
    const metaCampaignId = "120257519669290405";
    const metaAdSetId = "120257524329420405";
    const metaAdId = "120257524330680405";
    const state = adsManagerStateFromMetaCampaign({
      ...campaign,
      id: metaCampaignId,
      metaCampaignId,
      metaAdSetId,
      metaAdId,
      metaCreativeId: "4611120585773478",
      publishRecordId: localId,
      adSets: [
        {
          id: metaAdSetId,
          name: "Main ad set",
          ageMin: 24,
          ageMax: 38,
        },
      ],
      ads: [
        {
          id: metaAdId,
          name: "Main ad",
          adSetId: metaAdSetId,
          headline: "Headline from Meta",
          primaryText: "Primary",
          leadFormId: "1503689644979003",
          creativeId: "4611120585773478",
        },
      ],
      editorDraft: {
        workspace: {
          campaign: {
            id: localId,
            name: "Live",
            objective: "OUTCOME_LEADS",
            budgetAmount: "50",
            budgetType: "daily",
            status: "ACTIVE",
          },
          adSets: [{ id: `${localId}-adset`, name: "Main ad set", ageMin: 24, ageMax: 38 }],
          ads: [
            {
              id: `${localId}-ad`,
              name: "Main ad",
              instantFormId: "1503689644979003",
              headline: "Headline from Meta",
              primaryText: "Primary",
            },
          ],
        },
      },
    });
    expect(state.ads[0].id).toBe(`${localId}-ad`);
    expect(state.metaObjectIds).toEqual({
      campaignId: metaCampaignId,
      adSetId: metaAdSetId,
      adId: metaAdId,
      creativeId: "4611120585773478",
    });
    const current = {
      ...state,
      ads: state.ads.map((ad) => ({ ...ad, instantFormId: "1087067970773980" })),
    };
    const changes = diffAdsManagerState(state, current);
    const payload = buildExistingPublishPayload(current, changes, { routeId: metaCampaignId });
    expect(changes.some((row) => row.labelKey === "changeLeadForm")).toBe(true);
    expect(payload.metaAdId).toBe(metaAdId);
    expect(payload.metaAdSetId).toBe(metaAdSetId);
    expect(payload.metaCampaignId).toBe(metaCampaignId);
    expect(payload.metaCreativeId).toBe("4611120585773478");
    expect(payload.publishRecordId).toBe(localId);
    expect(payload.leadFormId).toBe("1087067970773980");
    expect(JSON.stringify({
      metaCampaignId: payload.metaCampaignId,
      metaAdSetId: payload.metaAdSetId,
      metaAdId: payload.metaAdId,
      metaCreativeId: payload.metaCreativeId,
    })).not.toContain(localId);
  });
});
