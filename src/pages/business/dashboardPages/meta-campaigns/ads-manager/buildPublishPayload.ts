import i18n from "../../../../../i18n/i18n";
import type { AdsManagerState } from "./adsManagerTypes";

const tChrome = (key: string) =>
  i18n.t(`metaCampaigns.adsManager.chrome.${key}`);

function gendersForMeta(gender: AdsManagerState["adSets"][0]["gender"]) {
  if (gender === "male") return [1];
  if (gender === "female") return [2];
  return [];
}

function selectedAge(adSet: AdsManagerState["adSets"][0]) {
  const range = Array.isArray(adSet.targetingRaw?.age_range)
    ? (adSet.targetingRaw.age_range as number[])
    : null;
  const ageMin = range?.[0] ?? adSet.ageMin;
  const ageMaxRaw = range?.[1] ?? adSet.ageMax;
  return {
    ageMin: ageMin ?? undefined,
    ageMax:
      ageMaxRaw == null ? undefined : ageMaxRaw >= 65 ? 65 : ageMaxRaw,
  };
}

/**
 * Audience fields shared by the delivery estimate and the ad set create payload.
 */
export function audienceTargetingFromAdsManager(state: AdsManagerState) {
  const adSet = state.adSets[0];
  const locations = (adSet?.locations || [])
    .filter((loc) => loc.include !== false)
    .map((loc) => {
      const isCity = /city|subcity|neighborhood/i.test(loc.type || "");
      const cityOnly = Boolean(loc.cityOnly) || loc.radiusMiles == null;
      const radiusMiles =
        isCity && !cityOnly && loc.radiusMiles != null ? loc.radiusMiles : null;
      return {
        key: loc.key,
        name: loc.name,
        type: loc.type,
        countryCode: loc.countryCode,
        countryName: loc.countryName,
        region: loc.region,
        metaCityKey: loc.metaCityKey || (isCity ? loc.key : undefined),
        radiusKm: radiusMiles,
        radiusMiles,
        distanceUnit: radiusMiles != null ? ("mile" as const) : undefined,
        latitude: loc.latitude,
        longitude: loc.longitude,
      };
    });

  const countries = locations
    .filter((item) => item.type === "country")
    .map((item) => String(item.key || item.countryCode || "").toUpperCase())
    .filter(Boolean);

  const advantageAudience = adSet?.furtherLimitReach
    ? false
    : adSet?.advantageAudience !== false;

  const ages = adSet
    ? selectedAge(adSet)
    : { ageMin: undefined, ageMax: undefined };

  return {
    locations,
    countries: countries.length ? countries : ["IL"],
    locationsSummary:
      adSet?.locationsSummary || locations.map((item) => item.name).join(", "),
    ageMin: ages.ageMin,
    ageMax: ages.ageMax,
    genders: gendersForMeta(adSet?.gender || "all"),
    interests: (adSet?.interests || [])
      .filter((item) => item?.id)
      .map((item) => ({ id: item.id, name: item.name })),
    advantageAudience,
    advantagePlacements: adSet?.advantagePlacements !== false,
    furtherLimitReach: Boolean(adSet?.furtherLimitReach),
    suggestAudience: adSet?.suggestAudience !== false,
  };
}

export function buildAudienceEstimatePayload(
  state: AdsManagerState,
  options?: { isEditSession?: boolean }
) {
  const adSet = state.adSets[0];
  const ad = state.ads[0];
  const audience = audienceTargetingFromAdsManager(state);
  const pageId = ad?.facebookPageId || adSet?.facebookPageId || "";
  return {
    ...audience,
    objective: state.campaign?.objective,
    advantagePlus: state.campaign?.advantagePlusLeads === true,
    optimizationGoal: adSet?.optimizationGoal || undefined,
    pageId:
      pageId && pageId !== "page_1" && pageId !== "page_2" ? pageId : undefined,
    strictEstimate: true,
    noGeoFallback: Boolean(options?.isEditSession) && audience.locations.length === 0,
  };
}

/**
 * Maps Ads Manager draft state → Meta Marketing API publish payload.
 * Server validates and creates campaign → ad set → creative → ad for real.
 */
