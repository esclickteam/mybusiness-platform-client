/**
 * Client schedule helpers — mirror server scheduleService estimates.
 * Min interval: 5 minutes. Default timezone: Asia/Jerusalem.
 */

import {
  estimateMaxPathActionCost,
  type EstimateGraphEdge,
  type EstimateGraphNode,
} from "./automationActionCost";
import {
  AUTOMATION_PLAN_DEFINITIONS,
  type AutomationPlanDefinition,
} from "./billing/automationPlanCatalog";

export const MIN_INTERVAL_MINUTES = 5;
export const DEFAULT_TIMEZONE = "Asia/Jerusalem";

export const SCHEDULE_FREQUENCIES = [
  "every_minutes",
  "every_hours",
  "daily",
  "weekly",
] as const;

export type ScheduleFrequency = (typeof SCHEDULE_FREQUENCIES)[number];

export type ScheduleActiveHours = {
  start: string;
  end: string;
};

export type AutomationScheduleConfig = {
  frequency: ScheduleFrequency;
  interval: number;
  timeOfDay: string;
  weekdays: number[];
  activeHours: ScheduleActiveHours | null;
  timezone: string;
};

const MONTH_DAYS = 30;
const FREQUENCIES = new Set<string>(SCHEDULE_FREQUENCIES);

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function parseHhMm(
  raw: unknown
): { hours: number; minutes: number; label: string } | null {
  const m = String(raw || "")
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return {
    hours: h,
    minutes: min,
    label: `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
  };
}

export function isValidIanaTimezone(tz: unknown): boolean {
  try {
    Intl.DateTimeFormat("en-US", { timeZone: String(tz || "") });
    return Boolean(tz);
  } catch {
    return false;
  }
}

export function resolveTimezone(raw?: unknown): string {
  const tz = String(raw || "").trim() || DEFAULT_TIMEZONE;
  return isValidIanaTimezone(tz) ? tz : DEFAULT_TIMEZONE;
}

export function normalizeScheduleConfig(
  raw:
    | Partial<AutomationScheduleConfig>
    | Record<string, unknown>
    | null
    | undefined,
  opts: { timezone?: string } = {}
): AutomationScheduleConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const frequency = String((raw as { frequency?: string }).frequency || "").trim();
  if (!FREQUENCIES.has(frequency)) return null;

  const tz = resolveTimezone(
    (raw as { timezone?: string }).timezone || opts.timezone
  );
  let interval = 1;
  if (frequency === "every_minutes") {
    interval = clampInt(
      (raw as { interval?: unknown }).interval,
      MIN_INTERVAL_MINUTES,
      24 * 60,
      15
    );
  } else if (frequency === "every_hours") {
    interval = clampInt((raw as { interval?: unknown }).interval, 1, 24, 1);
    if (interval * 60 < MIN_INTERVAL_MINUTES) interval = 1;
  }

  const timeOfDay =
    parseHhMm((raw as { timeOfDay?: unknown }).timeOfDay) || parseHhMm("09:00");

  let weekdays = Array.isArray((raw as { weekdays?: unknown }).weekdays)
    ? [
        ...new Set(
          ((raw as { weekdays: unknown[] }).weekdays || [])
            .map((d) => clampInt(d, 0, 6, -1))
            .filter((d) => d >= 0)
        ),
      ].sort((a, b) => a - b)
    : [];
  if (frequency === "weekly" && !weekdays.length) {
    weekdays = [0, 1, 2, 3, 4, 5, 6];
  }

  let activeHours: ScheduleActiveHours | null = null;
  const rawActive = (raw as { activeHours?: { start?: unknown; end?: unknown } })
    .activeHours;
  if (rawActive && typeof rawActive === "object") {
    const start = parseHhMm(rawActive.start);
    const end = parseHhMm(rawActive.end);
    if (start && end) activeHours = { start: start.label, end: end.label };
  }

  return {
    frequency: frequency as ScheduleFrequency,
    interval,
    timeOfDay: timeOfDay!.label,
    weekdays:
      frequency === "weekly" ? weekdays : weekdays.length ? weekdays : [],
    activeHours,
    timezone: tz,
  };
}

function hydrateActiveHours(config: AutomationScheduleConfig | null) {
  if (!config?.activeHours) return null;
  const start = parseHhMm(config.activeHours.start);
  const end = parseHhMm(config.activeHours.end);
  if (!start || !end) return null;
  return { start, end };
}

/** Average runs per 30-day month from schedule frequency (builder estimate). */
export function estimateRunsPerMonth(
  config: AutomationScheduleConfig | null | undefined
): number {
  if (!config) return 0;
  const active = hydrateActiveHours(config);
  let activeFraction = 1;
  if (active) {
    const start = active.start.hours * 60 + active.start.minutes;
    const end = active.end.hours * 60 + active.end.minutes;
    let minutes = end > start ? end - start : 24 * 60 - start + end;
    if (minutes <= 0) minutes = 24 * 60;
    activeFraction = minutes / (24 * 60);
  }

  const weekdays =
    Array.isArray(config.weekdays) && config.weekdays.length
      ? config.weekdays.length
      : 7;
  const weekdayFraction = weekdays / 7;

  if (config.frequency === "every_minutes") {
    const perDay = (24 * 60) / config.interval;
    return Math.round(perDay * MONTH_DAYS * activeFraction * weekdayFraction);
  }
  if (config.frequency === "every_hours") {
    const perDay = 24 / config.interval;
    return Math.round(perDay * MONTH_DAYS * activeFraction * weekdayFraction);
  }
  if (config.frequency === "daily") {
    return Math.round(MONTH_DAYS * weekdayFraction);
  }
  if (config.frequency === "weekly") {
    return Math.round((MONTH_DAYS / 7) * weekdays);
  }
  return 0;
}

export type MonthlyActionEstimate = {
  actionsPerRun: number;
  runsPerMonth: number;
  actionsPerMonth: number;
  actionsPerHour: number | null;
  actionsPerDay: number | null;
};

export function estimateMonthlyActions(opts: {
  nodes?: EstimateGraphNode[];
  edges?: EstimateGraphEdge[];
  schedule?: AutomationScheduleConfig | null;
  actionsPerRun?: number | null;
} = {}): MonthlyActionEstimate {
  const { nodes = [], edges = [], schedule = null, actionsPerRun = null } = opts;
  const perRun =
    actionsPerRun != null
      ? Math.max(0, Number(actionsPerRun) || 0)
      : estimateMaxPathActionCost(nodes, edges);
  const runs = estimateRunsPerMonth(schedule);
  return {
    actionsPerRun: perRun,
    runsPerMonth: runs,
    actionsPerMonth: perRun * runs,
    actionsPerHour:
      schedule?.frequency === "every_minutes"
        ? Math.round((perRun * 60) / schedule.interval)
        : schedule?.frequency === "every_hours"
          ? Math.round(perRun / schedule.interval)
          : null,
    actionsPerDay:
      schedule?.frequency === "every_minutes"
        ? Math.round((perRun * 24 * 60) / schedule.interval)
        : schedule?.frequency === "every_hours"
          ? Math.round((perRun * 24) / schedule.interval)
          : schedule?.frequency === "daily"
            ? perRun
            : schedule?.frequency === "weekly"
              ? null
              : null,
  };
}

export type PlanRecommendation = {
  plan: AutomationPlanDefinition | null;
  fits: boolean;
  exceedsAll: boolean;
};

/** Recommend the cheapest plan that covers estimated monthly actions. No auto-upgrade. */
export function recommendPlanForActions(
  actionsPerMonth: number
): PlanRecommendation {
  const needed = Math.max(0, Math.ceil(Number(actionsPerMonth) || 0));
  const sorted = [...AUTOMATION_PLAN_DEFINITIONS].sort(
    (a, b) => a.executionLimit - b.executionLimit
  );
  const plan = sorted.find((p) => p.executionLimit >= needed) || null;
  return {
    plan,
    fits: Boolean(plan),
    exceedsAll: !plan && needed > 0,
  };
}

export function defaultScheduleConfig(
  partial: Partial<AutomationScheduleConfig> = {}
): AutomationScheduleConfig {
  return (
    normalizeScheduleConfig({
      frequency: "every_minutes",
      interval: 15,
      timeOfDay: "09:00",
      weekdays: [],
      activeHours: null,
      timezone: DEFAULT_TIMEZONE,
      ...partial,
    }) || {
      frequency: "every_minutes",
      interval: 15,
      timeOfDay: "09:00",
      weekdays: [],
      activeHours: null,
      timezone: DEFAULT_TIMEZONE,
    }
  );
}
