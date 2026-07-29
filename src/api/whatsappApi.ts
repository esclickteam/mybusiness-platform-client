import API from "../api";

export type WhatsAppConnection = {
  connected: boolean;
  status: "connected" | "disconnected" | "error";
  phoneNumberId: string;
  wabaId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  accessTokenMasked: string;
  hasAccessToken: boolean;
  usingEnvFallback: boolean;
  lastError: string;
  connectedAt: string | null;
};

export type WhatsAppTemplate = {
  _id: string;
  name: string;
  key: string;
  category:
    | "appointment_reminder"
    | "promotion"
    | "follow_up"
    | "welcome"
    | "custom";
  language: string;
  body: string;
  variables: string[];
  metaTemplateName?: string;
  status: "draft" | "active" | "archived";
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type WhatsAppListMember = {
  _id?: string;
  crmClientId?: string | null;
  name: string;
  phone: string;
  optedIn?: boolean;
};

export type WhatsAppMailingList = {
  _id: string;
  name: string;
  description?: string;
  purpose?: "promotions" | "reminders" | "updates" | "general";
  members?: WhatsAppListMember[];
  memberCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type WhatsAppRecipient = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
  whatsappPhone?: string;
};

export type WhatsAppCampaign = {
  _id: string;
  name: string;
  templateName?: string;
  bodySnapshot?: string;
  audienceType: string;
  status: string;
  stats?: {
    total: number;
    sent: number;
    failed: number;
    skipped: number;
  };
  recipients?: Array<{
    _id?: string;
    name: string;
    phone: string;
    status: string;
    error?: string;
    sentAt?: string;
  }>;
  createdAt?: string;
  completedAt?: string;
};

export type WhatsAppAutomation = {
  _id: string;
  name: string;
  trigger:
    | "appointment_reminder_1_day"
    | "appointment_reminder_hours"
    | "new_client_welcome";
  hoursBefore?: number;
  templateId:
    | string
    | {
        _id: string;
        name: string;
        key?: string;
        category?: string;
        body?: string;
      };
  enabled: boolean;
  lastRunAt?: string | null;
  stats?: { sent: number; failed: number };
};

export type WhatsAppMessageLog = {
  _id: string;
  recipientName?: string;
  recipientPhone: string;
  body?: string;
  status: string;
  source?: string;
  error?: string;
  createdAt?: string;
};

export type WhatsAppOverview = {
  connection: WhatsAppConnection;
  stats: {
    templates: number;
    lists: number;
    campaigns: number;
    automations: number;
    activeAutomations: number;
    sentLast7Days: number;
  };
  recentLogs: WhatsAppMessageLog[];
};

function withBusiness(businessId?: string) {
  return businessId ? { params: { businessId } } : undefined;
}

export async function getWhatsAppOverview(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/overview",
    withBusiness(businessId)
  );
  return data as { success: boolean } & WhatsAppOverview;
}

export async function getWhatsAppStatus(businessId: string) {
  const { data } = await API.get("/whatsapp/status", withBusiness(businessId));
  return data as { success: boolean } & WhatsAppConnection;
}

export async function saveWhatsAppConnection(
  businessId: string,
  payload: {
    phoneNumberId?: string;
    wabaId?: string;
    accessToken?: string;
    displayPhoneNumber?: string;
    verifiedName?: string;
  }
) {
  const { data } = await API.put("/whatsapp/connection", {
    businessId,
    ...payload,
  });
  return data as { success: boolean } & WhatsAppConnection;
}

export async function disconnectWhatsApp(businessId: string) {
  const { data } = await API.delete("/whatsapp/connection", {
    params: { businessId },
  });
  return data as { success: boolean } & WhatsAppConnection;
}

export async function listWhatsAppTemplates(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/templates",
    withBusiness(businessId)
  );
  return (data?.templates || []) as WhatsAppTemplate[];
}

export async function createWhatsAppTemplate(
  businessId: string,
  payload: Partial<WhatsAppTemplate>
) {
  const { data } = await API.post("/whatsapp/templates", {
    businessId,
    ...payload,
  });
  return data?.template as WhatsAppTemplate;
}

export async function updateWhatsAppTemplate(
  businessId: string,
  id: string,
  payload: Partial<WhatsAppTemplate>
) {
  const { data } = await API.put(`/whatsapp/templates/${id}`, {
    businessId,
    ...payload,
  });
  return data?.template as WhatsAppTemplate;
}

