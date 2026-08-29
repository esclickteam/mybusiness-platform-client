import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  dismissAiCampaignRecommendation,
  getMetaCampaignHealth,
  listAiCampaignRecommendations,
  viewAiCampaignRecommendation,
  type AiCampaignRecommendation,
  type CampaignHealth,
  type CampaignHealthStatus,
} from "../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import { formatCurrency, formatPercent } from "./metaCampaignUtils";

type Props = {
  businessId: string;
  campaignId?: string;
  currency?: string;
  highlightRecommendationId?: string;
  variant?: "campaign" | "list";
  onOpenCampaign?: (campaignId: string) => void;
};

const STATUS_DOT: Record<CampaignHealthStatus, string> = {
  HEALTHY: "bg-emerald-500",
  WATCH: "bg-amber-400",
  ACTION_RECOMMENDED: "bg-orange-500",
  CRITICAL: "bg-rose-600",
};

function formatDelta(value?: number | null) {
  if (value == null || Number.isNaN(value)) return null;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(0)}%`;
}

function RecommendationCard({
  rec,
  businessId,
  currency,
  highlight,
  onDismiss,
  onOpen,
}: {
  rec: AiCampaignRecommendation;
  businessId: string;
  currency: string;
  highlight?: boolean;
  onDismiss: (id: string) => void;
  onOpen?: (campaignId: string) => void;
}) {
  const { t } = useTranslation();
  const editorPath = `/business/${businessId}/dashboard/meta-campaigns/edit/${rec.metaCampaignId}`;
  const wizardPath = `/business/${businessId}/dashboard/meta-campaigns/create-ai`;
  const change = rec.metricsSummary?.changes?.cplPct ?? rec.metricsSummary?.changes?.ctrPct;
  return (
    <article
      data-testid={`recommendation-card-${rec.id}`}
      className={`rounded-xl border p-3 ${
        highlight ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-sm font-black text-slate-900">
        {rec.severity === "CRITICAL" ? "⚠️ " : rec.severity === "OPPORTUNITY" ? "✨ " : ""}
        {rec.title}
      </p>
      {change != null ? (
        <p className="mt-1 text-xs font-bold text-slate-500">
          {formatDelta(change)} {t("metaCampaigns.campaignHealth.versusPrevious")}
        </p>
      ) : null}
      {rec.aiGenerated ? (
        <p className="mt-2 text-sm font-semibold text-slate-700">
          {t("metaCampaigns.campaignHealth.aiLabel")}: {rec.explanation}
        </p>
      ) : (
        <p className="mt-2 text-sm font-semibold text-slate-700">{rec.finding}</p>
      )}
      <p className="mt-2 text-sm font-bold text-slate-800">
        {t("metaCampaigns.campaignHealth.recommendationLabel")}: {rec.recommendedAction}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {rec.recommendedActionType === "CREATE_NEW_VARIANT" ? (
          <Link to={wizardPath} className={btnPrimary}>
            {t("metaCampaigns.campaignHealth.createVariant")}
          </Link>
        ) : null}
        {onOpen ? (
          <button type="button" className={btnSecondary} onClick={() => onOpen(rec.metaCampaignId)}>
            {t("metaCampaigns.campaignHealth.openCampaign")}
          </button>
        ) : (
          <Link to={editorPath} className={btnSecondary}>
            {t("metaCampaigns.campaignHealth.openCampaign")}
          </Link>
        )}
        {rec.status === "OPEN" || rec.status === "VIEWED" ? (
          <button type="button" className={btnSecondary} onClick={() => onDismiss(rec.id)}>
            {t("metaCampaigns.campaignHealth.notNow")}
          </button>
        ) : null}
      </div>
      {currency ? (
        <p className="sr-only">{currency}</p>
      ) : null}
    </article>
  );
}

