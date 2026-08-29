import API from "../api";

function withBusiness(businessId?: string, extra?: Record<string, unknown>) {
  const params: Record<string, unknown> = { ...(extra || {}) };
  if (businessId) params.businessId = businessId;
  return { params };
}

export type AiCampaignQuestionOption = {
  value: string;
  label: string;
  itemType?: string;
  itemId?: string;
  itemName?: string;
};

export type AiCampaignQuestion = {
  field: string;
  type:
    | "single_select"
    | "multi_select"
    | "currency"
    | "text"
    | "location"
    | "confirm"
    | "upload";
  message: string;
  options?: AiCampaignQuestionOption[];
  currency?: string;
  suggestedValue?: unknown;
  suggestedState?: string;
  placeholder?: string;
};

export type AiCampaignMessage = {
  role: "assistant" | "user";
  text: string;
  field?: string | null;
  createdAt?: string;
};

export type AiCampaignProposal = {
  campaign: {
    name: string;
    objectiveKey: string | null;
    metaObjective: string | null;
  };
  adSet: {
    dailyBudget: { amount: number; currency: string } | null;
    lifetimeBudget: { amount: number; currency: string } | null;
    locations: Array<{ kind?: string; name?: string; country?: string }>;
    audience: {
      summary: string;
      ageMin: number;
      ageMax: number;
      gender: string;
      interests: string[];
    };
    placements: { recommendation: string; surfaces: string[] };
    optimizationKey: string | null;
  };
  creative: {
    primaryText: string;
    headline: string;
    description: string;
    ctaKey: string;
    media: {
      status: "MISSING" | "PROVIDED";
      url?: string | null;
      fileName?: string | null;
      kind?: string | null;
    };
  };
  leadForm: {
    mode: "EXISTING" | "DRAFT";
    existingFormId?: string | null;
    existingFormName?: string | null;
    draft?: {
      name?: string;
      introTitle?: string;
      introBody?: string;
      thankYouTitle?: string;
      thankYouBody?: string;
      fields?: string[];
    } | null;
  } | null;
  strategy: {
    audienceWhy: string;
    creativeWhy: string;
    settingsWhy: string;
  };
  graphSafe?: {
    objective: string | null;
    optimizationGoal: string | null;
    cta: string | null;
  };
};

export type AiCampaignLifecycle =
  | "COLLECTING"
  | "READY_FOR_GENERATION"
  | "PROPOSAL_READY"
  | "CREATING_META_DRAFT"
  | "META_DRAFT_CREATED"
  | "PUBLISHED"
  | "META_FAILED"
  | "CANCELLED";

export type AiUnresolvedLocation = {
  query: string;
  options: Array<{
    key: string;
    name: string;
    type?: string;
    countryCode?: string;
    region?: string;
  }>;
};

export type AiCampaignMetaDraft = {
  status:
    | "IDLE"
    | "CREATING_META_DRAFT"
    | "META_DRAFT_CREATED"
    | "PUBLISHED"
    | "META_FAILED";
  stage?: string | null;
  error?: string;
  publishId?: string | null;
  campaignId?: string | null;
  adSetId?: string | null;
  adId?: string | null;
  approvedDailyBudget?: number | null;
  approvedLifetimeBudget?: number | null;
  pendingLocations?: AiUnresolvedLocation[];
};

export type AiCampaignSessionResponse = {
  success?: boolean;
  sessionId: string;
  status: "COLLECTING" | "READY_FOR_GENERATION" | "CANCELLED";
  language?: string;
  metaConnected?: boolean;
  assistantMessage: string;
  question: AiCampaignQuestion | null;
  missingFields: string[];
  progress: { confirmed: number; required: number; missing?: string[] };
  intent?: unknown;
  messages?: AiCampaignMessage[];
  ready?: {
    message: string;
    generateEnabled: boolean;
    placeholder?: string | null;
  } | null;
  proposal?: AiCampaignProposal | null;
  generation?: {
    status: "IDLE" | "GENERATING" | "READY" | "FAILED";
    meta?: Record<string, unknown>;
  };
  metaDraft?: AiCampaignMetaDraft;
  lifecycle?: AiCampaignLifecycle;
  automationRecommendations?: AiAutomationRecommendation[];
  enabledCount?: number;
  failedCount?: number;
  enabled?: Array<{ key: string; automationWorkflowId?: string; alreadyCreated?: boolean }>;
  failed?: Array<{ key: string; reason: string }>;
  alreadyCreated?: boolean;
  automationWorkflowId?: string;
  publishId?: string;
  meta?: {
    campaignId?: string | null;
    adSetId?: string | null;
    adId?: string | null;
    status?: string | null;
    budget?: number | null;
  };
  tree?: {
    campaign?: string | null;
    adSet?: string | null;
    ad?: string | null;
  };
  resumable?: boolean;
};

