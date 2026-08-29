import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Loader2, Megaphone, Pencil, RotateCcw } from "lucide-react";
import {
  btnPrimary,
  btnSecondary,
} from "../../../../styles/bizuplyUi";
import type {
  AiCampaignSessionResponse,
  AiUnresolvedLocation,
} from "../../../../api/metaAiCampaignApi";

const STAGE_KEYS: Record<string, string> = {
  validating: "stageValidating",
  locations: "stageLocations",
  audience: "stageAudience",
  media: "stageMedia",
  form: "stageForm",
  campaign: "stageCampaign",
  ad: "stageAd",
  verify: "stageVerify",
  retry: "stageRetry",
  complete: "stageComplete",
};

const STAGE_ORDER = [
  "validating",
  "media",
  "campaign",
  "audience",
  "ad",
  "verify",
];

function draftStatus(session: AiCampaignSessionResponse) {
  return session.lifecycle || session.metaDraft?.status || "IDLE";
}

export default function MetaAiDraftPublishPanel({
  session,
  busy,
  pendingAction,
  mediaMissing,
  budgetLabel,
  locationsLabel,
  objectiveLabel,
  activationTree,
  onCreateDraft,
  onRetryDraft,
  onConfirmLocations,
  onRequestPublish,
  onConfirmPublish,
  onCancelPublish,
  confirmOpen,
  onEditBeforePublish,
  onViewCampaign,
  onBackToCampaigns,
}: {
  session: AiCampaignSessionResponse;
  busy: boolean;
  pendingAction: string | null;
  mediaMissing: boolean;
  budgetLabel: string;
  locationsLabel: string;
  objectiveLabel: string;
  activationTree?: { campaign?: string | null; adSet?: string | null; ad?: string | null };
  onCreateDraft: () => void;
  onRetryDraft: () => void;
  onConfirmLocations: (choices: Array<Record<string, unknown>>) => void;
  onRequestPublish: () => void;
  onConfirmPublish: () => void;
  onCancelPublish: () => void;
  confirmOpen: boolean;
  onEditBeforePublish: () => void;
  onViewCampaign: () => void;
  onBackToCampaigns: () => void;
}) {
  const { t } = useTranslation();
  const status = draftStatus(session);
  const stage = session.metaDraft?.stage || "";
  const pending = session.metaDraft?.pendingLocations || [];
  const [picked, setPicked] = useState<Record<string, string>>({});
  const creating = status === "CREATING_META_DRAFT" || pendingAction === "draft";
  const created = status === "META_DRAFT_CREATED";
  const published = status === "PUBLISHED";
  const failed = status === "META_FAILED";
  const campaignId = session.meta?.campaignId || session.metaDraft?.campaignId;
  const hasMetaObjects = Boolean(campaignId || session.metaDraft?.publishId);
  const amount =
    session.metaDraft?.approvedDailyBudget ??
    session.proposal?.adSet.dailyBudget?.amount ??
    null;

  const stageLabel = useMemo(() => {
    const key = STAGE_KEYS[stage];
    return key ? t(`metaCampaigns.ai.draft.${key}`) : "";
  }, [stage, t]);

  if (published) {
    return (
      <div className="space-y-4" data-testid="meta-ai-published">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <p className="inline-flex items-center gap-2 text-base font-black text-emerald-900">
            <CheckCircle2 className="h-5 w-5" />
            {t("metaCampaigns.ai.publish.successTitle")}
          </p>
          <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-black uppercase text-emerald-800">
                {t("metaCampaigns.ai.publish.campaignId")}
              </dt>
              <dd className="text-sm font-semibold" data-testid="meta-ai-active-campaign-id">
                {campaignId || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-black uppercase text-emerald-800">
                {t("metaCampaigns.ai.draft.statusLabel")}
              </dt>
              <dd className="text-sm font-semibold">ACTIVE</dd>
            </div>
            <div>
              <dt className="text-[11px] font-black uppercase text-emerald-800">
                {t("metaCampaigns.ai.draft.budgetLabel")}
              </dt>
              <dd className="text-sm font-semibold">
                {amount != null
                  ? `${amount} ${t("metaCampaigns.ai.draft.perDay")}`
                  : budgetLabel}
              </dd>
            </div>
          </dl>
        </div>
        <button
          type="button"
          className={btnPrimary}
          onClick={onViewCampaign}
          data-testid="meta-ai-view-campaign"
        >
          {t("metaCampaigns.ai.publish.viewCampaign")}
        </button>
      </div>
    );
  }

  if (created) {
    return (
      <div className="space-y-4" data-testid="meta-ai-draft-success">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <p className="inline-flex items-center gap-2 text-base font-black text-emerald-900">
            <CheckCircle2 className="h-5 w-5" />
            {t("metaCampaigns.ai.draft.successTitle")}
          </p>
          <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-black uppercase text-emerald-800">
                {t("metaCampaigns.ai.draft.statusLabel")}
              </dt>
              <dd className="text-sm font-semibold" data-testid="meta-ai-draft-status">
                {t("metaCampaigns.ai.draft.statusPaused")}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-black uppercase text-emerald-800">
                {t("metaCampaigns.ai.draft.budgetLabel")}
              </dt>
              <dd className="text-sm font-semibold" data-testid="meta-ai-draft-budget">
                {amount != null
                  ? `${amount} ${t("metaCampaigns.ai.draft.perDay")}`
                  : budgetLabel}
              </dd>
            </div>
          </dl>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          {t("metaCampaigns.ai.draft.editLocalNote")}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            className={btnPrimary}
            disabled={busy}
            onClick={onRequestPublish}
            data-testid="meta-ai-publish"
          >
            <Megaphone className="h-4 w-4" />
            {t("metaCampaigns.ai.draft.publish")}
          </button>
          <button
            type="button"
            className={btnSecondary}
            disabled={busy}
            onClick={onEditBeforePublish}
            data-testid="meta-ai-edit-before-publish"
          >
            <Pencil className="h-4 w-4" />
            {t("metaCampaigns.ai.draft.editBefore")}
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={onBackToCampaigns}
            data-testid="meta-ai-back-campaigns"
          >
            {t("metaCampaigns.ai.draft.backToCampaigns")}
          </button>
        </div>

        {confirmOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
            data-testid="meta-ai-publish-modal"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-5 shadow-xl">
              <h3 className="text-lg font-black text-slate-900">
                {t("metaCampaigns.ai.publish.confirmTitle")}
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-[11px] font-black uppercase text-slate-500">
                    {t("metaCampaigns.ai.publish.dailyBudget")}
                  </dt>
                  <dd className="text-sm font-semibold" data-testid="meta-ai-publish-budget">
                    {amount != null ? `${amount} ₪` : budgetLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-black uppercase text-slate-500">
                    {t("metaCampaigns.ai.publish.area")}
                  </dt>
                  <dd className="text-sm font-semibold">{locationsLabel || "—"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-black uppercase text-slate-500">
                    {t("metaCampaigns.ai.publish.objective")}
                  </dt>
                  <dd className="text-sm font-semibold">{objectiveLabel}</dd>
                </div>
              </dl>
              <p className="text-sm font-semibold text-slate-600">
                {t("metaCampaigns.ai.publish.billingNote")}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={onCancelPublish}
                  data-testid="meta-ai-publish-cancel"
                >
                  {t("metaCampaigns.ai.publish.cancel")}
                </button>
                <button
                  type="button"
                  className={btnPrimary}
                  disabled={busy}
                  onClick={onConfirmPublish}
                  data-testid="meta-ai-publish-confirm"
                >
                  {pendingAction === "activate" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {t("metaCampaigns.ai.publish.confirm")}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (pending.length) {
    return (
      <div
        className="space-y-3 rounded-md border border-amber-200 bg-amber-50 p-4"
        data-testid="meta-ai-location-unresolved"
      >
        <p className="text-sm font-black text-amber-950">
          {t("metaCampaigns.ai.draft.locationUnresolved")}
        </p>
        <p className="text-sm font-semibold text-amber-900">
          {t("metaCampaigns.ai.draft.locationPick")}
        </p>
        {pending.map((row: AiUnresolvedLocation) => (
          <label key={row.query} className="block text-sm font-semibold text-slate-800">
            {row.query}
            <select
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2"
              data-testid="meta-ai-location-option"
              value={picked[row.query] || ""}
              onChange={(event) =>
                setPicked((current) => ({ ...current, [row.query]: event.target.value }))
              }
            >
              <option value="">{t("metaCampaigns.ai.draft.locationPick")}</option>
              {(row.options || []).map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                  {option.region ? ` · ${option.region}` : ""}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button
          type="button"
          className={btnPrimary}
          disabled={
            busy ||
            pending.some((row) => !picked[row.query])
          }
          data-testid="meta-ai-location-confirm"
          onClick={() => {
            const choices = pending.map((row) => {
              const option = (row.options || []).find((item) => item.key === picked[row.query]);
              return {
                query: row.query,
                key: option?.key,
                name: option?.name,
                type: option?.type,
                countryCode: option?.countryCode,
                region: option?.region,
              };
            });
            onConfirmLocations(choices);
          }}
        >
          {t("metaCampaigns.ai.draft.locationConfirm")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="meta-ai-draft-panel">
      {failed ? (
        <div
          className="rounded-md border border-rose-200 bg-rose-50 p-3"
          data-testid="meta-ai-draft-error"
        >
          <p className="text-sm font-black text-rose-900">
            {t("metaCampaigns.ai.draft.metaError")}
          </p>
          <p className="mt-1 text-sm font-semibold text-rose-800">
            {session.metaDraft?.error || t("metaCampaigns.ai.errorGeneric")}
          </p>
          {activationTree ? (
            <dl className="mt-2 grid grid-cols-1 gap-1 text-sm" data-testid="meta-ai-partial-tree">
              <div>
                {t("metaCampaigns.ai.publish.treeCampaign")}: {activationTree.campaign || "—"}
              </div>
              <div>
                {t("metaCampaigns.ai.publish.treeAdSet")}: {activationTree.adSet || "—"}
              </div>
              <div>
                {t("metaCampaigns.ai.publish.treeAd")}: {activationTree.ad || "—"}
              </div>
            </dl>
          ) : null}
          <button
            type="button"
            className={`${btnSecondary} mt-3`}
            disabled={busy}
            onClick={onRetryDraft}
            data-testid="meta-ai-draft-retry"
          >
            <RotateCcw className="h-4 w-4" />
            {t("metaCampaigns.ai.draft.retry")}
          </button>
        </div>
      ) : null}

      {creating ? (
        <div
          className="rounded-md border border-violet-200 bg-violet-50 p-4"
          data-testid="meta-ai-draft-progress"
        >
          <p className="inline-flex items-center gap-2 text-sm font-black text-violet-900">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("metaCampaigns.ai.draft.creating")}
          </p>
          {stageLabel ? (
            <p className="mt-2 text-sm font-semibold text-violet-800" data-testid="meta-ai-draft-stage">
              {stageLabel}
            </p>
          ) : null}
          <ol className="mt-3 space-y-1 text-xs font-semibold text-violet-700">
            {STAGE_ORDER.map((item) => (
              <li
                key={item}
                className={
                  STAGE_KEYS[stage] === STAGE_KEYS[item] ? "font-black text-violet-950" : ""
                }
              >
                {t(`metaCampaigns.ai.draft.${STAGE_KEYS[item]}`)}
              </li>
            ))}
          </ol>
        </div>
      ) : hasMetaObjects ? null : (
        <div className="space-y-2">
          {mediaMissing ? (
            <p className="text-sm font-semibold text-amber-800" data-testid="meta-ai-draft-missing-creative">
              {t("metaCampaigns.ai.draft.missingCreativeBlock")}
            </p>
          ) : null}
          <button
            type="button"
            className={btnPrimary}
            disabled={busy || mediaMissing}
            onClick={onCreateDraft}
            data-testid="meta-ai-create-draft"
          >
            {t("metaCampaigns.ai.draft.approveCreate")}
          </button>
          <p className="text-xs font-semibold text-slate-500" data-testid="meta-ai-paused-warning">
            {t("metaCampaigns.ai.draft.pausedWarning")}
          </p>
        </div>
      )}
    </div>
  );
}
