import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import i18n from "@/i18n/i18n";
import WhatsAppUsageCard from "./WhatsAppUsageCard";
import type { WhatsAppBillingUsageOverview } from "../../../../../api/whatsappBillingApi";

function baseUsage(
  overrides: Partial<WhatsAppBillingUsageOverview> = {}
): WhatsAppBillingUsageOverview {
  return {
    billingEnabled: true,
    unitPriceIls: 0.2,
    unitPriceAgorot: 20,
    canSend: false,
    blockReason: "WHATSAPP_BILLING_SETUP_REQUIRED",
    usage: null,
    subscription: {
      status: null,
      cancelAtPeriodEnd: false,
      paymentGraceEndsAt: null,
      currentPeriodEnd: null,
      hasPaymentMethod: false,
      productKey: "whatsapp_usage",
    },
    ...overrides,
  };
}

describe("WhatsAppUsageCard", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("hides when billing is not enabled for the business", () => {
    const { container } = render(
      <WhatsAppUsageCard
        businessId="biz"
        usage={baseUsage({ billingEnabled: false })}
        loading={false}
        error={null}
        onRetry={() => {}}
        onOpenSetup={() => {}}
        onOpenManage={() => {}}
        onReactivate={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows setup CTA when billing is not configured", () => {
    const onOpenSetup = vi.fn();
    render(
      <WhatsAppUsageCard
        businessId="biz"
        usage={baseUsage()}
        loading={false}
        error={null}
        onRetry={() => {}}
        onOpenSetup={onOpenSetup}
        onOpenManage={() => {}}
        onReactivate={() => {}}
      />
    );
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Pay as you go")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp billing is not set up")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Set up WhatsApp billing" })
    );
    expect(onOpenSetup).toHaveBeenCalledTimes(1);
  });

  it("shows active usage and estimated charge", () => {
    const onOpenManage = vi.fn();
    render(
      <WhatsAppUsageCard
        businessId="biz"
        usage={baseUsage({
          canSend: true,
          blockReason: null,
          usage: {
            messageCount: 327,
            chargeAgorot: 6540,
            chargeIls: 65.4,
            periodStart: "2026-08-01T00:00:00.000Z",
            periodEnd: "2026-09-01T00:00:00.000Z",
          },
          subscription: {
            status: "active",
            cancelAtPeriodEnd: false,
            paymentGraceEndsAt: null,
            currentPeriodEnd: "2026-09-01T00:00:00.000Z",
            hasPaymentMethod: true,
            productKey: "whatsapp_usage",
          },
        })}
        loading={false}
        error={null}
        onRetry={() => {}}
        onOpenSetup={() => {}}
        onOpenManage={onOpenManage}
        onReactivate={() => {}}
      />
    );
    expect(screen.getByText("WhatsApp billing is active")).toBeInTheDocument();
    expect(screen.getByText(/327 messages this month/)).toBeInTheDocument();
    expect(screen.getByText(/Estimated charge:/)).toBeInTheDocument();
    expect(screen.getByText(/65\.40 ₪/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Manage billing" }));
    expect(onOpenManage).toHaveBeenCalledTimes(1);
  });
});
