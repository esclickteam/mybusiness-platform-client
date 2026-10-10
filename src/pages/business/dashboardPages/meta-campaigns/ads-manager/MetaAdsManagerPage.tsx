import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import {
  duplicateMetaCampaign,
  estimateMetaAudienceReach,
  getMetaCampaign,
  getMetaCampaignsStatus,
  listMetaLeadForms,
  publishMetaCampaign,
  retryMetaPublish,
  syncMetaPublish,
  saveMetaEditorDraft,
  updateMetaAd,
  updateMetaAdSet,
  updateMetaCampaign,
  type MetaAdsConnectionStatus,
  type MetaCampaignPublishRecord,
  type MetaLeadForm,
} from "../../../../../api/metaCampaignsApi";
import MetaAdsManagerTree from "./MetaAdsManagerTree";
import CampaignLevelEditor from "./editors/CampaignLevelEditor";
import AdSetLevelEditor from "./editors/AdSetLevelEditor";
import AdLevelEditor from "./editors/AdLevelEditor";
import CampaignInsightsSidebar from "./sidebars/CampaignInsightsSidebar";
import AdSetInsightsSidebar from "./sidebars/AdSetInsightsSidebar";
import AdInsightsSidebar from "./sidebars/AdInsightsSidebar";
import PublishResultModal from "./PublishResultModal";
import CreateCampaignObjectiveModal from "./CreateCampaignObjectiveModal";
import {
  buildAudienceEstimatePayload,
  buildPublishPayloadFromAdsManager,
  validateAdsManagerClient,
} from "./buildPublishPayload";
import { useAdsManagerState } from "./useAdsManagerState";
import { adsManagerStateFromMetaCampaign } from "./adsManagerStateFromMetaCampaign";
import {
  diffAdsManagerState,
  isAdsManagerDirty,
} from "./adsManagerDiff";
import {
  buildAdSetUpdateFromDiff,
  buildAdUpdateFromDiff,
  buildCampaignUpdateFromDiff,
} from "./adsManagerEditPayloads";
import {
  applyEditorDraft,
  buildEditorDraft,
  editorDraftHasUnstoredImage,
  isRealMetaObjectId,
} from "./editorDraft";
import type { AdsManagerState } from "./adsManagerTypes";
import { guidedDemoInstantForm, guidedDemoPublishExtras } from "./guidedDemoAdsDraft";
import { isGuidedDemoActive, readGuidedDemoLocaleLock } from "@/guidedDemo/sessionStore";
import { getTextDirection } from "@/i18n/localeUtils";
import { formatDemoMoney } from "@/guidedDemo/demoCurrency";
import type { AiProposalHandoff } from "./adsManagerFromAiProposal";
import {
  metaBtnPrimary,
  metaBtnSecondary,
  metaPageBg,
} from "./metaAdsUi";

type OutletCtx = { businessId: string | null };

