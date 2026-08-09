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
  // WhatsApp simple engine
  whatsappTrigger?: WhatsAppAutomationTrigger;
  hoursBefore?: number;
  delayMinutes?: number;
  delayHours?: number;
  delayDays?: number;
  waCategory?: WhatsAppTemplate["category"];
  waHints?: string[];
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
};

function waEdgeGraph(opts: {
  triggerKey: string;
  triggerLabel: string;
  actionLabel: string;
  waTemplateId?: string;
  hoursBefore?: number;
  routeCount?: number;
  extraActions?: Array<{
    actionKey: string;
    label: string;
    defaults?: Record<string, unknown>;
  }>;
}) {
  const actions = [
    {
      actionKey: "whatsapp_template",
      label: opts.actionLabel,
      defaults: { templateId: opts.waTemplateId || "" },
    },
    ...(opts.extraActions || []),
  ];
  const routeCount = actions.length;
  const nodes: AutomationFlowNode[] = [
    {
      id: "trigger_1",
      type: "trigger",
      position: { x: 80, y: 160 },
      data: {
        label: opts.triggerLabel,
        triggerKey: opts.triggerKey,
        routeCount,
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
      position: { x: 420, y: 80 + index * 140 },
      data: {
        label: action.label,
        actionKey: action.actionKey,
        templateId: "",
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

/**
 * Best working templates only — engines that can actually activate in BizUply.
 * WhatsApp simple = proven production path. Workflow = only with publishable triggers.
 */
export const WORKING_TEMPLATES: WorkingTemplate[] = [
  {
    key: "wa_new_lead_welcome",
    rank: 1,
    name: "ליד חדש → הודעת פתיחה",
    description:
      "כשנכנס ליד ל-CRM נשלחת הודעת WhatsApp אוטומטית (מופעל מיד).",
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
    key: "wa_appointment_reminder_1_day",
    rank: 2,
    name: "תזכורת פגישה — יום לפני",
    description: "יום לפני הפגישה נשלחת תזכורת WhatsApp ללקוח (מופעל מיד).",
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
    description: "48 שעות לפני הפגישה נשלחת תזכורת WhatsApp (מופעל מיד).",
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
    key: "wa_appointment_reminder_2_hours",
    rank: 4,
    name: "תזכורת פגישה — שעתיים לפני",
    description: "שעתיים לפני הפגישה נשלחת תזכורת WhatsApp (מופעל מיד).",
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
    key: "wa_appointment_thanks",
    rank: 5,
    name: "תודה אחרי פגישה",
    description: "אחרי פגישה נשלחת הודעת תודה ב-WhatsApp (מופעל מיד).",
    triggerLabel: "פגישה הסתיימה",
    resultLabels: ["הודעת תודה"],
    categories: ["appointments", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "appointment_thanks",
    waCategory: "custom",
    waHints: ["thanks", "thank", "תודה"],
  },
  {
    key: "wa_lead_no_response",
    rank: 6,
    name: "ליד שלא נענה → מעקב",
    description: "אם אין מענה — נשלח פולואפ WhatsApp אוטומטי (מופעל מיד).",
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
    key: "wa_new_client_welcome",
    rank: 7,
    name: "לקוח חדש → ברוכים הבאים",
    description: "לקוח חדש ב-CRM מקבל הודעת פתיחה ב-WhatsApp (מופעל מיד).",
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
    key: "wa_appointment_review",
    rank: 8,
    name: "בקשת ביקורת אחרי פגישה",
    description: "לאחר הפגישה נשלחת בקשת ביקורת ב-WhatsApp (מופעל מיד).",
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
    key: "wa_lead_followup_2",
    rank: 9,
    name: "פולואפ שני לליד",
    description: "מעקב נוסף ללידים שלא הומרו (מופעל מיד).",
    triggerLabel: "ליד ללא המרה",
    resultLabels: ["פולואפ שני"],
    categories: ["leads", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "lead_followup_2",
    delayDays: 3,
    waCategory: "follow_up",
    waHints: ["follow", "מעקב"],
  },
  {
    key: "wa_inactive_client",
    rank: 10,
    name: "לקוח לא פעיל → נגיעה",
    description: "לקוחות לא פעילים מקבלים הודעת נגיעה (מופעל מיד).",
    triggerLabel: "לקוח לא פעיל",
    resultLabels: ["הודעת נגיעה"],
    categories: ["crm", "whatsapp"],
    engine: "whatsapp_simple",
    whatsappTrigger: "inactive_client",
    delayDays: 30,
    waCategory: "follow_up",
    waHints: ["inactive", "נגיעה", "follow"],
  },
  {
    key: "wf_lead_multi",
    rank: 11,
    name: "ליד חדש → WhatsApp + משימה + התראה",
    description:
      "אוטומציית זרימה: ליד חדש מפעיל שלוש תוצאות יחד. נבחרת תבנית WhatsApp ומתפרסמת.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["WhatsApp", "משימה", "התראה"],
    categories: ["leads", "crm", "whatsapp"],
    engine: "workflow_recipe",
    recipeKey: "lead_multi_route",
    requiresWaTemplate: true,
    waCategory: "welcome",
    waHints: ["welcome", "new_lead"],
    requiredTriggerKeys: [
      "crm_lead_created",
      "lead_created",
      "new_lead",
      "lead_new",
    ],
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
    key: "wf_lead_email_task",
    rank: 12,
    name: "ליד חדש → אימייל + משימה",
    description:
      "אוטומציית זרימה: ליד חדש מקבל אימייל Bizuply ומשימת מעקב — בלי חיבור Gmail.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["אימייל Bizuply", "משימת מעקב"],
    categories: ["leads", "email", "crm"],
    engine: "workflow_graph",
    requiredTriggerKeys: [
      "crm_lead_created",
      "lead_created",
      "new_lead",
      "lead_new",
    ],
    buildGraph: ({ triggerKey }) => {
      const nodes: AutomationFlowNode[] = [
        {
          id: "trigger_1",
          type: "trigger",
          position: { x: 80, y: 160 },
          data: {
            label: "ליד חדש ב-CRM",
            triggerKey,
            routeCount: 2,
          },
        },
        {
          id: "action_1",
          type: "action",
          position: { x: 420, y: 80 },
          data: {
            label: "אימייל לליד",
            actionKey: "send_email",
            recipientType: "lead_email",
            subject: "שמחים שפנית אלינו",
          },
        },
        {
          id: "action_2",
          type: "action",
          position: { x: 420, y: 240 },
          data: {
            label: "משימת מעקב",
            actionKey: "create_task",
          },
        },
      ];
      const edges: AutomationFlowEdge[] = [
        {
          id: "e1",
          source: "trigger_1",
          target: "action_1",
          sourceHandle: "route_1",
          label: "תוצאה",
        },
        {
          id: "e2",
          source: "trigger_1",
          target: "action_2",
          sourceHandle: "route_2",
          label: "תוצאה",
        },
      ];
      return { nodes, edges };
    },
  },
  {
    key: "wf_appointment_email",
    rank: 13,
    name: "פגישה חדשה → אימייל אישור",
    description: "אוטומציית זרימה: פגישה חדשה שולחת אימייל אישור ללקוח.",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אימייל אישור"],
    categories: ["appointments", "email"],
    engine: "workflow_graph",
    requiredTriggerKeys: ["appointment_created"],
    buildGraph: ({ triggerKey }) => ({
      nodes: [
        {
          id: "trigger_1",
          type: "trigger",
          position: { x: 80, y: 160 },
          data: {
            label: "פגישה חדשה",
            triggerKey,
            routeCount: 1,
          },
        },
        {
          id: "action_1",
          type: "action",
          position: { x: 420, y: 160 },
          data: {
            label: "אימייל אישור פגישה",
            actionKey: "send_email",
            recipientType: "appointment_customer_email",
            subject: "אישור פגישה",
          },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "trigger_1",
          target: "action_1",
          sourceHandle: "route_1",
          label: "תוצאה",
        },
      ],
    }),
  },
  {
    key: "wf_appointment_gcal",
    rank: 14,
    name: "פגישה חדשה → Google Calendar",
    description:
      "אוטומציית זרימה: פגישה חדשה יוצרת אירוע ביומן (דורש חיבור Google Calendar).",
    triggerLabel: "פגישה חדשה",
    resultLabels: ["אירוע ביומן Google"],
    categories: ["appointments"],
    engine: "workflow_graph",
    requiredTriggerKeys: ["appointment_created"],
    requiresCalendar: true,
    buildGraph: ({ triggerKey }) => ({
      nodes: [
        {
          id: "trigger_1",
          type: "trigger",
          position: { x: 80, y: 160 },
          data: {
            label: "פגישה חדשה",
            triggerKey,
            routeCount: 1,
          },
        },
        {
          id: "action_1",
          type: "action",
          position: { x: 420, y: 160 },
          data: {
            label: "יצירת אירוע ביומן",
            actionKey: "google_calendar_create_event",
            title: "פגישה עם {{appointment.clientName}}",
            calendarId: "primary",
          },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "trigger_1",
          target: "action_1",
          sourceHandle: "route_1",
          label: "תוצאה",
        },
      ],
    }),
  },
  {
    key: "wf_ai_rank_leads",
    rank: 15,
    name: "AI — דירוג ליד חדש",
    description:
      "כשנכנס ליד: AI מדרג לפי סיכוי/דחיפות ושולח התראה. דורש תוסף AI פעיל.",
    triggerLabel: "ליד חדש ב-CRM",
    resultLabels: ["דירוג AI", "התראה"],
    categories: ["ai", "leads"],
    engine: "workflow_recipe",
    recipeKey: "ai_rank_leads",
    requiresAiEntitlement: true,
    requiredTriggerKeys: [
      "crm_lead_created",
      "lead_created",
      "new_lead",
      "lead_new",
    ],
  },
  {
    key: "wf_ai_summarize",
    rank: 16,
    name: "AI — סיכום פגישה",
    description: "אחרי פגישה: AI מסכם ומתעד. דורש תוסף AI פעיל.",
    triggerLabel: "פגישה",
    resultLabels: ["סיכום AI"],
    categories: ["ai", "appointments"],
    engine: "workflow_recipe",
    recipeKey: "ai_summarize_calls",
    requiresAiEntitlement: true,
  },
  {
    key: "wf_ai_draft_reply",
    rank: 17,
    name: "AI — תשובת WhatsApp מוכנה",
    description: "בהודעה נכנסת: AI מנסח תשובה מוכנה לשליחה. דורש תוסף AI פעיל.",
    triggerLabel: "הודעת WhatsApp",
    resultLabels: ["תשובה מוכנה AI"],
    categories: ["ai", "whatsapp"],
    engine: "workflow_recipe",
    recipeKey: "ai_auto_reply",
    requiresAiEntitlement: true,
  },
  {
    key: "wf_ai_risk",
    rank: 18,
    name: "AI — ליד בסיכון",
    description: "AI מזהה ליד שמתקרר ומתריע. דורש תוסף AI פעיל.",
    triggerLabel: "פולואפ לליד",
    resultLabels: ["התראת סיכון"],
    categories: ["ai", "leads"],
    engine: "workflow_recipe",
    recipeKey: "ai_risk_lead",
    requiresAiEntitlement: true,
  },
  {
    key: "wf_ai_campaign",
    rank: 19,
    name: "AI — המלצת קמפיין",
    description: "בשינוי סטטוס ליד: AI ממליץ על קמפיין. דורש תוסף AI פעיל.",
    triggerLabel: "שינוי סטטוס ליד",
    resultLabels: ["המלצת קמפיין"],
    categories: ["ai", "leads", "sales"],
    engine: "workflow_recipe",
    recipeKey: "ai_campaign_change",
    requiresAiEntitlement: true,
  },
  {
    key: "wf_ai_tasks",
    rank: 20,
    name: "AI — משימות משיחה",
    description: "אחרי פגישה: AI מחלץ משימות ל-CRM. דורש תוסף AI פעיל.",
    triggerLabel: "פגישה",
    resultLabels: ["משימות AI"],
    categories: ["ai", "crm", "appointments"],
    engine: "workflow_recipe",
    recipeKey: "ai_tasks_from_chat",
    requiresAiEntitlement: true,
  },
];

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
  waTemplates: Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>;
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

export function listUsableWaTemplates(
  templates: Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>
): Array<WhatsAppTemplate | ApprovedWhatsAppTemplate> {
  return (templates || []).filter((tpl) => {
    const id = String((tpl as { _id?: string })._id || "");
    if (!id) return false;
    const status = String((tpl as WhatsAppTemplate).status || "").toLowerCase();
    const meta = String(
      (tpl as WhatsAppTemplate).metaStatus ||
        (tpl as ApprovedWhatsAppTemplate).metaStatus ||
        ""
    ).toLowerCase();
    if (status === "archived" || status === "draft") return false;
    if (
      meta === "rejected" ||
      meta === "paused" ||
      meta === "disabled" ||
      meta === "pending" ||
      meta === "in_appeal"
    ) {
      return false;
    }
    return true;
  });
}

export function pickBestWaTemplate(
  templates: Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>,
  opts: { category?: string; hints?: string[] }
): { id: string; name: string } | null {
  const usable = listUsableWaTemplates(templates);
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
    if (opts.category && String(tpl.category || "") === opts.category) {
      points += 4;
    }
    for (const hint of hints) {
      if (hay.includes(hint)) points += 3;
    }
    return points;
  };

  const ranked = [...usable].sort((a, b) => score(b) - score(a));
  const chosen = ranked[0];
  const id = String((chosen as { _id?: string })._id || "");
  if (!id) return null;
  return {
    id,
    name: String(chosen.name || chosen.key || "תבנית"),
  };
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
  if (template.engine === "whatsapp_simple") {
    const picked = pickBestWaTemplate(ctx.waTemplates, {
      category: template.waCategory,
      hints: template.waHints,
    });
    if (!picked) {
      return {
        ready: false,
        blocker: "חסרה תבנית WhatsApp מאושרת — צרו/אשרו תבנית ואז הפעילו",
      };
    }
    return {
      ready: true,
      suggestedWaTemplateId: picked.id,
      suggestedWaTemplateName: picked.name,
    };
  }

  if (template.requiresCalendar && !ctx.calendarConnected) {
    return {
      ready: false,
      blocker: "חברו Google Calendar במסך החיבורים כדי להפעיל",
    };
  }

  if (template.requiresAiEntitlement) {
    const recipe = ctx.recipes.find((r) => r.key === template.recipeKey);
    const recipeOk =
      Boolean(recipe) &&
      recipe?.canCreate !== false &&
      !recipe?.aiLocked &&
      !recipe?.comingSoon;
    if (!ctx.aiEntitled || !recipeOk) {
      return {
        ready: false,
        blocker: "דורש תוסף אוטומציות AI פעיל ומתכון זמין בשרת",
        recipe,
      };
    }
  }

  // WhatsApp-bearing workflows must use a publishable trigger + WA template
  // so activation can bake templateId into the graph (recipe-only create
  // cannot inject the chosen template reliably).
  if (template.requiresWaTemplate && template.buildGraph) {
    const recipe = ctx.recipes.find((r) => r.key === template.recipeKey);
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
    });
    if (!picked) {
      return {
        ready: false,
        blocker: "חסרה תבנית WhatsApp מאושרת לתוצאת ההודעה",
        recipe,
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
    const recipe = ctx.recipes.find((r) => r.key === template.recipeKey);
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
    const recipe = ctx.recipes.find((r) => r.key === template.recipeKey);
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

  return { ready: false, blocker: "לא ניתן להפעיל תבנית זו" };
}
