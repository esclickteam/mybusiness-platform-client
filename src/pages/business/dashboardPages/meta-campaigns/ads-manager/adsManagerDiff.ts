import type { AdsManagerState } from "./adsManagerTypes";

export type AdsManagerChange = {
  id: string;
  labelKey: string;
  oldValue: string;
  newValue: string;
  spendImpact: boolean;
  entity: "campaign" | "adset" | "ad";
  entityId: string;
};

function text(value: unknown): string {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object" && item
          ? String((item as { name?: string }).name || (item as { key?: string }).key || JSON.stringify(item))
          : String(item)
      )
      .join(", ");
  }
  return String(value);
}

function pushChange(
  out: AdsManagerChange[],
  change: Omit<AdsManagerChange, "id">
) {
  if (change.oldValue === change.newValue) return;
  out.push({ ...change, id: `${change.entity}:${change.entityId}:${change.labelKey}` });
}

export function snapshotAdsManager(state: AdsManagerState) {
  return {
    campaign: {
      name: state.campaign.name.trim(),
      budgetStrategy: state.campaign.budgetStrategy,
      budgetType: state.campaign.budgetType,
      budgetAmount: String(state.campaign.budgetAmount || "").trim(),
      bidStrategy: state.campaign.bidStrategy,
    },
    adSets: state.adSets.map((adSet) => ({
      id: adSet.id,
      name: adSet.name.trim(),
      locations: (adSet.locations || [])
        .filter((loc) => loc.include !== false)
        .map((loc) => loc.name || loc.key)
        .join(", "),
      ageMin: adSet.ageMin,
      ageMax: adSet.ageMax,
      gender: adSet.gender,
      advantageAudience: adSet.advantageAudience,
      startDate: adSet.startDate,
      startTime: adSet.startTime,
      endDateEnabled: adSet.endDateEnabled,
      endDate: adSet.endDate,
      endTime: adSet.endTime,
      dailyBudget: adSet.dailyBudget,
      lifetimeBudget: adSet.lifetimeBudget,
      interests: (adSet.interests || []).map((row) => row.name || row.id).join(", "),
    })),
    ads: state.ads.map((ad) => ({
      id: ad.id,
      adSetId: ad.adSetId,
      name: ad.name.trim(),
      primaryText: ad.primaryText.trim(),
      headline: ad.headline.trim(),
      description: ad.description.trim(),
      callToAction: ad.callToAction,
      websiteUrl: ad.websiteUrl.trim(),
      displayLink: ad.displayLink.trim(),
      instantFormId: ad.instantFormId,
      facebookPageId: ad.facebookPageId,
      instagramAccountId: ad.instagramAccountId,
      imageHash: ad.imageHash,
      videoId: ad.videoId,
      creativeFormat: ad.creativeFormat,
    })),
  };
}

export function diffAdsManagerState(
  baseline: AdsManagerState,
  current: AdsManagerState
): AdsManagerChange[] {
  const before = snapshotAdsManager(baseline);
  const after = snapshotAdsManager(current);
  const changes: AdsManagerChange[] = [];
  const campaignId = current.campaign.id;

  pushChange(changes, {
    labelKey: "changeCampaignName",
    oldValue: text(before.campaign.name),
    newValue: text(after.campaign.name),
    spendImpact: false,
    entity: "campaign",
    entityId: campaignId,
  });
  pushChange(changes, {
    labelKey: "changeBudget",
    oldValue: `${before.campaign.budgetType} ${before.campaign.budgetAmount}`,
    newValue: `${after.campaign.budgetType} ${after.campaign.budgetAmount}`,
    spendImpact: true,
    entity: "campaign",
    entityId: campaignId,
  });
  pushChange(changes, {
    labelKey: "changeBudgetStrategy",
    oldValue: text(before.campaign.budgetStrategy),
    newValue: text(after.campaign.budgetStrategy),
    spendImpact: true,
    entity: "campaign",
    entityId: campaignId,
  });

  after.adSets.forEach((adSet) => {
    const prev = before.adSets.find((row) => row.id === adSet.id);
    if (!prev) return;
    pushChange(changes, {
      labelKey: "changeAdSetName",
      oldValue: text(prev.name),
      newValue: text(adSet.name),
      spendImpact: false,
      entity: "adset",
      entityId: adSet.id,
    });
    pushChange(changes, {
      labelKey: "changeAge",
      oldValue: `${prev.ageMin}–${prev.ageMax}`,
      newValue: `${adSet.ageMin}–${adSet.ageMax}`,
      spendImpact: true,
      entity: "adset",
      entityId: adSet.id,
    });
    pushChange(changes, {
      labelKey: "changeLocations",
      oldValue: text(prev.locations),
      newValue: text(adSet.locations),
      spendImpact: true,
      entity: "adset",
      entityId: adSet.id,
    });
    pushChange(changes, {
      labelKey: "changeGender",
      oldValue: text(prev.gender),
      newValue: text(adSet.gender),
      spendImpact: true,
      entity: "adset",
      entityId: adSet.id,
    });
    pushChange(changes, {
      labelKey: "changeAdSetBudget",
      oldValue: text(prev.dailyBudget || prev.lifetimeBudget),
      newValue: text(adSet.dailyBudget || adSet.lifetimeBudget),
      spendImpact: true,
      entity: "adset",
      entityId: adSet.id,
    });
    pushChange(changes, {
      labelKey: "changeSchedule",
      oldValue: `${prev.startDate} ${prev.startTime}`,
      newValue: `${adSet.startDate} ${adSet.startTime}`,
      spendImpact: true,
      entity: "adset",
      entityId: adSet.id,
    });
  });

  after.ads.forEach((ad) => {
    const prev = before.ads.find((row) => row.id === ad.id);
    if (!prev) return;
    pushChange(changes, {
      labelKey: "changeAdName",
      oldValue: text(prev.name),
      newValue: text(ad.name),
      spendImpact: false,
      entity: "ad",
      entityId: ad.id,
    });
    pushChange(changes, {
      labelKey: "changeHeadline",
      oldValue: text(prev.headline),
      newValue: text(ad.headline),
      spendImpact: false,
      entity: "ad",
      entityId: ad.id,
    });
    pushChange(changes, {
      labelKey: "changePrimaryText",
      oldValue: text(prev.primaryText),
      newValue: text(ad.primaryText),
      spendImpact: false,
      entity: "ad",
      entityId: ad.id,
    });
    pushChange(changes, {
      labelKey: "changeCta",
      oldValue: text(prev.callToAction),
      newValue: text(ad.callToAction),
      spendImpact: false,
      entity: "ad",
      entityId: ad.id,
    });
    pushChange(changes, {
      labelKey: "changeMedia",
      oldValue: text(prev.imageHash || prev.videoId),
      newValue: text(ad.imageHash || ad.videoId),
      spendImpact: false,
      entity: "ad",
      entityId: ad.id,
    });
    pushChange(changes, {
      labelKey: "changeLeadForm",
      oldValue: text(prev.instantFormId),
      newValue: text(ad.instantFormId),
      spendImpact: false,
      entity: "ad",
      entityId: ad.id,
    });
    pushChange(changes, {
      labelKey: "changeWebsite",
      oldValue: text(prev.websiteUrl),
      newValue: text(ad.websiteUrl),
      spendImpact: false,
      entity: "ad",
      entityId: ad.id,
    });
  });

  return changes;
}

export function isAdsManagerDirty(
  baseline: AdsManagerState | null,
  current: AdsManagerState
): boolean {
  if (!baseline) return false;
  return diffAdsManagerState(baseline, current).length > 0;
}
