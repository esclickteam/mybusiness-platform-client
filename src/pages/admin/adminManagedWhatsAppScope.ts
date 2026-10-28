export const ADMIN_MANAGED_PAGE_CONNECTION_ID = "US_MANAGED";

export const ADMIN_MANAGED_PAGE_SLOT = {
  connectionId: ADMIN_MANAGED_PAGE_CONNECTION_ID,
  flag: "🇺🇸",
  label: "USA",
  country: "US",
  expectedDisplayPhone: "+1 210 944 4809",
};

export function isAuthorizedAdminManagedConnection(connectionId?: string | null) {
  return (
    String(connectionId || "").trim().toUpperCase() ===
    ADMIN_MANAGED_PAGE_CONNECTION_ID
  );
}

export function isManagedConnectionReady(conn?: {
  credentialsConfigured?: boolean;
  connectionStatus?: string;
} | null) {
  if (conn?.credentialsConfigured) return true;
  const status = String(conn?.connectionStatus || "").toUpperCase();
  return status === "READY" || status === "CONNECTED";
}

export function shouldShowManagedConnectButton(conn?: {
  connectionId?: string;
  credentialsConfigured?: boolean;
  connectionStatus?: string;
} | null) {
  if (!isAuthorizedAdminManagedConnection(conn?.connectionId)) return false;
  return !isManagedConnectionReady(conn);
}

export function adminManagedWhatsAppCopy(language?: string) {
  const english = String(language || "").toLowerCase().startsWith("en");
  if (english) {
    return {
      title: "WhatsApp API",
      description:
        "Bizuply's managed US WhatsApp connection only. Status, templates, and connection tools stay on the authorized American number.",
      notConnected: "Not connected to WhatsApp",
      connect: "Connect WhatsApp",
      connecting: "Connecting…",
      ready: "Ready to send",
      connected: "Connected",
      pinNeeded: "Connected · PIN required to register",
      noAccess: "You do not have permission to view this page.",
      systemStatus: "System status",
      connectionIntro:
        "United States connection via Embedded Signup. Status, health, and PIN registration only.",
    };
  }
  return {
    title: "WhatsApp API",
    description:
      "החיבור האמריקאי המנוהל של Bizuply בלבד. סטטוס, תבניות וכלי החיבור נשארים על המספר האמריקאי המורשה.",
    notConnected: "לא מחובר ל-WhatsApp",
    connect: "חבר WhatsApp",
    connecting: "מתחבר…",
    ready: "מוכן לשליחה",
    connected: "מחובר",
    pinNeeded: "מחובר · נדרש PIN לרישום",
    noAccess: "אין הרשאה לצפות בעמוד זה.",
      systemStatus: "סטטוס מערכת",
      connectionIntro:
        "חיבור ארצות הברית דרך Embedded Signup. סטטוס, בריאות ורישום PIN בלבד.",
    };
}
