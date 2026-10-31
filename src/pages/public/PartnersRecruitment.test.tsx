import { fireEvent, render, screen } from "@testing-library/react";
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
  });

  it("links registration to the international plan and states the commercial terms", () => {
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    const link = screen.getByTestId("international-register-link");
    expect(link).toHaveAttribute("href", "/partner/register?planKey=partner_international");
    expect(screen.getAllByText(/\$5,000/).length).toBeGreaterThan(0);
    expect(screen.getByTestId("international-monthly-price").textContent).toContain("$499");
    expect(screen.getByTestId("annual-best-value")).toHaveTextContent("Best Value");
    expect(screen.getByTestId("annual-savings").textContent).toContain("$988");
    expect(screen.getByTestId("international-monthly-link")).toHaveAttribute(
      "href",
      "/partner/register?planKey=partner_international&billing=monthly"
    );
    expect(screen.getByTestId("international-price-cards").className).toContain("md:grid-cols-2");
    expect(screen.getAllByText(/30%/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/10%/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Partner Center/).length).toBeGreaterThan(0);
    expect(screen.getByText(/does not start a live charge/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Application is free/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/payment_due/).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { level: 1, name: "Build Your Business with Bizuply" })).toBeInTheDocument();
  });

  it("estimates commission from the published tiers", () => {
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId("calc-customers"), { target: { value: "20" } });
    fireEvent.change(screen.getByTestId("calc-price"), { target: { value: "100" } });
    expect(screen.getByTestId("calc-revenue")).toHaveTextContent("$2,000");
    expect(screen.getByTestId("calc-month")).toHaveTextContent("$700");
    expect(screen.getByTestId("calc-year")).toHaveTextContent("$8,400");
    expect(screen.getByText(/Illustrative estimates only/)).toBeInTheDocument();
  });

  it("shows both prices in Hebrew", () => {
    i18nState.language = "he";
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    expect(screen.getByText("תוכנית שותפים בינלאומית")).toBeInTheDocument();
    expect(screen.getByTestId("international-monthly-price").textContent).toContain("$499");
    expect(screen.getByTestId("international-annual-price").textContent).toContain("$5,000");
    expect(screen.getByTestId("annual-savings").textContent).toContain("$988");
    expect(screen.getAllByText(/הגשת הבקשה היא ללא תשלום/).length).toBeGreaterThan(0);
  });
});