export function buildPublishPayloadFromAdsManager(
  state: AdsManagerState,
  options?: { activate?: boolean }
) {
  const campaign = state.campaign;
  const adSet = state.adSets[0];
  const ad = state.ads[0];
  if (!campaign || !adSet || !ad) {
    throw new Error(tChrome("validationStructure"));
  }

  const isLeads = campaign.objective === "OUTCOME_LEADS";
  const amount = Number(String(campaign.budgetAmount).replace(/,/g, ""));
  const usesInstantForms = String(adSet.conversionLocation)
    .toLowerCase()
    .includes("instant");

  const audience = audienceTargetingFromAdsManager(state);
  const pageId = ad.facebookPageId || adSet.facebookPageId || "";

  return {
    full: true,
    mode: "full",
    name: campaign.name.trim(),
    objective: campaign.objective,
    // Drafts and estimates stay PAUSED. Only a confirmed publish asks to go live.
    status: options?.activate === true ? "ACTIVE" : "PAUSED",
    activateAfterPublish: options?.activate === true,
    specialAdCategories: [],
    pageId,
    adSetName: adSet.name.trim(),
    adName: ad.name.trim(),
    creativeName: `${ad.name.trim()} – Creative`,
    budgetType: campaign.budgetType,
    dailyBudget:
      campaign.budgetType === "daily" && Number.isFinite(amount)
        ? amount
        : undefined,
    lifetimeBudget:
      campaign.budgetType === "lifetime" && Number.isFinite(amount)
        ? amount
        : undefined,
    budgetAmount: amount,
    bidStrategy:
      campaign.bidStrategy === "Highest volume"
        ? "LOWEST_COST_WITHOUT_CAP"
        : undefined,
    startDate: adSet.startDate,
    startTime: adSet.startTime,
    endDateEnabled: adSet.endDateEnabled,
    endDate: adSet.endDate,
    endTime: adSet.endTime,
    locationsSummary: audience.locationsSummary,
    locations: audience.locations,
    countries: audience.countries,
    ageMin: audience.ageMin,
    ageMax: audience.ageMax,
    genders: audience.genders,
    interests: audience.interests,
    advantageAudience: audience.advantageAudience,
    advantagePlus: campaign.advantagePlusLeads,
    advantagePlacements: adSet.advantagePlacements,
    conversionLocation: adSet.conversionLocation,
    performanceGoal: adSet.performanceGoal,
    destinationType:
      isLeads && usesInstantForms ? "ON_AD" : "WEBSITE",
    leadFormId: ad.instantFormId || undefined,
    formId: ad.instantFormId || undefined,
    websiteUrl: ad.websiteUrl,
    link: ad.websiteUrl,
    displayLink: ad.displayLink,
    primaryText: ad.primaryText,
    message: ad.primaryText,
    headline: ad.headline,
    description: ad.description,
    callToAction: ad.callToAction,
    imageHash: ad.imageHash || undefined,
    imageUrl: ad.imagePreviewUrl || undefined,
    videoId: ad.videoId || undefined,
    creativeFormat: ad.creativeFormat === "video" ? "video" : "single",
  };
}

export function validateAdsManagerClient(state: AdsManagerState): string[] {
  const errors: string[] = [];
  const campaign = state.campaign;
  const adSet = state.adSets[0];
  const ad = state.ads[0];
  const usesInstantForms = String(adSet?.conversionLocation || "")
    .toLowerCase()
    .includes("instant");

  if (!campaign?.name.trim()) errors.push(tChrome("validationCampaignName"));
  if (!campaign?.objective) errors.push(tChrome("validationObjective"));
  if (!campaign?.budgetAmount) errors.push(tChrome("validationBudget"));
  if (!adSet?.name.trim()) errors.push(tChrome("validationAdSetName"));
  if (!(adSet?.locations?.length || adSet?.locationsSummary?.trim())) {
    errors.push(tChrome("validationLocations"));
  }
  if (!adSet?.startDate) errors.push(tChrome("validationStartDate"));
  if (!ad?.name.trim()) errors.push(tChrome("validationAdName"));
  const pageId = ad?.facebookPageId || adSet?.facebookPageId;
  if (!pageId || pageId === "page_1" || pageId === "page_2") {
    errors.push(tChrome("validationPage"));
  }
  if (usesInstantForms && !adSet?.facebookPageId && !ad?.facebookPageId) {
    errors.push(tChrome("validationPageForForms"));
  }
  if (!ad?.primaryText.trim() || !ad?.headline.trim()) {
    errors.push(tChrome("validationCreativeText"));
  }
  if (
    campaign?.objective === "OUTCOME_LEADS" &&
    usesInstantForms &&
    !ad?.instantFormId
  ) {
    errors.push(tChrome("validationInstantForm"));
  }
  if (!ad?.instantFormId && !ad?.websiteUrl.trim()) {
    errors.push(tChrome("validationDestination"));
  }
  return errors;
}
