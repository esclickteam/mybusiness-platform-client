import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import he from "../../../../../i18n/locales/he.json";
import MetaAdsAnalytics from "./MetaAdsAnalytics";
import { getMetaAdsManagerSeries } from "../../../../../api/metaCampaignsApi";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const value = key.split(".").reduce<unknown>((acc, segment) => {
        if (!acc || typeof acc !== "object") return undefined;
        return (acc as Record<string, unknown>)[segment];
      }, he);
      return typeof value === "string" ? value : key;
    },
    i18n: { language: "he" },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ data, children }: { data: Array<Record<string, unknown>>; children: React.ReactNode }) => (
    <div data-testid="chart-dates">{data.map((row) => String(row.date)).join(",")}{children}</div>
  ),
  Line: ({ dataKey }: { dataKey: string }) => <span data-testid={`line-${dataKey}`} />,
  CartesianGrid: () => null,
  Legend: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

vi.mock("../../../../../api/metaCampaignsApi", () => ({
  getMetaAdsManagerSeries: vi.fn(),
  getMetaAdsManagerBreakdown: vi.fn(),
  getMetaAdsManagerCompare: vi.fn(),
}));

const point = (date: string, spend: number) => ({
  date,
  spend,
  leads: 1,
  impressions: 10,
  clicks: 2,
  reach: 8,
  ctr: 20,
  cpc: 1,
});

describe("Meta ads chart grain", () => {
  beforeEach(() => {
    vi.mocked(getMetaAdsManagerSeries).mockReset();
  });

  it("keeps a one-day campaign visible in the weekly view and does not refetch", () => {
    render(
      <MetaAdsAnalytics
        businessId="biz"
        currency="ILS"
        rangeQuery={{ since: "2026-10-19", until: "2026-10-19" }}
        series={[point("2026-10-19", 32.6)]}
        comparisonSeries={[point("2026-10-18", 4)]}
        comparisonRange={{ since: "2026-10-18", until: "2026-10-18" }}
        selectedIds={[]}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "שבועי" }));
    expect(screen.getByTestId("chart-dates")).toHaveTextContent("2026-10-19");
    expect(screen.getByTestId("line-compare:spend")).toBeTruthy();
    expect(getMetaAdsManagerSeries).not.toHaveBeenCalled();
  });

  it("loads weekly comparison from Meta as a separate series", async () => {
    vi.mocked(getMetaAdsManagerSeries).mockImplementation(async (_businessId, query) => {
      if (query.since === "2026-10-06") {
        return { success: true, grain: "week", series: [{ id: "1", points: [point("2026-10-06", 4)] }] };
      }
      return { success: true, grain: "week", series: [{ id: "1", points: [point("2026-10-13", 32)] }] };
    });
    render(
      <MetaAdsAnalytics
        businessId="biz"
        currency="ILS"
        rangeQuery={{ since: "2026-10-13", until: "2026-10-19" }}
        series={[point("2026-10-13", 10), point("2026-10-19", 22)]}
        comparisonSeries={[point("2026-10-06", 4), point("2026-10-12", 0)]}
        comparisonRange={{ since: "2026-10-06", until: "2026-10-12" }}
        selectedIds={[]}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "שבועי" }));
    await waitFor(() => expect(screen.getByTestId("chart-dates").textContent?.startsWith("2026-10-13")).toBe(true));
    expect(screen.getByTestId("chart-dates").textContent).not.toContain("2026-10-19");
    const calls = vi.mocked(getMetaAdsManagerSeries).mock.calls.map((call) => call[1]);
    expect(calls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ since: "2026-10-13", until: "2026-10-19", grain: "week" }),
        expect.objectContaining({ since: "2026-10-06", until: "2026-10-12", grain: "week" }),
      ])
    );
    expect(calls.find((query) => query.since === "2026-10-06")?.datePreset).toBeUndefined();
    expect(screen.getByTestId("line-compare:spend")).toBeTruthy();
    expect(screen.getByTestId("meta-chart-comparison")).toHaveTextContent("2026-10-06 – 2026-10-12");
  });
});
