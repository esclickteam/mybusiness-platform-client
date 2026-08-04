import API from "../api";

export type WhatsAppRegistrationStatus =
  | ""
  | "required"
  | "registered"
  | "failed"
  | "pending";

export type WhatsAppReadiness =
  | "disconnected"
  | "ready"
  | "registration_required"
  | "registration_failed"
  | "error";

/** WABA billing/readiness health (separate from Meta Ad Account). */
export type WhatsAppWabaBillingHealth = {
  kind: "whatsapp_waba";
  billingOwner: "whatsapp_waba";
  billingSeparationNote: string;
  connected: boolean;
  wabaId: string;
  wabaName?: string;
  currency?: string;
  status?: string;
  accountReviewStatus?: string | null;
  businessVerificationStatus?: string | null;
  /** Human label, e.g. "In progress — start verification" */
  businessVerificationLabel?: string | null;
  canSendMessage?: string | null;
  hasPrimaryFundingId?: boolean | null;
  /** Same semantics as Ad Account hasPaymentMethod — WABA biller only. */
  hasPaymentMethod?: boolean | null;
  primaryFundingId?: string | null;
  /** e.g. "MASTERCARD *4787" from Meta CreditCard fields */
  paymentMethodDisplay?: string | null;
  /** Card brand/last4 not exposed on WABA the way Ad Account exposes display_string */
  paymentMethodDetailsUnavailable?: boolean;
  severity: "ok" | "warning" | "error";
  ok: boolean;
  actionRequired: boolean;
  issues: string[];
  manageBillingUrl: string;
  /** WhatsApp Manager overview (ops); billing CTA uses manageBillingUrl / actionUrl */
  whatsappManagerUrl?: string;
  actionLabel?: string;
  actionUrl?: string;
};

export type WhatsAppConnection = {
  connected: boolean;
  readyToSend?: boolean;
  integrationId?: string;
  lastTemplatesSyncAt?: string | null;
  readiness?: WhatsAppReadiness;
  readinessLabel?: string;
  registrationStatus?: WhatsAppRegistrationStatus;
  phoneRegistered?: boolean;
  phonePlatformStatus?: string;
  codeVerificationStatus?: string;
  registrationLastError?: string;
  registeredAt?: string | null;
  status: "connected" | "disconnected" | "error";
  phoneNumberId: string;
  wabaId: string;
  wabaName?: string;
  displayPhoneNumber: string;
  verifiedName: string;
  metaBusinessId?: string;
  connectionSource?: string;
  webhookSubscribed?: boolean;
  hasAccessToken: boolean;
  usingEnvFallback: boolean;
  lastError: string;
  connectedAt: string | null;
  signupReady?: boolean;
  embeddedSignup?: WhatsAppEmbeddedSignupConfig;
  wabaBillingHealth?: WhatsAppWabaBillingHealth | null;
  whatsappManagerUrl?: string;
  accountReviewStatus?: string;
  currency?: string;
  wabaPlatformStatus?: string;
  businessVerificationStatus?: string;
  canSendMessage?: string;
  hasPrimaryFundingId?: boolean | null;
  registration?: {
    attempted?: boolean;
    success?: boolean;
    alreadyRegistered?: boolean;
    statusBefore?: string;
    statusAfter?: string;
    metaResponse?: unknown;
    route?: string;
  };
};

export type WhatsAppEmbeddedSignupConfig = {
  ready: boolean;
  appId: string;
  configId: string;
  graphVersion: string;
  encryptionReady?: boolean;
  permissions?: string[];
};

export type WhatsAppHeaderType =
  | "none"
  | "text"
  | "image"
  | "video"
  | "document"
  | "location";

export type WhatsAppTemplateButton = {
  type: "url" | "phone_number" | "quick_reply" | "copy_code";
  text: string;
  url?: string;
  urlType?: "static" | "dynamic";
  exampleUrl?: string;
  phoneNumber?: string;
};

export type WhatsAppMetaStatus =
  | ""
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "DISABLED"
  | "PAUSED"
  | "IN_APPEAL"
  | "LOCAL";

export type WhatsAppMappingStatus =
  | "pending_meta"
  | "rejected"
  | "disabled"
  | "paused"
  | "not_approved"
  | "unmapped"
  | "partial"
  | "ready";

