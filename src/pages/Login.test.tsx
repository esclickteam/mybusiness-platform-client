import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en", changeLanguage: vi.fn() } }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));
vi.mock("../context/AuthContext", () => ({ useAuth: () => ({ login: vi.fn() }) }));
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
});
