import API from "../api";

export type AutomationNodeType =
  | "trigger"
  | "delay"
  | "condition"
  | "action"
  | "router";

export type AutomationStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived"
  | "failed";

export type AutomationFlowNode = {
  id: string;
  type: AutomationNodeType;
  position: { x: number; y: number };
  data: Record<string, unknown>;
};

export type AutomationFlowEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
};

export type AutomationLastExecution = {
  status: string;
  executionId: string;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  error?: string;
} | null;

export type AutomationWorkflow = {
  _id: string;
  businessId: string;
  name: string;
  description?: string;
  enabled: boolean;
  status?: AutomationStatus;
  publishedVersionId?: string | null;
  publishedAt?: string | null;
  recipeId?: string;
  recipeVersion?: number | null;
  isAiRecipe?: boolean;
  requiresAiEntitlement?: boolean;
  nodes: AutomationFlowNode[];
  edges: AutomationFlowEdge[];
  viewport?: { x: number; y: number; zoom: number };
  stats?: { runs: number; success: number; failed: number };
  lastRunAt?: string | null;
  lastExecution?: AutomationLastExecution;
  createdAt?: string;
  updatedAt?: string;
};

export type AutomationExecution = {
  _id: string;
  executionId: string;
  workflowId: string;
  versionId: string;
  eventType: string;
  entityType?: string;
  entityId?: string;
  status: string;
  mode?: string;
  nodes?: Array<{
    nodeId: string;
    type?: string;
    label?: string;
    status: string;
    attempt?: number;
    startedAt?: string | null;
    completedAt?: string | null;
    failedAt?: string | null;
    error?: string;
    input?: unknown;
    output?: unknown;
  }>;
  error?: string;
  retryCount?: number;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  waitingUntil?: string | null;
  createdAt?: string;
};

export type AutomationRecipeSummary = {
  key: string;
  name: string;
  description: string;
  tier?: "standard" | "ai_paid";
  isAiRecipe?: boolean;
  requiresAiEntitlement?: boolean;
  recipeVersion?: number;
  triggerCount: number;
  pathCount: number;
  nodeCount: number;
  publishable?: boolean;
  comingSoon?: boolean;
  unsupportedNodes?: string[];
  aiLocked?: boolean;
  canCreate?: boolean;
};

export type AutomationStats = {
  total: number;
  active: number;
  paused: number;
  draft: number;
  archived: number;
  runsLast30Days: number;
  successLast30Days: number;
  failedLast30Days: number;
};

function withBusiness(businessId: string) {
  return { params: { businessId } };
}

export async function listAutomationWorkflows(
  businessId: string,
  opts?: { status?: string; q?: string }
) {
  const { data } = await API.get("/automations", {
    params: {
      businessId,
      status: opts?.status || undefined,
      q: opts?.q || undefined,
    },
  });
  return (data?.workflows || []) as AutomationWorkflow[];
}

export async function getAutomationStats(businessId: string) {
  const { data } = await API.get("/automations/stats", withBusiness(businessId));
  return data?.stats as AutomationStats;
}

export async function getAutomationWorkflow(businessId: string, id: string) {
  const { data } = await API.get(`/automations/${id}`, withBusiness(businessId));
  return data?.workflow as AutomationWorkflow;
}

export async function listAutomationRecipes(businessId: string) {
  const { data } = await API.get(
    "/automations/recipes",
    withBusiness(businessId)
  );
  return {
    recipes: (data?.recipes || []) as AutomationRecipeSummary[],
    aiAutomationsEntitled: Boolean(data?.aiAutomationsEntitled),
  };
}

export async function createAutomationWorkflow(
  businessId: string,
  payload?: {
    name?: string;
    description?: string;
    useStarter?: boolean;
    recipe?: string;
    nodes?: AutomationFlowNode[];
    edges?: AutomationFlowEdge[];
  }
) {
  const { data } = await API.post("/automations", {
    businessId,
    ...payload,
  });
  return data?.workflow as AutomationWorkflow;
}

export async function saveAutomationWorkflow(
  businessId: string,
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    nodes: AutomationFlowNode[];
    edges: AutomationFlowEdge[];
    viewport: { x: number; y: number; zoom: number };
  }>
) {
  const { data } = await API.put(`/automations/${id}`, {
    businessId,
    ...payload,
  });
  return data?.workflow as AutomationWorkflow;
}

export async function publishAutomationWorkflow(
  businessId: string,
  id: string
) {
  const { data } = await API.post(`/automations/${id}/publish`, { businessId });
  return {
    workflow: data?.workflow as AutomationWorkflow,
    version: data?.version,
    errors: data?.errors as string[] | undefined,
  };
}

export async function pauseAutomationWorkflow(businessId: string, id: string) {
  const { data } = await API.post(`/automations/${id}/pause`, { businessId });
  return data?.workflow as AutomationWorkflow;
}

export async function resumeAutomationWorkflow(businessId: string, id: string) {
  const { data } = await API.post(`/automations/${id}/resume`, { businessId });
  return data?.workflow as AutomationWorkflow;
}

export async function archiveAutomationWorkflow(
  businessId: string,
  id: string
) {
  const { data } = await API.post(`/automations/${id}/archive`, { businessId });
  return data?.workflow as AutomationWorkflow;
}

export async function duplicateAutomationWorkflow(
  businessId: string,
  id: string
) {
  const { data } = await API.post(`/automations/${id}/duplicate`, {
    businessId,
  });
  return data?.workflow as AutomationWorkflow;
}

export async function validateAutomationWorkflow(
  businessId: string,
  id: string
) {
  const { data } = await API.post(`/automations/${id}/validate`, {
    businessId,
  });
  return data as { ok: boolean; errors: string[] };
}

export async function dryRunAutomationWorkflow(
  businessId: string,
  id: string,
  payload: {
    eventType?: string;
    entityType?: string;
    entityId?: string;
    payload?: Record<string, unknown>;
    usePublishedVersion?: boolean;
  }
) {
  const { data } = await API.post(`/automations/${id}/dry-run`, {
    businessId,
    ...payload,
  });
  return data?.result;
}

export async function fetchDryRunExample(
  businessId: string,
  workflowId: string,
  eventType?: string
) {
  const { data } = await API.get(`/automations/${workflowId}/dry-run/example`, {
    params: { businessId, eventType },
  });
  return data?.example;
}

export async function listAutomationExecutions(
  businessId: string,
  workflowId: string,
  limit = 50
) {
  const { data } = await API.get(`/automations/${workflowId}/executions`, {
    params: { businessId, limit },
  });
  return (data?.executions || []) as AutomationExecution[];
}

export async function getAutomationExecution(
  businessId: string,
  executionId: string
) {
  const { data } = await API.get(`/automations/executions/${executionId}`, {
    params: { businessId },
  });
  return data?.execution as AutomationExecution;
}

export async function retryAutomationExecution(
  businessId: string,
  executionId: string
) {
  const { data } = await API.post(
    `/automations/executions/${executionId}/retry`,
    { businessId }
  );
  return data?.execution as AutomationExecution;
}

export async function cancelAutomationExecution(
  businessId: string,
  executionId: string
) {
  const { data } = await API.post(
    `/automations/executions/${executionId}/cancel`,
    { businessId }
  );
  return data?.execution as AutomationExecution;
}

export async function deleteAutomationWorkflow(
  businessId: string,
  id: string
) {
  const { data } = await API.delete(`/automations/${id}`, {
    params: { businessId },
  });
  return data;
}
