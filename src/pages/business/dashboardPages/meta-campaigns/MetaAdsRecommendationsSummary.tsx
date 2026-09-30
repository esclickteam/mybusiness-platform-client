import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { listAiCampaignRecommendations } from "../../../../api/metaCampaignsApi";
import { cardBase } from "../../../../styles/bizuplyUi";
import { recommendationFilterBucket } from "./localizeMetaRecommendation";

/** Compact summary only — no customer tab. Prefer MetaAdsOverviewSignals. */
export default function MetaAdsRecommendationsSummary({
  businessId,
}: {
  businessId: string;
  basePath?: string;
}) {
  const { t } = useTranslation();
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    if (!businessId) return;
    void listAiCampaignRecommendations(businessId, "open")
      .then((rows) =>
        setOpenCount(rows.filter((row) => recommendationFilterBucket(row.status) === "open").length)
      )
      .catch(() => setOpenCount(0));
  }, [businessId]);

  return (
    <section className={`${cardBase} p-4`} data-testid="meta-recommendations-summary">
      <p className="text-sm font-black text-slate-900">
        {t("metaCampaigns.recommendations.openCount", { count: openCount })}
      </p>
    </section>
  );
}
