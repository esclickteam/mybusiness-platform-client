export type CountdownStylePreset = "cards" | "pulse" | "gradient" | "neon";

export type CountdownFontPreset = "system" | "rounded" | "bold" | "mono";

export type CountdownSizePreset = "sm" | "md" | "lg";

export type CountdownLayoutMode = "compact" | "floating";

export type CountdownEffectMode = "none" | "sparkle" | "fireworks" | "confetti" | "glow";

export type CountdownEffectWhen = "during" | "onExpire" | "both";

export type CountdownUnitFormat = "standard" | "daysOnly" | "weeksOnly";

export type CountdownSettings = {
  isActive?: boolean;
  title?: string;
  endDate?: string;
  timezone?: string;
  unitFormat?: CountdownUnitFormat;
  showMonths?: boolean;
  showWeeks?: boolean;
  showDays?: boolean;
  monthsAsDays?: boolean;
  weeksAsDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  unitOrderReversed?: boolean;
  stylePreset?: CountdownStylePreset;
  layoutMode?: CountdownLayoutMode;
  sizePreset?: CountdownSizePreset;
  floatingPosition?: { x: number; y: number };
  backgroundColor?: string;
  cardBackgroundColor?: string;
  numberColor?: string;
  labelColor?: string;
  accentColor?: string;
  fontPreset?: CountdownFontPreset;
  shadowEnabled?: boolean;
  shadowColor?: string;
  effectMode?: CountdownEffectMode;
  effectWhen?: CountdownEffectWhen;
  expiredMessage?: string;
};

export type CountdownUnit = {
  key: "months" | "weeks" | "days" | "hours" | "minutes" | "seconds";
  label: string;
  value: number;
};

export const COUNTDOWN_STYLE_PRESETS: {
  value: CountdownStylePreset;
  label: string;
  description: string;
}[] = [
  { value: "cards", label: "כרטיסיות", description: "מספרים בכרטיסים עם צל" },
  { value: "pulse", label: "פועם", description: "מספרים גדולים עם אנימציית פעימה" },
  { value: "gradient", label: "גרדיאנט", description: "רקע צבעוני עם מספרים לבנים" },
  { value: "neon", label: "ניאון", description: "רקע כהה עם הדגשות זוהרות" },
];

export const COUNTDOWN_LAYOUT_MODES: {
  value: CountdownLayoutMode;
  label: string;
  description: string;
}[] = [
  {
    value: "compact",
    label: "רכיב בעמוד",
    description: "גודל ומיקום — גררו ושנו גודל בעורך כמו תמונה",
  },
  {
    value: "floating",
    label: "צף קבוע",
    description: "ווידג'ט קטן צף באתר החי (לא בעריכה)",
  },
];

export const COUNTDOWN_SIZE_PRESETS: {
  value: CountdownSizePreset;
  label: string;
}[] = [
  { value: "sm", label: "קטן" },
  { value: "md", label: "בינוני" },
  { value: "lg", label: "גדול" },
];

export const COUNTDOWN_EFFECT_MODES: {
  value: CountdownEffectMode;
  label: string;
}[] = [
  { value: "none", label: "ללא" },
  { value: "sparkle", label: "ניצוצות" },
  { value: "glow", label: "זוהר" },
  { value: "fireworks", label: "זיקוקים" },
  { value: "confetti", label: "קונפטי" },
];

export const COUNTDOWN_EFFECT_WHEN: {
  value: CountdownEffectWhen;
  label: string;
}[] = [
  { value: "during", label: "תוך כדי" },
  { value: "onExpire", label: "בסיום" },
  { value: "both", label: "שניהם" },
];

export const COUNTDOWN_UNIT_FORMATS: {
  value: CountdownUnitFormat;
  label: string;
  description: string;
}[] = [
  { value: "standard", label: "רגיל", description: "חודשים, שבועות, ימים — עם המרות" },
  { value: "daysOnly", label: "ימים בלבד", description: "סה״כ ימים + שעות/דקות/שניות" },
  { value: "weeksOnly", label: "שבועות בלבד", description: "סה״כ שבועות + שאר יחידות" },
];

