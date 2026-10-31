import { describe, expect, it } from "vitest";
import {
  adsManagerStateFromAiProposal,
  conversionLocationFromDestination,
} from "./adsManagerFromAiProposal";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";

const proposal = {
  campaign: {
    name: "Facial — לידים",
    objectiveKey: "LEADS",
    metaObjective: "OUTCOME_LEADS",
  },
  adSet: {
    dailyBudget: { amount: 70, currency: "ILS" },
    lifetimeBudget: null,
    locations: [{ kind: "city", name: "Haifa", country: "IL" }],
    audience: { summary: "Nearby", ageMin: 25, ageMax: 45, gender: "female" },
    placements: { recommendation: "ADVANTAGE", surfaces: ["ADVANTAGE"] },
  },
  creative: {
    primaryText: "Leave details",
    headline: "Facial in Haifa",
    description: "Clinic",
    ctaKey: "SIGN_UP",
    media: { status: "MISSING" as const, url: null, fileName: null, kind: null },
  },
  leadForm: { mode: "EXISTING", existingFormId: "form_9", existingFormName: "Clinic" },
  graphSafe: { objective: "OUTCOME_LEADS", cta: "SIGN_UP" },
};

describe("adsManagerFromAiProposal", () => {
  it("maps destination onto the existing Ads Manager conversion locations", () => {
    expect(conversionLocationFromDestination("LEAD_FORM")).toBe("Instant forms");
    expect(conversionLocationFromDestination("WHATSAPP")).toBe("WhatsApp");
    expect(conversionLocationFromDestination("WEBSITE")).toBe("Website");
  });

  it("hydrates campaign, ad set, and ad fields from the AI proposal", () => {
    const state = adsManagerStateFromAiProposal({
      proposal,
      destinationKey: "LEAD_FORM",
    });
    expect(state.campaign.name).toBe("Facial — לידים");
    expect(state.campaign.objective).toBe("OUTCOME_LEADS");
    expect(state.campaign.budgetAmount).toBe("70.00");
    expect(state.adSets[0].conversionLocation).toBe("Instant forms");
    expect(state.adSets[0].locations[0].name).toBe("Haifa");
    expect(state.adSets[0].locations[0].metaCityKey).toBeUndefined();
    expect(state.ads[0].headline).toBe("Facial in Haifa");
    expect(state.ads[0].callToAction).toBe("SIGN_UP");
    expect(state.ads[0].instantFormId).toBe("form_9");
  });

  it("remaps OPEN_LINK onto SIGN_UP for Instant Form proposals", () => {
    const state = adsManagerStateFromAiProposal({
      proposal: {
        ...proposal,
        creative: { ...proposal.creative, ctaKey: "OPEN_LINK" },
        graphSafe: { objective: "OUTCOME_LEADS", cta: "OPEN_LINK" },
      },
      destinationKey: "LEAD_FORM",
    });
    expect(state.ads[0].callToAction).toBe("SIGN_UP");
  });

  it("ignores invalid Graph-looking objectives from the proposal", () => {
    const state = adsManagerStateFromAiProposal({
      proposal: {
        ...proposal,
        graphSafe: { objective: "GET_MORE_CUSTOMERS", cta: "CLICK_HERE" },
        campaign: { ...proposal.campaign, metaObjective: "GET_MORE_CUSTOMERS" },
      },
      destinationKey: "LEAD_FORM",
    });
    expect(state.campaign.objective).toBe("OUTCOME_LEADS");
  });

  it("hydrates resolved interests, media hashes, form id, and WhatsApp from metaAssets", () => {
    const state = adsManagerStateFromAiProposal({
      proposal: {
        ...proposal,
        campaign: {
          name: "WA — הודעות",
          objectiveKey: "WHATSAPP",
          metaObjective: "OUTCOME_ENGAGEMENT",
        },
        graphSafe: {
          objective: "OUTCOME_ENGAGEMENT",
          optimizationGoal: "CONVERSATIONS",
          cta: "WHATSAPP_MESSAGE",
        },
        creative: {
          ...proposal.creative,
          ctaKey: "WHATSAPP_MESSAGE",
          media: {
            status: "PROVIDED",
            url: "https://cdn.example/a.jpg",
            kind: "image",
            imageHash: "hash_from_proposal",
          },
        },
      },
      destinationKey: "WHATSAPP",
      metaAssets: {
        leadFormId: null,
        imageHash: "hash_from_meta",
        whatsappPhone: "972501234567",
        resolvedLocations: [
          {
            key: "115050",
            name: "Tel Aviv",
            type: "city",
            countryCode: "IL",
            countryName: "Israel",
            include: true,
          },
        ],
        resolvedInterests: [{ id: "6003123294", name: "Beauty", type: "interests" }],
      },
    });
    expect(state.adSets[0].conversionLocation).toBe("WhatsApp");
    expect(state.adSets[0].whatsappPhone).toBe("972501234567");
    expect(state.adSets[0].optimizationGoal).toBe("CONVERSATIONS");
    expect(state.adSets[0].locations[0].name).toBe("Tel Aviv");
    expect(state.adSets[0].interests[0].id).toBe("6003123294");
    expect(state.ads[0].imageHash).toBe("hash_from_meta");
    expect(state.ads[0].callToAction).toBe("WHATSAPP_MESSAGE");
  });

  it("keeps default Ads Manager state shape when no AI handoff is used", () => {
    const fresh = createDefaultAdsManagerState();
    expect(fresh.campaign.name).toBe("New leads campaign");
    expect(fresh.ads[0].headline).toBe("Talk to our team");
  });
});
