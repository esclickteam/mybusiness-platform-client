import type {
  MetaCampaign,
  MetaCampaignAd,
  MetaCampaignAdSet,
  MetaLocationTarget,
} from "../../../../../api/metaCampaignsApi";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import { isCampaignObjective } from "./adsManagerFromAiProposal";
import type {
  AdDraft,
  AdsManagerGender,
  AdsManagerLocation,
  AdsManagerState,
  AdSetDraft,
  CampaignDraft,
  CampaignObjective,
} from "./adsManagerTypes";

function splitDateTime(value?: string | null): { date: string; time: string } {
  if (!value) return { date: "", time: "" };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    const raw = String(value);
    return {
      date: raw.slice(0, 10),
      time: raw.slice(11, 16) || "09:00",
    };
  }
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toISOString().slice(11, 16),
  };
}

function genderFromMeta(
  adSet: MetaCampaignAdSet,
  campaign: MetaCampaign
): AdsManagerGender {
  const genders = adSet.genders?.length ? adSet.genders : campaign.genders;
  if (genders?.length === 1 && genders[0] === 1) return "male";
  if (genders?.length === 1 && genders[0] === 2) return "female";
  if (adSet.gender === "1" || campaign.gender === "1") return "male";
  if (adSet.gender === "2" || campaign.gender === "2") return "female";
  return "all";
}

function locationsFromMeta(
  adSet: MetaCampaignAdSet,
  campaign: MetaCampaign
): AdsManagerLocation[] {
  const source: MetaLocationTarget[] =
    adSet.locations?.length ? adSet.locations : campaign.locations || [];
  return source.map((loc) => ({
    key: loc.key,
    name: loc.name || loc.key,
    type: loc.type || "country",
    countryCode: loc.countryCode,
    countryName: loc.countryName,
    region: loc.region,
    metaCityKey: loc.metaCityKey,
    radiusKm: loc.radiusKm ?? null,
    distanceUnit: loc.distanceUnit === "mile" ? "mile" : "kilometer",
    latitude: loc.latitude ?? null,
    longitude: loc.longitude ?? null,
    include: true,
  }));
}

function mapAdSet(
  campaign: MetaCampaign,
  adSet: MetaCampaignAdSet,
  fallback: AdSetDraft
): AdSetDraft {
  const start = splitDateTime(adSet.startTime || campaign.startTime);
  const end = splitDateTime(adSet.endTime || campaign.stopTime);
  const locations = locationsFromMeta(adSet, campaign);
  const interests = (adSet.interests?.length ? adSet.interests : campaign.interests || []).map(
    (row) => ({ id: String(row.id), name: String(row.name || row.id) })
  );
  const targetingLoaded = adSet.targetingLoaded !== false && Boolean(
    adSet.targetingRaw ||
      locations.length ||
      adSet.ageMin != null ||
      adSet.ageMax != null
  );
  const advantageAudience =
    adSet.advantageAudience != null
      ? adSet.advantageAudience
      : campaign.advantageAudience != null
        ? campaign.advantageAudience
        : null;
  const suggestionRange = Array.isArray(adSet.targetingRaw?.age_range)
    ? (adSet.targetingRaw.age_range as number[])
    : Array.isArray(campaign.targetingRaw?.age_range)
      ? (campaign.targetingRaw.age_range as number[])
      : null;
  const ageMin =
    suggestionRange?.[0] != null
      ? Number(suggestionRange[0])
      : adSet.ageMin != null
        ? Number(adSet.ageMin)
        : campaign.ageMin != null
          ? Number(campaign.ageMin)
          : null;
  const ageMax =
    suggestionRange?.[1] != null
      ? Number(suggestionRange[1])
      : adSet.ageMax != null
        ? Number(adSet.ageMax)
        : campaign.ageMax != null
          ? Number(campaign.ageMax)
          : null;
  return {
    ...fallback,
    id: adSet.id,
    name: adSet.name || fallback.name,
    status: adSet.status || fallback.status,
    facebookPageId: adSet.pageId || campaign.pageId || "",
    facebookPageName: fallback.facebookPageName,
    locationsSummary: locations.map((loc) => loc.name).join(", "),
    locations,
    ageMin: Number.isFinite(ageMin as number) ? (ageMin as number) : null,
    ageMax: Number.isFinite(ageMax as number) ? (ageMax as number) : null,
    gender: genderFromMeta(adSet, campaign),
    interests,
    customAudiences: (adSet.customAudiences || []).map((row) => ({
      id: String(row.id),
      name: String(row.name || row.id),
    })),
    excludedAudiences: (adSet.excludedAudiences || []).map((row) => ({
      id: String(row.id),
      name: String(row.name || row.id),
    })),
    optimizationGoal: adSet.optimizationGoal || "",
    billingEvent: adSet.billingEvent || "",
    dailyBudget: adSet.dailyBudget ? String(adSet.dailyBudget) : "",
    lifetimeBudget: adSet.lifetimeBudget ? String(adSet.lifetimeBudget) : "",
    advantageAudience: advantageAudience === true,
    advantagePlacements:
      adSet.placementMode === "advantage" ||
      !(adSet.publisherPlatforms || campaign.publisherPlatforms || []).length,
    targetingLoaded,
    targetingRaw: adSet.targetingRaw || null,
    recoveredDraft: adSet.recoveredDraft === true,
    recoveredPublishId: adSet.recoveredPublishId || "",
    startDate: start.date || "",
    startTime: start.time || "",
    endDateEnabled: Boolean(end.date),
    endDate: end.date,
    endTime: end.time || "",
    conversionLocation:
      campaign.leadFormId || campaign.formId
        ? "Instant forms"
        : fallback.conversionLocation,
    showMoreAudience: true,
    showMorePlacements: true,
    ageExpanded: true,
    locationsExpanded: true,
    suggestAudience: advantageAudience !== false,
    furtherLimitReach: advantageAudience === false,
  };
}

