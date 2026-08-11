import type {
  AutomationFlowEdge,
  AutomationFlowNode,
  AutomationRecipeSummary,
  AutomationTriggerCatalogItem,
} from "../../../../api/automationWorkflowApi";
import type {
  ApprovedWhatsAppTemplate,
  WhatsAppAutomationTrigger,
  WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import type { TemplateCategoryId } from "./templateCategoryMapping";
import { buildAiTemplateGraph, listSupportedAiTemplates } from "./aiAutomationCatalog";
import {
  BLUEPRINT_PREFERRED_META,
  isBusinessAlertMetaTemplateName,
  isLegacyManagedMetaTemplateName,
  isTestTemplateName,
} from "./whatsappAutomationMetaTemplates";

export type WorkingEngine = "whatsapp_simple" | "workflow_recipe" | "workflow_graph";

export type WorkingTemplate = {
  key: string;
  name: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
  categories: TemplateCategoryId[];
  engine: WorkingEngine;
  /** Business value rank — lower is better / shown first */
  rank: number;
  /** Launch-safety: not activatable; hide from default "ready" list */
  comingSoon?: boolean;
  // WhatsApp simple engine
  whatsappTrigger?: WhatsAppAutomationTrigger;
  hoursBefore?: number;
  delayMinutes?: number;
  delayHours?: number;
  delayDays?: number;
  waCategory?: WhatsAppTemplate["category"];
  waHints?: string[];
  waPreferredMetaName?: string;
  allowBusinessAlert?: boolean;
  // Workflow recipe engine
  recipeKey?: string;
  // Workflow graph engine
  buildGraph?: (ctx: {
    triggerKey: string;
    waTemplateId?: string;
  }) => { nodes: AutomationFlowNode[]; edges: AutomationFlowEdge[] };
  requiredTriggerKeys?: string[];
  requiresWaTemplate?: boolean;
  requiresCalendar?: boolean;
  requiresAiEntitlement?: boolean;
  keywords?: string[];
};

const LEAD_TRIGGER_KEYS = [
  "crm_lead_created",
  "lead_created",
  "new_lead",
  "lead_new",
];
const APPOINTMENT_TRIGGER_KEYS = [
  "appointment_created",
  "crm_appointment_created",
  "booking_created",
];
/** Real "after meeting" triggers only — never fall back to appointment_created. */
const APPOINTMENT_DONE_TRIGGER_KEYS = [
  "appointment_completed",
  "appointment_ended",
  "appointment_done",
];
const CLIENT_TRIGGER_KEYS = [
  "crm_client_created",
  "client_created",
  "new_client",
  "customer_created",
];
const LEAD_NO_RESPONSE_KEYS = [
  "lead_no_response",
  "crm_lead_no_response",
  "lead_followup",
];
const LEAD_STATUS_KEYS = [
  "lead_status_changed",
  "crm_lead_status_changed",
  "lead_updated",
];
const WHATSAPP_INBOUND_KEYS = [
  "whatsapp_message_received",
  "whatsapp_inbound",
  "wa_message_received",
];

type GraphAction = {
  actionKey: string;
  label: string;
  defaults?: Record<string, unknown>;
};

function resultGraph(opts: {
  triggerKey: string;
  triggerLabel: string;
  hoursBefore?: number;
  actions: GraphAction[];
}) {
  const nodes: AutomationFlowNode[] = [
    {
      id: "trigger_1",
      type: "trigger",
      position: { x: 80, y: Math.max(120, 40 + opts.actions.length * 70) },
      data: {
        label: opts.triggerLabel,
        triggerKey: opts.triggerKey,
        routeCount: opts.actions.length,
        ...(opts.hoursBefore != null ? { hoursBefore: opts.hoursBefore } : {}),
      },
    },
  ];
  const edges: AutomationFlowEdge[] = [];
  opts.actions.forEach((action, index) => {
    const id = `action_${index + 1}`;
    nodes.push({
      id,
      type: "action",
      position: { x: 420, y: 40 + index * 140 },
      data: {
        label: action.label,
        actionKey: action.actionKey,
        ...(action.defaults || {}),
      },
    });
    edges.push({
      id: `e_trigger_${id}`,
      source: "trigger_1",
      target: id,
      sourceHandle: `route_${index + 1}`,
      label: "תוצאה",
    });
  });
  return { nodes, edges };
}

function waEdgeGraph(opts: {
  triggerKey: string;
  triggerLabel: string;
  actionLabel: string;
  waTemplateId?: string;
  hoursBefore?: number;
  extraActions?: GraphAction[];
}) {
  return resultGraph({
    triggerKey: opts.triggerKey,
    triggerLabel: opts.triggerLabel,
    hoursBefore: opts.hoursBefore,
    actions: [
      {
        actionKey: "whatsapp_template",
        label: opts.actionLabel,
        defaults: { templateId: opts.waTemplateId || "" },
      },
      ...(opts.extraActions || []),
    ],
  });
}

/** Map legacy WhatsAppAutomation trigger → publishable workflow trigger keys. */
export function triggerKeysForWhatsAppSimple(
  template: WorkingTemplate
): string[] {
  switch (template.whatsappTrigger) {
    case "new_lead_welcome":
      return LEAD_TRIGGER_KEYS;
    case "lead_no_response":
    case "lead_followup_2":
      return LEAD_NO_RESPONSE_KEYS;
    case "appointment_reminder_1_day":
    case "appointment_reminder_hours":
      return APPOINTMENT_TRIGGER_KEYS;
    case "appointment_thanks":
    case "appointment_review_request":
      return APPOINTMENT_DONE_TRIGGER_KEYS;
    case "new_client_welcome":
    case "inactive_client":
      return CLIENT_TRIGGER_KEYS;
    default:
      return template.requiredTriggerKeys || LEAD_TRIGGER_KEYS;
  }
}

/**
 * Build a workflow graph for a whatsapp_simple blueprint.
 * Keeps blueprint key (template.key / whatsappTrigger) separate from Meta template name.
 */
export function buildWhatsAppSimpleGraph(
  template: WorkingTemplate,
  ctx: { triggerKey: string; waTemplateId?: string }
): { nodes: AutomationFlowNode[]; edges: AutomationFlowEdge[] } {
  const delayMinutes = Number(template.delayMinutes || 0);
  const delayHours = Number(template.delayHours || 0);
  const delayDays = Number(template.delayDays || 0);
  const useDelay =
    delayMinutes > 0 ||
    delayHours > 0 ||
    (delayDays > 0 && template.whatsappTrigger !== "inactive_client");

  const nodes: AutomationFlowNode[] = [
    {
      id: "trigger_1",
      type: "trigger",
      position: { x: 80, y: 160 },
      data: {
        label: template.triggerLabel,
        triggerKey: ctx.triggerKey,
        routeCount: 1,
        ...(template.hoursBefore != null
          ? { hoursBefore: template.hoursBefore }
          : {}),
      },
    },
  ];
  const edges: AutomationFlowEdge[] = [];
  let prevId = "trigger_1";
  let prevHandle: string | undefined = "route_1";
  let y = 40;

  if (useDelay) {
    const delayId = "delay_1";
    const amount =
      delayMinutes > 0 ? delayMinutes : delayHours > 0 ? delayHours : delayDays;
    const unit =
      delayMinutes > 0 ? "minutes" : delayHours > 0 ? "hours" : "days";
    nodes.push({
      id: delayId,
      type: "delay",
      position: { x: 320, y },
      data: {
        label: "המתנה",
        amount,
        unit,
      },
    });
    edges.push({
      id: `e_${prevId}_${delayId}`,
      source: prevId,
      target: delayId,
      sourceHandle: prevHandle,
      label: "המשך",
    });
    prevId = delayId;
    prevHandle = undefined;
    y += 140;
  }

  nodes.push({
    id: "action_wa",
    type: "action",
    position: { x: 560, y },
    data: {
      label: "WhatsApp",
      actionKey: "whatsapp_template",
      templateId: ctx.waTemplateId || "",
      senderMode: "bizuply_managed",
      blueprintKey: template.key,
      blueprintTrigger: template.whatsappTrigger || "",
      recipientType:
        isBusinessAlertMetaTemplateName(template.waPreferredMetaName || "")
          ? "business_owner"
          : "lead_phone",
    },
  });
  edges.push({
    id: `e_${prevId}_action_wa`,
    source: prevId,
    target: "action_wa",
    ...(prevHandle ? { sourceHandle: prevHandle } : {}),
    label: "תוצאה",
  });

  return { nodes, edges };
}

/**
 * Best working templates — common business cases that can actually activate.
 * WhatsApp simple = proven production path. Workflow/AI = gated by live readiness.
 */
export const WORKING_TEMPLATES: WorkingTemplate[] = [
  // ── WhatsApp simple (activate immediately when WA template exists) ──
  {
    key: "wa_new_lead_welcome",
    rank: 1,
    name: "ליד חדש → WhatsApp פתיחה",
    description: "ליד נכנס ל-CRM → הודעת פתיחה ב-WhatsApp תוך דקות (מופעל מיד).",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["הודעת WhatsApp"],
    categories: ["leads", "whatsapp", "crm"],
    engine: "whatsapp_simple",
    whatsappTrigger: "new_lead_welcome",
    delayMinutes: 5,
    waCategory: "welcome",
    waHints: ["welcome", "new_lead", "ליד"],
  },
  {
    key: "wa_new_lead_owner_alert",
    rank: 1,
    name: "ליד חדש → התראת WhatsApp לבעל העסק",
    description: "ליד נכנס ל-CRM → התראה פנימית ב-WhatsApp לבעל העסק.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["התראת WhatsApp לבעל העסק"],
    categories: ["leads", "whatsapp", "crm"],
    engine: "whatsapp_simple",
    whatsappTrigger: "new_lead_welcome",
    waCategory: "custom",
    waPreferredMetaName: "new_lead_received_utility",
    waHints: ["new_lead_received_utility", "new_lead_received"],
    allowBusinessAlert: true,
  },
  {
    key: "wa_appointment_reminder_1_day",
    rank: 2,
    name: "תזכורת פגישה — יום לפני",
    description: "יום לפני הפגישה → תזכורת WhatsApp ללקוח (מופעל מיד).",
    triggerLabel: "פגישה קרובה (יום לפני)",
    resultLabels: ["תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_reminder_1_day",
    waCategory: "appointment_reminder",
    waHints: ["reminder", "appointment", "תזכורת", "פגישה"],
  },
  {
    key: "wa_appointment_reminder_2_days",
    rank: 3,
    name: "תזכורת פגישה — יומיים לפני",
    description: "48 שעות לפני הפגישה → תזכורת WhatsApp (מופעל מיד).",
    triggerLabel: "פגישה קרובה (יומיים לפני)",
    resultLabels: ["תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_reminder_hours",
    hoursBefore: 48,
    waCategory: "appointment_reminder",
    waHints: ["reminder", "appointment", "תזכורת"],
  },
  {
    key: "wa_appointment_reminder_3_days",
    rank: 4,
    name: "תזכורת פגישה — 3 ימים לפני",
    description: "72 שעות לפני הפגישה → תזכורת WhatsApp מוקדמת (מופעל מיד).",
    triggerLabel: "פגישה קרובה (3 ימים לפני)",
    resultLabels: ["תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_reminder_hours",
    hoursBefore: 72,
    waCategory: "appointment_reminder",
    waHints: ["reminder", "appointment", "תזכורת"],
  },
  {
    key: "wa_appointment_reminder_2_hours",
    rank: 5,
    name: "תזכורת פגישה — שעתיים לפני",
    description: "שעתיים לפני הפגישה → תזכורת WhatsApp (מופעל מיד).",
    triggerLabel: "פגישה קרובה (שעתיים לפני)",
    resultLabels: ["תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_reminder_hours",
    hoursBefore: 2,
    waCategory: "appointment_reminder",
    waHints: ["reminder", "appointment", "תזכורת"],
  },
  {
    key: "wa_appointment_reminder_1_hour",
    rank: 6,
    name: "תזכורת פגישה — שעה לפני",
    description: "שעה לפני הפגישה → תזכורת WhatsApp אחרונה (מופעל מיד).",
    triggerLabel: "פגישה קרובה (שעה לפני)",
    resultLabels: ["תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_reminder_hours",
    hoursBefore: 1,
    waCategory: "appointment_reminder",
    waHints: ["reminder", "appointment", "תזכורת"],
  },
  {
    key: "wa_appointment_thanks",
    rank: 7,
    name: "תודה אחרי פגישה (WhatsApp)",
    description: "אחרי פגישה → הודעת תודה ב-WhatsApp (מופעל מיד).",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["הודעת תודה"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_thanks",
    waCategory: "custom",
    waHints: ["thanks", "thank", "תודה"],
  },
  {
    key: "wa_appointment_review",
    rank: 8,
    name: "בקשת ביקורת אחרי פגישה",
    description: "יום אחרי הפגישה → בקשת ביקורת ב-WhatsApp (מופעל מיד).",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["בקשת ביקורת"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_review_request",
    delayHours: 24,
    waCategory: "custom",
    waHints: ["review", "feedback", "ביקורת"],
  },
  {
    key: "wa_lead_no_response",
    rank: 9,
    name: "ליד שלא נענה → פולואפ WhatsApp",
    description: "אחרי ~24 שעות בלי מענה → פולואפ WhatsApp (מופעל מיד).",
    triggerLabel: "ליד שלא נענה",
    resultLabels: ["פולואפ WhatsApp"],
    categories: ["leads", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "lead_no_response",
    delayHours: 24,
    waCategory: "follow_up",
    waHints: ["follow", "מעקב", "פולואפ"],
  },
  {
    key: "wa_lead_followup_2",
    rank: 10,
    name: "פולואפ שני לליד",
    description: "מעקב נוסף אחרי ~3 ימים ללידים שלא הומרו (מופעל מיד).",
    triggerLabel: "ליד ללא המרה",
    resultLabels: ["פולואפ שני"],
    categories: ["leads", "whatsapp", "sales"],
    engine: "whatsapp_simple",
    whatsappTrigger: "lead_followup_2",
    delayDays: 3,
    waCategory: "follow_up",
    waHints: ["follow", "מעקב"],
  },
  {
    key: "wa_new_client_welcome",
    rank: 11,
    name: "לקוח חדש → ברוכים הבאים",
    description: "לקוח חדש ב-CRM → הודעת פתיחה ב-WhatsApp (מופעל מיד).",
    triggerLabel: "לקוח חדש",
    resultLabels: ["הודעת פתיחה"],
    categories: ["crm", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "new_client_welcome",
    delayMinutes: 5,
    waCategory: "welcome",
    waHints: ["welcome", "client", "לקוח"],
  },
  {
    key: "wa_inactive_client",
    rank: 12,
    name: "לקוח לא פעיל → נגיעה",
    description: "לקוח ללא פעילות ~30 יום → הודעת נגיעה (מופעל מיד).",
    triggerLabel: "לקוח לא פעיל",
    resultLabels: ["הודעת נגיעה"],
    categories: ["crm", "whatsapp", "sales"],
    engine: "whatsapp_simple",
    whatsappTrigger: "inactive_client",
    delayDays: 30,
    waCategory: "follow_up",
    waHints: ["inactive", "נגיעה", "follow"],
  },

  // ── Multi-channel workflows (publish when triggers/templates ready) ──
  {
    key: "wf_lead_multi",
    rank: 13,
    name: "ליד חדש → WhatsApp + משימה + התראה",
    description: "המקרה הקלאסי: ליד נכנס → WhatsApp + משימה לנציג + התראה לבעלים.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp", "משימה", "התראה"],
    categories: ["leads", "crm", "whatsapp"],
    engine: "workflow_recipe",
    recipeKey: "lead_multi_route",
    requiresWaTemplate: true,
    waCategory: "welcome",
    waHints: ["welcome", "new_lead"],
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actionLabel: "WhatsApp לליד",
        waTemplateId,
        extraActions: [
          { actionKey: "create_task", label: "משימה לנציג" },
          { actionKey: "notify", label: "התראה לבעל העסק" },
        ],
      }),
  },
  {
    key: "wf_lead_wa_email",
    rank: 14,
    name: "ליד חדש → WhatsApp + אימייל",
    description: "ליד חדש מקבל גם WhatsApp וגם אימייל Bizuply — כיסוי כפול.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp", "אימייל Bizuply"],
    categories: ["leads", "whatsapp", "email"],
    engine: "workflow_graph",
    requiresWaTemplate: true,
    waCategory: "welcome",
    waHints: ["welcome", "new_lead"],
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actionLabel: "WhatsApp לליד",
        waTemplateId,
        extraActions: [
          {
            actionKey: "send_email",
            label: "אימייל לליד",
            defaults: {
              recipientType: "lead_email",
              subject: "שמחים שפנית אלינו",
            },
          },
        ],
      }),
  },
  {
    key: "wf_lead_full_onboarding",
    rank: 15,
    name: "ליד חדש → WhatsApp + אימייל + משימה + התראה",
    description: "חבילת קליטה מלאה לליד חדש בכל הערוצים החשובים.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp", "אימייל", "משימה", "התראה"],
    categories: ["leads", "crm", "whatsapp", "email"],
    engine: "workflow_graph",
    requiresWaTemplate: true,
    waCategory: "welcome",
    waHints: ["welcome", "new_lead"],
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actionLabel: "WhatsApp לליד",
        waTemplateId,
        extraActions: [
          {
            actionKey: "send_email",
            label: "אימייל לליד",
            defaults: {
              recipientType: "lead_email",
              subject: "שמחים שפנית אלינו",
            },
          },
          { actionKey: "create_task", label: "משימת מעקב לנציג" },
          { actionKey: "notify", label: "התראה לבעל העסק" },
        ],
      }),
  },
  {
    key: "wf_lead_email_task",
    rank: 16,
    name: "ליד חדש → אימייל + משימה",
    description: "בלי WhatsApp: אימייל Bizuply + משימת מעקב ב-CRM.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["אימייל Bizuply", "משימת מעקב"],
    categories: ["leads", "email", "crm"],
    engine: "workflow_graph",
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actions: [
          {
            actionKey: "send_email",
            label: "אימייל לליד",
            defaults: {
              recipientType: "lead_email",
              subject: "שמחים שפנית אלינו",
            },
          },
          { actionKey: "create_task", label: "משימת מעקב" },
        ],
      }),
  },
  {
    key: "wf_lead_email_only",
    rank: 17,
    name: "ליד חדש → אימייל פתיחה",
    description: "ליד חדש מקבל אימייל פתיחה מ-Bizuply בלבד.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["אימייל Bizuply"],
    categories: ["leads", "email"],
    engine: "workflow_graph",
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actions: [
          {
            actionKey: "send_email",
            label: "אימייל פתיחה",
            defaults: {
              recipientType: "lead_email",
              subject: "תודה על הפנייה",
            },
          },
        ],
      }),
  },
  {
    key: "wf_lead_desk_alert",
    rank: 18,
    name: "ליד חדש → משימה + התראה לצוות",
    description: "בלי הודעות ללקוח: משימה והתראה פנימית כשנכנס ליד.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["משימה", "התראה"],
    categories: ["leads", "crm", "sales"],
    engine: "workflow_graph",
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actions: [
          { actionKey: "create_task", label: "משימה לנציג" },
          { actionKey: "notify", label: "התראה לצוות" },
        ],
      }),
  },
  {
    key: "wf_lead_no_response_pack",
    rank: 19,
    name: "ליד שלא נענה → WhatsApp + משימה + סטטוס",
    description: "מעקב חכם: WhatsApp, משימה לנציג ועדכון סטטוס ליד.",
    triggerLabel: "ליד שלא נענה",
    resultLabels: ["WhatsApp מעקב", "משימה", "עדכון סטטוס"],
    categories: ["leads", "whatsapp", "sales"],
    engine: "workflow_recipe",
    recipeKey: "lead_no_response",
    comingSoon: true,
    requiresWaTemplate: true,
    waCategory: "follow_up",
    waHints: ["follow", "מעקב"],
    requiredTriggerKeys: LEAD_NO_RESPONSE_KEYS,
    buildGraph: ({ triggerKey, waTemplateId }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "ליד שלא נענה",
        actionLabel: "WhatsApp מעקב",
        waTemplateId,
        extraActions: [
          { actionKey: "create_task", label: "משימת חזרה לליד" },
          {
            actionKey: "update_status",
            label: "עדכון סטטוס",
            defaults: { status: "follow_up" },
          },
        ],
      }),
  },
  {
    key: "wf_lead_status_sales",
    rank: 20,
    name: "שינוי סטטוס ליד → משימה + התראה",
    description: "כשסטטוס ליד משתנה — הצוות מקבל משימה והתראה.",
    triggerLabel: "שינוי סטטוס ליד",
    resultLabels: ["משימה", "התראה"],
    categories: ["leads", "sales", "crm"],
    engine: "workflow_graph",
    requiredTriggerKeys: LEAD_STATUS_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "שינוי סטטוס ליד",
        actions: [
          { actionKey: "create_task", label: "משימה לפי סטטוס" },
          { actionKey: "notify", label: "התראה לצוות מכירות" },
        ],
      }),
  },
  {
    key: "wf_new_client_pack",
    rank: 21,
    name: "לקוח חדש → WhatsApp + אימייל + משימת שימור",
    description: "קליטת לקוח חדש: הודעת פתיחה, אימייל ומשימת שימור.",
    triggerLabel: "לקוח חדש",
    resultLabels: ["WhatsApp", "אימייל", "משימת שימור"],
    categories: ["crm", "whatsapp", "email"],
    engine: "workflow_recipe",
    recipeKey: "new_client_welcome",
    comingSoon: true,
    requiresWaTemplate: true,
    waCategory: "welcome",
    waHints: ["welcome", "client", "לקוח"],
    requiredTriggerKeys: CLIENT_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "לקוח חדש",
        actionLabel: "WhatsApp ברוכים הבאים",
        waTemplateId,
        extraActions: [
          {
            actionKey: "send_email",
            label: "אימייל ברוכים הבאים",
            defaults: {
              recipientType: "client_email",
              subject: "ברוכים הבאים",
            },
          },
          { actionKey: "create_task", label: "משימת שימור" },
        ],
      }),
  },
  {
    key: "wf_appointment_email",
    rank: 22,
    name: "פגישה חדשה → אימייל אישור",
    description: "פגישה נוצרת → אימייל אישור ללקוח מ-Bizuply.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אימייל אישור"],
    categories: ["appointments", "email"],
    engine: "workflow_graph",
    requiredTriggerKeys: APPOINTMENT_TRIGGER_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        actions: [
          {
            actionKey: "send_email",
            label: "אימייל אישור פגישה",
            defaults: {
              recipientType: "appointment_customer_email",
              subject: "אישור פגישה",
            },
          },
        ],
      }),
  },
  {
    key: "wf_appointment_email_notify",
    rank: 23,
    name: "פגישה חדשה → אימייל ללקוח + התראה לצוות",
    description: "אישור ללקוח במייל + התראה פנימית לבעל העסק.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אימייל אישור", "התראה"],
    categories: ["appointments", "email"],
    engine: "workflow_graph",
    requiredTriggerKeys: APPOINTMENT_TRIGGER_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        actions: [
          {
            actionKey: "send_email",
            label: "אימייל אישור פגישה",
            defaults: {
              recipientType: "appointment_customer_email",
              subject: "אישור פגישה",
            },
          },
          { actionKey: "notify", label: "התראה על פגישה חדשה" },
        ],
      }),
  },
  {
    key: "wf_appointment_gcal",
    rank: 24,
    name: "פגישה חדשה → Google Calendar",
    description: "פגישה חדשה → אירוע ביומן Google (דורש חיבור יומן).",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אירוע ביומן Google"],
    categories: ["appointments"],
    engine: "workflow_graph",
    requiredTriggerKeys: APPOINTMENT_TRIGGER_KEYS,
    requiresCalendar: true,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
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
      }),
  },
  {
    key: "wf_appointment_email_gcal",
    rank: 25,
    name: "פגישה חדשה → אימייל + Google Calendar",
    description: "אישור במייל + יצירת אירוע ביומן יחד.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אימייל אישור", "אירוע ביומן"],
    categories: ["appointments", "email"],
    engine: "workflow_graph",
    requiredTriggerKeys: APPOINTMENT_TRIGGER_KEYS,
    requiresCalendar: true,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        actions: [
          {
            actionKey: "send_email",
            label: "אימייל אישור פגישה",
            defaults: {
              recipientType: "appointment_customer_email",
              subject: "אישור פגישה",
            },
          },
          {
            actionKey: "google_calendar_create_event",
            label: "יצירת אירוע ביומן",
            defaults: {
              title: "פגישה עם {{appointment.clientName}}",
              calendarId: "primary",
            },
          },
        ],
      }),
  },
  {
    key: "wf_appointment_confirm_pack",
    rank: 26,
    name: "פגישה חדשה → אימייל + משימה + התראה",
    description: "חבילת אישור פגישה לצוות וללקוח בלי WhatsApp.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אימייל", "משימה", "התראה"],
    categories: ["appointments", "email", "crm"],
    engine: "workflow_graph",
    requiredTriggerKeys: APPOINTMENT_TRIGGER_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        actions: [
          {
            actionKey: "send_email",
            label: "אימייל אישור",
            defaults: {
              recipientType: "appointment_customer_email",
              subject: "אישור פגישה",
            },
          },
          { actionKey: "create_task", label: "הכנה לפגישה" },
          { actionKey: "notify", label: "התראה לצוות" },
        ],
      }),
  },
  {
    key: "wf_appointment_done_email",
    rank: 27,
    name: "אחרי פגישה → אימייל תודה",
    description: "בסיום פגישה נשלח אימייל תודה ללקוח.",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["אימייל תודה"],
    categories: ["appointments", "email"],
    engine: "workflow_graph",
    comingSoon: true,
    requiredTriggerKeys: APPOINTMENT_DONE_TRIGGER_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה הסתיימה",
        actions: [
          {
            actionKey: "send_email",
            label: "אימייל תודה",
            defaults: {
              recipientType: "appointment_customer_email",
              subject: "תודה על הפגישה",
            },
          },
        ],
      }),
  },
  {
    key: "wf_appointment_duo",
    rank: 28,
    name: "פגישה חדשה → אישור WhatsApp + תזכורת + משימה",
    description:
      "כשנוצרת פגישה: אישור WhatsApp ללקוח, משימת הכנה, ותזכורת לפני המועד (ללא הודעת תודה אחרי סיום).",
    triggerLabel: "פגישה חדשה / תזכורת לפני",
    resultLabels: ["אישור WhatsApp", "תזכורת לפני", "משימה"],
    categories: ["appointments", "whatsapp"],
    engine: "workflow_recipe",
    recipeKey: "appointment_duo",
    requiresWaTemplate: true,
    waCategory: "appointment_reminder",
    waHints: ["reminder", "appointment", "תזכורת", "confirm"],
    requiredTriggerKeys: APPOINTMENT_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        actionLabel: "אישור / תזכורת WhatsApp",
        waTemplateId,
        hoursBefore: 24,
        extraActions: [
          {
            actionKey: "send_email",
            label: "אימייל אישור",
            defaults: {
              recipientType: "appointment_customer_email",
              subject: "אישור פגישה",
            },
          },
        ],
      }),
  },

];

