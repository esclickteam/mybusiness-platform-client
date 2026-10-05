import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

const apiGet = vi.fn();
const login = vi.fn();
const loginWithToken = vi.fn();
const refreshAccessTokenOnce = vi.fn();
const clearRefreshDead = vi.fn();
const assign = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) =>
      String(opts?.defaultValue ?? key).replace(/\{\{provider\}\}/g, opts?.provider ?? "{{provider}}"),
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

vi.mock("../../api", () => ({
  default: { get: (...args: unknown[]) => apiGet(...args), defaults: { baseURL: "https://api.test/api" } },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ login, loginWithToken }),
}));

vi.mock("../../utils/tokenRefresh", () => ({
  refreshAccessTokenOnce: () => refreshAccessTokenOnce(),
  clearRefreshDead: () => clearRefreshDead(),
}));

import { resetWhatsAppApiAuthConfigForTests } from "../../components/whatsappApiAuth/authConfig";
import WhatsAppApiLoginPage from "./WhatsAppApiLoginPage";

const BIZ = "507f1f77bcf86cd799439011";
const portalUser = { role: "business", businessId: BIZ, subscriptionPlan: "whatsapp_api", hasAccess: true };

function Where() {
  const location = useLocation();
  return <p data-testid="where">{`${location.pathname}${location.search}`}</p>;
}

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/login" element={<WhatsAppApiLoginPage />} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>
  );
}

function availability(providers: string[]) {
  apiGet.mockImplementation(async (url: string) => {
    if (url === "/whatsapp-api/availability") return { data: { selfServe: true, providers, turnstileSiteKey: null } };
    if (url === "/auth/me") return { data: portalUser };
    if (url === "/whatsapp-api/signup-status") return { data: { status: "ready", method: "google" } };
    throw new Error(`unexpected ${url}`);
  });
}

beforeEach(() => {
  resetWhatsAppApiAuthConfigForTests();
  Object.defineProperty(window, "location", { value: { ...window.location, assign }, writable: true });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("WhatsAppApiLoginPage", () => {
  it("is the standalone product login: brand, title, email + password, no CRM copy", async () => {
    availability([]);
    renderAt("/login?product=whatsapp_api");
    expect(screen.getByRole("heading", { name: "Log in to your WhatsApp API account" })).toBeInTheDocument();
    expect(screen.getByText("Bizuply WhatsApp API")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    await waitFor(() => expect(apiGet).toHaveBeenCalledWith("/whatsapp-api/availability"));
    expect(screen.queryByText(/Continue with/)).not.toBeInTheDocument();
    expect(screen.queryByText("OR")).not.toBeInTheDocument();
  });

  it("shows only the configured providers and starts the login intent on the API", async () => {
    availability(["google", "microsoft"]);
    renderAt("/login?product=whatsapp_api");
    const google = await screen.findByRole("button", { name: "Continue with Google" });
    expect(screen.getByRole("button", { name: "Continue with Microsoft" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continue with Facebook" })).not.toBeInTheDocument();
    expect(screen.getByText("OR")).toBeInTheDocument();
    fireEvent.click(google);
    expect(assign).toHaveBeenCalledWith("https://api.test/api/auth/oauth/google/start?intent=login&language=en");
  });

  it("completes a social sign-in from the refresh cookie and opens the portal overview", async () => {
    availability(["google"]);
    refreshAccessTokenOnce.mockResolvedValue("access-1");
    renderAt("/login?product=whatsapp_api&oauth=success");
    expect(screen.getByTestId("wa-oauth-completing")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("where")).toHaveTextContent(`/business/${BIZ}/dashboard/whatsapp/overview`));
    expect(clearRefreshDead).toHaveBeenCalled();
    expect(apiGet).toHaveBeenCalledWith("/auth/me", { headers: { Authorization: "Bearer access-1" } });
    expect(loginWithToken).toHaveBeenCalledWith(portalUser, "access-1", { skipRedirect: true });
  });

  it("shows a retry message when the social session cannot be completed", async () => {
    availability(["google"]);
    refreshAccessTokenOnce.mockRejectedValue(new Error("NO_REFRESH_TOKEN"));
    renderAt("/login?product=whatsapp_api&oauth=success");
    expect(await screen.findByTestId("wa-login-error")).toHaveTextContent("We couldn't finish signing you in. Please try again.");
    expect(loginWithToken).not.toHaveBeenCalled();
  });

  it("explains provider errors without leaking details", () => {
    availability(["google"]);
    renderAt("/login?product=whatsapp_api&oauth_error=existing_account&provider=google");
    expect(screen.getByTestId("wa-login-error")).toHaveTextContent("This email already has a Bizuply account. Log in with the method you used before");
    cleanup();
    renderAt("/login?product=whatsapp_api&oauth_error=email_unverified&provider=microsoft");
    expect(screen.getByTestId("wa-login-error")).toHaveTextContent("Microsoft didn't confirm this email address.");
  });

  it("email login sends WhatsApp API customers straight to their portal", async () => {
    availability([]);
    login.mockResolvedValue({ user: portalUser });
    renderAt("/login?product=whatsapp_api");
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: " Dana@Example.com " } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password#123" } });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() => expect(screen.getByTestId("where")).toHaveTextContent(`/business/${BIZ}/dashboard/whatsapp/overview`));
    expect(login).toHaveBeenCalledWith("dana@example.com", "Password#123", { skipRedirect: true });
  });

  it("other account types keep their own destination", async () => {
    availability([]);
    login.mockResolvedValue({ user: { role: "admin" } });
    renderAt("/login?product=whatsapp_api");
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password#123" } });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() => expect(screen.getByTestId("where")).toHaveTextContent("/admin/dashboard"));
  });

  it("after checkout tells social signups which provider to continue with", async () => {
    availability(["google"]);
    renderAt(`/login?product=whatsapp_api&checkout=whatsapp_api&email=new%40example.com&ref=${BIZ}`);
    expect(await screen.findByText("Your WhatsApp API account is ready. Continue with Google to open your portal.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveValue("new@example.com");
  });
});