export type AiAutomationRecommendationStatus =
  | "RECOMMENDED"
  | "CREATED"
  | "DISMISSED"
  | "UNAVAILABLE";

export type AiAutomationRecommendation = {
  key: string;
  status: AiAutomationRecommendationStatus;
  name?: string;
  description?: string;
  reason?: string;
  priority?: string;
  normalizedWorkflow?: Record<string, unknown>;
  automationWorkflowId?: string | null;
  blockedReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AiCampaignContextResponse = {
  success?: boolean;
  context: Record<string, unknown>;
};

const BASE = "/meta-campaigns/ai";

export async function getAiCampaignContext(businessId?: string) {
  const { data } = await API.get<AiCampaignContextResponse>(
    `${BASE}/context`,
    withBusiness(businessId)
  );
  return data;
}

export async function startAiCampaignSession(
  businessId: string | undefined,
  body: { action?: "new" | "resume" | "restart"; sessionId?: string; language?: string } = {}
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions`,
    { ...body, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function getAiCampaignSession(
  businessId: string | undefined,
  sessionId: string
) {
  const { data } = await API.get<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}`,
    withBusiness(businessId)
  );
  return data;
}

export async function answerAiCampaignSession(
  businessId: string | undefined,
  sessionId: string,
  payload: { field?: string; answer: unknown }
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/answers`,
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function sendAiCampaignMessage(
  businessId: string | undefined,
  sessionId: string,
  text: string
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/messages`,
    { text, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function generateAiCampaign(
  businessId: string | undefined,
  sessionId: string,
  regenerate = false
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/generate`,
    { regenerate, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function reviseAiCampaign(
  businessId: string | undefined,
  sessionId: string,
  instruction: string
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/revisions`,
    { instruction, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function patchAiCampaignProposal(
  businessId: string | undefined,
  sessionId: string,
  patch: Record<string, unknown>
) {
  const { data } = await API.patch<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/proposal`,
    { patch, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function createAiCampaignMetaDraft(
  businessId: string | undefined,
  sessionId: string,
  locationChoices: Array<Record<string, unknown>> = []
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/meta-draft`,
    { locationChoices, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function confirmAiDraftLocations(
  businessId: string | undefined,
  sessionId: string,
  choices: Array<Record<string, unknown>>
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/meta-draft/locations`,
    { choices, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function retryAiCampaignMetaDraft(
  businessId: string | undefined,
  sessionId: string
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/meta-draft/retry`,
    { businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function activateAiCampaign(
  businessId: string | undefined,
  sessionId: string,
  confirm: boolean
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/activate`,
    { confirm, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function recommendAiCampaignAutomations(
  businessId: string | undefined,
  sessionId: string,
  refresh = false
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/automations/recommend`,
    { refresh, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function enableAiCampaignAutomation(
  businessId: string | undefined,
  sessionId: string,
  key: string
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/automations/enable`,
    { key, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function enableAllAiCampaignAutomations(
  businessId: string | undefined,
  sessionId: string
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/automations/enable-all`,
    { businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function dismissAiCampaignAutomation(
  businessId: string | undefined,
  sessionId: string,
  key: string
) {
  const { data } = await API.post<AiCampaignSessionResponse>(
    `${BASE}/sessions/${sessionId}/automations/dismiss`,
    { key, businessId },
    withBusiness(businessId)
  );
  return data;
}

export function sessionStorageKey(businessId: string) {
  return `bizuply.meta-ai-campaign.session.${businessId}`;
}
