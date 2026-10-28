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

const HEBREW_COPY = {
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
  dateLocale: "he-IL",
  statusActive: "פעיל",
  statusInactive: "כבוי",
  wabaConnected: "WABA מחובר",
  wabaDisconnected: "WABA לא מחובר",
  phoneConnected: "Phone Number מחובר",
  phoneDisconnected: "Phone Number לא מחובר",
  tokenConfigured: "Access Token: Configured",
  tokenMissing: "Access Token: Missing",
  connectionReadyLabel: "Connection: READY",
  connectionConfiguredLabel: "Connection: CONFIGURED",
  connectionNotReady: "Connection: NOT READY",
  registrationRegistered: "רישום לשליחה: רשום",
  registrationPinNeeded: "רישום לשליחה: נדרש PIN",
  statusScopeNote:
    "סטטוסים אלה משקפים רק את החיבור המרכזי של Bizuply — לא חיבורי עסקים פרטיים.",
  enableManaged: "הפעל WhatsApp מנוהל לכל העסקים",
  approvedTemplates: "תבניות APPROVED (Meta)",
  templatesAfterReady: "יוצג רק אחרי חיבור READY + סנכרון",
  registrationLabel: "רישום לשליחה",
  registered: "רשום",
  pinRequired: "נדרש PIN",
  phoneMasked: "טלפון (מוסתר)",
  lastSync: "סנכרון אחרון",
  lastConnectionError: "שגיאת חיבור אחרונה",
  none: "אין",
  businessConnections: "חיבורי עסקים (נפרד מהפלטפורמה)",
  privateConnected: "עסקים עם WhatsApp פרטי מחובר",
  privateDisconnected: "עסקים מנותקים (פרטי)",
  modeOnExplain:
    "כאשר פעיל: המספר המרכזי זמין רק לעסק הפלטפורמה. כל עסק אחר שולח רק מחיבור ה-WhatsApp שלו.",
  modeOffExplain:
    "כאשר כבוי: גם עסק הפלטפורמה לא שולח מהמספר המרכזי. עסקים אחרים תמיד שולחים רק מהחיבור שלהם.",
  syncNeedConnection: "יש לשמור ולבדוק חיבור לפני סנכרון תבניות",
  syncing: "מסנכרן…",
  syncTemplates: "סנכרון תבניות Meta",
  enterPin: "הזן PIN לרישום",
  openInbox: "Open Inbox",
  templates: "Templates",
  connectionStatus: "Connection status",
  reconnect: "Reconnect",
  loading: "טוען…",
  centralConnection: "חיבור WhatsApp מרכזי",
  missingBusinessId:
    "חסר BIZUPLY_MANAGED_WHATSAPP_BUSINESS_ID בשרת — לא ניתן לשמור חיבור בלי מזהה עסק מרכזי.",
  pinTitle: "רישום מספר לשליחה (PIN)",
  pinBodyBefore:
    "חיבור WABA יכול להיות READY ועדיין חסום לשליחה. Meta דורשת רישום חד-פעמי עם PIN דו-שלבי של 6 ספרות של המספר",
  pinBodyAfter:
    ". זה לא קוד SMS — זה ה-PIN שהוגדר ב-Meta Business Manager למספר.",
  pinLabel: "PIN דו-שלבי",
  registering: "רושם מול Meta…",
  registerPhone: "רישום מספר לשליחה",
  authorizedBusinesses: "עסקים מורשים",
  allowlistHelp:
    "All entitled משתמש ב-entitlement / allowlist הקיימים. Allowlist מגביל לרשימת מזהי עסקים בלבד.",
  allEntitled: "All entitled businesses",
  allowlist: "Allowlist",
  allowlistPlaceholder: "businessId לכל שורה",
  saveAllowlist: "שמור Allowlist",
  billingTitle: "WhatsApp usage billing — margin",
  refresh: "רענון",
  loadingReport: "טוען דוח...",
  messages: "הודעות",
  charge: "חיוב ₪",
  metaCost: "עלות Meta ₪",
  margin: "מרווח ₪",
  business: "Business",
  msgs: "Msgs",
  noBilledUsage: "אין שימוש מחויב עדיין",
  auditLog: "Audit log",
  auditEmpty: "אין פעולות עדיין",
  loadStatusFailed: "טעינת הסטטוס נכשלה",
  loadMarginFailed: "טעינת דוח המרווח נכשלה",
  signupMissing: "חסרה הגדרת Embedded Signup בשרת",
  signupNotReady: "Embedded Signup אינו מוכן — בדוק META_APP_SECRET והרשאות",
  signupCancelled: "חיבור Meta בוטל",
  signupAssetsMissing: "חסרים phone_number_id / waba_id מ-Embedded Signup",
  signupUsaDone: "חיבור USA הושלם — Embedded Signup + רישום",
  signupUsaPin:
    "חיבור USA נשמר מול Meta — הזינו PIN דו-שלבי להשלמת הרישום לשליחה",
  signupFailed: "השלמת Embedded Signup נכשלה",
  signupConnectFailed: "חיבור Embedded Signup נכשל",
  saveSettingsFailed: "שמירת ההגדרה נכשלה",
  saveAllowlistFailed: "שמירת allowlist נכשלה",
  pinInvalid: "הזינו PIN דו-שלבי בן 6 ספרות",
  registeredCanSend: "המספר נרשם מול Meta — אפשר לשלוח הודעות",
  registeredNotReady: "הרישום נשלח, אך המספר עדיין לא מסומן כמוכן לשליחה",
  registerFailed: "רישום המספר נכשל",
  syncFailed: "סנכרון תבניות נכשל",
  healthConnected: "מחובר ותקין",
  healthDegraded: "מחובר אך קיימת בעיה",
  healthFailed: "החיבור אינו תקין",
  healthUnset: "לא הוגדר",
  connectionState: "מצב חיבור",
  configured: "מוגדר",
  notConfigured: "לא מוגדר",
  unknown: "לא ידוע",
  cannotProve: "לא ניתן להוכיח",
  valid: "Valid",
  invalid: "Invalid",
  neverExpires: "Never expires",
  expirationProof: "הוכחת תפוגה",
  permissions: "הרשאות",
  missing: "חסר",
  notChecked: "לא נבדק",
  ok: "תקין",
  notRelevantBsp: "לא רלוונטי (לא BSP)",
  notAssigned: "לא משויך",
  errorWord: "שגיאה",
  whatsappNumber: "מספר WhatsApp",
  lastCheck: "בדיקה אחרונה",
  lastSuccessfulCheck: "בדיקה מוצלחת אחרונה",
  lastSuccessfulSend: "שליחה מוצלחת אחרונה",
  lastError: "שגיאה אחרונה",
  tokenLabel: "Token",
  tokenType: "Token type",
  tokenValidity: "Token validity",
  tokenExpiration: "Token expiration",
  wabaAssigned: "WABA assigned",
  wabaLabel: "WABA",
  managedConnection: "חיבור מנוהל",
  activeEnabled: "פעיל / מופעל",
};

