import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import type {
  AdDraft,
  AdsManagerLevel,
  AdsManagerMode,
  AdsManagerState,
  AdsManagerTreeNode,
  AdSetDraft,
  CampaignDraft,
  ValidationSeverity,
} from "./adsManagerTypes";

function deepCloneState(state: AdsManagerState): AdsManagerState {
  return JSON.parse(JSON.stringify(state)) as AdsManagerState;
}

export function getLevelValidation(state: AdsManagerState): {
  campaign: ValidationSeverity;
  adset: ValidationSeverity;
  ad: ValidationSeverity;
} {
  const campaign: ValidationSeverity = !state.campaign.name.trim()
    ? "error"
    : !state.campaign.budgetAmount
      ? "warning"
      : "none";

  const adSet = state.adSets[0];
  const adset: ValidationSeverity = !adSet?.name.trim()
    ? "error"
    : !adSet.locationsSummary.trim()
      ? "warning"
      : "none";

  const ad = state.ads[0];
  let adSeverity: ValidationSeverity = "none";
  if (!ad?.name.trim() || !ad.facebookPageId) adSeverity = "error";
  else if (
    state.campaign.objective === "OUTCOME_LEADS" &&
    adSet?.conversionLocation === "Instant forms" &&
    !ad.instantFormId
  ) {
    adSeverity = "error";
  } else if (!ad.websiteUrl.trim()) {
    adSeverity = "warning";
  }

  return { campaign, adset, ad: adSeverity };
}

export function useAdsManagerState() {
  const [state, setState] = useState<AdsManagerState>(() =>
    createDefaultAdsManagerState()
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markDirty = useCallback(() => {
    setState((prev) => ({ ...prev, saveStatus: "saving" }));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        saveStatus: "saved",
        lastSavedAt: new Date().toISOString(),
      }));
    }, 650);
  }, []);

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    []
  );

  const validation = useMemo(() => getLevelValidation(state), [state]);

  const tree: AdsManagerTreeNode[] = useMemo(() => {
    const campaignNode: AdsManagerTreeNode = {
      id: state.campaign.id,
      level: "campaign",
      name: state.campaign.name || "Untitled campaign",
      parentId: null,
      validation: validation.campaign,
    };
    const adSetNodes = state.adSets.map((adSet) => ({
      id: adSet.id,
      level: "adset" as const,
      name: adSet.name || "Untitled ad set",
      parentId: state.campaign.id,
      validation: validation.adset,
    }));
    const adNodes = state.ads.map((ad) => ({
      id: ad.id,
      level: "ad" as const,
      name: ad.name || "Untitled ad",
      parentId: state.adSets[0]?.id || null,
      validation: validation.ad,
    }));
    return [campaignNode, ...adSetNodes, ...adNodes];
  }, [state, validation]);

  const selectedAdSet = state.adSets[0];
  const selectedAd = state.ads[0];

  const selectNode = useCallback((level: AdsManagerLevel, id: string) => {
    setState((prev) => ({ ...prev, selectedLevel: level, selectedId: id }));
  }, []);

  const setMode = useCallback((mode: AdsManagerMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const patchCampaign = useCallback(
    (patch: Partial<CampaignDraft>) => {
      setState((prev) => ({
        ...prev,
        campaign: { ...prev.campaign, ...patch },
      }));
      markDirty();
    },
    [markDirty]
  );

  const patchAdSet = useCallback(
    (id: string, patch: Partial<AdSetDraft>) => {
      setState((prev) => ({
        ...prev,
        adSets: prev.adSets.map((row) =>
          row.id === id ? { ...row, ...patch } : row
        ),
      }));
      markDirty();
    },
    [markDirty]
  );

  const patchAd = useCallback(
    (id: string, patch: Partial<AdDraft>) => {
      setState((prev) => ({
        ...prev,
        ads: prev.ads.map((row) =>
          row.id === id ? { ...row, ...patch } : row
        ),
      }));
      markDirty();
    },
    [markDirty]
  );

  const renameSelected = useCallback(
    (name: string) => {
      if (state.selectedLevel === "campaign") patchCampaign({ name });
      else if (state.selectedLevel === "adset" && selectedAdSet) {
        patchAdSet(selectedAdSet.id, { name });
      } else if (state.selectedLevel === "ad" && selectedAd) {
        patchAd(selectedAd.id, { name });
      }
    },
    [
      state.selectedLevel,
      patchCampaign,
      patchAdSet,
      patchAd,
      selectedAdSet,
      selectedAd,
    ]
  );

  const resetDraft = useCallback(() => {
    setState(deepCloneState(createDefaultAdsManagerState()));
  }, []);

  const canPublish =
    validation.campaign !== "error" &&
    validation.adset !== "error" &&
    validation.ad !== "error";

  return {
    state,
    tree,
    validation,
    selectedAdSet,
    selectedAd,
    selectNode,
    setMode,
    patchCampaign,
    patchAdSet,
    patchAd,
    renameSelected,
    resetDraft,
    canPublish,
  };
}

export type AdsManagerController = ReturnType<typeof useAdsManagerState>;
