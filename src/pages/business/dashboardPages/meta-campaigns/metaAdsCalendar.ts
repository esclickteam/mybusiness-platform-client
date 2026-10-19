/** Account-timezone date windows for the Meta ads picker. Calendar math only. */

export const DEFAULT_AD_ACCOUNT_TIMEZONE = "Asia/Jerusalem";

export const META_RANGE_PRESETS = [
  "today",
  "yesterday",
  "today_yesterday",
  "last_7",
  "rolling_7",
  "last_14",
  "last_28",
  "last_30",
  "this_week",
  "last_week",
  "this_month",
  "last_month",
  "maximum",
  "custom",
] as const;

export type MetaRangePreset = (typeof META_RANGE_PRESETS)[number];

export type ResolvedMetaRange = {
  preset: MetaRangePreset;
  since: string | null;
  until: string | null;
  /** Graph date_preset. Null means the caller must send since/until. */
  datePreset: string | null;
  days: number | null;
  includesToday: boolean;
};

const PRESET_SET = new Set<string>(META_RANGE_PRESETS);

export function isMetaRangePreset(value: string): value is MetaRangePreset {
  return PRESET_SET.has(value);
}

export function zonedIsoDate(timeZone: string, now = new Date()): string {
  const zone = timeZone || DEFAULT_AD_ACCOUNT_TIMEZONE;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) return "1970-01-01";
  return `${year}-${month}-${day}`;
}

export function addCalendarDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function weekdaySunday0(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1)).getUTCDay();
}

export function compareIso(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function inclusiveDays(since: string, until: string): number {
  const [sy, sm, sd] = since.split("-").map(Number);
  const [uy, um, ud] = until.split("-").map(Number);
  const start = Date.UTC(sy, (sm || 1) - 1, sd || 1);
  const end = Date.UTC(uy, (um || 1) - 1, ud || 1);
  return Math.round((end - start) / 86400000) + 1;
}

export function previousWindow(since: string, until: string): { since: string; until: string } | null {
  if (!since || !until || compareIso(until, since) < 0) return null;
  const span = inclusiveDays(since, until);
  const prevUntil = addCalendarDays(since, -1);
  return { since: addCalendarDays(prevUntil, -(span - 1)), until: prevUntil };
}

function lastNEndingYesterday(today: string, days: number): { since: string; until: string } {
  const until = addCalendarDays(today, -1);
  return { since: addCalendarDays(until, -(days - 1)), until };
}

export function resolveMetaRange(
  preset: MetaRangePreset,
  timeZone = DEFAULT_AD_ACCOUNT_TIMEZONE,
  now = new Date(),
  custom?: { since?: string; until?: string }
): ResolvedMetaRange {
  const today = zonedIsoDate(timeZone, now);
  const base = (partial: Omit<ResolvedMetaRange, "preset">): ResolvedMetaRange => ({ preset, ...partial });

  if (preset === "today") {
    return base({ since: today, until: today, datePreset: "today", days: 1, includesToday: true });
  }
  if (preset === "yesterday") {
    const day = addCalendarDays(today, -1);
    return base({ since: day, until: day, datePreset: "yesterday", days: 1, includesToday: false });
  }
  if (preset === "today_yesterday") {
    return base({
      since: addCalendarDays(today, -1),
      until: today,
      datePreset: null,
      days: 2,
      includesToday: true,
    });
  }
  if (preset === "last_7" || preset === "last_14" || preset === "last_28" || preset === "last_30") {
    const days = preset === "last_7" ? 7 : preset === "last_14" ? 14 : preset === "last_28" ? 28 : 30;
    const window = lastNEndingYesterday(today, days);
    const datePreset = preset === "last_7" ? "last_7d" : preset === "last_14" ? "last_14d" : preset === "last_28" ? "last_28d" : "last_30d";
    return base({ ...window, datePreset, days, includesToday: false });
  }
  if (preset === "rolling_7") {
    return base({
      since: addCalendarDays(today, -6),
      until: today,
      datePreset: null,
      days: 7,
      includesToday: true,
    });
  }
  if (preset === "this_week") {
    const since = addCalendarDays(today, -weekdaySunday0(today));
    return base({
      since,
      until: today,
      datePreset: "this_week_sun_today",
      days: inclusiveDays(since, today),
      includesToday: true,
    });
  }
  if (preset === "last_week") {
    const thisSunday = addCalendarDays(today, -weekdaySunday0(today));
    const since = addCalendarDays(thisSunday, -7);
    const until = addCalendarDays(thisSunday, -1);
    return base({ since, until, datePreset: "last_week_sun_sat", days: 7, includesToday: false });
  }
  if (preset === "this_month") {
    const since = `${today.slice(0, 8)}01`;
    return base({
      since,
      until: today,
      datePreset: "this_month",
      days: inclusiveDays(since, today),
      includesToday: true,
    });
  }
  if (preset === "last_month") {
    const [year, month] = today.split("-").map(Number);
    const previous = shiftMonth(year, month, -1);
    const since = `${previous.year}-${String(previous.month).padStart(2, "0")}-01`;
    const until = `${previous.year}-${String(previous.month).padStart(2, "0")}-${String(daysInMonth(previous.year, previous.month)).padStart(2, "0")}`;
    return base({ since, until, datePreset: "last_month", days: inclusiveDays(since, until), includesToday: false });
  }
  if (preset === "maximum") {
    return base({ since: null, until: today, datePreset: "maximum", days: null, includesToday: true });
  }

  const todayCap = today;
  let since = String(custom?.since || "").trim() || addCalendarDays(today, -6);
  let until = String(custom?.until || "").trim() || today;
  if (compareIso(since, todayCap) > 0) since = todayCap;
  if (compareIso(until, todayCap) > 0) until = todayCap;
  if (compareIso(until, since) < 0) until = since;
  return base({
    since,
    until,
    datePreset: null,
    days: inclusiveDays(since, until),
    includesToday: until === today,
  });
}

export function rangeToApiQuery(
  resolved: ResolvedMetaRange,
  options?: { timeZone?: string; compare?: boolean; compareSince?: string; compareUntil?: string }
): { datePreset?: string; days?: number; since?: string; until?: string; timezone?: string; compare?: number; compareSince?: string; compareUntil?: string } {
  const query: {
    datePreset?: string;
    days?: number;
    since?: string;
    until?: string;
    timezone?: string;
    compare?: number;
    compareSince?: string;
    compareUntil?: string;
  } = { compare: options?.compare ? 1 : 0 };
  if (options?.timeZone) query.timezone = options.timeZone;
  if (resolved.datePreset) {
    query.datePreset = resolved.datePreset;
    if (resolved.days) query.days = resolved.days;
  } else if (resolved.since && resolved.until) {
    query.since = resolved.since;
    query.until = resolved.until;
  }
  if (options?.compare && options.compareSince && options.compareUntil) {
    query.compareSince = options.compareSince;
    query.compareUntil = options.compareUntil;
  }
  return query;
}

export function formatIsoDate(iso: string, locale: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function monthCells(year: number, month: number): Array<string | null> {
  const count = daysInMonth(year, month);
  const leading = weekdaySunday0(`${year}-${String(month).padStart(2, "0")}-01`);
  const cells: Array<string | null> = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= count; day += 1) {
    cells.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  return cells;
}
