import type {
  AutomationLastExecution,
  AutomationStatus,
  AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";

export type WorkflowStatusFilter =
  | "all"
  | "active"
  | "draft"
  | "paused"
  | "failed";

export type WorkflowSortKey = "updated" | "created" | "name";

export function getWorkflowStatus(
  workflow: AutomationWorkflow
): AutomationStatus {
  if (workflow.status) return workflow.status;
  return workflow.enabled ? "active" : "draft";
}

export function getStatusLabel(status: AutomationStatus | string): string {
  switch (status) {
    case "active":
      return "פעילה";
    case "draft":
      return "טיוטה";
    case "paused":
      return "מושהית";
    case "failed":
      return "שגיאה";
    case "archived":
      return "ארכיון";
    default:
      return "טיוטה";
  }
}

export function getTriggerLabel(workflow: AutomationWorkflow): string {
  const trigger = (workflow.nodes || []).find((node) => node.type === "trigger");
  if (!trigger) return "—";
  const label = String(trigger.data?.label || "").trim();
  if (label) return label;
  const key = String(trigger.data?.triggerKey || "").trim();
  return key || "—";
}

export function getLastResultLabel(
  lastExecution?: AutomationLastExecution
): { label: string; tone: "success" | "failed" | "neutral" | "running" } {
  if (!lastExecution?.status) {
    return { label: "אין עדיין", tone: "neutral" };
  }
  const status = String(lastExecution.status).toLowerCase();
  if (status === "completed" || status === "success") {
    return { label: "הצלחה", tone: "success" };
  }
  if (status === "failed" || status === "error") {
    return { label: "נכשלה", tone: "failed" };
  }
  if (status === "running" || status === "waiting") {
    return { label: "רצה", tone: "running" };
  }
  return { label: lastExecution.status, tone: "neutral" };
}

export function formatRelativeTime(
  value?: string | null,
  locale = "he"
): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = date.getTime() - Date.now();
  const absMs = Math.abs(diffMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (absMs < minute) return rtf.format(0, "minute");
  if (absMs < hour) return rtf.format(Math.round(diffMs / minute), "minute");
  if (absMs < day) return rtf.format(Math.round(diffMs / hour), "hour");
  if (absMs < 30 * day) return rtf.format(Math.round(diffMs / day), "day");
  return date.toLocaleDateString("he-IL");
}

export function matchesStatusFilter(
  workflow: AutomationWorkflow,
  filter: WorkflowStatusFilter
): boolean {
  if (filter === "all") return true;
  if (filter === "failed") {
    return (
      getWorkflowStatus(workflow) === "failed" ||
      workflow.lastExecution?.status === "failed"
    );
  }
  return getWorkflowStatus(workflow) === filter;
}

export function sortWorkflows(
  workflows: AutomationWorkflow[],
  sort: WorkflowSortKey
): AutomationWorkflow[] {
  const copy = [...workflows];
  copy.sort((a, b) => {
    if (sort === "name") {
      return String(a.name || "").localeCompare(String(b.name || ""), "he");
    }
    if (sort === "created") {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    }
    return (
      new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
  });
  return copy;
}

export function readAutomationErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "response" in error) {
    return String(
      (error as { response?: { data?: { error?: string } } }).response?.data
        ?.error || fallback
    );
  }
  return fallback;
}
