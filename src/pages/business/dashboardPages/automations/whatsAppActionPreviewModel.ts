import type {
  ApprovedWhatsAppTemplate,
  WhatsAppHeaderType,
  WhatsAppTemplateButton,
  WhatsAppVariableMapping,
} from "../../../../api/whatsappApi";

export const WA_PREVIEW_EMPTY_HE = "הצגת ההודעה תופיע לאחר בחירת תבנית";
export const WA_PREVIEW_ERROR_HE = "לא ניתן להציג כרגע תצוגה מקדימה";

export const WA_PREVIEW_SAMPLE_DATA = {
  leadName: "ישראל ישראלי",
  businessName: "העסק שלי",
  appointmentDate: "16/09/2026",
  appointmentTime: "18:00",
  phone: "050-1234567",
} as const;

export const WA_PREVIEW_RECIPIENT_LABELS: Record<string, string> = {
  lead_phone: "טלפון הליד",
  appointment_customer_phone: "טלפון הלקוח",
  business_owner: "בעל העסק",
  lead_owner: "אחראי הליד",
  fixed_phone: "מספר קבוע",
};

const WA_PREVIEW_VARIABLE_LABELS: Record<string, Record<string, string>> = {
  appointment_reminder: {
    "1": "שם הלקוח",
    "2": "זמן עד הפגישה",
    "3": "שעת הפגישה",
    "4": "שירות",
  },
  appointment_thanks: { "1": "שם הלקוח", "2": "שירות" },
  appointment_review: { "1": "שם הלקוח", "2": "שירות" },
  new_lead_welcome: { "1": "שם הליד" },
  lead_follow_up: { "1": "שם הליד" },
  lead_follow_up_2: { "1": "שם הליד" },
  new_client_welcome: { "1": "שם הלקוח" },
  inactive_client: { "1": "שם הלקוח" },
  new_lead_received_utility: {
    "1": "שם הליד",
    "2": "טלפון הליד",
    "3": "מקור הליד",
  },
  new_lead_received: {
    "1": "שם הליד",
    "2": "טלפון הליד",
    "3": "מקור הליד",
  },
};

const SAMPLE_BY_SOURCE_FIELD: Record<string, string> = {
  "lead:name": WA_PREVIEW_SAMPLE_DATA.leadName,
  "lead:fullName": WA_PREVIEW_SAMPLE_DATA.leadName,
  "contact:name": WA_PREVIEW_SAMPLE_DATA.leadName,
  "contact:fullName": WA_PREVIEW_SAMPLE_DATA.leadName,
  "appointment:clientName": WA_PREVIEW_SAMPLE_DATA.leadName,
  "appointment:clientSnapshot.name": WA_PREVIEW_SAMPLE_DATA.leadName,
  "business:name": WA_PREVIEW_SAMPLE_DATA.businessName,
  "appointment:date": WA_PREVIEW_SAMPLE_DATA.appointmentDate,
  "appointment:time": WA_PREVIEW_SAMPLE_DATA.appointmentTime,
  "lead:phone": WA_PREVIEW_SAMPLE_DATA.phone,
  "contact:phone": WA_PREVIEW_SAMPLE_DATA.phone,
  "appointment:clientPhone": WA_PREVIEW_SAMPLE_DATA.phone,
  "appointment:clientSnapshot.phone": WA_PREVIEW_SAMPLE_DATA.phone,
};

type MetaComponent = {
  type?: string;
  format?: string;
  text?: string;
  buttons?: Array<{
    type?: string;
    text?: string;
    url?: string;
    phone_number?: string;
  }>;
};

export type WhatsAppPreviewCopy = {
  headerType: WhatsAppHeaderType;
  headerText: string;
  body: string;
  footer: string;
  buttons: WhatsAppTemplateButton[];
};

export type WhatsAppPreviewModel = {
  state: "empty" | "error" | "ready";
  senderLabel: string;
  recipientLabel: string;
  headerType: WhatsAppHeaderType;
  headerText: string;
  body: string;
  footer: string;
  buttons: WhatsAppTemplateButton[];
};

function placeholderForVariable(metaTemplateName: string, variable: string) {
  const tpl = String(metaTemplateName || "").toLowerCase();
  const key = String(variable || "");
  const label = WA_PREVIEW_VARIABLE_LABELS[tpl]?.[key] || `משתנה ${key || "?"}`;
  return `[${label}]`;
}

export function previewValueForMapping(
  mapping: WhatsAppVariableMapping | undefined,
  metaTemplateName: string,
  variable: string
) {
  const source = String(mapping?.source || "").trim();
  const field = String(mapping?.field || "").trim();
  if (source === "constant" || source === "manual") {
    const constant = String(mapping?.constantValue || "").trim();
    return constant || placeholderForVariable(metaTemplateName, variable);
  }
  if (!source || !field) {
    return placeholderForVariable(metaTemplateName, variable);
  }
  const sample = SAMPLE_BY_SOURCE_FIELD[`${source}:${field}`];
  if (sample) return sample;
  return placeholderForVariable(metaTemplateName, variable);
}

export function interpolateWhatsAppPreviewText(
  template: string,
  mappings: WhatsAppVariableMapping[],
  metaTemplateName: string
) {
  return String(template || "").replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (_, key: string) => {
      const mapping = mappings.find(
        (row) => String(row.variable) === String(key)
      );
      return previewValueForMapping(mapping, metaTemplateName, key);
    }
  );
}

