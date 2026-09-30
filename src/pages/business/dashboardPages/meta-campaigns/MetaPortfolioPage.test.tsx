import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useOutletContext: () => ({ businessId: "biz-1" }) };
});

vi.mock("../../../../api/metaCampaignsApi", () => ({
  getMetaPortfolio: vi.fn().mockResolvedValue({ campaigns: [], blended: {}, totals: {} }),
  analyzeMetaPortfolio: vi.fn(),
  simulateMetaPortfolio: vi.fn(),
  applyMetaPortfolio: vi.fn(),
  getMetaPortfolioHistory: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import MetaPortfolioPage from "./MetaPortfolioPage";

describe("MetaPortfolioPage", () => {
  it("renders the portfolio optimization workspace", async () => {
    render(<MetaPortfolioPage />);
    expect(await screen.findByTestId("portfolio-page")).toBeTruthy();
    expect(screen.getByText("metaCampaigns.portfolio.simulate")).toBeTruthy();
    expect(screen.getAllByText("metaCampaigns.portfolio.keepTotal").length).toBeGreaterThan(0);
  });
});
