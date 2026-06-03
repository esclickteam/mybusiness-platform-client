import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  User,
  Briefcase,
  Mail,
  Settings,
  ChevronDown,
  Inbox,
} from "lucide-react";

/* =====================================================
   Types
===================================================== */

type EmailProvider = "gmail" | "outlook" | "default";

type TranslationValues = Record<string, string | number>;

type TFunction = (key: string, values?: TranslationValues) => string;

type ClientSnapshot = {
  name?: string;
  email?: string;
};

type Client = {
  name?: string;
  email?: string;
};

type Appointment = {
  _id?: string;
  date?: string; // expected YYYY-MM-DD
  time?: string; // expected HH:mm
  serviceName?: string;

  clientSnapshot?: ClientSnapshot;
  client?: Client;

  clientName?: string;
  clientEmail?: string;
  email?: string;
};

type DailyAgendaProps = {
  date: string; // expected YYYY-MM-DD
  appointments?: Appointment[];
  businessName?: string;
  businessId?: string;

  // חדש: תמיכה בתרגומים
  t?: TFunction;
  locale?: string;
};

/* =====================================================
   Fallback Translation
   אם לא העברת t מבחוץ, הקומפוננטה עדיין תעבוד באנגלית
===================================================== */

const fallbackT: TFunction = (key, values) => {
  const dictionary: Record<string, string> = {
    "dashboard.dailyAgenda.upcomingAppointments": "Upcoming Appointments",
    "dashboard.dailyAgenda.viewCalendar": "View Calendar",
    "dashboard.dailyAgenda.noAppointments": "No appointments on this date",
    "dashboard.dailyAgenda.noAppointmentsDescription":
      "When clients book appointments for this day, they will appear here.",
    "dashboard.dailyAgenda.confirmed": "Confirmed",
    "dashboard.dailyAgenda.email": "Email",
    "dashboard.dailyAgenda.manage": "Manage",
    "dashboard.dailyAgenda.viewAllAppointments": "View all appointments",
    "dashboard.dailyAgenda.service": "Service",
    "dashboard.dailyAgenda.clientEmailMissing": "Client email is not available",
    "dashboard.dailyAgenda.appointmentReminderSubject":
      "Appointment Reminder – {{businessName}}",
    "dashboard.dailyAgenda.appointmentReminderBody":
      "Hi {{clientName}},\n\nThis is a friendly reminder about your upcoming appointment.\n\nDate: {{date}}\nTime: {{time}}\nService: {{service}}\n\nBest regards,\n{{businessName}}",
  };

  let text = dictionary[key] || key;

  if (values) {
    Object.entries(values).forEach(([valueKey, value]) => {
      text = text.split(`{{${valueKey}}}`).join(String(value));
    });
  }

  return text;
};

/* =====================================================
   Utils – Single Source of Truth
===================================================== */

function getClientName(appointment: Appointment): string {
  return (
    appointment?.clientSnapshot?.name ||
    appointment?.client?.name ||
    appointment?.clientName ||
    "Client"
  );
}

function getClientEmail(appointment: Appointment): string {
  return (
    appointment?.clientSnapshot?.email ||
    appointment?.client?.email ||
    appointment?.clientEmail ||
    appointment?.email ||
    ""
  );
}

function isHebrewLocale(locale: string): boolean {
  return locale === "he" || locale === "he-IL";
}