export type WhatsAppVariableMapping = {
  variable: string;
  component?: "body" | "header" | "button";
  exampleValue?: string;
  friendlyName?: string;
  source?: string;
  field?: string;
  format?: string;
  constantValue?: string;
  fallbackValue?: string;
  prefix?: string;
  suffix?: string;
  required?: boolean;
};

export type WhatsAppMappingCatalogField = {
  id: string;
  label: string;
  valueType?: string;
};

export type WhatsAppMappingCatalogSource = {
  id: string;
  label: string;
  fields: WhatsAppMappingCatalogField[];
};

export type WhatsAppMappingCatalog = {
  sources: WhatsAppMappingCatalogSource[];
  formats: Record<string, Array<{ id: string; label: string }>>;
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
  variableType?: "number" | "name";
  headerType?: WhatsAppHeaderType;
  headerText?: string;
  headerMediaUrl?: string;
  body: string;
  footer?: string;
  variables: string[];
  variableBindings?: string[];
  variableMappings?: WhatsAppVariableMapping[];
  exampleValues?: Record<string, string>;
  buttons?: WhatsAppTemplateButton[];
  metaTemplateName?: string;
  metaTemplateId?: string;
  metaStatus?: WhatsAppMetaStatus;
  metaStatusRaw?: string;
  metaQualityScore?: string;
  metaStatusLabelHe?: string;
  metaCategory?: string;
  source?: "local" | "meta";
  lastSyncedAt?: string | null;
  status: "draft" | "active" | "archived";
  isSystem?: boolean;
  mappingStatus?: WhatsAppMappingStatus;
  mappingReady?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type WhatsAppHealthMetric = {
  key: string;
  label: string;
  value: unknown;
  source: string;
};

export type WhatsAppMessagingLimits = {
  raw: string;
  currentKey: string;
  currentLabel: string;
  description: string;
  numeric: number | null;
  steps: Array<{ key: string; label: string }>;
  updatedAt?: string | null;
  source: string;
  available?: boolean;
};

export type WhatsAppAccountHealth = {
  success?: boolean;
  connection: WhatsAppConnection;
  metrics: WhatsAppHealthMetric[];
  messagingLimits?: WhatsAppMessagingLimits | null;
  chart7d: Array<{
    date: string;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
  }>;
  comparison: {
    current: Record<string, unknown>;
    previous: Record<string, unknown>;
  };
  history?: Array<Record<string, unknown>>;
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
    providerMessageId?: string;
  }>;
  createdAt?: string;
  completedAt?: string;
};

export type WhatsAppAutomationTrigger =
  | "appointment_reminder_1_day"
  | "appointment_reminder_hours"
  | "appointment_thanks"
  | "appointment_review_request"
  | "new_lead_welcome"
  | "lead_no_response"
  | "lead_followup_2"
  | "new_client_welcome"
  | "inactive_client";

export type WhatsAppAutomation = {
  _id: string;
  name: string;
  trigger: WhatsAppAutomationTrigger;
  hoursBefore?: number;
  delayMinutes?: number;
  delayHours?: number;
  delayDays?: number;
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
  conversationPhone?: string;
  body?: string;
  templateName?: string;
  templateLanguage?: string;
  direction?: "outbound" | "inbound";
  status: string;
  source?: string;
  error?: string;
  providerMessageId?: string;
  leadId?: string | null;
  crmClientId?: string | null;
  sentAt?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
  failedAt?: string | null;
  createdAt?: string;
};

export type WhatsAppConversation = {
  phone: string;
  recipientName?: string;
  lastMessageAt?: string;
  lastBody?: string;
  lastDirection?: string;
  lastStatus?: string;
  leadId?: string | null;
  crmClientId?: string | null;
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

function withBusiness(
  businessId?: string,
  extraParams?: Record<string, string | number | boolean | undefined>
) {
  if (!businessId && !extraParams) return undefined;
  return {
    params: {
      ...(businessId ? { businessId } : {}),
      ...(extraParams || {}),
    },
  };
}

export async function getWhatsAppOverview(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/overview",
    withBusiness(businessId)
  );
  return data as { success: boolean } & WhatsAppOverview;
}

export async function getWhatsAppStatus(
  businessId: string,
  opts?: { enrichPayment?: boolean }
) {
  const { data } = await API.get(
    "/whatsapp/status",
    withBusiness(businessId, opts?.enrichPayment ? { enrichPayment: 1 } : undefined)
  );
  return data as { success: boolean } & WhatsAppConnection;
}

