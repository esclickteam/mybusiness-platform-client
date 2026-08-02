import API from "../api";

export type AutomationNodeType =
  | "trigger"
  | "delay"
  | "condition"
  | "action"
  | "router";

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

export type AutomationWorkflow = {
  _id: string;
  businessId: string;
  name: string;
  description?: string;
  enabled: boolean;
  nodes: AutomationFlowNode[];
  edges: AutomationFlowEdge[];
  viewport?: { x: number; y: number; zoom: number };
  stats?: { runs: number; success: number; failed: number };
  lastRunAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

function withBusiness(businessId: string) {
  return { params: { businessId } };
}

export async function listAutomationWorkflows(businessId: string) {
  const { data } = await API.get("/automations", withBusiness(businessId));
  return (data?.workflows || []) as AutomationWorkflow[];
}

export async function getAutomationWorkflow(
  businessId: string,
  id: string
) {
  const { data } = await API.get(`/automations/${id}`, withBusiness(businessId));
  return data?.workflow as AutomationWorkflow;
}

export type AutomationRecipeSummary = {
  key: string;
  name: string;
  description: string;
  tier?: "standard" | "ai_paid";
  triggerCount: number;
  pathCount: number;
  nodeCount: number;
};

export async function listAutomationRecipes(businessId: string) {
  const { data } = await API.get("/automations/recipes", withBusiness(businessId));
  return (data?.recipes || []) as AutomationRecipeSummary[];
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
    enabled: boolean;
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

export async function deleteAutomationWorkflow(
  businessId: string,
  id: string
) {
  const { data } = await API.delete(`/automations/${id}`, {
    params: { businessId },
  });
  return data;
}
