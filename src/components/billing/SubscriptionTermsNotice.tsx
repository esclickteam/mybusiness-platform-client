import { useTranslation } from "react-i18next";
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

  return (
    <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
      {t("billingNotice.subscription", {
        price,
        interval: t(`billingNotice.${INTERVAL[plan]}`),
      })}
    </p>
  );
}
