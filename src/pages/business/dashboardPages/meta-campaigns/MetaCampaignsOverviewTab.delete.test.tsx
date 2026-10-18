import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";

const api = vi.hoisted(() => ({
  getMetaCampaignsOverview: vi.fn(),
  deleteLocalCampaignDraft: vi.fn(),
  selectMetaAdAccount: vi.fn(),
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

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Area: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
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

import MetaCampaignsOverviewTab from "./MetaCampaignsOverviewTab";

describe("Meta overview campaign delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the trash control on both layouts and does not remove a live Meta campaign", async () => {
    api.getMetaCampaignsOverview.mockResolvedValue({
      connection: {
        connected: true,
        isConnected: true,
        hasAccessToken: true,
        selectedAdAccount: { id: "act_1", accountId: "1", name: "Ads", currency: "ILS" },
        adAccounts: [],
      },
      kpis: { roas: 0, costPerLead: 0, leads: 0, spend: 0 },
      series: [],
      campaigns: [
        {
          id: "120251822243990469",
          name: "קמפיין Evently360",
          status: "PAUSED",
          configuredStatus: "PAUSED",
          effectiveStatus: "PAUSED",
          objective: "OUTCOME_LEADS",
          dailyBudget: 80,
          lifetimeBudget: 0,
          metrics: { spend: 0, leads: 0, clicks: 0, impressions: 0, ctr: 0, cpc: 0, costPerLead: 0, roas: 0 },
        },
      ],
      insights: [],
    });

    render(
      <MemoryRouter initialEntries={["/business/biz-1/dashboard/meta-campaigns/overview"]}>
        <Routes>
          <Route path="/business/:businessId/dashboard/meta-campaigns/overview" element={<MetaCampaignsOverviewTab />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("meta-campaign-count")).toHaveAttribute("data-count", "1");
    const buttons = screen.getAllByTestId("meta-campaign-delete-120251822243990469");
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]);
    expect(screen.getByTestId("meta-campaign-delete-message")).toHaveTextContent(
      "האם למחוק את הקמפיין? פעולה זו אינה ניתנת לביטול."
    );
    expect(screen.getByTestId("meta-campaign-delete-blocked")).toBeTruthy();
    expect(api.deleteLocalCampaignDraft).not.toHaveBeenCalled();
    expect(screen.getByTestId("meta-campaign-count")).toHaveAttribute("data-count", "1");
  });

  it("removes a local draft and updates the campaign count without a reload", async () => {
    api.deleteLocalCampaignDraft.mockResolvedValue({ success: true, publishId: "draft-1" });
    api.getMetaCampaignsOverview.mockResolvedValue({
      connection: {
        connected: true,
        isConnected: true,
        hasAccessToken: true,
        selectedAdAccount: { id: "act_1", accountId: "1", name: "Ads", currency: "ILS" },
        adAccounts: [],
      },
      kpis: { roas: 0, costPerLead: 0, leads: 0, spend: 0 },
      series: [],
      campaigns: [
        {
          id: "draft-1",
          name: "טיוטת חתונות",
          status: "DRAFT",
          effectiveStatus: "DRAFT",
          objective: "OUTCOME_LEADS",
          dailyBudget: 40,
          lifetimeBudget: 0,
          localOnly: true,
          publishRecordId: "draft-1",
          metaCampaignId: "",
          metrics: { spend: 0, leads: 0, clicks: 0, impressions: 0, ctr: 0, cpc: 0, costPerLead: 0, roas: 0 },
        },
        {
          id: "120251822243990469",
          name: "קמפיין Evently360",
          status: "PAUSED",
          configuredStatus: "PAUSED",
          effectiveStatus: "PAUSED",
          objective: "OUTCOME_LEADS",
          dailyBudget: 80,
          lifetimeBudget: 0,
          localOnly: false,
          metaCampaignId: "120251822243990469",
          metrics: { spend: 0, leads: 0, clicks: 0, impressions: 0, ctr: 0, cpc: 0, costPerLead: 0, roas: 0 },
        },
      ],
      insights: [],
    });

    render(
      <MemoryRouter initialEntries={["/business/biz-1/dashboard/meta-campaigns/overview"]}>
        <Routes>
          <Route path="/business/:businessId/dashboard/meta-campaigns/overview" element={<MetaCampaignsOverviewTab />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("meta-campaign-count")).toHaveAttribute("data-count", "2");
    const loadsBeforeDelete = api.getMetaCampaignsOverview.mock.calls.length;
    fireEvent.click(screen.getAllByTestId("meta-campaign-delete-draft-1")[0]);
    fireEvent.click(screen.getByTestId("meta-campaign-delete-confirm"));
    fireEvent.click(screen.getByTestId("meta-campaign-delete-confirm"));

    await waitFor(() => expect(screen.getByTestId("meta-campaign-count")).toHaveAttribute("data-count", "1"));
    expect(api.deleteLocalCampaignDraft).toHaveBeenCalledTimes(1);
    expect(api.getMetaCampaignsOverview.mock.calls.length).toBe(loadsBeforeDelete);
    expect(screen.queryByText("טיוטת חתונות")).toBeNull();
    expect(screen.getAllByText("קמפיין Evently360").length).toBeGreaterThan(0);
  });
});
