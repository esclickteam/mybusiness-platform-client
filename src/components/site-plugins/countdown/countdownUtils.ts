export type CountdownStylePreset = "cards" | "pulse" | "gradient" | "neon";

export type CountdownFontPreset = "system" | "rounded" | "bold" | "mono";

export type CountdownSettings = {
  isActive?: boolean;
  title?: string;
  endDate?: string;
  timezone?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  stylePreset?: CountdownStylePreset;
  backgroundColor?: string;
  numberColor?: string;
  labelColor?: string;
  accentColor?: string;
  fontPreset?: CountdownFontPreset;
  shadowEnabled?: boolean;
  shadowColor?: string;
  expiredMessage?: string;
};

export type CountdownUnit = {
  key: "days" | "hours" | "minutes" | "seconds";
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

export const COUNTDOWN_FONT_PRESETS: { value: CountdownFontPreset; label: string; css: string }[] = [
  { value: "system", label: "רגיל", css: "system-ui, sans-serif" },
  { value: "rounded", label: "מעוגל", css: "'Rubik', 'Segoe UI', sans-serif" },
  { value: "bold", label: "מודגש", css: "'Arial Black', 'Impact', sans-serif" },
  { value: "mono", label: "מono", css: "'Courier New', monospace" },
];

export const PRESET_DEFAULT_COLORS: Record<
  CountdownStylePreset,
  Pick<CountdownSettings, "backgroundColor" | "numberColor" | "labelColor" | "accentColor">
> = {
  cards: {
    backgroundColor: "transparent",
    numberColor: "#1e293b",
    labelColor: "#94a3b8",
    accentColor: "#7C3AED",
  },
  pulse: {
    backgroundColor: "#faf5ff",
    numberColor: "#7C3AED",
    labelColor: "#a855f7",
    accentColor: "#ec4899",
  },
  gradient: {
    backgroundColor: "linear-gradient(135deg,#7C3AED,#ec4899)",
    numberColor: "#ffffff",
    labelColor: "rgba(255,255,255,0.85)",
    accentColor: "#fbbf24",
  },
  neon: {
    backgroundColor: "#0f172a",
    numberColor: "#22d3ee",
    labelColor: "#94a3b8",
    accentColor: "#a855f7",
  },
};

export function resolveFontFamily(preset?: CountdownFontPreset) {
  return COUNTDOWN_FONT_PRESETS.find((p) => p.value === preset)?.css || COUNTDOWN_FONT_PRESETS[0].css;
}

export function normalizeCountdownSettings(raw: unknown): CountdownSettings {
  const base: CountdownSettings = {
    isActive: true,
    title: "המבצע מסתיים בעוד",
    endDate: "",
    timezone: "Asia/Jerusalem",
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    stylePreset: "cards",
    fontPreset: "rounded",
    shadowEnabled: true,
    shadowColor: "rgba(15,23,42,0.12)",
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
  };
}

export function parseEndDate(endDate?: string) {
  if (!endDate) return null;
  const parsed = Date.parse(endDate);
  return Number.isFinite(parsed) ? parsed : null;
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
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  const units: CountdownUnit[] = [];
  if (settings.showDays !== false) units.push({ key: "days", label: "ימים", value: days });
  if (settings.showHours !== false) units.push({ key: "hours", label: "שעות", value: hours });
  if (settings.showMinutes !== false) units.push({ key: "minutes", label: "דקות", value: minutes });
  if (settings.showSeconds !== false) units.push({ key: "seconds", label: "שניות", value: seconds });

  return { units, expired: false };
}

export function padUnit(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}
