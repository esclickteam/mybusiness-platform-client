import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../api/adminCrmApi";
import { formatIsraelDate } from "./crm/adminCrmLabels";
import { PrimaryButton, SecondaryButton } from "./crm/AdminCrmUi";

export const APPOINTMENT_STATUS_HE: Record<string, string> = {
  booked: "מתוכנן",
  cancelled: "בוטל",
  completed: "הושלם",
  no_show: "לא הגיע",
};

export const SOURCE_HE: Record<string, string> = {
  public: "קישור WhatsApp",
  admin: "אדמין",
};

export function israelTime(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function israelDateShort(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function israelWeekday(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(iso));
}

export function timeRange(startAt: string, endAt?: string, durationMinutes?: number) {
  const start = israelTime(startAt);
  if (endAt) return `${start}–${israelTime(endAt)}`;
  if (durationMinutes) {
    const end = new Date(new Date(startAt).getTime() + Number(durationMinutes) * 60000);
    return `${start}–${israelTime(end.toISOString())}`;
  }
  return start;
}

export function AppointmentDetails({ row }: { row: any }) {
  return (
    <div>
      <h3 className="text-lg font-black text-purple-950">{row.serviceName || "שיחה ראשונית"}</h3>
      <p className="mt-1 font-bold text-slate-700">{israelDateShort(row.startAt)}</p>
      <p className="font-black text-[#7C4DFF]">
        {timeRange(row.startAt, row.endAt, row.durationMinutes)} · {row.durationMinutes || 15} דקות
      </p>
      <p className="mt-1 text-sm font-bold text-slate-500">
        צוות: {row.assignedAdminName || "לא משויך"}
      </p>
      <p className="text-sm font-bold text-slate-500">
        סטטוס: {row.statusLabelHe || APPOINTMENT_STATUS_HE[row.status] || row.status}
        {" · "}
        מקור: {row.sourceLabelHe || SOURCE_HE[row.source] || row.source || "—"}
      </p>
    </div>
  );
}

export function AdminBizuplyBookFlow({
  lockedCustomer,
  services,
  initialServiceKey,
  title = "תיאום חדש",
  confirmLabel = "אישור תיאום",
  onClose,
  onBooked,
}: {
  lockedCustomer?: { id: string; contactName?: string; phone?: string; email?: string; companyName?: string } | null;
  services: any[];
  initialServiceKey?: string;
  title?: string;
  confirmLabel?: string;
  onClose: () => void;
  onBooked: (booking: any) => void;
}) {
  const activeServices = ((services || []).length
    ? services
    : [{ key: "intro_call", nameHe: "שיחה ראשונית", durationMinutes: 15, active: true }]
  ).filter((row) => row.active !== false);
  const [step, setStep] = useState<"customer" | "service" | "slot">(
    lockedCustomer ? "service" : "customer"
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [customer, setCustomer] = useState<any>(lockedCustomer || null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState({ contactName: "", companyName: "", phone: "", email: "" });
  const [serviceKey, setServiceKey] = useState(
    initialServiceKey || activeServices[0]?.key || "intro_call"
  );
  const [slots, setSlots] = useState<any[]>([]);
  const [startAt, setStartAt] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedService = useMemo(
    () => activeServices.find((row) => row.key === serviceKey) || activeServices[0],
    [activeServices, serviceKey]
  );

  useEffect(() => {
    if (lockedCustomer) setCustomer(lockedCustomer);
  }, [lockedCustomer?.id]);

  async function searchCustomers(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await adminCrmApi.customers({ q: value.trim(), limit: 12 });
      setResults(data.customers || data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "חיפוש הלקוח נכשל");
    } finally {
      setSearching(false);
    }
  }

  async function createLead() {
    if (!draft.contactName && !draft.phone && !draft.email) return;
    setSaving(true);
    setError("");
    try {
      const { data } = await adminCrmApi.createCustomer({
        contactName: draft.contactName,
        companyName: draft.companyName,
        phone: draft.phone,
        email: draft.email,
        leadSource: "manual",
      });
      const created = data.customer;
      setCustomer({
        id: created.adminCustomerId || created.id || created._id,
        contactName: created.contactName,
        phone: created.phone,
        email: created.email,
        companyName: created.companyName,
      });
      setCreateOpen(false);
      setStep("service");
    } catch (err: any) {
      setError(err?.response?.data?.error || "יצירת הלקוח נכשלה");
    } finally {
      setSaving(false);
    }
  }

  async function loadSlots(key = serviceKey) {
    setLoadingSlots(true);
    setError("");
    try {
      const { data } = await adminCrmApi.calendarSlots({ serviceKey: key });
      setSlots(data.slots || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת המועדים נכשלה");
    } finally {
      setLoadingSlots(false);
    }
  }

  async function confirm() {
    if (!customer?.id || !startAt || !selectedService) return;
    setSaving(true);
    setError("");
    try {
      const { data } = await adminCrmApi.calendarBook({
        serviceKey: selectedService.key,
        startAt,
        adminCustomerId: customer.id,
        contactName: customer.contactName,
        phone: customer.phone,
        email: customer.email,
      });
      onBooked(data.booking);
    } catch (err: any) {
      setError(err?.response?.data?.error || "המועד כבר תפוס או אינו פתוח לתיאום. בחרו מועד אחר.");
      loadSlots();
    } finally {
      setSaving(false);
    }
  }

  const groupedSlots = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const slot of slots) {
      const key = israelDateShort(slot.startAt);
      const list = map.get(key) || [];
      list.push(slot);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [slots]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-3 sm:p-6" onClick={onClose}>
      <div
        className="mx-auto flex max-h-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="border-b px-5 py-4">
          <p className="text-xs font-black text-[#7C4DFF]">יומן BizUply</p>
          <h2 className="text-xl font-black text-purple-950">{title}</h2>
          {customer ? (
            <p className="font-bold text-slate-500">
              {customer.contactName || customer.companyName || "לקוח"}
              {lockedCustomer ? " · הלקוח כבר נבחר מכרטיס 360" : ""}
            </p>
          ) : (
            <p className="font-bold text-slate-500">בחרו לקוח מ-Admin CRM ואז שירות ומועד</p>
          )}
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 font-bold text-rose-800">
              {error}
            </div>
          ) : null}

          {step === "customer" ? (
            <div className="space-y-3">
              <input
                className="min-h-11 w-full rounded-2xl border px-3"
                placeholder="חיפוש לפי שם, עסק, טלפון או אימייל"
                value={query}
                onChange={(e) => searchCustomers(e.target.value)}
              />
              {searching ? <p className="text-sm font-bold text-slate-500">מחפש…</p> : null}
              <div className="space-y-2">
                {results.map((row) => {
                  const id = row.adminCustomerId || row.id || row._id;
                  return (
                    <button
                      key={id}
                      type="button"
                      className="w-full rounded-2xl border border-purple-100 bg-purple-50 p-3 text-right"
                      onClick={() => {
                        setCustomer({
                          id,
                          contactName: row.contactName,
                          phone: row.phone,
                          email: row.email,
                          companyName: row.companyName || row.businessName,
                        });
                        setStep("service");
                      }}
                    >
                      <p className="font-black text-purple-950">{row.contactName || row.companyName}</p>
                      <p className="text-sm font-bold text-slate-600">
                        {row.companyName || row.businessName || ""} {row.phone} {row.email}
                      </p>
                    </button>
                  );
                })}
              </div>
              <SecondaryButton onClick={() => setCreateOpen(true)}>+ יצירת ליד/לקוח</SecondaryButton>
              {createOpen ? (
                <div className="space-y-2 rounded-2xl border border-purple-100 p-3">
                  <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="שם" value={draft.contactName} onChange={(e) => setDraft({ ...draft, contactName: e.target.value })} />
                  <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="שם עסק" value={draft.companyName} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} />
                  <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="טלפון" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} dir="ltr" />
                  <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="אימייל" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} dir="ltr" />
                  <PrimaryButton disabled={saving} onClick={createLead}>יצירה והמשך לתיאום</PrimaryButton>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === "service" ? (
            <div className="space-y-2">
              <h3 className="font-black">בחירת שירות</h3>
              {activeServices.map((row) => (
                <button
                  key={row.key}
                  type="button"
                  onClick={() => setServiceKey(row.key)}
                  className={[
                    "w-full rounded-2xl border p-3 text-right",
                    serviceKey === row.key ? "border-[#7C4DFF] bg-purple-50" : "border-purple-100 bg-white",
                  ].join(" ")}
                >
                  <p className="font-black text-purple-950">{row.nameHe}</p>
                  <p className="text-sm font-bold text-slate-500">{row.durationMinutes} דקות</p>
                  {row.descriptionHe ? <p className="text-sm text-slate-500">{row.descriptionHe}</p> : null}
                </button>
              ))}
              <PrimaryButton
                onClick={() => {
                  setStep("slot");
                  loadSlots(serviceKey);
                }}
              >
                המשך לבחירת מועד
              </PrimaryButton>
            </div>
          ) : null}

          {step === "slot" ? (
            <div className="space-y-3">
              <p className="font-black">
                {selectedService?.nameHe} — {selectedService?.durationMinutes} דקות
              </p>
              {loadingSlots ? <p className="font-bold text-slate-500">טוען מועדים פנויים…</p> : null}
              {!loadingSlots && !groupedSlots.length ? (
                <p className="font-bold text-slate-500">אין מועדים שבהם משך השירות נכנס במלואו.</p>
              ) : null}
              {groupedSlots.map(([day, daySlots]) => (
                <div key={day}>
                  <h4 className="mb-2 text-sm font-black text-slate-600">{day}</h4>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((slot: any) => (
                      <button
                        key={slot.startAt}
                        type="button"
                        onClick={() => setStartAt(slot.startAt)}
                        className={[
                          "min-h-11 rounded-2xl px-3 text-sm font-black",
                          startAt === slot.startAt ? "bg-[#7C4DFF] text-white" : "border border-purple-100 bg-purple-50",
                        ].join(" ")}
                      >
                        {israelTime(slot.startAt)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {startAt ? (
                <p className="text-sm font-bold text-slate-600">
                  נבחר: {formatIsraelDate(startAt, true)}
                </p>
              ) : null}
              <PrimaryButton disabled={!startAt || saving} onClick={confirm}>
                {saving ? "שומר…" : confirmLabel}
              </PrimaryButton>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 border-t px-5 py-4">
          {step === "slot" ? <SecondaryButton onClick={() => setStep("service")}>חזרה לשירות</SecondaryButton> : null}
          {step === "service" && !lockedCustomer ? (
            <SecondaryButton onClick={() => setStep("customer")}>חזרה ללקוח</SecondaryButton>
          ) : null}
          <SecondaryButton onClick={onClose}>סגירה</SecondaryButton>
        </div>
      </div>
    </div>
  );
}

export function CustomerAppointmentActions({
  row,
  customerId,
  onChanged,
  onBookAnother,
  onError,
}: {
  row: any;
  customerId: string;
  onChanged: () => void;
  onBookAnother?: () => void;
  onError: (message: string) => void;
}) {
  const navigate = useNavigate();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [noShowOpen, setNoShowOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [startAt, setStartAt] = useState("");
  const [summary, setSummary] = useState({
    summary: row.callSummary?.summary || "",
    customerNeed: row.callSummary?.customerNeed || "",
    interestLevel: row.callSummary?.interestLevel || "",
    objections: row.callSummary?.objections || "",
    nextStep: row.callSummary?.nextStep || "",
    nextFollowUp: row.callSummary?.nextFollowUp || "",
  });

  async function setStatus(status: string, extra: Record<string, unknown> = {}) {
    try {
      await adminCrmApi.calendarStatus(row.id, { status, ...extra });
      onChanged();
    } catch (err: any) {
      onError(err?.response?.data?.error || "עדכון הפגישה נכשל");
    }
  }

  async function openReschedule() {
    const { data } = await adminCrmApi.calendarSlots({ serviceKey: row.serviceKey || "intro_call" });
    setSlots(data.slots || []);
    setRescheduleOpen(true);
  }

  if (row.status !== "booked" && !summaryOpen && !noShowOpen) {
    return row.status === "completed" && onBookAnother ? (
      <div className="mt-2">
        <SecondaryButton onClick={onBookAnother}>+ תיאום נוסף</SecondaryButton>
      </div>
    ) : null;
  }

  return (
    <div className="mt-3 space-y-3">
      {row.status === "booked" ? (
        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={openReschedule}>שינוי מועד</SecondaryButton>
          <SecondaryButton onClick={() => setStatus("cancelled")}>ביטול</SecondaryButton>
          <PrimaryButton onClick={() => setSummaryOpen(true)}>סמן כהושלם</PrimaryButton>
          <SecondaryButton onClick={() => setNoShowOpen(true)}>לא הגיע</SecondaryButton>
          <SecondaryButton onClick={() => setSummaryOpen(true)}>הוסף סיכום</SecondaryButton>
        </div>
      ) : null}

      {summaryOpen ? (
        <div className="space-y-2 rounded-2xl bg-slate-50 p-3">
          <h4 className="font-black">סיכום שיחה</h4>
          <textarea className="min-h-24 w-full rounded-2xl border p-3" placeholder="סיכום" value={summary.summary} onChange={(e) => setSummary({ ...summary, summary: e.target.value })} />
          <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="מה הלקוח צריך" value={summary.customerNeed} onChange={(e) => setSummary({ ...summary, customerNeed: e.target.value })} />
          <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="רמת עניין" value={summary.interestLevel} onChange={(e) => setSummary({ ...summary, interestLevel: e.target.value })} />
          <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="התנגדויות" value={summary.objections} onChange={(e) => setSummary({ ...summary, objections: e.target.value })} />
          <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="צעד הבא" value={summary.nextStep} onChange={(e) => setSummary({ ...summary, nextStep: e.target.value })} />
          <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="מעקב הבא" value={summary.nextFollowUp} onChange={(e) => setSummary({ ...summary, nextFollowUp: e.target.value })} />
          <div className="flex flex-wrap gap-2">
            <PrimaryButton
              onClick={async () => {
                await setStatus("completed", { callSummary: summary });
                setSummaryOpen(false);
              }}
            >
              שמירת סיכום וסיום
            </PrimaryButton>
            {onBookAnother ? <SecondaryButton onClick={onBookAnother}>+ תיאום נוסף</SecondaryButton> : null}
          </div>
        </div>
      ) : null}

      {noShowOpen ? (
        <div className="space-y-2 rounded-2xl bg-amber-50 p-3">
          <p className="font-black">הלקוח לא הגיע. WhatsApp לא נשלח אוטומטית.</p>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton
              onClick={async () => {
                await setStatus("no_show");
                navigate(`/admin/crm/customers/${customerId}?tab=whatsapp`);
              }}
            >
              שלח WhatsApp
            </PrimaryButton>
            <SecondaryButton
              onClick={async () => {
                await setStatus("no_show");
                setNoShowOpen(false);
                onBookAnother?.();
              }}
            >
              תאם מחדש
            </SecondaryButton>
            <SecondaryButton
              onClick={async () => {
                await setStatus("no_show");
                navigate(`/admin/crm/customers/${customerId}?tab=tasks`);
              }}
            >
              קבע מעקב
            </SecondaryButton>
          </div>
        </div>
      ) : null}

      {rescheduleOpen ? (
        <div className="space-y-2 rounded-2xl border border-purple-100 p-3">
          <h4 className="font-black">שינוי מועד — אותה פגישה</h4>
          <select className="min-h-11 w-full rounded-2xl border px-3" value={startAt} onChange={(e) => setStartAt(e.target.value)}>
            <option value="">בחירת מועד חדש</option>
            {slots.map((slot) => (
              <option key={slot.startAt} value={slot.startAt}>
                {slot.label}
              </option>
            ))}
          </select>
          <PrimaryButton
            disabled={!startAt}
            onClick={async () => {
              try {
                await adminCrmApi.calendarReschedule(row.id, { startAt });
                setRescheduleOpen(false);
                onChanged();
              } catch (err: any) {
                onError(err?.response?.data?.error || "שינוי המועד נכשל");
              }
            }}
          >
            שמירת מועד חדש
          </PrimaryButton>
        </div>
      ) : null}
    </div>
  );
}
