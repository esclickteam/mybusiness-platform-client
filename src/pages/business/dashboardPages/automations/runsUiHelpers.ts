import type { AutomationExecution } from "../../../../api/automationWorkflowApi";

export type ExecutionStatusTone =
  | "success"
  | "failed"
  | "running"
  | "cancelled"
  | "neutral";

export type ExecutionStatusFilter =
  | "all"
  | "completed"
  | "failed"
  | "running"
  | "cancelled";

export type DateRangeFilter = "all" | "24h" | "7d" | "30d";

const SENSITIVE_KEY =
  /^(authorization|password|passwd|pwd|secret|token|access_token|refresh_token|api[_-]?key|apikey|credential|credentials|client_secret|private_key|bearer)$/i;

const SENSITIVE_VALUE =
  /(bearer\s+[a-z0-9\-._~+/]+=*|sk-[a-z0-9]{10,}|ghp_[a-z0-9]{20,}|xox[baprs]-[a-z0-9-]{10,})/i;

export function getExecutionStatusLabel(status?: string | null): string {
  switch (String(status || "").toLowerCase()) {
    case "completed":
    case "success":
      return "?????";
    case "failed":
    case "error":
      return "?????";
    case "running":
      return "??????";
    case "waiting":
    case "pending":
      return "??????";
    case "cancelled":
    case "canceled":
      return "?????";
    default:
      return status ? String(status) : "?";
  }
}

export function getExecutionStatusTone(
  status?: string | null
): ExecutionStatusTone {
  switch (String(status || "").toLowerCase()) {
    case "completed":
    case "success":
      return "success";
    case "failed":
    case "error":
      return "failed";
    case "running":
    case "waiting":
    case "pending":
      return "running";
    case "cancelled":
    case "canceled":
      return "cancelled";
    default:
      return "neutral";
  }
}

export function getNodeStatusLabel(status?: string | null): string {
  switch (String(status || "").toLowerCase()) {
    case "completed":
    case "success":
      return "Success";
    case "failed":
    case "error":
      return "Failed";
    case "running":
      return "Running";
    case "waiting":
      return "Waiting";
    case "skipped":
      return "Skipped";
    case "cancelled":
    case "canceled":
      return "Cancelled";
    case "pending":
    default:
      return "Not executed";
  }
}

export function getNodeStatusSymbol(status?: string | null): string {
  switch (String(status || "").toLowerCase()) {
    case "completed":
    case "success":
      return "?";
    case "failed":
    case "error":
      return "?";
    case "running":
      return "?";
    case "waiting":
      return "?";
    case "skipped":
    case "cancelled":
    case "canceled":
      return "?";
    default:
      return "?";
  }
}

