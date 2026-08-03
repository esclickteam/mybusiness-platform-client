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

/** No pink / purple — brand-ready palettes with photography. */
const THEMES: Theme[] = [
  {
    name: "ענבר",
    bg: "#f4efe6",
    ink: "#1c1917",
    muted: "#78716c",
    accent: "#b45309",
    card: "#ffffff",
    line: "#e7e5e4",
    soft: "#faf7f2",
    photo: IMG.workspace,
  },
  {
    name: "ים",
    bg: "#e8f1f5",
    ink: "#0f172a",
    muted: "#64748b",
    accent: "#0e7490",
    card: "#ffffff",
    line: "#d6e4ea",
    soft: "#f4f9fb",
    photo: IMG.hospitality,
  },
  {
    name: "יער",
    bg: "#eef2ee",
    ink: "#14532d",
    muted: "#4b5563",
    accent: "#15803d",
    card: "#ffffff",
    line: "#d6e0d6",
    soft: "#f4f7f4",
    photo: IMG.nature,
  },
  {
    name: "פחם",
    bg: "#111827",
    ink: "#f9fafb",
    muted: "#9ca3af",
    accent: "#f59e0b",
    card: "#1f2937",
    line: "#374151",
    soft: "#0b1220",
    photo: IMG.city,
  },
  {
    name: "חול",
    bg: "#f7f3ec",
    ink: "#292524",
    muted: "#78716c",
    accent: "#0f766e",
    card: "#ffffff",
    line: "#e7e5e4",
    soft: "#fffdf8",
    photo: IMG.interior,
  },
  {
    name: "נייבי",
    bg: "#e7eef8",
    ink: "#0a1628",
    muted: "#5b6b7c",
    accent: "#1d4ed8",
    card: "#ffffff",
    line: "#d5dee9",
    soft: "#f3f6fb",
    photo: IMG.laptop,
  },
  {
    name: "זית",
    bg: "#f1f3e8",
    ink: "#1f2a14",
    muted: "#6b7280",
    accent: "#4d7c0f",
    card: "#ffffff",
    line: "#dde3c9",
    soft: "#f8f9f2",
    photo: IMG.cafe,
  },
  {
    name: "נחושת",
    bg: "#faf5f0",
    ink: "#1c1917",
    muted: "#78716c",
    accent: "#c2410c",
    card: "#ffffff",
    line: "#e7e0d8",
    soft: "#fffaf5",
    photo: IMG.architecture,
  },
  {
    name: "גרפיט",
    bg: "#eceff1",
    ink: "#102027",
    muted: "#607d8b",
    accent: "#455a64",
    card: "#ffffff",
    line: "#cfd8dc",
    soft: "#f5f7f8",
    photo: IMG.meeting,
  },
  {
    name: "לילה",
    bg: "#0b1220",
    ink: "#f8fafc",
    muted: "#94a3b8",
    accent: "#38bdf8",
    card: "#152033",
    line: "#243044",
    soft: "#09101a",
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
        borderRadius: "28px",
        border: `1px solid ${theme.line}`,
        boxShadow: "0 28px 70px -40px rgba(15,23,42,0.45)",
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
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "האזור האישי שלי",
        { color: theme.ink, fontSize: "44px", fontWeight: "900" },
        absoluteLayout(72, 60, 480, 60, 2),
      ),
      textNode(
        "subtitle",
        "חשבון, הזמנות ועגלה — לפי מה שפתחתם ללקוח.",
        { color: theme.muted, fontSize: "16px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(72, 130, 460, 60, 2),
      ),
      buttonNode(
        "btn-orders",
        "הזמנות",
        {
          color: "#fff",
          backgroundColor: theme.ink,
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(72, 220, 130, 46, 3),
        "/orders",
      ),
      buttonNode(
        "btn-cart",
        "עגלה",
        {
          color: theme.ink,
          backgroundColor: theme.card,
          border: `1px solid ${theme.line}`,
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(220, 220, 120, 46, 3),
        "/cart",
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(560, 60, 480, 520, 3),
        theme,
        { minHeight: "500px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(72, 70, 520, 540, 3),
        theme,
        { minHeight: "520px" },
      ),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "28px" },
        absoluteLayout(640, 120, 380, 440, 2),
        "תמונה",
      ),
    ],
    () => [
      boxNode(
        "top",
        { backgroundColor: theme.ink },
        absoluteLayout(0, 0, "100%", 220, 1),
        "פס",
      ),
      boxNode(
        "body",
        { backgroundColor: theme.soft },
        absoluteLayout(0, 220, "100%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "אזור אישי",
        { color: "#ffffff", fontSize: "42px", fontWeight: "900" },
        absoluteLayout(80, 70, 420, 60, 2),
      ),
      textNode(
        "subtitle",
        "הזמנות · עגלה · פרטים אישיים",
        { color: "#cbd5e1", fontSize: "15px", fontWeight: "600" },
        absoluteLayout(80, 145, 420, 40, 2),
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(80, 160, 940, 420, 3),
        theme,
        { minHeight: "400px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "החשבון שלי",
        { color: theme.ink, fontSize: "40px", fontWeight: "900", textAlign: "center" },
        absoluteLayout(300, 40, 500, 50, 2),
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(280, 120, 540, 460, 3),
        theme,
        { minHeight: "440px" },
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
        { background: "rgba(15,23,42,0.55)" },
        absoluteLayout(0, 0, "100%", "100%", 2),
        "שכבה",
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(280, 100, 540, 500, 3),
        theme,
        { minHeight: "480px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "MY ACCOUNT",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.12em" },
        absoluteLayout(72, 60, 300, 24, 2),
      ),
      textNode(
        "title",
        "ברוכים הבאים",
        { color: theme.ink, fontSize: "48px", fontWeight: "900" },
        absoluteLayout(72, 100, 480, 60, 2),
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(72, 200, 600, 420, 3),
        theme,
        { minHeight: "400px" },
      ),
      buttonNode(
        "btn-orders",
        "ההזמנות שלי",
        {
          color: "#fff",
          backgroundColor: theme.accent,
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(720, 220, 180, 48, 3),
        "/orders",
      ),
      buttonNode(
        "btn-cart",
        "לעגלה",
        {
          color: theme.ink,
          backgroundColor: theme.card,
          border: `1px solid ${theme.line}`,
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(720, 286, 180, 48, 3),
        "/cart",
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      imageNode(
        "photo",
        theme.photo,
        { objectFit: "cover", borderRadius: "28px" },
        absoluteLayout(72, 80, 420, 520, 2),
        "תמונה",
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(540, 80, 500, 520, 3),
        theme,
        { minHeight: "500px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "החשבון שלכם",
        { color: "#f8fafc", fontSize: "44px", fontWeight: "900" },
        absoluteLayout(72, 80, 480, 60, 2),
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(72, 180, 960, 420, 3),
        theme,
        { minHeight: "400px" },
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
          boxShadow: "0 36px 80px -48px rgba(15,23,42,0.35)",
        },
        absoluteLayout(80, 60, 940, 580, 2),
        "מסגרת",
      ),
      textNode(
        "title",
        "אזור אישי",
        { color: theme.ink, fontSize: "36px", fontWeight: "900" },
        absoluteLayout(120, 100, 400, 50, 3),
      ),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(120, 170, 860, 420, 4),
        theme,
        { minHeight: "400px", boxShadow: "none" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      portalMount(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(240, 80, 620, 540, 3),
        theme,
        { minHeight: "520px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function ordersNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "ההזמנות שלי",
        { color: theme.ink, fontSize: "44px", fontWeight: "900" },
        absoluteLayout(72, 50, 480, 56, 2),
      ),
      textNode(
        "subtitle",
        "הזמנות מהחנות של האתר הזה, לפי הלקוח המחובר.",
        { color: theme.muted, fontSize: "16px", fontWeight: "600", lineHeight: "1.7" },
        absoluteLayout(72, 120, 560, 50, 2),
      ),
      portalMount(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(72, 200, 960, 420, 3),
        theme,
        { minHeight: "400px" },
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
        "ORDERS",
        { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.12em" },
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
  "forgot-password": "section-portal-forgot-password-",
  "reset-password": "section-portal-reset-password-",
};
