import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import annexEn from "../../legal-annex/en.json";
import annexHe from "../../legal-annex/he.json";
import annexEs from "../../legal-annex/es.json";
import annexPt from "../../legal-annex/pt-BR.json";
import annexAr from "../../legal-annex/ar.json";
import { billingMarketFromCountry, planAmount, type BillingMarket } from "../../billing/billingMarkets";
import { getIntlLocale } from "../../i18n/localeUtils";

type Plan = "monthly" | "yearly" | "website" | "crm_only";

const INTERVAL: Record<Plan, "month" | "year"> = {
  monthly: "month",
  yearly: "year",
  website: "year",
  crm_only: "month",
};

export default function SubscriptionTermsNotice({
  plan,
  billingCountry,
}: {
  plan: Plan;
  billingCountry?: string | null;
}) {
  const { t, i18n } = useTranslation();
  const market: BillingMarket = billingMarketFromCountry(billingCountry);
  const amount = planAmount(plan, market);
  const price = new Intl.NumberFormat(getIntlLocale(i18n.language), {
    style: "currency",
    currency: market.currency,
  }).format(amount);

  const language = String(i18n.language || "en").toLowerCase();
  const subscriptionTitle = language.startsWith("he") || language.startsWith("iw")
    ? annexHe.docs.subscriptions.title
    : language.startsWith("es")
      ? annexEs.docs.subscriptions.title
      : language.startsWith("pt")
        ? annexPt.docs.subscriptions.title
        : language.startsWith("ar")
          ? annexAr.docs.subscriptions.title
          : annexEn.docs.subscriptions.title;

  return (
    <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
      {t("billingNotice.subscription", {
        price,
        interval: t(`billingNotice.${INTERVAL[plan]}`),
      })}{" "}
      <Link className="underline" to="/legal/subscriptions">{subscriptionTitle}</Link>
    </p>
  );
}