function parseButtonsFromMeta(
  buttons: MetaComponent["buttons"]
): WhatsAppTemplateButton[] {
  if (!Array.isArray(buttons)) return [];
  return buttons.map((btn) => {
    const btnType = String(btn?.type || "").toUpperCase();
    if (btnType === "URL") {
      return {
        type: "url" as const,
        text: String(btn?.text || "").trim(),
        url: String(btn?.url || "").trim(),
        urlType: String(btn?.url || "").includes("{{") ? "dynamic" : "static",
      };
    }
    if (btnType === "PHONE_NUMBER") {
      return {
        type: "phone_number" as const,
        text: String(btn?.text || "").trim(),
        phoneNumber: String(btn?.phone_number || "").trim(),
      };
    }
    if (btnType === "COPY_CODE") {
      return {
        type: "copy_code" as const,
        text: String(btn?.text || "").trim() || "Copy code",
      };
    }
    return {
      type: "quick_reply" as const,
      text: String(btn?.text || "").trim(),
    };
  });
}

export function extractWhatsAppTemplateCopy(
  template: Partial<ApprovedWhatsAppTemplate> | null | undefined
): WhatsAppPreviewCopy {
  const components = (Array.isArray(template?.components)
    ? template?.components
    : Array.isArray((template as { metaComponents?: unknown })?.metaComponents)
      ? (template as { metaComponents?: unknown[] }).metaComponents
      : []) as MetaComponent[];

  let headerType = (template?.headerType || "none") as WhatsAppHeaderType;
  let headerText = String(template?.headerText || "");
  let body = String(template?.body || "");
  let footer = String(template?.footer || "");
  let buttons = Array.isArray(template?.buttons) ? [...template.buttons] : [];

  for (const component of components) {
    const type = String(component?.type || "").toUpperCase();
    if (type === "HEADER") {
      const format = String(component?.format || "TEXT").toUpperCase();
      if (format === "TEXT") {
        headerType = "text";
        if (!headerText.trim()) headerText = String(component?.text || "").trim();
      } else if (["IMAGE", "VIDEO", "DOCUMENT", "LOCATION"].includes(format)) {
        headerType = format.toLowerCase() as WhatsAppHeaderType;
      }
    } else if (type === "BODY") {
      if (!body.trim()) body = String(component?.text || "").trim();
    } else if (type === "FOOTER") {
      if (!footer.trim()) footer = String(component?.text || "").trim();
    } else if (type === "BUTTONS" && buttons.length === 0) {
      buttons = parseButtonsFromMeta(component?.buttons);
    }
  }

  return {
    headerType: headerType || "none",
    headerText,
    body,
    footer,
    buttons,
  };
}

export function recipientLabelForPreview(
  recipientType: string | undefined,
  metaTemplateName: string
) {
  const key = String(recipientType || "").trim();
  if (key && WA_PREVIEW_RECIPIENT_LABELS[key]) {
    return WA_PREVIEW_RECIPIENT_LABELS[key];
  }
  const meta = String(metaTemplateName || "").toLowerCase();
  if (meta === "new_lead_received_utility" || meta === "new_lead_received") {
    return WA_PREVIEW_RECIPIENT_LABELS.business_owner;
  }
  return WA_PREVIEW_RECIPIENT_LABELS.lead_phone;
}

export function buildWhatsAppPreviewModel(args: {
  template: ApprovedWhatsAppTemplate | null;
  mappings?: WhatsAppVariableMapping[];
  recipientType?: string;
  senderLabel?: string;
  hasSelection?: boolean;
  forceError?: boolean;
}): WhatsAppPreviewModel {
  const senderLabel = String(args.senderLabel || "מספר BizUply המנוהל").trim();
  const recipientLabel = recipientLabelForPreview(
    args.recipientType,
    String(args.template?.metaTemplateName || "")
  );
  const empty: WhatsAppPreviewModel = {
    state: "empty",
    senderLabel,
    recipientLabel,
    headerType: "none",
    headerText: "",
    body: "",
    footer: "",
    buttons: [],
  };
  if (args.forceError) {
    return { ...empty, state: "error" };
  }
  if (!args.template) {
    return empty;
  }
  const copy = extractWhatsAppTemplateCopy(args.template);
  const hasMedia = ["image", "video", "document", "location"].includes(
    String(copy.headerType || "")
  );
  if (!copy.body.trim() && !copy.headerText.trim() && !hasMedia) {
    return { ...empty, state: "error" };
  }
  const metaName = String(args.template.metaTemplateName || "");
  const mappings = Array.isArray(args.mappings) ? args.mappings : [];
  return {
    state: "ready",
    senderLabel,
    recipientLabel,
    headerType: copy.headerType,
    headerText: interpolateWhatsAppPreviewText(
      copy.headerText,
      mappings,
      metaName
    ),
    body: interpolateWhatsAppPreviewText(copy.body, mappings, metaName),
    footer: interpolateWhatsAppPreviewText(copy.footer, mappings, metaName),
    buttons: copy.buttons.map((btn) => ({
      ...btn,
      text: interpolateWhatsAppPreviewText(btn.text || "", mappings, metaName),
    })),
  };
}
