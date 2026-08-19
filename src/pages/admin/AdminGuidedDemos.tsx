import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Search, Sparkles, X } from "lucide-react";
import AdminHeader from "./AdminsHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import {
  createGuidedDemo,
  fetchGuidedDemoCatalog,
  fetchGuidedDemoAnalytics,
  listGuidedDemos,
} from "../../api/guidedDemoApi";

const STATUS_LABEL: Record<string, string> = {
  created: "נוצר",
  sent: "נשלח",
  opened: "נפתח",
  in_progress: "בתהליך",
  completed: "הושלם",
  expired: "פג תוקף",
  revoked: "בוטל",
  delivery_failed: "שגיאת שליחה",
};

const STATUS_TONE: Record<string, string> = {
  created: "bg-slate-50 text-slate-600 border-slate-200",
  sent: "bg-sky-50 text-sky-700 border-sky-200",
  opened: "bg-violet-50 text-violet-700 border-violet-200",
  in_progress: "bg-amber-50 text-amber-800 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expired: "bg-slate-100 text-slate-500 border-slate-200",
  revoked: "bg-rose-50 text-rose-700 border-rose-200",
  delivery_failed: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const EMPTY = {
  customerName: "",
  customerPhone: "",
  businessName: "",
  internalNote: "",
  presetKey: "full",
  moduleKeys: [] as string[],
  channel: "whatsapp",
  ttlHours: 24,
};

export default function AdminGuidedDemos() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [catalog, setCatalog] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [wizard, setWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, cat, stats] = await Promise.all([
        listGuidedDemos({ q, limit: 50 }),
        fetchGuidedDemoCatalog(),
        fetchGuidedDemoAnalytics().catch(() => null),
      ]);
      setItems(list.items || []);
      setCatalog(cat.catalog);
      setDelivery(cat.delivery);
      setAnalytics(stats?.analytics || null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת הדמואים נכשלה");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedKeys = useMemo(() => {
    if (form.presetKey === "custom") return form.moduleKeys;
    const preset = catalog?.presets?.find((p: any) => p.key === form.presetKey);
    return preset?.moduleKeys || [];
  }, [form.presetKey, form.moduleKeys, catalog]);

  const selectedTitles = (catalog?.modules || [])
    .filter((m: any) => selectedKeys.includes(m.key))
    .map((m: any) => m.title);

  function toggleModule(key: string) {
    setForm((prev) => {
      const has = prev.moduleKeys.includes(key);
      return {
        ...prev,
        presetKey: "custom",
        moduleKeys: has ? prev.moduleKeys.filter((k) => k !== key) : [...prev.moduleKeys, key],
      };
    });
  }

  async function submit() {
    setCreating(true);
    setError("");
    try {
      const data = await createGuidedDemo({
        ...form,
        moduleKeys: selectedKeys,
      });
      if (!data.delivery?.ok) {
        setSuccess({
          ...data,
          warning: data.delivery?.error || "השליחה נכשלה",
        });
      } else {
        setSuccess(data);
      }
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "יצירת הדמו נכשלה");
    } finally {
      setCreating(false);
    }
  }

  const waOk = delivery?.whatsapp?.available;
  const smsOk = delivery?.sms?.available;

  return (
    <div className="min-h-screen bg-[#f5f6fb]" dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">דמואים ללקוחות</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              שליחת קישור אישי לדמו אינטראקטיבי מבודד.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setWizard(true);
              setStep(1);
              setForm(EMPTY);
              setSuccess(null);
              setError("");
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
          >
            <Plus className="h-4 w-4" />
            שליחת דמו חדש
          </button>
        </div>

        {analytics ? (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["נשלחו", analytics.sent],
              ["נפתחו", analytics.opened],
              ["התחילו", analytics.started],
              ["סיימו", analytics.completed],
              ["Completion", `${analytics.completionRate || 0}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{value ?? 0}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם או טלפון"
            className="h-10 w-full bg-transparent text-sm font-bold outline-none"
          />
        </div>

        {error && !wizard ? <p className="mb-3 text-sm font-bold text-rose-600">{error}</p> : null}

        {loading ? (
          <div className="grid place-items-center py-20">
            <BizuplyLoader />
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs font-black text-slate-500">
                <tr>
                  <th className="px-4 py-3">לקוח</th>
                  <th className="px-4 py-3">טלפון</th>
                  <th className="px-4 py-3">נשלח</th>
                  <th className="px-4 py-3">סוג דמו</th>
                  <th className="px-4 py-3">סטטוס</th>
                  <th className="px-4 py-3">התקדמות</th>
                  <th className="px-4 py-3">פעילות אחרונה</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row._id}
                    className="cursor-pointer border-t border-slate-100 hover:bg-violet-50/40"
                    onClick={() => navigate(`/admin/guided-demos/${row._id}`)}
                  >
                    <td className="px-4 py-3 font-black text-slate-800">{row.customerName}</td>
                    <td className="px-4 py-3 font-bold text-slate-600" dir="ltr">
                      {row.customerPhone}
                    </td>
                    <td className="px-4 py-3">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-500">
                      {(row.selectedModules || []).join(", ") || row.presetKey}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${STATUS_TONE[row.status] || STATUS_TONE.created}`}>
                        {STATUS_LABEL[row.status] || row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {row.completedSteps || 0}/{row.totalSteps || 0} — {row.completionPercent || 0}%
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(row.lastActivityAt)}</td>
                  </tr>
                ))}
                {!items.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center font-bold text-slate-400">
                      עדיין לא נשלחו דמואים
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {wizard ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">שליחת דמו חדש</h2>
              <button type="button" onClick={() => setWizard(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="text-center">
                <Sparkles className="mx-auto h-10 w-10 text-violet-600" />
                <h3 className="mt-3 text-2xl font-black">
                  {success.delivery?.ok ? "הדמו נשלח בהצלחה" : "הדמו נוצר, השליחה נכשלה"}
                </h3>
                <p className="mt-2 text-sm font-bold text-slate-500">
                  {selectedTitles.join(" + ") || success.invitation?.selectedModules?.join(" + ")}
                </p>
                {success.demoLink ? (
                  <p className="mt-3 break-all rounded-xl bg-slate-50 p-3 text-xs font-bold" dir="ltr">
                    {success.demoLink}
                  </p>
                ) : null}
                {success.warning ? (
                  <p className="mt-2 text-sm font-bold text-rose-600">{success.warning}</p>
                ) : null}
                <button
                  type="button"
                  className="mt-6 rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
                  onClick={() => {
                    setWizard(false);
                    if (success.invitation?._id) {
                      navigate(`/admin/guided-demos/${success.invitation._id}`);
                    }
                  }}
                >
                  מעקב אחר הדמו
                </button>
              </div>
            ) : (
              <>
                {step === 1 ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-black">שם הלקוח
                      <input
                        className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                        value={form.customerName}
                        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      />
                    </label>
                    <label className="block text-sm font-black">מספר טלפון
                      <input
                        className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                        dir="ltr"
                        value={form.customerPhone}
                        onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                        placeholder="0501234567"
                      />
                    </label>
                    <label className="block text-sm font-black">שם העסק (אופציונלי)
                      <input
                        className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                        value={form.businessName}
                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      />
                    </label>
                    <label className="block text-sm font-black">הערה פנימית
                      <textarea
                        className="mt-1 w-full rounded-xl border px-3 py-2 font-bold"
                        value={form.internalNote}
                        onChange={(e) => setForm({ ...form, internalNote: e.target.value })}
                      />
                    </label>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="space-y-4">
                    <p className="text-sm font-black">מה לכלול?</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(catalog?.presets || []).map((preset: any) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              presetKey: preset.key,
                              moduleKeys: preset.key === "custom" ? form.moduleKeys : preset.moduleKeys,
                            })
                          }
                          className={`rounded-2xl border p-3 text-right text-sm font-bold ${
                            form.presetKey === preset.key
                              ? "border-violet-400 bg-violet-50"
                              : "border-slate-200"
                          }`}
                        >
                          {preset.title}
                          <span className="mt-1 block text-xs font-semibold text-slate-500">
                            {preset.description}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="grid max-h-56 gap-2 overflow-auto sm:grid-cols-2">
                      {(catalog?.modules || []).map((mod: any) => (
                        <label key={mod.key} className="flex items-start gap-2 rounded-xl border border-slate-100 p-2 text-sm font-bold">
                          <input
                            type="checkbox"
                            checked={selectedKeys.includes(mod.key)}
                            onChange={() => toggleModule(mod.key)}
                          />
                          <span>
                            {mod.title}
                            {!mod.interactive ? (
                              <em className="block text-[11px] font-semibold text-amber-700">
                                {mod.simulationReason || "הסבר בלבד"}
                              </em>
                            ) : null}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-black">שליחה דרך</p>
                    <label className={`flex items-center gap-2 rounded-2xl border p-3 ${waOk ? "border-violet-200" : "opacity-60"}`}>
                      <input
                        type="radio"
                        name="channel"
                        checked={form.channel === "whatsapp"}
                        disabled={!waOk}
                        onChange={() => setForm({ ...form, channel: "whatsapp" })}
                      />
                      WhatsApp
                      {!waOk ? (
                        <span className="text-xs font-bold text-rose-600">
                          {delivery?.whatsapp?.reason || "לא זמין"}
                        </span>
                      ) : null}
                    </label>
                    <label className={`flex items-center gap-2 rounded-2xl border p-3 ${smsOk ? "border-violet-200" : "opacity-60"}`}>
                      <input
                        type="radio"
                        name="channel"
                        checked={form.channel === "sms"}
                        disabled={!smsOk}
                        onChange={() => setForm({ ...form, channel: "sms" })}
                      />
                      SMS
                      <span className="text-xs font-bold text-rose-600">
                        {delivery?.sms?.reason || "לא זמין"}
                      </span>
                    </label>
                    <label className="block text-sm font-black">תוקף
                      <select
                        className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                        value={form.ttlHours}
                        onChange={(e) => setForm({ ...form, ttlHours: Number(e.target.value) })}
                      >
                        {(catalog?.ttlOptionsHours || [1, 6, 24, 48, 168]).map((h: number) => (
                          <option key={h} value={h}>
                            {h === 168 ? "7 ימים" : h === 1 ? "שעה" : `${h} שעות`}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm font-bold">
                    <p>לקוח: {form.customerName}</p>
                    <p>טלפון: {form.customerPhone}</p>
                    <p>ערוץ: {form.channel === "whatsapp" ? "WhatsApp" : "SMS"}</p>
                    <p>דמו כולל: {selectedTitles.join(", ") || "—"}</p>
                    <p>תוקף: {form.ttlHours === 168 ? "7 ימים" : `${form.ttlHours} שעות`}</p>
                  </div>
                ) : null}

                {error ? <p className="mt-3 text-sm font-bold text-rose-600">{error}</p> : null}

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    disabled={step === 1}
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-xl border px-4 py-2 text-sm font-black disabled:opacity-40"
                  >
                    חזרה
                  </button>
                  {step < 4 ? (
                    <button
                      type="button"
                      disabled={
                        (step === 1 && (!form.customerName.trim() || !form.customerPhone.trim())) ||
                        (step === 2 && !selectedKeys.length) ||
                        (step === 3 && ((form.channel === "whatsapp" && !waOk) || (form.channel === "sms" && !smsOk)))
                      }
                      onClick={() => setStep((s) => s + 1)}
                      className="rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white disabled:opacity-40"
                    >
                      המשך
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={creating}
                      onClick={() => void submit()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white"
                    >
                      <Play className="h-4 w-4" />
                      {creating ? "שולח…" : "צור ושלח דמו"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
