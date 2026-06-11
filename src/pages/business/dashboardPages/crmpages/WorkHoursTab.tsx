"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Power,
  Save,
  Sparkles,
} from "lucide-react";

import API from "@api";
import { useAuth } from "@/context/AuthContext";

type WorkHoursTabVariant = "page" | "settings";

type WorkHoursTabProps = {
  variant?: WorkHoursTabVariant;
};

type WorkDay = {
  start: string;
  end: string;
};

type WeeklyHours = Record<number, WorkDay | null>;

type WorkHourField = keyof WorkDay;

type AuthUser = {
  businessId?: string;
};

type AuthContextValue = {
  user?: AuthUser | null;
};

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const defaultDay: WorkDay = {
  start: "09:00",
  end: "17:00",
};

const emptyWeeklyHours: WeeklyHours = {
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
};

function isValidDayIndex(value: unknown): value is number {
  const dayIndex = Number(value);
  return Number.isInteger(dayIndex) && dayIndex >= 0 && dayIndex <= 6;
}

function normalizeTime(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;

  const clean = value.trim();

  if (/^\d{2}:\d{2}$/.test(clean)) return clean;

  const shortMatch = clean.match(/^(\d{1,2}):(\d{2})$/);

  if (!shortMatch) return fallback;

  const hours = shortMatch[1].padStart(2, "0");
  const minutes = shortMatch[2];

  return `${hours}:${minutes}`;
}

function normalizeWorkDay(value: any): WorkDay | null {
  if (!value) return null;

  if (
    value === null ||
    value.isOpen === false ||
    value.open === false ||
    value.closed === true ||
    value.status === "closed"
  ) {
    return null;
  }

  const start = normalizeTime(
    value.start ??
      value.startTime ??
      value.from ??
      value.openFrom ??
      value.openingTime,
    defaultDay.start
  );

  const end = normalizeTime(
    value.end ??
      value.endTime ??
      value.to ??
      value.openTo ??
      value.closingTime,
    defaultDay.end
  );

  return { start, end };
}

function normalizeWorkHours(raw: any): WeeklyHours {
  const next: WeeklyHours = { ...emptyWeeklyHours };

  if (!raw) return next;

  if (Array.isArray(raw)) {
    raw.forEach((item, arrayIndex) => {
      const dayIndex =
        item && typeof item === "object" && isValidDayIndex(item.dayIndex)
          ? Number(item.dayIndex)
          : item && typeof item === "object" && isValidDayIndex(item.day)
            ? Number(item.day)
            : arrayIndex;

      if (!isValidDayIndex(dayIndex)) return;

      next[dayIndex] = normalizeWorkDay(item);
    });

    return next;
  }

  if (typeof raw === "object") {
    Object.entries(raw).forEach(([key, value]) => {
      const dayIndex = Number(key);

      if (isValidDayIndex(dayIndex)) {
        next[dayIndex] = normalizeWorkDay(value);
        return;
      }

      const namedDayIndex = weekdays.findIndex(
        (day) => day.toLowerCase() === key.toLowerCase()
      );

      if (isValidDayIndex(namedDayIndex)) {
        next[namedDayIndex] = normalizeWorkDay(value);
      }
    });
  }

  return next;
}

function sanitizeWorkHours(weeklyHours: WeeklyHours): WeeklyHours {
  const next: WeeklyHours = { ...emptyWeeklyHours };

  weekdays.forEach((_, index) => {
    const day = weeklyHours[index];

    if (!day) {
      next[index] = null;
      return;
    }

    next[index] = {
      start: normalizeTime(day.start, defaultDay.start),
      end: normalizeTime(day.end, defaultDay.end),
    };
  });

  return next;
}

