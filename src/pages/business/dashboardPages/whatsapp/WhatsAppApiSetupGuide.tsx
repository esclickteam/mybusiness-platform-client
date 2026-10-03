import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Circle, ExternalLink, Loader2, PartyPopper } from "lucide-react";
import {
  getWhatsAppApiSubscriptionStatus,
  getWhatsAppExternalApiSettings,
  startWhatsAppApiCheckout,
  type WhatsAppApiSubscriptionAccess,
  type WhatsAppExternalApiSettings,
} from "../../../../api/whatsappApi";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import { btnPrimary, cardBase } from "../../../../styles/bizuplyUi";
import { whatsappBasePath } from "./hubNavigation";

type Props = {
  businessId: string | null | undefined;
  connected: boolean;
  messagesSent: number;
};

type Step = {
  key: string;
  done: boolean;
  to: string;
  external?: boolean;
};

/**
 * Next-steps checklist for WhatsApp API subscribers. Workspaces that get WhatsApp
 * through their business plan don't see it.
 */
export default function WhatsAppApiSetupGuide({ businessId, connected, messagesSent }: Props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const base = whatsappBasePath(location.pathname);
  const welcome = new URLSearchParams(location.search).get("welcome") === "whatsapp_api";
  const [access, setAccess] = useState<WhatsAppApiSubscriptionAccess | null>(null);
  const [settings, setSettings] = useState<WhatsAppExternalApiSettings | null>(null);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (!businessId) return undefined;
    let cancelled = false;
    void Promise.all([
      getWhatsAppApiSubscriptionStatus(businessId).catch(() => null),
      getWhatsAppExternalApiSettings(businessId).catch(() => null),
    ]).then(([status, api]) => {
      if (cancelled) return;
      setAccess(status);
      setSettings(api);
    });
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  if (!access || access.via === "plan" || (!access.gateEnabled && access.via !== "subscription")) {
    return null;
  }

  const sub = access.subscription;
  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString(getIntlLocale(i18n.language), { dateStyle: "medium" }) : "";
  const hasKey = Boolean(settings?.keys?.some((k) => k.status === "active"));
  const hasWebhook = Boolean(settings?.webhook?.url);
  const docsUrl = settings?.docsUrl || "";

  const steps: Step[] = [
    { key: "subscription", done: access.allowed, to: `${base}/billing` },
    { key: "connect", done: connected, to: `${base}/connection` },
    { key: "apiKey", done: hasKey, to: `${base}/developers` },
    { key: "webhook", done: hasWebhook, to: `${base}/developers` },
    { key: "firstMessage", done: messagesSent > 0, to: `${base}/templates` },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length && !welcome) return null;

  let subscriptionText = t("whatsapp.apiSetup.subscription.inactive");
  if (access.allowed && sub?.cancelAtPeriodEnd) {
    subscriptionText = t("whatsapp.apiSetup.subscription.endsOn", { date: formatDate(sub.currentPeriodEnd) });
  } else if (access.allowed && access.reason === "payment_grace") {
    subscriptionText = t("whatsapp.apiSetup.subscription.grace", { date: formatDate(sub?.graceEndsAt) });
  } else if (access.allowed) {
    subscriptionText = sub?.currentPeriodEnd
      ? t("whatsapp.apiSetup.subscription.renewsOn", { date: formatDate(sub.currentPeriodEnd) })
      : t("whatsapp.apiSetup.subscription.active");
  }

  const subscribe = async () => {
    if (!businessId) return;
    setCheckoutBusy(true);
    setCheckoutError("");
    try {
      const { url } = await startWhatsAppApiCheckout(businessId);
      window.location.assign(url);
    } catch {
      setCheckoutError(t("whatsapp.apiSetup.checkoutError"));
      setCheckoutBusy(false);
    }
  };

  return (
    <section className={`${cardBase} p-4 sm:p-5`} data-testid="wa-api-setup-guide" aria-labelledby="wa-api-setup-title">
      {welcome ? (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3">
          <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-black text-emerald-900">{t("whatsapp.apiSetup.welcomeTitle")}</p>
            <p className="mt-0.5 text-xs font-semibold text-emerald-800">{t("whatsapp.apiSetup.welcomeText")}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 id="wa-api-setup-title" className="text-sm font-black text-slate-900">
            {t("whatsapp.apiSetup.title")}
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {t("whatsapp.apiSetup.progress", { done: doneCount, total: steps.length })}
          </p>
        </div>
        <div className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
        </div>
      </div>

      <ol className="mt-4 space-y-2">
        {steps.map((step) => (
          <li
            key={step.key}
            className="flex flex-col gap-2 rounded-xl border border-slate-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            data-step={step.key}
            data-done={step.done ? "true" : "false"}
          >
            <div className="flex min-w-0 items-start gap-2.5">
              {step.done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-label={t("whatsapp.apiSetup.done")} />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" aria-label={t("whatsapp.apiSetup.todo")} />
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{t(`whatsapp.apiSetup.steps.${step.key}.title`)}</p>
                <p className="text-xs font-semibold text-slate-500">
                  {step.key === "subscription" ? subscriptionText : t(`whatsapp.apiSetup.steps.${step.key}.text`)}
                </p>
              </div>
            </div>
            {step.key === "subscription" && !access.allowed && access.selfServe ? (
              <button type="button" className={`${btnPrimary} !px-3 !py-1.5 text-xs`} disabled={checkoutBusy} onClick={() => void subscribe()}>
                {checkoutBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {t("whatsapp.apiSetup.subscribe")}
              </button>
            ) : !step.done ? (
              <Link to={step.to} className="shrink-0 text-xs font-black text-emerald-700">
                {t(`whatsapp.apiSetup.steps.${step.key}.cta`)} →
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
      {checkoutError ? (
        <p className="mt-2 text-xs font-bold text-rose-700" role="alert">
          {checkoutError}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs font-black">
        <Link to={`${base}/developers`} className="text-slate-700 hover:text-emerald-700">
          {t("whatsapp.apiSetup.links.developers")}
        </Link>
        <Link to={`${base}/templates`} className="text-slate-700 hover:text-emerald-700">
          {t("whatsapp.apiSetup.links.templates")}
        </Link>
        <Link to={`${base}/insights`} className="text-slate-700 hover:text-emerald-700">
          {t("whatsapp.apiSetup.links.analytics")}
        </Link>
        {docsUrl ? (
          <a href={docsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-700">
            {t("whatsapp.apiSetup.links.docs")}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <p className="mt-3 text-[11px] font-semibold text-slate-400">{t("whatsapp.apiSetup.oneNumber")}</p>
    </section>
  );
}
