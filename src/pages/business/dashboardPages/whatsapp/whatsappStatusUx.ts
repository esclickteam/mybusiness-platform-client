import type { WhatsAppConnection } from "../../../../api/whatsappApi";

export type WhatsAppAlertLevel = "blocking" | "warning" | "info";

export type WhatsAppVisibleAlert = {
  key: string;
  level: WhatsAppAlertLevel;
  i18nKey: string;
  raw?: Record<string, unknown>;
};

export type WhatsAppCalmStatusRow = {
  titleKey: string;
  hintKey: string;
};

function upper(value?: string | null) {
  return String(value || "").trim().toUpperCase();
}

export function isCloudApiPhoneConnected(
  connection: WhatsAppConnection | null | undefined
): boolean {
  if (!connection?.connected) return false;
  if (!connection.phoneNumberId || !connection.wabaId) return false;
  const status = upper(connection.phonePlatformStatus);
  const platform = upper(connection.phonePlatformType);
  if (status !== "CONNECTED") return false;
  return !platform || platform === "CLOUD_API" || platform === "NOT_APPLICABLE";
}

const REGISTRATION_ERROR_KEYS: Record<string, string> = {
  REGISTER_PIN_MISMATCH: "whatsapp.settings.registrationErrorPinMismatch",
  REGISTER_PIN_GUESSES_EXCEEDED: "whatsapp.settings.registrationErrorPinGuesses",
  ACCOUNT_NOT_REGISTERED: "whatsapp.settings.registrationErrorNotRegistered",
  REGISTER_RATE_LIMITED: "whatsapp.settings.registrationErrorRateLimit",
  REGISTER_WAIT: "whatsapp.settings.registrationErrorWait",
  TOKEN_AUTH_FAILED: "whatsapp.settings.registrationErrorToken",
  MISSING_PERMISSION: "whatsapp.settings.registrationErrorPermission",
  REGISTER_IN_PROGRESS: "whatsapp.settings.registrationErrorInProgress",
  REGISTER_ATTEMPTS_EXCEEDED: "whatsapp.settings.registrationErrorAttempts",
  REGISTER_WINDOW_EXPIRED: "whatsapp.settings.registrationErrorWindow",
  REGISTER_PIN_MISSING: "whatsapp.settings.pinRequired",
};

export function registrationFailureMessage(
  code: string | undefined,
  t: (key: string, fallback?: string) => string
): string {
  const key = REGISTRATION_ERROR_KEYS[String(code || "")] || "whatsapp.settings.registrationErrorGeneric";
  return t(key, t("whatsapp.settings.registrationErrorGeneric", "Registration did not finish."));
}

export function isWhatsAppReadyToSend(
  connection: WhatsAppConnection | null | undefined
): boolean {
  return Boolean(
    connection?.connected &&
      connection.phoneNumberId &&
      connection.wabaId &&
      connection.readyToSend
  );
}

function rawSend(raw?: Record<string, unknown>, fallback?: string) {
  return upper(String(raw?.canSendMessage || fallback || ""));
}

function isRealSendBlock(connection: WhatsAppConnection | null | undefined, row: {
  key: string;
  raw?: Record<string, unknown>;
}) {
  const send = rawSend(row.raw, connection?.canSendMessage);
  if (row.key === "messaging" && send === "BLOCKED") return true;
  if (row.key === "phone_registration") return true;
  if (row.key === "waba_status") return true;
  if (row.key === "payment" && send === "BLOCKED") return true;
  return false;
}

export function visibleWhatsAppAlerts(
  connection: WhatsAppConnection | null | undefined
): WhatsAppVisibleAlert[] {
  const alerts = connection?.alerts || [];
  const ready = isWhatsAppReadyToSend(connection);
  const cloud = isCloudApiPhoneConnected(connection);

  if (ready && cloud) return [];

  return alerts
    .filter((row) => {
      if (row.key === "connection" && connection?.connected) return false;
      if (row.key === "phone_registration" && ready) return false;
      if (ready && !isRealSendBlock(connection, row)) return false;
      return true;
    })
    .map((row) => {
      const send = rawSend(row.raw, connection?.canSendMessage);
      let level: WhatsAppAlertLevel = isRealSendBlock(connection, row)
        ? "blocking"
        : row.severity === "error"
          ? "blocking"
          : "warning";
      if (row.key === "messaging" && send === "LIMITED") level = "warning";
      if (ready && level === "blocking" && !isRealSendBlock(connection, row)) {
        level = "warning";
      }
      return {
        key: row.key,
        level,
        i18nKey: row.i18nKey || "whatsapp.hub.issue",
        raw: row.raw,
      };
    });
}

export function calmWhatsAppStatusRows(
  connection: WhatsAppConnection | null | undefined
): WhatsAppCalmStatusRow[] | null {
  if (!isWhatsAppReadyToSend(connection) || !isCloudApiPhoneConnected(connection)) {
    return null;
  }

  const alerts = connection?.alerts || [];
  const hasExpiredCode = alerts.some((row) => row.key === "code_verification");

  const rows: WhatsAppCalmStatusRow[] = [
    {
      titleKey: "whatsapp.accountStatus.ready",
      hintKey: "whatsapp.accountStatus.readyHint",
    },
  ];

  if (hasExpiredCode) {
    rows.push({
      titleKey: "whatsapp.accountStatus.codeManagedTitle",
      hintKey: "whatsapp.accountStatus.codeManagedHint",
    });
  }

  rows.push({
    titleKey: "whatsapp.accountStatus.verificationManagedTitle",
    hintKey: "whatsapp.accountStatus.verificationManagedHint",
  });

  rows.push({
    titleKey: "whatsapp.accountStatus.sendAvailableTitle",
    hintKey: "whatsapp.accountStatus.sendAvailableHint",
  });

  return rows;
}
