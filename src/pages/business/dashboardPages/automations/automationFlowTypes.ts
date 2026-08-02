import type { AutomationNodeType } from "../../../../api/automationWorkflowApi";

export type { AutomationNodeType };

export type PaletteItem = {
  type: AutomationNodeType;
  key: string;
  label: string;
  description: string;
  color: string;
  defaults: Record<string, unknown>;
  group: "triggers" | "flow" | "actions";
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
  { value: "appointment_created", label: "נקבעה פגישה" },
  { value: "appointment_reminder", label: "תזכורת לפני פגישה" },
  { value: "new_client", label: "לקוח חדש" },
  { value: "status_changed", label: "שינוי סטטוס ליד" },
] as const;

export const ACTION_OPTIONS = [
  { value: "whatsapp_template", label: "שליחת תבנית וואטסאפ" },
  { value: "create_task", label: "יצירת משימה ב-CRM" },
  { value: "notify", label: "התראה לבעל העסק" },
  { value: "update_status", label: "עדכון סטטוס ליד" },
] as const;

export const CONDITION_OPTIONS = [
  { value: "no_response", label: "לא נוצר קשר" },
  { value: "status_is", label: "סטטוס מסוים" },
  { value: "has_appointment", label: "יש פגישה קרובה" },
] as const;

export const DELAY_UNITS = [
  { value: "minutes", label: "דקות" },
  { value: "hours", label: "שעות" },
  { value: "days", label: "ימים" },
] as const;

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

export const PALETTE: PaletteItem[] = [
  {
    type: "trigger",
    key: "new_lead",
    group: "triggers",
    label: "טריגר · ליד חדש",
    description: "כמה יציאות ניתוב מהטריגר",
    color: "#7c3aed",
    defaults: {
      label: "ליד חדש ב-CRM",
      triggerKey: "new_lead",
      routeCount: 3,
    },
  },
  {
    type: "trigger",
    key: "appointment_created",
    group: "triggers",
    label: "טריגר · פגישה",
    description: "אפשר להוסיף כמה טריגרים על הבד",
    color: "#7c3aed",
    defaults: {
      label: "נקבעה פגישה",
      triggerKey: "appointment_created",
      routeCount: 2,
    },
  },
  {
    type: "trigger",
    key: "new_client",
    group: "triggers",
    label: "טריגר · לקוח חדש",
    description: "מתחיל תהליך נפרד באותה אוטומציה",
    color: "#7c3aed",
    defaults: {
      label: "לקוח חדש",
      triggerKey: "new_client",
      routeCount: 2,
    },
  },
  {
    type: "router",
    key: "router",
    group: "flow",
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
  {
    type: "condition",
    key: "no_response",
    group: "flow",
    label: "תנאי · כן / לא",
    description: "שני ניתובים לפי תוצאה",
    color: "#d97706",
    defaults: { label: "לא נוצר קשר", conditionKey: "no_response" },
  },
  {
    type: "delay",
    key: "wait",
    group: "flow",
    label: "המתנה",
    description: "ממתין לפני השלב הבא",
    color: "#0891b2",
    defaults: { label: "המתנה", amount: 10, unit: "minutes" },
  },
  {
    type: "action",
    key: "whatsapp_template",
    group: "actions",
    label: "פעולה · וואטסאפ",
    description: "שולח תבנית הודעה",
    color: "#059669",
    defaults: {
      label: "שליחת וואטסאפ",
      actionKey: "whatsapp_template",
      templateId: "",
    },
  },
  {
    type: "action",
    key: "create_task",
    group: "actions",
    label: "פעולה · משימה",
    description: "יוצר משימת מעקב ב-CRM",
    color: "#059669",
    defaults: { label: "יצירת משימה", actionKey: "create_task" },
  },
  {
    type: "action",
    key: "notify",
    group: "actions",
    label: "פעולה · התראה",
    description: "שולח התראה לבעל העסק",
    color: "#059669",
    defaults: { label: "התראה לבעל העסק", actionKey: "notify" },
  },
  {
    type: "action",
    key: "update_status",
    group: "actions",
    label: "פעולה · סטטוס",
    description: "מעדכן סטטוס ליד",
    color: "#059669",
    defaults: { label: "עדכון סטטוס", actionKey: "update_status" },
  },
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
