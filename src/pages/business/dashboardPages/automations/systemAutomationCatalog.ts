/**
 * System-linked automation catalog for BizUply.
 * Maps real CRM / appointments / WhatsApp / AI capabilities to
 * clear Trigger → Result flows (no abstract "paths").
 */

import { listSupportedAiTemplates } from "./aiAutomationCatalog";

export type SystemAutomationKind =
  | "standard"
  | "ai"
  | "whatsapp_simple"
  | "reminder";

export type SystemAutomationSuggestion = {
  id: string;
  /** Backend recipe key when one exists */
  recipeKey?: string;
  /** WhatsApp simple-automation trigger when relevant */
  whatsappTrigger?: string;
  kind: SystemAutomationKind;
  title: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
  categories: Array<
    "leads" | "crm" | "appointments" | "email" | "whatsapp" | "sales" | "ai"
  >;
  /** Recommended WhatsApp template category (for gap reporting) */
  recommendedWaCategory?:
    | "appointment_reminder"
    | "promotion"
    | "follow_up"
    | "welcome"
    | "custom";
  /** Recommended Meta/local template name hints */
  recommendedTemplateHints?: string[];
  timingHint?: string;
  comingSoon?: boolean;
  requiresAi?: boolean;
};

export const SYSTEM_AUTOMATION_CATALOG: SystemAutomationSuggestion[] = [
  {
    id: "lead_multi_route",
    recipeKey: "lead_multi_route",
    kind: "standard",
    title: "ליד חדש — כמה תוצאות יחד",
    description:
      "כשנכנס ליד חדש ב-CRM: שליחת WhatsApp, יצירת משימה לנציג והתראה לבעל העסק — במקביל.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp מיידי", "משימה לנציג", "התראה לבעל העסק"],
    categories: ["leads", "crm", "whatsapp"],
    recommendedWaCategory: "welcome",
    recommendedTemplateHints: ["new_lead_welcome"],
  },
  {
    id: "lead_no_response",
    recipeKey: "lead_no_response",
    whatsappTrigger: "lead_no_response",
    kind: "standard",
    title: "ליד שלא נענה — מעקב חכם",
    description:
      "אם לא נוצר קשר: שליחת WhatsApp מעקב; אחרת עדכון סטטוס.",
    triggerLabel: "ליד שלא נענה",
    resultLabels: ["WhatsApp מעקב", "עדכון סטטוס"],
    categories: ["leads", "whatsapp"],
    recommendedWaCategory: "follow_up",
    recommendedTemplateHints: ["follow_up", "lead_followup"],
    timingHint: "כ־24 שעות אחרי כניסת הליד",
  },
  {
    id: "new_client_welcome",
    recipeKey: "new_client_welcome",
    whatsappTrigger: "new_client_welcome",
    kind: "standard",
    title: "לקוח חדש — ברוכים הבאים",
    description: "טריגר לקוח חדש → הודעת פתיחה + משימת שימור.",
    triggerLabel: "לקוח חדש",
    resultLabels: ["הודעת פתיחה", "משימת שימור"],
    categories: ["crm", "whatsapp"],
    recommendedWaCategory: "welcome",
    recommendedTemplateHints: ["welcome", "new_client"],
  },
  {
    id: "appointment_duo",
    recipeKey: "appointment_duo",
    kind: "standard",
    title: "פגישה — תזכורת + תודה",
    description:
      "כשנוצרת פגישה: תזכורת לפני המועד והודעת תודה אחרי סיום.",
    triggerLabel: "פגישה חדשה / תזכורת",
    resultLabels: ["תזכורת לפני פגישה", "הודעת תודה"],
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "appointment_reminder",
    recommendedTemplateHints: ["appointment_reminder", "thanks"],
  },
  {
    id: "appointment_gcal_sync",
    kind: "standard",
    title: "פגישה → Google Calendar",
    description: "טריגר פגישה חדשה. תוצאה: יצירת אירוע ביומן Google.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אירוע ב-Google Calendar"],
    categories: ["appointments"],
  },
  {
    id: "appointment_email_confirm",
    kind: "standard",
    title: "פגישה → אימייל אישור",
    description: "טריגר פגישה חדשה. תוצאה: אימייל אישור ללקוח.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אימייל אישור"],
    categories: ["appointments", "email"],
  },
  {
    id: "lead_email_welcome",
    kind: "standard",
    title: "ליד חדש → אימייל + משימה",
    description: "טריגר ליד חדש. תוצאות: אימייל ומשימת מעקב.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["אימייל", "משימת מעקב"],
    categories: ["leads", "email", "crm"],
  },
  {
    id: "appointment_reminder_1_day",
    whatsappTrigger: "appointment_reminder_1_day",
    kind: "reminder",
    title: "תזכורת פגישה — יום לפני",
    description: "שולח תבנית WhatsApp יום לפני הפגישה.",
    triggerLabel: "פגישה קרובה (יום לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "appointment_reminder",
    recommendedTemplateHints: ["appointment_reminder"],
    timingHint: "יום אחד לפני",
  },
  {
    id: "appointment_reminder_2_days",
    whatsappTrigger: "appointment_reminder_hours",
    kind: "reminder",
    title: "תזכורת פגישה — יומיים לפני",
    description: "שולח תבנית WhatsApp יומיים (48 שעות) לפני הפגישה.",
    triggerLabel: "פגישה קרובה (יומיים לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "appointment_reminder",
    recommendedTemplateHints: ["appointment_reminder"],
    timingHint: "יומיים לפני (48 שעות)",
  },
  {
    id: "appointment_reminder_hours",
    whatsappTrigger: "appointment_reminder_hours",
    kind: "reminder",
    title: "תזכורת פגישה — שעות לפני",
    description: "תזכורת מותאמת (למשל שעתיים לפני) לתבנית WhatsApp.",
    triggerLabel: "פגישה קרובה (שעות לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "appointment_reminder",
    recommendedTemplateHints: ["appointment_reminder"],
    timingHint: "מספר שעות לבחירה",
  },
  {
    id: "appointment_thanks",
    whatsappTrigger: "appointment_thanks",
    kind: "whatsapp_simple",
    title: "תודה אחרי פגישה",
    description: "אחרי שפגישה מסומנת כהושלמה — הודעת תודה.",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["הודעת תודה"],
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "custom",
    recommendedTemplateHints: ["thanks", "thank_you"],
  },
  {
    id: "appointment_review",
    whatsappTrigger: "appointment_review_request",
    kind: "whatsapp_simple",
    title: "בקשת ביקורת אחרי פגישה",
    description: "שולח בקשת ביקורת מספר שעות אחרי הפגישה.",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["בקשת ביקורת"],
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "custom",
    recommendedTemplateHints: ["review", "feedback"],
  },
  {
    id: "lead_followup_2",
    whatsappTrigger: "lead_followup_2",
    kind: "whatsapp_simple",
    title: "פולואפ שני לליד",
    description: "מעקב נוסף ללידים שלא הומרו אחרי הפולואפ הראשון.",
    triggerLabel: "ליד ללא המרה",
    resultLabels: ["WhatsApp פולואפ שני"],
    categories: ["leads", "whatsapp"],
    recommendedWaCategory: "follow_up",
    recommendedTemplateHints: ["follow_up", "lead_followup"],
    timingHint: "כ־3 ימים אחרי",
  },
  {
    id: "inactive_client",
    whatsappTrigger: "inactive_client",
    kind: "whatsapp_simple",
    title: "לקוח לא פעיל — נגיעה",
    description: "תזכורת ללקוחות ללא אינטראקציה לאחרונה.",
    triggerLabel: "לקוח לא פעיל",
    resultLabels: ["הודעת נגיעה"],
    categories: ["crm", "whatsapp"],
    recommendedWaCategory: "follow_up",
    recommendedTemplateHints: ["inactive", "follow_up"],
  },
];

