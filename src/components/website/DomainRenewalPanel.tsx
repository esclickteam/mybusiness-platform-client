import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw } from "lucide-react";

import {
  createDomainRenewalCheckout,
  getDomainRegistrations,
  retryDomainRenewal,
  type DomainRegistration,
  type DomainRenewalUiCta,
} from "../../services/domainService";
import { getIntlLocale, getTextDirection } from "../../i18n/localeUtils";

function formatDate(value?: string | null, locale = "en") {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale);
}

function formatPrice(value?: number | null, currency = "ILS", locale = "en") {
  if (!(typeof value === "number" && value > 0)) return null;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "ILS",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${currency || "ILS"}`;
  }
}

function resolveCta(reg: DomainRegistration): DomainRenewalUiCta {
  if (reg.uiCta) return reg.uiCta;
  const status = reg.renewal?.status || "not_due";
  if (status === "quote_required" || reg.renewalQuote?.quoteRequired) {
    return "request_quote";
  }
  if (status === "checkout_created") return "continue_payment";
  if (status === "paid" || status === "renewal_in_progress") return "in_progress";
  if (status === "renewal_failed") return "retry";
  if (status === "renewed") return "renewed";
  return "renew";
}

function ctaLabel(
  cta: DomainRenewalUiCta,
  t: (key: string) => string,
) {
  switch (cta) {
    case "request_quote":
      return t("sites.domain.requestQuote");
    case "continue_payment":
      return t("sites.domain.continuePayment");
    case "in_progress":
      return t("sites.domain.inProgress");
    case "retry":
      return t("sites.domain.retry");
    case "renewed":
      return t("sites.domain.renewed");
    default:
      return t("sites.domain.renewYear");
  }
}

export default function DomainRenewalPanel() {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const intlLocale = getIntlLocale(i18n.language);
  const [items, setItems] = useState<DomainRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getDomainRegistrations();
      const list = (result.registrations || []).filter((reg) =>
        ["registered", "expired"].includes(String(reg.status || "")),
      );
      setItems(list);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("sites.domain.loadFailed"),
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAction(reg: DomainRegistration) {
    const cta = resolveCta(reg);
    if (cta === "in_progress" || cta === "renewed" || cta === "request_quote") {
      return;
    }

    setBusyId(reg._id);
    setError("");
    try {
      if (cta === "retry") {
        const result = await retryDomainRenewal(
          reg._id,
          reg.renewal?.activeRenewalOrderId || undefined,
        );
        if (result.renewed || result.alreadyRenewed) {
          await load();
          return;
        }
        await load();
        return;
      }

      const result = await createDomainRenewalCheckout(reg._id);
      const url = result.checkoutUrl || result.url;
      if (url) {
        window.location.href = url;
        return;
      }
      throw new Error(t("sites.domain.noCheckout"));
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code || "")
          : "";
      if (code === "QUOTE_REQUIRED") {
        setError(t("sites.domain.quoteRequired"));
        await load();
      } else {
        setError(
          err instanceof Error ? err.message : t("sites.domain.actionFailed"),
        );
      }
    } finally {
      setBusyId("");
    }
  }

  if (loading) {
    return (
      <div
        dir={pageDir}
        className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500"
      >
        {t("sites.domain.loading")}
      </div>
    );
  }

  if (!items.length && !error) {
    return null;
  }

  return (
    <div dir={pageDir} className="mb-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            {t("sites.domain.title")}
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {t("sites.domain.subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          aria-label={t("sites.domain.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {items.map((reg) => {
        const cta = resolveCta(reg);
        const price =
          formatPrice(
            reg.renewalQuote?.customerRenewalPrice ??
              reg.renewal?.customerRenewalPrice,
            reg.renewalQuote?.currency || reg.renewal?.currency || "ILS",
            intlLocale,
          ) || "—";
        const days =
          typeof reg.daysUntilExpiry === "number"
            ? reg.daysUntilExpiry
            : null;
        const expired = reg.status === "expired" || (days != null && days < 0);
        const quoteRequired =
          cta === "request_quote" || Boolean(reg.renewalQuote?.quoteRequired);
        const disabled =
          busyId === reg._id ||
          cta === "in_progress" ||
          cta === "renewed" ||
          cta === "request_quote";

        return (
          <div
            key={reg._id}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-black text-slate-900" dir="ltr">
                  {reg.domain}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {t("sites.domain.expires", {
                    date: formatDate(reg.registration?.expirationDate, intlLocale),
                  })}
                  {days != null
                    ? ` · ${t("sites.domain.days", { count: days })}`
                    : ""}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {t("sites.domain.renewPrice", { price })}
                  {reg.renewalQuote?.quoteExpiresAt || reg.renewal?.quoteExpiresAt
                    ? ` · ${t("sites.domain.quoteUntil", {
                        date: formatDate(
                          reg.renewalQuote?.quoteExpiresAt ||
                            reg.renewal?.quoteExpiresAt,
                          intlLocale,
                        ),
                      })}`
                    : ""}
                </div>
                <div className="text-xs font-bold text-violet-700">
                  {t("sites.domain.status", {
                    status: reg.renewal?.status || reg.status,
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => void handleAction(reg)}
                className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {busyId === reg._id
                  ? t("sites.domain.processing")
                  : ctaLabel(cta, t)}
              </button>
            </div>

            {expired ? (
              <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t("sites.domain.expiredHint")}
              </div>
            ) : null}

            {quoteRequired ? (
              <div className="mt-3 rounded-2xl border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">
                {reg.renewalQuote?.message || t("sites.domain.quoteHint")}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
