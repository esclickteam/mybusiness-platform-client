import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { WhatsAppApiAuthConfig } from "../../../components/whatsappApiAuth/authConfig";

const apiPost = vi.fn();
const assign = vi.fn();
const getToken = vi.fn();
const reset = vi.fn();

const i18nState = vi.hoisted(() => ({ language: "en" }));

vi.mock("react-i18next", async () => {
  const he = (await import("../../../i18n/locales/he.json")).default as Record<string, unknown>;
  const lookup = (key: string) =>
    key.split(".").reduce<unknown>((node, part) => (node && typeof node === "object" ? (node as any)[part] : undefined), he);
  const t = (key: string, opts?: { defaultValue?: string }) => {
    const found = i18nState.language === "he" ? lookup(key) : undefined;
    return typeof found === "string" ? found : opts?.defaultValue ?? key;
  };
  return {
    useTranslation: () => ({ t, i18n: i18nState }),
    initReactI18next: { type: "3rdParty", init: () => undefined },
  };
});

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
  i18nState.language = "en";
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
    renderForm({ providers: ["microsoft", "google", "facebook" as any] });
    const labels = screen.getAllByRole("button", { name: /Continue with/ }).map((b) => b.textContent);
    expect(labels).toEqual(["Continue with Google", "Continue with Microsoft"]);
    expect(screen.queryByText(/Facebook/)).not.toBeInTheDocument();
    expect(screen.getByText("OR")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue with Microsoft" }));
    expect(assign).toHaveBeenCalledWith("https://api.test/api/auth/oauth/microsoft/start?intent=signup&language=en");
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
      language: "en",
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

describe("SignupCheckoutForm in Hebrew", () => {
  beforeEach(() => {
    i18nState.language = "he";
  });

  it("renders every label, button, divider and link in Hebrew with no English UI copy left", () => {
    const { container } = renderForm({ providers: ["google", "microsoft"] });
    expect(screen.getByRole("heading", { name: "יצירת חשבון WhatsApp API" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "המשך עם Google" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "המשך עם Microsoft" })).toBeInTheDocument();
    expect(screen.getByText("או")).toBeInTheDocument();
    expect(screen.getByLabelText("כתובת אימייל")).toBeInTheDocument();
    expect(screen.getByLabelText("סיסמה")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "המשך" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "הצגת סיסמה" })).toBeInTheDocument();
    expect(screen.getByText("כבר יש לכם חשבון?", { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "התחברות" }).getAttribute("href")).toMatch(/\/login\?product=whatsapp_api$/);
    const visible = container.textContent || "";
    for (const english of ["Create your", "Continue", "OR", "Email address", "Password", "Already have", "Log in", "Next:", "Cancel anytime"]) {
      expect(visible).not.toContain(english);
    }
  });

  it("validates, reports provider errors and duplicate emails in Hebrew", async () => {
    renderForm({ providers: ["microsoft"] }, "/get-started?oauth_error=state_invalid&provider=microsoft");
    expect(screen.getByTestId("wa-oauth-error").textContent).toMatch(/[\u0590-\u05FF]/);
    expect(screen.getByTestId("wa-oauth-error").textContent).not.toMatch(/session expired/i);

    fireEvent.click(screen.getByRole("button", { name: "המשך" }));
    expect(await screen.findByText("הזינו כתובת אימייל.")).toBeInTheDocument();
    expect(screen.getByText("השתמשו בלפחות 8 תווים.")).toBeInTheDocument();

    apiPost.mockRejectedValue({ response: { status: 409, data: { code: "EMAIL_ALREADY_REGISTERED" } } });
    fireEvent.change(screen.getByLabelText("כתובת אימייל"), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText("סיסמה"), { target: { value: "Password#123" } });
    fireEvent.click(screen.getByRole("button", { name: "המשך" }));
    expect(await screen.findByText(/לאימייל הזה כבר יש חשבון/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "התחברו" }).getAttribute("href")).toMatch(/\/login\?product=whatsapp_api$/);
    expect(apiPost).toHaveBeenCalledWith("/whatsapp-api/signup-checkout", expect.objectContaining({ language: "he" }));
  });
});
