import { describe, expect, it } from "vitest";
import {
  automationWhatsAppGate,
  pickAutomationSenderRequest,
} from "./automationWhatsAppConnection";

describe("automation WhatsApp connection gate", () => {
  it("shows connected and hides reconnect when the routed sender is ready", () => {
    expect(
      automationWhatsAppGate({
        readyToSend: true,
        authorized: true,
        needsReconnect: true,
        showConnect: true,
        message: "stale",
      })
    ).toEqual({
      state: "connected",
      showReconnect: false,
      showConnect: false,
      message: "",
    });
  });

  it("shows reconnect only when the selected sender itself needs it", () => {
    const gate = automationWhatsAppGate({
      readyToSend: false,
      authorized: true,
      needsReconnect: true,
      showConnect: true,
      message: "הטוקן פג",
    });
    expect(gate.state).toBe("reconnect");
    expect(gate.showReconnect).toBe(true);
    expect(gate.showConnect).toBe(true);
    expect(gate.message).toBe("הטוקן פג");
  });

  it("does not offer a connect button when the central number is not authorized", () => {
    const gate = automationWhatsAppGate({
      readyToSend: false,
      authorized: false,
      needsReconnect: false,
      showConnect: false,
      message: "העסק אינו מורשה לשלוח מהמספר המרכזי של Bizuply.",
    });
    expect(gate.state).toBe("unauthorized");
    expect(gate.showReconnect).toBe(false);
    expect(gate.showConnect).toBe(false);
  });

  it("asks to connect only when the business number is actually missing", () => {
    const gate = automationWhatsAppGate({
      readyToSend: false,
      authorized: true,
      needsReconnect: false,
      showConnect: true,
      code: "WHATSAPP_NOT_CONNECTED",
      message: "יש לחבר את חשבון ה-WhatsApp של העסק.",
    });
    expect(gate.state).toBe("missing");
    expect(gate.showReconnect).toBe(false);
    expect(gate.showConnect).toBe(true);
  });

  it("uses a fresh server choice until the user picks a sender", () => {
    expect(pickAutomationSenderRequest(null)).toBe("auto");
    expect(pickAutomationSenderRequest("")).toBe("auto");
    expect(pickAutomationSenderRequest("business_connected")).toBe(
      "business_connected"
    );
    expect(pickAutomationSenderRequest("bizuply_managed")).toBe(
      "bizuply_managed"
    );
  });
});
