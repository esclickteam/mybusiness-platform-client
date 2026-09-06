import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchPartnerBranding,
  fetchPartnerMe,
  fetchPartnerPricebook,
  partnerApiError,
} from "../../lib/partnerApi";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import PartnerBrandingCard from "../../components/partner/PartnerBrandingCard";
import {
  PartnerCard,
  PartnerPrimaryButton,
  PartnerGhostButton,
} from "../../components/partner/partnerUi";

export default function PartnerMyPage() {
  const { t } = useTranslation();
  const [personalUrl, setPersonalUrl] = useState("");
  const [plansUrl, setPlansUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [salesCount, setSalesCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetchPartnerMe(),
      fetchPartnerBranding(),
      fetchPartnerPricebook().catch(() => []),
    ])
      .then(([me, data, pricebook]) => {
        const urls = data.urls || data.branding?.urls || {};
        setPersonalUrl(
          data.branding?.stored?.subdomain || data.branding?.subdomain
            ? `https://${data.branding.stored?.subdomain || data.branding.subdomain}.bizuply.com`
            : urls.personalUrl ||
              urls.slugUrl ||
              (me.slug ? `${window.location.origin}/p/${me.slug}` : "")
        );
        setPlansUrl(
          urls.plansUrl || (me.slug ? `${window.location.origin}/p/${me.slug}/plans` : "")
        );
        setSalesCount(
          pricebook.filter((row) => row.enabledInStorefront || row.visibleOnSalesPage).length
        );
      })
      .catch((err) => setError(partnerApiError(err, t("partner.errors.page"))));
  }, [t]);

  async function copy(url: string, key: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setError(t("partner.errors.copy"));
    }
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={t("partner.myPage.title")}
        title={t("partner.myPage.personalLink")}
        subtitle={t("partner.myPage.intro")}
      />

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}

      <PartnerCard className="space-y-4 p-6">
        <h2 className="text-lg font-black">{t("partner.myPage.personalLink")}</h2>
        <p className="break-all text-sm font-bold text-violet-700">{personalUrl}</p>
        <div className="flex flex-wrap gap-2">
          <PartnerPrimaryButton type="button" onClick={() => copy(personalUrl, "home")}>
            {copied === "home" ? t("partner.copied") : t("partner.copy")}
          </PartnerPrimaryButton>
          <a
            href={personalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm"
          >
            {t("partner.open")}
          </a>
          <a
            href={plansUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm"
          >
            {t("partner.myPage.plansPage")}
          </a>
          <PartnerGhostButton type="button" onClick={() => copy(plansUrl, "plans")}>
            {copied === "plans" ? t("partner.copied") : t("partner.myPage.copyPlans")}
          </PartnerGhostButton>
        </div>
        <p className="text-xs font-bold text-slate-500">{t("partner.myPage.catalogHint")}</p>
        {salesCount === 0 ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            {t("partner.myPage.noSaleItems")}
          </p>
        ) : salesCount != null ? (
          <p className="text-xs font-bold text-emerald-700">
            {t("partner.myPage.salesCount", { count: salesCount })}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Link to="/partner/dashboard/pricing" className="text-sm font-black text-violet-700">
            {t("partner.myPage.products")}
          </Link>
          <Link to="/partner/dashboard/storefront" className="text-sm font-black text-violet-700">
            {t("partner.myPage.catalogSettings")}
          </Link>
          <Link to="/partner/dashboard/settings" className="text-sm font-black text-violet-700">
            {t("partner.myPage.branding")}
          </Link>
        </div>
      </PartnerCard>

      <PartnerBrandingCard showPersonalLink={false} />
    </div>
  );
}
