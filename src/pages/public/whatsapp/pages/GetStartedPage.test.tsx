import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const i18nState = vi.hoisted(() => ({ language: "he" }));

vi.mock("react-i18next", async () => {
  const he = (await import("../../../../i18n/locales/he.json")).default as Record<string, unknown>;
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

vi.mock("../../../../components/whatsappApiAuth/authConfig", () => ({
  useWhatsAppApiAuthConfig: () => ({ loaded: true, selfServe: true, providers: ["google", "microsoft"], turnstileSiteKey: null }),
  startSocialAuth: vi.fn(),
}));

vi.mock("../../../../api", () => ({ default: { post: vi.fn(), defaults: { baseURL: "https://api.test/api" } } }));

import GetStartedPage from "./GetStartedPage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/get-started"]}>
      <GetStartedPage />
    </MemoryRouter>
  );
}

/** Words that may stay in English inside Hebrew copy: brands, product and protocol names. */
const ALLOWED_LATIN = new Set([
  "WhatsApp", "API", "Meta", "Bizuply", "Google", "Microsoft", "Lemon", "Squeezy", "Embedded", "Signup",
  "Cloud", "Business", "Webhook", "Webhooks", "SMS", "OpenAPI", "support", "bizuply", "com",
]);

afterEach(() => {
  cleanup();
  i18nState.language = "he";
});

describe("GetStartedPage", () => {
  it("is fully Hebrew when Hebrew is selected: hero, steps, statuses, signup body and form", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "חברו את מספר ה-WhatsApp שלכם." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "מתחילים לעבוד תוך דקות." })).toBeInTheDocument();
    expect(screen.getByText("הירשמו עם Google או Microsoft, או עם אימייל וסיסמה.")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "יצירת חשבון WhatsApp API" }).length).toBeGreaterThan(0);

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const leftovers: string[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      for (const word of node.textContent?.match(/[A-Za-z][A-Za-z']+/g) ?? []) {
        if (!ALLOWED_LATIN.has(word)) leftovers.push(word);
      }
    }
    expect(leftovers).toEqual([]);
  });

  it("keeps the English page unchanged", () => {
    i18nState.language = "en";
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Connect your WhatsApp number." })).toBeInTheDocument();
    expect(screen.getByText("Sign up with Google or Microsoft, or with your email and a password.")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Create your WhatsApp API account" }).length).toBeGreaterThan(0);
  });
});
