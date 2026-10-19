import API from "@api";

export type PipelineStage = {
  key: string;
  label: string;
  order: number;
  mapsToStatus: string;
  hidden?: boolean;
};

export type LeadCustomField = {
  id: string;
  key: string;
  label: string;
  type:
    | "text"
    | "number"
    | "date"
    | "time"
    | "select"
    | "multiselect"
    | "boolean"
    | "url"
    | "money";
  options: string[];
  required: boolean;
  showInTable: boolean;
  showInFilter: boolean;
  active: boolean;
  order: number;
};

export type WorkspaceLead = {
  _id: string;
  name?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  status?: string;
  stageKey?: string;
  source?: string;
  provider?: string;
  assignedToUserId?: string | null;
  assignedToName?: string;
  assignedAt?: string;
  archived?: boolean;
  customValues?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  formId?: string;
  campaignName?: string;
  campaignId?: string;
  formName?: string;
  facebook?: Record<string, string>;
  google?: Record<string, string>;
  convertedClientId?: string | null;
  openTaskCount?: number;
  message?: string;
  details?: { label: string; value: string }[];
  activities?: Array<Record<string, unknown>>;
  assignmentHistory?: Array<Record<string, unknown>>;
  documents?: Array<{ name: string; url: string; createdAt?: string }>;
};

export type LeadListQuery = {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  stage?: string;
  source?: string;
  campaign?: string;
  formId?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  dir?: "asc" | "desc";
  archived?: string;
  includeArchived?: string;
  businessId?: string;
};

export type SavedView = {
  _id: string;
  name: string;
  isDefault?: boolean;
  state?: Record<string, unknown>;
};

export type CrmDeal = {
  _id: string;
  name: string;
  amount: number;
  currency: string;
  status: string;
  stageKey?: string;
  contactName?: string;
  assignedToName?: string;
  expectedCloseAt?: string | null;
  actualCloseAt?: string | null;
  notes?: string;
  leadId?: string | null;
  clientId?: string | null;
  documents?: Array<{ name: string; url: string }>;
};

export type TimelineEvent = {
  id?: string;
  type: string;
  at?: string;
  actor?: string;
  text?: string;
  callOutcome?: string;
};

export async function fetchWorkspaceSettings() {
  const { data } = await API.get("/crm/workspace/settings");
  return data as {
    success: boolean;
    pipelineStages: PipelineStage[];
    leadCustomFields: LeadCustomField[];
  };
}

export async function savePipelineStages(stages: PipelineStage[]) {
  const { data } = await API.put("/crm/workspace/settings/pipeline", { stages });
  return data;
}

export async function saveLeadCustomFields(fields: LeadCustomField[]) {
  const { data } = await API.put("/crm/workspace/settings/lead-fields", { fields });
  return data;
}

export async function fetchAgents() {
  const { data } = await API.get("/crm/workspace/agents");
  return (data.agents || []) as Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

export async function fetchWorkspaceLeads(query: LeadListQuery) {
  const { data } = await API.get("/crm/workspace/leads", { params: query });
  return data as {
    success: boolean;
    leads: WorkspaceLead[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export async function bulkUpdateLeads(payload: Record<string, unknown>) {
  const { data } = await API.post("/crm/workspace/leads/bulk", payload);
  return data;
}

export async function exportLeadsCsv(query: LeadListQuery) {
  const { data } = await API.get("/crm/workspace/leads/export", {
    params: { ...query, format: "csv" },
    responseType: "blob",
  });
  return data as Blob;
}

export async function exportLeadsJson(query: LeadListQuery) {
  const { data } = await API.get("/crm/workspace/leads/export", {
    params: { ...query, format: "json" },
  });
  return (data.rows || []) as Array<Record<string, string>>;
}

export async function importLeadRows(rows: Array<Record<string, string>>) {
  const { data } = await API.post("/crm/workspace/leads/import", { rows });
  return data as { success: boolean; created: number; errors: unknown[] };
}

export async function fetchDuplicates() {
  const { data } = await API.get("/crm/workspace/leads/duplicates");
  return data as { success: boolean; groups: Array<Record<string, unknown>> };
}

export async function mergeLeads(primaryLeadId: string, secondaryLeadId: string) {
  const { data } = await API.post("/crm/workspace/leads/merge", {
    confirm: true,
    primaryLeadId,
    secondaryLeadId,
  });
  return data;
}

export async function patchLead(
  leadId: string,
  body: Record<string, unknown>
) {
  const { data } = await API.patch(`/crm/workspace/leads/${leadId}`, body);
  return data;
}

export async function assignLead(
  leadId: string,
  assignedToUserId: string,
  assignedToName: string
) {
  const { data } = await API.post(`/crm/workspace/leads/${leadId}/assign`, {
    assignedToUserId,
    assignedToName,
  });
  return data;
}

export async function fetchTimeline(leadId: string) {
  const { data } = await API.get(`/crm/workspace/leads/${leadId}/timeline`);
  return (data.events || []) as TimelineEvent[];
}

export async function logCall(leadId: string, outcome: string, note: string) {
  const { data } = await API.post(`/crm/workspace/leads/${leadId}/calls`, {
    outcome,
    note,
  });
  return data;
}

export async function createMeeting(leadId: string, title: string, meetingAt: string, notes = "") {
  const { data } = await API.post(`/crm/workspace/leads/${leadId}/meetings`, {
    title,
    meetingAt,
    notes,
  });
  return data;
}

export async function addDocument(leadId: string, name: string, url: string) {
  const { data } = await API.post(`/crm/workspace/leads/${leadId}/documents`, {
    name,
    url,
  });
  return data;
}

export async function fetchViews() {
  const { data } = await API.get("/crm/workspace/views");
  return (data.views || []) as SavedView[];
}

export async function createView(name: string, state: Record<string, unknown>, isDefault = false) {
  const { data } = await API.post("/crm/workspace/views", { name, state, isDefault });
  return data.view as SavedView;
}

export async function deleteView(viewId: string) {
  await API.delete(`/crm/workspace/views/${viewId}`);
}

export async function fetchDeals(params: { leadId?: string; clientId?: string }) {
  const { data } = await API.get("/crm/workspace/deals", { params });
  return (data.deals || []) as CrmDeal[];
}

export async function createDeal(body: Record<string, unknown>) {
  const { data } = await API.post("/crm/workspace/deals", body);
  return data.deal as CrmDeal;
}

export async function patchDeal(dealId: string, body: Record<string, unknown>) {
  const { data } = await API.patch(`/crm/workspace/deals/${dealId}`, body);
  return data.deal as CrmDeal;
}

export async function fetchFunnel() {
  const { data } = await API.get("/crm/workspace/funnel");
  return data as {
    success: boolean;
    stages: PipelineStage[];
    funnel: Array<{ key: string; label: string; count: number; amount: number }>;
  };
}

export async function fetchReports(from: string, to: string) {
  const { data } = await API.get("/crm/workspace/reports", { params: { from, to } });
  return data;
}

export async function fetchWorkspaceTasks() {
  const { data } = await API.get("/crm/workspace/tasks");
  return (data.items || []) as Array<Record<string, unknown>>;
}