export function formatExecutionDateTime(value?: string | null): string {
  if (!value) return "?";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "?";
  return date.toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getExecutionEndAt(
  execution: Pick<AutomationExecution, "completedAt" | "failedAt" | "status">
): string | null {
  return execution.completedAt || execution.failedAt || null;
}

export function formatDurationMs(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "?";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 1 : 0)}s`;
  const minutes = Math.floor(seconds / 60);
  const rem = Math.round(seconds % 60);
  return `${minutes}m ${rem}s`;
}

export function getExecutionDurationMs(
  execution: Pick<
    AutomationExecution,
    "startedAt" | "completedAt" | "failedAt" | "createdAt" | "status"
  >
): number | null {
  const startRaw = execution.startedAt || execution.createdAt;
  if (!startRaw) return null;
  const start = new Date(startRaw).getTime();
  if (Number.isNaN(start)) return null;
  const endRaw = getExecutionEndAt(execution);
  const end = endRaw
    ? new Date(endRaw).getTime()
    : ["running", "waiting", "pending"].includes(
          String(execution.status || "").toLowerCase()
        )
      ? Date.now()
      : NaN;
  if (Number.isNaN(end) || end < start) return null;
  return end - start;
}

export function getStepsSummary(
  execution: Pick<AutomationExecution, "nodes" | "stepsExecuted">
): string {
  const nodes = execution.nodes || [];
  if (!nodes.length) {
    if (typeof execution.stepsExecuted === "number") {
      return String(execution.stepsExecuted);
    }
    return "?";
  }
  const done = nodes.filter((node) =>
    ["completed", "failed", "skipped", "cancelled", "canceled"].includes(
      String(node.status || "").toLowerCase()
    )
  ).length;
  return `${done}/${nodes.length}`;
}

export function getTriggerSummary(
  execution: Pick<AutomationExecution, "eventType" | "entityType" | "entityId">
): string {
  const event = String(execution.eventType || "").trim();
  if (!event) return "?";
  return event
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function matchesExecutionStatusFilter(
  status: string | undefined,
  filter: ExecutionStatusFilter
): boolean {
  if (filter === "all") return true;
  const normalized = String(status || "").toLowerCase();
  if (filter === "running") {
    return ["running", "waiting", "pending"].includes(normalized);
  }
  if (filter === "cancelled") {
    return normalized === "cancelled" || normalized === "canceled";
  }
  if (filter === "completed") {
    return normalized === "completed" || normalized === "success";
  }
  return normalized === filter;
}

export function matchesDateRangeFilter(
  value: string | null | undefined,
  range: DateRangeFilter,
  now = Date.now()
): boolean {
  if (range === "all") return true;
  if (!value) return false;
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return false;
  const windowMs =
    range === "24h"
      ? 24 * 60 * 60 * 1000
      : range === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;
  return now - ts <= windowMs;
}

export function redactSensitiveData<T>(value: T, depth = 0): T {
  if (depth > 8) return "[Truncated]" as T;
  if (value == null) return value;

  if (typeof value === "string") {
    if (SENSITIVE_VALUE.test(value)) return "[REDACTED]" as T;
    if (value.length > 4000) return `${value.slice(0, 4000)}?` as T;
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item, depth + 1)) as T;
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(
      value as Record<string, unknown>
    )) {
      if (SENSITIVE_KEY.test(key)) {
        out[key] = "[REDACTED]";
      } else {
        out[key] = redactSensitiveData(nested, depth + 1);
      }
    }
    return out as T;
  }

  return value;
}

export function summarizeJson(value: unknown, maxLen = 280): string {
  if (value == null) return "?";
  try {
    const redacted = redactSensitiveData(value);
    const text =
      typeof redacted === "string" ? redacted : JSON.stringify(redacted, null, 2);
    if (!text) return "?";
    return text.length > maxLen ? `${text.slice(0, maxLen)}?` : text;
  } catch {
    return "?";
  }
}

export type ExecutionStepView = {
  nodeId: string;
  label: string;
  type?: string;
  status: string;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  error?: string;
  input?: unknown;
  output?: unknown;
  attempt?: number;
};

export function buildExecutionSteps(
  execution: Pick<AutomationExecution, "nodes">,
  workflowNodeOrder?: Array<{ id: string; label?: string; type?: string }>
): ExecutionStepView[] {
  const byId = new Map(
    (execution.nodes || []).map((node) => [node.nodeId, node] as const)
  );

  if (workflowNodeOrder?.length) {
    return workflowNodeOrder.map((node) => {
      const hit = byId.get(node.id);
      if (hit) {
        return {
          nodeId: hit.nodeId,
          label: hit.label || node.label || hit.nodeId,
          type: hit.type || node.type,
          status: hit.status || "pending",
          startedAt: hit.startedAt,
          completedAt: hit.completedAt,
          failedAt: hit.failedAt,
          error: hit.error,
          input: hit.input,
          output: hit.output,
          attempt: hit.attempt,
        };
      }
      return {
        nodeId: node.id,
        label: node.label || node.id,
        type: node.type,
        status: "pending",
      };
    });
  }

  return (execution.nodes || []).map((node) => ({
    nodeId: node.nodeId,
    label: node.label || node.nodeId,
    type: node.type,
    status: node.status || "pending",
    startedAt: node.startedAt,
    completedAt: node.completedAt,
    failedAt: node.failedAt,
    error: node.error,
    input: node.input,
    output: node.output,
    attempt: node.attempt,
  }));
}

export function getFailedStep(
  execution: Pick<AutomationExecution, "nodes" | "error" | "failedNodeId">
): ExecutionStepView | null {
  const nodes = execution.nodes || [];
  const failed =
    nodes.find((node) => String(node.status).toLowerCase() === "failed") ||
    nodes.find((node) => node.nodeId === execution.failedNodeId) ||
    null;
  if (!failed) return null;
  return {
    nodeId: failed.nodeId,
    label: failed.label || failed.nodeId,
    type: failed.type,
    status: failed.status,
    startedAt: failed.startedAt,
    completedAt: failed.completedAt,
    failedAt: failed.failedAt,
    error: failed.error || execution.error,
    input: failed.input,
    output: failed.output,
    attempt: failed.attempt,
  };
}
