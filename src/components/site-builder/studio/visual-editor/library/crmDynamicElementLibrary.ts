import { absoluteLayout, textNode } from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

type CrmRawField = {
  key: string;
  label: string;
  sample: string;
  description: string;
  keywords?: string[];
};

/** Keys must match CRM / portal customData (`treatments_left`, not `treatments_count`). */
const CRM_RAW_FIELDS: CrmRawField[] = [
  {
    key: "treatments_left",
    label: "כמות טיפולים",
    sample: "4",
    description: "כמות טיפולים - ערך מה-CRM של הלקוח המחובר",
    keywords: ["טיפולים", "כמות", "crm"],
  },
  {
    key: "weight",
    label: "משקל",
    sample: "72",
    description: "משקל - ערך מה-CRM של הלקוח המחובר",
    keywords: ["משקל", "weight", "crm"],
  },
  {
    key: "sessions_done",
    label: "מפגשים שבוצעו",
    sample: "8",
    description: "מפגשים שבוצעו - ערך מה-CRM של הלקוח המחובר",
    keywords: ["מפגשים", "פגישות", "crm"],
  },
  {
    key: "balance",
    label: "יתרה",
    sample: "250",
    description: "יתרה - ערך מה-CRM של הלקוח המחובר",
    keywords: ["יתרה", "תשלום", "crm"],
  },
  {
    key: "summary",
    label: "סיכום",
    sample: "התקדמות טובה — ממשיכים לפי התוכנית",
    description: "סיכום - ערך מהתיק ב-CRM",
    keywords: ["סיכום", "summary", "crm"],
  },
  {
    key: "treatment_plan",
    label: "תכנית טיפול",
    sample: "מפגש שבועי · תרגילים · יעד לחודש",
    description: "תכנית טיפול - מה-CRM",
    keywords: ["תכנית", "טיפול", "crm"],
  },
  {
    key: "continuation_plan",
    label: "תוכנית המשך",
    sample: "4 מפגשים נוספים + מעקב משקל",
    description: "תוכנית המשך - מה-CRM",
    keywords: ["המשך", "תוכנית", "crm"],
  },
  {
    key: "follow_up_plan",
    label: "תכנית מעקב",
    sample: "בדיקה כל שבועיים · מדידת מדדים",
    description: "תכנית מעקב - מה-CRM",
    keywords: ["מעקב", "follow", "crm"],
  },
  {
    key: "client_name",
    label: "שם לקוח",
    sample: "ישראל ישראלי",
    description: "שם הלקוח מהאזור האישי / CRM",
    keywords: ["שם", "לקוח", "crm"],
  },
  {
    key: "client_phone",
    label: "טלפון לקוח",
    sample: "050-0000000",
    description: "טלפון הלקוח מה-CRM",
    keywords: ["טלפון", "לקוח", "crm"],
  },
  {
    key: "client_email",
    label: "מייל לקוח",
    sample: "client@email.com",
    description: "כתובת המייל של הלקוח מה-CRM",
    keywords: ["מייל", "אימייל", "crm"],
  },
  {
    key: "next_appointment",
    label: "הפגישה הבאה",
    sample: "12/08/2026 10:00",
    description: "הפגישה הבאה - מהיומן",
    keywords: ["פגישה", "תור", "crm"],
  },
];

