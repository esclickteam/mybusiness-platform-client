import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const apiGet = vi.fn();
const apiPost = vi.fn();
const login = vi.fn();
const loginWithToken = vi.fn();
const refreshAccessTokenOnce = vi.fn();
const assign = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) =>
      `${key}${opts?.provider ? `:${opts.provider}` : ""}${opts?.email ? `:${opts.email}` : ""}`,
    i18n: { language: "en", dir: () => "ltr", changeLanguage: vi.fn() },
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

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ login, loginWithToken }),
}));
vi.mock("../context/NotificationsContext", () => ({
  useNotifications: () => ({ fetchNotifications: vi.fn() }),
}));
vi.mock("../hooks/usePartnerHostBranding", () => ({
  usePartnerHostBranding: () => ({ whiteLabelEnabled: false }),
}));
vi.mock("../utils/lazyWithPreload", () => ({
  lazyWithPreload: () => ({ preload: () => Promise.resolve() }),
}));
vi.mock("../utils/tokenRefresh", () => ({
  refreshAccessTokenOnce: () => refreshAccessTokenOnce(),
  clearRefreshDead: vi.fn(),
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
import Login from "./Login";

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  resetBizuplyAuthProvidersForTests();
  apiGet.mockImplementation(async (url: string) => {
    if (url === "/auth/oauth/providers") return { data: { providers: ["google", "microsoft"] } };
    if (url === "/auth/me") {
      return {
        data: {
          role: "business",
          businessId: "b1",
          hasAccess: true,
          subscriptionPlan: "monthly",
        },
      };
    }
    if (url === "/auth/oauth/link-preview") {
      return {
        data: {
          email: "owner@bizuply.test",
          emailMasked: "o***@bizuply.test",
          provider: "google",
          methods: ["otp", "password"],
          hasPassword: true,
          otpCooldownSeconds: 0,
        },
      };
    }
    throw new Error(`unexpected GET ${url}`);
  });
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

describe("BizUply social login", () => {
  it("keeps Google and Microsoft visible when the providers request fails", async () => {
    apiGet.mockImplementation(async (url: string) => {
      if (url === "/auth/oauth/providers") throw new Error("network");
      throw new Error(`unexpected GET ${url}`);
    });
    renderAt("/login");
    expect(await screen.findByRole("button", { name: "login.continueGoogle" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "login.continueMicrosoft" })).toBeInTheDocument();
  });

  it("shows Google and Microsoft buttons above email/password with an OR divider", async () => {
    renderAt("/login");
    const google = await screen.findByRole("button", { name: "login.continueGoogle" });
    const microsoft = screen.getByRole("button", { name: "login.continueMicrosoft" });
    expect(apiGet).toHaveBeenCalledWith("/auth/oauth/providers", {
      params: { product: "bizuply" },
    });
    expect(screen.getByText("login.or")).toBeInTheDocument();
    expect(screen.getByLabelText("login.emailLabel")).toBeInTheDocument();
    expect(microsoft).toBeEnabled();
    fireEvent.click(google);
    expect(assign).toHaveBeenCalledWith(
      `https://api.test/api/auth/oauth/google/start?intent=login&product=bizuply&language=en&clientOrigin=${encodeURIComponent(window.location.origin)}`
    );
  });

  it("shows provider errors from the callback query", async () => {
    renderAt("/login?oauth_error=cancelled&provider=google");
    await screen.findByRole("alert");
    expect(screen.getByRole("alert").textContent).toContain("login.oauth.errors.cancelled");
  });

  it("keeps BizUply existing_account on /login and never moves to WhatsApp API login", async () => {
    renderAt("/login?oauth_error=existing_account&provider=google");
    await screen.findByRole("alert");
    expect(screen.getByRole("alert").textContent).toContain("login.oauth.errors.existing_account");
    expect(screen.getByRole("button", { name: "login.continueGoogle" })).toBeInTheDocument();
    expect(screen.getByLabelText("login.emailLabel")).toBeInTheDocument();
    expect(screen.queryByText(/whatsapp/i)).not.toBeInTheDocument();
  });

  it("keeps Microsoft cancelled on main /login with social buttons still available", async () => {
    renderAt("/login?oauth_error=cancelled&provider=microsoft");
    await screen.findByRole("alert");
    expect(screen.getByRole("alert").textContent).toContain("login.oauth.errors.cancelled");
    expect(screen.getByRole("button", { name: "login.continueMicrosoft" })).toBeInTheDocument();
    expect(screen.getByLabelText("login.emailLabel")).toBeInTheDocument();
  });

  it("exchanges the refresh cookie after oauth=success", async () => {
    refreshAccessTokenOnce.mockResolvedValue("access-1");
    renderAt("/login?oauth=success");
    await waitFor(() => expect(loginWithToken).toHaveBeenCalled());
    expect(refreshAccessTokenOnce).toHaveBeenCalled();
    expect(apiGet).toHaveBeenCalledWith("/auth/me", expect.any(Object));
  });

  it("asks for password or email code before linking an existing account", async () => {
    apiPost.mockResolvedValue({ data: { success: true, oauth: "success", cooldownSeconds: 60 } });
    refreshAccessTokenOnce.mockResolvedValue("access-1");
    renderAt("/login?oauth=link_required&provider=google");
    expect(await screen.findByText(/login.oauth.linkFound/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "login.continueGoogle" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "login.oauth.methodOtp" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "login.oauth.methodPassword" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "login.oauth.otpSend" }));
    await waitFor(() => expect(apiPost).toHaveBeenCalledWith("/auth/oauth/link-otp/send", {}));

    fireEvent.change(screen.getByLabelText("login.oauth.otpLabel"), { target: { value: "424242" } });
    fireEvent.click(screen.getByRole("button", { name: "login.oauth.linkSubmit" }));
    await waitFor(() => expect(apiPost).toHaveBeenCalledWith("/auth/oauth/link", { code: "424242" }));
    await waitFor(() => expect(loginWithToken).toHaveBeenCalled());
  });

  it("can link with the existing BizUply password instead of OTP", async () => {
    apiPost.mockResolvedValue({ data: { success: true, oauth: "success" } });
    refreshAccessTokenOnce.mockResolvedValue("access-1");
    renderAt("/login?oauth=link_required&provider=google");
    await screen.findByText(/login.oauth.linkFound/);
    fireEvent.click(screen.getByRole("tab", { name: "login.oauth.methodPassword" }));
    fireEvent.change(screen.getByLabelText("login.passwordLabel"), { target: { value: "Password#123" } });
    fireEvent.click(screen.getByRole("button", { name: "login.oauth.linkSubmit" }));
    await waitFor(() => expect(apiPost).toHaveBeenCalledWith("/auth/oauth/link", { password: "Password#123" }));
    await waitFor(() => expect(loginWithToken).toHaveBeenCalled());
  });
});
