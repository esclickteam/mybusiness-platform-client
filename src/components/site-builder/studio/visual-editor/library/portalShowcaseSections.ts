import {
  absoluteLayout,
  boxNode,
  buttonNode,
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
  | "portal-cart";

type Theme = {
  name: string;
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  card: string;
  line: string;
  soft: string;
};

/** No pink / purple — clear, brand-ready palettes. */
const THEMES: Theme[] = [
  {
    name: "ענבר",
    bg: "#f7f4ef",
    ink: "#1c1917",
    muted: "#78716c",
    accent: "#b45309",
    card: "#ffffff",
    line: "#e7e5e4",
    soft: "#fafaf9",
  },
  {
    name: "ים",
    bg: "#f1f5f9",
    ink: "#0f172a",
    muted: "#64748b",
    accent: "#0e7490",
    card: "#ffffff",
    line: "#e2e8f0",
    soft: "#f8fafc",
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
  },
  {
    name: "חול",
    bg: "#faf7f2",
    ink: "#292524",
    muted: "#78716c",
    accent: "#0f766e",
    card: "#ffffff",
    line: "#e7e5e4",
    soft: "#fffdf8",
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
  },
  {
    name: "זית",
    bg: "#f3f4ea",
    ink: "#1f2a14",
    muted: "#6b7280",
    accent: "#4d7c0f",
    card: "#ffffff",
    line: "#dde3c9",
    soft: "#f8f9f2",
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
  },
];

const THUMBS = [
  IMG.workspace,
  IMG.studio,
  IMG.ecommerce,
  IMG.product,
  IMG.architecture,
  IMG.finance,
  IMG.hospitality,
  IMG.education,
  IMG.team,
  IMG.tech,
];

function fieldNode(
  key: string,
  parentKey: string,
  placeholder: string,
  type: string,
  layout: ReturnType<typeof absoluteLayout>,
  theme: Theme,
): VisualLibraryNodeTemplate {
  return {
    key,
    type: "form-field",
    label: placeholder,
    tagName: "input",
    parentKey,
    content: { value: "", placeholder },
    style: {
      width: "100%",
      boxSizing: "border-box",
      borderRadius: "14px",
      border: `1px solid ${theme.line}`,
      backgroundColor: "#ffffff",
      color: theme.ink,
      fontSize: "14px",
      fontWeight: "600",
      padding: "12px 14px",
      outline: "none",
      direction: "rtl",
    },
    layout,
    attributes: {
      type,
      name: key,
      placeholder,
      "aria-label": placeholder,
    },
  };
}

function withParent(
  node: VisualLibraryNodeTemplate,
  parentKey: string,
): VisualLibraryNodeTemplate {
  return { ...node, parentKey };
}

function loginFormChildren(
  parentKey: string,
  theme: Theme,
  width = 420,
): VisualLibraryNodeTemplate[] {
  return [
    withParent(
      textNode(
        `${parentKey}-eyebrow`,
        "אזור אישי",
        { color: theme.accent, fontSize: "12px", fontWeight: "800" },
        absoluteLayout(28, 28, width, 22, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-heading`,
        "התחברות",
        { color: theme.ink, fontSize: "24px", fontWeight: "900" },
        absoluteLayout(28, 54, width, 34, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-copy`,
        "התחברות לאתר זה בלבד — לא לחשבון BizUply.",
        { color: theme.muted, fontSize: "13px", fontWeight: "600", lineHeight: "1.5" },
        absoluteLayout(28, 96, width, 40, 5),
      ),
      parentKey,
    ),
    fieldNode(
      `${parentKey}-email`,
      parentKey,
      "אימייל",
      "email",
      absoluteLayout(28, 150, width, 48, 5),
      theme,
    ),
    fieldNode(
      `${parentKey}-password`,
      parentKey,
      "סיסמה",
      "password",
      absoluteLayout(28, 210, width, 48, 5),
      theme,
    ),
    withParent(
      buttonNode(
        `${parentKey}-submit`,
        "התחברות",
        {
          color: "#fff",
          backgroundColor: theme.ink,
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "14px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(28, 280, width, 48, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-register-link`,
        "אין לכם חשבון? הרשמה",
        { color: theme.accent, fontSize: "13px", fontWeight: "800" },
        absoluteLayout(28, 344, width, 24, 5),
      ),
      parentKey,
    ),
  ];
}

function registerFormChildren(
  parentKey: string,
  theme: Theme,
  width = 420,
): VisualLibraryNodeTemplate[] {
  return [
    withParent(
      textNode(
        `${parentKey}-eyebrow`,
        "אזור אישי",
        { color: theme.accent, fontSize: "12px", fontWeight: "800" },
        absoluteLayout(28, 24, width, 22, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-heading`,
        "הרשמה",
        { color: theme.ink, fontSize: "24px", fontWeight: "900" },
        absoluteLayout(28, 50, width, 34, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-copy`,
        "ההרשמה נשמרת לאתר ולעסק הזה בלבד.",
        { color: theme.muted, fontSize: "13px", fontWeight: "600", lineHeight: "1.5" },
        absoluteLayout(28, 92, width, 36, 5),
      ),
      parentKey,
    ),
    fieldNode(
      `${parentKey}-name`,
      parentKey,
      "שם מלא",
      "text",
      absoluteLayout(28, 140, width, 48, 5),
      theme,
    ),
    fieldNode(
      `${parentKey}-email`,
      parentKey,
      "אימייל",
      "email",
      absoluteLayout(28, 198, width, 48, 5),
      theme,
    ),
    fieldNode(
      `${parentKey}-phone`,
      parentKey,
      "טלפון (אופציונלי)",
      "tel",
      absoluteLayout(28, 256, width, 48, 5),
      theme,
    ),
    fieldNode(
      `${parentKey}-password`,
      parentKey,
      "סיסמה",
      "password",
      absoluteLayout(28, 314, width, 48, 5),
      theme,
    ),
    withParent(
      buttonNode(
        `${parentKey}-submit`,
        "יצירת חשבון",
        {
          color: "#fff",
          backgroundColor: theme.ink,
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "14px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(28, 380, width, 48, 5),
      ),
      parentKey,
    ),
  ];
}

function accountPanelChildren(
  parentKey: string,
  theme: Theme,
  width = 440,
): VisualLibraryNodeTemplate[] {
  return [
    withParent(
      textNode(
        `${parentKey}-heading`,
        "שלום לקוח/ה",
        { color: theme.ink, fontSize: "22px", fontWeight: "900" },
        absoluteLayout(24, 24, width, 32, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-email`,
        "client@example.com",
        { color: theme.muted, fontSize: "13px", fontWeight: "600" },
        absoluteLayout(24, 60, width, 24, 5),
      ),
      parentKey,
    ),
    withParent(
      buttonNode(
        `${parentKey}-orders`,
        "ההזמנות שלי",
        {
          color: "#fff",
          backgroundColor: theme.ink,
          borderRadius: "12px",
          fontWeight: "800",
          fontSize: "13px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(24, 110, 140, 42, 5),
        "/orders",
      ),
      parentKey,
    ),
    withParent(
      buttonNode(
        `${parentKey}-cart`,
        "העגלה שלי",
        {
          color: theme.ink,
          backgroundColor: theme.soft,
          border: `1px solid ${theme.line}`,
          borderRadius: "12px",
          fontWeight: "800",
          fontSize: "13px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(176, 110, 130, 42, 5),
        "/cart",
      ),
      parentKey,
    ),
    withParent(
      boxNode(
        `${parentKey}-row1`,
        {
          backgroundColor: theme.soft,
          border: `1px solid ${theme.line}`,
          borderRadius: "14px",
        },
        absoluteLayout(24, 170, width, 52, 5),
        "עמוד",
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-row1-text`,
        "הזמנות קודמות",
        { color: theme.ink, fontSize: "14px", fontWeight: "800" },
        absoluteLayout(40, 184, width - 40, 24, 6),
      ),
      parentKey,
    ),
    withParent(
      boxNode(
        `${parentKey}-row2`,
        {
          backgroundColor: theme.soft,
          border: `1px solid ${theme.line}`,
          borderRadius: "14px",
        },
        absoluteLayout(24, 234, width, 52, 5),
        "עמוד",
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-row2-text`,
        "עמוד מוגן ללקוחות",
        { color: theme.ink, fontSize: "14px", fontWeight: "800" },
        absoluteLayout(40, 248, width - 40, 24, 6),
      ),
      parentKey,
    ),
  ];
}

function ordersPanelChildren(
  parentKey: string,
  theme: Theme,
  width = 920,
): VisualLibraryNodeTemplate[] {
  const rows = [
    { key: "a", title: "הזמנה #1042", meta: "שולמה · ₪249.00", y: 24 },
    { key: "b", title: "הזמנה #1038", meta: "בטיפול · ₪128.50", y: 110 },
    { key: "c", title: "הזמנה #1021", meta: "נשלחה · ₪89.00", y: 196 },
  ];
  return rows.flatMap((row) => [
    withParent(
      boxNode(
        `${parentKey}-${row.key}`,
        {
          backgroundColor: "#ffffff",
          border: `1px solid ${theme.line}`,
          borderRadius: "16px",
        },
        absoluteLayout(20, row.y, width, 72, 5),
        "הזמנה",
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-${row.key}-title`,
        row.title,
        { color: theme.ink, fontSize: "14px", fontWeight: "900" },
        absoluteLayout(40, row.y + 14, width - 40, 24, 6),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-${row.key}-meta`,
        row.meta,
        { color: theme.muted, fontSize: "12px", fontWeight: "600" },
        absoluteLayout(40, row.y + 40, width - 40, 20, 6),
      ),
      parentKey,
    ),
  ]);
}

function cartPanelChildren(
  parentKey: string,
  theme: Theme,
  width = 920,
): VisualLibraryNodeTemplate[] {
  return [
    withParent(
      textNode(
        `${parentKey}-item1`,
        "מוצר לדוגמה × 1",
        { color: theme.ink, fontSize: "14px", fontWeight: "700" },
        absoluteLayout(28, 28, width * 0.6, 24, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-price1`,
        "₪120.00",
        { color: theme.ink, fontSize: "14px", fontWeight: "700", textAlign: "left" },
        absoluteLayout(width - 80, 28, 100, 24, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-item2`,
        "תוספת × 2",
        { color: theme.ink, fontSize: "14px", fontWeight: "700" },
        absoluteLayout(28, 70, width * 0.6, 24, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-price2`,
        "₪60.00",
        { color: theme.ink, fontSize: "14px", fontWeight: "700", textAlign: "left" },
        absoluteLayout(width - 80, 70, 100, 24, 5),
      ),
      parentKey,
    ),
    withParent(
      textNode(
        `${parentKey}-total`,
        "סה״כ: ₪180.00",
        { color: theme.ink, fontSize: "16px", fontWeight: "900" },
        absoluteLayout(28, 130, 220, 28, 5),
      ),
      parentKey,
    ),
    withParent(
      buttonNode(
        `${parentKey}-checkout`,
        "המשך לתשלום",
        {
          color: "#fff",
          backgroundColor: theme.accent,
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "14px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(28, 180, 180, 48, 5),
      ),
      parentKey,
    ),
  ];
}

function portalWidget(
  key: string,
  widget: PortalKind,
  label: string,
  layout: ReturnType<typeof absoluteLayout>,
  theme: Theme,
  children: VisualLibraryNodeTemplate[],
  style: Record<string, any> = {},
): VisualLibraryNodeTemplate[] {
  const mount: VisualLibraryNodeTemplate = {
    ...boxNode(
      key,
      {
        backgroundColor: theme.card,
        borderRadius: "22px",
        border: `1px solid ${theme.line}`,
        boxShadow: "0 22px 50px -34px rgba(15,23,42,0.35)",
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
    },
  };
  return [mount, ...children];
}

function makeSection(
  id: string,
  title: string,
  description: string,
  keywords: string[],
  theme: Theme,
  thumbnail: string,
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
    thumbnail,
    lockPalette: false,
    nodes,
  };
}

function loginNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts = [
    // form right
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("eyebrow", "התחברות לקוחות", { color: theme.accent, fontSize: "13px", fontWeight: "800" }, absoluteLayout(72, 90, 260, 28, 3)),
      textNode("title", "ברוכים השבים", { color: theme.ink, fontSize: "46px", fontWeight: "900", lineHeight: "1.1" }, absoluteLayout(72, 130, 420, 70, 3)),
      textNode("subtitle", "התחברו כדי לראות הזמנות, פרטים ותוכן אישי של האתר הזה.", { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(72, 220, 400, 80, 3)),
      ...portalWidget(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(560, 80, 480, 520, 4),
        theme,
        loginFormChildren("form", theme, 420),
        { minHeight: "480px" },
      ),
    ],
    // form left
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      ...portalWidget(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(80, 80, 460, 520, 4),
        theme,
        loginFormChildren("form", theme, 400),
        { minHeight: "480px" },
      ),
      textNode("title", "כניסה לאזור האישי", { color: theme.ink, fontSize: "44px", fontWeight: "900" }, absoluteLayout(600, 160, 420, 90, 3)),
      textNode("subtitle", "טופס מוכן ומקושר לעסק ולאתר הספציפי.", { color: theme.muted, fontSize: "16px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(600, 270, 380, 80, 3)),
    ],
    // centered card
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "התחברות", { color: theme.ink, fontSize: "40px", fontWeight: "900", textAlign: "center" }, absoluteLayout(320, 50, 400, 50, 3)),
      ...portalWidget(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(300, 120, 440, 500, 4),
        theme,
        loginFormChildren("form", theme, 380),
        { minHeight: "460px" },
      ),
    ],
    // split band
    () => [
      boxNode("left", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "46%", "100%", 1), "פס"),
      boxNode("right", { backgroundColor: theme.soft }, absoluteLayout(480, 0, "54%", "100%", 1), "רקע"),
      textNode("title", "שלום שוב", { color: "#f8fafc", fontSize: "42px", fontWeight: "900" }, absoluteLayout(70, 180, 340, 80, 3)),
      textNode("subtitle", "התחברות מאובטחת לאזור האישי של האתר.", { color: "#cbd5e1", fontSize: "15px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(70, 280, 320, 80, 3)),
      ...portalWidget(
        "form",
        "portal-login",
        "טופס התחברות",
        absoluteLayout(560, 90, 460, 500, 4),
        theme,
        loginFormChildren("form", theme, 400),
        { minHeight: "460px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function registerNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("eyebrow", "הרשמה", { color: theme.accent, fontSize: "13px", fontWeight: "800" }, absoluteLayout(72, 80, 200, 28, 3)),
      textNode("title", "צרו חשבון אישי", { color: theme.ink, fontSize: "44px", fontWeight: "900" }, absoluteLayout(72, 120, 420, 70, 3)),
      textNode("subtitle", "ההרשמה נקלטת אוטומטית לאתר ולעסק הזה בלבד.", { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(72, 210, 400, 70, 3)),
      ...portalWidget(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(560, 70, 480, 560, 4),
        theme,
        registerFormChildren("form", theme, 420),
        { minHeight: "520px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      ...portalWidget(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(80, 70, 480, 560, 4),
        theme,
        registerFormChildren("form", theme, 420),
        { minHeight: "520px" },
      ),
      textNode("title", "הצטרפות לאזור האישי", { color: theme.ink, fontSize: "40px", fontWeight: "900" }, absoluteLayout(620, 180, 400, 90, 3)),
      textNode("subtitle", "שם, אימייל וסיסמה — והלקוח נשמר אצלכם.", { color: theme.muted, fontSize: "16px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(620, 290, 360, 80, 3)),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "הרשמה מהירה", { color: theme.ink, fontSize: "38px", fontWeight: "900", textAlign: "center" }, absoluteLayout(300, 40, 440, 50, 3)),
      ...portalWidget(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(290, 110, 460, 540, 4),
        theme,
        registerFormChildren("form", theme, 400),
        { minHeight: "500px" },
      ),
    ],
    () => [
      boxNode("band", { backgroundColor: theme.accent }, absoluteLayout(0, 0, "100%", 180, 1), "פס"),
      boxNode("body", { backgroundColor: theme.soft }, absoluteLayout(0, 180, "100%", "100%", 1), "רקע"),
      textNode("title", "פתיחת חשבון", { color: "#ffffff", fontSize: "40px", fontWeight: "900" }, absoluteLayout(80, 60, 420, 60, 3)),
      ...portalWidget(
        "form",
        "portal-register",
        "טופס הרשמה",
        absoluteLayout(300, 120, 460, 540, 4),
        theme,
        registerFormChildren("form", theme, 400),
        { minHeight: "500px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function accountNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "האזור האישי שלי", { color: theme.ink, fontSize: "42px", fontWeight: "900" }, absoluteLayout(72, 70, 480, 60, 2)),
      textNode("subtitle", "חשבון, הזמנות ועגלה — לפי מה שפתחתם ללקוח.", { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(72, 145, 460, 60, 2)),
      ...portalWidget(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(560, 60, 500, 420, 3),
        theme,
        accountPanelChildren("account", theme, 440),
        { minHeight: "380px" },
      ),
      buttonNode("btn-orders", "הזמנות", { color: "#fff", backgroundColor: theme.ink, borderRadius: "12px", padding: "12px 18px", fontWeight: "800", fontSize: "13px" }, absoluteLayout(72, 250, 130, 44, 3), "/orders"),
      buttonNode("btn-cart", "עגלה", { color: theme.ink, backgroundColor: theme.card, border: `1px solid ${theme.line}`, borderRadius: "12px", padding: "12px 18px", fontWeight: "800", fontSize: "13px" }, absoluteLayout(220, 250, 120, 44, 3), "/cart"),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      ...portalWidget(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(80, 70, 500, 480, 3),
        theme,
        accountPanelChildren("account", theme, 440),
        { minHeight: "440px" },
      ),
      textNode("title", "ברוכים הבאים", { color: theme.ink, fontSize: "40px", fontWeight: "900" }, absoluteLayout(640, 120, 360, 70, 2)),
      textNode("subtitle", "כאן הלקוח ממשיך אחרי התחברות.", { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(640, 210, 340, 70, 2)),
      buttonNode("btn-orders", "ההזמנות שלי", { color: "#fff", backgroundColor: theme.accent, borderRadius: "12px", padding: "12px 18px", fontWeight: "800", fontSize: "13px" }, absoluteLayout(640, 320, 170, 44, 3), "/orders"),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "החשבון שלי", { color: theme.ink, fontSize: "38px", fontWeight: "900", textAlign: "center" }, absoluteLayout(300, 40, 440, 50, 2)),
      ...portalWidget(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(280, 110, 480, 420, 3),
        theme,
        accountPanelChildren("account", theme, 420),
        { minHeight: "380px" },
      ),
      buttonNode("btn-orders", "הזמנות", { color: "#fff", backgroundColor: theme.ink, borderRadius: "12px", padding: "12px 18px", fontWeight: "800", fontSize: "13px" }, absoluteLayout(340, 560, 140, 44, 3), "/orders"),
      buttonNode("btn-cart", "עגלה", { color: theme.ink, backgroundColor: theme.card, border: `1px solid ${theme.line}`, borderRadius: "12px", padding: "12px 18px", fontWeight: "800", fontSize: "13px" }, absoluteLayout(500, 560, 120, 44, 3), "/cart"),
    ],
    () => [
      boxNode("top", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", 220, 1), "פס"),
      boxNode("body", { backgroundColor: theme.soft }, absoluteLayout(0, 220, "100%", "100%", 1), "רקע"),
      textNode("title", "אזור אישי", { color: "#ffffff", fontSize: "40px", fontWeight: "900" }, absoluteLayout(80, 70, 420, 60, 2)),
      textNode("subtitle", "הזמנות · עגלה · פרטים אישיים", { color: "#cbd5e1", fontSize: "15px", fontWeight: "600" }, absoluteLayout(80, 145, 420, 40, 2)),
      ...portalWidget(
        "account",
        "portal-account",
        "פאנל חשבון",
        absoluteLayout(80, 170, 980, 380, 3),
        theme,
        accountPanelChildren("account", theme, 900),
        { minHeight: "340px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function ordersNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "ההזמנות שלי", { color: theme.ink, fontSize: "40px", fontWeight: "900" }, absoluteLayout(72, 60, 420, 56, 2)),
      textNode("subtitle", "הזמנות מהחנות של האתר הזה, לפי הלקוח המחובר.", { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(72, 130, 520, 60, 2)),
      ...portalWidget(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(72, 210, 980, 400, 3),
        theme,
        ordersPanelChildren("orders", theme, 920),
        { minHeight: "360px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("eyebrow", "היסטוריית רכישות", { color: theme.accent, fontSize: "13px", fontWeight: "800" }, absoluteLayout(72, 70, 260, 28, 2)),
      textNode("title", "הזמנות קודמות", { color: theme.ink, fontSize: "42px", fontWeight: "900" }, absoluteLayout(72, 110, 480, 60, 2)),
      ...portalWidget(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(72, 200, 980, 420, 3),
        theme,
        ordersPanelChildren("orders", theme, 920),
        { minHeight: "380px" },
      ),
    ],
    () => [
      boxNode("top", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", 160, 1), "פס"),
      boxNode("body", { backgroundColor: theme.soft }, absoluteLayout(0, 160, "100%", "100%", 1), "רקע"),
      textNode("title", "ההזמנות שלי", { color: "#ffffff", fontSize: "38px", fontWeight: "900" }, absoluteLayout(72, 55, 420, 50, 2)),
      ...portalWidget(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(72, 130, 980, 420, 3),
        theme,
        ordersPanelChildren("orders", theme, 920),
        { minHeight: "380px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "הזמנות", { color: theme.ink, fontSize: "36px", fontWeight: "900", textAlign: "center" }, absoluteLayout(300, 40, 440, 50, 2)),
      ...portalWidget(
        "orders",
        "portal-orders",
        "רשימת הזמנות",
        absoluteLayout(140, 120, 760, 440, 3),
        theme,
        ordersPanelChildren("orders", theme, 700),
        { minHeight: "400px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function cartNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "העגלה שלי", { color: theme.ink, fontSize: "40px", fontWeight: "900" }, absoluteLayout(72, 60, 420, 56, 2)),
      textNode("subtitle", "המשך רכישה מהעגלה הפעילה באתר.", { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(72, 130, 520, 60, 2)),
      ...portalWidget(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(72, 210, 980, 360, 3),
        theme,
        cartPanelChildren("cart", theme, 920),
        { minHeight: "320px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      ...portalWidget(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(80, 80, 520, 420, 3),
        theme,
        cartPanelChildren("cart", theme, 460),
        { minHeight: "380px" },
      ),
      textNode("title", "סיכום רכישה", { color: theme.ink, fontSize: "38px", fontWeight: "900" }, absoluteLayout(660, 140, 360, 60, 2)),
      textNode("subtitle", "העגלה נשמרת לאתר הזה וממשיכה לתשלום.", { color: theme.muted, fontSize: "15px", fontWeight: "600", lineHeight: "1.7" }, absoluteLayout(660, 220, 340, 80, 2)),
    ],
    () => [
      boxNode("band", { backgroundColor: theme.accent }, absoluteLayout(0, 0, "100%", 140, 1), "פס"),
      boxNode("body", { backgroundColor: theme.soft }, absoluteLayout(0, 140, "100%", "100%", 1), "רקע"),
      textNode("title", "עגלת קניות", { color: "#ffffff", fontSize: "36px", fontWeight: "900" }, absoluteLayout(72, 48, 420, 50, 2)),
      ...portalWidget(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(72, 110, 980, 400, 3),
        theme,
        cartPanelChildren("cart", theme, 920),
        { minHeight: "360px" },
      ),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "העגלה", { color: theme.ink, fontSize: "36px", fontWeight: "900", textAlign: "center" }, absoluteLayout(300, 40, 440, 50, 2)),
      ...portalWidget(
        "cart",
        "portal-cart",
        "עגלת קניות",
        absoluteLayout(180, 120, 680, 400, 3),
        theme,
        cartPanelChildren("cart", theme, 620),
        { minHeight: "360px" },
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function buildLoginSections(): VisualLibrarySectionTemplate[] {
  return THEMES.map((theme, index) =>
    makeSection(
      `section-portal-login-${String(index + 1).padStart(2, "0")}`,
      `התחברות — ${theme.name}`,
      "טופס התחברות מקושר לאתר ולעסק",
      ["login", "התחברות", "טופס"],
      theme,
      THUMBS[index % THUMBS.length],
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
      ["register", "הרשמה", "טופס"],
      theme,
      THUMBS[(index + 3) % THUMBS.length],
      "740px",
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
      ["account", "אזור אישי", "חשבון"],
      theme,
      THUMBS[(index + 5) % THUMBS.length],
      "680px",
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
      ["orders", "הזמנות"],
      theme,
      IMG.ecommerce,
      "680px",
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
      ["cart", "עגלה"],
      theme,
      IMG.product,
      "640px",
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
  ...legacyAliases,
];

export const PORTAL_SECTION_KIND_PREFIX: Record<string, string> = {
  login: "section-portal-login-",
  register: "section-portal-register-",
  account: "section-portal-account-",
  orders: "section-portal-orders-",
  cart: "section-portal-cart-",
};
