import type { AdDraft, AdsManagerLevel, AdsManagerState, AdSetDraft, CampaignDraft } from "./adsManagerTypes";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";

export type EditorDraftAd = {
  id?: string;
  name?: string;
  instantFormId?: string;
  instantFormName?: string;
  formPageId?: string;
  facebookPageId?: string;
  facebookPageName?: string;
  instagramAccountId?: string;
  primaryText?: string;
  headline?: string;
  description?: string;
  callToAction?: string;
  websiteUrl?: string;
  displayLink?: string;
  imageHash?: string;
  imagePreviewUrl?: string;
  videoId?: string;
  creativeFormat?: string;
  mediaLabel?: string;
};

export type EditorWorkspace = {
  campaign?: CampaignDraft | null;
  adSets?: AdSetDraft[];
  ads?: AdDraft[];
  selectedLevel?: string;
  selectedId?: string;
};

export type EditorDraft = {
  savedAt?: string;
  revision?: number;
  hasUnpublishedChanges?: boolean;
  ads?: EditorDraftAd[];
  ad?: EditorDraftAd;
  workspace?: EditorWorkspace | null;
  publishedSnapshot?: EditorWorkspace | null;
  metaBaseline?: EditorWorkspace | null;
};

export function isRealMetaObjectId(id: string | undefined | null): boolean {
  return /^\d{8,}$/.test(String(id || "").trim());
}

function text(value: unknown): string {
  return String(value ?? "").trim();
}

export function workspaceFromState(state: AdsManagerState): EditorWorkspace {
  const ads = state.ads.map((ad) => {
    const preview = text(ad.imagePreviewUrl);
    const instagram = text(ad.instagramAccountId);
    return {
      ...ad,
      imagePreviewUrl: preview.startsWith("blob:") ? "" : preview,
      instagramAccountId: instagram.startsWith("ig_") ? "" : instagram,
    };
  });
  return {
    campaign: state.campaign,
    adSets: state.adSets,
    ads,
    selectedLevel: state.selectedLevel,
    selectedId: state.selectedId,
  };
}

export function buildEditorDraft(state: AdsManagerState): EditorDraft {
  const workspace = workspaceFromState(state);
  return {
    workspace,
    ads: workspace.ads?.map((ad) => {
      const preview = text(ad.imagePreviewUrl);
      const instagram = text(ad.instagramAccountId);
      return {
        id: ad.id,
        name: ad.name,
        instantFormId: text(ad.instantFormId),
        instantFormName: text(ad.instantFormName),
        formPageId: text(ad.formPageId || ad.facebookPageId),
        facebookPageId: text(ad.facebookPageId),
        facebookPageName: text(ad.facebookPageName),
        instagramAccountId: instagram.startsWith("ig_") ? "" : instagram,
        primaryText: ad.primaryText,
        headline: ad.headline,
        description: ad.description,
        callToAction: ad.callToAction,
        websiteUrl: ad.websiteUrl,
        displayLink: ad.displayLink,
        imageHash: text(ad.imageHash),
        imagePreviewUrl: preview.startsWith("blob:") ? "" : preview,
        videoId: text(ad.videoId),
        creativeFormat: ad.creativeFormat,
        mediaLabel: ad.mediaLabel,
      };
    }),
  };
}

export function editorDraftHasUnstoredImage(state: AdsManagerState): boolean {
  return state.ads.some((ad) => {
    const preview = text(ad.imagePreviewUrl);
    return preview.startsWith("blob:") && !text(ad.imageHash) && !text(ad.videoId);
  });
}

function preferSaved(savedValue: unknown, currentValue: string): string {
  const saved = text(savedValue);
  return saved || currentValue || "";
}

