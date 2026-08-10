import type { AutomationBillingUsageOverview } from "../../../../api/automationBillingApi";
import type { WhatsAppBillingUsageOverview } from "../../../../api/whatsappBillingApi";
import type {
  AutomationExecution,
  AutomationStats,
  AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";

export const automationQueryKeys = {
  all: ["automations"] as const,
  workflows: (businessId: string) =>
    ["automations", "workflows", businessId] as const,
  stats: (businessId: string) =>
    ["automations", "stats", businessId] as const,
  executions: (businessId: string, workflowId?: string) =>
    ["automations", "executions", businessId, workflowId || "all"] as const,
  billingUsage: (businessId: string) =>
    ["automations", "billingUsage", businessId] as const,
  whatsappBillingUsage: (businessId: string) =>
    ["whatsapp", "billingUsage", businessId] as const,
};

export type AutomationsHomeCache = {
  workflows: AutomationWorkflow[];
  stats: AutomationStats | null;
};

export type AutomationBillingCache = AutomationBillingUsageOverview;
export type WhatsAppBillingCache = WhatsAppBillingUsageOverview;
export type AutomationExecutionsCache = AutomationExecution[];
