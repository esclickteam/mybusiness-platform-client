import { getDemoCurrency } from "@/guidedDemo/demoCurrency";
import { getDemoFixture } from "@/guidedDemo/demoFixtureLookup";
import type { DemoCampaignFixture } from "@/guidedDemo/fixtures/demoFixtures";
import type { AdsManagerState, InstantFormItem } from "./adsManagerTypes";

export const GUIDED_DEMO_FORM_ID = "demo_form_1";

function demoCreativeImage(label: string) {
  const safe = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="100%" height="100%" fill="#1877F2"/><text x="50%" y="54%" fill="#fff" font-size="48" font-family="Arial,sans-serif" text-anchor="middle">${safe}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function guidedDemoCampaignFixture(): DemoCampaignFixture | null {
  return getDemoFixture<DemoCampaignFixture>("campaign") || null;
}

/** The localized instant form offered in the guided demo (no Meta call). */
export function guidedDemoInstantForm(): InstantFormItem | null {
  const fixture = guidedDemoCampaignFixture();
  if (!fixture) return null;
  return {
    id: GUIDED_DEMO_FORM_ID,
    name: fixture.instantFormName,
    status: "active",
    customQuestions: 1,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

/** Fill a freshly created draft with the demo-locale campaign fixture. */
export function applyGuidedDemoCampaignDraft(state: AdsManagerState): AdsManagerState {
  const fixture = guidedDemoCampaignFixture();
  if (!fixture) return state;
  const currency = getDemoCurrency()?.code || state.campaign.currency;
  const isLeads = state.campaign.objective === "OUTCOME_LEADS";
  return {
    ...state,
    campaign: {
      ...state.campaign,
      name: fixture.name,
      budgetType: "daily",
      budgetAmount: String(fixture.dailyBudget),
      currency,
    },
    adSets: state.adSets.map((row, index) =>
      index === 0
        ? {
            ...row,
            name: fixture.adSetName,
            locationsSummary: fixture.location,
            locations: [
              {
                key: fixture.countryCode,
                name: fixture.location,
                type: "country",
                countryCode: fixture.countryCode,
                countryName: fixture.location,
                include: true,
              },
            ],
            ageMin: fixture.ageMin,
            ageMax: fixture.ageMax,
            includeCustomAudiences: [fixture.customAudience],
            suggestAudience: true,
            ageExpanded: true,
          }
        : row
    ),
    ads: state.ads.map((row, index) =>
      index === 0
        ? {
            ...row,
            name: fixture.adName,
            headline: fixture.headline,
            primaryText: fixture.primaryText,
            description: fixture.description,
            instantFormId: isLeads ? GUIDED_DEMO_FORM_ID : "",
            mediaLabel: fixture.headline,
            creativeFormat: "image",
            imagePreviewUrl: demoCreativeImage(fixture.headline),
          }
        : row
    ),
  };
}

/** Extra publish fields the demo backend stores on the showcase campaign. */
export function guidedDemoPublishExtras() {
  const fixture = guidedDemoCampaignFixture();
  if (!fixture) return {};
  return {
    interests: fixture.interests.map((name, index) => ({
      id: `demo_interest_${index + 1}`,
      name,
    })),
    audienceSummary: fixture.customAudience,
  };
}
