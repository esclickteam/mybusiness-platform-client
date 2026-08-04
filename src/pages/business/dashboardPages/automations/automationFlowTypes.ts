import type { AutomationNodeType } from "../../../../api/automationWorkflowApi";

export type { AutomationNodeType };

export type PaletteFilter =
  | "all"
  | "trigger"
  | "condition"
  | "router"
  | "delay"
  | "action";

export type PaletteItem = {
  type: AutomationNodeType;
  key: string;
  label: string;
  description: string;
  color: string;
  defaults: Record<string, unknown>;
  group: "triggers" | "flow" | "actions";
  filter: Exclude<PaletteFilter, "all">;
  supported?: boolean;
  comingSoon?: boolean;
};

export type AutomationTriggerOption = {
  key: string;
  label: string;
  description?: string;
  category?: string;
  status?: string;
  isSupported: boolean;
  isPublishable: boolean;
  requiredConnection?: string | null;
  comingSoon?: boolean;
};

export const TRIGGER_CATEGORY_LABELS: Record<string, string> = {
  crm: "CRM ולידים",
  appointments: "פגישות",
  website: "אתר וטפסים",
  store: "חנות ותשלומים",
  manual: "ידני",
  coming_soon: "בקרוב",
};

export function triggerOptionFromCatalog(row: {
  key: string;
  label: string;
  description?: string;
  category?: string;
  status?: string;
  isSupported?: boolean;
  isPublishable?: boolean;
  requiredConnection?: string | null;
}): AutomationTriggerOption {
  const isSupported = Boolean(row.isSupported);
  const isPublishable = Boolean(row.isPublishable);
  return {
    key: String(row.key),
    label: String(row.label || row.key),
    description: String(row.description || ""),
    category: String(row.category || "crm"),
    status: String(row.status || (isPublishable ? "active" : "coming_soon")),
    isSupported,
    isPublishable,
    requiredConnection: row.requiredConnection || null,
    comingSoon: !isPublishable,
  };
}

export const ACTION_OPTIONS = [
  { value: "create_task", label: "יצירת משימה ב-CRM", supported: true },
  { value: "update_lead_status", label: "עדכון סטטוס ליד", supported: true },
  { value: "update_status", label: "עדכון סטטוס ליד", supported: true },
  { value: "assign_owner", label: "שיוך לנציג", supported: true },
  { value: "add_tag", label: "הוספת תגית", supported: true },
  { value: "create_crm_note", label: "יצירת הערה ב-CRM", supported: true },
  { value: "send_whatsapp", label: "שליחת תבנית וואטסאפ", supported: true },
  { value: "whatsapp_template", label: "שליחת תבנית וואטסאפ", supported: true },
  { value: "send_email", label: "שליחת אימייל", supported: true },
  { value: "send_gmail", label: "שליחת מייל דרך Gmail", supported: true },
  { value: "internal_notification", label: "התראה פנימית", supported: true },
  { value: "notify", label: "התראה פנימית", supported: true },
  { value: "delay", label: "המתנה", supported: true },
  { value: "webhook", label: "קריאת Webhook", supported: true },
  { value: "stop", label: "עצירת זרימה", supported: true },
  { value: "create_appointment", label: "יצירת פגישה", supported: false, comingSoon: true },
  { value: "ai_rank_lead", label: "AI · דירוג ליד", supported: false, comingSoon: true },
] as const;

export const CONDITION_OPTIONS = [
  { value: "no_response", label: "לא נוצר קשר" },
  { value: "status_is", label: "סטטוס מסוים" },
  { value: "has_appointment", label: "יש פגישה קרובה" },
  { value: "has_tag", label: "יש תגית" },
  { value: "source_is", label: "מקור ליד מסוים" },
  { value: "business_hours", label: "בתוך שעות פעילות" },
  { value: "replied", label: "הלקוח השיב" },
  { value: "amount_above", label: "סכום מעל X" },
] as const;

export const DELAY_UNITS = [
  { value: "minutes", label: "דקות" },
  { value: "hours", label: "שעות" },
  { value: "days", label: "ימים" },
] as const;

export const FILTER_CHIPS: Array<{ key: PaletteFilter; label: string }> = [
  { key: "all", label: "הכל" },
  { key: "trigger", label: "טריגר" },
  { key: "condition", label: "תנאי" },
  { key: "router", label: "ניתוב" },
  { key: "delay", label: "המתנה" },
  { key: "action", label: "פעולה" },
];

