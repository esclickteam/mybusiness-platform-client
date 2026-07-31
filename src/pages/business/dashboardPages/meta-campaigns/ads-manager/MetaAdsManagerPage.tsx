import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import {
  estimateMetaAudienceReach,
  getMetaCampaignsStatus,
  listMetaLeadForms,
  publishMetaCampaign,
  retryMetaPublish,
  syncMetaPublish,
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
  buildPublishPayloadFromAdsManager,
  validateAdsManagerClient,
} from "./buildPublishPayload";
import { useAdsManagerState } from "./useAdsManagerState";
import {
  metaBtnPrimary,
  metaBtnSecondary,
  metaPageBg,
} from "./metaAdsUi";

type OutletCtx = { businessId: string | null };

export default function MetaAdsManagerPage() {
  const navigate = useNavigate();
  const { businessId } = useOutletContext<OutletCtx>();
  const ctrl = useAdsManagerState();
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
    canPublish,
  } = ctrl;

  const [connection, setConnection] = useState<MetaAdsConnectionStatus | null>(
    null
  );
  const [leadForms, setLeadForms] = useState<MetaLeadForm[]>([]);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [publishResult, setPublishResult] =
    useState<MetaCampaignPublishRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Meta-style gate: choose objective before opening the Ads Manager editor.
  const [createChooserOpen, setCreateChooserOpen] = useState(true);
  const [campaignStarted, setCampaignStarted] = useState(false);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    (async () => {
      try {
        const status = await getMetaCampaignsStatus(businessId);
        if (cancelled) return;
        setConnection(status);
        if (status.connected || status.isConnected) {
          try {
            const formsRes = await listMetaLeadForms(
              businessId,
              status.selectedPage?.pageId
            );
            if (!cancelled) setLeadForms(formsRes?.forms || []);
          } catch {
            if (!cancelled) setLeadForms([]);
          }
        }
      } catch {
        if (!cancelled) setConnection(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  const liveForms = useMemo(() => {
    if (leadForms.length) {
      return leadForms.map((form) => ({
        id: form.id,
        name: form.name,
        status:
          String(form.status || "").toUpperCase() === "ARCHIVED"
            ? ("archived" as const)
            : ("active" as const),
        customQuestions: Array.isArray(form.questions)
          ? form.questions.length
          : 0,
        updatedAt: form.createdTime
          ? String(form.createdTime).slice(0, 10)
          : "",
      }));
    }
    return state.instantForms;
  }, [leadForms, state.instantForms]);

  const connectedPages = connection?.pages || [];

  // Prefill Facebook Page on Ad Set + Ad from connected Meta pages.
  useEffect(() => {
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
  ]);

  // Reload Instant Forms when the selected Facebook Page changes.
  useEffect(() => {
    const pageId =
      selectedAdSet?.facebookPageId ||
      selectedAd?.facebookPageId ||
      connection?.selectedPage?.pageId;
    if (!businessId || !pageId || pageId.startsWith("page_")) return;
    let cancelled = false;
    (async () => {
      try {
        const formsRes = await listMetaLeadForms(businessId, pageId);
        if (!cancelled) setLeadForms(formsRes?.forms || []);
      } catch {
        if (!cancelled) setLeadForms([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    businessId,
    selectedAdSet?.facebookPageId,
    selectedAd?.facebookPageId,
    connection?.selectedPage?.pageId,
  ]);

  // Live Meta reach estimate (Israel + ages → e.g. 3,800,000 - 4,500,000).
  useEffect(() => {
    if (!businessId || !selectedAdSet) return;
    if (!connection?.connected && !connection?.isConnected) return;
    if (!connection.selectedAdAccount) return;

    const timer = window.setTimeout(async () => {
      setEstimateLoading(true);
      try {
        const locations = (selectedAdSet.locations || []).filter(
          (loc) => loc.include !== false
        );
        const countries = locations
          .filter((loc) => loc.type === "country")
          .map((loc) =>
            String(loc.key || loc.countryCode || "").toUpperCase()
          )
          .filter(Boolean);
        const genders =
          selectedAdSet.gender === "male"
            ? [1]
            : selectedAdSet.gender === "female"
              ? [2]
              : [];

        const hasCityOrPlace = locations.some((loc) =>
          /city|subcity|neighborhood|region|zip/i.test(loc.type || "")
        );

        const data = await estimateMetaAudienceReach(businessId, {
          locations: locations.map((loc) => {
            const isCity = /city|subcity|neighborhood/i.test(loc.type || "");
            // Meta default for cities = "Cities within radius" 25mi (unless city only).
            const cityOnly = loc.cityOnly === true;
            const radiusMiles =
              isCity && !cityOnly
                ? Number(loc.radiusMiles != null ? loc.radiusMiles : 25)
                : null;
            return {
              key: loc.key,
              name: loc.name,
              type: loc.type,
              countryCode: loc.countryCode,
              countryName: loc.countryName,
              region: loc.region,
              metaCityKey: loc.metaCityKey || (isCity ? loc.key : undefined),
              radiusMiles,
              // Server maps radiusKm as the numeric radius for Meta geo.
              radiusKm: radiusMiles,
              distanceUnit: radiusMiles != null ? "mile" : undefined,
              latitude: loc.latitude,
              longitude: loc.longitude,
            };
          }),
          // Only send country list when targeting countries (don't force IL over a city).
          countries: hasCityOrPlace
            ? countries
            : countries.length
              ? countries
              : ["IL"],
          ageMin: selectedAdSet.ageMin,
          ageMax: selectedAdSet.ageMax >= 65 ? 65 : selectedAdSet.ageMax,
          genders,
          locationsSummary: selectedAdSet.locationsSummary,
          // Meta: Advantage+ suggestions → estimate ignores age/gender.
          advantageAudience: selectedAdSet.advantageAudience !== false,
          suggestAudience: selectedAdSet.suggestAudience !== false,
          furtherLimitReach: Boolean(selectedAdSet.furtherLimitReach),
        });

        setAudienceEstimate({
          lower: Number(data.lower) || 0,
          upper: Number(data.upper) || 0,
          spectrum: Number(data.spectrum) || 0.5,
        });
      } catch {
        // Keep last estimate; defaults already match Meta IL broad range.
      } finally {
        setEstimateLoading(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
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
    setAudienceEstimate,
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
      toast.error("Connect Meta Ads and select an Ad Account first");
      return;
    }
    if (!connection.selectedAdAccount) {
      toast.error("Select an Ad Account before publishing");
      return;
    }

    const clientErrors = validateAdsManagerClient(state);
    if (clientErrors.length) {
      toast.error(clientErrors[0]);
      setMode("review");
      return;
    }
    if (!canPublish) {
      toast.error("Resolve validation issues before publishing");
      return;
    }

    try {
      setPublishing(true);
      const payload = buildPublishPayloadFromAdsManager(state);
      // Prefer connected page when draft still has placeholder.
      if (
        !payload.pageId ||
        payload.pageId === "page_1" ||
        payload.pageId === "page_2"
      ) {
        payload.pageId =
          connection.selectedPage?.pageId || payload.pageId;
      }

      const result = await publishMetaCampaign(businessId, payload);
      if (!result?.adId) {
        toast.error("Meta did not return an Ad ID — publish not confirmed");
        return;
      }
      setPublishResult(result.publish);
      setModalOpen(true);
      toast.success("Campaign submitted to Meta");
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
          "Publish to Meta failed"
      );
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
        `Synced from Meta · ${data.effectiveStatus || data.publish.displayStatus}`
      );
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Sync from Meta failed"
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleRetry = async () => {
    if (!businessId || !publishResult?.id) return;
    try {
      setPublishing(true);
      const result = await retryMetaPublish(businessId, publishResult.id);
      setPublishResult(result.publish);
      if (result.adId) {
        toast.success("Retry completed — Ad ID confirmed from Meta");
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; publish?: MetaCampaignPublishRecord } };
      };
      if (err.response?.data?.publish) {
        setPublishResult(err.response.data.publish);
      }
      toast.error(err.response?.data?.error || "Retry failed");
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
      dir="ltr"
      className="overflow-hidden rounded-xl border border-[#CED0D4] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      style={{ background: metaPageBg }}
    >
      {!connected ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] font-semibold text-amber-900">
          Connect Meta Ads and select an Ad Account + Page before publishing.{" "}
          <Link
            to="../settings"
            className="font-bold text-[#1877F2] underline"
          >
            Open Meta connection
          </Link>
        </div>
      ) : (
        <div className="border-b border-[#E4E6EB] bg-[#E7F3FF] px-4 py-2 text-[12px] font-semibold text-[#050505]">
          Ad account: {connection?.selectedAdAccount?.name || "—"} · Page:{" "}
          {connection?.selectedPage?.pageName || "not selected"} · Publish
          calls Meta Marketing API for real
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
          <span className="font-bold">Meta Ad Account billing: </span>
          {connection.adAccountBillingHealth.issues?.[0] ||
            "This ad account needs billing attention before ads can deliver."}
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
                  "Open Meta Billing"}
              </a>
            </>
          ) : null}
          <span className="mt-1 block text-[11px] font-semibold opacity-80">
            Ad spend billing is separate from WhatsApp Business message fees.
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CED0D4] bg-white px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center gap-1 text-[13px]">
          {crumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              {index > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#8A8D91]" />
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
                {crumb.label || "Untitled"}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={
              state.mode === "edit" ? metaBtnPrimary : metaBtnSecondary
            }
            onClick={() => setMode("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            className={
              state.mode === "review" ? metaBtnPrimary : metaBtnSecondary
            }
            onClick={() => setMode("review")}
          >
            Review
          </button>
          <button
            type="button"
            className={metaBtnPrimary}
            disabled={publishing || !canPublish || !connected}
            title={
              !connected
                ? "Connect Meta first"
                : canPublish
                  ? "Publish to Meta Marketing API"
                  : "Resolve validation issues before publishing"
            }
            onClick={() => void handlePublish()}
          >
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {publishing ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Meta-style: fixed-height columns — center scrolls; right insights stay put */}
      <div className="grid min-h-[720px] grid-cols-1 lg:h-[calc(100vh-8.5rem)] lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:overflow-hidden">
        <div className="min-h-[220px] overflow-y-auto border-r border-[#CED0D4] lg:min-h-0">
          <MetaAdsManagerTree
            nodes={tree}
            selectedId={state.selectedId}
            onSelect={selectNode}
          />
        </div>

        <main className="min-w-0 overflow-y-auto border-r border-[#CED0D4] bg-[#F0F2F5] px-3 py-4 sm:px-5">
          {state.mode === "review" ? (
            <div className="mx-auto max-w-[760px] rounded-lg border border-[#E4E6EB] bg-white p-5 shadow-sm">
              <h2 className="text-[20px] font-bold text-[#050505]">Review</h2>
              <p className="mt-1 text-[14px] text-[#65676B]">
                Confirm settings across Campaign, Ad set and Ad before
                publishing to Meta.
              </p>
              <dl className="mt-5 space-y-3 text-[14px]">
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">Campaign</dt>
                  <dd className="font-semibold text-[#050505]">
                    {state.campaign.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">Objective</dt>
                  <dd className="font-semibold text-[#050505]">
                    {state.campaign.objective.replace("OUTCOME_", "")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">Daily budget</dt>
                  <dd className="font-semibold text-[#050505]">
                    {state.campaign.currency} {state.campaign.budgetAmount}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">Ad set</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAdSet?.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">Locations</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAdSet?.locationsSummary || "Not set"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">Age</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAdSet
                      ? `${selectedAdSet.ageMin} - ${
                          selectedAdSet.ageMax >= 65
                            ? "65+"
                            : selectedAdSet.ageMax
                        }`
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">Gender</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAdSet?.gender === "male"
                      ? "Men"
                      : selectedAdSet?.gender === "female"
                        ? "Women"
                        : "All genders"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#E4E6EB] pb-2">
                  <dt className="text-[#65676B]">Ad</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#65676B]">Instant form</dt>
                  <dd className="font-semibold text-[#050505]">
                    {liveForms.find((f) => f.id === selectedAd?.instantFormId)
                      ?.name || "Not selected"}
                  </dd>
                </div>
              </dl>
              {!canPublish ? (
                <p className="mt-4 rounded-md border border-[#F5D78E] bg-[#FFF8E5] px-3 py-2 text-[13px]">
                  Publishing is blocked until required fields are completed.
                </p>
              ) : null}
            </div>
          ) : null}

          {state.mode === "edit" && state.selectedLevel === "campaign" ? (
            <CampaignLevelEditor
              campaign={state.campaign}
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
              pages={connectedPages}
              businessId={businessId}
              onChange={(patch) => patchAd(selectedAd.id, patch)}
              onFormsRefresh={async () => {
                const pageId =
                  selectedAd.facebookPageId ||
                  selectedAdSet?.facebookPageId ||
                  connection?.selectedPage?.pageId;
                if (!businessId || !pageId) return;
                try {
                  const formsRes = await listMetaLeadForms(businessId, pageId);
                  setLeadForms(formsRes?.forms || []);
                } catch {
                  setLeadForms([]);
                }
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
          {state.saveStatus === "saved" ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#31A24C]" />
              Draft edits saved locally
            </>
          ) : state.saveStatus === "saving" ? (
            "Saving draft…"
          ) : (
            "Couldn’t save draft"
          )}
        </div>
        <span>
          Publish creates real Meta objects · never shows Published without
          metaAdId
        </span>
      </div>

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
