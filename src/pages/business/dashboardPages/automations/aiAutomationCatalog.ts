import type {
  AutomationFlowEdge,
  AutomationFlowNode,
} from "../../../../api/automationWorkflowApi";

export type AiConfigFieldDef = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "multiselect" | "boolean" | "textarea";
  defaultValue?: string | number | boolean | string[];
  required?: boolean;
  advanced?: boolean;
};

export type AiBillingMetadata = {
  automationActionBilling: boolean;
  additionalAiProviderBillingImplemented: boolean;
  showAdditionalCostBadge: boolean;
  customerMessage: string;
};

export type AiSupportFlags = {
  backend: boolean;
  builder: boolean;
  publish: boolean;
  runtime: boolean;
  billing: boolean;
  endToEnd: boolean;
};

export type AiCustomerExplanation = {
  startsWhen: string;
  aiDoes: string;
  afterwards: string;
  systems: string[];
  estimatedActions: number;
};

export type AiBuilderBlueprint = {
  nodes: AutomationFlowNode[];
  edges: AutomationFlowEdge[];
};

export type AiAutomationTemplate = {
  templateKey: string;
  recipeKey: string;
  titleHe: string;
  description: string;
  category: "ai";
  icon: string;
  keywords: string[];
  recommendedTrigger: string;
  requiredAiActions: string[];
  optionalActions: string[];
  requiredConfiguration: AiConfigFieldDef[];
  billing: AiBillingMetadata;
  supported: AiSupportFlags;
  publishable: boolean;
  builderBlueprint: AiBuilderBlueprint;
  customerExplanation: AiCustomerExplanation;
  hiddenReason?: string;
  approvalNote?: string;
};

export const AI_BILLING_SAFE_MESSAGE =
  "פעולת AI נספרת כפעולת אוטומציה במסגרת החבילה שלך";

const billing: AiBillingMetadata = {
  automationActionBilling: true,
  additionalAiProviderBillingImplemented: false,
  showAdditionalCostBadge: false,
  customerMessage: AI_BILLING_SAFE_MESSAGE,
};

const config = {
  criteria: {
    key: "criteria",
    label: "מה חשוב לך בדירוג?",
    type: "textarea",
    defaultValue: "התאמה לשירות, דחיפות ופוטנציאל רכישה",
  },
  fieldsHint: {
    key: "fieldsHint",
    label: "אילו נתוני ליד לנתח?",
    type: "textarea",
    defaultValue: "שם, מקור, הודעה, סטטוס ותגיות קיימות",
  },
  scoreMin: {
    key: "scoreMin",
    label: "ציון מינימום",
    type: "number",
    defaultValue: 1,
  },
  scoreMax: {
    key: "scoreMax",
    label: "ציון מקסימום",
    type: "number",
    defaultValue: 10,
  },
  saveAsTag: {
    key: "saveAsTag",
    label: "איפה לשמור את התוצאה (תגית)?",
    type: "text",
    defaultValue: "ai_score",
  },
  categories: {
    key: "categories",
    label: "קטגוריות",
    type: "multiselect",
    defaultValue: ["חם", "בינוני", "קר"],
  },
  maxTags: {
    key: "maxTags",
    label: "מספר תגיות מרבי",
    type: "number",
    defaultValue: 3,
  },
  threshold: {
    key: "threshold",
    label: "סף זיהוי",
    type: "number",
    defaultValue: 7,
  },
  style: {
    key: "style",
    label: "סגנון",
    type: "select",
    defaultValue: "professional",
  },
  channel: {
    key: "channel",
    label: "ערוץ",
    type: "select",
    defaultValue: "whatsapp",
  },
  createTask: {
    key: "createTask",
    label: "ליצור משימה",
    type: "boolean",
    defaultValue: true,
  },
  dueInHours: {
    key: "dueInHours",
    label: "לביצוע תוך שעות",
    type: "number",
    defaultValue: 24,
  },
  lookbackHours: {
    key: "lookbackHours",
    label: "מבט לאחור (שעות)",
    type: "number",
    defaultValue: 24,
  },
  title: {
    key: "title",
    label: "כותרת",
    type: "text",
    defaultValue: "תקציר יומי",
  },
  extraInstructions: {
    key: "extraInstructions",
    label: "הנחיות נוספות ל-AI",
    type: "textarea",
    defaultValue: "",
    advanced: true,
  },
} satisfies Record<string, AiConfigFieldDef>;

