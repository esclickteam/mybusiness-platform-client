import {
  absoluteLayout,
  boxNode,
  buttonNode,
  textNode,
} from "./libraryFactories";
import type {
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";
import { VISUAL_LIBRARY_IMAGES } from "./libraryAssets";

type Theme = {
  bg: string;
  soft: string;
  card: string;
  ink: string;
  muted: string;
  accent: string;
  line: string;
  photo: string;
};

const THEMES: Theme[] = [
  {
    bg: "#f8fafc",
    soft: "#eef2ff",
    card: "#ffffff",
    ink: "#0f172a",
    muted: "#64748b",
    accent: "#0f766e",
    line: "#e2e8f0",
    photo: VISUAL_LIBRARY_IMAGES.team,
  },
  {
    bg: "#ffffff",
    soft: "#f1f5f9",
    card: "#ffffff",
    ink: "#111827",
    muted: "#6b7280",
    accent: "#1d4ed8",
    line: "#e5e7eb",
    photo: VISUAL_LIBRARY_IMAGES.office,
  },
  {
    bg: "#0f172a",
    soft: "#1e293b",
    card: "#1e293b",
    ink: "#f8fafc",
    muted: "#94a3b8",
    accent: "#38bdf8",
    line: "#334155",
    photo: VISUAL_LIBRARY_IMAGES.city,
  },
];

function crmFieldText(
  key: string,
  fieldKey: string,
  sample: string,
  style: Record<string, any>,
  layout: ReturnType<typeof absoluteLayout>,
  part: "value" | "label" | "both" = "value",
  label = "נתון CRM",
): VisualLibraryNodeTemplate {
  return textNode(key, sample, style, layout, label, {
    "data-bizuply-crm-field": fieldKey,
    "data-bizuply-crm-field-part": part,
    "data-client-variable": "true",
    "data-client-variable-key": fieldKey,
    "data-client-variable-label": label,
    "data-client-variable-display":
      part === "both" ? "label-value" : part === "label" ? "label" : "raw",
  });
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
    keywords: ["אזור אישי", "portal", "אחרי התחברות", "CRM", ...keywords],
    previewLayout: id,
    backgroundColor: theme.bg,
    minHeight,
    thumbnail: theme.photo,
    lockPalette: false,
    nodes,
  };
}

function planBlock(
  prefix: string,
  x: number,
  y: number,
  w: number,
  theme: Theme,
  fieldKey: string,
  label: string,
  sample: string,
): VisualLibraryNodeTemplate[] {
  return [
    boxNode(
      `${prefix}-card`,
      {
        backgroundColor: theme.card,
        borderRadius: "22px",
        border: `1px solid ${theme.line}`,
        boxShadow: "0 16px 40px -28px rgba(15,23,42,0.35)",
      },
      absoluteLayout(x, y, w, 180, 2),
      label,
    ),
    crmFieldText(
      `${prefix}-label`,
      fieldKey,
      label,
      { color: theme.muted, fontSize: "13px", fontWeight: "800" },
      absoluteLayout(x + 24, y + 24, w - 48, 24, 3),
      "label",
      label,
    ),
    crmFieldText(
      `${prefix}-value`,
      fieldKey,
      sample,
      {
        color: theme.ink,
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "1.65",
      },
      absoluteLayout(x + 24, y + 56, w - 48, 100, 3),
      "value",
      label,
    ),
  ];
}

function treatmentPlanNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "eyebrow",
        "תוכנית המשך טיפול",
        { color: theme.accent, fontSize: "13px", fontWeight: "900", letterSpacing: "0.06em" },
        absoluteLayout(64, 40, 420, 24, 2),
      ),
      textNode(
        "title",
        "התוכנית שלך להמשך",
        { color: theme.ink, fontSize: "40px", fontWeight: "900" },
        absoluteLayout(64, 72, 640, 52, 2),
      ),
      textNode(
        "subtitle",
        "הערכים נמשכים אוטומטית מתיק הלקוח ב-CRM אחרי התחברות.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 132, 640, 40, 2),
      ),
      ...planBlock("summary", 64, 200, 520, theme, "summary", "סיכום", "סיכום הטיפולים והמצב הנוכחי של הלקוח."),
      ...planBlock("plan", 616, 200, 420, theme, "treatment_plan", "תכנית טיפול", "שלבים מומלצים להמשך הטיפול."),
      ...planBlock("cont", 64, 410, 520, theme, "continuation_plan", "תוכנית המשך", "מה ממשיכים בשבועות הקרובים."),
      ...planBlock("follow", 616, 410, 420, theme, "follow_up_plan", "תכנית מעקב", "נקודות למעקב ותזכורות."),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "מסלול טיפול אישי",
        { color: theme.ink, fontSize: "38px", fontWeight: "900" },
        absoluteLayout(64, 48, 700, 50, 2),
      ),
      crmFieldText(
        "both-summary",
        "summary",
        "סיכום - מצב עדכני מהתיק",
        { color: theme.ink, fontSize: "20px", fontWeight: "800" },
        absoluteLayout(64, 130, 900, 40, 2),
        "both",
        "סיכום",
      ),
      ...planBlock("p1", 64, 200, 960, theme, "treatment_plan", "תכנית טיפול", "פירוט תכנית הטיפול המלאה מה-CRM."),
      ...planBlock("p2", 64, 410, 460, theme, "continuation_plan", "תוכנית המשך", "המשך מומלץ."),
      ...planBlock("p3", 564, 410, 460, theme, "follow_up_plan", "תכנית מעקב", "מעקב שוטף."),
    ],
    () => [
      boxNode(
        "bg",
        {
          backgroundImage: `linear-gradient(145deg, ${theme.ink} 0%, ${theme.accent}55 60%, ${theme.soft} 100%)`,
        },
        absoluteLayout(0, 0, "100%", "100%", 1),
        "רקע",
      ),
      textNode(
        "title",
        "המשך · מעקב · סיכום",
        { color: "#f8fafc", fontSize: "38px", fontWeight: "900" },
        absoluteLayout(64, 48, 700, 50, 2),
      ),
      crmFieldText(
        "s",
        "summary",
        "סיכום מה-CRM",
        { color: "#e2e8f0", fontSize: "18px", fontWeight: "700", lineHeight: "1.6" },
        absoluteLayout(64, 120, 900, 60, 2),
        "value",
        "סיכום",
      ),
      ...planBlock("a", 64, 220, 300, theme, "treatment_plan", "תכנית טיפול", "תכנית."),
      ...planBlock("b", 392, 220, 300, theme, "continuation_plan", "תוכנית המשך", "המשך."),
      ...planBlock("c", 720, 220, 300, theme, "follow_up_plan", "תכנית מעקב", "מעקב."),
      crmFieldText(
        "m1",
        "treatments_left",
        "כמות טיפולים - 4",
        { color: "#f8fafc", fontSize: "18px", fontWeight: "800" },
        absoluteLayout(64, 460, 300, 36, 2),
        "both",
        "כמות טיפולים",
      ),
      crmFieldText(
        "m2",
        "sessions_done",
        "מפגשים שבוצעו - 8",
        { color: "#f8fafc", fontSize: "18px", fontWeight: "800" },
        absoluteLayout(392, 460, 300, 36, 2),
        "both",
        "מפגשים שבוצעו",
      ),
      crmFieldText(
        "m3",
        "weight",
        "משקל - 72",
        { color: "#f8fafc", fontSize: "18px", fontWeight: "800" },
        absoluteLayout(720, 460, 300, 36, 2),
        "both",
        "משקל",
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

function followUpNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode(
        "title",
        "תכנית מעקב",
        { color: theme.ink, fontSize: "42px", fontWeight: "900" },
        absoluteLayout(64, 48, 560, 52, 2),
      ),
      textNode(
        "subtitle",
        "נקודות מעקב וערכים שנמדדים לאורך זמן — מחוברים ל-CRM.",
        { color: theme.muted, fontSize: "15px", fontWeight: "600" },
        absoluteLayout(64, 112, 640, 40, 2),
      ),
      ...planBlock("follow", 64, 180, 640, theme, "follow_up_plan", "תכנית מעקב", "רשימת נקודות למעקב אישי."),
      ...planBlock("summary", 736, 180, 280, theme, "summary", "סיכום", "סיכום קצר."),
      crmFieldText("w", "weight", "משקל - 72", { color: theme.ink, fontSize: "22px", fontWeight: "800" }, absoluteLayout(64, 400, 300, 40, 2), "both", "משקל"),
      crmFieldText("t", "treatments_left", "כמות טיפולים - 4", { color: theme.ink, fontSize: "22px", fontWeight: "800" }, absoluteLayout(400, 400, 300, 40, 2), "both", "כמות טיפולים"),
      crmFieldText("s", "sessions_done", "מפגשים שבוצעו - 8", { color: theme.ink, fontSize: "22px", fontWeight: "800" }, absoluteLayout(736, 400, 280, 40, 2), "both", "מפגשים שבוצעו"),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "מעקב שוטף", { color: theme.ink, fontSize: "38px", fontWeight: "900" }, absoluteLayout(64, 48, 600, 48, 2)),
      ...planBlock("f", 64, 140, 960, theme, "follow_up_plan", "תכנית מעקב", "מה בודקים בכל מפגש / שבוע."),
      ...planBlock("c", 64, 360, 960, theme, "continuation_plan", "תוכנית המשך", "מה הצעד הבא אחרי המעקב."),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "לוח מעקב", { color: theme.ink, fontSize: "40px", fontWeight: "900" }, absoluteLayout(64, 40, 500, 50, 2)),
      crmFieldText("f", "follow_up_plan", "תכנית מעקב מה-CRM", { color: theme.ink, fontSize: "18px", fontWeight: "700", lineHeight: "1.7" }, absoluteLayout(64, 120, 900, 80, 2), "value", "תכנית מעקב"),
      crmFieldText("b1", "weight", "משקל - 72", { color: theme.ink, fontSize: "20px", fontWeight: "800" }, absoluteLayout(64, 240, 280, 36, 2), "both", "משקל"),
      crmFieldText("b2", "balance", "יתרה - 250", { color: theme.ink, fontSize: "20px", fontWeight: "800" }, absoluteLayout(380, 240, 280, 36, 2), "both", "יתרה"),
      crmFieldText("b3", "treatments_left", "כמות טיפולים - 4", { color: theme.ink, fontSize: "20px", fontWeight: "800" }, absoluteLayout(696, 240, 300, 36, 2), "both", "כמות טיפולים"),
      ...planBlock("s", 64, 320, 960, theme, "summary", "סיכום", "סיכום עדכני מהתיק."),
    ],
  ];
  return layouts[index % layouts.length]();
}

