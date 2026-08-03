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

const ink = "#0f172a";
const muted = "#64748b";
const sky = "#0284c7";
const soft = "#f8fafc";
const line = "#e2e8f0";

function portalSection(
  id: string,
  title: string,
  description: string,
  keywords: string[],
  backgroundColor: string,
  minHeight: string,
  thumbnail: string,
  nodes: VisualLibraryNodeTemplate[],
): VisualLibrarySectionTemplate {
  return {
    id,
    kind: "section",
    tab: "sections",
    category: "portal",
    title,
    description,
    keywords: [
      "אזור אישי",
      "portal",
      "התחברות",
      "לקוחות",
      ...keywords,
    ],
    previewLayout: id,
    backgroundColor,
    minHeight,
    thumbnail,
    lockPalette: false,
    nodes,
  };
}

function widgetBox(
  key: string,
  widget: "portal-login" | "portal-account" | "portal-orders" | "portal-cart",
  label: string,
  layout: ReturnType<typeof absoluteLayout>,
  style: Record<string, any> = {},
): VisualLibraryNodeTemplate {
  return {
    ...boxNode(
      key,
      {
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        border: `1px solid ${line}`,
        boxShadow: "0 24px 60px -36px rgba(15,23,42,0.35)",
        ...style,
      },
      layout,
      label,
    ),
    attributes: {
      "data-bizuply-widget": widget,
      "data-bizuply-portal-mount": "true",
      "data-bizuply-portal-kind": widget,
    },
  };
}

const loginHero = portalSection(
  "section-portal-login",
  "התחברות לאזור אישי",
  "טופס התחברות מקושר לאתר ולעסק — רק למי שהתקין את התוסף",
  ["login", "טופס", "סיסמה"],
  soft,
  "720px",
  IMG.workspace,
  [
    boxNode(
      "bg",
      {
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 45%, #ffffff 100%)",
        borderRadius: "0px",
      },
      absoluteLayout(0, 0, "100%", "100%", 1),
      "רקע",
    ),
    textNode(
      "eyebrow",
      "אזור אישי",
      {
        color: sky,
        fontSize: "13px",
        fontWeight: "800",
        letterSpacing: "0.08em",
      },
      absoluteLayout(80, 80, 280, 28, 3),
    ),
    textNode(
      "title",
      "ברוכים השבים",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "900",
        lineHeight: "1.1",
      },
      absoluteLayout(80, 120, 420, 70, 3),
    ),
    textNode(
      "subtitle",
      "התחברו כדי לראות הזמנות, פרטים אישיים ותוכן שנפתח רק עבורכם.",
      {
        color: muted,
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "1.7",
      },
      absoluteLayout(80, 200, 400, 80, 3),
    ),
    widgetBox(
      "login-form",
      "portal-login",
      "טופס התחברות",
      absoluteLayout(560, 90, 480, 520, 4),
      { minHeight: "480px" },
    ),
  ],
);

const accountHub = portalSection(
  "section-portal-account",
  "החשבון שלי",
  "מרכז האזור האישי אחרי התחברות — קישורים לעמודים הפרטיים",
  ["account", "חשבון", "dashboard"],
  "#ffffff",
  "640px",
  IMG.studio,
  [
    textNode(
      "eyebrow",
      "PERSONAL AREA",
      {
        color: sky,
        fontSize: "12px",
        fontWeight: "800",
      },
      absoluteLayout(80, 70, 240, 24, 2),
    ),
    textNode(
      "title",
      "החשבון שלי",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "900",
      },
      absoluteLayout(80, 110, 480, 60, 2),
    ),
    textNode(
      "subtitle",
      "כאן הלקוח רואה את העמודים והמידע שנפתחו עבורו אחרי ההתחברות.",
      {
        color: muted,
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "1.7",
      },
      absoluteLayout(80, 180, 460, 70, 2),
    ),
    widgetBox(
      "account-panel",
      "portal-account",
      "פאנל חשבון",
      absoluteLayout(560, 70, 500, 460, 3),
      { minHeight: "420px" },
    ),
    buttonNode(
      "cta-orders",
      "ההזמנות שלי",
      {
        color: "#ffffff",
        backgroundColor: ink,
        borderRadius: "14px",
        padding: "14px 22px",
        fontSize: "14px",
        fontWeight: "800",
      },
      absoluteLayout(80, 290, 180, 48, 3),
      "/orders",
    ),
    buttonNode(
      "cta-cart",
      "העגלה שלי",
      {
        color: ink,
        backgroundColor: "#e0f2fe",
        borderRadius: "14px",
        padding: "14px 22px",
        fontSize: "14px",
        fontWeight: "800",
      },
      absoluteLayout(280, 290, 160, 48, 3),
      "/cart",
    ),
  ],
);

