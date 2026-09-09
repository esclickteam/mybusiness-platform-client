import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Users,
  ClipboardList,
  Filter,
  History,
  StickyNote,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";
import { getIntlLocale, getTextDirection } from "../../i18n/localeUtils";
import { useBillingMarket } from "../../billing/useBillingMarket";
import {
  formatMarketMoney,
  persistBillingCountry,
} from "../../billing/billingMarkets";
import { billingCheckoutErrorMessage } from "../../components/billing/billingCopy";

const CRM_FEATURES = [
  { icon: ClipboardList, labelKey: "leftover.offerCrm.featureLeads", fallback: "Full lead and pipeline management" },
  { icon: Users, labelKey: "leftover.offerCrm.featureClients", fallback: "Customer and lead/client details" },
  { icon: StickyNote, labelKey: "leftover.offerCrm.featureNotes", fallback: "Notes, tasks, and follow-ups" },
  { icon: Filter, labelKey: "leftover.offerCrm.featureSearch", fallback: "Advanced search and filters" },
  { icon: History, labelKey: "leftover.offerCrm.featureHistory", fallback: "CRM activity history" },
  { icon: LayoutDashboard, labelKey: "leftover.offerCrm.featureDash", fallback: "CRM dashboard and data" },
];

/**
 * Hidden private offer page for the CRM-only plan.
 * Direct URL only. Marked noindex,nofollow (Helmet + X-Robots-Tag + DOM meta).
 */
export default function CrmOfferPage() {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const navigate = useNavigate();
  const { user } = useAuth();
  const billingMarket = useBillingMarket();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = user?._id || user?.userId || user?.id;
  const crmPriceLabel = formatMarketMoney(
    billingMarket.prices.crmMonthly,
    billingMarket.currency,
    getIntlLocale(i18n.language)
  );

  useEffect(() => {
    const ensure = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    ensure("robots", "noindex,nofollow");
    ensure("googlebot", "noindex,nofollow");
  }, []);

  const startCheckout = async () => {
    setError("");
    if (!userId) {
      navigate("/register?plan=crm_only");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/stripe/create-checkout-session", {
        plan: "crm_only",
        language: i18n.language,
        billingCountry: persistBillingCountry(
          user?.billingCountry || billingMarket.billingCountry
        ),
      });
      if (data?.code === "REGIONAL_PRICE_UNAVAILABLE") {
        setError(billingCheckoutErrorMessage(t, data.code));
        return;
      }
      if (data?.url) {
        window.location.assign(data.url);
        return;
      }
      setError(t("leftover.offerCrm.payError", "We could not start payment. Try again."));
    } catch (err) {
      const code = err?.response?.data?.code;
      if (code === "SUBSCRIPTION_ALREADY_ACTIVE") {
        setError(
          t(
            "leftover.offerCrm.alreadyActive",
            "An active subscription already exists on your account. Manage or change it in billing."
          )
        );
      } else if (code === "REGIONAL_PRICE_UNAVAILABLE") {
        setError(billingCheckoutErrorMessage(t, code));
      } else {
        setError(
          err?.response?.data?.error ||
            t("leftover.offerCrm.payError", "We could not start payment. Try again.")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={pageDir}
      lang={i18n.language}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12"
    >
      <Helmet>
        <title>{t("leftover.offerCrm.seoTitle", "CRM only — BizUply")}</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>

      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-sm font-bold text-emerald-700">
            {t("leftover.offerCrm.badge", "Special offer")}
          </span>
          <h1 className="mt-5 text-3xl font-black text-slate-900 sm:text-4xl">
            {t("leftover.offerCrm.title", "CRM only")}
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600">
            {t("leftover.offerCrm.subtitle", "Manage all of your leads and customers in one place.")}
          </p>

          <div className="mt-6 flex items-end justify-center gap-2">
            <span className="text-5xl font-black text-slate-900">{crmPriceLabel}</span>
            <span className="mb-2 text-lg font-semibold text-slate-500">
              {t("leftover.offerCrm.perMonth", "/ month")}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("leftover.offerCrm.billingHint", "Renews monthly.")}
          </p>
        </div>

        <ul className="mt-8 space-y-3">
          {CRM_FEATURES.map(({ icon: Icon, labelKey, fallback }) => (
            <li
              key={labelKey}
              className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {t(labelKey, fallback)}
              </span>
              <Check
                size={18}
                className="ms-auto text-emerald-500"
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700"
          >
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={startCheckout}
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? t("leftover.offerCrm.wait", "One moment…")
            : t("leftover.offerCrm.cta", "Start with CRM")}
        </button>

        <p className="mt-4 text-center text-xs font-medium text-slate-400">
          {t("leftover.offerCrm.secure", "Secure payment with Stripe · Cancel anytime.")}
        </p>
      </div>
    </div>
  );
}
