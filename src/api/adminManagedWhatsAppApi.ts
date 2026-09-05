import API from "../api";

export type ManagedWhatsAppAllowlistMode = "all_entitled" | "allowlist";

export type ManagedWhatsAppHealthStatus =
  | "healthy"
  | "degraded"
  | "failed"
  | "not_configured";

export type ManagedWhatsAppConnectionSummary = {
  connectionId: string;
  country: string;
  label: string;
  flag?: string;
  enabled: boolean;
  isDefault?: boolean;
  isFixed?: boolean;
  expectedDisplayPhone?: string;
  credentialsConfigured?: boolean;
  connectionStatus?: "READY" | "CONNECTED" | "NOT_CONNECTED" | string;
  phoneRegistered?: boolean;
  registrationStatus?: string;
  sendReady?: boolean;
  displayPhoneMasked?: string;
  credentialBusinessIdConfigured?: boolean;
  credentialBusinessId?: string;
  lastError?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminManagedWhatsAppHealth = {
  status: ManagedWhatsAppHealthStatus | string;
  tokenConfigured: boolean;
  authenticationValid: boolean;
  wabaAccessible: boolean;
  phoneNumberAccessible: boolean;
  phoneBelongsToWaba?: boolean;
  wabaId?: string;
  phoneNumberId?: string;
  displayPhoneNumber?: string;
  lastCheckedAt?: string | null;
  lastSuccessfulCheckAt?: string | null;
  lastSuccessfulSendAt?: string | null;
  lastFailedCheckAt?: string | null;
  errorCode?: string | null;
  errorType?: string | null;
  errorMessage?: string | null;
  tokenType?: string | null;
  tokenTypeLabel?: string | null;
  tokenIsSystemUser?: boolean;
  tokenValidNow?: boolean | null;
  tokenExpiration?: string | null;
  tokenExpirationStatus?: "never" | "dated" | "unknown" | string;
  tokenExpirationReason?: string | null;
  dataAccessExpiresAt?: string | null;
  requiredPermissionsOk?: boolean | null;
  requiredPermissions?: {
    whatsapp_business_messaging?: boolean | null;
    whatsapp_business_management?: boolean | null;
  };
  missingPermissions?: string[];
  systemUserId?: string | null;
  wabaAssignedToSystemUser?: boolean | null;
  wabaAssignmentStatus?: "pass" | "fail" | "unknown" | "not_applicable" | string;
  wabaAssignmentReason?: string | null;
};

export type AdminManagedWhatsAppStatus = {
  success?: boolean;
  managedModeEnabled: boolean;
  allowlistMode: ManagedWhatsAppAllowlistMode;
  allowlistBusinessIds: string[];
  allowlistBusinesses?: Array<{
    businessId: string;
    businessName?: string;
    email?: string;
  }>;
  defaultManagedConnectionId?: string;
  activeManagedConnectionId?: string;
  connections?: ManagedWhatsAppConnectionSummary[];
  connectionMeta?: ManagedWhatsAppConnectionSummary | null;
  lastError?: string;
  updatedAt?: string | null;
  healthy?: boolean;
  customerUnavailableMessage?: string | null;
  health?: AdminManagedWhatsAppHealth;
  liveTest?: { ok: boolean; message?: string };
  connection: {
    managedBusinessIdConfigured: boolean;
    managedBusinessId?: string;
    managedConnectionId?: string;
    wabaConnected: boolean;
    phoneNumberConnected: boolean;
    accessToken: "configured" | "missing" | string;
    displayPhoneMasked?: string;
    expectedDisplayPhoneDigits?: string;
    lastTemplatesSyncAt?: string | null;
    connectionReady: boolean;
    connectionCode?: string;
    connectionReason?: string;
    connectionStatus?: "READY" | "NOT_READY" | string;
    statusSource?: "platform_managed_only" | string;
    enabled?: boolean;
  };
  registration?: {
    status?: string;
    phoneRegistered?: boolean;
    lastError?: string;
    sendReady?: boolean;
    registeredAt?: string | null;
  };
  businessConnections?: {
    privateConnected: number;
    privateDisconnected: number;
    privateRows: number;
    usingManaged?: number | null;
  };
  configForm?: {
    wabaId?: string;
    phoneNumberId?: string;
    displayPhoneNumber?: string;
    accessTokenConfigured?: boolean;
  };
  templates: {
    APPROVED: number;
    PENDING: number;
    REJECTED: number;
    OTHER?: number;
  };
  templatesSource?: string;
};

export type AdminManagedWhatsAppAuditItem = {
  id: string;
  action: string;
  actorUserId?: string | null;
  actorEmail?: string;
  details?: Record<string, unknown>;
  createdAt?: string;
};

function withConnectionParams(managedConnectionId?: string) {
  return managedConnectionId
    ? { managedConnectionId }
    : undefined;
}

export async function getAdminManagedWhatsAppStatus(managedConnectionId?: string) {
  const { data } = await API.get("/admin/managed-whatsapp", {
    params: withConnectionParams(managedConnectionId),
  });
  return data as AdminManagedWhatsAppStatus;
}

export async function updateAdminManagedWhatsAppSettings(payload: {
  managedModeEnabled?: boolean;
  allowlistMode?: ManagedWhatsAppAllowlistMode;
  allowlistBusinessIds?: string[];
  defaultManagedConnectionId?: string;
  managedConnectionId?: string;
}) {
  const { data } = await API.put("/admin/managed-whatsapp", payload);
  return data as AdminManagedWhatsAppStatus & { settings?: unknown };
}

export async function saveAndVerifyAdminManagedWhatsAppConnection(payload: {
  managedConnectionId?: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  accessToken?: string;
  enabled?: boolean;
}) {
  const { data } = await API.post("/admin/managed-whatsapp/connection", payload);
  return data as AdminManagedWhatsAppStatus;
}

export async function createAdminManagedWhatsAppConnection(payload: {
  connectionName?: string;
  connectionId?: string;
  country: string;
  label?: string;
  phoneNumber?: string;
  wabaId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  enabled?: boolean;
}) {
  const { data } = await API.post("/admin/managed-whatsapp/connections", payload);
  return data as AdminManagedWhatsAppStatus;
}

export async function deleteAdminManagedWhatsAppConnection(connectionId: string) {
  const { data } = await API.delete(
    `/admin/managed-whatsapp/connections/${encodeURIComponent(connectionId)}`
  );
  return data as AdminManagedWhatsAppStatus;
}

export async function getAdminManagedWhatsAppHealth(managedConnectionId?: string) {
  const { data } = await API.get("/admin/managed-whatsapp/health", {
    params: withConnectionParams(managedConnectionId),
  });
  return data as { success?: boolean; health: AdminManagedWhatsAppHealth } & AdminManagedWhatsAppHealth;
}

export async function testAdminManagedWhatsAppConnection(managedConnectionId?: string) {
  const { data } = await API.post(
    "/admin/managed-whatsapp/test",
    withConnectionParams(managedConnectionId) || {}
  );
  return data as { success?: boolean; health: AdminManagedWhatsAppHealth } & AdminManagedWhatsAppHealth;
}

export async function syncAdminManagedWhatsAppTemplates(managedConnectionId?: string) {
  const { data } = await API.post(
    "/admin/managed-whatsapp/sync-templates",
    withConnectionParams(managedConnectionId) || {}
  );
  return data as AdminManagedWhatsAppStatus & {
    sync?: {
      synced: number;
      totalFromMeta: number;
      counts: AdminManagedWhatsAppStatus["templates"];
      lastTemplatesSyncAt?: string;
      managedConnectionId?: string;
    };
  };
}

export async function registerAdminManagedWhatsAppPhone(
  pin: string,
  managedConnectionId?: string
) {
  const { data } = await API.post("/admin/managed-whatsapp/register", {
    pin,
    ...(managedConnectionId ? { managedConnectionId } : {}),
  });
  return data as AdminManagedWhatsAppStatus;
}

export async function listAdminManagedWhatsAppAudit(limit = 50) {
  const { data } = await API.get("/admin/managed-whatsapp/audit", {
    params: { limit },
  });
  return data as { success: boolean; items: AdminManagedWhatsAppAuditItem[] };
}

export type AdminManagedEmbeddedSignupConfig = {
  success?: boolean;
  appId?: string;
  configId?: string;
  graphVersion?: string;
  ready?: boolean;
  encryptionReady?: boolean;
  permissions?: string[];
};

export async function getAdminManagedEmbeddedSignupConfig() {
  const { data } = await API.get(
    "/admin/managed-whatsapp/embedded-signup/config"
  );
  return data as AdminManagedEmbeddedSignupConfig;
}

export async function completeAdminManagedEmbeddedSignup(payload: {
  managedConnectionId: string;
  code: string;
  phoneNumberId: string;
  wabaId: string;
  metaBusinessId?: string;
  pin?: string;
}) {
  const { data } = await API.post(
    "/admin/managed-whatsapp/embedded-signup/complete",
    payload
  );
  return data as AdminManagedWhatsAppStatus;
}
