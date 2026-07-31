import React from "react";
import { AlertTriangle, CheckCircle2, ExternalLink, Megaphone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { MetaAdAccountBillingHealth } from "../../api/metaCampaignsApi";
import type { WhatsAppWabaBillingHealth } from "../../api/whatsappApi";
import { btnSecondary, cardBase } from "../../styles/bizuplyUi";

type Props = {
  adAccountBilling?: MetaAdAccountBillingHealth | null;
  wabaBilling?: WhatsAppWabaBillingHealth | null;
  /** Relative paths for connect CTAs when disconnected */
  adsSettingsPath?: string;
  whatsappSettingsPath?: string;
  className?: string;
};

function tone(severity?: string) {
  if (severity === "ok") {
    return {
      box: "border-emerald-200 bg-emerald-50/60",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: "text-emerald-600",
    };
  }
  if (severity === "error") {
    return {
      box: "border-rose-200 bg-rose-50/70",
      badge: "bg-rose-100 text-rose-800 border-rose-200",
      icon: "text-rose-600",
    };
  }
  return {
    box: "border-amber-200 bg-amber-50/70",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    icon: "text-amber-600",
  };
}

function BillingCardShell({
  title,
  subtitle,
  icon,
  severity,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  severity?: string;
  children: React.ReactNode;
}) {
  const colors = tone(severity || "warning");
  return (
    <div className={`${cardBase} ${colors.box} p-4`}>
      <div className="mb-3 flex items-start gap-3">
        <div className={`mt-0.5 ${colors.icon}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black text-slate-900">{title}</h3>
            {severity ? (
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${colors.badge}`}
              >
                {severity === "ok"
                  ? "OK"
                  : severity === "error"
                    ? "Needs attention"
                    : "Check required"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function MetaBillingAccountCards({
  adAccountBilling,
  wabaBilling,
  adsSettingsPath = "../meta-campaigns/settings",
  whatsappSettingsPath = "../whatsapp/settings",
  className = "",
}: Props) {
  return (
    <div className={["space-y-3", className].join(" ")}>
      <p className="text-xs font-semibold text-slate-500">
        Ad spend and WhatsApp message fees are billed separately by Meta. These
        cards never share a payment method.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <BillingCardShell
          title="Meta Ad Account"
          subtitle="Facebook / Instagram campaign spend"
          icon={<Megaphone className="h-5 w-5" />}
          severity={
            adAccountBilling?.connected
              ? adAccountBilling.severity
              : "warning"
          }
        >
          {!adAccountBilling?.connected ? (
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <p>No Meta Ad Account selected for this workspace.</p>
              <Link to={adsSettingsPath} className={`${btnSecondary} inline-flex`}>
                Open Meta Ads settings
              </Link>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-bold text-slate-900">
                {adAccountBilling.name || "Ad Account"}
                {adAccountBilling.accountId
                  ? ` · ${adAccountBilling.accountId}`
                  : ""}
              </p>
              <p className="text-xs font-semibold text-slate-600">
                Status: {adAccountBilling.statusLabel}
                {adAccountBilling.currency
                  ? ` · ${adAccountBilling.currency}`
                  : ""}
              </p>
              {adAccountBilling.hasPaymentMethod === true ? (
                <p className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Payment method on file
                  {adAccountBilling.paymentMethodDisplay
                    ? ` (${adAccountBilling.paymentMethodDisplay})`
                    : ""}
                </p>
              ) : null}
              {adAccountBilling.hasPaymentMethod === false ? (
                <p className="inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  No payment method — ads will not deliver
                </p>
              ) : null}
              {adAccountBilling.hasPaymentMethod == null ? (
                <p className="text-xs font-semibold text-slate-500">
                  Payment method details unavailable with current permissions
                  (account status still shown).
                </p>
              ) : null}
              <p className="text-[11px] font-semibold leading-relaxed text-slate-500">
                {adAccountBilling.billingSeparationNote}
              </p>
              {(adAccountBilling.issues || []).map((issue) => (
                <p
                  key={issue}
                  className="text-xs font-semibold text-rose-700"
                >
                  {issue}
                </p>
              ))}
              {adAccountBilling.actionUrl ? (
                <a
                  href={adAccountBilling.actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btnSecondary} inline-flex items-center gap-1.5`}
                >
                  {adAccountBilling.actionLabel || "Open Meta Billing"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          )}
        </BillingCardShell>

        <BillingCardShell
          title="WhatsApp Business Account"
          subtitle="Cloud API message fees (WABA)"
          icon={<MessageCircle className="h-5 w-5" />}
          severity={
            wabaBilling?.connected ? wabaBilling.severity : "warning"
          }
        >
          {!wabaBilling?.connected ? (
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <p>WhatsApp Business is not connected for this workspace.</p>
              <Link
                to={whatsappSettingsPath}
                className={`${btnSecondary} inline-flex`}
              >
                Open WhatsApp settings
              </Link>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-bold text-slate-900">
                {wabaBilling.wabaName || "WhatsApp Business"}
                {wabaBilling.wabaId ? ` · ${wabaBilling.wabaId}` : ""}
              </p>
              <p className="text-xs font-semibold text-slate-600">
                WABA status: {wabaBilling.status || "—"}
                {wabaBilling.canSendMessage
                  ? ` · Send: ${wabaBilling.canSendMessage}`
                  : ""}
                {wabaBilling.currency ? ` · ${wabaBilling.currency}` : ""}
              </p>
              {wabaBilling.accountReviewStatus ? (
                <p className="text-xs font-semibold text-slate-600">
                  Account review: {wabaBilling.accountReviewStatus}
                </p>
              ) : null}
              {wabaBilling.businessVerificationLabel ||
              wabaBilling.businessVerificationStatus ? (
                <p className="text-xs font-semibold text-slate-600">
                  Business verification:{" "}
                  {wabaBilling.businessVerificationLabel ||
                    wabaBilling.businessVerificationStatus}
                </p>
              ) : null}
              {wabaBilling.paymentMethodDisplay ||
              wabaBilling.hasPaymentMethod === true ||
              wabaBilling.hasPrimaryFundingId === true ? (
                <p className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Payment method on file
                  {wabaBilling.paymentMethodDisplay
                    ? ` (${wabaBilling.paymentMethodDisplay})`
                    : ""}
                </p>
              ) : null}
              {!wabaBilling.paymentMethodDisplay &&
              (wabaBilling.hasPaymentMethod === false ||
                wabaBilling.hasPrimaryFundingId === false) ? (
                <p className="inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  No payment method — add one in WhatsApp Manager
                </p>
              ) : null}
              {!wabaBilling.paymentMethodDisplay &&
              wabaBilling.hasPaymentMethod !== true &&
              wabaBilling.hasPrimaryFundingId !== true &&
              wabaBilling.hasPaymentMethod !== false &&
              wabaBilling.hasPrimaryFundingId !== false ? (
                <p className="inline-flex items-start gap-1 text-xs font-semibold text-slate-600">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span>
                    Payment method: view in WhatsApp Manager
                    <span className="mt-0.5 block font-medium text-slate-500">
                      Meta does not expose WhatsApp card brand/last 4 to apps
                      the way it does for Ad Accounts.
                    </span>
                  </span>
                </p>
              ) : null}
              <p className="text-[11px] font-semibold leading-relaxed text-slate-500">
                {wabaBilling.billingSeparationNote}
              </p>
              {(wabaBilling.issues || [])
                .filter((issue) => {
                  // Already shown as a dedicated verification row.
                  const lower = issue.toLowerCase();
                  return !lower.startsWith("business verification:");
                })
                .map((issue) => (
                  <p
                    key={issue}
                    className="text-xs font-semibold text-rose-700"
                  >
                    {issue}
                  </p>
                ))}
              {wabaBilling.actionUrl || wabaBilling.manageBillingUrl ? (
                <a
                  href={
                    wabaBilling.actionUrl || wabaBilling.manageBillingUrl || "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={`${btnSecondary} inline-flex items-center gap-1.5`}
                >
                  {wabaBilling.paymentMethodDisplay ||
                  wabaBilling.hasPaymentMethod === true
                    ? wabaBilling.actionLabel || "Open WhatsApp Manager"
                    : "Manage WhatsApp billing"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          )}
        </BillingCardShell>
      </div>
    </div>
  );
}