SYSTEM_AUTOMATION_CATALOG.push(...listSupportedAiTemplates().map((template) => ({ id: template.templateKey, recipeKey: template.recipeKey, kind: "ai" as const, title: template.titleHe, description: template.description, triggerLabel: template.customerExplanation.startsWhen, resultLabels: [template.customerExplanation.aiDoes, template.customerExplanation.afterwards], categories: (template.recommendedTrigger === "scheduled" ? ["ai"] : ["ai", "leads"]) as SystemAutomationSuggestion["categories"], requiresAi: false })));

export type MessageTemplateGap = {
  id: string;
  category: NonNullable<SystemAutomationSuggestion["recommendedWaCategory"]>;
  title: string;
  reason: string;
  relatedAutomationIds: string[];
  hintNames: string[];
};

/** Full checklist of WhatsApp message templates businesses should prepare. */
export const REQUIRED_WHATSAPP_MESSAGE_TEMPLATES: Array<{
  id: string;
  category: MessageTemplateGap["category"];
  title: string;
  reason: string;
  hintNames: string[];
  relatedAutomationIds: string[];
  suggestedMetaName: string;
}> = [
  {
    id: "wa_welcome_lead",
    category: "welcome",
    title: "ברוכים הבאים לליד חדש",
    reason: "נשלחת כשנכנס ליד חדש ל-CRM.",
    hintNames: ["new_lead_welcome"],
    relatedAutomationIds: ["lead_multi_route", "wa_new_lead_welcome"],
    suggestedMetaName: "new_lead_welcome",
  },
  {
    id: "wa_welcome_client",
    category: "welcome",
    title: "ברוכים הבאים ללקוח חדש",
    reason: "נשלחת כשנוצר לקוח חדש ב-CRM.",
    hintNames: ["new_client_welcome"],
    relatedAutomationIds: ["new_client_welcome", "wa_new_client_welcome"],
    suggestedMetaName: "new_client_welcome",
  },
  {
    id: "wa_appointment_reminder",
    category: "appointment_reminder",
    title: "תזכורת פגישה",
    reason: "נשלחת לפני פגישה (שעה / שעתיים / יום / יומיים / 3 ימים).",
    hintNames: ["appointment_reminder"],
    relatedAutomationIds: [
      "appointment_duo",
      "appointment_reminder_1_day",
      "appointment_reminder_2_days",
      "appointment_reminder_hours",
    ],
    suggestedMetaName: "appointment_reminder",
  },
  {
    id: "wa_appointment_thanks",
    category: "custom",
    title: "תודה אחרי פגישה",
    reason: "נשלחת אחרי שפגישה מסומנת כהושלמה.",
    hintNames: ["appointment_thanks"],
    relatedAutomationIds: ["appointment_thanks", "wa_appointment_thanks"],
    suggestedMetaName: "appointment_thanks",
  },
  {
    id: "wa_appointment_review",
    category: "custom",
    title: "בקשת ביקורת אחרי פגישה",
    reason: "נשלחת לבקשת ביקורת/פידבק אחרי פגישה.",
    hintNames: ["appointment_review"],
    relatedAutomationIds: ["appointment_review", "wa_appointment_review"],
    suggestedMetaName: "appointment_review",
  },
  {
    id: "wa_follow_up",
    category: "follow_up",
    title: "מעקב לליד שלא נענה",
    reason: "נשלחת כפולואפ ראשון לליד בלי מענה.",
    hintNames: ["lead_follow_up"],
    relatedAutomationIds: ["lead_no_response", "wa_lead_no_response"],
    suggestedMetaName: "lead_follow_up",
  },
  {
    id: "wa_follow_up_2",
    category: "follow_up",
    title: "פולואפ שני לליד",
    reason: "נשלחת כמעקב נוסף ללידים שלא הומרו.",
    hintNames: ["lead_follow_up_2"],
    relatedAutomationIds: ["lead_followup_2", "wa_lead_followup_2"],
    suggestedMetaName: "lead_follow_up_2",
  },
  {
    id: "wa_inactive_client",
    category: "follow_up",
    title: "נגיעה ללקוח לא פעיל",
    reason: "נשלחת ללקוחות ללא פעילות לאחרונה.",
    hintNames: ["inactive_client"],
    relatedAutomationIds: ["inactive_client", "wa_inactive_client"],
    suggestedMetaName: "inactive_client",
  },
];

