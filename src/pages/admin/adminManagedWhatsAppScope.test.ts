import { describe, expect, it } from "vitest";

import {
  ADMIN_MANAGED_PAGE_CONNECTION_ID,
  adminManagedWhatsAppCopy,
  isAuthorizedAdminManagedConnection,
  shouldShowManagedConnectButton,
} from "./adminManagedWhatsAppScope";

describe("admin managed WhatsApp page scope", () => {
  it("authorizes only the US managed connection", () => {
    expect(isAuthorizedAdminManagedConnection("US_MANAGED")).toBe(true);
    expect(isAuthorizedAdminManagedConnection("us_managed")).toBe(true);
    expect(isAuthorizedAdminManagedConnection("IL_MANAGED")).toBe(false);
    expect(ADMIN_MANAGED_PAGE_CONNECTION_ID).toBe("US_MANAGED");
  });

  it("hides Connect WhatsApp when the authorized number is already connected", () => {
    expect(
      shouldShowManagedConnectButton({
        connectionId: "US_MANAGED",
        credentialsConfigured: true,
        connectionStatus: "READY",
      })
    ).toBe(false);
    expect(
      shouldShowManagedConnectButton({
        connectionId: "US_MANAGED",
        connectionStatus: "CONNECTED",
      })
    ).toBe(false);
    expect(
      shouldShowManagedConnectButton({
        connectionId: "US_MANAGED",
        connectionStatus: "NOT_CONNECTED",
      })
    ).toBe(true);
    expect(
      shouldShowManagedConnectButton({
        connectionId: "IL_MANAGED",
        connectionStatus: "NOT_CONNECTED",
      })
    ).toBe(false);
  });

  it("uses Hebrew RTL copy and English LTR copy", () => {
    const he = adminManagedWhatsAppCopy("he");
    const en = adminManagedWhatsAppCopy("en");
    expect(he.connect).toBe("חבר WhatsApp");
    expect(he.notConnected).toBe("לא מחובר ל-WhatsApp");
    expect(he.statusActive).toBe("פעיל");
    expect(he.wabaConnected).toBe("WABA מחובר");
    expect(en.connect).toBe("Connect WhatsApp");
    expect(en.statusActive).toBe("Active");
    expect(en.statusInactive).toBe("Off");
    expect(en.wabaConnected).toBe("WABA connected");
    expect(en.wabaDisconnected).toBe("WABA not connected");
    expect(en.phoneConnected).toBe("Phone number connected");
    expect(en.registrationRegistered).toBe("Send registration: Registered");
    expect(en.description).toContain("US");
    expect(en.description.toLowerCase()).not.toContain("israel");
    expect(he.description).not.toContain("ישראל");
    expect(JSON.stringify(en)).not.toMatch(/[\u0590-\u05FF]/);
  });
});
