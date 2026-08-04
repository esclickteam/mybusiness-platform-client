import {
  absoluteLayout,
  boxNode,
  buttonNode,
  imageNode,
  textNode,
} from "./libraryFactories";
import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type {
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";

type PortalKind =
  | "portal-login"
  | "portal-register"
  | "portal-account"
  | "portal-custom-data"
  | "portal-packages"
  | "portal-orders"
  | "portal-cart"
  | "portal-forgot-password"
  | "portal-reset-password";

type Theme = {
  name: string;
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  card: string;
  line: string;
  soft: string;
  photo: string;
};

/** Professional portal palettes — product UI, not brochure cream. */
const THEMES: Theme[] = [
  {
    name: "סלייט",
    bg: "#f1f5f9",
    ink: "#0f172a",
    muted: "#64748b",
    accent: "#0f766e",
    card: "#ffffff",
    line: "#e2e8f0",
    soft: "#f8fafc",
    photo: IMG.workspace,
  },
  {
    name: "אוקיינוס",
    bg: "#eef6f9",
    ink: "#0b1f2a",
    muted: "#5b7a8a",
    accent: "#0284c7",
    card: "#ffffff",
    line: "#d7e6ee",
    soft: "#f5fafc",
    photo: IMG.hospitality,
  },
  {
    name: "אזמרגד",
    bg: "#eef7f2",
    ink: "#052e16",
    muted: "#4b6356",
    accent: "#059669",
    card: "#ffffff",
    line: "#d5e8dc",
    soft: "#f4fbf7",
    photo: IMG.nature,
  },
  {
    name: "פחם",
    bg: "#0f172a",
    ink: "#f8fafc",
    muted: "#94a3b8",
    accent: "#38bdf8",
    card: "#1e293b",
    line: "#334155",
    soft: "#0b1220",
    photo: IMG.city,
  },
  {
    name: "אינדיגו",
    bg: "#eef2ff",
    ink: "#1e1b4b",
    muted: "#64748b",
    accent: "#4f46e5",
    card: "#ffffff",
    line: "#e0e7ff",
    soft: "#f8faff",
    photo: IMG.laptop,
  },
  {
    name: "נייבי",
    bg: "#e8eef7",
    ink: "#0a1628",
    muted: "#5b6b7c",
    accent: "#1d4ed8",
    card: "#ffffff",
    line: "#d5dee9",
    soft: "#f3f6fb",
    photo: IMG.meeting,
  },
  {
    name: "יער",
    bg: "#f0f4ef",
    ink: "#14532d",
    muted: "#4b5563",
    accent: "#15803d",
    card: "#ffffff",
    line: "#d6e0d6",
    soft: "#f6f9f6",
    photo: IMG.education,
  },
  {
    name: "קורל",
    bg: "#fff7ed",
    ink: "#1c1917",
    muted: "#78716c",
    accent: "#ea580c",
    card: "#ffffff",
    line: "#ffedd5",
    soft: "#fffaf5",
    photo: IMG.architecture,
  },
  {
    name: "גרפיט",
    bg: "#eceff1",
    ink: "#102027",
    muted: "#607d8b",
    accent: "#334155",
    card: "#ffffff",
    line: "#cfd8dc",
    soft: "#f5f7f8",
    photo: IMG.finance,
  },
  {
    name: "לילה",
    bg: "#020617",
    ink: "#f8fafc",
    muted: "#94a3b8",
    accent: "#22d3ee",
    card: "#0f172a",
    line: "#1e293b",
    soft: "#020617",
    photo: IMG.studio,
  },
];

/** Empty mount shell — live form is injected by mountPublicPortalWidgets / PortalWidgetPreview. */
function portalMount(
  key: string,
  widget: PortalKind,
  label: string,
  layout: ReturnType<typeof absoluteLayout>,
  theme: Theme,
  style: Record<string, any> = {},
): VisualLibraryNodeTemplate {
  return {
    ...boxNode(
      key,
      {
        backgroundColor: theme.card,
        borderRadius: "20px",
        border: `1px solid ${theme.line}`,
        boxShadow: "0 18px 40px -28px rgba(15,23,42,0.35)",
        overflow: "hidden",
        ...style,
      },
      layout,
      label,
    ),
    attributes: {
      "data-bizuply-widget": widget,
      "data-bizuply-portal-mount": "true",
      "data-bizuply-portal-kind": widget,
      "data-bizuply-portal-accent": theme.accent,
      "data-bizuply-portal-ink": theme.ink,
      "data-bizuply-portal-muted": theme.muted,
      "data-bizuply-portal-line": theme.line,
      "data-bizuply-portal-soft": theme.soft,
      ...(widget === "portal-login"
        ? {
            "data-portal-copy-eyebrow": "אזור אישי",
            "data-portal-copy-title": "התחברות",
            "data-portal-copy-subtitle":
              "הזינו את הפרטים שלכם כדי להיכנס לחשבון באתר.",
            "data-portal-copy-email": "אימייל",
            "data-portal-copy-password": "סיסמה",
            "data-portal-copy-submit": "התחברות",
            "data-portal-copy-switch": "אין לכם חשבון? הרשמה",
            "data-portal-copy-forgot": "שכחתי סיסמה",
          }
        : {}),
      ...(widget === "portal-register"
        ? {
            "data-portal-copy-eyebrow": "אזור אישי",
            "data-portal-copy-title": "הרשמה",
            "data-portal-copy-subtitle":
              "מלאו את הפרטים כדי לפתוח חשבון ולהמשיך באתר.",
            "data-portal-copy-name": "שם מלא",
            "data-portal-copy-email": "אימייל",
            "data-portal-copy-phone": "טלפון (אופציונלי)",
            "data-portal-copy-password": "סיסמה (לפחות 6 תווים)",
            "data-portal-copy-submit": "יצירת חשבון",
            "data-portal-copy-switch": "כבר רשומים? התחברות",
          }
        : {}),
      ...(widget === "portal-packages"
        ? {
            "data-portal-copy-eyebrow": "חבילות",
            "data-portal-copy-title": "בחרו חבילה",
            "data-portal-copy-subtitle":
              "לאחר התשלום בסליקה תיפתח הגישה לאזור האישי.",
            "data-portal-copy-submit": "לתשלום בסליקה",
            // Paste the business payment-page URL here (Cardcom / provider link).
            "data-bizuply-portal-payment-url": "",
          }
        : {}),
    },
  };
}

function makeSection(
  id: string,
  title: string,
  description: string,
  keywords: string[],
  theme: Theme,
  minHeight: string,
  nodes: VisualLibraryNodeTemplate[],
): VisualLibrarySectionTemplate {
  return {
    id,
    kind: "section",
    tab: "sections",
    category: "portal",
    title,
    description,
    keywords: ["אזור אישי", "portal", "אחרי התחברות", ...keywords],
    previewLayout: id,
    backgroundColor: theme.bg,
    minHeight,
    thumbnail: theme.photo,
    lockPalette: false,
    nodes,
  };
}

/** Small KPI / info card used in after-login dashboards. */
function metricCard(
  key: string,
  x: number,
  y: number,
  w: number,
  theme: Theme,
  label: string,
  value: string,
  hint = "",
): VisualLibraryNodeTemplate[] {
  const nodes: VisualLibraryNodeTemplate[] = [
    boxNode(
      `${key}-bg`,
      {
        backgroundColor: theme.card,
        borderRadius: "18px",
        border: `1px solid ${theme.line}`,
        boxShadow: "0 14px 28px -24px rgba(15,23,42,0.35)",
      },
      absoluteLayout(x, y, w, hint ? 118 : 100, 3),
      label,
    ),
    textNode(
      `${key}-label`,
      label,
      {
        color: theme.muted,
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.04em",
      },
      absoluteLayout(x + 18, y + 18, w - 36, 22, 4),
    ),
    textNode(
      `${key}-value`,
      value,
      { color: theme.ink, fontSize: "28px", fontWeight: "900" },
      absoluteLayout(x + 18, y + 44, w - 36, 36, 4),
    ),
  ];
  if (hint) {
    nodes.push(
      textNode(
        `${key}-hint`,
        hint,
        { color: theme.accent, fontSize: "12px", fontWeight: "700" },
        absoluteLayout(x + 18, y + 84, w - 36, 20, 4),
      ),
    );
  }
  return nodes;
}

function courseCard(
  key: string,
  x: number,
  y: number,
  w: number,
  theme: Theme,
  title: string,
  progressWidth: number,
  meta: string,
): VisualLibraryNodeTemplate[] {
  const fillW = Math.max(24, Math.min(w - 36, progressWidth));
  return [
    boxNode(
      `${key}-bg`,
      {
        backgroundColor: theme.card,
        borderRadius: "18px",
        border: `1px solid ${theme.line}`,
        boxShadow: "0 14px 28px -24px rgba(15,23,42,0.3)",
      },
      absoluteLayout(x, y, w, 132, 3),
      title,
    ),
    textNode(
      `${key}-title`,
      title,
      { color: theme.ink, fontSize: "16px", fontWeight: "900" },
      absoluteLayout(x + 18, y + 18, w - 36, 28, 4),
    ),
    textNode(
      `${key}-meta`,
      meta,
      { color: theme.muted, fontSize: "13px", fontWeight: "600" },
      absoluteLayout(x + 18, y + 50, w - 36, 22, 4),
    ),
    boxNode(
      `${key}-track`,
      { backgroundColor: theme.soft, borderRadius: "999px" },
      absoluteLayout(x + 18, y + 88, w - 36, 10, 4),
      "התקדמות",
    ),
    boxNode(
      `${key}-fill`,
      { backgroundColor: theme.accent, borderRadius: "999px" },
      absoluteLayout(x + 18, y + 88, fillW, 10, 5),
      "התקדמות",
    ),
  ];
}

function tableRow(
  key: string,
  x: number,
  y: number,
  w: number,
  theme: Theme,
  cols: [string, string, string, string],
  header = false,
): VisualLibraryNodeTemplate[] {
  const color = header ? theme.muted : theme.ink;
  const weight = header ? "800" : "700";
  const size = header ? "12px" : "14px";
  return [
    boxNode(
      `${key}-bg`,
      {
        backgroundColor: header ? theme.soft : theme.card,
        borderBottom: `1px solid ${theme.line}`,
      },
      absoluteLayout(x, y, w, 48, 3),
      cols[0],
    ),
    textNode(
      `${key}-c1`,
      cols[0],
      { color, fontSize: size, fontWeight: weight },
      absoluteLayout(x + 18, y + 14, 220, 22, 4),
    ),
    textNode(
      `${key}-c2`,
      cols[1],
      { color, fontSize: size, fontWeight: weight },
      absoluteLayout(x + 250, y + 14, 180, 22, 4),
    ),
    textNode(
      `${key}-c3`,
      cols[2],
      { color, fontSize: size, fontWeight: weight },
      absoluteLayout(x + 450, y + 14, 160, 22, 4),
    ),
    textNode(
      `${key}-c4`,
      cols[3],
      { color: header ? theme.muted : theme.accent, fontSize: size, fontWeight: "800" },
      absoluteLayout(x + 640, y + 14, 120, 22, 4),
    ),
  ];
}

function loginNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const lightOnDark = theme.bg === "#111827" || theme.bg === "#0b1220";
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    // Photo left + form right
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "0px" },
        absoluteLayout(0, 0, 520, "100%", 2),
        "אווירה",
      ),
      boxNode(
        "photo-veil",
        {
          background:
            "linear-gradient(90deg, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.05) 100%)",
        },
        absoluteLayout(0, 0, 520, "100%", 3),
        "שכבה",
      ),
      textNode(
        "photo-kicker",
        "ברוכים השבים",
        { color: "#ffffff", fontSize: "42px", fontWeight: "900", lineHeight: "1.1" },
        absoluteLayout(48, 250, 400, 80, 4),
      ),
      textNode(
        "photo-copy",
        "התחברות מאובטחת לאזור האישי של האתר.",
        { color: "rgba(255,255,255,0.85)", fontSize: "16px", fontWeight: "600", lineHeight: "1.6" },
        absoluteLayout(48, 340, 360, 60, 4),
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(580, 90, 460, 540, 5),
        theme,
        { minHeight: "520px" },
      ),
    ],
    // Form left + editorial text
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(72, 80, 460, 560, 4),
        theme,
        { minHeight: "540px" },
      ),
      textNode(
        "eyebrow",
        "אזור לקוחות",
        { color: theme.accent, fontSize: "13px", fontWeight: "800", letterSpacing: "0.04em" },
        absoluteLayout(600, 160, 420, 28, 3),
      ),
      textNode(
        "title",
        "כניסה לאזור האישי",
        { color: theme.ink, fontSize: "48px", fontWeight: "900", lineHeight: "1.05" },
        absoluteLayout(600, 200, 420, 110, 3),
      ),
      textNode(
        "subtitle",
        "הזמנות, פרטים אישיים והמשך רכישה — הכל במקום אחד.",
        { color: theme.muted, fontSize: "17px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(600, 330, 380, 90, 3),
      ),
      boxNode(
        "accent-bar",
        { backgroundColor: theme.accent, borderRadius: "999px" },
        absoluteLayout(600, 440, 72, 6, 3),
        "פס",
      ),
    ],
    // Centered card over soft photo wash
    () => [
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", filter: "saturate(0.9) brightness(0.92)" },
        absoluteLayout(0, 0, "100%", "100%", 1),
        "רקע",
      ),
      boxNode(
        "veil",
        {
          background: lightOnDark
            ? "rgba(8,12,20,0.72)"
            : "rgba(248,250,252,0.82)",
        },
        absoluteLayout(0, 0, "100%", "100%", 2),
        "שכבה",
      ),
      textNode(
        "title",
        "התחברות",
        {
          color: lightOnDark ? "#f8fafc" : theme.ink,
          fontSize: "40px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(300, 48, 500, 50, 3),
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(310, 120, 480, 520, 4),
        theme,
        { minHeight: "500px" },
      ),
    ],
    // Split ink band
    () => [
      boxNode(
        "left",
        { backgroundColor: theme.ink },
        absoluteLayout(0, 0, "44%", "100%", 1),
        "פס",
      ),
      boxNode(
        "right",
        { backgroundColor: theme.soft },
        absoluteLayout(460, 0, "56%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "שלום שוב",
        { color: "#f8fafc", fontSize: "46px", fontWeight: "900", lineHeight: "1.05" },
        absoluteLayout(56, 200, 340, 90, 3),
      ),
      textNode(
        "subtitle",
        "המשיכו מהמקום שבו עצרתם — הזמנות, עגלה ותוכן אישי.",
        { color: "#cbd5e1", fontSize: "16px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(56, 310, 320, 90, 3),
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(560, 90, 460, 540, 4),
        theme,
        { minHeight: "520px" },
      ),
    ],
    // Floating card + side photo strip
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "strip",
        theme.photo,
        { objectFit: "cover", borderRadius: "32px" },
        absoluteLayout(72, 72, 380, 576, 2),
        "תמונה",
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(520, 110, 500, 500, 4),
        theme,
        { minHeight: "480px" },
      ),
    ],
    // Compact editorial
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      boxNode(
        "frame",
        {
          backgroundColor: theme.card,
          borderRadius: "36px",
          border: `1px solid ${theme.line}`,
          boxShadow: "0 40px 90px -50px rgba(15,23,42,0.35)",
        },
        absoluteLayout(90, 70, 920, 580, 2),
        "מסגרת",
      ),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "28px" },
        absoluteLayout(120, 110, 360, 500, 3),
        "תמונה",
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(530, 120, 440, 480, 4),
        theme,
        { minHeight: "460px", boxShadow: "none", border: "0" },
      ),
    ],
    // Wide hero title + form
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "CLIENT PORTAL",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.12em" },
        absoluteLayout(80, 70, 400, 24, 2),
      ),
      textNode(
        "title",
        "התחברות ללקוחות",
        { color: theme.ink, fontSize: "54px", fontWeight: "900", lineHeight: "1" },
        absoluteLayout(80, 110, 620, 70, 2),
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(80, 220, 520, 420, 3),
        theme,
        { minHeight: "400px" },
      ),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "28px" },
        absoluteLayout(660, 160, 360, 480, 2),
        "תמונה",
      ),
    ],
    // Soft stacked center
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      boxNode(
        "glow",
        { backgroundColor: theme.accent, opacity: 0.12, borderRadius: "999px" },
        absoluteLayout(340, 40, 420, 180, 1),
        "הילה",
      ),
      textNode(
        "title",
        "ברוכים השבים",
        { color: theme.ink, fontSize: "42px", fontWeight: "900", textAlign: "center" },
        absoluteLayout(300, 70, 500, 56, 2),
      ),
      textNode(
        "subtitle",
        "הזינו פרטים כדי להיכנס לאזור האישי של האתר.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600", textAlign: "center" },
        absoluteLayout(300, 130, 500, 40, 2),
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(300, 190, 500, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
    ],
    // Asymmetric magazine
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "0 40px 40px 0" },
        absoluteLayout(0, 40, 480, 640, 2),
        "תמונה",
      ),
      textNode(
        "title",
        "כניסה מהירה",
        { color: theme.ink, fontSize: "44px", fontWeight: "900" },
        absoluteLayout(560, 90, 440, 60, 3),
      ),
      textNode(
        "subtitle",
        "טופס מקושר אוטומטית לעסק ולאתר הזה.",
        { color: theme.muted, fontSize: "16px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(560, 160, 400, 60, 3),
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(560, 240, 460, 420, 4),
        theme,
        { minHeight: "400px" },
      ),
    ],
    // Full-bleed dark with card
    () => [
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover" },
        absoluteLayout(0, 0, "100%", "100%", 1),
        "רקע",
      ),
      boxNode(
        "veil",
        { background: "linear-gradient(120deg, rgba(8,12,20,0.88) 20%, rgba(8,12,20,0.45) 100%)" },
        absoluteLayout(0, 0, "100%", "100%", 2),
        "שכבה",
      ),
      textNode(
        "title",
        "האזור האישי שלכם",
        { color: "#f8fafc", fontSize: "46px", fontWeight: "900", lineHeight: "1.05" },
        absoluteLayout(72, 180, 420, 100, 3),
      ),
      textNode(
        "subtitle",
        "התחברות ללקוחות האתר בלבד.",
        { color: "#cbd5e1", fontSize: "16px", fontWeight: "600" },
        absoluteLayout(72, 300, 360, 50, 3),
      ),
      portalMount(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(560, 100, 460, 520, 4),
        theme,
        { minHeight: "500px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function registerNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover" },
        absoluteLayout(0, 0, 500, "100%", 2),
        "תמונה",
      ),
      boxNode(
        "veil",
        { background: "linear-gradient(90deg, rgba(15,23,42,0.4), transparent)" },
        absoluteLayout(0, 0, 500, "100%", 3),
        "שכבה",
      ),
      textNode(
        "photo-title",
        "הצטרפו אלינו",
        { color: "#fff", fontSize: "42px", fontWeight: "900" },
        absoluteLayout(48, 260, 380, 70, 4),
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(560, 60, 480, 600, 5),
        theme,
        { minHeight: "580px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(72, 60, 480, 600, 4),
        theme,
        { minHeight: "580px" },
      ),
      textNode(
        "eyebrow",
        "הרשמה מהירה",
        { color: theme.accent, fontSize: "13px", fontWeight: "800" },
        absoluteLayout(620, 180, 400, 28, 3),
      ),
      textNode(
        "title",
        "צרו חשבון אישי",
        { color: theme.ink, fontSize: "46px", fontWeight: "900", lineHeight: "1.05" },
        absoluteLayout(620, 220, 400, 100, 3),
      ),
      textNode(
        "subtitle",
        "הפרטים נקלטים אוטומטית לאתר ולעסק הזה בלבד.",
        { color: theme.muted, fontSize: "16px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(620, 340, 360, 80, 3),
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "פתיחת חשבון",
        { color: theme.ink, fontSize: "40px", fontWeight: "900", textAlign: "center" },
        absoluteLayout(300, 40, 500, 50, 2),
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(300, 110, 500, 560, 3),
        theme,
        { minHeight: "540px" },
      ),
    ],
    () => [
      boxNode(
        "band",
        { backgroundColor: theme.accent },
        absoluteLayout(0, 0, "100%", 200, 1),
        "פס",
      ),
      boxNode(
        "body",
        { backgroundColor: theme.soft },
        absoluteLayout(0, 200, "100%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "הרשמה לאזור האישי",
        { color: "#ffffff", fontSize: "40px", fontWeight: "900" },
        absoluteLayout(80, 70, 520, 60, 3),
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(300, 120, 500, 560, 4),
        theme,
        { minHeight: "540px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "32px" },
        absoluteLayout(620, 80, 400, 560, 2),
        "תמונה",
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(80, 70, 480, 580, 3),
        theme,
        { minHeight: "560px" },
      ),
    ],
    () => [
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover" },
        absoluteLayout(0, 0, "100%", "100%", 1),
        "רקע",
      ),
      boxNode(
        "veil",
        { background: "rgba(248,250,252,0.88)" },
        absoluteLayout(0, 0, "100%", "100%", 2),
        "שכבה",
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(300, 70, 500, 580, 3),
        theme,
        { minHeight: "560px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "הצטרפות",
        { color: "#f8fafc", fontSize: "48px", fontWeight: "900" },
        absoluteLayout(72, 80, 400, 60, 2),
      ),
      textNode(
        "subtitle",
        "שם, אימייל וסיסמה — והלקוח נשמר אצלכם.",
        { color: "#cbd5e1", fontSize: "16px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(72, 150, 360, 70, 2),
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(520, 60, 500, 600, 3),
        theme,
        { minHeight: "580px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      boxNode(
        "card",
        {
          backgroundColor: theme.card,
          borderRadius: "36px",
          border: `1px solid ${theme.line}`,
          boxShadow: "0 36px 80px -48px rgba(15,23,42,0.4)",
        },
        absoluteLayout(100, 50, 900, 640, 2),
        "כרטיס",
      ),
      textNode(
        "title",
        "יצירת חשבון",
        { color: theme.ink, fontSize: "36px", fontWeight: "900" },
        absoluteLayout(140, 90, 360, 50, 3),
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(140, 150, 420, 500, 4),
        theme,
        { minHeight: "480px", boxShadow: "none", border: `1px solid ${theme.line}` },
      ),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "28px" },
        absoluteLayout(620, 120, 340, 520, 3),
        "תמונה",
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "NEW MEMBER",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.12em" },
        absoluteLayout(80, 70, 300, 24, 2),
      ),
      textNode(
        "title",
        "הרשמה לאתר",
        { color: theme.ink, fontSize: "50px", fontWeight: "900" },
        absoluteLayout(80, 110, 500, 70, 2),
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(80, 220, 500, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "28px" },
        absoluteLayout(640, 140, 380, 500, 2),
        "תמונה",
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "40px" },
        absoluteLayout(60, 60, 980, 220, 2),
        "באנר",
      ),
      portalMount(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(300, 200, 500, 500, 3),
        theme,
        { minHeight: "480px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function accountNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    // Dashboard: metrics + account panel
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "אזור אישי",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.08em" },
        absoluteLayout(64, 40, 280, 22, 2),
      ),
      textNode(
        "title",
        "לוח בקרה ללקוח",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 68, 520, 52, 2),
      ),
      textNode(
        "subtitle",
        "סיכום פעילות, הזמנות וגישה מהירה לחשבון.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.6" },
        absoluteLayout(64, 124, 480, 40, 2),
      ),
      ...metricCard("m1", 64, 180, 220, theme, "הזמנות פעילות", "3", "+1 השבוע"),
      ...metricCard("m2", 300, 180, 220, theme, "יתרת נקודות", "1,250", "מועדון לקוחות"),
      ...metricCard("m3", 536, 180, 220, theme, "קורסים פתוחים", "2", "בלימודים"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(780, 40, 320, 620, 3),
        theme,
        { minHeight: "600px" },
      ),
      boxNode(
        "table-shell",
        {
          backgroundColor: theme.card,
          borderRadius: "20px",
          border: `1px solid ${theme.line}`,
          overflow: "hidden",
        },
        absoluteLayout(64, 320, 692, 340, 2),
        "טבלת הזמנות",
      ),
      ...tableRow("th", 64, 320, 692, theme, ["מספר הזמנה", "סטטוס", "תאריך", "סכום"], true),
      ...tableRow("r1", 64, 368, 692, theme, ["#1042", "שולמה", "12.03.2026", "₪249"]),
      ...tableRow("r2", 64, 416, 692, theme, ["#1038", "בטיפול", "04.03.2026", "₪128"]),
      ...tableRow("r3", 64, 464, 692, theme, ["#1021", "נשלחה", "18.02.2026", "₪89"]),
      ...tableRow("r4", 64, 512, 692, theme, ["#1014", "הושלמה", "02.02.2026", "₪310"]),
    ],
    // Split: welcome + courses + panel
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "ברוכים השבים",
        { color: theme.ink, fontSize: "42px", fontWeight: "900" },
        absoluteLayout(64, 48, 480, 52, 2),
      ),
      textNode(
        "subtitle",
        "המשיכו מהמקום שעצרתם — קורסים, הזמנות ופרטים אישיים.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.65" },
        absoluteLayout(64, 108, 500, 48, 2),
      ),
      ...courseCard("c1", 64, 180, 340, theme, "יסודות השיווק הדיגיטלי", 210, "שיעור 4 מתוך 12"),
      ...courseCard("c2", 420, 180, 340, theme, "ניהול לקוחות בפורטל", 160, "שיעור 2 מתוך 8"),
      ...metricCard("m1", 64, 340, 230, theme, "שיעורים שהושלמו", "6"),
      ...metricCard("m2", 310, 340, 230, theme, "תעודות", "1"),
      ...metricCard("m3", 556, 340, 204, theme, "זמן לימוד", "4.5ש׳"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(780, 48, 320, 560, 3),
        theme,
        { minHeight: "540px" },
      ),
    ],
    // Dark header command center
    () => [
      boxNode("top", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", 200, 1), "פס"),
      boxNode("body", { backgroundColor: theme.bg }, absoluteLayout(0, 200, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "מרכז הלקוח",
        { color: "#ffffff", fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 56, 480, 52, 2),
      ),
      textNode(
        "subtitle",
        "נתונים אישיים · הזמנות · גישה מהירה",
        { color: "rgba(248,250,252,0.72)", fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 118, 480, 30, 2),
      ),
      ...metricCard("m1", 64, 160, 240, theme, "סטטוס מנוי", "פעיל", "מתחדש ב־01.09"),
      ...metricCard("m2", 320, 160, 240, theme, "תשלומים", "₪890", "3 חשבוניות"),
      ...metricCard("m3", 576, 160, 200, theme, "הודעות", "2", "חדשות"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(64, 300, 420, 360, 3),
        theme,
        { minHeight: "340px" },
      ),
      boxNode(
        "profile-card",
        {
          backgroundColor: theme.card,
          borderRadius: "20px",
          border: `1px solid ${theme.line}`,
        },
        absoluteLayout(510, 300, 570, 360, 2),
        "כרטיס פרטים",
      ),
      textNode(
        "p-title",
        "נתונים אישיים",
        { color: theme.ink, fontSize: "22px", fontWeight: "900" },
        absoluteLayout(540, 330, 300, 32, 3),
      ),
      textNode(
        "p1",
        "שם מלא · לקוח/ה לדוגמה",
        { color: theme.muted, fontSize: "14px", fontWeight: "700" },
        absoluteLayout(540, 380, 400, 24, 3),
      ),
      textNode(
        "p2",
        "אימייל · client@example.com",
        { color: theme.muted, fontSize: "14px", fontWeight: "700" },
        absoluteLayout(540, 416, 400, 24, 3),
      ),
      textNode(
        "p3",
        "טלפון · 050-0000000",
        { color: theme.muted, fontSize: "14px", fontWeight: "700" },
        absoluteLayout(540, 452, 400, 24, 3),
      ),
      textNode(
        "p4",
        "כתובת · תל אביב",
        { color: theme.muted, fontSize: "14px", fontWeight: "700" },
        absoluteLayout(540, 488, 400, 24, 3),
      ),
      buttonNode(
        "edit-btn",
        "עדכון פרטים",
        {
          color: "#fff",
          backgroundColor: theme.accent,
          borderRadius: "12px",
          fontWeight: "800",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(540, 540, 160, 44, 3),
        "/account",
      ),
    ],
    // Centered clean panel with side stats
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "החשבון שלי",
        { color: theme.ink, fontSize: "38px", fontWeight: "900", textAlign: "center" },
        absoluteLayout(300, 36, 500, 48, 2),
      ),
      ...metricCard("m1", 180, 100, 200, theme, "הזמנות", "12"),
      ...metricCard("m2", 400, 100, 200, theme, "עגלה", "₪180"),
      ...metricCard("m3", 620, 100, 200, theme, "מועדפים", "5"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(260, 230, 580, 430, 3),
        theme,
        { minHeight: "410px" },
      ),
    ],
    // Photo rail + account
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "22px" },
        absoluteLayout(48, 48, 360, 600, 2),
        "אווירה",
      ),
      textNode(
        "title",
        "הפורטל שלכם",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(440, 56, 520, 50, 2),
      ),
      textNode(
        "subtitle",
        "גישה מסודרת להזמנות, קורסים ופרטי חשבון.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600" },
        absoluteLayout(440, 116, 480, 40, 2),
      ),
      ...metricCard("m1", 440, 170, 200, theme, "סטטוס", "מחובר/ת"),
      ...metricCard("m2", 660, 170, 200, theme, "חבילה", "Premium"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(440, 300, 560, 340, 3),
        theme,
        { minHeight: "320px" },
      ),
    ],
    // Wide table focus
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "סקירת פעילות",
        { color: theme.ink, fontSize: "38px", fontWeight: "900" },
        absoluteLayout(64, 40, 480, 48, 2),
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(780, 40, 300, 280, 3),
        theme,
        { minHeight: "260px" },
      ),
      boxNode(
        "table-shell",
        {
          backgroundColor: theme.card,
          borderRadius: "20px",
          border: `1px solid ${theme.line}`,
          overflow: "hidden",
        },
        absoluteLayout(64, 110, 690, 280, 2),
        "טבלה",
      ),
      ...tableRow("th", 64, 110, 690, theme, ["פעולה", "ערוץ", "תאריך", "מצב"], true),
      ...tableRow("r1", 64, 158, 690, theme, ["רכישת קורס", "אתר", "היום", "הושלם"]),
      ...tableRow("r2", 64, 206, 690, theme, ["עדכון פרטים", "אזור אישי", "אתמול", "נשמר"]),
      ...tableRow("r3", 64, 254, 690, theme, ["הזמנה #1042", "חנות", "12.03", "שולמה"]),
      ...tableRow("r4", 64, 302, 690, theme, ["התחברות", "מובייל", "11.03", "מוצלח"]),
      ...courseCard("c1", 64, 420, 340, theme, "קורס מתקדם בניהול", 240, "78% הושלם"),
      ...courseCard("c2", 420, 420, 340, theme, "סדנת מכירות אונליין", 90, "22% הושלם"),
      ...metricCard("m1", 780, 350, 300, theme, "הודעות מערכת", "אין חדש", "הכול מעודכן"),
    ],
    // Soft cards grid
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "האזור האישי",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 48, 500, 50, 2),
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(64, 120, 420, 520, 3),
        theme,
        { minHeight: "500px" },
      ),
      ...metricCard("m1", 520, 120, 260, theme, "הזמנות ממתינות", "1", "לטיפול"),
      ...metricCard("m2", 800, 120, 260, theme, "פריטים בעגלה", "2", "₪180"),
      ...courseCard("c1", 520, 260, 540, theme, "מסלול למידה אישי", 280, "המשך משיעור 5"),
      boxNode(
        "note",
        {
          backgroundColor: theme.card,
          borderRadius: "18px",
          border: `1px solid ${theme.line}`,
        },
        absoluteLayout(520, 420, 540, 220, 2),
        "הודעה",
      ),
      textNode(
        "note-t",
        "טיפ ללקוח",
        { color: theme.ink, fontSize: "18px", fontWeight: "900" },
        absoluteLayout(548, 450, 400, 28, 3),
      ),
      textNode(
        "note-b",
        "כאן תוכלו לרכז הזמנות, קורסים ופרטים אישיים במקום אחד — מסודר ונגיש.",
        { color: theme.muted, fontSize: "14px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(548, 492, 480, 80, 3),
      ),
    ],
    // Ink canvas
    () => [
      boxNode("bg", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "פורטל לקוחות",
        { color: "#f8fafc", fontSize: "42px", fontWeight: "900" },
        absoluteLayout(64, 48, 520, 52, 2),
      ),
      textNode(
        "subtitle",
        "ממשק כהה לניהול חשבון, הזמנות ומסלולי למידה.",
        { color: "rgba(248,250,252,0.7)", fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 110, 520, 40, 2),
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(64, 180, 460, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
      ...metricCard("m1", 560, 180, 250, theme, "יתרה", "₪0"),
      ...metricCard("m2", 830, 180, 230, theme, "כרטיס אשראי", "•••• 4242"),
      ...courseCard("c1", 560, 320, 500, theme, "קורס דיגיטלי פעיל", 220, "בתהליך"),
      ...courseCard("c2", 560, 470, 500, theme, "ספריית תכנים", 120, "12 פריטים"),
    ],
    // Framed workspace
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      boxNode(
        "frame",
        {
          backgroundColor: theme.card,
          borderRadius: "28px",
          border: `1px solid ${theme.line}`,
          boxShadow: "0 28px 60px -40px rgba(15,23,42,0.28)",
        },
        absoluteLayout(48, 40, 1004, 640, 2),
        "מסגרת",
      ),
      textNode(
        "title",
        "דשבורד לקוח",
        { color: theme.ink, fontSize: "34px", fontWeight: "900" },
        absoluteLayout(84, 72, 400, 44, 3),
      ),
      ...metricCard("m1", 84, 140, 220, theme, "הזמנות", "8"),
      ...metricCard("m2", 320, 140, 220, theme, "קורסים", "3"),
      ...metricCard("m3", 556, 140, 220, theme, "מסמכים", "5"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(800, 72, 220, 560, 4),
        theme,
        { minHeight: "540px", boxShadow: "none" },
      ),
      boxNode(
        "table-shell",
        {
          backgroundColor: theme.soft,
          borderRadius: "16px",
          border: `1px solid ${theme.line}`,
          overflow: "hidden",
        },
        absoluteLayout(84, 280, 692, 360, 3),
        "טבלה",
      ),
      ...tableRow("th", 84, 280, 692, theme, ["פריט", "קטגוריה", "תאריך", "פעולה"], true),
      ...tableRow("r1", 84, 328, 692, theme, ["חשבונית 1042", "חיובים", "12.03", "הורדה"]),
      ...tableRow("r2", 84, 376, 692, theme, ["תעודת סיום", "קורסים", "01.03", "צפייה"]),
      ...tableRow("r3", 84, 424, 692, theme, ["הזמנה #1038", "חנות", "04.03", "מעקב"]),
      ...tableRow("r4", 84, 472, 692, theme, ["פרטי משלוח", "חשבון", "28.02", "עריכה"]),
      ...tableRow("r5", 84, 520, 692, theme, ["כרטיס אשראי", "תשלום", "20.02", "עדכון"]),
    ],
    // Compact sidebar style
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(48, 48, 340, 620, 3),
        theme,
        { minHeight: "600px" },
      ),
      textNode(
        "title",
        "סקירה מהירה",
        { color: theme.ink, fontSize: "36px", fontWeight: "900" },
        absoluteLayout(420, 56, 520, 48, 2),
      ),
      ...metricCard("m1", 420, 130, 200, theme, "הזמנות", "3"),
      ...metricCard("m2", 640, 130, 200, theme, "קורסים", "2"),
      ...metricCard("m3", 860, 130, 180, theme, "הודעות", "0"),
      ...courseCard("c1", 420, 270, 620, theme, "קורס דיגיטלי — שיווק", 300, "כמעט בסיום"),
      ...courseCard("c2", 420, 430, 620, theme, "סדנת שירות לקוחות", 140, "בתחילת הדרך"),
    ],
  ];
  return layouts[index % layouts.length]();
}

function ordersNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "היסטוריית רכישות",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.06em" },
        absoluteLayout(64, 36, 320, 22, 2),
      ),
      textNode(
        "title",
        "ההזמנות שלי",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 64, 480, 52, 2),
      ),
      textNode(
        "subtitle",
        "טבלת הזמנות מסודרת עם סטטוס, תאריך וסכום — ללקוח המחובר.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.65" },
        absoluteLayout(64, 124, 560, 44, 2),
      ),
      ...metricCard("m1", 640, 48, 140, theme, "הכל", "12"),
      ...metricCard("m2", 796, 48, 140, theme, "פתוחות", "2"),
      ...metricCard("m3", 952, 48, 120, theme, "הושלמו", "10"),
      boxNode(
        "table-shell",
        {
          backgroundColor: theme.card,
          borderRadius: "20px",
          border: `1px solid ${theme.line}`,
          overflow: "hidden",
        },
        absoluteLayout(64, 190, 700, 460, 2),
        "טבלת הזמנות",
      ),
      ...tableRow("th", 64, 190, 700, theme, ["הזמנה", "סטטוס", "תאריך", "סכום"], true),
      ...tableRow("r1", 64, 238, 700, theme, ["#1042", "שולמה", "12.03.2026", "₪249"]),
      ...tableRow("r2", 64, 286, 700, theme, ["#1038", "בטיפול", "04.03.2026", "₪128"]),
      ...tableRow("r3", 64, 334, 700, theme, ["#1021", "נשלחה", "18.02.2026", "₪89"]),
      ...tableRow("r4", 64, 382, 700, theme, ["#1014", "הושלמה", "02.02.2026", "₪310"]),
      ...tableRow("r5", 64, 430, 700, theme, ["#1008", "הושלמה", "15.01.2026", "₪175"]),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(792, 190, 280, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
    ],
    () => [
      boxNode(
        "top",
        { backgroundColor: theme.ink },
        absoluteLayout(0, 0, "100%", 160, 1),
        "פס",
      ),
      boxNode(
        "body",
        { backgroundColor: theme.soft },
        absoluteLayout(0, 160, "100%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "הזמנות קודמות",
        { color: "#ffffff", fontSize: "38px", fontWeight: "900" },
        absoluteLayout(72, 55, 480, 50, 2),
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(72, 120, 960, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        IMG.ecommerce,
        { objectFit: "cover", borderRadius: "28px" },
        absoluteLayout(72, 80, 360, 520, 2),
        "חנות",
      ),
      textNode(
        "title",
        "היסטוריית רכישות",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(480, 80, 520, 56, 2),
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(480, 160, 540, 440, 3),
        theme,
        { minHeight: "420px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "הזמנות",
        { color: theme.ink, fontSize: "40px", fontWeight: "900", textAlign: "center" },
        absoluteLayout(300, 40, 500, 50, 2),
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(160, 120, 780, 480, 3),
        theme,
        { minHeight: "460px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "הזמנות",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.08em" },
        absoluteLayout(72, 50, 200, 24, 2),
      ),
      textNode(
        "title",
        "כל ההזמנות במקום אחד",
        { color: theme.ink, fontSize: "42px", fontWeight: "900" },
        absoluteLayout(72, 90, 700, 56, 2),
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(72, 180, 960, 440, 3),
        theme,
        { minHeight: "420px" },
      ),
    ],
    () => [
      imageNode(
        "photo",
        IMG.product,
        { objectFit: "cover" },
        absoluteLayout(0, 0, "100%", "100%", 1),
        "רקע",
      ),
      boxNode(
        "veil",
        { background: "rgba(248,250,252,0.9)" },
        absoluteLayout(0, 0, "100%", "100%", 2),
        "שכבה",
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(140, 100, 820, 480, 3),
        theme,
        { minHeight: "460px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "ההזמנות שלי",
        { color: "#f8fafc", fontSize: "42px", fontWeight: "900" },
        absoluteLayout(72, 60, 480, 56, 2),
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(72, 150, 960, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      boxNode(
        "frame",
        {
          backgroundColor: theme.card,
          borderRadius: "36px",
          border: `1px solid ${theme.line}`,
          boxShadow: "0 36px 80px -48px rgba(15,23,42,0.3)",
        },
        absoluteLayout(70, 50, 960, 600, 2),
        "מסגרת",
      ),
      textNode(
        "title",
        "הזמנות קודמות",
        { color: theme.ink, fontSize: "34px", fontWeight: "900" },
        absoluteLayout(110, 90, 480, 48, 3),
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(110, 160, 880, 440, 4),
        theme,
        { minHeight: "420px", boxShadow: "none" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(200, 80, 700, 520, 3),
        theme,
        { minHeight: "500px" },
      ),
    ],
    () => [
      boxNode(
        "band",
        { backgroundColor: theme.accent },
        absoluteLayout(0, 0, "100%", 140, 1),
        "פס",
      ),
      boxNode(
        "body",
        { backgroundColor: theme.bg },
        absoluteLayout(0, 140, "100%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "הזמנות",
        { color: "#ffffff", fontSize: "36px", fontWeight: "900" },
        absoluteLayout(72, 48, 400, 48, 2),
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(72, 110, 960, 480, 3),
        theme,
        { minHeight: "460px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function cartNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "העגלה שלי",
        { color: theme.ink, fontSize: "44px", fontWeight: "900" },
        absoluteLayout(72, 50, 420, 56, 2),
      ),
      textNode(
        "subtitle",
        "המשך רכישה מהעגלה הפעילה באתר.",
        { color: theme.muted, fontSize: "16px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(72, 120, 520, 50, 2),
      ),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(72, 200, 960, 400, 3),
        theme,
        { minHeight: "380px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(72, 80, 560, 520, 3),
        theme,
        { minHeight: "500px" },
      ),
      textNode(
        "title",
        "סיכום רכישה",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(700, 160, 320, 60, 2),
      ),
      textNode(
        "subtitle",
        "העגלה נשמרת לאתר הזה וממשיכה לתשלום.",
        { color: theme.muted, fontSize: "16px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(700, 240, 300, 80, 2),
      ),
    ],
    () => [
      boxNode(
        "band",
        { backgroundColor: theme.accent },
        absoluteLayout(0, 0, "100%", 140, 1),
        "פס",
      ),
      boxNode(
        "body",
        { backgroundColor: theme.soft },
        absoluteLayout(0, 140, "100%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "עגלת קניות",
        { color: "#ffffff", fontSize: "36px", fontWeight: "900" },
        absoluteLayout(72, 48, 420, 48, 2),
      ),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(72, 110, 960, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "העגלה",
        { color: theme.ink, fontSize: "40px", fontWeight: "900", textAlign: "center" },
        absoluteLayout(300, 40, 500, 50, 2),
      ),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(200, 120, 700, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        IMG.product,
        { objectFit: "cover", borderRadius: "28px" },
        absoluteLayout(660, 80, 360, 520, 2),
        "מוצר",
      ),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(72, 80, 540, 520, 3),
        theme,
        { minHeight: "500px" },
      ),
    ],
    () => [
      imageNode(
        "photo",
        IMG.ecommerce,
        { objectFit: "cover" },
        absoluteLayout(0, 0, "100%", "100%", 1),
        "רקע",
      ),
      boxNode(
        "veil",
        { background: "rgba(15,23,42,0.55)" },
        absoluteLayout(0, 0, "100%", "100%", 2),
        "שכבה",
      ),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(240, 100, 620, 480, 3),
        theme,
        { minHeight: "460px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "העגלה שלכם",
        { color: "#f8fafc", fontSize: "42px", fontWeight: "900" },
        absoluteLayout(72, 60, 480, 56, 2),
      ),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(72, 150, 960, 440, 3),
        theme,
        { minHeight: "420px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      boxNode(
        "frame",
        {
          backgroundColor: theme.card,
          borderRadius: "36px",
          border: `1px solid ${theme.line}`,
          boxShadow: "0 36px 80px -48px rgba(15,23,42,0.3)",
        },
        absoluteLayout(80, 50, 940, 580, 2),
        "מסגרת",
      ),
      textNode(
        "title",
        "עגלת קניות",
        { color: theme.ink, fontSize: "34px", fontWeight: "900" },
        absoluteLayout(120, 90, 400, 48, 3),
      ),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(120, 160, 860, 420, 4),
        theme,
        { minHeight: "400px", boxShadow: "none" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "CHECKOUT",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.12em" },
        absoluteLayout(72, 50, 240, 24, 2),
      ),
      textNode(
        "title",
        "מוכנים לתשלום?",
        { color: theme.ink, fontSize: "42px", fontWeight: "900" },
        absoluteLayout(72, 90, 560, 56, 2),
      ),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(72, 180, 960, 420, 3),
        theme,
        { minHeight: "400px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(220, 80, 660, 520, 3),
        theme,
        { minHeight: "500px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

/**
 * Password-recovery layouts. Deliberately calmer than the login designs:
 * one reassuring column plus the form, so the visitor is not distracted.
 */
function passwordNodes(
  theme: Theme,
  index: number,
  widget: Extract<
    PortalKind,
    "portal-forgot-password" | "portal-reset-password"
  >,
  copy: { kicker: string; body: string; formLabel: string },
): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    // Centered card over a soft background
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "kicker",
        copy.kicker,
        {
          color: theme.ink,
          fontSize: "38px",
          fontWeight: "900",
          lineHeight: "1.15",
          textAlign: "center",
        },
        absoluteLayout(220, 70, 680, 60, 3),
      ),
      textNode(
        "copy",
        copy.body,
        {
          color: theme.muted,
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "1.7",
          textAlign: "center",
        },
        absoluteLayout(260, 140, 600, 60, 3),
      ),
      portalMount(
        "form",
        widget,
        copy.formLabel,
        absoluteLayout(330, 220, 460, 420, 4),
        theme,
        { minHeight: "400px" },
      ),
    ],
    // Photo banner on top, form under it
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "0px" },
        absoluteLayout(0, 0, "100%", 260, 2),
        "אווירה",
      ),
      boxNode(
        "photo-veil",
        { background: "linear-gradient(180deg, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.1) 100%)" },
        absoluteLayout(0, 0, "100%", 260, 3),
        "שכבה",
      ),
      textNode(
        "kicker",
        copy.kicker,
        { color: "#ffffff", fontSize: "40px", fontWeight: "900", lineHeight: "1.1" },
        absoluteLayout(60, 100, 560, 70, 4),
      ),
      portalMount(
        "form",
        widget,
        copy.formLabel,
        absoluteLayout(300, 300, 520, 400, 5),
        theme,
        { minHeight: "380px" },
      ),
    ],
    // Side-by-side: reassurance text left, form right
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      boxNode(
        "panel",
        { backgroundColor: theme.soft, borderRadius: "32px", border: `1px solid ${theme.line}` },
        absoluteLayout(60, 80, 440, 480, 2),
        "פאנל",
      ),
      textNode(
        "kicker",
        copy.kicker,
        { color: theme.ink, fontSize: "34px", fontWeight: "900", lineHeight: "1.2" },
        absoluteLayout(100, 140, 360, 90, 3),
      ),
      textNode(
        "copy",
        copy.body,
        { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(100, 250, 360, 120, 3),
      ),
      portalMount(
        "form",
        widget,
        copy.formLabel,
        absoluteLayout(560, 80, 480, 480, 4),
        theme,
        { minHeight: "460px" },
      ),
    ],
  ];

  return layouts[index % layouts.length]();
}

function buildForgotPasswordSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-forgot-password-${String(index + 1).padStart(2, "0")}`,
      `שכחתי סיסמה — ${theme.name}`,
      "בקשת קישור לאיפוס סיסמה, נשלח במייל ללקוח האתר",
      [
        "forgot",
        "שכחתי סיסמה",
        "איפוס",
        "password",
        "portal-forgot-password",
      ],
      theme,
      "660px",
      passwordNodes(theme, index, "portal-forgot-password", {
        kicker: "שכחתם סיסמה?",
        body: "הזינו את האימייל שאיתו נרשמתם ונשלח קישור לבחירת סיסמה חדשה.",
        formLabel: "טופס שכחתי סיסמה",
      }),
    ),
  );
}

function buildResetPasswordSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-reset-password-${String(index + 1).padStart(2, "0")}`,
      `סיסמה חדשה — ${theme.name}`,
      "עמוד בחירת סיסמה חדשה מתוך הקישור שנשלח במייל",
      [
        "reset",
        "סיסמה חדשה",
        "איפוס סיסמה",
        "password",
        "portal-reset-password",
      ],
      theme,
      "660px",
      passwordNodes(theme, index, "portal-reset-password", {
        kicker: "בחירת סיסמה חדשה",
        body: "בחרו סיסמה חדשה לאזור האישי. הקישור תקף לזמן מוגבל.",
        formLabel: "טופס סיסמה חדשה",
      }),
    ),
  );
}

function buildLoginSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-login-${String(index + 1).padStart(2, "0")}`,
      `התחברות — ${theme.name}`,
      "טופס התחברות מקושר לאתר ולעסק",
      ["login", "התחברות", "טופס", "portal-login"],
      theme,
      "720px",
      loginNodes(theme, index),
    ),
  );
}

function buildRegisterSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-register-${String(index + 1).padStart(2, "0")}`,
      `הרשמה — ${theme.name}`,
      "טופס הרשמה שנקלט אוטומטית לאזור האישי של האתר",
      ["register", "הרשמה", "טופס", "portal-register"],
      theme,
      "760px",
      registerNodes(theme, index),
    ),
  );
}

function buildAccountSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-account-${String(index + 1).padStart(2, "0")}`,
      `אזור אישי — ${theme.name}`,
      "עמוד אחרי התחברות עם חשבון, הזמנות ועגלה",
      ["account", "אזור אישי", "חשבון", "portal-account"],
      theme,
      "700px",
      accountNodes(theme, index),
    ),
  );
}

function buildOrdersSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-orders-${String(index + 1).padStart(2, "0")}`,
      `הזמנות — ${theme.name}`,
      "רשימת הזמנות קודמות ללקוח המחובר",
      ["orders", "הזמנות", "portal-orders"],
      theme,
      "700px",
      ordersNodes(theme, index),
    ),
  );
}

function buildCartSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-cart-${String(index + 1).padStart(2, "0")}`,
      `עגלה — ${theme.name}`,
      "עגלת קניות באמצע רכישה",
      ["cart", "עגלה", "portal-cart"],
      theme,
      "680px",
      cartNodes(theme, index),
    ),
  );
}

function coursesNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "למידה דיגיטלית",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.08em" },
        absoluteLayout(64, 40, 320, 22, 2),
      ),
      textNode(
        "title",
        "הקורסים שלי",
        { color: theme.ink, fontSize: "42px", fontWeight: "900" },
        absoluteLayout(64, 70, 520, 52, 2),
      ),
      textNode(
        "subtitle",
        "מסלולי לימוד, התקדמות ותעודות — במבט אחד.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 130, 520, 36, 2),
      ),
      ...courseCard("c1", 64, 190, 340, theme, "יסודות השיווק הדיגיטלי", 240, "שיעור 8/12"),
      ...courseCard("c2", 420, 190, 340, theme, "ניהול לקוחות בפורטל", 160, "שיעור 3/8"),
      ...courseCard("c3", 776, 190, 280, theme, "מכירות אונליין", 80, "שיעור 1/10"),
      ...courseCard("c4", 64, 350, 500, theme, "מיתוג אישי לעסקים", 300, "כמעט בסיום"),
      ...courseCard("c5", 580, 350, 476, theme, "אוטומציה ושירות", 120, "בתחילת הדרך"),
      ...metricCard("m1", 64, 520, 240, theme, "שעות לימוד", "18.5"),
      ...metricCard("m2", 320, 520, 240, theme, "תעודות", "2"),
      ...metricCard("m3", 576, 520, 240, theme, "משימות פתוחות", "4"),
      ...metricCard("m4", 832, 520, 224, theme, "רצף ימים", "6"),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        IMG.education,
        { objectFit: "cover", borderRadius: "22px" },
        absoluteLayout(64, 64, 380, 560, 2),
        "לימודים",
      ),
      textNode(
        "title",
        "אקדמיית הלקוח",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(480, 64, 560, 50, 2),
      ),
      ...courseCard("c1", 480, 140, 560, theme, "קורס מתקדם בניהול", 280, "78% הושלם"),
      ...courseCard("c2", 480, 300, 560, theme, "סדנת שירות לקוחות", 150, "35% הושלם"),
      ...courseCard("c3", 480, 460, 560, theme, "מדריך מוצרים דיגיטליים", 60, "12% הושלם"),
    ],
    () => [
      boxNode("top", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", 180, 1), "פס"),
      boxNode("body", { backgroundColor: theme.bg }, absoluteLayout(0, 180, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "ספריית קורסים",
        { color: "#fff", fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 56, 520, 50, 2),
      ),
      textNode(
        "subtitle",
        "גישה לתכנים שנרכשו או הוענקו ללקוח.",
        { color: "rgba(248,250,252,0.72)", fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 118, 520, 30, 2),
      ),
      ...courseCard("c1", 64, 210, 340, theme, "קורס פתיחה", 200, "פעיל"),
      ...courseCard("c2", 420, 210, 340, theme, "קורס ביניים", 140, "פעיל"),
      ...courseCard("c3", 776, 210, 280, theme, "קורס מתקדם", 40, "נעול"),
      boxNode(
        "table-shell",
        {
          backgroundColor: theme.card,
          borderRadius: "20px",
          border: `1px solid ${theme.line}`,
          overflow: "hidden",
        },
        absoluteLayout(64, 380, 992, 250, 2),
        "טבלת שיעורים",
      ),
      ...tableRow("th", 64, 380, 992, theme, ["שיעור", "קורס", "משך", "סטטוס"], true),
      ...tableRow("r1", 64, 428, 992, theme, ["פתיחת קמפיין", "שיווק", "18 דק׳", "הושלם"]),
      ...tableRow("r2", 64, 476, 992, theme, ["ניהול לידים", "פורטל", "22 דק׳", "בתהליך"]),
      ...tableRow("r3", 64, 524, 992, theme, ["אוטומציות", "שירות", "15 דק׳", "ממתין"]),
    ],
  ];
  return layouts[index % layouts.length]();
}

function profileNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "נתונים אישיים",
        { color: theme.ink, fontSize: "42px", fontWeight: "900" },
        absoluteLayout(64, 48, 520, 52, 2),
      ),
      textNode(
        "subtitle",
        "פרופיל מחובר ל-CRM: פרטי קשר + נתונים משתנים מהתיק.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 110, 560, 40, 2),
      ),
      boxNode(
        "card",
        {
          backgroundColor: theme.card,
          borderRadius: "22px",
          border: `1px solid ${theme.line}`,
          boxShadow: "0 18px 40px -30px rgba(15,23,42,0.3)",
        },
        absoluteLayout(64, 170, 520, 460, 2),
        "כרטיס פרטים",
      ),
      textNode("f1l", "שם מלא", { color: theme.muted, fontSize: "12px", fontWeight: "800" }, absoluteLayout(96, 210, 200, 20, 3)),
      textNode("f1v", "לקוח/ה לדוגמה", { color: theme.ink, fontSize: "18px", fontWeight: "800" }, absoluteLayout(96, 234, 400, 28, 3)),
      textNode("f2l", "אימייל", { color: theme.muted, fontSize: "12px", fontWeight: "800" }, absoluteLayout(96, 290, 200, 20, 3)),
      textNode("f2v", "client@example.com", { color: theme.ink, fontSize: "18px", fontWeight: "800" }, absoluteLayout(96, 314, 400, 28, 3)),
      textNode("f3l", "טלפון", { color: theme.muted, fontSize: "12px", fontWeight: "800" }, absoluteLayout(96, 370, 200, 20, 3)),
      textNode("f3v", "050-0000000", { color: theme.ink, fontSize: "18px", fontWeight: "800" }, absoluteLayout(96, 394, 400, 28, 3)),
      textNode("f4l", "כתובת", { color: theme.muted, fontSize: "12px", fontWeight: "800" }, absoluteLayout(96, 450, 200, 20, 3)),
      textNode("f4v", "תל אביב, ישראל", { color: theme.ink, fontSize: "18px", fontWeight: "800" }, absoluteLayout(96, 474, 400, 28, 3)),
      buttonNode(
        "save",
        "שמירת פרטים",
        {
          color: "#fff",
          backgroundColor: theme.accent,
          borderRadius: "12px",
          fontWeight: "800",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(96, 540, 180, 46, 3),
        "/account",
      ),
      portalMount(
        "custom-data",
        "portal-custom-data",
        "נתונים משתנים מה-CRM",
        absoluteLayout(620, 170, 420, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(64, 64, 360, 560, 3),
        theme,
        { minHeight: "540px" },
      ),
      textNode(
        "title",
        "מדדים מהתיק",
        { color: theme.ink, fontSize: "38px", fontWeight: "900" },
        absoluteLayout(460, 64, 560, 48, 2),
      ),
      textNode(
        "subtitle",
        "הערכים מתעדכנים אוטומטית לפי מה שמולא בתיק הלקוח ב-CRM.",
        { color: theme.muted, fontSize: "14px", fontWeight: "600" },
        absoluteLayout(460, 118, 560, 36, 2),
      ),
      portalMount(
        "custom-data",
        "portal-custom-data",
        "נתונים משתנים",
        absoluteLayout(460, 170, 600, 300, 3),
        theme,
        { minHeight: "280px" },
      ),
      ...metricCard("m1", 460, 500, 290, theme, "סנכרון", "CRM חי"),
      ...metricCard("m2", 770, 500, 290, theme, "עדכון", "בזמן אמת"),
    ],
    () => [
      boxNode(
        "bg",
        {
          backgroundImage: `linear-gradient(145deg, ${theme.ink} 0%, ${theme.accent}55 55%, ${theme.soft} 100%)`,
        },
        absoluteLayout(0, 0, "100%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "לוח נתונים אישי",
        { color: "#f8fafc", fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 48, 640, 50, 2),
      ),
      textNode(
        "subtitle",
        "משקל · טיפולים · יתרה · מפגשים — כל מה שהעסק הגדיר.",
        { color: "#e2e8f0", fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 108, 700, 36, 2),
      ),
      portalMount(
        "custom-data",
        "portal-custom-data",
        "נתונים משתנים",
        absoluteLayout(64, 170, 700, 420, 3),
        theme,
        { minHeight: "400px" },
      ),
      ...metricCard("m1", 800, 170, 240, theme, "סטטוס", "פעיל"),
      ...metricCard("m2", 800, 320, 240, theme, "חבילה", "Premium"),
      ...metricCard("m3", 800, 470, 240, theme, "עדכון אחרון", "היום"),
    ],
  ];
  return layouts[index % layouts.length]();
}

function customDataNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "CRM · נתונים משתנים",
        { color: theme.accent, fontSize: "13px", fontWeight: "800", letterSpacing: "0.08em" },
        absoluteLayout(64, 48, 400, 24, 2),
      ),
      textNode(
        "title",
        "הנתונים שלי",
        { color: theme.ink, fontSize: "44px", fontWeight: "900" },
        absoluteLayout(64, 84, 560, 56, 2),
      ),
      textNode(
        "subtitle",
        "ווידג׳ט חי שמציג את הערכים מתיק הלקוח — בדיוק איפה שתשימו אותו בעמוד.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(64, 150, 520, 56, 2),
      ),
      portalMount(
        "custom-data",
        "portal-custom-data",
        "נתונים משתנים",
        absoluteLayout(64, 230, 640, 380, 3),
        theme,
        { minHeight: "360px" },
      ),
      ...metricCard("m1", 740, 230, 300, theme, "מקור", "תיק לקוח"),
      ...metricCard("m2", 740, 370, 300, theme, "הגדרה", "ב-CRM"),
      ...metricCard("m3", 740, 510, 300, theme, "תצוגה", "אזור אישי"),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "custom-data",
        "portal-custom-data",
        "נתונים משתנים",
        absoluteLayout(120, 80, 880, 520, 3),
        theme,
        { minHeight: "500px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "מעקב אישי",
        { color: "#f8fafc", fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 56, 480, 50, 2),
      ),
      portalMount(
        "custom-data",
        "portal-custom-data",
        "נתונים משתנים",
        absoluteLayout(64, 140, 560, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
      portalMount(
        "account",
        "portal-account",
        "חשבון",
        absoluteLayout(660, 140, 380, 460, 3),
        theme,
        { minHeight: "440px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}


function packageTierCard(
  key: string,
  x: number,
  y: number,
  w: number,
  h: number,
  theme: Theme,
  name: string,
  price: string,
  period: string,
  features: string[],
  featured: boolean,
  paymentHref: string,
): VisualLibraryNodeTemplate[] {
  const bg = featured ? theme.ink : theme.card;
  const fg = featured ? "#f8fafc" : theme.ink;
  const muted = featured ? "rgba(248,250,252,0.7)" : theme.muted;
  const nodes: VisualLibraryNodeTemplate[] = [
    boxNode(
      `${key}-bg`,
      {
        backgroundColor: bg,
        borderRadius: "22px",
        border: featured ? "0" : `1px solid ${theme.line}`,
        boxShadow: featured
          ? "0 28px 50px -30px rgba(15,23,42,0.55)"
          : "0 14px 28px -24px rgba(15,23,42,0.3)",
      },
      absoluteLayout(x, y, w, h, 3),
      name,
    ),
  ];
  if (featured) {
    nodes.push(
      textNode(
        `${key}-badge`,
        "הכי פופולרי",
        {
          color: theme.accent,
          fontSize: "12px",
          fontWeight: "800",
          letterSpacing: "0.04em",
        },
        absoluteLayout(x + 24, y + 22, w - 48, 20, 4),
      ),
    );
  }
  nodes.push(
    textNode(
      `${key}-name`,
      name,
      { color: fg, fontSize: "20px", fontWeight: "900" },
      absoluteLayout(x + 24, y + (featured ? 48 : 28), w - 48, 28, 4),
    ),
    textNode(
      `${key}-price`,
      price,
      { color: fg, fontSize: "40px", fontWeight: "900", letterSpacing: "-0.03em" },
      absoluteLayout(x + 24, y + (featured ? 88 : 68), w - 48, 48, 4),
    ),
    textNode(
      `${key}-period`,
      period,
      { color: muted, fontSize: "13px", fontWeight: "600" },
      absoluteLayout(x + 24, y + (featured ? 140 : 120), w - 48, 22, 4),
    ),
  );
  features.forEach((feature, index) => {
    nodes.push(
      textNode(
        `${key}-f${index}`,
        `✓  ${feature}`,
        { color: muted, fontSize: "14px", fontWeight: "600" },
        absoluteLayout(x + 24, y + (featured ? 178 : 158) + index * 28, w - 48, 24, 4),
      ),
    );
  });
  nodes.push(
    buttonNode(
      `${key}-cta`,
      "לתשלום בסליקה",
      {
        color: featured ? theme.ink : "#fff",
        backgroundColor: featured ? "#fff" : theme.accent,
        borderRadius: "14px",
        fontWeight: "800",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      absoluteLayout(x + 24, y + h - 70, w - 48, 46, 4),
      paymentHref,
    ),
  );
  return nodes;
}

function packagesNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const paymentHref = "#";
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "חבילות · תשלום לפני גישה",
        { color: theme.accent, fontSize: "13px", fontWeight: "800", letterSpacing: "0.06em" },
        absoluteLayout(64, 40, 520, 24, 2),
      ),
      textNode(
        "title",
        "בחרו חבילה והמשיכו לתשלום",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 72, 720, 52, 2),
      ),
      textNode(
        "subtitle",
        "לאחר התשלום בסליקה שלכם — עדכנו את הלקוח ל־paid והעמודים המוגנים ייפתחו.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.65" },
        absoluteLayout(64, 132, 700, 48, 2),
      ),
      ...packageTierCard("t1", 64, 200, 300, 460, theme, "בסיס", "₪290", "לחודש", ["גישה לאזור אישי", "תמיכה במייל", "עדכון נתונים"], false, paymentHref),
      ...packageTierCard("t2", 396, 200, 300, 460, theme, "עסקי", "₪590", "לחודש", ["הכול בבסיס", "עמודים מוגנים", "עדיפות בתמיכה", "דוחות בסיסיים"], true, paymentHref),
      ...packageTierCard("t3", 728, 200, 300, 460, theme, "פרימיום", "₪990", "לחודש", ["הכול בעסקי", "ליווי אישי", "התאמות מתקדמות"], false, paymentHref),
      textNode(
        "hint",
        "טיפ: לחצו על «לתשלום בסליקה» בעורך והדביקו את קישור התשלום של העסק (Cardcom / ספק אחר).",
        { color: theme.muted, fontSize: "13px", fontWeight: "600" },
        absoluteLayout(64, 680, 960, 28, 2),
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "packages",
        "portal-packages",
        "חבילות ותשלום",
        absoluteLayout(64, 64, 520, 560, 3),
        theme,
        { minHeight: "540px" },
      ),
      textNode(
        "title",
        "גישה בתשלום",
        { color: theme.ink, fontSize: "38px", fontWeight: "900" },
        absoluteLayout(620, 80, 420, 48, 2),
      ),
      textNode(
        "body",
        "ווידג׳ט חי לחבילות. הגדירו קישור סליקה במאפיין העיצוב — והכפתור מוביל ישירות לתשלום.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(620, 140, 400, 80, 2),
      ),
      ...metricCard("m1", 620, 250, 400, theme, "גישה", "לקוחות משלמים"),
      ...metricCard("m2", 620, 380, 400, theme, "סליקה", "קישור חיצוני"),
      ...metricCard("m3", 620, 510, 400, theme, "אחרי תשלום", "סטטוס paid ב-CRM"),
    ],
    () => [
      boxNode(
        "bg",
        {
          backgroundImage: `linear-gradient(150deg, ${theme.ink} 0%, ${theme.accent}66 45%, ${theme.soft} 100%)`,
        },
        absoluteLayout(0, 0, "100%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "חבילה אחת · תשלום אחד",
        { color: "#f8fafc", fontSize: "42px", fontWeight: "900" },
        absoluteLayout(64, 56, 700, 56, 2),
      ),
      textNode(
        "subtitle",
        "מתאים כשאין כמה מסלולים — רק דף תשלום ברור לפני פתיחת האזור האישי.",
        { color: "#e2e8f0", fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 124, 640, 48, 2),
      ),
      boxNode(
        "hero-card",
        {
          backgroundColor: theme.card,
          borderRadius: "24px",
          border: `1px solid ${theme.line}`,
          boxShadow: "0 30px 60px -36px rgba(15,23,42,0.55)",
        },
        absoluteLayout(64, 200, 640, 420, 2),
        "חבילה",
      ),
      textNode("hn", "מנוי חודשי", { color: theme.ink, fontSize: "22px", fontWeight: "900" }, absoluteLayout(104, 240, 400, 32, 3)),
      textNode("hp", "₪490", { color: theme.ink, fontSize: "56px", fontWeight: "900" }, absoluteLayout(104, 290, 400, 64, 3)),
      textNode("hper", "לחודש · כולל גישה מלאה לאזור האישי", { color: theme.muted, fontSize: "14px", fontWeight: "600" }, absoluteLayout(104, 360, 480, 28, 3)),
      textNode("hf1", "✓  כל העמודים אחרי התחברות", { color: theme.muted, fontSize: "15px", fontWeight: "600" }, absoluteLayout(104, 410, 480, 26, 3)),
      textNode("hf2", "✓  נתונים אישיים מה-CRM", { color: theme.muted, fontSize: "15px", fontWeight: "600" }, absoluteLayout(104, 444, 480, 26, 3)),
      textNode("hf3", "✓  ביטול בכל עת", { color: theme.muted, fontSize: "15px", fontWeight: "600" }, absoluteLayout(104, 478, 480, 26, 3)),
      buttonNode(
        "hcta",
        "מעבר לסליקה לתשלום",
        {
          color: "#fff",
          backgroundColor: theme.accent,
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(104, 530, 280, 50, 3),
        paymentHref,
      ),
      ...metricCard("side1", 740, 200, 300, theme, "סטטוס נדרש", "paid"),
      ...metricCard("side2", 740, 340, 300, theme, "קישור", "הדביקו בסליקה"),
      ...metricCard("side3", 740, 480, 300, theme, "שער גישה", "לקוחות משלמים"),
    ],
  ];
  return layouts[index % layouts.length]();
}

function buildPackagesSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-packages-${String(index + 1).padStart(2, "0")}`,
      `חבילות ותשלום — ${theme.name}`,
      "עמוד חבילות עם קישור לסליקה לפני גישה לאזור האישי",
      [
        "packages",
        "חבילות",
        "תשלום",
        "סליקה",
        "portal-packages",
        "מנוי",
        "pricing",
      ],
      theme,
      "760px",
      packagesNodes(theme, index),
    ),
  );
}

function buildCoursesSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-courses-${String(index + 1).padStart(2, "0")}`,
      `קורסים דיגיטליים — ${theme.name}`,
      "עמוד אחרי התחברות עם כרטיסיות קורסים, התקדמות וטבלת שיעורים",
      ["courses", "קורסים", "דיגיטלי", "portal-courses", "למידה"],
      theme,
      "720px",
      coursesNodes(theme, index),
    ),
  );
}

function buildProfileSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-profile-${String(index + 1).padStart(2, "0")}`,
      `נתונים אישיים — ${theme.name}`,
      "עמוד פרטים אישיים מקצועי עם נתונים משתנים מחוברים ל-CRM",
      ["profile", "נתונים אישיים", "פרטים", "portal-profile", "פרופיל", "portal-custom-data"],
      theme,
      "700px",
      profileNodes(theme, index),
    ),
  );
}

function buildCustomDataSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-custom-data-${String(index + 1).padStart(2, "0")}`,
      `נתונים משתנים — ${theme.name}`,
      "ווידג׳ט חי לנתונים משתנים מה-CRM באזור האישי",
      [
        "custom-data",
        "נתונים משתנים",
        "portal-custom-data",
        "CRM",
        "מדדים",
        "תיק לקוח",
      ],
      theme,
      "720px",
      customDataNodes(theme, index),
    ),
  );
}

/** Keep legacy ids working for already-added pages. */
const legacyAliases: VisualLibrarySectionTemplate[] = [
  {
    ...buildLoginSections()[0],
    id: "section-portal-login",
    title: "התחברות לאזור אישי",
  },
  {
    ...buildAccountSections()[0],
    id: "section-portal-account",
    title: "החשבון שלי",
  },
  {
    ...buildOrdersSections()[0],
    id: "section-portal-orders",
    title: "הזמנות קודמות",
  },
  {
    ...buildCartSections()[0],
    id: "section-portal-cart",
    title: "עגלת קניות",
  },
  {
    ...buildAccountSections()[1],
    id: "section-portal-welcome-nav",
    title: "ברוכים הבאים לאזור האישי",
  },
];

export const PORTAL_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  ...buildLoginSections(),
  ...buildRegisterSections(),
  ...buildAccountSections(),
  ...buildOrdersSections(),
  ...buildCartSections(),
  ...buildCoursesSections(),
  ...buildProfileSections(),
  ...buildCustomDataSections(),
  ...buildPackagesSections(),
  ...buildForgotPasswordSections(),
  ...buildResetPasswordSections(),
  ...legacyAliases,
];

export const PORTAL_SECTION_KIND_PREFIX: Record<string, string> = {
  login: "section-portal-login-",
  register: "section-portal-register-",
  account: "section-portal-account-",
  orders: "section-portal-orders-",
  cart: "section-portal-cart-",
  courses: "section-portal-courses-",
  profile: "section-portal-profile-",
  "custom-data": "section-portal-custom-data-",
  packages: "section-portal-packages-",
  "forgot-password": "section-portal-forgot-password-",
  "reset-password": "section-portal-reset-password-",
};
