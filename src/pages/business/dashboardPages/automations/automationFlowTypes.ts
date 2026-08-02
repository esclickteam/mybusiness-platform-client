import type { AutomationNodeType } from "../../../../api/automationWorkflowApi";

export type { AutomationNodeType };

export type PaletteItem = {
  type: AutomationNodeType;
  key: string;
  label: string;
  description: string;
  color: string;
  defaults: Record<string, unknown>;
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

export const PALETTE: PaletteItem[] = [
  {
    type: "trigger",
    key: "new_lead",
    label: "טריגר · ליד חדש",
    description: "מתחיל כשליד נכנס ל-CRM",
    color: "#7c3aed",
    defaults: { label: "ליד חדש ב-CRM", triggerKey: "new_lead" },
  },
  {
    type: "trigger",
    key: "appointment_created",
    label: "טריגר · פגישה",
    description: "מתחיל כשנקבע תור",
    color: "#7c3aed",
    defaults: { label: "נקבעה פגישה", triggerKey: "appointment_created" },
  },
  {
    type: "delay",
    key: "wait",
    label: "המתנה",
    description: "ממתין לפני השלב הבא",
    color: "#0891b2",
    defaults: { label: "המתנה", amount: 10, unit: "minutes" },
  },
  {
    type: "condition",
    key: "no_response",
    label: "תנאי",
    description: "פיצול לפי תנאי",
    color: "#d97706",
    defaults: { label: "לא נוצר קשר", conditionKey: "no_response" },
  },
  {
    type: "action",
    key: "whatsapp_template",
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
    label: "פעולה · משימה",
    description: "יוצר משימת מעקב ב-CRM",
    color: "#059669",
    defaults: { label: "יצירת משימה", actionKey: "create_task" },
  },
  {
    type: "action",
    key: "notify",
    label: "פעולה · התראה",
    description: "שולח התראה לבעל העסק",
    color: "#059669",
    defaults: { label: "התראה לבעל העסק", actionKey: "notify" },
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
};

export function nodeSummary(data: Record<string, unknown>, type: AutomationNodeType) {
  if (type === "delay") {
    const amount = Number(data.amount) || 0;
    const unit = String(data.unit || "minutes");
    const unitLabel =
      DELAY_UNITS.find((u) => u.value === unit)?.label || unit;
    return `${amount} ${unitLabel}`;
  }
  if (type === "trigger") {
    const key = String(data.triggerKey || "");
    return TRIGGER_OPTIONS.find((o) => o.value === key)?.label || String(data.label || "");
  }
  if (type === "condition") {
    const key = String(data.conditionKey || "");
    return (
      CONDITION_OPTIONS.find((o) => o.value === key)?.label ||
      String(data.label || "")
    );
  }
  if (type === "action") {
    const key = String(data.actionKey || "");
    return ACTION_OPTIONS.find((o) => o.value === key)?.label || String(data.label || "");
  }
  return String(data.label || "");
}
