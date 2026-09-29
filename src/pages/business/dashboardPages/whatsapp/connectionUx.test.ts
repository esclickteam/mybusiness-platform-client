import { connectionUxEquals } from "./connectionUx";
import type { WhatsAppConnection } from "../../../../api/whatsappApi";

function sample(
  extra: Partial<WhatsAppConnection> = {}
): WhatsAppConnection {
  return {
    connected: true,
    readyToSend: true,
    readiness: "ready",
    registrationStatus: "registered",
    phoneRegistered: true,
    phonePlatformStatus: "CONNECTED",
    phonePlatformType: "CLOUD_API",
    codeVerificationStatus: "EXPIRED",
    status: "connected",
    phoneNumberId: "1",
    wabaId: "2",
    displayPhoneNumber: "+972",
    verifiedName: "Eshet",
    hasAccessToken: true,
    usingEnvFallback: false,
    lastError: "",
    connectedAt: null,
    alerts: [
      { key: "code_expired", severity: "warning" },
      { key: "business_verification", severity: "warning" },
    ],
    ...extra,
  };
}

describe("connectionUxEquals", () => {
  it("treats cache vs live metadata as the same UX state", () => {
    const cached = sample({
      lastMetaSyncAt: "2026-01-01T00:00:00.000Z",
    });
    const live = sample({
      lastMetaSyncAt: "2026-09-29T20:00:00.000Z",
      lastTemplatesSyncAt: "2026-09-29T20:00:00.000Z",
    });
    expect(connectionUxEquals(cached, live)).toBe(true);
  });

  it("detects a visible readiness change", () => {
    expect(
      connectionUxEquals(
        sample({ readyToSend: true, readiness: "ready" }),
        sample({ readyToSend: false, readiness: "error" })
      )
    ).toBe(false);
  });
});