/** Lightweight integration status (no tokens, no live Meta billing calls). */
export async function getWhatsAppIntegrationStatus(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/integration/status",
    withBusiness(businessId)
  );
  return data as {
    success: boolean;
    connected: boolean;
    readyToSend?: boolean;
    status?: string;
    integrationId?: string;
    phoneNumberId?: string;
    wabaId?: string;
    displayPhoneNumber?: string;
    lastTemplatesSyncAt?: string | null;
    hasAccessToken?: boolean;
  };
}

export type ApprovedWhatsAppTemplate = WhatsAppTemplate & {
  friendlyName?: string;
  languageLabelHe?: string;
  categoryLabelHe?: string;
  statusLabelHe?: string;
  variableCount?: number;
  displaySecondary?: string;
  isTestTemplate?: boolean;
  testLabelHe?: string;
  wabaId?: string;
};

/** Approved Meta templates for the authorized business WABA only. */
export async function listApprovedWhatsAppTemplates(businessId: string) {
  const { data } = await API.get("/whatsapp/templates/approved", {
    params: { businessId },
  });
  return data as {
    success: boolean;
    connected: boolean;
    integrationId?: string;
    phoneNumberId?: string;
    wabaId?: string;
    displayPhoneNumber?: string;
    lastTemplatesSyncAt?: string | null;
    templates: ApprovedWhatsAppTemplate[];
    code?: string;
    message?: string;
  };
}

export async function getWhatsAppEmbeddedSignupConfig(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/embedded-signup/config",
    withBusiness(businessId)
  );
  return data as { success: boolean } & WhatsAppEmbeddedSignupConfig;
}

export async function completeWhatsAppEmbeddedSignup(
  businessId: string,
  payload: {
    code: string;
    phoneNumberId: string;
    wabaId: string;
    metaBusinessId?: string;
    pin?: string;
  }
) {
  const { data } = await API.post("/whatsapp/embedded-signup/complete", {
    businessId,
    ...payload,
  });
  return data as { success: boolean } & WhatsAppConnection;
}

export async function registerWhatsAppPhone(
  businessId: string,
  pin: string
) {
  const { data } = await API.post("/whatsapp/connection/register", {
    businessId,
    pin,
  });
  return data as { success: boolean } & WhatsAppConnection;
}

export async function disconnectWhatsApp(businessId: string) {
  const { data } = await API.delete("/whatsapp/connection", {
    params: { businessId },
  });
  return data as { success: boolean } & WhatsAppConnection;
}

export async function listWhatsAppTemplates(
  businessId: string,
  options?: {
    approvedOnly?: boolean;
    includeArchived?: boolean;
    readyOnly?: boolean;
  }
) {
  const { data } = await API.get("/whatsapp/templates", {
    params: {
      businessId,
      ...(options?.approvedOnly ? { approvedOnly: "1" } : {}),
      ...(options?.includeArchived ? { includeArchived: "1" } : {}),
      ...(options?.readyOnly ? { readyOnly: "1" } : {}),
    },
  });
  return (data?.templates || []) as WhatsAppTemplate[];
}

export async function getWhatsAppTemplateVariableMappings(
  businessId: string,
  templateId: string
) {
  const { data } = await API.get(
    `/whatsapp/templates/${templateId}/variable-mappings`,
    withBusiness(businessId)
  );
  return data as {
    success: boolean;
    template: WhatsAppTemplate;
    mappings: WhatsAppVariableMapping[];
    catalog: WhatsAppMappingCatalog;
    variables: string[];
    mappingStatus: WhatsAppMappingStatus;
  };
}

export async function saveWhatsAppTemplateVariableMappings(
  businessId: string,
  templateId: string,
  mappings: WhatsAppVariableMapping[]
) {
  const { data } = await API.put(
    `/whatsapp/templates/${templateId}/variable-mappings`,
    { businessId, mappings }
  );
  return data as {
    success: boolean;
    template: WhatsAppTemplate;
    mappings: WhatsAppVariableMapping[];
    catalog: WhatsAppMappingCatalog;
    variables: string[];
    mappingStatus: WhatsAppMappingStatus;
  };
}

export type WhatsAppMappingAppointment = {
  id: string;
  date: string;
  time: string;
  serviceName?: string;
  clientName?: string;
  clientPhone?: string;
  status?: string;
  label: string;
};

