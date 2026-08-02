export type AccessibilityWidgetPosition = "bottom-left" | "bottom-right";

/** Contrast cycles like UserWay: off → +contrast → dark → invert → off */
export type ContrastLevel = 0 | 1 | 2 | 3;

/** Saturation cycles: off → high → low → grayscale → off */
export type SaturationLevel = 0 | 1 | 2 | 3;

/** Spacing / line-height intensity: off → light → medium → heavy → off */
export type IntensityLevel = 0 | 1 | 2 | 3;

export type AccessibilityFeatureKey =
  | "highlightLinks"
  | "contrast"
  | "textSpacing"
  | "largeText"
  | "hideImages"
  | "stopAnimations"
  | "largeCursor"
  | "dyslexia"
  | "lineHeight"
  | "descriptions"
  | "saturation"
  | "textAlign";

export type AccessibilityVisitorState = {
  highlightLinks: boolean;
  contrast: ContrastLevel;
  textSpacing: IntensityLevel;
  largeText: boolean;
  hideImages: boolean;
  stopAnimations: boolean;
  largeCursor: boolean;
  dyslexia: boolean;
  lineHeight: IntensityLevel;
  descriptions: boolean;
  saturation: SaturationLevel;
  textAlign: boolean;
  fontScale: number;
};

export type AccessibilitySettings = {
  isActive?: boolean;
  widgetPosition?: AccessibilityWidgetPosition;
  triggerPosition?: { x: number; y: number };
  accentColor?: string;
  defaultFontScale?: number;
  features?: Partial<Record<AccessibilityFeatureKey, boolean>>;
};

export const CONTRAST_LABELS: Record<ContrastLevel, string> = {
  0: "+ ניגודיות",
  1: "+ ניגודיות",
  2: "ניגודיות כהה",
  3: "היפוך צבעים",
};

export const SATURATION_LABELS: Record<SaturationLevel, string> = {
  0: "רוויה",
  1: "רוויה גבוהה",
  2: "רוויה נמוכה",
  3: "גווני אפור",
};

export const SPACING_LABELS: Record<IntensityLevel, string> = {
  0: "ריווח טקסט",
  1: "ריווח קל",
  2: "ריווח טקסט",
  3: "ריווח מוגבר",
};

export const LINE_HEIGHT_LABELS: Record<IntensityLevel, string> = {
  0: "גובה שורה",
  1: "גובה שורה +",
  2: "גובה שורה ++",
  3: "גובה שורה +++",
};

export const ACCESSIBILITY_FEATURES: Array<{
  key: AccessibilityFeatureKey;
  label: string;
  description: string;
  kind: "toggle" | "cycle";
}> = [
  {
    key: "highlightLinks",
    label: "הדגשת קישורים",
    description: "סימון בולט לכל הקישורים",
    kind: "toggle",
  },
  {
    key: "contrast",
    label: "+ ניגודיות",
    description: "לחצו שוב למעבר בין מצבי ניגודיות",
    kind: "cycle",
  },
  {
    key: "textSpacing",
    label: "ריווח טקסט",
    description: "ריווח אותיות ומילים",
    kind: "cycle",
  },
  {
    key: "largeText",
    label: "טקסט גדול",
    description: "הגדלת גופן באתר",
    kind: "toggle",
  },
  {
    key: "hideImages",
    label: "הסתרת תמונות",
    description: "הסתרת תמונות ורקעים",
    kind: "toggle",
  },
  {
    key: "stopAnimations",
    label: "ביטול הנפשות",
    description: "עצירת אנימציות ותנועה",
    kind: "toggle",
  },
  {
    key: "largeCursor",
    label: "סמן",
    description: "סמן עכבר מוגדל",
    kind: "toggle",
  },
  {
    key: "dyslexia",
    label: "תמיכה בדיסלקציה",
    description: "גופן ידידותי לדיסלקציה",
    kind: "toggle",
  },
  {
    key: "lineHeight",
    label: "גובה שורה",
    description: "הגדלת מרווח בין שורות",
    kind: "cycle",
  },
  {
    key: "descriptions",
    label: "תאורים",
    description: "הצגת תיאורי תמונות וקישורים",
    kind: "toggle",
  },
  {
    key: "saturation",
    label: "רוויה",
    description: "שינוי רוויית צבעים",
    kind: "cycle",
  },
  {
    key: "textAlign",
    label: "יישור טקסט",
    description: "יישור טקסט לימין לקריאה נוחה",
    kind: "toggle",
  },
];

