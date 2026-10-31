import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText(/30%/)).toBeInTheDocument();
    expect(screen.getByText(/10%/)).toBeInTheDocument();
    expect(screen.getByText(/Partner Center/)).toBeInTheDocument();
    expect(screen.getByText(/does not start a live charge/i)).toBeInTheDocument();
    expect(screen.getByText(/Application is free/)).toBeInTheDocument();
    expect(screen.getByText(/payment_due/)).toBeInTheDocument();
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
    expect(screen.getByText(/הגשת הבקשה היא ללא תשלום/)).toBeInTheDocument();
  });
});
