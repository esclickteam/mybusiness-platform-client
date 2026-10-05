import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { WhatsAppApiAuthConfig } from "../../../components/whatsappApiAuth/authConfig";

const apiPost = vi.fn();
const assign = vi.fn();
const getToken = vi.fn();
const reset = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "he" } }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

vi.mock("../../../api", () => ({
  default: { post: (...args: unknown[]) => apiPost(...args), defaults: { baseURL: "https://api.test/api" } },
}));

vi.mock("../../../components/whatsappApiAuth/TurnstileWidget", async () => {
  const React = await import("react");
  return {
    default: React.forwardRef(function FakeTurnstile(_props, ref) {
      React.useImperativeHandle(ref, () => ({ getToken, reset }));
      return <div data-testid="wa-turnstile" />;
    }),
  };
});

import SignupCheckoutForm from "./SignupCheckoutForm";

const base: WhatsAppApiAuthConfig = { loaded: true, selfServe: true, providers: [], turnstileSiteKey: null };

function renderForm(config: Partial<WhatsAppApiAuthConfig> = {}, url = "/get-started") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <SignupCheckoutForm config={{ ...base, ...config }} />
    </MemoryRouter>
  );
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "new@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password#123" } });
  fireEvent.click(screen.getByRole("button", { name: /Continue$/ }));
}

beforeEach(() => {
  Object.defineProperty(window, "location", { value: { ...window.location, assign }, writable: true });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SignupCheckoutForm", () => {
  it("asks only for email and password; no provider buttons until a login app is configured", () => {
    renderForm();
    expect(screen.getByRole("heading", { name: "Create your WhatsApp API account" })).toBeInTheDocument();
    expect(screen.queryByText(/Continue with/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/name|company|phone/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("wa-turnstile")).not.toBeInTheDocument();
  });

  it("shows configured providers in order and starts the signup intent", () => {
    renderForm({ providers: ["microsoft", "google", "facebook"] });
    const labels = screen.getAllByRole("button", { name: /Continue with/ }).map((b) => b.textContent);
    expect(labels).toEqual(["Continue with Google", "Continue with Facebook", "Continue with Microsoft"]);
    expect(screen.getByText("OR")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue with Facebook" }));
    expect(assign).toHaveBeenCalledWith("https://api.test/api/auth/oauth/facebook/start?intent=signup&language=he");
  });

  it("sends the Turnstile token with the email signup and opens the same $29 checkout", async () => {
    getToken.mockResolvedValue("ts-token");
    apiPost.mockResolvedValue({ data: { url: "https://lemon.test/checkout/1" } });
    renderForm({ turnstileSiteKey: "site-key" });
    fillAndSubmit();
    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://lemon.test/checkout/1"));
    expect(apiPost).toHaveBeenCalledWith("/whatsapp-api/signup-checkout", {
      email: "new@example.com",
      password: "Password#123",
      language: "he",
      turnstileToken: "ts-token",
    });
  });

  it("does not submit without a Turnstile token and resets after a rejected check", async () => {
    getToken.mockResolvedValue(null);
    renderForm({ turnstileSiteKey: "site-key" });
    fillAndSubmit();
    expect(await screen.findByText("Please complete the security check and try again.")).toBeInTheDocument();
    expect(apiPost).not.toHaveBeenCalled();

    getToken.mockResolvedValue("ts-token");
    apiPost.mockRejectedValue({ response: { status: 400, data: { code: "BOT_CHECK_FAILED", error: "x" } } });
    fireEvent.click(screen.getByRole("button", { name: /Continue$/ }));
    await waitFor(() => expect(apiPost).toHaveBeenCalledTimes(1));
    expect(reset).toHaveBeenCalled();
  });

  it("prevents duplicate accounts and points to log in", async () => {
    apiPost.mockRejectedValue({ response: { status: 409, data: { code: "EMAIL_ALREADY_REGISTERED" } } });
    renderForm();
    fillAndSubmit();
    expect(await screen.findByText(/This email already has an account/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Log in" })[0].getAttribute("href")).toMatch(/\/login\?product=whatsapp_api$/);
  });

  it("shows why a provider signup was refused", () => {
    renderForm({ providers: ["google"] }, "/get-started?oauth_error=existing_account&provider=google");
    expect(screen.getByTestId("wa-oauth-error")).toHaveTextContent("This email already has a Bizuply account.");
  });
});
