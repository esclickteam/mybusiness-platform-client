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
import AdminBizuplyHours, { hoursFromPayload } from "./AdminBizuplyHours";
import {
  AdminBizuplyBookFlow,
  APPOINTMENT_STATUS_HE,
  AppointmentDetails,
  israelTime,
} from "./AdminBizuplyBookFlow";
import { AdminModal } from "./crm/AdminModal";

function israelDateKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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

function startOfMonth(value: string) {
  const d = new Date(`${value}T00:00:00`);
  d.setDate(1);
  return toDateInput(d);
}

export default function AdminBizuplyCalendar() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"day" | "week" | "month" | "list">("list");
  const [from, setFrom] = useState(toDateInput(new Date()));
  const [selected, setSelected] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"hours" | "services" | "holidays" | "blocks">("hours");
  const [bookOpen, setBookOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [hours, setHours] = useState(() => hoursFromPayload({}));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      setIsMobile(mq.matches);
      if (mq.matches && (view === "week" || view === "month")) setView("list");
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [view]);

  async function load(nextFrom = from, nextView = view) {
    setLoading(true);
    setError("");
    try {
      const days = nextView === "day" ? 1 : nextView === "week" ? 7 : nextView === "month" ? 31 : 14;
      const rangeFrom = nextView === "month" ? startOfMonth(nextFrom) : nextFrom;
      const { data: res } = await adminCrmApi.calendar({ from: rangeFrom, days });
      setData(res);
      setHours(hoursFromPayload(res));
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

  const holidayByDate = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of data?.holidays || data?.availability?.holidays || []) {
      map.set(row.date, row.nameHe);
    }
    return map;
  }, [data]);

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

  const monthCells = useMemo(() => {
    if (view !== "month") return [];
    const start = new Date(`${startOfMonth(from)}T00:00:00`);
    const weekday = start.getDay();
    const cells: Array<{ date: string; inMonth: boolean }> = [];
    const cursor = addDays(start, -weekday);
    for (let i = 0; i < 42; i += 1) {
      const date = toDateInput(cursor);
      cells.push({ date, inMonth: cursor.getMonth() === start.getMonth() });
      cursor.setDate(cursor.getDate() + 1);
    }
    return cells;
  }, [from, view]);

  async function saveAvailability(payload: Record<string, unknown>) {
    setSavingSettings(true);
    try {
      const { data: res } = await adminCrmApi.calendarSettings(payload);
      setData(res);
      setHours(hoursFromPayload(res));
      setSettingsOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || "שמירת הזמינות נכשלה");
    } finally {
      setSavingSettings(false);
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
              {israelTime(row.startAt)} · {row.serviceName || "שיחה ראשונית"} · {row.durationMinutes || 15} דקות
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
            {row.statusLabelHe || APPOINTMENT_STATUS_HE[row.status] || row.status}
          </span>
        </div>
      </button>
    );
  }

  const views = (isMobile ? (["day", "list"] as const) : (["day", "week", "month", "list"] as const));

  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-4 px-3 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#7C4DFF]">יומן BizUply</p>
            <h1 className="text-2xl font-black text-purple-950">כל התיאומים מול לקוחות Admin CRM</h1>
            <p className="font-bold text-slate-500">שעון ישראל · כל פגישה שייכת ללקוח · חסימות פנימיות בלבד ללא לקוח</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton onClick={() => setBookOpen(true)}>+ קביעת שיחה</PrimaryButton>
            <SecondaryButton
              onClick={() => {
                setSettingsTab("hours");
                setSettingsOpen(true);
              }}
            >
              שעות פעילות
            </SecondaryButton>
            <SecondaryButton
              onClick={() => {
                setSettingsTab("services");
                setSettingsOpen(true);
              }}
            >
              שירותים
            </SecondaryButton>
            <SecondaryButton onClick={() => load()}>רענון</SecondaryButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {views.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={[
                "min-h-11 rounded-2xl px-4 text-sm font-black",
                view === key ? "bg-[#7C4DFF] text-white" : "border border-purple-100 bg-white text-slate-600",
              ].join(" ")}
            >
              {key === "day" ? "יום" : key === "week" ? "שבוע" : key === "month" ? "חודש" : "רשימה"}
            </button>
          ))}
          <input
            type="date"
            className="min-h-11 rounded-2xl border px-3"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <SecondaryButton onClick={() => setFrom(toDateInput(addDays(new Date(from), view === "month" ? -30 : view === "day" ? -1 : -7)))}>
            הקודם
          </SecondaryButton>
          <SecondaryButton onClick={() => setFrom(toDateInput(addDays(new Date(from), view === "month" ? 30 : view === "day" ? 1 : 7)))}>
            הבא
          </SecondaryButton>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => load()} /> : null}

        {!loading && view === "month" ? (
          <div className="grid grid-cols-7 gap-1">
            {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((d) => (
              <div key={d} className="px-1 text-center text-xs font-black text-slate-400">{d}</div>
            ))}
            {monthCells.map((cell) => {
              const rows = grouped.find(([day]) => day === cell.date)?.[1] || [];
              const holiday = holidayByDate.get(cell.date);
              return (
                <button
                  key={cell.date}
                  type="button"
                  onClick={() => {
                    setFrom(cell.date);
                    setView("day");
                  }}
                  className={[
                    "min-h-20 rounded-xl border p-1 text-right",
                    cell.inMonth ? "bg-white" : "bg-slate-50 text-slate-400",
                    holiday ? "border-amber-200" : "border-purple-50",
                  ].join(" ")}
                >
                  <p className="text-xs font-black">{cell.date.slice(8)}</p>
                  {holiday ? <p className="truncate text-[10px] font-bold text-amber-700">{holiday}</p> : null}
                  {rows.slice(0, 3).map((row: any) => (
                    <p key={row.id} className="truncate text-[10px] font-bold text-[#7C4DFF]">
                      {israelTime(row.startAt)} {row.contactName}
                    </p>
                  ))}
                </button>
              );
            })}
          </div>
        ) : null}

        {!loading && view !== "month" && !(data?.bookings || []).length ? (
          <EmptyState title="אין פגישות בטווח שנבחר" action={<PrimaryButton onClick={() => setBookOpen(true)}>+ קביעת שיחה</PrimaryButton>} />
        ) : null}

        {!loading && view !== "month" && (data?.bookings || []).length ? (
          <div className="space-y-4">
            {view === "list"
              ? (data?.bookings || []).map((row: any) => (
                  <AppointmentCard key={row.id} row={row} />
                ))
              : grouped.map(([day, rows]) => (
                  <CrmCard key={day}>
                    <h3 className="font-black text-purple-950">
                      {formatIsraelDate(rows[0].startAt)}
                      {holidayByDate.get(day) ? ` · ${holidayByDate.get(day)}` : ""}
                    </h3>
                    <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {rows.map((row: any) => (
                        <AppointmentCard key={row.id} row={row} compact />
                      ))}
                    </div>
                  </CrmCard>
                ))}
          </div>
        ) : null}

        {selected ? (
          <AdminModal
            open
            onClose={() => setSelected(null)}
            eyebrow="יומן BizUply"
            title={selected.serviceName || "שיחה ראשונית"}
            subtitle={selected.contactName || "ללא שם"}
            size="sm"
            footer={
              <>
                {selected.adminCustomerId ? (
                  <PrimaryButton compact onClick={() => navigate(`/admin/crm/customers/${selected.adminCustomerId}`)}>
                    פתח כרטיס לקוח
                  </PrimaryButton>
                ) : null}
                {selected.adminCustomerId ? (
                  <Link
                    className="inline-flex h-8 items-center rounded-lg bg-emerald-50 px-3 text-xs font-semibold text-emerald-700"
                    to={`/admin/crm/customers/${selected.adminCustomerId}?tab=whatsapp`}
                  >
                    WhatsApp
                  </Link>
                ) : null}
                <SecondaryButton compact onClick={() => setSelected(null)}>סגירה</SecondaryButton>
              </>
            }
          >
            <AppointmentDetails row={selected} />
            <p className="mt-2 text-sm font-medium text-slate-700" dir="ltr">{selected.phone || "—"}</p>
            {!selected.adminCustomerId ? (
              <p className="mt-2 text-xs text-slate-500">חסימה פנימית — לא משויכת ללקוח</p>
            ) : null}
          </AdminModal>
        ) : null}

        {bookOpen ? (
          <AdminBizuplyBookFlow
            services={data?.services || hours.services || []}
            onClose={() => setBookOpen(false)}
            onBooked={() => {
              setBookOpen(false);
              load();
            }}
          />
        ) : null}

        {settingsOpen ? (
          <AdminBizuplyHours
            key={settingsTab}
            initial={hours}
            initialTab={settingsTab}
            saving={savingSettings}
            onSave={saveAvailability}
            onClose={() => setSettingsOpen(false)}
          />
        ) : null}
      </main>
    </div>
  );
}
