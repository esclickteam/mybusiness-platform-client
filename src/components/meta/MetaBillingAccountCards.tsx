import React from "react";
import { AlertTriangle, CheckCircle2, ExternalLink, Megaphone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { MetaAdAccountBillingHealth } from "../../api/metaCampaignsApi";
import type { WhatsAppWabaBillingHealth } from "../../api/whatsappApi";
import { btnSecondary, cardBase } from "../../styles/bizuplyUi";

type Props = {
  adAccountBilling?: MetaAdAccountBillingHealth | null;
  wabaBilling?: WhatsAppWabaBillingHealth | null;
  adsSettingsPath?: string;
  whatsappSettingsPath?: string;
  onOpenWhatsAppSettings?: () => void;
  showWaba?: boolean;
  showAdAccount?: boolean;
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

function severityLabel(severity?: string) {
  if (severity === "ok") return "תקין";
  if (severity === "error") return "דורש טיפול";
  return "נדרשת בדיקה";
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
    <div className={`${cardBase} ${colors.box} p-4`} dir="rtl">
      <div className="mb-3 flex items-start gap-3">
        <div className={`mt-0.5 ${colors.icon}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black text-slate-900">{title}</h3>
            {severity ? (
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${colors.badge}`}
              >
                {severityLabel(severity)}
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
  onOpenWhatsAppSettings,
  showWaba = true,
  showAdAccount = true,
  className = "",
}: Props) {
  const showBoth = showAdAccount && showWaba;
  const gridClass = showBoth
    ? "grid gap-3 lg:grid-cols-2"
    : "grid gap-3 grid-cols-1";

  return (
    <div className={["space-y-3", className].join(" ")} dir="rtl">
      {showBoth ? (
        <p className="text-xs font-semibold text-slate-500">
          הוצאות פרסום וחיוב הודעות וואטסאפ מחויבים בנפרד על ידי מטא.
          הכרטיסים האלה לא חולקים אמצעי תשלום.
        </p>
      ) : showAdAccount ? (
        <p className="text-xs font-semibold text-slate-500">
          הוצאות הפרסום מחויבות על ידי מטא באמצעי התשלום של חשבון המודעות שנבחר.
        </p>
      ) : null}

      <div className={gridClass}>
        {showAdAccount ? (
        <BillingCardShell
          title="חשבון מודעות מטא"
          subtitle="הוצאות קמפיינים בפייסבוק / אינסטגרם"
          icon={<Megaphone className="h-5 w-5" />}
          severity={
            adAccountBilling?.connected
              ? adAccountBilling.severity
              : "warning"
          }
        >
          {!adAccountBilling?.connected ? (
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <p>לא נבחר חשבון מודעות מטא לסביבת העבודה הזו.</p>
              <Link to={adsSettingsPath} className={`${btnSecondary} inline-flex`}>
                פתיחת הגדרות מודעות מטא
              </Link>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-bold text-slate-900">
                {adAccountBilling.name || "חשבון מודעות"}
                {adAccountBilling.accountId
                  ? ` · ${adAccountBilling.accountId}`
                  : ""}
              </p>
              <p className="text-xs font-semibold text-slate-600">
                סטטוס החשבון: {adAccountBilling.statusLabel}
                {adAccountBilling.currency
                  ? ` · ${adAccountBilling.currency}`
                  : ""}
              </p>
              {adAccountBilling.hasPaymentMethod === true ? (
                <p className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  אמצעי תשלום שמור
                  {adAccountBilling.paymentMethodDisplay
                    ? ` (${adAccountBilling.paymentMethodDisplay})`
                    : ""}
                </p>
              ) : null}
              {adAccountBilling.hasPaymentMethod === false ? (
                <p className="inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  אין אמצעי תשלום — המודעות לא ישודרו
                </p>
              ) : null}
              {adAccountBilling.hasPaymentMethod == null ? (
                <p className="text-xs font-semibold text-slate-500">
                  פרטי אמצעי התשלום אינם זמינים בהרשאות הנוכחיות
                  (סטטוס החשבון עדיין מוצג).
                </p>
              ) : null}
              <p className="text-[11px] font-semibold leading-relaxed text-slate-500">
                {showWaba
                  ? adAccountBilling.billingSeparationNote
                  : "הוצאות הפרסום מחויבות על ידי מטא באמצעי התשלום של חשבון המודעות הזה."}
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
                  {adAccountBilling.actionLabel || "פתיחת חיוב מטא"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          )}
        </BillingCardShell>
        ) : null}

        {showWaba ? (
        <BillingCardShell
          title="חשבון וואטסאפ עסקי"
          subtitle="חיוב הודעות וואטסאפ"
          icon={<MessageCircle className="h-5 w-5" />}
          severity={
            wabaBilling?.connected ? wabaBilling.severity : "warning"
          }
        >
          {!wabaBilling?.connected ? (
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <p>וואטסאפ עסקי אינו מחובר לסביבת העבודה הזו.</p>
              {onOpenWhatsAppSettings ? (
                <button
                  type="button"
                  onClick={onOpenWhatsAppSettings}
                  className={`${btnSecondary} inline-flex`}
                >
                  פתיחת הגדרות וואטסאפ
                </button>
              ) : (
                <Link
                  to={whatsappSettingsPath}
                  className={`${btnSecondary} inline-flex`}
                >
                  פתיחת הגדרות וואטסאפ
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-bold text-slate-900">
                {wabaBilling.wabaName || "וואטסאפ עסקי"}
              </p>
              <p className="text-xs font-semibold text-slate-600">
                סטטוס החשבון: {wabaBilling.status || "—"}
                {wabaBilling.canSendMessage
                  ? ` · שליחה: ${wabaBilling.canSendMessage}`
                  : ""}
                {wabaBilling.currency ? ` · ${wabaBilling.currency}` : ""}
              </p>
              {wabaBilling.accountReviewStatus ? (
                <p className="text-xs font-semibold text-slate-600">
                  סטטוס בדיקת חשבון: {wabaBilling.accountReviewStatus}
                </p>
              ) : null}
              {wabaBilling.businessVerificationLabel ||
              wabaBilling.businessVerificationStatus ? (
                <p className="text-xs font-semibold text-slate-600">
                  אימות עסק:{" "}
                  {wabaBilling.businessVerificationLabel ||
                    wabaBilling.businessVerificationStatus}
                </p>
              ) : null}
              {wabaBilling.paymentMethodDisplay ||
              wabaBilling.hasPaymentMethod === true ||
              wabaBilling.hasPrimaryFundingId === true ? (
                <p className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  אמצעי תשלום שמור
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
                  אין אמצעי תשלום — הוסיפו אחד בהגדרות חשבון וואטסאפ במטא
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
                    אמצעי תשלום: בדקו בהגדרות חשבון וואטסאפ במטא
                    <span className="mt-0.5 block font-medium text-slate-500">
                      מטא מציגה את הכרטיס שם (סיכום ← אמצעי תשלום). האפליקציה
                      לא מקבלת מותג/4 ספרות אחרונות בסגנון חשבון מודעות עבור וואטסאפ.
                    </span>
                  </span>
                </p>
              ) : null}
              <p className="text-[11px] font-semibold leading-relaxed text-slate-500">
                {wabaBilling.billingSeparationNote}
              </p>
              {(wabaBilling.issues || [])
                .filter((issue) => {
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
                  {wabaBilling.actionLabel || "בדיקת חיוב וואטסאפ"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          )}
        </BillingCardShell>
        ) : null}
      </div>
    </div>
  );
}
