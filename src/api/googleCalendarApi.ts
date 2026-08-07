import API from "../api";

export type GoogleCalendarConnectionStatus =
  | "connected"
  | "expired"
  | "needs_reconnect"
  | "revoked"
  | "error"
  | "disconnected";

export type GoogleCalendarPublicAccount = {
  id: string;
  businessId: string;
  provider: "google";
  service: "gmail";
  email: string;
  displayName: string;
  connectionStatus: GoogleCalendarConnectionStatus;
  grantedScopes: string[];
  hasGmailSend: boolean;
  hasCalendarEvents: boolean;
  calendarEnabled: boolean;
  calendarConnected: boolean;
  lastVerifiedAt: string | null;
};

export type GoogleCalendarStatusInfo = {
  status:
    | "not_connected"
    | "connected"
    | "needs_grant"
    | "needs_reconnect";
  connected: boolean;
  needsGrant: boolean;
  needsReconnect: boolean;
  canEnableLocally: boolean;
  googleEmail: string;
  hasGmailSend?: boolean;
  hasCalendarEvents?: boolean;
  calendarEnabled?: boolean;
  scope?: string;
};

export type GoogleCalendarStatusResponse = {
  success: boolean;
  available: boolean;
  globallyEnabled?: boolean;
  message?: string;
  account: GoogleCalendarPublicAccount | null;
  calendar: GoogleCalendarStatusInfo | null;
  redirectUri?: string;
  enabledLocally?: boolean;
};

export async function getGoogleCalendarStatus(businessId: string) {
  const { data } = await API.get<GoogleCalendarStatusResponse>(
    "/integrations/google/calendar/status",
    { params: { businessId } }
  );
  return data;
}

export async function getGoogleCalendarConnectUrl(
  businessId: string,
  returnUrl?: string
) {
  const { data } = await API.get<{
    success: boolean;
    url?: string;
    enabledLocally?: boolean;
    account?: GoogleCalendarPublicAccount;
  }>("/integrations/google/calendar/connect", {
    params: { businessId, returnUrl: returnUrl || "" },
  });
  return data;
}

export async function disconnectGoogleCalendar(businessId: string) {
  const { data } = await API.post("/integrations/google/calendar/disconnect", {
    businessId,
  });
  return data;
}

export async function reconnectGoogleCalendar(
  businessId: string,
  returnUrl?: string
) {
  const { data } = await API.post<{ success: boolean; url: string }>(
    "/integrations/google/calendar/reconnect",
    { businessId, returnUrl: returnUrl || "" }
  );
  return data;
}
