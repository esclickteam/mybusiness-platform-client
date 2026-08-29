import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const value = key.split(".").reduce<unknown>(
        (acc, segment) =>
          acc && typeof acc === "object"
            ? (acc as Record<string, unknown>)[segment]
            : undefined,
        he
      );
      return typeof value === "string" ? value : key;
    },
    i18n: { language: "he" },
  }),
}));

vi.mock("../../../../hooks/useLocaleDir", () => ({
  useLocaleDir: () => "rtl",
}));

import MetaAiCampaignWizardPage from "./MetaAiCampaignWizardPage";

describe("MetaAiCampaignWizardPage", () => {
  it("renders the stage-B shell without starting an AI session", () => {
    render(
      <MemoryRouter
        initialEntries={["/business/biz-1/dashboard/meta-campaigns/create-ai"]}
      >
        <Routes>
          <Route
            path="/business/:businessId/dashboard/meta-campaigns"
            element={<Outlet context={{ businessId: "biz-1" }} />}
          >
            <Route path="create-ai" element={<MetaAiCampaignWizardPage />} />
            <Route path="overview" element={<div>overview-page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("meta-ai-campaign-wizard")).toBeTruthy();
    expect(screen.getByText(he.metaCampaigns.ai.title)).toBeTruthy();
    expect(screen.getByText(he.metaCampaigns.ai.placeholder)).toBeTruthy();
    const back = screen.getByRole("link", { name: he.metaCampaigns.ai.back });
    expect(back.getAttribute("href")).toBe(
      "/business/biz-1/dashboard/meta-campaigns/overview"
    );
  });
});
