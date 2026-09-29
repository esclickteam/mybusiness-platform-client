import type { WhatsAppConnection } from "../../../../api/whatsappApi";

function alertFingerprint(
  alerts: WhatsAppConnection["alerts"]
): string {
  return (alerts || [])
    .map((row) =>
      [row.key, row.severity || "", row.i18nKey || ""].join(":")
    )
    .sort()
    .join("|");
}

/**
 * UX-visible connection state. Ignores cache vs live metadata
 * (statusSource, lastMetaSyncAt, raw Graph dumps) so an identical
 * Meta snapshot does not remount the Messages screen.
 */
export function connectionUxFingerprint(
  connection: WhatsAppConnection | null | undefined
): string {
  if (!connection) return "";
  const billing = connection.wabaBillingHealth;
  return JSON.stringify({
    connected: Boolean(connection.connected),
    readyToSend: Boolean(connection.readyToSend),
    readiness: connection.readiness || "",
    registrationStatus: connection.registrationStatus || "",
    phoneRegistered: Boolean(connection.phoneRegistered),
    phonePlatformStatus: connection.phonePlatformStatus || "",
    phonePlatformType: connection.phonePlatformType || "",
    codeVerificationStatus: connection.codeVerificationStatus || "",
    status: connection.status || "",
    displayPhoneNumber: connection.displayPhoneNumber || "",
    verifiedName: connection.verifiedName || "",
    qualityRating: connection.qualityRating || "",
    messagingLimitTier: connection.messagingLimitTier || "",
    nameStatus: connection.nameStatusDisplay || connection.nameStatus || "",
    canSendMessage: connection.canSendMessage || "",
    businessVerificationStatus: connection.businessVerificationStatus || "",
    accountReviewStatus: connection.accountReviewStatus || "",
    wabaPlatformStatus: connection.wabaPlatformStatus || "",
    paymentStatusRaw: connection.paymentStatusRaw || "",
    managedReady: Boolean(connection.managedReady),
    usingManagedWithoutPrivate: Boolean(connection.usingManagedWithoutPrivate),
    alerts: alertFingerprint(connection.alerts),
    billing: billing
      ? {
          paymentStatus: billing.paymentStatus || "",
          severity: billing.severity || "",
          ok: Boolean(billing.ok),
          actionRequired: Boolean(billing.actionRequired),
          hasPaymentMethod: billing.hasPaymentMethod ?? null,
          issues: billing.issues || [],
        }
      : null,
  });
}

export function connectionUxEquals(
  a: WhatsAppConnection | null | undefined,
  b: WhatsAppConnection | null | undefined
): boolean {
  return connectionUxFingerprint(a) === connectionUxFingerprint(b);
}
