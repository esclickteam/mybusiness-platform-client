import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  RefreshCcw,
  Save,
  ShieldCheck,
} from "lucide-react";

import BizuplyLoader from "../../../components/ui/BizuplyLoader";
import {
  getMorningInvoiceSettings,
  saveMorningInvoiceSettings,
  testMorningConnection,
  type MorningInvoiceSettings,
} from "../../../api/morningInvoiceApi";
import { getTextDirection } from "../../../i18n/localeUtils";
import { SitePanelCard, SitePanelHero } from "./SitePanelShell";
import { btnGhost, btnPrimary } from "./siteManagementUi";

type SiteMorningInvoicePanelProps = {
  businessId: string;
};

export default function SiteMorningInvoicePanel({
  businessId,
}: SiteMorningInvoicePanelProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [settings, setSettings] = useState<MorningInvoiceSettings>({
    isEnabled: false,
    mode: "live",
    apiKeyId: "",
    hasApiSecret: false,
    autoIssueOnPaid: true,
    documentType: 320,
    paymentType: 3,
    vatType: 1,
    currency: "ILS",
    lang: "he",
    sendByEmail: true,
    connectionStatus: "not_connected",
  });

  const [apiSecret, setApiSecret] = useState("");

  const documentTypes = [
    { value: 320, label: t("sitePlugins.morning.doc320") },
    { value: 305, label: t("sitePlugins.morning.doc305") },
    { value: 400, label: t("sitePlugins.morning.doc400") },
  ];

  const paymentTypes = [
    { value: 3, label: t("sitePlugins.morning.payCard") },
    { value: 1, label: t("sitePlugins.morning.payCash") },
    { value: 4, label: t("sitePlugins.morning.payBank") },
    { value: 11, label: t("sitePlugins.morning.payOther") },
  ];

  const vatTypes = [
    { value: 1, label: t("sitePlugins.morning.vatIncl") },
    { value: 0, label: t("sitePlugins.morning.vatExcl") },
    { value: 2, label: t("sitePlugins.morning.vatExempt") },
  ];

  const loadSettings = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    try {
      const data = await getMorningInvoiceSettings(businessId);
      setSettings(data);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || t("sitePlugins.morning.loadError"),
      });
    } finally {
      setLoading(false);
    }
  }, [businessId, t]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function handleSave() {
    if (!businessId) return;

    setSaving(true);
    setMessage(null);

    try {
      const payload: Record<string, unknown> = { ...settings };
      if (apiSecret.trim()) {
        payload.apiSecret = apiSecret.trim();
      }

      const saved = await saveMorningInvoiceSettings(businessId, payload);
      setSettings(saved);
      setApiSecret("");
      setMessage({ type: "success", text: t("sitePlugins.morning.saved") });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || t("sitePlugins.morning.saveError"),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleTestConnection() {
    if (!businessId) return;

    setTesting(true);
    setMessage(null);

    try {
      if (apiSecret.trim() || settings.apiKeyId) {
        await saveMorningInvoiceSettings(businessId, {
          ...settings,
          apiKeyId: settings.apiKeyId,
          apiSecret: apiSecret.trim() || undefined,
        });
      }

      const result = await testMorningConnection(businessId);

      if (result.settings) {
        setSettings(result.settings);
      }

      setMessage({
        type: result.success ? "success" : "error",
        text: result.success
          ? t("sitePlugins.morning.testOk", {
              suffix: result.businessName ? ` — ${result.businessName}` : "",
            })
          : result.message || t("sitePlugins.morning.testFail"),
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          t("sitePlugins.morning.testFail"),
      });
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[280px] place-items-center" dir={pageDir}>
        <div className="flex items-center gap-3 text-sm font-black text-slate-500">
          <BizuplyLoader size="sm" compact />
          {t("sitePlugins.morning.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" dir={pageDir}>
      <SitePanelHero
        icon={FileText}
        accent="#10B981"
        title={t("sitePlugins.morning.title")}
        description={t("sitePlugins.morning.description")}
      />

      <SitePanelCard>
        <h3 className="text-base font-bold text-slate-900">
          {t("sitePlugins.morning.guideTitle")}
        </h3>
        <ol className="mt-4 space-y-4 text-sm font-bold leading-7 text-slate-600">
          <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-black text-emerald-700">
              {t("sitePlugins.morning.step1Title")}
            </span>
            <br />
            {t("sitePlugins.morning.step1Body")}
            <a
              href="https://lp.sandbox.d.greeninvoice.co.il/join"
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2 inline-flex items-center gap-1 font-black text-violet-700 hover:underline"
            >
              {t("sitePlugins.morning.sandboxSignup")}
              <ExternalLink size={13} />
            </a>
          </li>
          <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-black text-emerald-700">
              {t("sitePlugins.morning.step2Title")}
            </span>
            <br />
            {t("sitePlugins.morning.step2Body")}
          </li>
          <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-black text-emerald-700">
              {t("sitePlugins.morning.step3Title")}
            </span>
            <br />
            {t("sitePlugins.morning.step3Body")}
          </li>
          <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-black text-emerald-700">
              {t("sitePlugins.morning.step4Title")}
            </span>
            <br />
            {t("sitePlugins.morning.step4Body")}
          </li>
        </ol>

        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs font-bold leading-6 text-amber-900">
          <ShieldCheck size={14} className="mb-1 inline" />{" "}
          {t("sitePlugins.morning.secretHint")}
        </div>
      </SitePanelCard>

      {message ? (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-black ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <CheckCircle2 size={18} />
          {message.text}
        </div>
      ) : null}

      <SitePanelCard>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">
            {t("sitePlugins.morning.connectionSettings")}
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              settings.connectionStatus === "connected"
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                : settings.connectionStatus === "failed"
                  ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {settings.connectionStatus === "connected"
              ? t("sitePlugins.morning.connected")
              : settings.connectionStatus === "failed"
                ? t("sitePlugins.morning.connectError")
                : t("sitePlugins.morning.notConnected")}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">
              {t("sitePlugins.morning.environment")}
            </span>
            <select
              value={settings.mode}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  mode: e.target.value as "test" | "live",
                }))
              }
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold"
            >
              <option value="live">{t("sitePlugins.morning.liveAccount")}</option>
              <option value="test">{t("sitePlugins.morning.testAccount")}</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={settings.isEnabled}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, isEnabled: e.target.checked }))
              }
            />
            <span className="text-sm font-black text-slate-700">
              {t("sitePlugins.morning.enable")}
            </span>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-black text-slate-500">
              {t("sitePlugins.morning.keyId")}
            </span>
            <input
              value={settings.apiKeyId}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, apiKeyId: e.target.value }))
              }
              placeholder={t("sitePlugins.morning.keyIdPlaceholder")}
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-black text-slate-500">
              {t("sitePlugins.morning.secret")}
              {settings.hasApiSecret ? (
                <span className="ms-2 text-emerald-600">
                  {t("sitePlugins.morning.secretSaved", {
                    preview: settings.apiSecretPreview,
                  })}
                </span>
              ) : null}
            </span>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder={
                settings.hasApiSecret
                  ? t("sitePlugins.morning.secretKeep")
                  : t("sitePlugins.morning.secretPaste")
              }
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">
              {t("sitePlugins.morning.documentType")}
            </span>
            <select
              value={settings.documentType}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  documentType: Number(e.target.value),
                }))
              }
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold"
            >
              {documentTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">
              {t("sitePlugins.morning.paymentType")}
            </span>
            <select
              value={settings.paymentType}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  paymentType: Number(e.target.value),
                }))
              }
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold"
            >
              {paymentTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">
              {t("sitePlugins.morning.vat")}
            </span>
            <select
              value={settings.vatType}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  vatType: Number(e.target.value),
                }))
              }
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold"
            >
              {vatTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={settings.autoIssueOnPaid}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  autoIssueOnPaid: e.target.checked,
                }))
              }
            />
            <span className="text-sm font-black text-slate-700">
              {t("sitePlugins.morning.autoIssue")}
            </span>
          </label>
        </div>

        {settings.lastError ? (
          <p className="mt-4 text-sm font-bold text-rose-600">{settings.lastError}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={btnPrimary + " h-11 disabled:opacity-60"}
          >
            {saving ? <BizuplyLoader size="xs" compact /> : <Save size={16} />}
            {t("sitePlugins.morning.save")}
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className={btnGhost + " h-11 disabled:opacity-60"}
          >
            {testing ? (
              <BizuplyLoader size="xs" compact />
            ) : (
              <RefreshCcw size={16} />
            )}
            {t("sitePlugins.morning.test")}
          </button>
        </div>
      </SitePanelCard>
    </div>
  );
}
