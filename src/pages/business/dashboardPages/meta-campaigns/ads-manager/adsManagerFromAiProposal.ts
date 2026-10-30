import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import { resolveCtaForAdContext } from "./metaAdCtas";
import type {
  AdsManagerLocation,
  AdsManagerState,
  AdSetDetailedTarget,
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
    locations?: Array<{
      kind?: string;
      name?: string;
      country?: string;
      key?: string;
      type?: string;
      countryCode?: string;
      metaCityKey?: string;
      latitude?: number | null;
      longitude?: number | null;
    }>;
    audience?: {
      summary?: string;
      ageMin?: number;
      ageMax?: number;
      gender?: string;
      interests?: Array<string | { id?: string; name?: string }>;
    };
    placements?: { recommendation?: string; surfaces?: string[] };
    optimizationKey?: string | null;
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
      imageHash?: string | null;
      videoId?: string | null;
    };
    destinationUrl?: string | null;
    link?: string | null;
  };
  leadForm?: {
    mode?: string;
    existingFormId?: string | null;
    existingFormName?: string | null;
    draft?: { name?: string | null } | null;
  } | null;
  graphSafe?: {
    objective?: string | null;
    optimizationGoal?: string | null;
    cta?: string | null;
  };
  copyAlternatives?: Array<{
    id?: string;
    primaryText?: string;
    headline?: string;
    description?: string;
  }>;
};

export type AiProposalHandoffMetaAssets = {
  campaignId?: string | null;
  adSetId?: string | null;
  creativeId?: string | null;
  adId?: string | null;
  leadFormId?: string | null;
  imageHash?: string | null;
  videoId?: string | null;
  whatsappPhone?: string | null;
  resolvedLocations?: AdsManagerLocation[];
  resolvedInterests?: AdSetDetailedTarget[];
  pageId?: string | null;
  pageName?: string | null;
};

export type AiProposalHandoff = {
  proposal: AiProposalHandoffProposal;
  destinationKey?: string | null;
  /** Assets already created / resolved during AI Meta draft (preferred). */
  metaAssets?: AiProposalHandoffMetaAssets | null;
  websiteUrl?: string | null;
};

export function isCampaignObjective(value: string | null | undefined): value is CampaignObjective {
  return Boolean(value && OBJECTIVES.includes(value as CampaignObjective));
}

export function conversionLocationFromDestination(key?: string | null): string {
  if (key === "LEAD_FORM") return "Instant forms";
  if (key === "WHATSAPP") return "WhatsApp";
  if (key === "PHONE") return "Phone";
  return "Website";
}

function locationFromProposal(
  item: {
    kind?: string;
    name?: string;
    country?: string;
    key?: string;
    type?: string;
    countryCode?: string;
    metaCityKey?: string;
    latitude?: number | null;
    longitude?: number | null;
  },
  index: number
): AdsManagerLocation {
  const country = String(item.countryCode || item.country || "IL").toUpperCase();
  const name = item.name || country;
  const type = String(item.type || item.kind || "").toLowerCase();
  const isCountry =
    type === "country" || item.kind === "country" || name.toLowerCase() === "israel";
  return {
    key: item.key || (isCountry ? country : `${country}:${name}:${index}`),
    name,
    type: isCountry ? "country" : type || "city",
    countryCode: country,
    countryName: country === "IL" ? "Israel" : country,
    metaCityKey: item.metaCityKey || undefined,
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    include: true,
  };
}

function interestsFromProposal(
  proposal: AiProposalHandoffProposal,
  metaAssets?: AiProposalHandoffMetaAssets | null
): AdSetDetailedTarget[] {
  if (Array.isArray(metaAssets?.resolvedInterests) && metaAssets.resolvedInterests.length) {
    return metaAssets.resolvedInterests.map((item) => ({
      id: String(item.id),
      name: item.name || String(item.id),
      type: item.type || "interests",
    }));
  }
  const raw = proposal.adSet.audience?.interests || [];
  return raw
    .map((item) => {
      if (typeof item === "string") {
        return { id: item, name: item, type: "interests" };
      }
      const id = String(item?.id || item?.name || "").trim();
      if (!id) return null;
      return {
        id,
        name: String(item?.name || id),
        type: "interests",
      };
    })
    .filter(Boolean) as AdSetDetailedTarget[];
}

/**
 * Hydrate Ads Manager from an AI proposal + optional Meta draft assets.
 * Prefer metaAssets (resolved geo, interests, form id, media hashes, WA phone)
 * when the AI draft already created them server-side.
 */
