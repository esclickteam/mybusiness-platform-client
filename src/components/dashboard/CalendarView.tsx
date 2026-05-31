import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

type TranslationValues = Record<string, string | number>;

type TFunction = (key: string, values?: TranslationValues) => string;

type Appointment = {
  _id?: string;
  id?: string;
  date?: string; // YYYY-MM-DD
  time?: string;
  [key: string]: any;
};

type CalendarCell =
  | {
      day: null;
      dateStr?: never;
      isToday?: never;
      count?: never;
    }
  | {
      day: number;
      dateStr: string;
      isToday: boolean;
      count: number;
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
    "dashboard.calendarView.today": "Today",
    "dashboard.calendarView.selected": "Selected",
    "dashboard.calendarView.appointment": "{{count}} appointment",
    "dashboard.calendarView.appointments": "{{count}} appointments",
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
  return locale === "he" || locale === "he-IL";
}

function getTodayIso(): string {
  return new Date().toLocaleDateString("en-CA");
}

function getMonthTitle(year: number, month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

function getWeekDays(locale: string): string[] {
  const baseSunday = new Date(2024, 0, 7); // Sunday

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseSunday);
    date.setDate(baseSunday.getDate() + index);

    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
    }).format(date);
  });
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

    const weekDays = useMemo(() => {
      return getWeekDays(locale);
    }, [locale]);

    const monthTitle = useMemo(() => {
      return getMonthTitle(currentYear, currentMonth, locale);
    }, [currentYear, currentMonth, locale]);

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

    const appointmentsByDay = useMemo(() => {
      const map: Record<string, Appointment[]> = {};

      appointments.forEach((appointment) => {
        if (!appointment?.date) return;

        const dateKey = appointment.date;

        if (!map[dateKey]) {
          map[dateKey] = [];
        }

        map[dateKey].push(appointment);
      });

      return map;
    }, [appointments]);

    const cells = useMemo<CalendarCell[]>(() => {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

      return Array.from(
        { length: daysInMonth + firstDayOfWeek },
        (_, index): CalendarCell => {
          if (index < firstDayOfWeek) {
            return { day: null };
          }

          const day = index - firstDayOfWeek + 1;

          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          return {
            day,
            dateStr,
            isToday: dateStr === todayStr,
            count: appointmentsByDay[dateStr]?.length || 0,
          };
        }
      );
    }, [appointmentsByDay, currentMonth, currentYear, todayStr]);

    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        aria-label={t("dashboard.calendarView.ariaLabel")}
        className="
          overflow-hidden rounded-3xl border border-slate-200/70 bg-white
          shadow-[0_18px_50px_rgba(15,23,42,0.06)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label={t("dashboard.calendarView.previousMonth")}
            className="
              flex h-10 w-10 items-center justify-center rounded-2xl
              border border-slate-200 bg-white text-slate-700 shadow-sm
              transition hover:border-violet-200 hover:bg-violet-50
              hover:text-violet-700
            "
          >
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className="text-center">
            <div className="mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
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
              flex h-10 w-10 items-center justify-center rounded-2xl
              border border-slate-200 bg-white text-slate-700 shadow-sm
              transition hover:border-violet-200 hover:bg-violet-50
              hover:text-violet-700
            "
          >
            {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Hint */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-center text-xs font-semibold text-slate-500">
          {t("dashboard.calendarView.hint")}
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-white px-3 py-3">
          {weekDays.map((dayName, index) => (
            <div
              key={`${dayName}-${index}`}
              className="text-center text-[11px] font-black uppercase tracking-wide text-slate-400"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-2 p-3 sm:p-4">
          {cells.map((cell, index) => {
            if (!cell.day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-[84px] rounded-2xl bg-slate-50/50"
                />
              );
            }

            const isSelected = selectedDate === cell.dateStr;
            const hasEvents = cell.count > 0;

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() => onDateClick?.(cell.dateStr)}
                className={`
                  group relative min-h-[84px] rounded-2xl border p-2 text-start
                  transition duration-200 hover:-translate-y-0.5
                  hover:border-violet-200 hover:bg-violet-50/70
                  hover:shadow-[0_12px_30px_rgba(88,28,135,0.10)]
                  ${
                    isSelected
                      ? "border-violet-300 bg-violet-50 shadow-[0_14px_32px_rgba(109,40,217,0.14)]"
                      : "border-slate-200 bg-white"
                  }
                  ${cell.isToday ? "ring-2 ring-violet-200" : ""}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-xl
                      text-sm font-black
                      ${
                        isSelected
                          ? "bg-violet-600 text-white"
                          : cell.isToday
                            ? "bg-violet-100 text-violet-700"
                            : "bg-slate-50 text-slate-700"
                      }
                    `}
                  >
                    {cell.day}
                  </span>

                  {cell.isToday && (
                    <span className="hidden rounded-full bg-violet-100 px-2 py-1 text-[10px] font-bold text-violet-700 sm:inline-flex">
                      {t("dashboard.calendarView.today")}
                    </span>
                  )}
                </div>

                {hasEvents && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center gap-1">
                      {Array.from({ length: Math.min(cell.count, 3) }).map(
                        (_, dotIndex) => (
                          <span
                            key={dotIndex}
                            className="h-1.5 w-1.5 rounded-full bg-violet-500"
                          />
                        )
                      )}
                    </div>

                    <p className="line-clamp-2 text-[11px] font-bold leading-4 text-violet-700">
                      {t(
                        cell.count === 1
                          ? "dashboard.calendarView.appointment"
                          : "dashboard.calendarView.appointments",
                        { count: cell.count }
                      )}
                    </p>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute inset-x-3 bottom-2 h-1 rounded-full bg-violet-500" />
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