function aiCategoriesFor(triggerKey: string): TemplateCategoryId[] {
  if (triggerKey === "scheduled") return ["ai", "crm"];
  if (triggerKey === "lead_status_changed") {
    return ["ai", "leads", "crm", "sales"];
  }
  return ["ai", "leads", "crm", "sales"];
}

function aiRequiredTriggerKeys(triggerKey: string): string[] {
  if (triggerKey === "scheduled") return ["scheduled"];
  if (triggerKey === "lead_status_changed") return [...LEAD_STATUS_KEYS];
  return [...LEAD_TRIGGER_KEYS];
}

WORKING_TEMPLATES.push(
  ...listSupportedAiTemplates().map(
    (template, index): WorkingTemplate => ({
      key: template.templateKey || `wf_${template.recipeKey}`,
      rank: 29 + index,
      name: template.titleHe,
      description: template.description,
      triggerLabel: template.customerExplanation.startsWhen,
      resultLabels: [
        template.customerExplanation.aiDoes,
        template.customerExplanation.afterwards,
      ].filter(Boolean),
      categories: aiCategoriesFor(template.recommendedTrigger),
      keywords: [...template.keywords],
      engine: "workflow_recipe",
      recipeKey: template.recipeKey,
      comingSoon: false,
      requiresAiEntitlement: false,
      requiredTriggerKeys: aiRequiredTriggerKeys(template.recommendedTrigger),
      buildGraph: ({ triggerKey }) => {
        const graph = buildAiTemplateGraph(template);
        return {
          nodes: graph.nodes.map((node) =>
            node.type === "trigger"
              ? { ...node, data: { ...node.data, triggerKey } }
              : node
          ),
          edges: graph.edges,
        };
      },
    })
  )
);