export function adsManagerStateFromAiProposal(
  handoff: AiProposalHandoff
): AdsManagerState {
  const state = createDefaultAdsManagerState();
  const { proposal, destinationKey, metaAssets, websiteUrl } = handoff;
  const objectiveRaw =
    proposal.graphSafe?.objective || proposal.campaign.metaObjective || "OUTCOME_LEADS";
  const objective = isCampaignObjective(objectiveRaw) ? objectiveRaw : "OUTCOME_LEADS";
  const daily = proposal.adSet.dailyBudget;
  const lifetime = proposal.adSet.lifetimeBudget;
  const budget = daily || lifetime;
  const resolvedLocations = metaAssets?.resolvedLocations?.length
    ? metaAssets.resolvedLocations
    : (proposal.adSet.locations || []).map(locationFromProposal);
  const interests = interestsFromProposal(proposal, metaAssets);
  const conversionLocation = conversionLocationFromDestination(destinationKey);
  const usesInstantForms = conversionLocation.toLowerCase().includes("instant");
  const usesWhatsApp = conversionLocation.toLowerCase().includes("whatsapp");
  const cta = resolveCtaForAdContext(
    proposal.graphSafe?.cta ||
      proposal.creative.ctaKey ||
      (usesWhatsApp ? "WHATSAPP_MESSAGE" : "LEARN_MORE"),
    { usesInstantForms, usesWhatsApp }
  );
  const media = proposal.creative.media;
  const campaignName = proposal.campaign.name || state.campaign.name;
  const leadFormId =
    metaAssets?.leadFormId ||
    (usesInstantForms && proposal.leadForm?.mode === "EXISTING"
      ? String(proposal.leadForm.existingFormId || "")
      : usesInstantForms
        ? String(proposal.leadForm?.existingFormId || "")
        : "");
  const imageHash = metaAssets?.imageHash || media?.imageHash || "";
  const videoId = metaAssets?.videoId || media?.videoId || "";
  const whatsappPhone = metaAssets?.whatsappPhone || "";
  const optimizationGoal =
    proposal.graphSafe?.optimizationGoal ||
    proposal.adSet.optimizationKey ||
    "";
  const link =
    proposal.creative.destinationUrl ||
    proposal.creative.link ||
    websiteUrl ||
    "";

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
            facebookPageId: metaAssets?.pageId || row.facebookPageId,
            facebookPageName: metaAssets?.pageName || row.facebookPageName,
            whatsappPhone: usesWhatsApp ? String(whatsappPhone || row.whatsappPhone || "") : "",
            whatsappDisplayNumber: usesWhatsApp
              ? String(whatsappPhone || row.whatsappDisplayNumber || "")
              : "",
            performanceGoal:
              objective === "OUTCOME_LEADS"
                ? "Maximize number of leads"
                : usesWhatsApp
                  ? "Maximize number of conversations"
                  : row.performanceGoal,
            optimizationGoal: String(optimizationGoal || row.optimizationGoal || ""),
            locationsSummary:
              resolvedLocations.map((item) => item.name).join(", ") || row.locationsSummary,
            locations: resolvedLocations.length ? resolvedLocations : row.locations,
            ageMin: proposal.adSet.audience?.ageMin || row.ageMin,
            ageMax: proposal.adSet.audience?.ageMax || row.ageMax,
            gender:
              proposal.adSet.audience?.gender === "male" ||
              proposal.adSet.audience?.gender === "female"
                ? proposal.adSet.audience.gender
                : "all",
            interests: interests.length ? interests : row.interests,
            dailyBudget: daily
              ? Number(daily.amount).toFixed(2)
              : row.dailyBudget,
            lifetimeBudget: lifetime
              ? Number(lifetime.amount).toFixed(2)
              : row.lifetimeBudget,
            advantagePlacements: proposal.adSet.placements?.recommendation !== "MANUAL",
          }
        : row
    ),
    ads: state.ads.map((row, index) =>
      index === 0
        ? {
            ...row,
            name: `${campaignName} — Ad`,
            facebookPageId: metaAssets?.pageId || row.facebookPageId,
            facebookPageName: metaAssets?.pageName || row.facebookPageName,
            primaryText: proposal.creative.primaryText || row.primaryText,
            headline: proposal.creative.headline || row.headline,
            description: proposal.creative.description || row.description,
            callToAction: cta,
            websiteUrl: link || row.websiteUrl,
            instantFormId: leadFormId || row.instantFormId,
            instantFormName:
              proposal.leadForm?.existingFormName ||
              proposal.leadForm?.draft?.name ||
              row.instantFormName,
            formPageId: metaAssets?.pageId || row.formPageId,
            imageHash: String(imageHash || row.imageHash || ""),
            videoId: String(videoId || row.videoId || ""),
            imagePreviewUrl:
              media?.status === "PROVIDED" || media?.url
                ? media.url || row.imagePreviewUrl || ""
                : row.imagePreviewUrl,
            creativeFormat:
              videoId || media?.kind === "video"
                ? "video"
                : row.creativeFormat || "image",
            mediaLabel: media?.fileName || row.mediaLabel,
            creativeId: metaAssets?.creativeId || row.creativeId,
          }
        : row
    ),
  };
}
