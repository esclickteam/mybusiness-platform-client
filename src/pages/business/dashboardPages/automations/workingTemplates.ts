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
  defaultMappingsForMetaTemplate,
  isBusinessAlertMetaTemplateName,
  isLegacyManagedMetaTemplateName,
  isTestTemplateName,
} from "./whatsappAutomationMetaTemplates";
import {
  WA_TEMPLATE_UNAVAILABLE_HE,
  resolveApprovedMetaTemplateForAutomation,
} from "./whatsappAutomationTemplateResolver";
import {
  EMAIL_PROVIDER_REQUIRED_HE,
  applyEmailProviderToActions,
  hasConnectedEmailProvider,
  listConnectedEmailProviders,
  type EmailProviderId,
} from "./emailProviderAutomation";
import { APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS, STORE_ORDER_CONFIRMATION_EMAIL_DEFAULTS } from "./appointmentConfirmationEmail";
import {
  LEAD_OPENING_EMAIL_DEFAULTS,
  LEAD_WELCOME_EMAIL_DEFAULTS,
} from "./leadWelcomeEmail";

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
  /** Delay until appointment start/end instead of a relative wait from trigger time. */
  delayUntil?: "appointment_start" | "appointment_end";
  /** Hours after (positive) or before (negative) the delayUntil anchor. */
  delayUntilOffsetHours?: number;
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
    emailProvider?: EmailProviderId;
  }) => { nodes: AutomationFlowNode[]; edges: AutomationFlowEdge[] };
  requiredTriggerKeys?: string[];
  requiresWaTemplate?: boolean;
  requiresCalendar?: boolean;
  /** Requires Gmail or Outlook / Microsoft 365 — not Bizuply-hosted email. */
  requiresEmailProvider?: boolean;
  requiresAiEntitlement?: boolean;
  /** All Meta template names that must be APPROVED before this card is ready */
  requiredMetaTemplateNames?: string[];
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
  "client_created",
  "crm_client_created",
  "new_client",
  "customer_created",
];
const CLIENT_INACTIVE_TRIGGER_KEYS = [
  "client_inactive",
  "crm_client_inactive",
  "inactive_client",
];
const LEAD_NO_RESPONSE_KEYS = [
  "lead_no_response",
  "crm_lead_no_response",
  "lead_followup",
  // Publishable fixture-safe path until dedicated no-response emit ships.
  "new_lead",
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
/** After-meeting cards use appointment_created + delay until completed emit exists. */
const APPOINTMENT_DONE_FALLBACK_KEYS = [
  ...APPOINTMENT_DONE_TRIGGER_KEYS,
  "appointment_created",
];
const STORE_ORDER_TRIGGER_KEYS = ["store_order_paid"];

type GraphAction = {
  actionKey: string;
  label: string;
  defaults?: Record<string, unknown>;
};

function resultGraph(opts: {
  triggerKey: string;
  triggerLabel: string;
  hoursBefore?: number;
  emailProvider?: EmailProviderId;
  actions: GraphAction[];
}) {
  const actions = applyEmailProviderToActions(opts.actions, opts.emailProvider);
  const nodes: AutomationFlowNode[] = [
    {
      id: "trigger_1",
      type: "trigger",
      position: { x: 80, y: Math.max(120, 40 + actions.length * 70) },
      data: {
        label: opts.triggerLabel,
        triggerKey: opts.triggerKey,
        routeCount: actions.length,
        ...(opts.hoursBefore != null ? { hoursBefore: opts.hoursBefore } : {}),
      },
    },
  ];
  const edges: AutomationFlowEdge[] = [];
  actions.forEach((action, index) => {
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
  emailProvider?: EmailProviderId;
  extraActions?: GraphAction[];
}) {
  return resultGraph({
    triggerKey: opts.triggerKey,
    triggerLabel: opts.triggerLabel,
    hoursBefore: opts.hoursBefore,
    emailProvider: opts.emailProvider,
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

function buildAppointmentDuoGraph(opts: {
  triggerKey: string;
  waTemplateId?: string;
}): { nodes: AutomationFlowNode[]; edges: AutomationFlowEdge[] } {
  const waBase = {
    actionKey: "whatsapp_template",
    senderMode: "bizuply_managed",
    recipientType: "appointment_customer_phone",
    language: "he",
    blueprintKey: "wf_appointment_duo",
  };
  return {
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        position: { x: 40, y: 220 },
        data: {
          label: "פגישה חדשה",
          triggerKey: opts.triggerKey || "appointment_created",
          routeCount: 1,
        },
      },
      {
        id: "a_confirm",
        type: "action",
        position: { x: 280, y: 80 },
        data: {
          ...waBase,
          templateId: "",
          label: "אישור WhatsApp",
          metaTemplateName: "appointment_confirmation",
          blueprintTrigger: "appointment_created",
          componentMappings: defaultMappingsForMetaTemplate(
            "appointment_confirmation"
          ),
          variableMappings: defaultMappingsForMetaTemplate(
            "appointment_confirmation"
          ),
        },
      },
      {
        id: "a_task",
        type: "action",
        position: { x: 520, y: 80 },
        data: {
          label: "משימת הכנה",
          actionKey: "create_task",
          title: "הכנה לפגישה: {{appointment.clientName}}",
        },
      },
      {
        id: "d_remind",
        type: "delay",
        position: { x: 760, y: 220 },
        data: {
          label: "המתנה עד יום לפני הפגישה",
          until: "appointment_start",
          offsetHours: -24,
        },
      },
      {
        id: "a_remind",
        type: "action",
        position: { x: 1000, y: 220 },
        data: {
          ...waBase,
          templateId: "",
          label: "תזכורת WhatsApp",
          metaTemplateName: "appointment_reminder",
          hoursBefore: 24,
          blueprintTrigger: "appointment_reminder",
          componentMappings: defaultMappingsForMetaTemplate(
            "appointment_reminder"
          ),
          variableMappings: defaultMappingsForMetaTemplate(
            "appointment_reminder"
          ),
        },
      },
    ],
    edges: [
      {
        id: "e_t_confirm",
        source: "trigger_1",
        target: "a_confirm",
        sourceHandle: "route_1",
        label: "אישור",
      },
      { id: "e_confirm_task", source: "a_confirm", target: "a_task" },
      { id: "e_task_delay", source: "a_task", target: "d_remind" },
      { id: "e_delay_remind", source: "d_remind", target: "a_remind" },
    ],
  };
}

/**
 * Reply-aware lead nurture sequence graph:
 * new_lead → opening → 24h → no_response? → FU1 → 3d → no_response? → FU2
 */
export function buildLeadReplySequenceGraph(opts: {
  triggerKey: string;
  openingTemplateId?: string;
  followUp1TemplateId?: string;
  followUp2TemplateId?: string;
}): { nodes: AutomationFlowNode[]; edges: AutomationFlowEdge[] } {
  const nodes: AutomationFlowNode[] = [
    {
      id: "t_lead",
      type: "trigger",
      position: { x: 40, y: 220 },
      data: {
        label: "ליד חדש ב-CRM",
        triggerKey: opts.triggerKey,
        routeCount: 1,
      },
    },
    {
      id: "a_open",
      type: "action",
      position: { x: 280, y: 220 },
      data: {
        label: "הודעת פתיחה WhatsApp",
        actionKey: "whatsapp_template",
        templateId: opts.openingTemplateId || "",
        senderMode: "bizuply_managed",
        recipientType: "lead_phone",
        metaTemplateName: "new_lead_welcome",
        language: "he",
        blueprintKey: "wf_lead_no_response_pack",
      },
    },
    {
      id: "d1",
      type: "delay",
      position: { x: 520, y: 220 },
      data: { label: "המתנה 24 שעות", amount: 24, unit: "hours" },
    },
    {
      id: "c1",
      type: "condition",
      position: { x: 760, y: 200 },
      data: {
        label: "עדיין בלי תשובת WhatsApp?",
        conditionKey: "no_response",
      },
    },
    {
      id: "a_fu1",
      type: "action",
      position: { x: 1000, y: 120 },
      data: {
        label: "פולואפ #1 WhatsApp",
        actionKey: "whatsapp_template",
        templateId: opts.followUp1TemplateId || "",
        senderMode: "bizuply_managed",
        recipientType: "lead_phone",
        metaTemplateName: "lead_follow_up",
        language: "he",
        blueprintKey: "wf_lead_no_response_pack",
      },
    },
    {
      id: "d2",
      type: "delay",
      position: { x: 1240, y: 120 },
      data: { label: "המתנה 3 ימים", amount: 3, unit: "days" },
    },
    {
      id: "c2",
      type: "condition",
      position: { x: 1480, y: 100 },
      data: {
        label: "עדיין בלי תשובת WhatsApp?",
        conditionKey: "no_response",
      },
    },
    {
      id: "a_fu2",
      type: "action",
      position: { x: 1720, y: 80 },
      data: {
        label: "פולואפ #2 WhatsApp",
        actionKey: "whatsapp_template",
        templateId: opts.followUp2TemplateId || "",
        senderMode: "bizuply_managed",
        recipientType: "lead_phone",
        metaTemplateName: "lead_follow_up_2",
        language: "he",
        blueprintKey: "wf_lead_no_response_pack",
      },
    },
  ];
  const edges: AutomationFlowEdge[] = [
    {
      id: "e_t_open",
      source: "t_lead",
      target: "a_open",
      sourceHandle: "route_1",
      label: "פתיחה",
    },
    { id: "e_open_d1", source: "a_open", target: "d1" },
    { id: "e_d1_c1", source: "d1", target: "c1" },
    {
      id: "e_c1_fu1",
      source: "c1",
      target: "a_fu1",
      sourceHandle: "yes",
      label: "כן — לא ענה",
    },
    { id: "e_fu1_d2", source: "a_fu1", target: "d2" },
    { id: "e_d2_c2", source: "d2", target: "c2" },
    {
      id: "e_c2_fu2",
      source: "c2",
      target: "a_fu2",
      sourceHandle: "yes",
      label: "כן — לא ענה",
    },
  ];
  return { nodes, edges };
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
      return ["appointment_reminder", ...APPOINTMENT_TRIGGER_KEYS];
    case "appointment_thanks":
    case "appointment_review_request":
      return APPOINTMENT_DONE_FALLBACK_KEYS;
    case "new_client_welcome":
      return CLIENT_TRIGGER_KEYS;
    case "inactive_client":
      return CLIENT_INACTIVE_TRIGGER_KEYS;
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
  const delayUntil = template.delayUntil || "";
  const useDelay =
    Boolean(delayUntil) ||
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
          : ctx.triggerKey === "appointment_reminder"
            ? { hoursBefore: 24 }
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
    const delayData: Record<string, unknown> = delayUntil
      ? {
          label:
            delayUntil === "appointment_end"
              ? "המתנה עד אחרי הפגישה"
              : "המתנה עד מועד הפגישה",
          until: delayUntil,
          offsetHours: Number(template.delayUntilOffsetHours || 0),
        }
      : {
          label: "המתנה",
          amount,
          unit,
        };
    nodes.push({
      id: delayId,
      type: "delay",
      position: { x: 320, y },
      data: delayData,
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
    rank: 2,
    name: "ליד חדש → WhatsApp פתיחה בלבד",
    description:
      "הודעת פתיחה מיידית בלבד (ללא פולואפים). למסלול פתיחה + פולואפים לפי תגובה — השתמשו בתבנית «ליד חדש → פתיחה + פולואפים לפי תגובה».",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["הודעת פתיחה WhatsApp"],
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
    hoursBefore: 24,
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
    description:
      "אחרי סיום הפגישה → הודעת תודה ב-WhatsApp (מתוזמן לפי מועד הפגישה, לא לפי יצירה).",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["הודעת תודה"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_thanks",
    delayUntil: "appointment_end",
    delayUntilOffsetHours: 0,
    waCategory: "custom",
    waHints: ["thanks", "thank", "תודה"],
  },
  {
    key: "wa_appointment_review",
    rank: 8,
    name: "בקשת ביקורת אחרי פגישה",
    description:
      "יום אחרי סיום הפגישה → בקשת ביקורת ב-WhatsApp (מתוזמן לפי מועד הפגישה, לא לפי יצירה).",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["בקשת ביקורת"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_review_request",
    delayUntil: "appointment_end",
    delayUntilOffsetHours: 24,
    delayHours: 24,
    waCategory: "custom",
    waHints: ["review", "feedback", "ביקורת"],
  },
  {
    key: "wa_lead_no_response",
    rank: 9,
    name: "פולואפ לליד שלא ענה → WhatsApp",
    description:
      "מוזג למסלול המאוחד «ליד חדש → פתיחה + פולואפים לפי תגובה». לא מוצג ככרטיס נפרד.",
    triggerLabel: "ליד שלא ענה ב-WhatsApp",
    resultLabels: ["פולואפ WhatsApp"],
    categories: ["leads", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "lead_no_response",
    delayHours: 24,
    waCategory: "follow_up",
    waHints: ["follow", "מעקב", "פולואפ"],
    comingSoon: true,
  },
  {
    key: "wa_lead_followup_2",
    rank: 10,
    name: "פולואפ שני לליד",
    description:
      "מוזג למסלול המאוחד «ליד חדש → פתיחה + פולואפים לפי תגובה». לא מוצג ככרטיס נפרד.",
    triggerLabel: "ליד ללא המרה",
    resultLabels: ["פולואפ שני"],
    categories: ["leads", "whatsapp", "sales"],
    engine: "whatsapp_simple",
    whatsappTrigger: "lead_followup_2",
    delayDays: 3,
    waCategory: "follow_up",
    waHints: ["follow", "מעקב"],
    comingSoon: true,
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
    description:
      "פתיחה מיידית בלבד: WhatsApp + משימה + התראה. לא כולל פולואפים לפי תגובה — למסלול המלא ראו «פתיחה + פולואפים לפי תגובה».",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp", "משימה", "התראה"],
    categories: ["leads", "crm", "whatsapp"],
    engine: "workflow_recipe",
    recipeKey: "lead_multi_route",
    requiresWaTemplate: true,
    waCategory: "welcome",
    waHints: ["welcome", "new_lead"],
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId, emailProvider }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actionLabel: "WhatsApp לליד",
        waTemplateId,
        emailProvider,
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
    description:
      "פתיחה מיידית בלבד: WhatsApp + אימייל. לא כולל פולואפים לפי תגובת WhatsApp.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp", "אימייל"],
    categories: ["leads", "whatsapp", "email"],
    engine: "workflow_graph",
    requiresWaTemplate: true,
    requiresEmailProvider: true,
    waCategory: "welcome",
    waHints: ["welcome", "new_lead"],
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId, emailProvider }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actionLabel: "WhatsApp לליד",
        waTemplateId,
        emailProvider,
        extraActions: [
          {
            actionKey: "connected_email",
            label: "אימייל לליד",
            defaults: {
              ...LEAD_WELCOME_EMAIL_DEFAULTS,
            },
          },
        ],
      }),
  },
  {
    key: "wf_lead_full_onboarding",
    rank: 15,
    name: "ליד חדש → WhatsApp + אימייל + משימה + התראה",
    description:
      "חבילת קליטה מיידית בכל הערוצים. לא כוללת פולואפי WhatsApp לפי תגובה — למסלול המלא ראו «פתיחה + פולואפים לפי תגובה».",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp", "אימייל", "משימה", "התראה"],
    categories: ["leads", "crm", "whatsapp", "email"],
    engine: "workflow_graph",
    requiresWaTemplate: true,
    requiresEmailProvider: true,
    waCategory: "welcome",
    waHints: ["welcome", "new_lead"],
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId, emailProvider }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        actionLabel: "WhatsApp לליד",
        waTemplateId,
        emailProvider,
        extraActions: [
          {
            actionKey: "connected_email",
            label: "אימייל לליד",
            defaults: {
              ...LEAD_WELCOME_EMAIL_DEFAULTS,
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
    description: "בלי WhatsApp: אימייל דרך Gmail או Outlook + משימת מעקב ב-CRM.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["אימייל", "משימת מעקב"],
    categories: ["leads", "email", "crm"],
    engine: "workflow_graph",
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    requiresEmailProvider: true,
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        emailProvider,
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
      }),
  },
  {
    key: "wf_lead_email_only",
    rank: 17,
    name: "ליד חדש → אימייל פתיחה",
    description: "ליד חדש מקבל אימייל פתיחה דרך Gmail או Outlook.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["אימייל"],
    categories: ["leads", "email"],
    engine: "workflow_graph",
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    requiresEmailProvider: true,
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        emailProvider,
        actions: [
          {
            actionKey: "connected_email",
            label: "אימייל פתיחה",
            defaults: {
              ...LEAD_OPENING_EMAIL_DEFAULTS,
            },
          },
        ],
      }),
  },
  {
    key: "wf_store_order_confirmation",
    rank: 12,
    name: "אישור הזמנה בחנות",
    description: "התקבלה הזמנה בחנות → שליחת מייל אישור מעוצב ללקוח.",
    triggerLabel: "התקבלה הזמנה בחנות",
    resultLabels: ["אימייל אישור הזמנה"],
    categories: ["sales", "email", "store"],
    keywords: [
      "חנות",
      "הזמנה",
      "אישור הזמנה",
      "order confirmation",
      "ecommerce",
      "store",
    ],
    engine: "workflow_graph",
    requiredTriggerKeys: STORE_ORDER_TRIGGER_KEYS,
    buildGraph: ({ triggerKey }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "התקבלה הזמנה בחנות",
        actions: [
          {
            actionKey: "send_email",
            label: "אימייל אישור הזמנה",
            defaults: {
              ...STORE_ORDER_CONFIRMATION_EMAIL_DEFAULTS,
              actionKey: "send_email",
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
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "ליד חדש ב-CRM",
        emailProvider,
        actions: [
          { actionKey: "create_task", label: "משימה לנציג" },
          { actionKey: "notify", label: "התראה לצוות" },
        ],
      }),
  },
  {
    key: "wf_lead_no_response_pack",
    rank: 1,
    name: "ליד חדש → פתיחה + פולואפים לפי תגובה",
    description:
      "הודעת פתיחה נשלחת מיד. אם הליד לא מגיב, נשלח פולואפ לאחר 24 שעות ופולואפ נוסף לאחר 3 ימים.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["פתיחה WhatsApp", "פולואפ #1", "פולואפ #2"],
    categories: ["leads", "whatsapp", "sales"],
    engine: "workflow_graph",
    recipeKey: "lead_no_response",
    requiresWaTemplate: true,
    waCategory: "welcome",
    waPreferredMetaName: "new_lead_welcome",
    waHints: ["welcome", "follow", "מעקב", "פולואפ", "לא ענה"],
    requiredMetaTemplateNames: [
      "new_lead_welcome",
      "lead_follow_up",
      "lead_follow_up_2",
    ],
    requiredTriggerKeys: LEAD_TRIGGER_KEYS,
    keywords: [
      "ליד שלא ענה",
      "פולואפ",
      "follow up",
      "no response",
      "נגיעה",
    ],
    buildGraph: ({ triggerKey, waTemplateId }) =>
      buildLeadReplySequenceGraph({
        triggerKey,
        openingTemplateId: waTemplateId,
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
    buildGraph: ({ triggerKey, emailProvider }) =>
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
    requiresEmailProvider: true,
    waCategory: "welcome",
    waHints: ["welcome", "client", "לקוח"],
    requiredTriggerKeys: CLIENT_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId, emailProvider }) =>
      waEdgeGraph({
        triggerKey,
        triggerLabel: "לקוח חדש",
        actionLabel: "WhatsApp ברוכים הבאים",
        waTemplateId,
        emailProvider,
        extraActions: [
          {
            actionKey: "connected_email",
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
    description: "פגישה נוצרת → אימייל אישור ללקוח דרך Gmail או Outlook.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אימייל אישור"],
    categories: ["appointments", "email"],
    engine: "workflow_graph",
    requiredTriggerKeys: APPOINTMENT_TRIGGER_KEYS,
    requiresEmailProvider: true,
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        emailProvider,
        actions: [
          {
            actionKey: "connected_email",
            label: "אימייל אישור פגישה",
            defaults: {
              ...APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS,
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
    requiresEmailProvider: true,
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        emailProvider,
        actions: [
          {
            actionKey: "connected_email",
            label: "אימייל אישור פגישה",
            defaults: {
              ...APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS,
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
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        emailProvider,
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
    requiresEmailProvider: true,
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        emailProvider,
        actions: [
          {
            actionKey: "connected_email",
            label: "אימייל אישור פגישה",
            defaults: {
              ...APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS,
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
    requiresEmailProvider: true,
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה חדשה",
        emailProvider,
        actions: [
          {
            actionKey: "connected_email",
            label: "אימייל אישור",
            defaults: {
              ...APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS,
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
    requiresEmailProvider: true,
    buildGraph: ({ triggerKey, emailProvider }) =>
      resultGraph({
        triggerKey,
        triggerLabel: "פגישה הסתיימה",
        emailProvider,
        actions: [
          {
            actionKey: "connected_email",
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
    engine: "workflow_graph",
    recipeKey: "appointment_duo",
    requiresWaTemplate: true,
    waCategory: "appointment_reminder",
    waPreferredMetaName: "appointment_confirmation",
    waHints: ["reminder", "appointment", "תזכורת", "confirm"],
    requiredMetaTemplateNames: [
      "appointment_confirmation",
      "appointment_reminder",
    ],
    hoursBefore: 24,
    requiredTriggerKeys: APPOINTMENT_TRIGGER_KEYS,
    buildGraph: ({ triggerKey, waTemplateId }) =>
      buildAppointmentDuoGraph({ triggerKey, waTemplateId }),
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
  connectedEmailProviders?: EmailProviderId[];
  suggestedEmailProvider?: EmailProviderId | null;
  needsEmailProviderChoice?: boolean;
};

export type WorkingContext = {
  recipes: AutomationRecipeSummary[];
  triggers: AutomationTriggerCatalogItem[];
  /** BizUply-managed approved catalog templates (senderMode=bizuply_managed). */
  waTemplates: Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>;
  /** Platform-managed WhatsApp API is ready — businesses do not connect Meta themselves. */
  managedWaReady: boolean;
  calendarConnected: boolean;
  gmailConnected: boolean;
  outlookConnected: boolean;
  aiEntitled: boolean;
};

/** Catalog visibility is independent of activation readiness. */
export function isTemplateVisibleInCatalog(
  template: WorkingTemplate,
  readiness: Pick<TemplateReadiness, "ready">,
  category: TemplateCategoryId
): boolean {
  if (template.comingSoon) return false;
  if (readiness.ready) return true;
  if (isEmailFacingTemplate(template)) return true;
  if (category === "whatsapp" && isWhatsAppFacingTemplate(template)) return true;
  return false;
}

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

export function isEmailFacingTemplate(template: WorkingTemplate): boolean {
  return (
    Boolean(template.requiresEmailProvider) ||
    template.categories.includes("email")
  );
}

export function listCustomerVisibleEmailTemplates(): WorkingTemplate[] {
  return WORKING_TEMPLATES.filter(
    (template) =>
      isEmailFacingTemplate(template) && template.comingSoon !== true
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

function emailReadinessMeta(
  template: WorkingTemplate,
  ctx: WorkingContext
): Pick<
  TemplateReadiness,
  | "connectedEmailProviders"
  | "suggestedEmailProvider"
  | "needsEmailProviderChoice"
> {
  if (!template.requiresEmailProvider) return {};
  const connected = listConnectedEmailProviders(ctx);
  return {
    connectedEmailProviders: connected,
    suggestedEmailProvider: connected.length === 1 ? connected[0] : null,
    needsEmailProviderChoice: connected.length > 1,
  };
}

export function getTemplateReadiness(
  template: WorkingTemplate,
  ctx: WorkingContext
): TemplateReadiness {
  const recipe = ctx.recipes.find((r) => r.key === template.recipeKey);
  const emailMeta = emailReadinessMeta(template, ctx);

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
    const metaResolved = resolveApprovedMetaTemplateForAutomation({
      automationTemplateKey: template.key,
      preferredMetaName: template.waPreferredMetaName,
      waTemplates: ctx.waTemplates,
      allowBusinessAlert: template.allowBusinessAlert,
    });
    if (!metaResolved.ready || !metaResolved.metaTemplate) {
      return {
        ready: false,
        blocker: metaResolved.whyNotReady || WA_TEMPLATE_UNAVAILABLE_HE,
        recipe,
      };
    }

    const triggerKey = resolvePublishableTrigger(
      triggerKeysForWhatsAppSimple(template),
      ctx.triggers
    );
    if (!triggerKey) {
      return {
        ready: false,
        blocker: "האוטומציה עדיין לא זמינה להפעלה במערכת",
        recipe,
      };
    }

    const pickedId = getWaTemplateId(metaResolved.metaTemplate);
    if (!pickedId) {
      return {
        ready: false,
        blocker: WA_TEMPLATE_UNAVAILABLE_HE,
        recipe,
        resolvedTriggerKey: triggerKey,
      };
    }
    return {
      ready: true,
      suggestedWaTemplateId: pickedId,
      suggestedWaTemplateName:
        metaResolved.metaTemplateName ||
        String(metaResolved.metaTemplate.name || ""),
      resolvedTriggerKey: triggerKey,
      ...emailMeta,
    };
  }

  if (template.requiresCalendar && !ctx.calendarConnected) {
    return {
      ready: false,
      blocker: "חברו Google Calendar במסך החיבורים כדי להפעיל",
      recipe,
    };
  }

  if (template.requiresEmailProvider && !hasConnectedEmailProvider(ctx)) {
    return {
      ready: false,
      blocker: EMAIL_PROVIDER_REQUIRED_HE,
      recipe,
    };
  }

  // WhatsApp-bearing workflows require publishable trigger + APPROVED template.
  if (template.requiresWaTemplate && template.buildGraph) {
    const requiredNames = (template.requiredMetaTemplateNames || [])
      .map((n) => String(n || "").trim().toLowerCase())
      .filter(Boolean);
    if (requiredNames.length) {
      const approved = listUsableWaTemplates(ctx.waTemplates);
      const missing = requiredNames.filter(
        (name) =>
          !approved.some((tpl) => {
            const meta = String(
              (tpl as { metaTemplateName?: string }).metaTemplateName ||
                tpl.name ||
                tpl.key ||
                ""
            )
              .trim()
              .toLowerCase();
            return meta === name;
          })
      );
      if (missing.length) {
        return {
          ready: false,
          blocker: `חסרות תבניות WhatsApp מאושרות: ${missing.join(", ")}`,
          recipe,
        };
      }
    }

    const metaResolved = resolveApprovedMetaTemplateForAutomation({
      automationTemplateKey: template.key,
      preferredMetaName: template.waPreferredMetaName,
      waTemplates: ctx.waTemplates,
      allowBusinessAlert: template.allowBusinessAlert,
    });
    if (!metaResolved.ready || !metaResolved.metaTemplate) {
      return {
        ready: false,
        blocker: metaResolved.whyNotReady || WA_TEMPLATE_UNAVAILABLE_HE,
        recipe,
      };
    }

    const triggerKey = resolvePublishableTrigger(
      template.requiredTriggerKeys,
      ctx.triggers
    );
    if (!triggerKey) {
      return {
        ready: false,
        blocker: "האוטומציה עדיין לא זמינה להפעלה במערכת",
        recipe,
      };
    }
    const pickedId = getWaTemplateId(metaResolved.metaTemplate);
    if (!pickedId) {
      return {
        ready: false,
        blocker: WA_TEMPLATE_UNAVAILABLE_HE,
        recipe,
        resolvedTriggerKey: triggerKey,
      };
    }
    return {
      ready: true,
      recipe,
      resolvedTriggerKey: triggerKey,
      suggestedWaTemplateId: pickedId,
      suggestedWaTemplateName:
        metaResolved.metaTemplateName ||
        String(metaResolved.metaTemplate.name || ""),
      ...emailMeta,
    };
  }

  if (template.engine === "workflow_recipe") {
    if (
      recipe &&
      recipe.canCreate !== false &&
      !recipe.aiLocked &&
      !recipe.comingSoon
    ) {
      return { ready: true, recipe, ...emailMeta };
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
      // Non-WA graph cards still need a publishable trigger; keep precise copy.
      return {
        ready: false,
        blocker: isWhatsAppFacingTemplate(template)
          ? WA_TEMPLATE_UNAVAILABLE_HE
          : "אין טריגר נתמך להפעלת האוטומציה הזו כרגע",
        recipe,
      };
    }
    return { ready: true, recipe, resolvedTriggerKey: triggerKey, ...emailMeta };
  }

  return { ready: false, blocker: "לא ניתן להפעיל תבנית זו", recipe };
}
