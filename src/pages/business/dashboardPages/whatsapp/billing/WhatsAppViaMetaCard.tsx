/**
 * Customer WhatsApp billing: Meta invoices the connected WABA.
 * This screen shows payment / funding only — not verification or messaging.
 * Unverifiable Graph billing is kept as paymentStatusRaw internally and never
 * shown as a repeating customer-facing status.
 */
import React from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ExternalLink, Info } from "lucide-react";
import type { WhatsAppConnection } from "../../../../../api/whatsappApi";
import { useAuth } from "../../../../../context/AuthContext";
import { btnPrimary, btnSecondary, cardBase } from "../../../../../styles/bizuplyUi";

function Row({
  label,
  hint,
  value,
}: {
  label: string;
  hint?: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-slate-100 py-2.5 last:border-b-0">
      <dt className="max-w-[18rem]">
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>
        {hint ? (
          <p className="mt-0.5 text-[11px] font-medium text-slate-500">{hint}</p>
        ) : null}
      </dt>
      <dd className="text-sm font-semibold text-slate-900 text-end">{value}</dd>
    </div>
  );
}

function statusPill(
  tone: "ok" | "warn" | "info" | "neutral",
  label: string
) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-800 border-emerald-100"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 border-amber-100"
        : tone === "info"
          ? "bg-sky-50 text-sky-900 border-sky-100"
          : "bg-slate-50 text-slate-600 border-slate-100";
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${cls}`}
    >
      {label}
    </span>
  );
}

function MetaBillingActions({
  billingUrl,
  managerUrl,
  t,
}: {
  billingUrl: string;
  managerUrl: string;
  t: (key: string) => string;
}) {
  const open = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button type="button" className={btnSecondary} onClick={() => open(managerUrl)}>
        {t("whatsapp.viaMeta.openManager")}
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btnPrimary} onClick={() => open(billingUrl)}>
        {t("whatsapp.viaMeta.manageBilling")}
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function WhatsAppViaMetaCard({
  connection,
  onConnect,
  connecting = false,
}: {
  connection: WhatsAppConnection | null;
  onConnect?: () => void;
  connecting?: boolean;
}) {
  const { t } = useTranslation();
  const { user } = useAuth() as { user?: { role?: string } | null };
  const isAdmin = user?.role === "admin";
  const health = connection?.wabaBillingHealth || null;
  const connected = Boolean(connection?.connected);
  const dash = t("crm.common.emDash", "—");

  const paymentStatus = String(
    health?.paymentStatus || health?.paymentStatusRaw || ""
  ).toLowerCase();
  const unverifiable =
    paymentStatus === "unverifiable" ||
    paymentStatus === "unknown" ||
    (health?.hasPaymentMethod !== true &&
      health?.hasPaymentMethod !== false &&
      paymentStatus !== "meta_direct" &&
      paymentStatus !== "credit_line" &&
      paymentStatus !== "needs_attention");
  const payment =
    paymentStatus === "meta_direct" ||
    paymentStatus === "credit_line" ||
    health?.hasPaymentMethod === true
      ? "configured"
      : unverifiable
        ? "unknown"
        : "missing";

  const paymentLabel =
    paymentStatus === "meta_direct"
      ? `${t("whatsapp.viaMeta.paymentConnected")} · ${t("whatsapp.viaMeta.paymentDirect")}`
      : paymentStatus === "credit_line"
        ? t("whatsapp.viaMeta.paymentCreditLine")
        : payment === "configured"
          ? t("whatsapp.viaMeta.paymentConnected")
          : t("whatsapp.viaMeta.paymentNeedsAttention");

  const fundingLabel =
    health?.primaryFundingId || health?.hasPrimaryFundingId === true
      ? t("whatsapp.viaMeta.fundingPresent")
      : t("whatsapp.viaMeta.fundingUnknown");
  const creditLineLabel = Array.isArray(health?.creditLine) && health.creditLine.length
    ? t("whatsapp.viaMeta.creditLinePresent")
    : paymentStatus === "credit_line"
      ? t("whatsapp.viaMeta.paymentCreditLine")
      : t("whatsapp.viaMeta.creditLineUnknown");

  const metaBusiness =
    connection?.metaBusinessName ||
    health?.wabaName ||
    connection?.wabaName ||
    dash;
  const phone = connection?.displayPhoneNumber || dash;

  const billingUrl =
    health?.manageBillingUrl ||
    health?.actionUrl ||
    "https://business.facebook.com/latest/settings/whatsapp_account/";
  const managerUrl =
    health?.whatsappManagerUrl ||
    connection?.whatsappManagerUrl ||
    "https://business.facebook.com/latest/whatsapp_manager/";

  if (!connected) {
    return (
      <article className={`${cardBase} p-5 sm:p-6`}>
        <h2 className="text-lg font-black tracking-tight text-slate-900">
          {t("whatsapp.viaMeta.billingTitle")}
        </h2>
        <p className="mt-1 max-w-xl text-sm font-medium text-slate-500">
          {t("whatsapp.viaMeta.connectHint")}
        </p>
        {onConnect ? (
          <button
            type="button"
            className={`${btnPrimary} mt-5`}
            disabled={connecting}
            onClick={onConnect}
          >
            {connecting
              ? t("whatsapp.settings.connecting")
              : t("whatsapp.settings.connectCta")}
          </button>
        ) : null}
      </article>
    );
  }

  if (payment === "unknown") {
    return (
      <article className={`${cardBase} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              {t("whatsapp.viaMeta.billingTitle")}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {t("whatsapp.viaMeta.chargesByMeta")}
            </p>
          </div>
          {isAdmin ? (
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"
              title={t(
                "whatsapp.viaMeta.adminApiTooltip",
                "Billing details are not available through the current Meta API permissions"
              )}
            >
              <Info className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </div>

        <dl className="mt-4">
          <Row
            label={t("whatsapp.viaMeta.phone")}
            hint={t("whatsapp.viaMeta.phoneHint")}
            value={<span dir="ltr">{phone}</span>}
          />
          <Row label={t("whatsapp.viaMeta.metaBusiness")} value={metaBusiness} />
        </dl>

        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-4 py-4">
          <p className="text-sm font-black text-slate-950">
            {t("whatsapp.viaMeta.managedTitle")}
          </p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-700">
            {t("whatsapp.viaMeta.managedBody")}
          </p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-700">
            {t("whatsapp.viaMeta.managedHint")}
          </p>
        </div>

        <MetaBillingActions billingUrl={billingUrl} managerUrl={managerUrl} t={t} />
      </article>
    );
  }

  return (
    <article className={`${cardBase} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            {t("whatsapp.viaMeta.billingTitle")}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.viaMeta.chargesByMeta")}
          </p>
        </div>
        {statusPill(payment === "configured" ? "ok" : "warn", paymentLabel)}
      </div>

      <dl className="mt-4">
        <Row
          label={t("whatsapp.viaMeta.phone")}
          hint={t("whatsapp.viaMeta.phoneHint")}
          value={<span dir="ltr">{phone}</span>}
        />
        <Row label={t("whatsapp.viaMeta.metaBusiness")} value={metaBusiness} />
        <Row
          label={t("whatsapp.viaMeta.paymentMethod")}
          hint={t("whatsapp.viaMeta.paymentMethodHint")}
          value={statusPill(payment === "configured" ? "ok" : "warn", paymentLabel)}
        />
        <Row
          label={t("whatsapp.viaMeta.funding")}
          hint={t("whatsapp.viaMeta.fundingHint")}
          value={fundingLabel}
        />
        <Row
          label={t("whatsapp.viaMeta.creditLine")}
          hint={t("whatsapp.viaMeta.creditLineHint")}
          value={creditLineLabel}
        />
        <Row
          label={t("whatsapp.viaMeta.directBilling")}
          value={
            paymentStatus === "meta_direct"
              ? t("whatsapp.viaMeta.paymentDirect")
              : t("whatsapp.viaMeta.notAvailable")
          }
        />
      </dl>

      {payment === "missing" ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <div>
              <p className="text-sm font-black text-amber-950">
                {t("whatsapp.viaMeta.paymentRequiredTitle")}
              </p>
              <p className="mt-1 text-sm font-medium text-amber-900">
                {t("whatsapp.viaMeta.paymentRequiredBody")}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <MetaBillingActions billingUrl={billingUrl} managerUrl={managerUrl} t={t} />
    </article>
  );
}
