import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";
import type { MetaCampaign } from "../../../../api/metaCampaignsApi";

const api = vi.hoisted(() => ({
  getMetaCampaignsOverview: vi.fn(),
  deleteLocalCampaignDraft: vi.fn(),
  deleteMetaObjects: vi.fn(),
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

function row(partial: Partial<MetaCampaign> & Pick<MetaCampaign, "id" | "name" | "status">): MetaCampaign {
  return {
    effectiveStatus: partial.status,
    objective: "OUTCOME_LEADS",
    dailyBudget: 50,
    lifetimeBudget: 0,
    metrics: {
      spend: 0,
      leads: 0,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      cpc: 0,
      costPerLead: 0,
      roas: 0,
    },
    ...partial,
  };
}

const connection = {
  connected: true,
  isConnected: true,
  hasAccessToken: true,
  selectedAdAccount: { id: "act_1", accountId: "1", name: "Ads", currency: "ILS" },
  adAccounts: [],
};

function renderOverview(range = "last_30") {
  return render(
    <MemoryRouter initialEntries={[`/business/biz-1/dashboard/meta-campaigns/overview?range=${range}`]}>
      <Routes>
        <Route path="/business/:businessId/dashboard/meta-campaigns/overview" element={<MetaCampaignsOverviewTab />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("campaign impressions and reach", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getMetaCampaignsOverview.mockResolvedValue({
      connection,
      kpis: { roas: 0, costPerLead: 0, leads: 0, spend: 336, impressions: 4715, reach: 2533 },
      series: [],
      insights: [],
      insightsSync: { ok: true, level: "campaign", syncedAt: "2026-10-18T08:00:00.000Z", error: null },
      campaigns: [
        row({
          id: "paused-1",
          metaCampaignId: "120252174521090469",
          name: "קמפיין מושהה",
          status: "PAUSED",
          configuredStatus: "PAUSED",
          effectiveStatus: "PAUSED",
          metrics: {
            spend: 40,
            leads: 1,
            results: 1,
            clicks: 8,
            impressions: 900,
            reach: 700,
            insightsAvailable: true,
            ctr: 0.8,
            cpc: 5,
            costPerLead: 40,
            roas: 0,
          },
        }),
        row({
          id: "active-1",
          metaCampaignId: "120252174521090470",
          name: "קמפיין פעיל",
          status: "ACTIVE",
          configuredStatus: "ACTIVE",
          effectiveStatus: "ACTIVE",
          metrics: {
            spend: 336.31,
            leads: 4,
            results: 4,
            clicks: 80,
            impressions: 4715,
            reach: 2533,
            insightsAvailable: true,
            ctr: 1.2,
            cpc: 4,
            costPerLead: 80,
            roas: 0,
          },
        }),
        row({
          id: "draft-1",
          name: "טיוטה",
          status: "DRAFT",
          localOnly: true,
          publishRecordId: "draft-1",
          metrics: {
            spend: 0,
            leads: 0,
            clicks: 0,
            impressions: 0,
            reach: 0,
            insightsAvailable: false,
            ctr: 0,
            cpc: 0,
            costPerLead: 0,
            roas: 0,
          },
        }),
      ],
    });
  });

  it("shows Meta impressions and reach, dashes for drafts, and reloads with the date range", async () => {
    renderOverview("last_30");
    expect(await screen.findByTestId("meta-campaign-count")).toHaveAttribute("data-count", "3");
    expect(screen.getAllByTestId("campaign-impressions-active-1")[0]).toHaveTextContent("4,715");
    expect(screen.getAllByTestId("campaign-reach-active-1")[0]).toHaveTextContent("2,533");
    expect(screen.getAllByTestId("campaign-impressions-paused-1")[0]).toHaveTextContent("900");
    expect(screen.getAllByTestId("campaign-reach-paused-1")[0]).toHaveTextContent("700");
    expect(screen.getAllByTestId("campaign-impressions-draft-1")[0]).toHaveTextContent("—");
    expect(screen.getAllByTestId("campaign-reach-draft-1")[0]).toHaveTextContent("—");
    expect(screen.getByTestId("meta-campaign-insights-synced")).toHaveTextContent("סונכרן לאחרונה");
    expect(screen.getByRole("columnheader", { name: /חשיפות/ })).toBeTruthy();
    expect(screen.queryByTestId("campaign-toggle-draft-1")).toBeNull();
    expect(screen.getAllByTestId("campaign-toggle-paused-1").length).toBeGreaterThan(0);
    expect(screen.getByRole("columnheader", { name: /תפוצה/ })).toBeTruthy();
    expect(api.getMetaCampaignsOverview).toHaveBeenCalledWith(
      "biz-1",
      expect.objectContaining({ datePreset: "last_30d", days: 30 })
    );

    fireEvent.click(screen.getByRole("button", { name: "סנכרון עכשיו" }));
    await waitFor(() => expect(api.getMetaCampaignsOverview).toHaveBeenCalledTimes(2));
  });

  it("shows QA drafts by default and persists hide-filter without deleting", async () => {
    window.localStorage.clear();
    api.getMetaCampaignsOverview.mockResolvedValue({
      connection,
      kpis: { roas: 0, costPerLead: 0, leads: 0, spend: 0, impressions: 0, reach: 0 },
      series: [],
      insights: [],
      insightsSync: { ok: true, level: "campaign", syncedAt: "2026-10-18T08:00:00.000Z", error: null },
      campaigns: [
        row({
          id: "qa-1",
          name: "Bizuply DT E2E PAUSED 2026-10-24T12-18-53-743Z",
          status: "DRAFT",
          localOnly: true,
        }),
        row({
          id: "live-1",
          metaCampaignId: "120252174521090469",
          name: "קמפיין פעיל",
          status: "ACTIVE",
          configuredStatus: "ACTIVE",
        }),
      ],
    });
    renderOverview();
    expect((await screen.findAllByTestId("campaign-row-qa-1")).length).toBeGreaterThan(0);
    const box = screen.getByTestId("meta-hide-qa-drafts") as HTMLInputElement;
    expect(box.checked).toBe(false);
    fireEvent.click(box);
    await waitFor(() => expect(screen.queryAllByTestId("campaign-row-qa-1")).toHaveLength(0));
    expect(screen.getAllByTestId("campaign-row-live-1").length).toBeGreaterThan(0);
    expect(window.localStorage.getItem("bizuply.meta.hideQaDrafts.biz-1")).toBe("1");
    expect(api.deleteLocalCampaignDraft).not.toHaveBeenCalled();
    expect(api.deleteMetaObjects).not.toHaveBeenCalled();
  });

  it("sorts the table by impressions", async () => {
    renderOverview();
    expect(await screen.findByTestId("meta-campaign-count")).toBeTruthy();
    fireEvent.click(screen.getByTestId("sort-impressions"));
    const table = document.querySelector("table");
    const order = [...(table?.querySelectorAll("tbody tr") || [])].map((row) => row.getAttribute("data-testid"));
    expect(order).toEqual(["campaign-row-active-1", "campaign-row-paused-1", "campaign-row-draft-1"]);
  });
});
