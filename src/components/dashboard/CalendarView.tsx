"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
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
  name?: string;
  title?: string;
  service?: {
    name?: string;
    title?: string;
  };
  clientSnapshot?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  crmClientId?: {
    fullName?: string;
    phone?: string;
    email?: string;
  };
  [key: string]: any;
};

type CalendarCell =
  | {
      type: "empty";
      key: string;
    }
  | {
      type: "day";
      key: string;
      day: number;
      dateStr: string;
      isToday: boolean;
      isSelected: boolean;
      appointments: Appointment[];
    };

type CalendarViewProps = {
  appointments?: Appointment[];
  onDateClick?: (date: string) => void;
  selectedDate?: string;
  t?: TFunction;
  locale?: string;
};

const fallbackT: TFunction = (key, values) => {
  const dictionary: Record<string, string> = {
    "dashboard.calendarView.ariaLabel": "Appointment calendar",
    "dashboard.calendarView.previousMonth": "Previous month",
    "dashboard.calendarView.nextMonth": "Next month",
    "dashboard.calendarView.hint": "Click a date to view your daily agenda",
    "dashboard.calendarView.more": "+{{count}} more",
  };

  let text = dictionary[key] || key;

  if (values) {
    Object.entries(values).forEach(([valueKey, value]) => {
      text = text.split(`{{${valueKey}}}`).join(String(value));
    });
  }

  return text;
};

const eventColorClasses = [
  "border-violet-100 bg-violet-50 text-violet-800",
  "border-amber-100 bg-amber-50 text-amber-800",
  "border-pink-100 bg-pink-50 text-pink-800",
  "border-emerald-100 bg-emerald-50 text-emerald-800",
  "border-sky-100 bg-sky-50 text-sky-800",
  "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-800",
];

function isHebrewLocale(locale: string): boolean {
  return locale === "he" || locale === "he-IL";
}

function getTodayIso(): string {
  return new Date().toLocaleDateString("en-CA");
}

function normalizeDateKey(date?: string): string {
  if (!date) return "";

  return String(date).split("T")[0];
}

function getMonthTitle(year: number, month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

function getWeekDays(locale: string): string[] {
  const baseSunday = new Date(2024, 0, 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseSunday);
    date.setDate(baseSunday.getDate() + index);

    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
    }).format(date);
  });
}

function getClientName(appointment: Appointment): string {
  return (
    appointment.clientName ||
    appointment.clientSnapshot?.name ||
    appointment.crmClientId?.fullName ||
    appointment.name ||
    "Client"
  );
}

function getServiceName(appointment: Appointment): string {
  return (
    appointment.serviceName ||
    appointment.service?.name ||
    appointment.service?.title ||
    appointment.title ||
    "Service"
  );
}

function sortAppointmentsByTime(a: Appointment, b: Appointment) {
  return String(a.time || "99:99").localeCompare(String(b.time || "99:99"));
}

