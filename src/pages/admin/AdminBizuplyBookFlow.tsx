import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../api/adminCrmApi";
import { formatIsraelDate } from "./crm/adminCrmLabels";
import {
  CompactInput,
  PrimaryButton,
  SecondaryButton,
  SectionLabel,
  StepIndicator,
} from "./crm/AdminCrmUi";
import { AdminModal } from "./crm/AdminModal";
import IntroCallSummaryModal from "./crm/introCallSummary/IntroCallSummaryModal";
import IntroCallSummaryViewModal from "./crm/introCallSummary/IntroCallSummaryViewModal";
import { IntroCallSummaryCard } from "./crm/introCallSummary/IntroCallSummaryCard";
import { hasIntroSummaryData, introQuestionnaireFromCallSummary, isSummarySaved } from "./crm/introCallSummary/utils";

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

export function AppointmentDetails({ row, compact = false }: { row: any; compact?: boolean }) {
  return (
    <div>
      <h3 className={compact ? "text-sm font-bold text-slate-900" : "text-base font-bold text-slate-900"}>
        {row.serviceName || "שיחה ראשונית"}
      </h3>
      <p className="mt-0.5 text-xs font-medium text-slate-600">{israelDateShort(row.startAt)}</p>
      <p className="text-sm font-semibold text-[#7C4DFF]">
        {timeRange(row.startAt, row.endAt, row.durationMinutes)} · {row.durationMinutes || 15} דקות
      </p>
      {!compact ? (
        <>
          <p className="mt-1 text-xs text-slate-500">צוות: {row.assignedAdminName || "לא משויך"}</p>
          <p className="text-xs text-slate-500">
            סטטוס: {row.statusLabelHe || APPOINTMENT_STATUS_HE[row.status] || row.status}
            {" · "}
            מקור: {row.sourceLabelHe || SOURCE_HE[row.source] || row.source || "—"}
          </p>
        </>
      ) : null}
    </div>
  );
}