function triggerItem(
  key: string,
  label: string,
  description: string,
  routeCount = 2,
  supported = true
): PaletteItem {
  return {
    type: "trigger",
    key,
    group: "triggers",
    filter: "trigger",
    label: `טריגר · ${label}`,
    description,
    color: "#7c3aed",
    defaults: { label, triggerKey: key, routeCount },
    supported,
    comingSoon: !supported,
  };
}

function actionItem(key: string, label: string, description: string, supported = true): PaletteItem {
  return {
    type: "action",
    key,
    group: "actions",
    filter: "action",
    label: `פעולה · ${label}`,
    description,
    color: "#059669",
    defaults: { label, actionKey: key, templateId: "" },
    supported,
    comingSoon: !supported,
  };
}

function conditionItem(
  key: string,
  label: string,
  description: string
): PaletteItem {
  return {
    type: "condition",
    key,
    group: "flow",
    filter: "condition",
    label: `תנאי · ${label}`,
    description,
    color: "#d97706",
    defaults: { label, conditionKey: key },
  };
}

/** Flow + action modules only. Triggers are loaded from the server catalog. */
const RAW_FLOW_ACTION_PALETTE: PaletteItem[] = [
  {
    type: "router",
    key: "router",
    group: "flow",
    filter: "router",
    label: "ניתוב · פיצול מסלולים",
    description: "מפצל ל־2–6 תוצאות במקביל",
    color: "#db2777",
    defaults: {
      label: "פיצול מסלולים",
      pathCount: 3,
      paths: [
        { id: "path_1", label: "מסלול 1" },
        { id: "path_2", label: "מסלול 2" },
        { id: "path_3", label: "מסלול 3" },
      ],
    },
  },
  conditionItem("no_response", "לא נוצר קשר", "כן/לא לפי מענה"),
  conditionItem("status_is", "סטטוס מסוים", "בודק סטטוס ליד"),
  conditionItem("has_appointment", "יש פגישה", "האם יש תור קרוב"),
  conditionItem("has_tag", "יש תגית", "לפי תגית על הליד/לקוח"),
  conditionItem("source_is", "מקור ליד", "Meta / אתר / וואטסאפ"),
  conditionItem("business_hours", "שעות פעילות", "בתוך/מחוץ לשעות"),
  conditionItem("replied", "הלקוח השיב", "האם הייתה תשובה"),
  conditionItem("amount_above", "סכום מעל X", "לפי ערך עסקה"),
  {
    type: "delay",
    key: "wait",
    group: "flow",
    filter: "delay",
    label: "המתנה",
    description: "ממתין ואז ממשיך / מתפצל",
    color: "#0891b2",
    defaults: { label: "המתנה", amount: 10, unit: "minutes" },
  },

  actionItem("whatsapp_template", "וואטסאפ", "שולח תבנית הודעה"),
  actionItem("create_task", "משימה", "יוצר משימת מעקב ב-CRM"),
  actionItem("notify", "התראה", "התראה לבעל העסק"),
  actionItem("update_status", "סטטוס", "מעדכן סטטוס ליד"),
  actionItem("assign_owner", "שיוך נציג", "משייך לאיש צוות"),
  actionItem("add_tag", "תגית", "מוסיף תגית לליד/לקוח"),
  actionItem("send_email", "אימייל", "שולח מייל ללקוח"),
  actionItem("send_gmail", "Gmail", "Gmail — שליחת מייל"),
  actionItem("create_appointment", "קביעת פגישה", "יוצר תור ביומן"),
  actionItem("webhook", "Webhook", "שולח נתונים למערכת חיצונית"),
  actionItem("ai_rank_lead", "AI דירוג ליד", "מדרג ליד לפי סיכוי ודחיפות"),
  actionItem("ai_summarize_call", "AI סיכום שיחה", "מסכם שיחה/פגישה"),
  actionItem("ai_draft_reply", "AI ניסוח תשובה", "מנסח תשובה מהקשר"),
  actionItem("ai_detect_risk_lead", "AI ליד בסיכון", "מזהה ליד שמתקרר"),
  actionItem("ai_campaign_recommend", "AI קמפיין", "ממליץ על שינוי קמפיין"),
  actionItem("ai_tasks_from_chat", "AI משימות משיחה", "יוצר משימות מתוכן שיחה"),
];

function applyActionSupport(item: PaletteItem): PaletteItem {
  if (item.type !== "action") {
    return {
      ...item,
      supported: item.supported !== false,
      comingSoon: item.supported === false,
    };
  }
  const option = ACTION_OPTIONS.find((entry) => entry.value === item.key);
  const supported = option ? option.supported : item.supported !== false;
  return { ...item, supported, comingSoon: !supported };
}

