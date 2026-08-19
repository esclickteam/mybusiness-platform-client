import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Link2, Play, Sparkles, X } from "lucide-react";
import {
  copyGuidedDemoLink,
  createGuidedDemo,
  extendGuidedDemo,
  fetchGuidedDemoCatalog,
  listGuidedDemos,
  resendGuidedDemo,
  revokeGuidedDemo,
} from "../../api/guidedDemoApi";
import {
  approvedNeedLabelFromCatalog,
  canSubmitSendDemo,
  demoContentSummary,
  invitationIdOf,
  isValidDemoPhone,
  orderedPresets,
  payloadFingerprint,
  resolveSelectedKeys,
  sourcePhoneForPrefill,
  type GuidedDemoCatalog,
} from "../../guidedDemo/adminSendForm";

const STATUS_LABEL: Record<string, string> = {
  created: "נוצר",
  sent: "נשלח",
  opened: "נפתח",
  in_progress: "התחיל",
  completed: "הושלם",
  expired: "פג תוקף",
  revoked: "בוטל",
  delivery_failed: "שגיאת שליחה",
};

const DELIVERY_LABEL: Record<string, string> = {
  pending: "ממתין",
  sent: "נשלח",
  failed: "נכשל",
  skipped: "לא נשלח",
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

export type SendDemoContext = {
  customerName?: string;
  phone?: string;
  businessName?: string;
  sourceType?: "manual" | "early_access" | "customer" | "user";
  sourceLeadId?: string;
  sourceCustomerId?: string;
  sourceUserId?: string;
  needCandidates?: string[];
};

type UiMode = "form" | "success" | "failure" | "link_only";

function SendDemoButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="admin-send-demo-button"
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-[#6D28D9] px-3 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 ${className}`}
    >
      <Play className="h-3.5 w-3.5" />
      שליחת דמו
    </button>
  );
}

export { SendDemoButton as AdminSendDemoButton };