export async function previewWhatsAppTemplateMappings(
  businessId: string,
  templateId: string,
  payload: {
    crmClientId?: string | null;
    leadId?: string | null;
    appointmentId?: string | null;
    phone?: string;
    name?: string;
    manualValues?: Record<string, string>;
    mappings?: WhatsAppVariableMapping[];
  }
) {
  const { data } = await API.post(
    `/whatsapp/templates/${templateId}/mapping-preview`,
    { businessId, ...payload }
  );
  return data as {
    success: boolean;
    resolved: Record<string, string>;
    missing: string[];
    previewBody: string;
    previewHeader: string;
    mappingStatus: WhatsAppMappingStatus;
    appointmentRequired?: boolean;
    selectAppointmentMessage?: string;
    timeZone?: string;
    appointmentId?: string | null;
    appointment?: { id: string; date: string; time: string } | null;
  };
}

export type WhatsAppSendPreviewState =
  | "not_needed"
  | "ready"
  | "select"
  | "none";

export async function previewWhatsAppComposeTemplate(
  businessId: string,
  templateId: string,
  payload: {
    crmClientId?: string | null;
    appointmentId?: string | null;
    phone?: string;
    name?: string;
    manualValues?: Record<string, string>;
  }
) {
  const { data } = await API.post(
    `/whatsapp/templates/${templateId}/send-preview`,
    { businessId, ...payload }
  );
  return data as {
    success: boolean;
    resolved: Record<string, string>;
    missing: string[];
    previewBody: string;
    previewHeader: string;
    mappingStatus: WhatsAppMappingStatus;
    appointmentId?: string | null;
    appointments: WhatsAppMappingAppointment[];
    appointmentState: WhatsAppSendPreviewState;
    selectAppointmentMessage?: string;
    timeZone?: string;
  };
}

export async function listWhatsAppMappingAppointments(
  businessId: string,
  opts?: { crmClientId?: string | null; phone?: string; limit?: number }
) {
  const { data } = await API.get("/whatsapp/mapping-appointments", {
    params: {
      businessId,
      crmClientId: opts?.crmClientId || undefined,
      phone: opts?.phone || undefined,
      limit: opts?.limit,
    },
  });
  return (data?.appointments || []) as WhatsAppMappingAppointment[];
}

export async function getWhatsAppAccountHealth(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/account-health",
    withBusiness(businessId)
  );
  return data as WhatsAppAccountHealth;
}

export async function syncWhatsAppAccountHealth(businessId: string) {
  const { data } = await API.post("/whatsapp/account-health/sync", {
    businessId,
  });
  return data as WhatsAppAccountHealth & {
    templateSync?: { synced: number; totalFromMeta: number };
  };
}

