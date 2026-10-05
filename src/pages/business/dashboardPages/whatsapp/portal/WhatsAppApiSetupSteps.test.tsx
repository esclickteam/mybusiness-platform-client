import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WhatsAppApiSetupSteps, { subscriptionStepStatus, type SetupStep } from "./WhatsAppApiSetupSteps";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

afterEach(cleanup);

const BASE = "/business/b1/dashboard/whatsapp";

function steps(overrides: Partial<Record<SetupStep["key"], SetupStep["status"]>> = {}): SetupStep[] {
  const status = (key: SetupStep["key"]) => overrides[key] ?? "done";
  return [
    { key: "subscription", status: status("subscription"), to: `${BASE}/billing` },
    { key: "connect", status: status("connect"), to: `${BASE}/connection` },
    { key: "apiKey", status: status("apiKey"), to: `${BASE}/developers` },
    { key: "webhook", status: status("webhook"), to: `${BASE}/developers` },
    { key: "firstMessage", status: status("firstMessage"), to: `${BASE}/developers` },
  ];
}

function renderSteps(list: SetupStep[], welcome = false) {
  render(
    <MemoryRouter>
      <WhatsAppApiSetupSteps steps={list} welcome={welcome} />
    </MemoryRouter>
  );
}

describe("subscriptionStepStatus", () => {
  it("only marks a renewing subscription as done", () => {
    expect(subscriptionStepStatus("active")).toBe("done");
    expect(subscriptionStepStatus("cancelsAtPeriodEnd")).toBe("attention");
    expect(subscriptionStepStatus("pastDueGrace")).toBe("attention");
    expect(subscriptionStepStatus("expired")).toBe("todo");
    expect(subscriptionStepStatus("none")).toBe("todo");
    expect(subscriptionStepStatus("unknown")).toBe("todo");
  });
});

describe("WhatsAppApiSetupSteps", () => {
  it("lists the five steps and links unfinished ones to the right screen", () => {
    renderSteps(steps({ connect: "todo", apiKey: "todo", webhook: "todo", firstMessage: "todo" }));

    const items = document.querySelectorAll("li[data-step]");
    expect(Array.from(items).map((li) => li.getAttribute("data-step"))).toEqual([
      "subscription",
      "connect",
      "apiKey",
      "webhook",
      "firstMessage",
    ]);
    expect(screen.getByText("whatsappApiPortal.setup.steps.connect.cta").closest("a")).toHaveAttribute(
      "href",
      `${BASE}/connection`
    );
    expect(screen.getByText("whatsappApiPortal.setup.steps.apiKey.cta").closest("a")).toHaveAttribute(
      "href",
      `${BASE}/developers`
    );
    expect(screen.queryByText("whatsappApiPortal.setup.steps.subscription.cta")).toBeNull();
  });

  it("flags a cancelled subscription instead of showing it as done", () => {
    renderSteps(steps({ subscription: "attention" }));

    const sub = document.querySelector('li[data-step="subscription"]');
    expect(sub).toHaveAttribute("data-status", "attention");
    expect(screen.getByLabelText("whatsappApiPortal.setup.attention")).toBeInTheDocument();
    expect(document.querySelector('[data-testid="wa-api-setup-guide"]')).toHaveAttribute("data-complete", "false");
  });

  it("collapses to a one-line summary once every step is done", () => {
    renderSteps(steps());

    expect(document.querySelectorAll("li[data-step]")).toHaveLength(0);
    expect(screen.getByText("whatsappApiPortal.setup.completeTitle")).toBeInTheDocument();

    fireEvent.click(screen.getByText("whatsappApiPortal.setup.showSteps"));
    expect(document.querySelectorAll("li[data-step]")).toHaveLength(5);
  });

  it("links the business details step to the form on the same page", () => {
    const list = steps();
    list.splice(1, 0, { key: "details", status: "todo", to: "#wa-api-business-details" });
    render(
      <MemoryRouter>
        <section id="wa-api-business-details">
          <input aria-label="name" />
        </section>
        <WhatsAppApiSetupSteps steps={list} />
      </MemoryRouter>
    );
    const target = document.getElementById("wa-api-business-details")!;
    target.scrollIntoView = vi.fn();

    const link = screen.getByText("whatsappApiPortal.setup.steps.details.cta").closest("a")!;
    expect(link).toHaveAttribute("href", "#wa-api-business-details");
    fireEvent.click(link);
    expect(target.scrollIntoView).toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByLabelText("name"));
  });

  it("keeps the full guide visible on the welcome visit", () => {
    renderSteps(steps(), true);

    expect(document.querySelectorAll("li[data-step]")).toHaveLength(5);
    expect(screen.getByText("whatsappApiPortal.setup.welcomeTitle")).toBeInTheDocument();
  });
});
