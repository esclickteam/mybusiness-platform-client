import API from "../api";

export type OutlookConnectionStatus =
  | "connected"
  | "expired"
  | "needs_reconnect"
  | "revoked"
  | "error"
  | "disconnected";

export type OutlookPublicAccount = {
  id: string;
  businessId: string;
  provider: "microsoft";
  service: "outlook";
  microsoftUserId?: string;
  tenantId?: string;
  email: string;
  displayName: string;
  connectionStatus: OutlookConnectionStatus;
  grantedScopes: string[];
  hasMailSend?: boolean;
  connectedAt?: string | null;
  lastUsedAt?: string | null;
  lastVerifiedAt: string | null;
  lastError?: string;
};

export type OutlookStatusResponse = {
  success: boolean;
  available: boolean;
  globallyEnabled?: boolean;
  message?: string;
  account: OutlookPublicAccount | null;
  redirectUri?: string;
};

export async function getOutlookStatus(businessId: string) {
  const { data } = await API.get<OutlookStatusResponse>(
    "/integrations/microsoft/status",
    { params: { businessId } }
  );
  return data;
}

export async function getOutlookConnectUrl(
  businessId: string,
  returnUrl?: string
) {
  const { data } = await API.get<{ success: boolean; url: string }>(
    "/integrations/microsoft/connect",
    { params: { businessId, returnUrl: returnUrl || "" } }
  );
  return data;
}

export async function disconnectOutlook(businessId: string) {
  const { data } = await API.post("/integrations/microsoft/disconnect", {
    businessId,
  });
  return data;
}

export async function reconnectOutlook(businessId: string, returnUrl?: string) {
  const { data } = await API.post<{ success: boolean; url: string }>(
    "/integrations/microsoft/reconnect",
    { businessId, returnUrl: returnUrl || "" }
  );
  return data;
}

export async function testOutlookSend(payload: {
  businessId: string;
  to: string;
  confirm: boolean;
  subject?: string;
  html?: string;
  text?: string;
}) {
  const { data } = await API.post(
    "/integrations/microsoft/test-email",
    payload
  );
  return data;
}