export async function syncWhatsAppTemplates(businessId: string) {
  const { data } = await API.post("/whatsapp/templates/sync", { businessId });
  return data as {
    success: boolean;
    synced: number;
    totalFromMeta: number;
    lastTemplatesSyncAt?: string | null;
    templates: WhatsAppTemplate[];
    rawStatuses?: Array<{
      name: string;
      language: string;
      id: string;
      status: string;
      qualityScore?: string;
      labelHe?: string;
    }>;
    messagingLimit?: string;
  };
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

export type WhatsAppTemplateSubmitPayload = {
  name: string;
  metaTemplateName?: string;
  language: string;
  metaCategory: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  category?: WhatsAppTemplate["category"];
  variableType?: "number" | "name";
  headerType?: WhatsAppHeaderType;
  headerText?: string;
  headerMediaUrl?: string;
  body: string;
  footer?: string;
  exampleValues?: Record<string, string>;
  buttons?: WhatsAppTemplateButton[];
};

export async function saveWhatsAppTemplateDraft(
  businessId: string,
  payload: WhatsAppTemplateSubmitPayload
) {
  const { data } = await API.post("/whatsapp/templates/draft", {
    businessId,
    ...payload,
  });
  return data?.template as WhatsAppTemplate;
}

export async function submitWhatsAppTemplateToMeta(
  businessId: string,
  payload: WhatsAppTemplateSubmitPayload
) {
  const { data } = await API.post("/whatsapp/templates/submit", {
    businessId,
    ...payload,
  });
  return data as {
    success: boolean;
    template: WhatsAppTemplate;
    meta: { id: string; status: string; category: string };
  };
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

export async function listWhatsAppRecipients(businessId: string, q = "") {
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

export type WhatsAppAppointmentStrategy =
  | "next_upcoming"
  | "per_client"
  | "skip_missing";

export type WhatsAppCampaignPreviewRow = {
  recipientId: string | null;
  crmClientId: string | null;
  name: string;
  phone: string;
  appointmentId: string | null;
  appointmentLabel: string;
  appointments: WhatsAppMappingAppointment[];
  resolved: Record<string, string>;
  missing: string[];
  previewBody: string;
  validationStatus: string;
  validationLabel: string;
  ready: boolean;
};

export async function previewWhatsAppCampaign(
  businessId: string,
  payload: {
    templateId: string;
    audienceType: "selected_clients" | "mailing_list" | "manual";
    clientIds?: string[];
    mailingListId?: string;
    manualRecipients?: Array<{ name?: string; phone: string }>;
    variables?: Record<string, string>;
    appointmentId?: string | null;
    appointmentStrategy?: WhatsAppAppointmentStrategy;
    recipientAppointments?: Record<string, string>;
  }
) {
  const { data } = await API.post("/whatsapp/campaigns/preview", {
    businessId,
    ...payload,
  });
  return data as {
    success: boolean;
    rows: WhatsAppCampaignPreviewRow[];
    variableKeys: string[];
    needsAppointment: boolean;
    strategy: WhatsAppAppointmentStrategy;
    readyCount: number;
    missingCount: number;
    templateId: string;
    templateName: string;
    mappingStatus: WhatsAppMappingStatus;
  };
}

export async function sendWhatsAppCampaign(
  businessId: string,
  payload: {
    name?: string;
    templateId?: string;
    audienceType: "selected_clients" | "mailing_list" | "manual";
    clientIds?: string[];
    mailingListId?: string;
    manualRecipients?: Array<{ name?: string; phone: string }>;
    variables?: Record<string, string>;
    appointmentId?: string | null;
    appointmentStrategy?: WhatsAppAppointmentStrategy;
    recipientAppointments?: Record<string, string>;
    consentConfirmed: boolean;
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
    trigger: WhatsAppAutomationTrigger;
    templateId: string;
    hoursBefore?: number;
    delayMinutes?: number;
    delayHours?: number;
    delayDays?: number;
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
    delayMinutes: number;
    delayHours: number;
    delayDays: number;
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

export async function clearWhatsAppSendHistory(businessId: string) {
  const { data } = await API.delete("/whatsapp/history", {
    params: { businessId },
  });
  return data as {
    success: boolean;
    deletedLogs: number;
    deletedCampaigns: number;
  };
}

export async function listWhatsAppConversations(businessId: string) {
  const { data } = await API.get("/whatsapp/conversations", {
    params: { businessId },
  });
  return (data?.conversations || []) as WhatsAppConversation[];
}

export async function listWhatsAppConversationMessages(
  businessId: string,
  phone: string
) {
  const { data } = await API.get(
    `/whatsapp/conversations/${encodeURIComponent(phone)}`,
    { params: { businessId } }
  );
  return (data?.messages || []) as WhatsAppMessageLog[];
}

export async function clearWhatsAppConversation(
  businessId: string,
  phone: string
) {
  const { data } = await API.delete(
    `/whatsapp/conversations/${encodeURIComponent(phone)}`,
    { params: { businessId } }
  );
  return data as { success: boolean; phone: string; deletedCount: number };
}

export async function replyWhatsAppConversation(
  businessId: string,
  phone: string,
  payload: { body: string; leadId?: string }
) {
  const { data } = await API.post(
    `/whatsapp/conversations/${encodeURIComponent(phone)}/reply`,
    { businessId, ...payload }
  );
  return data as {
    success: boolean;
    log: WhatsAppMessageLog;
    providerMessageId?: string;
  };
}

export async function listLeadWhatsAppMessages(
  businessId: string,
  leadId: string
) {
  const { data } = await API.get(`/whatsapp/leads/${leadId}/messages`, {
    params: { businessId },
  });
  return (data?.messages || []) as WhatsAppMessageLog[];
}

export async function sendWhatsAppTest(
  businessId: string,
  payload: {
    phone: string;
    name?: string;
    templateId: string;
    variables?: Record<string, string>;
    consentConfirmed: boolean;
  }
) {
  const { data } = await API.post("/whatsapp/send-test", {
    businessId,
    ...payload,
  });
  return data;
}
