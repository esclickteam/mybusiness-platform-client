import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const apiGet = vi.fn();
vi.mock("@api", () => ({
  default: {
    get: (...args: unknown[]) => apiGet(...args),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, opts?: { defaultValue?: string; count?: number }) =>
        opts?.defaultValue || (opts?.count != null ? `${key}:${opts.count}` : key),
      i18n: { language: "he" },
    }),
  };
});

const fetchWorkspaceLeads = vi.fn();
const fetchWorkspaceSettings = vi.fn();
const fetchAgents = vi.fn();
const fetchViews = vi.fn();
const fetchFunnel = vi.fn();
const bulkUpdateLeads = vi.fn();
const patchLead = vi.fn();
const fetchDuplicates = vi.fn();
const mergeLeads = vi.fn();
const exportLeadsCsv = vi.fn();
const exportLeadsJson = vi.fn();
const importLeadRows = vi.fn();
const fetchTimeline = vi.fn();
const fetchDeals = vi.fn();

vi.mock("./crmWorkspaceApi", async () => {
  const actual = await vi.importActual<typeof import("./crmWorkspaceApi")>("./crmWorkspaceApi");
  return {
    ...actual,
    fetchWorkspaceLeads: (...args: unknown[]) => fetchWorkspaceLeads(...args),
    fetchWorkspaceSettings: (...args: unknown[]) => fetchWorkspaceSettings(...args),
    fetchAgents: (...args: unknown[]) => fetchAgents(...args),
    fetchViews: (...args: unknown[]) => fetchViews(...args),
    fetchFunnel: (...args: unknown[]) => fetchFunnel(...args),
    bulkUpdateLeads: (...args: unknown[]) => bulkUpdateLeads(...args),
    patchLead: (...args: unknown[]) => patchLead(...args),
    fetchDuplicates: (...args: unknown[]) => fetchDuplicates(...args),
    mergeLeads: (...args: unknown[]) => mergeLeads(...args),
    exportLeadsCsv: (...args: unknown[]) => exportLeadsCsv(...args),
    exportLeadsJson: (...args: unknown[]) => exportLeadsJson(...args),
    importLeadRows: (...args: unknown[]) => importLeadRows(...args),
    fetchTimeline: (...args: unknown[]) => fetchTimeline(...args),
    fetchDeals: (...args: unknown[]) => fetchDeals(...args),
  };
});

vi.mock("exceljs", () => {
  class Workbook {
    worksheets = [
      {
        getRow() {
          return { eachCell() {} };
        },
        eachRow() {},
      },
    ];
    addWorksheet() {
      return { addRow() {} };
    }
    xlsx = {
      writeBuffer: async () => new ArrayBuffer(8),
      load: async () => {},
    };
  }
  return { default: { Workbook } };
});

import CRMLeadsWorkspace from "./CRMLeadsWorkspace";

const sampleLead = {
  _id: "64f0000000000000000000aa",
  fullName: "Ada Lovelace",
  phone: "0501111111",
  email: "ada@example.com",
  status: "new",
  stageKey: "new",
  source: "meta_lead_ads",
  assignedToName: "",
  createdAt: "2026-01-10T10:00:00.000Z",
  updatedAt: "2026-01-10T10:00:00.000Z",
};

describe("CRMLeadsWorkspace isolated UI", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
    fetchWorkspaceLeads.mockResolvedValue({
      leads: [sampleLead],
      total: 1,
      hasMore: false,
      page: 1,
      limit: 50,
    });
    fetchWorkspaceSettings.mockResolvedValue({
      pipelineStages: [
        { key: "new", label: "חדש", order: 1, mapsToStatus: "new" },
        { key: "contacted", label: "נוצר קשר", order: 2, mapsToStatus: "contacted" },
      ],
      leadCustomFields: [],
    });
    fetchAgents.mockResolvedValue([{ _id: "u1", name: "Dana" }]);
    fetchViews.mockResolvedValue([]);
    fetchFunnel.mockResolvedValue({
      funnel: [
        { key: "new", label: "חדש", count: 1, amount: 0 },
        { key: "contacted", label: "נוצר קשר", count: 0, amount: 0 },
      ],
    });
    fetchTimeline.mockResolvedValue([
      { type: "created", at: sampleLead.createdAt, actor: "system", text: "הליד נוצר" },
    ]);
    fetchDeals.mockResolvedValue([]);
    apiGet.mockResolvedValue({ data: { lead: { ...sampleLead, details: [{ label: "שירות", value: "עיצוב" }], activities: [] } } });
    bulkUpdateLeads.mockResolvedValue({ success: true, updated: 1 });
    patchLead.mockResolvedValue({ success: true });
  });

  it("renders searchable sortable table and opens the lead card tabs", async () => {
    render(<CRMLeadsWorkspace businessId="biz-1" />);
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("crm.workspace.searchPlaceholder"), {
      target: { value: "Ada" },
    });
    await waitFor(() => {
      expect(fetchWorkspaceLeads).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Ada Lovelace"));
    expect(await screen.findByText("crm.workspace.tabs.overview")).toBeInTheDocument();
    fireEvent.click(screen.getByText("crm.workspace.tabs.form"));
    expect(await screen.findByText("עיצוב")).toBeInTheDocument();
    fireEvent.click(screen.getByText("crm.workspace.tabs.activity"));
    expect(screen.getByText("crm.workspace.logCall")).toBeInTheDocument();
  });

  it("requires confirmation before bulk archive", async () => {
    render(<CRMLeadsWorkspace businessId="biz-1" />);
    await screen.findByText("Ada Lovelace");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByText("crm.workspace.archive"));
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(bulkUpdateLeads).toHaveBeenCalledWith(
        expect.objectContaining({ confirm: true, action: "archive" })
      );
    });
  });

  it("switches between list, compact table and kanban", async () => {
    render(<CRMLeadsWorkspace businessId="biz-1" />);
    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: "crm.leads.boardView" }));
    expect(await screen.findByText(/חדש · 1/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "crm.workspace.compactView" }));
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "crm.leads.listView" }));
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
  });
});
