import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import type {
  AdsManagerLocation,
  AdsManagerState,
  CampaignObjective,
} from "./adsManagerTypes";

const OBJECTIVES: CampaignObjective[] = [
  "OUTCOME_AWARENESS",
  "OUTCOME_TRAFFIC",
  "OUTCOME_ENGAGEMENT",
  "OUTCOME_LEADS",
  "OUTCOME_APP_PROMOTION",
  "OUTCOME_SALES",
];

export type AiProposalHandoffProposal = {
  campaign: {
    name: string;
    objectiveKey?: string | null;
    metaObjective?: string | null;
  };
  adSet: {
    dailyBudget?: { amount: number; currency: string } | null;
    lifetimeBudget?: { amount: number; currency: string } | null;
    locations?: Array<{ kind?: string; name?: string; country?: string }>;
    audience?: {
      summary?: string;
      ageMin?: number;
      ageMax?: number;
      gender?: string;
    };
    placements?: { recommendation?: string; surfaces?: string[] };
  };
  creative: {
    primaryText: string;
    headline: string;
    description: string;
    ctaKey: string;
    media?: {
      status?: string;
      url?: string | null;
      fileName?: string | null;
      kind?: string | null;
    };
  };
  leadForm?: {
    mode?: string;
    existingFormId?: string | null;
    existingFormName?: string | null;
  } | null;
  graphSafe?: {
    objective?: string | null;
    optimizationGoal?: string | null;
    cta?: string | null;
  };
};

export type AiProposalHandoff = {
  proposal: AiProposalHandoffProposal;
  destinationKey?: string | null;
};

export function isCampaignObjective(value: string | null | undefined): value is CampaignObjective {
  return Boolean(value && OBJECTIVES.includes(value as CampaignObjective));
}

export function conversionLocationFromDestination(key?: string | null): string {
  if (key === "LEAD_FORM") return "Instant forms";
  if (key === "WHATSAPP") return "Messenger";
  return "Website";
}

function locationFromProposal(
  item: { kind?: string; name?: string; country?: string },
  index: number
): AdsManagerLocation {
  const country = String(item.country || "IL").toUpperCase();
  const name = item.name || country;
  const isCountry = item.kind === "country" || name.toLowerCase() === "israel";
  return {
    key: isCountry ? country : `${country}:${name}:${index}`,
    name,
    type: isCountry ? "country" : "city",
    countryCode: country,
    countryName: country === "IL" ? "Israel" : country,
    include: true,
  };
}

/**
 * Minimal Ads Manager hydration from an AI proposal.
 * Does not geocode cities, upload media to Meta, or create Instant Forms.
 */
export function adsManagerStateFromAiProposal(
  handoff: AiProposalHandoff
): AdsManagerState {
  const state = createDefaultAdsManagerState();
  const { proposal, destinationKey } = handoff;
  const objectiveRaw =
    proposal.graphSafe?.objective || proposal.campaign.metaObjective || "OUTCOME_LEADS";
  const objective = isCampaignObjective(objectiveRaw) ? objectiveRaw : "OUTCOME_LEADS";
  const daily = proposal.adSet.dailyBudget;
  const lifetime = proposal.adSet.lifetimeBudget;
  const budget = daily || lifetime;
  const locations = (proposal.adSet.locations || []).map(locationFromProposal);
  const conversionLocation = conversionLocationFromDestination(destinationKey);
  const usesInstantForms = conversionLocation.toLowerCase().includes("instant");
  const cta = proposal.graphSafe?.cta || proposal.creative.ctaKey || "LEARN_MORE";
  const media = proposal.creative.media;
  const campaignName = proposal.campaign.name || state.campaign.name;

  return {
    ...state,
    campaign: {
      ...state.campaign,
      name: campaignName,
      objective,
      budgetType: daily ? "daily" : lifetime ? "lifetime" : state.campaign.budgetType,
      budgetAmount: budget ? Number(budget.amount).toFixed(2) : state.campaign.budgetAmount,
      currency: budget?.currency || state.campaign.currency,
      advantagePlusLeads: objective === "OUTCOME_LEADS",
    },
    adSets: state.adSets.map((row, index) =>
      index === 0
        ? {
            ...row,
            name: `${campaignName} — Ad set`,
            conversionLocation,
            performanceGoal:
              objective === "OUTCOME_LEADS"
                ? "Maximize number of leads"
                : row.performanceGoal,
            locationsSummary: locations.map((item) => item.name).join(", ") || row.locationsSummary,
            locations: locations.length ? locations : row.locations,
            ageMin: proposal.adSet.audience?.ageMin || row.ageMin,
            ageMax: proposal.adSet.audience?.ageMax || row.ageMax,
            gender:
              proposal.adSet.audience?.gender === "male" ||
              proposal.adSet.audience?.gender === "female"
                ? proposal.adSet.audience.gender
                : "all",
            advantagePlacements: proposal.adSet.placements?.recommendation !== "MANUAL",
          }
        : row
    ),
    ads: state.ads.map((row, index) =>
      index === 0
        ? {
            ...row,
            name: `${campaignName} — Ad`,
            primaryText: proposal.creative.primaryText || row.primaryText,
            headline: proposal.creative.headline || row.headline,
            description: proposal.creative.description || row.description,
            callToAction: cta,
            instantFormId:
              usesInstantForms && proposal.leadForm?.mode === "EXISTING"
                ? String(proposal.leadForm.existingFormId || "")
                : "",
            imagePreviewUrl: media?.status === "PROVIDED" ? media.url || "" : "",
            creativeFormat: media?.kind === "video" ? "video" : "image",
            mediaLabel: media?.fileName || row.mediaLabel,
          }
        : row
    ),
  };
}
