import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { language: "he" },
    }),
  };
});

const fetchReports = vi.fn();
const fetchFunnel = vi.fn();
vi.mock("./crmWorkspaceApi", async () => {
  const actual = await vi.importActual<typeof import("./crmWorkspaceApi")>("./crmWorkspaceApi");
  return {
    ...actual,
    fetchReports: (...args: unknown[]) => fetchReports(...args),
    fetchFunnel: (...args: unknown[]) => fetchFunnel(...args),
  };
});

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

import CRMReportsPage from "./CRMReportsPage";

describe("CRMReportsPage", () => {
  beforeEach(() => {
    fetchFunnel.mockResolvedValue({ funnel: [] });
    fetchReports.mockResolvedValue({
      metrics: {
        totals: {
          leads: 4,
          newLeads: 1,
          inProgress: 1,
          closed: 1,
          lost: 1,
          conversionRate: 25,
          dealSum: 100,
          revenue: 80,
          openTasks: 2,
          upcomingMeetings: 1,
        },
        series: [{ date: "2026-01-01", count: 2 }],
        byStatus: { new: 1 },
        bySource: { meta: 2 },
        dealsByMonth: [{ month: "2026-01", amount: 80 }],
        byAgent: [{ assignedToName: "Dana", leads: 2, converted: 1 }],
      },
    });
  });

  it("renders live metric totals from the reports API", async () => {
    render(<CRMReportsPage />);
    await waitFor(() => {
      expect(fetchReports).toHaveBeenCalled();
    });
    expect(await screen.findByText("4")).toBeInTheDocument();
    expect(screen.getByText("Dana: 2 / 1")).toBeInTheDocument();
  });
});
