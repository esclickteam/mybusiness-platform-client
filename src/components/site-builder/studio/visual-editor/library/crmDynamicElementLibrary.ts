import { absoluteLayout, textNode } from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

type CrmRawField = {
  key: string;
  label: string;
  sample: string;
  description: string;
  keywords?: string[];
};

const CRM_RAW_FIELDS: CrmRawField[] = [
  {
    key: "treatments_count",
    label: "כמות טיפולים",
    sample: "4",
    description: "מספר הטיפולים של הלקוח — מתעדכן מה-CRM",
    keywords: ["טיפולים", "כמות", "crm"],
  },
  {
    key: "weight",
    label: "משקל",
    sample: "72",
    description: "משקל הלקוח — מתעדכן אוטומטית מה-CRM",
    keywords: ["משקל", "weight", "crm"],
  },
  {
    key: "meetings_held",
    label: "מפגשים שבוצעו",
    sample: "8",
    description: "מפגשים שבוצעו — מתעדכן אוטומטית מה-CRM",
    keywords: ["מפגשים", "פגישות", "crm"],
  },
  {
    key: "balance",
    label: "יתרה",
    sample: "250",
    description: "יתרת הלקוח — מתעדכנת אוטומטית מה-CRM",
    keywords: ["יתרה", "תשלום", "crm"],
  },
  {
    key: "client_name",
    label: "שם לקוח",
    sample: "ישראל ישראלי",
    description: "שם הלקוח מהתיק ב-CRM",
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
    description: "תאריך ושעת הפגישה הבאה מהיומן",
    keywords: ["פגישה", "תור", "crm"],
  },
];

function rawCrmTextElement(
  field: CrmRawField,
): VisualLibraryElementItem {
  return {
    id: `crm-raw-${field.key}`,
    kind: "element",
    tab: "elements",
    category: "dynamic",
    title: field.label,
    description: field.description,
    keywords: [
      field.label,
      "crm",
      "דינמי",
      "נתון",
      "משתנה",
      ...(field.keywords || []),
    ],
    // Preview shows only the value — no card chrome behind it.
    previewHtml: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:34px;font-weight:900;color:#0f172a;letter-spacing:-0.02em">${field.sample}</div>`,
    nodes: [
      {
        ...textNode(
          "root",
          field.sample,
          {
            color: "#0f172a",
            fontSize: "36px",
            fontWeight: "800",
            lineHeight: "1.2",
            backgroundColor: "transparent",
            backgroundImage: "none",
            border: "none",
            borderRadius: "0",
            boxShadow: "none",
            padding: "0",
            margin: "0",
          },
          absoluteLayout(40, 40, "320px", "56px", 20),
          field.label,
        ),
        attributes: {
          "data-client-variable": "true",
          "data-client-variable-key": field.key,
          "data-client-variable-label": field.label,
          "data-client-variable-display": "raw",
          "data-client-variable-source": "crm_client",
        },
      },
    ],
  };
}

function labelValueCrmElement(
  field: CrmRawField,
): VisualLibraryElementItem {
  const text = `${field.label} - ${field.sample}`;
  return {
    id: `crm-label-${field.key}`,
    kind: "element",
    tab: "elements",
    category: "dynamic",
    title: `${field.label} (שם וערך)`,
    description: `מוסיף טקסט בפורמט "${field.label} - ערך" בלי כרטיסייה`,
    keywords: [
      field.label,
      "crm",
      "דינמי",
      "שם",
      "ערך",
      ...(field.keywords || []),
    ],
    previewHtml: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:18px;font-weight:800;color:#0f172a">${text}</div>`,
    nodes: [
      {
        ...textNode(
          "root",
          text,
          {
            color: "#0f172a",
            fontSize: "22px",
            fontWeight: "700",
            lineHeight: "1.35",
            backgroundColor: "transparent",
            backgroundImage: "none",
            border: "none",
            borderRadius: "0",
            boxShadow: "none",
            padding: "0",
            margin: "0",
          },
          absoluteLayout(40, 40, "360px", "40px", 20),
          field.label,
        ),
        attributes: {
          "data-client-variable": "true",
          "data-client-variable-key": field.key,
          "data-client-variable-label": field.label,
          "data-client-variable-display": "label-value",
          "data-client-variable-source": "crm_client",
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
        },
      },
    ],
  },
  ...CRM_RAW_FIELDS.map(rawCrmTextElement),
  ...CRM_RAW_FIELDS.map(labelValueCrmElement),
];
