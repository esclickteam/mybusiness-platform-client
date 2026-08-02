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
};

export type RecipeSummary = {
  key: string;
  name: string;
  description: string;
  triggerCount: number;
  pathCount: number;
  nodeCount: number;
};

export const TRIGGER_OPTIONS = [
  { value: "new_lead", label: "ליד חדש ב-CRM" },
  { value: "lead_no_response", label: "ליד שלא נענה" },
  { value: "lead_followup", label: "פולואפ לליד" },
  { value: "appointment_created", label: "נקבעה פגישה" },
  { value: "appointment_reminder", label: "תזכורת לפני פגישה" },
  { value: "appointment_cancelled", label: "פגישה בוטלה" },
  { value: "appointment_completed", label: "פגישה הסתיימה" },
  { value: "new_client", label: "לקוח חדש" },
  { value: "inactive_client", label: "לקוח לא פעיל" },
  { value: "status_changed", label: "שינוי סטטוס ליד" },
  { value: "form_submitted", label: "נשלח טופס באתר" },
  { value: "whatsapp_received", label: "התקבלה הודעת וואטסאפ" },
  { value: "payment_received", label: "התקבל תשלום" },
  { value: "birthday", label: "יום הולדת לקוח" },
] as const;

export const ACTION_OPTIONS = [
  { value: "whatsapp_template", label: "שליחת תבנית וואטסאפ" },
  { value: "create_task", label: "יצירת משימה ב-CRM" },
  { value: "notify", label: "התראה לבעל העסק" },
  { value: "update_status", label: "עדכון סטטוס ליד" },
  { value: "assign_owner", label: "שיוך לנציג" },
  { value: "add_tag", label: "הוספת תגית" },
  { value: "send_email", label: "שליחת אימייל" },
  { value: "create_appointment", label: "יצירת פגישה" },
  { value: "webhook", label: "קריאת Webhook" },
  { value: "wait_until", label: "המתנה עד תאריך/שעה" },
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

export const FALLBACK_RECIPES: RecipeSummary[] = [
  {
    key: "lead_multi_route",
    name: "ליד חדש · כמה ניתובים",
    description: "טריגר אחד מתפצל ל־3 מסלולים במקביל.",
    triggerCount: 1,
    pathCount: 4,
    nodeCount: 5,
  },
  {
    key: "lead_no_response",
    name: "ליד שלא נענה · פולואפ חכם",
    description: "תנאי כן/לא עם שני תוצאות שונות.",
    triggerCount: 1,
    pathCount: 4,
    nodeCount: 5,
  },
  {
    key: "appointment_duo",
    name: "פגישה · תזכורת + תודה",
    description: "שני טריגרים באותה אוטומציה עם ניתובים.",
    triggerCount: 2,
    pathCount: 4,
    nodeCount: 6,
  },
  {
    key: "new_client_welcome",
    name: "לקוח חדש · ברוכים הבאים",
    description: "טריגר לקוח חדש עם שני מסלולים.",
    triggerCount: 1,
    pathCount: 3,
    nodeCount: 4,
  },
];

function triggerItem(
  key: string,
  label: string,
  description: string,
  routeCount = 2
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
  };
}

function actionItem(key: string, label: string, description: string): PaletteItem {
  return {
    type: "action",
    key,
    group: "actions",
    filter: "action",
    label: `פעולה · ${label}`,
    description,
    color: "#059669",
    defaults: { label, actionKey: key, templateId: "" },
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

export const PALETTE: PaletteItem[] = [
  triggerItem("new_lead", "ליד חדש", "כשליד נכנס ל-CRM", 3),
  triggerItem("lead_no_response", "ליד שלא נענה", "אחרי זמן בלי מענה", 2),
  triggerItem("lead_followup", "פולואפ לליד", "מועד מעקב לליד", 2),
  triggerItem("appointment_created", "נקבעה פגישה", "כשקובעים תור", 2),
  triggerItem("appointment_reminder", "תזכורת פגישה", "לפני מועד הפגישה", 2),
  triggerItem("appointment_cancelled", "פגישה בוטלה", "כשלקוח מבטל", 2),
  triggerItem("appointment_completed", "פגישה הסתיימה", "אחרי סיום הפגישה", 2),
  triggerItem("new_client", "לקוח חדש", "כשלקוח נוצר ב-CRM", 2),
  triggerItem("inactive_client", "לקוח לא פעיל", "אחרי תקופה בלי פעילות", 2),
  triggerItem("status_changed", "שינוי סטטוס", "כשמזיזים סטטוס ליד", 2),
  triggerItem("form_submitted", "טופס באתר", "כשנשלח טופס", 2),
  triggerItem("whatsapp_received", "וואטסאפ נכנס", "כשמתקבלת הודעה", 2),
  triggerItem("payment_received", "תשלום התקבל", "אחרי תשלום מוצלח", 2),
  triggerItem("birthday", "יום הולדת", "ביום ההולדת של הלקוח", 1),

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
  actionItem("create_appointment", "קביעת פגישה", "יוצר תור ביומן"),
  actionItem("webhook", "Webhook", "שולח נתונים למערכת חיצונית"),
];

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
    const base =
      TRIGGER_OPTIONS.find((o) => o.value === key)?.label ||
      String(data.label || "");
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
  data: Record<string, unknown>
) {
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
