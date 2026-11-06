import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const apiGet = vi.fn();
const apiPost = vi.fn();
const assign = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) =>
      `${key}${opts?.plan ? `:${opts.plan}` : ""}${opts?.email ? `:${opts.email}` : ""}`,
    i18n: { language: "he", dir: () => "rtl", changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));
vi.mock("../api", () => ({
  default: {
    get: (...args: unknown[]) => apiGet(...args),
    post: (...args: unknown[]) => apiPost(...args),
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
  apiPost.mockImplementation((url: string) => {
    if (url === "/privacy/consent") {
      return Promise.resolve({ data: { success: true, stored: true, id: "consent-1" } });
    }
    return Promise.resolve({ data: { success: true, emailMasked: "a***@bizuply.test", cooldownSeconds: 60 } });
  });
  Object.defineProperty(window, "location", {
    value: { ...window.location, assign, origin: "https://app.test" },
    writable: true,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});

describe("BizUply identity-first register", () => {
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
    expect(screen.queryByLabelText("register.name")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("register.password")).not.toBeInTheDocument();
    expect(screen.getByText("register.identity.continueEmail")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "register.termsConsent" }));
    fireEvent.click(google);
    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith(
        expect.stringMatching(
          /\/auth\/oauth\/google\/start\?.*intent=signup.*product=bizuply.*plan=monthly.*websiteAddon=1.*ref=aff1.*consentKey=.*clientOrigin=/
        )
      )
    );
    expect(apiPost).toHaveBeenCalledWith(
      "/privacy/consent",
      expect.objectContaining({ source: "register", termsAccepted: true, marketingOptIn: false })
    );
  });

  it("starts email OTP without asking for password or business fields", async () => {
    render(
      <MemoryRouter initialEntries={["/register?plan=yearly"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    await screen.findByText("register.identity.continueEmail");
    fireEvent.change(screen.getByPlaceholderText("name@company.com"), {
      target: { value: "new@bizuply.test" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "register.termsConsent" }));
    fireEvent.click(screen.getByRole("button", { name: "register.identity.sendCode" }));
    await waitFor(() =>
      expect(apiPost).toHaveBeenCalledWith(
        "/auth/signup/email/start",
        expect.objectContaining({
          email: "new@bizuply.test",
          plan: "yearly",
          termsAccepted: true,
          marketingOptIn: false,
          consentKey: expect.any(String),
        })
      )
    );
    const consentOrder = apiPost.mock.calls.findIndex((call) => call[0] === "/privacy/consent");
    const startOrder = apiPost.mock.calls.findIndex((call) => call[0] === "/auth/signup/email/start");
    expect(consentOrder).toBeGreaterThanOrEqual(0);
    expect(startOrder).toBeGreaterThan(consentOrder);
    expect(await screen.findByText(/register.identity.otpHint/)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("register.passwordPlaceholder")).not.toBeInTheDocument();
  });

  it("does not start signup when the consent record is not stored", async () => {
    apiPost.mockImplementation((url: string) => {
      if (url === "/privacy/consent") return Promise.reject(new Error("consent_not_stored"));
      return Promise.resolve({ data: { success: true } });
    });
    render(
      <MemoryRouter initialEntries={["/register?plan=yearly"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    await screen.findByText("register.identity.continueEmail");
    fireEvent.change(screen.getByPlaceholderText("name@company.com"), {
      target: { value: "new@bizuply.test" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "register.termsConsent" }));
    fireEvent.click(screen.getByRole("button", { name: "register.identity.sendCode" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("register.consentSaveFailed");
    expect(apiPost).not.toHaveBeenCalledWith("/auth/signup/email/start", expect.anything());
    expect(screen.queryByText(/register.identity.otpHint/)).not.toBeInTheDocument();
  });

  it("continues registration when the previous server has no consent route", async () => {
    apiPost.mockImplementation((url: string, body?: { consentKey?: string }) => {
      if (url === "/privacy/consent") return Promise.reject({ response: { status: 404 } });
      expect(body?.consentKey).toBeUndefined();
      return Promise.resolve({ data: { success: true, emailMasked: "a***@bizuply.test", cooldownSeconds: 60 } });
    });
    render(
      <MemoryRouter initialEntries={["/register?plan=yearly"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    await screen.findByText("register.identity.continueEmail");
    fireEvent.change(screen.getByPlaceholderText("name@company.com"), {
      target: { value: "legacy@bizuply.test" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "register.termsConsent" }));
    fireEvent.click(screen.getByRole("button", { name: "register.identity.sendCode" }));
    expect(await screen.findByText(/register.identity.otpHint/)).toBeInTheDocument();
    expect(screen.queryByText("register.consentSaveFailed")).not.toBeInTheDocument();
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
