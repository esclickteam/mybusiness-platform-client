export type AccessibilityWidgetPosition = "bottom-left" | "bottom-right";

export type AccessibilityFeatureKey =
  | "largeText"
  | "highContrast"
  | "grayscale"
  | "highlightLinks"
  | "stopAnimations"
  | "readableFont"
  | "textSpacing"
  | "largeCursor";

export type AccessibilityVisitorState = Record<AccessibilityFeatureKey, boolean> & {
  fontScale: number;
};

export type AccessibilitySettings = {
  isActive?: boolean;
  widgetPosition?: AccessibilityWidgetPosition;
  accentColor?: string;
  defaultFontScale?: number;
  features?: Partial<Record<AccessibilityFeatureKey, boolean>>;
};

export const ACCESSIBILITY_FEATURES: Array<{
  key: AccessibilityFeatureKey;
  label: string;
  description: string;
}> = [
  { key: "largeText", label: "טקסט גדול", description: "הגדלת גופן באתר" },
  { key: "highContrast", label: "+ ניגודיות", description: "ניגודיות גבוהה לקריאה" },
  { key: "grayscale", label: "גווני אפור", description: "תצוגה בגווני אפור" },
  { key: "highlightLinks", label: "הדגשת קישורים", description: "סימון בולט לכל הקישורים" },
  { key: "stopAnimations", label: "ביטול הנפשות", description: "עצירת אנימציות ותנועה" },
  { key: "readableFont", label: "פונט קריא", description: "גופן פשוט וקריא יותר" },
  { key: "textSpacing", label: "ריווח טקסט", description: "ריווח אותיות ושורות" },
  { key: "largeCursor", label: "סמן מוגדל", description: "סמן עכבר גדול וברור" },
];

const DEFAULT_FEATURES: Record<AccessibilityFeatureKey, boolean> = {
  largeText: true,
  highContrast: true,
  grayscale: true,
  highlightLinks: true,
  stopAnimations: true,
  readableFont: true,
  textSpacing: true,
  largeCursor: true,
};

const DEFAULT_VISITOR_STATE: AccessibilityVisitorState = {
  largeText: false,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  stopAnimations: false,
  readableFont: false,
  textSpacing: false,
  largeCursor: false,
  fontScale: 100,
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  isActive: true,
  widgetPosition: "bottom-left",
  accentColor: "#7C3AED",
  defaultFontScale: 100,
  features: { ...DEFAULT_FEATURES },
};

const STORAGE_PREFIX = "bizuply-a11y:";
const HTML_ATTR = "data-bizuply-a11y";
const STYLE_ID = "bizuply-accessibility-runtime-css";

export function mergeAccessibilitySettings(
  stored?: Partial<AccessibilitySettings> | null
): AccessibilitySettings {
  const features = {
    ...DEFAULT_FEATURES,
    ...(stored?.features || {}),
  };

  const position =
    stored?.widgetPosition === "bottom-right" ? "bottom-right" : "bottom-left";

  return {
    isActive: stored?.isActive !== false,
    widgetPosition: position,
    accentColor: String(stored?.accentColor || DEFAULT_ACCESSIBILITY_SETTINGS.accentColor),
    defaultFontScale: Math.min(
      200,
      Math.max(100, Number(stored?.defaultFontScale) || 100)
    ),
    features,
  };
}

function storageKey(siteKey: string) {
  return `${STORAGE_PREFIX}${siteKey || "site"}`;
}

export function readVisitorAccessibilityState(
  siteKey: string
): AccessibilityVisitorState {
  if (typeof window === "undefined") return { ...DEFAULT_VISITOR_STATE };
  try {
    const raw = window.localStorage.getItem(storageKey(siteKey));
    if (!raw) return { ...DEFAULT_VISITOR_STATE };
    const parsed = JSON.parse(raw) as Partial<AccessibilityVisitorState>;
    return {
      ...DEFAULT_VISITOR_STATE,
      ...parsed,
      fontScale: Math.min(200, Math.max(100, Number(parsed.fontScale) || 100)),
    };
  } catch {
    return { ...DEFAULT_VISITOR_STATE };
  }
}

export function writeVisitorAccessibilityState(
  siteKey: string,
  state: AccessibilityVisitorState
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(siteKey), JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

export function clearVisitorAccessibilityState(siteKey: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey(siteKey));
  } catch {
    // ignore
  }
}

function ensureRuntimeStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
html[${HTML_ATTR}~="large-text"] {
  font-size: calc(100% * var(--bizuply-a11y-font-scale, 1.2)) !important;
}
html[${HTML_ATTR}~="large-text"] body {
  font-size: inherit !important;
}

