import type { VisualInsertedElementType } from "../utils/visualData";

export type VisualSectionTheme = {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  fontFamily: string;
};

const TEMPLATE_THEMES: Record<string, Partial<VisualSectionTheme>> = {
  lexora: {
    primary: "#18231F",
    accent: "#A77D48",
    background: "#EDE7DC",
    surface: "#FBF7EE",
    text: "#18231F",
    muted: "#59645E",
  },
  velmora: {
    primary: "#2F241B", accent: "#9A6F3B", background: "#FBF7EF",
    surface: "#FFFFFF", text: "#2F241B", muted: "#8B735F",
  },
  wantravel: {
    primary: "#18392F", accent: "#B6772F", background: "#F7F1E7",
    surface: "#FFF8EF", text: "#1F2A24", muted: "#6B786F",
  },
  spalcio: {
    primary: "#111827", accent: "#2563EB", background: "#F8FAFC",
    surface: "#FFFFFF", text: "#111827", muted: "#6B7280",
  },
  ido: {
    primary: "#07100E", accent: "#C9F4DC", background: "#ECF3EA",
    surface: "#FFFFFF", text: "#07100E", muted: "#6F7C75",
  },
  adion: {
    primary: "#F6EFE3", accent: "#F7C873", background: "#10100E",
    surface: "#191915", text: "#F6EFE3", muted: "#A9A093",
  },
  virello: {
    primary: "#301b12", accent: "#ff9fbc", background: "#fff8f0",
    surface: "#ffffff", text: "#301b12", muted: "#8f7567",
  },
  nadlanist: {
    primary: "#F6EFE3", accent: "#D8B36A", background: "#10100E",
    surface: "#191915", text: "#F6EFE3", muted: "#A9A093",
  },
  novastra: {
    primary: "#09090B", accent: "#F5F0E8", background: "#FFFFFF",
    surface: "#F7F3EC", text: "#09090B", muted: "#71717A",
  },
  domora: {
    primary: "#151D20", accent: "#D8C6A1", background: "#F5F5F2",
    surface: "#FFFFFF", text: "#151D20", muted: "#6D7378",
  },
};

const FALLBACK_THEME: VisualSectionTheme = {
  primary: "#0f172a",
  accent: "#7c3aed",
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  fontFamily:
    "Assistant, Heebo, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

function cleanColor(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function resolveVisualSectionTheme(
  templateKey?: string,
  root?: HTMLElement | null,
): VisualSectionTheme {
  const preset = TEMPLATE_THEMES[String(templateKey || "").toLowerCase()] || {};
  const templateRoot =
    root?.querySelector<HTMLElement>("[data-template-id]") || root || null;
  const computed =
    templateRoot && typeof window !== "undefined"
      ? window.getComputedStyle(templateRoot)
      : null;

  let storedPalette: Record<string, any> = {};
  try {
    storedPalette = JSON.parse(
      localStorage.getItem("bizuply-ai-site-plan") || "{}",
    )?.palette || {};
  } catch {
    storedPalette = {};
  }

  const cssVar = (name: string) =>
    cleanColor(computed?.getPropertyValue(name));

  return {
    primary:
      cleanColor(storedPalette.primary) ||
      cssVar("--biz-primary") ||
      cleanColor(preset.primary) ||
      cleanColor(computed?.color) ||
      FALLBACK_THEME.primary,
    accent:
      cleanColor(storedPalette.accent) ||
      cssVar("--biz-accent") ||
      cleanColor(preset.accent) ||
      FALLBACK_THEME.accent,
    background:
      cleanColor(storedPalette.background) ||
      cssVar("--biz-bg") ||
      cleanColor(preset.background) ||
      cleanColor(computed?.backgroundColor) ||
      FALLBACK_THEME.background,
    surface:
      cleanColor(storedPalette.surface) ||
      cleanColor(preset.surface) ||
      FALLBACK_THEME.surface,
    text:
      cleanColor(storedPalette.text) ||
      cssVar("--biz-text") ||
      cleanColor(preset.text) ||
      cleanColor(computed?.color) ||
      FALLBACK_THEME.text,
    muted:
      cleanColor(storedPalette.muted) ||
      cssVar("--biz-muted") ||
      cleanColor(preset.muted) ||
      FALLBACK_THEME.muted,
    fontFamily:
      cssVar("--biz-body-font") ||
      cleanColor(computed?.fontFamily) ||
      FALLBACK_THEME.fontFamily,
  };
}

function replaceThemeColor(value: unknown, theme: VisualSectionTheme) {
  if (typeof value !== "string") return value;

  const replacements: Record<string, string> = {
    "#0f172a": theme.primary,
    "#111827": theme.primary,
    "#1e293b": theme.text,
    "#475569": theme.muted,
    "#64748b": theme.muted,
    "#7c3aed": theme.accent,
    "#8b5cf6": theme.accent,
    "#6d28d9": theme.accent,
    "#f8fafc": theme.background,
    "#ffffff": theme.surface,
  };

  let next = value;
  Object.entries(replacements).forEach(([source, target]) => {
    next = next.replace(new RegExp(source, "gi"), target);
  });
  return next;
}

export function themeLibraryNodeStyle(
  style: Record<string, any> | undefined,
  type: VisualInsertedElementType,
  theme: VisualSectionTheme,
) {
  const next = Object.fromEntries(
    Object.entries(style || {}).map(([key, value]) => [
      key,
      replaceThemeColor(value, theme),
    ]),
  );

  if (type === "text" || type === "button" || type === "form-field") {
    next.fontFamily = next.fontFamily || theme.fontFamily;
  }

  return next;
}

export function themeLibraryBackground(
  background: string | undefined,
  theme: VisualSectionTheme,
) {
  return String(replaceThemeColor(background || "#ffffff", theme));
}