for (const template of WORKING_TEMPLATES) {
  template.waPreferredMetaName =
    BLUEPRINT_PREFERRED_META[template.key] || template.waPreferredMetaName;
  if (template.waPreferredMetaName) {
    template.waHints = [template.waPreferredMetaName];
  }
}

export type TemplateReadiness = {
  ready: boolean;
  blocker?: string;
  suggestedWaTemplateId?: string;
  suggestedWaTemplateName?: string;
  resolvedTriggerKey?: string;
  recipe?: AutomationRecipeSummary;
};

export type WorkingContext = {
  recipes: AutomationRecipeSummary[];
  triggers: AutomationTriggerCatalogItem[];
  /** BizUply-managed approved catalog templates (senderMode=bizuply_managed). */
  waTemplates: Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>;
  /** Platform-managed WhatsApp API is ready — businesses do not connect Meta themselves. */
  managedWaReady: boolean;
  calendarConnected: boolean;
  aiEntitled: boolean;
};

function templateHaystack(tpl: {
  name?: string;
  key?: string;
  metaTemplateName?: string;
  category?: string;
}) {
  return [tpl.name, tpl.key, tpl.metaTemplateName, tpl.category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getWaTemplateId(
  tpl: WhatsAppTemplate | ApprovedWhatsAppTemplate | { _id?: string; id?: string }
): string {
  return String(
    (tpl as { _id?: string })._id || (tpl as { id?: string }).id || ""
  );
}

/** Meta APPROVED templates only — local/active drafts are not sendable. */
export function listUsableWaTemplates(
  templates: Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>
): Array<WhatsAppTemplate | ApprovedWhatsAppTemplate> {
  return (templates || []).filter((tpl) => {
    const id = getWaTemplateId(tpl);
    if (!id) return false;
    const status = String((tpl as WhatsAppTemplate).status || "").toLowerCase();
    const meta = String(
      (tpl as WhatsAppTemplate).metaStatus ||
        (tpl as ApprovedWhatsAppTemplate).metaStatus ||
        ""
    ).toLowerCase();
    if (status === "archived" || status === "draft") return false;
    return meta === "approved";
  });
}

export function pickBestWaTemplate(
  templates: Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>,
  opts: {
    category?: string;
    hints?: string[];
    preferredMetaName?: string;
    allowBusinessAlert?: boolean;
  }
): { id: string; name: string } | null {
  const usable = listUsableWaTemplates(templates).filter((tpl) => {
    const metaName = String(
      (tpl as WhatsAppTemplate).metaTemplateName || ""
    ).toLowerCase();
    if (
      isTestTemplateName(metaName) ||
      (tpl as ApprovedWhatsAppTemplate).isTestTemplate
    ) {
      return false;
    }
    return (
      !isLegacyManagedMetaTemplateName(metaName) ||
      opts.preferredMetaName === "new_lead_received" ||
      opts.preferredMetaName === "new_lead_received_utility" ||
      opts.allowBusinessAlert === true
    );
  });
  if (!usable.length) return null;

  const hints = (opts.hints || []).map((h) => h.toLowerCase());
  const score = (tpl: WhatsAppTemplate | ApprovedWhatsAppTemplate) => {
    const hay = templateHaystack(tpl);
    let points = 0;
    const meta = String(
      (tpl as WhatsAppTemplate).metaStatus ||
        (tpl as ApprovedWhatsAppTemplate).metaStatus ||
        ""
    ).toLowerCase();
    if (meta === "approved") points += 5;
    if ((tpl as WhatsAppTemplate).isSystem) points += 4;
    if ((tpl as ApprovedWhatsAppTemplate).isTestTemplate) points -= 2;
    if (opts.category && String(tpl.category || "") === opts.category) {
      points += 4;
    }
    const metaName = String(
      (tpl as WhatsAppTemplate).metaTemplateName || ""
    ).toLowerCase();
    if (
      metaName === String(opts.preferredMetaName || "").toLowerCase()
    ) {
      points += 10000;
    }
    for (const hint of hints) {
      if (hay.includes(hint)) points += 3;
      if (metaName && metaName.includes(hint)) points += 4;
    }
    return points;
  };

  const ranked = [...usable].sort((a, b) => score(b) - score(a));
  const chosen = ranked[0];
  const id = getWaTemplateId(chosen);
  if (!id) return null;
  return {
    id,
    name: String(chosen.name || chosen.key || "תבנית"),
  };
}

export function isWhatsAppFacingTemplate(template: WorkingTemplate): boolean {
  return (
    template.engine === "whatsapp_simple" ||
    Boolean(template.requiresWaTemplate) ||
    template.categories.includes("whatsapp")
  );
}

export function resolvePublishableTrigger(
  preferredKeys: string[] | undefined,
  triggers: AutomationTriggerCatalogItem[]
): string | null {
  const publishable = (triggers || []).filter((t) => t.isPublishable);
  if (!preferredKeys?.length) {
    return publishable[0]?.key || null;
  }
  for (const key of preferredKeys) {
    const hit = publishable.find(
      (t) => String(t.key).toLowerCase() === key.toLowerCase()
    );
    if (hit) return hit.key;
  }
  // fuzzy
  for (const key of preferredKeys) {
    const token = key.split("_").find((p) => p.length > 3);
    if (!token) continue;
    const hit = publishable.find((t) =>
      `${t.key} ${t.label}`.toLowerCase().includes(token.toLowerCase())
    );
    if (hit) return hit.key;
  }
  return null;
}

export function getTemplateReadiness(
  template: WorkingTemplate,
  ctx: WorkingContext
): TemplateReadiness {
  const recipe = ctx.recipes.find((r) => r.key === template.recipeKey);

  if (template.comingSoon) {
    return {
      ready: false,
      blocker: "בקרוב — עדיין לא זמין להפעלה",
      recipe,
    };
  }

  const needsWa =
    template.engine === "whatsapp_simple" ||
    Boolean(template.requiresWaTemplate);

  if (needsWa) {
    if (!ctx.managedWaReady) {
      return {
        ready: false,
        blocker: "חברו WhatsApp Business (Bizuply) כדי להפעיל",
        recipe,
      };
    }
    const approved = listUsableWaTemplates(ctx.waTemplates);
    if (!approved.length) {
      return {
        ready: false,
        blocker: "אין תבניות WhatsApp מאושרות (APPROVED) לבחירה",
        recipe,
      };
    }
  }

  if (template.engine === "whatsapp_simple") {
    const triggerKey = resolvePublishableTrigger(
      triggerKeysForWhatsAppSimple(template),
      ctx.triggers
    );
    if (!triggerKey) {
      return {
        ready: false,
        blocker: "אין טריגר מאושר מהשרת לאוטומציה הזו כרגע",
        recipe,
      };
    }
    const picked = pickBestWaTemplate(ctx.waTemplates, {
      category: template.waCategory,
      hints: template.waHints,
      preferredMetaName: template.waPreferredMetaName,
      allowBusinessAlert: template.allowBusinessAlert,
    });
    if (!picked) {
      return {
        ready: false,
        blocker: "בחרו תבנית Meta מאושרת בעת ההפעלה — אין כרגע תבנית מתאימה",
        recipe,
        resolvedTriggerKey: triggerKey,
      };
    }
    return {
      ready: true,
      suggestedWaTemplateId: picked.id,
      suggestedWaTemplateName: picked.name,
      resolvedTriggerKey: triggerKey,
    };
  }

  if (template.requiresCalendar && !ctx.calendarConnected) {
    return {
      ready: false,
      blocker: "חברו Google Calendar במסך החיבורים כדי להפעיל",
      recipe,
    };
  }

  // WhatsApp-bearing workflows require publishable trigger + APPROVED template.
  if (template.requiresWaTemplate && template.buildGraph) {
    const triggerKey = resolvePublishableTrigger(
      template.requiredTriggerKeys,
      ctx.triggers
    );
    if (!triggerKey) {
      return {
        ready: false,
        blocker: "אין טריגר מאושר מהשרת לאוטומציה הזו כרגע",
        recipe,
      };
    }
    const picked = pickBestWaTemplate(ctx.waTemplates, {
      category: template.waCategory,
      hints: template.waHints,
      preferredMetaName: template.waPreferredMetaName,
      allowBusinessAlert: template.allowBusinessAlert,
    });
    if (!picked) {
      return {
        ready: false,
        blocker: "אין תבנית WhatsApp מאושרת לבחירה עבור האוטומציה",
        recipe,
        resolvedTriggerKey: triggerKey,
      };
    }
    return {
      ready: true,
      recipe,
      resolvedTriggerKey: triggerKey,
      suggestedWaTemplateId: picked.id,
      suggestedWaTemplateName: picked.name,
    };
  }

  if (template.engine === "workflow_recipe") {
    if (
      recipe &&
      recipe.canCreate !== false &&
      !recipe.aiLocked &&
      !recipe.comingSoon
    ) {
      return { ready: true, recipe };
    }
    if (!template.buildGraph) {
      return {
        ready: false,
        blocker: recipe
          ? "המתכון עדיין לא זמין להפעלה בחשבון הזה"
          : "המתכון לא נמצא בשרת",
        recipe,
      };
    }
  }

  if (template.buildGraph || template.engine === "workflow_graph") {
    const triggerKey = resolvePublishableTrigger(
      template.requiredTriggerKeys,
      ctx.triggers
    );
    if (!triggerKey) {
      return {
        ready: false,
        blocker: "אין טריגר מאושר מהשרת לאוטומציה הזו כרגע",
        recipe,
      };
    }
    return { ready: true, recipe, resolvedTriggerKey: triggerKey };
  }

  return { ready: false, blocker: "לא ניתן להפעיל תבנית זו", recipe };
}
