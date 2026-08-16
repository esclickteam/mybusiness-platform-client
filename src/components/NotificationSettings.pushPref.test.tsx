import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const apiGet = vi.fn();
const apiPut = vi.fn();
const ensurePushSubscription = vi.fn();
const bindExistingPushSubscription = vi.fn();
const getCurrentPushSubscription = vi.fn();
const isSubscribed = vi.fn();
const getPushBillingStatus = vi.fn();

vi.mock("@api", () => ({
  default: {
    get: (...args: unknown[]) => apiGet(...args),
    put: (...args: unknown[]) => apiPut(...args),
    post: vi.fn(),
  },
}));

vi.mock("../api/pushBillingApi", () => ({
  getPushBillingStatus: (...args: unknown[]) => getPushBillingStatus(...args),
  cancelPushBilling: vi.fn(),
  createPushBillingCheckout: vi.fn(),
  reactivatePushBilling: vi.fn(),
  normalizePushPlan: () => "annual",
  pushPlanAmountIls: () => 228,
  pushPlanLabelHe: () => "שנתי",
}));

vi.mock("../utils/push", () => ({
  getPermission: () => "granted",
  isIos: () => false,
  isPushSupported: () => true,
  isStandalone: () => true,
  isSubscribed: (...args: unknown[]) => isSubscribed(...args),
  subscribeToPush: vi.fn(),
  unsubscribeFromPush: vi.fn(),
  bindExistingPushSubscription: (...args: unknown[]) =>
    bindExistingPushSubscription(...args),
  getCurrentPushSubscription: (...args: unknown[]) =>
    getCurrentPushSubscription(...args),
  ensurePushSubscription: (...args: unknown[]) =>
    ensurePushSubscription(...args),
}));

import { NotificationSettingsPanel } from "./NotificationSettings";
import { clearPushEnabledPreferenceCache } from "../utils/pushPreference";

function renderPanel() {
  return render(
    <MemoryRouter>
      <NotificationSettingsPanel active onBack={() => {}} />
    </MemoryRouter>
  );
}

describe("NotificationSettings push preference E2E", () => {
  beforeEach(() => {
    clearPushEnabledPreferenceCache();
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
          data: {
            ok: true,
            ready: false,
            thisDeviceRegistered: false,
            deviceCount: 0,
            pushEnabled: true,
          },
        };
      }
      return { data: {} };
    });
    apiPut.mockResolvedValue({
      data: { ok: true, settings: { master: true, pushEnabled: true } },
    });
    getPushBillingStatus.mockResolvedValue({
      billingEnabled: false,
      entitled: true,
      subscription: null,
    });
    getCurrentPushSubscription.mockResolvedValue(null);
    isSubscribed.mockResolvedValue(false);
    ensurePushSubscription.mockResolvedValue({ ok: false, reason: "no-subscription" });
    bindExistingPushSubscription.mockResolvedValue({
      ok: false,
      reason: "no-subscription",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearPushEnabledPreferenceCache();
  });

  it("keeps the master toggle ON when the device subscription is missing", async () => {
    renderPanel();

    const toggle = await screen.findByTestId("push-master-toggle");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByTestId("push-device-status").textContent).not.toContain(
      "כבוי"
    );
    expect(apiPut).not.toHaveBeenCalled();
    expect(ensurePushSubscription).toHaveBeenCalled();
  });

  it("stays ON after remount (refresh / PWA reopen) and never writes master=false", async () => {
    const first = renderPanel();
    expect(await screen.findByTestId("push-master-toggle")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    first.unmount();

    renderPanel();
    await waitFor(() => {
      expect(screen.getByTestId("push-master-toggle")).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });

    const masterWrites = apiPut.mock.calls.filter((call) => {
      const body = call[1] as { settings?: { master?: boolean } };
      return body?.settings && Object.prototype.hasOwnProperty.call(body.settings, "master");
    });
    expect(masterWrites).toEqual([]);
  });
});