function mergeAd(
  ad: AdDraft,
  saved: EditorDraftAd,
  creativeOnMeta: boolean
): AdDraft {
  const metaFormId = text(ad.instantFormId);
  const draftFormId = text(saved.instantFormId);
  const linked =
    creativeOnMeta && Boolean(draftFormId) && draftFormId === metaFormId;
  const preview = preferSaved(saved.imagePreviewUrl, ad.imagePreviewUrl);
  return {
    ...ad,
    name: preferSaved(saved.name, ad.name),
    instantFormId: preferSaved(saved.instantFormId, ad.instantFormId),
    instantFormName: preferSaved(saved.instantFormName, ad.instantFormName || ""),
    formPageId: preferSaved(saved.formPageId, ad.formPageId || ""),
    formLinkedOnMeta: linked,
    facebookPageId: preferSaved(saved.facebookPageId, ad.facebookPageId),
    facebookPageName: preferSaved(saved.facebookPageName, ad.facebookPageName),
    instagramAccountId: preferSaved(saved.instagramAccountId, ad.instagramAccountId),
    primaryText: preferSaved(saved.primaryText, ad.primaryText),
    headline: preferSaved(saved.headline, ad.headline),
    description: preferSaved(saved.description, ad.description),
    callToAction: preferSaved(saved.callToAction, ad.callToAction) || ad.callToAction,
    websiteUrl: preferSaved(saved.websiteUrl, ad.websiteUrl),
    displayLink: preferSaved(saved.displayLink, ad.displayLink),
    imageHash: preferSaved(saved.imageHash, ad.imageHash),
    imagePreviewUrl: preview.startsWith("blob:") ? ad.imagePreviewUrl : preview,
    videoId: preferSaved(saved.videoId, ad.videoId),
    creativeFormat:
      text(saved.videoId) || text(ad.videoId) ? "video" : ad.creativeFormat,
    mediaLabel: preferSaved(saved.mediaLabel, ad.mediaLabel),
  };
}

function asLevel(value: string | undefined): AdsManagerLevel {
  if (value === "adset" || value === "ad") return value;
  return "campaign";
}

export function stateFromSavedDraft(
  draft: EditorDraft | null | undefined,
  options?: {
    currency?: string;
    publishRecordId?: string;
    sessionMode?: AdsManagerState["sessionMode"];
  }
): AdsManagerState {
  const base = createDefaultAdsManagerState();
  const workspace = draft?.workspace;
  const publishRecordId = options?.publishRecordId || "";
  if (!workspace?.campaign) {
    return applyEditorDraft(
      { ...base, sessionMode: options?.sessionMode || "edit" },
      draft,
      { publishRecordId }
    );
  }
  const campaign = {
    ...base.campaign,
    ...workspace.campaign,
    currency: workspace.campaign.currency || options?.currency || base.campaign.currency,
  };
  const adSets = workspace.adSets?.length
    ? workspace.adSets.map((row) => ({ ...base.adSets[0], ...row }))
    : base.adSets;
  const ads = workspace.ads?.length
    ? workspace.ads.map((row) => ({ ...base.ads[0], ...row }))
    : base.ads;
  const selectedLevel = asLevel(workspace.selectedLevel);
  return {
    ...base,
    sessionMode: options?.sessionMode || "edit",
    mode: "edit",
    selectedLevel,
    selectedId: workspace.selectedId || campaign.id,
    saveStatus: "saved",
    lastSavedAt: draft?.savedAt || new Date().toISOString(),
    publishRecordId,
    draftRevision: Number(draft?.revision || 0) || undefined,
    hasUnpublishedChanges: Boolean(draft?.hasUnpublishedChanges),
    campaign,
    adSets,
    ads,
  };
}

export function applyEditorDraft(
  state: AdsManagerState,
  draft: EditorDraft | null | undefined,
  options?: { creativeOnMeta?: boolean; publishRecordId?: string }
): AdsManagerState {
  if (draft?.workspace?.campaign) {
    return stateFromSavedDraft(draft, {
      currency: state.campaign.currency,
      publishRecordId: options?.publishRecordId || state.publishRecordId,
      sessionMode: state.sessionMode,
    });
  }
  const savedAds = Array.isArray(draft?.ads)
    ? draft.ads
    : draft?.ad
      ? [draft.ad]
      : [];
  const publishRecordId = options?.publishRecordId || state.publishRecordId;
  if (!savedAds.length) {
    return publishRecordId ? { ...state, publishRecordId } : state;
  }
  const ads = state.ads.map((ad, index) => {
    const saved =
      savedAds.find((row) => row?.id && row.id === ad.id) || savedAds[index];
    if (!saved) return ad;
    const creativeOnMeta = Boolean(
      options?.creativeOnMeta || isRealMetaObjectId(ad.creativeId)
    );
    return mergeAd(ad, saved, creativeOnMeta);
  });
  return {
    ...state,
    ads,
    ...(publishRecordId ? { publishRecordId } : {}),
  };
}