export const FLOW_ACTION_PALETTE: PaletteItem[] =
  RAW_FLOW_ACTION_PALETTE.map(applyActionSupport);

/** Non-trigger palette (flow/actions). Use buildPaletteWithTriggers for full list. */
export const PALETTE: PaletteItem[] = FLOW_ACTION_PALETTE;

export function buildTriggerPaletteItems(
  triggers: AutomationTriggerOption[]
): PaletteItem[] {
  return triggers.map((trigger) =>
    triggerItem(
      trigger.key,
      trigger.label,
      trigger.description || "",
      2,
      trigger.isPublishable
    )
  );
}

export function buildPaletteWithTriggers(
  triggers: AutomationTriggerOption[]
): PaletteItem[] {
  return [...buildTriggerPaletteItems(triggers), ...FLOW_ACTION_PALETTE];
}

export function findTriggerOption(
  triggers: AutomationTriggerOption[],
  key: string
): AutomationTriggerOption | undefined {
  return triggers.find((row) => row.key === String(key || ""));
}

export const TYPE_META: Record<
  AutomationNodeType,
  { title: string; color: string; accent: string }
> = {
  trigger: { title: "טריגר", color: "#7c3aed", accent: "#ede9fe" },
  delay: { title: "המתנה", color: "#0891b2", accent: "#cffafe" },
  condition: { title: "תנאי", color: "#d97706", accent: "#fef3c7" },
  action: { title: "פעולה", color: "#059669", accent: "#d1fae5" },
  router: { title: "ניתוב", color: "#db2777", accent: "#fce7f3" },
};

export const QUICK_ADD_AFTER: PaletteItem[] = [
  PALETTE.find((p) => p.key === "router")!,
  PALETTE.find((p) => p.key === "no_response")!,
  PALETTE.find((p) => p.key === "wait")!,
  PALETTE.find((p) => p.key === "whatsapp_template")!,
  PALETTE.find((p) => p.key === "create_task")!,
  PALETTE.find((p) => p.key === "notify")!,
].filter(Boolean);

export function clampRouteCount(value: unknown, fallback = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(6, Math.max(1, Math.round(n)));
}

export function ensureRouterPaths(data: Record<string, unknown>) {
  const pathCount = clampRouteCount(data.pathCount, 3);
  const existing = Array.isArray(data.paths)
    ? (data.paths as Array<{ id?: string; label?: string }>)
    : [];
  const paths = Array.from({ length: pathCount }, (_, index) => {
    const prev = existing[index];
    return {
      id: prev?.id || `path_${index + 1}`,
      label: prev?.label || `מסלול ${index + 1}`,
    };
  });
  return { pathCount, paths };
}

export function nodeSummary(
  data: Record<string, unknown>,
  type: AutomationNodeType
) {
  if (type === "delay") {
    const amount = Number(data.amount) || 0;
    const unit = String(data.unit || "minutes");
    const unitLabel =
      DELAY_UNITS.find((u) => u.value === unit)?.label || unit;
    return `${amount} ${unitLabel}`;
  }
  if (type === "trigger") {
    const key = String(data.triggerKey || "");
    const routes = clampRouteCount(data.routeCount, 2);
    const base = String(data.label || key || "");
    return `${base} · ${routes} ניתובים`;
  }
  if (type === "condition") {
    const key = String(data.conditionKey || "");
    return (
      CONDITION_OPTIONS.find((o) => o.value === key)?.label ||
      String(data.label || "")
    );
  }
  if (type === "router") {
    const { pathCount } = ensureRouterPaths(data);
    return `${pathCount} מסלולים במקביל`;
  }
  if (type === "action") {
    const key = String(data.actionKey || "");
    return (
      ACTION_OPTIONS.find((o) => o.value === key)?.label ||
      String(data.label || "")
    );
  }
  return String(data.label || "");
}

export function defaultSourceHandle(
  type: AutomationNodeType,
  _data: Record<string, unknown>
) {
  void _data;
  if (type === "trigger") return "route_1";
  if (type === "router") return "path_1";
  if (type === "condition") return "yes";
  return "out";
}

export function listSourceHandles(
  type: AutomationNodeType,
  data: Record<string, unknown>
): string[] {
  if (type === "trigger") {
    const count = clampRouteCount(data.routeCount, 2);
    return Array.from({ length: count }, (_, i) => `route_${i + 1}`);
  }
  if (type === "router") {
    const { pathCount } = ensureRouterPaths(data);
    return Array.from({ length: pathCount }, (_, i) => `path_${i + 1}`);
  }
  if (type === "condition") return ["yes", "no"];
  return ["out"];
}
