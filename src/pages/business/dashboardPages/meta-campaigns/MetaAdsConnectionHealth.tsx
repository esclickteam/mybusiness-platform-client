import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { cardBase } from "../../../../styles/bizuplyUi";

type Props = {
  basePath: string;
  accountName?: string;
  pageName?: string;
  instagramConnected: boolean;
  tokenHealthy: boolean;
  lastSync?: string;
  needsAction: boolean;
};

export default function MetaAdsConnectionHealth({
  basePath,
  accountName,
  pageName,
  instagramConnected,
  tokenHealthy: _tokenHealthy,
  lastSync,
  needsAction,
}: Props) {
  const { t } = useTranslation();
  return (
    <section className={`${cardBase} p-4`} data-testid="meta-connection-health">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-900">{t("metaCampaigns.ux.connectionTitle")}</p>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {t("metaCampaigns.ux.adAccount")}: {accountName || "—"}
          </p>
          <p className="text-sm font-semibold text-slate-600">
            {t("metaCampaigns.ux.facebookPage")}: {pageName || "—"}
          </p>
          <p className="text-sm font-semibold text-slate-600">
            {t("metaCampaigns.ux.instagram")}:{" "}
            {instagramConnected ? t("metaCampaigns.ux.connected") : t("metaCampaigns.ux.notConnected")}
          </p>
          {lastSync ? (
            <p className="mt-1 text-xs font-semibold text-slate-400">{lastSync}</p>
          ) : null}
        </div>
        {needsAction ? (
          <TriangleAlert className="h-5 w-5 text-amber-500" aria-hidden />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
        )}
      </div>
      {needsAction ? (
        <Link to={`${basePath}/settings`} className="mt-3 inline-flex text-sm font-black text-amber-800 underline">
          {t("metaCampaigns.ux.fixConnection")}
        </Link>
      ) : null}
    </section>
  );
}
