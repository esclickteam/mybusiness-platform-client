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
  ArrowRight,
  Sparkles,
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
  id?: string;
  date?: string;
  time?: string;
  serviceName?: string;

  clientSnapshot?: ClientSnapshot;
  client?: Client;

  clientName?: string;
  clientEmail?: string;
  email?: string;
  status?: string;
};

type DailyAgendaProps = {
  date: string;
  appointments?: Appointment[];
  businessName?: string;
  businessId?: string;
  t?: TFunction;
  locale?: string;
};

/* =====================================================
   Fallback Translation
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
   Utils
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

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "C";

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
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
          relative h-full overflow-hidden rounded-[28px] border border-violet-100/80
          bg-white shadow-[0_20px_55px_rgba(88,28,135,0.08)]
        "
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-fuchsia-200/30 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 border-b border-slate-100/80 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="
                  flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
                  bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white
                  shadow-[0_16px_32px_rgba(124,58,237,0.28)]
                "
              >
                <CalendarDays size={21} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black tracking-tight text-slate-950">
                    {t("dashboard.dailyAgenda.upcomingAppointments")}
                  </h3>

                  {dayAppointments.length > 0 && (
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-black text-violet-700">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {displayDate}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={editAppointment}
              disabled={!businessId}
              className="
                inline-flex shrink-0 items-center gap-1.5 rounded-2xl border
                border-violet-100 bg-violet-50 px-3 py-2 text-xs font-black
                text-violet-700 transition hover:-translate-y-0.5
                hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40
              "
            >
              {t("dashboard.dailyAgenda.viewCalendar")}
              <ArrowRight
                size={14}
                className={isRtl ? "rotate-180" : ""}
              />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10">
          {dayAppointments.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
              <div
                className="
                  mb-4 flex h-16 w-16 items-center justify-center rounded-3xl
                  border border-violet-100 bg-violet-50 text-violet-600
                "
              >
                <Inbox size={27} />
              </div>

              <h4 className="text-sm font-black text-slate-950">
                {t("dashboard.dailyAgenda.noAppointments")}
              </h4>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                {t("dashboard.dailyAgenda.noAppointmentsDescription")}
              </p>
            </div>
          ) : (
            <ul className="space-y-3 p-4">
              {dayAppointments.map((appointment, index) => {
                const uniqueId =
                  appointment._id ||
                  appointment.id ||
                  `${appointment.date}-${appointment.time}-${index}`;

                const appointmentDate = getValidDate(appointment.date);
                const time = appointment.time || "--:--";
                const clientName = getClientName(appointment);
                const serviceName =
                  appointment.serviceName ||
                  t("dashboard.dailyAgenda.service");

                const email = getClientEmail(appointment);
                const isEmailMenuOpen = emailMenuOpenId === uniqueId;

                return (
                  <li
                    key={uniqueId}
                    className="
                      group relative overflow-visible rounded-[24px] border border-slate-200/80
                      bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]
                      transition duration-300 hover:-translate-y-0.5
                      hover:border-violet-200 hover:shadow-[0_18px_42px_rgba(124,58,237,0.12)]
                    "
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className="
                            flex h-16 w-16 shrink-0 flex-col items-center justify-center
                            rounded-[22px] border border-violet-100 bg-gradient-to-br
                            from-violet-50 to-fuchsia-50 text-violet-700
                          "
                        >
                          <span className="text-[10px] font-black uppercase tracking-wide">
                            {appointmentDate
                              ? appointmentDate.toLocaleDateString(locale, {
                                  month: "short",
                                })
                              : "--"}
                          </span>

                          <span className="mt-0.5 text-xl font-black leading-none">
                            {appointmentDate
                              ? appointmentDate.toLocaleDateString(locale, {
                                  day: "2-digit",
                                })
                              : "--"}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                              className="
                                inline-flex items-center gap-1.5 rounded-full bg-slate-100
                                px-2.5 py-1 text-xs font-black text-slate-600
                              "
                            >
                              <Clock size={13} />
                              {time}
                            </span>

                            <span
                              className="
                                inline-flex items-center gap-1.5 rounded-full bg-emerald-50
                                px-2.5 py-1 text-xs font-black text-emerald-700
                              "
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {t("dashboard.dailyAgenda.confirmed")}
                            </span>
                          </div>

                          <h4 className="truncate text-sm font-black text-slate-950">
                            {serviceName}
                          </h4>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className="
                                  flex h-6 w-6 items-center justify-center rounded-full
                                  bg-violet-100 text-[10px] font-black text-violet-700
                                "
                              >
                                {getInitials(clientName)}
                              </span>
                              {clientName}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase size={13} />
                              {businessName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex shrink-0 flex-wrap items-center gap-2 xl:justify-end">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setEmailMenuOpenId(
                                isEmailMenuOpen ? null : uniqueId
                              )
                            }
                            className="
                              inline-flex items-center gap-2 rounded-2xl border
                              border-slate-200 bg-white px-3.5 py-2.5 text-xs
                              font-black text-slate-700 shadow-sm transition
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
                                absolute top-12 z-50 w-44 overflow-hidden rounded-2xl
                                border border-slate-200 bg-white p-1.5
                                shadow-[0_22px_48px_rgba(15,23,42,0.18)]
                                ${isRtl ? "left-0" : "right-0"}
                              `}
                            >
                              {(["gmail", "outlook", "default"] as EmailProvider[]).map(
                                (provider) => (
                                  <button
                                    key={provider}
                                    type="button"
                                    onClick={() =>
                                      sendEmailReminder({
                                        provider,
                                        email,
                                        clientName,
                                        appointmentDate: appointment.date,
                                        time,
                                        service: serviceName,
                                      })
                                    }
                                    className="
                                      w-full rounded-xl px-3 py-2.5 text-start text-sm
                                      font-bold capitalize text-slate-700 transition
                                      hover:bg-violet-50 hover:text-violet-700
                                    "
                                  >
                                    {provider}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={editAppointment}
                          disabled={!businessId}
                          className="
                            inline-flex items-center gap-2 rounded-2xl bg-slate-950
                            px-3.5 py-2.5 text-xs font-black text-white
                            shadow-[0_14px_28px_rgba(15,23,42,0.18)]
                            transition hover:-translate-y-0.5 hover:bg-violet-700
                            disabled:cursor-not-allowed disabled:opacity-40
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
        </div>

        {/* Footer */}
        {dayAppointments.length > 0 && (
          <div className="relative z-10 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={editAppointment}
              disabled={!businessId}
              className="
                group inline-flex items-center gap-2 rounded-2xl bg-violet-600
                px-4 py-3 text-xs font-black text-white
                shadow-[0_14px_30px_rgba(124,58,237,0.24)]
                transition hover:-translate-y-0.5 hover:bg-violet-700
                disabled:cursor-not-allowed disabled:opacity-40
              "
            >
              <Sparkles size={14} />
              {t("dashboard.dailyAgenda.viewAllAppointments")}
              <ArrowRight
                size={14}
                className={`transition group-hover:translate-x-0.5 ${
                  isRtl ? "rotate-180 group-hover:-translate-x-0.5" : ""
                }`}
              />
            </button>
          </div>
        )}
      </section>
    );
  }
);

DailyAgenda.displayName = "DailyAgenda";

export default DailyAgenda;