export const COUNTDOWN_FONT_PRESETS: { value: CountdownFontPreset; label: string; css: string }[] = [
  { value: "system", label: "רגיל", css: "system-ui, sans-serif" },
  { value: "rounded", label: "מעוגל", css: "'Rubik', 'Segoe UI', sans-serif" },
  { value: "bold", label: "מודגש", css: "'Arial Black', 'Impact', sans-serif" },
  { value: "mono", label: "מono", css: "'Courier New', monospace" },
];

export const PRESET_DEFAULT_COLORS: Record<
  CountdownStylePreset,
  Pick<
    CountdownSettings,
    "backgroundColor" | "cardBackgroundColor" | "numberColor" | "labelColor" | "accentColor"
  >
> = {
  cards: {
    backgroundColor: "transparent",
    cardBackgroundColor: "#ffffff",
    numberColor: "#1e293b",
    labelColor: "#94a3b8",
    accentColor: "#7C3AED",
  },
  pulse: {
    backgroundColor: "#faf5ff",
    cardBackgroundColor: "#ffffff",
    numberColor: "#7C3AED",
    labelColor: "#a855f7",
    accentColor: "#ec4899",
  },
  gradient: {
    backgroundColor: "linear-gradient(135deg,#7C3AED,#ec4899)",
    cardBackgroundColor: "rgba(255,255,255,0.12)",
    numberColor: "#ffffff",
    labelColor: "rgba(255,255,255,0.85)",
    accentColor: "#fbbf24",
  },
  neon: {
    backgroundColor: "#0f172a",
    cardBackgroundColor: "rgba(15,23,42,0.85)",
    numberColor: "#22d3ee",
    labelColor: "#94a3b8",
    accentColor: "#a855f7",
  },
};

const MS_DAY = 86400000;
const MS_HOUR = 3600000;
const MS_MINUTE = 60000;
const MS_WEEK = MS_DAY * 7;
const MS_MONTH = MS_DAY * 30;

export function resolveFontFamily(preset?: CountdownFontPreset) {
  return COUNTDOWN_FONT_PRESETS.find((p) => p.value === preset)?.css || COUNTDOWN_FONT_PRESETS[0].css;
}

export function resolveSizeClasses(size?: CountdownSizePreset) {
  switch (size) {
    case "sm":
      return {
        wrapper: "max-w-md",
        title: "text-sm",
        card: "min-w-[56px] px-3 py-2 sm:min-w-[64px] sm:px-3.5 sm:py-2.5",
        number: "text-2xl sm:text-3xl",
        label: "text-[9px] sm:text-[10px]",
        gap: "gap-2 sm:gap-2.5",
        pulseNumber: "text-[clamp(1.5rem,5vw,2.5rem)]",
      };
    case "lg":
      return {
        wrapper: "max-w-5xl",
        title: "text-xl sm:text-2xl",
        card: "min-w-[96px] px-6 py-5 sm:min-w-[112px] sm:px-7 sm:py-6",
        number: "text-5xl sm:text-6xl",
        label: "text-xs sm:text-sm",
        gap: "gap-4 sm:gap-6",
        pulseNumber: "text-[clamp(2.5rem,8vw,4.5rem)]",
      };
    default:
      return {
        wrapper: "max-w-3xl",
        title: "text-base sm:text-lg",
        card: "min-w-[72px] px-4 py-3 sm:min-w-[84px] sm:px-5 sm:py-4",
        number: "text-3xl sm:text-4xl",
        label: "text-[10px] sm:text-xs",
        gap: "gap-3 sm:gap-4",
        pulseNumber: "text-[clamp(2rem,6vw,3.5rem)]",
      };
  }
}

