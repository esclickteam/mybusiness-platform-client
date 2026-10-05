import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import WhatsAppBillingTab from "./WhatsAppBillingTab";
import type { WhatsAppApiSubscriptionAccess } from "../../../../api/whatsappApiPortal";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

const state = vi.hoisted(() => ({
  access: null as WhatsAppApiSubscriptionAccess | null,
  serverAccess: null as WhatsAppApiSubscriptionAccess | null,
  liveHook: false,
  reload: vi.fn(),
  refreshUser: vi.fn(async () => ({})),
}));

vi.mock("../../../dev/useWhatsAppHubContext", () => ({
  useWhatsAppHubContext: () => ({ connection: null, businessId: "b1" }),
}));
vi.mock("../../../../context/AuthContext", () => ({
  // A new function on every render, like the real AuthContext.
  useAuth: () => ({
    user: { role: "business", subscriptionPlan: "whatsapp_api", businessId: "b1" },
    refreshUser: (force?: boolean) => state.refreshUser(force),
  }),
}));
vi.mock("../../../../utils/whatsappApiPortal", () => ({ isWhatsAppApiPortalUser: () => true }));
vi.mock("./billing/WhatsAppViaMetaCard", () => ({ default: () => null }));
vi.mock("../../../../api/whatsappApiPortal", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../../api/whatsappApiPortal")>()),
  useWhatsAppApiSubscription: () => {
    const [live, setLive] = React.useState(state.access);
    const reload = React.useCallback(() => {
      state.reload();
      if (state.liveHook) setLive(state.serverAccess);
    }, []);
    return {
      access: state.liveHook ? live : state.access,
      loading: false,
      unavailable: false,
      reload,
      setAccess: vi.fn(),
    };
  },
}));

const END = "2026-11-04T00:00:00.000Z";
const NONE = { reactivate: false, resume: false, updatePayment: false };
const expired: WhatsAppApiSubscriptionAccess = {
  allowed: false,
  via: null,
  reason: "expired",
  subscription: { status: "expired", active: false, reason: "expired", currentPeriodEnd: END },
  actions: { ...NONE, reactivate: true },
};
const active: WhatsAppApiSubscriptionAccess = {
  allowed: true,
  via: "subscription",
  reason: "active",
  subscription: { status: "active", active: true, reason: "active", currentPeriodEnd: END, cancelAtPeriodEnd: false },
  actions: NONE,
};

let seen = "";
function LocationProbe() {
  const loc = useLocation();
  React.useEffect(() => {
    seen = `${loc.pathname}${loc.search}`;
  }, [loc.pathname, loc.search]);
  return null;
}

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path="/business/:businessId/dashboard/whatsapp/billing"
          element={
            <>
              <WhatsAppBillingTab />
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  sessionStorage.clear();
  state.reload.mockReset();
  state.refreshUser.mockClear();
});
afterEach(cleanup);

describe("WhatsAppBillingTab checkout return", () => {
  it("waits for the webhook, then confirms activation and drops the checkout flag", async () => {
    state.access = expired;
    const view = renderAt("/business/b1/dashboard/whatsapp/billing?checkout=whatsapp_api");
    expect(screen.getByTestId("wa-api-checkout-return").getAttribute("data-state")).toBe("processing");
    expect(screen.queryByTestId("wa-api-reactivate")).toBeNull();

    state.access = active;
    view.rerender(
      <MemoryRouter initialEntries={["/business/b1/dashboard/whatsapp/billing?checkout=whatsapp_api"]}>
        <Routes>
          <Route
            path="/business/:businessId/dashboard/whatsapp/billing"
            element={
              <>
                <WhatsAppBillingTab />
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(seen).toBe("/business/b1/dashboard/whatsapp/billing"));
    expect(screen.getByTestId("wa-api-checkout-return").getAttribute("data-state")).toBe("activated");
    expect(state.refreshUser).toHaveBeenCalledWith(true);
  });

  it("keeps the activation notice after a remount, and only for a few minutes", async () => {
    state.access = expired;
    const first = renderAt("/business/b1/dashboard/whatsapp/billing?checkout=whatsapp_api");
    state.access = active;
    first.unmount();
    renderAt("/business/b1/dashboard/whatsapp/billing?checkout=whatsapp_api");
    await waitFor(() => expect(seen).toBe("/business/b1/dashboard/whatsapp/billing"));
    cleanup();

    renderAt("/business/b1/dashboard/whatsapp/billing");
    expect(screen.getByTestId("wa-api-checkout-return").getAttribute("data-state")).toBe("activated");
    cleanup();

    sessionStorage.setItem("waApiReactivated:b1", String(Date.now() - 6 * 60 * 1000));
    renderAt("/business/b1/dashboard/whatsapp/billing");
    expect(screen.queryByTestId("wa-api-checkout-return")).toBeNull();
  });

  it("keeps polling until the webhook activates the subscription", async () => {
    vi.useFakeTimers();
    try {
      state.access = expired;
      state.serverAccess = expired;
      state.liveHook = true;
      renderAt("/business/b1/dashboard/whatsapp/billing?checkout=whatsapp_api");
      expect(screen.getByTestId("wa-api-checkout-return").getAttribute("data-state")).toBe("processing");
      await act(async () => {
        vi.advanceTimersByTime(7000);
      });
      expect(screen.getByTestId("wa-api-checkout-return").getAttribute("data-state")).toBe("processing");
      state.serverAccess = active;
      await act(async () => {
        vi.advanceTimersByTime(3500);
      });
      expect(screen.getByTestId("wa-api-checkout-return").getAttribute("data-state")).toBe("activated");
    } finally {
      state.liveHook = false;
      vi.useRealTimers();
    }
  });

  it("shows no checkout notice on a normal visit", () => {
    state.access = expired;
    renderAt("/business/b1/dashboard/whatsapp/billing");
    expect(screen.queryByTestId("wa-api-checkout-return")).toBeNull();
    expect(screen.getByTestId("wa-api-reactivate")).toBeTruthy();
  });
});
