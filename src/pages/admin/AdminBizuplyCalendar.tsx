import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminCrmApi from "../../api/adminCrmApi";
import AdminHeader from "./AdminsHeader";
import {
  CrmCard,
  EmptyState,
  ErrorState,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
} from "./crm/AdminCrmUi";
import { formatIsraelDate } from "./crm/adminCrmLabels";
import { ADMIN_PAGE_SHELL_CLASS } from "../../utils/adminResponsive";

const STATUS_LABELS: Record<string, string> = {
  booked: "Scheduled",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No Show",
};

const STATUS_HE: Record<string, string> = {
  booked: "נקבעה",
  cancelled: "בוטלה",
  completed: "הושלמה",
  no_show: "לא הגיע",
};

const DAY_OPTIONS = [
  ["sun", "א׳"],
  ["mon", "ב׳"],
  ["tue", "ג׳"],
  ["wed", "ד׳"],
  ["thu", "ה׳"],
  ["fri", "ו׳"],
  ["sat", "ש׳"],
];

function israelDateKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function israelTime(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function AdminBizuplyCalendar() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"day" | "week" | "list">("list");
  const [from, setFrom] = useState(toDateInput(new Date()));
  const [selected, setSelected] = useState<any>(null);
  const [summary, setSummary] = useState<any>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [rescheduleStart, setRescheduleStart] = useState("");
  const [followNote, setFollowNote] = useState("");

  const [availability, setAvailability] = useState({
    activeDays: ["sun", "mon", "tue", "wed", "thu"],
    start: "09:00",
    end: "18:00",
    minAdvanceMinutes: 60,
    bookingHorizonDays: 14,
    bufferAfterMinutes: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      if (mq.matches) setView("list");
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  async function load(nextFrom = from, nextView = view) {
    setLoading(true);
    setError("");
    try {
      const days = nextView === "day" ? 1 : nextView === "week" ? 7 : 14;
      const { data: res } = await adminCrmApi.calendar({ from: nextFrom, days });
      setData(res);
      const intro = res?.introCall || (res?.services || []).find((row: any) => row.key === "intro_call");
      const hours = res?.weeklyHours || {};
      const activeDays = Object.keys(hours).filter((day) => (hours[day] || []).length);
      const firstWindow = activeDays.map((day) => hours[day]?.[0]).find(Boolean) || { start: "09:00", end: "18:00" };
      setAvailability({
        activeDays: activeDays.length ? activeDays : ["sun", "mon", "tue", "wed", "thu"],
        start: firstWindow.start || "09:00",
        end: firstWindow.end || "18:00",
        minAdvanceMinutes: intro?.minAdvanceMinutes || 60,
        bookingHorizonDays: intro?.bookingHorizonDays || 14,
        bufferAfterMinutes: intro?.bufferAfterMinutes || 0,
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת היומן נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(from, view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, view]);

  const intro = useMemo(
    () =>
      data?.introCall ||
      (data?.visibleAppointmentTypes || data?.services || []).find((row: any) => row.key === "intro_call") || {
        nameHe: "שיחה ראשונית",
        durationMinutes: 15,
      },
    [data]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const row of data?.bookings || []) {
      const key = israelDateKey(row.startAt);
      const list = map.get(key) || [];
      list.push(row);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [data?.bookings]);

  async function setStatus(id: string, status: string, extra: Record<string, unknown> = {}) {
    try {
      await adminCrmApi.calendarStatus(id, {
        status,
        callSummary: status === "completed" ? summary : extra.callSummary,
      });
      setSelected(null);
      setSummary({});
      load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "עדכון הפגישה נכשל");
    }
  }

  async function saveAvailability() {
    setSavingSettings(true);
    try {
      const { data: res } = await adminCrmApi.calendarSettings({
        introAvailability: availability,
      });
      setData(res);
      setSettingsOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || "שמירת הזמינות נכשלה");
    } finally {
      setSavingSettings(false);
    }
  }

  async function loadSlots() {
    const { data: res } = await adminCrmApi.calendarSlots({ serviceKey: "intro_call" });
    setSlots(res.slots || []);
  }

  async function reschedule() {
    if (!selected || !rescheduleStart) return;
    try {
      await adminCrmApi.calendarReschedule(selected.id, { startAt: rescheduleStart });
      setRescheduleStart("");
      setSelected(null);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "שינוי המועד נכשל");
    }
  }

  async function scheduleFollowUp() {
    if (!selected?.adminCustomerId) return;
    try {
      await adminCrmApi.followUp(selected.adminCustomerId, {
        nextFollowUpAt: selected.startAt,
        nextFollowUpNote: followNote || "מעקב אחרי שיחה ראשונית",
        nextFollowUpType: "call_back",
      });
      setFollowNote("");
      navigate(`/admin/crm/customers/${selected.adminCustomerId}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || "קביעת המעקב נכשלה");
    }
  }

  function AppointmentCard({ row, compact = false }: { row: any; compact?: boolean }) {
    return (
      <button
        type="button"
        onClick={() => setSelected(row)}
        className="w-full rounded-2xl border border-purple-100 bg-white p-3 text-right shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#7C4DFF]">
              {israelTime(row.startAt)} · שיחה ראשונית · 15 דקות
            </p>
            <h2 className="text-base font-black text-purple-950">{row.contactName || "ללא שם"}</h2>
            <p className="font-bold text-slate-600" dir="ltr">
              {row.phone || "—"}
            </p>
            {!compact ? (
              <p className="mt-1 text-xs font-bold text-slate-500">{formatIsraelDate(row.startAt, true)}</p>
            ) : null}
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black">
            {STATUS_HE[row.status] || STATUS_LABELS[row.status] || row.status}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-4 px-3 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#7C4DFF]">יומן BizUply</p>
            <h1 className="text-2xl font-black text-purple-950">שיחה ראשונית — 15 דקות</h1>
            <p className="font-bold text-slate-500">
              {intro?.nameHe || "שיחה ראשונית"} · {intro?.durationMinutes || 15} דקות · {data?.timezone || "Asia/Jerusalem"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={() => setSettingsOpen(true)}>זמינות</SecondaryButton>
            <SecondaryButton onClick={() => load()}>רענון</SecondaryButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["day", "week", "list"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={[
                "min-h-11 rounded-2xl px-4 text-sm font-black",
                view === key ? "bg-[#7C4DFF] text-white" : "border border-purple-100 bg-white text-slate-600",
              ].join(" ")}
            >
              {key === "day" ? "יום" : key === "week" ? "שבוע" : "רשימה"}
            </button>
          ))}
          <input
            type="date"
            className="min-h-11 rounded-2xl border px-3"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <SecondaryButton onClick={() => setFrom(toDateInput(addDays(new Date(from), view === "day" ? -1 : -7)))}>
            הקודם
          </SecondaryButton>
          <SecondaryButton onClick={() => setFrom(toDateInput(addDays(new Date(from), view === "day" ? 1 : 7)))}>
            הבא
          </SecondaryButton>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => load()} /> : null}

        {!loading && !(data?.bookings || []).length ? (
          <EmptyState title="אין פגישות בטווח שנבחר" />
        ) : (
          <div className="space-y-4">
            {view === "list"
              ? (data?.bookings || []).map((row: any) => (
                  <AppointmentCard key={row.id} row={row} />
                ))
              : grouped.map(([day, rows]) => (
                  <CrmCard key={day}>
                    <h3 className="font-black text-purple-950">{formatIsraelDate(rows[0].startAt)}</h3>
                    <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {rows.map((row: any) => (
                        <AppointmentCard key={row.id} row={row} compact />
                      ))}
                    </div>
                  </CrmCard>
                ))}
          </div>
        )}

        {selected ? (
          <div className="fixed inset-0 z-40 bg-black/40 p-3 sm:p-6" onClick={() => setSelected(null)}>
            <div
              className="mx-auto max-h-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs font-black text-[#7C4DFF]">שיחה ראשונית · 15 דקות</p>
              <h2 className="text-xl font-black text-purple-950">{selected.contactName || "ללא שם"}</h2>
              <p className="font-bold text-slate-600" dir="ltr">{selected.phone || "—"}</p>
              <p className="mt-1 font-black">{formatIsraelDate(selected.startAt, true)}</p>
              <p className="text-sm font-bold text-slate-500">
                {STATUS_HE[selected.status] || selected.status}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {selected.adminCustomerId ? (
                  <SecondaryButton onClick={() => navigate(`/admin/crm/customers/${selected.adminCustomerId}`)}>
                    פתיחת לקוח
                  </SecondaryButton>
                ) : null}
                {selected.phone ? (
                  <a className="min-h-11 rounded-2xl bg-emerald-50 px-3 py-2 text-center text-sm font-black text-emerald-700" href={`tel:${selected.phone}`}>
                    שיחה
                  </a>
                ) : null}
                {selected.adminCustomerId ? (
                  <Link
                    className="min-h-11 rounded-2xl bg-emerald-50 px-3 py-2 text-center text-sm font-black text-emerald-700"
                    to={`/admin/crm/customers/${selected.adminCustomerId}?tab=whatsapp`}
                  >
                    WhatsApp
                  </Link>
                ) : null}
                {selected.status === "booked" ? (
                  <>
                    <SecondaryButton onClick={() => setStatus(selected.id, "cancelled")}>ביטול</SecondaryButton>
                    <SecondaryButton onClick={() => setStatus(selected.id, "no_show")}>No Show</SecondaryButton>
                    <PrimaryButton onClick={() => setStatus(selected.id, "completed")}>הושלמה</PrimaryButton>
                  </>
                ) : null}
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-black">סיכום שיחה</h3>
                <textarea
                  className="min-h-24 w-full rounded-2xl border p-3"
                  placeholder="סיכום שיחה"
                  value={summary.summary || ""}
                  onChange={(e) => setSummary((prev: any) => ({ ...prev, summary: e.target.value }))}
                />
                {selected.status === "booked" ? (
                  <PrimaryButton onClick={() => setStatus(selected.id, "completed")}>שמירת סיכום וסיום</PrimaryButton>
                ) : null}
                <SecondaryButton onClick={loadSlots}>טעינת מועדים לשינוי</SecondaryButton>
                {slots.length ? (
                  <div className="flex flex-wrap gap-2">
                    <select
                      className="min-h-11 flex-1 rounded-2xl border px-3"
                      value={rescheduleStart}
                      onChange={(e) => setRescheduleStart(e.target.value)}
                    >
                      <option value="">מועד חדש</option>
                      {slots.map((slot: any) => (
                        <option key={slot.startAt} value={slot.startAt}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <PrimaryButton disabled={!rescheduleStart} onClick={reschedule}>
                      שינוי מועד
                    </PrimaryButton>
                  </div>
                ) : null}
                {selected.adminCustomerId ? (
                  <div className="flex flex-wrap gap-2">
                    <input
                      className="min-h-11 flex-1 rounded-2xl border px-3"
                      placeholder="הערת מעקב"
                      value={followNote}
                      onChange={(e) => setFollowNote(e.target.value)}
                    />
                    <SecondaryButton onClick={scheduleFollowUp}>קביעת מעקב</SecondaryButton>
                  </div>
                ) : null}
                <SecondaryButton onClick={() => setSelected(null)}>סגירה</SecondaryButton>
              </div>
            </div>
          </div>
        ) : null}

        {settingsOpen ? (
          <div className="fixed inset-0 z-40 bg-black/40 p-3 sm:p-6" onClick={() => setSettingsOpen(false)}>
            <div
              className="mx-auto max-w-lg rounded-[28px] bg-white p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-black text-purple-950">זמינות לשיחה ראשונית</h2>
              <p className="font-bold text-slate-500">שיחה ראשונית — 15 דקות בלבד</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {DAY_OPTIONS.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setAvailability((prev) => ({
                        ...prev,
                        activeDays: prev.activeDays.includes(key)
                          ? prev.activeDays.filter((day) => day !== key)
                          : [...prev.activeDays, key],
                      }))
                    }
                    className={[
                      "min-h-11 min-w-11 rounded-2xl px-3 text-sm font-black",
                      availability.activeDays.includes(key)
                        ? "bg-[#7C4DFF] text-white"
                        : "border border-purple-100 bg-white",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-sm font-bold">
                  התחלה
                  <input
                    type="time"
                    className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                    value={availability.start}
                    onChange={(e) => setAvailability((prev) => ({ ...prev, start: e.target.value }))}
                  />
                </label>
                <label className="text-sm font-bold">
                  סיום
                  <input
                    type="time"
                    className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                    value={availability.end}
                    onChange={(e) => setAvailability((prev) => ({ ...prev, end: e.target.value }))}
                  />
                </label>
                <label className="text-sm font-bold">
                  התראה מינימלית (דק׳)
                  <input
                    type="number"
                    className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                    value={availability.minAdvanceMinutes}
                    onChange={(e) =>
                      setAvailability((prev) => ({ ...prev, minAdvanceMinutes: Number(e.target.value) }))
                    }
                  />
                </label>
                <label className="text-sm font-bold">
                  אופק תיאום (ימים)
                  <input
                    type="number"
                    className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                    value={availability.bookingHorizonDays}
                    onChange={(e) =>
                      setAvailability((prev) => ({ ...prev, bookingHorizonDays: Number(e.target.value) }))
                    }
                  />
                </label>
                <label className="col-span-2 text-sm font-bold">
                  באפר אחרי פגישה (דק׳, אופציונלי)
                  <input
                    type="number"
                    className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                    value={availability.bufferAfterMinutes}
                    onChange={(e) =>
                      setAvailability((prev) => ({ ...prev, bufferAfterMinutes: Number(e.target.value) }))
                    }
                  />
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <PrimaryButton disabled={savingSettings} onClick={saveAvailability}>
                  שמירת זמינות
                </PrimaryButton>
                <SecondaryButton onClick={() => setSettingsOpen(false)}>סגירה</SecondaryButton>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
