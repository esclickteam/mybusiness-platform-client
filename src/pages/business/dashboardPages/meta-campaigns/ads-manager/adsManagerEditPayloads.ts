import type { MetaCampaignPayload } from "../../../../../api/metaCampaignsApi";
import type { AdsManagerChange } from "./adsManagerDiff";
import type { AdsManagerState, AdDraft, AdSetDraft } from "./adsManagerTypes";

function gendersForMeta(gender: AdSetDraft["gender"]) {
  if (gender === "male") return [1];
  if (gender === "female") return [2];
  return [];
}

function combineDateTime(date: string, time: string) {
  if (!date) return undefined;
  return `${date}T${time || "00:00"}:00`;
}

export function buildCampaignUpdateFromDiff(
  current: AdsManagerState,
  changes: AdsManagerChange[]
): Partial<MetaCampaignPayload> | null {
  const campaignChanges = changes.filter((row) => row.entity === "campaign");
  if (!campaignChanges.length) return null;
  const patch: Partial<MetaCampaignPayload> = {};
  if (campaignChanges.some((row) => row.labelKey === "changeCampaignName")) {
    patch.name = current.campaign.name.trim();
  }
  if (
    current.campaign.budgetStrategy === "campaign" &&
    campaignChanges.some((row) => row.labelKey === "changeBudget")
  ) {
    const amount = Number(String(current.campaign.budgetAmount).replace(/,/g, ""));
    if (Number.isFinite(amount) && amount > 0) {
      if (current.campaign.budgetType === "lifetime") patch.lifetimeBudget = amount;
      else patch.dailyBudget = amount;
    }
  }
  return Object.keys(patch).length ? patch : null;
}

export function buildAdSetUpdateFromDiff(
  adSet: AdSetDraft,
  campaign: AdsManagerState["campaign"],
  changes: AdsManagerChange[]
): Record<string, unknown> | null {
  const relevant = changes.filter((row) => row.entity === "adset" && row.entityId === adSet.id);
  if (!relevant.length) return null;
  const payload: Record<string, unknown> = {};
  if (relevant.some((row) => row.labelKey === "changeAdSetName")) payload.name = adSet.name.trim();
  if (
    relevant.some((row) =>
      ["changeAge", "changeLocations", "changeGender"].includes(row.labelKey)
    )
  ) {
    payload.locations = adSet.locations;
    payload.ageMin = adSet.ageMin;
    payload.ageMax = adSet.ageMax;
    payload.genders = gendersForMeta(adSet.gender);
    payload.interests = adSet.interests;
    payload.advantageAudience = adSet.advantageAudience;
  }
  if (relevant.some((row) => row.labelKey === "changeSchedule")) {
    payload.startTime = combineDateTime(adSet.startDate, adSet.startTime);
    if (adSet.endDateEnabled) payload.endTime = combineDateTime(adSet.endDate, adSet.endTime);
  }
  if (
    campaign.budgetStrategy === "adset" &&
    relevant.some((row) => row.labelKey === "changeAdSetBudget")
  ) {
    if (adSet.dailyBudget) payload.dailyBudget = Number(adSet.dailyBudget);
    if (adSet.lifetimeBudget) payload.lifetimeBudget = Number(adSet.lifetimeBudget);
  }
  return Object.keys(payload).length ? payload : null;
}

export function buildAdUpdateFromDiff(
  ad: AdDraft,
  changes: AdsManagerChange[]
): Record<string, unknown> | null {
  const relevant = changes.filter((row) => row.entity === "ad" && row.entityId === ad.id);
  if (!relevant.length) return null;
  const payload: Record<string, unknown> = {};
  if (relevant.some((row) => row.labelKey === "changeAdName")) payload.name = ad.name.trim();
  const creativeChanged = relevant.some((row) =>
    ["changeHeadline", "changePrimaryText", "changeCta", "changeMedia", "changeLeadForm", "changeWebsite"].includes(
      row.labelKey
    )
  );
  if (creativeChanged) {
    payload.primaryText = ad.primaryText;
    payload.headline = ad.headline;
    payload.description = ad.description;
    payload.callToAction = ad.callToAction;
    payload.link = ad.websiteUrl;
    payload.displayLink = ad.displayLink;
    payload.pageId = ad.facebookPageId;
    payload.instagramUserId = ad.instagramAccountId.startsWith("ig_")
      ? undefined
      : ad.instagramAccountId;
    payload.leadFormId = ad.instantFormId;
    payload.imageHash = ad.imageHash;
    payload.videoId = ad.videoId;
  }
  return Object.keys(payload).length ? payload : null;
}