const support = (endToEnd: boolean): AiSupportFlags => ({
  backend: endToEnd,
  builder: endToEnd,
  publish: endToEnd,
  runtime: endToEnd,
  billing: endToEnd,
  endToEnd,
});

const DAILY_SCHEDULE_DEFAULTS = {
  frequency: "daily",
  timeOfDay: "08:00",
  timezone: "Asia/Jerusalem",
  hour: 8,
};

type BlueprintInput = {
  actionKey: string;
  actionLabel: string;
  triggerKey: string;
  triggerLabel: string;
  scheduled?: boolean;
};

function blueprint({
  actionKey,
  actionLabel,
  triggerKey,
  triggerLabel,
  scheduled = false,
}: BlueprintInput): AiBuilderBlueprint {
  const resolvedTriggerKey = scheduled ? "scheduled" : triggerKey;
  const nodes: AutomationFlowNode[] = [
    {
      id: "trigger_1",
      type: "trigger",
      position: { x: 80, y: 200 },
      data: scheduled
        ? {
            label: triggerLabel,
            triggerKey: resolvedTriggerKey,
            scheduleDefaults: { ...DAILY_SCHEDULE_DEFAULTS },
            routeCount: 1,
          }
        : {
            label: triggerLabel,
            triggerKey: resolvedTriggerKey,
            routeCount: 1,
          },
    },
    {
      id: "action_ai",
      type: "action",
      position: { x: 360, y: 200 },
      data: { label: actionLabel, actionKey },
    },
    {
      id: "action_notify",
      type: "action",
      position: { x: 640, y: 200 },
      data: { label: "התראה לבעל העסק", actionKey: "notify" },
    },
  ];
  const edges: AutomationFlowEdge[] = [
    {
      id: "trigger-ai",
      source: "trigger_1",
      target: "action_ai",
      sourceHandle: "route_1",
      label: "AI",
    },
    {
      id: "ai-notify",
      source: "action_ai",
      target: "action_notify",
      sourceHandle: "out",
      label: "המשך",
    },
  ];
  return { nodes, edges };
}

function explanationFor(
  triggerKey: string,
  aiDoes: string,
  afterwards = "שולח התראה לבעל העסק"
): AiCustomerExplanation {
  const startsWhen =
    triggerKey === "scheduled"
      ? "כל יום ב-08:00"
      : triggerKey === "lead_status_changed"
        ? "כשמשתנה סטטוס ליד"
        : "כשנכנס ליד חדש";
  return {
    startsWhen,
    aiDoes,
    afterwards,
    systems: ["CRM", "התראות"],
    estimatedActions: 2,
  };
}

type TemplateInput = Omit<
  AiAutomationTemplate,
  | "billing"
  | "builderBlueprint"
  | "publishable"
  | "category"
  | "optionalActions"
> & {
  actionKey: string;
  actionLabel: string;
  triggerLabel: string;
  scheduled?: boolean;
  optionalActions?: string[];
};

const make = ({
  actionKey,
  actionLabel,
  triggerLabel,
  scheduled,
  optionalActions,
  ...item
}: TemplateInput): AiAutomationTemplate => ({
  ...item,
  category: "ai",
  optionalActions: optionalActions ?? ["notify"],
  billing: { ...billing },
  publishable: item.supported.endToEnd,
  builderBlueprint: blueprint({
    actionKey,
    actionLabel,
    triggerKey: item.recommendedTrigger,
    triggerLabel,
    scheduled,
  }),
});

