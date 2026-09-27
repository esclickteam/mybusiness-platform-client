import dayjs from "dayjs";
import i18n from "@/i18n/i18n";

import type { DatePreset, DashboardFilters } from "./dashboardOverviewTypes";

export function buildBusinessGreeting(
  businessName?: string,
  options?: { yourBusinessLabel?: string; greetingTemplate?: string }
) {
  const fallbackName = options?.yourBusinessLabel || "your business";
  const name = (businessName || fallbackName).trim();
  const template = options?.greetingTemplate || "Hello, {{name}}!";
  return template.replace("{{name}}", name);
}

export type CalendarAppointment = {
  _id?: string;
  id?: string;
  date: string;
  time?: string;
  serviceName?: string;
  note?: string;
  clientName?: string;
  clientSnapshot?: { name?: string };
  isConfirmed?: boolean;
  status?: string;
};

export function buildUpcomingAppointmentsFromCalendar(
  appointments: CalendarAppointment[] = [],
  limit = 5
) {
  const now = dayjs();
  const weekEnd = now.add(6, "day").endOf("day");

  return [...appointments]
    .filter((appt) => {
      if (String(appt.status || "").toLowerCase() === "completed") {
        return false;
      }

      const dateTime = dayjs(`${appt.date}T${appt.time || "00:00"}`);
      if (!dateTime.isValid()) return false;

      return (
        !dateTime.isBefore(now.startOf("day")) && !dateTime.isAfter(weekEnd)
      );
    })
    .sort((left, right) => {
      const leftValue = dayjs(`${left.date}T${left.time || "00:00"}`).valueOf();
      const rightValue = dayjs(`${right.date}T${right.time || "00:00"}`).valueOf();
      return leftValue - rightValue;
    })
    .slice(0, limit)
    .map((appt) => ({
      id: String(appt._id || appt.id || `${appt.date}-${appt.time}`),
      title: appt.serviceName || appt.note || "Appointment",
      clientName: appt.clientSnapshot?.name || appt.clientName || "",
      date: appt.date,
      time: appt.time || "",
      status: appt.isConfirmed ? "Confirmed" : "Pending",
    }));
}

export function countUpcomingAppointmentsNext7Days(
  appointments: CalendarAppointment[] = []
) {
  return buildUpcomingAppointmentsFromCalendar(appointments, 999).length;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value || 0).toFixed(1)}%`;
}

/** Lead created-at label for the overview table — calendar date (DD/MM/YYYY). */
export function formatLeadDate(value?: string | Date | null): string {
  if (!value) return "—";

  const date = dayjs(value);
  if (!date.isValid()) return "—";

  return date.format("DD/MM/YYYY");
}

export function formatNextAppointmentLabel(
  date?: string,
  time?: string
): string {
  if (!date) return "No upcoming appointments";

  const appointmentDate = dayjs(`${date}T${time || "00:00"}`);
  if (!appointmentDate.isValid()) return "No upcoming appointments";

  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");

  let dayLabel = appointmentDate.format("MMM D, YYYY");
  if (appointmentDate.isSame(today, "day")) dayLabel = "Today";
  if (appointmentDate.isSame(tomorrow, "day")) dayLabel = "Tomorrow";

  const timeLabel = time ? dayjs(`${date}T${time}`).format("h:mm A") : "";
  return timeLabel ? `Next: ${dayLabel}, ${timeLabel}` : `Next: ${dayLabel}`;
}

export function formatLeadSource(source?: string): string {
  const key = String(source || "").toLowerCase();
  const translated: Record<string, string> = {
    meta_lead_ads: "crm.leads.sources.metaLeadAds",
    facebook_lead_ads: "crm.leads.sources.metaLeadAds",
    google_ads: "crm.leads.sources.googleAds",
    website: "crm.leads.sources.website",
    manual: "crm.leads.sources.manual",
  };
  if (translated[key]) return String(i18n.t(translated[key]));

  const map: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    make: "Integration",
  };

  return map[key] || source || String(i18n.t("overview.leadSourceOther", "Other"));
}

export function formatLeadStatus(status?: string): string {
  const key = String(status || "new").toLowerCase();
  const known = ["new", "contacted", "interested", "converted", "lost", "old"];
  return String(i18n.t(`crm.leads.statuses.${known.includes(key) ? key : "new"}`));
}

export function getPresetRange(preset: DatePreset) {
  const now = dayjs();
  let start = now.startOf("day");
  let end = now.endOf("day");

  switch (preset) {
    case "today":
      break;
    case "month":
      start = now.startOf("month");
      end = now.endOf("day");
      break;
    case "year":
      start = now.startOf("year");
      end = now.endOf("day");
      break;
    case "week":
    default:
      start = now.subtract(6, "day").startOf("day");
      end = now.endOf("day");
      break;
  }

  const durationDays = Math.max(end.diff(start, "day"), 0);
  const comparisonEnd = start.subtract(1, "day").endOf("day");
  const comparisonStart = comparisonEnd
    .subtract(durationDays, "day")
    .startOf("day");

  return {
    startDate: start.format("YYYY-MM-DD"),
    endDate: end.format("YYYY-MM-DD"),
    comparisonStartDate: comparisonStart.format("YYYY-MM-DD"),
    comparisonEndDate: comparisonEnd.format("YYYY-MM-DD"),
  };
}

export function buildDefaultFilters(): DashboardFilters {
  const range = getPresetRange("week");

  return {
    preset: "week",
    startDate: range.startDate,
    endDate: range.endDate,
    compareToPrevious: true,
    performanceMetric: "views",
    resolution: "auto",
  };
}

export function formatAppointmentBadge(date?: string) {
  if (!date) {
    return { month: "---", day: "--" };
  }

  const parsed = dayjs(date);
  if (!parsed.isValid()) {
    return { month: "---", day: "--" };
  }

  return {
    month: new Intl.DateTimeFormat(uiLocale(), { month: "short" }).format(parsed.toDate()).toUpperCase(),
    day: parsed.format("D"),
  };
}

function uiLocale() {
  return String(i18n.language || "en");
}

export function formatDateRangeLabel(startDate: string, endDate: string) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) return String(i18n.t("overview.selectRange", "Select range"));

  const full = new Intl.DateTimeFormat(uiLocale(), { month: "short", day: "numeric", year: "numeric" });
  if (start.isSame(end, "day")) return full.format(start.toDate());
  return `${full.format(start.toDate())} – ${full.format(end.toDate())}`;
}

export function getComparisonRange(startDate: string, endDate: string) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const durationDays = Math.max(end.diff(start, "day"), 0);
  const comparisonEnd = start.subtract(1, "day").endOf("day");
  const comparisonStart = comparisonEnd
    .subtract(durationDays, "day")
    .startOf("day");

  return {
    comparisonStartDate: comparisonStart.format("YYYY-MM-DD"),
    comparisonEndDate: comparisonEnd.format("YYYY-MM-DD"),
  };
}

export function getMaxValue(values: number[]) {
  return Math.max(...values, 1);
}