export default function AdminSendGuidedDemoModal({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: SendDemoContext;
}) {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<GuidedDemoCatalog | null>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [presetKey, setPresetKey] = useState("full");
  const [moduleKeys, setModuleKeys] = useState<string[]>([]);
  const [ttlHours, setTtlHours] = useState(24);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<UiMode>("form");
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [lastInvitationId, setLastInvitationId] = useState("");
  const [lastFingerprint, setLastFingerprint] = useState("");

  const load = useCallback(async () => {
    const cat = await fetchGuidedDemoCatalog();
    setCatalog(cat.catalog);
    setDelivery(cat.delivery);
    const params: Record<string, string> = { limit: "20" };
    if (context.sourceLeadId) params.sourceLeadId = context.sourceLeadId;
    if (context.sourceCustomerId) params.sourceCustomerId = context.sourceCustomerId;
    if (params.sourceLeadId || params.sourceCustomerId) {
      const list = await listGuidedDemos(params).catch(() => ({ items: [] }));
      setHistory(list.items || []);
    } else {
      setHistory([]);
    }
  }, [context.sourceLeadId, context.sourceCustomerId]);

  useEffect(() => {
    if (!open) return;
    setMode("form");
    setError("");
    setResult(null);
    setCopied(false);
    setLastInvitationId("");
    setLastFingerprint("");
    setCustomerName(String(context.customerName || "").trim());
    setPhone(sourcePhoneForPrefill(context.phone));
    setPresetKey("full");
    setModuleKeys([]);
    void load().catch((err) => {
      setError(err?.response?.data?.error || "טעינת קטלוג הדמו נכשלה");
    });
  }, [open, context.customerName, context.phone, load]);

  const selectedKeys = useMemo(
    () => resolveSelectedKeys({ catalog, presetKey, moduleKeys }),
    [catalog, presetKey, moduleKeys]
  );
  const summary = demoContentSummary({ catalog, presetKey, selectedKeys });
  const waOk = Boolean(delivery?.whatsapp?.available);
  const canSubmit = canSubmitSendDemo({
    customerName,
    phone,
    selectedKeys,
  });
  const approvedNeedLabel = approvedNeedLabelFromCatalog({
    catalog,
    candidates: context.needCandidates,
  });

  function toggleModule(key: string) {
    setModuleKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
    setPresetKey("custom");
  }

  async function copyLink(url?: string) {
    const value = url || result?.demoLink;
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
  }

  async function submit(send: boolean) {
    if (submitting || !canSubmit) return;
    if (send && !waOk) {
      setError(delivery?.whatsapp?.reason || "WhatsApp אינו זמין");
      setMode("failure");
      return;
    }
    setSubmitting(true);
    setError("");
    setCopied(false);
    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: phone.trim(),
        businessName: context.businessName || "",
        presetKey,
        moduleKeys: selectedKeys,
        channel: "whatsapp",
        ttlHours,
        send,
        sourceType: context.sourceType || "manual",
        sourceLeadId: context.sourceLeadId || "",
        sourceCustomerId: context.sourceCustomerId || "",
        sourceUserId: context.sourceUserId || "",
        approvedNeedLabel,
      };
      const fingerprint = payloadFingerprint({
        customerPhone: payload.customerPhone,
        presetKey: payload.presetKey,
        moduleKeys: payload.moduleKeys,
      });
      let data;
      if (send && lastInvitationId && lastFingerprint === fingerprint) {
        data = await resendGuidedDemo(lastInvitationId);
      } else {
        data = await createGuidedDemo(payload);
      }
      const invitationId = invitationIdOf(data.invitation);
      setLastInvitationId(invitationId);
      setLastFingerprint(fingerprint);
      setResult(data);
      await load().catch(() => null);
      if (!send) {
        setMode("link_only");
        return;
      }
      if (data.delivery?.ok) {
        setMode("success");
      } else {
        setError(
          data.delivery?.error || "לא הצלחנו לשלוח את הדמו ב-WhatsApp."
        );
        setMode("failure");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "שליחת הדמו נכשלה");
      setMode("failure");
    } finally {
      setSubmitting(false);
    }
  }

  async function runHistoryAction(fn: () => Promise<any>) {
    setError("");
    try {
      const data = await fn();
      if (data?.delivery && data.delivery.ok === false) {
        setError(data.delivery.error || "לא הצלחנו לשלוח את הדמו ב-WhatsApp.");
        return;
      }
      if (data?.demoLink) await navigator.clipboard?.writeText(data.demoLink);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "הפעולה נכשלה");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
      dir="rtl"
      data-testid="admin-send-demo-modal"
    >
      <div className="flex max-h-[96vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900">שליחת דמו אינטראקטיבי</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
              בחרו אילו חלקים במערכת יוצגו ללקוח ולאן לשלוח את קישור הדמו.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="סגירה">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {mode === "success" ? (
            <div className="text-center">
              <Sparkles className="mx-auto h-10 w-10 text-violet-600" />
              <h3 className="mt-3 text-2xl font-black">הדמו נשלח בהצלחה</h3>
              <div className="mt-4 space-y-1 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                <p>לקוח: {result?.invitation?.customerName || customerName}</p>
                <p dir="ltr">טלפון: {result?.invitation?.customerPhone || phone}</p>
                <p>הדמו יכלול: {summary}</p>
                <p>נשלח: {formatDate(result?.invitation?.updatedAt || result?.invitation?.createdAt)}</p>
                <p>סטטוס: {STATUS_LABEL[result?.invitation?.status] || result?.invitation?.status}</p>
              </div>
              {result?.demoLink ? (
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "הקישור הועתק" : "העתקת קישור"}
                </button>
              ) : null}
            </div>
          ) : mode === "link_only" ? (
            <div className="text-center">
              <Link2 className="mx-auto h-10 w-10 text-violet-600" />
              <h3 className="mt-3 text-2xl font-black">הקישור נוצר</h3>
              <p className="mt-2 text-sm font-bold text-slate-500">
                ניתן להעתיק את הקישור ולשלוח אותו ידנית. הקישור חד-פעמי.
              </p>
              <p className="mt-3 text-sm font-black">הדמו יכלול: {summary}</p>
              <button
                type="button"
                onClick={() => void copyLink()}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
              >
                <Copy className="h-4 w-4" />
                {copied ? "הקישור הועתק" : "העתקת קישור"}
              </button>
            </div>
          ) : mode === "failure" ? (
            <div>
              <h3 className="text-xl font-black text-rose-700">
                לא הצלחנו לשלוח את הדמו ב-WhatsApp.
              </h3>
              <p className="mt-2 text-sm font-bold text-slate-600">{error}</p>
              <button
                type="button"
                disabled={submitting || !canSubmit}
                onClick={() => void submit(true)}
                className="mt-4 rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                {submitting ? "שולח דמו..." : "נסו שוב"}
              </button>
              <button
                type="button"
                className="mt-2 block text-sm font-black text-violet-700"
                onClick={() => setMode("form")}
              >
                חזרה לעריכה
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <section>
                <h3 className="text-sm font-black text-slate-900">פרטי לקוח</h3>
                {customerName ? (
                  <p className="mt-2 text-sm font-bold text-slate-700">
                    לקוח: {customerName}
                  </p>
                ) : (
                  <label className="mt-2 block text-sm font-black">
                    שם לקוח
                    <input
                      className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </label>
                )}
                <label className="mt-3 block text-sm font-black">
                  מספר טלפון
                  <input
                    className="mt-1 h-11 w-full rounded-xl border px-3 text-left font-bold"
                    dir="ltr"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0501234567"
                    data-testid="admin-send-demo-phone"
                  />
                </label>
                {phone && !isValidDemoPhone(phone) ? (
                  <p className="mt-1 text-xs font-bold text-rose-600">מספר טלפון לא תקין</p>
                ) : null}
              </section>

              <section>
                <h3 className="text-sm font-black text-slate-900">תוכן הדמו</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {orderedPresets(catalog).map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => {
                        setPresetKey(preset.key);
                        if (preset.key !== "custom") setModuleKeys(preset.moduleKeys || []);
                      }}
                      className={`rounded-2xl border p-3 text-right text-sm font-bold ${
                        presetKey === preset.key
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
                {presetKey === "custom" ? (
                  <div className="mt-3 grid max-h-56 gap-2 overflow-auto sm:grid-cols-2">
                    {(catalog?.modules || []).map((mod) => (
                      <label
                        key={mod.key}
                        className="flex items-start gap-2 rounded-xl border border-slate-100 p-2 text-sm font-bold"
                      >
                        <input
                          type="checkbox"
                          checked={selectedKeys.includes(mod.key)}
                          onChange={() => toggleModule(mod.key)}
                        />
                        <span>
                          {mod.title}
                          {!mod.interactive ? (
                            <em className="block text-[11px] font-semibold text-amber-700">
                              {mod.simulationReason || "הסבר מודרך — ללא פעולה חיצונית אמיתית"}
                            </em>
                          ) : null}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </section>

              <section className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">הדמו יכלול:</p>
                <p className="mt-1 text-sm font-bold text-slate-700">{summary || "לא נבחרו מודולים"}</p>
              </section>

              <section>
                <h3 className="text-sm font-black text-slate-900">אופן שליחה</h3>
                <div className="mt-2 rounded-2xl border border-violet-200 bg-violet-50 p-3 text-sm font-bold">
                  WhatsApp
                  <span className="mt-1 block text-xs font-semibold text-slate-600">
                    תבנית guided_demo_invite
                    {delivery?.whatsapp?.template?.language
                      ? ` · ${delivery.whatsapp.template.language}`
                      : ""}
                    {delivery?.whatsapp?.template?.reportingStatus
                      ? ` · ${delivery.whatsapp.template.reportingStatus}`
                      : ""}
                  </span>
                </div>
                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-400">
                  SMS עדיין לא זמין
                </div>
                {!waOk ? (
                  <p className="mt-2 text-xs font-bold text-rose-600">
                    {delivery?.whatsapp?.reason || "שליחת WhatsApp אינה זמינה כרגע"}
                  </p>
                ) : null}
                <label className="mt-3 block text-sm font-black">
                  תוקף
                  <select
                    className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                    value={ttlHours}
                    onChange={(e) => setTtlHours(Number(e.target.value))}
                  >
                    {(catalog?.ttlOptionsHours || [1, 6, 24, 48, 168]).map((hours) => (
                      <option key={hours} value={hours}>
                        {hours === 168 ? "7 ימים" : hours === 1 ? "שעה" : `${hours} שעות`}
                      </option>
                    ))}
                  </select>
                </label>
              </section>

              {history.length ? (
                <section>
                  <h3 className="text-sm font-black text-slate-900">היסטוריית דמואים</h3>
                  <div className="mt-2 overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full min-w-[640px] text-right text-xs">
                      <thead className="bg-slate-50 font-black text-slate-500">
                        <tr>
                          <th className="px-3 py-2">נוצר</th>
                          <th className="px-3 py-2">טלפון</th>
                          <th className="px-3 py-2">תוכן</th>
                          <th className="px-3 py-2">ערוץ</th>
                          <th className="px-3 py-2">שליחה</th>
                          <th className="px-3 py-2">דמו</th>
                          <th className="px-3 py-2">התקדמות</th>
                          <th className="px-3 py-2">פעולות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((row) => (
                          <tr key={row._id || row.id} className="border-t border-slate-100">
                            <td className="px-3 py-2">{formatDate(row.createdAt)}</td>
                            <td className="px-3 py-2" dir="ltr">
                              {row.customerPhone}
                            </td>
                            <td className="px-3 py-2">
                              {row.presetKey === "full"
                                ? `דמו מלא — ${(row.selectedModules || []).length} מודולים`
                                : (row.selectedModules || []).join(" · ")}
                            </td>
                            <td className="px-3 py-2">
                              {row.deliveryChannel === "whatsapp" ? "WhatsApp" : row.deliveryChannel}
                            </td>
                            <td className="px-3 py-2">
                              {DELIVERY_LABEL[row.deliveryStatus] || row.deliveryStatus}
                            </td>
                            <td className="px-3 py-2">
                              {STATUS_LABEL[row.status] || row.status}
                              <div className="text-[10px] font-semibold text-slate-400">
                                נפתח {formatDate(row.openedAt || row.redeemedAt)} · הושלם {formatDate(row.completedAt)}
                                <br />
                                תוקף {formatDate(row.expiresAt)}
                                {row.revokedAt ? " · בוטל" : ""}
                              </div>
                            </td>
                            <td className="px-3 py-2 font-black">
                              {row.completedSteps || 0}/{row.totalSteps || 0}
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                <button
                                  type="button"
                                  className="rounded-lg border px-2 py-1 font-black"
                                  onClick={() => navigate(`/admin/guided-demos/${row._id || row.id}`)}
                                >
                                  צפייה
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border px-2 py-1 font-black"
                                  onClick={() =>
                                    void runHistoryAction(() =>
                                      copyGuidedDemoLink(row._id || row.id)
                                    )
                                  }
                                >
                                  העתקת קישור
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border px-2 py-1 font-black"
                                  onClick={() =>
                                    void runHistoryAction(() =>
                                      resendGuidedDemo(row._id || row.id)
                                    )
                                  }
                                >
                                  שליחה מחדש
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border px-2 py-1 font-black"
                                  onClick={() =>
                                    void runHistoryAction(() =>
                                      extendGuidedDemo(row._id || row.id, 24)
                                    )
                                  }
                                >
                                  הארכת תוקף
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border border-rose-200 px-2 py-1 font-black text-rose-700"
                                  onClick={() =>
                                    void runHistoryAction(() =>
                                      revokeGuidedDemo(row._id || row.id)
                                    )
                                  }
                                >
                                  ביטול קישור
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              {error && mode === "form" ? (
                <p className="text-sm font-bold text-rose-600">{error}</p>
              ) : null}
            </div>
          )}
        </div>

        {mode === "form" ? (
          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              disabled={submitting || !canSubmit}
              onClick={() => void submit(false)}
              className="rounded-2xl border px-4 py-3 text-sm font-black disabled:opacity-40"
            >
              יצירת קישור בלבד
            </button>
            <button
              type="button"
              disabled={submitting || !canSubmit}
              onClick={() => void submit(true)}
              className="rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
              data-testid="admin-send-demo-submit"
            >
              {submitting ? "שולח דמו..." : "שליחת הדמו ב-WhatsApp"}
            </button>
          </div>
        ) : (
          <div className="border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border px-4 py-3 text-sm font-black"
            >
              סגירה
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
