import React from "react";
import { CheckCircle2, ExternalLink, Loader2, RefreshCw, X } from "lucide-react";
import type { MetaCampaignPublishRecord } from "../../../../../api/metaCampaignsApi";
import { metaBtnPrimary, metaBtnSecondary } from "./metaAdsUi";

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted to Meta",
  PENDING_REVIEW: "Pending review",
  IN_PROCESS: "Processing",
  ACTIVE: "Active",
  PAUSED: "Paused",
  REJECTED: "Rejected",
  ERROR: "Error",
  UNKNOWN: "Unknown",
};

type Props = {
  open: boolean;
  publish: MetaCampaignPublishRecord | null;
  syncing?: boolean;
  onClose: () => void;
  onSync: () => void;
  onRetry?: () => void;
};

export default function PublishResultModal({
  open,
  publish,
  syncing,
  onClose,
  onSync,
  onRetry,
}: Props) {
  if (!open || !publish) return null;

  const ok = Boolean(publish.metaAdId) && publish.publishStatus === "submitted";
  const statusLabel =
    STATUS_LABELS[publish.displayStatus] ||
    publish.metaEffectiveStatus ||
    publish.displayStatus ||
    "—";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div
        dir="ltr"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-[#CED0D4] bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#E4E6EB] px-4 py-3">
          <div className="flex items-start gap-2">
            {ok ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#31A24C]" />
            ) : (
              <X className="mt-0.5 h-5 w-5 text-[#FA383E]" />
            )}
            <div>
              <h2 className="text-[17px] font-bold text-[#050505]">
                {ok
                  ? "Campaign submitted to Meta"
                  : "Publish incomplete"}
              </h2>
              <p className="mt-0.5 text-[13px] text-[#65676B]">
                {ok
                  ? "Meta returned a real Ad ID. Status below is from Meta, not a local mock."
                  : publish.lastError ||
                    "One or more Meta create steps failed. You can retry from the failed stage."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#65676B] hover:bg-[#F0F2F5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 px-4 py-4 text-[13px]">
          <Row label="Meta Campaign ID" value={publish.metaCampaignId || "—"} />
          <Row label="Meta Ad Set ID" value={publish.metaAdSetId || "—"} />
          <Row label="Meta Creative ID" value={publish.metaCreativeId || "—"} />
          <Row label="Meta Ad ID" value={publish.metaAdId || "—"} mono />
          <Row label="Current Meta status" value={statusLabel} />
          <Row
            label="effective_status"
            value={publish.metaEffectiveStatus || "—"}
          />
          <Row
            label="Submitted time"
            value={
              publish.publishedAt
                ? new Date(publish.publishedAt).toLocaleString()
                : "—"
            }
          />
          {publish.failedStage ? (
            <Row label="Failed stage" value={publish.failedStage} />
          ) : null}
          {publish.lastMetaErrorCode ? (
            <Row
              label="Meta error"
              value={`${publish.lastMetaErrorCode}: ${publish.lastMetaErrorMessage || ""}`}
            />
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E4E6EB] px-4 py-3">
          <button
            type="button"
            className={metaBtnSecondary}
            onClick={onSync}
            disabled={syncing || !publish.metaAdId}
          >
            {syncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Sync status from Meta
          </button>
          {!ok && onRetry ? (
            <button type="button" className={metaBtnSecondary} onClick={onRetry}>
              Retry failed stage
            </button>
          ) : null}
          {publish.adsManagerUrl ? (
            <a
              href={publish.adsManagerUrl}
              target="_blank"
              rel="noreferrer"
              className={metaBtnPrimary}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Meta Ads Manager
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-[#F7F8FA] px-3 py-2">
      <span className="shrink-0 font-semibold text-[#65676B]">{label}</span>
      <span
        className={[
          "text-right font-bold text-[#050505]",
          mono ? "break-all font-mono text-[12px]" : "",
        ].join(" ")}
        dir="ltr"
      >
        {value}
      </span>
    </div>
  );
}