function getValidDate(date?: string): Date | null {
  if (!date) return null;

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function formatDisplayDate(date?: string, locale = "en-US"): string {
  const parsedDate = getValidDate(date);

  if (!parsedDate) {
    return locale.startsWith("he") ? "לא זמין" : "Unavailable";
  }

  return parsedDate.toLocaleDateString(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEmailDate(date?: string, locale = "en-US"): string {
  const parsedDate = getValidDate(date);

  if (!parsedDate) {
    return locale.startsWith("he") ? "לא זמין" : "Unavailable";
  }

  return parsedDate.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* =====================================================
   Component
===================================================== */

const DailyAgenda = React.memo(
  ({
    date,
    appointments = [],
    businessName = "Your Business",
    businessId,
    t = fallbackT,
    locale = "en-US",
  }: DailyAgendaProps) => {
    const navigate = useNavigate();
    const [emailMenuOpenId, setEmailMenuOpenId] = useState<string | null>(null);

    const isRtl = isHebrewLocale(locale);

    const selectedDate = useMemo(() => {
      if (typeof date === "string" && date.length === 10) {
        return date;
      }

      return null;
    }, [date]);

    const displayDate = useMemo(() => {
      return formatDisplayDate(date, locale);
    }, [date, locale]);

    const dayAppointments = useMemo(() => {
      if (!selectedDate) return [];

      return appointments
        .filter((appointment) => appointment?.date === selectedDate)
        .sort((a, b) =>
          (a?.time || "00:00").localeCompare(b?.time || "00:00")
        );
    }, [appointments, selectedDate]);

    const sendEmailReminder = ({
      provider,
      email,
      clientName,
      appointmentDate,
      time,
      service,
    }: {
      provider: EmailProvider;
      email: string;
      clientName: string;
      appointmentDate?: string;
      time: string;
      service: string;
    }) => {
      if (!email) {
        alert(t("dashboard.dailyAgenda.clientEmailMissing"));
        return;
      }

      const formattedDate = formatEmailDate(appointmentDate, locale);

      const subject = t("dashboard.dailyAgenda.appointmentReminderSubject", {
        businessName,
      });

      const body = t("dashboard.dailyAgenda.appointmentReminderBody", {
        clientName,
        date: formattedDate,
        time,
        service,
        businessName,
      });

      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);
      const encodedEmail = encodeURIComponent(email);

      if (provider === "gmail") {
        window.open(
          `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}&body=${encodedBody}`,
          "_blank",
          "noopener,noreferrer"
        );
      }

      if (provider === "outlook") {
        window.open(
          `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail}&subject=${encodedSubject}&body=${encodedBody}`,
          "_blank",
          "noopener,noreferrer"
        );
      }

      if (provider === "default") {
        window.location.href = `mailto:${encodedEmail}?subject=${encodedSubject}&body=${encodedBody}`;
      }

      setEmailMenuOpenId(null);
    };

    const editAppointment = () => {
      if (!businessId) return;
      navigate(`/business/${businessId}/dashboard/crm/appointments`);
    };

    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        className="
          relative overflow-hidden rounded-3xl border border-slate-200/70
          bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <CalendarDays size={18} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-950">
                {t("dashboard.dailyAgenda.upcomingAppointments")}
              </h3>

              <p className="text-xs font-medium text-slate-500">
                {displayDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={editAppointment}
            disabled={!businessId}
            className="
              rounded-xl px-3 py-2 text-xs font-semibold text-violet-600
              transition hover:bg-violet-50 disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {t("dashboard.dailyAgenda.viewCalendar")}
          </button>
        </div>

        {/* Body */}
        {dayAppointments.length === 0 ? (
          <div className="flex min-h-[210px] flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Inbox size={24} />
            </div>

            <h4 className="text-sm font-bold text-slate-900">
              {t("dashboard.dailyAgenda.noAppointments")}
            </h4>

            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
              {t("dashboard.dailyAgenda.noAppointmentsDescription")}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {dayAppointments.map((appointment) => {
              if (!appointment?._id) return null;

              const appointmentDate = getValidDate(appointment.date);
              const time = appointment.time || "--:--";
              const clientName = getClientName(appointment);
              const serviceName =
                appointment.serviceName ||
                t("dashboard.dailyAgenda.service");

              const email = getClientEmail(appointment);
              const isEmailMenuOpen = emailMenuOpenId === appointment._id;

              return (
                <li
                  key={appointment._id}
                  className="
                    group relative px-5 py-4 transition
                    hover:bg-slate-50/80
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className="
                          flex h-14 w-14 shrink-0 flex-col items-center
                          justify-center rounded-2xl border border-violet-100
                          bg-violet-50 text-violet-700
                        "
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          {appointmentDate
                            ? appointmentDate.toLocaleDateString(locale, {
                                month: "short",
                              })
                            : "--"}
                        </span>

                        <span className="text-lg font-black leading-none">
                          {appointmentDate
                            ? appointmentDate.toLocaleDateString(locale, {
                                day: "2-digit",
                              })
                            : "--"}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <Clock size={14} />
                          <span>{time}</span>
                        </div>

                        <h4 className="truncate text-sm font-bold text-slate-950">
                          {serviceName}
                        </h4>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <User size={13} />
                            {clientName}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <Briefcase size={13} />
                            {businessName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="hidden items-center gap-2 xl:flex">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold text-slate-600">
                        {t("dashboard.dailyAgenda.confirmed")}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="relative flex shrink-0 items-center gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setEmailMenuOpenId(
                              isEmailMenuOpen ? null : appointment._id || null
                            )
                          }
                          className="
                            inline-flex items-center gap-2 rounded-xl border
                            border-slate-200 bg-white px-3 py-2 text-xs
                            font-semibold text-slate-700 shadow-sm transition
                            hover:border-violet-200 hover:bg-violet-50
                            hover:text-violet-700
                          "
                        >
                          <Mail size={14} />
                          {t("dashboard.dailyAgenda.email")}
                          <ChevronDown
                            size={14}
                            className={`transition ${
                              isEmailMenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isEmailMenuOpen && (
                          <div
                            className={`
                              absolute top-11 z-30 w-40 overflow-hidden
                              rounded-2xl border border-slate-200 bg-white
                              p-1 shadow-[0_18px_40px_rgba(15,23,42,0.14)]
                              ${isRtl ? "left-0" : "right-0"}
                            `}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                sendEmailReminder({
                                  provider: "gmail",
                                  email,
                                  clientName,
                                  appointmentDate: appointment.date,
                                  time,
                                  service: serviceName,
                                })
                              }
                              className="
                                w-full rounded-xl px-3 py-2 text-start text-sm
                                font-medium text-slate-700 transition
                                hover:bg-violet-50 hover:text-violet-700
                              "
                            >
                              Gmail
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                sendEmailReminder({
                                  provider: "outlook",
                                  email,
                                  clientName,
                                  appointmentDate: appointment.date,
                                  time,
                                  service: serviceName,
                                })
                              }
                              className="
                                w-full rounded-xl px-3 py-2 text-start text-sm
                                font-medium text-slate-700 transition
                                hover:bg-violet-50 hover:text-violet-700
                              "
                            >
                              Outlook
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                sendEmailReminder({
                                  provider: "default",
                                  email,
                                  clientName,
                                  appointmentDate: appointment.date,
                                  time,
                                  service: serviceName,
                                })
                              }
                              className="
                                w-full rounded-xl px-3 py-2 text-start text-sm
                                font-medium text-slate-700 transition
                                hover:bg-violet-50 hover:text-violet-700
                              "
                            >
                              Default
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={editAppointment}
                        disabled={!businessId}
                        className="
                          inline-flex items-center gap-2 rounded-xl bg-slate-950
                          px-3 py-2 text-xs font-semibold text-white shadow-sm
                          transition hover:bg-violet-700 disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        <Settings size={14} />
                        {t("dashboard.dailyAgenda.manage")}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer */}
        {dayAppointments.length > 0 && (
          <div
            className={`flex border-t border-slate-100 px-5 py-3 ${
              isRtl ? "justify-start" : "justify-end"
            }`}
          >
            <button
              type="button"
              onClick={editAppointment}
              disabled={!businessId}
              className="
                text-xs font-bold text-violet-600 transition
                hover:text-violet-800 disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {t("dashboard.dailyAgenda.viewAllAppointments")}{" "}
              {isRtl ? "←" : "→"}
            </button>
          </div>
        )}
      </section>
    );
  }
);

DailyAgenda.displayName = "DailyAgenda";

export default DailyAgenda;