function crmTextElement(field: CrmRawField): VisualLibraryElementItem {
  const text = `${field.label} - ${field.sample}`;
  const isLong = text.length > 42;

  return {
    id: `crm-field-${field.key}`,
    kind: "element",
    tab: "elements",
    category: "dynamic",
    title: field.label,
    description: `${text} · אישי לפי לקוח מחובר`,
    keywords: [
      field.label,
      "crm",
      "דינמי",
      "נתון",
      "משתנה",
      ...(field.keywords || []),
    ],
    previewHtml: `<div style="display:inline-block;font-size:16px;font-weight:800;color:#0f172a;white-space:nowrap;padding:8px">${text}</div>`,
    nodes: [
      {
        ...textNode(
          "root",
          text,
          {
            color: "#0f172a",
            fontSize: "22px",
            fontWeight: "800",
            lineHeight: "1.35",
            whiteSpace: isLong ? "normal" : "nowrap",
            display: "inline-block",
            backgroundColor: "transparent",
            backgroundImage: "none",
            border: "none",
            borderRadius: "0",
            boxShadow: "none",
            padding: "0",
            margin: "0",
          },
          {
            ...absoluteLayout(40, 40, "fit-content", "auto", 20),
            minWidth: 0,
            minHeight: "auto",
            maxWidth: isLong ? "520px" : "none",
          },
          field.label,
        ),
        attributes: {
          "data-client-variable": "true",
          "data-client-variable-key": field.key,
          "data-client-variable-label": field.label,
          "data-client-variable-display": "label-value",
          "data-client-variable-source": "crm_client",
          "data-bizuply-crm-field": field.key,
          "data-bizuply-crm-field-part": "both",
          "data-bizuply-crm-field-label": field.label,
        },
      },
    ],
  };
}

export const CRM_DYNAMIC_ELEMENT_LIBRARY: VisualLibraryElementItem[] = [
  {
    id: "crm-field-greeting",
    kind: "element",
    tab: "elements",
    category: "dynamic",
    title: "שלום, שם לקוח",
    description:
      "ברכה אישית — אחרי התחברות מוצג שם הלקוח מהאזור האישי / CRM",
    keywords: ["שלום", "ברכה", "שם", "לקוח", "crm", "greeting"],
    previewHtml:
      '<div style="display:inline-block;font-size:18px;font-weight:800;color:#0f172a;white-space:nowrap;padding:8px">שלום, ישראל ישראלי</div>',
    nodes: [
      {
        ...textNode(
          "root",
          "שלום, ישראל ישראלי",
          {
            color: "#0f172a",
            fontSize: "22px",
            fontWeight: "800",
            lineHeight: "1.35",
            whiteSpace: "nowrap",
            display: "inline-block",
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
            padding: "0",
          },
          {
            ...absoluteLayout(40, 40, "fit-content", "auto", 20),
            minWidth: 0,
            minHeight: "auto",
          },
          "שלום, שם לקוח",
        ),
        attributes: {
          "data-client-variable": "true",
          "data-client-variable-key": "client_name",
          "data-client-variable-label": "שם לקוח",
          "data-client-variable-display": "greeting",
          "data-client-variable-source": "crm_client",
          "data-bizuply-crm-field": "client_name",
          "data-bizuply-crm-field-part": "value",
          "data-bizuply-crm-field-format": "greeting",
          "data-bizuply-crm-field-label": "שם לקוח",
        },
      },
    ],
  },
  {
    id: "crm-generic-label-value",
    kind: "element",
    tab: "elements",
    category: "dynamic",
    title: "נתון משתנה מה-CRM",
    description: "מוסיף טקסט בפורמט ״שם - ערך״ בכל מקום בעמוד — בלי כרטיסייה",
    keywords: ["crm", "דינמי", "משתנה", "נתון", "שם", "ערך"],
    previewHtml:
      '<div style="display:inline-block;font-size:18px;font-weight:800;color:#0f172a;white-space:nowrap">שם השדה - ערך</div>',
    nodes: [
      {
        ...textNode(
          "root",
          "שם השדה - ערך",
          {
            color: "#0f172a",
            fontSize: "22px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            display: "inline-block",
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
            padding: "0",
          },
          {
            ...absoluteLayout(40, 40, "fit-content", "auto", 20),
            minWidth: 0,
            minHeight: "auto",
          },
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
          "data-bizuply-crm-field-label": "שם השדה",
        },
      },
    ],
  },
  ...CRM_RAW_FIELDS.map((field) => crmTextElement(field)),
];