export default function MetaCampaignHealthPanel({
  businessId,
  campaignId,
  currency = "ILS",
  highlightRecommendationId,
  variant = "campaign",
  onOpenCampaign,
}: Props) {
  const { t } = useTranslation();
  const [health, setHealth] = useState<CampaignHealth | null>(null);
  const [openRecs, setOpenRecs] = useState<AiCampaignRecommendation[]>([]);
  const [closedRecs, setClosedRecs] = useState<AiCampaignRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      if (campaignId && variant === "campaign") {
        const next = await getMetaCampaignHealth(businessId, campaignId);
        setHealth(next);
      }
      const [open, closed] = await Promise.all([
        listAiCampaignRecommendations(businessId, "open"),
        listAiCampaignRecommendations(businessId, "closed"),
      ]);
      const filter = (rows: AiCampaignRecommendation[]) =>
        campaignId ? rows.filter((row) => row.metaCampaignId === campaignId) : rows;
      setOpenRecs(filter(open));
      setClosedRecs(filter(closed));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!businessId) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, campaignId, variant]);

  useEffect(() => {
    if (!businessId || !highlightRecommendationId) return;
    void viewAiCampaignRecommendation(businessId, highlightRecommendationId).catch(() => {});
  }, [businessId, highlightRecommendationId]);

  const status = health?.healthStatus || (openRecs.some((r) => r.severity === "CRITICAL")
    ? "CRITICAL"
    : openRecs.some((r) => r.severity === "WARNING")
      ? "ACTION_RECOMMENDED"
      : openRecs.some((r) => r.severity === "OPPORTUNITY")
        ? "WATCH"
        : "HEALTHY");

  const metrics = health?.metrics;
  const primaryRec = useMemo(
    () =>
      openRecs.find((row) => row.id === highlightRecommendationId) ||
      health?.recommendation ||
      openRecs[0] ||
      null,
    [openRecs, health, highlightRecommendationId]
  );

  const onDismiss = async (id: string) => {
    await dismissAiCampaignRecommendation(businessId, id);
    await load();
  };

  return (
    <section
      data-testid="campaign-health-panel"
      data-health-status={status}
      className={`${cardBase} p-4`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
        <p className="text-sm font-black text-slate-900">
          {t("metaCampaigns.campaignHealth.title")}
        </p>
      </div>
      <p className="mt-1 text-sm font-bold text-slate-700">
        {t(`metaCampaigns.campaignHealth.status.${status}`)}
      </p>

      {loading ? (
        <p className="mt-3 text-sm font-semibold text-slate-500">
          {t("metaCampaigns.campaignHealth.loading")}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm font-semibold text-rose-600">
          {t("metaCampaigns.campaignHealth.error")}
        </p>
      ) : null}
      {!loading && !error && !campaignId && openRecs.length === 0 && closedRecs.length === 0 ? (
        <p className="mt-3 text-sm font-semibold text-slate-500">
          {t("metaCampaigns.campaignHealth.empty")}
        </p>
      ) : null}

      {metrics ? (
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="font-semibold text-slate-500">{t("metaCampaigns.campaignHealth.cpl")}</dt>
            <dd className="font-black text-slate-900">
              {formatCurrency(metrics.cpl || 0, currency)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-semibold text-slate-500">{t("metaCampaigns.campaignHealth.ctr")}</dt>
            <dd className="font-black text-slate-900">{formatPercent(metrics.ctr || 0)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-semibold text-slate-500">{t("metaCampaigns.campaignHealth.cpc")}</dt>
            <dd className="font-black text-slate-900">
              {formatCurrency(metrics.cpc || 0, currency)}
            </dd>
          </div>
        </dl>
      ) : null}

      {status === "HEALTHY" && !primaryRec ? (
        <p className="mt-3 text-sm font-semibold text-slate-600">
          {t("metaCampaigns.campaignHealth.noChanges")}
        </p>
      ) : null}

      {primaryRec && status !== "HEALTHY" ? (
        <p className="mt-3 text-sm font-semibold text-slate-700">{primaryRec.finding}</p>
      ) : null}

      {openRecs.length ? (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
            {t("metaCampaigns.campaignHealth.openList")}
          </p>
          {openRecs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              businessId={businessId}
              currency={currency}
              highlight={rec.id === highlightRecommendationId}
              onDismiss={onDismiss}
              onOpen={onOpenCampaign}
            />
          ))}
        </div>
      ) : null}

      {closedRecs.length ? (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
            {t("metaCampaigns.campaignHealth.closedList")}
          </p>
          {closedRecs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              businessId={businessId}
              currency={currency}
              onDismiss={onDismiss}
              onOpen={onOpenCampaign}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