export const AI_AUTOMATION_CATALOG: AiAutomationTemplate[] = [
  make({
    templateKey: "ai_lead_scoring",
    recipeKey: "ai_rank_leads",
    titleHe: "דירוג לידים אוטומטי",
    description: "מדרג לידים חדשים לפי איכות ופוטנציאל.",
    icon: "Gauge",
    keywords: ["AI", "ליד", "לידים", "דירוג", "חם", "תיוג"],
    recommendedTrigger: "new_lead",
    requiredAiActions: ["ai_rank_lead"],
    requiredConfiguration: [
      config.criteria,
      config.fieldsHint,
      config.scoreMin,
      config.scoreMax,
      config.saveAsTag,
      config.extraInstructions,
    ],
    supported: support(true),
    customerExplanation: explanationFor(
      "new_lead",
      "מדרג את הליד ומציע תגית תוצאה"
    ),
    actionKey: "ai_rank_lead",
    actionLabel: "AI — דירוג ליד",
    triggerLabel: "ליד חדש",
  }),
  make({
    templateKey: "ai_lead_classify",
    recipeKey: "ai_classify_lead",
    titleHe: "סיווג ליד אוטומטי",
    description: "מסווג לידים חדשים לקטגוריות.",
    icon: "Tags",
    keywords: ["AI", "ליד", "לידים", "סיווג", "תיוג", "חם"],
    recommendedTrigger: "new_lead",
    requiredAiActions: ["ai_classify_lead"],
    requiredConfiguration: [
      config.categories,
      config.criteria,
      config.fieldsHint,
      config.saveAsTag,
      config.extraInstructions,
    ],
    supported: support(true),
    customerExplanation: explanationFor("new_lead", "מסווג את הליד לקטגוריה"),
    actionKey: "ai_classify_lead",
    actionLabel: "AI — סיווג ליד",
    triggerLabel: "ליד חדש",
  }),
  make({
    templateKey: "ai_lead_auto_tag",
    recipeKey: "ai_auto_tag",
    titleHe: "תיוג אוטומטי של לידים",
    description: "מוסיף תגיות רלוונטיות.",
    icon: "Tag",
    keywords: ["AI", "ליד", "תיוג", "תגיות", "חם"],
    recommendedTrigger: "new_lead",
    requiredAiActions: ["ai_auto_tag"],
    requiredConfiguration: [
      config.maxTags,
      config.categories,
      config.fieldsHint,
      config.extraInstructions,
    ],
    supported: support(true),
    customerExplanation: explanationFor("new_lead", "בוחר תגיות מתאימות לליד"),
    actionKey: "ai_auto_tag",
    actionLabel: "AI — תיוג ליד",
    triggerLabel: "ליד חדש",
  }),
  make({
    templateKey: "ai_hot_lead",
    recipeKey: "ai_hot_lead",
    titleHe: "זיהוי לידים חמים",
    description: "מזהה לידים הדורשים טיפול מהיר.",
    icon: "Flame",
    keywords: ["AI", "ליד", "חם", "דחיפות", "תיוג"],
    recommendedTrigger: "new_lead",
    requiredAiActions: ["ai_detect_hot_lead"],
    requiredConfiguration: [
      config.threshold,
      config.criteria,
      config.fieldsHint,
      config.extraInstructions,
    ],
    supported: support(true),
    customerExplanation: explanationFor(
      "new_lead",
      "מזהה אם הליד חם ודורש טיפול"
    ),
    actionKey: "ai_detect_hot_lead",
    actionLabel: "AI — זיהוי ליד חם",
    triggerLabel: "ליד חדש",
  }),
  make({
    templateKey: "ai_lead_brief",
    recipeKey: "ai_lead_brief",
    titleHe: "סיכום ליד לפני שיחת מכירה",
    description: "מכין תקציר ליד.",
    icon: "FileText",
    keywords: ["AI", "ליד", "סיכום", "תקציר", "שיחה"],
    recommendedTrigger: "new_lead",
    requiredAiActions: ["ai_lead_brief"],
    requiredConfiguration: [
      config.style,
      config.fieldsHint,
      config.extraInstructions,
    ],
    supported: support(true),
    customerExplanation: explanationFor(
      "new_lead",
      "מכין תקציר קצר לפני שיחה"
    ),
    actionKey: "ai_lead_brief",
    actionLabel: "AI — תקציר ליד",
    triggerLabel: "ליד חדש",
  }),
  make({
    templateKey: "ai_followup_draft",
    recipeKey: "ai_followup_draft",
    titleHe: "ניסוח Follow-up",
    description: "מנסח הודעת המשך לטיוטה בלבד.",
    icon: "MessageSquare",
    keywords: ["AI", "ליד", "follow-up", "תשובה", "טיוטה", "שיחה"],
    recommendedTrigger: "lead_status_changed",
    requiredAiActions: ["ai_draft_followup"],
    requiredConfiguration: [
      config.style,
      config.channel,
      config.extraInstructions,
    ],
    supported: support(true),
    approvalNote: "הטיוטה דורשת אישור אנושי לפני שליחה.",
    customerExplanation: explanationFor(
      "lead_status_changed",
      "מנסח טיוטת Follow-up לאישור",
      "שומר טיוטה ושולח התראה לאישור"
    ),
    actionKey: "ai_draft_followup",
    actionLabel: "AI — טיוטת Follow-up",
    triggerLabel: "שינוי סטטוס ליד",
  }),
  make({
    templateKey: "ai_email_draft",
    recipeKey: "ai_email_draft",
    titleHe: "ניסוח מייל",
    description: "מנסח מייל לטיוטה בלבד.",
    icon: "Mail",
    keywords: ["AI", "ליד", "מייל", "תשובה", "טיוטה"],
    recommendedTrigger: "lead_status_changed",
    requiredAiActions: ["ai_draft_email"],
    requiredConfiguration: [config.style, config.extraInstructions],
    supported: support(true),
    approvalNote: "הטיוטה דורשת אישור אנושי לפני שליחה.",
    customerExplanation: explanationFor(
      "lead_status_changed",
      "מנסח טיוטת מייל לאישור",
      "שומר טיוטה ושולח התראה לאישור"
    ),
    actionKey: "ai_draft_email",
    actionLabel: "AI — טיוטת מייל",
    triggerLabel: "שינוי סטטוס ליד",
  }),
  make({
    templateKey: "ai_next_action",
    recipeKey: "ai_next_action",
    titleHe: "הצעת הפעולה הבאה",
    description: "מציע את הצעד הבא.",
    icon: "ListChecks",
    keywords: ["AI", "ליד", "משימה", "פעולה", "תשובה"],
    recommendedTrigger: "new_lead",
    requiredAiActions: ["ai_suggest_next_action"],
    requiredConfiguration: [
      config.createTask,
      config.dueInHours,
      config.extraInstructions,
    ],
    supported: support(true),
    customerExplanation: explanationFor(
      "new_lead",
      "מציע את הפעולה הבאה ומשימה"
    ),
    actionKey: "ai_suggest_next_action",
    actionLabel: "AI — הצעת פעולה",
    triggerLabel: "ליד חדש",
  }),
  make({
    templateKey: "ai_daily_leads_digest",
    recipeKey: "ai_daily_leads_digest",
    titleHe: "תקציר יומי לידים",
    description: "מסכם לידים מהיום.",
    icon: "CalendarDays",
    keywords: ["AI", "ליד", "סיכום", "תקציר", "יומי"],
    recommendedTrigger: "scheduled",
    requiredAiActions: ["ai_daily_leads_digest"],
    requiredConfiguration: [
      config.lookbackHours,
      config.title,
      config.extraInstructions,
    ],
    supported: support(true),
    customerExplanation: explanationFor(
      "scheduled",
      "מסכם לידים מהיממה האחרונה",
      "שולח התראה עם התקציר"
    ),
    actionKey: "ai_daily_leads_digest",
    actionLabel: "AI — תקציר לידים יומי",
    triggerLabel: "לוח זמנים יומי",
    scheduled: true,
  }),
  make({
    templateKey: "ai_daily_agenda_digest",
    recipeKey: "ai_daily_agenda_digest",
    titleHe: "תקציר יומי משימות/פגישות",
    description: "מסכם משימות ופגישות.",
    icon: "CalendarCheck",
    keywords: ["AI", "משימה", "סיכום", "תקציר", "פגישות", "יומי"],
    recommendedTrigger: "scheduled",
    requiredAiActions: ["ai_daily_agenda_digest"],
    requiredConfiguration: [
      config.lookbackHours,
      config.title,
      config.extraInstructions,
    ],
    supported: support(true),
    customerExplanation: explanationFor(
      "scheduled",
      "מסכם משימות ופגישות להיום",
      "שולח התראה עם התקציר"
    ),
    actionKey: "ai_daily_agenda_digest",
    actionLabel: "AI — תקציר אג׳נדה יומי",
    triggerLabel: "לוח זמנים יומי",
    scheduled: true,
  }),
];

