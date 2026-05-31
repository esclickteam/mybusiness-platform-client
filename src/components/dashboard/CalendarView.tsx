import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

type TranslationValues = Record<string, string | number>;

type TFunction = (key: string, values?: TranslationValues) => string;

type Appointment = {
  _id?: string;
  id?: string;
  date?: string;
  time?: string;
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
  const baseSunday = new Date(2024, 0, 7);

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

    const appointmentsByDay = useMemo(() => {
      const map: Record<string, Appointment[]> = {};

      appointments.forEach((appointment) => {
        if (!appointment?.date) return;

        if (!map[appointment.date]) {
          map[appointment.date] = [];
        }

        map[appointment.date].push(appointment);
      });

      return map;
    }, [appointments]);

    const cells = useMemo<CalendarCell[]>(() => {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

      return Array.from({ length: daysInMonth + firstDayOfWeek }, (_, index) => {
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
          count: appointmentsByDay[dateStr]?.length || 0,
        };
      });
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
                  className="h-[58px] rounded-xl bg-slate-50/60 sm:h-[68px]"
                />
              );
            }

            const hasEvents = cell.count > 0;

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => onDateClick?.(cell.dateStr)}
                className={`
                  relative flex h-[58px] flex-col justify-between rounded-xl
                  border p-2 text-start sm:h-[68px]
                  ${
                    cell.isSelected
                      ? "border-violet-300 bg-white shadow-[0_8px_20px_rgba(124,58,237,0.08)]"
                      : "border-slate-200 bg-white"
                  }
                  ${cell.isToday ? "border-violet-300" : ""}
                `}
              >
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={`
                      flex h-7 w-7 items-center justify-center rounded-lg
                      text-xs font-black
                      ${
                        cell.isSelected || cell.isToday
                          ? "bg-violet-50 text-violet-700"
                          : "bg-slate-50 text-slate-700"
                      }
                    `}
                  >
                    {cell.day}
                  </span>

                  {cell.isToday && (
                    <span
                      aria-label={t("dashboard.calendarView.today")}
                      title={t("dashboard.calendarView.today")}
                      className="mt-1 h-2 w-2 rounded-full bg-violet-500"
                    />
                  )}
                </div>

                {hasEvents ? (
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-1">
                      {Array.from({ length: Math.min(cell.count, 3) }).map(
                        (_, index) => (
                          <span
                            key={index}
                            className="h-1.5 w-1.5 rounded-full bg-violet-500"
                          />
                        )
                      )}
                    </div>

                    <p className="truncate text-[10px] font-bold text-violet-700">
                      {t(
                        cell.count === 1
                          ? "dashboard.calendarView.appointment"
                          : "dashboard.calendarView.appointments",
                        { count: cell.count }
                      )}
                    </p>
                  </div>
                ) : (
                  <span className="h-1" />
                )}

                {cell.isSelected && (
                  <span className="absolute bottom-2 left-2 right-2 h-[3px] rounded-full bg-violet-300" />
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