import type {
  AutomationFlowEdge,
  AutomationFlowNode,
} from "../../../../api/automationWorkflowApi";
import type { SystemAutomationSuggestion } from "./systemAutomationCatalog";
import { listSupportedAiTemplates } from "./aiAutomationCatalog";
import {
  applyEmailProviderToActions,
  type BusinessEmailSender,
  type EmailProviderId,
} from "./emailProviderAutomation";
import { APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS } from "./appointmentConfirmationEmail";
import { LEAD_WELCOME_EMAIL_DEFAULTS } from "./leadWelcomeEmail";

export type LocalTemplateAction = {
  actionKey: string;
  label: string;
  defaults?: Record<string, unknown>;
};

export type LocalAutomationTemplate = {
  key: string;
  /** Dedup against backend recipe keys / catalog ids */
  catalogId: string;
  recipeKey?: string;
  name: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
  categories: SystemAutomationSuggestion["categories"];
  /** Preferred trigger key; may be remapped from live catalog */
  triggerKey: string;
  /** Alternate trigger keys to accept from server catalog */
  triggerKeyAliases?: string[];
  hoursBefore?: number;
  actions: LocalTemplateAction[];
  isAi?: boolean;
  nodeCount: number;
  resultCount: number;
};

type GraphBuildOptions = {
  /** Override trigger key from live server catalog */
  resolvedTriggerKey?: string;
  emailProvider?: EmailProviderId;
  businessSender?: BusinessEmailSender | null;
};

function actionNode(
  id: string,
  action: LocalTemplateAction,
  position: { x: number; y: number }
): AutomationFlowNode {
  return {
    id,
    type: "action",
    position,
    data: {
      label: action.label,
      actionKey: action.actionKey,
      templateId: "",
      ...(action.defaults || {}),
    },
  };
}

