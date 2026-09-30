import { describe, expect, it } from "vitest";
import type { WhatsAppConnection } from "../../../../api/whatsappApi";
import {
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

  it("hides phone registration and does not block when readyToSend", () => {
    const alerts = visibleWhatsAppAlerts(connected);
    expect(alerts.some((row) => row.key === "phone_registration")).toBe(false);
    expect(alerts.find((row) => row.key === "messaging")?.level).toBe("warning");
    expect(alerts.find((row) => row.key === "business_verification")?.level).toBe(
      "info"
    );
    expect(alerts.every((row) => row.level !== "blocking")).toBe(true);
  });
});
