import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, Loader2, Pencil, RefreshCw, Send, Sparkles } from "lucide-react";
import {
  btnPrimary,
  btnSecondary,
  inputBase,
} from "../../../../styles/bizuplyUi";
import {
  type AiCampaignProposal,
  type AiCampaignSessionResponse,
} from "../../../../api/metaAiCampaignApi";
import AdPlacementPreview from "./AdPlacementPreview";
import MetaLeadFormLivePreview from "./MetaLeadFormLivePreview";
import MetaAiDraftPublishPanel from "./MetaAiDraftPublishPanel";
import { META_AD_CTAS, metaCtaLabel } from "./ads-manager/metaAdCtas";

type AvailableLeadForm = { id: string; name?: string | null };

function intentField(session: AiCampaignSessionResponse, field: string) {
  const intent = session.intent as Record<string, { value?: unknown }> | undefined;
  return intent?.[field]?.value ?? null;
}

function promotedName(session: AiCampaignSessionResponse) {
  const value = intentField(session, "promotedItem") as { name?: string } | null;
  return value?.name || "";
}

function destinationKey(session: AiCampaignSessionResponse) {
  const value = intentField(session, "destination") as { key?: string } | string | null;
  if (!value) return session.proposal?.campaign ? null : null;
  return typeof value === "string" ? value : value.key || null;
}

function availableLeadForms(session: AiCampaignSessionResponse): AvailableLeadForm[] {
  const rows = session.generation?.meta?.availableLeadForms;
  return Array.isArray(rows) ? (rows as AvailableLeadForm[]) : [];
}

