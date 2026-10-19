import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const apiGet = vi.fn();
const getPushBillingStatus = vi.fn();

vi.mock("@api", () => ({
  default: {
    get: (...args: unknown[]) => apiGet(...args),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../api/pushBillingApi", async () => {
  const actual = await vi.importActual<typeof import("../api/pushBillingApi")>(
    "../api/pushBillingApi"
  );
  return {
    ...actual,
    getPushBillingStatus: (...args: unknown[]) => getPushBillingStatus(...args),
    cancelPushBilling: vi.fn(),
    createPushBillingCheckout: vi.fn(),
    reactivatePushBilling: vi.fn(),
  };
});

vi.mock("../utils/push", () => ({
  getPermission: () => "granted",
  isIos: () => false,
  isPushSupported: () => true,
  isStandalone: () => true,
  isSubscribed: vi.fn().mockResolvedValue(false),
  subscribeToPush: vi.fn(),
  unsubscribeFromPush: vi.fn(),
  bindExistingPushSubscription: vi.fn().mockResolvedValue({ ok: false }),
  getCurrentPushSubscription: vi.fn().mockResolvedValue(null),
  ensurePushSubscription: vi.fn().mockResolvedValue({ ok: false }),
}));

import { NotificationSettingsPanel } from "./NotificationSettings";

describe("complimentary Push for one business", () => {
  beforeEach(() => {
    apiGet.mockImplementation(async (url: string) => {
      if (String(url).includes("notification-settings")) {
        return {
          data: {
            ok: true,
            settings: {
              master: true,
              pushEnabled: true,
              appointment: true,
              collaboration: true,
              review: true,
              message: true,
              lead: true,
              task: true,
            },
          },
        };
      }
      if (String(url).includes("/push/status")) {
        return {
          data: { ok: true, ready: false, thisDeviceRegistered: false, deviceCount: 0, pushEnabled: true },
        };
      }
      return { data: {} };
    });
    getPushBillingStatus.mockResolvedValue({
      billingEnabled: true,
      entitled: true,
      trialEligible: false,
      trialPeriodDays: 0,
      subscription: {
        status: "active",
        planKey: "push_complimentary",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
        complimentary: true,
        billingProvider: "complimentary",
        displayStatusHe: "פעיל \u2013 ללא חיוב",
      },
    });
  });

  it("shows the personal benefit and hides payment, trial, and cancel", async () => {
    render(
      <MemoryRouter>
        <NotificationSettingsPanel active onBack={() => {}} />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("push-complimentary-status")).toHaveTextContent(
      "פעיל \u2013 ללא חיוב"
    );
    expect(screen.getByTestId("push-complimentary-status")).toHaveTextContent("ללא חיוב");
    expect(screen.queryByText("התחילו 7 ימים חינם")).not.toBeInTheDocument();
    expect(screen.queryByText("ביטול מנוי")).not.toBeInTheDocument();
    expect(screen.queryByText("$12 לחודש")).not.toBeInTheDocument();
    expect(screen.queryByText("זמין לאחר הפעלת 7 ימי הניסיון")).not.toBeInTheDocument();
    expect(screen.getByTestId("push-master-toggle")).toBeInTheDocument();
  });
});