const ENGLISH_COPY: typeof HEBREW_COPY = {
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
  dateLocale: "en-US",
  statusActive: "Active",
  statusInactive: "Off",
  wabaConnected: "WABA connected",
  wabaDisconnected: "WABA not connected",
  phoneConnected: "Phone number connected",
  phoneDisconnected: "Phone number not connected",
  tokenConfigured: "Access token: Configured",
  tokenMissing: "Access token: Missing",
  connectionReadyLabel: "Connection: READY",
  connectionConfiguredLabel: "Connection: CONFIGURED",
  connectionNotReady: "Connection: NOT READY",
  registrationRegistered: "Send registration: Registered",
  registrationPinNeeded: "Send registration: PIN required",
  statusScopeNote:
    "These statuses reflect only Bizuply's managed connection — not private business connections.",
  enableManaged: "Enable managed WhatsApp for all businesses",
  approvedTemplates: "APPROVED templates (Meta)",
  templatesAfterReady: "Shown only after a READY connection and a sync",
  registrationLabel: "Send registration",
  registered: "Registered",
  pinRequired: "PIN required",
  phoneMasked: "Phone (masked)",
  lastSync: "Last sync",
  lastConnectionError: "Last connection error",
  none: "None",
  businessConnections: "Business connections (separate from the platform)",
  privateConnected: "Businesses with a private WhatsApp connection",
  privateDisconnected: "Disconnected businesses (private)",
  modeOnExplain:
    "When on: the central number is available only to the platform business. Every other business sends only from its own WhatsApp connection.",
  modeOffExplain:
    "When off: the platform business also does not send from the central number. Other businesses always send only from their own connection.",
  syncNeedConnection: "Save and verify a connection before syncing templates",
  syncing: "Syncing…",
  syncTemplates: "Sync Meta templates",
  enterPin: "Enter PIN to register",
  openInbox: "Open Inbox",
  templates: "Templates",
  connectionStatus: "Connection status",
  reconnect: "Reconnect",
  loading: "Loading…",
  centralConnection: "Central WhatsApp connection",
  missingBusinessId:
    "BIZUPLY_MANAGED_WHATSAPP_BUSINESS_ID is missing on the server — a connection cannot be saved without the central business id.",
  pinTitle: "Register the number for sending (PIN)",
  pinBodyBefore:
    "A WABA connection can be READY and still blocked from sending. Meta requires a one-time registration with the 6-digit two-step PIN for",
  pinBodyAfter:
    ". This is not an SMS code — it is the PIN set in Meta Business Manager for this number.",
  pinLabel: "Two-step PIN",
  registering: "Registering with Meta…",
  registerPhone: "Register number for sending",
  authorizedBusinesses: "Authorized businesses",
  allowlistHelp:
    "All entitled uses the existing entitlement. Allowlist limits access to the listed business ids only.",
  allEntitled: "All entitled businesses",
  allowlist: "Allowlist",
  allowlistPlaceholder: "One businessId per line",
  saveAllowlist: "Save allowlist",
  billingTitle: "WhatsApp usage billing — margin",
  refresh: "Refresh",
  loadingReport: "Loading report...",
  messages: "Messages",
  charge: "Charge ₪",
  metaCost: "Meta cost ₪",
  margin: "Margin ₪",
  business: "Business",
  msgs: "Msgs",
  noBilledUsage: "No billed usage yet",
  auditLog: "Audit log",
  auditEmpty: "No actions yet",
  loadStatusFailed: "Could not load status",
  loadMarginFailed: "Could not load the margin report",
  signupMissing: "Embedded Signup is not configured on the server",
  signupNotReady: "Embedded Signup is not ready — check META_APP_SECRET and permissions",
  signupCancelled: "Meta connection was cancelled",
  signupAssetsMissing: "phone_number_id / waba_id are missing from Embedded Signup",
  signupUsaDone: "USA connection completed — Embedded Signup and registration",
  signupUsaPin:
    "USA connection was saved with Meta — enter the two-step PIN to finish send registration",
  signupFailed: "Could not finish Embedded Signup",
  signupConnectFailed: "Embedded Signup connection failed",
  saveSettingsFailed: "Could not save the setting",
  saveAllowlistFailed: "Could not save the allowlist",
  pinInvalid: "Enter a 6-digit two-step PIN",
  registeredCanSend: "The number is registered with Meta — messages can be sent",
  registeredNotReady: "Registration was sent, but the number is not marked ready to send yet",
  registerFailed: "Number registration failed",
  syncFailed: "Template sync failed",
  healthConnected: "Connected and healthy",
  healthDegraded: "Connected, with a problem",
  healthFailed: "Connection is not healthy",
  healthUnset: "Not configured",
  connectionState: "Connection state",
  configured: "Configured",
  notConfigured: "Not configured",
  unknown: "Unknown",
  cannotProve: "Cannot prove",
  valid: "Valid",
  invalid: "Invalid",
  neverExpires: "Never expires",
  expirationProof: "Expiration proof",
  permissions: "Permissions",
  missing: "Missing",
  notChecked: "Not checked",
  ok: "OK",
  notRelevantBsp: "Not applicable (not a BSP)",
  notAssigned: "Not assigned",
  errorWord: "Error",
  whatsappNumber: "WhatsApp number",
  lastCheck: "Last check",
  lastSuccessfulCheck: "Last successful check",
  lastSuccessfulSend: "Last successful send",
  lastError: "Last error",
  tokenLabel: "Token",
  tokenType: "Token type",
  tokenValidity: "Token validity",
  tokenExpiration: "Token expiration",
  wabaAssigned: "WABA assigned",
  wabaLabel: "WABA",
  managedConnection: "Managed connection",
  activeEnabled: "Active / Enabled",
};

export type AdminManagedWhatsAppCopy = typeof HEBREW_COPY;

export function adminManagedWhatsAppCopy(language?: string): AdminManagedWhatsAppCopy {
  const english = String(language || "").toLowerCase().startsWith("en");
  return english ? ENGLISH_COPY : HEBREW_COPY;
}

export function adminManagedSyncFinished(
  language: string | undefined,
  connectionId: string,
  counts?: { APPROVED?: number; PENDING?: number; REJECTED?: number }
) {
  const approved = counts?.APPROVED ?? 0;
  const pending = counts?.PENDING ?? 0;
  const rejected = counts?.REJECTED ?? 0;
  if (String(language || "").toLowerCase().startsWith("en")) {
    return `Sync finished (${connectionId}): APPROVED ${approved} · PENDING ${pending} · REJECTED ${rejected}`;
  }
  return `סנכרון הושלם (${connectionId}): APPROVED ${approved} · PENDING ${pending} · REJECTED ${rejected}`;
}