function menuNodes(theme: Theme, index: number): VisualLibraryNodeTemplate[] {
  const links = [
    { label: "אזור אישי", href: "/account" },
    { label: "תוכנית טיפול", href: "/treatment-plan" },
    { label: "תכנית מעקב", href: "/follow-up" },
    { label: "הנתונים שלי", href: "/my-data" },
    { label: "הזמנות", href: "/orders" },
  ];
  const layouts: Array<() => VisualLibraryNodeTemplate[]> = [
    () => [
      boxNode("bg", { backgroundColor: theme.bg }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "תפריט האזור האישי", { color: theme.ink, fontSize: "40px", fontWeight: "900" }, absoluteLayout(64, 48, 640, 52, 2)),
      textNode("subtitle", "ניווט ברור לכל עמודי הפורטל — מתאים לכל סוגי העסקים.", { color: theme.muted, fontSize: "15px", fontWeight: "600" }, absoluteLayout(64, 112, 700, 40, 2)),
      ...links.flatMap((link, i) => [
        boxNode(
          `item-${i}`,
          {
            backgroundColor: theme.card,
            borderRadius: "18px",
            border: `1px solid ${theme.line}`,
          },
          absoluteLayout(64, 180 + i * 72, 700, 60, 2),
          link.label,
        ),
        buttonNode(
          `link-${i}`,
          link.label,
          {
            color: theme.ink,
            backgroundColor: "transparent",
            fontSize: "18px",
            fontWeight: "800",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingInlineStart: "18px",
          },
          absoluteLayout(64, 180 + i * 72, 700, 60, 3),
          link.href,
        ),
      ]),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.soft }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      boxNode(
        "bar",
        {
          backgroundColor: theme.card,
          borderRadius: "999px",
          border: `1px solid ${theme.line}`,
          boxShadow: "0 14px 34px rgba(15,23,42,.08)",
        },
        absoluteLayout(48, 80, 1000, 78, 2),
        "תפריט עליון",
      ),
      textNode("logo", "האזור שלי", { color: theme.ink, fontSize: "18px", fontWeight: "900" }, absoluteLayout(80, 104, 160, 32, 3), "לוגו"),
      ...links.slice(0, 4).map((link, i) =>
        buttonNode(
          `nav-${i}`,
          link.label,
          {
            color: theme.ink,
            backgroundColor: "transparent",
            fontSize: "14px",
            fontWeight: "800",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          },
          absoluteLayout(280 + i * 170, 98, 150, 42, 3),
          link.href,
        ),
      ),
      textNode("title", "ברוכים הבאים", { color: theme.ink, fontSize: "36px", fontWeight: "900" }, absoluteLayout(64, 220, 600, 48, 2)),
      crmFieldText("hello", "summary", "סיכום קצר מה-CRM", { color: theme.muted, fontSize: "16px", fontWeight: "600" }, absoluteLayout(64, 280, 700, 40, 2), "value", "סיכום"),
    ],
    () => [
      boxNode("bg", { backgroundColor: theme.ink }, absoluteLayout(0, 0, "100%", "100%", 1), "רקע"),
      textNode("title", "תפריט ניווט", { color: "#f8fafc", fontSize: "38px", fontWeight: "900" }, absoluteLayout(64, 48, 500, 48, 2)),
      ...links.map((link, i) =>
        buttonNode(
          `dlink-${i}`,
          link.label,
          {
            color: "#0f172a",
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            fontSize: "15px",
            fontWeight: "900",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          },
          absoluteLayout(64 + (i % 3) * 320, 140 + Math.floor(i / 3) * 90, 280, 56, 3),
          link.href,
        ),
      ),
    ],
  ];
  return layouts[index % layouts.length]();
}

