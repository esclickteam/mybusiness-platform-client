import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
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

type SiteMorningInvoicePanelProps = {
  businessId: string;
};

const DOCUMENT_TYPES = [
  { value: 320, label: "חשבונית מס / קבלה (320)" },
  { value: 305, label: "חשבונית מס (305)" },
  { value: 400, label: "קבלה (400)" },
];

const PAYMENT_TYPES = [
  { value: 3, label: "כרטיס אשראי (3)" },
  { value: 1, label: "מזומן (1)" },
  { value: 4, label: "העברה בנקאית (4)" },
  { value: 11, label: "אחר (11)" },
];

const VAT_TYPES = [
  { value: 1, label: "כולל מע״מ" },
  { value: 0, label: "לפני מע״מ" },
  { value: 2, label: "פטור ממע״מ" },
];

export default function SiteMorningInvoicePanel({
  businessId,
}: SiteMorningInvoicePanelProps) {
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

  const loadSettings = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    try {
      const data = await getMorningInvoiceSettings(businessId);
      setSettings(data);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || "שגיאה בטעינת הגדרות Morning",
      });
    } finally {
      setLoading(false);
    }
  }, [businessId]);

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
      setMessage({ type: "success", text: "ההגדרות נשמרו בהצלחה" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || "שגיאה בשמירה",
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
          ? `החיבור הצליח${result.businessName ? ` — ${result.businessName}` : ""}`
          : result.message || "בדיקת החיבור נכשלה",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || err?.response?.data?.message || "בדיקת החיבור נכשלה",
      });
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[280px] place-items-center">
        <div className="flex items-center gap-3 text-sm font-black text-slate-500">
          <BizuplyLoader size="sm" compact />
          טוען הגדרות Morning...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-l from-emerald-50 via-white to-white p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Morning — חשבונית ירוקה</h2>
            <p className="mt-1 max-w-3xl text-sm font-bold leading-7 text-slate-500">
              חיבור ל-API של Morning להפקת חשבוניות מס/קבלה אוטומטית על הזמנות
              מהחנות. דורש מנוי Best ומעלה ב-Morning.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">מדריך חיבור — 4 שלבים</h3>
        <ol className="mt-4 space-y-4 text-sm font-bold leading-7 text-slate-600">
          <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-black text-emerald-700">1. מנוי Best+</span>
            <br />
            ודאו שיש לכם מנוי Best ומעלה ב-Morning. לבדיקות אפשר Sandbox:
            <a
              href="https://lp.sandbox.d.greeninvoice.co.il/join"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-2 inline-flex items-center gap-1 font-black text-violet-700 hover:underline"
            >
              הרשמה ל-Sandbox
              <ExternalLink size={13} />
            </a>
          </li>
          <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-black text-emerald-700">2. יצירת מפתח API</span>
            <br />
            ב-Morning: אזור אישי → כלים למפתחים → מפתחות API → שמירה.
            <br />
            תקבלו <strong>מזהה מפתח</strong> + <strong>מפתח סודי</strong> (מוצג פעם אחת בלבד!).
          </li>
          <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-black text-emerald-700">3. הדבקה כאן</span>
            <br />
            הזינו את שני הערכים למטה, לחצו "בדיקת חיבור", ואז "שמירה".
          </li>
          <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="font-black text-emerald-700">4. הפקה אוטומטית</span>
            <br />
            כשהזמנה מסומנת כ<strong>שולמה</strong>, תופק חשבונית אוטומטית ב-Morning.
          </li>
        </ol>

        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs font-bold leading-6 text-amber-900">
          <ShieldCheck size={14} className="mb-1 inline" /> המפתח הסודי נשמר מוצפן בשרת
          BizUply ולא מוצג שוב. אם איבדתם אותו — צרו מפתח חדש ב-Morning.
        </div>
      </div>

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

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-black text-slate-950">הגדרות חיבור</h3>
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
              ? "מחובר"
              : settings.connectionStatus === "failed"
                ? "שגיאת חיבור"
                : "לא מחובר"}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">סביבה</span>
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
              <option value="live">Production (חי)</option>
              <option value="test">Sandbox (בדיקות)</option>
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
            <span className="text-sm font-black text-slate-700">הפעלת Morning לעסק</span>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-black text-slate-500">מזהה מפתח (API Key ID)</span>
            <input
              value={settings.apiKeyId}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, apiKeyId: e.target.value }))
              }
              placeholder="הדביקו את מזהה המפתח מ-Morning"
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-black text-slate-500">
              מפתח סודי (API Secret)
              {settings.hasApiSecret ? (
                <span className="mr-2 text-emerald-600">— שמור ({settings.apiSecretPreview})</span>
              ) : null}
            </span>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder={
                settings.hasApiSecret
                  ? "השאירו ריק כדי לשמור את הקיים, או הדביקו מפתח חדש"
                  : "הדביקו את המפתח הסודי (מוצג פעם אחת בלבד)"
              }
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">סוג מסמך</span>
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
              {DOCUMENT_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">סוג תשלום</span>
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
              {PAYMENT_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">מע״מ</span>
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
              {VAT_TYPES.map((item) => (
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
              הפקה אוטומטית כשהזמנה שולמה
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
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white disabled:opacity-60"
          >
            {saving ? <BizuplyLoader size="xs" compact /> : <Save size={16} />}
            שמירה
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 disabled:opacity-60"
          >
            {testing ? (
              <BizuplyLoader size="xs" compact />
            ) : (
              <RefreshCcw size={16} />
            )}
            בדיקת חיבור
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm font-bold leading-7 text-slate-500">
        <strong className="text-slate-800">API ידני (למפתחים):</strong>
        <br />
        Production: <code className="text-xs">POST https://api.greeninvoice.co.il/api/v1/account/token</code>
        <br />
        Sandbox: <code className="text-xs">POST https://sandbox.d.greeninvoice.co.il/api/v1/account/token</code>
        <br />
        Body: <code className="text-xs">{`{"id":"KEY_ID","secret":"KEY_SECRET"}`}</code>
        <br />
        תיעוד:{" "}
        <a
          href="https://www.greeninvoice.co.il/help-center/api/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-black text-violet-700 hover:underline"
        >
          greeninvoice.co.il/help-center/api
        </a>
      </div>
    </div>
  );
}