/** @deprecated use REQUIRED_WHATSAPP_MESSAGE_TEMPLATES */
const REQUIRED_TEMPLATE_GROUPS = REQUIRED_WHATSAPP_MESSAGE_TEMPLATES;

export type WaTemplateLike = {
  name?: string;
  key?: string;
  category?: string;
  metaTemplateName?: string;
  status?: string;
  metaStatus?: string;
};

function templateMatchesHints(tpl: WaTemplateLike, hints: string[]) {
  const hay = [
    tpl.name,
    tpl.key,
    tpl.metaTemplateName,
    tpl.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hints.some((hint) => hay.includes(hint.toLowerCase()));
}

function isUsableTemplate(tpl: WaTemplateLike) {
  const status = String(tpl.status || "").toLowerCase();
  const meta = String(tpl.metaStatus || "").toLowerCase();
  if (status === "archived") return false;
  if (meta && meta !== "approved" && meta !== "active" && status !== "active") {
    // Keep drafts that are local-active; ignore clearly rejected Meta templates.
    if (meta === "rejected" || meta === "paused" || meta === "disabled") {
      return false;
    }
  }
  return true;
}

/**
 * Compare business WhatsApp templates against automations the product supports.
 */
export type RequiredWhatsAppMessageTemplateStatus = {
  id: string;
  category: MessageTemplateGap["category"];
  title: string;
  reason: string;
  suggestedMetaName: string;
  hintNames: string[];
  relatedAutomationIds: string[];
  prepared: boolean;
  matchedTemplateName?: string;
};

/** Full required WhatsApp message-template checklist with prepared status. */
export function listRequiredWhatsAppMessageTemplates(
  templates: WaTemplateLike[] = []
): RequiredWhatsAppMessageTemplateStatus[] {
  const usable = (templates || []).filter(isUsableTemplate);
  return REQUIRED_WHATSAPP_MESSAGE_TEMPLATES.map((group) => {
    // Prefer name/key hints so each checklist row is independently prepared.
    const match =
      usable.find(
        (tpl) =>
          String(tpl.metaTemplateName || "").toLowerCase() ===
          group.suggestedMetaName.toLowerCase()
      ) || usable.find((tpl) => templateMatchesHints(tpl, group.hintNames)) || null;
    return {
      id: group.id,
      category: group.category,
      title: group.title,
      reason: group.reason,
      suggestedMetaName: group.suggestedMetaName,
      hintNames: group.hintNames,
      relatedAutomationIds: group.relatedAutomationIds,
      prepared: Boolean(match),
      matchedTemplateName: match
        ? String(match.name || match.key || match.metaTemplateName || "")
        : undefined,
    };
  });
}

export function findMissingMessageTemplates(
  templates: WaTemplateLike[]
): MessageTemplateGap[] {
  return listRequiredWhatsAppMessageTemplates(templates)
    .filter((row) => !row.prepared)
    .map((row) => ({
      id: row.id,
      category: row.category,
      title: row.title,
      reason: row.reason,
      relatedAutomationIds: row.relatedAutomationIds,
      hintNames: row.hintNames,
    }));
}

export function getCatalogByRecipeKey(recipeKey: string) {
  return SYSTEM_AUTOMATION_CATALOG.find((row) => row.recipeKey === recipeKey);
}

export function listAiAutomations() {
  return SYSTEM_AUTOMATION_CATALOG.filter((row) => row.kind === "ai");
}

export function listReminderAutomations() {
  return SYSTEM_AUTOMATION_CATALOG.filter((row) => row.kind === "reminder");
}
