import API from "../api";

export type GmailConnectionStatus =
  | "connected"
  | "expired"
  | "revoked"
  | "error"
  | "disconnected";

export type GmailPublicAccount = {
  id: string;
  businessId: string;
  provider: "google";
  service: "gmail";
  email: string;
  displayName: string;
  connectionStatus: GmailConnectionStatus;
  grantedScopes: string[];
  hasGmailSend: boolean;
  lastVerifiedAt: string | null;
};

export type GmailStatusResponse = {
  success: boolean;
  available: boolean;
  globallyEnabled?: boolean;
  message?: string;
  account: GmailPublicAccount | null;
  redirectUri?: string;
};

export async function getGmailStatus(businessId: string) {
  const { data } = await API.get<GmailStatusResponse>(
    "/integrations/google/gmail/status",
    { params: { businessId } }
  );
  return data;
}

export async function getGmailConnectUrl(
  businessId: string,
  returnUrl?: string
) {
  const { data } = await API.get<{ success: boolean; url: string }>(
    "/integrations/google/gmail/connect",
    { params: { businessId, returnUrl: returnUrl || "" } }
  );
  return data;
}

export async function disconnectGmail(businessId: string) {
  const { data } = await API.post("/integrations/google/gmail/disconnect", {
    businessId,
  });
  return data;
}

export async function reconnectGmail(businessId: string, returnUrl?: string) {
  const { data } = await API.post<{ success: boolean; url: string }>(
    "/integrations/google/gmail/reconnect",
    { businessId, returnUrl: returnUrl || "" }
  );
  return data;
}

export async function testGmailSend(payload: {
  businessId: string;
  to: string;
  confirm: boolean;
  subject?: string;
  html?: string;
  text?: string;
}) {
  const { data } = await API.post("/integrations/google/gmail/test", payload);
  return data;
}