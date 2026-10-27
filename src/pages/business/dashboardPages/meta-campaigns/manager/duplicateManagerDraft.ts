import type { AdsManagerState } from "../ads-manager/adsManagerTypes";

export type DuplicateScope = {
  level: "campaign" | "adset" | "ad";
  id: string;
};

function localId(prefix: string, index: number) {
  return `${prefix}_${index + 1}`;
}

/**
 * Copy editor state into a new local draft.
 * Meta object ids are cleared so publish cannot update the source campaign.
 */
export function duplicateManagerDraft(state: AdsManagerState, scope: DuplicateScope): AdsManagerState {
  let adSets = state.adSets;
  let ads = state.ads;
  if (scope.level === "adset") {
    adSets = state.adSets.filter((row) => row.id === scope.id);
    const ids = new Set(adSets.map((row) => row.id));
    ads = state.ads.filter((ad) => ids.has(ad.adSetId));
  } else if (scope.level === "ad") {
    ads = state.ads.filter((ad) => ad.id === scope.id);
    const setIds = new Set(ads.map((ad) => ad.adSetId));
    adSets = state.adSets.filter((row) => setIds.has(row.id));
  }
  if (scope.level !== "campaign" && (!adSets.length || !ads.length)) {
    adSets = state.adSets;
    ads = state.ads;
  }

  const setIds = new Map<string, string>();
  const nextSets = adSets.map((row, index) => {
    const id = localId("adset", index);
    setIds.set(row.id, id);
    return { ...row, id, status: "DRAFT" };
  });
  const nextAds = ads.map((ad, index) => ({
    ...ad,
    id: localId("ad", index),
    adSetId: setIds.get(ad.adSetId) || nextSets[0]?.id || "adset_1",
    status: "DRAFT",
    creativeId: "",
    formLinkedOnMeta: false,
  }));

  return {
    ...state,
    sessionMode: "create",
    mode: "edit",
    publishRecordId: undefined,
    draftRevision: undefined,
    hasUnpublishedChanges: false,
    metaObjectIds: { campaignId: "", adSetId: "", adId: "", creativeId: "" },
    campaign: {
      ...state.campaign,
      id: "campaign_copy",
      name: `${state.campaign.name} (עותק)`,
      status: "DRAFT",
    },
    adSets: nextSets.length ? nextSets : state.adSets.map((row, index) => ({ ...row, id: localId("adset", index), status: "DRAFT" })),
    ads: nextAds,
    selectedLevel: scope.level,
    selectedId:
      scope.level === "ad"
        ? nextAds[0]?.id || "ad_1"
        : scope.level === "adset"
          ? nextSets[0]?.id || "adset_1"
          : "campaign_copy",
    saveStatus: "unsaved",
  };
}

export function draftContainsMetaObjectId(state: AdsManagerState): boolean {
  const blob = JSON.stringify({
    campaignId: state.campaign.id,
    adSets: state.adSets.map((row) => row.id),
    ads: state.ads.map((ad) => ({ id: ad.id, creativeId: ad.creativeId })),
    meta: state.metaObjectIds,
    publishRecordId: state.publishRecordId,
  });
  return /\d{8,}/.test(blob);
}
