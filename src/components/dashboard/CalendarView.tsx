import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";

type TranslationValues = Record<string, string | number>;
type TFunction = (key: string, values?: TranslationValues) => string;

type Appointment = {
  _id?: string;
  id?: string;
  date?: string;
  time?: string;
  serviceName?: string;
  clientName?: string;
  clientSnapshot?: { name?: string };
  client?: { name?: string };
  [key: string]: any;
};

type CalendarViewProps = {
  appointments?: Appointment[];
  onDateClick?: (date: string) => void;
  selectedDate?: string;
  t?: TFunction;
  locale?: string;
  onNewAppointment?: () => void;
};

const fallbackT: TFunction = (key, values) => {
  const dictionary: Record<string, string> = {
    "dashboard.calendarView.ariaLabel": "Appointment calendar",
    "dashboard.calendarView.previousWeek": "Previous week",
    "dashboard.calendarView.nextWeek": "Next week",
    "dashboard.calendarView.today": "Today",
    "dashboard.calendarView.day": "Day",
    "dashboard.calendarView.week": "Week",
    "dashboard.calendarView.month": "Month",
    "dashboard.calendarView.newAppointment": "New Appointment",
    "dashboard.calendarView.allDay": "all-day",
    "dashboard.calendarView.emptySlot": "Available",
    "dashboard.calendarView.client": "Client",
  };

  let text = dictionary[key] || key;

  if (values) {
    Object.entries(values).forEach(([valueKey, value]) => {
      text = text.split(`{{${valueKey}}}`).join(String(value));
    });
  }

  return text;
};

function isHebrewLocale(locale: string): boolean {
  return locale === "he" || locale === "he-IL" || locale.startsWith("he-");
}

function getLocalIso(date: Date): string {
  return date.toLocaleDateString("en-CA");
}

function getSafeDate(date?: string): Date {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Date(`${date}T12:00:00`);
  }

  return new Date();
}

function startOfWeek(date: Date): Date {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addWeeks(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount * 7);
  return next;
}

function getClientName(appointment: Appointment): string {
  return (
    appointment.clientSnapshot?.name ||
    appointment.client?.name ||
    appointment.clientName ||
    "Client"
  );
}

function getServiceName(appointment: Appointment): string {
  return appointment.serviceName || "Appointment";
}