function LeadCreateForm({
  draft,
  setDraft,
  saving,
  onSubmit,
}: {
  draft: { contactName: string; companyName: string; phone: string; email: string };
  setDraft: React.Dispatch<React.SetStateAction<typeof draft>>;
  saving: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
      <p className="mb-2 text-xs font-semibold text-slate-700">יצירת ליד/לקוח חדש</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-slate-600">
          שם
          <CompactInput
            className="mt-1"
            placeholder="שם איש קשר"
            value={draft.contactName}
            onChange={(e) => setDraft({ ...draft, contactName: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-600">
          שם עסק
          <CompactInput
            className="mt-1"
            placeholder="שם העסק"
            value={draft.companyName}
            onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-600">
          טלפון
          <CompactInput
            className="mt-1"
            placeholder="050-0000000"
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            dir="ltr"
          />
        </label>
        <label className="block text-xs text-slate-600">
          אימייל
          <CompactInput
            className="mt-1"
            placeholder="email@example.com"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            dir="ltr"
          />
        </label>
      </div>
      <div className="mt-2.5">
        <PrimaryButton compact disabled={saving} onClick={onSubmit}>
          {saving ? "יוצר…" : "יצירה והמשך לתיאום"}
        </PrimaryButton>
      </div>
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

  const stepIndex = step === "customer" ? 0 : step === "service" ? 1 : 2;
  const stepLabels = lockedCustomer ? ["שירות", "מועד"] : ["לקוח", "שירות", "מועד"];

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

  const subtitle = lockedCustomer
    ? `${customer?.contactName || customer?.companyName || "לקוח"} · הלקוח כבר נבחר מכרטיס 360`
    : "בחרו לקוח מ-Admin CRM ואז שירות ומועד";

  const footer = (
    <>
      {step === "slot" ? (
        <SecondaryButton compact onClick={() => setStep("service")}>
          חזרה לשירות
        </SecondaryButton>
      ) : null}
      {step === "service" && !lockedCustomer ? (
        <SecondaryButton compact onClick={() => setStep("customer")}>
          חזרה ללקוח
        </SecondaryButton>
      ) : null}
      {step === "slot" ? (
        <PrimaryButton compact disabled={!startAt || saving} onClick={confirm}>
          {saving ? "שומר…" : confirmLabel}
        </PrimaryButton>
      ) : step === "service" ? (
        <PrimaryButton
          compact
          onClick={() => {
            setStep("slot");
            loadSlots(serviceKey);
          }}
        >
          המשך לבחירת מועד
        </PrimaryButton>
      ) : null}
      <SecondaryButton compact onClick={onClose}>
        סגירה
      </SecondaryButton>
    </>
  );

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="יומן BizUply"
      title={title}
      subtitle={subtitle}
      footer={footer}
      size="md"
    >
      <StepIndicator
        steps={stepLabels}
        current={lockedCustomer ? stepIndex - 1 : stepIndex}
      />

      {error ? (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800">
          {error}
        </div>
      ) : null}

      {step === "customer" ? (
        <div>
          <SectionLabel>שלב 1 — בחירת לקוח</SectionLabel>
          <CompactInput
            placeholder="חיפוש לפי שם, עסק, טלפון או אימייל"
            value={query}
            onChange={(e) => searchCustomers(e.target.value)}
          />
          {searching ? <p className="mt-1.5 text-xs text-slate-500">מחפש…</p> : null}
          <div className="mt-2 space-y-1">
            {results.map((row) => {
              const id = row.adminCustomerId || row.id || row._id;
              return (
                <button
                  key={id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2 text-right transition hover:border-[#7C4DFF]/30 hover:bg-[#7C4DFF]/5"
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
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {row.contactName || row.companyName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {[row.companyName || row.businessName, row.phone, row.email]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="mr-2 text-slate-300">←</span>
                </button>
              );
            })}
          </div>
          {!createOpen ? (
            <button
              type="button"
              className="mt-2 text-xs font-semibold text-[#7C4DFF] hover:underline"
              onClick={() => setCreateOpen(true)}
            >
              + יצירת ליד/לקוח חדש
            </button>
          ) : (
            <LeadCreateForm
              draft={draft}
              setDraft={setDraft}
              saving={saving}
              onSubmit={createLead}
            />
          )}
        </div>
      ) : null}

      {step === "service" ? (
        <div>
          <SectionLabel>שלב {lockedCustomer ? 1 : 2} — בחירת שירות</SectionLabel>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {activeServices.map((row) => (
              <button
                key={row.key}
                type="button"
                onClick={() => setServiceKey(row.key)}
                className={[
                  "rounded-lg border px-3 py-2 text-right transition",
                  serviceKey === row.key
                    ? "border-[#7C4DFF] bg-[#7C4DFF]/5 ring-1 ring-[#7C4DFF]/20"
                    : "border-slate-200 bg-white hover:border-slate-300",
                ].join(" ")}
              >
                <p className="text-sm font-semibold text-slate-900">{row.nameHe}</p>
                <p className="text-xs text-slate-500">{row.durationMinutes} דקות</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === "slot" ? (
        <div>
          <SectionLabel>שלב {lockedCustomer ? 2 : 3} — בחירת מועד</SectionLabel>
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <span className="text-xs text-slate-500">משך הפגישה:</span>
            <span className="text-sm font-semibold text-[#7C4DFF]">
              {selectedService?.nameHe} — {selectedService?.durationMinutes} דקות
            </span>
          </div>
          {loadingSlots ? <p className="text-xs text-slate-500">טוען מועדים פנויים…</p> : null}
          {!loadingSlots && !groupedSlots.length ? (
            <p className="text-xs text-slate-500">אין מועדים שבהם משך השירות נכנס במלואו.</p>
          ) : null}
          {groupedSlots.map(([day, daySlots]) => (
            <div key={day} className="mb-3">
              <h4 className="mb-1.5 text-xs font-semibold text-slate-500">{day}</h4>
              <div className="flex flex-wrap gap-1.5">
                {daySlots.map((slot: any) => (
                  <button
                    key={slot.startAt}
                    type="button"
                    onClick={() => setStartAt(slot.startAt)}
                    className={[
                      "h-8 rounded-lg px-2.5 text-xs font-semibold tabular-nums transition",
                      startAt === slot.startAt
                        ? "bg-[#7C4DFF] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-[#7C4DFF]/30",
                    ].join(" ")}
                  >
                    {israelTime(slot.startAt)}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {startAt ? (
            <p className="text-xs font-medium text-slate-600">
              נבחר: {formatIsraelDate(startAt, true)}
            </p>
          ) : null}
        </div>
      ) : null}
    </AdminModal>
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
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [noShowOpen, setNoShowOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [startAt, setStartAt] = useState("");
  const isIntroCall = (row.serviceKey || "intro_call") === "intro_call";
  const savedSummary = isIntroCall && isSummarySaved(row.callSummary);
  const hasSummary = isIntroCall && hasIntroSummaryData(introQuestionnaireFromCallSummary(row.callSummary));

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

  if (row.status !== "booked" && !noShowOpen) {
    return (
      <div className="mt-2 space-y-2">
        {isIntroCall ? (
          <IntroCallSummaryCard
            callSummary={row.callSummary}
            onView={() => setViewOpen(true)}
            onFill={savedSummary ? undefined : () => setEditOpen(true)}
          />
        ) : null}
        {row.status === "completed" && onBookAnother ? (
          <SecondaryButton compact onClick={onBookAnother}>+ תיאום נוסף</SecondaryButton>
        ) : null}
        {isIntroCall ? (
          <>
            <IntroCallSummaryViewModal
              open={viewOpen}
              booking={row}
              callSummary={row.callSummary}
              onClose={() => setViewOpen(false)}
            />
            <IntroCallSummaryModal
              open={editOpen}
              booking={row}
              onClose={() => setEditOpen(false)}
              onSaved={() => onChanged()}
              onError={onError}
              completeOnSave={false}
            />
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      {row.status === "booked" ? (
        <div className="flex flex-wrap gap-1.5">
          <SecondaryButton compact onClick={openReschedule}>שינוי מועד</SecondaryButton>
          <SecondaryButton compact onClick={() => setStatus("cancelled")}>ביטול</SecondaryButton>
          {isIntroCall ? (
            <>
              {savedSummary ? (
                <PrimaryButton compact onClick={() => setStatus("completed")}>סמן כהושלם</PrimaryButton>
              ) : (
                <PrimaryButton compact onClick={() => setEditOpen(true)}>סמן כהושלם</PrimaryButton>
              )}
              {!savedSummary ? (
                <SecondaryButton compact onClick={() => setEditOpen(true)}>הוסף סיכום</SecondaryButton>
              ) : null}
            </>
          ) : (
            <PrimaryButton compact onClick={() => setStatus("completed")}>סמן כהושלם</PrimaryButton>
          )}
          <SecondaryButton compact onClick={() => setNoShowOpen(true)}>לא הגיע</SecondaryButton>
        </div>
      ) : null}

      {isIntroCall && (savedSummary || hasSummary) ? (
        <IntroCallSummaryCard
          callSummary={row.callSummary}
          onView={() => setViewOpen(true)}
          onFill={savedSummary ? undefined : () => setEditOpen(true)}
        />
      ) : null}

      {isIntroCall ? (
        <>
          <IntroCallSummaryViewModal
            open={viewOpen}
            booking={row}
            callSummary={row.callSummary}
            onClose={() => setViewOpen(false)}
          />
          <IntroCallSummaryModal
            open={editOpen}
            booking={row}
            onClose={() => setEditOpen(false)}
            onSaved={(closeAfter) => {
              onChanged();
              if (closeAfter) {
                setEditOpen(false);
                setViewOpen(true);
              }
            }}
            onError={onError}
            completeOnSave
          />
        </>
      ) : null}

      {noShowOpen ? (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
          <p className="text-xs font-semibold text-amber-900">הלקוח לא הגיע. WhatsApp לא נשלח אוטומטית.</p>
          <div className="flex flex-wrap gap-1.5">
            <PrimaryButton
              compact
              onClick={async () => {
                await setStatus("no_show");
                navigate(`/admin/crm/customers/${customerId}?tab=whatsapp`);
              }}
            >
              שלח WhatsApp
            </PrimaryButton>
            <SecondaryButton
              compact
              onClick={async () => {
                await setStatus("no_show");
                setNoShowOpen(false);
                onBookAnother?.();
              }}
            >
              תאם מחדש
            </SecondaryButton>
            <SecondaryButton
              compact
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
        <div className="space-y-2 rounded-lg border border-slate-200 p-3">
          <h4 className="text-xs font-semibold text-slate-700">שינוי מועד — אותה פגישה</h4>
          <select className="h-8 w-full rounded-lg border border-slate-200 px-2 text-sm" value={startAt} onChange={(e) => setStartAt(e.target.value)}>
            <option value="">בחירת מועד חדש</option>
            {slots.map((slot) => (
              <option key={slot.startAt} value={slot.startAt}>
                {slot.label}
              </option>
            ))}
          </select>
          <PrimaryButton
            compact
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
