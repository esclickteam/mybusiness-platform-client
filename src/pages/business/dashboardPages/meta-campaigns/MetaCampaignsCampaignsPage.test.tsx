import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";
import type { MetaCampaign } from "../../../../api/metaCampaignsApi";

const api = vi.hoisted(() => ({
  getMetaCampaignsOverview: vi.fn(),
  deleteLocalCampaignDraft: vi.fn(),
  duplicateLocalCampaignDraft: vi.fn(),
  setMetaCampaignStatus: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useOutletContext: () => ({ businessId: "biz-1" }) };
});

vi.mock("../../../../api/metaCampaignsApi", () => api);

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const value = key.split(".").reduce<unknown>((acc, segment) => {
        if (!acc || typeof acc !== "object") return undefined;
        return (acc as Record<string, unknown>)[segment];
      }, he);
      const text = typeof value === "string" ? value : key;
      return Object.entries(options || {}).reduce(
        (current, [name, replacement]) => current.replaceAll(`{{${name}}}`, String(replacement)),
        text
      );
    },
    i18n: { language: "he" },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

import MetaCampaignsCampaignsPage from "./MetaCampaignsCampaignsPage";

const draft: MetaCampaign = {
  id: "draft-1",
  name: "טיוטת חתונות",
  status: "DRAFT",
  effectiveStatus: "DRAFT",
  objective: "OUTCOME_LEADS",
  dailyBudget: 50,
  lifetimeBudget: 0,
  localOnly: true,
  publishRecordId: "draft-1",
  metaCampaignId: "",
  metrics: { spend: 0, leads: 0, clicks: 0, impressions: 0, ctr: 0, cpc: 0, costPerLead: 0, roas: 0 },
};

const live: MetaCampaign = {
  id: "120251822243990469",
  name: "קמפיין Evently360",
  status: "ACTIVE",
  configuredStatus: "ACTIVE",
  effectiveStatus: "ACTIVE",
  objective: "OUTCOME_LEADS",
  dailyBudget: 120,
  lifetimeBudget: 0,
  localOnly: false,
  metaCampaignId: "120251822243990469",
  metrics: { spend: 40, leads: 2, clicks: 8, impressions: 200, ctr: 1, cpc: 5, costPerLead: 20, roas: 0 },
};

function renderPage() {
  api.getMetaCampaignsOverview.mockResolvedValue({
    campaigns: [draft, live],
    connection: { selectedAdAccount: { currency: "ILS" } },
  });
  return render(
    <MemoryRouter initialEntries={["/business/biz-1/dashboard/meta-campaigns/campaigns"]}>
      <Routes>
        <Route path="/business/:businessId/dashboard/meta-campaigns/campaigns" element={<MetaCampaignsCampaignsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Meta campaign list delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("shows a trash button on desktop and mobile, then deletes only the local draft", async () => {
    let release: (value: { success: boolean }) => void = () => undefined;
    api.deleteLocalCampaignDraft.mockImplementation(
      () => new Promise((resolve) => {
        release = resolve;
      })
    );
    renderPage();

    expect(await screen.findByTestId("meta-campaign-count")).toHaveAttribute("data-count", "2");
    expect(screen.getAllByTestId("campaign-impressions-draft-1")[0]).toHaveTextContent("—");
    expect(screen.getAllByTestId("campaign-reach-draft-1")[0]).toHaveTextContent("—");
    expect(screen.getAllByTestId("campaign-impressions-120251822243990469")[0]).toHaveTextContent("200");
    const buttons = screen.getAllByTestId("meta-campaign-delete-draft-1");
    expect(buttons).toHaveLength(2);
    expect(screen.getAllByTestId("meta-campaign-delete-120251822243990469")).toHaveLength(2);
    buttons.forEach((button) => expect(button.querySelector("svg")).toBeTruthy());

    fireEvent.click(buttons[0]);
    expect(screen.getByTestId("meta-campaign-delete-name")).toHaveTextContent("טיוטת חתונות");
    expect(screen.getByTestId("meta-campaign-delete-message")).toHaveTextContent(
      "האם למחוק את הקמפיין? פעולה זו אינה ניתנת לביטול."
    );

    const confirm = screen.getByTestId("meta-campaign-delete-confirm");
    fireEvent.click(confirm);
    fireEvent.click(confirm);
    expect(api.deleteLocalCampaignDraft).toHaveBeenCalledTimes(1);
    expect(api.deleteLocalCampaignDraft).toHaveBeenCalledWith("biz-1", "draft-1");

    release({ success: true });
    await waitFor(() => expect(screen.getByTestId("meta-campaign-count")).toHaveAttribute("data-count", "1"));
    expect(screen.queryByText("טיוטת חתונות")).toBeNull();
    expect(screen.getAllByText("קמפיין Evently360").length).toBeGreaterThan(0);
  });

  it("keeps the campaign and shows a Hebrew error when deletion fails", async () => {
    api.deleteLocalCampaignDraft.mockRejectedValue({
      response: { data: { error: "Could not delete the draft" } },
    });
    renderPage();
    fireEvent.click((await screen.findAllByTestId("meta-campaign-delete-draft-1"))[0]);
    fireEvent.click(screen.getByTestId("meta-campaign-delete-confirm"));

    expect(await screen.findByTestId("meta-campaign-delete-error")).toHaveTextContent(
      "מחיקת הקמפיין נכשלה. הקמפיין נשאר ברשימה."
    );
    expect(screen.getByTestId("meta-campaign-count")).toHaveAttribute("data-count", "2");
    expect(screen.getAllByText("טיוטת חתונות").length).toBeGreaterThan(0);
  });

  it("does not delete or hide a campaign that already exists on Meta", async () => {
    renderPage();
    fireEvent.click((await screen.findAllByTestId("meta-campaign-delete-120251822243990469"))[0]);

    expect(screen.getByTestId("meta-campaign-delete-name")).toHaveTextContent("קמפיין Evently360");
    expect(screen.getByTestId("meta-campaign-delete-message")).toHaveTextContent(
      "האם למחוק את הקמפיין? פעולה זו אינה ניתנת לביטול."
    );
    expect(screen.getByTestId("meta-campaign-delete-blocked")).toHaveTextContent("קמפיין Evently360");
    expect(screen.queryByTestId("meta-campaign-delete-confirm")).toBeNull();
    expect(api.deleteLocalCampaignDraft).not.toHaveBeenCalled();
    expect(screen.getByTestId("meta-campaign-count")).toHaveAttribute("data-count", "2");
  });

  it("hides and restores campaign columns from the same menu as the other levels", async () => {
    renderPage();
    expect((await screen.findAllByTestId("campaign-impressions-120251822243990469")).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByTestId("meta-campaign-columns"));
    expect(screen.getByTestId("meta-column-menu")).toBeTruthy();
    fireEvent.click(screen.getByTestId("meta-column-preset-leads"));
    expect(screen.queryByTestId("campaign-impressions-120251822243990469")).toBeNull();
    expect(screen.getAllByText("לידים").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByTestId("meta-column-reset"));
    expect(screen.getAllByTestId("campaign-impressions-120251822243990469").length).toBeGreaterThan(0);
  });
});
