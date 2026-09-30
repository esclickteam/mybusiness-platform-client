import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  applyAiCampaignRecommendation,
  dismissAiCampaignRecommendation,
  listAiCampaignRecommendations,
  undoAiCampaignRecommendation,
  viewAiCampaignRecommendation,
  type AiCampaignRecommendation,
} from "../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import { formatDateTimeHe } from "./metaCampaignUtils";
import {
  localizeRecommendationCopy,
  recommendationFilterBucket,
} from "./localizeMetaRecommendation";

type Filter = "all" | "open" | "applied" | "dismissed";

export default function MetaAdsRecommendationsPage() {
  const { t, i18n } = useTranslation();
  const { businessId } = useOutletContext<{ businessId: string }>();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("recommendationId") || "";
  const campaignId = searchParams.get("campaignId") || "";
  const [rows, setRows] = useState<AiCampaignRecommendation[]>([]);
  const [filter, setFilter] = useState<Filter>("open");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<AiCampaignRecommendation | null>(null);
  const [notice, setNotice] = useState("");

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [open, closed] = await Promise.all([
        listAiCampaignRecommendations(businessId, "open"),
        listAiCampaignRecommendations(businessId, "closed"),
      ]);
      const merged = [...open, ...closed];
      setRows(
        campaignId
          ? merged.filter((row) => row.metaCampaignId === campaignId)
          : merged
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, campaignId]);

  useEffect(() => {
    if (!businessId || !highlightId) return;
    void viewAiCampaignRecommendation(businessId, highlightId).catch(() => {});
  }, [businessId, highlightId]);

  const visible = useMemo(
    () =>
      rows.filter((row) =>
        filter === "all" ? true : recommendationFilterBucket(row.status) === filter
      ),
    [filter, rows]
  );

  const onReview = async (rec: AiCampaignRecommendation) => {
    await viewAiCampaignRecommendation(businessId, rec.id).catch(() => {});
    if (rec.applyable) setPending(rec);
  };

  const onConfirmApply = async () => {
    if (!pending) return;
    const result = await applyAiCampaignRecommendation(businessId, pending.id);
    setPending(null);
    setNotice(
      result.applied
        ? t("metaCampaigns.campaignHealth.applied")
        : t("metaCampaigns.campaignHealth.applyFailed")
    );
    await load();
  };

  return (
    <div className="space-y-4" data-testid="meta-recommendations-page">
      <section className={`${cardBase} p-4`}>
        <h2 className="text-lg font-black text-slate-900">
          {t("metaCampaigns.recommendations.title")}
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {t("metaCampaigns.recommendations.subtitle")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "open", "applied", "dismissed"] as Filter[]).map((key) => (
            <button
              key={key}
              type="button"
              className={filter === key ? btnPrimary : btnSecondary}
              onClick={() => setFilter(key)}
            >
              {t(`metaCampaigns.recommendations.filters.${key}`)}
            </button>
          ))}
        </div>
      </section>

      {notice ? (
        <p className="text-sm font-semibold text-slate-700">{notice}</p>
      ) : null}
      {loading ? (
        <p className="text-sm font-semibold text-slate-500">
          {t("metaCampaigns.recommendations.loading")}
        </p>
      ) : null}
      {!loading && visible.length === 0 ? (
        <p className="text-sm font-semibold text-slate-500">
          {t("metaCampaigns.recommendations.empty")}
        </p>
      ) : null}

      <div className="space-y-3">
        {visible.map((rec) => {
          const copy = localizeRecommendationCopy(rec, t, i18n.language);
          const bucket = recommendationFilterBucket(rec.status);
          return (
            <article
              key={rec.id}
              data-testid={`recommendation-card-${rec.id}`}
              className={`rounded-2xl border p-4 ${
                rec.id === highlightId
                  ? "border-violet-400 bg-violet-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="text-base font-black text-slate-900">{copy.title}</h3>
              <p className="mt-1 text-sm font-bold text-slate-700">{copy.campaignName}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">{copy.body}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {t("metaCampaigns.recommendations.whyLabel")}: {copy.why}
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-400">
                {formatDateTimeHe(rec.updatedAt || rec.createdAt || rec.freshness?.generatedAt)}
              </p>
              <p className="mt-1 text-xs font-black text-slate-500">
                {t(`metaCampaigns.recommendations.status.${bucket}`)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {bucket === "open" ? (
                  <>
                    <button
                      type="button"
                      className={btnPrimary}
                      onClick={() => void onReview(rec)}
                    >
                      {t("metaCampaigns.recommendations.review")}
                    </button>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={async () => {
                        await dismissAiCampaignRecommendation(businessId, rec.id);
                        await load();
                      }}
                    >
                      {t("metaCampaigns.campaignHealth.notNow")}
                    </button>
                  </>
                ) : null}
                {bucket === "applied" ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    {t("metaCampaigns.recommendations.status.applied")}
                  </span>
                ) : null}
                {rec.undoable ? (
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={async () => {
                      await undoAiCampaignRecommendation(businessId, rec.id);
                      await load();
                    }}
                  >
                    {t("metaCampaigns.campaignHealth.undo")}
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {pending ? (
        <div className={`${cardBase} p-4`} data-testid="recommendation-confirm">
          <p className="text-sm font-black text-slate-900">
            {t("metaCampaigns.campaignHealth.confirmTitle")}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {localizeRecommendationCopy(pending, t, i18n.language).campaignName}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {t("metaCampaigns.recommendations.confirmHint")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} onClick={() => void onConfirmApply()}>
              {t("metaCampaigns.campaignHealth.confirmApply")}
            </button>
            <button type="button" className={btnSecondary} onClick={() => setPending(null)}>
              {t("metaCampaigns.campaignHealth.cancel")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
