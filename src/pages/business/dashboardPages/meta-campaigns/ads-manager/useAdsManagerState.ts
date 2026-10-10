import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { isGuidedDemoActive } from "@/guidedDemo/sessionStore";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import { applyGuidedDemoCampaignDraft } from "./guidedDemoAdsDraft";
import {
  adsManagerStateFromAiProposal,
  type AiProposalHandoff,
} from "./adsManagerFromAiProposal";
import type {
  AdDraft,
  AdsManagerLevel,
  AdsManagerMode,
  AdsManagerState,
  AdsManagerTreeNode,
  AdSetDraft,
  BuyingType,
  CampaignDraft,
  CampaignObjective,
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
  const usesInstantForms = String(adSet?.conversionLocation || "")
    .toLowerCase()
    .includes("instant");
  const hasLocations = Boolean(
    adSet?.locations?.length || adSet?.locationsSummary?.trim()
  );
  const adset: ValidationSeverity = !adSet?.name.trim()
    ? "error"
    : usesInstantForms && !adSet.facebookPageId
      ? "error"
      : !hasLocations
        ? "warning"
        : "none";

  const ad = state.ads[0];
  const pageId = ad?.facebookPageId || adSet?.facebookPageId;
  let adSeverity: ValidationSeverity = "none";
  if (!ad?.name.trim() || !pageId || pageId === "page_1") adSeverity = "error";
  else if (
    state.campaign.objective === "OUTCOME_LEADS" &&
    usesInstantForms &&
    !ad.instantFormId
  ) {
    adSeverity = "error";
  } else if (!ad.websiteUrl.trim() && !ad.instantFormId) {
    adSeverity = "warning";
  }

  return { campaign, adset, ad: adSeverity };
}

export function useAdsManagerState(initialHandoff?: AiProposalHandoff | null) {
  const { t } = useTranslation();
  const [state, setState] = useState<AdsManagerState>(() =>
    initialHandoff?.proposal
      ? adsManagerStateFromAiProposal(initialHandoff)
      : createDefaultAdsManagerState()
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markDirty = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setState((prev) =>
      prev.saveStatus === "unsaved" ? prev : { ...prev, saveStatus: "unsaved" }
    );
  }, []);

  const markServerSaved = useCallback((publishRecordId?: string) => {
    setState((prev) => ({
      ...prev,
      saveStatus: "saved",
      lastSavedAt: new Date().toISOString(),
      ...(publishRecordId ? { publishRecordId } : {}),
    }));
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
      name: state.campaign.name || t("metaCampaigns.adsManager.campaignNames.fallback"),
      parentId: null,
      validation: validation.campaign,
    };
    const adSetNodes = state.adSets.map((adSet) => ({
      id: adSet.id,
      level: "adset" as const,
      name: adSet.name || t("metaCampaigns.adsManager.adSetSuffix"),
      parentId: state.campaign.id,
      validation: validation.adset,
    }));
    const adNodes = state.ads.map((ad) => ({
      id: ad.id,
      level: "ad" as const,
      name: ad.name || t("metaCampaigns.adsManager.adSuffix"),
      parentId: ad.adSetId || state.adSets[0]?.id || null,
      validation: validation.ad,
    }));
    return [campaignNode, ...adSetNodes, ...adNodes];
  }, [state, validation, t]);

  const selectedAdSet = useMemo(() => {
    if (state.selectedLevel === "adset") {
      return state.adSets.find((row) => row.id === state.selectedId) || state.adSets[0];
    }
    if (state.selectedLevel === "ad") {
      const ad = state.ads.find((row) => row.id === state.selectedId);
      return (
        state.adSets.find((row) => row.id === ad?.adSetId) || state.adSets[0]
      );
    }
    return state.adSets[0];
  }, [state.adSets, state.ads, state.selectedId, state.selectedLevel]);

  const selectedAd = useMemo(() => {
    if (state.selectedLevel === "ad") {
      return state.ads.find((row) => row.id === state.selectedId) || state.ads[0];
    }
    return (
      state.ads.find((row) => row.adSetId === selectedAdSet?.id) || state.ads[0]
    );
  }, [selectedAdSet?.id, state.ads, state.selectedId, state.selectedLevel]);

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

  const replaceState = useCallback((next: AdsManagerState) => {
    setState(deepCloneState(next));
  }, []);

  const applyCreateChoice = useCallback(
    (choice: { buyingType: BuyingType; objective: CampaignObjective }) => {
      const campaignName = t(
        `metaCampaigns.adsManager.campaignNames.${choice.objective}`
      );
      const adSetName = `${campaignName} — ${t("metaCampaigns.adsManager.adSetSuffix")}`;
      const adName = `${campaignName} — ${t("metaCampaigns.adsManager.adSuffix")}`;
      const isLeads = choice.objective === "OUTCOME_LEADS";

      setState((prev) => {
        const adSetId = prev.adSets[0]?.id || "adset_1";
        const adId = prev.ads[0]?.id || "ad_1";
        const next: AdsManagerState = {
          ...prev,
          selectedLevel: "campaign",
          selectedId: prev.campaign.id,
          mode: "edit",
          campaign: {
            ...prev.campaign,
            name: campaignName,
            buyingType: choice.buyingType,
            objective: choice.objective,
            advantagePlusLeads: isLeads,
          },
          adSets: prev.adSets.map((row, index) =>
            index === 0
              ? {
                  ...row,
                  id: adSetId,
                  name: adSetName,
                  conversionLocation: isLeads
                    ? "Instant forms"
                    : "Website",
                  performanceGoal: isLeads
                    ? "Maximize number of leads"
                    : "Maximize number of conversions",
                }
              : row
          ),
          ads: prev.ads.map((row, index) =>
            index === 0
              ? {
                  ...row,
                  id: adId,
                  adSetId: adSetId,
                  name: adName,
                  callToAction: isLeads ? "SIGN_UP" : "LEARN_MORE",
                  instantFormId: isLeads ? row.instantFormId : "",
                }
              : row
          ),
          saveStatus: "unsaved",
          lastSavedAt: null,
        };
        return isGuidedDemoActive() ? applyGuidedDemoCampaignDraft(next) : next;
      });
    },
    [t]
  );

  const setAudienceEstimate = useCallback(
    (audienceEstimate: AdsManagerState["audienceEstimate"]) => {
      setState((prev) => ({ ...prev, audienceEstimate }));
    },
    []
  );

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
    setAudienceEstimate,
    renameSelected,
    resetDraft,
    replaceState,
    applyCreateChoice,
    markServerSaved,
    canPublish,
  };
}

export type AdsManagerController = ReturnType<typeof useAdsManagerState>;
