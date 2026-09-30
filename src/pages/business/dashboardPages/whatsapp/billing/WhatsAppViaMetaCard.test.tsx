import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import WhatsAppViaMetaCard from "./WhatsAppViaMetaCard";
import type { WhatsAppConnection } from "../../../../../api/whatsappApi";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: "en" },
  }),
}));

vi.mock("../../../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { role: "business" } }),
}));

const connection: WhatsAppConnection = {
  connected: true,
  readyToSend: true,
  status: "connected",
  phoneNumberId: "1",
  wabaId: "1795723778519344",
  wabaName: "eshet-design",
  displayPhoneNumber: "+972 51-584-0471",
  verifiedName: "eshet-design",
  qualityRating: "GREEN",
  messagingLimitTier: "TIER_1K",
  metaBusinessId: "497710782903804",
  metaBusinessName: "eshet-design",
  hasAccessToken: true,
  usingEnvFallback: false,
  lastError: "",
  connectedAt: null,
  businessVerificationStatus: "not_verified",
  wabaPlatformStatus: "ACTIVE",
  wabaBillingHealth: {
    kind: "whatsapp_waba",
    billingOwner: "whatsapp_waba",
    billingSeparationNote: "",
    connected: true,
    wabaId: "1795723778519344",
    wabaName: "eshet-design",
    status: "ACTIVE",
    businessVerificationStatus: "not_verified",
    businessVerificationLabel: "Not verified",
    hasPaymentMethod: false,
    severity: "warning",
    ok: false,
    actionRequired: true,
    issues: [],
    manageBillingUrl:
      "https://business.facebook.com/latest/settings/whatsapp_account/?business_id=497710782903804&selected_asset_id=1795723778519344",
    whatsappManagerUrl:
      "https://business.facebook.com/latest/whatsapp_manager/overview/?business_id=497710782903804&asset_id=1795723778519344",
    verificationUrl:
      "https://business.facebook.com/latest/settings/security_center?business_id=497710782903804",
  },
};

describe("WhatsAppViaMetaCard", () => {
  it("shows Meta billing CTAs and payment-required warning", () => {
    const open = vi.fn();
    vi.stubGlobal("open", open);
    render(<WhatsAppViaMetaCard connection={connection} />);
    expect(screen.getByText("whatsapp.viaMeta.billingTitle")).toBeTruthy();
    expect(screen.getByText("whatsapp.viaMeta.chargesByMeta")).toBeTruthy();
    expect(screen.getByText("whatsapp.viaMeta.paymentRequiredTitle")).toBeTruthy();
    expect(screen.queryByText("whatsapp.viaMeta.verificationNeededTitle")).toBeNull();
    fireEvent.click(screen.getByText("whatsapp.viaMeta.manageBilling"));
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("whatsapp_account"),
      "_blank",
      "noopener,noreferrer"
    );
    vi.unstubAllGlobals();
  });

  it("shows one managed-by-Meta card instead of repeating unverifiable API labels", () => {
    render(
      <WhatsAppViaMetaCard
        connection={{
          ...connection,
          wabaBillingHealth: {
            ...connection.wabaBillingHealth!,
            hasPaymentMethod: null,
            paymentStatusRaw: "unverifiable",
            actionRequired: false,
            issues: [],
          },
        }}
      />
    );
    expect(screen.getByText("whatsapp.viaMeta.managedTitle")).toBeTruthy();
    expect(screen.getByText("whatsapp.viaMeta.managedBody")).toBeTruthy();
    expect(screen.getByText("whatsapp.viaMeta.managedHint")).toBeTruthy();
    expect(screen.getByText("whatsapp.viaMeta.openManager")).toBeTruthy();
    expect(screen.getByText("whatsapp.viaMeta.manageBilling")).toBeTruthy();
    expect(screen.queryByText("whatsapp.viaMeta.paymentUnverifiable")).toBeNull();
    expect(screen.queryByText("whatsapp.viaMeta.paymentUnverifiableHint")).toBeNull();
    expect(screen.queryByText("whatsapp.viaMeta.paymentMethod")).toBeNull();
    expect(screen.queryByText("whatsapp.viaMeta.funding")).toBeNull();
    expect(screen.queryByText("whatsapp.viaMeta.creditLine")).toBeNull();
    expect(screen.queryByText("whatsapp.viaMeta.directBilling")).toBeNull();
    expect(screen.queryByText("whatsapp.viaMeta.paymentRequiredTitle")).toBeNull();
  });
});