const hiddenTemplates: Array<
  [string, string, string, string, string[]]
> = [
  [
    "ai_summarize_calls",
    "ai_summarize_calls",
    "ai_summarize_call",
    "סיכום שיחות",
    ["AI", "סיכום", "שיחה"],
  ],
  [
    "ai_auto_reply",
    "ai_auto_reply",
    "ai_draft_reply",
    "מענה אוטומטי",
    ["AI", "תשובה", "שיחה"],
  ],
  [
    "ai_risk_lead",
    "ai_risk_lead",
    "ai_detect_risk_lead",
    "זיהוי ליד בסיכון",
    ["AI", "ליד"],
  ],
  [
    "ai_campaign_change",
    "ai_campaign_change",
    "ai_campaign_recommend",
    "שינוי קמפיין",
    ["AI", "קמפיין"],
  ],
  [
    "ai_tasks_from_chat",
    "ai_tasks_from_chat",
    "ai_tasks_from_chat",
    "יצירת משימות מצ'אט",
    ["AI", "משימה", "שיחה"],
  ],
  [
    "ai_intent_detect",
    "ai_intent_detect",
    "ai_intent_detect",
    "זיהוי כוונה",
    ["AI", "ליד"],
  ],
  [
    "ai_extract_message",
    "ai_extract_message",
    "ai_extract_message",
    "חילוץ מידע מהודעה",
    ["AI", "שיחה"],
  ],
  [
    "ai_objections",
    "ai_objections",
    "ai_objections",
    "זיהוי התנגדויות",
    ["AI", "שיחה"],
  ],
  [
    "ai_sentiment",
    "ai_sentiment",
    "ai_sentiment",
    "ניתוח סנטימנט",
    ["AI", "שיחה"],
  ],
  [
    "ai_crm_cleanup",
    "ai_crm_cleanup",
    "ai_crm_cleanup",
    "ניקוי CRM",
    ["AI", "ליד"],
  ],
  [
    "ai_task_prioritization",
    "ai_task_prioritization",
    "ai_task_prioritization",
    "תעדוף משימות",
    ["AI", "משימה"],
  ],
];

