import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import MetaAdsManagerTree from "./MetaAdsManagerTree";
import CampaignLevelEditor from "./editors/CampaignLevelEditor";
import AdSetLevelEditor from "./editors/AdSetLevelEditor";
import AdLevelEditor from "./editors/AdLevelEditor";
import CampaignInsightsSidebar from "./sidebars/CampaignInsightsSidebar";
import AdSetInsightsSidebar from "./sidebars/AdSetInsightsSidebar";
import AdInsightsSidebar from "./sidebars/AdInsightsSidebar";
import { useAdsManagerState } from "./useAdsManagerState";
import {
  metaBtnPrimary,
  metaBtnSecondary,
  metaPageBg,
} from "./metaAdsUi";

type OutletCtx = { businessId: string | null };

export default function MetaAdsManagerPage() {
  useOutletContext<OutletCtx>();
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
    canPublish,
  } = ctrl;

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

  return (
    <div
      dir="ltr"
      className="overflow-hidden rounded-xl border border-[#CED0D4] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      style={{ background: metaPageBg }}
    >
      {/* Top chrome — Meta Ads Manager style */}
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
            disabled={!canPublish}
            title={
              canPublish
                ? "Publish campaign"
                : "Resolve validation issues before publishing"
            }
          >
            Publish
          </button>
        </div>
      </div>

      {/* 3-pane body */}
      <div className="grid min-h-[720px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <div className="min-h-[220px] lg:min-h-0">
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
                publishing.
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
                  <dt className="text-[#65676B]">Ad</dt>
                  <dd className="font-semibold text-[#050505]">
                    {selectedAd?.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#65676B]">Instant form</dt>
                  <dd className="font-semibold text-[#050505]">
                    {state.instantForms.find(
                      (f) => f.id === selectedAd?.instantFormId
                    )?.name || "Not selected"}
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
              onChange={(patch) => patchAdSet(selectedAdSet.id, patch)}
            />
          ) : null}

          {state.mode === "edit" &&
          state.selectedLevel === "ad" &&
          selectedAd ? (
            <AdLevelEditor
              ad={selectedAd}
              forms={state.instantForms}
              onChange={(patch) => patchAd(selectedAd.id, patch)}
            />
          ) : null}
        </main>

        <aside className="overflow-y-auto bg-[#F7F8FA] px-3 py-4">
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
            />
          ) : null}
          {state.selectedLevel === "ad" && selectedAd ? (
            <AdInsightsSidebar
              ad={selectedAd}
              forms={state.instantForms}
              score={state.campaignScore}
            />
          ) : null}
        </aside>
      </div>

      {/* Footer save status */}
      <div className="flex items-center justify-between gap-3 border-t border-[#CED0D4] bg-white px-4 py-2 text-[12px] text-[#65676B]">
        <div className="inline-flex items-center gap-1.5 font-semibold">
          {state.saveStatus === "saved" ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#31A24C]" />
              All edits saved
            </>
          ) : state.saveStatus === "saving" ? (
            "Saving…"
          ) : (
            "Couldn’t save changes"
          )}
        </div>
        <span>
          {state.mode === "edit" ? "Editing draft" : "Review mode"} · API-ready
          local draft
        </span>
      </div>
    </div>
  );
}
