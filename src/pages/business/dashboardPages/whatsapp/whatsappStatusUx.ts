import type { WhatsAppConnection } from "../../../../api/whatsappApi";

export type WhatsAppAlertLevel = "blocking" | "warning" | "info";

export type WhatsAppVisibleAlert = {
  key: string;
  level: WhatsAppAlertLevel;
  i18nKey: string;
  raw?: Record<string, unknown>;
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

function rawSend(raw?: Record<string, unknown>) {
  return upper(String(raw?.canSendMessage || ""));
}

export function visibleWhatsAppAlerts(
  connection: WhatsAppConnection | null | undefined
): WhatsAppVisibleAlert[] {
  const alerts = connection?.alerts || [];
  const ready = Boolean(connection?.readyToSend);
  const cloud = isCloudApiPhoneConnected(connection);

  return alerts
    .filter((row) => {
      if (row.key === "connection" && connection?.connected) return false;
      if (row.key === "phone_registration" && (cloud || ready)) return false;
      return true;
    })
    .map((row) => {
      const send = rawSend(row.raw);
      let level: WhatsAppAlertLevel =
        row.severity === "error"
          ? "blocking"
          : row.severity === "info"
            ? "info"
            : "warning";

      if (row.key === "messaging" && send === "LIMITED") {
        level = "warning";
      }
      if (row.key === "business_verification" && send !== "BLOCKED") {
        const verify = String(row.raw?.businessVerificationStatus || "").toLowerCase();
        level = verify === "not_verified" ? "info" : "warning";
      }
      if (ready && level === "blocking") {
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
