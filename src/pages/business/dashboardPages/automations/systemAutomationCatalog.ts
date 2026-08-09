/**
 * System-linked automation catalog for BizUply.
 * Maps real CRM / appointments / WhatsApp / AI capabilities to
 * clear Trigger → Result flows (no abstract "paths").
 */

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
    recommendedTemplateHints: ["new_lead_received", "welcome"],
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
  {
    id: "ai_rank_leads",
    recipeKey: "ai_rank_leads",
    kind: "ai",
    title: "AI — דירוג ליד",
    description:
      "כשנכנס ליד חדש: AI מדרג לפי סיכוי סגירה ודחיפות ושולח התראה.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["דירוג AI", "התראה לפי דחיפות"],
    categories: ["ai", "leads"],
    requiresAi: true,
  },
  {
    id: "ai_summarize_calls",
    recipeKey: "ai_summarize_calls",
    kind: "ai",
    title: "AI — סיכום שיחה/פגישה",
    description: "אחרי סיום פגישה: AI מסכם נקודות מפתח ומתעד ב-CRM.",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["סיכום AI", "תיעוד ב-CRM"],
    categories: ["ai", "appointments"],
    requiresAi: true,
  },
  {
    id: "ai_auto_reply",
    recipeKey: "ai_auto_reply",
    kind: "ai",
    title: "AI — טיוטת תשובה ל-WhatsApp",
    description:
      "כשמגיעה הודעת WhatsApp: AI מנסח טיוטת תשובה מוכנה לשליחה.",
    triggerLabel: "הודעת WhatsApp נכנסת",
    resultLabels: ["טיוטת תשובה AI"],
    categories: ["ai", "whatsapp"],
    requiresAi: true,
  },
  {
    id: "ai_risk_lead",
    recipeKey: "ai_risk_lead",
    kind: "ai",
    title: "AI — ליד בסיכון נטישה",
    description:
      "בפולואפ: AI מזהה ליד שמתקרר ושולח התראה לטיפול מיידי.",
    triggerLabel: "פולואפ לליד",
    resultLabels: ["זיהוי סיכון", "התראה מיידית"],
    categories: ["ai", "leads"],
    requiresAi: true,
  },
  {
    id: "ai_campaign_change",
    recipeKey: "ai_campaign_change",
    kind: "ai",
    title: "AI — המלצת שינוי קמפיין",
    description: "בשינוי סטטוס ליד: AI ממליץ על התאמת קמפיין/מסר.",
    triggerLabel: "שינוי סטטוס ליד",
    resultLabels: ["המלצת קמפיין AI"],
    categories: ["ai", "leads", "sales"],
    requiresAi: true,
  },
  {
    id: "ai_tasks_from_chat",
    recipeKey: "ai_tasks_from_chat",
    kind: "ai",
    title: "AI — משימות מתוך שיחה",
    description: "אחרי פגישה/שיחה: AI מחלץ משימות מעקב ל-CRM.",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["משימות CRM מתוך השיחה"],
    categories: ["ai", "crm", "appointments"],
    requiresAi: true,
  },
];

export type MessageTemplateGap = {
  id: string;
  category: NonNullable<SystemAutomationSuggestion["recommendedWaCategory"]>;
  title: string;
  reason: string;
  relatedAutomationIds: string[];
  hintNames: string[];
};

const REQUIRED_TEMPLATE_GROUPS: Array<{
  id: string;
  category: MessageTemplateGap["category"];
  title: string;
  reason: string;
  hintNames: string[];
  relatedAutomationIds: string[];
}> = [
  {
    id: "wa_appointment_reminder",
    category: "appointment_reminder",
    title: "תבנית תזכורת לפגישה",
    reason:
      "נדרשת לתזכורות יום/יומיים/שעות לפני פגישה באוטומציות ובוואטסאפ.",
    hintNames: ["appointment_reminder", "reminder"],
    relatedAutomationIds: [
      "appointment_duo",
      "appointment_reminder_1_day",
      "appointment_reminder_2_days",
      "appointment_reminder_hours",
    ],
  },
  {
    id: "wa_welcome_lead",
    category: "welcome",
    title: "תבנית ברוכים הבאים / ליד חדש",
    reason: "נדרשת לאוטומציית ליד חדש ולקוח חדש.",
    hintNames: ["welcome", "new_lead_received", "new_client"],
    relatedAutomationIds: ["lead_multi_route", "new_client_welcome"],
  },
  {
    id: "wa_follow_up",
    category: "follow_up",
    title: "תבנית מעקב לליד",
    reason: "נדרשת לליד שלא נענה, פולואפ שני ולקוח לא פעיל.",
    hintNames: ["follow_up", "lead_followup"],
    relatedAutomationIds: [
      "lead_no_response",
      "lead_followup_2",
      "inactive_client",
    ],
  },
  {
    id: "wa_thanks_review",
    category: "custom",
    title: "תבנית תודה / בקשת ביקורת",
    reason: "מומלצת להודעת תודה ובקשת ביקורת אחרי פגישה.",
    hintNames: ["thanks", "thank_you", "review", "feedback"],
    relatedAutomationIds: ["appointment_thanks", "appointment_review"],
  },
];

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
export function findMissingMessageTemplates(
  templates: WaTemplateLike[]
): MessageTemplateGap[] {
  const usable = (templates || []).filter(isUsableTemplate);
  const gaps: MessageTemplateGap[] = [];

  for (const group of REQUIRED_TEMPLATE_GROUPS) {
    const byCategory = usable.some(
      (tpl) => String(tpl.category || "") === group.category
    );
    const byHint = usable.some((tpl) =>
      templateMatchesHints(tpl, group.hintNames)
    );
    if (byCategory || byHint) continue;
    gaps.push({
      id: group.id,
      category: group.category,
      title: group.title,
      reason: group.reason,
      relatedAutomationIds: group.relatedAutomationIds,
      hintNames: group.hintNames,
    });
  }

  return gaps;
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