const DEFAULT_FEATURES: Record<AccessibilityFeatureKey, boolean> = {
  highlightLinks: true,
  contrast: true,
  textSpacing: true,
  largeText: true,
  hideImages: true,
  stopAnimations: true,
  largeCursor: true,
  dyslexia: true,
  lineHeight: true,
  descriptions: true,
  saturation: true,
  textAlign: true,
};

const DEFAULT_VISITOR_STATE: AccessibilityVisitorState = {
  highlightLinks: false,
  contrast: 0,
  textSpacing: 0,
  largeText: false,
  hideImages: false,
  stopAnimations: false,
  largeCursor: false,
  dyslexia: false,
  lineHeight: 0,
  descriptions: false,
  saturation: 0,
  textAlign: false,
  fontScale: 100,
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  isActive: true,
  widgetPosition: "bottom-left",
  triggerPosition: { x: 88, y: 88 },
  accentColor: "#7C3AED",
  defaultFontScale: 100,
  features: { ...DEFAULT_FEATURES },
};

const STORAGE_PREFIX = "bizuply-a11y:v2:";
const HTML_ATTR = "data-bizuply-a11y";
const STYLE_ID = "bizuply-accessibility-runtime-css-v3";
const DESC_STYLE_ID = "bizuply-accessibility-desc-css-v3";

function asLevel(value: unknown, max = 3): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(max, Math.max(0, Math.round(n)));
}