/** Full system-linked templates: CRM, appointments, WhatsApp, email, calendar, AI. */
export const LOCAL_SYSTEM_TEMPLATES: LocalAutomationTemplate[] = [
  // —— Appointments / reminders ——
  {
    key: "local_appointment_reminder_1_day",
    catalogId: "appointment_reminder_1_day",
    name: "תזכורת פגישה — יום לפני",
    description: "טריגר: פגישה קרובה יום לפני. תוצאה: הודעת תזכורת WhatsApp.",
    triggerLabel: "פגישה קרובה (יום לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    hoursBefore: 24,
    triggerKey: "appointment_reminder",
    triggerKeyAliases: ["appointment_reminder", "appointment_reminder_1_day"],
    actions: [
      { actionKey: "whatsapp_template", label: "הודעת תזכורת WhatsApp" },
    ],
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_appointment_reminder_2_days",
    catalogId: "appointment_reminder_2_days",
    name: "תזכורת פגישה — יומיים לפני",
    description: "טריגר: פגישה קרובה יומיים לפני. תוצאה: הודעת תזכורת WhatsApp.",
    triggerLabel: "פגישה קרובה (יומיים לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    hoursBefore: 48,
    triggerKey: "appointment_reminder",
    triggerKeyAliases: ["appointment_reminder"],
    actions: [
      { actionKey: "whatsapp_template", label: "הודעת תזכורת WhatsApp" },
    ],
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_appointment_reminder_hours",
    catalogId: "appointment_reminder_hours",
    name: "תזכורת פגישה — שעתיים לפני",
    description:
      "טריגר: פגישה קרובה שעתיים לפני. תוצאה: הודעת תזכורת WhatsApp. ניתן לשנות שעות בבונה.",
    triggerLabel: "פגישה קרובה (שעתיים לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    hoursBefore: 2,
    triggerKey: "appointment_reminder",
    actions: [
      { actionKey: "whatsapp_template", label: "הודעת תזכורת WhatsApp" },
    ],
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_appointment_thanks",
    catalogId: "appointment_thanks",
    name: "תודה אחרי פגישה",
    description: "טריגר: פגישה חדשה/הסתיימה. תוצאה: הודעת תודה ב-WhatsApp.",
    triggerLabel: "פגישה",
    resultLabels: ["הודעת תודה WhatsApp"],
    categories: ["appointments", "whatsapp"],
    triggerKey: "appointment_created",
    triggerKeyAliases: [
      "appointment_created",
      "appointment_completed",
      "appointment_ended",
    ],
    actions: [{ actionKey: "whatsapp_template", label: "הודעת תודה WhatsApp" }],
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_appointment_review",
    catalogId: "appointment_review",
    name: "בקשת ביקורת אחרי פגישה",
    description: "טריגר: פגישה. תוצאה: בקשת ביקורת ב-WhatsApp.",
    triggerLabel: "פגישה",
    resultLabels: ["בקשת ביקורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    triggerKey: "appointment_created",
    triggerKeyAliases: [
      "appointment_created",
      "appointment_completed",
      "appointment_ended",
    ],
    actions: [
      { actionKey: "whatsapp_template", label: "בקשת ביקורת WhatsApp" },
    ],
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_appointment_gcal",
    catalogId: "appointment_gcal_sync",
    name: "פגישה → Google Calendar",
    description:
      "טריגר: פגישה חדשה. תוצאה: יצירת אירוע ביומן Google (חיבור Calendar).",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אירוע ב-Google Calendar"],
    categories: ["appointments"],
    triggerKey: "appointment_created",
    triggerKeyAliases: ["appointment_created"],
    actions: [
      {
        actionKey: "google_calendar_create_event",
        label: "יצירת אירוע ביומן",
        defaults: {
          title: "פגישה עם {{appointment.clientName}}",
          calendarId: "primary",
        },
      },
    ],
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_appointment_email",
    catalogId: "appointment_email_confirm",
    name: "פגישה → אימייל אישור",
    description: "טריגר: פגישה חדשה. תוצאה: שליחת אימייל אישור ללקוח.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אימייל אישור"],
    categories: ["appointments", "email"],
    triggerKey: "appointment_created",
    actions: [
      {
        actionKey: "connected_email",
        label: "אימייל אישור פגישה",
        defaults: {
          ...APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS,
        },
      },
    ],
    nodeCount: 2,
    resultCount: 1,
  },

  // —— CRM / Leads / Clients ——
  {
    key: "local_lead_multi_results",
    catalogId: "lead_multi_route",
    recipeKey: "lead_multi_route",
    name: "ליד חדש — כמה תוצאות יחד",
    description:
      "טריגר: ליד חדש ב-CRM. תוצאות יחד: WhatsApp, משימה לנציג והתראה לבעל העסק.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp מיידי", "משימה לנציג", "התראה לבעל העסק"],
    categories: ["leads", "crm", "whatsapp"],
    triggerKey: "crm_lead_created",
    triggerKeyAliases: [
      "crm_lead_created",
      "lead_created",
      "new_lead",
      "lead_new",
    ],
    actions: [
      { actionKey: "whatsapp_template", label: "WhatsApp מיידי" },
      { actionKey: "create_task", label: "משימה לנציג" },
      { actionKey: "notify", label: "התראה לבעל העסק" },
    ],
    nodeCount: 4,
    resultCount: 3,
  },
  {
    key: "local_lead_email_welcome",
    catalogId: "lead_email_welcome",
    name: "ליד חדש → אימייל + משימה",
    description: "טריגר: ליד חדש. תוצאות: אימייל ומשימת מעקב ב-CRM.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["אימייל", "משימת מעקב"],
    categories: ["leads", "email", "crm"],
    triggerKey: "crm_lead_created",
    triggerKeyAliases: [
      "crm_lead_created",
      "lead_created",
      "new_lead",
      "lead_new",
    ],
    actions: [
      {
        actionKey: "connected_email",
        label: "אימייל לליד",
        defaults: {
          ...LEAD_WELCOME_EMAIL_DEFAULTS,
        },
      },
      { actionKey: "create_task", label: "משימת מעקב" },
    ],
    nodeCount: 3,
    resultCount: 2,
  },
  {
    key: "local_lead_no_response",
    catalogId: "lead_no_response",
    recipeKey: "lead_no_response",
    name: "ליד חדש → פתיחה + פולואפים לפי תגובה",
    description:
      "פתיחה מיידית; אם אין תשובת WhatsApp — פולואפ אחרי 24ש׳ ואחרי 3 ימים.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["פתיחה WhatsApp", "פולואפ #1", "פולואפ #2"],
    categories: ["leads", "whatsapp", "sales"],
    triggerKey: "new_lead",
    triggerKeyAliases: ["new_lead", "crm_lead_created", "lead_created"],
    actions: [
      { actionKey: "whatsapp_template", label: "הודעת פתיחה WhatsApp" },
      { actionKey: "whatsapp_template", label: "פולואפ #1 WhatsApp" },
      { actionKey: "whatsapp_template", label: "פולואפ #2 WhatsApp" },
    ],
    nodeCount: 8,
    resultCount: 3,
  },
  {
    key: "local_lead_followup_2",
    catalogId: "lead_followup_2",
    name: "פולואפ שני לליד (מיזוג)",
    description:
      "מוזג למסלול המאוחד «ליד חדש → פתיחה + פולואפים לפי תגובה».",
    triggerLabel: "ליד ללא המרה",
    resultLabels: ["WhatsApp פולואפ שני"],
    categories: ["leads", "whatsapp"],
    triggerKey: "new_lead",
    triggerKeyAliases: ["new_lead", "lead_followup", "crm_lead_created"],
    actions: [
      { actionKey: "whatsapp_template", label: "WhatsApp פולואפ שני" },
    ],
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_new_client_welcome",
    catalogId: "new_client_welcome",
    recipeKey: "new_client_welcome",
    name: "לקוח חדש — ברוכים הבאים",
    description: "טריגר: לקוח חדש. תוצאות: הודעת פתיחה ומשימת שימור.",
    triggerLabel: "לקוח חדש",
    resultLabels: ["הודעת פתיחה", "משימת שימור"],
    categories: ["crm", "whatsapp"],
    triggerKey: "crm_client_created",
    triggerKeyAliases: [
      "crm_client_created",
      "client_created",
      "new_client",
      "customer_created",
    ],
    actions: [
      { actionKey: "whatsapp_template", label: "הודעת פתיחה" },
      { actionKey: "create_task", label: "משימת שימור" },
    ],
    nodeCount: 3,
    resultCount: 2,
  },
  {
    key: "local_inactive_client",
    catalogId: "inactive_client",
    name: "לקוח לא פעיל — נגיעה",
    description: "טריגר: לקוח לא פעיל. תוצאה: הודעת נגיעה ב-WhatsApp.",
    triggerLabel: "לקוח לא פעיל",
    resultLabels: ["הודעת נגיעה WhatsApp"],
    categories: ["crm", "whatsapp"],
    triggerKey: "crm_client_inactive",
    triggerKeyAliases: [
      "crm_client_inactive",
      "inactive_client",
      "client_inactive",
    ],
    actions: [
      { actionKey: "whatsapp_template", label: "הודעת נגיעה WhatsApp" },
    ],
    nodeCount: 2,
    resultCount: 1,
  },


];

