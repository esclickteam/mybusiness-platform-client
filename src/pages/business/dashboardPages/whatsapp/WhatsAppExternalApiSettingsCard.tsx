import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  RefreshCw,
  Send,
  Webhook,
} from "lucide-react";
import {
  createWhatsAppExternalApiKey,
  getWhatsAppExternalApiSettings,
  regenerateWhatsAppExternalApiKey,
  regenerateWhatsAppExternalWebhookSecret,
  revealWhatsAppExternalWebhookSecret,
  testWhatsAppExternalWebhook,
  updateWhatsAppExternalWebhookUrl,
  type WhatsAppExternalApiSettings,
} from "../../../../api/whatsappApi";
import { getApiErrorMessage } from "../../../../utils/apiErrorMessage";
import { btnPrimary, btnSecondary, inputBase } from "../../../../styles/bizuplyUi";

type Props = {
  businessId: string;
  linked: boolean;
};

async function copyText(value: string) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export default function WhatsAppExternalApiSettingsCard({
  businessId,
  linked,
}: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState<WhatsAppExternalApiSettings | null>(
    null
  );
  const [revealedApiKey, setRevealedApiKey] = useState<string | null>(null);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(false);
  const [webhookDraft, setWebhookDraft] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await getWhatsAppExternalApiSettings(businessId);
      setSettings(data);
      setWebhookDraft(data.webhook?.url || "");
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("whatsapp.settings.apiSettingsLoadError")));
    } finally {
      setLoading(false);
    }
  }, [businessId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const markCopied = (field: string) => {
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1600);
  };

  const handleCopy = async (field: string, value: string) => {
    const ok = await copyText(value);
    if (ok) {
      markCopied(field);
      toast.success(t("whatsapp.settings.apiSettingsCopied"));
    }
  };

  const handleCreateOrRegenerateKey = async () => {
    if (!businessId || busy) return;
    const hasKey = Boolean(settings?.apiKey);
    if (
      hasKey &&
      !window.confirm(t("whatsapp.settings.apiSettingsRegenerateConfirm"))
    ) {
      return;
    }
    setBusy(true);
    try {
      const result = hasKey
        ? await regenerateWhatsAppExternalApiKey(
            businessId,
            settings?.apiKey?.id
          )
        : await createWhatsAppExternalApiKey(businessId);
      setRevealedApiKey(result.apiKey);
      toast.success(
        hasKey
          ? t("whatsapp.settings.apiSettingsKeyRegenerated")
          : t("whatsapp.settings.apiSettingsKeyCreated")
      );
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("whatsapp.settings.apiSettingsKeyError")));
    } finally {
      setBusy(false);
    }
  };

  const handleSaveWebhook = async () => {
    if (!businessId || busy) return;
    setBusy(true);
    try {
      const { webhook } = await updateWhatsAppExternalWebhookUrl(
        businessId,
        webhookDraft.trim()
      );
      setSettings((prev) => (prev ? { ...prev, webhook } : prev));
      setEditingWebhook(false);
      toast.success(t("whatsapp.settings.apiSettingsWebhookSaved"));
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("whatsapp.settings.apiSettingsWebhookError"))
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRevealSecret = async () => {
    if (!businessId || busy) return;
    if (showSecret && revealedSecret) {
      setShowSecret(false);
      return;
    }
    setBusy(true);
    try {
      const { webhook } = await revealWhatsAppExternalWebhookSecret(businessId);
      if (webhook.webhookSecret) {
        setRevealedSecret(webhook.webhookSecret);
        setShowSecret(true);
      }
      setSettings((prev) => (prev ? { ...prev, webhook } : prev));
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("whatsapp.settings.apiSettingsSecretError"))
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRegenerateSecret = async () => {
    if (!businessId || busy) return;
    if (!window.confirm(t("whatsapp.settings.apiSettingsSecretRegenConfirm"))) {
      return;
    }
    setBusy(true);
    try {
      const { webhook } = await regenerateWhatsAppExternalWebhookSecret(
        businessId
      );
      setRevealedSecret(webhook.webhookSecret || null);
      setShowSecret(Boolean(webhook.webhookSecret));
      setSettings((prev) => (prev ? { ...prev, webhook } : prev));
      toast.success(t("whatsapp.settings.apiSettingsSecretRegenerated"));
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("whatsapp.settings.apiSettingsSecretError"))
      );
    } finally {
      setBusy(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!businessId || busy) return;
    setBusy(true);
    try {
      const result = await testWhatsAppExternalWebhook(businessId);
      if (result.success) {
        toast.success(t("whatsapp.settings.apiSettingsWebhookTestOk"));
      } else {
        toast.error(
          result.error || t("whatsapp.settings.apiSettingsWebhookTestFail")
        );
      }
      await load();
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("whatsapp.settings.apiSettingsWebhookTestFail"))
      );
    } finally {
      setBusy(false);
    }
  };

  if (!linked) return null;

  const apiKeyDisplay =
    revealedApiKey ||
    settings?.apiKey?.maskedKey ||
    t("whatsapp.settings.apiSettingsNoKey");
  const secretDisplay = showSecret && revealedSecret
    ? revealedSecret
    : settings?.webhook?.maskedSecret ||
      t("whatsapp.settings.apiSettingsNoSecret");

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-slate-900">
            <KeyRound className="h-4 w-4 text-slate-700" aria-hidden />
            {t("whatsapp.settings.apiSettingsTitle")}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-600">
            {t("whatsapp.settings.apiSettingsHint")}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            settings?.status === "Active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {settings?.status || "—"}
        </span>
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("common.loading")}
        </div>
      ) : (
        <div className="mt-4 space-y-4" dir="ltr">
          <Field
            label={t("whatsapp.settings.apiSettingsApiKey")}
            value={apiKeyDisplay}
            mono
            actions={
              <>
                {revealedApiKey ? (
                  <ActionBtn
                    onClick={() => handleCopy("apiKey", revealedApiKey)}
                    icon={
                      copiedField === "apiKey" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )
                    }
                    label={t("whatsapp.settings.apiSettingsCopy")}
                  />
                ) : null}
                <ActionBtn
                  onClick={() => void handleCreateOrRegenerateKey()}
                  disabled={busy}
                  icon={<RefreshCw className="h-3.5 w-3.5" />}
                  label={
                    settings?.apiKey
                      ? t("whatsapp.settings.apiSettingsRegenerate")
                      : t("whatsapp.settings.apiSettingsCreateKey")
                  }
                />
              </>
            }
          />
          {revealedApiKey ? (
            <p className="text-[11px] font-medium text-amber-700">
              {t("whatsapp.settings.apiSettingsKeyOnce")}
            </p>
          ) : null}

          <Field
            label={t("whatsapp.settings.apiSettingsBaseUrl")}
            value={settings?.apiBaseUrl || "https://api.bizuply.com/v1"}
            mono
            actions={
              <ActionBtn
                onClick={() =>
                  handleCopy(
                    "baseUrl",
                    settings?.apiBaseUrl || "https://api.bizuply.com/v1"
                  )
                }
                icon={
                  copiedField === "baseUrl" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )
                }
                label={t("whatsapp.settings.apiSettingsCopy")}
              />
            }
          />

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Webhook className="h-3.5 w-3.5" aria-hidden />
                {t("whatsapp.settings.apiSettingsWebhookUrl")}
              </p>
              {!editingWebhook ? (
                <ActionBtn
                  onClick={() => setEditingWebhook(true)}
                  label={t("whatsapp.settings.apiSettingsEdit")}
                />
              ) : null}
            </div>
            {editingWebhook ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className={`${inputBase} flex-1 font-mono text-sm`}
                  value={webhookDraft}
                  onChange={(e) => setWebhookDraft(e.target.value)}
                  placeholder="https://client-domain.com/api/webhooks/bizuply"
                  dir="ltr"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={btnPrimary}
                    disabled={busy}
                    onClick={() => void handleSaveWebhook()}
                  >
                    {t("common.save")}
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() => {
                      setEditingWebhook(false);
                      setWebhookDraft(settings?.webhook?.url || "");
                    }}
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 break-all">
                {settings?.webhook?.url ||
                  t("whatsapp.settings.apiSettingsWebhookEmpty")}
              </p>
            )}
          </div>

          <Field
            label={t("whatsapp.settings.apiSettingsWebhookSecret")}
            value={secretDisplay}
            mono
            actions={
              <>
                <ActionBtn
                  onClick={() => void handleRevealSecret()}
                  disabled={busy}
                  icon={
                    showSecret ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )
                  }
                  label={
                    showSecret
                      ? t("whatsapp.settings.apiSettingsHide")
                      : t("whatsapp.settings.apiSettingsReveal")
                  }
                />
                {revealedSecret && showSecret ? (
                  <ActionBtn
                    onClick={() => handleCopy("secret", revealedSecret)}
                    icon={
                      copiedField === "secret" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )
                    }
                    label={t("whatsapp.settings.apiSettingsCopy")}
                  />
                ) : null}
                <ActionBtn
                  onClick={() => void handleRegenerateSecret()}
                  disabled={busy}
                  icon={<RefreshCw className="h-3.5 w-3.5" />}
                  label={t("whatsapp.settings.apiSettingsRegenerate")}
                />
              </>
            }
          />

          <div className="grid gap-2 sm:grid-cols-3">
            <Meta
              label={t("whatsapp.settings.apiSettingsLastUsed")}
              value={
                settings?.apiKey?.lastUsedAt
                  ? new Date(settings.apiKey.lastUsedAt).toLocaleString()
                  : "—"
              }
            />
            <Meta
              label={t("whatsapp.settings.apiSettingsLastDelivery")}
              value={
                settings?.webhook?.lastDeliveryAt
                  ? `${new Date(
                      settings.webhook.lastDeliveryAt
                    ).toLocaleString()}${
                      settings.webhook.lastDeliveryStatus
                        ? ` (${settings.webhook.lastDeliveryStatus})`
                        : ""
                    }`
                  : "—"
              }
            />
            <Meta
              label={t("whatsapp.settings.apiSettingsWebhookStatus")}
              value={settings?.webhook?.status || "not_configured"}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnSecondary}
              disabled={busy || !settings?.webhook?.url}
              onClick={() => void handleTestWebhook()}
            >
              <Send className="h-3.5 w-3.5" />
              {t("whatsapp.settings.apiSettingsTestWebhook")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  mono,
  actions,
}: {
  label: string;
  value: string;
  mono?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        <div className="flex flex-wrap gap-1.5">{actions}</div>
      </div>
      <p
        className={`rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 break-all ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-slate-800 break-all">
        {value}
      </p>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  icon,
  disabled,
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
    >
      {icon}
      {label}
    </button>
  );
}