html[${HTML_ATTR}~="high-contrast"] {
  filter: contrast(1.25) !important;
}
html[${HTML_ATTR}~="high-contrast"] body {
  background: #000 !important;
  color: #fff !important;
}
html[${HTML_ATTR}~="high-contrast"] a {
  color: #ffe566 !important;
  text-decoration: underline !important;
}
html[${HTML_ATTR}~="high-contrast"] p,
html[${HTML_ATTR}~="high-contrast"] h1,
html[${HTML_ATTR}~="high-contrast"] h2,
html[${HTML_ATTR}~="high-contrast"] h3,
html[${HTML_ATTR}~="high-contrast"] h4,
html[${HTML_ATTR}~="high-contrast"] h5,
html[${HTML_ATTR}~="high-contrast"] h6,
html[${HTML_ATTR}~="high-contrast"] li,
html[${HTML_ATTR}~="high-contrast"] span,
html[${HTML_ATTR}~="high-contrast"] label {
  color: #fff !important;
}

html[${HTML_ATTR}~="grayscale"] {
  filter: grayscale(1) !important;
}
html[${HTML_ATTR}~="grayscale"][${HTML_ATTR}~="high-contrast"] {
  filter: grayscale(1) contrast(1.25) !important;
}

html[${HTML_ATTR}~="highlight-links"] a {
  outline: 3px solid #7C3AED !important;
  outline-offset: 2px !important;
  text-decoration: underline !important;
  font-weight: 700 !important;
  background: rgba(124, 58, 237, 0.12) !important;
}

html[${HTML_ATTR}~="stop-animations"] *,
html[${HTML_ATTR}~="stop-animations"] *::before,
html[${HTML_ATTR}~="stop-animations"] *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}

html[${HTML_ATTR}~="readable-font"],
html[${HTML_ATTR}~="readable-font"] body,
html[${HTML_ATTR}~="readable-font"] p,
html[${HTML_ATTR}~="readable-font"] h1,
html[${HTML_ATTR}~="readable-font"] h2,
html[${HTML_ATTR}~="readable-font"] h3,
html[${HTML_ATTR}~="readable-font"] h4,
html[${HTML_ATTR}~="readable-font"] h5,
html[${HTML_ATTR}~="readable-font"] h6,
html[${HTML_ATTR}~="readable-font"] li,
html[${HTML_ATTR}~="readable-font"] a,
html[${HTML_ATTR}~="readable-font"] button,
html[${HTML_ATTR}~="readable-font"] input,
html[${HTML_ATTR}~="readable-font"] textarea,
html[${HTML_ATTR}~="readable-font"] select {
  font-family: Arial, Helvetica, "Noto Sans Hebrew", "Segoe UI", sans-serif !important;
  letter-spacing: 0.02em !important;
}

html[${HTML_ATTR}~="text-spacing"] body,
html[${HTML_ATTR}~="text-spacing"] p,
html[${HTML_ATTR}~="text-spacing"] li,
html[${HTML_ATTR}~="text-spacing"] a,
html[${HTML_ATTR}~="text-spacing"] span,
html[${HTML_ATTR}~="text-spacing"] label {
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
  line-height: 1.8 !important;
}

html[${HTML_ATTR}~="large-cursor"],
html[${HTML_ATTR}~="large-cursor"] * {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='2' d='M8 4l28 18-12 3 6 13-5 2-6-13-9 8z'/%3E%3C/svg%3E") 4 4, auto !important;
}
`;
  document.head.appendChild(style);
}

export function applyAccessibilityToDocument(state: AccessibilityVisitorState) {
  if (typeof document === "undefined") return;
  ensureRuntimeStyles();

  const tokens: string[] = [];
  if (state.largeText) tokens.push("large-text");
  if (state.highContrast) tokens.push("high-contrast");
  if (state.grayscale) tokens.push("grayscale");
  if (state.highlightLinks) tokens.push("highlight-links");
  if (state.stopAnimations) tokens.push("stop-animations");
  if (state.readableFont) tokens.push("readable-font");
  if (state.textSpacing) tokens.push("text-spacing");
  if (state.largeCursor) tokens.push("large-cursor");

  const root = document.documentElement;
  if (tokens.length) {
    root.setAttribute(HTML_ATTR, tokens.join(" "));
  } else {
    root.removeAttribute(HTML_ATTR);
  }

  const scale = state.largeText
    ? Math.max(1.15, (Number(state.fontScale) || 120) / 100)
    : 1;
  root.style.setProperty("--bizuply-a11y-font-scale", String(scale));
}

export function resetAccessibilityOnDocument() {
  applyAccessibilityToDocument({ ...DEFAULT_VISITOR_STATE });
}

export function createEmptyVisitorState(
  defaultFontScale = 100
): AccessibilityVisitorState {
  return {
    ...DEFAULT_VISITOR_STATE,
    fontScale: defaultFontScale,
  };
}

export function isFeatureEnabled(
  settings: AccessibilitySettings,
  key: AccessibilityFeatureKey
) {
  return settings.features?.[key] !== false;
}