export function mergeAccessibilitySettings(
  stored?: Partial<AccessibilitySettings> | null
): AccessibilitySettings {
  const features = {
    ...DEFAULT_FEATURES,
    ...(stored?.features || {}),
  };

  // Migrate older feature flags
  const legacy = stored?.features as Record<string, boolean> | undefined;
  if (legacy) {
    if (typeof legacy.highContrast === "boolean" && legacy.contrast === undefined) {
      features.contrast = legacy.highContrast;
    }
    if (typeof legacy.grayscale === "boolean" && legacy.saturation === undefined) {
      features.saturation = legacy.grayscale;
    }
    if (typeof legacy.readableFont === "boolean" && legacy.dyslexia === undefined) {
      features.dyslexia = legacy.readableFont;
    }
  }

  return {
    isActive: stored?.isActive !== false,
    // Menu always opens on the left; trigger can still be left/right.
    widgetPosition:
      stored?.widgetPosition === "bottom-right" ? "bottom-right" : "bottom-left",
    triggerPosition: {
      x: Number.isFinite(Number(stored?.triggerPosition?.x))
        ? Math.min(98.8, Math.max(1.2, Number(stored?.triggerPosition?.x)))
        : stored?.widgetPosition === "bottom-right"
          ? 8
          : 88,
      y: Number.isFinite(Number(stored?.triggerPosition?.y))
        ? Math.min(98.8, Math.max(1.2, Number(stored?.triggerPosition?.y)))
        : 88,
    },
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

function normalizeVisitorState(
  parsed: Partial<AccessibilityVisitorState> & Record<string, unknown>
): AccessibilityVisitorState {
  // Migrate v1 boolean highContrast / grayscale
  let contrast = asLevel(parsed.contrast) as ContrastLevel;
  if (!parsed.contrast && parsed.highContrast === true) contrast = 2;
  let saturation = asLevel(parsed.saturation) as SaturationLevel;
  if (!parsed.saturation && parsed.grayscale === true) saturation = 3;
  const dyslexia =
    typeof parsed.dyslexia === "boolean"
      ? parsed.dyslexia
      : Boolean(parsed.readableFont);

  return {
    highlightLinks: Boolean(parsed.highlightLinks),
    contrast,
    textSpacing: asLevel(parsed.textSpacing) as IntensityLevel,
    largeText: Boolean(parsed.largeText),
    hideImages: Boolean(parsed.hideImages),
    stopAnimations: Boolean(parsed.stopAnimations),
    largeCursor: Boolean(parsed.largeCursor),
    dyslexia,
    lineHeight: asLevel(parsed.lineHeight) as IntensityLevel,
    descriptions: Boolean(parsed.descriptions),
    saturation,
    textAlign: Boolean(parsed.textAlign),
    fontScale: Math.min(200, Math.max(100, Number(parsed.fontScale) || 100)),
  };
}

export function readVisitorAccessibilityState(
  siteKey: string
): AccessibilityVisitorState {
  if (typeof window === "undefined") return { ...DEFAULT_VISITOR_STATE };
  try {
    const raw =
      window.localStorage.getItem(storageKey(siteKey)) ||
      window.localStorage.getItem(`bizuply-a11y:${siteKey || "site"}`);
    if (!raw) return { ...DEFAULT_VISITOR_STATE };
    const parsed = JSON.parse(raw) as Partial<AccessibilityVisitorState> &
      Record<string, unknown>;
    return normalizeVisitorState(parsed);
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
    window.localStorage.removeItem(`bizuply-a11y:${siteKey || "site"}`);
  } catch {
    // ignore
  }
}

function ensureRuntimeStyles() {
  if (typeof document === "undefined") return;

  // Drop older runtime sheets that applied filter on <html> (broke the menu).
  [
    "bizuply-accessibility-runtime-css",
    "bizuply-accessibility-runtime-css-v2",
  ].forEach((id) => document.getElementById(id)?.remove());

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

/*
  IMPORTANT: never put filter/transform on <html>.
  That breaks position:fixed for the accessibility menu (panel jumps and closes).
  Filters apply to <body> only; the widget is portaled outside <body>.
*/
html[${HTML_ATTR}~="contrast-1"] body {
  filter: contrast(1.4) !important;
}

html[${HTML_ATTR}~="contrast-2"] body {
  background: #000 !important;
  filter: invert(0.92) hue-rotate(180deg) !important;
}
html[${HTML_ATTR}~="contrast-2"] body img,
html[${HTML_ATTR}~="contrast-2"] body video,
html[${HTML_ATTR}~="contrast-2"] body picture {
  filter: invert(0.92) hue-rotate(180deg) !important;
}

html[${HTML_ATTR}~="contrast-3"] body {
  filter: invert(1) hue-rotate(180deg) !important;
}
html[${HTML_ATTR}~="contrast-3"] body img,
html[${HTML_ATTR}~="contrast-3"] body video,
html[${HTML_ATTR}~="contrast-3"] body picture {
  filter: invert(1) hue-rotate(180deg) !important;
}

html[${HTML_ATTR}~="sat-1"] body {
  filter: saturate(1.7) !important;
}
html[${HTML_ATTR}~="sat-2"] body {
  filter: saturate(0.35) !important;
}
html[${HTML_ATTR}~="sat-3"] body {
  filter: grayscale(1) !important;
}

html[${HTML_ATTR}~="contrast-1"][${HTML_ATTR}~="sat-1"] body { filter: contrast(1.4) saturate(1.7) !important; }
html[${HTML_ATTR}~="contrast-1"][${HTML_ATTR}~="sat-2"] body { filter: contrast(1.4) saturate(0.35) !important; }
html[${HTML_ATTR}~="contrast-1"][${HTML_ATTR}~="sat-3"] body { filter: contrast(1.4) grayscale(1) !important; }
html[${HTML_ATTR}~="contrast-2"][${HTML_ATTR}~="sat-1"] body { filter: invert(0.92) hue-rotate(180deg) saturate(1.7) !important; }
html[${HTML_ATTR}~="contrast-2"][${HTML_ATTR}~="sat-2"] body { filter: invert(0.92) hue-rotate(180deg) saturate(0.35) !important; }
html[${HTML_ATTR}~="contrast-2"][${HTML_ATTR}~="sat-3"] body { filter: invert(0.92) hue-rotate(180deg) grayscale(1) !important; }
html[${HTML_ATTR}~="contrast-3"][${HTML_ATTR}~="sat-1"] body { filter: invert(1) hue-rotate(180deg) saturate(1.7) !important; }
html[${HTML_ATTR}~="contrast-3"][${HTML_ATTR}~="sat-2"] body { filter: invert(1) hue-rotate(180deg) saturate(0.35) !important; }
html[${HTML_ATTR}~="contrast-3"][${HTML_ATTR}~="sat-3"] body { filter: invert(1) hue-rotate(180deg) grayscale(1) !important; }

html[${HTML_ATTR}~="highlight-links"] a:not([data-bizuply-accessibility-widget] a) {
  outline: 3px solid #2563eb !important;
  outline-offset: 2px !important;
  text-decoration: underline !important;
  font-weight: 700 !important;
  background: rgba(37, 99, 235, 0.14) !important;
}

html[${HTML_ATTR}~="stop-animations"] *,
html[${HTML_ATTR}~="stop-animations"] *::before,
html[${HTML_ATTR}~="stop-animations"] *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}

html[${HTML_ATTR}~="hide-images"] img,
html[${HTML_ATTR}~="hide-images"] picture,
html[${HTML_ATTR}~="hide-images"] video,
html[${HTML_ATTR}~="hide-images"] svg:not([data-bizuply-accessibility-widget] svg) {
  visibility: hidden !important;
}
html[${HTML_ATTR}~="hide-images"] * {
  background-image: none !important;
}

html[${HTML_ATTR}~="dyslexia"],
html[${HTML_ATTR}~="dyslexia"] body,
html[${HTML_ATTR}~="dyslexia"] p,
html[${HTML_ATTR}~="dyslexia"] h1,
html[${HTML_ATTR}~="dyslexia"] h2,
html[${HTML_ATTR}~="dyslexia"] h3,
html[${HTML_ATTR}~="dyslexia"] h4,
html[${HTML_ATTR}~="dyslexia"] h5,
html[${HTML_ATTR}~="dyslexia"] h6,
html[${HTML_ATTR}~="dyslexia"] li,
html[${HTML_ATTR}~="dyslexia"] a,
html[${HTML_ATTR}~="dyslexia"] button,
html[${HTML_ATTR}~="dyslexia"] input,
html[${HTML_ATTR}~="dyslexia"] textarea,
html[${HTML_ATTR}~="dyslexia"] select {
  font-family: "Comic Sans MS", "OpenDyslexic", Arial, Helvetica, sans-serif !important;
  letter-spacing: 0.05em !important;
  word-spacing: 0.12em !important;
}

html[${HTML_ATTR}~="spacing-1"] body,
html[${HTML_ATTR}~="spacing-1"] p,
html[${HTML_ATTR}~="spacing-1"] li,
html[${HTML_ATTR}~="spacing-1"] a,
html[${HTML_ATTR}~="spacing-1"] span {
  letter-spacing: 0.06em !important;
  word-spacing: 0.1em !important;
}
html[${HTML_ATTR}~="spacing-2"] body,
html[${HTML_ATTR}~="spacing-2"] p,
html[${HTML_ATTR}~="spacing-2"] li,
html[${HTML_ATTR}~="spacing-2"] a,
html[${HTML_ATTR}~="spacing-2"] span {
  letter-spacing: 0.12em !important;
  word-spacing: 0.18em !important;
}
html[${HTML_ATTR}~="spacing-3"] body,
html[${HTML_ATTR}~="spacing-3"] p,
html[${HTML_ATTR}~="spacing-3"] li,
html[${HTML_ATTR}~="spacing-3"] a,
html[${HTML_ATTR}~="spacing-3"] span {
  letter-spacing: 0.18em !important;
  word-spacing: 0.28em !important;
}

html[${HTML_ATTR}~="line-1"] body,
html[${HTML_ATTR}~="line-1"] p,
html[${HTML_ATTR}~="line-1"] li {
  line-height: 1.7 !important;
}
html[${HTML_ATTR}~="line-2"] body,
html[${HTML_ATTR}~="line-2"] p,
html[${HTML_ATTR}~="line-2"] li {
  line-height: 2 !important;
}
html[${HTML_ATTR}~="line-3"] body,
html[${HTML_ATTR}~="line-3"] p,
html[${HTML_ATTR}~="line-3"] li {
  line-height: 2.4 !important;
}

html[${HTML_ATTR}~="large-cursor"],
html[${HTML_ATTR}~="large-cursor"] * {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='2' d='M8 4l28 18-12 3 6 13-5 2-6-13-9 8z'/%3E%3C/svg%3E") 4 4, auto !important;
}

html[${HTML_ATTR}~="text-align"] p,
html[${HTML_ATTR}~="text-align"] h1,
html[${HTML_ATTR}~="text-align"] h2,
html[${HTML_ATTR}~="text-align"] h3,
html[${HTML_ATTR}~="text-align"] h4,
html[${HTML_ATTR}~="text-align"] h5,
html[${HTML_ATTR}~="text-align"] h6,
html[${HTML_ATTR}~="text-align"] li,
html[${HTML_ATTR}~="text-align"] td,
html[${HTML_ATTR}~="text-align"] th,
html[${HTML_ATTR}~="text-align"] label,
html[${HTML_ATTR}~="text-align"] span {
  text-align: right !important;
}

html[${HTML_ATTR}~="descriptions"] [data-bizuply-a11y-desc]::after {
  content: attr(data-bizuply-a11y-desc);
  position: absolute;
  z-index: 2147483002;
  bottom: 100%;
  right: 0;
  margin-bottom: 6px;
  max-width: 260px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #1e293b;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
  white-space: normal;
  pointer-events: none;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
html[${HTML_ATTR}~="descriptions"] [data-bizuply-a11y-desc]:hover::after,
html[${HTML_ATTR}~="descriptions"] [data-bizuply-a11y-desc]:focus::after {
  opacity: 1;
  transform: translateY(0);
}
`;
  document.head.appendChild(style);
}

function clearDescriptionMarks() {
  if (typeof document === "undefined") return;
  document.querySelectorAll("[data-bizuply-a11y-desc]").forEach((el) => {
    el.removeAttribute("data-bizuply-a11y-desc");
    const htmlEl = el as HTMLElement;
    if (htmlEl.dataset.bizuplyA11yPos === "1") {
      htmlEl.style.position = "";
      delete htmlEl.dataset.bizuplyA11yPos;
    }
  });
}

function applyDescriptions(enabled: boolean) {
  if (typeof document === "undefined") return;
  clearDescriptionMarks();
  if (!enabled) return;

  if (!document.getElementById(DESC_STYLE_ID)) {
    // marker only — styles live in main runtime css
    const marker = document.createElement("meta");
    marker.id = DESC_STYLE_ID;
    document.head.appendChild(marker);
  }

  const nodes = document.querySelectorAll(
    "img[alt], a[title], a[aria-label], button[title], button[aria-label], [title]"
  );
  nodes.forEach((node) => {
    if (node.closest("[data-bizuply-accessibility-widget]")) return;
    const el = node as HTMLElement;
    const text =
      el.getAttribute("alt") ||
      el.getAttribute("aria-label") ||
      el.getAttribute("title") ||
      "";
    const clean = text.trim();
    if (!clean || clean.length < 2) return;
    el.setAttribute("data-bizuply-a11y-desc", clean);
    const computed = window.getComputedStyle(el).position;
    if (computed === "static") {
      el.style.position = "relative";
      el.dataset.bizuplyA11yPos = "1";
    }
  });
}

export function applyAccessibilityToDocument(state: AccessibilityVisitorState) {
  if (typeof document === "undefined") return;
  ensureRuntimeStyles();

  const tokens: string[] = [];
  if (state.highlightLinks) tokens.push("highlight-links");
  if (state.contrast === 1) tokens.push("contrast-1");
  if (state.contrast === 2) tokens.push("contrast-2");
  if (state.contrast === 3) tokens.push("contrast-3");
  if (state.textSpacing >= 1) tokens.push(`spacing-${state.textSpacing}`);
  if (state.largeText) tokens.push("large-text");
  if (state.hideImages) tokens.push("hide-images");
  if (state.stopAnimations) tokens.push("stop-animations");
  if (state.largeCursor) tokens.push("large-cursor");
  if (state.dyslexia) tokens.push("dyslexia");
  if (state.lineHeight >= 1) tokens.push(`line-${state.lineHeight}`);
  if (state.descriptions) tokens.push("descriptions");
  if (state.saturation === 1) tokens.push("sat-1");
  if (state.saturation === 2) tokens.push("sat-2");
  if (state.saturation === 3) tokens.push("sat-3");
  if (state.textAlign) tokens.push("text-align");

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

  applyDescriptions(state.descriptions);
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

export function cycleLevel(current: number, max = 3): number {
  const next = (asLevel(current, max) + 1) % (max + 1);
  return next;
}

export function isFeatureActive(
  state: AccessibilityVisitorState,
  key: AccessibilityFeatureKey
): boolean {
  const value = state[key];
  if (typeof value === "boolean") return value;
  return Number(value) > 0;
}

export function getFeatureLabel(
  key: AccessibilityFeatureKey,
  state: AccessibilityVisitorState,
  fallback: string
): string {
  if (key === "contrast") return CONTRAST_LABELS[state.contrast] || fallback;
  if (key === "saturation") return SATURATION_LABELS[state.saturation] || fallback;
  if (key === "textSpacing") return SPACING_LABELS[state.textSpacing] || fallback;
  if (key === "lineHeight") return LINE_HEIGHT_LABELS[state.lineHeight] || fallback;
  return fallback;
}
