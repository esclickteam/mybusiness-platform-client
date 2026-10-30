import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PartnersRecruitment from "./PartnersRecruitment";

vi.mock("react-helmet-async", () => ({
  Helmet: () => null,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "en" },
  }),
}));

describe("bizuply.com/partners recruitment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(screen.getByText(/30%/)).toBeInTheDocument();
    expect(screen.getByText(/10%/)).toBeInTheDocument();
    expect(screen.getByText(/Partner Center/)).toBeInTheDocument();
    expect(screen.getByText(/does not start a live charge/)).toBeInTheDocument();
    expect(screen.getByText(/free and waits for admin approval/)).toBeInTheDocument();
    expect(screen.getByText(/payment_due/)).toBeInTheDocument();
  });
});
