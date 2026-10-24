import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en", changeLanguage: vi.fn() } }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));
vi.mock("../api", () => ({
  default: { get: vi.fn().mockRejectedValue(new Error("offline")), defaults: { baseURL: "/api" } },
}));
vi.mock("../context/AuthContext", () => ({ useAuth: () => ({ login: vi.fn(), loginWithToken: vi.fn() }) }));
vi.mock("../utils/tokenRefresh", () => ({
  refreshAccessTokenOnce: vi.fn(),
  clearRefreshDead: vi.fn(),
}));
vi.mock("../context/NotificationsContext", () => ({ useNotifications: () => ({ fetchNotifications: vi.fn() }) }));
vi.mock("../hooks/usePartnerHostBranding", () => ({ usePartnerHostBranding: () => ({ whiteLabelEnabled: false }) }));
vi.mock("../utils/lazyWithPreload", () => ({ lazyWithPreload: () => ({ preload: () => Promise.resolve() }) }));
vi.mock("../components/auth/AuthShell", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AuthCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
      <h1>{title}</h1>
      {children}
    </section>
  ),
}));

import Login from "./Login";
import { rememberLoginProduct } from "../utils/whatsappApiPortal";

function Where() {
  const location = useLocation();
  return <p data-testid="where">{`${location.pathname}${location.search}`}</p>;
}

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Login", () => {
  it("plain /login is the Bizuply login, even right after a WhatsApp API session in this browser", async () => {
    rememberLoginProduct({ role: "business", subscriptionPlan: "whatsapp_api" });
    for (const url of ["/login", "/login?lang=he", "/login?redirect=/pricing", "/login?product=business"]) {
      renderAt(url);
      await waitFor(() => expect(screen.getByText("login.cardTitle")).toBeInTheDocument());
      expect(screen.queryByTestId("where")).not.toBeInTheDocument();
      cleanup();
    }
  });

  it("moves old WhatsApp API product links (social sign-in, $29 checkout return) to /whatsapp-api/login", () => {
    renderAt("/login?product=whatsapp_api&oauth=success");
    expect(screen.getByTestId("where")).toHaveTextContent("/whatsapp-api/login?oauth=success");
    cleanup();
    renderAt("/login?product=whatsapp_api&checkout=whatsapp_api&email=a%40b.c&ref=1");
    expect(screen.getByTestId("where")).toHaveTextContent("/whatsapp-api/login?checkout=whatsapp_api&email=a%40b.c&ref=1");
  });

  it("default /login is password-only: no Email code / Password tabs", async () => {
    renderAt("/login");
    await waitFor(() => expect(screen.getByText("login.cardTitle")).toBeInTheDocument());
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "login.methodOtp" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "login.methodPassword" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("login.emailLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("login.passwordLabel")).toBeInTheDocument();
    expect(screen.getByText("login.forgotPassword")).toBeInTheDocument();
    expect(screen.getByText("login.rememberMe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "login.signIn" })).toBeInTheDocument();
    expect(screen.getByText("login.useCodeInstead")).toHaveAttribute(
      "href",
      "/login?method=email-code"
    );
  });

  it("dedicated ?method=email-code keeps passwordless OTP without tabs", async () => {
    renderAt("/login?method=email-code&redirect=/pricing");
    await waitFor(() => expect(screen.getByText("login.cardTitle")).toBeInTheDocument());
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("login.passwordLabel")).not.toBeInTheDocument();
    expect(screen.getByLabelText("login.emailLabel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "login.otpSend" })).toBeInTheDocument();
    expect(screen.getByText("login.usePasswordInstead")).toHaveAttribute(
      "href",
      "/login?redirect=%2Fpricing"
    );
  });
});
