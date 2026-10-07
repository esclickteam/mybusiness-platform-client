import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getSettings = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue || key,
    i18n: { language: "en" },
  }),
}));
vi.mock("../../../../utils/apiErrorMessage", () => ({ getApiErrorMessage: (_e: unknown, fallback: string) => fallback }));
vi.mock("react-toastify", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("../../../../context/AuthContext", () => ({ useAuth: () => ({ user: { product: "whatsapp_api" } }) }));
vi.mock("../../../../utils/whatsappApiPortal", () => ({ isWhatsAppApiPortalUser: () => true }));
vi.mock("../../../../api/whatsappApi", () => ({
  getWhatsAppExternalApiSettings: (...args: unknown[]) => getSettings(...args),
  createWhatsAppExternalApiKey: vi.fn(),
  regenerateWhatsAppExternalApiKey: vi.fn(),
  regenerateWhatsAppExternalWebhookSecret: vi.fn(),
  revealWhatsAppExternalWebhookSecret: vi.fn(),
  revokeWhatsAppExternalApiKey: vi.fn(),
  startWhatsAppApiCheckout: vi.fn(),
  testWhatsAppExternalWebhook: vi.fn(),
  updateWhatsAppExternalWebhookUrl: vi.fn(),
}));

import WhatsAppExternalApiSettingsCard from "./WhatsAppExternalApiSettingsCard";

const CREATE = "whatsapp.settings.apiSettingsCreateKey";
const CAN_CREATE_HINT = /You can create an API key now/;

function settings(subscriptionAccess: Record<string, unknown>) {
  return { apiKey: null, webhook: null, subscriptionAccess };
}

describe("WhatsAppExternalApiSettingsCard subscription gate", () => {
  beforeEach(() => getSettings.mockReset());

  it("disables key creation and drops the 'create now' hint while the subscription is required", async () => {
    getSettings.mockResolvedValue(
      settings({ gateEnabled: true, allowed: false, selfServe: true, subscription: { status: "canceled" } })
    );
    render(<WhatsAppExternalApiSettingsCard businessId="biz1" linked={false} />);

    expect(await screen.findByText(/subscription \(\$29\/month\) is required/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: CREATE })).toBeDisabled();
    expect(screen.queryByText(CAN_CREATE_HINT)).toBeNull();
  });

  it("keeps key creation available when access is allowed", async () => {
    getSettings.mockResolvedValue(settings({ gateEnabled: true, allowed: true, subscription: { status: "active" } }));
    render(<WhatsAppExternalApiSettingsCard businessId="biz1" linked={false} />);

    expect(await screen.findByRole("button", { name: CREATE })).toBeEnabled();
    expect(screen.getByText(CAN_CREATE_HINT)).toBeInTheDocument();
  });
});
