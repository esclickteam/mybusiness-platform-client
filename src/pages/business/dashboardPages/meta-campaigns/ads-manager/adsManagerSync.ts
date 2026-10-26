import type { MetaCampaign } from "../../../../../api/metaCampaignsApi";
import type { AdsManagerState } from "./adsManagerTypes";

export function localSnapshotFromState(state: AdsManagerState) {
  const adSet = state.adSets[0];
  const ad = state.ads[0];
  return {
    name: state.campaign.name,
    objective: state.campaign.objective,
    status: state.campaign.status,
    dailyBudget: state.campaign.budgetType === "daily" ? state.campaign.budgetAmount : "",
    lifetimeBudget: state.campaign.budgetType === "lifetime" ? state.campaign.budgetAmount : "",
    bidStrategy: state.campaign.bidStrategy,
    conversionLocation: adSet?.conversionLocation,
    callToAction: ad?.callToAction,
    primaryText: ad?.primaryText,
    headline: ad?.headline,
    leadFormId: ad?.instantFormId,
    publisherPlatforms: adSet?.publisherPlatforms,
    customAudiences: (adSet?.customAudiences || []).map((row) => row.id),
    objectStoryId: ad?.objectStoryId,
    productSetId: ad?.productSetId,
  };
}

export function metaSnapshotFromCampaign(campaign: MetaCampaign) {
  const adSet = campaign.adSets?.[0];
  return {
    name: campaign.name,
    objective: campaign.objective,
    status: campaign.status,
    dailyBudget: campaign.dailyBudget ? String(campaign.dailyBudget) : "",
    lifetimeBudget: campaign.lifetimeBudget ? String(campaign.lifetimeBudget) : "",
    bidStrategy: campaign.bidStrategy,
    conversionLocation: undefined,
    callToAction: campaign.callToAction,
    primaryText: campaign.primaryText,
    headline: campaign.headline,
    leadFormId: campaign.leadFormId || campaign.formId,
    publisherPlatforms: adSet?.publisherPlatforms || campaign.publisherPlatforms,
    customAudiences: (adSet?.customAudiences || []).map((row) => row.id),
    objectStoryId: undefined,
    productSetId: undefined,
  };
}
