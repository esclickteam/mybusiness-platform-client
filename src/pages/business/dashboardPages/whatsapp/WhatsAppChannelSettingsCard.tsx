import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Check,
  Copy,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  getWhatsAppChannelSettings,
  refreshWhatsAppChannelSettings,
  testWhatsAppChannelWebhook,
  type WhatsAppChannelSettings,
} from "../../../../api/whatsappApi";
import { getApiErrorMessage } from "../../../../utils/apiErrorMessage";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import { btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import {
  formatMessagingLimit,
  formatQualityRating,
  qualityBadgeClass,
} from "./hubFormat";

type Props = {
  businessId: string;
};

const dash = "—";

async function copyText(value: string) {
  if (!value) return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function healthBadgeClass(health: string) {
  if (health === "active") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (health === "error" || health === "verification_failed") {
    return "bg-rose-50 text-rose-700 border-rose-100";
  }
  if (health === "no_events") return "bg-amber-50 text-amber-800 border-amber-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
}

function FieldRow({
  label,
  value,
  tooltip,
  copyValue,
  copied,
  onCopy,
  badgeClass,
  ltr,
}: {
  label: string;
  value: React.ReactNode;
  tooltip?: string;
  copyValue?: string;
  copied?: boolean;
  onCopy?: () => void;
  badgeClass?: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-slate-400">
          {label}
          {tooltip ? (
            <span title={tooltip} className="inline-flex text-slate-300">
              <Info className="h-3 w-3" />
            </span>
          ) : null}
        </p>
        <div
          className={`mt-1 text-sm font-semibold text-slate-800 ${ltr ? "font-mono" : ""}`}
          dir={ltr ? "ltr" : undefined}
        >
          {badgeClass ? (
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-black ${badgeClass}`}
            >
              {value}
            </span>
          ) : (
            value || dash
          )}
        </div>
      </div>
      {copyValue ? (
        <button
          type="button"
          onClick={onCopy}
          className="mt-3 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
          aria-label="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      ) : null}
    </div>
  );
}

export default function WhatsAppChannelSettingsCard({ businessId }: Props) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState<WhatsAppChannelSettings | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const locale = getIntlLocale(i18n.language);

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await getWhatsAppChannelSettings(businessId);
      setSettings(data);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("whatsapp.settings.channelSettingsLoadError"))
      );
    } finally {
      setLoading(false);
    }
  }, [businessId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCopy = async (field: string, value: string) => {
    if (!value) return;
    const ok = await copyText(value);
    if (ok) {
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1600);
      toast.success(t("whatsapp.settings.channelSettingsCopied"));
    }
  };

  const handleRefresh = async () => {
    if (!businessId || busy) return;
    setBusy(true);
    try {
      const data = await refreshWhatsAppChannelSettings(businessId);
      setSettings(data);
      toast.success(t("whatsapp.settings.channelSettingsRefreshed"));
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("whatsapp.settings.channelSettingsRefreshError"))
      );
    } finally {
      setBusy(false);
    }
  };

  const handleTest = async () => {
    if (!businessId || busy) return;
    setBusy(true);
    try {
      const result = await testWhatsAppChannelWebhook(businessId);
      if (result.success) {
        toast.success(t("whatsapp.settings.channelSettingsTestOk"));
      } else {
        toast.error(t("whatsapp.settings.channelSettingsTestFail"));
      }
      const data = await getWhatsAppChannelSettings(businessId);
      setSettings(data);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("whatsapp.settings.channelSettingsTestFail"))
      );
    } finally {
      setBusy(false);
    }
  };

  const conn = settings?.connection;
  const webhook = settings?.webhook;
  const health = webhook?.health || "not_configured";
  const lastAt = webhook?.lastEventAt
    ? new Date(webhook.lastEventAt).toLocaleString(locale)
    : dash;

  return (
    <article className={`${cardBase} overflow-hidden p-0`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
            {t("whatsapp.settings.channelSettingsDirection")}
          </p>
          <h3 className="mt-0.5 text-sm font-black text-slate-900">
            {t("whatsapp.settings.channelSettingsTitle")}
          </h3>
          <p className="mt-1 max-w-xl text-[12px] font-semibold text-slate-500">
            {t("whatsapp.settings.channelSettingsHint")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-black ${healthBadgeClass(health)}`}
          >
            {t(`whatsapp.settings.channelHealth.${health}`, health)}
          </span>
          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={busy || loading}
            className={`${btnSecondary} !px-3 !py-1.5 text-xs`}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {t("whatsapp.settings.channelSettingsRefresh")}
          </button>
          <button
            type="button"
            onClick={() => void handleTest()}
            disabled={busy || loading}
            className={`${btnSecondary} !px-3 !py-1.5 text-xs`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("whatsapp.settings.channelSettingsTestWebhook")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 px-4 py-8 text-sm font-semibold text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("whatsapp.hub.loading")}
        </div>
      ) : !conn?.connected ? (
        <p className="px-4 py-6 text-sm font-semibold text-slate-500">
          {t("whatsapp.settings.channelNotConnected")}
        </p>
      ) : (
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="divide-y divide-slate-100 px-4 py-1">
            <FieldRow
              label={t("whatsapp.settings.channelPhone")}
              value={conn.phoneNumber || dash}
              tooltip={t("whatsapp.settings.channelTooltipPhone")}
              copyValue={conn.phoneNumber}
              copied={copiedField === "phone"}
              onCopy={() => void handleCopy("phone", conn.phoneNumber)}
              ltr
            />
            <FieldRow
              label={t("whatsapp.settings.channelPhoneNumberId")}
              value={conn.phoneNumberId || dash}
              copyValue={conn.phoneNumberId}
              copied={copiedField === "pnid"}
              onCopy={() => void handleCopy("pnid", conn.phoneNumberId)}
              ltr
            />
            <FieldRow
              label={t("whatsapp.settings.channelWabaId")}
              value={conn.wabaId || dash}
              copyValue={conn.wabaId}
              copied={copiedField === "waba"}
              onCopy={() => void handleCopy("waba", conn.wabaId)}
              ltr
            />
            <FieldRow
              label={t("whatsapp.settings.channelWabaName")}
              value={conn.wabaName || dash}
            />
            <FieldRow
              label={t("whatsapp.settings.channelPlatformType")}
              value={settings?.platformType || dash}
            />
            <FieldRow
              label={t("whatsapp.settings.channelConnectionStatus")}
              value={conn.status || dash}
              badgeClass={
                conn.status === "connected"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-slate-50 text-slate-600 border-slate-100"
              }
            />
            <FieldRow
              label={t("whatsapp.settings.channelDisplayName")}
              value={conn.displayName || dash}
            />
            <FieldRow
              label={t("whatsapp.settings.channelDisplayNameStatus")}
              value={conn.displayNameStatus || dash}
            />
            <FieldRow
              label={t("whatsapp.settings.channelMessagingLimit")}
              value={
                formatMessagingLimit(conn.messagingLimit, t) ||
                conn.messagingLimit ||
                dash
              }
            />
            {conn.qualityRating ? (
              <FieldRow
                label={t("whatsapp.settings.channelQualityRating")}
                value={formatQualityRating(conn.qualityRating, t) || conn.qualityRating}
                badgeClass={qualityBadgeClass(conn.qualityRating)}
              />
            ) : null}
            {settings?.timezoneId ? (
              <FieldRow
                label={t("whatsapp.settings.channelTimezone")}
                value={settings.timezoneId}
                ltr
              />
            ) : null}
            <FieldRow
              label={t("whatsapp.settings.channelNamespace")}
              value={t("whatsapp.settings.channelNamespaceCloud")}
            />
          </div>

          <div className="divide-y divide-slate-100 border-t border-slate-100 px-4 py-1 lg:border-l lg:border-t-0">
            <FieldRow
              label={t("whatsapp.settings.channelWebhookUrl")}
              value={webhook?.url || dash}
              tooltip={t("whatsapp.settings.channelTooltipWebhook")}
              copyValue={webhook?.url}
              copied={copiedField === "url"}
              onCopy={() => void handleCopy("url", webhook?.url || "")}
              ltr
            />
            <FieldRow
              label={t("whatsapp.settings.channelVerifyToken")}
              value={t(
                `whatsapp.settings.channelVerify.${webhook?.verifyTokenStatus || "missing"}`
              )}
              tooltip={t("whatsapp.settings.channelTooltipVerify")}
            />
            <FieldRow
              label={t("whatsapp.settings.channelVerificationStatus")}
              value={t(
                `whatsapp.settings.channelVerify.${webhook?.verificationStatus || "not_configured"}`
              )}
            />
            <FieldRow
              label={t("whatsapp.settings.channelWebhookHealth")}
              value={t(`whatsapp.settings.channelHealth.${health}`, health)}
              badgeClass={healthBadgeClass(health)}
            />
            <FieldRow
              label={t("whatsapp.settings.channelLastEventType")}
              value={webhook?.lastEventType || dash}
              ltr
            />
            <FieldRow
              label={t("whatsapp.settings.channelLastEvent")}
              value={webhook?.lastEventStatus || webhook?.lastEventWamid || dash}
              ltr
            />
            <FieldRow
              label={t("whatsapp.settings.channelLastError")}
              value={webhook?.lastEventError || dash}
            />
            <FieldRow
              label={t("whatsapp.settings.channelLastReceivedAt")}
              value={lastAt}
            />
          </div>
        </div>
      )}
    </article>
  );
}