function getWeekRangeTitle(weekStart: Date, locale: string): string {
  const weekEnd = addDays(weekStart, 6);
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
  const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();

  const startText = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(weekStart);

  const endText = new Intl.DateTimeFormat(locale, {
    month: sameMonth ? undefined : "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  }).format(weekEnd);

  const yearText = sameYear ? `, ${weekStart.getFullYear()}` : "";
  return `${startText} - ${endText}${yearText}`;
}

function getEventTone(index: number): string {
  const tones = [
    "border-violet-200 bg-violet-100/80 text-violet-950",
    "border-pink-200 bg-pink-100/80 text-pink-950",
    "border-amber-200 bg-amber-100/80 text-amber-950",
    "border-emerald-200 bg-emerald-100/80 text-emerald-950",
    "border-indigo-200 bg-indigo-100/80 text-indigo-950",
    "border-orange-200 bg-orange-100/80 text-orange-950",
  ];

  return tones[index % tones.length];
}

const HOURS = Array.from({ length: 10 }, (_, index) => 9 + index);

const CalendarView = React.memo(
  ({
    appointments = [],
    onDateClick,
    selectedDate,
    t = fallbackT,
    locale = "en-US",
    onNewAppointment,
  }: CalendarViewProps) => {
    const isRtl = isHebrewLocale(locale);
    const todayIso = useMemo(() => getLocalIso(new Date()), []);
    const [weekStart, setWeekStart] = useState(() =>
      startOfWeek(getSafeDate(selectedDate))
    );

    const days = useMemo(
      () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
      [weekStart]
    );

    const weekRangeTitle = useMemo(
      () => getWeekRangeTitle(weekStart, locale),
      [locale, weekStart]
    );

    const appointmentsByDay = useMemo(() => {
      const map: Record<string, Appointment[]> = {};

      appointments.forEach((appointment) => {
        if (!appointment?.date) return;

        if (!map[appointment.date]) {
          map[appointment.date] = [];
        }

        map[appointment.date].push(appointment);
      });

      Object.values(map).forEach((items) => {
        items.sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));
      });

      return map;
    }, [appointments]);

    const goToday = () => {
      const today = new Date();
      setWeekStart(startOfWeek(today));
      onDateClick?.(getLocalIso(today));
    };

    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        aria-label={t("dashboard.calendarView.ariaLabel")}
        className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)]"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-pink-100/60 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 border-b border-slate-100 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-inner">
              <CalendarDays size={20} />
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-black tracking-tight text-slate-950">
                Calendar
              </h3>
              <button
                type="button"
                className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-violet-700"
              >
                <span>{weekRangeTitle}</span>
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setWeekStart((current) => addWeeks(current, isRtl ? 1 : -1))}
                aria-label={t("dashboard.calendarView.previousWeek")}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-violet-700"
              >
                {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setWeekStart((current) => addWeeks(current, isRtl ? -1 : 1))}
                aria-label={t("dashboard.calendarView.nextWeek")}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-violet-700"
              >
                {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>

            <button
              type="button"
              onClick={goToday}
              className="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              {t("dashboard.calendarView.today")}
            </button>

            <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              <button className="h-9 rounded-xl px-4 text-xs font-bold text-slate-500" type="button">
                {t("dashboard.calendarView.day")}
              </button>
              <button className="h-9 rounded-xl bg-violet-100 px-4 text-xs font-black text-violet-700" type="button">
                {t("dashboard.calendarView.week")}
              </button>
              <button className="h-9 rounded-xl px-4 text-xs font-bold text-slate-500" type="button">
                {t("dashboard.calendarView.month")}
              </button>
            </div>

            <button
              type="button"
              onClick={onNewAppointment}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-violet-600 px-4 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.24)] transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              <Plus size={16} />
              {t("dashboard.calendarView.newAppointment")}
            </button>
          </div>
        </div>

        <div className="relative z-10 overflow-x-auto px-4 pb-5 pt-3">
          <div className="min-w-[960px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <div className="grid grid-cols-[86px_repeat(7,minmax(112px,1fr))] border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-end justify-center px-3 py-3 text-xs font-black uppercase text-slate-400">
                {t("dashboard.calendarView.allDay")}
              </div>

              {days.map((day) => {
                const dateStr = getLocalIso(day);
                const isToday = dateStr === todayIso;
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    type="button"
                    key={dateStr}
                    onClick={() => onDateClick?.(dateStr)}
                    className={`border-l border-slate-100 px-2 py-3 text-center transition first:border-l-0 ${
                      isSelected ? "bg-violet-50" : "hover:bg-white"
                    }`}
                  >
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                      {new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day)}
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-1.5">
                      <span
                        className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-black ${
                          isToday || isSelected
                            ? "bg-violet-600 text-white shadow-[0_8px_18px_rgba(124,58,237,0.28)]"
                            : "text-slate-800"
                        }`}
                      >
                        {new Intl.DateTimeFormat(locale, { day: "numeric" }).format(day)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid min-h-[82px] grid-cols-[86px_repeat(7,minmax(112px,1fr))] border-b border-slate-100 last:border-b-0"
              >
                <div className="border-r border-slate-100 bg-slate-50/40 px-3 py-3 text-right text-xs font-bold text-slate-500">
                  {new Intl.DateTimeFormat(locale, {
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(2024, 0, 1, hour, 0))}
                </div>

                {days.map((day, dayIndex) => {
                  const dateStr = getLocalIso(day);
                  const items = (appointmentsByDay[dateStr] || []).filter((appointment) => {
                    const apptHour = Number((appointment.time || "").slice(0, 2));
                    return Number.isFinite(apptHour) && apptHour === hour;
                  });

                  return (
                    <button
                      type="button"
                      key={`${dateStr}-${hour}`}
                      onClick={() => onDateClick?.(dateStr)}
                      className="relative border-l border-slate-100 bg-white px-2 py-2 text-start transition hover:bg-violet-50/30 first:border-l-0"
                    >
                      {items.length === 0 ? (
                        <span className="sr-only">{t("dashboard.calendarView.emptySlot")}</span>
                      ) : (
                        <div className="space-y-1.5">
                          {items.slice(0, 2).map((appointment, itemIndex) => (
                            <div
                              key={appointment._id || appointment.id || `${dateStr}-${hour}-${itemIndex}`}
                              className={`rounded-xl border px-3 py-2 shadow-sm ${getEventTone(dayIndex + itemIndex)}`}
                            >
                              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-black">
                                <Clock size={12} />
                                <span>{appointment.time || "--:--"}</span>
                              </div>
                              <p className="truncate text-xs font-black">
                                {getClientName(appointment)}
                              </p>
                              <p className="truncate text-[11px] font-semibold opacity-80">
                                {getServiceName(appointment)}
                              </p>
                            </div>
                          ))}

                          {items.length > 2 && (
                            <div className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">
                              +{items.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

CalendarView.displayName = "CalendarView";

export default CalendarView;