const ordersSection = portalSection(
  "section-portal-orders",
  "הזמנות קודמות",
  "רשימת הזמנות חנות של הלקוח המחובר — לפי האתר והעסק",
  ["orders", "הזמנות", "חנות"],
  soft,
  "680px",
  IMG.ecommerce,
  [
    textNode(
      "title",
      "ההזמנות שלי",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "900",
      },
      absoluteLayout(80, 70, 420, 56, 2),
    ),
    textNode(
      "subtitle",
      "הזמנות מהחנות של האתר הזה בלבד, משויכות לחשבון המחובר.",
      {
        color: muted,
        fontSize: "15px",
        fontWeight: "600",
        lineHeight: "1.7",
      },
      absoluteLayout(80, 140, 480, 60, 2),
    ),
    widgetBox(
      "orders-list",
      "portal-orders",
      "רשימת הזמנות",
      absoluteLayout(80, 230, 980, 380, 3),
      { minHeight: "360px" },
    ),
  ],
);

const cartSection = portalSection(
  "section-portal-cart",
  "עגלת קניות",
  "מציג את העגלה הפעילה באמצע רכישה ומאפשר להמשיך לתשלום",
  ["cart", "עגלה", "checkout"],
  "#ffffff",
  "640px",
  IMG.product,
  [
    textNode(
      "title",
      "העגלה שלי",
      {
        color: ink,
        fontSize: "40px",
        fontWeight: "900",
      },
      absoluteLayout(80, 70, 420, 56, 2),
    ),
    textNode(
      "subtitle",
      "אם התחלתם רכישה — תוכלו לחזור לעגלה ולהשלים תשלום.",
      {
        color: muted,
        fontSize: "15px",
        fontWeight: "600",
        lineHeight: "1.7",
      },
      absoluteLayout(80, 140, 520, 60, 2),
    ),
    widgetBox(
      "cart-panel",
      "portal-cart",
      "עגלת קניות",
      absoluteLayout(80, 230, 980, 340, 3),
      { minHeight: "320px" },
    ),
  ],
);

const welcomeNav = portalSection(
  "section-portal-welcome-nav",
  "ברוכים הבאים לאזור האישי",
  "סקשן פתיחה עם כפתורים לעמודים הפרטיים",
  ["welcome", "ניווט"],
  "#0f172a",
  "420px",
  IMG.abstract,
  [
    textNode(
      "eyebrow",
      "PRIVATE AREA",
      {
        color: "#7dd3fc",
        fontSize: "12px",
        fontWeight: "800",
      },
      absoluteLayout(80, 80, 220, 24, 2),
    ),
    textNode(
      "title",
      "הכול במקום אחד",
      {
        color: "#ffffff",
        fontSize: "44px",
        fontWeight: "900",
      },
      absoluteLayout(80, 120, 560, 60, 2),
    ),
    textNode(
      "subtitle",
      "הזמנות, עגלה, חשבון אישי ותוכן שנפתח רק אחרי התחברות.",
      {
        color: "#cbd5e1",
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "1.7",
      },
      absoluteLayout(80, 195, 520, 70, 2),
    ),
    buttonNode(
      "btn-account",
      "החשבון שלי",
      {
        color: ink,
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        padding: "14px 22px",
        fontSize: "14px",
        fontWeight: "800",
      },
      absoluteLayout(80, 300, 150, 48, 3),
      "/account",
    ),
    buttonNode(
      "btn-orders",
      "הזמנות",
      {
        color: "#ffffff",
        backgroundColor: sky,
        borderRadius: "14px",
        padding: "14px 22px",
        fontSize: "14px",
        fontWeight: "800",
      },
      absoluteLayout(250, 300, 130, 48, 3),
      "/orders",
    ),
    buttonNode(
      "btn-login",
      "התחברות",
      {
        color: "#ffffff",
        backgroundColor: "transparent",
        border: "1px solid rgba(255,255,255,0.35)",
        borderRadius: "14px",
        padding: "14px 22px",
        fontSize: "14px",
        fontWeight: "800",
      },
      absoluteLayout(400, 300, 130, 48, 3),
      "/portal/login",
    ),
  ],
);

export const PORTAL_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  loginHero,
  accountHub,
  ordersSection,
  cartSection,
  welcomeNav,
];
