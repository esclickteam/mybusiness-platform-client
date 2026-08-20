import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, ExternalLink, Link2, MessageCircle, Play, Sparkles, X } from "lucide-react";
import {
  createGuidedDemo,
  fetchGuidedDemoCatalog,
  listGuidedDemos,
  resendGuidedDemo,
} from "../../api/guidedDemoApi";
import {
  approvedNeedLabelFromCatalog,
  buildManualWhatsAppUrl,
  canSubmitSendDemo,
  demoContentSummary,
  invitationIdOf,
  invitationPhone,
  isValidDemoPhone,
  normalizeFullName,
  openExternalUrl,
  orderedPresets,
  payloadFingerprint,
  resolveSelectedKeys,
  sourceNameForPrefill,
  sourcePhoneForPrefill,
  type GuidedDemoCatalog,
} from "../../guidedDemo/adminSendForm";
import AdminGuidedDemoActions from "./AdminGuidedDemoActions";

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

type UiMode = "form" | "created" | "failure";

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
  const [submitting, setSubmitting] = useState<"link" | "api" | "">("");
  const [mode, setMode] = useState<UiMode>("form");
  const [error, setError] = useState("");
  const [shareNote, setShareNote] = useState("");
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
    setShareNote("");
    setResult(null);
    setCopied(false);
    setLastInvitationId("");
    setLastFingerprint("");
    setCustomerName(sourceNameForPrefill(context.customerName));
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
  const demoUrl = result?.demoLink || result?.invitation?.demoLink || "";
  const resultName = result?.invitation?.customerName || customerName;
  const resultPhone = invitationPhone(result?.invitation, phone);

  function toggleModule(key: string) {
    setModuleKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
    setPresetKey("custom");
  }

  async function copyLink(url?: string) {
    const value = url || demoUrl;
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    setShareNote("הקישור הועתק");
  }

  function openDemo(url?: string) {
    const value = url || demoUrl;
    if (!value) return;
    openExternalUrl(value);
    setShareNote("הדמו נפתח בחלון חדש");
  }

  function shareManually() {
    if (!demoUrl) return;
    const share = buildManualWhatsAppUrl({
      phone: resultPhone,
      customerName: resultName,
      demoUrl,
    });
    openExternalUrl(share);
    setShareNote("WhatsApp נפתח — שלחו ידנית מהאפליקציה");
  }

  async function submit(send: boolean) {
    if (submitting || !canSubmit) return;
    if (send && !waOk) {
      setError("שליחה אוטומטית ב-WhatsApp אינה זמינה כרגע");
      return;
    }
    setSubmitting(send ? "api" : "link");
    setError("");
    setShareNote("");
    setCopied(false);
    try {
      const payload = {
        customerName: normalizeFullName(customerName),
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
        customerName: payload.customerName,
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
      if (data?.demoLink || data?.invitation) {
        if (send && data.delivery && data.delivery.ok === false && !data.delivery.skipped) {
          setError(data.delivery.error || "לא הצלחנו לשלוח את הדמו ב-WhatsApp.");
        }
        setMode("created");
        return;
      }
      setError("יצירת קישור הדמו נכשלה");
      setMode("failure");
    } catch (err: any) {
      setError(err?.response?.data?.error || (send ? "שליחת הדמו נכשלה" : "יצירת קישור הדמו נכשלה"));
      setMode("failure");
    } finally {
      setSubmitting("");
    }
  }

  async function sendViaApi() {
    if (!waOk || !lastInvitationId || submitting) return;
    setSubmitting("api");
    setError("");
    try {
      const data = await resendGuidedDemo(lastInvitationId);
      setResult((prev: any) => ({ ...prev, ...data, demoLink: data.demoLink || prev?.demoLink }));
      if (data.delivery?.ok) {
        setShareNote("ההודעה נשלחה ב-WhatsApp");
      } else {
        setError(data.delivery?.error || "לא הצלחנו לשלוח את הדמו ב-WhatsApp.");
      }
      await load().catch(() => null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "שליחת WhatsApp נכשלה");
    } finally {
      setSubmitting("");
    }
  }

  if (!open) return null;

  const createdTitle = result?.delivery?.ok ? "הדמו נשלח בהצלחה" : "הקישור נוצר";

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
              צרו קישור מאובטח לדמו. שליחת WhatsApp אוטומטית היא אופציונלית.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="סגירה">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {mode === "created" ? (
            <div className="text-center">
              {result?.delivery?.ok ? (
                <Sparkles className="mx-auto h-10 w-10 text-violet-600" />
              ) : (
                <Link2 className="mx-auto h-10 w-10 text-violet-600" />
              )}
              <h3 className="mt-3 text-2xl font-black">{createdTitle}</h3>
              <p className="mt-2 text-sm font-bold text-slate-500">
                הקישור חד-פעמי. אפשר להעתיק, לפתוח או לשתף ידנית ב-WhatsApp.
              </p>
              <div className="mt-4 space-y-1 rounded-2xl bg-slate-50 p-4 text-right text-sm font-bold text-slate-700">
                <p>לקוח: {resultName}</p>
                <p dir="ltr">טלפון: {resultPhone}</p>
                <p>הדמו יכלול: {summary}</p>
                <p>תוקף: {formatDate(result?.invitation?.expiresAt)}</p>
                <p>סטטוס: {STATUS_LABEL[result?.invitation?.status] || result?.invitation?.status || "נוצר"}</p>
              </div>
              {demoUrl ? (
                <p
                  className="mt-3 break-all rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-bold text-slate-700"
                  dir="ltr"
                  data-testid="admin-created-demo-url"
                >
                  {demoUrl}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
                  data-testid="admin-created-copy-link"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "הקישור הועתק" : "העתקת קישור"}
                </button>
                <button
                  type="button"
                  onClick={() => openDemo()}
                  className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black"
                  data-testid="admin-created-open-demo"
                >
                  <ExternalLink className="h-4 w-4" />
                  פתיחת הדמו
                </button>
                <button
                  type="button"
                  onClick={shareManually}
                  className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black"
                  data-testid="admin-created-manual-whatsapp"
                >
                  <MessageCircle className="h-4 w-4" />
                  שליחה ידנית ב-WhatsApp
                </button>
                <button
                  type="button"
                  disabled={!waOk || Boolean(submitting)}
                  onClick={() => void sendViaApi()}
                  className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black disabled:opacity-40"
                  data-testid="admin-created-api-whatsapp"
                >
                  שליחת הדמו ב-WhatsApp
                </button>
              </div>
              {shareNote ? <p className="mt-3 text-sm font-bold text-emerald-700">{shareNote}</p> : null}
              {!waOk ? (
                <p className="mt-3 text-sm font-bold text-amber-700" data-testid="admin-wa-api-unavailable">
                  שליחה אוטומטית ב-WhatsApp אינה זמינה כרגע
                </p>
              ) : null}
              {error ? <p className="mt-3 text-sm font-bold text-rose-600">{error}</p> : null}
            </div>
          ) : mode === "failure" ? (
            <div>
              <h3 className="text-xl font-black text-rose-700">יצירת קישור הדמו נכשלה</h3>
              <p className="mt-2 text-sm font-bold text-slate-600">{error}</p>
              <button
                type="button"
                disabled={Boolean(submitting) || !canSubmit}
                onClick={() => void submit(false)}
                className="mt-4 rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                {submitting ? "יוצר קישור..." : "יצירת קישור לדמו"}
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
                <h3 className="text-sm font-black text-slate-900">פרטי הלקוח</h3>
                <label className="mt-2 block text-sm font-black">
                  שם מלא
                  <input
                    className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="דניאל כהן"
                    data-testid="admin-send-demo-fullname"
                    autoComplete="name"
                  />
                </label>
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
                    autoComplete="tel"
                  />
                </label>
                {phone && !isValidDemoPhone(phone) ? (
                  <p className="mt-1 text-xs font-bold text-rose-600">מספר טלפון לא תקין</p>
                ) : null}
              </section>

              <section>
                <h3 className="text-sm font-black text-slate-900">מה לכלול בדמו?</h3>
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
                <h3 className="text-sm font-black text-slate-900">סיכום</h3>
                <p className="mt-2 text-sm font-bold text-slate-700">
                  לקוח: {normalizeFullName(customerName) || "—"}
                </p>
                <p className="text-sm font-bold text-slate-700" dir="ltr">
                  טלפון: {phone || "—"}
                </p>
                <p className="text-sm font-bold text-slate-700">
                  הדמו יכלול: {summary || "לא נבחרו מודולים"}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-black text-slate-900">אופן שליחה</h3>
                <div className="mt-2 rounded-2xl border border-violet-200 bg-violet-50 p-3 text-sm font-bold">
                  WhatsApp
                  <span className="mt-1 block text-xs font-semibold text-slate-600">
                    שליחה ידנית זמינה תמיד. שליחה אוטומטית דרך Bizuply אופציונלית.
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
                  <p className="mt-2 text-xs font-bold text-amber-700" data-testid="admin-wa-api-unavailable">
                    שליחה אוטומטית ב-WhatsApp אינה זמינה כרגע
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
                    <table className="w-full min-w-[720px] text-right text-xs">
                      <thead className="bg-slate-50 font-black text-slate-500">
                        <tr>
                          <th className="px-3 py-2">שם</th>
                          <th className="px-3 py-2">טלפון</th>
                          <th className="px-3 py-2">תוכן</th>
                          <th className="px-3 py-2">נוצר</th>
                          <th className="px-3 py-2">תוקף</th>
                          <th className="px-3 py-2">סטטוס</th>
                          <th className="px-3 py-2">קישור</th>
                          <th className="px-3 py-2">פעולות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((row) => (
                          <tr key={row._id || row.id} className="border-t border-slate-100">
                            <td className="px-3 py-2 font-black">{row.customerName}</td>
                            <td className="px-3 py-2" dir="ltr">
                              {row.customerPhone}
                            </td>
                            <td className="px-3 py-2">
                              {row.presetKey === "full"
                                ? `דמו מלא — ${(row.selectedModules || []).length} מודולים`
                                : (row.selectedModules || []).join(" · ")}
                            </td>
                            <td className="px-3 py-2">{formatDate(row.createdAt)}</td>
                            <td className="px-3 py-2">{formatDate(row.expiresAt)}</td>
                            <td className="px-3 py-2">
                              {STATUS_LABEL[row.status] || row.status}
                              <div className="text-[10px] font-semibold text-slate-400">
                                {DELIVERY_LABEL[row.deliveryStatus] || row.deliveryStatus}
                              </div>
                            </td>
                            <td className="max-w-[180px] px-3 py-2">
                              {row.linkAvailable && row.demoLink ? (
                                <span className="block truncate text-left font-bold" dir="ltr">
                                  {row.demoLink}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                className="mb-1 rounded-lg border px-2 py-1 font-black"
                                onClick={() => navigate(`/admin/guided-demos/${row._id || row.id}`)}
                              >
                                צפייה
                              </button>
                              <AdminGuidedDemoActions
                                invitation={row}
                                whatsAppApiAvailable={waOk}
                                onChanged={() => void load()}
                              />
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
          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                disabled={Boolean(submitting) || !canSubmit}
                onClick={() => void submit(false)}
                className="rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
                data-testid="admin-create-demo-link"
              >
                {submitting === "link" ? "יוצר קישור..." : "יצירת קישור לדמו"}
              </button>
              <button
                type="button"
                disabled={Boolean(submitting) || !canSubmit || !waOk}
                onClick={() => void submit(true)}
                className="rounded-2xl border px-4 py-3 text-sm font-black disabled:opacity-40"
                data-testid="admin-send-demo-submit"
              >
                {submitting === "api" ? "שולח דמו..." : "שליחת הדמו ב-WhatsApp"}
              </button>
            </div>
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