export async function deleteWhatsAppTemplate(businessId: string, id: string) {
  const { data } = await API.delete(`/whatsapp/templates/${id}`, {
    params: { businessId },
  });
  return data;
}

export async function listWhatsAppRecipients(
  businessId: string,
  q = ""
) {
  const { data } = await API.get("/whatsapp/recipients", {
    params: { businessId, q },
  });
  return (data?.recipients || []) as WhatsAppRecipient[];
}

export async function listWhatsAppLists(businessId: string) {
  const { data } = await API.get("/whatsapp/lists", withBusiness(businessId));
  return (data?.lists || []) as WhatsAppMailingList[];
}

export async function createWhatsAppList(
  businessId: string,
  payload: { name: string; description?: string; purpose?: string }
) {
  const { data } = await API.post("/whatsapp/lists", {
    businessId,
    ...payload,
  });
  return data?.list as WhatsAppMailingList;
}

export async function updateWhatsAppList(
  businessId: string,
  id: string,
  payload: Partial<WhatsAppMailingList>
) {
  const { data } = await API.put(`/whatsapp/lists/${id}`, {
    businessId,
    ...payload,
  });
  return data?.list as WhatsAppMailingList;
}

export async function deleteWhatsAppList(businessId: string, id: string) {
  const { data } = await API.delete(`/whatsapp/lists/${id}`, {
    params: { businessId },
  });
  return data;
}

export async function addWhatsAppListMembers(
  businessId: string,
  listId: string,
  payload: { clientIds?: string[]; members?: WhatsAppListMember[] }
) {
  const { data } = await API.post(`/whatsapp/lists/${listId}/members`, {
    businessId,
    ...payload,
  });
  return data?.list as WhatsAppMailingList;
}

export async function removeWhatsAppListMember(
  businessId: string,
  listId: string,
  memberId: string
) {
  const { data } = await API.delete(
    `/whatsapp/lists/${listId}/members/${memberId}`,
    { params: { businessId } }
  );
  return data?.list as WhatsAppMailingList;
}

export async function sendWhatsAppCampaign(
  businessId: string,
  payload: {
    name?: string;
    templateId?: string;
    body?: string;
    audienceType:
      | "all_clients"
      | "selected_clients"
      | "mailing_list"
      | "manual";
    clientIds?: string[];
    mailingListId?: string;
    manualRecipients?: Array<{ name?: string; phone: string }>;
    variables?: Record<string, string>;
  }
) {
  const { data } = await API.post("/whatsapp/campaigns/send", {
    businessId,
    ...payload,
  });
  return data?.campaign as WhatsAppCampaign;
}

export async function listWhatsAppCampaigns(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/campaigns",
    withBusiness(businessId)
  );
  return (data?.campaigns || []) as WhatsAppCampaign[];
}

export async function listWhatsAppAutomations(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/automations",
    withBusiness(businessId)
  );
  return (data?.automations || []) as WhatsAppAutomation[];
}

export async function createWhatsAppAutomation(
  businessId: string,
  payload: {
    name: string;
    trigger: WhatsAppAutomation["trigger"];
    templateId: string;
    hoursBefore?: number;
    enabled?: boolean;
  }
) {
  const { data } = await API.post("/whatsapp/automations", {
    businessId,
    ...payload,
  });
  return data?.automation as WhatsAppAutomation;
}

export async function updateWhatsAppAutomation(
  businessId: string,
  id: string,
  payload: Partial<{
    name: string;
    enabled: boolean;
    templateId: string;
    hoursBefore: number;
  }>
) {
  const { data } = await API.patch(`/whatsapp/automations/${id}`, {
    businessId,
    ...payload,
  });
  return data?.automation as WhatsAppAutomation;
}

export async function deleteWhatsAppAutomation(
  businessId: string,
  id: string
) {
  const { data } = await API.delete(`/whatsapp/automations/${id}`, {
    params: { businessId },
  });
  return data;
}

export async function listWhatsAppLogs(businessId: string, limit = 50) {
  const { data } = await API.get("/whatsapp/logs", {
    params: { businessId, limit },
  });
  return (data?.logs || []) as WhatsAppMessageLog[];
}

export async function sendWhatsAppTest(
  businessId: string,
  payload: {
    phone: string;
    body: string;
    name?: string;
    templateId?: string;
    variables?: Record<string, string>;
  }
) {
  const { data } = await API.post("/whatsapp/send-test", {
    businessId,
    ...payload,
  });
  return data;
}
