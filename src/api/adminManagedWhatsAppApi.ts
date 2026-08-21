import API from "../api";

export type ManagedWhatsAppAllowlistMode = "all_entitled" | "allowlist";

export type ManagedWhatsAppHealthStatus =
  | "healthy"
  | "degraded"
  | "failed"
  | "not_configured";

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
  lastError?: string;
  updatedAt?: string | null;
  healthy?: boolean;
  customerUnavailableMessage?: string | null;
  health?: AdminManagedWhatsAppHealth;
  liveTest?: { ok: boolean; message?: string };
  connection: {
    managedBusinessIdConfigured: boolean;
    managedBusinessId?: string;
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

export async function getAdminManagedWhatsAppStatus() {
  const { data } = await API.get("/admin/managed-whatsapp");
  return data as AdminManagedWhatsAppStatus;
}

export async function updateAdminManagedWhatsAppSettings(payload: {
  managedModeEnabled?: boolean;
  allowlistMode?: ManagedWhatsAppAllowlistMode;
  allowlistBusinessIds?: string[];
}) {
  const { data } = await API.put("/admin/managed-whatsapp", payload);
  return data as AdminManagedWhatsAppStatus & { settings?: unknown };
}

export async function saveAndVerifyAdminManagedWhatsAppConnection(payload: {
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  accessToken?: string;
}) {
  const { data } = await API.post("/admin/managed-whatsapp/connection", payload);
  return data as AdminManagedWhatsAppStatus;
}

export async function getAdminManagedWhatsAppHealth() {
  const { data } = await API.get("/admin/managed-whatsapp/health");
  return data as { success?: boolean; health: AdminManagedWhatsAppHealth } & AdminManagedWhatsAppHealth;
}

export async function testAdminManagedWhatsAppConnection() {
  const { data } = await API.post("/admin/managed-whatsapp/test");
  return data as { success?: boolean; health: AdminManagedWhatsAppHealth } & AdminManagedWhatsAppHealth;
}

export async function syncAdminManagedWhatsAppTemplates() {
  const { data } = await API.post("/admin/managed-whatsapp/sync-templates");
  return data as AdminManagedWhatsAppStatus & {
    sync?: {
      synced: number;
      totalFromMeta: number;
      counts: AdminManagedWhatsAppStatus["templates"];
      lastTemplatesSyncAt?: string;
    };
  };
}

export async function registerAdminManagedWhatsAppPhone(pin: string) {
  const { data } = await API.post("/admin/managed-whatsapp/register", { pin });
  return data as AdminManagedWhatsAppStatus;
}

export async function listAdminManagedWhatsAppAudit(limit = 50) {
  const { data } = await API.get("/admin/managed-whatsapp/audit", {
    params: { limit },
  });
  return data as { success: boolean; items: AdminManagedWhatsAppAuditItem[] };
}