export function normalizeCountdownSettings(raw: unknown): CountdownSettings {
  const base: CountdownSettings = {
    isActive: true,
    title: "המבצע מסתיים בעוד",
    endDate: "",
    timezone: "Asia/Jerusalem",
    unitFormat: "standard",
    showMonths: true,
    showWeeks: true,
    showDays: true,
    monthsAsDays: false,
    weeksAsDays: false,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    unitOrderReversed: true,
    stylePreset: "cards",
    layoutMode: "compact",
    sizePreset: "md",
    floatingPosition: { x: 12, y: 78 },
    fontPreset: "rounded",
    shadowEnabled: true,
    shadowColor: "rgba(15,23,42,0.12)",
    effectMode: "none",
    effectWhen: "onExpire",
    expiredMessage: "המבצע הסתיים",
    ...PRESET_DEFAULT_COLORS.cards,
  };

  if (!raw || typeof raw !== "object") return base;
  const s = raw as CountdownSettings;
  const preset = (s.stylePreset as CountdownStylePreset) || "cards";
  const presetColors = PRESET_DEFAULT_COLORS[preset] || PRESET_DEFAULT_COLORS.cards;

  return {
    ...base,
    ...presetColors,
    ...s,
    stylePreset: preset,
    layoutMode:
      s.layoutMode === "floating"
        ? "floating"
        : "compact",
    floatingPosition: s.floatingPosition || base.floatingPosition,
  };
}

