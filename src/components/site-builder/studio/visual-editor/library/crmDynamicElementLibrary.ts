import { absoluteLayout, textNode } from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

type CrmRawField = {
  key: string;
  label: string;
  sample: string;
  description: string;
  /** Prefer name+value for plans/summaries; value-only for metrics. */
  defaultPart?: "value" | "both";
  keywords?: string[];
};

/** Keys must match CRM / portal customData (`treatments_left`, not `treatments_count`). */
const CRM_RAW_FIELDS: CrmRawField[] = [
  {
    key: "treatments_left",
    label: "כמות טיפולים",
    sample: "4",
    description: "מספר הטיפולים של הלקוח — מתעדכן מה-CRM",
    defaultPart: "value",
    keywords: ["טיפולים", "כמות", "crm"],
  },
  {
    key: "weight",
    label: "משקל",
    sample: "72",
    description: "משקל הלקוח — מתעדכן אוטומטית מה-CRM",
    defaultPart: "value",
    keywords: ["משקל", "weight", "crm"],
  },
  {
    key: "sessions_done",
    label: "מפגשים שבוצעו",
    sample: "8",
    description: "מפגשים שבוצעו — מתעדכן אוטומטית מה-CRM",
    defaultPart: "value",
    keywords: ["מפגשים", "פגישות", "crm"],
  },
  {
    key: "balance",
    label: "יתרה",
    sample: "250",
    description: "יתרת הלקוח — מתעדכנת אוטומטית מה-CRM",
    defaultPart: "value",
    keywords: ["יתרה", "תשלום", "crm"],
  },
  {
    key: "summary",
    label: "סיכום",
    sample: "התקדמות טובה — ממשיכים לפי התוכנית",
    description: "סיכום מצב מהתיק ב-CRM (שם + ערך)",
    defaultPart: "both",
    keywords: ["סיכום", "summary", "crm"],
  },
  {
    key: "treatment_plan",
    label: "תכנית טיפול",
    sample: "מפגש שבועי · תרגילים · יעד לחודש",
    description: "תכנית טיפול מלאה מה-CRM",
    defaultPart: "both",
    keywords: ["תכנית", "טיפול", "crm"],
  },
  {
    key: "continuation_plan",
    label: "תוכנית המשך",
    sample: "4 מפגשים נוספים + מעקב משקל",
    description: "תוכנית המשך מה-CRM",
    defaultPart: "both",
    keywords: ["המשך", "תוכנית", "crm"],
  },
  {
    key: "follow_up_plan",
    label: "תכנית מעקב",
    sample: "בדיקה כל שבועיים · מדידת מדדים",
    description: "תכנית מעקב מה-CRM",
    defaultPart: "both",
    keywords: ["מעקב", "follow", "crm"],
  },
  {
    key: "client_name",
    label: "שם לקוח",
    sample: "ישראל ישראלי",
    description: "שם הלקוח מהתיק ב-CRM",
    defaultPart: "value",
    keywords: ["שם", "לקוח", "crm"],
  },
  {
    key: "client_phone",
    label: "טלפון לקוח",
    sample: "050-0000000",
    description: "טלפון הלקוח מה-CRM",
    defaultPart: "value",
    keywords: ["טלפון", "לקוח", "crm"],
  },
  {
    key: "client_email",
    label: "מייל לקוח",
    sample: "client@email.com",
    description: "כתובת המייל של הלקוח מה-CRM",
    defaultPart: "value",
    keywords: ["מייל", "אימייל", "crm"],
  },
  {
    key: "next_appointment",
    label: "הפגישה הבאה",
    sample: "12/08/2026 10:00",
    description: "תאריך ושעת הפגישה הבאה מהיומן",
    defaultPart: "both",
    keywords: ["פגישה", "תור", "crm"],
  },
];

function crmTextElement(
  field: CrmRawField,
  forcePart?: "value" | "both",
): VisualLibraryElementItem {
  const part = forcePart || field.defaultPart || "value";
  const text =
    part === "both" ? `${field.label} - ${field.sample}` : field.sample;
  const idSuffix = forcePart === "both" ? "label" : "raw";

  return {
    id: `crm-${idSuffix}-${field.key}`,
    kind: "element",
    tab: "elements",
    category: "dynamic",
    title:
      part === "both" ? `${field.label} (שם וערך)` : field.label,
    description:
      part === "both"
        ? `מוסיף "${field.label} - ערך" בלי כרטיסייה — מתעדכן מה-CRM`
        : field.description,
    keywords: [
      field.label,
      "crm",
      "דינמי",
      "נתון",
      "משתנה",
      ...(field.keywords || []),
    ],
    previewHtml: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:${part === "both" ? "16px" : "34px"};font-weight:900;color:#0f172a;text-align:center;padding:8px">${text}</div>`,
    nodes: [
      {
        ...textNode(
          "root",
          text,
          {
            color: "#0f172a",
            fontSize: part === "both" ? "20px" : "36px",
            fontWeight: "800",
            lineHeight: "1.35",
            backgroundColor: "transparent",
            backgroundImage: "none",
            border: "none",
            borderRadius: "0",
            boxShadow: "none",
            padding: "0",
            margin: "0",
          },
          absoluteLayout(40, 40, part === "both" ? "420px" : "320px", part === "both" ? "80px" : "56px", 20),
          field.label,
        ),
        attributes: {
          "data-client-variable": "true",
          "data-client-variable-key": field.key,
          "data-client-variable-label": field.label,
          "data-client-variable-display":
            part === "both" ? "label-value" : "raw",
          "data-client-variable-source": "crm_client",
          "data-bizuply-crm-field": field.key,
          "data-bizuply-crm-field-part": part,
        },
      },
    ],
  };
}

export const CRM_DYNAMIC_ELEMENT_LIBRARY: VisualLibraryElementItem[] = [
  {
    id: "crm-generic-label-value",
    kind: "element",
    tab: "elements",
    category: "dynamic",
    title: "נתון משתנה מה-CRM",
    description: "מוסיף טקסט בפורמט ״שם - ערך״ בכל מקום בעמוד — בלי כרטיסייה",
    keywords: ["crm", "דינמי", "משתנה", "נתון", "שם", "ערך"],
    previewHtml:
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:18px;font-weight:800;color:#0f172a">שם השדה - ערך</div>',
    nodes: [
      {
        ...textNode(
          "root",
          "שם השדה - ערך",
          {
            color: "#0f172a",
            fontSize: "22px",
            fontWeight: "700",
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
            padding: "0",
          },
          absoluteLayout(40, 40, "360px", "40px", 20),
          "נתון משתנה",
        ),
        attributes: {
          "data-client-variable": "true",
          "data-client-variable-key": "custom_field",
          "data-client-variable-label": "שם השדה",
          "data-client-variable-display": "label-value",
          "data-client-variable-source": "crm_client",
          "data-bizuply-crm-field": "custom_field",
          "data-bizuply-crm-field-part": "both",
        },
      },
    ],
  },
  ...CRM_RAW_FIELDS.map((field) =>
    crmTextElement(field, field.defaultPart === "both" ? "both" : "value"),
  ),
  // Explicit name+value variants for metrics too.
  ...CRM_RAW_FIELDS.filter((field) => field.defaultPart !== "both").map(
    (field) => crmTextElement(field, "both"),
  ),
];
