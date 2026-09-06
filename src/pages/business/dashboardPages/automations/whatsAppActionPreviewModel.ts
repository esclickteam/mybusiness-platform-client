import type {
  ApprovedWhatsAppTemplate,
  WhatsAppHeaderType,
  WhatsAppTemplateButton,
  WhatsAppVariableMapping,
} from "../../../../api/whatsappApi";
import i18n from "../../../../i18n/i18n";

export function getWaPreviewEmpty() {
  return i18n.t(
    "leftover.waPreview.empty",
    "The message preview appears after you choose a template"
  );
}

export function getWaPreviewError() {
  return i18n.t(
    "leftover.waPreview.error",
    "The preview cannot be shown right now"
  );
}

/** @deprecated use getWaPreviewEmpty() — kept for tests that read the live string */
export const WA_PREVIEW_EMPTY_HE = getWaPreviewEmpty;
/** @deprecated use getWaPreviewError() — kept for tests that read the live string */
export const WA_PREVIEW_ERROR_HE = getWaPreviewError;

export function getWaPreviewSampleData() {
  return {
    leadName: i18n.t("leftover.waPreview.sampleLead", "Alex Rivera"),
    businessName: i18n.t("leftover.waPreview.sampleBusiness", "Sample business"),
    appointmentDate: "16/09/2026",
    appointmentTime: "18:00",
    phone: "050-1234567",
  };
}

export const WA_PREVIEW_SAMPLE_DATA = {
  get leadName() {
    return getWaPreviewSampleData().leadName;
  },
  get businessName() {
    return getWaPreviewSampleData().businessName;
  },
  appointmentDate: "16/09/2026",
  appointmentTime: "18:00",
  phone: "050-1234567",
};

const RECIPIENT_LABEL_KEYS: Record<string, { key: string; fallback: string }> = {
  lead_phone: { key: "leftover.waPreview.leadPhone", fallback: "Lead phone" },
  appointment_customer_phone: { key: "leftover.waPreview.customerPhone", fallback: "Customer phone" },
  business_owner: { key: "leftover.waPreview.businessOwner", fallback: "Business owner" },
  lead_owner: { key: "leftover.waPreview.leadOwner", fallback: "Lead owner" },
  fixed_phone: { key: "leftover.waPreview.fixedPhone", fallback: "Fixed number" },
};

export function getWaPreviewRecipientLabels(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(RECIPIENT_LABEL_KEYS).map(([id, { key, fallback }]) => [
      id,
      i18n.t(key, fallback),
    ])
  );
}

export const WA_PREVIEW_RECIPIENT_LABELS = new Proxy({} as Record<string, string>, {
  get(_target, prop: string) {
    return getWaPreviewRecipientLabels()[prop];
  },
});

const VARIABLE_LABEL_KEYS: Record<string, Record<string, { key: string; fallback: string }>> = {
  appointment_confirmation: {
    "1": { key: "leftover.waPreview.customerName", fallback: "Customer name" },
    "2": { key: "leftover.waPreview.businessName", fallback: "Business name" },
    "3": { key: "leftover.waPreview.appointmentDate", fallback: "Appointment date" },
    "4": { key: "leftover.waPreview.appointmentTime", fallback: "Appointment time" },
  },
  appointment_reminder: {
    "1": { key: "leftover.waPreview.customerName", fallback: "Customer name" },
    "2": { key: "leftover.waPreview.timeUntil", fallback: "Time until the appointment" },
    "3": { key: "leftover.waPreview.appointmentTime", fallback: "Appointment time" },
    "4": { key: "leftover.waPreview.service", fallback: "Service" },
  },
  appointment_thanks: {
    "1": { key: "leftover.waPreview.customerName", fallback: "Customer name" },
    "2": { key: "leftover.waPreview.service", fallback: "Service" },
  },
  appointment_review: {
    "1": { key: "leftover.waPreview.customerName", fallback: "Customer name" },
    "2": { key: "leftover.waPreview.service", fallback: "Service" },
  },
  new_lead_welcome: {
    "1": { key: "leftover.waPreview.leadName", fallback: "Lead name" },
  },
  lead_follow_up: {
    "1": { key: "leftover.waPreview.leadName", fallback: "Lead name" },
  },
  lead_follow_up_2: {
    "1": { key: "leftover.waPreview.leadName", fallback: "Lead name" },
  },
  new_client_welcome: {
    "1": { key: "leftover.waPreview.customerName", fallback: "Customer name" },
  },
  inactive_client: {
    "1": { key: "leftover.waPreview.customerName", fallback: "Customer name" },
  },
  new_lead_received_utility: {
    "1": { key: "leftover.waPreview.leadName", fallback: "Lead name" },
    "2": { key: "leftover.waPreview.leadPhone", fallback: "Lead phone" },
    "3": { key: "leftover.waPreview.leadSource", fallback: "Lead source" },
  },
  new_lead_received: {
    "1": { key: "leftover.waPreview.leadName", fallback: "Lead name" },
    "2": { key: "leftover.waPreview.leadPhone", fallback: "Lead phone" },
    "3": { key: "leftover.waPreview.leadSource", fallback: "Lead source" },
  },
};

function sampleBySourceField(): Record<string, string> {
  const sample = getWaPreviewSampleData();
  return {
    "lead:name": sample.leadName,
    "lead:fullName": sample.leadName,
    "contact:name": sample.leadName,
    "contact:fullName": sample.leadName,
    "appointment:clientName": sample.leadName,
    "appointment:clientSnapshot.name": sample.leadName,
    "business:name": sample.businessName,
    "appointment:date": sample.appointmentDate,
    "appointment:time": sample.appointmentTime,
    "lead:phone": sample.phone,
    "contact:phone": sample.phone,
    "appointment:clientPhone": sample.phone,
    "appointment:clientSnapshot.phone": sample.phone,
  };
}

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
  const mapped = VARIABLE_LABEL_KEYS[tpl]?.[key];
  const label = mapped
    ? i18n.t(mapped.key, mapped.fallback)
    : i18n.t("leftover.waPreview.variable", "Variable {{key}}", { key: key || "?" });
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
  const sample = sampleBySourceField()[`${source}:${field}`];
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
  const senderLabel = String(
    args.senderLabel ||
      i18n.t("leftover.waPreview.managedNumber", "Managed BizUply number")
  ).trim();
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
