import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getMetaPortfolio,
  listAiCampaignRecommendations,
  listCampaignGoals,
} from "../../../../api/metaCampaignsApi";
import { cardBase } from "../../../../styles/bizuplyUi";
import { recommendationFilterBucket } from "./localizeMetaRecommendation";

export default function MetaAdsOverviewSignals({
  businessId,
}: {
  businessId: string;
}) {
  const { t } = useTranslation();
  const [goalName, setGoalName] = useState<string | null>(null);
  const [openCount, setOpenCount] = useState(0);
  const [portfolioStatus, setPortfolioStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    void Promise.allSettled([
      listCampaignGoals(businessId),
      listAiCampaignRecommendations(businessId, "open"),
      getMetaPortfolio(businessId),
    ]).then(([goalsRes, recsRes, portfolioRes]) => {
      if (cancelled) return;
      if (goalsRes.status === "fulfilled") {
        const active =
          goalsRes.value.find((row) => row.status === "ACTIVE") || goalsRes.value[0];
        setGoalName(active?.name || null);
      }
      if (recsRes.status === "fulfilled") {
        setOpenCount(
          recsRes.value.filter((row) => recommendationFilterBucket(row.status) === "open")
            .length
        );
      }
      if (portfolioRes.status === "fulfilled") {
        setPortfolioStatus(portfolioRes.value.allocation?.status || null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  return (
    <section className={`${cardBase} p-3`} data-testid="meta-overview-signals">
      <p className="text-xs font-semibold text-slate-500">
        {goalName
          ? t("metaCampaigns.overview.currentGoal", { name: goalName })
          : t("metaCampaigns.overview.noGoal")}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-500">
        {t("metaCampaigns.recommendations.openCount", { count: openCount })}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-500">
        {portfolioStatus
          ? t("metaCampaigns.overview.optimizationStatus", { status: portfolioStatus })
          : t("metaCampaigns.overview.optimizationIdle")}
      </p>
    </section>
  );
}