function mapAd(
  campaign: MetaCampaign,
  ad: MetaCampaignAd,
  adSet: MetaCampaignAdSet | undefined,
  fallback: AdDraft
): AdDraft {
  const isVideo =
    Boolean(ad.videoId) ||
    campaign.creativeFormat === "video" ||
    fallback.creativeFormat === "video";
  return {
    ...fallback,
    id: ad.id,
    adSetId: ad.adSetId || adSet?.id || fallback.adSetId,
    name: ad.name || fallback.name,
    status: ad.status || fallback.status,
    creativeId: ad.creativeId || campaign.creativeId || "",
    facebookPageId: ad.pageId || adSet?.pageId || campaign.pageId || fallback.facebookPageId,
    instagramAccountId: ad.instagramUserId || campaign.instagramUserId || "",
    websiteUrl: ad.link || campaign.link || "",
    displayLink: ad.displayLink || campaign.displayLink || "",
    instantFormId: ad.leadFormId || ad.formId || campaign.leadFormId || campaign.formId || "",
    primaryText: ad.primaryText || campaign.primaryText || "",
    headline: ad.headline || campaign.headline || "",
    description: ad.description || campaign.description || "",
    callToAction: ad.callToAction || campaign.callToAction || fallback.callToAction,
    imageHash: ad.imageHash || campaign.imageHash || "",
    imagePreviewUrl: ad.imageUrl || campaign.imageUrl || campaign.picture || "",
    videoId: ad.videoId || campaign.videoId || "",
    creativeFormat: isVideo ? "video" : "image",
    mediaLabel: ad.imageHash || ad.videoId ? "Current media" : fallback.mediaLabel,
  };
}