export function parseEndDate(endDate?: string) {
  if (!endDate) return null;
  const parsed = Date.parse(endDate);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildCountdownUnits(settings: CountdownSettings, parts: {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): CountdownUnit[] {
  const units: CountdownUnit[] = [];
  const format = settings.unitFormat || "standard";

  if (format === "daysOnly") {
    if (settings.showDays !== false) {
      units.push({ key: "days", label: "ימים (סה״כ)", value: parts.days });
    }
  } else if (format === "weeksOnly") {
    if (settings.showWeeks !== false) {
      units.push({ key: "weeks", label: "שבועות (סה״כ)", value: parts.weeks });
    }
    if (settings.showDays !== false && parts.days > 0) {
      units.push({ key: "days", label: "ימים", value: parts.days });
    }
  } else {
    const showMonths = settings.showMonths !== false && settings.monthsAsDays !== true;
    const showWeeks =
      settings.showWeeks !== false &&
      settings.weeksAsDays !== true &&
      !(settings.monthsAsDays && settings.weeksAsDays);

    if (showMonths) units.push({ key: "months", label: "חודשים", value: parts.months });
    if (showWeeks) units.push({ key: "weeks", label: "שבועות", value: parts.weeks });
    if (settings.showDays !== false) {
      const daysLabel =
        settings.monthsAsDays && settings.weeksAsDays
          ? "ימים (סה״כ)"
          : settings.monthsAsDays
            ? "ימים (כולל חודשים)"
            : settings.weeksAsDays
              ? "ימים (כולל שבועות)"
              : "ימים";
      units.push({ key: "days", label: daysLabel, value: parts.days });
    }
  }

  if (settings.showHours !== false) units.push({ key: "hours", label: "שעות", value: parts.hours });
  if (settings.showMinutes !== false) units.push({ key: "minutes", label: "דקות", value: parts.minutes });
  if (settings.showSeconds !== false) units.push({ key: "seconds", label: "שניות", value: parts.seconds });

  if (settings.unitOrderReversed !== false) {
    units.reverse();
  }

  return units;
}

function splitSmallerUnits(
  diff: number,
  base: { months: number; weeks: number; days: number }
) {
  let rest = Math.max(0, diff);
  const hours = Math.floor(rest / MS_HOUR);
  rest -= hours * MS_HOUR;
  const minutes = Math.floor(rest / MS_MINUTE);
  rest -= minutes * MS_MINUTE;
  const seconds = Math.floor(rest / 1000);
  return { ...base, hours, minutes, seconds };
}

export function splitCountdownParts(diffMs: number, settings: CountdownSettings) {
  let diff = Math.max(0, diffMs);
  const format = settings.unitFormat || "standard";

  if (format === "daysOnly") {
    const days = Math.floor(diff / MS_DAY);
    diff -= days * MS_DAY;
    return splitSmallerUnits(diff, { months: 0, weeks: 0, days });
  }

  if (format === "weeksOnly") {
    const weeks = Math.floor(diff / MS_WEEK);
    diff -= weeks * MS_WEEK;
    const days = settings.showDays !== false ? Math.floor(diff / MS_DAY) : 0;
    diff -= days * MS_DAY;
    return splitSmallerUnits(diff, { months: 0, weeks, days });
  }

  let months = 0;
  let weeks = 0;
  let days = 0;

  if (settings.monthsAsDays) {
    const totalDays = Math.floor(diff / MS_DAY);
    diff -= totalDays * MS_DAY;

    if (settings.weeksAsDays || settings.showWeeks === false) {
      days = totalDays;
    } else {
      weeks = Math.floor(totalDays / 7);
      days = totalDays % 7;
    }
  } else {
    if (settings.showMonths !== false) {
      months = Math.floor(diff / MS_MONTH);
      diff -= months * MS_MONTH;
    }

    if (settings.weeksAsDays) {
      days = Math.floor(diff / MS_DAY);
      diff -= days * MS_DAY;
    } else if (settings.showWeeks !== false) {
      weeks = Math.floor(diff / MS_WEEK);
      diff -= weeks * MS_WEEK;
      days = Math.floor(diff / MS_DAY);
      diff -= days * MS_DAY;
    } else {
      days = Math.floor(diff / MS_DAY);
      diff -= days * MS_DAY;
    }
  }

  return splitSmallerUnits(diff, { months, weeks, days });
}

export function computeCountdownUnits(
  endMs: number | null,
  settings: CountdownSettings,
  now = Date.now()
): { units: CountdownUnit[]; expired: boolean } {
  if (!endMs || endMs <= now) {
    return { units: [], expired: true };
  }

  let diff = Math.max(0, endMs - now);
  const parts = splitCountdownParts(diff, settings);

  return {
    units: buildCountdownUnits(settings, parts),
    expired: false,
  };
}

export function padUnit(value: number, key: CountdownUnit["key"], settings?: CountdownSettings) {
  const format = settings?.unitFormat || "standard";

  if (key === "months") return String(Math.max(0, value));

  if (key === "days") {
    if (format === "daysOnly" || settings?.monthsAsDays || settings?.weeksAsDays) {
      return String(Math.max(0, value));
    }
  }

  if (key === "weeks" && format === "weeksOnly") {
    return String(Math.max(0, value));
  }

  return String(Math.max(0, value)).padStart(2, "0");
}

export function previewCountdownUnits(settings: CountdownSettings): CountdownUnit[] {
  const format = settings.unitFormat || "standard";

  if (format === "daysOnly") {
    return buildCountdownUnits(settings, {
      months: 0,
      weeks: 0,
      days: 47,
      hours: 8,
      minutes: 45,
      seconds: 22,
    });
  }

  if (format === "weeksOnly") {
    return buildCountdownUnits(settings, {
      months: 0,
      weeks: 6,
      days: settings.showDays !== false ? 5 : 0,
      hours: 8,
      minutes: 45,
      seconds: 22,
    });
  }

  return buildCountdownUnits(settings, {
    months: settings.monthsAsDays ? 0 : 1,
    weeks: settings.weeksAsDays ? 0 : 2,
    days: settings.monthsAsDays ? 47 : settings.weeksAsDays ? 19 : 5,
    hours: 8,
    minutes: 45,
    seconds: 22,
  });
}
