import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Loader2,
  PlugZap,
  ShieldAlert,
  Unplug,
} from "lucide-react";
import {
  disconnectWhatsApp,
  getWhatsAppStatus,
  saveWhatsAppConnection,
  sendWhatsAppTest,
  type WhatsAppConnection,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

export default function WhatsAppSettingsTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [form, setForm] = useState({
    phoneNumberId: "",
    wabaId: "",
    accessToken: "",
    displayPhoneNumber: "",
    verifiedName: "",
  });
  const [testPhone, setTestPhone] = useState("");

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const status = await getWhatsAppStatus(businessId);
      setConnection(status);
      setForm({
        phoneNumberId: status.phoneNumberId || "",
        wabaId: status.wabaId || "",
        accessToken: "",
        displayPhoneNumber: status.displayPhoneNumber || "",
        verifiedName: status.verifiedName || "",
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.loadSettings")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const handleSave = async () => {
    if (!businessId) return;
    try {
      setSaving(true);
      const status = await saveWhatsAppConnection(businessId, {
        phoneNumberId: form.phoneNumberId,
        wabaId: form.wabaId,
        accessToken: form.accessToken || undefined,
        displayPhoneNumber: form.displayPhoneNumber,
        verifiedName: form.verifiedName,
      });
      setConnection(status);
      setForm((prev) => ({ ...prev, accessToken: "" }));
      toast.success(t("whatsapp.settings.saved"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.saveSettings")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!businessId) return;
    if (!window.confirm(t("whatsapp.settings.confirmDisconnect"))) return;
    try {
      setSaving(true);
      const status = await disconnectWhatsApp(businessId);
      setConnection(status);
      setForm({
        phoneNumberId: "",
        wabaId: "",
        accessToken: "",
        displayPhoneNumber: "",
        verifiedName: "",
      });
      toast.success(t("whatsapp.settings.disconnected"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.disconnect")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!businessId || !testPhone.trim()) {
      toast.error(t("whatsapp.settings.testPhoneRequired"));
      return;
    }
    try {
      setTesting(true);
      await sendWhatsAppTest(businessId, {
        phone: testPhone.trim(),
        name: t("whatsapp.settings.testName"),
        body: t("whatsapp.settings.testBody"),
      });
      toast.success(t("whatsapp.settings.testSent"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.testFailed")
      );
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center justify-center gap-2 p-10`}>
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-600">
          {t("whatsapp.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className={`${cardBase} p-4 sm:p-5`}>
        <h2 className="text-lg font-black text-slate-900">
          {t("whatsapp.settings.title")}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t("whatsapp.settings.subtitle")}
        </p>

        <div className="mt-5 grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-black text-slate-600">
              Phone Number ID
            </span>
            <input
              className={inputBase}
              value={form.phoneNumberId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phoneNumberId: e.target.value }))
              }
              placeholder="123456789012345"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-black text-slate-600">
              WhatsApp Business Account ID
            </span>
            <input
              className={inputBase}
              value={form.wabaId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, wabaId: e.target.value }))
              }
              placeholder="WABA ID"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-black text-slate-600">
              Access Token
            </span>
            <input
              className={inputBase}
              type="password"
              value={form.accessToken}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, accessToken: e.target.value }))
              }
              placeholder={
                connection?.hasAccessToken
                  ? connection.accessTokenMasked || "••••••••"
                  : t("whatsapp.settings.tokenPlaceholder")
              }
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.settings.displayPhone")}
              </span>
              <input
                className={inputBase}
                value={form.displayPhoneNumber}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    displayPhoneNumber: e.target.value,
                  }))
                }
                placeholder="+972..."
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.settings.verifiedName")}
              </span>
              <input
                className={inputBase}
                value={form.verifiedName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, verifiedName: e.target.value }))
                }
              />
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className={btnPrimary}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlugZap className="h-4 w-4" />
            )}
            {t("whatsapp.settings.save")}
          </button>
          <button
            type="button"
            className={btnSecondary}
            disabled={saving}
            onClick={handleDisconnect}
          >
            <Unplug className="h-4 w-4" />
            {t("whatsapp.settings.disconnect")}
          </button>
        </div>
      </section>

      <div className="space-y-4">
        <section className={`${cardBase} p-4 sm:p-5`}>
          <div className="flex items-center gap-2">
            {connection?.connected ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            )}
            <h3 className="text-base font-black text-slate-900">
              {connection?.connected
                ? t("whatsapp.settings.connected")
                : t("whatsapp.settings.disconnectedStatus")}
            </h3>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {connection?.connected
              ? t("whatsapp.settings.connectedHint")
              : t("whatsapp.settings.disconnectedHint")}
          </p>
          {connection?.lastError && (
            <p className="mt-3 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {connection.lastError}
            </p>
          )}
          {connection?.usingEnvFallback && (
            <p className="mt-3 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
              {t("whatsapp.settings.envFallback")}
            </p>
          )}
        </section>

        <section className={`${cardBase} p-4 sm:p-5`}>
          <h3 className="text-base font-black text-slate-900">
            {t("whatsapp.settings.testTitle")}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.settings.testSubtitle")}
          </p>
          <input
            className={`${inputBase} mt-3`}
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="050-0000000"
          />
          <button
            type="button"
            className={`${btnPrimary} mt-3 w-full`}
            disabled={testing || !connection?.connected}
            onClick={handleTest}
          >
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlugZap className="h-4 w-4" />
            )}
            {t("whatsapp.settings.sendTest")}
          </button>
        </section>

        <section className={`${cardBase} p-4 sm:p-5`}>
          <h3 className="text-base font-black text-slate-900">
            {t("whatsapp.settings.helpTitle")}
          </h3>
          <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm font-medium text-slate-600">
            <li>{t("whatsapp.settings.help1")}</li>
            <li>{t("whatsapp.settings.help2")}</li>
            <li>{t("whatsapp.settings.help3")}</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