const CalendarView = React.memo(
  ({
    appointments = [],
    onDateClick,
    selectedDate,
    t = fallbackT,
    locale = "en-US",
  }: CalendarViewProps) => {
    const today = useMemo(() => new Date(), []);
    const todayStr = useMemo(() => getTodayIso(), []);

    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());

    const isRtl = isHebrewLocale(locale);

    const weekDays = useMemo(() => getWeekDays(locale), [locale]);

    const monthTitle = useMemo(
      () => getMonthTitle(currentYear, currentMonth, locale),
      [currentYear, currentMonth, locale]
    );

    const appointmentsByDay = useMemo(() => {
      const map: Record<string, Appointment[]> = {};

      appointments.forEach((appointment) => {
        const dateKey = normalizeDateKey(appointment?.date);

        if (!dateKey) return;

        if (!map[dateKey]) {
          map[dateKey] = [];
        }

        map[dateKey].push(appointment);
      });

      Object.keys(map).forEach((dateKey) => {
        map[dateKey].sort(sortAppointmentsByTime);
      });

      return map;
    }, [appointments]);

    const cells = useMemo<CalendarCell[]>(() => {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

      return Array.from(
        { length: daysInMonth + firstDayOfWeek },
        (_, index) => {
          if (index < firstDayOfWeek) {
            return {
              type: "empty",
              key: `empty-${index}`,
            };
          }

          const day = index - firstDayOfWeek + 1;

          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          return {
            type: "day",
            key: dateStr,
            day,
            dateStr,
            isToday: dateStr === todayStr,
            isSelected: selectedDate === dateStr,
            appointments: appointmentsByDay[dateStr] || [],
          };
        }
      );
    }, [appointmentsByDay, currentMonth, currentYear, selectedDate, todayStr]);

    const goPrev = () => {
      setCurrentMonth((month) => {
        if (month === 0) {
          setCurrentYear((year) => year - 1);
          return 11;
        }

        return month - 1;
      });
    };

    const goNext = () => {
      setCurrentMonth((month) => {
        if (month === 11) {
          setCurrentYear((year) => year + 1);
          return 0;
        }

        return month + 1;
      });
    };

    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        aria-label={t("dashboard.calendarView.ariaLabel")}
        className="
          overflow-hidden rounded-[24px] border border-slate-200 bg-white
          shadow-[0_12px_35px_rgba(15,23,42,0.05)]
        "
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label={t("dashboard.calendarView.previousMonth")}
            className="
              flex h-9 w-9 items-center justify-center rounded-xl
              border border-slate-200 bg-white text-slate-500
              transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700
            "
          >
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <CalendarDays size={18} />
            </div>

            <h3 className="text-base font-black capitalize text-slate-950">
              {monthTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label={t("dashboard.calendarView.nextMonth")}
            className="
              flex h-9 w-9 items-center justify-center rounded-xl
              border border-slate-200 bg-white text-slate-500
              transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700
            "
          >
            {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-2.5 text-center text-xs font-bold text-slate-500">
          {t("dashboard.calendarView.hint")}
        </div>

        <div className="grid grid-cols-7 border-b border-slate-100 bg-white px-2 py-3">
          {weekDays.map((dayName, index) => (
            <div
              key={`${dayName}-${index}`}
              className="text-center text-[11px] font-black uppercase tracking-wide text-slate-400"
            >
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 p-2.5 sm:gap-2 sm:p-3">
          {cells.map((cell) => {
            if (cell.type === "empty") {
              return (
                <div
                  key={cell.key}
                  className="h-[96px] rounded-xl bg-slate-50/60 sm:h-[118px] xl:h-[128px]"
                />
              );
            }

            const hasEvents = cell.appointments.length > 0;
            const isPurpleMarked = cell.isSelected || cell.isToday;
            const visibleAppointments = cell.appointments.slice(0, 2);
            const hiddenCount =
              cell.appointments.length - visibleAppointments.length;

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => onDateClick?.(cell.dateStr)}
                className={`
                  relative flex h-[96px] flex-col rounded-xl border p-2 text-start
                  transition sm:h-[118px] xl:h-[128px]
                  hover:border-violet-200 hover:bg-violet-50/30
                  ${
                    isPurpleMarked
                      ? "border-violet-200 bg-violet-50/40"
                      : "border-slate-200 bg-white"
                  }
                `}
              >
                <div className="mb-1.5 flex items-start justify-between gap-1">
                  <span
                    className={`
                      flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                      text-xs font-black
                      ${
                        isPurpleMarked
                          ? "bg-violet-600 text-white"
                          : "bg-slate-50 text-slate-700"
                      }
                    `}
                  >
                    {cell.day}
                  </span>

                  {hasEvents && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">
                      {cell.appointments.length}
                    </span>
                  )}
                </div>

                {hasEvents ? (
                  <div className="min-w-0 space-y-1.5">
                    {visibleAppointments.map((appointment, index) => {
                      const colorClass =
                        eventColorClasses[index % eventColorClasses.length];

                      return (
                        <div
                          key={
                            appointment._id ||
                            appointment.id ||
                            `${cell.dateStr}-${appointment.time}-${index}`
                          }
                          className={`
                            min-w-0 rounded-xl border px-2 py-1.5 text-left shadow-sm
                            ${colorClass}
                          `}
                        >
                          <div className="flex min-w-0 items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-black leading-4">
                                {getClientName(appointment)}
                              </p>

                              <p className="truncate text-[10px] font-bold leading-4 opacity-80">
                                {getServiceName(appointment)}
                              </p>
                            </div>

                            {appointment.time && (
                              <span className="hidden shrink-0 items-center gap-1 text-[9px] font-black opacity-70 2xl:inline-flex">
                                <Clock className="h-3 w-3" />
                                {appointment.time}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {hiddenCount > 0 && (
                      <div className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
                        {t("dashboard.calendarView.more", {
                          count: hiddenCount,
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="h-1" />
                )}
              </button>
            );
          })}
        </div>
      </section>
    );
  }
);

CalendarView.displayName = "CalendarView";

export default CalendarView;
