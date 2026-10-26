import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { INVISTIMO_BUSINESS_ID } from "../../../../utils/invistimoAdmin";

const getConfig = vi.fn();
const getStatus = vi.fn();

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => {} },
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "he" },
  }),
}));

vi.mock("../../../../utils/apiErrorMessage", () => ({
  getApiErrorMessage: () => "error",
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../../../api/whatsappApi", () => ({
  getWhatsAppEmbeddedSignupConfig: (...args: unknown[]) => getConfig(...args),
  getWhatsAppStatus: (...args: unknown[]) => getStatus(...args),
  getInvistimoShareReadiness: vi.fn(),
  runInvistimoTemplateMigrationDryRun: vi.fn(),
  completeWhatsAppEmbeddedSignup: vi.fn(),
  getWhatsAppStagingStatus: vi.fn(async () => null),
  getInvistimoWhatsAppMigration: vi.fn(async () => null),
  saveInvistimoWhatsAppInventory: vi.fn(),
  runInvistimoWhatsAppDryRun: vi.fn(),
  discardWhatsAppStaging: vi.fn(),
  activateWhatsAppStaging: vi.fn(),
  validateWhatsAppStaging: vi.fn(),
  registerPendingWhatsAppPhone: vi.fn(),
  registerWhatsAppPhone: vi.fn(),
  retryPendingWhatsAppWebhook: vi.fn(),
  disconnectWhatsApp: vi.fn(),
  sendWhatsAppTest: vi.fn(),
  listWhatsAppTemplates: vi.fn(async () => []),
  startWhatsAppVoiceVerification: vi.fn(),
  getWhatsAppVoiceVerificationStatus: vi.fn(),
  consumeWhatsAppVoiceOtp: vi.fn(),
  requestWhatsAppVoiceVerificationCode: vi.fn(),
  submitWhatsAppVoiceVerificationCode: vi.fn(),
}));

vi.mock("../../../../utils/loadFacebookSdk", () => ({
  loadFacebookSdk: vi.fn(async () => ({})),
}));

vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { businessId: INVISTIMO_BUSINESS_ID, subscriptionPlan: "crm" },
  }),
}));

vi.mock("../../../dev/whatsappVisualQaContext", () => ({
  useWhatsAppVisualQaOverride: () => null,
}));

import WhatsAppSettingsTab from "./WhatsAppSettingsTab";

describe("INVISTIMO share panel placement while disconnected", () => {
  beforeEach(() => {
    getConfig.mockReset();
    getStatus.mockReset();
    getConfig.mockResolvedValue({
      success: true,
      ready: true,
      invistimoAccountShare: { shareExecutionAllowed: true },
    });
    getStatus.mockResolvedValue({
      connected: false,
      canConnectOwnNumber: false,
      embeddedSignup: { ready: true, encryptionReady: true },
      usingManagedWithoutPrivate: true,
    });
  });

  it("shows the share-only CTA when Bizuply connection.connected is false", async () => {
    render(
      <MemoryRouter initialEntries={["/whatsapp/connection"]}>
        <Routes>
          <Route
            path="/whatsapp"
            element={<Outlet context={{ businessId: INVISTIMO_BUSINESS_ID }} />}
          >
            <Route path="connection" element={<WhatsAppSettingsTab />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "whatsapp.settings.invistimoShareStart",
        })
      ).toBeInTheDocument();
    });
    expect(getConfig).toHaveBeenCalledWith(INVISTIMO_BUSINESS_ID);
    expect(
      screen.getByText("whatsapp.settings.invistimoShareGenericConnectBlocked")
    ).toBeInTheDocument();
  });
});
