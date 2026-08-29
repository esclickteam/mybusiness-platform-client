import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { businessId: "biz-1" } }),
}));

vi.mock("../../../../hooks/useLocaleDir", () => ({
  useLocaleDir: () => "rtl",
}));

vi.mock("../../../../api/metaAiCampaignApi", () => ({
  startAiCampaignSession: vi.fn().mockResolvedValue({
    sessionId: "sess-1",
    status: "COLLECTING",
    assistantMessage: "שאלה",
    question: {
      field: "promotedItem",
      type: "single_select",
      message: "שאלה",
      options: [],
    },
    missingFields: ["promotedItem"],
    progress: { confirmed: 0, required: 5 },
    messages: [],
  }),
  getAiCampaignSession: vi.fn().mockRejectedValue(new Error("missing")),
  answerAiCampaignSession: vi.fn(),
  sendAiCampaignMessage: vi.fn(),
  sessionStorageKey: (id: string) => `bizuply.meta-ai-campaign.session.${id}`,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "he", changeLanguage: vi.fn() },
  }),
}));

import MetaCampaignsMain from "./MetaCampaignsMain";
import MetaAiCampaignWizardPage from "./MetaAiCampaignWizardPage";

function renderCampaigns(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route
          path="/business/:businessId/dashboard/meta-campaigns"
          element={<MetaCampaignsMain />}
        >
          <Route index element={<div>index-should-redirect</div>} />
          <Route path="overview" element={<div>overview-page</div>} />
          <Route path="create" element={<div>manual-ads-manager</div>} />
          <Route path="create-ai" element={<MetaAiCampaignWizardPage />} />
          <Route path="settings" element={<div>settings-page</div>} />
          <Route path="edit/:campaignId" element={<div>edit-page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Meta Campaigns creation-mode routing", () => {
  it("sends the Meta Campaigns root to overview", async () => {
    renderCampaigns("/business/biz-1/dashboard/meta-campaigns");
    await waitFor(() => expect(screen.getByText("overview-page")).toBeTruthy());
    expect(screen.queryByText("manual-ads-manager")).toBeNull();
    expect(screen.queryByText("index-should-redirect")).toBeNull();
  });

  it("keeps direct navigation to /create on the Ads Manager page", () => {
    renderCampaigns("/business/biz-1/dashboard/meta-campaigns/create");
    expect(screen.getByText("manual-ads-manager")).toBeTruthy();
    expect(screen.queryByText("overview-page")).toBeNull();
  });

  it("keeps direct navigation to /create-ai on the AI wizard shell", async () => {
    renderCampaigns("/business/biz-1/dashboard/meta-campaigns/create-ai");
    expect(screen.getByTestId("meta-ai-campaign-wizard")).toBeTruthy();
    await waitFor(() =>
      expect(screen.queryByTestId("meta-ai-loading")).toBeNull()
    );
    expect(screen.queryByText("overview-page")).toBeNull();
    expect(screen.queryByText("manual-ads-manager")).toBeNull();
  });

  it("keeps settings and edit routes working", () => {
    const settings = renderCampaigns(
      "/business/biz-1/dashboard/meta-campaigns/settings"
    );
    expect(settings.getByText("settings-page")).toBeTruthy();
    settings.unmount();

    renderCampaigns("/business/biz-1/dashboard/meta-campaigns/edit/123");
    expect(screen.getByText("edit-page")).toBeTruthy();
  });
});