LOCAL_SYSTEM_TEMPLATES.push(...listSupportedAiTemplates().map((template) => ({ key: `local_${template.recipeKey}`, catalogId: template.templateKey, recipeKey: template.recipeKey, name: template.titleHe, description: template.description, triggerLabel: template.customerExplanation.startsWhen, resultLabels: [template.customerExplanation.aiDoes, template.customerExplanation.afterwards], categories: (template.recommendedTrigger === "scheduled" ? ["ai"] : ["ai", "leads"]) as LocalAutomationTemplate["categories"], triggerKey: template.recommendedTrigger, triggerKeyAliases: template.recommendedTrigger === "new_lead" ? ["new_lead", "crm_lead_created", "lead_created", "lead_new"] : ["scheduled"], actions: [{ actionKey: template.requiredAiActions[0], label: template.customerExplanation.aiDoes }], isAi: true, nodeCount: 2, resultCount: 1 })));

/** @deprecated use LOCAL_SYSTEM_TEMPLATES */
export const LOCAL_REMINDER_TEMPLATES = LOCAL_SYSTEM_TEMPLATES.filter((t) =>
  t.key.includes("appointment_reminder")
);

export function buildLocalAutomationGraph(
  template: LocalAutomationTemplate,
  options?: GraphBuildOptions
): {
  nodes: AutomationFlowNode[];
  edges: AutomationFlowEdge[];
} {
  const triggerId = "trigger_1";
  const actions = applyEmailProviderToActions(
    template.actions,
    options?.emailProvider,
    options?.businessSender
  );
  const routeCount = Math.max(1, Math.min(6, actions.length));
  const triggerKey = options?.resolvedTriggerKey || template.triggerKey;

  const nodes: AutomationFlowNode[] = [
    {
      id: triggerId,
      type: "trigger",
      position: { x: 80, y: 160 },
      data: {
        label: template.triggerLabel,
        triggerKey,
        routeCount,
        ...(template.hoursBefore != null
          ? { hoursBefore: template.hoursBefore }
          : {}),
      },
    },
  ];

  const edges: AutomationFlowEdge[] = [];

  actions.forEach((action, index) => {
    const id = `action_${index + 1}`;
    const y = 80 + index * 140;
    nodes.push(actionNode(id, action, { x: 420, y }));
    edges.push({
      id: `e_${triggerId}_${id}`,
      source: triggerId,
      target: id,
      sourceHandle: `route_${index + 1}`,
      targetHandle: null,
      label: `תוצאה ${index + 1}`,
    });
  });

  return { nodes, edges };
}

