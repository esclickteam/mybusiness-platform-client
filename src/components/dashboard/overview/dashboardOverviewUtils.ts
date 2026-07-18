import dayjs from "dayjs";

import type { DatePreset, DashboardFilters } from "./dashboardOverviewTypes";

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value || 0).toFixed(1)}%`;
}

export function formatRelativeTime(value?: string | Date | null): string {
  if (!value) return "—";

  const date = dayjs(value);
  if (!date.isValid()) return "—";

  const now = dayjs();
  const diffMinutes = now.diff(date, "minute");

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = now.diff(date, "hour");
  if (diffHours < 24) return `${diffHours}h ago`;

  if (now.subtract(1, "day").isSame(date, "day")) return "Yesterday";

  return date.format("MMM D");
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
  const map: Record<string, string> = {
    meta_lead_ads: "Meta Lead Ads",
    facebook: "Facebook",
    instagram: "Instagram",
    website: "Website",
    whatsapp: "WhatsApp",
    manual: "Manual",
    make: "Integration",
    other: "Other",
  };

  return map[String(source || "").toLowerCase()] || source || "Other";
}

export function formatLeadStatus(status?: string): string {
  const map: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    interested: "Interested",
    converted: "Converted",
    lost: "Lost",
  };

  return map[String(status || "new").toLowerCase()] || "New";
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

export function formatDateRangeLabel(startDate: string, endDate: string) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) return "Select range";

  if (start.isSame(end, "day")) {
    return start.format("MMM D, YYYY");
  }

  if (start.isSame(end, "year")) {
    return `${start.format("MMM D")} – ${end.format("MMM D, YYYY")}`;
  }

  return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`;
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