export function buildCarePlanPortalSections(): VisualLibrarySectionTemplate[] {
  const sections: VisualLibrarySectionTemplate[] = [];

  for (let i = 0; i < 3; i += 1) {
    const theme = THEMES[i % THEMES.length];
    const n = String(i + 1).padStart(2, "0");
    sections.push(
      makeSection(
        `section-portal-treatment-plan-${n}`,
        `תוכנית המשך טיפול ${i + 1}`,
        "עמוד אחרי התחברות עם סיכום, תכנית טיפול, המשך ומעקב מה-CRM",
        ["portal-treatment-plan", "תוכנית טיפול", "המשך טיפול", "סיכום"],
        theme,
        "720px",
        treatmentPlanNodes(theme, i),
      ),
    );
    sections.push(
      makeSection(
        `section-portal-follow-up-${n}`,
        `תכנית מעקב ${i + 1}`,
        "עמוד מעקב עם ערכים שנמדדים לאורך זמן מה-CRM",
        ["portal-follow-up", "מעקב", "follow-up", "מדדים"],
        theme,
        "680px",
        followUpNodes(theme, i),
      ),
    );
    sections.push(
      makeSection(
        `section-portal-menu-${n}`,
        `תפריט אזור אישי ${i + 1}`,
        "תפריט ניווט כללי לאזור האישי — מתאים לכל עסק",
        ["portal-menu", "תפריט", "ניווט", "menu"],
        theme,
        "640px",
        menuNodes(theme, i),
      ),
    );
  }

  return sections;
}