export default function WorkHoursTab({ variant = "page" }: WorkHoursTabProps) {
  const isSettingsVariant = variant === "settings";

  const { businessId: routeBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth() as AuthContextValue;
  const businessId = routeBusinessId || user?.businessId || "";

  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours>(emptyWeeklyHours);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchWorkHours() {
      try {
        setLoading(true);

        if (!businessId) {
          setWeeklyHours(emptyWeeklyHours);
          return;
        }

        const res = await API.get("/appointments/get-work-hours", {
          params: { businessId },
        });

        const serverSchedule =
          res.data?.schedule ??
          res.data?.workHours ??
          res.data?.business?.schedule ??
          res.data?.business?.workHours ??
          null;

        setWeeklyHours(normalizeWorkHours(serverSchedule));
      } catch (error) {
        console.error("Error loading work hours:", error);
        setWeeklyHours(emptyWeeklyHours);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkHours();
  }, [businessId]);

  const openDaysCount = useMemo(() => {
    return weekdays.filter((_, index) => weeklyHours[index] !== null).length;
  }, [weeklyHours]);

  const closedDaysCount = useMemo(() => {
    return weekdays.length - openDaysCount;
  }, [openDaysCount]);

  const totalWeeklyMinutes = useMemo(() => {
    return weekdays.reduce((sum, _, index) => {
      const day = weeklyHours[index];

      if (!day?.start || !day?.end) return sum;

      return sum + Math.max(0, timeToMinutes(day.end) - timeToMinutes(day.start));
    }, 0);
  }, [weeklyHours]);

  const handleChange = (
    dayIndex: number,
    field: WorkHourField,
    value: string
  ) => {
    setWeeklyHours((prev) => {
      const current = prev[dayIndex] ?? defaultDay;

      return {
        ...prev,
        [dayIndex]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const toggleDay = (dayIndex: number) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex] === null ? { ...defaultDay } : null,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

      if (!businessId) {
        alert("Missing businessId");
        return;
      }

      const cleanSchedule = sanitizeWorkHours(weeklyHours);

      await API.post("/appointments/update-work-hours", {
        businessId,
        schedule: cleanSchedule,
        workHours: cleanSchedule,
      });

      setWeeklyHours(cleanSchedule);
      setSaved(true);
    } catch (error) {
      console.error("Error saving work hours:", error);
      alert("Failed to save work hours");
    } finally {
      setSaving(false);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    }
  };

  return (
    <div className={isSettingsVariant ? "space-y-5" : "space-y-5"}>
      {!isSettingsVariant && (
        <>
          <section className="relative overflow-hidden rounded-[2.3rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/80 to-violet-50/70 p-6 shadow-[0_26px_80px_rgba(14,165,233,0.10)]">
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-200/55 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-120px] left-10 h-72 w-72 rounded-full bg-violet-200/45 blur-3xl" />
            <div className="pointer-events-none absolute left-1/3 top-10 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-700 shadow-sm">
                  <Clock className="h-4 w-4" />
                  CRM Work Hours
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Business working hours
                </h2>

                <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                  Set your weekly availability so appointments and booking slots
                  match your real business schedule.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-5 w-5" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <WorkHoursHeroMock />
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Open days"
              value={openDaysCount}
              icon={CalendarDays}
              helper="available this week"
            />

            <StatCard
              label="Closed days"
              value={closedDaysCount}
              icon={Power}
              helper="not bookable"
            />

            <StatCard
              label="Weekly hours"
              value={formatWeeklyHours(totalWeeklyMinutes)}
              icon={Clock}
              helper="total availability"
            />

            <StatCard
              label="Booking status"
              value="Active"
              icon={Sparkles}
              helper="slots are synced"
            />
          </section>
        </>
      )}

      {isSettingsVariant && (
        <section className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-violet-50/50 p-5 shadow-[0_18px_50px_rgba(14,165,233,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-sky-700">
                  CRM Work Hours
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                  Working hours
                </h3>

                <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
                  Define which days are open and control the time range clients
                  can use for appointments.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-5 w-5" />
              {saving ? "Saving..." : "Save Hours"}
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStatCard
              label="Open days"
              value={openDaysCount}
              icon={CalendarDays}
            />

            <MiniStatCard
              label="Closed days"
              value={closedDaysCount}
              icon={Power}
            />

            <MiniStatCard
              label="Weekly hours"
              value={formatWeeklyHours(totalWeeklyMinutes)}
              icon={Clock}
            />

            <MiniStatCard
              label="Status"
              value="Active"
              icon={Sparkles}
            />
          </div>
        </section>
      )}

      <section
        className={[
          "grid gap-5",
          isSettingsVariant
            ? "xl:grid-cols-[minmax(0,1fr)_320px]"
            : "xl:grid-cols-[minmax(0,1fr)_360px]",
        ].join(" ")}
      >
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  Weekly Schedule
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Choose which days are open and define the start/end time for
                  each day.
                </p>
              </div>

              {isSettingsVariant && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : (
            <div className="grid gap-3 p-5">
              {weekdays.map((day, index) => {
                const dayData = weeklyHours[index];
                const isClosed = dayData === null;

                return (
                  <div
                    key={day}
                    className={[
                      "rounded-[1.5rem] border p-4 transition",
                      isClosed
                        ? "border-slate-100 bg-slate-50/80"
                        : "border-slate-100 bg-white shadow-sm",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-12 w-12 items-center justify-center rounded-2xl",
                            isClosed
                              ? "bg-slate-100 text-slate-400"
                              : "bg-sky-50 text-sky-900",
                          ].join(" ")}
                        >
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-base font-black text-slate-950">
                            {day}
                          </p>

                          <p className="text-sm font-semibold text-slate-500">
                            {isClosed
                              ? "Closed for bookings"
                              : "Open for bookings"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {!isClosed && (
                          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-2">
                            <TimeInput
                              value={dayData?.start || defaultDay.start}
                              onChange={(value) =>
                                handleChange(index, "start", value)
                              }
                            />

                            <span className="px-1 text-sm font-black text-slate-400">
                              –
                            </span>

                            <TimeInput
                              value={dayData?.end || defaultDay.end}
                              onChange={(value) =>
                                handleChange(index, "end", value)
                              }
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleDay(index)}
                          className={[
                            "inline-flex h-11 min-w-[104px] items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition",
                            isClosed
                              ? "bg-slate-950 text-white shadow-lg shadow-slate-200 hover:bg-sky-950"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                          ].join(" ")}
                        >
                          <Power className="h-4 w-4" />
                          {isClosed ? "Closed" : "Open"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-950">
                  Weekly Overview
                </h3>

                <p className="text-xs font-semibold text-slate-500">
                  Live summary of your schedule
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {weekdays.map((day, index) => {
                const dayData = weeklyHours[index];

                return (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="text-sm font-black text-slate-700">
                      {day}
                    </span>

                    {dayData ? (
                      <span className="rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-900">
                        {dayData.start || "--:--"} – {dayData.end || "--:--"}
                      </span>
                    ) : (
                      <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
                        Closed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {!isSettingsVariant && (
            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <h3 className="text-base font-black text-slate-950">
                Schedule Tips
              </h3>

              <div className="mt-4 space-y-3">
                <TipItem text="Keep at least one day closed for rest or admin work." />
                <TipItem text="Use realistic hours so clients cannot book outside your availability." />
                <TipItem text="After changing hours, save to refresh booking slots." />
              </div>
            </section>
          )}

          {isSettingsVariant && (
            <section className="rounded-[2rem] border border-sky-100 bg-sky-50/50 p-5">
              <h3 className="text-base font-black text-slate-950">
                Booking rules tip
              </h3>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                For blocked dates, holidays or special hours, use the Special
                Dates tab inside CRM Setup.
              </p>
            </section>
          )}
        </aside>
      </section>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-sm font-black text-emerald-700 shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
          <CheckCircle2 className="h-5 w-5" />
          Saved successfully
        </div>
      )}
    </div>
  );
}

function TimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
    />
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  helper,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs font-black text-emerald-600">▲ Active</p>

          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function MiniStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[1.35rem] border border-white bg-white/80 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-slate-400">{label}</p>

          <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-800">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function WorkHoursHeroMock() {
  return (
    <div className="relative hidden h-44 xl:block">
      <div className="absolute right-10 top-0 h-40 w-72 rounded-3xl border border-white bg-white/70 shadow-[0_24px_60px_rgba(14,165,233,0.16)] backdrop-blur" />

      <div className="absolute right-44 top-12 flex h-24 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 shadow-sm">
        <Clock className="h-10 w-10 text-sky-700" />
      </div>

      <div className="absolute right-20 top-10 h-28 w-44 rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-sky-100 backdrop-blur">
        <div className="h-4 w-24 rounded-full bg-sky-200" />
        <div className="mt-4 h-3 w-32 rounded-full bg-slate-100" />
        <div className="mt-3 h-3 w-24 rounded-full bg-slate-100" />
        <div className="mt-3 h-3 w-28 rounded-full bg-slate-100" />
      </div>

      <div className="absolute right-0 top-9 h-28 w-32 rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-violet-100 backdrop-blur">
        <div className="flex h-full items-end gap-3">
          <span className="h-12 w-4 rounded-full bg-sky-200" />
          <span className="h-20 w-4 rounded-full bg-violet-300" />
          <span className="h-10 w-4 rounded-full bg-emerald-200" />
        </div>
      </div>

      <div className="absolute right-[-16px] top-5 grid gap-3">
        {[CalendarDays, Clock, Power].map((Icon, index) => (
          <div
            key={index}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100"
          >
            <Icon className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <p className="text-sm font-semibold leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-slate-950" />

      <p className="text-sm font-bold text-slate-500">
        Loading working hours...
      </p>
    </div>
  );
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
}

function formatWeeklyHours(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours <= 0 && restMinutes <= 0) return "0h";

  if (restMinutes > 0) {
    return `${hours}h ${restMinutes}m`;
  }

  return `${hours}h`;
}