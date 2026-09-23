import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Check,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  Loader2,
  RefreshCw,
  Send,
  ShieldX,
  Webhook,
  X,
} from "lucide-react";
import {
  createWhatsAppExternalApiKey,
  getWhatsAppExternalApiSettings,
  regenerateWhatsAppExternalApiKey,
  regenerateWhatsAppExternalWebhookSecret,
  revealWhatsAppExternalWebhookSecret,
  revokeWhatsAppExternalApiKey,
  testWhatsAppExternalWebhook,
  updateWhatsAppExternalWebhookUrl,
  type WhatsAppExternalApiSettings,
} from "../../../../api/whatsappApi";
import { getApiErrorMessage } from "../../../../utils/apiErrorMessage";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
  modalOverlay,
} from "../../../../styles/bizuplyUi";

type Props = {
  businessId: string;
  linked: boolean;
};

type WebhookTestResult = {
  success: boolean;
  status?: string;
  statusCode?: number | null;
  durationMs?: number | null;
  error?: string;
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
  const [lastTestResult, setLastTestResult] =
    useState<WebhookTestResult | null>(null);

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
      await load();
      setRevealedApiKey(result.apiKey);
      toast.success(
        hasKey
          ? t("whatsapp.settings.apiSettingsKeyRegenerated")
          : t("whatsapp.settings.apiSettingsKeyCreated")
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("whatsapp.settings.apiSettingsKeyError")));
    } finally {
      setBusy(false);
    }
  };

  const handleRevokeKey = async () => {
    const apiKeyId = settings?.apiKey?.id;
    if (!businessId || !apiKeyId || busy) return;
    if (
      !window.confirm(
        t("whatsapp.settings.apiSettingsRevokeConfirm", {
          defaultValue:
            "Revoke this API key? Requests using it will stop working immediately.",
        })
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      await revokeWhatsAppExternalApiKey(businessId, apiKeyId);
      setRevealedApiKey(null);
      await load();
      toast.success(
        t("whatsapp.settings.apiSettingsKeyRevoked", {
          defaultValue: "API key revoked",
        })
      );
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          t("whatsapp.settings.apiSettingsRevokeError", {
            defaultValue: "Could not revoke API key",
          })
        )
      );
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
      setLastTestResult(result);
      if (result.success) {
        toast.success(t("whatsapp.settings.apiSettingsWebhookTestOk"));
      } else {
        toast.error(
          result.error || t("whatsapp.settings.apiSettingsWebhookTestFail")
        );
      }
      await load();
    } catch (err) {
      setLastTestResult({
        success: false,
        error: getApiErrorMessage(
          err,
          t("whatsapp.settings.apiSettingsWebhookTestFail")
        ),
      });
      toast.error(
        getApiErrorMessage(err, t("whatsapp.settings.apiSettingsWebhookTestFail"))
      );
    } finally {
      setBusy(false);
    }
  };

  if (!linked) return null;

  const apiKeyDisplay =
    settings?.apiKey?.maskedKey ||
    t("whatsapp.settings.apiSettingsNoKey");
  const secretDisplay = showSecret && revealedSecret
    ? revealedSecret
    : settings?.webhook?.maskedSecret ||
      t("whatsapp.settings.apiSettingsNoSecret");
  const apiBaseUrl = settings?.apiBaseUrl || "https://api.bizuply.com/api/v1/whatsapp";
  const docsUrl =
    settings?.docsUrl ||
    (() => {
      try {
        return `${apiBaseUrl.replace(/\/$/, "")}/docs`;
      } catch {
        return "https://api.bizuply.com/api/v1/whatsapp/docs";
      }
    })();
  const deliverySucceeded = ["delivered", "sent", "success"].includes(
    String(settings?.webhook?.lastDeliveryStatus || "").toLowerCase()
  );

  return (
    <>
    <div className={`${cardBase} px-4 py-4 sm:px-5`}>
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
                {settings?.apiKey ? (
                  <ActionBtn
                    onClick={() => handleCopy("apiKey", apiKeyDisplay)}
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
                {settings?.apiKey ? (
                  <ActionBtn
                    onClick={() => void handleRevokeKey()}
                    disabled={busy}
                    icon={<ShieldX className="h-3.5 w-3.5" />}
                    label={t("whatsapp.settings.apiSettingsRevoke", {
                      defaultValue: "Revoke",
                    })}
                    danger
                  />
                ) : null}
              </>
            }
          />

          {settings?.apiKey ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <Meta
                label={t("whatsapp.settings.apiSettingsLastUsed")}
                value={formatDate(settings.apiKey.lastUsedAt)}
              />
              <Meta
                label={t("whatsapp.settings.apiSettingsCreatedAt", {
                  defaultValue: "Created At",
                })}
                value={formatDate(settings.apiKey.createdAt)}
              />
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 sm:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {t("whatsapp.settings.apiSettingsScopes", {
                    defaultValue: "Scopes",
                  })}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {settings.apiKey.scopes.length ? (
                    settings.apiKey.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="rounded-md border border-violet-100 bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-700"
                      >
                        {scope}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">—</span>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <Field
            label={t("whatsapp.settings.apiSettingsBaseUrl")}
            value={apiBaseUrl}
            mono
            actions={
              <ActionBtn
                onClick={() => handleCopy("baseUrl", apiBaseUrl)}
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
          <a
            href={docsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900 hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {t("whatsapp.settings.apiSettingsDocs", {
              defaultValue: "API Docs",
            })}
          </a>

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

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-black text-slate-800">
                {t("whatsapp.settings.apiSettingsLastDelivery")}
              </p>
              {settings?.webhook?.lastDeliveryAt ? (
                <StatusBadge
                  success={deliverySucceeded}
                  label={
                    deliverySucceeded
                      ? t("whatsapp.settings.apiSettingsDeliverySuccess", {
                          defaultValue: "Success",
                        })
                      : t("whatsapp.settings.apiSettingsDeliveryFailed", {
                          defaultValue: "Failed",
                        })
                  }
                />
              ) : null}
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <Meta
                label={t("whatsapp.settings.apiSettingsTimestamp", {
                  defaultValue: "Timestamp",
                })}
                value={formatDate(settings?.webhook?.lastDeliveryAt)}
              />
              <Meta
                label={t("whatsapp.settings.apiSettingsHttpStatus", {
                  defaultValue: "HTTP Status",
                })}
                value={formatNumber(settings?.webhook?.lastDeliveryHttpStatus)}
              />
              <Meta
                label={t("whatsapp.settings.apiSettingsDuration", {
                  defaultValue: "Duration",
                })}
                value={formatDuration(settings?.webhook?.lastDeliveryDurationMs)}
              />
            </div>
            {settings?.webhook?.lastDeliveryError ? (
              <p className="mt-2 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 break-words">
                {settings.webhook.lastDeliveryError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={btnSecondary}
              disabled={busy || !settings?.webhook?.url}
              onClick={() => void handleTestWebhook()}
            >
              <Send className="h-3.5 w-3.5" />
              {t("whatsapp.settings.apiSettingsTestWebhook")}
            </button>
            <span className="text-xs font-semibold text-slate-500">
              {t("whatsapp.settings.apiSettingsWebhookStatus")}:{" "}
              {settings?.webhook?.status || "not_configured"}
            </span>
          </div>
          {lastTestResult ? (
            <div
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                lastTestResult.success
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-red-100 bg-red-50 text-red-800"
              }`}
              role="status"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <strong>
                  {lastTestResult.success
                    ? t("whatsapp.settings.apiSettingsTestSent", {
                        defaultValue: "Sent",
                      })
                    : t("whatsapp.settings.apiSettingsTestFailed", {
                        defaultValue: "Failed",
                      })}
                </strong>
                <span>
                  {t("whatsapp.settings.apiSettingsHttpStatus", {
                    defaultValue: "HTTP Status",
                  })}
                  : {formatNumber(lastTestResult.statusCode)}
                </span>
                <span>
                  {t("whatsapp.settings.apiSettingsResponseTime", {
                    defaultValue: "Response time",
                  })}
                  : {formatDuration(lastTestResult.durationMs)}
                </span>
              </div>
              {!lastTestResult.success && lastTestResult.error ? (
                <p className="mt-1 break-words">{lastTestResult.error}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
    {revealedApiKey ? (
      <div className={modalOverlay} role="presentation">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-api-key-dialog-title"
          aria-describedby="whatsapp-api-key-dialog-description"
          className={`${cardBase} w-full max-w-xl p-5 sm:p-6`}
          dir="ltr"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2
                id="whatsapp-api-key-dialog-title"
                className="text-lg font-black text-slate-900"
              >
                {t("whatsapp.settings.apiSettingsKeyReady", {
                  defaultValue: "Your API key is ready",
                })}
              </h2>
              <p
                id="whatsapp-api-key-dialog-description"
                className="mt-1 text-sm font-semibold text-amber-800"
              >
                {t("whatsapp.settings.apiSettingsKeyCopyWarning", {
                  defaultValue:
                    "Copy this API key now. For security reasons, it will not be shown again.",
                })}
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-950 p-3">
            <code className="block select-all break-all text-sm font-semibold text-white">
              {revealedApiKey}
            </code>
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setRevealedApiKey(null)}
            >
              <X className="h-4 w-4" aria-hidden />
              {t("whatsapp.settings.apiSettingsDone", {
                defaultValue: "I have copied the key",
              })}
            </button>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => void handleCopy("revealedApiKey", revealedApiKey)}
            >
              {copiedField === "revealedApiKey" ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              {t("whatsapp.settings.apiSettingsCopy")}
            </button>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString() : "—";
}

function formatNumber(value?: number | null) {
  return typeof value === "number" ? String(value) : "—";
}

function formatDuration(value?: number | null) {
  return typeof value === "number" ? `${value} ms` : "—";
}

function StatusBadge({
  success,
  label,
}: {
  success: boolean;
  label: string;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
        success
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {label}
    </span>
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
  danger,
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md border bg-white px-2 py-1 text-[11px] font-bold disabled:opacity-50 ${
        danger
          ? "border-red-200 text-red-700 hover:bg-red-50"
          : "border-slate-200 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
