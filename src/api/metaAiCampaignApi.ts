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
};

export type AiCampaignMessage = {
  role: "assistant" | "user";
  text: string;
  field?: string | null;
  createdAt?: string;
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
    placeholder: string;
  } | null;
  resumable?: boolean;
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

export function sessionStorageKey(businessId: string) {
  return `bizuply.meta-ai-campaign.session.${businessId}`;
}
