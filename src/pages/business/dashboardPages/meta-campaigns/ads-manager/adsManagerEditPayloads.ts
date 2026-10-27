import type { MetaCampaignPayload } from "../../../../../api/metaCampaignsApi";
import type { AdsManagerChange } from "./adsManagerDiff";
import type { AdsManagerState, AdDraft, AdSetDraft, MetaObjectIds } from "./adsManagerTypes";
import { isRealMetaObjectId } from "./editorDraft";

function gendersForMeta(gender: AdSetDraft["gender"]) {
  if (gender === "male") return [1];
  if (gender === "female") return [2];
  return [];
}

function combineDateTime(date: string, time: string) {
  if (!date) return undefined;
  return `${date}T${time || "00:00"}:00`;
}

function geoFromFormLocations(locations: AdSetDraft["locations"]) {
  const included = (locations || []).filter((loc) => loc.include !== false);
  const countries = included
    .filter((loc) => loc.type === "country")
    .map((loc) => String(loc.countryCode || loc.key || "").toUpperCase())
    .filter(Boolean);
  const regions = included
    .filter((loc) => loc.type === "region")
    .map((loc) => ({ key: loc.key, name: loc.name, country: loc.countryCode }));
  const cities = included
    .filter((loc) => loc.type === "city")
    .map((loc) => ({
      key: loc.metaCityKey || loc.key,
      name: loc.name,
      country: loc.countryCode,
      radius: loc.radiusKm ?? undefined,
      distance_unit: loc.distanceUnit === "mile" ? "mile" : "kilometer",
    }));
  return {
    ...(countries.length ? { countries } : {}),
    ...(regions.length ? { regions } : {}),
    ...(cities.length ? { cities } : {}),
  };
}

const FLEXIBLE_SPEC_KEYS = new Set([
  "interests",
  "behaviors",
  "life_events",
  "family_statuses",
  "industries",
  "income",
  "work_positions",
  "work_employers",
  "education_majors",
  "education_schools",
  "education_statuses",
  "relationship_statuses",
  "college_years",
]);

const INTEGER_FLEXIBLE_SPEC_KEYS = new Set(["college_years", "education_statuses"]);

function normalizeFlexibleKey(type: string): string {
  const raw = String(type || "interests").trim() || "interests";
  if (raw === "interest") return "interests";
  if (raw === "behavior") return "behaviors";
  return FLEXIBLE_SPEC_KEYS.has(raw) ? raw : "interests";
}

/** Rebuild Meta flexible_spec from the editor's detailed-targeting chips. */
export function flexibleSpecFromDetailedTargets(
  interests: AdSetDraft["interests"]
): Array<Record<string, Array<{ id: string; name?: string } | number>>> | null {
  const buckets: Record<string, Array<{ id: string; name?: string } | number>> =
    Object.create(null);
  for (const item of interests || []) {
    const id = String(item?.id || "").trim();
    if (!/^\d+$/.test(id)) continue;
    const key = normalizeFlexibleKey(String(item?.type || "interests"));
    if (!buckets[key]) buckets[key] = [];
    if (INTEGER_FLEXIBLE_SPEC_KEYS.has(key)) {
      const n = Number(id);
      if (!Number.isFinite(n)) continue;
      if (!buckets[key].some((row) => Number(row) === n)) {
        buckets[key].push(Math.trunc(n));
      }
      continue;
    }
    if (
      buckets[key].some(
        (row) => typeof row === "object" && row && "id" in row && row.id === id
      )
    ) {
      continue;
    }
    const entry: { id: string; name?: string } = { id };
    const name = String(item?.name || "").trim();
    if (name) entry.name = name;
    buckets[key].push(entry);
  }
  return Object.keys(buckets).length ? [buckets] : null;
}