export function adsManagerStateFromMetaCampaign(
  campaign: MetaCampaign,
  options?: { currency?: string }
): AdsManagerState {
  const base = createDefaultAdsManagerState();
  const objective: CampaignObjective = isCampaignObjective(campaign.objective)
    ? campaign.objective
    : "OUTCOME_LEADS";
  const hasCampaignBudget = Boolean(campaign.dailyBudget || campaign.lifetimeBudget);
  const budgetAmount = hasCampaignBudget
    ? String(campaign.dailyBudget || campaign.lifetimeBudget)
    : campaign.adSets?.[0]?.dailyBudget
      ? String(campaign.adSets[0].dailyBudget)
      : base.campaign.budgetAmount;
  const campaignDraft: CampaignDraft = {
    ...base.campaign,
    id: campaign.id,
    name: campaign.name || base.campaign.name,
    objective,
    status: campaign.status || "PAUSED",
    buyingType: String(campaign.buyingType || "").toUpperCase() === "RESERVED" ? "reserved" : "auction",
    budgetStrategy: hasCampaignBudget ? "campaign" : "adset",
    budgetType: campaign.lifetimeBudget && !campaign.dailyBudget ? "lifetime" : "daily",
    budgetAmount,
    currency: options?.currency || base.campaign.currency,
    advantagePlusLeads: objective === "OUTCOME_LEADS",
  };

  const sourceAdSets =
    campaign.adSets && campaign.adSets.length
      ? campaign.adSets
      : [
          {
            id: campaign.adSetId || `${campaign.id}-adset`,
            name: `${campaign.name} — Ad set`,
            status: campaign.status,
            dailyBudget: hasCampaignBudget ? undefined : campaign.dailyBudget,
            lifetimeBudget: hasCampaignBudget ? undefined : campaign.lifetimeBudget,
            startTime: campaign.startTime,
            endTime: campaign.stopTime,
            locations: campaign.locations,
            interests: campaign.interests,
            ageMin: campaign.ageMin,
            ageMax: campaign.ageMax,
            genders: campaign.genders,
            advantageAudience: campaign.advantageAudience,
            pageId: campaign.pageId,
            publisherPlatforms: campaign.publisherPlatforms,
            facebookPositions: campaign.facebookPositions,
            instagramPositions: campaign.instagramPositions,
            placementMode: campaign.placementMode,
          } as MetaCampaignAdSet,
        ];

  const adSets = sourceAdSets.map((adSet, index) =>
    mapAdSet(campaign, adSet, { ...base.adSets[0], id: `adset_${index + 1}` })
  );

  const sourceAds: MetaCampaignAd[] =
    campaign.ads && campaign.ads.length
      ? campaign.ads
      : (sourceAdSets.flatMap((row) => row.ads || []) as MetaCampaignAd[]);
  const ads =
    sourceAds.length > 0
      ? sourceAds.map((ad, index) => {
          const adSet = adSets.find((row) => row.id === ad.adSetId) || adSets[0];
          return mapAd(campaign, ad, sourceAdSets.find((row) => row.id === ad.adSetId) || sourceAdSets[0], {
            ...base.ads[0],
            id: `ad_${index + 1}`,
            adSetId: adSet?.id || adSets[0].id,
          });
        })
      : [
          mapAd(
            campaign,
            {
              id: campaign.adId || `${campaign.id}-ad`,
              name: `${campaign.name} — Ad`,
              adSetId: adSets[0].id,
              headline: campaign.headline,
              primaryText: campaign.primaryText,
              description: campaign.description,
              imageUrl: campaign.imageUrl,
              imageHash: campaign.imageHash,
              videoId: campaign.videoId,
              creativeId: campaign.creativeId,
              leadFormId: campaign.leadFormId,
              formId: campaign.formId,
              link: campaign.link,
              displayLink: campaign.displayLink,
              callToAction: campaign.callToAction,
              pageId: campaign.pageId,
              instagramUserId: campaign.instagramUserId,
              status: campaign.status,
            },
            sourceAdSets[0],
            { ...base.ads[0], adSetId: adSets[0].id }
          ),
        ];

  return {
    ...base,
    sessionMode: "edit",
    mode: "edit",
    selectedLevel: "campaign",
    selectedId: campaignDraft.id,
    saveStatus: "saved",
    lastSavedAt: new Date().toISOString(),
    campaign: campaignDraft,
    adSets,
    ads,
    audienceEstimate: { lower: 0, upper: 0, spectrum: 0.5, ready: false },
  };
}
