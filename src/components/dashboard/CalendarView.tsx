"use client";

import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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
    _id?: string;
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
  "border-yellow-100 bg-yellow-50 text-yellow-950",
  "border-pink-100 bg-pink-50 text-pink-950",
  "border-violet-100 bg-violet-50 text-violet-950",
  "border-emerald-100 bg-emerald-50 text-emerald-950",
  "border-blue-100 bg-blue-50 text-blue-950",
  "border-orange-100 bg-orange-50 text-orange-950",
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

function getAppointmentId(appointment: Appointment): string {
  return String(appointment._id || appointment.id || "");
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
    const navigate = useNavigate();
    const { businessId } = useParams<{ businessId: string }>();

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

    const handleAppointmentClick = (
      event: React.MouseEvent<HTMLButtonElement>,
      appointment: Appointment
    ) => {
      event.stopPropagation();

      if (!businessId) return;

      const appointmentId = getAppointmentId(appointment);
      const basePath = `/business/${businessId}/dashboard/crm/appointments`;

      navigate(
        appointmentId
          ? `${basePath}?appointmentId=${appointmentId}`
          : basePath,
        {
          state: {
            appointmentId,
            appointment,
            fromCalendar: true,
          },
        }
      );
    };

    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        aria-label={t("dashboard.calendarView.ariaLabel")}
        className="
          w-full max-w-none overflow-hidden rounded-[24px] border border-slate-200 bg-white
          shadow-[0_12px_35px_rgba(15,23,42,0.05)]
        "
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={goPrev}
            aria-label={t("dashboard.calendarView.previousMonth")}
            className="
              flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
              border border-slate-200 bg-white text-slate-500
              transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700
            "
          >
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className="flex min-w-0 flex-col items-center text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <CalendarDays size={18} />
            </div>

            <h3 className="text-lg font-black capitalize text-slate-950 sm:text-xl">
              {monthTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label={t("dashboard.calendarView.nextMonth")}
            className="
              flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
              border border-slate-200 bg-white text-slate-500
              transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700
            "
          >
            {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3 text-center text-xs font-bold text-slate-500 sm:text-sm">
          {t("dashboard.calendarView.hint")}
        </div>

        <div className="grid w-full grid-cols-7 border-b border-slate-100 bg-white px-2 py-3 sm:px-3">
          {weekDays.map((dayName, index) => (
            <div
              key={`${dayName}-${index}`}
              className="text-center text-[11px] font-black uppercase tracking-wide text-slate-400 sm:text-xs"
            >
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid w-full grid-cols-7 gap-2 p-2.5 sm:gap-2.5 sm:p-4">
          {cells.map((cell) => {
            if (cell.type === "empty") {
              return (
                <div
                  key={cell.key}
                  className="min-h-[118px] rounded-xl bg-slate-50/60 sm:min-h-[145px] xl:min-h-[160px]"
                />
              );
            }

            const hasEvents = cell.appointments.length > 0;
            const isPurpleMarked = cell.isSelected || cell.isToday;
            const visibleAppointments = cell.appointments.slice(0, 3);
            const hiddenCount =
              cell.appointments.length - visibleAppointments.length;

            return (
              <div
                key={cell.key}
                role="button"
                tabIndex={0}
                onClick={() => onDateClick?.(cell.dateStr)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    onDateClick?.(cell.dateStr);
                  }
                }}
                className={`
                  relative flex min-h-[118px] min-w-0 cursor-pointer flex-col rounded-xl border p-2 text-start
                  transition sm:min-h-[145px] sm:p-3 xl:min-h-[160px]
                  hover:border-violet-200 hover:bg-violet-50/30
                  ${
                    isPurpleMarked
                      ? "border-violet-200 bg-violet-50/40"
                      : "border-slate-200 bg-white"
                  }
                `}
              >
                <div className="mb-2 flex items-start justify-between gap-1">
                  <span
                    className={`
                      flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                      text-xs font-black sm:h-9 sm:w-9 sm:text-sm
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
                  <div className="min-w-0 flex-1 space-y-1.5">
                    {visibleAppointments.map((appointment, index) => {
                      const colorClass =
                        eventColorClasses[index % eventColorClasses.length];

                      return (
                        <button
                          key={
                            appointment._id ||
                            appointment.id ||
                            `${cell.dateStr}-${appointment.time}-${index}`
                          }
                          type="button"
                          onClick={(event) =>
                            handleAppointmentClick(event, appointment)
                          }
                          className={`
                            w-full min-w-0 rounded-xl border px-3 py-2 text-left shadow-sm
                            transition hover:-translate-y-0.5 hover:shadow-md
                            ${colorClass}
                          `}
                          title="Open appointment in CRM"
                        >
                          {appointment.time && (
                            <p className="truncate text-[10px] font-black leading-4 opacity-85 sm:text-[11px]">
                              {appointment.time}
                            </p>
                          )}

                          <p className="truncate text-[11px] font-black leading-4 sm:text-xs">
                            {getClientName(appointment)}
                          </p>

                          <p className="truncate text-[10px] font-bold leading-4 opacity-85 sm:text-[11px]">
                            {getServiceName(appointment)}
                          </p>
                        </button>
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
              </div>
            );
          })}
        </div>
      </section>
    );
  }
);

CalendarView.displayName = "CalendarView";

export default CalendarView;
