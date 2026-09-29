/**
 * Customer WhatsApp billing: Meta invoices the connected WABA.
 * Bizuply does not charge message usage (no wallet / per-message UI here).
 */
import React from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ExternalLink, ShieldAlert } from "lucide-react";
import type { WhatsAppConnection } from "../../../../../api/whatsappApi";
import { btnPrimary, btnSecondary, cardBase } from "../../../../../styles/bizuplyUi";
import {
  formatMessagingLimit,
  formatQualityRating,
  qualityBadgeClass,
} from "../hubFormat";

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-slate-100 py-2.5 last:border-b-0">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd
        className={
          valueClassName || "text-sm font-semibold text-slate-900 text-end"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function statusPill(ok: boolean, warn: boolean, label: string) {
  const cls = ok
    ? "bg-emerald-50 text-emerald-800 border-emerald-100"
    : warn
      ? "bg-amber-50 text-amber-900 border-amber-100"
      : "bg-slate-50 text-slate-600 border-slate-100";
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${cls}`}
    >
      {label}
    </span>
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
  const health = connection?.wabaBillingHealth || null;
  const connected = Boolean(connection?.connected);
  const dash = t("crm.common.emDash", "—");

  const verificationRaw = String(
    health?.businessVerificationStatus ||
      connection?.businessVerificationStatus ||
      ""
  ).toLowerCase();
  const verified = verificationRaw === "verified";
  const verificationLabel =
    health?.businessVerificationLabel ||
    (verificationRaw
      ? verificationRaw.replace(/_/g, " ")
      : t("whatsapp.viaMeta.notAvailable"));

  const wabaStatus = String(
    health?.status || connection?.wabaPlatformStatus || ""
  ).toUpperCase();
  const wabaActive = !wabaStatus || wabaStatus === "ACTIVE";
  const wabaRestricted =
    String(health?.canSendMessage || connection?.canSendMessage || "")
      .toUpperCase() === "BLOCKED" ||
    (wabaStatus && wabaStatus !== "ACTIVE");

  const paymentStatus = String(
    health?.paymentStatus || health?.paymentStatusRaw || ""
  );
  const payment =
    paymentStatus === "meta_direct" ||
    paymentStatus === "credit_line" ||
    health?.hasPaymentMethod === true
      ? "configured"
      : paymentStatus === "needs_attention" || health?.hasPaymentMethod === false
        ? "missing"
        : "unknown";
  const paymentLabel =
    paymentStatus === "meta_direct"
      ? `${t("whatsapp.viaMeta.paymentConnected")} · ${t("whatsapp.viaMeta.paymentDirect")}`
      : paymentStatus === "credit_line"
        ? t("whatsapp.viaMeta.paymentCreditLine")
        : payment === "configured"
          ? t("whatsapp.viaMeta.paymentConnected")
          : payment === "missing"
            ? t("whatsapp.viaMeta.paymentNeedsAttention")
            : t("whatsapp.viaMeta.paymentUnverifiable");

  const qualityLabel = formatQualityRating(connection?.qualityRating, t);
  const limitLabel = formatMessagingLimit(connection?.messagingLimitTier, t);
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
  const verificationUrl =
    health?.verificationUrl ||
    (connection?.metaBusinessId
      ? `https://business.facebook.com/latest/settings/security_center?business_id=${encodeURIComponent(
          connection.metaBusinessId
        )}`
      : "https://business.facebook.com/latest/settings/security_center");

  const open = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!connected) {
    return (
      <article className={`${cardBase} p-5 sm:p-6`}>
        <h2 className="text-lg font-black tracking-tight text-slate-900">
          {t("whatsapp.viaMeta.title")}
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

  return (
    <article className={`${cardBase} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            {t("whatsapp.viaMeta.title")}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.viaMeta.chargesByMeta")}
          </p>
        </div>
        {statusPill(
          connected && !wabaRestricted,
          Boolean(wabaRestricted || payment === "missing" || !verified),
          connected
            ? t("whatsapp.viaMeta.statusConnected")
            : t("whatsapp.hub.disconnected")
        )}
      </div>

      <dl className="mt-4">
        <Row label={t("whatsapp.viaMeta.phone")} value={<span dir="ltr">{phone}</span>} />
        <Row label={t("whatsapp.viaMeta.metaBusiness")} value={metaBusiness} />
        <Row
          label={t("whatsapp.viaMeta.verification")}
          value={statusPill(
            verified,
            Boolean(verificationRaw) && !verified,
            verificationLabel
          )}
        />
        <Row
          label={t("whatsapp.viaMeta.wabaStatus")}
          value={statusPill(
            wabaActive && !wabaRestricted,
            Boolean(wabaRestricted),
            wabaStatus
              ? wabaActive
                ? t("whatsapp.viaMeta.active")
                : wabaStatus
              : t("whatsapp.viaMeta.notAvailable")
          )}
        />
        <Row
          label={t("whatsapp.viaMeta.paymentMethod")}
          value={statusPill(
            payment === "configured",
            payment !== "configured",
            payment === "configured"
              ? paymentLabel
              : payment === "missing"
                ? paymentLabel
                : paymentLabel
          )}
        />
        {qualityLabel ? (
          <Row
            label={t("whatsapp.viaMeta.quality")}
            value={
              <span
                className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-bold ${qualityBadgeClass(
                  connection?.qualityRating
                )}`}
              >
                {qualityLabel}
              </span>
            }
          />
        ) : null}
        {limitLabel ? (
          <Row label={t("whatsapp.viaMeta.messagingLimit")} value={limitLabel} />
        ) : null}
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

      {!verified && verificationRaw ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <p className="text-sm font-black text-amber-950">
                  {t("whatsapp.viaMeta.verificationNeededTitle")}
                </p>
                <p className="mt-1 text-sm font-medium text-amber-900">
                  {t("whatsapp.viaMeta.verificationNeededBody")}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => open(verificationUrl)}
            >
              {t("whatsapp.viaMeta.resolveInMeta")}
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {wabaRestricted ? (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-rose-950">
                {t("whatsapp.viaMeta.wabaRestrictedTitle")}
              </p>
              <p className="mt-1 text-sm font-medium text-rose-900">
                {t("whatsapp.viaMeta.wabaRestrictedBody")}
              </p>
            </div>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => open(managerUrl)}
            >
              {t("whatsapp.viaMeta.openManager")}
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className={btnPrimary} onClick={() => open(billingUrl)}>
          {t("whatsapp.viaMeta.manageBilling")}
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnSecondary} onClick={() => open(managerUrl)}>
          {t("whatsapp.viaMeta.openManager")}
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
