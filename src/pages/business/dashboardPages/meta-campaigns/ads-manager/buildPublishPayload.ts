import type { AdsManagerState } from "./adsManagerTypes";

function gendersForMeta(gender: AdsManagerState["adSets"][0]["gender"]) {
  if (gender === "male") return [1];
  if (gender === "female") return [2];
  return [];
}

/**
 * Maps Ads Manager draft state → Meta Marketing API publish payload.
 * Server validates and creates campaign → ad set → creative → ad for real.
 */
export function buildPublishPayloadFromAdsManager(state: AdsManagerState) {
  const campaign = state.campaign;
  const adSet = state.adSets[0];
  const ad = state.ads[0];
  if (!campaign || !adSet || !ad) {
    throw new Error("Campaign structure is incomplete");
  }

  const isLeads = campaign.objective === "OUTCOME_LEADS";
  const amount = Number(String(campaign.budgetAmount).replace(/,/g, ""));
  const usesInstantForms = String(adSet.conversionLocation)
    .toLowerCase()
    .includes("instant");

  const locations = (adSet.locations || [])
    .filter((loc) => loc.include !== false)
    .map((loc) => {
      const isCity = /city|subcity|neighborhood/i.test(loc.type || "");
      const cityOnly = Boolean(loc.cityOnly) || loc.radiusMiles == null;
      const radiusMiles =
        isCity && !cityOnly && loc.radiusMiles != null
          ? loc.radiusMiles
          : null;
      return {
        key: loc.key,
        name: loc.name,
        type: loc.type,
        countryCode: loc.countryCode,
        countryName: loc.countryName,
        region: loc.region,
        metaCityKey: loc.metaCityKey || (isCity ? loc.key : undefined),
        // Meta API: city only = no radius; otherwise miles (10–50) like Ads Manager.
        radiusKm: radiusMiles,
        distanceUnit: radiusMiles != null ? "mile" : undefined,
        latitude: loc.latitude,
        longitude: loc.longitude,
      };
    });

  const countries = locations
    .filter((item) => item.type === "country")
    .map((item) =>
      String(item.key || item.countryCode || "").toUpperCase()
    )
    .filter(Boolean);

  const pageId =
    ad.facebookPageId ||
    adSet.facebookPageId ||
    "";

  // Precise age/gender only apply on Meta when Advantage+ audience is off.
  const preciseAudience =
    adSet.gender !== "all" ||
    adSet.furtherLimitReach ||
    adSet.ageMin !== 18 ||
    adSet.ageMax < 65;

  return {
    full: true,
    mode: "full",
    name: campaign.name.trim(),
    objective: campaign.objective,
    status: "PAUSED",
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
    locationsSummary:
      adSet.locationsSummary ||
      locations.map((l) => l.name).join(", "),
    locations,
    countries: countries.length ? countries : ["IL"],
    ageMin: adSet.ageMin,
    ageMax: adSet.ageMax >= 65 ? 65 : adSet.ageMax,
    genders: gendersForMeta(adSet.gender),
    advantageAudience: preciseAudience ? false : adSet.advantageAudience,
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

  if (!campaign?.name.trim()) errors.push("Campaign name is required");
  if (!campaign?.objective) errors.push("Campaign objective is required");
  if (!campaign?.budgetAmount) errors.push("Budget is required");
  if (!adSet?.name.trim()) errors.push("Ad set name is required");
  if (!(adSet?.locations?.length || adSet?.locationsSummary?.trim())) {
    errors.push("Locations are required");
  }
  if (!adSet?.startDate) errors.push("Schedule start date is required");
  if (!ad?.name.trim()) errors.push("Ad name is required");
  const pageId = ad?.facebookPageId || adSet?.facebookPageId;
  if (!pageId || pageId === "page_1" || pageId === "page_2") {
    errors.push("Facebook Page is required");
  }
  if (usesInstantForms && !adSet?.facebookPageId && !ad?.facebookPageId) {
    errors.push("Select a Facebook Page for Instant forms");
  }
  if (!ad?.primaryText.trim() || !ad?.headline.trim()) {
    errors.push("Creative primary text and headline are required");
  }
  if (
    campaign?.objective === "OUTCOME_LEADS" &&
    usesInstantForms &&
    !ad?.instantFormId
  ) {
    errors.push("Instant Form is required for Lead Ads");
  }
  if (!ad?.instantFormId && !ad?.websiteUrl.trim()) {
    errors.push("Destination website URL or Instant Form is required");
  }
  return errors;
}
