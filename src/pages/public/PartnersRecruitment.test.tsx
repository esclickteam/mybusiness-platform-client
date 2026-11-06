import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PartnersRecruitment from "./PartnersRecruitment";

const i18nState = vi.hoisted(() => ({ language: "en" }));

vi.mock("react-helmet-async", () => ({
  Helmet: () => null,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: i18nState,
  }),
}));

vi.mock("../../lib/partnerApi", () => ({
  fetchPartnerPlans: vi.fn(async () => []),
}));

describe("bizuply.com/partners recruitment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18nState.language = "en";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ success: true, status: "open" }),
      }))
    );
  });

  it("links registration to the international plan and states the commercial terms", () => {
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    const link = screen.getByTestId("international-register-link");
    expect(link).toHaveAttribute("href", "/partner/register?planKey=partner_international&billing=annual");
    expect(screen.getAllByText(/\$5,000/).length).toBeGreaterThan(0);
    expect(screen.getByTestId("international-monthly-price").textContent).toContain("$499");
    expect(screen.getByTestId("annual-best-value")).toHaveTextContent(/Best value/i);
    expect(screen.getByTestId("annual-savings").textContent).toContain("$988");
    expect(screen.getByTestId("international-monthly-link")).toHaveAttribute(
      "href",
      "/partner/register?planKey=partner_international&billing=monthly"
    );
    expect(screen.getAllByText(/30%/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/10%/).length).toBeGreaterThan(0);
    expect(screen.getByText(/does not start a live charge/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Application is free/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/payment_due/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build businesses. Expand opportunities. Earn together.",
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("track-Business Partner")).toBeInTheDocument();
    expect(screen.getAllByText(/Coming soon/i).length).toBeGreaterThan(0);
  });

  it("estimates commission from the published tiers including one-time deals", () => {
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId("calc-customers"), { target: { value: "20" } });
    fireEvent.change(screen.getByTestId("calc-price"), { target: { value: "100" } });
    fireEvent.change(screen.getByTestId("calc-onetime-count"), { target: { value: "2" } });
    fireEvent.change(screen.getByTestId("calc-onetime-avg"), { target: { value: "500" } });
    expect(screen.getByTestId("calc-revenue")).toHaveTextContent("$2,000");
    expect(screen.getByTestId("calc-month")).toHaveTextContent("$700");
    expect(screen.getByTestId("calc-year")).toHaveTextContent("$8,400");
    expect(screen.getByTestId("calc-onetime")).toHaveTextContent("$100");
    expect(screen.getByTestId("calc-total")).toHaveTextContent("$8,500");
    expect(screen.getAllByText(/Simulation only/i).length).toBeGreaterThan(0);
  });

  it("shows Hebrew hero and Business Partner pricing", () => {
    i18nState.language = "he";
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "בונים עסק. מרחיבים הזדמנויות. מרוויחים יחד.",
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("international-monthly-price").textContent).toContain("$499");
    expect(screen.getByTestId("international-annual-price").textContent).toContain("$5,000");
    expect(screen.getByTestId("annual-savings").textContent).toContain("$988");
    expect(screen.getAllByText(/הגשת הבקשה ללא תשלום|הגשת הבקשה היא ללא תשלום/).length).toBeGreaterThan(0);
  });

  it("saves the application form only after a successful backend response", async () => {
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/^Full name/i), { target: { value: "Dana Levi" } });
    fireEvent.change(screen.getByLabelText(/Company name/i), { target: { value: "Northwind" } });
    fireEvent.change(screen.getByLabelText(/Business email/i), { target: { value: "dana@northwind.example" } });
    fireEvent.change(screen.getByLabelText(/^Phone/i), { target: { value: "+972501234567" } });
    fireEvent.change(screen.getByLabelText(/^Country/i), { target: { value: "Israel" } });
    fireEvent.change(screen.getByLabelText(/Short note/i), {
      target: { value: "We sell CRM services to local businesses." },
    });
    fireEvent.click(screen.getByTestId("partner-apply-submit"));
    await waitFor(() => {
      expect(screen.getByTestId("partner-apply-success")).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/support\/partner-application$/),
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