export default function MetaAdsManagerPage() {
  const { t, i18n } = useTranslation();
  const c = (key: string, opts?: Record<string, unknown>) =>
    t(`metaCampaigns.adsManager.chrome.${key}`, opts);
  const navigate = useNavigate();
  const location = useLocation();
  const { businessId } = useOutletContext<OutletCtx>();
  const { campaignId } = useParams<{ campaignId?: string }>();
  const isEditSession = Boolean(campaignId);
  const aiHandoff =
    (location.state as { aiProposal?: AiProposalHandoff } | null)?.aiProposal ||
    null;
  const ctrl = useAdsManagerState(aiHandoff);
  const {
    state,
    tree,
    selectedAdSet,
    selectedAd,
    selectNode,
    setMode,
    patchCampaign,
    patchAdSet,
    patchAd,
    setAudienceEstimate,
    applyCreateChoice,
    replaceState,
    markServerSaved,
    canPublish,
  } = ctrl;

  const [connection, setConnection] = useState<MetaAdsConnectionStatus | null>(
    null
  );
  const [leadForms, setLeadForms] = useState<MetaLeadForm[]>([]);
  const [formsLoading, setFormsLoading] = useState(false);
  const [formsError, setFormsError] = useState("");
  const [estimateLoading, setEstimateLoading] = useState(true);
  const [estimateAttempt, setEstimateAttempt] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [publishResult, setPublishResult] =
    useState<MetaCampaignPublishRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Meta-style gate: choose objective before opening the Ads Manager editor.
  const [createChooserOpen, setCreateChooserOpen] = useState(
    () => !aiHandoff?.proposal && !isEditSession
  );
  const [campaignStarted, setCampaignStarted] = useState(() =>
    Boolean(aiHandoff?.proposal || isEditSession)
  );
  const [editLoading, setEditLoading] = useState(isEditSession);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [serverAck, setServerAck] = useState(false);
  const baselineRef = useRef<AdsManagerState | null>(null);
  const publishRecordIdRef = useRef("");

  const loadLeadForms = async (pageId?: string | null) => {
    if (!businessId || !pageId || pageId.startsWith("page_")) {
      setLeadForms([]);
      setFormsError("");
      return;
    }
    setFormsLoading(true);
    setFormsError("");
    try {
      const formsRes = await listMetaLeadForms(businessId, pageId);
      setLeadForms(formsRes?.forms || []);
    } catch (error: any) {
      setLeadForms([]);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        t("metaCampaigns.adsToasts.instantFormsFailed");
      setFormsError(message);
      toast.error(message);
    } finally {
      setFormsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditSession || !businessId || !campaignId) return;
    let cancelled = false;
    (async () => {
      setEditLoading(true);
      try {
        const data = await getMetaCampaign(businessId, campaignId);
        if (cancelled || !data?.campaign) return;
        const hydrated = adsManagerStateFromMetaCampaign(data.campaign, {
          currency: data.currency,
        });
        replaceState(hydrated);
        baselineRef.current = hydrated;
        publishRecordIdRef.current = hydrated.publishRecordId || "";
        setServerAck(false);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } }; message?: string };
        toast.error(
          err.response?.data?.error || err.message || t("metaCampaigns.adsManager.chrome.saveFailed")
        );
        navigate("../campaigns");
      } finally {
        if (!cancelled) setEditLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId, campaignId, isEditSession, navigate, replaceState, t]);

  const dirty = isAdsManagerDirty(baselineRef.current, state);
  const reviewErrors = useMemo(
    () => (state.mode === "review" ? validateAdsManagerClient(state) : []),
    [state]
  );

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (isEditSession || !campaignStarted || baselineRef.current) return;
    baselineRef.current = state;
  }, [campaignStarted, isEditSession, state]);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    (async () => {
      try {
        const status = await getMetaCampaignsStatus(businessId);
        if (cancelled) return;
        setConnection(status);
      } catch {
        if (!cancelled) setConnection(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  /** Only real Meta Instant Forms — never fall back to local mock names. */
  const liveForms = useMemo(() => {
    if (isGuidedDemoActive()) {
      const demoForm = guidedDemoInstantForm();
      if (demoForm) return [demoForm];
    }
    return leadForms.map((form) => {
      const statusUpper = String(form.status || "").toUpperCase();
      return {
        id: form.id,
        name: form.name,
        status:
          statusUpper === "ARCHIVED" || statusUpper === "DELETED"
            ? ("archived" as const)
            : ("active" as const),
        customQuestions: Array.isArray(form.questions)
          ? form.questions.filter((q) => {
              const type = String(q.type || "").toUpperCase();
              return type === "CUSTOM" || type === "SHORT_ANSWER" || type === "MULTIPLE_CHOICE";
            }).length
          : 0,
        updatedAt: form.createdTime
          ? String(form.createdTime).slice(0, 10)
          : "",
      };
    });
  }, [leadForms]);

  const connectedPages = connection?.pages || [];

  // Prefill Facebook Page on Ad Set + Ad from connected Meta pages.
  useEffect(() => {
    if (isEditSession) return;
    const preferredId =
      connection?.selectedPage?.pageId || connectedPages[0]?.id;
    const preferredName =
      connection?.selectedPage?.pageName ||
      connectedPages.find((p) => p.id === preferredId)?.name ||
      "";
    if (!preferredId) return;

    if (
      selectedAdSet &&
      (!selectedAdSet.facebookPageId ||
        selectedAdSet.facebookPageId === "page_1")
    ) {
      patchAdSet(selectedAdSet.id, {
        facebookPageId: preferredId,
        facebookPageName: preferredName,
      });
    }

    if (
      selectedAd &&
      (!selectedAd.facebookPageId || selectedAd.facebookPageId === "page_1")
    ) {
      patchAd(selectedAd.id, {
        facebookPageId: preferredId,
        facebookPageName: preferredName,
      });
    }
  }, [
    connection?.selectedPage?.pageId,
    connection?.selectedPage?.pageName,
    connectedPages,
    selectedAd,
    selectedAdSet,
    patchAd,
    patchAdSet,
    isEditSession,
  ]);

  // Reload Instant Forms when the selected Facebook Page changes.
  useEffect(() => {
    const pageId =
      selectedAdSet?.facebookPageId ||
      selectedAd?.facebookPageId ||
      connection?.selectedPage?.pageId;
    loadLeadForms(pageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    businessId,
    selectedAdSet?.facebookPageId,
    selectedAd?.facebookPageId,
    connection?.selectedPage?.pageId,
  ]);

  // Live Meta potential-audience estimate. Same audience fields as publish.
  useEffect(() => {
    if (!businessId || !selectedAdSet) return;
    const unavailable = (message: string) => {
      setAudienceEstimate({
        lower: 0,
        upper: 0,
        spectrum: 0.5,
        ready: false,
        unavailable: true,
        message,
        metric: "unavailable",
        forecast: null,
      });
    };

    if (!connection?.connected && !connection?.isConnected) {
      setEstimateLoading(false);
      unavailable(t("metaCampaigns.adsManager.chrome.estimateUnavailable"));
      return;
    }
    if (!connection.selectedAdAccount) {
      setEstimateLoading(false);
      unavailable(t("metaCampaigns.adsManager.chrome.estimateUnavailable"));
      return;
    }
    if (!selectedAdSet.locations?.length) {
      setEstimateLoading(false);
      unavailable(t("metaCampaigns.adsManager.chrome.estimateNeedsLocation"));
      return;
    }
    if (selectedAdSet.ageMin == null || selectedAdSet.ageMax == null) {
      setEstimateLoading(false);
      unavailable(t("metaCampaigns.adsManager.chrome.ageNotLoaded"));
      return;
    }

    let cancelled = false;
    setEstimateLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const data = await estimateMetaAudienceReach(
          businessId,
          buildAudienceEstimatePayload(
            { ...state, adSets: [selectedAdSet] },
            { isEditSession }
          )
        );
        if (cancelled) return;
        const valid =
          data.estimateReady === true &&
          data.metric !== "unavailable" &&
          data.lower != null &&
          data.upper != null &&
          Number.isFinite(Number(data.lower)) &&
          Number.isFinite(Number(data.upper));
        if (!valid) {
          unavailable(
            data.warning ||
              t("metaCampaigns.adsManager.chrome.estimateUnavailable")
          );
          return;
        }
        setAudienceEstimate({
          lower: Number(data.lower),
          upper: Number(data.upper),
          spectrum: Number(data.spectrum) || 0.5,
          ready: true,
          unavailable: false,
          message: "",
          metric: data.metric || "potential_audience",
          forecast: data.forecast || null,
        });
      } catch {
        if (!cancelled) {
          unavailable(t("metaCampaigns.adsManager.chrome.estimateUnavailable"));
        }
      } finally {
        if (!cancelled) setEstimateLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    businessId,
    connection?.connected,
    connection?.isConnected,
    connection?.selectedAdAccount,
    selectedAdSet?.locations,
    selectedAdSet?.locationsSummary,
    selectedAdSet?.ageMin,
    selectedAdSet?.ageMax,
    selectedAdSet?.gender,
    selectedAdSet?.interests,
    selectedAdSet?.advantageAudience,
    selectedAdSet?.furtherLimitReach,
    selectedAdSet?.suggestAudience,
    selectedAdSet?.advantagePlacements,
    selectedAdSet?.optimizationGoal,
    selectedAdSet?.targetingLoaded,
    selectedAdSet?.targetingRaw,
    state.campaign.objective,
    state.campaign.advantagePlusLeads,
    selectedAd?.facebookPageId,
    isEditSession,
    setAudienceEstimate,
    i18n.language,
    estimateAttempt,
  ]);

  const crumbs = useMemo(() => {
    const items: Array<{
      id: string;
      label: string;
      level: "campaign" | "adset" | "ad";
    }> = [
      {
        id: state.campaign.id,
        label: state.campaign.name,
        level: "campaign",
      },
    ];
    if (state.selectedLevel !== "campaign" && selectedAdSet) {
      items.push({
        id: selectedAdSet.id,
        label: selectedAdSet.name,
        level: "adset",
      });
    }
    if (state.selectedLevel === "ad" && selectedAd) {
      items.push({
        id: selectedAd.id,
        label: selectedAd.name,
        level: "ad",
      });
    }
    return items;
  }, [state, selectedAdSet, selectedAd]);

  const handlePublish = async () => {
    if (!businessId) return;
    if (!connection?.connected && !connection?.isConnected) {
      toast.error(t("metaCampaigns.adsToasts.connectAndSelect"));
      return;
    }
    if (!connection.selectedAdAccount) {
      toast.error(t("metaCampaigns.adsToasts.selectAdAccount"));
      return;
    }

    const clientErrors = validateAdsManagerClient(state);
    if (clientErrors.length) {
      toast.error(clientErrors[0]);
      setMode("review");
      return;
    }
    if (!canPublish) {
      toast.error(t("metaCampaigns.adsToasts.resolveValidation"));
      return;
    }

    try {
      setPublishing(true);
      const payload = {
        ...buildPublishPayloadFromAdsManager(state, { activate: true }),
        ...(isGuidedDemoActive() ? guidedDemoPublishExtras() : {}),
      };
      // Prefer connected page when draft still has placeholder.
      if (
        !payload.pageId ||
        payload.pageId === "page_1" ||
        payload.pageId === "page_2"
      ) {
        payload.pageId =
          connection.selectedPage?.pageId || payload.pageId;
      }

      const resumeId =
        publishRecordIdRef.current ||
        (publishResult?.id && publishResult.publishStatus !== "submitted"
          ? publishResult.id
          : "");
      if (isEditSession && !resumeId) {
        toast.error(c("noPublishRecord"));
        return;
      }
      if (resumeId) payload.resumePublishId = resumeId;
      if (
        publishResult?.metaAdId &&
        publishResult.publishStatus === "submitted"
      ) {
        setModalOpen(true);
        toast.error(t("metaCampaigns.adsManager.chrome.alreadySubmitted"));
        return;
      }
      const result = resumeId
        ? await retryMetaPublish(businessId, resumeId, payload)
        : await publishMetaCampaign(businessId, payload);
      if (result?.demoSafe) {
        // The guided tour shows its own localized success toast for this step.
        if (!isGuidedDemoActive()) {
          toast.success(
            t("metaCampaigns.adsToasts.demoCreated", "Demo campaign created successfully")
          );
        }
        navigate("../overview");
        return;
      }
      if (!result?.adId) {
        if (result?.publish) {
          setPublishResult(result.publish);
          setModalOpen(true);
        }
        toast.error(t("metaCampaigns.adsToasts.noAdId"));
        return;
      }
      setPublishResult(result.publish);
      setModalOpen(true);
      const blockers = result.activationBlockers || [];
      const outcome = result.publish?.outcome;
      if (blockers.length) {
        toast.error(
          c("publishLeftPaused", {
            component: blockers.map((row) => row.component).join(", "),
            status: blockers.map((row) => row.configuredStatus).join(", "),
          })
        );
      } else if (outcome === "rejected") {
        toast.error(t("metaCampaigns.adsManager.chrome.outcomeRejected"));
      } else if (
        outcome === "pending_review" &&
        result.publish?.metaConfiguredStatus === "ACTIVE"
      ) {
        toast.success(t("metaCampaigns.adsManager.chrome.outcomePendingReview"));
      } else if (outcome === "active") {
        toast.success(t("metaCampaigns.adsManager.chrome.outcomeActive"));
      } else {
        toast.error(t("metaCampaigns.adsManager.chrome.outcomeCreatedPaused"));
      }
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: {
            error?: string;
            publish?: MetaCampaignPublishRecord;
            failedStage?: string;
          };
        };
        message?: string;
      };
      const publish = err.response?.data?.publish;
      if (publish) {
        setPublishResult(publish);
        setModalOpen(true);
      }
      toast.error(
        err.response?.data?.error ||
          err.message ||
          t("metaCampaigns.adsToasts.publishFailed")
      );
    } finally {
      setPublishing(false);
    }
  };

  const requestLeave = () => {
    if (isEditSession && dirty) {
      setLeaveOpen(true);
      return;
    }
    navigate("../campaigns");
  };

  const handleDuplicate = async () => {
    if (!businessId || !campaignId) return;
    try {
      setPublishing(true);
      const result = await duplicateMetaCampaign(businessId, campaignId);
      const newId =
        (result?.result as { campaignId?: string } | undefined)?.campaignId ||
        "";
      toast.success(c("duplicateStarted"));
      if (newId) navigate(`../edit/${newId}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      toast.error(err.response?.data?.error || err.message || c("saveFailed"));
    } finally {
      setPublishing(false);
    }
  };

  const persistEditorDraft = async (snapshot: AdsManagerState) => {
    if (!businessId) throw new Error(c("saveFailed"));
    const result = await saveMetaEditorDraft(businessId, {
      publishId: publishRecordIdRef.current || snapshot.publishRecordId || undefined,
      metaCampaignId: isEditSession ? campaignId : undefined,
      localName: snapshot.campaign.name,
      objective: snapshot.campaign.objective,
      editorDraft: buildEditorDraft(snapshot),
    });
    if (!result?.success || !result.publishId) {
      throw new Error(result?.error || c("saveFailed"));
    }
    publishRecordIdRef.current = result.publishId;
    return result;
  };

  const reloadSavedState = async (snapshot: AdsManagerState) => {
    if (!businessId || !campaignId) {
      const next: AdsManagerState = {
        ...snapshot,
        publishRecordId: publishRecordIdRef.current || snapshot.publishRecordId,
        saveStatus: "saved",
        lastSavedAt: new Date().toISOString(),
      };
      replaceState(next);
      baselineRef.current = next;
      return next;
    }
    const readBack = await getMetaCampaign(businessId, campaignId);
    if (!readBack?.campaign) return snapshot;
    const hydrated = applyEditorDraft(
      adsManagerStateFromMetaCampaign(readBack.campaign, {
        currency: readBack.currency,
      }),
      buildEditorDraft(snapshot),
      {
        creativeOnMeta: readBack.campaign.creativeLinkedOnMeta === true,
        publishRecordId: publishRecordIdRef.current || snapshot.publishRecordId,
      }
    );
    replaceState(hydrated);
    baselineRef.current = hydrated;
    return hydrated;
  };

  const handleSaveDraft = async () => {
    if (!businessId) return;
    try {
      setPublishing(true);
      const result = await persistEditorDraft(state);
      await reloadSavedState({ ...state, publishRecordId: result.publishId });
      markServerSaved(result.publishId);
      setServerAck(true);
      if (editorDraftHasUnstoredImage(state)) toast.error(c("imageNotStored"));
      else toast.success(c("draftSavedServer"));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      toast.error(err.response?.data?.error || err.message || c("saveFailed"));
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!businessId) return;
    const snapshot = state;
    const changes = baselineRef.current
      ? diffAdsManagerState(baselineRef.current, snapshot)
      : [];
    try {
      setPublishing(true);
      const draftResult = await persistEditorDraft(snapshot);
      let metaError = "";
      if (isEditSession && campaignId) {
        try {
          const campaignPatch = buildCampaignUpdateFromDiff(snapshot, changes);
          if (campaignPatch && isRealMetaObjectId(campaignId)) {
            await updateMetaCampaign(businessId, campaignId, campaignPatch);
          }
          for (const adSet of snapshot.adSets) {
            if (!isRealMetaObjectId(adSet.id) || adSet.recoveredDraft) continue;
            const patch = buildAdSetUpdateFromDiff(adSet, snapshot.campaign, changes);
            if (patch) await updateMetaAdSet(businessId, adSet.id, patch);
          }
          for (const ad of snapshot.ads) {
            if (!isRealMetaObjectId(ad.id)) continue;
            const patch = buildAdUpdateFromDiff(ad, changes);
            if (patch) await updateMetaAd(businessId, ad.id, patch);
          }
        } catch (error: unknown) {
          const err = error as { response?: { data?: { error?: string } }; message?: string };
          metaError = err.response?.data?.error || err.message || c("saveFailed");
        }
      }
      await reloadSavedState({ ...snapshot, publishRecordId: draftResult.publishId });
      markServerSaved(draftResult.publishId);
      setServerAck(true);
      if (editorDraftHasUnstoredImage(snapshot)) toast.error(c("imageNotStored"));
      if (metaError) {
        toast.error(c("metaUpdateFailedDraftKept", { error: metaError }));
        return;
      }
      if (!draftResult.metaAdId) toast.success(c("draftSavedNotOnMeta"));
      else toast.success(c("saveSuccess"));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      toast.error(err.response?.data?.error || err.message || c("saveFailed"));
    } finally {
      setPublishing(false);
    }
  };

  const handleSync = async () => {
    if (!businessId || !publishResult?.id) return;
    try {
      setSyncing(true);
      const data = await syncMetaPublish(businessId, publishResult.id);
      setPublishResult(data.publish);
      toast.success(
        t("metaCampaigns.adsToasts.syncSuccess", {
          status: data.effectiveStatus || data.publish.displayStatus,
        })
      );
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || t("metaCampaigns.adsToasts.syncFailed")
      );
    } finally {
      setSyncing(false);
    }
  };

  const resumeRecoveredAdSet = async (publishId: string) => {
    if (!businessId || !publishId) return;
    try {
      setPublishing(true);
      const result = await retryMetaPublish(
        businessId,
        publishId,
        buildPublishPayloadFromAdsManager(state)
      );
      setPublishResult(result.publish);
      setModalOpen(true);
      if (result.adId) {
        toast.success(t("metaCampaigns.adsToasts.retryCompleted"));
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; publish?: MetaCampaignPublishRecord } };
      };
      if (err.response?.data?.publish) {
        setPublishResult(err.response.data.publish);
        setModalOpen(true);
      }
      toast.error(
        err.response?.data?.error || t("metaCampaigns.adsToasts.retryFailed")
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleRetry = async () => {
    if (!businessId || !publishResult?.id) return;
    try {
      setPublishing(true);
      const result = await retryMetaPublish(
        businessId,
        publishResult.id,
        buildPublishPayloadFromAdsManager(state, { activate: true })
      );
      setPublishResult(result.publish);
      if (result.activationBlockers?.length) {
        toast.error(
          c("publishLeftPaused", {
            component: result.activationBlockers.map((row) => row.component).join(", "),
            status: result.activationBlockers.map((row) => row.configuredStatus).join(", "),
          })
        );
      } else if (result.adId) {
        toast.success(t("metaCampaigns.adsToasts.retryCompleted"));
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; publish?: MetaCampaignPublishRecord } };
      };
      if (err.response?.data?.publish) {
        setPublishResult(err.response.data.publish);
      }
      toast.error(
        err.response?.data?.error || t("metaCampaigns.adsToasts.retryFailed")
      );
    } finally {
      setPublishing(false);
    }
  };

  // Poll Meta status while modal open and still pending review.
  useEffect(() => {
    if (!modalOpen || !businessId || !publishResult?.id) return;
    if (
      !publishResult.metaAdId ||
      !["PENDING_REVIEW", "SUBMITTED", "UNKNOWN"].includes(
        publishResult.displayStatus
      )
    ) {
      return;
    }
    const timer = setInterval(() => {
      void syncMetaPublish(businessId, publishResult.id)
        .then((data) => setPublishResult(data.publish))
        .catch(() => undefined);
    }, 45000);
    return () => clearInterval(timer);
  }, [
    modalOpen,
    businessId,
    publishResult?.id,
    publishResult?.metaAdId,
    publishResult?.displayStatus,
  ]);

  const connected = Boolean(connection?.connected || connection?.isConnected);
  const demoLocale = readGuidedDemoLocaleLock();
  const shellDir = demoLocale ? getTextDirection(demoLocale) : "ltr";

  if (isEditSession && editLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center gap-2 rounded-xl border border-[#CED0D4] bg-white text-[14px] font-semibold text-[#65676B]">
        <Loader2 className="h-5 w-5 animate-spin" />
        {c("loadingCampaign")}
      </div>
    );
  }

  if (!campaignStarted) {
    return (
      <CreateCampaignObjectiveModal
        open={createChooserOpen}
        onCancel={() => {
          setCreateChooserOpen(false);
          navigate("../overview");
        }}
        onContinue={(choice) => {
          applyCreateChoice(choice);
          setCreateChooserOpen(false);
          setCampaignStarted(true);
        }}
      />
    );
  }

  return (
    <div
      dir={shellDir}
      className="overflow-hidden rounded-xl border border-[#CED0D4] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      style={{ background: metaPageBg }}
    >
      {!connected ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] font-semibold text-amber-900">
          {c("connectBanner")}{" "}
          <Link
            to="../settings"
            className="font-bold text-[#1877F2] underline"
          >
            {c("openMetaConnection")}
          </Link>
        </div>
      ) : (
        <div className="border-b border-[#E4E6EB] bg-[#E7F3FF] px-4 py-2 text-[12px] font-semibold text-[#050505]">
          {c(isGuidedDemoActive() ? "accountBannerDemo" : "accountBanner", {
            account: connection?.selectedAdAccount?.name || "—",
            page: connection?.selectedPage?.pageName || c("pageNotSelected"),
          })}
        </div>
      )}

      {connection?.adAccountBillingHealth?.actionRequired ? (
        <div
          className={[
            "border-b px-4 py-2.5 text-[13px] font-semibold",
            connection.adAccountBillingHealth.severity === "error"
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-amber-200 bg-amber-50 text-amber-900",
          ].join(" ")}
        >
          <span className="font-bold">{c("billingLabel")} </span>
          {connection.adAccountBillingHealth.issues?.[0] ||
            c("billingDefaultIssue")}
          {connection.adAccountBillingHealth.actionUrl ? (
            <>
              {" "}
              <a
                href={connection.adAccountBillingHealth.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold underline"
              >
                {connection.adAccountBillingHealth.actionLabel ||
                  c("openMetaBilling")}
              </a>
            </>
          ) : null}
          <span className="mt-1 block text-[11px] font-semibold opacity-80">
            {c("billingWhatsappNote")}
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CED0D4] bg-white px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center gap-1 text-[13px]">
          {isEditSession ? (
            <span className="me-2 font-black text-[#050505]">{c("editCampaign")}</span>
          ) : null}
          {crumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              {index > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#8A8D91] rtl:rotate-180" />
              ) : null}
              <button
                type="button"
                onClick={() => selectNode(crumb.level, crumb.id)}
                className={[
                  "truncate font-semibold",
                  index === crumbs.length - 1
                    ? "text-[#050505]"
                    : "text-[#1877F2] hover:underline",
                ].join(" ")}
              >
                {crumb.label || c("untitled")}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {dirty ? (
            <span className="rounded-full bg-[#FFF8E5] px-2 py-1 text-[12px] font-bold text-[#8A6D1D]">
              {c("unsavedChanges")}
            </span>
          ) : null}
          {isEditSession ? (
            <span className="rounded-full bg-[#E4E6EB] px-2 py-1 text-[12px] font-bold text-[#050505]">
              {c("campaignStatusLabel")}: {state.campaign.status || "DRAFT"}
            </span>
          ) : null}
          <button
            type="button"
            className={metaBtnSecondary}
            disabled={publishing}
            onClick={() => void handleSaveDraft()}
          >
            {publishing ? c("savingDraft") : c("saveDraft")}
          </button>
          <button
            type="button"
            className={metaBtnSecondary}
            disabled={publishing}
            onClick={() => void handleSaveChanges()}
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {publishing ? c("savingChanges") : c("saveChanges")}
          </button>
          <button
            type="button"
            className={state.mode === "edit" ? metaBtnPrimary : metaBtnSecondary}
            onClick={() => setMode("edit")}
          >
            {c("edit")}
          </button>
          <button
            type="button"
            className={state.mode === "review" ? metaBtnPrimary : metaBtnSecondary}
            onClick={() => setMode("review")}
          >
            {c("review")}
          </button>
          <button
            type="button"
            className={metaBtnPrimary}
            data-demo-target="meta-publish"
            disabled={publishing || !canPublish || !connected}
            title={
              !connected
                ? c("connectMetaFirst")
                : canPublish
                  ? c("publishTitleReady")
                  : c("publishTitleBlocked")
            }
            onClick={() => setPublishConfirmOpen(true)}
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {publishing ? c("publishing") : c("publishAction")}
          </button>
          {isEditSession ? (
            <button type="button" className={metaBtnSecondary} onClick={requestLeave}>
              {c("back")}
            </button>
          ) : null}
        </div>
      </div>

      {/* Meta-style: fixed-height columns — center scrolls; right insights stay put */}
      <div className="grid min-h-[720px] grid-cols-1 lg:h-[calc(100vh-8.5rem)] lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:overflow-hidden">
        <div className="min-h-[220px] overflow-y-auto border-e border-[#CED0D4] lg:min-h-0">
          <MetaAdsManagerTree
            nodes={tree}
            selectedId={state.selectedId}
            onSelect={selectNode}
          />
        </div>

        <main className="min-w-0 overflow-y-auto border-e border-[#CED0D4] bg-[#F0F2F5] px-3 py-4 sm:px-5">
          {state.mode === "review" ? (
            <div className="mx-auto max-w-[760px] rounded-lg border border-[#E4E6EB] bg-white p-5 shadow-sm">
              <h2 className="text-[20px] font-bold text-[#050505]">
                {c("reviewTitle")}
              </h2>
              <p className="mt-1 text-[14px] text-[#65676B]">
                {c("reviewSubtitle")}
              </p>
              <dl className="mt-5 space-y-3 text-[14px]">
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewCampaign")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {state.campaign.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewObjective")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {t(`metaCampaigns.adsManager.objectives.${state.campaign.objective}`, {
                      defaultValue: state.campaign.objective.replace("OUTCOME_", ""),
                    })}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewDailyBudget")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {isGuidedDemoActive()
                      ? formatDemoMoney(Number(state.campaign.budgetAmount) || 0, { per: "day" })
                      : `${state.campaign.currency} ${state.campaign.budgetAmount}`}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewAdSet")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAdSet?.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewLocations")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAdSet?.locationsSummary || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewAge")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAdSet?.ageMin == null || selectedAdSet?.ageMax == null
                      ? c("ageNotLoaded")
                      : `${selectedAdSet.ageMin} - ${
                          selectedAdSet.ageMax >= 65
                            ? c("age65Plus")
                            : selectedAdSet.ageMax
                        }`}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewGender")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAdSet?.gender === "male"
                      ? c("genderMen")
                      : selectedAdSet?.gender === "female"
                        ? c("genderWomen")
                        : c("genderAll")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewAd")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewPrimaryText")}</dt>
                  <dd className="max-w-[60%] text-end font-semibold text-[#050505]">
                    {selectedAd?.primaryText || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewHeadline")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.headline || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewDescription")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.description || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewCta")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.callToAction || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewMedia")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.imageHash || selectedAd?.videoId || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewDestination")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.websiteUrl || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewPage")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.facebookPageName || selectedAd?.facebookPageId || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">{c("reviewInstagram")}</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.instagramAccountId || c("notSet")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#65676B]">{c("reviewInstantForm")}</dt>
                  <dd className="text-end font-semibold text-[#050505]">
                    {liveForms.find((f) => f.id === selectedAd?.instantFormId)?.name ||
                      selectedAd?.instantFormName ||
                      c("notSelected")}
                    {selectedAd?.instantFormId ? (
                      <span className="mt-1 block text-[12px] font-semibold text-[#65676B]">
                        {selectedAd.formLinkedOnMeta
                          ? c("formLinkedOnMeta")
                          : c("formSavedInDraft")}
                      </span>
                    ) : null}
                  </dd>
                </div>
              </dl>
              {reviewErrors.length ? (
                <div className="mt-4 rounded-md border border-[#F5D78E] bg-[#FFF8E5] px-3 py-2 text-[13px]">
                  <p className="font-bold text-[#8A6D1D]">{c("reviewMissing")}</p>
                  <ul className="mt-2 list-disc space-y-1 ps-5">
                    {reviewErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {!isRealMetaObjectId(selectedAd?.creativeId) ? (
                <p className="mt-3 text-[13px] font-semibold text-[#8A6D1D]">
                  {c("adNotOnMeta")}
                </p>
              ) : null}
            </div>
          ) : null}

          {state.mode === "edit" && state.selectedLevel === "campaign" ? (
            <CampaignLevelEditor
              campaign={state.campaign}
              sessionMode={isEditSession ? "edit" : "create"}
              onDuplicate={() => void handleDuplicate()}
              onChange={patchCampaign}
            />
          ) : null}

          {state.mode === "edit" &&
          state.selectedLevel === "adset" &&
          selectedAdSet ? (
            <AdSetLevelEditor
              adSet={selectedAdSet}
              businessId={businessId}
              pages={connectedPages}
              selectedPageId={connection?.selectedPage?.pageId}
              onResumeDraft={
                selectedAdSet.recoveredPublishId
                  ? () => {
                      void resumeRecoveredAdSet(selectedAdSet.recoveredPublishId || "");
                    }
                  : undefined
              }
              onChange={(patch) => {
                patchAdSet(selectedAdSet.id, patch);
                if (patch.facebookPageId && selectedAd) {
                  patchAd(selectedAd.id, {
                    facebookPageId: patch.facebookPageId,
                    facebookPageName:
                      patch.facebookPageName || selectedAd.facebookPageName,
                  });
                }
              }}
            />
          ) : null}

          {state.mode === "edit" &&
          state.selectedLevel === "ad" &&
          selectedAd ? (
            <AdLevelEditor
              ad={selectedAd}
              forms={liveForms}
              formsLoading={formsLoading}
              formsError={formsError}
              pages={connectedPages}
              businessId={businessId}
              sessionMode={isEditSession ? "edit" : "create"}
              onChange={(patch) => patchAd(selectedAd.id, patch)}
              onFormsRefresh={async () => {
                const pageId =
                  selectedAd.facebookPageId ||
                  selectedAdSet?.facebookPageId ||
                  connection?.selectedPage?.pageId;
                await loadLeadForms(pageId);
              }}
            />
          ) : null}
        </main>

        <aside className="overflow-y-auto bg-[#F7F8FA] px-3 py-4 lg:sticky lg:top-0 lg:max-h-full">
          {state.selectedLevel === "campaign" ? (
            <CampaignInsightsSidebar
              campaign={state.campaign}
              score={state.campaignScore}
              onChange={patchCampaign}
            />
          ) : null}
          {state.selectedLevel === "adset" && selectedAdSet ? (
            <AdSetInsightsSidebar
              estimate={state.audienceEstimate}
              locationsSummary={selectedAdSet.locationsSummary}
              advantageAudience={selectedAdSet.advantageAudience}
              ageMin={selectedAdSet.ageMin}
              ageMax={selectedAdSet.ageMax}
              gender={selectedAdSet.gender}
              estimateLoading={estimateLoading}
              estimatePending={false}
              onRetryEstimate={() => setEstimateAttempt((attempt) => attempt + 1)}
            />
          ) : null}
          {state.selectedLevel === "ad" && selectedAd ? (
            <AdInsightsSidebar
              ad={selectedAd}
              forms={liveForms}
              selectedLeadForm={
                leadForms.find((f) => f.id === selectedAd.instantFormId) ||
                null
              }
              score={state.campaignScore}
            />
          ) : null}
        </aside>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#CED0D4] bg-white px-4 py-2 text-[12px] text-[#65676B]">
        <div className="inline-flex items-center gap-1.5 font-semibold">
          {dirty ? (
            c("unsavedChanges")
          ) : serverAck ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#31A24C]" />
              {c("serverConfirmedSave")}
            </>
          ) : (
            c("notYetSaved")
          )}
        </div>
        <span>
          {isEditSession
            ? c("editFooterNote")
            : c(isGuidedDemoActive() ? "publishFooterNoteDemo" : "publishFooterNote")}
        </span>
      </div>

      {publishConfirmOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl" dir="auto">
            <h2 className="text-[18px] font-black">{c("publishConfirmTitle")}</h2>
            <p className="mt-2 text-[14px] font-semibold text-[#65676B]">{c("publishConfirmBody")}</p>
            <dl className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between gap-3">
                <dt className="text-[#65676B]">{c("publishConfirmBudget")}</dt>
                <dd className="font-bold">{state.campaign.currency} {state.campaign.budgetAmount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#65676B]">{c("publishConfirmAudience")}</dt>
                <dd className="text-end font-bold">
                  {selectedAdSet?.locationsSummary || c("notSet")} · {selectedAdSet?.ageMin ?? "—"}-{selectedAdSet?.ageMax ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#65676B]">{c("publishConfirmPlacements")}</dt>
                <dd className="font-bold">
                  {selectedAdSet?.advantagePlacements ? "Advantage+" : c("notSet")}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#65676B]">{c("publishConfirmForm")}</dt>
                <dd className="text-end font-bold">
                  {selectedAd?.instantFormName || selectedAd?.instantFormId || c("notSelected")}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#65676B]">{c("publishConfirmCreative")}</dt>
                <dd className="text-end font-bold">{selectedAd?.headline || c("notSet")}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" className={metaBtnSecondary} onClick={() => setPublishConfirmOpen(false)}>
                {c("cancel")}
              </button>
              <button
                type="button"
                className={metaBtnPrimary}
                disabled={publishing}
                onClick={() => {
                  setPublishConfirmOpen(false);
                  void handlePublish();
                }}
              >
                {c("confirmPublish")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {leaveOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <h2 className="text-[18px] font-black">{c("unsavedChanges")}</h2>
            <p className="mt-2 text-[14px] font-semibold text-[#65676B]">{c("unsavedChangesBody")}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className={metaBtnSecondary} onClick={() => setLeaveOpen(false)}>
                {c("stay")}
              </button>
              <button
                type="button"
                className={metaBtnPrimary}
                onClick={() => {
                  setLeaveOpen(false);
                  navigate("../campaigns");
                }}
              >
                {c("leaveWithoutSaving")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <PublishResultModal
        open={modalOpen}
        publish={publishResult}
        syncing={syncing}
        onClose={() => setModalOpen(false)}
        onSync={() => void handleSync()}
        onRetry={
          publishResult && publishResult.publishStatus !== "submitted"
            ? () => void handleRetry()
            : undefined
        }
      />
    </div>
  );
}
