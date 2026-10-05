import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import WhatsAppApiBillingActions from "./WhatsAppApiBillingActions";
import type { WhatsAppApiSubscriptionAccess } from "../../../../../api/whatsappApiPortal";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

const api = vi.hoisted(() => ({
  startWhatsAppApiCheckout: vi.fn(),
  resumeWhatsAppApiSubscription: vi.fn(),
  getWhatsAppApiPaymentMethodUrl: vi.fn(),
}));
vi.mock("../../../../../api/whatsappApiPortal", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../../../api/whatsappApiPortal")>()),
  ...api,
}));

const END = "2026-11-04T00:00:00.000Z";
const NONE = { reactivate: false, resume: false, updatePayment: false };

function access(
  subscription: WhatsAppApiSubscriptionAccess["subscription"],
  actions: Partial<typeof NONE>
): WhatsAppApiSubscriptionAccess {
  return {
    allowed: Boolean(subscription?.active),
    via: subscription?.active ? "subscription" : null,
    reason: String(subscription?.reason || "no_subscription"),
    subscription,
    actions: { ...NONE, ...actions },
  };
}

const expired = access(
  { status: "expired", active: false, reason: "expired", currentPeriodEnd: END, cancelAtPeriodEnd: false },
  { reactivate: true }
);
const cancelling = access(
  { status: "active", active: true, reason: "active_until_period_end", currentPeriodEnd: END, cancelAtPeriodEnd: true },
  { resume: true }
);
const grace = access(
  { status: "past_due", active: true, reason: "payment_grace", currentPeriodEnd: END, graceEndsAt: END },
  { updatePayment: true }
);
const active = access(
  { status: "active", active: true, reason: "active", currentPeriodEnd: END, cancelAtPeriodEnd: false },
  {}
);

beforeEach(() => {
  api.startWhatsAppApiCheckout.mockReset();
  api.resumeWhatsAppApiSubscription.mockReset();
  api.getWhatsAppApiPaymentMethodUrl.mockReset();
});
afterEach(cleanup);

function renderActions(a: WhatsAppApiSubscriptionAccess, extra: { onAccessChange?: () => void; navigateTo?: (u: string) => void } = {}) {
  const onAccessChange = extra.onAccessChange || vi.fn();
  const navigateTo = extra.navigateTo || vi.fn();
  render(<WhatsAppApiBillingActions access={a} businessId="b1" onAccessChange={onAccessChange} navigateTo={navigateTo} />);
  return { onAccessChange, navigateTo };
}

describe("WhatsAppApiBillingActions", () => {
  it("shows only Reactivate for an expired subscription and opens one checkout for repeated clicks", async () => {
    let resolve: (v: { success: boolean; url: string }) => void = () => {};
    api.startWhatsAppApiCheckout.mockReturnValue(new Promise((r) => (resolve = r)));
    const { navigateTo } = renderActions(expired);

    expect(screen.queryByTestId("wa-api-resume")).toBeNull();
    expect(screen.queryByTestId("wa-api-update-payment")).toBeNull();
    const button = screen.getByTestId("wa-api-reactivate");
    expect(button.textContent).toContain("whatsappApiPortal.subscription.actions.reactivate");

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(api.startWhatsAppApiCheckout).toHaveBeenCalledTimes(1);
    expect(api.startWhatsAppApiCheckout).toHaveBeenCalledWith("b1");
    expect((button as HTMLButtonElement).disabled).toBe(true);

    resolve({ success: true, url: "https://lemon.test/checkout/1" });
    await waitFor(() => expect(navigateTo).toHaveBeenCalledWith("https://lemon.test/checkout/1"));
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it("sends one checkout request even when clicks land before a re-render", () => {
    api.startWhatsAppApiCheckout.mockReturnValue(new Promise(() => {}));
    renderActions(expired);
    const button = screen.getByTestId("wa-api-reactivate");
    act(() => {
      button.click();
      button.click();
      button.click();
    });
    expect(api.startWhatsAppApiCheckout).toHaveBeenCalledTimes(1);
  });

  it("explains an in-progress checkout and lets the customer try again", async () => {
    api.startWhatsAppApiCheckout.mockRejectedValue({ response: { data: { code: "WHATSAPP_API_CHECKOUT_IN_PROGRESS" } } });
    renderActions(expired);
    fireEvent.click(screen.getByTestId("wa-api-reactivate"));
    await screen.findByText("whatsappApiPortal.subscription.actions.checkoutInProgress");
    expect((screen.getByTestId("wa-api-reactivate") as HTMLButtonElement).disabled).toBe(false);
  });

  it("resumes a cancelled subscription in place", async () => {
    const resumed = access({ ...cancelling.subscription!, reason: "active", cancelAtPeriodEnd: false }, {});
    api.resumeWhatsAppApiSubscription.mockResolvedValue({ success: true, ...resumed });
    const { onAccessChange } = renderActions(cancelling);
    expect(screen.queryByTestId("wa-api-reactivate")).toBeNull();
    fireEvent.click(screen.getByTestId("wa-api-resume"));
    await waitFor(() => expect(onAccessChange).toHaveBeenCalledWith(expect.objectContaining({ subscription: resumed.subscription })));
    expect(api.resumeWhatsAppApiSubscription).toHaveBeenCalledWith("b1");
  });

  it("sends past-due customers to update the card on the existing subscription", async () => {
    api.getWhatsAppApiPaymentMethodUrl.mockResolvedValue({ success: true, url: "https://lemon.test/update" });
    const { navigateTo } = renderActions(grace);
    expect(screen.queryByTestId("wa-api-reactivate")).toBeNull();
    fireEvent.click(screen.getByTestId("wa-api-update-payment"));
    await waitFor(() => expect(navigateTo).toHaveBeenCalledWith("https://lemon.test/update"));
    expect(api.startWhatsAppApiCheckout).not.toHaveBeenCalled();
  });

  it("renders nothing for an active subscription or when the server offers no action", () => {
    renderActions(active);
    expect(screen.queryByTestId("wa-api-billing-actions")).toBeNull();
    cleanup();
    renderActions({ ...expired, actions: NONE });
    expect(screen.queryByTestId("wa-api-billing-actions")).toBeNull();
  });
});
