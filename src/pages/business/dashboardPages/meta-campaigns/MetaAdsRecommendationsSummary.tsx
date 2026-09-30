import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { listAiCampaignRecommendations } from "../../../../api/metaCampaignsApi";
import { cardBase } from "../../../../styles/bizuplyUi";
import { recommendationFilterBucket } from "./localizeMetaRecommendation";

export default function MetaAdsRecommendationsSummary({
  businessId,
  basePath,
}: {
  businessId: string;
  basePath: string;
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
      <Link
        to={`${basePath}/recommendations`}
        className="mt-2 inline-flex text-sm font-black text-violet-700 underline"
      >
        {t("metaCampaigns.recommendations.viewCta")}
      </Link>
    </section>
  );
}
