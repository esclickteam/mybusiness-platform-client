import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const apiGet = vi.fn();
const assign = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "he", dir: () => "rtl", changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));
vi.mock("../api", () => ({
  default: {
    get: (...args: unknown[]) => apiGet(...args),
    post: vi.fn(),
    defaults: { baseURL: "https://api.test/api" },
  },
}));
vi.mock("../context/AuthContext", () => ({ useAuth: () => ({ loginWithToken: vi.fn() }) }));
vi.mock("../hooks/usePartnerHostBranding", () => ({
  usePartnerHostBranding: () => ({ branding: null, whiteLabelEnabled: false }),
}));
vi.mock("../billing/useBillingMarket", () => ({
  useBillingMarket: () => ({ billingCountry: "IL" }),
}));
vi.mock("../components/auth/AuthShell", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AuthCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
      <h1>{title}</h1>
      {children}
    </section>
  ),
}));

import { resetBizuplyAuthProvidersForTests } from "../components/auth/socialAuth";
import Register from "./Register";

beforeEach(() => {
  resetBizuplyAuthProvidersForTests();
  apiGet.mockResolvedValue({ data: { providers: ["google", "microsoft"] } });
  Object.defineProperty(window, "location", {
    value: { ...window.location, assign },
    writable: true,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});

describe("BizUply social register", () => {
  it("keeps plan-first signup and starts Google with that plan", async () => {
    render(
      <MemoryRouter initialEntries={["/register?plan=monthly&websiteAddon=1&ref=aff1"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    const google = await screen.findByRole("button", { name: "login.continueGoogle" });
    expect(screen.getByText("login.or")).toBeInTheDocument();
    expect(screen.getByText("register.email")).toBeInTheDocument();
    fireEvent.click(google);
    expect(assign).toHaveBeenCalledWith(
      expect.stringMatching(
        /\/auth\/oauth\/google\/start\?.*intent=signup.*product=bizuply.*plan=monthly.*websiteAddon=1.*ref=aff1.*clientOrigin=/
      )
    );
  });

  it("shows oauth errors from a cancelled provider return", async () => {
    render(
      <MemoryRouter initialEntries={["/register?plan=yearly&oauth_error=cancelled&provider=microsoft"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("login.oauth.errors.cancelled");
  });
});
