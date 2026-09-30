import { describe, expect, it } from "vitest";
import type { WhatsAppConnection } from "../../../../api/whatsappApi";
import {
  calmWhatsAppStatusRows,
  isCloudApiPhoneConnected,
  visibleWhatsAppAlerts,
} from "./whatsappStatusUx";

const connected: WhatsAppConnection = {
  connected: true,
  readyToSend: true,
  status: "connected",
  phoneNumberId: "pn-1",
  wabaId: "waba-1",
  wabaName: "Biz",
  displayPhoneNumber: "+972 50-000-0000",
  verifiedName: "Biz",
  qualityRating: "GREEN",
  messagingLimitTier: "TIER_1K",
  hasAccessToken: true,
  usingEnvFallback: false,
  lastError: "",
  connectedAt: null,
  phonePlatformStatus: "CONNECTED",
  phonePlatformType: "CLOUD_API",
  canSendMessage: "LIMITED",
  businessVerificationStatus: "not_verified",
  alerts: [
    {
      key: "phone_registration",
      severity: "warning",
      i18nKey: "whatsapp.alerts.phoneRegistrationRequired",
    },
    {
      key: "code_verification",
      severity: "warning",
      i18nKey: "whatsapp.alerts.codeVerificationExpired",
    },
    {
      key: "business_verification",
      severity: "error",
      i18nKey: "whatsapp.alerts.businessVerification",
      raw: { businessVerificationStatus: "not_verified" },
    },
    {
      key: "messaging",
      severity: "error",
      i18nKey: "whatsapp.alerts.messagingLimited",
      raw: { canSendMessage: "LIMITED" },
    },
  ],
};

describe("whatsappStatusUx", () => {
  it("treats CONNECTED Cloud API as registered", () => {
    expect(isCloudApiPhoneConnected(connected)).toBe(true);
  });

  it("shows a calm status card and no banners when readyToSend", () => {
    expect(visibleWhatsAppAlerts(connected)).toEqual([]);
    const rows = calmWhatsAppStatusRows(connected);
    expect(rows?.map((row) => row.titleKey)).toEqual([
      "whatsapp.accountStatus.ready",
      "whatsapp.accountStatus.codeManagedTitle",
      "whatsapp.accountStatus.verificationManagedTitle",
      "whatsapp.accountStatus.sendAvailableTitle",
    ]);
  });

  it("keeps a blocking banner when messaging is blocked", () => {
    const blocked = {
      ...connected,
      readyToSend: false,
      canSendMessage: "BLOCKED",
      alerts: [
        {
          key: "messaging",
          severity: "error",
          i18nKey: "whatsapp.alerts.messagingBlocked",
          raw: { canSendMessage: "BLOCKED" },
        },
      ],
    };
    const alerts = visibleWhatsAppAlerts(blocked);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].level).toBe("blocking");
    expect(calmWhatsAppStatusRows(blocked)).toBeNull();
  });
});
