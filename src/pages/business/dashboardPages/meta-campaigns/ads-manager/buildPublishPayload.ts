import type { AdsManagerState } from "./adsManagerTypes";

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

  return {
    full: true,
    mode: "full",
    name: campaign.name.trim(),
    objective: campaign.objective,
    status: "PAUSED",
    specialAdCategories: [],
    pageId: ad.facebookPageId,
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
    locationsSummary: adSet.locationsSummary,
    countries: ["IL"],
    advantageAudience: adSet.advantageAudience,
    advantagePlus: campaign.advantagePlusLeads,
    advantagePlacements: adSet.advantagePlacements,
    conversionLocation: adSet.conversionLocation,
    destinationType:
      isLeads &&
      String(adSet.conversionLocation).toLowerCase().includes("instant")
        ? "ON_AD"
        : "WEBSITE",
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

  if (!campaign?.name.trim()) errors.push("Campaign name is required");
  if (!campaign?.objective) errors.push("Campaign objective is required");
  if (!campaign?.budgetAmount) errors.push("Budget is required");
  if (!adSet?.name.trim()) errors.push("Ad set name is required");
  if (!adSet?.locationsSummary.trim()) errors.push("Locations are required");
  if (!adSet?.startDate) errors.push("Schedule start date is required");
  if (!ad?.name.trim()) errors.push("Ad name is required");
  if (!ad?.facebookPageId) errors.push("Facebook Page is required");
  if (!ad?.primaryText.trim() || !ad?.headline.trim()) {
    errors.push("Creative primary text and headline are required");
  }
  if (
    campaign?.objective === "OUTCOME_LEADS" &&
    String(adSet?.conversionLocation || "")
      .toLowerCase()
      .includes("instant") &&
    !ad?.instantFormId
  ) {
    errors.push("Instant Form is required for Lead Ads");
  }
  if (!ad?.instantFormId && !ad?.websiteUrl.trim()) {
    errors.push("Destination website URL or Instant Form is required");
  }
  return errors;
}