export function mergeLoadedTargeting(
  adSet: AdSetDraft,
  changes: AdsManagerChange[]
): Record<string, unknown> {
  const targeting: Record<string, unknown> = {
    ...(adSet.targetingRaw && typeof adSet.targetingRaw === "object"
      ? adSet.targetingRaw
      : {}),
  };
  const labels = new Set(changes.map((row) => row.labelKey));
  if (labels.has("changeAge")) {
    targeting.age_range = [adSet.ageMin, adSet.ageMax];
    const automation =
      targeting.targeting_automation && typeof targeting.targeting_automation === "object"
        ? (targeting.targeting_automation as Record<string, unknown>)
        : {};
    const settings =
      automation.individual_setting && typeof automation.individual_setting === "object"
        ? (automation.individual_setting as Record<string, unknown>)
        : {};
    const ageIsSuggestion =
      settings.age === 1 ||
      settings.age === true ||
      automation.advantage_audience === 1;
    if (!ageIsSuggestion) {
      targeting.age_min = adSet.ageMin;
      if (adSet.ageMax != null && adSet.ageMax < 65) targeting.age_max = adSet.ageMax;
      else delete targeting.age_max;
      delete targeting.age_range;
    } else {
      targeting.age_range = [adSet.ageMin, adSet.ageMax];
      targeting.age_min = Math.min(18, Number(adSet.ageMin) || 18);
      targeting.age_max = 65;
    }
  }
  if (labels.has("changeGender")) {
    const genders = gendersForMeta(adSet.gender);
    if (genders.length) targeting.genders = genders;
    else delete targeting.genders;
  }
  if (labels.has("changeLocations")) {
    targeting.geo_locations = geoFromFormLocations(adSet.locations);
  }
  if (labels.has("changeDetailedTargeting")) {
    const flex = flexibleSpecFromDetailedTargets(adSet.interests);
    if (flex) targeting.flexible_spec = flex;
    else delete targeting.flexible_spec;
  }
  if (labels.has("changeAudiences")) {
    if (adSet.customAudiences?.length) {
      targeting.custom_audiences = adSet.customAudiences.map((row) => ({ id: row.id }));
    } else delete targeting.custom_audiences;
    if (adSet.excludedAudiences?.length) {
      targeting.excluded_custom_audiences = adSet.excludedAudiences.map((row) => ({
        id: row.id,
      }));
    } else delete targeting.excluded_custom_audiences;
    if (adSet.locales?.length) targeting.locales = adSet.locales;
    else delete targeting.locales;
  }
  if (labels.has("changePlacements")) {
    if (adSet.advantagePlacements) {
      delete targeting.publisher_platforms;
      delete targeting.facebook_positions;
      delete targeting.instagram_positions;
      delete targeting.messenger_positions;
      delete targeting.audience_network_positions;
      delete targeting.threads_positions;
      delete targeting.device_platforms;
    } else {
      targeting.publisher_platforms = adSet.publisherPlatforms?.length
        ? adSet.publisherPlatforms
        : ["facebook", "instagram"];
      if (adSet.facebookPositions?.length) {
        targeting.facebook_positions = adSet.facebookPositions;
      }
      if (adSet.instagramPositions?.length) {
        targeting.instagram_positions = adSet.instagramPositions;
      }
      if (adSet.messengerPositions?.length) {
        targeting.messenger_positions = adSet.messengerPositions;
      }
      if (adSet.audienceNetworkPositions?.length) {
        targeting.audience_network_positions = adSet.audienceNetworkPositions;
      }
    }
  }
  if (targeting.targeting_automation && typeof targeting.targeting_automation === "object") {
    targeting.targeting_automation = {
      ...(targeting.targeting_automation as Record<string, unknown>),
      advantage_audience: adSet.advantageAudience ? 1 : 0,
    };
  }
  return targeting;
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
  const wantsTargeting = relevant.some((row) =>
    [
      "changeAge",
      "changeLocations",
      "changeGender",
      "changeDetailedTargeting",
      "changeAudiences",
      "changePlacements",
    ].includes(row.labelKey)
  );
  const canPatchTargeting =
    Boolean(adSet.targetingRaw) ||
    (adSet.targetingLoaded &&
      (relevant.some((row) => row.labelKey === "changeDetailedTargeting") ||
        (adSet.ageMin != null && adSet.ageMax != null)));
  if (wantsTargeting && canPatchTargeting) {
    payload.targeting = mergeLoadedTargeting(adSet, relevant);
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
    [
      "changeHeadline",
      "changeDescription",
      "changePrimaryText",
      "changeCta",
      "changeMedia",
      "changeLeadForm",
      "changeWebsite",
      "changeFacebookPage",
      "changeInstagram",
    ].includes(row.labelKey)
  );
  if (creativeChanged) {
    const put = (key: string, value: string) => {
      const trimmed = String(value || "").trim();
      if (trimmed) payload[key] = trimmed;
    };
    put("primaryText", ad.primaryText);
    put("headline", ad.headline);
    put("description", ad.description);
    put("callToAction", ad.callToAction);
    put("link", ad.websiteUrl);
    put("displayLink", ad.displayLink);
    put("pageId", ad.facebookPageId);
    if (ad.instagramAccountId && !ad.instagramAccountId.startsWith("ig_")) {
      put("instagramUserId", ad.instagramAccountId);
    }
    put("leadFormId", ad.instantFormId);
    put("imageHash", ad.imageHash);
    put("videoId", ad.videoId);
  }
  return Object.keys(payload).length ? payload : null;
}

function realMetaId(value: unknown): string {
  const id = String(value ?? "").trim();
  return isRealMetaObjectId(id) ? id : "";
}

export function existingMetaIdsForPublish(
  current: AdsManagerState,
  routeId?: string
): MetaObjectIds & { publishRecordId?: string } {
  const stored = current.metaObjectIds;
  return {
    publishRecordId: current.publishRecordId || undefined,
    campaignId: realMetaId(stored?.campaignId) || realMetaId(routeId) || realMetaId(current.campaign.id),
    adSetId: realMetaId(stored?.adSetId) || realMetaId(current.adSets[0]?.id),
    adId: realMetaId(stored?.adId) || realMetaId(current.ads[0]?.id),
    creativeId: realMetaId(stored?.creativeId) || realMetaId(current.ads[0]?.creativeId),
  };
}

export function buildExistingPublishPayload(
  current: AdsManagerState,
  changes: AdsManagerChange[],
  options?: { confirmCreateAd?: boolean; routeId?: string }
) {
  const adSet = current.adSets[0];
  const ad = current.ads[0];
  const ids = existingMetaIdsForPublish(current, options?.routeId);
  const allowBudgetChange = changes.some(
    (row) => row.labelKey === "changeBudget" || row.labelKey === "changeAdSetBudget"
  );
  const leadFormChanged = changes.some((row) => row.labelKey === "changeLeadForm");
  return {
    publishRecordId: ids.publishRecordId,
    metaCampaignId: ids.campaignId || undefined,
    metaAdSetId: ids.adSetId || undefined,
    metaAdId: ids.adId || undefined,
    metaCreativeId: ids.creativeId || undefined,
    pageId: ad?.facebookPageId || adSet?.facebookPageId || undefined,
    campaign: buildCampaignUpdateFromDiff(current, changes) || undefined,
    adSet: adSet
      ? buildAdSetUpdateFromDiff(adSet, current.campaign, changes) || undefined
      : undefined,
    ad: ad ? buildAdUpdateFromDiff(ad, changes) || undefined : undefined,
    leadFormId: leadFormChanged ? ad?.instantFormId || undefined : undefined,
    allowBudgetChange,
    allowStatusChange: false,
    confirmCreateAd: options?.confirmCreateAd === true,
  };
}
