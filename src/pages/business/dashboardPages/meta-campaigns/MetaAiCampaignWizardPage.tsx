import React from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Sparkles } from "lucide-react";
import { btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

type OutletCtx = { businessId: string | null };

export default function MetaAiCampaignWizardPage() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { businessId } = useOutletContext<OutletCtx>();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const overviewPath = `/business/${urlBusinessId || businessId}/dashboard/meta-campaigns/overview`;

  return (
    <div dir={dir} className="space-y-4" data-testid="meta-ai-campaign-wizard">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            {t("metaCampaigns.ai.badge")}
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {t("metaCampaigns.ai.title")}
          </h2>
          <p className="mt-1 max-w-2xl text-sm font-semibold text-slate-500">
            {t("metaCampaigns.ai.subtitle")}
          </p>
        </div>
        <Link to={overviewPath} className={btnSecondary}>
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("metaCampaigns.ai.back")}
        </Link>
      </div>

      <div className={`${cardBase} p-6 sm:p-8`}>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-violet-200 bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-violet-700">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="mt-4 text-sm font-bold text-slate-600">
            {t("metaCampaigns.ai.placeholder")}
          </p>
        </div>
      </div>
    </div>
  );
}