AI_AUTOMATION_CATALOG.push(
  ...hiddenTemplates.map(
    ([templateKey, recipeKey, actionKey, titleHe, keywords]) =>
      make({
        templateKey,
        recipeKey,
        titleHe,
        description: "תבנית AI שעדיין אינה זמינה לפרסום מקצה לקצה.",
        icon: "Sparkles",
        keywords,
        recommendedTrigger: "new_lead",
        requiredAiActions: [actionKey],
        optionalActions: [],
        requiredConfiguration: [config.extraInstructions],
        supported: support(false),
        hiddenReason: "הפעולה אינה נתמכת עדיין מקצה לקצה.",
        customerExplanation: explanationFor("new_lead", titleHe),
        actionKey,
        actionLabel: `AI — ${titleHe}`,
        triggerLabel: "ליד חדש",
      })
  )
);

export const SUPPORTED_AI_ACTION_KEYS = new Set(
  AI_AUTOMATION_CATALOG.filter(
    (template) => template.supported.endToEnd === true
  ).flatMap((template) => template.requiredAiActions)
);

export const isSupportedAiActionKey = (actionKey: string): boolean =>
  SUPPORTED_AI_ACTION_KEYS.has(actionKey);

export const listSupportedAiTemplates = (): AiAutomationTemplate[] =>
  AI_AUTOMATION_CATALOG.filter(
    (template) => template.supported.endToEnd === true
  );

export const getAiTemplateByKey = (
  key: string
): AiAutomationTemplate | undefined =>
  AI_AUTOMATION_CATALOG.find(
    (template) => template.templateKey === key || template.recipeKey === key
  );

/** Discovery/entry URL into Templates (AI filter + highlight). Does not activate. */
export const buildAiTemplateDiscoveryHref = (
  businessId: string,
  templateOrKey: AiAutomationTemplate | string
): string => {
  const template =
    typeof templateOrKey === "string"
      ? getAiTemplateByKey(templateOrKey)
      : templateOrKey;
  const highlightKey = template?.templateKey || String(templateOrKey || "").trim();
  const params = new URLSearchParams({
    focus: "ai",
    highlight: highlightKey,
  });
  return `/business/${businessId}/dashboard/automations/templates?${params.toString()}`;
};

export const searchAiTemplates = (query: string): AiAutomationTemplate[] => {
  const normalized = query.trim().toLocaleLowerCase("he-IL");
  if (!normalized) return listSupportedAiTemplates();
  return listSupportedAiTemplates().filter((template) =>
    [
      template.templateKey,
      template.recipeKey,
      template.titleHe,
      template.description,
      ...template.keywords,
    ].some((value) => value.toLocaleLowerCase("he-IL").includes(normalized))
  );
};

export const buildAiTemplateGraph = (
  template: AiAutomationTemplate
): AiBuilderBlueprint => ({
  nodes: template.builderBlueprint.nodes,
  edges: template.builderBlueprint.edges,
});