/** Back-compat alias */
export function buildReminderAutomationGraph(
  template: LocalAutomationTemplate,
  options?: GraphBuildOptions
) {
  return buildLocalAutomationGraph(template, options);
}

export type CatalogTriggerLike = {
  key: string;
  label?: string;
  category?: string;
  isPublishable?: boolean;
};

/**
 * Pick the best live trigger key for a local template from the server catalog.
 */
export function resolveTriggerKeyFromCatalog(
  template: LocalAutomationTemplate,
  catalog: CatalogTriggerLike[]
): string | null {
  if (!catalog?.length) return template.triggerKey;
  const aliases = [
    template.triggerKey,
    ...(template.triggerKeyAliases || []),
  ].map((k) => k.toLowerCase());

  const publishable = catalog.filter((t) => t.isPublishable !== false);
  const pool = publishable.length ? publishable : catalog;

  const exact = pool.find((t) => aliases.includes(String(t.key).toLowerCase()));
  if (exact) return exact.key;

  // Fuzzy: label/key contains distinctive tokens from preferred key.
  const tokens = aliases
    .flatMap((a) => a.split("_"))
    .filter((t) => t.length > 3);
  const fuzzy = pool.find((t) => {
    const hay = `${t.key} ${t.label || ""}`.toLowerCase();
    return tokens.some((token) => hay.includes(token));
  });
  return fuzzy?.key || template.triggerKey;
}

export function getLocalSystemTemplate(key: string) {
  return LOCAL_SYSTEM_TEMPLATES.find((row) => row.key === key);
}

export function listLocalAiTemplates() {
  return LOCAL_SYSTEM_TEMPLATES.filter((t) => t.isAi);
}

/** Recipe keys whose services are live in BizUply — never hard-block as Coming Soon. */
export const ACTIVE_SYSTEM_RECIPE_KEYS = new Set(
  LOCAL_SYSTEM_TEMPLATES.map((t) => t.recipeKey).filter(Boolean) as string[]
);

export const ACTIVE_SYSTEM_RECIPE_KEYS_EXTRA = new Set(["lead_multi_route", "lead_no_response", "appointment_duo", "new_client_welcome", ...listSupportedAiTemplates().map((template) => template.recipeKey),
]);

export function isActiveSystemRecipeKey(key: string) {
  return (
    ACTIVE_SYSTEM_RECIPE_KEYS.has(key) || ACTIVE_SYSTEM_RECIPE_KEYS_EXTRA.has(key)
  );
}