export default function MetaAiCampaignPreview({
  session,
  busy,
  pendingAction,
  onRevise,
  onRegenerate,
  onManualEdit,
  onPatch,
  onUploadCreative,
  onCreateDraft,
  onRetryDraft,
  onConfirmLocations,
  onRequestPublish,
  onConfirmPublish,
  onCancelPublish,
  confirmOpen,
  activationTree,
  onEditBeforePublish,
  onViewCampaign,
  onBackToCampaigns,
}: {
  session: AiCampaignSessionResponse;
  busy: boolean;
  pendingAction: string | null;
  onRevise: (instruction: string) => void;
  onRegenerate: () => void;
  onManualEdit: () => void;
  onPatch: (patch: Record<string, unknown>) => void;
  onUploadCreative: (file: File) => void;
  onCreateDraft: () => void;
  onRetryDraft: () => void;
  onConfirmLocations: (choices: Array<Record<string, unknown>>) => void;
  onRequestPublish: () => void;
  onConfirmPublish: () => void;
  onCancelPublish: () => void;
  confirmOpen: boolean;
  activationTree?: { campaign?: string | null; adSet?: string | null; ad?: string | null };
  onEditBeforePublish: () => void;
  onViewCampaign: () => void;
  onBackToCampaigns: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [reviseDraft, setReviseDraft] = useState("");
  const [formScreen, setFormScreen] = useState<"intro" | "questions" | "privacy" | "thanks">(
    "intro"
  );
  const proposal = session.proposal as AiCampaignProposal;
  const language = String(i18n.language || "he").toLowerCase().startsWith("en")
    ? "en"
    : "he";
  const dest = destinationKey(session) || (proposal.leadForm ? "LEAD_FORM" : null);
  const forms = availableLeadForms(session);
  const mediaMissing = proposal.creative.media?.status !== "PROVIDED";
  const budget = proposal.adSet.dailyBudget || proposal.adSet.lifetimeBudget;
  const locations = (proposal.adSet.locations || [])
    .map((item) => item.name)
    .filter(Boolean)
    .join(", ");
  const ctaLabel = metaCtaLabel(proposal.creative.ctaKey);
  const pageName = t("metaCampaigns.ai.preview.pageFallback");
  const objectiveKey = proposal.campaign.objectiveKey;
  const objectiveLabel = objectiveKey
    ? t(`metaCampaigns.ai.objectives.${objectiveKey}`, {
        defaultValue: objectiveKey,
      })
    : "—";
  const destinationLabel = dest
    ? t(`metaCampaigns.ai.destinations.${dest}`, { defaultValue: dest })
    : "—";
  const placementLabel =
    proposal.adSet.placements.recommendation === "ADVANTAGE"
      ? t("metaCampaigns.ai.preview.placementsAdvantage")
      : proposal.adSet.placements.surfaces.join(", ") ||
        t("metaCampaigns.ai.preview.placementsManual");

  const summary = useMemo(
    () => [
      { label: t("metaCampaigns.ai.preview.objective"), value: objectiveLabel },
      {
        label: t("metaCampaigns.ai.preview.item"),
        value: promotedName(session) || "—",
      },
      {
        label: t("metaCampaigns.ai.preview.budget"),
        value: budget
          ? `${budget.amount} ${budget.currency} ${t("metaCampaigns.ai.preview.perDay")}`
          : "—",
      },
      { label: t("metaCampaigns.ai.preview.locations"), value: locations || "—" },
      { label: t("metaCampaigns.ai.preview.destination"), value: destinationLabel },
      {
        label: t("metaCampaigns.ai.preview.audience"),
        value: proposal.adSet.audience.summary || "—",
      },
      { label: t("metaCampaigns.ai.preview.placements"), value: placementLabel },
    ],
    [
      budget,
      destinationLabel,
      locations,
      objectiveLabel,
      placementLabel,
      proposal.adSet.audience.summary,
      session,
      t,
    ]
  );

  const draft = proposal.leadForm?.draft;
  const lifecycle = session.lifecycle || session.metaDraft?.status || "IDLE";
  const lockedAfterDraft =
    lifecycle === "META_DRAFT_CREATED" ||
    lifecycle === "PUBLISHED" ||
    lifecycle === "CREATING_META_DRAFT";

  return (
    <div className="space-y-5" data-testid="meta-ai-preview">
      <div>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-violet-700">
          <Sparkles className="h-3.5 w-3.5" />
          {t("metaCampaigns.ai.badge")}
        </p>
        <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
          {t("metaCampaigns.ai.preview.title")}
        </h3>
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-testid="meta-ai-preview-summary">
        {summary.map((row) => (
          <div key={row.label} className="rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-[11px] font-black uppercase tracking-wide text-slate-500">
              {row.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-800">{row.value}</dd>
          </div>
        ))}
      </dl>

      {(proposal.strategy.audienceWhy ||
        proposal.strategy.creativeWhy ||
        proposal.strategy.settingsWhy) && (
        <div className="space-y-2 rounded-md border border-violet-100 bg-violet-50/70 p-3">
          <p className="text-xs font-black uppercase tracking-wide text-violet-800">
            {t("metaCampaigns.ai.preview.strategy")}
          </p>
          {proposal.strategy.audienceWhy ? (
            <p className="text-sm font-semibold text-slate-700">
              <span className="font-black">{t("metaCampaigns.ai.preview.audienceWhy")}: </span>
              {proposal.strategy.audienceWhy}
            </p>
          ) : null}
          {proposal.strategy.creativeWhy ? (
            <p className="text-sm font-semibold text-slate-700">
              <span className="font-black">{t("metaCampaigns.ai.preview.creativeWhy")}: </span>
              {proposal.strategy.creativeWhy}
            </p>
          ) : null}
          {proposal.strategy.settingsWhy ? (
            <p className="text-sm font-semibold text-slate-700">
              <span className="font-black">{t("metaCampaigns.ai.preview.settingsWhy")}: </span>
              {proposal.strategy.settingsWhy}
            </p>
          ) : null}
        </div>
      )}

      {mediaMissing ? (
        <div
          className="flex flex-col gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center sm:justify-between"
          data-testid="meta-ai-missing-creative"
        >
          <p className="text-sm font-semibold text-amber-900">
            {t("metaCampaigns.ai.preview.missingCreative")}
          </p>
          <label className={`${btnSecondary} cursor-pointer`}>
            <ImagePlus className="h-4 w-4" />
            {t("metaCampaigns.ai.preview.uploadCreative")}
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={busy}
              data-testid="meta-ai-creative-upload"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUploadCreative(file);
              }}
            />
          </label>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
            {t("metaCampaigns.ai.preview.adPreview")}
          </p>
          <AdPlacementPreview
            adFormat="DESKTOP_FEED_STANDARD"
            pageName={pageName}
            primaryText={proposal.creative.primaryText}
            headline={proposal.creative.headline}
            description={proposal.creative.description}
            ctaLabel={ctaLabel}
            imageUrl={proposal.creative.media?.url || undefined}
            creativeFormat={proposal.creative.media?.kind === "video" ? "video" : "single"}
          />
          <label className="mt-3 block text-xs font-black uppercase tracking-wide text-slate-500">
            {t("metaCampaigns.ai.preview.cta")}
            <select
              className={`${inputBase} mt-1`}
              value={proposal.creative.ctaKey}
              disabled={busy}
              data-testid="meta-ai-cta"
              onChange={(event) =>
                onPatch({ creative: { ctaKey: event.target.value } })
              }
            >
              {META_AD_CTAS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {dest === "LEAD_FORM" ? (
          <div data-testid="meta-ai-lead-form">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
              {t("metaCampaigns.ai.preview.leadFormTitle")}
            </p>
            {forms.length ? (
              <select
                className={`${inputBase} mb-3`}
                disabled={busy}
                data-testid="meta-ai-lead-form-select"
                value={
                  proposal.leadForm?.mode === "EXISTING"
                    ? proposal.leadForm.existingFormId || ""
                    : "DRAFT"
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "DRAFT") {
                    onPatch({ leadForm: { mode: "DRAFT" } });
                    return;
                  }
                  const match = forms.find((item) => item.id === value);
                  onPatch({
                    leadForm: {
                      existingFormId: value,
                      existingFormName: match?.name || null,
                    },
                  });
                }}
              >
                <option value="DRAFT">{t("metaCampaigns.ai.preview.leadFormDraft")}</option>
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name || form.id}
                  </option>
                ))}
              </select>
            ) : null}

            {proposal.leadForm?.mode === "EXISTING" ? (
              <p className="rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                {t("metaCampaigns.ai.preview.leadFormExisting")}:{" "}
                {proposal.leadForm.existingFormName || proposal.leadForm.existingFormId}
              </p>
            ) : draft ? (
              <MetaLeadFormLivePreview
                pageName={pageName}
                introTitle={draft.introTitle || proposal.creative.headline}
                introDescription={draft.introBody || proposal.creative.primaryText}
                contactFields={draft.fields || ["FULL_NAME", "PHONE"]}
                customQuestions={[]}
                privacyLinkText={t("metaCampaigns.ai.preview.privacy")}
                thankYouTitle={draft.thankYouTitle || t("metaCampaigns.ai.preview.thanksTitle")}
                thankYouBody={draft.thankYouBody || t("metaCampaigns.ai.preview.thanksBody")}
                thankYouButton={ctaLabel}
                screen={formScreen}
                platform="facebook"
                locale={language === "en" ? "en_US" : "he_IL"}
                onScreenChange={setFormScreen}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <MetaAiDraftPublishPanel
        session={session}
        busy={busy}
        pendingAction={pendingAction}
        mediaMissing={mediaMissing}
        budgetLabel={
          budget
            ? `${budget.amount} ${budget.currency} ${t("metaCampaigns.ai.preview.perDay")}`
            : "—"
        }
        locationsLabel={locations}
        objectiveLabel={objectiveLabel}
        activationTree={activationTree}
        onCreateDraft={onCreateDraft}
        onRetryDraft={onRetryDraft}
        onConfirmLocations={onConfirmLocations}
        onRequestPublish={onRequestPublish}
        onConfirmPublish={onConfirmPublish}
        onCancelPublish={onCancelPublish}
        confirmOpen={confirmOpen}
        onEditBeforePublish={onEditBeforePublish}
        onViewCampaign={onViewCampaign}
        onBackToCampaigns={onBackToCampaigns}
      />

      {lockedAfterDraft ? null : (
      <>
      <form
        className="flex flex-col gap-2 sm:flex-row"
        data-testid="meta-ai-revise"
        onSubmit={(event) => {
          event.preventDefault();
          if (!reviseDraft.trim()) return;
          onRevise(reviseDraft.trim());
          setReviseDraft("");
        }}
      >
        <input
          className={inputBase}
          value={reviseDraft}
          onChange={(event) => setReviseDraft(event.target.value)}
          placeholder={t("metaCampaigns.ai.preview.revisePlaceholder")}
          maxLength={2000}
          disabled={busy}
        />
        <button
          type="submit"
          className={btnPrimary}
          disabled={busy || !reviseDraft.trim()}
        >
          {pendingAction === "revise" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {t("metaCampaigns.ai.preview.reviseSubmit")}
        </button>
      </form>
      <p className="text-xs font-semibold text-slate-500">
        {t("metaCampaigns.ai.preview.reviseExamples")}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          className={btnSecondary}
          onClick={onManualEdit}
          disabled={busy}
          data-testid="meta-ai-manual-edit"
        >
          <Pencil className="h-4 w-4" />
          {t("metaCampaigns.ai.preview.manualEdit")}
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={onRegenerate}
          disabled={busy}
          data-testid="meta-ai-regenerate"
        >
          {pendingAction === "regenerate" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {t("metaCampaigns.ai.preview.regenerate")}
        </button>
      </div>
      </>
      )}
    </div>
  );
}
