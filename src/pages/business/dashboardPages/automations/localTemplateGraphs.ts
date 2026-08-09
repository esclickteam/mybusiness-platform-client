import type {
  AutomationFlowEdge,
  AutomationFlowNode,
} from "../../../../api/automationWorkflowApi";
import type { SystemAutomationSuggestion } from "./systemAutomationCatalog";

export type LocalAutomationTemplate = {
  key: string;
  catalogId: string;
  name: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
  categories: SystemAutomationSuggestion["categories"];
  hoursBefore?: number;
  triggerKey: string;
  actionKey: string;
  actionLabel: string;
  nodeCount: number;
  resultCount: number;
};

/** Reminder templates that become real builder graphs (trigger → result). */
export const LOCAL_REMINDER_TEMPLATES: LocalAutomationTemplate[] = [
  {
    key: "local_appointment_reminder_1_day",
    catalogId: "appointment_reminder_1_day",
    name: "תזכורת פגישה — יום לפני",
    description: "טריגר: פגישה קרובה יום לפני. תוצאה: שליחת הודעת תזכורת ב-WhatsApp.",
    triggerLabel: "פגישה קרובה (יום לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    hoursBefore: 24,
    triggerKey: "appointment_reminder",
    actionKey: "whatsapp_template",
    actionLabel: "הודעת תזכורת WhatsApp",
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_appointment_reminder_2_days",
    catalogId: "appointment_reminder_2_days",
    name: "תזכורת פגישה — יומיים לפני",
    description:
      "טריגר: פגישה קרובה יומיים לפני. תוצאה: שליחת הודעת תזכורת ב-WhatsApp.",
    triggerLabel: "פגישה קרובה (יומיים לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    hoursBefore: 48,
    triggerKey: "appointment_reminder",
    actionKey: "whatsapp_template",
    actionLabel: "הודעת תזכורת WhatsApp",
    nodeCount: 2,
    resultCount: 1,
  },
  {
    key: "local_appointment_reminder_hours",
    catalogId: "appointment_reminder_hours",
    name: "תזכורת פגישה — שעתיים לפני",
    description:
      "טריגר: פגישה קרובה שעתיים לפני. תוצאה: שליחת הודעת תזכורת ב-WhatsApp. אפשר לשנות את מספר השעות בבונה.",
    triggerLabel: "פגישה קרובה (שעתיים לפני)",
    resultLabels: ["הודעת תזכורת WhatsApp"],
    categories: ["appointments", "whatsapp"],
    hoursBefore: 2,
    triggerKey: "appointment_reminder",
    actionKey: "whatsapp_template",
    actionLabel: "הודעת תזכורת WhatsApp",
    nodeCount: 2,
    resultCount: 1,
  },
];

export function buildReminderAutomationGraph(template: LocalAutomationTemplate): {
  nodes: AutomationFlowNode[];
  edges: AutomationFlowEdge[];
} {
  const triggerId = "trigger_1";
  const actionId = "action_1";
  const hours = template.hoursBefore ?? 24;

  const nodes: AutomationFlowNode[] = [
    {
      id: triggerId,
      type: "trigger",
      position: { x: 80, y: 180 },
      data: {
        label: template.triggerLabel,
        triggerKey: template.triggerKey,
        routeCount: 1,
        hoursBefore: hours,
      },
    },
    {
      id: actionId,
      type: "action",
      position: { x: 420, y: 180 },
      data: {
        label: template.actionLabel,
        actionKey: template.actionKey,
        templateId: "",
      },
    },
  ];

  const edges: AutomationFlowEdge[] = [
    {
      id: "e_trigger_action",
      source: triggerId,
      target: actionId,
      sourceHandle: "route_1",
      targetHandle: null,
      label: "תוצאה",
    },
  ];

  return { nodes, edges };
}

export function isLocalReminderTemplateKey(key: string) {
  return LOCAL_REMINDER_TEMPLATES.some((row) => row.key === key);
}

export function getLocalReminderTemplate(key: string) {
  return LOCAL_REMINDER_TEMPLATES.find((row) => row.key === key);
}
